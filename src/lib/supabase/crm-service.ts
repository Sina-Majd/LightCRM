import { createClient } from "./client";
import {
  Deal,
  Lead,
  LeadStatus,
  Customer,
  CRMTask,
  CRMNotification,
  PipelineStage,
  Invoice,
  Cheque,
  CRMActivity,
  INITIAL_PIPELINE_STAGES,
  INITIAL_DEALS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_CHEQUES,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_LEADS,
  getStageTheme,
} from "@/data/dashboard-mock-data";
import {
  formatToman,
  formatRelativeFa,
  RawInvoiceItem,
  calculateInvoiceTotals,
  ChequeStatus,
  CallResult,
} from "@/lib/fa";

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

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  // Attempt to resolve workspace_id from profiles or workspace_members
  let workspaceId = data.workspace_id;
  if (!workspaceId) {
    const { data: member } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", userId)
      .limit(1)
      .single();
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
    .eq("id", userId);

  if (error) console.error("Error updating status:", error);
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

  if (error || !data || data.length === 0) {
    return INITIAL_PIPELINE_STAGES;
  }

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

  if (error || !data) {
    return INITIAL_DEALS;
  }

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
      priority: d.priority || "medium",
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
  arg1?: string,
  arg2?: string | Partial<Deal>,
  arg3?: Partial<Deal>
): Promise<Deal | null> {
  const supabase = createClient();
  const workspaceId = typeof arg2 === "string" ? arg1 : undefined;
  const userId = (typeof arg2 === "string" ? arg2 : arg1) || "";
  const deal = (typeof arg2 === "string" ? arg3 : arg2) || {};

  const val = Number(deal.value) || 0;
  const insertPayload: Record<string, unknown> = {
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
  if (workspaceId) {
    insertPayload.workspace_id = workspaceId;
    insertPayload.created_by = userId;
  }

  const { data, error } = await supabase
    .from("deals")
    .insert(insertPayload)
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating deal:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    company: data.company,
    contact: data.contact,
    email: data.email,
    phone: data.phone,
    value: Number(data.value),
    formattedValue: formatToman(Number(data.value)),
    stageId: data.stage_id,
    priority: data.priority,
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
  const updatePayload: Record<string, unknown> = {
    stage_id: stageId,
    updated_at: new Date().toISOString(),
  };
  if (probability !== undefined) {
    updatePayload.probability = probability;
  }
  const { error } = await supabase
    .from("deals")
    .update(updatePayload)
    .eq("id", dealId);
  if (error) console.error("Error updating deal stage:", error);
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
    .eq("id", dealId);
  if (error) console.error("Error updating deal next action:", error);
}

export async function deleteDeal(dealId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("deals").delete().eq("id", dealId);
  if (error) console.error("Error deleting deal:", error);
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

  if (error || !data) {
    return INITIAL_CUSTOMERS;
  }

  return data.map((c) => {
    const ltvVal = Number(c.ltv) || 0;
    return {
      id: c.id,
      name: c.name || "مشتری بدون نام",
      company: c.company || "",
      email: c.email || "",
      phone: c.phone || "",
      customerType: c.customer_type || "company",
      nationalId: c.national_id || null,
      economicCode: c.economic_code || null,
      segment: c.segment || "customer",
      ltv: ltvVal,
      formattedLtv: formatToman(ltvVal),
      activeDealsCount: c.active_deals_count || 0,
      healthScore: c.health_score || 85,
      healthStatus: c.health_status || "good",
      tier: c.tier || "در حال رشد",
      renewalDate: c.renewal_date || "—",
      lastTouch: formatRelativeFa(c.updated_at || c.created_at),
      location: c.location || "ایران",
      industry: c.industry || "عمومی",
    };
  });
}

export async function createCustomer(
  arg1?: string,
  arg2?: string | Partial<Customer>,
  arg3?: Partial<Customer>
): Promise<Customer | null> {
  const supabase = createClient();
  const workspaceId = typeof arg2 === "string" ? arg1 : undefined;
  const userId = (typeof arg2 === "string" ? arg2 : arg1) || "";
  const customer = (typeof arg2 === "string" ? arg3 : arg2) || {};

  const payload: Record<string, unknown> = {
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
    health_score: customer.healthScore || 90,
    health_status: customer.healthStatus || "good",
    tier: customer.tier || "در حال رشد",
    location: customer.location || "ایران",
    industry: customer.industry || "عمومی",
  };
  if (workspaceId) {
    payload.workspace_id = workspaceId;
    payload.created_by = userId;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert(payload)
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating customer:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    customerType: data.customer_type,
    nationalId: data.national_id,
    economicCode: data.economic_code,
    segment: data.segment,
    ltv: Number(data.ltv),
    formattedLtv: formatToman(Number(data.ltv)),
    activeDealsCount: data.active_deals_count || 0,
    healthScore: data.health_score,
    healthStatus: data.health_status,
    tier: data.tier,
    renewalDate: data.renewal_date || "—",
    lastTouch: "لحظاتی پیش",
    location: data.location,
    industry: data.industry,
  };
}

export async function deleteCustomer(customerId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("customers").delete().eq("id", customerId);
  if (error) console.error("Error deleting customer:", error);
}

// -------------------------------------------------------------
// INVOICES & INVOICE ITEMS
// -------------------------------------------------------------

export async function fetchInvoices(workspaceId?: string): Promise<Invoice[]> {
  const supabase = createClient();
  let query = supabase.from("invoices").select(`
    *,
    customers:customer_id ( name ),
    items:invoice_items ( * )
  `);
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error || !data) {
    return INITIAL_INVOICES;
  }

  return data.map((inv) => {
    return {
      id: inv.id,
      workspaceId: inv.workspace_id,
      customerId: inv.customer_id,
      customerName: inv.customers?.name || "مشتری نامشخص",
      number: inv.number,
      type: inv.type,
      status: inv.status,
      issueDate: inv.issue_date,
      dueDate: inv.due_date,
      subtotal: Number(inv.subtotal) || 0,
      discount: Number(inv.discount) || 0,
      tax: Number(inv.tax) || 0,
      total: Number(inv.total) || 0,
      notes: inv.notes || "",
      items: (inv.items || []).map((it: Record<string, unknown>) => ({
        id: String(it.id),
        invoiceId: String(it.invoice_id),
        itemOrder: Number(it.item_order) || 0,
        description: String(it.description || ""),
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unit_price) || 0,
        discount: Number(it.discount) || 0,
        taxRate: Number(it.tax_rate) || 10,
        total: Number(it.total) || 0,
      })),
    };
  });
}

