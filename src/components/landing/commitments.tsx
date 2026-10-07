import React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Download, Rocket, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";

const ITEMS = [
  {
    big: "۱۴ روز",
    title: "دوره آزمایشی کامل",
    text: "همه امکانات را بدون پرداخت و بدون کارت بانکی امتحان کنید.",
    icon: CalendarCheck,
    tile: "bg-glow/15 text-glow",
  },
  {
    big: "هر روز",
    title: "پشتیبان‌گیری خودکار",
    text: "اطلاعات شما روی زیرساخت ابری امن نگهداری و هر روز بکاپ می‌شود.",
    icon: ShieldCheck,
    tile: "bg-brand-500/20 text-brand-200",
  },
  {
    big: "۹۰ روز",
    title: "خروجی داده بعد از لغو",
    text: "اگر ادامه ندادید، تا ۹۰ روز می‌توانید خروجی کامل اکسل بگیرید.",
    icon: Download,
    tile: "bg-emerald-400/15 text-emerald-300",
  },
  {
    big: "چند دقیقه",
    title: "راه‌اندازی سریع",
    text: "بدون نصب و بدون آموزش طولانی، همان روز اول شروع به کار می‌کنید.",
    icon: Rocket,
    tile: "bg-violet-400/15 text-violet-300",
  },
];

export function Commitments() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-24 text-white sm:py-28">
      <div aria-hidden="true" className="lp-dark-grid absolute inset-0" />
      <div aria-hidden="true" className="absolute -top-32 start-1/4 h-80 w-80 rounded-full bg-brand-500/30 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-32 end-[8%] h-72 w-72 rounded-full bg-glow/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -end-32 top-1/2 hidden h-[480px] w-[480px] -translate-y-1/2 rounded-full border border-white/[0.06] lg:block" />
      <div aria-hidden="true" className="absolute -end-20 top-1/2 hidden h-[300px] w-[300px] -translate-y-1/2 rounded-full border border-white/[0.06] lg:block" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex min-w-0 flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="min-w-0">
            <SectionHeading
              tone="dark"
              align="start"
              wide
              title={
                <>
                  ریسک شروع را <span className="text-glow">صفر</span> کردیم
                </>
              }
              description="نمی‌خواهیم شما را در دام قرارداد بگذاریم. می‌خواهیم با خیال راحت امتحان کنید."
            />
          </Reveal>
          <Reveal delay={0.1} className="shrink-0">
            <Link
              href="/register"
              className="inline-flex h-14 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-white px-8 text-[16px] font-bold text-brand-950 transition-colors hover:bg-brand-50"
            >
              شروع رایگان ۱۴ روزه
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="mt-12">
          <div className="grid min-w-0 gap-px overflow-hidden rounded-[32px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {ITEMS.map(({ big, title, text, icon: Icon, tile }) => (
              <div key={title} className="min-w-0 bg-brand-950 p-7 transition-colors hover:bg-brand-900 sm:p-8">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tile}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <div className="mt-6 text-[30px] font-black leading-none">{big}</div>
                <h3 className="mt-3 text-[16px] font-black">{title}</h3>
                <p className="mt-2 text-[13.5px] leading-7 text-brand-200/75">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
