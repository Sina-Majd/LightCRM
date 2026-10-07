"use client";

import { TodayView } from "@/components/dashboard/today-view";
import { TodaySkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function TodayPage() {
  const {
    load, deals, tasks, invoices, cheques, activities,
    navigate, openDeal, openCreateRecord, toggleTaskDone,
  } = useCrm();

  const pending = !load.deals || !load.tasks || !load.invoices || !load.cheques;

  if (pending) return <TodaySkeleton />;

  return (
    <TodayView
      deals={deals}
      tasks={tasks}
      invoices={invoices}
      cheques={cheques}
      activities={activities}
      onNavigate={navigate}
      onSelectDeal={openDeal}
      onToggleTask={toggleTaskDone}
      onOpenNewDeal={() => openCreateRecord("deal")}
      onOpenNewInvoice={() => navigate("invoices")}
      onOpenQuickCallModal={(d) => openDeal(d)}
    />
  );
}