export async function createInvoice(
  workspaceId: string | undefined,
  userId: string,
  invoice: Partial<Invoice>,
  rawItems: RawInvoiceItem[]
): Promise<Invoice | null> {
  const supabase = createClient();
  const totals = calculateInvoiceTotals(rawItems);

  // Get max number
  const { data: numData } = await supabase
    .from("invoices")
    .select("number")
    .order("number", { ascending: false })
    .limit(1);

  const nextNumber = (numData?.[0]?.number || 1000) + 1;

  const invoicePayload: Record<string, unknown> = {
    customer_id: invoice.customerId || null,
    number: nextNumber,
    type: invoice.type || "invoice",
    status: invoice.status || "draft",
    issue_date: invoice.issueDate || new Date().toISOString().split("T")[0],
    due_date: invoice.dueDate || null,
    subtotal: totals.subtotal,
    discount: totals.discount,
    tax: totals.tax,
    total: totals.total,
    notes: invoice.notes || "",
  };
  if (workspaceId) {
    invoicePayload.workspace_id = workspaceId;
    invoicePayload.created_by = userId;
  }

  const { data: invRow, error: invError } = await supabase
    .from("invoices")
    .insert(invoicePayload)
    .select()
    .single();

  if (invError || !invRow) {
    console.error("Error creating invoice:", invError);
    return null;
  }

  // Insert items
  if (rawItems.length > 0) {
    const itemsPayload = rawItems.map((it, idx) => ({
      workspace_id: workspaceId || invRow.workspace_id,
      invoice_id: invRow.id,
      item_order: idx + 1,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unit_price,
      discount: it.discount || 0,
      tax_rate: it.tax_rate ?? 10,
      total: it.total || 0,
    }));
    await supabase.from("invoice_items").insert(itemsPayload);
  }

  return {
    id: invRow.id,
    workspaceId: invRow.workspace_id,
    customerId: invRow.customer_id,
    customerName: invoice.customerName,
    number: invRow.number,
    type: invRow.type,
    status: invRow.status,
    issueDate: invRow.issue_date,
    dueDate: invRow.due_date,
    subtotal: Number(invRow.subtotal),
    discount: Number(invRow.discount),
    tax: Number(invRow.tax),
    total: Number(invRow.total),
    notes: invRow.notes,
  };
}

