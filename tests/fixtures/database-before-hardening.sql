-- Catalog fixture from LightCRM before the workspace hardening migration.

-- Demo seed contents are omitted; the function signature is preserved for migration testing.

begin;

set local search_path = public, pg_catalog;

create table public."activities" (
  "id" uuid default gen_random_uuid() not null,
  "workspace_id" uuid not null,
  "subject_type" text not null,
  "subject_id" uuid not null,
  "kind" text not null,
  "body" text default ''::text not null,
  "happened_at" timestamp with time zone default now() not null,
  "created_by" uuid,
  "created_at" timestamp with time zone default now() not null,
  "call_result" text
);

create table public."cheques" (
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

create table public."customers" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "name" text not null,
  "company" text not null,
  "email" text not null,
  "phone" text,
  "ltv" numeric default 0 not null,
  "active_deals_count" integer default 1 not null,
  "health_score" integer default 90 not null,
  "health_status" text default 'good'::text not null,
  "tier" text default 'Growth'::text not null,
  "renewal_date" text default 'In 12 Months'::text not null,
  "last_touch" text default 'Just now'::text not null,
  "location" text default 'Global'::text not null,
  "industry" text default 'Technology & Services'::text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid,
  "created_by" uuid,
  "customer_type" text default 'company'::text,
  "national_id" text,
  "economic_code" text,
  "segment" text default 'customer'::text
);

create table public."deals" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "title" text not null,
  "company" text not null,
  "contact" text not null,
  "email" text,
  "phone" text,
  "value" numeric default 0 not null,
  "stage_id" text not null,
  "priority" text default 'medium'::text not null,
  "probability" integer default 50 not null,
  "tags" text[] default '{}'::text[] not null,
  "notes" text default ''::text not null,
  "days_in_stage" integer default 0 not null,
  "last_activity" text default 'Just now'::text not null,
  "assignee_name" text default 'You'::text not null,
  "assignee_avatar" text default ''::text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid,
  "created_by" uuid,
  "next_action_title" text,
  "next_action_due" timestamp with time zone
);

create table public."invoice_items" (
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

create table public."invoices" (
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
  "created_by" uuid,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null
);

create table public."leads" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
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
  "workspace_id" uuid,
  "created_by" uuid
);

create table public."notifications" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "title" text not null,
  "description" text not null,
  "time" text default 'Just now'::text not null,
  "read" boolean default false not null,
  "type" text default 'system'::text not null,
  "created_at" timestamp with time zone default now() not null,
  "workspace_id" uuid
);

create table public."payments" (
  "id" uuid default gen_random_uuid() not null,
  "workspace_id" uuid not null,
  "invoice_id" uuid,
  "customer_id" uuid,
  "amount" numeric not null,
  "paid_at" date default CURRENT_DATE not null,
  "method" text default 'transfer'::text not null,
  "reference" text default ''::text not null,
  "notes" text default ''::text not null,
  "created_by" uuid,
  "created_at" timestamp with time zone default now() not null
);

create table public."pipeline_stages" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
  "stage_key" text not null,
  "title" text not null,
  "position" integer default 0 not null,
  "created_at" timestamp with time zone default now() not null,
  "workspace_id" uuid
);

create table public."profiles" (
  "id" uuid not null,
  "full_name" text,
  "company_name" text,
  "email" text,
  "role" text default 'Head of Sales'::text,
  "status" text default 'Available'::text,
  "plan" text default 'business'::text,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null,
  "workspace_id" uuid
);

create table public."tasks" (
  "id" uuid default gen_random_uuid() not null,
  "user_id" uuid not null,
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
  "workspace_id" uuid,
  "created_by" uuid
);

create table public."workspace_members" (
  "workspace_id" uuid not null,
  "user_id" uuid not null,
  "role" text default 'member'::text not null,
  "joined_at" timestamp with time zone default now() not null
);

