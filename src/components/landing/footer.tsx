import React from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { LightCrmLogo } from "@/components/lightcrm-logo";

const COLUMNS = [
  {
    title: "محصول",
    links: [
      { href: "#features", label: "امکانات" },
      { href: "#how", label: "نحوه کار" },
      { href: "#pricing", label: "تعرفه‌ها" },
    ],
  },
  {
    title: "راهنما",
    links: [
      { href: "#audience", label: "برای چه کسب‌وکاری" },
      { href: "#faq", label: "سوالات متداول" },
    ],
  },
  {
    title: "حساب کاربری",
    links: [
      { href: "/login", label: "ورود" },
      { href: "/register", label: "ثبت‌نام رایگان" },
    ],
  },
];

export function LandingFooter() {
  const year = new Date().toLocaleDateString("fa-IR", { year: "numeric" });

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-white">
      {/* gold hairline + backdrop */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-glow/70 to-transparent" />
      <div aria-hidden="true" className="lp-dark-grid absolute inset-0 opacity-50" />
      <div aria-hidden="true" className="absolute -top-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-16 sm:px-6 sm:pt-20">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="min-w-0">
            <LightCrmLogo size="lg" variant="light" />
            <p className="mt-6 max-w-sm text-[15px] leading-8 text-brand-200/80">
              CRM ساده برای هر کسب‌وکار. مشتری‌ها، سفارش‌ها و فاکتورهایتان را یک‌جا مدیریت کنید و فروش‌تان را روشن‌تر ببینید.
            </p>
            <Link
              href="/register"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-glow px-6 text-[14.5px] font-black text-brand-950 transition-all hover:brightness-105"
            >
              شروع رایگان ۱۴ روزه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            {COLUMNS.map((c) => (
              <nav key={c.title} aria-label={c.title} className="min-w-0">
                <h3 className="flex items-center gap-2 text-[14px] font-black text-white">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                  {c.title}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      {l.href.startsWith("/") ? (
                        <Link
                          href={l.href}
                          className="inline-block text-[14.5px] text-brand-100/80 transition-all hover:-translate-x-1 hover:text-glow"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="inline-block text-[14.5px] text-brand-100/80 transition-all hover:-translate-x-1 hover:text-glow"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* giant wordmark */}
        <div aria-hidden="true" className="pointer-events-none mt-14 select-none overflow-hidden" dir="rtl">
          <div className="bg-gradient-to-b from-white/[0.13] to-white/0 bg-clip-text text-center text-[clamp(90px,20vw,240px)] font-black leading-[1.1] text-transparent">
            لایت
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-brand-200/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} لایت CRM. همه حقوق محفوظ است.</span>
          <span className="flex items-center gap-1.5">
            ساخته‌شده با
            <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
            برای کسب‌وکارهای ایرانی
          </span>
        </div>
      </div>
    </footer>
  );
}
