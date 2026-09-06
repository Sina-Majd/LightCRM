export interface BusinessOrder {
  id: string;
  key: string;
  company: string;
  customer: string;
  orderTitle: string;
  amount: number;
  formattedAmount: string;
  orderStatus: "New" | "In Progress" | "Completed";
  invoiceStatus: "Paid" | "Pending" | "Sent";
  category: string;
  tagColor: string;
  date: string;
}

export interface OrderColumn {
  id: string;
  title: string;
  count: number;
  totalValue: string;
  orders: BusinessOrder[];
}

export const INITIAL_ORDERS_DATA: OrderColumn[] = [
  {
    id: "new_orders",
    title: "New Orders & Inquiries",
    count: 2,
    totalValue: "$6,450",
    orders: [
      {
        id: "order-101",
        key: "ORD-101",
        company: "Solstice Creative",
        customer: "Astrid Lindholm",
        orderTitle: "Brand Identity & Design System",
        amount: 4800,
        formattedAmount: "$4,800",
        orderStatus: "New",
        invoiceStatus: "Sent",
        category: "Creative Studio",
        tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        date: "Today, 10:30 AM",
      },
      {
        id: "order-102",
        key: "ORD-102",
        company: "GreenLeaf Cafe",
        customer: "David Vance",
        orderTitle: "Point-of-Sale Hardware Installation",
        amount: 1650,
        formattedAmount: "$1,650",
        orderStatus: "New",
        invoiceStatus: "Pending",
        category: "Retail Equipment",
        tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        date: "Yesterday",
      },
    ],
  },
  {
    id: "in_progress",
    title: "In Progress & Fulfillment",
    count: 2,
    totalValue: "$10,600",
    orders: [
      {
        id: "order-103",
        key: "ORD-103",
        company: "Apex Logistics",
        customer: "Marcus Chen",
        orderTitle: "Custom Fleet Inventory Portal",
        amount: 8400,
        formattedAmount: "$8,400",
        orderStatus: "In Progress",
        invoiceStatus: "Sent",
        category: "Software Project",
        tagColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        date: "Due Oct 15",
      },
      {
        id: "order-104",
        key: "ORD-104",
        company: "Urban Artisan Bakery",
        customer: "Elena Rostova",
        orderTitle: "Commercial Baking Supplies Restock",
        amount: 2200,
        formattedAmount: "$2,200",
        orderStatus: "In Progress",
        invoiceStatus: "Pending",
        category: "Wholesale Supplies",
        tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        date: "Due Oct 18",
      },
    ],
  },
  {
    id: "completed",
    title: "Completed & Invoiced",
    count: 2,
    totalValue: "$18,500",
    orders: [
      {
        id: "order-105",
        key: "ORD-105",
        company: "Beacon Technology",
        customer: "Michael Chang",
        orderTitle: "Annual IT Support & Maintenance Plan",
        amount: 12000,
        formattedAmount: "$12,000",
        orderStatus: "Completed",
        invoiceStatus: "Paid",
        category: "Service Contract",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        date: "Paid · Invoice #1084",
      },
      {
        id: "order-106",
        key: "ORD-106",
        company: "Nexus Creative Media",
        customer: "Jessica Reed",
        orderTitle: "Product Video Production & Promo",
        amount: 6500,
        formattedAmount: "$6,500",
        orderStatus: "Completed",
        invoiceStatus: "Paid",
        category: "Media Production",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        date: "Paid · Invoice #1083",
      },
    ],
  },
];

export interface RevenueChartPoint {
  month: string;
  received: number;
  invoiced: number;
}

export const MONTHLY_REVENUE_DATA: RevenueChartPoint[] = [
  { month: "Jan", received: 28, invoiced: 34 },
  { month: "Feb", received: 35, invoiced: 41 },
  { month: "Mar", received: 42, invoiced: 48 },
  { month: "Apr", received: 39, invoiced: 46 },
  { month: "May", received: 48, invoiced: 54 },
  { month: "Jun", received: 52, invoiced: 58 },
];

export const BUSINESS_DASHBOARD_STATS = {
  totalCustomers: "1,284",
  activeOrders: "42",
  monthlyRevenue: "$48,200",
  unpaidInvoices: "$14,250",
  paidOnTimeRate: "96.5%",
  avgInvoiceTurnaround: "3.2 days",
};

export const BUSINESS_CLIENT_LOGOS = [
  { name: "Agencies", badge: "Marketing & Dev" },
  { name: "Consultants", badge: "Strategy & Advisory" },
  { name: "Retail & Shops", badge: "Commerce" },
  { name: "Contractors", badge: "Trades & Services" },
  { name: "Online Stores", badge: "E-Commerce" },
  { name: "Freelancers", badge: "Solo Businesses" },
];

export const GENERAL_CRM_STATS = [
  {
    value: "100%",
    label: "Organized customer records & order history",
    subtext: "Never misplace a client phone number, past order detail, or outstanding payment.",
    highlight: "All customer data in one simple place",
  },
  {
    value: "2x Faster",
    label: "Invoice turnaround & client payments",
    subtext: "Send clean, professional invoices with 1 click and receive payments straight to your bank.",
    highlight: "Average 3 days to get paid",
  },
  {
    value: "5+ Hours",
    label: "Saved every week on admin & spreadsheets",
    subtext: "Replace messy spreadsheets, sticky notes, and paper receipts with automated order tracking.",
    highlight: "Reclaim your evenings and weekends",
  },
];

// Aliases for compatibility
export const CLIENT_LOGOS = BUSINESS_CLIENT_LOGOS;
export const CRM_STATS = GENERAL_CRM_STATS;
export const INITIAL_PIPELINE_DATA = INITIAL_ORDERS_DATA as any;
export const REVENUE_CHART_DATA = MONTHLY_REVENUE_DATA as any;
export const PIPELINE_REVENUE_METRICS = {
  onTimeRate: 96.5,
  monthlyRevenue: "$48,200",
  unpaidTotal: "$14,250",
  monthlyTarget: "$50,000",
  targetProgress: 96.4,
  avgInvoiceTurnaround: "3.2 days",
  chartData: MONTHLY_REVENUE_DATA,
};
