import type { Invoice } from "./types";
import { isOverdue } from "../fa/jalali";

export function isIssuedInvoice(invoice: Invoice): boolean {
  return invoice.type === "invoice" && invoice.status !== "draft" && invoice.status !== "cancelled";
}

export function isOpenInvoice(invoice: Invoice): boolean {
  return isIssuedInvoice(invoice) && invoice.status !== "paid";
}

export function isInvoiceOverdue(invoice: Invoice, now = new Date()): boolean {
  return isOpenInvoice(invoice) && (invoice.status === "overdue" || isOverdue(invoice.dueDate, now));
}
