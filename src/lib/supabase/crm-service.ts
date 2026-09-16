import { createClient } from "./client";
import {
  Deal,
  Lead,
  LeadStatus,
  Customer,
  CRMTask,
  CRMNotification,
  PipelineStage,
  INITIAL_PIPELINE_STAGES,
  getStageTheme,
} from "@/data/dashboard-mock-data";
import { formatNotificationTime } from "@/lib/date-utils";

export interface UserProfile {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  role: string;
  status: "Available" | "Away" | "Do Not Disturb";
  plan: string;
}

// -------------------------------------------------------------
// USER PROFILE
// -------------------------------------------------------------

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    fullName: data.full_name || "Sales Lead",
    companyName: data.company_name || "Acme Global",
    email: data.email || "",
    role: data.role || "Head of Sales",
    status: (data.status as any) || "Available",
    plan: data.plan || "business",
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

export async function fetchPipelineStages(userId: string): Promise<PipelineStage[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pipeline_stages")
    .select("stage_key, title, position")
    .eq("user_id", userId)
    .order("position", { ascending: true });

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
// DEALS
// -------------------------------------------------------------

export async function fetchDeals(userId: string): Promise<Deal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((d) => {
    const val = Number(d.value) || 0;
    return {
      id: d.id,
      title: d.title || "Untitled Deal",
      company: d.company || "General Client",
      contact: d.contact || "Primary Contact",
      email: d.email || "",
      phone: d.phone || "",
      value: val,
      formattedValue: `$${val.toLocaleString()}`,
      stageId: d.stage_id || "stage-new",
      priority: d.priority || "medium",
      probability: d.probability ?? 50,
      tags: d.tags || [],
      notes: d.notes || "",
      daysInStage: d.days_in_stage || 0,
      lastActivity: d.last_activity || "Just now",
      assignee: {
        name: d.assignee_name || "You",
        avatar: d.assignee_avatar || "",
      },
    };
  });
}

export async function createDeal(userId: string, deal: Deal): Promise<Deal | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("deals")
    .insert({
      user_id: userId,
      title: deal.title,
      company: deal.company,
      contact: deal.contact,
      email: deal.email,
      phone: deal.phone,
      value: deal.value,
      stage_id: deal.stageId,
      priority: deal.priority,
      probability: deal.probability,
      tags: deal.tags,
      notes: deal.notes,
      days_in_stage: deal.daysInStage,
      last_activity: deal.lastActivity,
      assignee_name: deal.assignee?.name || "You",
      assignee_avatar: deal.assignee?.avatar || "",
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating deal:", error);
    return null;
  }

  const val = Number(data.value) || 0;
  return {
    id: data.id,
    title: data.title,
    company: data.company,
    contact: data.contact,
    email: data.email || "",
    phone: data.phone || "",
    value: val,
    formattedValue: `$${val.toLocaleString()}`,
    stageId: data.stage_id,
    priority: data.priority,
    probability: data.probability,
    tags: data.tags || [],
    notes: data.notes || "",
    daysInStage: data.days_in_stage || 0,
    lastActivity: data.last_activity || "Just now",
    assignee: {
      name: data.assignee_name || "You",
      avatar: data.assignee_avatar || "",
    },
  };
}

export async function updateDealStage(
  dealId: string,
  stageId: string,
  probability: number
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("deals")
    .update({
      stage_id: stageId,
      probability,
      last_activity: "Just now",
      updated_at: new Date().toISOString(),
    })
    .eq("id", dealId);

  if (error) console.error("Error updating deal stage:", error);
}

export async function deleteDeal(dealId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("deals").delete().eq("id", dealId);
  if (error) console.error("Error deleting deal:", error);
}

// -------------------------------------------------------------
// LEADS
// -------------------------------------------------------------

export async function fetchLeads(userId: string): Promise<Lead[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((l) => {
    const val = Number(l.estimated_value) || 0;
    return {
      id: l.id,
      name: l.name,
      company: l.company,
      email: l.email,
      phone: l.phone || "",
      title: l.title || "",
      score: l.score || 50,
      status: l.status as LeadStatus,
      source: l.source as any,
      estimatedValue: val,
      formattedValue: `$${val.toLocaleString()}`,
      createdDate: new Date(l.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      notes: l.notes || "",
      assignedTo: l.assigned_to || "You",
    };
  });
}

export async function createLead(userId: string, lead: Lead): Promise<Lead | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      user_id: userId,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      title: lead.title,
      score: lead.score,
      status: lead.status,
      source: lead.source,
      estimated_value: lead.estimatedValue,
      notes: lead.notes,
      assigned_to: lead.assignedTo,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating lead:", error);
    return null;
  }

  const val = Number(data.estimated_value) || 0;
  return {
    id: data.id,
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone || "",
    title: data.title || "",
    score: data.score,
    status: data.status as LeadStatus,
    source: data.source as any,
    estimatedValue: val,
    formattedValue: `$${val.toLocaleString()}`,
    createdDate: "Just now",
    notes: data.notes || "",
    assignedTo: data.assigned_to || "You",
  };
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) console.error("Error updating lead status:", error);
}

export async function deleteLead(leadId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("leads").delete().eq("id", leadId);
  if (error) console.error("Error deleting lead:", error);
}