create table public."workspaces" (
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

alter table public."profiles" add constraint "profiles_pkey" PRIMARY KEY (id);

alter table public."tasks" add constraint "tasks_pkey" PRIMARY KEY (id);

alter table public."workspace_members" add constraint "workspace_members_pkey" PRIMARY KEY (workspace_id, user_id);

alter table public."workspaces" add constraint "workspaces_pkey" PRIMARY KEY (id);

alter table public."invoices" add constraint "invoices_workspace_id_number_key" UNIQUE (workspace_id, number);

alter table public."activities" add constraint "activities_kind_check" CHECK (kind = ANY (ARRAY['call'::text, 'meeting'::text, 'note'::text, 'email'::text, 'stage_change'::text, 'payment'::text, 'cheque_status'::text]));

alter table public."activities" add constraint "activities_subject_type_check" CHECK (subject_type = ANY (ARRAY['deal'::text, 'lead'::text, 'customer'::text, 'invoice'::text]));

alter table public."cheques" add constraint "cheques_status_check" CHECK (status = ANY (ARRAY['in_hand'::text, 'deposited'::text, 'cleared'::text, 'bounced'::text]));

alter table public."customers" add constraint "customers_customer_type_check" CHECK (customer_type = ANY (ARRAY['individual'::text, 'company'::text]));

alter table public."customers" add constraint "customers_health_score_check" CHECK (health_score >= 0 AND health_score <= 100);

alter table public."customers" add constraint "customers_health_status_check" CHECK (health_status = ANY (ARRAY['excellent'::text, 'good'::text, 'warning'::text, 'critical'::text]));

alter table public."customers" add constraint "customers_segment_check" CHECK (segment = ANY (ARRAY['lead'::text, 'customer'::text, 'vip'::text, 'churned'::text]));

alter table public."customers" add constraint "customers_tier_check" CHECK (tier = ANY (ARRAY['Enterprise'::text, 'Growth'::text, 'Startup'::text]));

alter table public."deals" add constraint "deals_priority_check" CHECK (priority = ANY (ARRAY['urgent'::text, 'high'::text, 'medium'::text, 'low'::text]));

alter table public."deals" add constraint "deals_probability_check" CHECK (probability >= 0 AND probability <= 100);

alter table public."invoices" add constraint "invoices_status_check" CHECK (status = ANY (ARRAY['draft'::text, 'sent'::text, 'paid'::text, 'overdue'::text, 'cancelled'::text]));

alter table public."invoices" add constraint "invoices_type_check" CHECK (type = ANY (ARRAY['proforma'::text, 'invoice'::text]));

alter table public."leads" add constraint "leads_score_check" CHECK (score >= 1 AND score <= 100);

alter table public."leads" add constraint "leads_status_check" CHECK (status = ANY (ARRAY['hot'::text, 'warm'::text, 'qualified'::text, 'cold'::text]));

alter table public."notifications" add constraint "notifications_type_check" CHECK (type = ANY (ARRAY['deal'::text, 'lead'::text, 'payment'::text, 'customer'::text, 'system'::text]));

alter table public."payments" add constraint "payments_amount_check" CHECK (amount > 0::numeric);

alter table public."payments" add constraint "payments_method_check" CHECK (method = ANY (ARRAY['cash'::text, 'card'::text, 'transfer'::text, 'cheque'::text]));

alter table public."tasks" add constraint "tasks_due_category_check" CHECK (due_category = ANY (ARRAY['today'::text, 'upcoming'::text, 'overdue'::text]));

alter table public."tasks" add constraint "tasks_priority_check" CHECK (priority = ANY (ARRAY['urgent'::text, 'high'::text, 'medium'::text, 'low'::text]));

alter table public."tasks" add constraint "tasks_related_type_check" CHECK (related_type = ANY (ARRAY['deal'::text, 'lead'::text, 'customer'::text]));

alter table public."tasks" add constraint "tasks_type_check" CHECK (type = ANY (ARRAY['call'::text, 'email'::text, 'meeting'::text, 'review'::text]));

alter table public."workspace_members" add constraint "workspace_members_role_check" CHECK (role = ANY (ARRAY['owner'::text, 'member'::text]));

alter table public."activities" add constraint "activities_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."activities" add constraint "activities_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."cheques" add constraint "cheques_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

alter table public."cheques" add constraint "cheques_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;

alter table public."cheques" add constraint "cheques_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."customers" add constraint "customers_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."customers" add constraint "customers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."customers" add constraint "customers_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."deals" add constraint "deals_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."deals" add constraint "deals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."deals" add constraint "deals_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."invoice_items" add constraint "invoice_items_invoice_id_fkey" FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE;

alter table public."invoice_items" add constraint "invoice_items_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."invoices" add constraint "invoices_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."invoices" add constraint "invoices_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

alter table public."invoices" add constraint "invoices_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."leads" add constraint "leads_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."leads" add constraint "leads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."leads" add constraint "leads_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."notifications" add constraint "notifications_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."payments" add constraint "payments_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."payments" add constraint "payments_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

alter table public."payments" add constraint "payments_invoice_id_fkey" FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL;

alter table public."payments" add constraint "payments_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."pipeline_stages" add constraint "pipeline_stages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."pipeline_stages" add constraint "pipeline_stages_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."profiles" add constraint "profiles_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL;

alter table public."tasks" add constraint "tasks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

alter table public."tasks" add constraint "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."tasks" add constraint "tasks_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

alter table public."workspace_members" add constraint "workspace_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

alter table public."workspace_members" add constraint "workspace_members_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;

CREATE INDEX activities_subject_idx ON public.activities USING btree (workspace_id, subject_type, subject_id);

CREATE INDEX idx_activities_by ON public.activities USING btree (created_by);

CREATE INDEX idx_cheques_due_date ON public.cheques USING btree (due_date);

CREATE INDEX idx_cheques_workspace_id ON public.cheques USING btree (workspace_id);

CREATE INDEX customers_user_id_idx ON public.customers USING btree (user_id);

CREATE INDEX idx_customers_by ON public.customers USING btree (created_by);

CREATE INDEX idx_customers_ws ON public.customers USING btree (workspace_id);

CREATE INDEX deals_user_id_idx ON public.deals USING btree (user_id);

CREATE INDEX idx_deals_by ON public.deals USING btree (created_by);

CREATE INDEX idx_deals_next_action_due ON public.deals USING btree (next_action_due);

CREATE INDEX idx_deals_ws ON public.deals USING btree (workspace_id);

CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items USING btree (invoice_id);

CREATE INDEX idx_invoice_items_workspace_id ON public.invoice_items USING btree (workspace_id);

CREATE INDEX idx_invoices_by ON public.invoices USING btree (created_by);

CREATE INDEX idx_invoices_customer ON public.invoices USING btree (customer_id);

CREATE INDEX idx_invoices_ws ON public.invoices USING btree (workspace_id);

CREATE INDEX idx_leads_by ON public.leads USING btree (created_by);

CREATE INDEX idx_leads_ws ON public.leads USING btree (workspace_id);

CREATE INDEX leads_user_id_idx ON public.leads USING btree (user_id);

CREATE INDEX idx_notifications_ws ON public.notifications USING btree (workspace_id);

CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);

