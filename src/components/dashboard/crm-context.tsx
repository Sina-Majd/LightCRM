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
import {
  INITIAL_PIPELINE_STAGES,
  INITIAL_DEALS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_CHEQUES,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  Deal,
  Customer,
  CRMTask,
  Invoice,
  Cheque,
  CRMActivity,
  CRMNotification,
  PipelineStage,
} from "@/data/dashboard-mock-data";
import { RecordType } from "./create-record-dialog";

/* ------------------------------------------------------------------ */
/* Helpers (moved verbatim from the old page.tsx)                      */
/* ------------------------------------------------------------------ */

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

/** Probability implied by a pipeline stage — mirrors pipeline-board. */
function probabilityForStage(stages: PipelineStage[], target: string): number {
  const s = stages.find((x) => x.id === target);
  if (target === "stage-won" || s?.title.includes("موفق")) return 100;
  if (target === "stage-negotiation" || s?.title.includes("مذاکره")) return 85;
  if (target === "stage-proposal" || s?.title.includes("پیش‌فاکتور")) return 70;
  if (target === "stage-qualified" || s?.title.includes("ارزیابی")) return 50;
  return 30;
}

/* ------------------------------------------------------------------ */
/* Context shape                                                       */
/* ------------------------------------------------------------------ */

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
  createDealRecord: (deal: Deal) => Promise<void>;
  changeDeals: (deals: Deal[]) => Promise<void>;
  changeStageFromSheet: (dealId: string, stageId: string) => Promise<void>;
  updateNextAction: (
    dealId: string,
    title: string | null,
    due: string | null
  ) => Promise<void>;
  logCall: (dealId: string, result: CallResult, note: string) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;

  createCustomerRecord: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  createInvoiceRecord: (
    invoice: Partial<Invoice>,
    items: RawInvoiceItem[]
  ) => Promise<void>;
  createChequeRecord: (cheque: Partial<Cheque>) => Promise<void>;
  updateCheque: (id: string, status: ChequeStatus) => Promise<void>;

  toggleTaskDone: (id: string) => Promise<void>;
  addTask: (task: CRMTask) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  markNotification: (id: string) => Promise<void>;
  markAllNotifications: () => Promise<void>;

  /** Navigate between dashboard sections. */
  navigate: (tab: string) => void;
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
  const [load, setLoad] = useState<LoadState>({
    profile: false,
    stages: false,
    deals: false,
    customers: false,
    invoices: false,
    cheques: false,
    tasks: false,
    activities: false,
    notifications: false,
  });

  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [cheques, setCheques] = useState<Cheque[]>(INITIAL_CHEQUES);
  const [tasks, setTasks] = useState<CRMTask[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<CRMActivity[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<CRMNotification[]>(
    INITIAL_NOTIFICATIONS
  );

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
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

        const prof = await fetchUserProfile(currentUser.id);
        if (!isMounted) return;
        setUserProfile(prof);
        setLoad((p) => ({ ...p, profile: true }));

        const wsId = prof?.workspaceId;

        // Fetch every entity in parallel. `settle` keeps per-position types and
        // isolates failures so one dead resource never blanks the whole app.
        const settle = <T,>(p: Promise<T>): Promise<T | undefined> =>
          p.then((v) => (v ?? undefined)).catch(() => undefined);

        const [stg, dl, cs, inv, chq, tk, act, nt] = await Promise.all([
          settle(fetchPipelineStages(wsId)),
          settle(fetchDeals(wsId)),
          settle(fetchCustomers(wsId)),
          settle(fetchInvoices(wsId)),
          settle(fetchCheques(wsId)),
          settle(fetchTasks(wsId)),
          settle(fetchActivities(wsId)),
          settle(fetchNotifications(wsId)),
        ]);

        if (!isMounted) return;

        setStages(stg?.length ? dedupeById(stg) : INITIAL_PIPELINE_STAGES);
        setDeals(
          dl?.length
            ? dedupeById(orderDealsBySavedOrder(dl))
            : orderDealsBySavedOrder(INITIAL_DEALS)
        );
        setCustomers(cs?.length ? dedupeById(cs) : INITIAL_CUSTOMERS);
        setInvoices(inv?.length ? dedupeById(inv) : INITIAL_INVOICES);
        setCheques(chq?.length ? dedupeById(chq) : INITIAL_CHEQUES);
        setTasks(tk?.length ? dedupeById(tk) : INITIAL_TASKS);
        setActivities(act?.length ? dedupeById(act) : INITIAL_ACTIVITIES);
        setNotifications(nt?.length ? dedupeById(nt) : INITIAL_NOTIFICATIONS);

        setLoad({
          profile: true,
          stages: true,
          deals: true,
          customers: true,
          invoices: true,
          cheques: true,
          tasks: true,
          activities: true,
          notifications: true,
        });
      } catch (err) {
        console.error("Failed to load CRM data:", err);
        // Release every skeleton even on failure — never leave the UI stuck.
        if (isMounted) {
          setLoad({
            profile: true,
            stages: true,
            deals: true,
            customers: true,
            invoices: true,
            cheques: true,
            tasks: true,
            activities: true,
            notifications: true,
          });
        }
      }
    }

    loadWorkspaceData();
    return () => {
      isMounted = false;
    };
  }, [router]);

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
    setSelectedDeal(deal);
    setIsDetailOpen(true);
  }, []);

  const closeDeal = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedDeal(null);
  }, []);

  /* ---------- Deals ---------- */
  const createDealRecord = useCallback(
    async (newDeal: Deal) => {
      setDeals((prev) => {
        const updated = dedupeById([newDeal, ...prev]);
        saveDealOrder(updated);
        return updated;
      });
      setLoad((p) => ({ ...p, deals: true }));

      toast.success("معامله با موفقیت ایجاد شد.", {
        description: `«${newDeal.title}» در مرحله مورد نظر قرار گرفت.`,
      });

      if (user?.id) {
        const created = await createDeal(
          userProfile?.workspaceId,
          user.id,
          newDeal
        );
        if (created) {
          setDeals((prev) => {
            const updated = prev.map((d) =>
              d.id === newDeal.id ? created : d
            );
            saveDealOrder(updated);
            return dedupeById(updated);
          });
        }
      }
    },
    [user, userProfile]
  );

  const changeDeals = useCallback(
    async (updatedDeals: Deal[]) => {
      const prevDeals = deals;
      saveDealOrder(updatedDeals);
      setDeals(dedupeById(updatedDeals));

      for (const nd of updatedDeals) {
        const old = prevDeals.find((d) => d.id === nd.id);
        if (
          old &&
          (old.stageId !== nd.stageId || old.probability !== nd.probability)
        ) {
          await updateDealStage(nd.id, nd.stageId, nd.probability);
          const newAct: CRMActivity = {
            id: `act-${Date.now()}`,
            subjectType: "deal",
            subjectId: nd.id,
            kind: "stage_change",
            body: `مرحله معامله به «${
              stages.find((s) => s.id === nd.stageId)?.title || nd.stageId
            }» تغییر یافت.`,
            happenedAt: new Date().toISOString(),
            createdBy: userProfile?.fullName || "شما",
          };
          setActivities((prev) => [newAct, ...prev]);
        }
      }
    },
    [deals, stages, userProfile]
  );

  const changeStageFromSheet = useCallback(
    async (dealId: string, newStageId: string) => {
      const currentDeal = deals.find((d) => d.id === dealId) || selectedDeal;
      if (currentDeal && currentDeal.stageId === newStageId) return;

      const prob = probabilityForStage(stages, newStageId);

      setDeals((prev) =>
        dedupeById(
          prev.map((d) =>
            d.id === dealId
              ? {
                  ...d,
                  stageId: newStageId,
                  probability: prob,
                  lastActivity: "لحظاتی پیش",
                }
              : d
          )
        )
      );

      setSelectedDeal((prev) =>
        prev && prev.id === dealId
          ? {
              ...prev,
              stageId: newStageId,
              probability: prob,
              lastActivity: "لحظاتی پیش",
            }
          : prev
      );

      const targetStage = stages.find((s) => s.id === newStageId);
      toast.success("مرحله به‌روزرسانی شد", {
        description: `معامله به ${targetStage?.title || "مرحله جدید"} منتقل گردید.`,
      });

      await updateDealStage(dealId, newStageId, prob);
    },
    [deals, stages, selectedDeal]
  );

  const updateNextAction = useCallback(
    async (dealId: string, title: string | null, due: string | null) => {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === dealId
            ? { ...d, nextActionTitle: title, nextActionDue: due }
            : d
        )
      );
      setSelectedDeal((prev) =>
        prev && prev.id === dealId
          ? { ...prev, nextActionTitle: title, nextActionDue: due }
          : prev
      );
      await updateDealNextAction(dealId, title, due);
    },
    []
  );

  const logCall = useCallback(
    async (dealId: string, result: CallResult, note: string) => {
      const matchedDeal = deals.find((d) => d.id === dealId);
      const newAct: CRMActivity = {
        id: `act-${Date.now()}`,
        subjectType: "deal",
        subjectId: dealId,
        kind: "call",
        callResult: result,
        body: `تماس با ${matchedDeal?.contact || "مخاطب"}: ${note}`,
        happenedAt: new Date().toISOString(),
        createdBy: userProfile?.fullName || "شما",
      };
      setActivities((prev) => [newAct, ...prev]);

      if (user?.id) {
        await logQuickCall(
          userProfile?.workspaceId,
          user.id,
          "deal",
          dealId,
          result,
          note
        );
      }
    },
    [deals, user, userProfile]
  );

  const deleteDeal = useCallback(async (dealId: string) => {
    setDeals((prev) => {
      const updated = prev.filter((d) => d.id !== dealId);
      saveDealOrder(updated);
      return updated;
    });
    setSelectedDeal((prev) => (prev && prev.id === dealId ? null : prev));
    setIsDetailOpen(false);
    toast.success("معامله حذف شد.");
    await deleteDealRow(dealId);
  }, []);

  /* ---------- Customers ---------- */
  const createCustomerRecord = useCallback(
    async (newCustomer: Customer) => {
      setCustomers((prev) => dedupeById([newCustomer, ...prev]));
      setLoad((p) => ({ ...p, customers: true }));
      toast.success("مشتری با موفقیت ثبت شد.");

      if (user?.id) {
        const created = await createCustomer(
          userProfile?.workspaceId,
          user.id,
          newCustomer
        );
        if (created) {
          setCustomers((prev) =>
            dedupeById(
              prev.map((c) => (c.id === newCustomer.id ? created : c))
            )
          );
        }
      }
    },
    [user, userProfile]
  );

  const removeCustomer = useCallback(async (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    toast.success("مشتری حذف شد.");
    await deleteCustomerRow(customerId);
  }, []);

  /* ---------- Invoices & cheques ---------- */
  const createInvoiceRecord = useCallback(
    async (invoice: Partial<Invoice>, rawItems: RawInvoiceItem[]) => {
      setLoad((p) => ({ ...p, invoices: true }));

      if (user?.id) {
        const created = await createInvoice(
          userProfile?.workspaceId,
          user.id,
          invoice,
          rawItems
        );
        if (created) {
          setInvoices((prev) => [created, ...prev]);
          return;
        }
      }

      const fallback: Invoice = {
        id: `inv-${Date.now()}`,
        number: invoices.length + 1025,
        type: invoice.type || "proforma",
        status: "draft",
        issueDate: invoice.issueDate || new Date().toISOString().split("T")[0],
        dueDate: invoice.dueDate,
        subtotal: invoice.subtotal || 0,
        discount: invoice.discount || 0,
        tax: invoice.tax || 0,
        total: invoice.total || 0,
        notes: invoice.notes,
        customerName: invoice.customerName,
        customerId: invoice.customerId,
      };
      setInvoices((prev) => [fallback, ...prev]);
    },
    [user, userProfile, invoices]
  );

  const createChequeRecord = useCallback(
    async (cheque: Partial<Cheque>) => {
      setLoad((p) => ({ ...p, cheques: true }));

      if (user?.id) {
        const created = await createCheque(userProfile?.workspaceId, cheque);
        if (created) {
          setCheques((prev) => [created, ...prev]);
          return;
        }
      }

      const fallback: Cheque = {
        id: `chq-${Date.now()}`,
        customerId: cheque.customerId,
        customerName: cheque.customerName,
        sayadNumber: cheque.sayadNumber || "0000000000000000",
        bankName: cheque.bankName || "بانک ملی",
        branchName: cheque.branchName,
        accountOwner: cheque.accountOwner || "صاحب حساب",
        amount: cheque.amount || 0,
        dueDate: cheque.dueDate || new Date().toISOString().split("T")[0],
        status: cheque.status || "in_hand",
      };
      setCheques((prev) => [fallback, ...prev]);
    },
    [user, userProfile]
  );

  const updateCheque = useCallback(
    async (chequeId: string, status: ChequeStatus) => {
      setCheques((prev) =>
        prev.map((c) =>
          c.id === chequeId
            ? { ...c, status, statusUpdatedAt: new Date().toISOString() }
            : c
        )
      );
      await updateChequeStatus(chequeId, status);
    },
    []
  );

  /* ---------- Tasks ---------- */
  const toggleTaskDone = useCallback(async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;
    const newCompleted = !target.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    );
    await toggleTask(taskId, newCompleted);
  }, [tasks]);

  const addTask = useCallback(
    async (newTask: CRMTask) => {
      setTasks((prev) => dedupeById([newTask, ...prev]));
      setLoad((p) => ({ ...p, tasks: true }));
      if (user?.id) {
        const created = await createTask(
          userProfile?.workspaceId,
          user.id,
          newTask
        );
        if (created) {
          setTasks((prev) =>
            dedupeById(prev.map((t) => (t.id === newTask.id ? created : t)))
          );
        }
      }
    },
    [user, userProfile]
  );

  const removeTask = useCallback(async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTaskRow(taskId);
  }, []);

  /* ---------- Notifications ---------- */
  const markNotification = useCallback(async (id: string) => {
    setNotifications((prev) =>
      dedupeById(prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    );
    await markNotificationReadRow(id);
  }, []);

  const markAllNotifications = useCallback(async () => {
    if (!user?.id) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead(userProfile?.workspaceId);
  }, [user, userProfile]);

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
      deleteDeal,
      createCustomerRecord,
      deleteCustomer: removeCustomer,
      createInvoiceRecord,
      createChequeRecord,
      updateCheque,
      toggleTaskDone,
      addTask,
      deleteTask: removeTask,
      markNotification,
      markAllNotifications,
      navigate,
    }),
    [
      user, userProfile, load, stages, deals, customers, invoices, cheques,
      tasks, activities, notifications, counts, createRecordType,
      createRecordDefaultStage, openCreateRecord, selectedDeal, isDetailOpen,
      isCreateRecordOpen, closeCreateRecord, searchQuery, setSearchQuery,
      openDeal, closeDeal, createDealRecord, changeDeals, changeStageFromSheet,
      updateNextAction, logCall, deleteDeal, createCustomerRecord, removeCustomer,
      createInvoiceRecord, createChequeRecord, updateCheque, toggleTaskDone,
      addTask, removeTask, markNotification, markAllNotifications, navigate,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}