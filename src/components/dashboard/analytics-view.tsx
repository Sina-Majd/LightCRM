"use client";

import React, { useState } from "react";
import { TrendingUp, Award, Wallet, Target, Zap, Sparkles, BarChart2 } from "lucide-react";
import type { Deal, Invoice, PipelineStage } from "@/lib/crm/types";
import { isWonStage } from "@/lib/crm/pipeline";
import { invoiceMonthlySeries } from "@/lib/crm/analytics";
import { formatToman, faDigits } from "@/lib/fa";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function AnalyticsView({ deals, stages, invoices }: { deals: Deal[]; stages: PipelineStage[]; invoices: Invoice[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const won = deals.filter((d) => isWonStage(stages, d.stageId));
  const wonTotal = won.reduce((s, d) => s + d.value, 0);
  const winShare = deals.length ? Math.round(won.length / deals.length * 100) : 0;
  const averageValue = deals.length ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0;
  const stageDistribution = stages.map((stage) => {
    const count = deals.filter((deal) => deal.stageId === stage.id).length;
    return { stage: stage.title, count, share: deals.length ? Math.round(count / deals.length * 100) : 0 };
  });

  const chartData = invoiceMonthlySeries(invoices);
  const maxVal = Math.max(...chartData.map((month) => Math.max(month.paid, month.issued))) || 1;
  const activeValue = deals.filter((deal) => !isWonStage(stages, deal.stageId)).reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="space-y-6" dir="rtl">
      {/* 4 Premium Brand KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            title: "سهم معاملات موفق",
            value: `${faDigits(winShare)}٪`,
            badge: `${faDigits(deals.length)} معامله`,
            desc: "از کل معاملات فضای کاری",
            icon: TrendingUp,
            iconBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
            valColor: "text-emerald-950",
          },
          {
            title: "میانگین اندازه هر معامله",
            value: formatToman(averageValue),
            badge: "پایپ‌لاین فعال",
            desc: "بر پایه معاملات ثبت‌شده",
            icon: Target,
            iconBg: "bg-brand-50 text-brand-700 border-brand-100",
            valColor: "text-brand-950",
          },
          {
            title: "ارزش پایپ‌لاین فعال",
            value: formatToman(activeValue),
            badge: `${faDigits(deals.length - won.length)} فرصت باز`,
            desc: "فرصت‌های در حال پیگیری",
            icon: Wallet,
            iconBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
            valColor: "text-indigo-950",
          },
          {
            title: "ارزش معاملات موفق",
            value: formatToman(wonTotal),
            badge: `${faDigits(won.length)} معامله موفق`,
            desc: "جمع ارزش فرصت‌های نهایی‌شده",
            icon: Award,
            iconBg: "bg-amber-50 text-amber-700 border-amber-100",
            valColor: "text-amber-950",
          },
        ].map((k) => (
          <Card
            key={k.title}
            className="min-w-0 p-5 rounded-3xl border border-brand-100/80 bg-white shadow-sm hover:shadow-md hover:border-brand-200 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{k.title}</span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${k.iconBg}`}
              >
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className={`mt-3 break-words text-lg sm:text-2xl font-black ${k.valColor}`}>
              {k.value}
            </div>
            <div className="mt-1 flex flex-wrap gap-2 items-center justify-between text-[11px] text-slate-600">
              <span>{k.desc}</span>
              <span className="font-bold text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">
                {k.badge}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Interactive Brand Chart & Conversion Funnel */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Native Interactive SVG Performance Chart (0 Warnings, 100% React 19 Clean) */}
        <Card className="p-6 rounded-3xl border border-brand-100/80 bg-white shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <BarChart2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    روند صدور و تسویه فاکتورها
                  </h3>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  شش ماه شمسی اخیر، بر اساس تاریخ صدور فاکتور
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-3 w-3 rounded-md bg-brand-700" />
                  تسویه‌شده
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-3 w-3 rounded-md bg-brand-200" />
                  صادرشده
                </span>
              </div>
            </div>

            {/* Interactive Bar Chart Visual */}
            <div className="mt-6 relative pt-4 pb-2">
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-[210px] border-b border-slate-200 pb-2">
                {chartData.map((d, idx) => {
                  const actualHeight = Math.round((d.paid / maxVal) * 100);
                  const targetHeight = Math.round((d.issued / maxVal) * 100);
                  const isHovered = hoveredIdx === idx;

                  return (
                    <div
                      key={d.key}
                      className="group relative flex flex-col items-center h-full justify-end cursor-pointer"
                      tabIndex={0}
                      role="img"
                      aria-label={`${d.monthName}: صادرشده ${formatToman(d.issued)}، تسویه ${formatToman(d.paid)}`}
                      onFocus={() => setHoveredIdx(idx)}
                      onBlur={() => setHoveredIdx(null)}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      {/* Hover Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-16 z-30 flex flex-col items-center bg-brand-950 text-white rounded-xl px-2.5 py-1.5 shadow-xl text-[11px] font-bold whitespace-nowrap animate-in fade-in zoom-in-95">
                          <span className="text-brand-300 font-bold">{d.monthName}</span>
                          <span>تسویه: {formatToman(d.paid)}</span>
                          <span className="text-[10px] text-brand-200">صدور: {formatToman(d.issued)}</span>
                          <div className="absolute -bottom-1 h-2 w-2 bg-brand-950 rotate-45" />
                        </div>
                      )}

                      <div className="flex items-end gap-1.5 w-full justify-center h-full">
                        {/* Actual Bar */}
                        <div
                          style={{ height: `${actualHeight}%` }}
                          className={`w-4 sm:w-6 rounded-t-xl transition-all duration-300 ${
                            isHovered
                              ? "bg-brand-600 shadow-md shadow-brand-700/30 scale-y-105"
                              : "bg-brand-700"
                          }`}
                        />
                        {/* Target Bar */}
                        <div
                          style={{ height: `${targetHeight}%` }}
                          className={`w-3 sm:w-4 rounded-t-xl transition-all duration-300 ${
                            isHovered ? "bg-brand-300" : "bg-brand-200"
                          }`}
                        />
                      </div>

                      {/* Month Label */}
                      <span
                        className={`mt-2.5 text-xs font-bold transition ${
                          isHovered ? "text-brand-700 font-black" : "text-slate-500"
                        }`}
                      >
                        {d.monthName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>مبالغ تسویه‌شده مربوط به فاکتورهای دارای وضعیت «تسویه کامل» است.</span>
            <span className="text-[11px] text-slate-600">فاکتورهای رسمی</span>
          </div>
        </Card>

        {/* Funnel Conversion Stage Card */}
        <Card className="p-6 rounded-3xl border border-brand-100/80 bg-white shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">توزیع معاملات در مراحل فروش</h3>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10.5px] font-bold">
                فعال و زنده
              </Badge>
            </div>

            <div className="space-y-4 py-4">
              {stageDistribution.map((s, i) => (
                <div key={s.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {faDigits(i + 1)}. {s.stage}
                    </span>
                    <span className="text-slate-500">
                      {faDigits(s.count)} معامله · <b className="text-brand-700 font-black">{faDigits(s.share)}٪</b>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-brand-700 via-brand-500 to-sky-400 transition-all duration-500"
                      style={{ width: `${s.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50/50 p-3.5 text-xs text-brand-900 leading-6">
            <Sparkles className="h-4 w-4 shrink-0 text-brand-700 mt-0.5" />
            <div>
              <b>نکته هوش تجاری:</b> توزیع بالا وضعیت فعلی معاملات را نشان می‌دهد. برای برنامه‌ریزی پیگیری‌ها، معاملات هر مرحله و اقدام بعدی آن‌ها را مرور کنید.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