CREATE INDEX idx_payments_by ON public.payments USING btree (created_by);

CREATE INDEX idx_payments_customer ON public.payments USING btree (customer_id);

CREATE INDEX idx_payments_invoice ON public.payments USING btree (invoice_id);

CREATE INDEX idx_payments_ws ON public.payments USING btree (workspace_id);

CREATE INDEX idx_stages_ws ON public.pipeline_stages USING btree (workspace_id);

CREATE INDEX pipeline_stages_user_id_idx ON public.pipeline_stages USING btree (user_id);

CREATE INDEX idx_profiles_ws ON public.profiles USING btree (workspace_id);

CREATE INDEX idx_tasks_by ON public.tasks USING btree (created_by);

CREATE INDEX idx_tasks_ws ON public.tasks USING btree (workspace_id);

CREATE INDEX tasks_user_id_idx ON public.tasks USING btree (user_id);

CREATE INDEX idx_workspace_members_user ON public.workspace_members USING btree (user_id);

CREATE OR REPLACE FUNCTION public.create_workspace_with_owner(ws_name text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE ws uuid;
BEGIN
  INSERT INTO public.workspaces (name) VALUES (ws_name) RETURNING id INTO ws;
  INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES (ws, auth.uid(), 'owner');
  RETURN ws;
END; $function$;


revoke all on function public."create_workspace_with_owner"(ws_name text) from public, anon, authenticated, service_role;

grant execute on function public."create_workspace_with_owner"(ws_name text) to authenticated;

grant execute on function public."create_workspace_with_owner"(ws_name text) to service_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, full_name, company_name, email, role, status, plan)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Sales Pro'),
    coalesce(new.raw_user_meta_data->>'company', 'Acme CRM'),
    new.email,
    'Head of Sales',
    'Available',
    coalesce(new.raw_user_meta_data->>'plan', 'business')
  )
  on conflict (id) do nothing;

  perform public.seed_user_workspace(new.id);

  return new;
