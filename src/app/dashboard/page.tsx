"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DashboardShell,
  DashboardTab,
} from "@/components/dashboard/dashboard-shell";
import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { LeadsView } from "@/components/dashboard/leads-view";
import { CustomersView } from "@/components/dashboard/customers-view";
import { TasksView } from "@/components/dashboard/tasks-view";
import { AnalyticsView } from "@/components/dashboard/analytics-view";
import { DealDetailSheet } from "@/components/dashboard/deal-detail-sheet";
import {
  CreateRecordDialog,
  RecordType,
} from "@/components/dashboard/create-record-dialog";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { CommandMenu } from "@/components/command-menu";
import {
  INITIAL_PIPELINE_STAGES,
  INITIAL_DEALS,
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  Deal,
  Lead,
  LeadStatus,
  Customer,
  CRMTask,
  CRMNotification,
  PipelineStage,
} from "@/data/dashboard-mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  UserProfile,
  fetchUserProfile,
  fetchPipelineStages,
  fetchDeals,
  createDeal,
  updateDealStage,
  deleteDeal,
  fetchLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
  convertLeadToDeal,
  fetchCustomers,
  createCustomer,
  deleteCustomer,
  fetchTasks,
  createTask,
  toggleTask,
  deleteTask,
  fetchNotifications,
  createNotification,
  markNotificationRead,
} from "@/lib/supabase/crm-service";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

