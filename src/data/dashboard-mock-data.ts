export type DealPriority = "urgent" | "high" | "medium" | "low";
export type LeadStatus = "hot" | "warm" | "qualified" | "cold";
export type LeadSource = "Website" | "LinkedIn" | "Referral" | "Outbound" | "Product Hunt";
export type CustomerTier = "Enterprise" | "Growth" | "Startup";
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
  value: number;
  formattedValue: string;
  stageId: string;
  priority: DealPriority;
  probability: number;
  tags: string[];
  notes: string;
  daysInStage: number;
  lastActivity: string;
  assignee: {
    name: string;
    avatar: string;
    initials: string;
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
  ltv: number;
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

export interface CRMNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "deal" | "lead" | "payment" | "system";
}

export const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-new",
    title: "New Inquiries",
    color: "text-cyan-400",
    accentBorder: "border-cyan-500/30",
    bgGradient: "from-cyan-500/10 to-transparent",
  },
  {
    id: "stage-qualified",
    title: "Qualified",
    color: "text-blue-400",
    accentBorder: "border-blue-500/30",
    bgGradient: "from-blue-500/10 to-transparent",
  },
  {
    id: "stage-proposal",
    title: "Proposal / Demo",
    color: "text-indigo-400",
    accentBorder: "border-indigo-500/30",
    bgGradient: "from-indigo-500/10 to-transparent",
  },
  {
    id: "stage-negotiation",
    title: "Negotiation",
    color: "text-amber-400",
    accentBorder: "border-amber-500/30",
    bgGradient: "from-amber-500/10 to-transparent",
  },
  {
    id: "stage-won",
    title: "Closed Won",
    color: "text-emerald-400",
    accentBorder: "border-emerald-500/30",
    bgGradient: "from-emerald-500/10 to-transparent",
  },
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: "deal-1",
    title: "Global Cloud Architecture Overhaul",
    company: "Apex Logistics & Tech",
    contact: "Marcus Chen",
    email: "marcus@apexlogistics.io",
    phone: "+1 (555) 349-2910",
    value: 28500,
    formattedValue: "$28,500",
    stageId: "stage-proposal",
    priority: "urgent",
    probability: 75,
    tags: ["Cloud Infra", "Annual Plan"],
    notes: "Executive demo scheduled with CTO on Thursday. Requested custom SLA addendum.",
    daysInStage: 4,
    lastActivity: "2 hours ago",
    assignee: {
      name: "Sarah Lin",
      avatar: "",
      initials: "SL",
    },
  },
  {
    id: "deal-2",
    title: "Brand Identity & Web Experience",
    company: "Solstice Creative Studio",
    contact: "Astrid Lindholm",
    email: "astrid@solsticecreative.dk",
    phone: "+45 20 48 91 00",
    value: 14200,
    formattedValue: "$14,200",
    stageId: "stage-new",
    priority: "high",
    probability: 40,
    tags: ["Design", "Retainer"],
    notes: "Inbound inquiry via website showcase. Fast turnaround requested for Q3 brand launch.",
    daysInStage: 1,
    lastActivity: "10 mins ago",
    assignee: {
      name: "Alex Rivera",
      avatar: "",
      initials: "AR",
    },
  },
  {
    id: "deal-3",
    title: "Retail POS Terminal Deployment",
    company: "GreenLeaf Artisanal Cafe",
    contact: "David Vance",
    email: "david@greenleafcafe.com",
    phone: "+1 (555) 781-4091",
    value: 8400,
    formattedValue: "$8,400",
    stageId: "stage-qualified",
    priority: "medium",
    probability: 60,
    tags: ["Hardware", "POS"],
    notes: "Expanding to 3 new locations downtown. Needs hardware delivery by next month.",
    daysInStage: 3,
    lastActivity: "Yesterday",
    assignee: {
      name: "Elena Rostova",
      avatar: "",
      initials: "ER",
    },
  },
  {
    id: "deal-4",
    title: "Enterprise Fleet Telemetry API",
    company: "OmniTrans Express",
    contact: "Kavita Sharma",
    email: "kavita@omnitrans.co",
    phone: "+1 (555) 620-1923",
    value: 45000,
    formattedValue: "$45,000",
    stageId: "stage-negotiation",
    priority: "urgent",
    probability: 85,
    tags: ["Enterprise", "API Integration"],
    notes: "Legal counsel reviewed Master Service Agreement. Final pricing approved.",
    daysInStage: 6,
    lastActivity: "3 hours ago",
    assignee: {
      name: "Sarah Lin",
      avatar: "",
      initials: "SL",
    },
  },
  {
    id: "deal-5",
    title: "Commercial Baking Automation System",
    company: "Urban Artisan Bakery",
    contact: "Julien Moreau",
    email: "julien@urbanbakery.fr",
    phone: "+33 1 42 68 55 00",
    value: 16800,
    formattedValue: "$16,800",
    stageId: "stage-won",
    priority: "high",
    probability: 100,
    tags: ["IoT Hardware", "Contract Signed"],
    notes: "Contract signed, deposit invoice of $8,400 paid via wire transfer.",
    daysInStage: 12,
    lastActivity: "Today, 9:15 AM",
    assignee: {
      name: "Alex Rivera",
      avatar: "",
      initials: "AR",
    },
  },
  {
    id: "deal-6",
    title: "Cybersecurity Compliance & Audit",
    company: "Beacon FinTech Labs",
    contact: "Michael Chang",
    email: "mchang@beacontech.io",
    phone: "+1 (555) 902-8841",
    value: 32000,
    formattedValue: "$32,000",
    stageId: "stage-proposal",
    priority: "high",
    probability: 70,
    tags: ["Security", "SOC-2"],
    notes: "Sent proposal version 2.1 incorporating vulnerability remediation timeline.",
    daysInStage: 2,
    lastActivity: "Yesterday",
    assignee: {
      name: "Elena Rostova",
      avatar: "",
      initials: "ER",
    },
  },
  {
    id: "deal-7",
    title: "Multi-channel Customer Support Setup",
    company: "Aura Home Living",
    contact: "Sophia Loren",
    email: "sophia@aurahome.de",
    phone: "+49 30 891 2341",
    value: 9500,
    formattedValue: "$9,500",
    stageId: "stage-new",
    priority: "low",
    probability: 35,
    tags: ["Customer Care", "SaaS"],
    notes: "Initial discovery call scheduled for tomorrow 2 PM CET.",
    daysInStage: 1,
    lastActivity: "4 hours ago",
    assignee: {
      name: "Sarah Lin",
      avatar: "",
      initials: "SL",
    },
  },
  {
    id: "deal-8",
    title: "Media Production & Video Assets",
    company: "Nexus Creative Media",
    contact: "Jessica Reed",
    email: "jessica@nexusmedia.tv",
    phone: "+1 (555) 438-7712",
    value: 18500,
    formattedValue: "$18,500",
    stageId: "stage-won",
    priority: "medium",
    probability: 100,
    tags: ["Video", "Retainer"],
    notes: "First monthly cycle completed. Client rated experience 10/10.",
    daysInStage: 18,
    lastActivity: "3 days ago",
    assignee: {
      name: "Alex Rivera",
      avatar: "",
      initials: "AR",
    },
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Rachel Thorne",
    company: "Vanguard Wealth Partners",
    email: "rachel@vanguardpartners.co",
    phone: "+1 (555) 401-8821",
    title: "VP of Client Operations",
    score: 96,
    status: "hot",
    source: "Website",
    estimatedValue: 35000,
    formattedValue: "$35,000",
    createdDate: "Today, 11:20 AM",
    notes: "Looking to replace legacy Salesforce installation for 25 advisors.",
    assignedTo: "Sarah Lin",
  },
  {
    id: "lead-2",
    name: "Dominic Silva",
    company: "BioSyn Medical Tech",
    email: "dominic.silva@biosyn.eu",
    phone: "+34 91 829 4401",
    title: "Chief Product Officer",
    score: 88,
    status: "hot",
    source: "LinkedIn",
    estimatedValue: 52000,
    formattedValue: "$52,000",
    createdDate: "Yesterday",
    notes: "Connected after attending the Techstars demo day keynote.",
    assignedTo: "Elena Rostova",
  },
  {
    id: "lead-3",
    name: "Amanda Hayes",
    company: "Skyline Architectural Design",
    email: "a.hayes@skylinearch.com",
    phone: "+1 (555) 772-3390",
    title: "Managing Principal",
    score: 74,
    status: "warm",
    source: "Referral",
    estimatedValue: 18000,
    formattedValue: "$18,000",
    createdDate: "2 days ago",
    notes: "Referred by Astrid Lindholm at Solstice Creative.",
    assignedTo: "Alex Rivera",
  },
  {
    id: "lead-4",
    name: "Tariq Mansour",
    company: "Oasis Logistics Gulf",
    email: "tariq@oasislogistics.ae",
    phone: "+971 4 812 9900",
    title: "Operations Director",
    score: 82,
    status: "qualified",
    source: "Outbound",
    estimatedValue: 60000,
    formattedValue: "$60,000",
    createdDate: "3 days ago",
    notes: "Evaluating fleet dispatch software with multi-currency invoice support.",
    assignedTo: "Sarah Lin",
  },
  {
    id: "lead-5",
    name: "Claire Becker",
    company: "Echo Sound Labs",
    email: "claire@echosound.io",
    phone: "+1 (555) 231-9087",
    title: "Head of Marketing",
    score: 58,
    status: "cold",
    source: "Product Hunt",
    estimatedValue: 9000,
    formattedValue: "$9,000",
    createdDate: "5 days ago",
    notes: "Downloaded the whitepaper on automated sales workflows.",
    assignedTo: "Elena Rostova",
  },
  {
    id: "lead-6",
    name: "Kenji Sato",
    company: "NeoTokyo Robotics",
    email: "sato.k@neotokyo-robotics.jp",
    phone: "+81 3 5510 4490",
    title: "Global Alliances Lead",
    score: 91,
    status: "hot",
    source: "Website",
    estimatedValue: 75000,
    formattedValue: "$75,000",
    createdDate: "May 12",
    notes: "Wants enterprise-wide API access with custom webhooks.",
    assignedTo: "Sarah Lin",
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Marcus Chen",
    company: "Apex Logistics & Tech",
    email: "marcus@apexlogistics.io",
    phone: "+1 (555) 349-2910",
    ltv: 118400,
    formattedLtv: "$118,400",
    activeDealsCount: 2,
    healthScore: 97,
    healthStatus: "excellent",
    tier: "Enterprise",
    renewalDate: "Dec 15, 2026",
    lastTouch: "Today, 9:30 AM",
    location: "Chicago, IL, USA",
    industry: "Logistics & Supply Chain",
  },
  {
    id: "cust-2",
    name: "Astrid Lindholm",
    company: "Solstice Creative Studio",
    email: "astrid@solsticecreative.dk",
    phone: "+45 20 48 91 00",
    ltv: 46500,
    formattedLtv: "$46,500",
    activeDealsCount: 1,
    healthScore: 94,
    healthStatus: "excellent",
    tier: "Growth",
    renewalDate: "Oct 20, 2026",
    lastTouch: "Yesterday",
    location: "Copenhagen, Denmark",
    industry: "Design & Advertising",
  },
  {
    id: "cust-3",
    name: "Michael Chang",
    company: "Beacon FinTech Labs",
    email: "mchang@beacontech.io",
    phone: "+1 (555) 902-8841",
    ltv: 89000,
    formattedLtv: "$89,000",
    activeDealsCount: 1,
    healthScore: 89,
    healthStatus: "good",
    tier: "Enterprise",
    renewalDate: "Jan 10, 2027",
    lastTouch: "3 days ago",
    location: "San Francisco, CA, USA",
    industry: "Financial Technology",
  },
  {
    id: "cust-4",
    name: "Julien Moreau",
    company: "Urban Artisan Bakery",
    email: "julien@urbanbakery.fr",
    phone: "+33 1 42 68 55 00",
    ltv: 24200,
    formattedLtv: "$24,200",
    activeDealsCount: 1,
    healthScore: 92,
    healthStatus: "good",
    tier: "Startup",
    renewalDate: "Aug 30, 2026",
    lastTouch: "Today",
    location: "Paris, France",
    industry: "Food & Beverage",
  },
  {
    id: "cust-5",
    name: "David Vance",
    company: "GreenLeaf Artisanal Cafe",
    email: "david@greenleafcafe.com",
    phone: "+1 (555) 781-4091",
    ltv: 18600,
    formattedLtv: "$18,600",
    activeDealsCount: 1,
    healthScore: 78,
    healthStatus: "warning",
    tier: "Startup",
    renewalDate: "Nov 05, 2026",
    lastTouch: "1 week ago",
    location: "Austin, TX, USA",
    industry: "Retail & Dining",
  },
  {
    id: "cust-6",
    name: "Jessica Reed",
    company: "Nexus Creative Media",
    email: "jessica@nexusmedia.tv",
    phone: "+1 (555) 438-7712",
    ltv: 54000,
    formattedLtv: "$54,000",
    activeDealsCount: 1,
    healthScore: 95,
    healthStatus: "excellent",
    tier: "Growth",
    renewalDate: "Sep 18, 2026",
    lastTouch: "4 days ago",
    location: "New York, NY, USA",
    industry: "Entertainment & Media",
  },
];