// -------------------------------------------------------------
// CHEQUES & RECEIPTS
// -------------------------------------------------------------

export async function fetchCheques(workspaceId?: string): Promise<Cheque[]> {
  const supabase = createClient();
  let query = supabase.from("cheques").select(`
    *,
    customers:customer_id ( name )
  `);
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("due_date", { ascending: true });

  if (error || !data) {
    return INITIAL_CHEQUES;
  }

  return data.map((chq) => ({
    id: chq.id,
    workspaceId: chq.workspace_id,
    paymentId: chq.payment_id,
    customerId: chq.customer_id,
    customerName: chq.customers?.name || "مشتری نامشخص",
    sayadNumber: chq.sayad_number,
    bankName: chq.bank_name,
    branchName: chq.branch_name,
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
): Promise<Cheque | null> {
  const supabase = createClient();
  const payload: Record<string, unknown> = {
    customer_id: cheque.customerId || null,
    sayad_number: cheque.sayadNumber,
    bank_name: cheque.bankName,
    branch_name: cheque.branchName || "",
    account_owner: cheque.accountOwner,
    amount: cheque.amount || 0,
    due_date: cheque.dueDate,
    status: cheque.status || "in_hand",
  };
  if (workspaceId) {
    payload.workspace_id = workspaceId;
  }

  const { data, error } = await supabase.from("cheques").insert(payload).select().single();
  if (error || !data) {
    console.error("Error creating cheque:", error);
    return null;
  }

  return {
    id: data.id,
    workspaceId: data.workspace_id,
    customerId: data.customer_id,
    sayadNumber: data.sayad_number,
    bankName: data.bank_name,
    branchName: data.branch_name,
    accountOwner: data.account_owner,
    amount: Number(data.amount),
    dueDate: data.due_date,
    status: data.status,
  };
}

export async function updateChequeStatus(chequeId: string, status: ChequeStatus) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cheques")
    .update({ status, status_updated_at: new Date().toISOString() })
    .eq("id", chequeId);
  if (error) console.error("Error updating cheque status:", error);
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

  if (error || !data) {
    return INITIAL_ACTIVITIES;
  }

  return data.map((a) => ({
    id: a.id,
    workspaceId: a.workspace_id,
    subjectType: a.subject_type,
    subjectId: a.subject_id,
    kind: a.kind,
    body: a.body,
    callResult: a.call_result,
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
  const callLabels: Record<CallResult, string> = {
    connected: "صحبت شد / پاسخ داد",
    busy: "اشغال بود",
    no_answer: "پاسخ نداد",
    wrong_number: "شماره اشتباه",
    follow_up_scheduled: "تنظیم پیگیری مجدد",
  };

  const payload: Record<string, unknown> = {
    subject_type: subjectType,
    subject_id: subjectId,
    kind: "call",
    call_result: callResult,
    body: `نتیجه تماس: ${callLabels[callResult]}${note ? ` - ${note}` : ""}`,
    happened_at: new Date().toISOString(),
  };
  if (workspaceId) {
    payload.workspace_id = workspaceId;
    payload.created_by = userId;
  }

  await supabase.from("activities").insert(payload);
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

  if (error || !data) {
    return INITIAL_TASKS;
  }

  return data.map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type,
    dueDate: t.due_date,
    dueCategory: t.due_category,
    priority: t.priority,
    completed: t.completed,
    relatedTo: t.related_to || "",
    relatedType: t.related_type,
  }));
}

export async function createTask(
  arg1?: string,
  arg2?: string | Partial<CRMTask>,
  arg3?: Partial<CRMTask>
): Promise<CRMTask | null> {
  const supabase = createClient();
  const workspaceId = typeof arg2 === "string" ? arg1 : undefined;
  const userId = (typeof arg2 === "string" ? arg2 : arg1) || "";
  const task = (typeof arg2 === "string" ? arg3 : arg2) || {};

  const payload: Record<string, unknown> = {
    user_id: userId,
    title: task.title || "وظیفه جدید",
    type: task.type || "call",
    due_date: task.dueDate || new Date().toISOString().split("T")[0],
    due_category: task.dueCategory || "today",
    priority: task.priority || "medium",
    completed: false,
    related_to: task.relatedTo || "",
    related_type: task.relatedType || "deal",
  };
  if (workspaceId) {
    payload.workspace_id = workspaceId;
    payload.created_by = userId;
  }

  const { data, error } = await supabase.from("tasks").insert(payload).select().single();
  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    type: data.type,
    dueDate: data.due_date,
    dueCategory: data.due_category,
    priority: data.priority,
    completed: data.completed,
    relatedTo: data.related_to,
    relatedType: data.related_type,
  };
}

export async function toggleTask(taskId: string, completed: boolean) {
  const supabase = createClient();
  await supabase.from("tasks").update({ completed }).eq("id", taskId);
}

export async function deleteTask(taskId: string) {
  const supabase = createClient();
  await supabase.from("tasks").delete().eq("id", taskId);
}

export async function fetchNotifications(workspaceId?: string): Promise<CRMNotification[]> {
  const supabase = createClient();
  let query = supabase.from("notifications").select("*");
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error || !data) {
    return INITIAL_NOTIFICATIONS;
  }

  return data.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    time: formatRelativeFa(n.created_at),
    createdAt: n.created_at,
    read: n.read,
    type: n.type,
  }));
}

