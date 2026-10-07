"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        setError("ایمیل یا رمز عبور اشتباه است.");
        toast.error("ورود ناموفق");
        return;
      }
      toast.success("خوش برگشتید!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      setError("خطای غیرمنتظره. دوباره تلاش کنید.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-50/50 lg:grid lg:grid-cols-2" dir="rtl">
      <div className="relative hidden overflow-hidden bg-brand-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="lp-dark-grid absolute inset-0 opacity-60" />
        <div aria-hidden="true" className="absolute -top-24 start-1/4 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 end-10 h-56 w-56 rounded-full bg-glow/15 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3">
          <LightCrmLogo size="md" variant="light" />
        </Link>
        <div className="relative">
          <h1 className="text-4xl font-black leading-[1.5]">
            دوباره خوش برگشتید.
            <br />
            کسب‌وکارتان منتظر شماست.
          </h1>
          <p className="mt-4 max-w-md leading-8 text-brand-200/80">
            پایپ‌لاین امروز، فاکتورهای باز و پیگیری‌ها — همه یک‌جا و به‌روز.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[["۱٬۲۸۴", "مشتری"], ["۹۶٫۵٪", "وصول به‌موقع"], ["۲۴ ساعت", "میانگین تسویه"]].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-white/15 bg-white/10 p-3.5 text-center backdrop-blur">
                <div className="text-xl font-black">{v}</div>
                <div className="mt-0.5 text-[11.5px] text-brand-200/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-[12.5px] text-brand-200/70">
          <ShieldCheck className="h-4 w-4" /> ورود امن با رمزنگاری کامل
        </div>
      </div>

      <div className="flex flex-col px-4 py-6 sm:px-10">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/"><LightCrmLogo size="sm" /></Link>
            <Link href="/" className="flex items-center gap-1.5 text-[12.5px] font-bold text-slate-500 hover:text-slate-700">
              <ArrowRight className="h-4 w-4" />
              بازگشت
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-brand-100 bg-white p-6 shadow-[0_24px_50px_-30px_rgba(16,28,69,0.35)] sm:p-8"
          >
            <h2 className="text-2xl font-black text-slate-900">ورود به لایت</h2>
            <p className="mt-1.5 text-[13.5px] text-slate-500">وارد فضای کاری‌تان شوید.</p>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" requiredIndicator>ایمیل کاری</Label>
                <Input
                  id="login-email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@lightcrm.com"
                  icon={<Mail className="h-4 w-4" />}
                  className="h-11 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" requiredIndicator>رمز عبور</Label>
                  <button
                    type="button"
                    onClick={() => toast.info("جهت بازیابی رمز عبور، ایمیل کاری خود را بررسی کنید یا با پشتیبانی تماس بگیرید.")}
                    className="text-[12px] font-bold text-brand-700 hover:text-brand-800 transition cursor-pointer"
                  >
                    فراموش کردم
                  </button>
                </div>
                <Input
                  id="login-password"
                  type={show ? "text" : "password"}
                  dir="ltr"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      aria-label={show ? "مخفی کردن رمز" : "نمایش رمز"}
                      className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  className="h-11 bg-white"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-slate-600 font-medium select-none">
                <Checkbox checked={remember} onCheckedChange={(c) => setRemember(!!c)} />
                مرا به خاطر بسپار
              </label>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-brand-600 text-[14px] font-black hover:bg-brand-700 disabled:opacity-60 cursor-pointer shadow-md shadow-brand-600/20"
              >
                {loading ? "در حال ورود…" : "ورود به داشبورد"}
              </Button>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5 text-center text-[13px] text-slate-500">
              حساب ندارید؟{" "}
              <Link href="/register" className="font-black text-brand-700 hover:text-brand-800 hover:underline">
                ۱۴ روز رایگان شروع کنید
              </Link>
            </div>
          </motion.div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11.5px] text-slate-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            با ورود، شرایط استفاده را می‌پذیرید
          </p>
        </div>
      </div>
    </div>
  );
}
