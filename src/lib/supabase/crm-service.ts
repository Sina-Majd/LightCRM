import type { Database, Json } from "./database.types";
import { createClient } from "./client";
import { taskDueCategory } from "@/lib/crm/tasks";
import type {
  Deal,
  Customer,
  CRMTask,
  CRMNotification,
  PipelineStage,
  Invoice,
  Cheque,
  CRMActivity,
} from "@/lib/crm/types";
import { DEFAULT_PIPELINE_STAGES as INITIAL_PIPELINE_STAGES, getStageTheme } from "@/lib/crm/pipeline";
import {
  formatToman,
  formatRelativeFa,
  RawInvoiceItem,
  toLocalISODate,
  CALL_RESULT_MAP,
  ChequeStatus,
  CallResult,
} from "@/lib/fa";

type Tables = Database["public"]["Tables"];
type Insert<Name extends keyof Tables> = Tables[Name]["Insert"];
type Update<Name extends keyof Tables> = Tables[Name]["Update"];

function requireWorkspace(workspaceId: string | undefined): string {
  if (!workspaceId) throw new Error("A workspace is required to save CRM data.");
  return workspaceId;
}

function customerTier(tier: Customer["tier"] = "Growth"): "Enterprise" | "Growth" | "Startup" {
  if (tier === "سازمانی" || tier === "Enterprise") return "Enterprise";
  if (tier === "استارتاپ" || tier === "Startup") return "Startup";
  return "Growth";
}

export interface UserProfile {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  role: string;
  status: "Available" | "Away" | "Do Not Disturb";
  plan: string;
  workspaceId?: string;
}

// -------------------------------------------------------------
// USER PROFILE & WORKSPACE
// -------------------------------------------------------------

function assertSuccess(error: { message: string } | null): void {
  if (error) throw new Error(error.message, { cause: error });
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  assertSuccess(error);
  if (!data) return null;

  // Attempt to resolve workspace_id from profiles or workspace_members
  let workspaceId = data.workspace_id;
  if (!workspaceId) {
    const { data: member, error: membershipError } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    assertSuccess(membershipError);
    if (member?.workspace_id) {
      workspaceId = member.workspace_id;
    }
  }

  return {
    id: data.id,
    fullName: data.full_name || "مدیر فروش",
    companyName: data.company_name || "فضای کاری من",
    email: data.email || "",
    role: data.role || "مدیر فروش",
    status: (data.status as UserProfile["status"]) || "Available",
    plan: data.plan || "کسب‌وکار",
    workspaceId: workspaceId || undefined,
  };
}

export async function updateUserStatus(
  userId: string,
  status: "Available" | "Away" | "Do Not Disturb"
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", userId).select("id").single();

  assertSuccess(error);
}

// -------------------------------------------------------------
// PIPELINE STAGES
// -------------------------------------------------------------

export async function fetchPipelineStages(workspaceId?: string): Promise<PipelineStage[]> {
  const supabase = createClient();
  let query = supabase.from("pipeline_stages").select("stage_key, title, position");
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("position", { ascending: true });

  assertSuccess(error);
  if (!data?.length) return INITIAL_PIPELINE_STAGES;

  return data.map((s) => {
    const theme = getStageTheme(s.stage_key);
    return {
      id: s.stage_key,
      title: s.title,
      color: theme.color,
      accentBorder: theme.accentBorder,
      bgGradient: theme.bgGradient,
    };
  });
}

// -------------------------------------------------------------
// DEALS & NEXT ACTION
// -------------------------------------------------------------

export async function fetchDeals(workspaceId?: string): Promise<Deal[]> {
  const supabase = createClient();
  let query = supabase.from("deals").select("*");
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("created_at", { ascending: false });

  assertSuccess(error);
  if (!data) return [];

  return data.map((d) => {
    const val = Number(d.value) || 0;
    return {
      id: d.id,
      title: d.title || "معامله بدون نام",
      company: d.company || "مشتری عمومی",
      contact: d.contact || "مخاطب اصلی",
      email: d.email || "",
      phone: d.phone || "",
      value: val,
      formattedValue: formatToman(val),
      stageId: d.stage_id || "stage-new",
      priority: d.priority as Deal["priority"],
      probability: d.probability ?? 50,
      tags: d.tags || [],
      notes: d.notes || "",
      daysInStage: d.days_in_stage || 0,
      lastActivity: formatRelativeFa(d.updated_at || d.created_at),
      nextActionTitle: d.next_action_title || null,
      nextActionDue: d.next_action_due || null,
      assignee: {
        name: d.assignee_name || "شما",
        avatar: d.assignee_avatar || "",
      },
    };
  });
}

