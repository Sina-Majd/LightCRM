-- Upgrade the inspected workspace schema without deleting business records.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '30s';

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Recover legacy user-scoped records using their owner's verified membership.
do $$
declare relation text;
begin
  foreach relation in array array['pipeline_stages','deals','leads','customers','tasks','notifications'] loop
    execute format('update public.%I r set workspace_id=p.workspace_id from public.profiles p
      where r.workspace_id is null and r.user_id=p.id and exists (
        select 1 from public.workspace_members m where m.workspace_id=p.workspace_id and m.user_id=p.id
      )', relation);
    execute format('alter table public.%I alter column workspace_id set not null', relation);
    execute format('alter table public.%I alter column user_id set default auth.uid()', relation);
  end loop;
end;
$$;

-- Restore missing built-in stages only when a workspace has no stages or a deal needs one.
with defaults(stage_key,title,position) as (values
  ('stage-new','سرنخ جدید',0), ('stage-qualified','بررسی و صلاحیت',1),
  ('stage-proposal','ارسال پیش‌فاکتور',2), ('stage-negotiation','مذاکره و توافق',3), ('stage-won','موفق و بسته شد',4)
), owners as (
  select distinct on (workspace_id) workspace_id,user_id from public.workspace_members where role='owner' order by workspace_id,joined_at,user_id
)
insert into public.pipeline_stages(workspace_id,user_id,stage_key,title,position)
select o.workspace_id,o.user_id,d.stage_key,d.title,d.position from owners o cross join defaults d
where not exists(select 1 from public.pipeline_stages s where s.workspace_id=o.workspace_id and s.stage_key=d.stage_key)
and (not exists(select 1 from public.pipeline_stages s where s.workspace_id=o.workspace_id)
  or exists(select 1 from public.deals r where r.workspace_id=o.workspace_id and r.stage_id=d.stage_key));

update public.profiles set status=case status
  when 'آماده پاسخگویی' then 'Available' when 'مشغول' then 'Away'
  when 'در جلسه کاری' then 'Do Not Disturb' else status end;
alter table public.profiles alter column status set default 'Available', alter column plan set default 'starter';
alter table public.profiles add constraint profiles_status_check check(status in ('Available','Away','Do Not Disturb'));

alter table public.customers alter column company set default '', alter column email set default '',
  alter column active_deals_count set default 0, alter column renewal_date set default '',
  alter column location set default '', alter column industry set default '';
alter table public.deals alter column company set default '', alter column contact set default '',
  alter column stage_id set default 'stage-new', alter column probability set default 30;
alter table public.notifications alter column description set default '';

-- Tenant-aware keys prevent valid IDs from another workspace being attached to a row.
alter table public.pipeline_stages add constraint pipeline_stages_workspace_key unique(workspace_id,stage_key);
alter table public.deals add constraint deals_workspace_stage_fkey foreign key(workspace_id,stage_id)
  references public.pipeline_stages(workspace_id,stage_key);
alter table public.customers add constraint customers_id_workspace_key unique(id,workspace_id);
alter table public.invoices add constraint invoices_id_workspace_key unique(id,workspace_id);
alter table public.payments add constraint payments_id_workspace_key unique(id,workspace_id);

alter table public.invoices drop constraint invoices_customer_id_fkey,
  add constraint invoices_customer_id_fkey foreign key(customer_id,workspace_id) references public.customers(id,workspace_id) on delete set null(customer_id);
alter table public.invoice_items drop constraint invoice_items_invoice_id_fkey,
  add constraint invoice_items_invoice_id_fkey foreign key(invoice_id,workspace_id) references public.invoices(id,workspace_id) on delete cascade,
  add constraint invoice_items_invoice_order_key unique(invoice_id,item_order);
alter table public.payments drop constraint payments_invoice_id_fkey, drop constraint payments_customer_id_fkey,
  add constraint payments_invoice_id_fkey foreign key(invoice_id,workspace_id) references public.invoices(id,workspace_id) on delete set null(invoice_id),
  add constraint payments_customer_id_fkey foreign key(customer_id,workspace_id) references public.customers(id,workspace_id) on delete set null(customer_id);
alter table public.cheques drop constraint cheques_customer_id_fkey, drop constraint cheques_payment_id_fkey,
  add constraint cheques_customer_id_fkey foreign key(customer_id,workspace_id) references public.customers(id,workspace_id) on delete set null(customer_id),
  add constraint cheques_payment_id_fkey foreign key(payment_id,workspace_id) references public.payments(id,workspace_id) on delete set null(payment_id),
  add constraint cheques_workspace_sayad_key unique(workspace_id,sayad_number);

alter table public.invoices add column customer_name text not null default '';
update public.invoices i set customer_name=coalesce(c.name,'') from public.customers c where c.id=i.customer_id;

alter table public.deals add constraint deals_value_check check(value>=0 and value<'Infinity'::numeric),
  add constraint deals_days_check check(days_in_stage>=0);
alter table public.customers add constraint customers_ltv_check check(ltv>=0 and ltv<'Infinity'::numeric);
alter table public.invoices drop constraint invoices_status_check,
  add constraint invoices_status_check check(status in ('draft','sent','paid','partially_paid','overdue','cancelled')),
  add constraint invoices_amounts_check check(subtotal>=0 and subtotal<'Infinity'::numeric and discount>=0 and discount<=subtotal and tax>=0 and tax<'Infinity'::numeric and total=subtotal-discount+tax);
alter table public.invoice_items add constraint invoice_items_amounts_check check(
  item_order>0 and length(trim(description))>0 and quantity>0 and quantity<'Infinity'::numeric
  and unit_price>=0 and unit_price<'Infinity'::numeric and discount>=0 and discount<=quantity*unit_price
  and tax_rate between 0 and 100 and total=quantity*unit_price-discount+round((quantity*unit_price-discount)*tax_rate/100));
alter table public.cheques add constraint cheques_amount_check check(amount>0 and amount<'Infinity'::numeric),
  add constraint cheques_sayad_check check(sayad_number ~ '^[0-9]{16}$');
alter table public.payments add constraint payments_finite_amount_check check(amount<'Infinity'::numeric);
alter table public.workspaces add constraint workspaces_tax_rate_check check(invoice_tax_rate between 0 and 100);
alter table public.activities add constraint activities_call_result_check check(call_result in ('connected','no_answer','busy','wrong_number','follow_up_scheduled'));

-- Remove broad privileges and policies, including the unrestricted self-join policy.
do $$
declare policy record; relation text; columns text;
begin
  for policy in select * from pg_policies where schemaname='public' loop
    execute format('drop policy %I on public.%I', policy.policyname,policy.tablename);
  end loop;
  foreach relation in array array['workspaces','workspace_members','profiles','pipeline_stages','deals','leads','customers','invoices','invoice_items','payments','cheques','tasks','activities','notifications'] loop
    execute format('revoke all on public.%I from public,anon,authenticated',relation);
    select string_agg(quote_ident(attname),',') into columns from pg_attribute where attrelid=format('public.%I',relation)::regclass and attnum>0 and not attisdropped;
    execute format('revoke all (%s) on public.%I from public,anon,authenticated',columns,relation);
    execute format('alter table public.%I enable row level security',relation);
  end loop;
end;
$$;
grant usage on schema public to authenticated;
grant select on public.workspaces,public.workspace_members,public.profiles to authenticated;
grant update(full_name,company_name,status,updated_at) on public.profiles to authenticated;
create policy own_membership on public.workspace_members for select to authenticated using(user_id=(select auth.uid()));
create policy member_workspace on public.workspaces for select to authenticated using(
  id in (select workspace_id from public.workspace_members where user_id=(select auth.uid())));
create policy own_profile on public.profiles for select to authenticated using(id=(select auth.uid()));
create policy update_own_profile on public.profiles for update to authenticated
  using(id=(select auth.uid())) with check(id=(select auth.uid()));
do $$
declare relation text;
begin
  foreach relation in array array['pipeline_stages','deals','leads','customers','invoices','invoice_items','payments','cheques','tasks','activities'] loop
    execute format('grant select,insert,update,delete on public.%I to authenticated',relation);
    execute format('create policy workspace_access on public.%I for all to authenticated using(
      workspace_id in (select workspace_id from public.workspace_members where user_id=(select auth.uid()))
    ) with check(workspace_id in (select workspace_id from public.workspace_members where user_id=(select auth.uid())))',relation);
  end loop;
end;
$$;
grant select,insert,update,delete on public.notifications to authenticated;
create policy own_notifications on public.notifications for all to authenticated using(
  user_id=(select auth.uid()) and workspace_id in(select workspace_id from public.workspace_members where user_id=(select auth.uid()))
) with check(user_id=(select auth.uid()) and workspace_id in(select workspace_id from public.workspace_members where user_id=(select auth.uid())));

-- Policies now use ordinary indexed membership queries. Retire unused public RPCs.
drop function public.is_workspace_member(uuid);
drop function public.is_workspace_owner(uuid);
drop function public.create_workspace_with_owner(text);

drop trigger on_auth_user_created on auth.users;
drop function public.handle_new_user();
drop function public.seed_user_workspace(uuid);
create function private.bootstrap_user() returns trigger
language plpgsql security definer set search_path='' as $$
declare workspace uuid;
begin
  insert into public.workspaces(name) values(coalesce(nullif(trim(new.raw_user_meta_data->>'company'),''),'فضای کاری من')) returning id into workspace;
  insert into public.workspace_members(workspace_id,user_id,role) values(workspace,new.id,'owner');
  insert into public.profiles(id,workspace_id,full_name,company_name,email,role,status,plan)
    values(new.id,workspace,coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.raw_user_meta_data->>'company',''),coalesce(new.email,''),'مدیر فروش','Available','starter');
  insert into public.pipeline_stages(workspace_id,user_id,stage_key,title,position) values
    (workspace,new.id,'stage-new','سرنخ جدید',0), (workspace,new.id,'stage-qualified','بررسی و صلاحیت',1),
    (workspace,new.id,'stage-proposal','ارسال پیش‌فاکتور',2), (workspace,new.id,'stage-negotiation','مذاکره و توافق',3), (workspace,new.id,'stage-won','موفق و بسته شد',4);
  return new;