export const INITIAL_TASKS: CRMTask[] = [
  {
    id: "task-1",
    title: "Send revised cloud migration architecture & custom SLA",
    type: "email",
    dueDate: "Today at 3:00 PM",
    dueCategory: "today",
    priority: "urgent",
    completed: false,
    relatedTo: "Apex Logistics & Tech",
    relatedType: "deal",
  },
  {
    id: "task-2",
    title: "Conduct technical discovery call with VP Operations",
    type: "meeting",
    dueDate: "Today at 4:30 PM",
    dueCategory: "today",
    priority: "high",
    completed: false,
    relatedTo: "Vanguard Wealth Partners",
    relatedType: "lead",
  },
  {
    id: "task-3",
    title: "Confirm hardware shipment delivery date with freight partner",
    type: "call",
    dueDate: "Tomorrow at 10:00 AM",
    dueCategory: "upcoming",
    priority: "medium",
    completed: true,
    relatedTo: "GreenLeaf Artisanal Cafe",
    relatedType: "deal",
  },
  {
    id: "task-4",
    title: "Prepare Master Service Agreement countersignature packet",
    type: "review",
    dueDate: "Friday at 12:00 PM",
    dueCategory: "upcoming",
    priority: "urgent",
    completed: false,
    relatedTo: "OmniTrans Express",
    relatedType: "deal",
  },
  {
    id: "task-5",
    title: "Follow up on onboarding feedback and satisfaction survey",
    type: "email",
    dueDate: "In 3 days",
    dueCategory: "upcoming",
    priority: "low",
    completed: false,
    relatedTo: "Solstice Creative Studio",
    relatedType: "customer",
  },
];

