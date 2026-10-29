-- LightCRM application schema, exported from the verified hosted database.

-- Schema only: no accounts, customer records, payments or counter values are included.

-- Fresh Supabase projects: run this file once before registering application users.

-- Existing projects: apply only their pending versioned migrations.

begin;

set local search_path = public, pg_catalog;

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

grant usage on schema public to authenticated;

create table "private"."invoice_counters" (
  "workspace_id" uuid not null,
  "last_number" integer default 1000 not null
);

create table "public"."activities" (
  "id" uuid default gen_random_uuid() not null,
  "workspace_id" uuid not null,
  "subject_type" text not null,
  "subject_id" uuid not null,
  "kind" text not null,
  "body" text default ''::text not null,
  "happened_at" timestamp with time zone default now() not null,
  "created_by" uuid default auth.uid(),
  "created_at" timestamp with time zone default now() not null,
  "call_result" text
);

create table "public"."cheques" (
  "id" uuid default gen_random_uuid() not null,
  "workspace_id" uuid not null,
  "payment_id" uuid,
  "customer_id" uuid,
  "sayad_number" text not null,
  "bank_name" text not null,
  "branch_name" text,
  "account_owner" text not null,
  "amount" numeric default 0 not null,
  "due_date" date not null,
  "status" text default 'in_hand'::text not null,
  "status_updated_at" timestamp with time zone default now() not null,
  "created_at" timestamp with time zone default now() not null
);

create table "public"."customers" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid() not null,
  "name" text not null,
  "company" text default ''::text not null,
  "email" text default ''::text not null,
  "phone" text,
  "ltv" numeric default 0 not null,
  "active_deals_count" integer default 0 not null,
  "health_score" integer default 90 not null,
  "health_status" text default 'good'::text not null,
  "tier" text default 'Growth'::text not null,
  "renewal_date" text default ''::text not null,
  "last_touch" text default 'Just now'::text not null,
  "location" text default ''::text not null,
  "industry" text default ''::text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid not null,
  "created_by" uuid default auth.uid(),
  "customer_type" text default 'company'::text,
  "national_id" text,
  "economic_code" text,
  "segment" text default 'customer'::text
);

create table "public"."deals" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid() not null,
  "title" text not null,
  "company" text default ''::text not null,
  "contact" text default ''::text not null,
  "email" text,
  "phone" text,
  "value" numeric default 0 not null,
  "stage_id" text default 'stage-new'::text not null,
  "priority" text default 'medium'::text not null,
  "probability" integer default 30 not null,
  "tags" text[] default '{}'::text[] not null,
  "notes" text default ''::text not null,
  "days_in_stage" integer default 0 not null,
  "last_activity" text default 'Just now'::text not null,
  "assignee_name" text default 'You'::text not null,
  "assignee_avatar" text default ''::text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid not null,
  "created_by" uuid default auth.uid(),
  "next_action_title" text,
  "next_action_due" timestamp with time zone
);

create table "public"."invoice_items" (
  "id" uuid default gen_random_uuid() not null,
  "workspace_id" uuid not null,
  "invoice_id" uuid not null,
  "item_order" integer default 0 not null,
  "description" text not null,
  "quantity" numeric default 1 not null,
  "unit_price" numeric default 0 not null,
  "discount" numeric default 0 not null,
  "tax_rate" numeric default 10 not null,
  "total" numeric default 0 not null,
  "created_at" timestamp with time zone default now() not null
);

create table "public"."invoices" (
  "id" uuid default gen_random_uuid() not null,
  "workspace_id" uuid not null,
  "customer_id" uuid,
  "number" integer not null,
  "type" text default 'invoice'::text not null,
  "status" text default 'draft'::text not null,
  "issue_date" date default CURRENT_DATE not null,
  "due_date" date,
  "subtotal" numeric default 0 not null,
  "discount" numeric default 0 not null,
  "tax" numeric default 0 not null,
  "total" numeric default 0 not null,
  "notes" text default ''::text not null,
  "created_by" uuid default auth.uid(),
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "customer_name" text default ''::text not null
);

