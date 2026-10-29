"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import {
  UserProfile,
  fetchUserProfile,
  fetchPipelineStages,
  fetchDeals,
  createDeal,
  updateDealStage,
  updateDealNextAction,
  updateDealNotes,
  deleteDeal as deleteDealRow,
  fetchCustomers,
  createCustomer,
  deleteCustomer as deleteCustomerRow,
  fetchInvoices,
  createInvoice,
  fetchCheques,
  createCheque,
  updateChequeStatus,
  logQuickCall,
  fetchActivities,
  fetchTasks,
  createTask,
  toggleTask,
  updateTaskDueDate,
  deleteTask as deleteTaskRow,
  fetchNotifications,
  markNotificationRead as markNotificationReadRow,
  markAllNotificationsRead,
} from "@/lib/supabase/crm-service";
import {
  RawInvoiceItem,
  ChequeStatus,
  CallResult,
  getDealNextActionState,
} from "@/lib/fa";
import type {
  Deal,
  Customer,
  CRMTask,
  Invoice,
  Cheque,
  CRMActivity,
  CRMNotification,
  PipelineStage,
  RecordType,
} from "@/lib/crm/types";
import { DEFAULT_PIPELINE_STAGES as INITIAL_PIPELINE_STAGES } from "@/lib/crm/pipeline";
import { probabilityForStage } from "@/lib/crm/pipeline";
import { dedupeById } from "@/lib/crm/collections";
import { taskDueCategory } from "@/lib/crm/tasks";
import { saveDealOrder, orderDealsBySavedOrder } from "@/lib/crm/deal-order";

async function runMutation(action: () => Promise<void>): Promise<boolean> {
  try {
    await action();
    return true;
  } catch (error) {
    console.error("CRM mutation failed:", error);
    toast.error("ذخیره تغییرات انجام نشد. لطفاً دوباره تلاش کنید.");
    return false;
  }
}

/** Per-resource readiness, so each view skeletonizes only what it needs. */
export interface LoadState {
  profile: boolean;
  stages: boolean;
  deals: boolean;
  customers: boolean;
  invoices: boolean;
  cheques: boolean;
  tasks: boolean;
  activities: boolean;
  notifications: boolean;
}

export interface CrmContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  load: LoadState;
  loadError: string | null;
  reloadWorkspace: () => void;

  stages: PipelineStage[];
  deals: Deal[];
  customers: Customer[];
  invoices: Invoice[];
  cheques: Cheque[];
  tasks: CRMTask[];
  activities: CRMActivity[];
  notifications: CRMNotification[];

  counts: {
    deals: number;
    customers: number;
    tasks: number;
    invoices: number;
    cheques: number;
    staleDeals: number;
  };

  // Create-record dialog
  createRecordType: RecordType;
  createRecordDefaultStage: string | undefined;
  isCreateRecordOpen: boolean;
  openCreateRecord: (type?: RecordType, stageId?: string) => void;
  closeCreateRecord: () => void;

  /** Global search, owned here so the shell input and every view share it. */
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Deal sheet
  selectedDeal: Deal | null;
  isDetailOpen: boolean;
  openDeal: (deal: Deal) => void;
  closeDeal: () => void;

  // Handlers
  createDealRecord: (deal: Deal) => Promise<boolean>;
  changeDeals: (deals: Deal[]) => Promise<boolean>;
  changeStageFromSheet: (dealId: string, stageId: string) => Promise<boolean>;
  updateNextAction: (
    dealId: string,
    title: string | null,
    due: string | null
  ) => Promise<boolean>;
  logCall: (dealId: string, result: CallResult, note: string) => Promise<boolean>;
  addDealNote: (dealId: string, note: string) => Promise<boolean>;
  deleteDeal: (dealId: string) => Promise<boolean>;

  createCustomerRecord: (customer: Customer) => Promise<boolean>;
  deleteCustomer: (id: string) => Promise<boolean>;

  createInvoiceRecord: (
    invoice: Partial<Invoice>,
    items: RawInvoiceItem[]
  ) => Promise<boolean>;
  createChequeRecord: (cheque: Partial<Cheque>) => Promise<boolean>;
  updateCheque: (id: string, status: ChequeStatus) => Promise<boolean>;

  toggleTaskDone: (id: string) => Promise<boolean>;
  rescheduleTask: (id: string, dueDate: string) => Promise<boolean>;
  addTask: (task: CRMTask) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;

  markNotification: (id: string) => Promise<boolean>;
  markAllNotifications: () => Promise<boolean>;

  /** Navigate between dashboard sections. */
  navigate: (tab: string) => void;
}

