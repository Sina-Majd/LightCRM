import React from "react";
import Link from "next/link";
import { ArrowLeft, Rocket, TrendingUp, UserPlus } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";

const STEPS = [
  {
    n: "۱",
    icon: UserPlus,
    title: "حساب بسازید",
    text: "با ایمیل در کمتر از یک دقیقه وارد می‌شوید. نیازی به کارت بانکی نیست.",
  },
  {
    n: "۲",
    icon: Rocket,
    title: "مشتری و سفارش اضافه کنید",
    text: "مشتری‌ها و سفارش‌های فعلی‌تان را ثبت کنید. هر رکورد فقط چند ثانیه طول می‌کشد.",
  },
  {
    n: "۳",
    icon: TrendingUp,
    title: "بفروشید و پیگیری کنید",
    text: "سفارش را در پایپ‌لاین جلو ببرید، فاکتور بفرستید و گزارش رشدتان را ببینید.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            title={
              <>
                در <span className="lp-gradient-text">سه قدم</span> راه می‌افتید
              </>
            }
            description="لازم نیست چیزی نصب کنید یا کسی را استخدام کنید. همین امروز شروع کنید."
          />
        </Reveal>

        <div className="relative mt-16">
          {/* connector line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[16%] top-[44px] hidden border-t-2 border-dashed border-brand-200 md:block"
          />
          <ol className="relative grid min-w-0 gap-10 md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.n} className="min-w-0">
                <Reveal delay={i * 0.1} className="flex flex-col items-center text-center">
                  <div className="relative">
                    <span className="flex h-[88px] w-[88px] items-center justify-center rounded-[28px] border border-brand-100 bg-white text-brand-600 shadow-[0_18px_40px_-20px_rgba(33,73,168,0.55)]">
                      <s.icon className="h-9 w-9" />
                    </span>
                    <span className="absolute -end-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-glow text-[16px] font-black text-brand-950 ring-4 ring-white">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[19px] font-black text-brand-950">{s.title}</h3>
                  <p className="mt-2.5 max-w-xs text-[14.5px] leading-8 text-slate-600">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-14 text-center">
          <Link
            href="/register"
            className="lp-btn-primary inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-8 text-[16px] font-bold"
          >
            همین حالا شروع کنید
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
