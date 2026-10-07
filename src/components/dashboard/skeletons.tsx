"use client";

/**
 * Skeleton loaders shaped to match the real layout of each view, so the
 * transition to loaded content does not shift anything. Solid muted tones
 * only — reduced opacity is avoided throughout this app because it thins
 * the strokes of Persian glyphs.
 */

function Bar({
  w = "w-full",
  h = "h-3",
  className = "",
}: {
  w?: string;
  h?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-slate-200 ${w} ${h} ${className}`}
    />
  );
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

function PanelTitle({ w = "w-40" }: { w?: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <div className="size-9 animate-pulse rounded-xl bg-slate-200" />
      <div className="space-y-1.5">
        <Bar w={w} h="h-3" />
        <Bar w="w-28" h="h-2.5" />
      </div>
    </div>
  );
}

function Rows({ n = 5 }: { n?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3"
        >
          <div className="size-[18px] shrink-0 animate-pulse rounded-md border-2 border-slate-200" />
          <div className="flex-1 space-y-1.5">
            <Bar w="w-3/5" h="h-3" />
            <Bar w="w-2/5" h="h-2.5" />
          </div>
          <div className="size-16 shrink-0 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

/** /dashboard/today — command bar, KPI band, work band, activity strip. */
export function TodaySkeleton() {
  return (
    <div className="space-y-4" dir="rtl" aria-busy="true" aria-live="polite">
      <span className="sr-only">در حال بارگذاری میز کار…</span>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 animate-pulse rounded-xl bg-brand-100" />
          <div className="space-y-1.5">
            <Bar w="w-40" h="h-3" />
            <Bar w="w-28" h="h-2.5" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 animate-pulse rounded-xl bg-brand-100" />
          <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 rounded-2xl bg-brand-900 p-5 lg:col-span-4">
          <div className="flex items-center justify-between">
            <Bar w="w-24" h="h-3" className="bg-brand-700" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-brand-800" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="h-11 w-28 animate-pulse rounded-lg bg-brand-800" />
            <div className="space-y-2 pt-1">
              <Bar w="w-full" h="h-3" className="bg-brand-800" />
              <Bar w="w-4/5" h="h-3" className="bg-brand-800" />
              <Bar w="w-2/3" h="h-3" className="bg-brand-800" />
            </div>
          </div>
          <div className="mt-5 space-y-2 border-t border-brand-800 pt-3">
            <Bar w="w-full" h="h-2.5" className="bg-brand-800" />
            <div className="h-1.5 w-full animate-pulse rounded-full bg-brand-800" />
          </div>
        </div>

        <Panel className="lg:col-span-4">
          <PanelTitle w="w-32" />
          <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <Bar w="w-full" h="h-3" />
            <Bar w="w-5/6" h="h-3" />
            <Bar w="w-4/6" h="h-3" />
          </div>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelTitle w="w-36" />
          <div className="h-6 w-44 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <Bar w="w-full" h="h-3" />
            <Bar w="w-5/6" h="h-3" />
            <Bar w="w-3/4" h="h-3" />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <PanelTitle w="w-32" />
          <div className="mb-3 flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-16 animate-pulse rounded-full bg-slate-100" />
            ))}
          </div>
          <Rows n={5} />
        </Panel>
        <Panel className="lg:col-span-5">
          <PanelTitle w="w-40" />
          <Rows n={4} />
        </Panel>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <PanelTitle w="w-28" />
        <div className="grid gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="size-[27px] animate-pulse rounded-full border-2 border-slate-200" />
              <Bar w="w-4/5" h="h-3" />
              <Bar w="w-full" h="h-2.5" />
              <Bar w="w-11/12" h="h-2.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** /dashboard/pipeline — KPI row, toolbar, five columns. */
export function PipelineSkeleton() {
  return (
    <div className="space-y-4" dir="rtl" aria-busy="true">
      <span className="sr-only">در حال بارگذاری پایپ‌لاین…</span>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <div className="size-8 animate-pulse rounded-xl bg-slate-100" />
              <Bar w="w-24" h="h-3" />
            </div>
            <div className="mt-2.5 h-6 w-32 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-2.5 w-28 animate-pulse rounded-full bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Bar w="w-24" h="h-3" />
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-14 animate-pulse rounded-lg bg-white" />
            ))}
          </div>
        </div>
        <div className="h-9 w-32 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((col) => (
          <div
            key={col}
            className="flex flex-col rounded-2xl border border-slate-200 bg-slate-100/60"
          >
            <div className="space-y-2 border-b border-slate-200 px-4 pb-3.5 pt-4">
              <div className="flex items-center justify-between">
                <Bar w="w-28" h="h-3.5" />
                <div className="h-5 w-8 animate-pulse rounded-full bg-white ring-1 ring-slate-200" />
              </div>
              <div className="flex items-center justify-between">
                <Bar w="w-16" h="h-2.5" />
                <Bar w="w-20" h="h-3" />
              </div>
              <div className="h-1.5 w-full animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="space-y-2 p-2">
              {[1, 2].map((c) => (
                <div
                  key={c}
                  className="space-y-2 rounded-xl border border-slate-200 bg-white p-3.5"
                >
                  <Bar w="w-4/5" h="h-3" />
                  <Bar w="w-full" h="h-3" />
                  <Bar w="w-2/3" h="h-4" />
                  <div className="h-5 w-full animate-pulse rounded-lg bg-slate-100" />
                  <Bar w="w-1/2" h="h-2.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** /dashboard/customers — summary strip + card grid. */
export function CustomersSkeleton() {
  return (
    <div className="space-y-4" dir="rtl" aria-busy="true">
      <span className="sr-only">در حال بارگذاری مشتریان…</span>
      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
            <Bar w="w-24" h="h-3" />
            <div className="mt-2 h-6 w-28 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="flex-1 space-y-1.5">
                <Bar w="w-3/5" h="h-3" />
                <Bar w="w-2/5" h="h-2.5" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Bar w="w-full" h="h-2.5" />
              <Bar w="w-5/6" h="h-2.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** /dashboard/invoices — two stacked tables. */
export function InvoicesSkeleton() {
  return (
    <div className="space-y-4" dir="rtl" aria-busy="true">
      <span className="sr-only">در حال بارگذاری فاکتورها…</span>
      <Panel>
        <PanelTitle w="w-44" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3"
            >
              <div className="w-20 shrink-0 animate-pulse rounded-lg bg-slate-100" />
              <div className="flex-1 space-y-1.5">
                <Bar w="w-2/5" h="h-3" />
                <Bar w="w-1/4" h="h-2.5" />
              </div>
              <Bar w="w-24" h="h-4" />
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <PanelTitle w="w-36" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3"
            >
              <div className="w-24 shrink-0 animate-pulse rounded-lg bg-slate-100" />
              <div className="flex-1 space-y-1.5">
                <Bar w="w-1/3" h="h-3" />
                <Bar w="w-1/4" h="h-2.5" />
              </div>
              <Bar w="w-24" h="h-4" />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/** /dashboard/tasks — filter tabs + list. */
export function TasksSkeleton() {
  return (
    <div className="space-y-4" dir="rtl" aria-busy="true">
      <span className="sr-only">در حال بارگذاری وظایف…</span>
      <Panel>
        <PanelTitle w="w-36" />
        <div className="mb-4 flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-slate-100" />
          ))}
        </div>
        <Rows n={6} />
      </Panel>
    </div>
  );
}

/** /dashboard/analytics — metric row + chart blocks. */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-4" dir="rtl" aria-busy="true">
      <span className="sr-only">در حال بارگذاری گزارش‌ها…</span>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
            <Bar w="w-24" h="h-3" />
            <div className="mt-2.5 h-7 w-32 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>
      <Panel>
        <PanelTitle w="w-40" />
        <div className="flex h-44 items-end gap-2 pt-2">
          {[45, 70, 55, 90, 62, 80, 50].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 animate-pulse rounded-t-lg bg-slate-100"
            />
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle w="w-32" />
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Bar w="w-28" h="h-3" />
                <div className="h-2 flex-1 animate-pulse rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelTitle w="w-32" />
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Bar w="w-28" h="h-3" />
                <div className="h-2 flex-1 animate-pulse rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}