end;
$$;
revoke all on function private.bootstrap_user() from public,anon,authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.bootstrap_user();

alter function public.log_deal_stage_change() set schema private;
create or replace function private.log_deal_stage_change() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if new.stage_id is distinct from old.stage_id and auth.uid() is not null then
    insert into public.activities(workspace_id,subject_type,subject_id,kind,body,created_by)
      values(new.workspace_id,'deal',new.id,'stage_change','تغییر مرحله معامله',auth.uid());
  end if;
  return new;
end;
$$;
revoke all on function private.log_deal_stage_change() from public,anon,authenticated;
alter function public.log_payment_activity() set schema private;
create or replace function private.log_payment_activity() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if auth.uid() is not null and coalesce(new.invoice_id,new.customer_id) is not null then
    insert into public.activities(workspace_id,subject_type,subject_id,kind,body,created_by)
      values(new.workspace_id,case when new.invoice_id is null then 'customer' else 'invoice' end,
        coalesce(new.invoice_id,new.customer_id),'payment','پرداخت ثبت شد',auth.uid());
  end if;
  return new;
end;
$$;
revoke all on function private.log_payment_activity() from public,anon,authenticated;

create function private.touch_updated_at() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  new.updated_at=now();
  if tg_table_name='deals' then
    if new.stage_id is distinct from old.stage_id then new.days_in_stage=0; end if;
  end if;
  if tg_table_name='invoices' then
    if new.number is distinct from old.number then raise exception 'Invoice numbers are immutable'; end if;
  end if;
  return new;