export async function createNotification(
  userId: string,
  notif: Partial<CRMNotification>
): Promise<CRMNotification | null> {
  const supabase = createClient();
  const payload: Record<string, unknown> = {
    user_id: userId,
    title: notif.title || "اعلان جدید",
    description: notif.description || "",
    time: "همین الان",
    read: false,
    type: notif.type || "system",
  };
  const { data, error } = await supabase.from("notifications").insert(payload).select().single();
  if (error || !data) return null;
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    time: formatRelativeFa(data.created_at),
    createdAt: data.created_at,
    read: data.read,
    type: data.type,
  };
}

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}

export async function markAllNotificationsRead(workspaceId?: string) {
  const supabase = createClient();
  let query = supabase.from("notifications").update({ read: true });
  if (workspaceId) {
    query = query.eq("workspace_id", workspaceId);
  }
  await query.neq("id", "00000000-0000-0000-0000-000000000000");
}


// -------------------------------------------------------------
// LEADS (COMPATIBILITY)
// -------------------------------------------------------------

export async function fetchLeads(_userId?: string): Promise<Lead[]> {
  return INITIAL_LEADS;
}

export async function createLead(_userId: string, _lead: Partial<Lead>): Promise<Lead | null> {
  return null;
}

export async function updateLeadStatus(_leadId: string, _status: LeadStatus) {}

export async function deleteLead(_leadId: string) {}

export async function convertLeadToDeal(_userId: string, _lead: Lead): Promise<Deal | null> {
  return null;
}
