import { test } from "vitest";
import assert from "node:assert/strict";

import * as invoices from "@/lib/fa/invoices";
import * as dates from "@/lib/fa/jalali";
import * as pipeline from "@/lib/crm/pipeline";
import { dedupeById } from "@/lib/crm/collections";
import { saveDealOrder, orderDealsBySavedOrder } from "@/lib/crm/deal-order";
import { safeRedirectUrl } from "@/lib/auth/redirect";
import { normalizePhone, whatsappNumber } from "@/lib/fa/phone";
import { parseTomanInput } from "@/lib/fa/money";

test("Toman inputs preserve decimals and Persian separators without accepting negatives", () => {
  assert.equal(parseTomanInput("۱٬۲۳۴٫۵"), 12345);
  assert.equal(parseTomanInput("1,234.5"), 12345);
  assert.equal(parseTomanInput("١٢٣ تومان"), 1230);
  for (const value of ["-100", "1.2.3", "invalid", "Infinity"]) {
    assert.equal(parseTomanInput(value), 0);
  }
});

test("zero-quantity invoice rows contribute no money", () => {
  assert.deepEqual(invoices.calculateInvoiceTotals([
    { description: "Zero", quantity: 0, unit_price: 1000 },
    { description: "Sale", quantity: 2, unit_price: 1000, discount: 100, tax_rate: 10 },
  ]), { subtotal: 2000, discount: 100, tax: 190, total: 2090 });
});

test("zero VAT is preserved and line taxes round independently", () => {
  assert.equal(invoices.calculateItemTotal(2, 500, 0, 0).total, 1000);
  assert.deepEqual(invoices.calculateInvoiceTotals([
    { description: "A", quantity: 1, unit_price: 105, tax_rate: 10 },
    { description: "B", quantity: 1, unit_price: 105, tax_rate: 10 },
  ]), { subtotal: 210, discount: 0, tax: 22, total: 232 });
});

test("discounts cannot exceed the gross amount or increase the price", () => {
  assert.deepEqual(invoices.calculateInvoiceTotals([
    { description: "A", quantity: 1, unit_price: 100, discount: 200 },
    { description: "B", quantity: 1, unit_price: 100, discount: -20 },
  ]), { subtotal: 200, discount: 100, tax: 10, total: 110 });
});

test("non-finite and negative quantities never produce payable totals", () => {
  for (const quantity of [NaN, Infinity, -1]) {
    assert.deepEqual(invoices.calculateItemTotal(quantity, 100), { net: 0, tax: 0, total: 0 });
  }
});

test("invoice dates are overdue only after the local due day ends", () => {
  const now = new Date(2026, 9, 28, 18, 0);
  assert.equal(invoices.resolveInvoiceStatus(0, 100, "2026-10-28", "sent", now), "sent");
  assert.equal(invoices.resolveInvoiceStatus(0, 100, "2026-10-27", "sent", now), "overdue");
  assert.equal(invoices.resolveInvoiceStatus(100, 100, "2026-10-27", "sent", now), "paid");
  assert.equal(invoices.resolveInvoiceStatus(10, 100, "2026-10-27", "sent", now), "partially_paid");
  assert.equal(invoices.resolveInvoiceStatus(100, 100, "2026-10-27", "cancelled", now), "cancelled");
});

test("date-only values use local midnight and reject calendar overflow", () => {
  const date = dates.toValidDate("2026-10-28")!;
  assert.equal(date.getHours(), 0);
  assert.equal(dates.toLocalISODate(date), "2026-10-28");
  assert.equal(dates.toValidDate("2026-02-30"), null);
  assert.equal(dates.toValidDate("2026-13-01"), null);
  assert.equal(dates.toValidDate("invalid"), null);
  assert.ok(dates.toValidDate("2024-02-29"));
});

