import type {
  CustomerType, CustomerSegment, InvoiceType, InvoiceStatus, ChequeStatus, CallResult,
} from "@/lib/fa";

export type RecordType = "deal" | "customer";

export type DealPriority = "urgent" | "high" | "medium" | "low";
export type CustomerTier = "سازمانی" | "در حال رشد" | "استارتاپ" | "Enterprise" | "Growth" | "Startup";
export type CustomerHealth = "excellent" | "good" | "warning" | "critical";

export interface PipelineStage {
  id: string;
  title: string;
  color: string;
  accentBorder: string;
  bgGradient: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  value: number; // In Rial
  formattedValue: string; // Toman with Persian digits
  stageId: string;
  priority: DealPriority;
  probability: number;
  tags: string[];
  notes: string;
  daysInStage: number;
  lastActivity: string;
  nextActionTitle?: string | null;
  nextActionDue?: string | null;
  assignee: {
    name: string;
    avatar: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  nationalId?: string | null;
  economicCode?: string | null;
  segment: CustomerSegment;
  ltv: number; // Rial
  formattedLtv: string;
  activeDealsCount: number;
  healthScore: number;
  healthStatus: CustomerHealth;
  tier: CustomerTier;
  renewalDate: string;
  lastTouch: string;
  location: string;
  industry: string;
}

export interface CRMTask {
  id: string;
  title: string;
  type: "call" | "email" | "meeting" | "review";
  dueDate: string;
  dueCategory: "today" | "upcoming" | "overdue";
  priority: DealPriority;
  completed: boolean;
  relatedTo: string;
  relatedType: "deal" | "lead" | "customer";
}

export interface InvoiceItem {
  id: string;
  workspaceId?: string;
  invoiceId: string;
  itemOrder: number;
  description: string;
  quantity: number;
  unitPrice: number; // Rial
  discount: number;  // Rial
  taxRate: number;   // Percent (10)
  total: number;     // Rial
}

export interface Invoice {
  id: string;
  workspaceId?: string;
  customerId?: string | null;
  customerName?: string;
  number: number;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string | null;
  subtotal: number; // Rial
  discount: number; // Rial
  tax: number;      // Rial
  total: number;    // Rial
  notes?: string;
  items?: InvoiceItem[];
}

export interface Cheque {
  id: string;
  workspaceId?: string;
  paymentId?: string | null;
  customerId?: string | null;
  customerName?: string;
  sayadNumber: string;
  bankName: string;
  branchName?: string;
  accountOwner: string;
  amount: number; // Rial
  dueDate: string; // YYYY-MM-DD
  status: ChequeStatus;
  statusUpdatedAt?: string;
}

export interface CRMActivity {
  id: string;
  workspaceId?: string;
  subjectType: "deal" | "lead" | "customer" | "invoice";
  subjectId: string;
  kind: "call" | "meeting" | "note" | "email" | "stage_change" | "payment" | "cheque_status";
  body: string;
  callResult?: CallResult | null;
  happenedAt: string;
  createdBy?: string;
}

export type CRMNotificationType = "deal" | "lead" | "payment" | "customer" | "system";

export interface CRMNotification {
  id: string;
  title: string;
  description: string;
  time?: string;
  createdAt?: string;
  read: boolean;
  type: CRMNotificationType;
}
