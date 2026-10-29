import { expect, test, vi } from "vitest";
import assert from "node:assert/strict";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import * as service from "@/lib/supabase/crm-service";

vi.mock("@/lib/supabase/client", () => ({ createClient: vi.fn() }));

interface CapturedRequest {
  table: string;
  operation: string;
  filters: [string, string | boolean][];
  payload: Record<string, unknown>;
  items: Record<string, unknown>[];
  columns: string | null;
  single: boolean;
}
interface QueryResponse { data: unknown; error: { message: string; code?: string } | null }

function serviceWith(respond: (request: CapturedRequest) => QueryResponse) {
  const requests: CapturedRequest[] = [];
  const client = createSupabaseClient("https://database.test", "test-publishable-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (input, init) => {
      const request = new Request(input, init);
      const url = new URL(request.url);
      const body: unknown = request.method === "POST" || request.method === "PATCH" ? await request.json() : {};
      const captured: CapturedRequest = {
        table: url.pathname.split("/").at(-1)!,
        operation: ({ POST: "insert", PATCH: "update", DELETE: "delete" } as Record<string, string>)[request.method] ?? "select",
        filters: [...url.searchParams].filter(([, value]) => value.startsWith("eq.")).map(([key, value]) => {
          const raw = value.slice(3);
          return [key, raw === "false" ? false : raw === "true" ? true : raw];
        }),
        payload: !Array.isArray(body) && body && typeof body === "object" ? body as Record<string, unknown> : {},
        items: Array.isArray(body) ? body : [],
        columns: url.searchParams.get("select"),
        single: request.headers.get("accept")?.includes("vnd.pgrst.object") ?? false,
      };
      requests.push(captured);
      const response = respond(captured);
      return new Response(JSON.stringify(response.error ?? response.data), {
        status: response.error ? 403 : 200,
        headers: { "Content-Type": "application/json" },
      });
    } },
  });
  vi.mocked(createClient).mockReturnValue(client);
  return { service, requests };
}

const denied = { data: null, error: { message: "Permission denied" } };

test("resource read errors are surfaced instead of returning demo records", async () => {
  const { service } = serviceWith(() => denied);
  for (const method of ["fetchDeals", "fetchCustomers", "fetchInvoices", "fetchCheques", "fetchTasks", "fetchActivities", "fetchNotifications", "fetchPipelineStages"]) {
    await assert.rejects(service[method as keyof Pick<typeof service, "fetchDeals" | "fetchCustomers" | "fetchInvoices" | "fetchCheques" | "fetchTasks" | "fetchActivities" | "fetchNotifications" | "fetchPipelineStages">]("workspace-one"), /Permission denied/);
  }
});

test("empty customer resources remain empty and built-in stages remain available", async () => {
  const { service } = serviceWith(() => ({ data: [], error: null }));
  assert.deepEqual(await service.fetchDeals(), []);
  assert.deepEqual(await service.fetchInvoices(), []);
  assert.equal((await service.fetchPipelineStages()).length, 5);
});

test("every update, deletion, call log and notification write checks its result", async () => {
  const { service } = serviceWith(() => denied);
  const operations = [
    () => service.updateDealStage("id", "stage-won", 100),
    () => service.updateDealNextAction("id", "Call", null),
    () => service.updateDealNotes("id", "Saved note"),
    () => service.deleteDeal("id"),
    () => service.deleteCustomer("id"),
    () => service.updateChequeStatus("id", "cleared"),
    () => service.toggleTask("id", true),
    () => service.updateTaskDueDate("id", "2099-01-01"),
    () => service.deleteTask("id"),
    () => service.markNotificationRead("id"),
    () => service.markAllNotificationsRead("workspace-one"),
    () => service.logQuickCall("workspace-one", "user", "deal", "id", "busy"),
    () => service.updateUserStatus("user", "Away"),
  ];
  for (const operation of operations) await assert.rejects(operation(), /Permission denied/);
});

test("single-record writes require a returned row so RLS misses are observable", async () => {
  const { service, requests } = serviceWith(() => ({ data: { id: "id" }, error: null }));
  await service.updateDealStage("id", "stage-won", 100);
  await service.deleteTask("id");
  assert.ok(requests.every((request) => request.single && request.columns === "id"));
});

test("failed creates cannot be mistaken for saved records", async () => {
  const { service } = serviceWith(() => denied);
  await assert.rejects(service.createDeal("workspace-one", "user", {}), /Permission denied/);
  await assert.rejects(service.createCustomer("workspace-one", "user", {}), /Permission denied/);
  await assert.rejects(service.createTask("workspace-one", "user", {}), /Permission denied/);
  await assert.rejects(service.createCheque("workspace-one", {}), /Permission denied/);
});

test("customer creation preserves a legitimate health score of zero", async () => {
  const { service, requests } = serviceWith((request) => ({ data: { id: "customer", ...request.payload }, error: null }));
  const created = await service.createCustomer("workspace-one", "user", { name: "Customer", healthScore: 0 });
  assert.equal(created.healthScore, 0);
  assert.equal(requests[0].payload.workspace_id, "workspace-one");
  assert.equal(requests[0].payload.user_id, "user");
});

