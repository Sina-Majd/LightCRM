import {
  formatToman,
  CustomerType,
  CustomerSegment,
  InvoiceType,
  InvoiceStatus,
  ChequeStatus,
  CallResult,
} from "@/lib/fa";

export type DealPriority = "urgent" | "high" | "medium" | "low";
export type LeadStatus = "hot" | "warm" | "qualified" | "cold";
export type LeadSource = "وبسایت" | "لینکدین" | "معرفی" | "تماس مستقیم" | "نمایشگاه";
export type CustomerTier = "سازمانی" | "در حال رشد" | "استارتاپ" | "Enterprise" | "Growth" | "Startup";
export type CustomerHealth = "excellent" | "good" | "warning" | "critical";

export const PIPELINE_ANALYTICS = {
  winRate: 68.4,
  formattedWinRate: "۶۸٫۴٪",
  formattedAvgDealSize: "۲۴٫۵ میلیون تومان",
  avgDealCycleDays: 14,
  monthlyPerformance: [
    { month: "Jan", actual: 120, target: 100 },
    { month: "Feb", actual: 145, target: 120 },
    { month: "Mar", actual: 190, target: 150 },
    { month: "Apr", actual: 220, target: 180 },
    { month: "May", actual: 260, target: 220 },
    { month: "Jun", actual: 310, target: 260 },
  ],
  funnelMetrics: [
    { stage: "سرنخ جدید", count: 42, conversionRate: "۱۰۰٪" },
    { stage: "بررسی و صلاحیت", count: 28, conversionRate: "۶۶٪" },
    { stage: "ارسال پیش‌فاکتور", count: 18, conversionRate: "۴۲٪" },
    { stage: "مذاکره و توافق", count: 12, conversionRate: "۲۸٪" },
    { stage: "موفق و بسته شد", count: 9, conversionRate: "۲۱٪" },
  ],
};


export interface StageTheme {
  color: string;
  accentBorder: string;
  bgGradient: string;
}

export const STAGE_THEMES: Record<string, StageTheme> = {
  "stage-new": {
    color: "text-cyan-600 dark:text-cyan-400",
    accentBorder: "border-cyan-500/30",
    bgGradient: "from-cyan-500/10 to-transparent",
  },
  "stage-qualified": {
    color: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-blue-500/30",
    bgGradient: "from-blue-500/10 to-transparent",
  },
  "stage-proposal": {
    color: "text-indigo-600 dark:text-indigo-400",
    accentBorder: "border-indigo-500/30",
    bgGradient: "from-indigo-500/10 to-transparent",
  },
  "stage-negotiation": {
    color: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-500/30",
    bgGradient: "from-amber-500/10 to-transparent",
  },
  "stage-won": {
    color: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/30",
    bgGradient: "from-emerald-500/10 to-transparent",
  },
};

export const DEFAULT_STAGE_THEME: StageTheme = {
  color: "text-cyan-600 dark:text-cyan-400",
  accentBorder: "border-cyan-500/30",
  bgGradient: "from-cyan-500/10 to-transparent",
};

export function getStageTheme(stageId: string): StageTheme {
  return STAGE_THEMES[stageId] ?? DEFAULT_STAGE_THEME;
}

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

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  title: string;
  score: number;
  status: LeadStatus;
  source: LeadSource;
  estimatedValue: number;
  formattedValue: string;
  createdDate: string;
  notes: string;
  assignedTo: string;
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

// -----------------------------------------------------------------
// INITIAL SEED DATA
// -----------------------------------------------------------------