test("timestamp deadlines keep their time and do not mutate Date objects", () => {
  const deadline = new Date(2026, 9, 28, 10);
  assert.equal(dates.isOverdue(deadline, new Date(2026, 9, 28, 11)), true);
  assert.equal(dates.isOverdue(deadline, new Date(2026, 9, 28, 9)), false);
  assert.equal(deadline.getHours(), 10);
});

test("Jalali conversion round trips Nowruz and leap-year Esfand", () => {
  for (const [jy, jm, jd] of [[1403, 12, 30], [1404, 1, 1], [1405, 8, 6]]) {
    assert.deepEqual(dates.toJalaliParts(dates.fromJalaliParts(jy, jm, jd)), { jy, jm, jd });
  }
  assert.equal(dates.jalaliMonthLength(1403, 12), 30);
  assert.equal(dates.jalaliMonthLength(1404, 12), 29);
});

test("all pipeline entry points share the same stage probabilities", () => {
  const expected = [30, 50, 70, 85, 100];
  pipeline.DEFAULT_PIPELINE_STAGES.forEach((stage, index) => {
    assert.equal(pipeline.probabilityForStage(pipeline.DEFAULT_PIPELINE_STAGES, stage.id), expected[index]);
  });
  const custom = [{ ...pipeline.DEFAULT_PIPELINE_STAGES[0], id: "custom", title: "موفق و نهایی" }];
  assert.equal(pipeline.isWonStage(custom, "custom"), true);
  assert.equal(pipeline.probabilityForStage([], "missing"), 30);
});

test("deduplication preserves the first record and input order", () => {
  const first = { id: "a", value: 1 };
  const records = [first, { id: "a", value: 2 }, { id: "b" }];
  assert.deepEqual(dedupeById(records), [first, { id: "b" }]);
  assert.equal(records.length, 3);
});

function memoryStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
}

test("deal order is isolated by workspace and retains new records", () => {
  const storage = memoryStorage();
  const deals = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
  saveDealOrder([{ id: "b" }, { id: "a" }], "workspace:one", storage);
  assert.deepEqual(orderDealsBySavedOrder(deals, "workspace:one", storage).map((item) => item.id), ["b", "a", "c", "d"]);
  assert.deepEqual(orderDealsBySavedOrder(deals, "workspace:two", storage), deals);
  assert.equal(deals[0].id, "a");
});

test("corrupt and unavailable order storage cannot break the pipeline", () => {
  const deals = [{ id: "a" }];
  for (const raw of ["null", "{}", "[1]", "bad json"]) {
    assert.deepEqual(orderDealsBySavedOrder(deals, "one", { getItem: () => raw, setItem: () => {} }), deals);
  }
  const unavailable = { getItem() { throw Error("disabled"); }, setItem() { throw Error("full"); } };
  assert.deepEqual(orderDealsBySavedOrder(deals, "one", unavailable), deals);
  assert.doesNotThrow(() => saveDealOrder(deals, "one", unavailable));
});

test("auth return paths preserve local paths, queries and fragments", () => {
  assert.equal(safeRedirectUrl("https://crm.example", "/dashboard/tasks?q=one#today").href,
    "https://crm.example/dashboard/tasks?q=one#today");
});

test("auth redirects reject external URLs and URL parser control-character bypasses", () => {
  for (const path of [null, "https://evil.example", "//evil.example", "/\\evil.example", "/\t/evil.example", "/\n/evil.example", "javascript:alert(1)"]) {
    assert.equal(safeRedirectUrl("https://crm.example", path).href, "https://crm.example/dashboard");
  }
});

test("communication links accept Persian, Arabic and international numbers", () => {
  assert.equal(normalizePhone("۰۹۱۲ ۱۲۳ ۴۵۶۷"), "09121234567");
  assert.equal(whatsappNumber("٠٩١٢١٢٣٤٥٦٧"), "989121234567");
  assert.equal(whatsappNumber("+98 (912) 123-4567"), "989121234567");
  assert.equal(whatsappNumber("0098 912 1234567"), "989121234567");
});
