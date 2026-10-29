"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

import {
  DashboardShell,
  DashboardTab,
} from "@/components/dashboard/dashboard-shell";
import { CrmProvider, useCrm } from "@/components/dashboard/crm-context";
import dynamic from "next/dynamic";

const DealDetailSheet = dynamic(
  () => import("@/components/dashboard/deal-detail-sheet").then((m) => m.DealDetailSheet),
  { ssr: false }
);
const CreateRecordDialog = dynamic(
  () => import("@/components/dashboard/create-record-dialog").then((m) => m.CreateRecordDialog),
  { ssr: false }
);

/** URL slug → the tab identity the rest of the app speaks. */
const TAB_FROM_SLUG: Record<string, DashboardTab> = {
  today: "today",
  pipeline: "pipeline",
  customers: "customers",
  invoices: "invoices",
  tasks: "tasks",
  analytics: "analytics",
};

/**
 * The shell chrome plus the two overlays. They live here rather than in each
 * page so the deal sheet and create dialog survive tab navigation.
 */
function ShellFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    userProfile,
    load,
    loadError,
    reloadWorkspace,
    stages,
    counts,
    searchQuery,
    setSearchQuery,
    navigate,
    openCreateRecord,
    isDetailOpen,
    selectedDeal,
    closeDeal,
    changeStageFromSheet,
    updateNextAction,
    logCall,
    addDealNote,
    deleteDeal,
    createDealRecord,
    createCustomerRecord,
    isCreateRecordOpen,
    closeCreateRecord,
    createRecordType,
    createRecordDefaultStage,
    notifications,
    markNotification,
    markAllNotifications,
  } = useCrm();

  const slug = (pathname?.split("/")[2] || "today").toLowerCase();
  const activeTab: DashboardTab = TAB_FROM_SLUG[slug] ?? "today";

  return (
    <DashboardShell
      activeTab={activeTab}
      onTabChange={(tab) => navigate(tab)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onOpenNewDealModal={() => openCreateRecord("deal")}
      notifications={load.notifications ? notifications : []}
      onMarkNotificationRead={markNotification}
      onMarkAllNotificationsRead={markAllNotifications}
      userProfile={userProfile}
      counts={counts}
    >
      {loadError && (
        <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p>{loadError}</p>
          <Button variant="outline" onClick={reloadWorkspace}>تلاش مجدد</Button>
        </div>
      )}
      {children}

      <DealDetailSheet
        key={selectedDeal?.id ?? "closed"}
        deal={selectedDeal}
        isOpen={isDetailOpen}
        onClose={closeDeal}
        stages={stages}
        onStageChange={changeStageFromSheet}
        onDeleteDeal={deleteDeal}
        onUpdateNextAction={updateNextAction}
        onLogCall={logCall}
        onAddNote={addDealNote}
      />

      <CreateRecordDialog
        isOpen={isCreateRecordOpen}
        onClose={closeCreateRecord}
        defaultType={createRecordType}
        defaultStageId={createRecordDefaultStage}
        stages={stages}
        onCreateDeal={createDealRecord}
        onCreateLead={() => {}}
        onCreateCustomer={createCustomerRecord}
      />
    </DashboardShell>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CrmProvider>
      <ShellFrame>{children}</ShellFrame>
    </CrmProvider>
  );
}
