-- Run as the project database administrator. Every fixture is rolled back.
begin;
set local statement_timeout='30s';
set local plpgsql.check_asserts=on;
do $$
declare
  first_user uuid:=gen_random_uuid(); second_user uuid:=gen_random_uuid();
  first_workspace uuid; second_workspace uuid;
  first_customer uuid; second_customer uuid;
  saved jsonb; rejected boolean; before_count integer;
begin
  insert into auth.users(id,email,raw_user_meta_data) values
    (first_user,'crm-smoke-'||first_user||'@example.invalid','{"full_name":"Smoke Test","company":"Smoke Workspace","plan":"pro","role":"admin"}'),
    (second_user,'crm-smoke-'||second_user||'@example.invalid','{}');
  select workspace_id into first_workspace from public.profiles where id=first_user;
  select workspace_id into second_workspace from public.profiles where id=second_user;
  assert first_workspace is not null and second_workspace is not null and first_workspace<>second_workspace, 'Signup must isolate workspaces';
  assert (select plan='starter' from public.profiles where id=first_user), 'Metadata cannot choose a plan';
  assert (select count(*)=5 from public.pipeline_stages where workspace_id=first_workspace), 'Signup must create five stages';
  assert not exists(select 1 from public.deals where workspace_id=first_workspace), 'Signup must not seed business records';

  perform set_config('request.jwt.claim.sub',second_user::text,true);
  set local role authenticated;
  insert into public.customers(workspace_id,name) values(second_workspace,'Other customer') returning id into second_customer;
  reset role;
  perform set_config('request.jwt.claim.sub',first_user::text,true);
  set local role authenticated;
  insert into public.customers(workspace_id,name) values(first_workspace,'Snapshot customer') returning id into first_customer;
  assert not exists(select 1 from public.customers where id=second_customer), 'Foreign customer must be hidden';

  rejected:=false;
  begin
    insert into public.workspace_members(workspace_id,user_id,role) values(second_workspace,first_user,'owner');
  exception when insufficient_privilege then rejected:=true;
  end;
  assert rejected, 'Self-joining another workspace must be denied';
  rejected:=false;
  begin
    update public.profiles set workspace_id=second_workspace where id=first_user;
  exception when insufficient_privilege then rejected:=true;
  end;
  assert rejected, 'Profile cannot change workspace authorization';
  rejected:=false;
  begin
    perform 1 from private.invoice_counters;
  exception when insufficient_privilege then rejected:=true;
  end;
  assert rejected, 'Counters must be private';

  saved:=public.create_invoice_with_items(first_workspace,jsonb_build_object('customer_id',first_customer,'status','sent'),
    '[{"description":"Exempt","quantity":2,"unit_price":500,"discount":100,"tax_rate":0,"total":99999},{"description":"Taxed","quantity":1,"unit_price":1000,"tax_rate":10}]');
  assert (saved->>'number')::integer=1001 and (saved->>'total')::numeric=2000, 'Invoice number and totals must be assigned by SQL';
  assert saved->>'customer_name'='Snapshot customer' and jsonb_array_length(saved->'items')=2, 'Invoice must retain customer and printable items';
  select count(*) into before_count from public.invoices where workspace_id=first_workspace;
  rejected:=false;
  begin
    perform public.create_invoice_with_items(first_workspace,'{}','[{"description":"Invalid","quantity":-1,"unit_price":100}]');
  exception when check_violation then rejected:=true;
  end;
  assert rejected and (select count(*)=before_count from public.invoices where workspace_id=first_workspace), 'Invalid lines must roll back the header';
  rejected:=false;
  begin
    perform public.create_invoice_with_items(first_workspace,jsonb_build_object('customer_id',second_customer),
      '[{"description":"Forged","quantity":1,"unit_price":100}]');
  exception when foreign_key_violation then rejected:=true;
  end;
  assert rejected, 'Cross-workspace customer references must be rejected';
  saved:=public.create_invoice_with_items(first_workspace,'{}','[{"description":"Next","quantity":1,"unit_price":100}]');
  assert (saved->>'number')::integer=1002, 'Failed transactions must not consume an invoice number';

  insert into public.notifications(workspace_id,title) values(first_workspace,'Private reminder');
  reset role;
  insert into public.workspace_members(workspace_id,user_id) values(first_workspace,second_user);
  perform set_config('request.jwt.claim.sub',second_user::text,true);
  set local role authenticated;
  assert exists(select 1 from public.customers where id=first_customer), 'Trusted members must share workspace records';
  assert not exists(select 1 from public.notifications where workspace_id=first_workspace), 'Notifications must remain personal';
  reset role;
end;
$$;
rollback;
select jsonb_build_object('passed',true,'fixtures_rolled_back',true,'checks',array[
  'signup','membership authorization','profile privileges','tenant isolation','atomic invoices',
  'server totals','invoice numbering','customer snapshot','shared membership','personal notifications'
]) as smoke_test;