export async function createDeal(
  workspaceId: string | undefined,
  userId: string,
  deal: Partial<Deal>
): Promise<Deal> {
  const supabase = createClient();

  const val = Number(deal.value) || 0;
  const insertPayload: Insert<"deals"> = {
    workspace_id: requireWorkspace(workspaceId),
    created_by: userId,
    user_id: userId,
    title: deal.title || "معامله جدید",
    company: deal.company || "مشتری عمومی",
    contact: deal.contact || "مخاطب",
    email: deal.email || "",
    phone: deal.phone || "",
    value: val,
    stage_id: deal.stageId || "stage-new",
    priority: deal.priority || "medium",
    probability: deal.probability ?? 50,
    tags: deal.tags || [],
    notes: deal.notes || "",
    days_in_stage: 0,
    next_action_title: deal.nextActionTitle || null,
    next_action_due: deal.nextActionDue || null,
    assignee_name: deal.assignee?.name || "شما",
  };

  const { data, error } = await supabase
    .from("deals")
    .insert(insertPayload)
    .select()
    .single();

  assertSuccess(error);
  if (!data) throw new Error("No record returned after saving.");

  return {
    id: data.id,
    title: data.title,
    company: data.company,
    contact: data.contact,
    email: data.email || "",
    phone: data.phone || "",
    value: Number(data.value),
    formattedValue: formatToman(Number(data.value)),
    stageId: data.stage_id,
    priority: data.priority as Deal["priority"],
    probability: data.probability,
    tags: data.tags || [],
    notes: data.notes || "",
    daysInStage: data.days_in_stage,
    lastActivity: "لحظاتی پیش",
    nextActionTitle: data.next_action_title,
    nextActionDue: data.next_action_due,
    assignee: {
      name: data.assignee_name,
      avatar: data.assignee_avatar || "",
    },
  };
}

export async function updateDealStage(dealId: string, stageId: string, probability?: number) {
  const supabase = createClient();
  const updatePayload: Update<"deals"> = {
    stage_id: stageId,
    updated_at: new Date().toISOString(),
  };
  if (probability !== undefined) {
    updatePayload.probability = probability;
  }
  const { error } = await supabase
    .from("deals")
    .update(updatePayload)
    .eq("id", dealId).select("id").single();
  assertSuccess(error);
}