create table "public"."leads" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid() not null,
  "name" text not null,
  "company" text not null,
  "email" text not null,
  "phone" text,
  "title" text,
  "score" integer default 75 not null,
  "status" text default 'warm'::text not null,
  "source" text default 'Website'::text not null,
  "estimated_value" numeric default 0 not null,
  "notes" text default ''::text not null,
  "assigned_to" text default 'You'::text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid not null,
  "created_by" uuid default auth.uid()
);

create table "public"."notifications" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid() not null,
  "title" text not null,
  "description" text default ''::text not null,
  "time" text default 'Just now'::text not null,
  "read" boolean default false not null,
  "type" text default 'system'::text not null,
  "created_at" timestamp with time zone default now() not null,
  "workspace_id" uuid not null
);

create table "public"."payments" (
  "id" uuid default gen_random_uuid() not null,
  "workspace_id" uuid not null,
  "invoice_id" uuid,
  "customer_id" uuid,
  "amount" numeric not null,
  "paid_at" date default CURRENT_DATE not null,
  "method" text default 'transfer'::text not null,
  "reference" text default ''::text not null,
  "notes" text default ''::text not null,
  "created_by" uuid default auth.uid(),
  "created_at" timestamp with time zone default now() not null
);

create table "public"."pipeline_stages" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid() not null,
  "stage_key" text not null,
  "title" text not null,
  "position" integer default 0 not null,
  "created_at" timestamp with time zone default now() not null,
  "workspace_id" uuid not null
);

create table "public"."profiles" (
  "id" uuid not null,
  "full_name" text,
  "company_name" text,
  "email" text,
  "role" text default 'Head of Sales'::text,
  "status" text default 'Available'::text,
  "plan" text default 'starter'::text,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid
);

create table "public"."tasks" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid default auth.uid() not null,
  "title" text not null,
  "type" text default 'email'::text not null,
  "due_date" date default CURRENT_DATE not null,
  "due_category" text default 'upcoming'::text not null,
  "priority" text default 'medium'::text not null,
  "completed" boolean default false not null,
  "related_to" text default ''::text not null,
  "related_type" text default 'deal'::text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid not null,
  "created_by" uuid default auth.uid()
);

create table "public"."workspace_members" (
  "workspace_id" uuid not null,
  "user_id" uuid not null,
  "role" text default 'member'::text not null,
  "joined_at" timestamp with time zone default now() not null
);

create table "public"."workspaces" (
  "id" uuid default gen_random_uuid() not null,
  "name" text not null,
  "invoice_tax_rate" numeric default 10 not null,
  "created_at" timestamp with time zone default now() not null
);

alter table public."activities" add constraint "activities_pkey" PRIMARY KEY (id);

alter table public."cheques" add constraint "cheques_pkey" PRIMARY KEY (id);

alter table public."customers" add constraint "customers_pkey" PRIMARY KEY (id);

alter table public."deals" add constraint "deals_pkey" PRIMARY KEY (id);

alter table public."invoice_items" add constraint "invoice_items_pkey" PRIMARY KEY (id);

alter table public."invoices" add constraint "invoices_pkey" PRIMARY KEY (id);

alter table public."leads" add constraint "leads_pkey" PRIMARY KEY (id);

alter table public."notifications" add constraint "notifications_pkey" PRIMARY KEY (id);

alter table public."payments" add constraint "payments_pkey" PRIMARY KEY (id);

alter table public."pipeline_stages" add constraint "pipeline_stages_pkey" PRIMARY KEY (id);

alter table "private"."invoice_counters" add constraint "invoice_counters_pkey" PRIMARY KEY (workspace_id);

alter table public."profiles" add constraint "profiles_pkey" PRIMARY KEY (id);

alter table public."tasks" add constraint "tasks_pkey" PRIMARY KEY (id);

alter table public."workspace_members" add constraint "workspace_members_pkey" PRIMARY KEY (workspace_id, user_id);

alter table public."workspaces" add constraint "workspaces_pkey" PRIMARY KEY (id);