function loadState(ready: boolean): LoadState {
  return {
    profile: ready, stages: ready, deals: ready, customers: ready,
    invoices: ready, cheques: ready, tasks: ready, activities: ready, notifications: ready,
  };
}

const CrmContext = createContext<CrmContextValue | null>(null);

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) {
    throw new Error("useCrm must be used inside <CrmProvider>");
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [load, setLoad] = useState<LoadState>(() => loadState(false));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dealOrderReady, setDealOrderReady] = useState(false);
  const [loadVersion, setLoadVersion] = useState(0);
  const reloadWorkspace = useCallback(() => setLoadVersion((version) => version + 1), []);

  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [notifications, setNotifications] = useState<CRMNotification[]>(
    []
  );

  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const selectedDeal = deals.find((deal) => deal.id === selectedDealId) ?? null;
  const orderScope = userProfile?.workspaceId ? `workspace:${userProfile.workspaceId}` : `user:${user?.id}`;
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateRecordOpen, setIsCreateRecordOpen] = useState(false);
  const [createRecordType, setCreateRecordType] = useState<RecordType>("deal");
  const [createRecordDefaultStage, setCreateRecordDefaultStage] = useState<
    string | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------- Initial load ---------- */
  useEffect(() => {
    let isMounted = true;

    async function loadWorkspaceData() {
      try {
        const { data: { user: currentUser }, error } = await createClient().auth.getUser();
        if (!isMounted) return;
        if (error || !currentUser) {
          router.replace("/login");
          return;
        }

        setLoad(loadState(false));
        setDealOrderReady(false);
        setLoadError(null);
        setUser(currentUser);
        const profile = await fetchUserProfile(currentUser.id);
        if (!isMounted) return;
        if (!profile?.workspaceId) throw new Error("The account has no configured workspace.");
        setUserProfile(profile);
        setLoad((previous) => ({ ...previous, profile: true }));
        const workspaceId = profile?.workspaceId;
        const scope = workspaceId ? `workspace:${workspaceId}` : `user:${currentUser.id}`;

        // Release each view as its own resource finishes, even if another fails.
        async function loadResource<T extends { id: string }>(
          key: keyof LoadState,
          request: Promise<T[]>,
          setRecords: (records: T[]) => void
        ) {
          try {
            const records = await request;
            if (isMounted) setRecords(dedupeById(records));
          } catch (error) {
            console.error(`Failed to load CRM ${key}:`, error);
            if (isMounted) setLoadError("بخشی از اطلاعات بارگذاری نشد. برای دریافت اطلاعات دوباره تلاش کنید.");
          } finally {
            if (isMounted) setLoad((previous) => ({ ...previous, [key]: true }));
          }
        }

        await Promise.all([
          loadResource("stages", fetchPipelineStages(workspaceId), (records) =>
            setStages(records.length ? records : INITIAL_PIPELINE_STAGES)),
          loadResource("deals", fetchDeals(workspaceId), (records) => {
            setDeals(orderDealsBySavedOrder(records, scope));
            setDealOrderReady(true);
          }),
          loadResource("customers", fetchCustomers(workspaceId), setCustomers),
          loadResource("invoices", fetchInvoices(workspaceId), setInvoices),
          loadResource("cheques", fetchCheques(workspaceId), setCheques),
          loadResource("tasks", fetchTasks(workspaceId), setTasks),
          loadResource("activities", fetchActivities(workspaceId), setActivities),
          loadResource("notifications", fetchNotifications(workspaceId), setNotifications),
        ]);
      } catch (error) {
        console.error("Failed to load CRM data:", error);
        if (isMounted) {
          setLoad(loadState(true));
          setLoadError("اطلاعات فضای کاری بارگذاری نشد. لطفاً دوباره تلاش کنید.");
        }
      }
    }

    void loadWorkspaceData();
    return () => { isMounted = false; };
  }, [router, loadVersion]);

  // Storage writes are effects, never side effects inside React state updaters.
  useEffect(() => {
    if (user && dealOrderReady) saveDealOrder(deals, orderScope);
  }, [deals, orderScope, user, dealOrderReady]);

  /* ---------- Navigation ---------- */
  const navigate = useCallback(
    (tab: string) => router.push(`/dashboard/${tab}`),
    [router]
  );

  /* ---------- Dialog / sheet ---------- */
  const openCreateRecord = useCallback(
    (type: RecordType = "deal", stageId?: string) => {
      setCreateRecordType(type);
      setCreateRecordDefaultStage(stageId);
      setIsCreateRecordOpen(true);
    },
    []
  );

  const closeCreateRecord = useCallback(() => setIsCreateRecordOpen(false), []);

  const openDeal = useCallback((deal: Deal) => {
    setSelectedDealId(deal.id);
    setIsDetailOpen(true);
  }, []);

  const closeDeal = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedDealId(null);
  }, []);

  /* ---------- Mutations ---------- */
  const createDealRecord = useCallback((deal: Deal) => runMutation(async () => {
    if (!user) throw new Error("Authentication required.");
    const created = await createDeal(userProfile?.workspaceId, user.id, deal);
    setDeals((previous) => dedupeById([created, ...previous]));
    toast.success("معامله با موفقیت ایجاد شد.");
  }), [user, userProfile]);

  const changeDeals = useCallback((updated: Deal[]) => runMutation(async () => {
    const previousById = new Map(deals.map((deal) => [deal.id, deal]));
    const changed = updated.filter((deal) => {
      const previous = previousById.get(deal.id);
      return previous && (previous.stageId !== deal.stageId || previous.probability !== deal.probability);
    });
    const results = await Promise.allSettled(changed.map((deal) =>
      updateDealStage(deal.id, deal.stageId, deal.probability)));
    const failed = new Set(changed.filter((_, index) => results[index].status === "rejected").map((deal) => deal.id));
    setDeals((current) => {
      const currentById = new Map(current.map((deal) => [deal.id, deal]));
      const reordered = updated.flatMap((deal) => {
        const existing = currentById.get(deal.id);
        if (!existing) return [];
        return [{ ...existing, ...(failed.has(deal.id) ? {} : {
          stageId: deal.stageId, probability: deal.probability,
          daysInStage: deal.daysInStage, lastActivity: deal.lastActivity,
        }) }];
      });
      const ids = new Set(reordered.map((deal) => deal.id));
      return [...reordered, ...current.filter((deal) => !ids.has(deal.id))];
    });
    const activities: CRMActivity[] = changed.filter((deal) => !failed.has(deal.id)).map((deal) => ({
      id: crypto.randomUUID(), subjectType: "deal", subjectId: deal.id, kind: "stage_change",
      body: `مرحله معامله به «${stages.find((stage) => stage.id === deal.stageId)?.title || deal.stageId}» تغییر یافت.`,
      happenedAt: new Date().toISOString(), createdBy: userProfile?.fullName || "شما",
    }));
    setActivities((current) => [...activities, ...current]);
    const failure = results.find((result) => result.status === "rejected");
    if (failure?.status === "rejected") throw failure.reason;
  }), [deals, stages, userProfile]);

  const changeStageFromSheet = useCallback((dealId: string, stageId: string) => runMutation(async () => {
    const probability = probabilityForStage(stages, stageId);
    await updateDealStage(dealId, stageId, probability);
    setDeals((previous) => previous.map((deal) => deal.id === dealId ? {
      ...deal, stageId, probability, daysInStage: 0, lastActivity: "لحظاتی پیش",
    } : deal));
    toast.success("مرحله به‌روزرسانی شد");
  }), [stages]);

  const updateNextAction = useCallback((dealId: string, title: string | null, due: string | null) => runMutation(async () => {
    await updateDealNextAction(dealId, title, due);
    setDeals((previous) => previous.map((deal) => deal.id === dealId ? {
      ...deal, nextActionTitle: title, nextActionDue: due,
    } : deal));
  }), []);

  const logCall = useCallback((dealId: string, result: CallResult, note: string) => runMutation(async () => {
    if (!user) throw new Error("Authentication required.");
    await logQuickCall(userProfile?.workspaceId, user.id, "deal", dealId, result, note);
    const matched = deals.find((deal) => deal.id === dealId);
    const activity: CRMActivity = {
      id: crypto.randomUUID(), subjectType: "deal", subjectId: dealId, kind: "call", callResult: result,
      body: `تماس با ${matched?.contact || "مخاطب"}: ${note}`,
      happenedAt: new Date().toISOString(), createdBy: userProfile?.fullName || "شما",
    };
    setActivities((previous) => [activity, ...previous]);
  }), [deals, user, userProfile]);

  const deleteDeal = useCallback((dealId: string) => runMutation(async () => {
    await deleteDealRow(dealId);
    setDeals((previous) => previous.filter((deal) => deal.id !== dealId));
    setSelectedDealId((previous) => previous === dealId ? null : previous);
    toast.success("معامله حذف شد.");
  }), []);

  const addDealNote = useCallback((dealId: string, note: string) => runMutation(async () => {
    const deal = deals.find((record) => record.id === dealId);
    if (!deal || !note.trim()) throw new Error("A saved deal and note are required.");
    const notes = [deal.notes.trim(), note.trim()].filter(Boolean).join("\n\n");
    await updateDealNotes(dealId, notes);
    setDeals((previous) => previous.map((record) => record.id === dealId ? { ...record, notes } : record));
  }), [deals]);

  const createCustomerRecord = useCallback((customer: Customer) => runMutation(async () => {
    if (!user) throw new Error("Authentication required.");
    const created = await createCustomer(userProfile?.workspaceId, user.id, customer);
    setCustomers((previous) => dedupeById([created, ...previous]));
    toast.success("مشتری با موفقیت ثبت شد.");
  }), [user, userProfile]);

  const removeCustomer = useCallback((id: string) => runMutation(async () => {
    await deleteCustomerRow(id);
    setCustomers((previous) => previous.filter((customer) => customer.id !== id));
    toast.success("مشتری حذف شد.");
  }), []);

  const createInvoiceRecord = useCallback((invoice: Partial<Invoice>, items: RawInvoiceItem[]) => runMutation(async () => {
    if (!user) throw new Error("Authentication required.");
    const created = await createInvoice(userProfile?.workspaceId, invoice, items);
    setInvoices((previous) => [created, ...previous]);
  }), [user, userProfile]);

  const createChequeRecord = useCallback((cheque: Partial<Cheque>) => runMutation(async () => {
    if (!user) throw new Error("Authentication required.");
    const created = await createCheque(userProfile?.workspaceId, cheque);
    setCheques((previous) => [{ ...created, customerName: cheque.customerName }, ...previous]);
  }), [user, userProfile]);

  const updateCheque = useCallback((id: string, status: ChequeStatus) => runMutation(async () => {
    await updateChequeStatus(id, status);
    setCheques((previous) => previous.map((cheque) => cheque.id === id ? {
      ...cheque, status, statusUpdatedAt: new Date().toISOString(),
    } : cheque));
  }), []);

  const toggleTaskDone = useCallback((id: string) => runMutation(async () => {
    const target = tasks.find((task) => task.id === id);
    if (!target) return;
    const completed = !target.completed;
    await toggleTask(id, completed);
    setTasks((previous) => previous.map((task) => task.id === id ? { ...task, completed } : task));
  }), [tasks]);

  const addTask = useCallback((task: CRMTask) => runMutation(async () => {
    if (!user) throw new Error("Authentication required.");
    const created = await createTask(userProfile?.workspaceId, user.id, task);
    setTasks((previous) => dedupeById([created, ...previous]));
  }), [user, userProfile]);

  const rescheduleTask = useCallback((id: string, dueDate: string) => runMutation(async () => {
    await updateTaskDueDate(id, dueDate);
    setTasks((previous) => previous.map((task) => task.id === id ? {
      ...task, dueDate, dueCategory: taskDueCategory(dueDate),
    } : task));
  }), []);

  const removeTask = useCallback((id: string) => runMutation(async () => {
    await deleteTaskRow(id);
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }), []);

  const markNotification = useCallback((id: string) => runMutation(async () => {
    await markNotificationReadRow(id);
    setNotifications((previous) => previous.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  }), []);

  const markAllNotifications = useCallback(() => runMutation(async () => {
    if (!user) throw new Error("Authentication required.");
    await markAllNotificationsRead(userProfile?.workspaceId);
    setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })));
  }), [user, userProfile]);

  /* ---------- Derived ---------- */
  const counts = useMemo(() => {
    const staleDeals = deals.filter((d) => {
      const st = getDealNextActionState(d.nextActionDue, d.nextActionTitle);
      return st.isStale || st.isOverdue;
    }).length;

    return {
      deals: deals.length,
      customers: customers.length,
      tasks: tasks.filter((t) => !t.completed).length,
      invoices: invoices.length,
      cheques: cheques.filter((c) => c.status === "in_hand").length,
      staleDeals,
    };
  }, [deals, customers, tasks, invoices, cheques]);

  const value = useMemo<CrmContextValue>(
    () => ({
      user,
      userProfile,
      load,
      loadError,
      reloadWorkspace,
      stages,
      deals,
      customers,
      invoices,
      cheques,
      tasks,
      activities,
      notifications,
      counts,
      createRecordType,
      createRecordDefaultStage,
      isCreateRecordOpen,
      openCreateRecord,
      closeCreateRecord,
      searchQuery,
      setSearchQuery,
      selectedDeal,
      isDetailOpen,
      openDeal,
      closeDeal,
      createDealRecord,
      changeDeals,
      changeStageFromSheet,
      updateNextAction,
      logCall,
      addDealNote,
      deleteDeal,
      createCustomerRecord,
      deleteCustomer: removeCustomer,
      createInvoiceRecord,
      createChequeRecord,
      updateCheque,
      toggleTaskDone,
      rescheduleTask,
      addTask,
      deleteTask: removeTask,
      markNotification,
      markAllNotifications,
      navigate,
    }),
    [
      user, userProfile, load, loadError, reloadWorkspace, stages, deals, customers, invoices, cheques,
      tasks, activities, notifications, counts, createRecordType,
      createRecordDefaultStage, openCreateRecord, selectedDeal, isDetailOpen,
      isCreateRecordOpen, closeCreateRecord, searchQuery, setSearchQuery,
      openDeal, closeDeal, createDealRecord, changeDeals, changeStageFromSheet,
      updateNextAction, logCall, addDealNote, deleteDeal, createCustomerRecord, removeCustomer,
      createInvoiceRecord, createChequeRecord, updateCheque, toggleTaskDone, rescheduleTask,
      addTask, removeTask, markNotification, markAllNotifications, navigate,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}