export async function convertLeadToDeal(userId: string, lead: Lead): Promise<Deal | null> {
  const supabase = createClient();

  // Create new Deal
  const dealResult = await createDeal(userId, {
    id: "",
    title: `${lead.company} Contract Implementation`,
    company: lead.company,
    contact: lead.name,
    email: lead.email,
    phone: lead.phone,
    value: lead.estimatedValue,
    formattedValue: lead.formattedValue,
    stageId: "stage-qualified",
    priority: lead.score > 80 ? "urgent" : "high",
    probability: 60,
    tags: ["Inbound Lead", lead.source],
    notes: lead.notes,
    daysInStage: 0,
    lastActivity: "Just now",
    assignee: {
      name: lead.assignedTo || "You",
      avatar: "",
    },
  });

  // Delete converted lead
  if (dealResult) {
    await deleteLead(lead.id);
  }

  return dealResult;
}

// -------------------------------------------------------------
// CUSTOMERS
// -------------------------------------------------------------

export async function fetchCustomers(userId: string): Promise<Customer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((c) => {
    const ltvVal = Number(c.ltv) || 0;
    return {
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      phone: c.phone || "",
      ltv: ltvVal,
      formattedLtv: `$${ltvVal.toLocaleString()}`,
      activeDealsCount: c.active_deals_count || 1,
      healthScore: c.health_score || 90,
      healthStatus: c.health_status as any,
      tier: c.tier as any,
      renewalDate: c.renewal_date || "In 12 Months",
      lastTouch: c.last_touch || "Just now",
      location: c.location || "Global",
      industry: c.industry || "Technology & Services",
    };
  });
}

export async function createCustomer(userId: string, cust: Customer): Promise<Customer | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("customers")
    .insert({
      user_id: userId,
      name: cust.name,
      company: cust.company,
      email: cust.email,
      phone: cust.phone,
      ltv: cust.ltv,
      active_deals_count: cust.activeDealsCount,
      health_score: cust.healthScore,
      health_status: cust.healthStatus,
      tier: cust.tier,
      renewal_date: cust.renewalDate,
      last_touch: cust.lastTouch,
      location: cust.location,
      industry: cust.industry,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating customer:", error);
    return null;
  }

  const ltvVal = Number(data.ltv) || 0;
  return {
    id: data.id,
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone || "",
    ltv: ltvVal,
    formattedLtv: `$${ltvVal.toLocaleString()}`,
    activeDealsCount: data.active_deals_count,
    healthScore: data.health_score,
    healthStatus: data.health_status as any,
    tier: data.tier as any,
    renewalDate: data.renewal_date,
    lastTouch: data.last_touch,
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
// TASKS
// -------------------------------------------------------------

export async function fetchTasks(userId: string): Promise<CRMTask[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((t) => ({
    id: t.id,
    title: t.title,
    type: t.type as any,
    dueDate: t.due_date,
    dueCategory: t.due_category as any,
    priority: t.priority as any,
    completed: t.completed,
    relatedTo: t.related_to || "",
    relatedType: t.related_type as any,
  }));
}

export async function createTask(userId: string, task: CRMTask): Promise<CRMTask | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: task.title,
      type: task.type,
      due_date: task.dueDate,
      due_category: task.dueCategory,
      priority: task.priority,
      completed: task.completed,
      related_to: task.relatedTo,
      related_type: task.relatedType,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating task:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    type: data.type as any,
    dueDate: data.due_date,
    dueCategory: data.due_category as any,
    priority: data.priority as any,
    completed: data.completed,
    relatedTo: data.related_to || "",
    relatedType: data.related_type as any,
  };
}

export async function toggleTask(taskId: string, currentCompleted: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("tasks")
    .update({
      completed: !currentCompleted,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (error) console.error("Error toggling task:", error);
}

export async function deleteTask(taskId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) console.error("Error deleting task:", error);
}

// -------------------------------------------------------------
// NOTIFICATIONS
// -------------------------------------------------------------

export async function fetchNotifications(userId: string): Promise<CRMNotification[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    time: formatNotificationTime(n.created_at, n.time),
    createdAt: n.created_at,
    read: n.read,
    type: n.type as any,
  }));
}

export async function createNotification(
  userId: string,
  notification: Omit<CRMNotification, "id">
): Promise<CRMNotification | null> {
  const supabase = createClient();
  const createdAt = notification.createdAt || new Date().toISOString();
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title: notification.title,
      description: notification.description,
      time: notification.time || formatNotificationTime(createdAt),
      created_at: createdAt,
      read: notification.read ?? false,
      type: notification.type,
    })
    .select()
    .single();

  if (error || !data) {
    if (error) console.error("Error creating notification:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    time: formatNotificationTime(data.created_at, data.time),
    createdAt: data.created_at,
    read: data.read,
    type: data.type as any,
  };
}

export async function markNotificationRead(notifId: string) {
  // Guard against non-UUID IDs (such as mock items "notif-1" or temporary optimistic IDs)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(notifId);
  if (!isUuid) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notifId);

  if (error) console.error("Error marking notification read:", error);
}

export async function markAllNotificationsRead(userId: string) {
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) console.error("Error marking all notifications read:", error);
}
