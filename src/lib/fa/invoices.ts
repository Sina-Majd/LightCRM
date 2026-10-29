import { isOverdue } from "./jalali";

export type InvoiceType = "proforma" | "invoice";
export type InvoiceStatus = "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "cancelled";

export interface RawInvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number; // Rial
  discount?: number;  // Rial
  tax_rate?: number;  // Percentage, e.g. 10
  total?: number;     // Rial
}

export interface InvoiceCalculatedTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function itemAmounts(quantity: number, unitPrice: number, discount = 0, taxRate = 10) {
  const gross = nonNegative(quantity) * nonNegative(unitPrice);
  const appliedDiscount = Math.min(gross, nonNegative(discount));
  const net = gross - appliedDiscount;
  const tax = Math.round(net * (nonNegative(taxRate) / 100));
  return { gross, discount: appliedDiscount, net, tax, total: net + tax };
}

export function calculateItemTotal(
  quantity: number,
  unitPrice: number,
  discount: number = 0,
  taxRate: number = 10
): { net: number; tax: number; total: number } {
  const { net, tax, total } = itemAmounts(quantity, unitPrice, discount, taxRate);
  return { net, tax, total };
}

export function calculateInvoiceTotals(items: RawInvoiceItem[]): InvoiceCalculatedTotals {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

  for (const item of items) {
    const { gross, discount, tax, total } = itemAmounts(
      item.quantity,
      item.unit_price,
      item.discount,
      item.tax_rate ?? 10
    );

    subtotal += gross;
    totalDiscount += discount;
    totalTax += tax;
    grandTotal += total;
  }

  return {
    subtotal,
    discount: totalDiscount,
    tax: totalTax,
    total: grandTotal,
  };
}

export function resolveInvoiceStatus(
  paidSum: number,
  total: number,
  dueDateStr: string | null = null,
  currentStatus: InvoiceStatus = "draft",
  now: Date = new Date()
): InvoiceStatus {
  if (currentStatus === "cancelled") return "cancelled";
  if (total > 0 && paidSum >= total) return "paid";
  if (paidSum > 0 && paidSum < total) return "partially_paid";

  if (isOverdue(dueDateStr, now)) return "overdue";

  return currentStatus === "draft" ? "draft" : "sent";
}

export const INVOICE_STATUS_MAP: Record<
  InvoiceStatus,
  { label: string; badgeClass: string }
> = {
  draft: {
    label: "پیش‌نویس",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
  sent: {
    label: "ارسال‌شده",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50",
  },
  paid: {
    label: "تسویه کامل",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
  },
  partially_paid: {
    label: "وصول ناقص",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50",
  },
  overdue: {
    label: "سررسید گذشته",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50",
  },
  cancelled: {
    label: "باطل‌شده",
    badgeClass: "bg-slate-200 text-slate-500 border-slate-300 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800",
  },
};

export const INVOICE_TYPE_MAP: Record<InvoiceType, string> = {
  proforma: "پیش‌فاکتور",
  invoice: "فاکتور رسمی",
};