export async function updateDealNextAction(
  dealId: string,
  title: string | null,
  due: string | null
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("deals")
    .update({
      next_action_title: title,
      next_action_due: due,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dealId).select("id").single();
  assertSuccess(error);
}

export async function deleteDeal(dealId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("deals").delete().eq("id", dealId).select("id").single();
  assertSuccess(error);
}

export async function updateDealNotes(dealId: string, notes: string) {
  const { error } = await createClient().from("deals")
    .update({ notes }).eq("id", dealId).select("id").single();
  assertSuccess(error);
}

// -------------------------------------------------------------
// CUSTOMERS & LEADS
// -------------------------------------------------------------

export async function fetchCustomers(workspaceId?: string): Promise<Customer[]> {
  const supabase = createClient();
  let query = supabase.from("customers").select("*");
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("created_at", { ascending: false });

  assertSuccess(error);
  if (!data) return [];

  return data.map((c) => {
    const ltvVal = Number(c.ltv) || 0;
    return {
      id: c.id,
      name: c.name || "مشتری بدون نام",
      company: c.company || "",
      email: c.email || "",
      phone: c.phone || "",
      customerType: c.customer_type === "individual" ? "individual" : "company",
      nationalId: c.national_id || null,
      economicCode: c.economic_code || null,
      segment: c.segment === "lead" ? "lead" : "customer",
      ltv: ltvVal,
      formattedLtv: formatToman(ltvVal),
      activeDealsCount: c.active_deals_count || 0,
      healthScore: c.health_score ?? 85,
      healthStatus: c.health_status as Customer["healthStatus"],
      tier: c.tier as Customer["tier"],
      renewalDate: c.renewal_date || "—",
      lastTouch: formatRelativeFa(c.updated_at || c.created_at),
      location: c.location || "ایران",
      industry: c.industry || "عمومی",
    };
  });
}

export async function createCustomer(
  workspaceId: string | undefined,
  userId: string,
  customer: Partial<Customer>
): Promise<Customer> {
  const supabase = createClient();

  const payload: Insert<"customers"> = {
    workspace_id: requireWorkspace(workspaceId),
    created_by: userId,
    user_id: userId,
    name: customer.name || "مشتری جدید",
    company: customer.company || "",
    email: customer.email || "",
    phone: customer.phone || "",
    customer_type: customer.customerType || "company",
    national_id: customer.nationalId || null,
    economic_code: customer.economicCode || null,
    segment: customer.segment || "customer",
    ltv: customer.ltv || 0,
    health_score: customer.healthScore ?? 90,
    health_status: customer.healthStatus || "good",
    tier: customerTier(customer.tier),
    location: customer.location || "ایران",
    industry: customer.industry || "عمومی",
  };

  const { data, error } = await supabase
    .from("customers")
    .insert(payload)
    .select()
    .single();

  assertSuccess(error);
  if (!data) throw new Error("No record returned after saving.");

  return {
    id: data.id,
    name: data.name,
    company: data.company,
    email: data.email || "",
    phone: data.phone || "",
    customerType: data.customer_type === "individual" ? "individual" : "company",
    nationalId: data.national_id,
    economicCode: data.economic_code,
    segment: data.segment === "lead" ? "lead" : "customer",
    ltv: Number(data.ltv),
    formattedLtv: formatToman(Number(data.ltv)),
    activeDealsCount: data.active_deals_count || 0,
    healthScore: data.health_score,
    healthStatus: data.health_status as Customer["healthStatus"],
    tier: data.tier as Customer["tier"],
    renewalDate: data.renewal_date || "—",
    lastTouch: "لحظاتی پیش",
    location: data.location,
    industry: data.industry,
  };
}

export async function deleteCustomer(customerId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("customers").delete().eq("id", customerId).select("id").single();
  assertSuccess(error);
}

// -------------------------------------------------------------
// INVOICES & INVOICE ITEMS
// -------------------------------------------------------------

type InvoiceRow = Tables["invoices"]["Row"] & {
  customers?: { name: string } | null;
  items?: Tables["invoice_items"]["Row"][];
};

function invoiceRowFromJson(data: Json | null): InvoiceRow {
  if (!data || typeof data !== "object" || Array.isArray(data) || typeof data.id !== "string" ||
      !Array.isArray(data.items) || !Number.isFinite(Number(data.number))) {
    throw new Error("No complete invoice returned after saving.");
  }
  return data as unknown as InvoiceRow;
}

function invoiceFromRow(row: InvoiceRow): Invoice {
  return {
    id: row.id, workspaceId: row.workspace_id, customerId: row.customer_id,
    customerName: row.customer_name || row.customers?.name || "مشتری نامشخص", number: Number(row.number),
    type: row.type as Invoice["type"], status: row.status as Invoice["status"], issueDate: row.issue_date, dueDate: row.due_date,
    subtotal: Number(row.subtotal) || 0, discount: Number(row.discount) || 0,
    tax: Number(row.tax) || 0, total: Number(row.total) || 0, notes: row.notes || "",
    items: [...(row.items ?? [])].sort((a, b) => Number(a.item_order) - Number(b.item_order)).map((item) => ({
      id: item.id, workspaceId: item.workspace_id, invoiceId: item.invoice_id,
      itemOrder: Number(item.item_order), description: item.description,
      quantity: Number(item.quantity ?? 1), unitPrice: Number(item.unit_price) || 0,
      discount: Number(item.discount) || 0, taxRate: Number(item.tax_rate ?? 10), total: Number(item.total) || 0,
    })),
  };
}

export async function fetchInvoices(workspaceId?: string): Promise<Invoice[]> {
  const supabase = createClient();
  let query = supabase.from("invoices").select(`
    *,
    customers ( name ),
    items:invoice_items ( * )
  `);
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("created_at", { ascending: false });

  assertSuccess(error);
  if (!data) return [];

  return data.map(invoiceFromRow);
}

export async function createInvoice(
  workspaceId: string | undefined,
  invoice: Partial<Invoice>,
  rawItems: RawInvoiceItem[]
): Promise<Invoice> {
  const supabase = createClient();
  if (!rawItems.length) throw new Error("An invoice requires at least one item.");
  const items = rawItems.map((item) => {
    const taxRate = item.tax_rate ?? 10;
    const discount = item.discount ?? 0;
    if (!item.description.trim() || !Number.isFinite(item.quantity) || item.quantity <= 0 ||
        !Number.isFinite(item.unit_price) || item.unit_price < 0 ||
        !Number.isFinite(discount) || discount < 0 ||
        !Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
      throw new Error("Invoice item values are invalid.");
    }
    return {
      ...item,
      description: item.description.trim(),
      discount: Math.min(discount, item.quantity * item.unit_price),
      tax_rate: taxRate,
    };
  });
  const { data, error } = await supabase.rpc("create_invoice_with_items", {
    workspace: requireWorkspace(workspaceId),
    header: {
      customer_id: invoice.customerId || null, type: invoice.type || "invoice",
      status: invoice.status || "draft", issue_date: invoice.issueDate || toLocalISODate(new Date()),
      due_date: invoice.dueDate || null, notes: invoice.notes || "",
    },
    lines: items,
  });
  assertSuccess(error);
  return invoiceFromRow(invoiceRowFromJson(data));
}

// -------------------------------------------------------------
// CHEQUES & RECEIPTS
// -------------------------------------------------------------

export async function fetchCheques(workspaceId?: string): Promise<Cheque[]> {
  const supabase = createClient();
  let query = supabase.from("cheques").select(`
    *,
    customers ( name )
  `);
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("due_date", { ascending: true });

  assertSuccess(error);
  if (!data) return [];

  return data.map((chq) => ({
    id: chq.id,
    workspaceId: chq.workspace_id,
    paymentId: chq.payment_id,
    customerId: chq.customer_id,
    customerName: chq.customers?.name || "مشتری نامشخص",
    sayadNumber: chq.sayad_number,
    bankName: chq.bank_name,
    branchName: chq.branch_name || "",
    accountOwner: chq.account_owner,
    amount: Number(chq.amount) || 0,
    dueDate: chq.due_date,
    status: chq.status as ChequeStatus,
    statusUpdatedAt: chq.status_updated_at,
  }));
}

export async function createCheque(
  workspaceId: string | undefined,
  cheque: Partial<Cheque>
): Promise<Cheque> {
  const supabase = createClient();
  const payload: Insert<"cheques"> = {
    workspace_id: requireWorkspace(workspaceId),
    customer_id: cheque.customerId || null,
    sayad_number: cheque.sayadNumber || "",
    bank_name: cheque.bankName || "",
    branch_name: cheque.branchName || "",
    account_owner: cheque.accountOwner || "",
    amount: cheque.amount || 0,
    due_date: cheque.dueDate || toLocalISODate(new Date()),
    status: cheque.status || "in_hand",
  };

  const { data, error } = await supabase.from("cheques").insert(payload).select().single();
  assertSuccess(error);
  if (!data) throw new Error("No record returned after saving.");

  return {
    id: data.id,
    workspaceId: data.workspace_id,
    customerId: data.customer_id,
    sayadNumber: data.sayad_number,
    bankName: data.bank_name,
    branchName: data.branch_name || "",
    accountOwner: data.account_owner,
    amount: Number(data.amount),
    dueDate: data.due_date,
    status: data.status as ChequeStatus,
  };
}

export async function updateChequeStatus(chequeId: string, status: ChequeStatus) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cheques")
    .update({ status, status_updated_at: new Date().toISOString() })
    .eq("id", chequeId).select("id").single();
  assertSuccess(error);
}

