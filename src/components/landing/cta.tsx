"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";

const DAY_ONE = [
  { t: "ساخت حساب با ایمیل", s: "کمتر از یک دقیقه" },
  { t: "ثبت اولین مشتری و سفارش", s: "چند ثانیه" },
  { t: "ارسال اولین فاکتور", s: "با لینک پرداخت" },
];

export function LandingCta() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <section className="bg-white px-4 pb-24 pt-8 sm:px-6 sm:pb-28">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[40px] bg-brand-950 px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-16">
          {/* base decor */}
          <div aria-hidden="true" className="lp-dark-grid absolute inset-0 opacity-70" />
          <div aria-hidden="true" className="absolute -top-32 start-1/3 h-80 w-80 rounded-full bg-brand-500/40 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-32 end-[10%] h-72 w-72 rounded-full bg-glow/20 blur-3xl" />

          {/* orbit-ring pattern */}
          <div aria-hidden="true" className="pointer-events-none absolute -end-40 -top-40 h-[480px] w-[480px]">
            <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
            <div className="absolute inset-10 rounded-full border border-white/[0.07]" />
            <div className="absolute inset-20 rounded-full border border-white/[0.07]" />
            <div className="lp-spin-slow absolute inset-6 rounded-full border border-dashed border-glow/25" />
            <div className="lp-spin-rev absolute inset-28 rounded-full border border-dashed border-brand-400/30" />
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_24px_6px_rgba(255,201,74,0.5)]" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 -start-32 h-[380px] w-[380px]">
            <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
            <div className="absolute inset-12 rounded-full border border-white/[0.06]" />
            <div className="lp-spin-slow absolute inset-24 rounded-full border border-dashed border-brand-400/25" />
          </div>

          {/* top shine line */}
          <div aria-hidden="true" className="absolute inset-x-16 top-0 h-px bg-gradient-to-l from-transparent via-glow/60 to-transparent" />

          <div className="relative grid min-w-0 items-center gap-12 lg:grid-cols-2 lg:gap-10">
            {/* copy + form */}
            <div className="min-w-0 text-center lg:text-start">
              <h2 className="text-[30px] font-black leading-[1.5] sm:text-[44px]">
                امروز شروع کنید،
                <br />
                <span className="text-glow">فردا روشن‌تر ببینید</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-9 text-brand-100/90 sm:text-[17px] lg:mx-0">
                ایمیل‌تان را وارد کنید و در چند دقیقه اولین مشتری و سفارش‌تان را ثبت کنید.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(email ? `/register?email=${encodeURIComponent(email)}` : "/register");
                }}
                className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-[28px] bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur sm:flex-row sm:rounded-full lg:mx-0"
              >
                <label htmlFor="cta-email" className="sr-only">
                  ایمیل
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@lightcrm.com"
                  className="h-13 min-w-0 flex-1 rounded-full bg-white px-6 text-start text-[15px] text-brand-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-glow"
                />
                <button
                  type="submit"
                  className="inline-flex h-13 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-glow px-7 text-[15px] font-black text-brand-950 transition-all hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  شروع رایگان
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-[13px] font-semibold text-brand-100/80">
                ۱۴ روز رایگان · بدون کارت بانکی · لغو در هر زمان
              </p>
            </div>

            {/* day-one card */}
            <div className="relative min-w-0">
              <div className="lp-float-slow rounded-[28px] bg-white p-6 text-brand-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[17px] font-black">روز اول شما</div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-[11.5px] font-bold text-brand-700">
                    از ثبت‌نام تا فاکتور
                  </span>
                </div>

                <div className="relative mt-6">
                  <div aria-hidden="true" className="absolute bottom-5 start-[21px] top-5 w-px bg-brand-100" />
                  <ul className="relative space-y-4">
                    {DAY_ONE.map((d) => (
                      <li key={d.t} className="flex items-center gap-3.5">
                        <span className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-4 ring-white">
                          <Check className="h-5 w-5" strokeWidth={3} />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[14.5px] font-bold">{d.t}</span>
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-50 px-3 py-1 text-[11.5px] font-bold text-brand-700">
                          {d.s}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* sticker */}
              <div className="lp-float absolute -top-5 end-6 rotate-6 rounded-2xl bg-glow px-4 py-2 text-[13px] font-black text-brand-950 shadow-lg shadow-glow/30">
                فقط امروز نه؛ هر روز
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
