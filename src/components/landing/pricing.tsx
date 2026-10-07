"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Check, Rocket, Sprout } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";

const TIERS = [
  {
    name: "پایه",
    desc: "شروع منظم‌شدن برای فعالیت‌های تک‌نفره",
    m: "۴۹۰٬۰۰۰",
    y: "۳۹۰٬۰۰۰",
    feats: ["تا ۱۵۰ مشتری", "بورد سفارش", "فاکتور PDF فارسی", "لینک پرداخت", "خروجی اکسل"],
    icon: Sprout,
    hot: false,
  },
  {
    name: "کسب‌وکار",
    desc: "انتخاب اکثر شرکت‌ها و تیم‌های کوچک",
    m: "۹۹۰٬۰۰۰",
    y: "۷۹۰٬۰۰۰",
    feats: ["مشتری نامحدود", "سفارش نامحدود", "فاکتور با لوگوی شما", "یادآوری خودکار", "تا ۵ کاربر", "نمودار درآمد"],
    icon: Building2,
    hot: true,
  },
  {
    name: "حرفه‌ای",
    desc: "برای رشد و همکاری کامل تیم",
    m: "۱٬۹۹۰٬۰۰۰",
    y: "۱٬۵۹۰٬۰۰۰",
    feats: ["کاربر نامحدود", "گزارش پیشرفته", "مدیریت چند شرکت", "اشتراک دوره‌ای", "استقرار اختصاصی"],
    icon: Rocket,
    hot: false,
  },
];

const ASSURANCES = ["۱۴ روز رایگان", "بدون کارت بانکی", "لغو در هر زمان"];

export function LandingPricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative scroll-mt-20 overflow-hidden bg-white py-24 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(59,107,224,0.09),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="min-w-0">
            <SectionHeading
              align="start"
              title={
                <>
                  یک قیمت <span className="lp-gradient-text">ساده و شفاف</span>
                </>
              }
              description="۱۴ روز رایگان، بدون کارت بانکی. هر زمان خواستید پلن را عوض یا لغو کنید."
            />
          </Reveal>

          <Reveal delay={0.1} className="shrink-0">
            <div
              role="group"
              aria-label="دوره پرداخت"
              className="flex w-fit max-w-full gap-1 rounded-full border border-brand-100 bg-brand-50/70 p-1.5"
            >
              <button
                onClick={() => setAnnual(false)}
                aria-pressed={!annual}
                className={`lp-focus cursor-pointer whitespace-nowrap rounded-full px-6 py-2.5 text-[14px] font-bold transition-all ${
                  !annual ? "bg-brand-950 text-white shadow-md" : "text-slate-500 hover:text-brand-700"
                }`}
              >
                ماهانه
              </button>
              <button
                onClick={() => setAnnual(true)}
                aria-pressed={annual}
                className={`lp-focus flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-6 py-2.5 text-[14px] font-bold transition-all ${
                  annual ? "bg-brand-950 text-white shadow-md" : "text-slate-500 hover:text-brand-700"
                }`}
              >
                سالانه
                <span className="rounded-full bg-glow px-2 py-0.5 text-[11px] font-black text-brand-950">
                  ۲۰٪ تخفیف
                </span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid min-w-0 items-stretch gap-5 lg:grid-cols-3">
          {TIERS.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal key={t.name} delay={i * 0.08} className="min-w-0">
                <div
                  className={`relative flex h-full flex-col rounded-[32px] p-7 sm:p-8 ${
                    t.hot
                      ? "bg-brand-950 text-white shadow-[0_40px_80px_-30px_rgba(16,28,69,0.7)] ring-2 ring-glow/70 lg:scale-[1.04]"
                      : "border border-brand-100 bg-white shadow-[0_18px_40px_-28px_rgba(16,28,69,0.3)]"
                  }`}
                >
                  {t.hot && (
                    <>
                      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[32px]">
                        <div className="absolute -start-16 -top-16 h-52 w-52 rounded-full bg-brand-500/40 blur-3xl" />
                        <div className="absolute -bottom-20 -end-10 h-44 w-44 rounded-full bg-glow/15 blur-3xl" />
                      </div>
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-glow px-5 py-1.5 text-[12.5px] font-black text-brand-950 shadow-lg shadow-glow/30">
                        محبوب‌ترین
                      </span>
                    </>
                  )}

                  <div className="relative flex flex-1 flex-col">
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          t.hot ? "bg-glow text-brand-950" : "bg-brand-50 text-brand-600"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <h3 className={`text-[20px] font-black ${t.hot ? "text-white" : "text-brand-950"}`}>
                          {t.name}
                        </h3>
                        <p className={`mt-0.5 truncate text-[13px] ${t.hot ? "text-brand-200/80" : "text-slate-500"}`}>
                          {t.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className={`text-[42px] font-black leading-none ${t.hot ? "text-white" : "text-brand-950"}`}>
                        {annual ? t.y : t.m}
                      </span>
                      <span className={`text-[13px] font-semibold ${t.hot ? "text-brand-200/80" : "text-slate-500"}`}>
                        تومان / ماه
                      </span>
                    </div>
                    <div className={`mt-1.5 h-5 text-[12px] font-semibold ${t.hot ? "text-glow" : "text-brand-600"}`}>
                      {annual ? "با پرداخت سالانه" : "با پرداخت ماهانه"}
                    </div>

                    <ul className={`mt-6 flex-1 space-y-3.5 border-t pt-6 ${t.hot ? "border-white/10" : "border-brand-100"}`}>
                      {t.feats.map((f) => (
                        <li
                          key={f}
                          className={`flex items-center gap-3 text-[14.5px] font-medium ${t.hot ? "text-white" : "text-slate-700"}`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              t.hot ? "bg-glow text-brand-950" : "bg-brand-50 text-brand-600"
                            }`}
                          >
                            <Check className="h-3 w-3" strokeWidth={3.5} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/register?plan=${t.name === "پایه" ? "starter" : t.name === "حرفه‌ای" ? "pro" : "business"}`}
                      className={`mt-8 inline-flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-bold transition-all cursor-pointer ${
                        t.hot
                          ? "bg-glow text-brand-950 hover:brightness-105"
                          : "lp-focus border border-brand-200 text-brand-800 hover:border-brand-500 hover:bg-brand-50"
                      }`}
                    >
                      شروع رایگان
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] font-semibold text-slate-500">
            {ASSURANCES.map((a, i) => (
              <span key={a} className="flex items-center gap-5">
                {a}
                {i < ASSURANCES.length - 1 && <span className="h-1 w-1 rounded-full bg-brand-300" />}
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