alter table public."cheques" add constraint "cheques_workspace_sayad_key" UNIQUE (workspace_id, sayad_number);

alter table public."customers" add constraint "customers_id_workspace_key" UNIQUE (id, workspace_id);

alter table public."invoice_items" add constraint "invoice_items_invoice_order_key" UNIQUE (invoice_id, item_order);

alter table public."invoices" add constraint "invoices_id_workspace_key" UNIQUE (id, workspace_id);

alter table public."invoices" add constraint "invoices_workspace_id_number_key" UNIQUE (workspace_id, number);

alter table public."payments" add constraint "payments_id_workspace_key" UNIQUE (id, workspace_id);

alter table public."pipeline_stages" add constraint "pipeline_stages_workspace_key" UNIQUE (workspace_id, stage_key);

alter table public."activities" add constraint "activities_call_result_check" CHECK (call_result = ANY (ARRAY['connected'::text, 'no_answer'::text, 'busy'::text, 'wrong_number'::text, 'follow_up_scheduled'::text]));

alter table public."activities" add constraint "activities_kind_check" CHECK (kind = ANY (ARRAY['call'::text, 'meeting'::text, 'note'::text, 'email'::text, 'stage_change'::text, 'payment'::text, 'cheque_status'::text]));

alter table public."activities" add constraint "activities_subject_type_check" CHECK (subject_type = ANY (ARRAY['deal'::text, 'lead'::text, 'customer'::text, 'invoice'::text]));

alter table public."cheques" add constraint "cheques_amount_check" CHECK (amount > 0::numeric AND amount < 'Infinity'::numeric);

alter table public."cheques" add constraint "cheques_sayad_check" CHECK (sayad_number ~ '^[0-9]{16}$'::text);

alter table public."cheques" add constraint "cheques_status_check" CHECK (status = ANY (ARRAY['in_hand'::text, 'deposited'::text, 'cleared'::text, 'bounced'::text]));

alter table public."customers" add constraint "customers_customer_type_check" CHECK (customer_type = ANY (ARRAY['individual'::text, 'company'::text]));

alter table public."customers" add constraint "customers_health_score_check" CHECK (health_score >= 0 AND health_score <= 100);

alter table public."customers" add constraint "customers_health_status_check" CHECK (health_status = ANY (ARRAY['excellent'::text, 'good'::text, 'warning'::text, 'critical'::text]));

alter table public."customers" add constraint "customers_ltv_check" CHECK (ltv >= 0::numeric AND ltv < 'Infinity'::numeric);

alter table public."customers" add constraint "customers_segment_check" CHECK (segment = ANY (ARRAY['lead'::text, 'customer'::text, 'vip'::text, 'churned'::text]));

alter table public."customers" add constraint "customers_tier_check" CHECK (tier = ANY (ARRAY['Enterprise'::text, 'Growth'::text, 'Startup'::text]));

alter table public."deals" add constraint "deals_days_check" CHECK (days_in_stage >= 0);

alter table public."deals" add constraint "deals_priority_check" CHECK (priority = ANY (ARRAY['urgent'::text, 'high'::text, 'medium'::text, 'low'::text]));

alter table public."deals" add constraint "deals_probability_check" CHECK (probability >= 0 AND probability <= 100);

alter table public."deals" add constraint "deals_value_check" CHECK (value >= 0::numeric AND value < 'Infinity'::numeric);

alter table public."invoice_items" add constraint "invoice_items_amounts_check" CHECK (item_order > 0 AND length(TRIM(BOTH FROM description)) > 0 AND quantity > 0::numeric AND quantity < 'Infinity'::numeric AND unit_price >= 0::numeric AND unit_price < 'Infinity'::numeric AND discount >= 0::numeric AND discount <= (quantity * unit_price) AND tax_rate >= 0::numeric AND tax_rate <= 100::numeric AND total = (quantity * unit_price - discount + round((quantity * unit_price - discount) * tax_rate / 100::numeric)));

