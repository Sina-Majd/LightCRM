begin;
set local lock_timeout='5s';
set local statement_timeout='30s';

create index invoice_items_invoice_workspace_idx on public.invoice_items(invoice_id,workspace_id);
create index invoices_customer_workspace_idx on public.invoices(customer_id,workspace_id);
create index payments_customer_workspace_idx on public.payments(customer_id,workspace_id);
create index payments_invoice_workspace_idx on public.payments(invoice_id,workspace_id);
create index notifications_workspace_idx on public.notifications(workspace_id);
drop index public.idx_invoice_items_invoice_id;
drop index public.idx_invoices_customer;
drop index public.idx_payments_customer;
drop index public.idx_payments_invoice;

-- Explicitly document the counter's default-deny boundary. Only its trigger owns access.
create policy internal_only on private.invoice_counters for all to authenticated using(false) with check(false);
commit;