end;
$function$;


revoke all on function public."handle_new_user"() from public, anon, authenticated, service_role;

grant execute on function public."handle_new_user"() to service_role;

CREATE OR REPLACE FUNCTION public.is_workspace_member(ws uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = ws AND user_id = auth.uid());
$function$;


revoke all on function public."is_workspace_member"(ws uuid) from public, anon, authenticated, service_role;

grant execute on function public."is_workspace_member"(ws uuid) to authenticated;

grant execute on function public."is_workspace_member"(ws uuid) to service_role;

CREATE OR REPLACE FUNCTION public.is_workspace_owner(ws uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = ws AND user_id = auth.uid() AND role = 'owner');
$function$;


revoke all on function public."is_workspace_owner"(ws uuid) from public, anon, authenticated, service_role;

grant execute on function public."is_workspace_owner"(ws uuid) to authenticated;

grant execute on function public."is_workspace_owner"(ws uuid) to service_role;

CREATE OR REPLACE FUNCTION public.log_deal_stage_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF (NEW.stage_id IS DISTINCT FROM OLD.stage_id) THEN
    INSERT INTO public.activities (workspace_id, subject_type, subject_id, kind, body, happened_at, created_by)
    VALUES (NEW.workspace_id, 'deal', NEW.id, 'stage_change', 'تغییر مرحله معامله', now(), NEW.created_by);
  END IF;
  RETURN NEW;
END; $function$;


revoke all on function public."log_deal_stage_change"() from public, anon, authenticated, service_role;

grant execute on function public."log_deal_stage_change"() to service_role;

CREATE OR REPLACE FUNCTION public.log_payment_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.activities (workspace_id, subject_type, subject_id, kind, body, happened_at, created_by)
  VALUES (NEW.workspace_id, 'invoice', COALESCE(NEW.invoice_id, NEW.customer_id), 'payment', 'پرداخت ثبت شد', now(), NEW.created_by);
  RETURN NEW;
END; $function$;


revoke all on function public."log_payment_activity"() from public, anon, authenticated, service_role;

grant execute on function public."log_payment_activity"() to service_role;

create function public.seed_user_workspace(target_user_id uuid) returns void language plpgsql security definer set search_path = '' as $$ begin return; end; $$;

revoke all on function public."seed_user_workspace"(target_user_id uuid) from public, anon, authenticated, service_role;

grant execute on function public."seed_user_workspace"(target_user_id uuid) to service_role;

alter table public."activities" enable row level security;

alter table public."cheques" enable row level security;

alter table public."customers" enable row level security;

alter table public."deals" enable row level security;

alter table public."invoice_items" enable row level security;

alter table public."invoices" enable row level security;

alter table public."leads" enable row level security;

alter table public."notifications" enable row level security;

alter table public."payments" enable row level security;

alter table public."pipeline_stages" enable row level security;