// -------------------------------------------------------------
// ACTIVITIES & CALL LOGS
// -------------------------------------------------------------

export async function fetchActivities(workspaceId?: string, limit = 20): Promise<CRMActivity[]> {
  const supabase = createClient();
  let query = supabase.from("activities").select("*");
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query
    .order("happened_at", { ascending: false })
    .limit(limit);

  assertSuccess(error);
  if (!data) return [];

  return data.map((a) => ({
    id: a.id,
    workspaceId: a.workspace_id,
    subjectType: a.subject_type as CRMActivity["subjectType"],
    subjectId: a.subject_id,
    kind: a.kind as CRMActivity["kind"],
    body: a.body,
    callResult: a.call_result as CallResult | null,
    happenedAt: a.happened_at,
    createdBy: a.created_by || "شما",
  }));
}

export async function logQuickCall(
  workspaceId: string | undefined,
  userId: string,
  subjectType: "deal" | "customer" | "lead",
  subjectId: string,
  callResult: CallResult,
  note = ""
) {
  const supabase = createClient();

  const payload: Insert<"activities"> = {
    workspace_id: requireWorkspace(workspaceId),
    created_by: userId,
    subject_type: subjectType,
    subject_id: subjectId,
    kind: "call",
    call_result: callResult,
    body: `نتیجه تماس: ${CALL_RESULT_MAP[callResult].label}${note ? ` - ${note}` : ""}`,
    happened_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("activities").insert(payload);
  assertSuccess(error);
}

// -------------------------------------------------------------
// TASKS & NOTIFICATIONS
// -------------------------------------------------------------

export async function fetchTasks(workspaceId?: string): Promise<CRMTask[]> {
  const supabase = createClient();
  let query = supabase.from("tasks").select("*");
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("due_date", { ascending: true });

  assertSuccess(error);
  if (!data) return [];

  return data.map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type as CRMTask["type"],
    dueDate: t.due_date,
    dueCategory: taskDueCategory(t.due_date),
    priority: t.priority as CRMTask["priority"],
    completed: t.completed,
    relatedTo: t.related_to || "",
    relatedType: t.related_type as CRMTask["relatedType"],
  }));
}

