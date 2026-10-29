# LightCRM

### Give every opportunity a clear next step.

Good customer relationships grow through small, consistent actions: the call made on time, the detail remembered, the proposal that moves forward. LightCRM brings those actions into one workspace, connecting your sales pipeline, customer records, daily work and invoicing.

Built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4** and **Supabase**. A focused interface, a typed application layer and a database that enforces workspace boundaries keep the experience straightforward as your records grow.

![LightCRM dashboard](public/screenshot.png)

## From first conversation to next commitment

| Workspace | What you can do |
| --- | --- |
| **Today** | See overdue follow-ups, upcoming work, invoices, cheques and recent activity together. |
| **Pipeline** | Move deals through sales stages, track their progress and record the next conversation. Drag-and-drop and keyboard controls are supported. |
| **Customers** | Keep individual and company contacts organized, distinguish leads from customers and reach contact channels quickly. |
| **Invoices** | Build itemized invoices and proformas, calculate discounts and tax, print documents and track Sayad cheques. |
| **Tasks** | Create, complete and reschedule work with a Jalali calendar. |
| **Analytics** | Review pipeline performance and six months of invoice activity from your workspace data. |

The dashboard adapts to desktop and mobile screens. Forms preserve drafts when a save fails, failed requests offer a retry, and empty states provide a useful starting point.

## Get started

You will need **Node.js 24 or later**, npm and a Supabase project. Use the committed lockfile for reproducible installs.

```bash
git clone https://github.com/Sina-Majd/LightCRM.git
cd LightCRM
npm ci
```

Copy `.env.example` to `.env.local` and enter your project's public credentials:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_public_key
```

The historical `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable accepts a publishable key or a legacy anon key. These values are included in browser JavaScript. Keep secret and service-role keys out of this file; the application does not require them.

### 1. Create the database

For a **new, empty Supabase project**, open the SQL Editor and run the complete contents of **[supabase/schema.sql](supabase/schema.sql)** once, before registering application users.

This schema-only snapshot reproduces the verified application database architecture: tables, constraints, indexes, grants, row-level security, signup automation and transactional invoice creation. It includes no accounts, customer records, payments or private counter values. Supabase supplies the Auth schema and standard database roles.

Use a Supabase project running **PostgreSQL 17 or later**. The script runs as one transaction and expects the SQL Editor's administrative privileges.

**For an existing installation**, review its schema and migration history and take a backup before applying changes. The versioned upgrades are:

- [Workspace security and invoice transactions](supabase/migrations/20261028180337_harden_workspace_security_and_invoice_transactions.sql)
- [Tenant foreign-key indexes](supabase/migrations/20261028180704_cover_tenant_foreign_keys.sql)

These migrations upgrade the earlier LightCRM schema and preserve its business records. Apply only pending migrations in order. A fresh installation using `schema.sql` already includes both upgrades; do not run them again or run the snapshot over existing tables.

### 2. Configure authentication

In your Supabase project's Authentication settings:

1. Enable email/password sign-in.
2. Set the local Site URL to `http://localhost:3000`.
3. Add `http://localhost:3000/auth/callback` to the allowed Redirect URLs. Add the equivalent HTTPS callback for your deployment.
4. Keep the confirmation email template's `{{ .ConfirmationURL }}` link. Registration supplies the callback URL for the PKCE exchange; open the link in the browser used to register.
5. Choose your email confirmation policy, configure SMTP for production delivery and review password security settings.

### 3. Open your workspace

```bash
npm run dev
```

