import { describe, expect, it } from "vitest";
import { invoiceMonthlySeries } from "@/lib/crm/analytics";
import { isInvoiceOverdue, isOpenInvoice } from "@/lib/crm/invoices";
import type { Invoice } from "@/lib/crm/types";
import { fromJalaliParts, toLocalISODate } from "@/lib/fa/jalali";

const invoice = (changes: Partial<Invoice>): Invoice => ({
  id: "invoice", number: 1001, type: "invoice", status: "sent",
  issueDate: toLocalISODate(fromJalaliParts(1405, 1, 15)),
  subtotal: 1000, discount: 0, tax: 0, total: 1000, ...changes,
});

it("excludes paid invoices and proformas from receivables and evaluates overdue dates at day end", () => {
  const now = new Date(2026, 9, 28, 18);
  expect(isOpenInvoice(invoice({ status: "paid", dueDate: "2026-10-01" }))).toBe(false);
  expect(isOpenInvoice(invoice({ type: "proforma", status: "overdue" }))).toBe(false);
  expect(isInvoiceOverdue(invoice({ status: "partially_paid", dueDate: "2026-10-29" }), now)).toBe(false);
  expect(isInvoiceOverdue(invoice({ dueDate: "2026-10-28" }), now)).toBe(false);
  expect(isInvoiceOverdue(invoice({ dueDate: "2026-10-27" }), now)).toBe(true);
  expect(isInvoiceOverdue(invoice({ status: "overdue", dueDate: null }), now)).toBe(true);
});

describe("monthly invoice reporting", () => {
  it("spans six Jalali months across a year boundary and keeps empty months", () => {
    const result = invoiceMonthlySeries([], fromJalaliParts(1405, 2, 1));
    expect(result.map((month) => month.key)).toEqual(["1404-9", "1404-10", "1404-11", "1404-12", "1405-1", "1405-2"]);
    expect(result.every((month) => month.issued === 0 && month.paid === 0)).toBe(true);
  });

  it("separates issued and settled invoices without counting drafts, proformas or cancelled rows", () => {
    const result = invoiceMonthlySeries([
      invoice({}), invoice({ status: "paid", total: 500 }),
      invoice({ status: "draft" }), invoice({ status: "cancelled" }),
      invoice({ type: "proforma" }), invoice({ issueDate: "invalid" }),
    ], fromJalaliParts(1405, 2, 1));
    expect(result.find((month) => month.key === "1405-1")).toMatchObject({ issued: 1500, paid: 500 });
  });
});
