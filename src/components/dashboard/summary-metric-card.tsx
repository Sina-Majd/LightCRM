import type { LucideIcon } from "lucide-react";

const TONES = {
  brand: { icon: "bg-brand-50 text-brand-700", value: "text-slate-900" },
  emerald: { icon: "bg-emerald-50 text-emerald-700", value: "text-emerald-700" },
  amber: { icon: "bg-amber-50 text-amber-700", value: "text-amber-700" },
};

interface Props {
  title: string;
  value: string;
  detail: string;
  count: string;
  icon: LucideIcon;
  tone: keyof typeof TONES;
}

export function SummaryMetricCard({ title, value, detail, count, icon: Icon, tone }: Props) {
  const colors = TONES[tone];
  return (
    <div className="min-w-0 rounded-3xl border border-brand-100/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[12px] font-bold text-slate-600">{title}</div>
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <div className={`mt-3 break-words text-base font-black tracking-tight sm:text-xl ${colors.value}`}>{value}</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 border-t border-slate-100 pt-2.5 text-[11px] text-slate-600">
        <span>{detail}</span>
        <b className="font-bold text-slate-800">{count}</b>
      </div>
    </div>
  );
}