export const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-new",
    title: "سرنخ جدید",
    ...STAGE_THEMES["stage-new"],
  },
  {
    id: "stage-qualified",
    title: "بررسی و صلاحیت",
    ...STAGE_THEMES["stage-qualified"],
  },
  {
    id: "stage-proposal",
    title: "ارسال پیش‌فاکتور",
    ...STAGE_THEMES["stage-proposal"],
  },
  {
    id: "stage-negotiation",
    title: "مذاکره و توافق",
    ...STAGE_THEMES["stage-negotiation"],
  },
  {
    id: "stage-won",
    title: "موفق و بسته شد",
    ...STAGE_THEMES["stage-won"],
  },
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: "deal-1",
    title: "پیاده‌سازی اتوماسیون ابری سازمانی",
    company: "شرکت داده‌پردازی پردیس",
    contact: "محمد سعادتی",
    email: "saadati@pardisdata.ir",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    value: 285_000_000,
    formattedValue: formatToman(285_000_000),
    stageId: "stage-proposal",
    priority: "urgent",
    probability: 75,
    tags: ["قرارداد سالانه", "زیرساخت ابری"],
    notes: "جلسه دمو با مدیر فناوری برگزار شد. پیش‌فاکتور رسمی ارسال شده و منتظر تایید مالی هستند.",
    daysInStage: 4,
    lastActivity: "۲ ساعت پیش",
    nextActionTitle: "تماس جهت تایید نهایی پیش‌فاکتور",
    nextActionDue: new Date(Date.now() + 3600 * 1000 * 2).toISOString(), // 2 hours from now
    assignee: {
      name: "سینا مجد",
      avatar: "",
    },
  },
  {
    id: "deal-2",
    title: "بازطراحی پرتال مشتریان و برندینگ",
    company: "استودیو معماری هور",
    contact: "سارا نیکنام",
    email: "s.niknam@hoor-studio.com",
    phone: "۰۹۱۹۸۷۶۵۴۳۲",
    value: 142_000_000,
    formattedValue: formatToman(142_000_000),
    stageId: "stage-new",
    priority: "high",
    probability: 40,
    tags: ["طراحی UI/UX", "ریزاین"],
    notes: "درخواست مشاوره از طریق فرم سایت. پیگیری سریع نیاز دارند.",
    daysInStage: 1,
    lastActivity: "۱۰ دقیقه پیش",
    nextActionTitle: null, // Stale deal example!
    nextActionDue: null,
    assignee: {
      name: "علیرضا رضایی",
      avatar: "",
    },
  },
  {
    id: "deal-3",
    title: "تجهیز پایانه فروش شعب زنجیره‌ای",
    company: "کافه‌رستوران‌های نارنجستان",
    contact: "داوود فصیحی",
    email: "fasihi@narenjestan.ir",
    phone: "۰۹۱۲۱۱۱۴۴۵۵",
    value: 84_000_000,
    formattedValue: formatToman(84_000_000),
    stageId: "stage-qualified",
    priority: "medium",
    probability: 60,
    tags: ["سخت‌افزار", "شعب"],
    notes: "تجهیز ۳ شعبه جدید در تهران و شیراز. نیاز به ارسال نمونه قرارداد دارند.",
    daysInStage: 3,
    lastActivity: "دیروز",
    nextActionTitle: "هماهنگی جلسه فنی آنلاین",
    nextActionDue: new Date(Date.now() - 3600 * 1000 * 14).toISOString(), // Overdue example!
    assignee: {
      name: "سینا مجد",
      avatar: "",
    },
  },
  {
    id: "deal-4",
    title: "قرارداد API تلمتری ناوگان حمل‌ونقل",
    company: "گروه لجستیک پیشتاز ترابر",
    contact: "حمید کاظمی",
    email: "kazemi@pishtaz-logistics.ir",
    phone: "۰۹۳۵۱۲۳۴۵۶۷",
    value: 450_000_000,
    formattedValue: formatToman(450_000_000),
    stageId: "stage-negotiation",
    priority: "urgent",
    probability: 85,
    tags: ["قرارداد شرکتی", "API"],
    notes: "شرایط حقوقی قرارداد بررسی شد. دریافت چک پیش‌پرداخت در حال هماهنگی است.",
    daysInStage: 6,
    lastActivity: "۳ ساعت پیش",
    nextActionTitle: "دریافت چک صیادی پیش‌پرداخت",
    nextActionDue: new Date(Date.now() + 3600 * 1000 * 24).toISOString(),
    assignee: {
      name: "سینا مجد",
      avatar: "",
    },
  },
  {
    id: "deal-5",
    title: "اتوماسیون انبار و پایش بارکد",
    company: "صنایع غذایی زرین‌دشت",
    contact: "پیمان امینی",
    email: "amini@zarindasht.ir",
    phone: "۰۹۱۲۷۷۷۸۸۹۹",
    value: 168_000_000,
    formattedValue: formatToman(168_000_000),
    stageId: "stage-won",
    priority: "high",
    probability: 100,
    tags: ["تسویه شده", "امضای قرارداد"],
    notes: "قرارداد منعقد شد، چک ضمانت و قسط اول وصول گردید.",
    daysInStage: 12,
    lastActivity: "امروز",
    nextActionTitle: "تحویل فاز اول پروژه",
    nextActionDue: new Date(Date.now() + 3600 * 1000 * 72).toISOString(),
    assignee: {
      name: "علیرضا رضایی",
      avatar: "",
    },
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "شرکت داده‌پردازی پردیس",
    company: "داده‌پردازی پردیس آریا (سهامی خاص)",
    email: "info@pardisdata.ir",
    phone: "۰۲۱۸۸۹۹۲۲۳۳",
    customerType: "company",
    nationalId: "۱۰۱۰۳۴۵۸۹۲۰",
    economicCode: "۴۱۱۵۶۷۸۹۱",
    segment: "customer",
    ltv: 420_000_000,
    formattedLtv: formatToman(420_000_000),
    activeDealsCount: 2,
    healthScore: 94,
    healthStatus: "excellent",
    tier: "سازمانی",
    renewalDate: "۶ ماه دیگر",
    lastTouch: "۲ ساعت پیش",
    location: "تهران، میدان ونک",
    industry: "فناوری اطلاعات و شبکه",
  },
  {
    id: "cust-2",
    name: "استودیو معماری هور",
    company: "مهندسان مشاور هور سازه",
    email: "contact@hoor-studio.com",
    phone: "۰۹۱۹۸۷۶۵۴۳۲",
    customerType: "company",
    nationalId: "۱۰۳۲۰۰۱۱۴۵۹",
    economicCode: "۴۱۱۳۳۲۲۴۴",
    segment: "lead",
    ltv: 142_000_000,
    formattedLtv: formatToman(142_000_000),
    activeDealsCount: 1,
    healthScore: 78,
    healthStatus: "good",
    tier: "استارتاپ",
    renewalDate: "سرنخ جدید",
    lastTouch: "۱۰ دقیقه پیش",
    location: "تهران، شهرک غرب",
    industry: "طراحی و معماری",
  },
  {
    id: "cust-3",
    name: "مهندس رضا کریمی",
    company: "دفتر فنی مهندسی آریا",
    email: "reza.karimi@gmail.com",
    phone: "۰۹۱۲۳۳۳۴۴۵۵",
    customerType: "individual",
    nationalId: "۰۰۷۸۹۱۱۲۳۴",
    economicCode: null,
    segment: "customer",
    ltv: 95_000_000,
    formattedLtv: formatToman(95_000_000),
    activeDealsCount: 1,
    healthScore: 88,
    healthStatus: "good",
    tier: "در حال رشد",
    renewalDate: "۳ ماه دیگر",
    lastTouch: "دیروز",
    location: "اصفهان، خیابان چهارباغ",
    industry: "تجهیزات صنعتی",
  },
  {
    id: "cust-4",
    name: "گروه لجستیک پیشتاز ترابر",
    company: "پیشتاز ترابر خاورمیانه",
    email: "ops@pishtaz-logistics.ir",
    phone: "۰۲۱۶۶۵۵۴۴۳۳",
    customerType: "company",
    nationalId: "۱۰۲۶۰۰۷۸۹۴۱",
    economicCode: "۴۱۱۸۸۹۹۰۰",
    segment: "customer",
    ltv: 850_000_000,
    formattedLtv: formatToman(850_000_000),
    activeDealsCount: 1,
    healthScore: 92,
    healthStatus: "excellent",
    tier: "سازمانی",
    renewalDate: "سالانه",
    lastTouch: "۳ ساعت پیش",
    location: "بندرعباس / تهران",
    industry: "حمل و نقل بین‌المللی",
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-101",
    customerId: "cust-1",
    customerName: "شرکت داده‌پردازی پردیس",
    number: 1024,
    type: "proforma",
    status: "sent",
    issueDate: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    dueDate: new Date(Date.now() + 3600 * 1000 * 72).toISOString(),
    subtotal: 285_000_000,
    discount: 15_000_000,
    tax: 27_000_000,
    total: 297_000_000,
    notes: "پیش‌فاکتور معتبر به مدت ۵ روز کاری. پرداخت به صورت چک صیادی ۳۰ روزه یا حواله پایا.",
    items: [
      {
        id: "item-1",
        invoiceId: "inv-101",
        itemOrder: 1,
        description: "لایسنس نرم‌افزار سالانه اتوماسیون ابری (۱۰ کاربر)",
        quantity: 1,
        unitPrice: 200_000_000,
        discount: 10_000_000,
        taxRate: 10,
        total: 209_000_000,
      },
      {
        id: "item-2",
        invoiceId: "inv-101",
        itemOrder: 2,
        description: "نصب، راه‌اندازی و آموزش تیم فروش و پشتیبانی",
        quantity: 1,
        unitPrice: 85_000_000,
        discount: 5_000_000,
        taxRate: 10,
        total: 88_000_000,
      },
    ],
  },
  {
    id: "inv-102",
    customerId: "cust-4",
    customerName: "گروه لجستیک پیشتاز ترابر",
    number: 1025,
    type: "invoice",
    status: "partially_paid",
    issueDate: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
    dueDate: new Date(Date.now() + 3600 * 1000 * 120).toISOString(),
    subtotal: 450_000_000,
    discount: 20_000_000,
    tax: 43_000_000,
    total: 473_000_000,
    notes: "فاکتور رسمی مرحله اول تلمتری ناوگان - قسط اول به مبلغ ۲۰۰ میلیون ریال وصول شد.",
    items: [
      {
        id: "item-3",
        invoiceId: "inv-102",
        itemOrder: 1,
        description: "اشتراک اتصال وب‌سرویس و سنسورهای GPS (۵۰ دستگاه)",
        quantity: 50,
        unitPrice: 9_000_000,
        discount: 20_000_000,
        taxRate: 10,
        total: 473_000_000,
      },
    ],
  },
];

