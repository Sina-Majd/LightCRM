import React from "react";
import { Check, CornerDownLeft, MousePointer2, Search, User } from "lucide-react";

/**
 * Small, self-contained UI fragments for the bento cells.
 * Rules: nothing is cropped, every label is >= 11.5px, one fragment per cell.
 */

/* ------------------------------------------------------------------ */
/* Hero cell: pipeline demo (sits on the dark surface)                 */
/* ------------------------------------------------------------------ */

export function KanbanDemo() {
  const card = "rounded-xl bg-white p-3 shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)]";
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3" aria-hidden="true">
      {/* column 1 */}
      <div className="min-w-0 rounded-2xl bg-white/[0.07] p-2.5 ring-1 ring-white/10">
        <div className="mb-2.5 flex items-center gap-1.5 px-0.5 text-[12.5px] font-black text-white">
          <span className="h-2 w-2 rounded-full bg-brand-400" />
          مذاکره
          <span className="ms-auto text-[11.5px] font-bold text-brand-200/70">۹</span>
        </div>
        <div className="space-y-2.5">
          <div className={card}>
            <div className="truncate text-[13px] font-black text-brand-950">استودیو مهتاب</div>
            <div className="mt-0.5 truncate text-[11.5px] text-slate-500">هویت برند</div>
            <div className="mt-2 text-[12px] font-black text-brand-700">۴۸٬۰۰۰٬۰۰۰</div>
          </div>
          <div className={card}>
            <div className="truncate text-[13px] font-black text-brand-950">فروشگاه نیلوفر</div>
            <div className="mt-0.5 truncate text-[11.5px] text-slate-500">طراحی سایت</div>
            <div className="mt-2 text-[12px] font-black text-brand-700">۲۲٬۵۰۰٬۰۰۰</div>
          </div>
        </div>
      </div>

      {/* column 2 */}
      <div className="min-w-0 rounded-2xl bg-white/[0.07] p-2.5 ring-1 ring-white/10">
        <div className="mb-2.5 flex items-center gap-1.5 px-0.5 text-[12.5px] font-black text-white">
          <span className="h-2 w-2 rounded-full bg-glow" />
          پیش‌فاکتور
          <span className="ms-auto text-[11.5px] font-bold text-brand-200/70">۷</span>
        </div>
        <div className="space-y-2.5">
          <div className={card}>
            <div className="truncate text-[13px] font-black text-brand-950">لجستیک ایران‌راه</div>
            <div className="mt-0.5 truncate text-[11.5px] text-slate-500">پورتال موجودی</div>
            <div className="mt-2 text-[12px] font-black text-brand-700">۸۴٬۰۰۰٬۰۰۰</div>
          </div>
          {/* the card being dragged */}
          <div className="lp-float-slow relative">
            <div className={`${card} -rotate-2 ring-2 ring-glow`}>
              <div className="truncate text-[13px] font-black text-brand-950">گروه آرمان</div>
              <div className="mt-0.5 truncate text-[11.5px] text-slate-500">مشاوره ماهانه</div>
              <div className="mt-2 text-[12px] font-black text-brand-700">۱۸٬۰۰۰٬۰۰۰</div>
            </div>
            <MousePointer2 className="absolute -bottom-3 -start-2 h-6 w-6 fill-white text-brand-950 drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* column 3 */}
      <div className="min-w-0 rounded-2xl bg-white/[0.07] p-2.5 ring-1 ring-white/10">
        <div className="mb-2.5 flex items-center gap-1.5 px-0.5 text-[12.5px] font-black text-white">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          برنده‌شده
          <span className="ms-auto text-[11.5px] font-bold text-brand-200/70">۱۲</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex h-[58px] items-center justify-center rounded-xl border-2 border-dashed border-white/25 text-[12px] font-bold text-brand-200/80">
            رها کنید
          </div>
          <div className={card}>
            <div className="truncate text-[13px] font-black text-brand-950">کافه بهار</div>
            <div className="mt-0.5 truncate text-[11.5px] text-slate-500">نصب صندوق</div>
            <div className="mt-2 flex items-center gap-1.5 text-[12px] font-black text-emerald-600">
              <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
              پرداخت شد
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cell: one number and a trend                                   */
/* ------------------------------------------------------------------ */

export function StatSpark() {
  // 12 months, last value highest
  const v = [34, 42, 38, 52, 48, 60, 55, 68, 64, 78, 72, 92];
  const W = 200;
  const H = 52;
  const pts = v.map((n, i) => [+((i * W) / (v.length - 1)).toFixed(1), +(H - 4 - (n / 100) * (H - 10)).toFixed(1)]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cx = ((x0 + x1) / 2).toFixed(1);
    d += ` C${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  const last = pts[pts.length - 1];
  return (
    <div aria-hidden="true">
      <div className="flex items-end justify-between gap-2">
        <div className="text-[26px] font-black leading-none text-brand-950">۱٫۸ میلیارد</div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-black text-emerald-600">۲۴٪ رشد</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block h-[52px] w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bento-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b6be0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b6be0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${d} L${W} ${H} L0 ${H} Z`} fill="url(#bento-area)" />
        <path d={d} fill="none" stroke="#2149a8" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <circle cx={last[0]} cy={last[1]} r="3.5" fill="#2149a8" stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Accent cell: a paid invoice                                         */
/* ------------------------------------------------------------------ */

export function ReceiptChip() {
  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-[0_18px_30px_-16px_rgba(0,0,0,0.5)]" aria-hidden="true">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-black text-brand-950">فاکتور ۱۰۲۴</span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-black text-emerald-600">
          <Check className="h-3 w-3" strokeWidth={3.5} />
          پرداخت شد
        </span>
      </div>
      <div className="mt-1 text-[12px] text-slate-500">کافه بهار</div>
      <div className="mt-2.5 border-t border-dashed border-brand-200 pt-2.5 text-[15px] font-black text-brand-700">
        ۱۶٬۵۰۰٬۰۰۰ تومان
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2x1 cells                                                           */
/* ------------------------------------------------------------------ */

export function CustomerList() {
  const rows = [
    { n: "نیلوفر کریمی", s: "۴۸ سفارش", tag: "وفادار", tone: "bg-emerald-50 text-emerald-600", g: ["#3b6be0", "#16275c"] },
    { n: "امیر رضایی", s: "۱۲ سفارش", tag: "فعال", tone: "bg-brand-100 text-brand-700", g: ["#fbbf24", "#d97706"] },
    { n: "سارا محمدی", s: "سرنخ جدید", tag: "امروز", tone: "bg-amber-50 text-amber-600", g: ["#34d399", "#059669"] },
  ];
  return (
    <ul className="space-y-2" aria-hidden="true">
      {rows.map((r) => (
        <li key={r.n} className="flex items-center gap-3 rounded-2xl bg-brand-50/70 px-3 py-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundImage: `linear-gradient(135deg, ${r.g[0]}, ${r.g[1]})` }}
          >
            <User className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-black text-brand-950">{r.n}</div>
            <div className="truncate text-[12px] text-slate-500">{r.s}</div>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${r.tone}`}>{r.tag}</span>
        </li>
      ))}
    </ul>
  );
}

export function TaskList() {
  const tasks = [
    { t: "تماس با کافه بهار", s: "۰۹:۳۰", done: true },
    { t: "جلسه با استودیو مهتاب", s: "۱۴:۰۰", done: false },
    { t: "پیگیری قرارداد گروه آرمان", s: "۱۶:۰۰", done: false },
  ];
  return (
    <div aria-hidden="true">
      <div className="mb-2.5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full w-1/3 rounded-full bg-brand-600" />
        </div>
        <span className="text-[12px] font-bold text-slate-500">۱ از ۳ انجام شد</span>
      </div>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.t} className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white px-3.5 py-2.5">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                t.done ? "border-brand-600 bg-brand-600 text-white" : "border-brand-200"
              }`}
            >
              {t.done && <Check className="h-3 w-3" strokeWidth={4} />}
            </span>
            <span className={`min-w-0 flex-1 truncate text-[13px] font-bold ${t.done ? "text-slate-400 line-through" : "text-brand-950"}`}>
              {t.t}
            </span>
            <span className="shrink-0 text-[12px] font-semibold text-slate-500">{t.s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SearchBox() {
  return (
    <div aria-hidden="true">
      <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-500 bg-white px-4 py-3">
        <Search className="h-[18px] w-[18px] shrink-0 text-brand-600" />
        <span className="text-[14px] font-bold text-brand-950">مهتاب</span>
        <span className="h-5 w-0.5 animate-pulse bg-brand-600" />
      </div>
      <ul className="mt-2 space-y-1.5">
        <li className="flex items-center justify-between gap-3 rounded-xl bg-brand-600 px-3.5 py-2.5 text-white">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-black">استودیو مهتاب</div>
            <div className="truncate text-[11.5px] text-brand-100">مشتری · ۱۲ سفارش</div>
          </div>
          <CornerDownLeft className="h-4 w-4 shrink-0 text-brand-100" />
        </li>
        <li className="rounded-xl px-3.5 py-2">
          <div className="truncate text-[13px] font-black text-brand-950">قرارداد مهتاب</div>
          <div className="truncate text-[11.5px] text-slate-500">معامله · ۴۸٬۰۰۰٬۰۰۰ تومان</div>
        </li>
      </ul>
    </div>
  );
}