end;
$$;
revoke all on function private.touch_updated_at() from public,anon,authenticated;
do $$
declare relation text;
begin
  foreach relation in array array['profiles','deals','leads','customers','tasks','invoices'] loop
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function private.touch_updated_at()',relation);
  end loop;
  foreach relation in array array['deals','leads','customers','tasks','invoices','payments','activities'] loop
    execute format('alter table public.%I alter column created_by set default auth.uid()',relation);
  end loop;
end;
$$;

create table private.invoice_counters(
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  last_number integer not null default 1000
);
alter table private.invoice_counters enable row level security;
insert into private.invoice_counters(workspace_id,last_number)
  select workspace_id,greatest(max(number),1000) from public.invoices group by workspace_id;
create function private.assign_invoice_number() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null or not exists(select 1 from public.workspace_members where workspace_id=new.workspace_id and user_id=auth.uid()) then
    raise exception 'Workspace access denied' using errcode='42501';
  end if;
  insert into private.invoice_counters(workspace_id,last_number) values(new.workspace_id,1001)
    on conflict(workspace_id) do update set last_number=private.invoice_counters.last_number+1 returning last_number into new.number;
  return new;
end;
$$;
revoke all on function private.assign_invoice_number() from public,anon,authenticated;
create trigger assign_invoice_number before insert on public.invoices for each row execute function private.assign_invoice_number();

