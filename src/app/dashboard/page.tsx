"use client";

import React, { useState } from "react";
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
} from "@/data/dashboard-mock-data";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("pipeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [stages] = useState(INITIAL_PIPELINE_STAGES);

  // Core CRM Reactive State
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [tasks, setTasks] = useState<CRMTask[]>(INITIAL_TASKS);
  const [notifications, setNotifications] = useState<CRMNotification[]>(
    INITIAL_NOTIFICATIONS
  );

  // Modals and Drawers
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateRecordOpen, setIsCreateRecordOpen] = useState(false);
  const [createRecordType, setCreateRecordType] = useState<RecordType>("deal");
  const [createRecordDefaultStage, setCreateRecordDefaultStage] = useState<
    string | undefined
  >(undefined);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

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
  const handleCreateDeal = (newDeal: Deal) => {
    setDeals((prev) => [newDeal, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "New opportunity created",
        description: `${newDeal.title} (${newDeal.formattedValue}) was added to pipeline.`,
        time: "Just now",
        read: false,
        type: "deal",
      },
      ...prev,
    ]);
  };

  // Create Lead Handler
  const handleCreateLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "New lead registered",
        description: `${newLead.name} (${newLead.company}) scored ${newLead.score}/100.`,
        time: "Just now",
        read: false,
        type: "lead",
      },
      ...prev,
    ]);
  };

  // Create Customer Handler
  const handleCreateCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "New customer added",
        description: `${newCustomer.company} added with ${newCustomer.formattedLtv} initial LTV.`,
        time: "Just now",
        read: false,
        type: "payment",
      },
      ...prev,
    ]);
  };

  const handleStageChangeFromSheet = (
    dealId: string,
    newStageId: string
  ) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stageId: newStageId,
              probability:
                newStageId === "stage-won"
                  ? 100
                  : newStageId === "stage-negotiation"
                  ? 85
                  : newStageId === "stage-proposal"
                  ? 70
                  : newStageId === "stage-qualified"
                  ? 50
                  : 30,
            }
          : d
      )
    );

    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal((prev) =>
        prev
          ? {
              ...prev,
              stageId: newStageId,
            }
          : null
      );
    }
  };

  const handleConvertLeadToDeal = (lead: Lead) => {
    const newDeal: Deal = {
      id: `deal-from-lead-${Date.now()}`,
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
        initials: "SL",
      },
    };

    setDeals((prev) => [newDeal, ...prev]);
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Lead converted to deal",
        description: `${lead.name} (${lead.company}) converted into Qualified Opportunity.`,
        time: "Just now",
        read: false,
        type: "lead",
      },
      ...prev,
    ]);

    setActiveTab("pipeline");
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    if (selectedDeal?.id === dealId) {
      setIsDetailOpen(false);
      setSelectedDeal(null);
    }
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: CRMTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

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
              onDealsChange={setDeals}
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