Visit [localhost:3000](http://localhost:3000) and create an account. Signup creates a profile, a private workspace, its owner membership and five pipeline stages. Business records start empty, ready for your own work.

Each account receives a separate workspace. Invitations and membership administration currently require trusted administrative tooling.

## A database with clear boundaries

Workspace access is enforced in PostgreSQL. Every public application table has row-level security, membership changes are unavailable to browser roles, and composite foreign keys keep related records inside the same workspace. Notifications are visible only to their recipient.

| Area | Tables |
| --- | --- |
| Identity and access | `profiles`, `workspaces`, `workspace_members` |
| Sales and contacts | `pipeline_stages`, `deals`, `customers`, `leads` |
| Work and history | `tasks`, `activities`, `notifications` |
| Commercial records | `invoices`, `invoice_items`, `payments`, `cheques` |
| Internal numbering | `private.invoice_counters` |

Profile updates are limited to display and availability fields. Signup metadata cannot select a paid plan or grant permissions. Internal trigger functions use fixed search paths and have no public execution grants.

### Invoice integrity

`create_invoice_with_items(workspace, header, lines)` saves the invoice and its items in one transaction under the caller's permissions and row-level security. PostgreSQL calculates the totals and allocates a unique, sequential number within the workspace. A failed item rolls back the invoice and its number allocation.

Invoice numbers are immutable. A saved customer name remains on the invoice after a contact is removed, while optional customer references are cleared without deleting commercial records. Constraints validate amounts, quantities, tax, discounts and workspace relationships.

Money is stored in **Rial** and entered and displayed in **Toman**. Tax defaults to 10%, is adjustable per line and is rounded per line. Discounts are capped at the line's gross amount. Date-only values use PostgreSQL `date`; timed follow-ups use `timestamptz`.

### Reporting scope

Analytics groups issued and paid invoice amounts by **invoice issue month**. Cash-receipt reporting, payment reconciliation, online payment links, subscription billing and Realtime subscriptions are outside the current feature set. Customer health and lifetime value are stored attributes. The `leads` and `payments` tables remain available for existing records and integrations; the customer directory manages its lead segment through `customers`.

## Quality checks

The test suite uses **Vitest**, Testing Library, an embedded PostgreSQL runtime and real-browser checks. It covers domain calculations, form behavior, service requests, workspace state, permissions and invoice transactions.

```bash
npm test                 # Unit, component, service, provider and database tests
npm run test:watch       # Interactive watch mode
npm run test:coverage    # V8 coverage, with an HTML report in coverage/
npm run check:fast       # TypeScript, ESLint and Vitest
npm run check:full       # Fast checks and a production build
```

Database tests execute the actual fresh schema and versioned upgrades in [PGlite](https://pglite.dev/). A small harness supplies Supabase's Auth-owned table and `auth.uid()`. The tests verify tenant isolation, restricted privileges, signup defaults, data-preserving upgrades and atomic invoice saves.

For an administrative check against a configured Supabase database, run **[supabase/tests/smoke.sql](supabase/tests/smoke.sql)** in the SQL Editor. It creates temporary test accounts and records inside a transaction, asserts the security and invoice rules, then rolls everything back. Run the entire file in one session.

### Browser checks

Vitest Browser Mode uses Playwright to render all six dashboard views at desktop and mobile widths. Checks cover empty states, keyboard interactions, dialogs, horizontal overflow and accessibility rules. Screenshots are saved under `.next/dashboard-review/`.

```bash
npx playwright install chromium
npm run test:browser
```

You can also use an installed Google Chrome when the Chromium download is unavailable:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:browser
```

Browser tests use controlled workspace fixtures and a mocked Next.js router. They complement authenticated end-to-end testing; they do not exercise hosted email delivery or a complete live sign-in session.

GitHub Actions runs type checks, lint, coverage, the production build and browser tests without production credentials. Next.js downloads Google Fonts during builds, so the build environment needs access to those endpoints.

## Project structure

```text
src/app/                    Routes, authentication callback and dashboard pages
src/components/dashboard/   Workspace views, dialogs and shared state provider
src/components/ui/          Reusable interface primitives
src/lib/auth/               Authentication redirect and session helpers
src/lib/crm/                Domain types, analytics, pipeline and storage helpers
src/lib/fa/                 Calendar, currency, phone and display formatting
src/lib/supabase/           Typed clients, session handling and data services
supabase/schema.sql         Complete schema for a fresh Supabase project
supabase/migrations/        Versioned upgrades for existing installations
supabase/tests/             Transactional database smoke test
tests/                      Vitest suites, database fixtures and browser checks
```

`CrmProvider` coordinates workspace state. Resources load independently, and pipeline drops update immediately with rollback if saving fails. Other mutations update state after persistence succeeds. Local deal ordering is scoped to the workspace. Supabase types are generated from the database and shared by browser, server and session clients.

## Deploy and contribute

Apply the database setup, configure the public environment variables on your hosting platform, and set the production Auth Site URL and callback URL. Validate the application before deploying:

```bash
npm run check:full
npm run start
```

Responses that refresh authentication cookies must remain private and uncached. The session proxy preserves refreshed cookies and sets the appropriate cache controls.

Contributions should include focused tests for changed behavior and pass the quality checks above. For database changes, add a versioned migration, keep the fresh-project snapshot aligned and verify permissions as well as data integrity.

## License

Released under the [MIT License](LICENSE).
