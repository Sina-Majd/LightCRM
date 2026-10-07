"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const LINKS = [
  { href: "#features", label: "امکانات" },
  { href: "#how", label: "نحوه کار" },
  { href: "#audience", label: "برای چه کسب‌وکاری" },
  { href: "#pricing", label: "تعرفه‌ها" },
  { href: "#faq", label: "سوالات متداول" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <header
        className={`mx-auto max-w-6xl rounded-full border transition-all duration-300 ${
          scrolled
            ? "border-brand-100 bg-white/85 shadow-[0_10px_40px_-18px_rgba(16,28,69,0.35)] backdrop-blur-xl"
            : "border-transparent bg-white/50 backdrop-blur-md"
        }`}
      >
        <div className="flex h-16 min-w-0 items-center justify-between gap-3 ps-4 pe-2.5 sm:ps-6">
          <Link href="/" aria-label="لایت CRM" className="lp-focus shrink-0 rounded-lg">
            <LightCrmLogo size="sm" priority />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="ناوبری اصلی">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="lp-focus whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-semibold text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/login"
              className="lp-focus hidden whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-bold text-slate-700 transition-colors hover:text-brand-700 sm:block"
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="lp-btn-primary inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-[14px] font-bold"
            >
              شروع رایگان
              <ArrowLeft className="hidden h-4 w-4 sm:block" />
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="lp-focus flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-800 lg:hidden"
                  aria-label="منو"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm bg-white p-6">
                <SheetTitle className="sr-only">منوی ناوبری لایت CRM</SheetTitle>
                <LightCrmLogo size="sm" />
                <div className="mt-8 grid gap-1">
                  {LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="whitespace-nowrap rounded-2xl px-4 py-3.5 text-[16px] font-bold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
                <div className="mt-6 grid gap-2.5 border-t border-brand-100 pt-6">
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="lp-btn-primary flex h-12 items-center justify-center rounded-full text-[15px] font-bold"
                  >
                    شروع رایگان ۱۴ روزه
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-brand-200 text-[15px] font-bold text-brand-800"
                  >
                    ورود
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