// Helper to guarantee unique IDs in arrays across optimistic and realtime updates
function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (item && item.id && !seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

// Helpers to maintain custom DnD card ordering across page reloads and Supabase syncs
function saveDealOrder(dealsList: Deal[]) {
  if (typeof window === "undefined" || !dealsList) return;
  try {
    localStorage.setItem(
      "lightcrm_deals_order",
      JSON.stringify(dealsList.map((d) => d.id))
    );
  } catch {
    // ignore storage quota errors
  }
}

function orderDealsBySavedOrder(dealsList: Deal[]): Deal[] {
  if (typeof window === "undefined" || !dealsList) return dealsList;
  try {
    const raw = localStorage.getItem("lightcrm_deals_order");
    if (!raw) return dealsList;
    const orderList: string[] = JSON.parse(raw);
    const orderMap = new Map(orderList.map((id, index) => [id, index]));

    return [...dealsList].sort((a, b) => {
      const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999999;
      const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999999;
      return idxA - idxB;
    });
  } catch {
    return dealsList;
  }
}

function mergeDealsPreservingOrder(prevDeals: Deal[], freshDeals: Deal[]): Deal[] {
  if (!prevDeals || prevDeals.length === 0) return freshDeals;

  const freshMap = new Map(freshDeals.map((d) => [d.id, d]));
  const freshIds = new Set(freshDeals.map((d) => d.id));

  // 1. Keep existing deals in their current relative order, updating data from freshDeals
  const updatedExisting: Deal[] = [];
  for (const prev of prevDeals) {
    if (freshIds.has(prev.id)) {
      const fresh = freshMap.get(prev.id)!;
      updatedExisting.push({
        ...prev,
        ...fresh,
        stageId: fresh.stageId || prev.stageId,
      });
      freshMap.delete(prev.id);
    }
  }

  // 2. Any brand new deals in freshDeals that were not in prevDeals:
  const brandNew = Array.from(freshMap.values());
  const result = [...updatedExisting, ...brandNew];
  saveDealOrder(result);
  return result;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("pipeline");
  const [searchQuery, setSearchQuery] = useState("");

  // Supabase User & Profile
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Core CRM Reactive State with resilient defaults so board is never empty
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [tasks, setTasks] = useState<CRMTask[]>(INITIAL_TASKS);
  const [notifications, setNotifications] = useState<CRMNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals and Drawers
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateRecordOpen, setIsCreateRecordOpen] = useState(false);
  const [createRecordType, setCreateRecordType] = useState<RecordType>("deal");
  const [createRecordDefaultStage, setCreateRecordDefaultStage] = useState<
    string | undefined
  >(undefined);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // Initial Data Load
  useEffect(() => {
    let isMounted = true;

    async function loadWorkspaceData() {
      try {
        const supabase = createClient();
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          router.push("/login");
          return;
        }

        if (!isMounted) return;
        setUser(currentUser);

        // Fetch data in parallel
        const [prof, stg, dl, ld, cs, tk, nt] = await Promise.all([
          fetchUserProfile(currentUser.id),
          fetchPipelineStages(currentUser.id),
          fetchDeals(currentUser.id),
          fetchLeads(currentUser.id),
          fetchCustomers(currentUser.id),
          fetchTasks(currentUser.id),
          fetchNotifications(currentUser.id),
        ]);

        if (!isMounted) return;

        setUserProfile(prof);
        if (stg && stg.length > 0) {
          setStages(dedupeById(stg));
        } else {
          setStages(INITIAL_PIPELINE_STAGES);
        }

        if (dl && dl.length > 0) {
          const ordered = dedupeById(orderDealsBySavedOrder(dl));
          setDeals(ordered);
        } else {
          setDeals(orderDealsBySavedOrder(INITIAL_DEALS));
        }

        if (ld && ld.length > 0) {
          setLeads(dedupeById(ld));
        } else {
          setLeads(INITIAL_LEADS);
        }

        if (cs && cs.length > 0) {
          setCustomers(dedupeById(cs));
        } else {
          setCustomers(INITIAL_CUSTOMERS);
        }

        if (tk && tk.length > 0) {
          setTasks(dedupeById(tk));
        } else {
          setTasks(INITIAL_TASKS);
        }

        if (nt && nt.length > 0) {
          setNotifications(dedupeById(nt));
        } else {
          setNotifications(INITIAL_NOTIFICATIONS);
        }

        setIsLoadingData(false);
      } catch (err) {
        console.error("Failed to load CRM data:", err);
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadWorkspaceData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Supabase Real-time Listener
  useEffect(() => {
    if (!user?.id) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`crm-sync-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deals",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const freshDeals = await fetchDeals(user.id);
          if (freshDeals && freshDeals.length > 0) {
            setDeals((prev) => dedupeById(mergeDealsPreservingOrder(prev, freshDeals)));
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const freshLeads = await fetchLeads(user.id);
          setLeads((prev) => dedupeById(freshLeads));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "customers",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const freshCustomers = await fetchCustomers(user.id);
          setCustomers((prev) => dedupeById(freshCustomers));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const freshTasks = await fetchTasks(user.id);
          setTasks((prev) => dedupeById(freshTasks));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const freshNotifs = await fetchNotifications(user.id);
          setNotifications((prev) => dedupeById(freshNotifs));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Open Create Record Modal with selected type and stage
  const handleOpenCreateRecord = (
    type: RecordType = "deal",
    stageId?: string
  ) => {
    setCreateRecordType(type);
    setCreateRecordDefaultStage(stageId);
    setIsCreateRecordOpen(true);
  };

  const handleSelectDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
  };

  // Create Opportunity / Deal Handler
  const handleCreateDeal = async (newDeal: Deal) => {
    if (!user?.id) return;

    // Optimistic update
    setDeals((prev) => dedupeById([newDeal, ...prev]));

    toast.success("Opportunity Created", {
      description: `${newDeal.title} (${newDeal.formattedValue}) added to pipeline.`,
    });

    const created = await createDeal(user.id, newDeal);
    if (created) {
      setDeals((prev) => {
        const hasExisting = prev.some((d) => d.id === created.id || d.id === newDeal.id);
        const mapped = prev.map((d) => (d.id === newDeal.id ? created : d));
        return dedupeById(hasExisting ? mapped : [created, ...mapped]);
      });
    }

    const notif = await createNotification(user.id, {
      title: "New opportunity created",
      description: `${newDeal.title} (${newDeal.formattedValue}) was added to pipeline.`,
      time: "Just now",
      read: false,
      type: "deal",
    });

    if (notif) {
      setNotifications((prev) => dedupeById([notif, ...prev]));
    }
  };

  // Create Lead Handler
  const handleCreateLead = async (newLead: Lead) => {
    if (!user?.id) return;

    setLeads((prev) => dedupeById([newLead, ...prev]));

    toast.success("Lead Registered", {
      description: `${newLead.name} (${newLead.company}) added to leads directory.`,
    });

    const created = await createLead(user.id, newLead);
    if (created) {
      setLeads((prev) => {
        const hasExisting = prev.some((l) => l.id === created.id || l.id === newLead.id);
        const mapped = prev.map((l) => (l.id === newLead.id ? created : l));
        return dedupeById(hasExisting ? mapped : [created, ...mapped]);
      });
    }

    const notif = await createNotification(user.id, {
      title: "New lead registered",
      description: `${newLead.name} (${newLead.company}) scored ${newLead.score}/100.`,
      time: "Just now",
      read: false,
      type: "lead",
    });

    if (notif) {
      setNotifications((prev) => dedupeById([notif, ...prev]));
    }
  };

  // Create Customer Handler
  const handleCreateCustomer = async (newCustomer: Customer) => {
    if (!user?.id) return;

    setCustomers((prev) => dedupeById([newCustomer, ...prev]));

    toast.success("Customer Added", {
      description: `${newCustomer.company} added to client directory.`,
    });

    const created = await createCustomer(user.id, newCustomer);
    if (created) {
      setCustomers((prev) => {
        const hasExisting = prev.some((c) => c.id === created.id || c.id === newCustomer.id);
        const mapped = prev.map((c) => (c.id === newCustomer.id ? created : c));
        return dedupeById(hasExisting ? mapped : [created, ...mapped]);
      });
    }

    const notif = await createNotification(user.id, {
      title: "New customer added",
      description: `${newCustomer.company} added with ${newCustomer.formattedLtv} initial LTV.`,
      time: "Just now",
      read: false,
      type: "payment",
    });

    if (notif) {
      setNotifications((prev) => dedupeById([notif, ...prev]));
    }
  };

  // Handle Drag & Drop across pipeline columns
  const handleDealsChange = async (updatedDeals: Deal[]) => {
    const prevDeals = deals;
    saveDealOrder(updatedDeals);
    setDeals(dedupeById(updatedDeals));

    // Identify which deal changed stage
    for (const nd of updatedDeals) {
      const old = prevDeals.find((d) => d.id === nd.id);
      if (old && (old.stageId !== nd.stageId || old.probability !== nd.probability)) {
        await updateDealStage(nd.id, nd.stageId, nd.probability);
      }
    }
  };

  // Handle Stage Change from Deal Detail Drawer
  const handleStageChangeFromSheet = async (
    dealId: string,
    newStageId: string
  ) => {
    const currentDeal = deals.find((d) => d.id === dealId) || selectedDeal;
    if (currentDeal && currentDeal.stageId === newStageId) {
      return;
    }

    const prob =
      newStageId === "stage-won"
        ? 100
        : newStageId === "stage-negotiation"
        ? 85
        : newStageId === "stage-proposal"
        ? 70
        : newStageId === "stage-qualified"
        ? 50
        : 30;

    setDeals((prev) =>
      dedupeById(
        prev.map((d) =>
          d.id === dealId
            ? {
                ...d,
                stageId: newStageId,
                probability: prob,
                lastActivity: "Just now",
              }
            : d
        )
      )
    );

    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal((prev) =>
        prev
          ? {
              ...prev,
              stageId: newStageId,
              probability: prob,
              lastActivity: "Just now",
            }
          : null
      );
    }

    const targetStage = stages.find((s) => s.id === newStageId);
    toast.success("Stage Updated", {
      description: `Opportunity moved to ${targetStage?.title || "new stage"}.`,
    });

    await updateDealStage(dealId, newStageId, prob);
  };

  // Convert Lead into Deal
  const handleConvertLeadToDeal = async (lead: Lead) => {
    if (!user?.id) return;

    // Remove from leads
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));

    const convertedDeal = await convertLeadToDeal(user.id, lead);
    if (convertedDeal) {
      setDeals((prev) => dedupeById([convertedDeal, ...prev]));
    }

    const notif = await createNotification(user.id, {
      title: "Lead converted to deal",
      description: `${lead.name} (${lead.company}) converted into Qualified Opportunity.`,
      time: "Just now",
      read: false,
      type: "lead",
    });

    if (notif) {
      setNotifications((prev) => dedupeById([notif, ...prev]));
    }

    setActiveTab("pipeline");
  };

  const handleDeleteDeal = async (dealId: string) => {
    setDeals((prev) => {
      const updated = prev.filter((d) => d.id !== dealId);
      saveDealOrder(updated);
      return updated;
    });
    if (selectedDeal?.id === dealId) {
      setIsDetailOpen(false);
      setSelectedDeal(null);
    }
    toast.info("Opportunity Removed", {
      description: "Deal deleted from pipeline.",
    });
    await deleteDeal(dealId);
  };

  const handleDeleteLead = async (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    toast.info("Lead Removed", {
      description: "Lead removed from directory.",
    });
    await deleteLead(leadId);
  };

  const handleUpdateLeadStatus = async (
    leadId: string,
    status: LeadStatus
  ) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    toast.info("Lead Status Updated", {
      description: `Status changed to ${status.toUpperCase()}.`,
    });
    await updateLeadStatus(leadId, status);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    toast.info("Customer Removed", {
      description: "Customer record removed.",
    });
    await deleteCustomer(customerId);
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
    toast.success(task.completed ? "Task Reopened" : "Task Completed", {
      description: `"${task.title}" status updated.`,
    });
    await toggleTask(taskId, task.completed);
  };

  const handleAddTask = async (newTask: CRMTask) => {
    if (!user?.id) return;

    setTasks((prev) => dedupeById([newTask, ...prev]));

    const created = await createTask(user.id, newTask);
    if (created) {
      setTasks((prev) => {
        const hasExisting = prev.some((t) => t.id === created.id || t.id === newTask.id);
        const mapped = prev.map((t) => (t.id === newTask.id ? created : t));
        return dedupeById(hasExisting ? mapped : [created, ...mapped]);
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId);
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      dedupeById(prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    );
    await markNotificationRead(id);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col items-center justify-center text-zinc-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <LightCrmLogo size="lg" />
            <div className="absolute -inset-3 bg-cyan-500/10 rounded-2xl blur-xl -z-10 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-400 font-mono tracking-wide animate-pulse">
            connecting to database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onOpenNewDealModal={() =>
        handleOpenCreateRecord(
          activeTab === "leads"
            ? "lead"
            : activeTab === "customers"
            ? "customer"
            : "deal"
        )
      }
      onOpenCommandMenu={() => setCommandMenuOpen(true)}
      notifications={notifications}
      onMarkNotificationRead={handleMarkNotificationRead}
      userProfile={userProfile}
      counts={{
        deals: deals.length,
        leads: leads.length,
        customers: customers.length,
        tasks: tasks.filter((t) => !t.completed).length,
      }}
    >
      {/* Animated Tab Content with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="h-full"
        >
          {activeTab === "pipeline" && (
            <PipelineBoard
              stages={stages}
              deals={deals}
              onDealsChange={handleDealsChange}
              onSelectDeal={handleSelectDeal}
              onOpenNewDealModal={(stageId) =>
                handleOpenCreateRecord("deal", stageId)
              }
              onDeleteDeal={handleDeleteDeal}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "leads" && (
            <LeadsView
              leads={leads}
              onConvertToDeal={handleConvertLeadToDeal}
              onOpenNewLeadModal={() => handleOpenCreateRecord("lead")}
              onDeleteLead={handleDeleteLead}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "customers" && (
            <CustomersView
              customers={customers}
              searchQuery={searchQuery}
              onOpenNewCustomerModal={() => handleOpenCreateRecord("customer")}
              onDeleteCustomer={handleDeleteCustomer}
              onAddOpportunityForCustomer={(cust) =>
                handleOpenCreateRecord("deal")
              }
              onSelectCustomer={(cust) => {
                const matchedDeal = deals.find(
                  (d) => d.company.toLowerCase() === cust.company.toLowerCase()
                );
                if (matchedDeal) {
                  handleSelectDeal(matchedDeal);
                } else {
                  handleOpenCreateRecord("deal");
                }
              }}
            />
          )}

          {activeTab === "tasks" && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === "analytics" && <AnalyticsView deals={deals} />}
        </motion.div>
      </AnimatePresence>

      {/* Slide-over Deal Details Sheet */}
      <DealDetailSheet
        deal={selectedDeal}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        stages={stages}
        onStageChange={handleStageChangeFromSheet}
        onDeleteDeal={handleDeleteDeal}
      />

      {/* Unified Multi-Entity Create Record Dialog (Opportunity, Lead, Customer) */}
      <CreateRecordDialog
        isOpen={isCreateRecordOpen}
        onClose={() => setIsCreateRecordOpen(false)}
        defaultType={createRecordType}
        defaultStageId={createRecordDefaultStage}
        stages={stages}
        onCreateDeal={handleCreateDeal}
        onCreateLead={handleCreateLead}
        onCreateCustomer={handleCreateCustomer}
      />

      {/* Global ⌘K Command Palette */}
      <CommandMenu
        isOpen={commandMenuOpen}
        onClose={() => setCommandMenuOpen(false)}
      />
    </DashboardShell>
  );
}
