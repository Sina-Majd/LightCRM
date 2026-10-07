"use client";

import React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  BarChart3,
  BellRing,
  CheckCircle2,
  KanbanSquare,
  ListChecks,
  Phone,
  Target,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: "معاملات", icon: KanbanSquare, active: true },
  { label: "سرنخ‌ها", icon: Target },
  { label: "مشتریان", icon: Users },
  { label: "وظایف", icon: ListChecks },
  { label: "تحلیل‌ها", icon: BarChart3 },
];

const KPIS = [
  { label: "فروش این ماه", value: "۲۴۸ میلیون", delta: "۱۸٪ بیشتر", icon: Wallet, spark: [3, 5, 4, 7, 6, 9, 8, 11] },
  { label: "معاملات باز", value: "۳۶ معامله", delta: "۷ مورد امروز", icon: KanbanSquare, spark: [6, 5, 7, 6, 8, 7, 9, 9] },
  { label: "نرخ تبدیل", value: "۳۲٪", delta: "۴٪ بهتر", icon: TrendingUp, spark: [4, 4, 5, 6, 5, 7, 8, 9] },
  { label: "وصول مطالبات", value: "۹۱٪", delta: "۱۲ فاکتور", icon: CheckCircle2, spark: [5, 6, 6, 7, 8, 8, 9, 10] },
];

const COLUMNS = [
  {
    title: "مذاکره",
    count: "۹",
    tone: "bg-brand-500",
    deals: [
      { name: "استودیو مهتاب", note: "هویت برند", value: "۴۸٬۰۰۰٬۰۰۰", tag: "داغ" },
      { name: "فروشگاه نیلوفر", note: "طراحی سایت", value: "۲۲٬۵۰۰٬۰۰۰" },
    ],
  },
  {
    title: "پیش‌فاکتور",
    count: "۷",
    tone: "bg-glow",
    deals: [
      { name: "لجستیک ایران‌راه", note: "پورتال موجودی", value: "۸۴٬۰۰۰٬۰۰۰" },
      { name: "گروه آرمان", note: "مشاوره ماهانه", value: "۱۸٬۰۰۰٬۰۰۰" },
    ],
  },
  {
    title: "برنده‌شده",
    count: "۱۲",
    tone: "bg-emerald-500",
    deals: [{ name: "کافه بهار", note: "نصب صندوق", value: "۱۶٬۵۰۰٬۰۰۰", tag: "پرداخت شد" }],
  },
];

