"use client";

import { isOpenInvoice, isInvoiceOverdue } from "@/lib/crm/invoices";

import React, { useState } from "react";
import {
  AlertCircle,
  Banknote,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  FileText,
  History,
  PhoneCall,
  Plus,
  Receipt,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Deal, CRMTask, Invoice, Cheque, CRMActivity } from "@/lib/crm/types";
import {
  formatToman,
  formatTomanCompact,
  formatJalaliDate,
  formatRelativeFa,
  getDealNextActionState,
  getChequeStatusMeta,
  ACTIVITY_KIND_MAP,
  DEAL_PRIORITY_MAP,
  faDigits,
} from "@/lib/fa";
import {
  getActivityIcon,
  getChequeDueNote,
  bucketize,
  segmentPercents,
  daysUntil,
  daysSince,
  localDateStr,
  useCountUp,
  Segment,
  BucketDef,
} from "./today-view-helpers";
import { DashboardTab } from "./dashboard-shell";

interface Props {
  deals: Deal[];
  tasks: CRMTask[];
  invoices: Invoice[];
  cheques: Cheque[];
  activities: CRMActivity[];
  onNavigate: (tab: DashboardTab) => void;
  onSelectDeal: (deal: Deal) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onOpenNewDeal: () => void;
  onOpenNewInvoice: () => void;
  onOpenQuickCallModal?: (deal: Deal) => void;
}

type TaskFilter = "all" | "call" | "meeting" | "email" | "review";

const TASK_FILTERS: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "call", label: "تماس‌ها" },
  { id: "meeting", label: "جلسات" },
  { id: "email", label: "مکاتبه" },
  { id: "review", label: "بررسی" },
];

const TASK_TYPE_LABEL: Record<string, string> = {
  call: "تماس",
  meeting: "جلسه",
  email: "مکاتبه",
  review: "بررسی",
};

/** Cheques: when does the cash land? */
const CHEQUE_HORIZON: BucketDef[] = [
  { key: "od", label: "معوق", test: (d) => d < 0, barClass: "bg-rose-500", textClass: "text-rose-600" },
  { key: "w1", label: "تا ۷ روز", test: (d) => d <= 7, barClass: "bg-amber-500", textClass: "text-amber-700" },
  { key: "w4", label: "تا ۳۰ روز", test: (d) => d <= 30, barClass: "bg-brand-400", textClass: "text-brand-600" },
  { key: "later", label: "بعد از آن", test: () => true, barClass: "bg-slate-300", textClass: "text-slate-600" },
];

/** Receivables: how late is the money owed to us? */
const RECEIVABLE_AGING: BucketDef[] = [
  { key: "b60", label: "بالای ۶۰ روز", test: (d) => d <= -60, barClass: "bg-rose-600", textClass: "text-rose-700" },
  { key: "b30", label: "۳۱ تا ۶۰ روز", test: (d) => d <= -30, barClass: "bg-rose-500", textClass: "text-rose-700" },
  { key: "b0", label: "۱ تا ۳۰ روز", test: (d) => d < 0, barClass: "bg-amber-500", textClass: "text-amber-700" },
  { key: "due", label: "سررسید امروز", test: (d) => d === 0, barClass: "bg-amber-400", textClass: "text-amber-700" },
  { key: "ok", label: "پیش‌رو", test: (d) => d > 0, barClass: "bg-emerald-500", textClass: "text-emerald-700" },
];

/* ================================================================== *
 * Chrome. Solid colours only — reduced opacity thins the strokes and
 * dots of Persian glyphs and makes them unreadable.
 *
 * Radius scale (one rule, applied everywhere):
 *   surfaces = rounded-2xl · interactive = rounded-xl · pills = full
 * ================================================================== */

type Tone = "brand" | "rose" | "amber" | "indigo" | "emerald";

const TONE_CHIP: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 border-brand-200",
  rose: "bg-rose-50 text-rose-600 border-rose-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