export async function createTask(
  workspaceId: string | undefined,
  userId: string,
  task: Partial<CRMTask>
): Promise<CRMTask> {
  const supabase = createClient();

  const payload: Insert<"tasks"> = {
    workspace_id: requireWorkspace(workspaceId),
    created_by: userId,
    user_id: userId,
    title: task.title || "وظیفه جدید",
    type: task.type || "call",
    due_date: task.dueDate || toLocalISODate(new Date()),
    due_category: task.dueCategory || "today",
    priority: task.priority || "medium",
    completed: false,
    related_to: task.relatedTo || "",
    related_type: task.relatedType || "deal",
  };

  const { data, error } = await supabase.from("tasks").insert(payload).select().single();
  assertSuccess(error);
  if (!data) throw new Error("No record returned after saving.");

  return {
    id: data.id,
    title: data.title,
    type: data.type as CRMTask["type"],
    dueDate: data.due_date,
    dueCategory: taskDueCategory(data.due_date),
    priority: data.priority as Deal["priority"],
    completed: data.completed,
    relatedTo: data.related_to,
    relatedType: data.related_type as CRMTask["relatedType"],
  };
}

export async function toggleTask(taskId: string, completed: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", taskId).select("id").single();
  assertSuccess(error);
}

export async function updateTaskDueDate(taskId: string, dueDate: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks")
    .update({ due_date: dueDate, due_category: taskDueCategory(dueDate) })
    .eq("id", taskId).select("id").single();
  assertSuccess(error);
}

export async function deleteTask(taskId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId).select("id").single();
  assertSuccess(error);
}

export async function fetchNotifications(workspaceId?: string): Promise<CRMNotification[]> {
  const supabase = createClient();
  let query = supabase.from("notifications").select("*");
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("created_at", { ascending: false });

  assertSuccess(error);
  if (!data) return [];

  return data.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    time: formatRelativeFa(n.created_at),
    createdAt: n.created_at,
    read: n.read,
    type: n.type as CRMNotification["type"],
  }));
}

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id).select("id").single();
  assertSuccess(error);
}

export async function markAllNotificationsRead(workspaceId?: string) {
  const supabase = createClient();
  let query = supabase.from("notifications").update({ read: true });
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { error } = await query.eq("read", false);
  assertSuccess(error);
}
