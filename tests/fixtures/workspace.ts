import { vi } from "vitest";
import type { CrmContextValue } from "@/components/dashboard/crm-context";
import { DEFAULT_PIPELINE_STAGES } from "@/lib/crm/pipeline";
import { formatToman, toLocalISODate } from "@/lib/fa";

export function workspaceFixture(overrides: Partial<CrmContextValue> = {}): CrmContextValue {
  const today = toLocalISODate(new Date());
  const fixture: CrmContextValue = {
    user: null,
    userProfile: { id: "user-one", fullName: "کاربر آزمایشی", companyName: "فضای کاری آزمایشی", email: "test@example.com", role: "مدیر فروش", status: "Available", plan: "business", workspaceId: "workspace-one" },
    load: { profile: true, stages: true, deals: true, customers: true, invoices: true, cheques: true, tasks: true, activities: true, notifications: true },
    loadError: null,
    reloadWorkspace: vi.fn(),
    stages: DEFAULT_PIPELINE_STAGES,
    deals: [{ id: "deal-one", title: "قرارداد پشتیبانی سالانه", company: "شرکت نمونه", contact: "مخاطب نمونه", email: "sales@example.com", phone: "۰۹۱۲۱۲۳۴۵۶۷", value: 120000000, formattedValue: formatToman(120000000), stageId: "stage-proposal", priority: "high", probability: 70, tags: ["خدمات"], notes: "", daysInStage: 2, lastActivity: "امروز", nextActionTitle: "پیگیری پیش‌فاکتور", nextActionDue: new Date(Date.now() + 86400000).toISOString(), assignee: { name: "کاربر آزمایشی", avatar: "" } }],
    customers: [{ id: "customer-one", name: "مخاطب نمونه", company: "شرکت نمونه", email: "sales@example.com", phone: "۰۹۱۲۱۲۳۴۵۶۷", customerType: "company", segment: "customer", ltv: 120000000, formattedLtv: formatToman(120000000), activeDealsCount: 1, healthScore: 85, healthStatus: "good", tier: "در حال رشد", renewalDate: "—", lastTouch: "امروز", location: "تهران", industry: "خدمات" }],
    invoices: [{ id: "invoice-one", customerId: "customer-one", customerName: "شرکت نمونه", number: 1001, type: "invoice", status: "paid", issueDate: today, dueDate: today, subtotal: 10000000, discount: 0, tax: 1000000, total: 11000000, items: [{ id: "item-one", invoiceId: "invoice-one", itemOrder: 1, description: "خدمات پشتیبانی", quantity: 1, unitPrice: 10000000, discount: 0, taxRate: 10, total: 11000000 }] }],
    cheques: [{ id: "cheque-one", customerId: "customer-one", customerName: "شرکت نمونه", sayadNumber: "1234567890123456", bankName: "بانک ملی", accountOwner: "شرکت نمونه", amount: 10000000, dueDate: today, status: "in_hand" }],
    tasks: [{ id: "task-one", title: "تماس با مشتری نمونه", type: "call", dueDate: today, dueCategory: "today", priority: "high", completed: false, relatedTo: "شرکت نمونه", relatedType: "customer" }],
    activities: [{ id: "activity-one", subjectType: "deal", subjectId: "deal-one", kind: "call", callResult: "connected", body: "تماس با مشتری انجام شد.", happenedAt: new Date().toISOString(), createdBy: "کاربر آزمایشی" }],
    notifications: [],
    counts: { deals: 1, customers: 1, tasks: 1, invoices: 1, cheques: 1, staleDeals: 0 },
    createRecordType: "deal", createRecordDefaultStage: undefined, isCreateRecordOpen: false,
    openCreateRecord: vi.fn(), closeCreateRecord: vi.fn(),
    searchQuery: "", setSearchQuery: vi.fn(),
    selectedDeal: null, isDetailOpen: false, openDeal: vi.fn(), closeDeal: vi.fn(),
    createDealRecord: vi.fn().mockResolvedValue(true), changeDeals: vi.fn().mockResolvedValue(true),
    changeStageFromSheet: vi.fn().mockResolvedValue(true), updateNextAction: vi.fn().mockResolvedValue(true),
    logCall: vi.fn().mockResolvedValue(true), deleteDeal: vi.fn().mockResolvedValue(true),
    addDealNote: vi.fn().mockResolvedValue(true),
    createCustomerRecord: vi.fn().mockResolvedValue(true), deleteCustomer: vi.fn().mockResolvedValue(true),
    createInvoiceRecord: vi.fn().mockResolvedValue(true), createChequeRecord: vi.fn().mockResolvedValue(true),
    updateCheque: vi.fn().mockResolvedValue(true), toggleTaskDone: vi.fn().mockResolvedValue(true),
    addTask: vi.fn().mockResolvedValue(true), deleteTask: vi.fn().mockResolvedValue(true),
    rescheduleTask: vi.fn().mockResolvedValue(true),
    markNotification: vi.fn().mockResolvedValue(true), markAllNotifications: vi.fn().mockResolvedValue(true),
    navigate: vi.fn(),
    ...overrides,
  };
  fixture.counts = {
    deals: fixture.deals.length, customers: fixture.customers.length,
    tasks: fixture.tasks.filter((task) => !task.completed).length,
    invoices: fixture.invoices.length, cheques: fixture.cheques.filter((cheque) => cheque.status === "in_hand").length,
    staleDeals: fixture.deals.filter((deal) => !deal.nextActionTitle || !deal.nextActionDue).length,
  };
  return fixture;
}