const rawItems = [{ description: "Service", quantity: 2, unit_price: 500, discount: 100, tax_rate: 0, total: 99999 }];

test("an invoice permission error never falls back to separate table writes", async () => {
  const { service, requests } = serviceWith(() => denied);
  await assert.rejects(service.createInvoice("workspace-one", {}, rawItems), /Permission denied/);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].table, "create_invoice_with_items");
});

test("invoice creation uses one RPC and returns the server totals and customer snapshot", async () => {
  const { service, requests } = serviceWith(() => ({ data: {
    id: "saved", customer_name: "Saved customer", workspace_id: "workspace-one", number: 1010, type: "invoice", status: "draft",
    issue_date: "2026-10-28", subtotal: "1000", discount: "100", tax: "0", total: "900",
    items: [{ id: "line", invoice_id: "saved", item_order: 1, description: "Service", quantity: "2", unit_price: "500", discount: "100", tax_rate: "0", total: "900" }],
  }, error: null }));
  const saved = await service.createInvoice("workspace-one", { customerName: "Customer", total: 999999 }, rawItems);
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({ table: "create_invoice_with_items", payload: { workspace: "workspace-one", lines: rawItems } });
  expect(saved).toMatchObject({ id: "saved", number: 1010, total: 900, customerName: "Saved customer", items: [{ taxRate: 0, total: 900 }] });
});

test("task rescheduling persists its date and derived category", async () => {
  const { service, requests } = serviceWith(() => ({ data: { id: "task" }, error: null }));
  await service.updateTaskDueDate("task", "2099-01-01");
  expect(requests[0]).toMatchObject({ operation: "update", payload: { due_date: "2099-01-01", due_category: "upcoming" }, filters: [["id", "task"]] });
});

test("profile membership lookup failures are surfaced instead of silently removing the workspace scope", async () => {
  const { service } = serviceWith((request) => request.table === "profiles" ? { data: { id: "user" }, error: null } : denied);
  await expect(service.fetchUserProfile("user")).rejects.toThrow("Permission denied");
});

test("invalid invoice rows are rejected before issuing any database write", async () => {
  const { service, requests } = serviceWith(() => ({ data: null, error: null }));
  for (const items of [[], [{ ...rawItems[0], quantity: 0 }], [{ ...rawItems[0], tax_rate: -1 }]]) {
    await assert.rejects(service.createInvoice("workspace-one", {}, items));
  }
  assert.equal(requests.length, 0);
});

test("invoice discounts are capped before the atomic request", async () => {
  const { service, requests } = serviceWith(() => denied);
  await expect(service.createInvoice("workspace-one", {}, [{ ...rawItems[0], discount: 2000 }])).rejects.toThrow("Permission denied");
  expect(requests[0].payload.lines).toEqual([expect.objectContaining({ discount: 1000 })]);
});

test("an incomplete invoice response is rejected instead of reported as saved", async () => {
  const { service } = serviceWith(() => ({ data: { id: "saved" }, error: null }));
  await expect(service.createInvoice("workspace-one", {}, rawItems)).rejects.toThrow(/complete invoice/);
});

test("customer tiers use the database keys for both display-label and canonical inputs", async () => {
  const { service, requests } = serviceWith((request) => ({ data: { id: "customer", ...request.payload }, error: null }));
  await service.createCustomer("workspace-one", "user", { name: "Customer", tier: "سازمانی" });
  await service.createCustomer("workspace-one", "user", { name: "Customer", tier: "Growth" });
  expect(requests.map((request) => request.payload.tier)).toEqual(["Enterprise", "Growth"]);
});

test("invoice reads preserve zero quantities and tax and sort lines for printing", async () => {
  const { service } = serviceWith(() => ({ data: [{ id: "invoice", items: [
    { id: "b", item_order: 2, quantity: 1, tax_rate: 10 },
    { id: "a", item_order: 1, quantity: 0, tax_rate: 0 },
  ] }], error: null }));
  const [invoice] = await service.fetchInvoices();
  assert.deepEqual(invoice.items!.map((item) => item.id), ["a", "b"]);
  assert.equal(invoice.items![0].quantity, 0);
  assert.equal(invoice.items![0].taxRate, 0);
});

test("mark all notifications changes only unread records in the active workspace", async () => {
  const { service, requests } = serviceWith(() => ({ data: [], error: null }));
  await service.markAllNotificationsRead("workspace-one");
  assert.deepEqual(requests[0].filters, [["workspace_id", "workspace-one"], ["read", false]]);
});

test("invoice reads retain the original customer name when the joined contact is gone", async () => {
  const { service } = serviceWith(() => ({ data: [{ id: "invoice", customer_name: "Original customer", customers: null, items: [] }], error: null }));
  expect((await service.fetchInvoices())[0].customerName).toBe("Original customer");
});