function PanelHeader({
  icon: Icon,
  tone,
  title,
  subtitle,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: Tone;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pb-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Icon className={`size-[17px] shrink-0 ${TONE_CHIP[tone].split(" ")[1]}`} />
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-black text-slate-900">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function PanelLink({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 cursor-pointer items-center rounded-lg px-1.5 py-0.5 text-[11.5px] font-bold text-brand-700 transition hover:bg-brand-50 hover:text-brand-900"
    >
      {children}
      <ChevronLeft className="size-3.5" />
    </button>
  );
}

function EmptyState({
  icon: Icon,
  tone,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: Tone;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-2 py-10 text-center">
      <div
        className={`mx-auto flex size-11 items-center justify-center rounded-xl border ${TONE_CHIP[tone]}`}
      >
        <Icon className="size-5" />
      </div>
      <div className="text-[13px] font-black text-slate-800">{title}</div>
      <p className="mx-auto max-w-xs text-[11.5px] leading-5 text-slate-500">{body}</p>
    </div>
  );
}

function MoreRow({ count, onClick }: { count: number; onClick: () => void }) {
  if (count <= 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1.5 w-full cursor-pointer rounded-xl border border-dashed border-slate-200 py-2 text-center text-[11px] font-bold text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
    >
      نمایش {faDigits(count)} مورد دیگر
    </button>
  );
}

/* ================================================================== *
 * Charts — bullet bars carry more context than a single-value gauge
 * and cost a fraction of the space.
 * ================================================================== */

function SegmentedBar({
  segments,
  percents,
}: {
  segments: Segment[];
  percents: number[];
}) {
  return (
    <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100">
      {segments.map((s, i) =>
        percents[i] > 0 ? (
          <span
            key={s.key}
            title={`${s.label}: ${faDigits(s.count)}`}
            style={{ width: `${percents[i]}%` }}
            className={`h-full first:rounded-e-full last:rounded-s-full ${s.barClass}`}
          />
        ) : null
      )}
    </div>
  );
}

