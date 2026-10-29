"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Building2, Check, AlertCircle, ShieldCheck, Clock } from "lucide-react";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function Content() {
  const router = useRouter();
  const sp = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(sp.get("email") || "");
  const [company, setCompany] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [plan, setPlan] = useState(sp.get("plan") || "business");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return setError("شرایط استفاده را بپذیرید.");
    if (pass.length < 6) return setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name.trim(), company: company.trim(), plan },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setLoading(false);
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("already registered") || msg.includes("already exists")) {
          setError("این ایمیل قبلاً ثبت‌نام شده است. لطفاً از صفحه ورود وارد شوید.");
        } else if (msg.includes("password") || msg.includes("characters")) {
          setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
        } else if (msg.includes("valid email") || msg.includes("invalid email")) {
          setError("فرمت ایمیل کاری معتبر نیست.");
        } else {
          setError("خطا در ایجاد حساب کاربری. لطفاً اطلاعات را بررسی نمایید.");
        }
        return;
      }
      if (data.session) {
        toast.success(`خوش آمدید ${name}!`);
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.success("حساب ساخته شد — ایمیل تأیید ارسال گردید.");
        setLoading(false);
      }
    } catch {
      setLoading(false);
      setError("خطا در ایجاد حساب کاربری.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-50/50 lg:grid lg:grid-cols-[1fr_1.1fr]" dir="rtl">
      <div className="flex flex-col px-4 py-6 sm:px-10 order-2 lg:order-1">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-6">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/"><LightCrmLogo size="sm" /></Link>
            <span className="text-[12.5px] text-slate-500 font-medium">
              حساب دارید؟{" "}
              <Link href="/login" className="font-black text-brand-700 hover:underline">
                ورود
              </Link>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-brand-100 bg-white p-6 shadow-[0_24px_50px_-30px_rgba(16,28,69,0.35)] sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">ساخت حساب لایت</h2>
              <Badge className="bg-brand-50 text-brand-700 border-brand-200 font-bold">
                {plan === "business" ? "کسب‌وکار" : plan === "pro" ? "حرفه‌ای" : "پایه"}
              </Badge>
            </div>
            <p className="mt-1.5 text-[13.5px] text-slate-500">۱۴ روز رایگان، بدون نیاز به کارت بانکی.</p>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-3.5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="register-name" requiredIndicator>نام کامل</Label>
                  <Input
                    id="register-name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مریم محمدی"
                    icon={<User className="h-4 w-4" />}
                    className="h-11 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="register-company" requiredIndicator>نام شرکت یا کسب‌وکار</Label>
                  <Input
                    id="register-company"
                    required
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="فروشگاه یا شرکت شما"
                    icon={<Building2 className="h-4 w-4" />}
                    className="h-11 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-email" requiredIndicator>ایمیل کاری</Label>
                <Input
                  id="register-email"
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
                <Label htmlFor="register-pass" requiredIndicator>رمز عبور</Label>
                <Input
                  id="register-pass"
                  type={show ? "text" : "password"}
                  dir="ltr"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="حداقل ۶ کاراکتر"
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

              <div>
                <div className="mb-1.5 text-[12px] font-bold text-slate-600">پلن آزمایشی</div>
                <div role="radiogroup" aria-label="پلن آزمایشی" className="grid grid-cols-3 gap-2">
                  {[
                    ["starter", "پایه"],
                    ["business", "کسب‌وکار"],
                    ["pro", "حرفه‌ای"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={plan === v}
                      onClick={() => setPlan(v)}
                      className={`rounded-xl border px-3 py-2.5 text-[13px] font-bold transition cursor-pointer ${
                        plan === v
                          ? "border-brand-600 bg-brand-50 text-brand-800 shadow-xs"
                          : "border-slate-200 bg-white text-slate-500 hover:border-brand-200"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-[12px] leading-6 text-slate-600 select-none">
                <Checkbox checked={agree} onCheckedChange={(c) => setAgree(!!c)} className="mt-1" />
                با شرایط استفاده و حریم خصوصی موافقم.
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-brand-600 text-[14px] font-black hover:bg-brand-700 disabled:opacity-60 cursor-pointer shadow-md shadow-brand-600/20"
              >
                {loading ? "در حال ساخت…" : "ساخت حساب و شروع رایگان"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-brand-950 p-10 text-white lg:flex lg:flex-col lg:justify-center order-1 lg:order-2">
        <div aria-hidden="true" className="lp-dark-grid absolute inset-0 opacity-60" />
        <div aria-hidden="true" className="absolute -top-24 start-1/4 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 end-10 h-56 w-56 rounded-full bg-glow/15 blur-3xl" />
        <div className="relative">
          <LightCrmLogo size="md" variant="light" />
          <h1 className="mt-8 text-4xl font-black leading-[1.6]">
            از امروز،
            <br />
            هیچ مشتری و فاکتوری گم نمی‌شود.
          </h1>
          <div className="mt-8 space-y-3">
            {[
              ["بورد سفارش فارسی", "هر سفارش مرحله و مسئول دارد"],
              ["فاکتور تک‌کلیکی", "با لوگوی شما و لینک پرداخت آنلاین"],
              ["گزارش شفاف", "وصول، مانده و هدف ماهانه فروش"],
            ].map(([t, d]) => (
              <div
                key={t}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-black text-[14px]">{t}</div>
                  <div className="text-[12.5px] text-brand-200/80 font-medium">{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-5 text-[12.5px] text-brand-200/80 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              بدون کارت بانکی
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-300" />
              راه‌اندازی ۲ دقیقه‌ای
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm font-bold text-slate-500">
          در حال بارگذاری…
        </div>
      }
    >
      <Content />
    </Suspense>
  );
}