alter table public."profiles" enable row level security;

alter table public."tasks" enable row level security;

alter table public."workspace_members" enable row level security;

alter table public."workspaces" enable row level security;

create policy "ws_members_access" on public."activities" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "cheques_workspace_isolation" on public."cheques" as PERMISSIVE for ALL to public using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = auth.uid())))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = auth.uid()))));

create policy "ws_members_access" on public."customers" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "ws_members_access" on public."deals" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "invoice_items_workspace_isolation" on public."invoice_items" as PERMISSIVE for ALL to public using ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = auth.uid())))) with check ((workspace_id IN ( SELECT workspace_members.workspace_id
   FROM workspace_members
  WHERE (workspace_members.user_id = auth.uid()))));

create policy "ws_members_access" on public."invoices" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "ws_members_access" on public."leads" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "ws_members_access" on public."notifications" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "ws_members_access" on public."payments" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "ws_members_access" on public."pipeline_stages" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "profiles_insert_own" on public."profiles" as PERMISSIVE for INSERT to authenticated with check ((( SELECT auth.uid() AS uid) = id));

create policy "profiles_select_own" on public."profiles" as PERMISSIVE for SELECT to authenticated using ((( SELECT auth.uid() AS uid) = id));

create policy "profiles_update_own" on public."profiles" as PERMISSIVE for UPDATE to authenticated using ((( SELECT auth.uid() AS uid) = id)) with check ((( SELECT auth.uid() AS uid) = id));

create policy "ws_members_access" on public."tasks" as PERMISSIVE for ALL to public using (is_workspace_member(workspace_id)) with check (is_workspace_member(workspace_id));

create policy "wsm_owner_remove" on public."workspace_members" as PERMISSIVE for DELETE to public using (is_workspace_owner(workspace_id));

create policy "wsm_owner_update" on public."workspace_members" as PERMISSIVE for UPDATE to public using (is_workspace_owner(workspace_id)) with check (is_workspace_owner(workspace_id));

create policy "wsm_read" on public."workspace_members" as PERMISSIVE for SELECT to public using (is_workspace_member(workspace_id));

create policy "wsm_self_join" on public."workspace_members" as PERMISSIVE for INSERT to public with check ((user_id = ( SELECT auth.uid() AS uid)));

create policy "ws_insert" on public."workspaces" as PERMISSIVE for INSERT to authenticated with check (true);

create policy "ws_owner_delete" on public."workspaces" as PERMISSIVE for DELETE to public using (is_workspace_owner(id));

create policy "ws_owner_update" on public."workspaces" as PERMISSIVE for UPDATE to public using (is_workspace_owner(id)) with check (is_workspace_owner(id));

create policy "ws_read" on public."workspaces" as PERMISSIVE for SELECT to public using (is_workspace_member(id));

grant all on table public."activities" to anon, authenticated, service_role;

grant all on table public."cheques" to anon, authenticated, service_role;

grant all on table public."customers" to anon, authenticated, service_role;

grant all on table public."deals" to anon, authenticated, service_role;

grant all on table public."invoice_items" to anon, authenticated, service_role;

grant all on table public."invoices" to anon, authenticated, service_role;

grant all on table public."leads" to anon, authenticated, service_role;

grant all on table public."notifications" to anon, authenticated, service_role;

grant all on table public."payments" to anon, authenticated, service_role;

grant all on table public."pipeline_stages" to anon, authenticated, service_role;

grant all on table public."profiles" to anon, authenticated, service_role;

grant all on table public."tasks" to anon, authenticated, service_role;

grant all on table public."workspace_members" to anon, authenticated, service_role;

grant all on table public."workspaces" to anon, authenticated, service_role;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER deals_stage_activity AFTER UPDATE OF stage_id ON deals FOR EACH ROW EXECUTE FUNCTION log_deal_stage_change();

CREATE TRIGGER payments_activity AFTER INSERT ON payments FOR EACH ROW EXECUTE FUNCTION log_payment_activity();

commit;