const REVENUE = [34, 42, 38, 52, 48, 60, 55, 68, 64, 78, 72, 92];
const TARGET = [40, 44, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82];
const LEADS = [
  { label: "معرفی دوستان", pct: 42, color: "#2149a8" },
  { label: "وب‌سایت", pct: 28, color: "#3b6be0" },
  { label: "شبکه‌های اجتماعی", pct: 18, color: "#ffc94a" },
  { label: "سایر", pct: 12, color: "#c9d8f9" },
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const CHART_W = 400;
const CHART_H = 140;

function toPoints(values: number[]): [number, number][] {
  return values.map((v, i) => [+((i * CHART_W) / (values.length - 1)).toFixed(1), +(CHART_H - 14 - v * 1.15).toFixed(1)]);
}

function smoothPath(points: [number, number][]) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cx = ((x0 + x1) / 2).toFixed(1);
    d += ` C${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

const REV_POINTS = toPoints(REVENUE);
const REV_PATH = smoothPath(REV_POINTS);
const REV_AREA = `${REV_PATH} L${CHART_W} ${CHART_H} L0 ${CHART_H} Z`;
const TARGET_PATH = smoothPath(toPoints(TARGET));
const PEAK = REV_POINTS[REV_POINTS.length - 1];

function Sparkline({ data, className = "" }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i * 56) / (data.length - 1)},${(16 - ((v - min) / (max - min || 1)) * 14 - 1).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox="0 0 56 16" className={`h-4 w-14 ${className}`} fill="none" aria-hidden="true">
      <polyline points={pts} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Start offset of each donut segment (cumulative share of the previous ones).
const LEAD_OFFSETS = LEADS.map((_, i) => LEADS.slice(0, i).reduce((sum, l) => sum + l.pct, 0));

function Donut() {
  return (
    <svg viewBox="0 0 100 100" className="h-[92px] w-[92px] -rotate-90 sm:h-[104px] sm:w-[104px]" aria-hidden="true">
      <circle cx="50" cy="50" r="38" fill="none" stroke="#eef2fc" strokeWidth="12" />
      {LEADS.map((l, i) => {
        const dash = l.pct - 1.4;
        return (
          <circle
            key={l.label}
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={l.color}
            strokeWidth="12"
            strokeLinecap="butt"
            pathLength={100}
            strokeDasharray={`${dash} ${100 - dash}`}
            strokeDashoffset={-LEAD_OFFSETS[i]}
          />
        );
      })}
    </svg>
  );
}

function Layer({
  mx,
  my,
  depth,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className: string;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(my, [-0.5, 0.5], [-depth * 0.7, depth * 0.7]);
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

export function DashboardPreview() {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 90, damping: 18 });
  const my = useSpring(rawY, { stiffness: 90, damping: 18 });
  const rotateY = useTransform(mx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(my, [-0.5, 0.5], [4, -4]);

  const track = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-5xl"
      aria-hidden="true"
      onMouseMove={track}
      onMouseLeave={reset}
    >
      {/* ambient glow */}
      <div className="absolute inset-x-10 -bottom-12 h-28 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute -top-10 start-1/4 h-40 w-40 rounded-full bg-glow/25 blur-3xl" />

      {/* stacked ghost layers for depth */}
      <div className="absolute inset-x-8 -top-3.5 hidden h-full rounded-[28px] border border-brand-200/70 bg-white/55 sm:block" />
      <div className="absolute inset-x-16 -top-7 hidden h-full rounded-[28px] border border-brand-200/50 bg-white/30 sm:block" />

      <motion.div style={{ rotateX, rotateY, transformPerspective: 1700 }} className="relative">
        <div className="relative overflow-hidden rounded-[22px] border border-brand-200/80 bg-white shadow-[0_50px_100px_-34px_rgba(16,28,69,0.55)] sm:rounded-[28px]">
          {/* browser chrome */}
          <div className="flex items-center gap-3 border-b border-brand-100 bg-brand-50/80 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </div>
            <div className="mx-auto rounded-full border border-brand-100 bg-white px-4 py-1 text-[11px] font-semibold text-slate-500">
              لایت CRM · فضای کاری تیم
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              زنده
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[168px_minmax(0,1fr)]">
            {/* sidebar */}
            <aside className="hidden flex-col border-e border-brand-100 bg-white p-3 md:flex">
              <div className="mb-3 px-2 pt-1 text-[11px] font-bold text-slate-400">منو</div>
              <ul className="space-y-1">
                {NAV.map(({ label, icon: Icon, active }) => (
                  <li
                    key={label}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12.5px] font-bold ${
                      active ? "bg-brand-600 text-white shadow-md shadow-brand-600/30" : "text-slate-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </li>
                ))}
              </ul>

              {/* goal card */}
              <div className="mt-auto rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 p-3.5 text-white">
                <div className="text-[11px] font-semibold text-brand-200">هدف فروش ماه</div>
                <div className="mt-1 text-[15px] font-black">۷۸٪ انجام شد</div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-l from-glow to-amber-300" />
                </div>
              </div>
            </aside>

            {/* main */}
            <div className="relative min-w-0 bg-gradient-to-b from-white to-brand-50/60 p-3.5 sm:p-5">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
                {KPIS.map((k, i) => (
                  <div
                    key={k.label}
                    className={`rounded-2xl border border-brand-100 bg-white p-3 sm:p-4 ${i > 1 ? "hidden sm:block" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-semibold text-slate-500 sm:text-[11.5px]">{k.label}</span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <k.icon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div className="mt-1.5 text-[14px] font-black text-brand-950 sm:text-[18px]">{k.value}</div>
                    <div className="mt-1.5 flex items-center justify-between gap-1">
                      <span className="text-[10.5px] font-bold text-emerald-600">{k.delta}</span>
                      <Sparkline data={k.spark} className="text-brand-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* chart + donut */}
              <div className="mt-3 grid gap-2.5 sm:mt-3.5 sm:gap-3.5 md:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
                <div className="min-w-0 rounded-2xl border border-brand-100 bg-white p-3.5 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-black text-brand-950 sm:text-[13px]">درآمد ۱۲ ماه اخیر</span>
                    <span className="flex items-center gap-3 text-[10.5px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-brand-500" />
                        درآمد
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-0 w-3 border-t-2 border-dashed border-slate-300" />
                        هدف
                      </span>
                    </span>
                  </div>

                  <div className="relative mt-3" dir="ltr">
                    <div className="lp-wipe">
                    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="block h-[110px] w-full overflow-visible sm:h-[132px]" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lp-area" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b6be0" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#3b6be0" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[0.2, 0.45, 0.7, 0.95].map((g) => (
                        <line
                          key={g}
                          x1="0"
                          x2={CHART_W}
                          y1={CHART_H * g}
                          y2={CHART_H * g}
                          stroke="#e4ebfc"
                          strokeWidth="1"
                          strokeDasharray="3 5"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                      <path d={REV_AREA} fill="url(#lp-area)" className="lp-fade-up" />
                      <path
                        d={TARGET_PATH}
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        strokeDasharray="4 5"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d={REV_PATH}
                        stroke="#2149a8"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    </div>
                    {/* peak marker */}
                    <div
                      className="lp-fade-up absolute translate-x-1/2 -translate-y-1/2"
                      style={{ right: 0, top: `${(PEAK[1] / CHART_H) * 100}%` }}
                    >
                      <span className="lp-pulse-ring relative block h-3 w-3 rounded-full bg-brand-600 text-brand-500 ring-[3px] ring-white" />
                    </div>
                    <div
                      className="lp-fade-up absolute hidden -translate-y-full rounded-lg sm:block bg-brand-950 px-2.5 py-1 text-[10.5px] font-black whitespace-nowrap text-white shadow-lg"
                      style={{ right: "2%", top: `calc(${(PEAK[1] / CHART_H) * 100}% - 10px)` }}
                      dir="rtl"
                    >
                      ۲۴۸ میلیون
                    </div>
                  </div>
                </div>

                <div className="hidden min-w-0 rounded-2xl border border-brand-100 bg-white p-3.5 sm:p-4 md:block">
                  <span className="text-[12px] font-black text-brand-950 sm:text-[13px]">منبع سرنخ‌ها</span>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <Donut />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[15px] font-black text-brand-950">۱۲۸</span>
                        <span className="text-[9.5px] font-semibold text-slate-500">سرنخ</span>
                      </div>
                    </div>
                    <ul className="min-w-0 flex-1 space-y-1.5">
                      {LEADS.map((l) => (
                        <li key={l.label} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-600">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: l.color }} />
                          <span className="truncate">{l.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* kanban */}
              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:mt-3.5 sm:gap-3.5">
                {COLUMNS.map((col) => (
                  <div key={col.title} className="min-w-0 rounded-2xl bg-brand-50/90 p-2 sm:p-3">
                    <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-black text-brand-900 sm:text-[12.5px]">
                      <span className={`h-2 w-2 rounded-full ${col.tone}`} />
                      {col.title}
                      <span className="ms-auto rounded-full bg-white px-1.5 text-[10px] font-bold text-slate-500">
                        {col.count}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {col.deals.map((d, di) => (
                        <div
                          key={d.name}
                          className={`rounded-xl border border-white bg-white p-2.5 shadow-[0_2px_8px_-4px_rgba(16,28,69,0.25)] sm:p-3 ${
                            di > 0 ? "hidden sm:block" : ""
                          }`}
                        >
                          <div className="truncate text-[11px] font-black text-brand-950 sm:text-[12.5px]">{d.name}</div>
                          <div className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-[11px]">{d.note}</div>
                          <div className="mt-2 flex items-center justify-between gap-1">
                            <span className="truncate text-[10.5px] font-black text-brand-700 sm:text-[11.5px]">{d.value}</span>
                            {"tag" in d && d.tag && (
                              <span className="hidden shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-bold text-brand-700 sm:inline">
                                {d.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* light sweep across the whole frame */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lp-sweep absolute inset-y-0 start-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* ---------------- floating layers (parallax) ---------------- */}

      {/* paid invoice */}
      <Layer mx={mx} my={my} depth={22} className="absolute -top-5 start-2 hidden sm:block xl:-start-12">
        <div className="lp-float flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgba(16,28,69,0.45)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[12.5px] font-black text-brand-950">فاکتور ۱۰۲۴ پرداخت شد</div>
            <div className="text-[11px] text-slate-500">کافه بهار · ۱۶٬۵۰۰٬۰۰۰ تومان</div>
          </div>
        </div>
      </Layer>

      {/* reminder */}
      <Layer mx={mx} my={my} depth={30} className="absolute -bottom-6 end-2 hidden sm:block xl:-end-10">
        <div className="lp-float-slow flex items-center gap-3 rounded-2xl border border-amber-100 bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgba(16,28,69,0.45)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-glow-soft text-amber-600">
            <BellRing className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[12.5px] font-black text-brand-950">یادآوری تماس</div>
            <div className="text-[11px] text-slate-500">پیگیری پیش‌فاکتور ایران‌راه · ساعت ۱۶</div>
          </div>
        </div>
      </Layer>

      {/* customer card */}
      <Layer mx={mx} my={my} depth={38} className="absolute top-[52%] -start-14 hidden xl:block">
        <div className="lp-float-slow w-[17.5rem] rounded-3xl border border-brand-100 bg-white/95 p-4 shadow-[0_28px_60px_-22px_rgba(16,28,69,0.5)] backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-white">
              <User className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-black text-brand-950">نیلوفر کریمی</div>
              <div className="whitespace-nowrap text-[11px] text-slate-500">مشتری وفادار · ۴۸ سفارش</div>
            </div>
            <span className="ms-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Phone className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-[10.5px] text-slate-500">ارزش مشتری</div>
              <div className="text-[15px] font-black text-brand-700">۱۸۶ میلیون</div>
            </div>
            <Sparkline data={[3, 4, 4, 6, 5, 8, 9, 12]} className="!h-7 !w-24 text-brand-500" />
          </div>
        </div>
      </Layer>

      {/* goal ring */}
      <Layer mx={mx} my={my} depth={26} className="absolute top-[26%] -end-14 hidden xl:block">
        <div className="lp-float flex items-center gap-3.5 rounded-3xl border border-brand-100 bg-white/95 p-3.5 pe-5 shadow-[0_28px_60px_-22px_rgba(16,28,69,0.5)] backdrop-blur">
          <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#e4ebfc" strokeWidth="5" />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#2149a8"
              strokeWidth="5"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="78 22"
            />
          </svg>
          <div>
            <div className="text-[18px] font-black leading-none text-brand-950">۷۸٪</div>
            <div className="mt-1 text-[11px] font-semibold text-slate-500">هدف فروش ماه</div>
          </div>
        </div>
      </Layer>

      {/* online teammates */}
      <Layer mx={mx} my={my} depth={34} className="absolute -bottom-10 start-[22%] hidden xl:block">
        <div className="lp-float flex items-center gap-3 rounded-full border border-brand-100 bg-white/95 py-2 pe-4 ps-2.5 shadow-[0_18px_40px_-16px_rgba(16,28,69,0.45)] backdrop-blur">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {[
              ["#6f93f0", "#1c3a8a"],
              ["#fbbf24", "#d97706"],
              ["#34d399", "#059669"],
              ["#fb7185", "#e11d48"],
            ].map(([from, to]) => (
              <span
                key={from}
                className="flex h-7 w-7 items-center justify-center rounded-full text-white ring-2 ring-white"
                style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
              >
                <User className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
          <span className="text-[11.5px] font-bold text-brand-950">۴ همکار آنلاین</span>
        </div>
      </Layer>
    </div>
  );
}
