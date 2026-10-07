# LightCRM

An open-source, high-performance CRM system engineered for modern businesses, agencies, and sales teams. Built with **Next.js 16** (App Router & Turbopack), **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

<p align="center">
  <img src="public/screenshot.png" alt="LightCRM Platform Preview" width="100%" />
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Auth_%26_Postgres-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License: MIT" /></a>
</p>

---

## Key Features

- **Today Command Center**: A focused daily operations dashboard highlighting stale deals lacking next actions, overdue customer follow-ups, Sayad cheques maturing this week, and a real-time team activity feed.
- **Visual Sales Pipeline**: Interactive drag-and-drop Kanban board powered by `@hello-pangea/dnd`, featuring stage revenue metrics, deal health indicators, urgency tags, and a slide-out deal inspector with quick call logging.
- **Invoices & Sayad Cheques Management**:
  - Create proformas and official tax invoices with itemized line entries, discounts, and real-time 10% VAT calculation.
  - Standard A4 printable invoice layout styled with dedicated print stylesheets.
  - 16-digit Sayad cheque tracking across commercial banks with complete lifecycle statuses (*In Hand*, *Deposited*, *Cleared*, *Bounced*).
- **Customer & Lead Intelligence**: Comprehensive directory supporting both individual contacts and company accounts, lead temperature scoring (*Hot*, *Warm*, *Cold*), customer lifetime value (LTV) tracking, and one-click communication actions (Call, SMS, WhatsApp).
- **Performance Analytics & Tasks**: Monthly sales targets against actual closed revenue, sales funnel conversion velocity metrics, and team task assignment checklists.
- **Jalali (Solar Hijri) Calendar & RTL Support**: Native Solar Hijri date picker (`JalaliDatePicker`), Persian/English digit converters, currency formatters (Toman & Rial), and full right-to-left layout support paired with Vazirmatn typography.

---

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React Server Components, Turbopack, nested layouts, route handlers |
| **Frontend Library** | React 19 | Server Actions, modern hooks, concurrent transitions |
| **Language** | TypeScript 5 | Strict static typing across CRM models and database services |
| **Styling** | Tailwind CSS v4 | PostCSS integration, design tokens, light-theme surface contrast |
| **Typography** | Vazirmatn (`next/font/google`) | Clean typography with full RTL and Persian numeral support |
| **Database & Auth** | Supabase | PostgreSQL, Row Level Security (RLS), Realtime subscriptions |
| **UI Primitives** | Radix UI & Lucide Icons | Accessible dialogs, slide-out sheets, selects, and dropdown menus |
| **Charts & Drag-and-Drop** | Recharts & `@hello-pangea/dnd` | Interactive revenue charts and fluid Kanban board interactions |
| **Notifications** | Sonner | Stacked feedback toasts with RTL alignment |

---

## Quick Start

### 1. Prerequisites
- **Node.js**: `20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Supabase Account**: A free Supabase project for PostgreSQL and Authentication

### 2. Clone and Install
```bash
git clone https://github.com/Sina-Majd/LightCRM.git
cd LightCRM
npm install
```

### 3. Environment Variables
Create an `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Setup (Supabase)
Run the following SQL script inside your **Supabase SQL Editor** to initialize the required tables and security policies:

