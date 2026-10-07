"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/landing/reveal";

const TABS = [
  {
    id: "agency",
    label: "آژانس و استودیو",
    title: "پروژه‌ها را از پیشنهاد تا تحویل دنبال کنید",
    text: "هر مشتری چند پروژه دارد و هر پروژه چند مرحله. لایت همه را مرتب و قابل‌پیگیری نگه می‌دارد.",
    points: ["پایپ‌لاین پروژه‌ها از پیشنهاد تا تحویل", "پیش‌فاکتور و فاکتور مرحله‌ای", "یادآوری سررسید پرداخت‌ها"],
    rows: [
      ["استودیو مهتاب", "هویت برند", "در حال انجام"],
      ["لجستیک ایران‌راه", "پورتال موجودی", "پیش‌فاکتور"],
      ["گروه آرمان", "طراحی سایت", "تحویل شد"],
    ],
  },
  {
    id: "shop",
    label: "فروشگاه",
    title: "سفارش‌ها و مشتریان تکراری را از دست ندهید",
    text: "بدانید چه کسی چه خریده، کدام سفارش منتظر پرداخت است و کدام مشتری مدتی است خرید نکرده.",
    points: ["تاریخچه خرید هر مشتری", "وضعیت سفارش و پرداخت یک‌جا", "ثبت سریع سفارش از روی موبایل"],
    rows: [
      ["فروشگاه نیلوفر", "سفارش ۲۴ قلم", "در انتظار پرداخت"],
      ["کافه بهار", "نصب صندوق", "پرداخت شد"],
      ["سارا محمدی", "سفارش تکراری", "ارسال شد"],
    ],
  },
  {
    id: "consultant",
    label: "مشاور و فریلنسر",
    title: "حرفه‌ای‌تر به نظر برسید، با وقت کمتر",
    text: "جلسه‌ها، پیشنهادها و فاکتورهایتان را بدون تیم پشتیبانی هم منظم نگه دارید.",
    points: ["قرارها و وظایف روزانه", "فاکتور فارسی با لوگوی خودتان", "گزارش درآمد ماهانه"],
    rows: [
      ["جلسه مشاوره", "امروز · ۱۶:۰۰", "تایید شد"],
      ["پیشنهاد همکاری", "گروه آرمان", "ارسال شد"],
      ["فاکتور ۱۰۲۴", "۱۶٬۵۰۰٬۰۰۰ تومان", "پرداخت شد"],
    ],
  },
  {
    id: "contractor",
    label: "پیمانکار",
    title: "پروژه‌های میدانی را از کنار کار هم مدیریت کنید",
    text: "از سایت پروژه هم می‌توانید مشتری را پیدا کنید، تماس بگیرید و وضعیت وصول را ببینید.",
    points: ["تماس تک‌لمسی با مشتری", "مشاهده وصول مطالبات", "کار کامل روی موبایل"],
    rows: [
      ["پروژه ساختمان ونک", "فاز دوم", "در حال اجرا"],
      ["بازسازی دفتر", "برآورد هزینه", "پیش‌فاکتور"],
      ["نصب تاسیسات", "قسط سوم", "وصول شد"],
    ],
  },
] as const;

export function AudienceTabs() {
  const [active, setActive] = useState<string>(TABS[0].id);
  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <section id="audience" className="scroll-mt-20 bg-brand-50/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            title={
              <>
                برای <span className="lp-gradient-text">کسب‌وکار شما</span> ساخته شده
              </>
            }
            description="لایت برای هر کسب‌وکاری که با مشتری و سفارش سروکار دارد جا باز می‌کند."
          />
        </Reveal>

        <div
          role="tablist"
          aria-label="نوع کسب‌وکار"
          className="mx-auto mt-12 flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-brand-100 bg-white p-1.5 no-scrollbar sm:w-fit"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`lp-focus shrink-0 cursor-pointer whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-bold transition-colors ${
                active === t.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-8 grid min-w-0 items-center gap-8 rounded-[32px] border border-brand-100 bg-white p-6 shadow-[0_30px_60px_-40px_rgba(16,28,69,0.35)] sm:p-10 lg:grid-cols-2 lg:gap-14"
          >
            <div className="min-w-0">
              <h3 className="text-[24px] font-black leading-[1.6] text-brand-950 sm:text-[30px]">{tab.title}</h3>
              <p className="mt-4 text-[15.5px] leading-9 text-slate-600">{tab.text}</p>
              <ul className="mt-7 space-y-3.5">
                {tab.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15px] font-semibold text-brand-950">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-4 sm:p-6" aria-hidden="true">
              <div className="space-y-3">
                {tab.rows.map(([a, b, c]) => (
                  <div
                    key={a}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_6px_18px_-12px_rgba(16,28,69,0.35)]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-black text-brand-950">{a}</div>
                      <div className="mt-0.5 truncate text-[12.5px] text-slate-500">{b}</div>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-50 px-3 py-1 text-[12px] font-bold text-brand-700">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
