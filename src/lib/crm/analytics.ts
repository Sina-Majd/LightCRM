import type { Invoice } from "./types";
import { fromJalaliParts, JALALI_MONTH_NAMES, toJalaliParts } from "../fa/jalali";
import { isIssuedInvoice } from "./invoices";

/** Invoice amounts by issue month; paid means fully settled, not a payment-date report. */
export function invoiceMonthlySeries(invoices: readonly Invoice[], now = new Date()) {
  const current = toJalaliParts(now);
  if (!current) return [];
  const series = Array.from({ length: 6 }, (_, index) => {
    const offset = current.jm - 1 - (5 - index);
    const year = current.jy + Math.floor(offset / 12);
    const month = ((offset % 12) + 12) % 12 + 1;
    return {
      key: `${year}-${month}`,
      monthName: JALALI_MONTH_NAMES[month - 1],
      start: fromJalaliParts(year, month, 1),
      issued: 0,
      paid: 0,
    };
  });
  const byMonth = new Map(series.map((month) => [month.key, month]));
  for (const invoice of invoices) {
    if (!isIssuedInvoice(invoice)) continue;
    const date = toJalaliParts(invoice.issueDate);
    if (!date || !Number.isFinite(invoice.total) || invoice.total < 0) continue;
    const month = byMonth.get(`${date.jy}-${date.jm}`);
    if (!month) continue;
    month.issued += invoice.total;
    if (invoice.status === "paid") month.paid += invoice.total;
  }
  return series;
}
