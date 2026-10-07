import React from "react";
import { ArrowDown, ArrowLeft, BellRing, Check, FileText, KanbanSquare, UserRound, X } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";

const CHAOS = [
  { text: "فایل اکسل مشتریان", cls: "-rotate-3" },
  { text: "گروه‌های واتساپ", cls: "rotate-2 translate-y-2" },
  { text: "یادداشت روی کاغذ", cls: "rotate-3 -translate-y-1" },
  { text: "فاکتور در ورد", cls: "-rotate-2 translate-y-1" },
  { text: "«این مشتری چی شد؟»", cls: "rotate-1" },
  { text: "قرار فراموش‌شده", cls: "-rotate-3 translate-y-2" },
  { text: "نسخه نهایی ۳ (جدید)", cls: "rotate-2" },
];

const ORDER = [
  { icon: UserRound, text: "هر مشتری یک پروفایل کامل دارد" },
  { icon: KanbanSquare, text: "وضعیت هر سفارش یک نگاه است" },
  { icon: FileText, text: "فاکتور و پرداخت کنار هم‌اند" },
  { icon: BellRing, text: "یادآوری‌ها خودکار می‌رسند" },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_14px_30px_-10px_rgba(33,73,168,0.8)] ring-[6px] ring-white">
      {children}
    </span>
  );
}

export function BeforeAfter() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            wide
            title={
              <>
                از شلوغی ابزارهای پراکنده و پیام‌های گم‌شده،
                <br className="hidden sm:block" />{" "}
                به <span className="lp-gradient-text">یک صفحه‌ی مرتب</span> برای کسب‌وکارتان
              </>
            }
            description="اگر اطلاعات مشتری‌هایتان در پنج جا پخش شده، هر روز بخشی از فروش از دستتان می‌رود. لایت همه را یک‌جا جمع می‌کند."
          />
        </Reveal>

        <Reveal className="mt-14" delay={0.05}>
          <div className="relative grid overflow-hidden rounded-[36px] border border-brand-100 shadow-[0_40px_90px_-48px_rgba(16,28,69,0.5)] lg:grid-cols-2">
            {/* ------------ before ------------ */}
            <div className="relative min-w-0 overflow-hidden bg-slate-50 p-7 sm:p-10">
              {/* tangled lines */}
              <svg
                aria-hidden="true"
                viewBox="0 0 400 400"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full text-slate-300"
                fill="none"
              >
                <path d="M-10 90 C 90 20, 140 200, 230 120 S 360 60, 420 150" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 6" />
                <path d="M-10 260 C 80 330, 160 150, 250 260 S 340 360, 420 240" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 6" />
                <path d="M60 -10 C 30 120, 200 160, 150 300 S 240 380, 300 420" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 6" />
              </svg>

              <span className="absolute end-8 top-8 hidden rotate-6 items-center rounded-full bg-rose-500 px-3 py-1.5 text-[11.5px] font-black text-white shadow-lg shadow-rose-500/30 sm:flex">
                ۳۷ پیام خوانده‌نشده
              </span>

              <div className="relative">
                <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  قبل از لایت
                </div>

                <div className="relative mt-8">
                  <div className="flex flex-wrap gap-3">
                    {CHAOS.map((c) => (
                      <span
                        key={c.text}
                        className={`${c.cls} rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[14px] font-semibold text-slate-500 shadow-sm`}
                      >
                        {c.text}
                      </span>
                    ))}
                  </div>

                  {/* warning badge */}
                  <span className="absolute -bottom-7 start-6 hidden -rotate-3 items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-[11.5px] font-black text-amber-950 shadow-lg shadow-amber-400/30 sm:flex">
                    کدام فایل درست است؟
                  </span>
                </div>

                <p className="mt-14 max-w-sm text-[14.5px] leading-8 text-slate-500">
                  اطلاعات همه‌جا هست، ولی وقتی لازمش دارید هیچ‌جا پیدا نمی‌شود.
                </p>
              </div>
            </div>

            {/* mobile connector */}
            <div className="relative z-10 -my-7 flex justify-center lg:hidden">
              <Badge>
                <ArrowDown className="h-6 w-6" />
              </Badge>
            </div>

            {/* ------------ after ------------ */}
            <div className="relative min-w-0 overflow-hidden bg-brand-950 p-7 text-white sm:p-10">
              <div aria-hidden="true" className="lp-dark-grid absolute inset-0 opacity-70" />
              <div aria-hidden="true" className="absolute -start-24 -top-24 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-28 -end-12 h-64 w-64 rounded-full bg-glow/20 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-2 text-[13px] font-bold text-brand-200">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-glow text-brand-950">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  با لایت
                </div>

                <ul className="mt-8 space-y-3">
                  {ORDER.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 pe-5 backdrop-blur transition-colors hover:bg-white/[0.1]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-glow ring-1 ring-white/15">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1 text-[15px] font-semibold">{text}</span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-glow text-brand-950">
                        <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 text-[14.5px] leading-8 text-brand-200/80">
                  هر چیزی که لازم دارید، همان‌جا که انتظار دارید.
                </p>
              </div>
            </div>

            {/* desktop connector, centred on the seam */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
              <Badge>
                <ArrowLeft className="h-6 w-6" />
              </Badge>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