alter table public."invoices" add constraint "invoices_amounts_check" CHECK (subtotal >= 0::numeric AND subtotal < 'Infinity'::numeric AND discount >= 0::numeric AND discount <= subtotal AND tax >= 0::numeric AND tax < 'Infinity'::numeric AND total = (subtotal - discount + tax));

alter table public."invoices" add constraint "invoices_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'sent'::text, 'paid'::text, 'partially_paid'::text, 'overdue'::text, 'cancelled'::text]));

alter table public."invoices" add constraint "invoices_type_check" CHECK (type = ANY (ARRAY['proforma'::text, 'invoice'::text]));

alter table public."leads" add constraint "leads_score_check" CHECK (score >= 1 AND score <= 100);

alter table public."leads" add constraint "leads_status_check" CHECK (status = ANY (ARRAY['hot'::text, 'warm'::text, 'qualified'::text, 'cold'::text]));

alter table public."notifications" add constraint "notifications_type_check" CHECK (type = ANY (ARRAY['deal'::text, 'lead'::text, 'payment'::text, 'customer'::text, 'system'::text]));

alter table public."payments" add constraint "payments_amount_check" CHECK (amount > 0::numeric);

alter table public."payments" add constraint "payments_finite_amount_check" CHECK (amount < 'Infinity'::numeric);

alter table public."payments" add constraint "payments_method_check" CHECK (method = ANY (ARRAY['cash'::text, 'card'::text, 'transfer'::text, 'cheque'::text]));

alter table public."profiles" add constraint "profiles_status_check" CHECK (status = ANY (ARRAY['Available'::text, 'Away'::text, 'Do Not Disturb'::text]));

alter table public."tasks" add constraint "tasks_due_category_check" CHECK (due_category = ANY (ARRAY['today'::text, 'upcoming'::text, 'overdue'::text]));

alter table public."tasks" add constraint "tasks_priority_check" CHECK (priority = ANY (ARRAY['urgent'::text, 'high'::text, 'medium'::text, 'low'::text]));

alter table public."tasks" add constraint "tasks_related_type_check" CHECK (related_type = ANY (ARRAY['deal'::text, 'lead'::text, 'customer'::text]));

alter table public."tasks" add constraint "tasks_type_check" CHECK (type = ANY (ARRAY['call'::text, 'email'::text, 'meeting'::text, 'review'::text]));

alter table public."workspace_members" add constraint "workspace_members_role_check" CHECK (role = ANY (ARRAY['owner'::text, 'member'::text]));

alter table public."workspaces" add constraint "workspaces_tax_rate_check" CHECK (invoice_tax_rate >= 0::numeric AND invoice_tax_rate <= 100::numeric);

alter table public."activities" add constraint "activities_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."activities" add constraint "activities_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."cheques" add constraint "cheques_customer_id_fkey" FOREIGN KEY (customer_id, workspace_id) REFERENCES customers(id, workspace_id) ON DELETE SET NULL (customer_id);

alter table public."cheques" add constraint "cheques_payment_id_fkey" FOREIGN KEY (payment_id, workspace_id) REFERENCES payments(id, workspace_id) ON DELETE SET NULL (payment_id);

alter table public."cheques" add constraint "cheques_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."customers" add constraint "customers_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."customers" add constraint "customers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."customers" add constraint "customers_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."deals" add constraint "deals_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."deals" add constraint "deals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."deals" add constraint "deals_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."deals" add constraint "deals_workspace_stage_fkey" FOREIGN KEY (workspace_id, stage_id) REFERENCES pipeline_stages(workspace_id, stage_key);

alter table public."invoice_items" add constraint "invoice_items_invoice_id_fkey" FOREIGN KEY (invoice_id, workspace_id) REFERENCES invoices(id, workspace_id) ON DELETE CASCADE;

alter table public."invoice_items" add constraint "invoice_items_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."invoices" add constraint "invoices_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."invoices" add constraint "invoices_customer_id_fkey" FOREIGN KEY (customer_id, workspace_id) REFERENCES customers(id, workspace_id) ON DELETE SET NULL (customer_id);