export const INITIAL_NOTIFICATIONS: CRMNotification[] = [
  {
    id: "notif-1",
    title: "Deal stage advanced to Closed Won",
    description: "Alex Rivera moved 'Commercial Baking Automation' ($16,800) to Closed Won.",
    time: "15m ago",
    read: false,
    type: "deal",
  },
  {
    id: "notif-2",
    title: "New high-score inbound lead",
    description: "Rachel Thorne (Vanguard Wealth Partners) requested a demo. Score: 96/100.",
    time: "1h ago",
    read: false,
    type: "lead",
  },
  {
    id: "notif-3",
    title: "Invoice #1084 paid in full",
    description: "Solstice Creative paid $4,800 invoice via Stripe instant bank transfer.",
    time: "3h ago",
    read: true,
    type: "payment",
  },
  {
    id: "notif-4",
    title: "System sync completed",
    description: "Supabase real-time listeners synchronized with 0 conflicts.",
    time: "5h ago",
    read: true,
    type: "system",
  },
];

export const PIPELINE_ANALYTICS = {
  totalPipelineValue: 164400,
  formattedTotalValue: "$164,400",
  activeDealsCount: 8,
  wonThisMonth: 35300,
  formattedWonThisMonth: "$35,300",
  winRate: 74.2,
  avgDealCycleDays: 14.8,
  avgDealSize: 20550,
  formattedAvgDealSize: "$20,550",
  funnelMetrics: [
    { stage: "New Inquiries", count: 18, value: 148000, conversionRate: "100%" },
    { stage: "Qualified", count: 12, value: 112000, conversionRate: "66.7%" },
    { stage: "Proposal", count: 8, value: 88500, conversionRate: "44.4%" },
    { stage: "Negotiation", count: 5, value: 58000, conversionRate: "27.8%" },
    { stage: "Closed Won", count: 4, value: 35300, conversionRate: "22.2%" },
  ],
  monthlyPerformance: [
    { month: "Jan", target: 40, actual: 38, wonDeals: 6 },
    { month: "Feb", target: 45, actual: 44, wonDeals: 7 },
    { month: "Mar", target: 50, actual: 52, wonDeals: 9 },
    { month: "Apr", target: 55, actual: 51, wonDeals: 8 },
    { month: "May", target: 60, actual: 64, wonDeals: 11 },
    { month: "Jun", target: 65, actual: 71, wonDeals: 13 },
  ],
};
