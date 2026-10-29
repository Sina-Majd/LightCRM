import { readFileSync } from "node:fs";
import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it } from "vitest";
import { authenticate, createTestDatabase } from "./helpers/database";

const migration = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const userOne = "00000000-0000-4000-8000-000000000001";
const userTwo = "00000000-0000-4000-8000-000000000002";
let database: PGlite;
let workspaceOne: string;
let workspaceTwo: string;
let customerOne: string;
let customerTwo: string;

async function asUser(userId: string) {
  await authenticate(database, userId);
}

async function invoice(lines: unknown, workspace = workspaceOne, customer = customerOne) {
  return database.query<{ invoice: { id: string; number: number; subtotal: number; discount: number; tax: number; total: number; items: { total: number }[] } }>(
    "select public.create_invoice_with_items($1, $2, $3) as invoice",
    [workspace, JSON.stringify({ customer_id: customer, status: "sent", issue_date: "2026-10-28" }), JSON.stringify(lines)],
  );
}

beforeAll(async () => {
  database = await createTestDatabase();
  await database.exec(migration);
  await database.query("insert into auth.users(id, email, raw_user_meta_data) values ($1, 'one@example.com', $2), ($3, 'two@example.com', '{}')", [
    userOne, JSON.stringify({ full_name: "User One", company: "Company One", workspace_id: "untrusted", role: "admin", plan: "pro" }), userTwo,
  ]);
  const workspaces = await database.query<{ workspace_id: string; user_id: string }>("select workspace_id, user_id from public.workspace_members where role='owner'");
  workspaceOne = workspaces.rows.find((workspace) => workspace.user_id === userOne)!.workspace_id;
  workspaceTwo = workspaces.rows.find((workspace) => workspace.user_id === userTwo)!.workspace_id;
  await asUser(userOne);
  customerOne = (await database.query<{ id: string }>("insert into public.customers(workspace_id, name) values ($1, 'Customer One') returning id", [workspaceOne])).rows[0].id;
  await asUser(userTwo);
  customerTwo = (await database.query<{ id: string }>("insert into public.customers(workspace_id, name) values ($1, 'Customer Two') returning id", [workspaceTwo])).rows[0].id;
  await asUser(userOne);
}, 30000);

afterAll(async () => { await database?.close(); });

it("bootstraps a workspace, membership, profile and five stages without trusting metadata for access", async () => {
  const profile = await database.query("select workspace_id, full_name, role, plan from public.profiles");
  expect(profile.rows).toEqual([{ workspace_id: workspaceOne, full_name: "User One", role: "مدیر فروش", plan: "starter" }]);
  expect((await database.query("select * from public.workspace_members")).rows).toHaveLength(1);
  expect((await database.query("select stage_key from public.pipeline_stages")).rows).toHaveLength(5);
});

it("isolates reads, inserts and workspace reassignment between tenants", async () => {
  expect((await database.query("select id from public.customers")).rows).toEqual([{ id: customerOne }]);
  expect((await database.query("update public.customers set name = 'Forbidden' where id = $1 returning id", [customerTwo])).rows).toEqual([]);
  await expect(database.query("insert into public.customers(workspace_id, name) values ($1, 'Forbidden')", [workspaceTwo])).rejects.toThrow(/row-level security/);
  await expect(database.query("update public.customers set workspace_id = $1 where id = $2", [workspaceTwo, customerOne])).rejects.toThrow(/row-level security/);
});

it("prevents users granting themselves memberships or changing profile authorization fields", async () => {
  await expect(database.query("insert into public.workspace_members(workspace_id, user_id) values ($1, $2)", [workspaceTwo, userOne])).rejects.toThrow(/permission denied/);
  await expect(database.query("update public.profiles set workspace_id = $1 where id = $2", [workspaceTwo, userOne])).rejects.toThrow(/permission denied/);
  await expect(database.query("update public.profiles set plan = 'pro' where id = $1", [userOne])).rejects.toThrow(/permission denied/);
  await database.query("update public.profiles set status = 'Away' where id = $1", [userOne]);
  expect((await database.query("select status from public.profiles")).rows).toEqual([{ status: "Away" }]);
});

it("atomically saves invoice items and derives totals from prices instead of submitted totals", async () => {
  const result = (await invoice([
    { description: "Exempt service", quantity: 2, unit_price: 500, discount: 100, tax_rate: 0, total: 99999 },
    { description: "Taxed service", quantity: 1, unit_price: 1000, tax_rate: 10 },
  ])).rows[0].invoice;
  expect(result).toMatchObject({ number: 1001, subtotal: 2000, discount: 100, tax: 100, total: 2000 });
  expect(result.items.map((item) => item.total)).toEqual([900, 1100]);
  expect((await database.query("select * from public.invoice_items")).rows).toHaveLength(2);
});

