"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";

const QA = [
  {
    q: "آیا بدون آموزش می‌شود شروع کرد؟",
    a: "بله. لایت ساده طراحی شده و هر دکمه همان کاری را می‌کند که اسمش می‌گوید.",
  },
  {
    q: "اطلاعات ما کجا ذخیره می‌شود؟",
    a: "روی زیرساخت ابری امن با پشتیبان‌گیری روزانه. هر زمان خواستید خروجی کامل اکسل می‌گیرید.",
  },
  {
    q: "فاکتور فارسی و لینک پرداخت دارد؟",
    a: "بله. قالب فارسی با لوگوی شما، لینک پرداخت آنلاین و یادآوری خودکار سررسید.",
  },
  {
    q: "روی موبایل کامل کار می‌کند؟",
    a: "بله. ثبت سفارش، تماس تک‌لمسی و مشاهده وصول؛ برای کار میدانی ساخته شده است.",
  },
  {
    q: "اگر نخواستم ادامه بدهم چه؟",
    a: "دوره آزمایشی رایگان است و پلن را هر ماه می‌توانید لغو کنید. داده‌هایتان تا ۹۰ روز قابل خروجی گرفتن است.",
  },
];

const NUMS = ["۰۱", "۰۲", "۰۳", "۰۴", "۰۵"];

export function LandingFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative scroll-mt-20 overflow-hidden bg-brand-50/60 py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(59,107,224,0.1),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl min-w-0 px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            title={
              <>
                جواب سوال‌هایتان{" "}
                <span className="lp-gradient-text">اینجاست</span>
              </>
            }
            description="پنج سوالی که بیشتر از همه پرسیده می‌شود. چیزی جا مانده؟ خودتان امتحان کنید."
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <div className="space-y-3">
            {QA.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className={`overflow-hidden rounded-[24px] border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-brand-300 shadow-[0_24px_50px_-30px_rgba(33,73,168,0.55)]"
                      : "border-brand-100 hover:border-brand-200"
                  }`}
                >
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="lp-focus flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-start sm:gap-5 sm:px-6"
                    >
                      <span
                        className={`shrink-0 rounded-xl px-2.5 py-1.5 text-[13px] font-black tabular-nums transition-colors duration-300 ${
                          isOpen ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-400"
                        }`}
                      >
                        {NUMS[i]}
                      </span>
                      <span className="min-w-0 flex-1 text-[16px] font-black text-brand-950 sm:text-[17px]">
                        {item.q}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen ? "rotate-45 bg-brand-600 text-white" : "bg-brand-50 text-brand-600"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="mx-5 mb-6 border-t border-dashed border-brand-200 pt-4 text-[15px] leading-8 text-slate-600 sm:mx-6">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <div className="relative flex min-w-0 flex-col items-center gap-5 overflow-hidden rounded-[28px] bg-brand-950 p-7 text-center text-white sm:flex-row sm:justify-between sm:p-8 sm:text-start">
            <div aria-hidden="true" className="absolute -start-16 -top-20 h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-24 end-10 h-48 w-48 rounded-full bg-glow/20 blur-3xl" />
            <p className="relative min-w-0 text-[16px] font-black leading-8 sm:text-[17px]">
              جواب سوالتان را پیدا نکردید؟
              <span className="mt-1 block text-[13.5px] font-semibold text-brand-200/80">
                ثبت‌نام کنید و همین حالا خودتان امتحان کنید.
              </span>
            </p>
            <Link
              href="/register"
              className="relative inline-flex h-13 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-glow px-7 text-[15px] font-black text-brand-950 transition-all hover:brightness-105"
            >
              شروع رایگان
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