```sql
-- Profiles table linked to Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text default 'Sales Lead',
  company_name text default 'My Workspace',
  email text,
  role text default 'Sales Lead',
  status text default 'Available' check (status in ('Available', 'Away', 'Do Not Disturb')),
  plan text default 'business',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Pipeline Stages
create table if not exists public.pipeline_stages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  stage_key text not null,
  title text not null,
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Deals / Opportunities
create table if not exists public.deals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  company text not null,
  contact text not null,
  email text default '',
  phone text default '',
  value numeric default 0,
  stage_id text not null default 'stage-new',
  priority text default 'medium' check (priority in ('urgent', 'high', 'medium', 'low')),
  probability integer default 50,
  tags text[] default array[]::text[],
  notes text default '',
  next_action_title text,
  next_action_due text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Customers
create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  company text default '',
  email text default '',
  phone text default '',
  customer_type text default 'company' check (customer_type in ('individual', 'company')),
  segment text default 'lead' check (segment in ('lead', 'customer')),
  total_spend numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Invoices
create table if not exists public.invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  customer_id text,
  customer_name text not null,
  invoice_number text not null,
  invoice_type text default 'proforma' check (invoice_type in ('proforma', 'invoice')),
  status text default 'draft' check (status in ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled')),
  subtotal numeric default 0,
  tax numeric default 0,
  discount numeric default 0,
  total numeric default 0,
  paid_amount numeric default 0,
  issue_date text not null,
  due_date text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Invoice Line Items
create table if not exists public.invoice_items (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references public.invoices on delete cascade not null,
  description text not null,
  quantity numeric default 1,
  unit_price numeric default 0,
  discount numeric default 0,
  tax_rate numeric default 10,
  total numeric default 0
);

-- Sayad Cheques
create table if not exists public.cheques (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  sayad_number text not null,
  bank_name text not null,
  amount numeric not null,
  due_date text not null,
  drawer_name text not null,
  holder_name text not null,
  status text default 'in_hand' check (status in ('in_hand', 'deposited', 'cleared', 'bounced')),
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tasks
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  type text default 'call',
  due_date text not null,
  priority text default 'medium',
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Activities
create table if not exists public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  deal_id text,
  customer_id text,
  kind text not null,
  title text not null,
  description text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.deals enable row level security;
alter table public.customers enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.cheques enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;

-- Basic Policies (User isolation)
create policy "Users own profiles" on public.profiles for all using (auth.uid() = id);
create policy "Users own stages" on public.pipeline_stages for all using (auth.uid() = user_id);
create policy "Users own deals" on public.deals for all using (auth.uid() = user_id);
create policy "Users own customers" on public.customers for all using (auth.uid() = user_id);
create policy "Users own invoices" on public.invoices for all using (auth.uid() = user_id);
create policy "Users own invoice items" on public.invoice_items for all using (true);
create policy "Users own cheques" on public.cheques for all using (auth.uid() = user_id);
create policy "Users own tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Users own activities" on public.activities for all using (auth.uid() = user_id);
```

### 5. Running the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## Project Structure

```
LightCRM/
├── public/                     # Static media, logo assets, screenshot
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Authenticated CRM workspace
│   │   │   ├── today/          # Today Command Center view
│   │   │   ├── pipeline/       # Sales Pipeline Kanban board
│   │   │   ├── customers/      # Customer & Lead Directory
│   │   │   ├── invoices/       # Invoices & Sayad Cheques
│   │   │   ├── tasks/          # Team Tasks Management
│   │   │   ├── analytics/      # Performance & Funnel Reports
│   │   │   └── layout.tsx      # Persistent layout & CrmProvider frame
│   │   ├── login/              # User authentication login
│   │   ├── register/           # New account registration
│   │   ├── layout.tsx          # Root layout (Vazirmatn & RTL configuration)
│   │   ├── page.tsx            # Marketing landing page
│   │   └── globals.css         # Theme tokens & A4 invoice print CSS
│   ├── components/
│   │   ├── dashboard/          # CRM views, modals, drawers, and skeletons
│   │   ├── landing/            # Landing page hero, pricing, and showcase sections
│   │   └── ui/                 # JalaliDatePicker, Sheet, Dialog, and UI primitives
│   ├── data/
│   │   └── dashboard-mock-data.ts # Seed schemas, types, and fallback data
│   └── lib/
│       ├── fa/                 # Jalali calendar, currency, and cheque utilities
│       └── supabase/           # Client, server, middleware, and CRM service
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts the local development server with Turbopack |
| `npm run build` | `next build` | Compiles an optimized production build |
| `npm run start` | `next start` | Starts the compiled production application |
| `npm run lint` | `eslint` | Runs ESLint to inspect code quality and conventions |

---

## License

This project is open-source and available under the [MIT License](LICENSE).
