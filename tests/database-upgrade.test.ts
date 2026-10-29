import { readFileSync } from "node:fs";
import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it } from "vitest";
import { authenticate, createTestDatabase } from "./helpers/database";

const legacy = readFileSync(new URL("./fixtures/database-before-hardening.sql", import.meta.url), "utf8");
const upgrade = readFileSync(new URL("../supabase/migrations/20261028180337_harden_workspace_security_and_invoice_transactions.sql", import.meta.url), "utf8") +
  readFileSync(new URL("../supabase/migrations/20261028180704_cover_tenant_foreign_keys.sql", import.meta.url), "utf8");
const user = "00000000-0000-4000-8000-000000000001";
const otherUser = "00000000-0000-4000-8000-000000000002";
const workspace = "10000000-0000-4000-8000-000000000001";
const otherWorkspace = "10000000-0000-4000-8000-000000000002";
const customer = "20000000-0000-4000-8000-000000000001";
const invoice = "30000000-0000-4000-8000-000000000001";
let database: PGlite;

beforeAll(async () => {
  database = await createTestDatabase();
  await database.query("insert into auth.users(id,email) values($1,'one@example.com'),($2,'two@example.com')", [user, otherUser]);
  await database.exec(legacy);
  await database.query("insert into public.workspaces(id,name) values($1,'One'),($2,'Two')", [workspace, otherWorkspace]);
  await database.query("insert into public.workspace_members(workspace_id,user_id,role) values($1,$2,'owner'),($3,$4,'owner')", [workspace, user, otherWorkspace, otherUser]);
  await database.query("insert into public.profiles(id,workspace_id,status) values($1,$2,'مشغول'),($3,$4,'آماده پاسخگویی')", [user, workspace, otherUser, otherWorkspace]);
  await database.query(`insert into public.pipeline_stages(user_id,stage_key,title,position)
    select $1,stage,'Stage',position from (values('stage-new',0),('stage-qualified',1),('stage-proposal',2),('stage-negotiation',3),('stage-won',4))s(stage,position)`, [user]);
  await database.query("insert into public.deals(user_id,workspace_id,title,company,contact,stage_id) values($1,null,'Legacy deal','One','Contact','stage-new'),($2,$3,'Other deal','Two','Contact','stage-won')", [user, otherUser, otherWorkspace]);
  await database.query("insert into public.customers(id,user_id,name,company,email) values($1,$2,'Original customer','Company','customer@example.com')", [customer, user]);
  await database.query("insert into public.tasks(user_id,title) values($1,'Follow up')", [user]);
  await database.query("insert into public.notifications(user_id,title,description) values($1,'Reminder','Private')", [user]);
  await database.query("insert into public.invoices(id,workspace_id,customer_id,number,subtotal,tax,total) values($1,$2,$3,1500,1000,100,1100)", [invoice, workspace, customer]);
  await database.query("insert into public.invoice_items(workspace_id,invoice_id,item_order,description,quantity,unit_price,tax_rate,total) values($1,$2,1,'Legacy line',1,1000,10,1100)", [workspace, invoice]);
  await database.query("insert into public.payments(workspace_id,invoice_id,customer_id,amount) values($1,$2,$3,1100)", [workspace, invoice, customer]);
  await database.query("insert into public.cheques(workspace_id,customer_id,sayad_number,bank_name,account_owner,amount,due_date) values($1,$2,'1234567890123456','Bank','Owner',1000,'2026-10-28')", [workspace, customer]);
  await database.exec(upgrade);
}, 30000);

afterAll(async () => { await database?.close(); });

it("preserves existing business records, invoice numbers and customer identity", async () => {
  expect((await database.query("select id,number,customer_name from public.invoices")).rows).toEqual([{ id: invoice, number: 1500, customer_name: "Original customer" }]);
  for (const table of ["customers", "invoice_items", "payments", "cheques", "tasks", "notifications"]) {
    expect((await database.query(`select count(*)::int as count from public.${table}`)).rows).toEqual([{ count: 1 }]);
  }
  expect((await database.query("select count(*)::int as count from public.deals")).rows).toEqual([{ count: 2 }]);
});

it("restores verified workspace links and missing stages and normalizes availability", async () => {
  expect((await database.query("select workspace_id from public.customers where id=$1", [customer])).rows).toEqual([{ workspace_id: workspace }]);
  expect((await database.query("select status from public.profiles where id=$1", [user])).rows).toEqual([{ status: "Away" }]);
  expect((await database.query("select count(*)::int as count from public.pipeline_stages where workspace_id=$1", [otherWorkspace])).rows).toEqual([{ count: 5 }]);
  expect((await database.query("select count(*)::int as count from public.deals d where not exists(select 1 from public.pipeline_stages s where s.workspace_id=d.workspace_id and s.stage_key=d.stage_id)")).rows).toEqual([{ count: 0 }]);
});

it("starts new numbers after the existing maximum and retains the customer snapshot on deletion", async () => {
  await authenticate(database, user);
  const result = await database.query<{ saved: { id: string; number: number } }>("select public.create_invoice_with_items($1,$2,$3) as saved", [
    workspace, JSON.stringify({ customer_id: customer }), JSON.stringify([{ description: "New line", quantity: 1, unit_price: 100 }]),
  ]);
  expect(result.rows[0].saved.number).toBe(1501);
  await expect(database.query("update public.invoices set number=9999 where id=$1", [invoice])).rejects.toThrow(/immutable/);
  await database.query("delete from public.customers where id=$1", [customer]);
  expect((await database.query("select customer_id,customer_name from public.invoices where id=$1", [invoice])).rows).toEqual([{ customer_id: null, customer_name: "Original customer" }]);
  expect((await database.query("select count(*)::int as count from public.cheques")).rows).toEqual([{ count: 1 }]);
});