alter table public."invoices" add constraint "invoices_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."leads" add constraint "leads_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."leads" add constraint "leads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."leads" add constraint "leads_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."notifications" add constraint "notifications_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."payments" add constraint "payments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."payments" add constraint "payments_customer_id_fkey" FOREIGN KEY (customer_id, workspace_id) REFERENCES customers(id, workspace_id) ON DELETE SET NULL (customer_id);

alter table public."payments" add constraint "payments_invoice_id_fkey" FOREIGN KEY (invoice_id, workspace_id) REFERENCES invoices(id, workspace_id) ON DELETE SET NULL (invoice_id);

alter table public."payments" add constraint "payments_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."pipeline_stages" add constraint "pipeline_stages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."pipeline_stages" add constraint "pipeline_stages_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table "private"."invoice_counters" add constraint "invoice_counters_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."profiles" add constraint "profiles_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL;

alter table public."tasks" add constraint "tasks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."tasks" add constraint "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."tasks" add constraint "tasks_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."workspace_members" add constraint "workspace_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."workspace_members" add constraint "workspace_members_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

CREATE INDEX activities_subject_idx ON public.activities USING btree (workspace_id, subject_type, subject_id);

CREATE INDEX activities_workspace_happened_idx ON public.activities USING btree (workspace_id, happened_at DESC);

CREATE INDEX idx_activities_by ON public.activities USING btree (created_by);

CREATE INDEX cheques_customer_idx ON public.cheques USING btree (customer_id, workspace_id);

CREATE INDEX cheques_payment_idx ON public.cheques USING btree (payment_id, workspace_id);

CREATE INDEX cheques_workspace_due_idx ON public.cheques USING btree (workspace_id, due_date);

CREATE INDEX idx_cheques_due_date ON public.cheques USING btree (due_date);

CREATE INDEX customers_user_id_idx ON public.customers USING btree (user_id);

CREATE INDEX customers_workspace_created_idx ON public.customers USING btree (workspace_id, created_at DESC);

CREATE INDEX idx_customers_by ON public.customers USING btree (created_by);

CREATE INDEX deals_user_id_idx ON public.deals USING btree (user_id);

CREATE INDEX deals_workspace_created_idx ON public.deals USING btree (workspace_id, created_at DESC);

CREATE INDEX deals_workspace_stage_idx ON public.deals USING btree (workspace_id, stage_id);

CREATE INDEX idx_deals_by ON public.deals USING btree (created_by);

CREATE INDEX idx_deals_next_action_due ON public.deals USING btree (next_action_due);

CREATE INDEX idx_invoice_items_workspace_id ON public.invoice_items USING btree (workspace_id);

CREATE INDEX invoice_items_invoice_workspace_idx ON public.invoice_items USING btree (invoice_id, workspace_id);

CREATE INDEX idx_invoices_by ON public.invoices USING btree (created_by);

CREATE INDEX invoices_customer_workspace_idx ON public.invoices USING btree (customer_id, workspace_id);

CREATE INDEX invoices_workspace_created_idx ON public.invoices USING btree (workspace_id, created_at DESC);

CREATE INDEX idx_leads_by ON public.leads USING btree (created_by);

CREATE INDEX idx_leads_ws ON public.leads USING btree (workspace_id);

CREATE INDEX leads_user_id_idx ON public.leads USING btree (user_id);

CREATE INDEX notifications_user_workspace_created_idx ON public.notifications USING btree (user_id, workspace_id, created_at DESC);

CREATE INDEX notifications_workspace_idx ON public.notifications USING btree (workspace_id);

CREATE INDEX idx_payments_by ON public.payments USING btree (created_by);

CREATE INDEX idx_payments_ws ON public.payments USING btree (workspace_id);

CREATE INDEX payments_customer_workspace_idx ON public.payments USING btree (customer_id, workspace_id);

CREATE INDEX payments_invoice_workspace_idx ON public.payments USING btree (invoice_id, workspace_id);

CREATE INDEX idx_stages_ws ON public.pipeline_stages USING btree (workspace_id);

CREATE INDEX pipeline_stages_user_id_idx ON public.pipeline_stages USING btree (user_id);