export const INITIAL_CHEQUES: Cheque[] = [
  {
    id: "chq-1",
    customerId: "cust-1",
    customerName: "شرکت داده‌پردازی پردیس",
    sayadNumber: "1234567890123456",
    bankName: "بانک ملت",
    branchName: "شعبه ونک (کد ۶۵۴۱)",
    accountOwner: "محمد سعادتی - مدیر مالی",
    amount: 150_000_000,
    dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 4).toISOString().split("T")[0],
    status: "in_hand",
    statusUpdatedAt: new Date().toISOString(),
  },
  {
    id: "chq-2",
    customerId: "cust-4",
    customerName: "گروه لجستیک پیشتاز ترابر",
    sayadNumber: "9876543210987654",
    bankName: "بانک صادرات ایران",
    branchName: "شعبه مرکزی",
    accountOwner: "حمید کاظمی",
    amount: 200_000_000,
    dueDate: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString().split("T")[0],
    status: "cleared",
    statusUpdatedAt: new Date().toISOString(),
  },
  {
    id: "chq-3",
    customerId: "cust-3",
    customerName: "مهندس رضا کریمی",
    sayadNumber: "5544332211009988",
    bankName: "بانک پاسارگاد",
    branchName: "شعبه چهارباغ",
    accountOwner: "رضا کریمی",
    amount: 95_000_000,
    dueDate: new Date(Date.now() + 3600 * 1000 * 24 * 12).toISOString().split("T")[0],
    status: "deposited",
    statusUpdatedAt: new Date().toISOString(),
  },
];