function SegmentLegend({
  segments,
  percents,
}: {
  segments: Segment[];
  percents: number[];
}) {
  const shown = segments.filter((_, i) => percents[i] > 0);
  if (shown.length === 0) return null;

  return (
    <ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1">
      {shown.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5 text-[10.5px]">
          <span className={`size-2 rounded-full ${s.barClass}`} />
          <span className="font-bold text-slate-600">{s.label}</span>
          <span className={`font-black tabular-nums ${s.textClass}`}>
            {faDigits(s.count)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function MetricHead({
  label,
  amount,
  hint,
  amountTone = "default",
}: {
  label: string;
  amount: string;
  hint: string;
  amountTone?: "default" | "bad" | "good";
}) {
  const tone =
    amountTone === "bad"
      ? "text-rose-600"
      : amountTone === "good"
        ? "text-emerald-700"
        : "text-slate-900";

  return (
    <div>
      <div className="text-[11px] font-bold text-slate-500">{label}</div>
      <div className={`mt-1 text-[21px] font-black tabular-nums leading-tight ${tone}`}>
        {amount}
      </div>
      <div className="mt-0.5 text-[10.5px] font-medium text-slate-500">{hint}</div>
    </div>
  );
}

/* ================================================================== *
 * View
 * ================================================================== */

export function TodayView({
  deals,
  tasks,
  invoices,
  cheques,
  activities,
  onNavigate,
  onSelectDeal,
  onToggleTask,
  onOpenNewDeal,
  onOpenNewInvoice,
  onOpenQuickCallModal,
}: Props) {
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const todayStr = localDateStr();

  /* 1. Stale + overdue deals, most-overdue first */
  const urgentDeals = deals
    .map((d) => ({
      deal: d,
      state: getDealNextActionState(d.nextActionDue, d.nextActionTitle),
      days: d.nextActionDue ? (daysUntil(d.nextActionDue) ?? 0) : -9999,
    }))
    .filter((i) => i.state.isStale || i.state.isOverdue)
    .sort((a, b) => a.days - b.days);

  const disciplinePercent =
    deals.length > 0
      ? Math.round(
          (deals.filter((d) => Boolean(d.nextActionDue)).length / deals.length) * 100
        )
      : 100;

  /* 2. Overdue + due-today tasks */
  const pendingTasks = tasks.filter((t) => !t.completed);
  const todaysTasks = pendingTasks.filter((t) => t.dueDate <= todayStr);

  const filteredTodaysTasks = todaysTasks
    .filter((t) => taskFilter === "all" || t.type === taskFilter)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const overdueTaskCount = todaysTasks.filter((t) => t.dueDate < todayStr).length;

  /* 3. Cash radar — pending cheques + when they land */
  const pendingCheques = cheques.filter(
    (c) => c.status === "in_hand" || c.status === "deposited"
  );
  const totalPendingCheques = pendingCheques.reduce((s, c) => s + c.amount, 0);
  const nearCheques = [...pendingCheques]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  const chequeSegments = bucketize(
    pendingCheques.map((c) => ({ date: c.dueDate, amount: c.amount })),
    CHEQUE_HORIZON
  );
  const chequePercents = segmentPercents(chequeSegments);

  /* Real cash collected: cheques cleared in the last 7 days. */
  const collectedThisWeek = cheques
    .filter((c) => {
      if (c.status !== "cleared") return false;
      const age = daysSince(c.statusUpdatedAt);
      return age !== null && age <= 7;
    })
    .reduce((s, c) => s + c.amount, 0);

  /* 4. Receivables — overdue total + aging */
  const overdueInvoices = invoices
    .filter((inv) => isInvoiceOverdue(inv))
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
  const totalOverdue = overdueInvoices.reduce((s, inv) => s + inv.total, 0);

  const agingSegments = bucketize(
    invoices
      .filter(isOpenInvoice)
      .map((inv) => ({ date: inv.dueDate, amount: inv.total })),
    RECEIVABLE_AGING
  );
  const agingPercents = segmentPercents(agingSegments);
  const overdueBucket = agingSegments.find((s) => s.key === "b60");

  /* Headline */
  const attentionCount = urgentDeals.length + todaysTasks.length;
  const animatedAttention = useCountUp(attentionCount);
  const isClear = attentionCount === 0;

  return (
    <div className="space-y-4" dir="rtl">
      {/* ===== Command bar ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <CalendarCheck className="size-4" />
          </span>
          <div>
            <div className="text-[13px] font-black text-slate-900">
              {formatJalaliDate(new Date(), "full")}
            </div>
            <div className="text-[10.5px] font-medium text-slate-500">
              {faDigits(pendingTasks.length)} وظیفه باز · {faDigits(deals.length)} فرصت فعال
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenNewDeal}
            size="sm"
            className="h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 text-xs font-black text-white hover:bg-brand-800"
          >
            <Plus className="size-4" />
            معامله جدید
          </Button>
          <Button
            onClick={onOpenNewInvoice}
            size="sm"
            variant="outline"
            className="h-9 cursor-pointer items-center gap-1.5 rounded-xl border-slate-300 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Receipt className="size-4" />
            صدور فاکتور
          </Button>
        </div>
      </div>

      {/* ===== KPI band — summary + direction, one card each ===== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* The one dark accent card: the page's primary metric */}
        <div className="flex flex-col justify-between rounded-2xl bg-brand-900 p-5 text-white lg:col-span-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-bold text-brand-200">
              {isClear ? (
                <CheckCircle2 className="size-4 text-emerald-400" />
              ) : (
                <AlertCircle className="size-4 text-glow" />
              )}
              اقدام در انتظار
            </div>
            <span className="rounded-full bg-brand-800 px-2 py-0.5 text-[10px] font-black text-brand-100">
              {isClear ? "روز آرام" : "نیازمند رسیدگی"}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[46px] font-black leading-none tabular-nums">
                {faDigits(animatedAttention)}
              </span>
              <span className="text-[12.5px] font-bold text-brand-200">مورد</span>
            </div>

            <ul className="mt-4 space-y-1.5 text-[11.5px]">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-brand-100">
                  <span className="size-1.5 rounded-full bg-rose-400" />
                  فرصت بدون اقدام بعدی
                </span>
                <span className="font-black tabular-nums">{faDigits(urgentDeals.length)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-brand-100">
                  <span className="size-1.5 rounded-full bg-brand-400" />
                  وظیفه امروز
                </span>
                <span className="font-black tabular-nums">{faDigits(todaysTasks.length)}</span>
              </li>
              {overdueTaskCount > 0 && (
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-rose-300">
                    <span className="size-1.5 rounded-full bg-rose-400" />
                    وظیفه معوق
                  </span>
                  <span className="font-black tabular-nums">{faDigits(overdueTaskCount)}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Discipline as a bullet bar, not a gauge */}
          <div className="mt-5 border-t border-brand-800 pt-3">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="font-bold text-brand-200">انضباط پیگیری</span>
              <span className="font-black tabular-nums text-white">
                {faDigits(disciplinePercent)}٪
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-800">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                  disciplinePercent >= 80
                    ? "bg-emerald-400"
                    : disciplinePercent >= 50
                      ? "bg-glow"
                      : "bg-rose-400"
                }`}
                style={{ width: `${disciplinePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cash radar */}
        <Card className="p-5 rounded-2xl border border-slate-200 bg-white lg:col-span-4">
          <PanelHeader
            icon={Banknote}
            tone="amber"
            title="رادار نقدینگی"
            subtitle="چک‌های در گردش و زمان وصول"
            action={<PanelLink onClick={() => onNavigate("invoices")}>دفترچه</PanelLink>}
          />

          {pendingCheques.length === 0 ? (
            <EmptyState
              icon={Banknote}
              tone="amber"
              title="چکی در گردش نیست"
              body="چک صیادی دریافتی در این بازه وجود ندارد."
            />
          ) : (
            <>
              <MetricHead
                label="در انتظار وصول"
                amount={formatTomanCompact(totalPendingCheques)}
                hint={`${faDigits(pendingCheques.length)} فقره · نزدیک‌ترین سررسید در صدر`}
              />

              <div className="mt-4">
                <SegmentedBar segments={chequeSegments} percents={chequePercents} />
                <SegmentLegend segments={chequeSegments} percents={chequePercents} />
              </div>

              <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                {nearCheques.map((chq) => {
                  const due = getChequeDueNote(chq.dueDate);
                  const meta = getChequeStatusMeta(chq.status);
                  return (
                    <li key={chq.id} className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-[9.5px] font-bold ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </Badge>
                        <span className="truncate text-[10.5px] text-slate-500">
                          {chq.bankName} · {chq.accountOwner}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`text-[10px] font-bold ${
                            due.isUrgent ? "text-rose-600" : "text-slate-500"
                          }`}
                        >
                          {due.label}
                        </span>
                        <b className="text-[11px] font-black tabular-nums text-slate-900">
                          {formatToman(chq.amount)}
                        </b>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
                <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-800">
                  <TrendingUp className="size-3.5" />
                  وصول‌شده ۷ روز اخیر
                </span>
                <span className="text-[12px] font-black tabular-nums text-emerald-900">
                  {formatTomanCompact(collectedThisWeek)}
                </span>
              </div>
            </>
          )}
        </Card>

        {/* Receivables */}
        <Card className="p-5 rounded-2xl border border-slate-200 bg-white lg:col-span-4">
          <PanelHeader
            icon={Receipt}
            tone={overdueInvoices.length > 0 ? "rose" : "emerald"}
            title="فاکتورهای معوق و سن اسناد"
            subtitle="مبلغ کامل اسناد؛ پرداخت‌های جزئی کسر نشده‌اند"
            action={<PanelLink onClick={() => onNavigate("invoices")}>دفتر فاکتور</PanelLink>}
          />

          <MetricHead
            label="ارزش کل فاکتورهای معوق"
            amount={formatTomanCompact(totalOverdue)}
            hint={
              overdueInvoices.length > 0
                ? `${faDigits(overdueInvoices.length)} فاکتور${
                    overdueBucket && overdueBucket.count > 0
                      ? ` · ${faDigits(overdueBucket.count)} فقره بالای ۶۰ روز`
                      : ""
                  }`
                : "همه فاکتورها تسویه یا در بازه سررسید"
            }
            amountTone={overdueInvoices.length > 0 ? "bad" : "good"}
          />

          <div className="mt-4">
            <SegmentedBar segments={agingSegments} percents={agingPercents} />
            <SegmentLegend segments={agingSegments} percents={agingPercents} />
          </div>

          {overdueInvoices.length > 0 ? (
            <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
              {overdueInvoices.slice(0, 3).map((inv) => {
                const days = daysUntil(inv.dueDate);
                return (
                  <li key={inv.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-slate-700">
                        فاکتور {faDigits(inv.number)}
                      </span>
                      <span className="mr-1.5 text-[10.5px] text-slate-500">
                        {inv.customerName ?? "—"}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[10px] font-bold text-rose-600">
                        {days !== null && days < 0
                          ? `${faDigits(Math.abs(days))} روز`
                          : "سررسید امروز"}
                      </span>
                      <b className="text-[11px] font-black tabular-nums text-slate-900">
                        {formatToman(inv.total)}
                      </b>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[10.5px] font-bold text-emerald-800">
              <CheckCircle2 className="size-3.5" />
              هیچ فاکتور معوقی وجود ندارد
            </div>
          )}
        </Card>
      </div>

      {/* ===== Work band — the part you operate in ===== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Task queue */}
        <Card className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm lg:col-span-7">
          <PanelHeader
            icon={Target}
            tone="brand"
            title="کارتابل امروز"
            subtitle="نزدیک‌ترین موعدها ابتدا — معوق‌ها با نشان قرمز"
            action={<PanelLink onClick={() => onNavigate("tasks")}>همه وظایف</PanelLink>}
          />

          <div className="mb-3 flex flex-wrap items-center gap-1">
            {TASK_FILTERS.map((f) => {
              const active = taskFilter === f.id;
              const count =
                f.id === "all"
                  ? todaysTasks.length
                  : todaysTasks.filter((t) => t.type === f.id).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTaskFilter(f.id)}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                    active
                      ? "bg-brand-700 text-white"
                      : "border border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                  }`}
                >
                  {f.label}
                  <span className="mr-1 tabular-nums">{faDigits(count)}</span>
                </button>
              );
            })}
          </div>

          {filteredTodaysTasks.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              tone="emerald"
              title="کاری برای امروز نمانده"
              body="همه اقدامات این بازه انجام شده‌اند. برای دیدن بقیه فیلتر را عوض کنید."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredTodaysTasks.slice(0, 7).map((task) => {
                const isOverdue = task.dueDate < todayStr;
                const priorityMeta = DEAL_PRIORITY_MAP[task.priority] || {
                  label: "عادی",
                  colorClass: "bg-slate-100 text-slate-700 border-slate-200",
                };

                return (
                  <li
                    key={task.id}
                    className={`flex items-center gap-3 border-r-2 py-2.5 ps-3.5 pe-3 transition hover:bg-slate-50 ${
                      isOverdue ? "border-r-rose-500" : "border-r-transparent"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id, !task.completed)}
                      aria-label={
                        task.completed
                          ? "علامت‌گذاری به عنوان انجام‌نشده"
                          : "علامت‌گذاری به عنوان انجام‌شده"
                      }
                      className={`flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition ${
                        task.completed
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white hover:border-brand-600 hover:bg-brand-50"
                      }`}
                    >
                      {task.completed && <Check className="size-3 text-white" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-bold text-slate-900">
                        {task.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-slate-500">
                        <span className="truncate">{task.relatedTo}</span>
                        <span className="size-0.5 shrink-0 rounded-full bg-slate-300" />
                        <span
                          className={
                            isOverdue ? "font-bold text-rose-600" : "font-bold text-slate-600"
                          }
                        >
                          {isOverdue ? "معوق · " : ""}
                          {formatJalaliDate(task.dueDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={`hidden text-[10px] font-bold sm:inline-flex ${priorityMeta.colorClass}`}
                      >
                        {priorityMeta.label}
                      </Badge>
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-800">
                        {TASK_TYPE_LABEL[task.type] ?? task.type}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <MoreRow
            count={filteredTodaysTasks.length - 7}
            onClick={() => onNavigate("tasks")}
          />
        </Card>

        {/* Triage */}
        <Card className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm lg:col-span-5">
          <PanelHeader
            icon={AlertCircle}
            tone="rose"
            title="نجات فرصت‌های فروش"
            subtitle="فاقد اقدام بعدی یا پیگیری معوق"
            action={<PanelLink onClick={() => onNavigate("pipeline")}>پایپ‌لاین</PanelLink>}
          />

          {urgentDeals.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              tone="emerald"
              title="پایپ‌لاین پایدار است"
              body="همه پرونده‌های فروش برنامه پیگیری موعددار و مشخص دارند."
            />
          ) : (
            <ul className="space-y-1.5">
              {urgentDeals.slice(0, 5).map(({ deal, state }) => (
                <li
                  key={deal.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border border-slate-100 border-r-2 py-2.5 pe-3 ps-3 transition hover:bg-slate-50 ${
                    state.isStale ? "border-r-slate-400" : "border-r-rose-500"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => onSelectDeal(deal)}
                      className="block max-w-full cursor-pointer truncate text-right text-[12.5px] font-black text-slate-900 transition hover:text-brand-700"
                    >
                      {deal.title}
                    </button>

                    <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-slate-500">
                      <Building2 className="size-3 shrink-0 text-slate-400" />
                      <span className="truncate">{deal.company}</span>
                      <span className="size-0.5 shrink-0 rounded-full bg-slate-300" />
                      <b className="shrink-0 font-black text-emerald-700">
                        {deal.formattedValue}
                      </b>
                    </div>

                    <span
                      className={`mt-1.5 inline-block rounded-md border px-1.5 py-0.5 text-[9.5px] font-bold ${
                        state.isStale
                          ? "border-slate-200 bg-slate-50 text-slate-600"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {state.label}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 self-center">
                    <Button
                      size="sm"
                      onClick={() => onSelectDeal(deal)}
                      className="h-8 shrink-0 cursor-pointer rounded-xl bg-brand-700 px-3 text-[11px] font-bold text-white hover:bg-brand-800"
                    >
                      تعیین پیگیری
                    </Button>
                    {onOpenQuickCallModal && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenQuickCallModal(deal)}
                        aria-label={`ثبت تماس با ${deal.company}`}
                        title="ثبت تماس"
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border-slate-300 p-0 text-brand-700 hover:border-brand-300 hover:bg-brand-50"
                      >
                        <PhoneCall className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <MoreRow count={urgentDeals.length - 5} onClick={() => onNavigate("pipeline")} />
        </Card>
      </div>

      {/* ===== Activity strip — full width, time flowing right-to-left ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2">
            <History className="size-[17px] text-indigo-600" />
            <h3 className="text-[13px] font-black text-slate-900">جریان وقایع</h3>
            <span className="text-[11px] text-slate-500">تازه‌ترین اقدامات تیم</span>
          </div>
        </div>

        {activities.length === 0 ? (
          <EmptyState
            icon={FileText}
            tone="indigo"
            title="فعالیتی ثبت نشده"
            body="تماس‌ها، جلسات و تغییر مرحله پرونده‌ها اینجا نمایش داده می‌شوند."
          />
        ) : (
          <ul className="relative flex gap-3 pt-4">
            {/* rail runs right→left, matching Persian reading direction */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-[27px] h-px bg-gradient-to-l from-brand-300 via-slate-200 to-slate-100"
            />
            {activities.slice(0, 5).map((act, i) => {
              const kindMeta = ACTIVITY_KIND_MAP[act.kind] || {
                label: act.kind,
                icon: "FileText",
              };
              return (
                <li key={act.id} className="relative flex-1">
                  <div
                    className={`z-10 flex size-[27px] items-center justify-center rounded-full border-2 bg-white shadow-xs ${
                      i === 0 ? "border-brand-600" : "border-slate-200"
                    }`}
                  >
                    {getActivityIcon(act.kind)}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-1.5">
                    <b className="truncate text-[10.5px] font-black text-slate-900">
                      {kindMeta.label}
                    </b>
                    <span className="shrink-0 text-[9.5px] font-medium text-slate-400">
                      {formatRelativeFa(act.happenedAt)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-3 text-[10.5px] leading-[1.7] text-slate-600">
                    {act.body}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