CREATE INDEX idx_profiles_ws ON public.profiles USING btree (workspace_id);

CREATE INDEX idx_tasks_by ON public.tasks USING btree (created_by);

CREATE INDEX tasks_user_id_idx ON public.tasks USING btree (user_id);

CREATE INDEX tasks_workspace_due_idx ON public.tasks USING btree (workspace_id, due_date);

CREATE INDEX idx_workspace_members_user ON public.workspace_members USING btree (user_id);

CREATE OR REPLACE FUNCTION private.assign_invoice_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null or not exists(select 1 from public.workspace_members where workspace_id=new.workspace_id and user_id=auth.uid()) then
    raise exception 'Workspace access denied' using errcode='42501';
  end if;
  insert into private.invoice_counters(workspace_id,last_number) values(new.workspace_id,1001)
    on conflict(workspace_id) do update set last_number=private.invoice_counters.last_number+1 returning last_number into new.number;
  return new;
end;
$function$;

revoke all on function "private"."assign_invoice_number"() from public, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.bootstrap_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

revoke all on function "private"."bootstrap_user"() from public, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.log_deal_stage_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  if new.stage_id is distinct from old.stage_id and auth.uid() is not null then
    insert into public.activities(workspace_id,subject_type,subject_id,kind,body,created_by)
      values(new.workspace_id,'deal',new.id,'stage_change','تغییر مرحله معامله',auth.uid());
  end if;
  return new;
end;
$function$;

revoke all on function "private"."log_deal_stage_change"() from public, anon, authenticated, service_role;

grant EXECUTE on function "private"."log_deal_stage_change"() to "service_role";

CREATE OR REPLACE FUNCTION private.log_payment_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is not null and coalesce(new.invoice_id,new.customer_id) is not null then
    insert into public.activities(workspace_id,subject_type,subject_id,kind,body,created_by)
      values(new.workspace_id,case when new.invoice_id is null then 'customer' else 'invoice' end,
        coalesce(new.invoice_id,new.customer_id),'payment','پرداخت ثبت شد',auth.uid());
  end if;
  return new;
end;
$function$;

revoke all on function "private"."log_payment_activity"() from public, anon, authenticated, service_role;

grant EXECUTE on function "private"."log_payment_activity"() to "service_role";

CREATE OR REPLACE FUNCTION private.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$;