-- Cover tenant filters, ordering and foreign-key checks without relying on usage counters.
create index deals_workspace_created_idx on public.deals(workspace_id,created_at desc);
create index deals_workspace_stage_idx on public.deals(workspace_id,stage_id);
create index customers_workspace_created_idx on public.customers(workspace_id,created_at desc);
create index invoices_workspace_created_idx on public.invoices(workspace_id,created_at desc);
create index tasks_workspace_due_idx on public.tasks(workspace_id,due_date);
create index activities_workspace_happened_idx on public.activities(workspace_id,happened_at desc);
create index notifications_user_workspace_created_idx on public.notifications(user_id,workspace_id,created_at desc);
create index cheques_workspace_due_idx on public.cheques(workspace_id,due_date);
create index cheques_customer_idx on public.cheques(customer_id,workspace_id);
create index cheques_payment_idx on public.cheques(payment_id,workspace_id);
drop index public.idx_deals_ws;
drop index public.idx_customers_ws;
drop index public.idx_invoices_ws;
drop index public.idx_tasks_ws;
drop index public.idx_cheques_workspace_id;
drop index public.idx_notifications_ws;
drop index public.notifications_user_id_idx;

-- Invoice RPC is appended below; the entire upgrade commits together.

create or replace function public.create_invoice_with_items(workspace uuid, header jsonb, lines jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  saved public.invoices;
  line jsonb;
  position integer := 0;
  quantity numeric;
  price numeric;
  discount numeric;
  tax_rate numeric;
  calculated_subtotal numeric := 0;
  discount_total numeric := 0;
  tax_total numeric := 0;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(lines) is distinct from 'array' or jsonb_array_length(lines) = 0 then
    raise exception 'At least one invoice item is required' using errcode = '22023';
  end if;
  insert into public.invoices(workspace_id, customer_id, type, status, issue_date, due_date, notes, customer_name)
    values (workspace, (header->>'customer_id')::uuid, coalesce(header->>'type', 'invoice'),
      coalesce(header->>'status', 'draft'), coalesce((header->>'issue_date')::date, current_date),
      (header->>'due_date')::date, coalesce(header->>'notes', ''),
      coalesce((select name from public.customers where id=(header->>'customer_id')::uuid and workspace_id=workspace),'مشتری عمومی')) returning * into saved;
  for line in select * from jsonb_array_elements(lines) loop
    position := position + 1;
    quantity := (line->>'quantity')::numeric;
    price := (line->>'unit_price')::numeric;
    discount := least(coalesce((line->>'discount')::numeric, 0), quantity * price);
    tax_rate := coalesce((line->>'tax_rate')::numeric, 10);
    insert into public.invoice_items(workspace_id, invoice_id, item_order, description, quantity, unit_price, discount, tax_rate, total)
      values (workspace, saved.id, position, trim(line->>'description'), quantity, price, discount, tax_rate,
        quantity * price - discount + round((quantity * price - discount) * tax_rate / 100));
    calculated_subtotal := calculated_subtotal + quantity * price;
    discount_total := discount_total + discount;
    tax_total := tax_total + round((quantity * price - discount) * tax_rate / 100);
  end loop;
  update public.invoices set subtotal = calculated_subtotal, discount = discount_total,
    tax = tax_total, total = calculated_subtotal - discount_total + tax_total where id = saved.id returning * into saved;
  return to_jsonb(saved) || jsonb_build_object('items', (select jsonb_agg(to_jsonb(i) order by item_order) from public.invoice_items i where invoice_id = saved.id));
end;
$$;
revoke all on function public.create_invoice_with_items(uuid, jsonb, jsonb) from public, anon;
grant execute on function public.create_invoice_with_items(uuid, jsonb, jsonb) to authenticated;

commit;
