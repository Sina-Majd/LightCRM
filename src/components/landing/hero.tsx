import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { HeroPattern } from "@/components/landing/hero-pattern";

export function LandingHero() {
  return (
    <section className="lp-hero-bg relative overflow-hidden pt-[76px]">
      <HeroPattern />
      {/* soft wash so the headline stays crisp over the pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[780px] bg-[radial-gradient(ellipse_48%_46%_at_50%_34%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.7)_55%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:pb-36">
        <div className="mx-auto text-center">
          <Reveal>
            <h1 className="mx-auto max-w-[1100px] text-balance text-[34px] font-black leading-[1.6] tracking-tight text-brand-950 sm:text-[50px] sm:leading-[1.55] lg:text-[60px]">
              مشتری‌ها، سفارش‌ها و فروش کسب‌وکارتان را
              <br className="hidden sm:block" />{" "}
              در یک داشبورد
              <span className="relative mx-2 inline-block -rotate-2 rounded-[0.32em] bg-gradient-to-b from-brand-800 to-brand-950 px-[0.38em] pb-[0.1em] pt-[0.02em] align-middle leading-[1.35] text-white shadow-[0_22px_44px_-16px_rgba(16,28,69,0.7),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-white/10">
                روشن‌تر
              </span>{" "}
              ببینید
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-3xl text-[16px] leading-9 text-slate-600 sm:text-[18px] sm:leading-10">
              با لایت دیگر لازم نیست دنبال اطلاعات مشتری‌ها بگردید. هر سفارش، فاکتور و گزارش همان‌جا که
              انتظار دارید پیدا می‌شود؛ ساده، سریع و به زبان خودتان. شما فقط روی فروش تمرکز کنید.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="lp-btn-primary inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-8 text-[16px] font-bold"
              >
                شروع رایگان ۱۴ روزه
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="lp-focus inline-flex h-14 items-center justify-center whitespace-nowrap rounded-full border border-brand-200 bg-white/80 px-8 text-[16px] font-bold text-brand-800 backdrop-blur transition-colors hover:border-brand-400 hover:bg-white"
              >
                دیدن امکانات
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} y={40} className="mt-16 sm:mt-20">
          <DashboardPreview />
        </Reveal>
      </div>

      {/* final fade so the hero melts into the next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}