revoke all on function "private"."touch_updated_at"() from public, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.create_invoice_with_items(workspace uuid, header jsonb, lines jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
$function$;

revoke all on function "public"."create_invoice_with_items"(workspace uuid, header jsonb, lines jsonb) from public, anon, authenticated, service_role;

grant EXECUTE on function "public"."create_invoice_with_items"(workspace uuid, header jsonb, lines jsonb) to "authenticated";

grant EXECUTE on function "public"."create_invoice_with_items"(workspace uuid, header jsonb, lines jsonb) to "service_role";

revoke all on table "private"."invoice_counters" from public, anon, authenticated, service_role;

alter table "private"."invoice_counters" enable row level security;

revoke all on table "public"."activities" from public, anon, authenticated, service_role;

alter table "public"."activities" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."activities" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."activities" to "authenticated";

revoke all on table "public"."cheques" from public, anon, authenticated, service_role;

alter table "public"."cheques" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."cheques" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."cheques" to "authenticated";

revoke all on table "public"."customers" from public, anon, authenticated, service_role;

alter table "public"."customers" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."customers" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."customers" to "authenticated";

revoke all on table "public"."deals" from public, anon, authenticated, service_role;

alter table "public"."deals" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."deals" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."deals" to "authenticated";

revoke all on table "public"."invoice_items" from public, anon, authenticated, service_role;

alter table "public"."invoice_items" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."invoice_items" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."invoice_items" to "authenticated";

revoke all on table "public"."invoices" from public, anon, authenticated, service_role;

alter table "public"."invoices" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."invoices" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."invoices" to "authenticated";

revoke all on table "public"."leads" from public, anon, authenticated, service_role;

alter table "public"."leads" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."leads" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."leads" to "authenticated";

revoke all on table "public"."notifications" from public, anon, authenticated, service_role;

alter table "public"."notifications" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."notifications" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."notifications" to "authenticated";

revoke all on table "public"."payments" from public, anon, authenticated, service_role;

alter table "public"."payments" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."payments" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."payments" to "authenticated";

revoke all on table "public"."pipeline_stages" from public, anon, authenticated, service_role;

alter table "public"."pipeline_stages" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."pipeline_stages" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."pipeline_stages" to "authenticated";

revoke all on table "public"."profiles" from public, anon, authenticated, service_role;

alter table "public"."profiles" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."profiles" to "service_role";

grant SELECT on table "public"."profiles" to "authenticated";

grant UPDATE("full_name") on table "public"."profiles" to "authenticated";

grant UPDATE("company_name") on table "public"."profiles" to "authenticated";

grant UPDATE("status") on table "public"."profiles" to "authenticated";

grant UPDATE("updated_at") on table "public"."profiles" to "authenticated";

revoke all on table "public"."tasks" from public, anon, authenticated, service_role;

alter table "public"."tasks" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."tasks" to "service_role";

grant DELETE, INSERT, SELECT, UPDATE on table "public"."tasks" to "authenticated";

revoke all on table "public"."workspace_members" from public, anon, authenticated, service_role;

alter table "public"."workspace_members" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."workspace_members" to "service_role";

grant SELECT on table "public"."workspace_members" to "authenticated";

revoke all on table "public"."workspaces" from public, anon, authenticated, service_role;

alter table "public"."workspaces" enable row level security;

grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table "public"."workspaces" to "service_role";

grant SELECT on table "public"."workspaces" to "authenticated";

create policy "internal_only" on "private"."invoice_counters" as PERMISSIVE for ALL to "authenticated" using (false) with check (false);

create policy "workspace_access" on "public"."activities" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "workspace_access" on "public"."cheques" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "workspace_access" on "public"."customers" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "workspace_access" on "public"."deals" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "workspace_access" on "public"."invoice_items" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "workspace_access" on "public"."invoices" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "workspace_access" on "public"."leads" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "own_notifications" on "public"."notifications" as PERMISSIVE for ALL to "authenticated" using (((user_id = ( SELECT auth.uid() AS uid)) AND (workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))))) with check (((user_id = ( SELECT auth.uid() AS uid)) AND (workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))));

create policy "workspace_access" on "public"."payments" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "workspace_access" on "public"."pipeline_stages" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "own_profile" on "public"."profiles" as PERMISSIVE for SELECT to "authenticated" using ((id = ( SELECT auth.uid() AS uid)));

create policy "update_own_profile" on "public"."profiles" as PERMISSIVE for UPDATE to "authenticated" using ((id = ( SELECT auth.uid() AS uid))) with check ((id = ( SELECT auth.uid() AS uid)));

create policy "workspace_access" on "public"."tasks" as PERMISSIVE for ALL to "authenticated" using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid))))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

create policy "own_membership" on "public"."workspace_members" as PERMISSIVE for SELECT to "authenticated" using ((user_id = ( SELECT auth.uid() AS uid)));

create policy "member_workspace" on "public"."workspaces" as PERMISSIVE for SELECT to "authenticated" using ((id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = ( SELECT auth.uid() AS uid)))));

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION private.bootstrap_user();

CREATE TRIGGER touch_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();

CREATE TRIGGER deals_stage_activity AFTER UPDATE OF stage_id ON deals FOR EACH ROW EXECUTE FUNCTION private.log_deal_stage_change();

CREATE TRIGGER touch_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();

CREATE TRIGGER assign_invoice_number BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION private.assign_invoice_number();

CREATE TRIGGER touch_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();

CREATE TRIGGER touch_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();

CREATE TRIGGER payments_activity AFTER INSERT ON payments FOR EACH ROW EXECUTE FUNCTION private.log_payment_activity();

CREATE TRIGGER touch_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();

CREATE TRIGGER touch_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at();

commit;