it("rolls back the header, items and counter when any line fails validation", async () => {
  const before = (await database.query("select id from public.invoices")).rows;
  await expect(invoice([
    { description: "Valid first item", quantity: 1, unit_price: 100 },
    { description: "Invalid second item", quantity: -1, unit_price: 100 },
  ])).rejects.toThrow(/check constraint/);
  expect((await database.query("select id from public.invoices")).rows).toEqual(before);
  const next = (await invoice([{ description: "Next invoice", quantity: 1, unit_price: 100 }])).rows[0].invoice;
  expect(next.number).toBe(1002);
});

it("rejects missing items, nonfinite prices and cross-workspace customer/invoice references", async () => {
  await expect(invoice([])).rejects.toThrow(/At least one/);
  await expect(invoice([{ description: "Invalid", quantity: 1, unit_price: "NaN" }])).rejects.toThrow(/check constraint/);
  await expect(invoice([{ description: "Invalid", quantity: 1, unit_price: "Infinity" }])).rejects.toThrow(/check constraint/);
  await expect(invoice([{ description: "Invalid", quantity: 1, unit_price: 100 }], workspaceOne, customerTwo)).rejects.toThrow(/foreign key constraint/);
  await expect(invoice([{ description: "Invalid", quantity: 1, unit_price: 100 }], workspaceTwo, customerTwo)).rejects.toThrow(/Workspace access denied|row-level security/);
});

it("isolates invoice items through the parent and cascades deletion", async () => {
  const created = (await invoice([{ description: "Private item", quantity: 1, unit_price: 100 }])).rows[0].invoice;
  await asUser(userTwo);
  expect((await database.query("select id from public.invoice_items where invoice_id = $1", [created.id])).rows).toEqual([]);
  await expect(database.query(`insert into public.invoice_items(workspace_id, invoice_id, item_order, description, quantity, unit_price, total)
    values ($1, $2, 2, 'Forged', 1, 100, 110)`, [workspaceTwo, created.id])).rejects.toThrow(/foreign key constraint/);
  await asUser(userOne);
  await database.query("delete from public.invoices where id = $1", [created.id]);
  expect((await database.query("select id from public.invoice_items where invoice_id = $1", [created.id])).rows).toEqual([]);
});

it("denies anonymous access to CRM records and private trigger functions", async () => {
  await database.exec("reset role; set role anon");
  await expect(database.query("select * from public.customers")).rejects.toThrow(/permission denied/);
  await expect(database.query("select public.create_invoice_with_items($1, '{}', '[]')", [workspaceOne])).rejects.toThrow(/permission denied/);
  await expect(database.query("select private.bootstrap_user()")).rejects.toThrow(/permission denied/);
  await asUser(userOne);
});

it("lets trusted members share CRM data while keeping notifications personal", async () => {
  await database.exec("reset role");
  await database.query("insert into public.workspace_members(workspace_id, user_id) values ($1, $2)", [workspaceOne, userTwo]);
  await asUser(userOne);
  await database.query("insert into public.notifications(workspace_id, title) values ($1, 'Private reminder')", [workspaceOne]);
  await asUser(userTwo);
  expect((await database.query("select id from public.customers where workspace_id = $1", [workspaceOne])).rows).toEqual([{ id: customerOne }]);
  expect((await database.query("select * from public.notifications where workspace_id = $1", [workspaceOne])).rows).toEqual([]);
  await expect(database.query("insert into public.notifications(workspace_id, user_id, title) values ($1, $2, 'Forged')", [workspaceOne, userOne])).rejects.toThrow(/row-level security/);
  await expect(database.query("select * from private.invoice_counters")).rejects.toThrow(/permission denied/);
  await asUser(userOne);
});

it("persists stage-change activity together with the deal update", async () => {
  const deal = (await database.query<{ id: string }>("insert into public.deals(workspace_id, title, stage_id) values ($1, 'Deal', 'stage-proposal') returning id", [workspaceOne])).rows[0];
  await database.query("update public.deals set stage_id = 'stage-won', days_in_stage = 10 where id = $1", [deal.id]);
  expect((await database.query("select days_in_stage from public.deals where id = $1", [deal.id])).rows).toEqual([{ days_in_stage: 0 }]);
  expect((await database.query("select kind, created_by from public.activities where subject_id = $1", [deal.id])).rows).toEqual([{ kind: "stage_change", created_by: userOne }]);
});

it("runs the rollback smoke test against the fresh schema", async () => {
  await database.exec("reset role");
  const before = (await database.query("select count(*)::int as count from auth.users")).rows;
  await database.exec(readFileSync(new URL("../supabase/tests/smoke.sql", import.meta.url), "utf8"));
  expect((await database.query("select count(*)::int as count from auth.users")).rows).toEqual(before);
});