export const INITIAL_TASKS: CRMTask[] = [
  {
    id: "task-1",
    title: "تماس تلفنی برای استعلام پیش‌فاکتور داده‌پردازی پردیس",
    type: "call",
    dueDate: new Date().toISOString().split("T")[0],
    dueCategory: "today",
    priority: "urgent",
    completed: false,
    relatedTo: "شرکت داده‌پردازی پردیس",
    relatedType: "deal",
  },
  {
    id: "task-2",
    title: "واگذاری چک صیادی بانک ملت به شعبه جهت وصول",
    type: "review",
    dueDate: new Date(Date.now() + 3600 * 1000 * 24).toISOString().split("T")[0],
    dueCategory: "upcoming",
    priority: "high",
    completed: false,
    relatedTo: "چک ۱۵ میلیون تومانی ملت",
    relatedType: "customer",
  },
  {
    id: "task-3",
    title: "پیگیری معوق: ارسال کاتالوگ و شرایط پرداخت به کافه نارنجستان",
    type: "email",
    dueDate: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString().split("T")[0],
    dueCategory: "overdue",
    priority: "medium",
    completed: false,
    relatedTo: "کافه‌رستوران‌های نارنجستان",
    relatedType: "deal",
  },
];

export const INITIAL_ACTIVITIES: CRMActivity[] = [
  {
    id: "act-1",
    subjectType: "deal",
    subjectId: "deal-1",
    kind: "call",
    body: "تماس تلفنی با مدیر خرید، پیش‌فاکتور ۱۰۲۴ تایید اولیه شد.",
    callResult: "connected",
    happenedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    createdBy: "سینا مجد",
  },
  {
    id: "act-2",
    subjectType: "invoice",
    subjectId: "inv-101",
    kind: "payment",
    body: "چک صیادی شماره ۱۲۳۴-۵۶۷۸-۹۰۱۲-۳۴۵۶ به مبلغ ۱۵ میلیون تومان دریافت و ثبت گردید.",
    happenedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    createdBy: "سینا مجد",
  },
  {
    id: "act-3",
    subjectType: "deal",
    subjectId: "deal-4",
    kind: "stage_change",
    body: "معامله به مرحله «مذاکره و توافق» منتقل شد.",
    happenedAt: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
    createdBy: "سینا مجد",
  },
];

export const INITIAL_NOTIFICATIONS: CRMNotification[] = [
  {
    id: "notif-1",
    title: "چک در آستانه سررسید",
    description: "چک ۱۵ میلیون تومانی بانک ملت طی ۴ روز آینده سررسید می‌شود.",
    time: "۱۰ دقیقه پیش",
    read: false,
    type: "payment",
  },
  {
    id: "notif-2",
    title: "هشدار معامله رهاشده",
    description: "معامله «بازطراحی استودیو هور» فاقد اقدام بعدی است.",
    time: "۱ ساعت پیش",
    read: false,
    type: "deal",
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "سارا نیکنام",
    company: "استودیو معماری هور",
    email: "s.niknam@hoor-studio.com",
    phone: "۰۹۱۹۸۷۶۵۴۳۲",
    title: "مدیر طراحی",
    score: 85,
    status: "hot",
    source: "وبسایت",
    estimatedValue: 142_000_000,
    formattedValue: formatToman(142_000_000),
    createdDate: "امروز",
    notes: "نیاز فوری به بازطراحی وب‌سایت و هویت بصری دارند.",
    assignedTo: "علیرضا رضایی",
  },
];
