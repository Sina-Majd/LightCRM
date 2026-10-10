"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarCheck,
  KanbanSquare,
  Users,
  Receipt,
  CheckSquare,
  BarChart3,
  Search,
  Bell,
  Plus,
  ChevronDown,
  LogOut,
  Building2,
  User,
  Check,
  CheckCheck,
  MoreHorizontal,
} from "lucide-react";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CRMNotification } from "@/data/dashboard-mock-data";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, updateUserStatus } from "@/lib/supabase/crm-service";
import { useRouter } from "next/navigation";
import { faDigits, formatRelativeFa, formatJalaliDate } from "@/lib/fa";

export type DashboardTab =
  | "today"
  | "pipeline"
  | "customers"
  | "invoices"
  | "tasks"
  | "analytics";

interface Props {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewDealModal: () => void;
  notifications: CRMNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  userProfile?: UserProfile | null;
  counts: {
    deals: number;
    leads?: number;
    customers: number;
    tasks: number;
    invoices?: number;
    cheques?: number;
    staleDeals?: number;
  };
  children: React.ReactNode;
}

const PLAN_FA_MAP: Record<string, string> = {
  starter: "پلن پایه",
  business: "پلن سازمانی",
  pro: "پلن حرفه‌ای",
  enterprise: "نسخه شرکتی اختصاصی",
};

function formatPlanFa(plan?: string | null): string {
  if (!plan) return "پلن سازمانی فعال";
  const key = plan.trim().toLowerCase();
  return PLAN_FA_MAP[key] || plan;
}

const TITLES: Record<DashboardTab, { t: string; d: string }> = {
  today: {
    t: "پیشخوان روزانه «امروز»",
    d: "اتاق وضعیت فروش: چک‌های سررسید، وظایف روز و تریاژ معاملات بدون اقدام بعدی.",
  },
  pipeline: {
    t: "پایپ‌لاین معاملات فروش",
    d: "رهگیری مراحل تبدیل، تغییر وضعیت کشیدنی و رصد جمع ارزش معاملات به تومان.",
  },
  customers: {
    t: "باشگاه و بانک اطلاعات مشتریان",
    d: "پرونده ۳۶۰ درجه اشخاص حقیقی و حقوقی، سگمنت‌بندی، کد ملی و ارزش طول عمر (LTV).",
  },
  invoices: {
    t: "پیش‌فاکتورها و چک‌های صیادی",
    d: "صدور اسناد مالی رسمی با ارزش افزوده و رهگیری چرخه حیات چک‌های صیادی ۱۶ رقمی.",
  },
  tasks: {
    t: "مدیریت وظایف و پیگیری‌ها",
    d: "برنامه‌ریزی تماس‌های تلفنی، جلسات حضوری و موعدهای پیگیری فروشندگان.",
  },
  analytics: {
    t: "تحلیل‌ها و گزارش‌های عملکرد",
    d: "رصد قیف تبدیل، نرخ برد، مقایسه با هدف سازمانی و درآمد وصول‌شده.",
  },
};

export function DashboardShell(props: Props) {
  const {
    activeTab,
    onTabChange,
    searchQuery,
    onSearchChange,
    onOpenNewDealModal,
    notifications,
    onMarkNotificationRead,
    onMarkAllNotificationsRead,
    userProfile,
    counts,
    children,
  } = props;

  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [status, setStatus] = useState("آماده پاسخگویی");
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const nav = [
    {
      id: "today" as DashboardTab,
      label: "امروز",
      icon: CalendarCheck,
    },
    {
      id: "pipeline" as DashboardTab,
      label: "فرصت‌های فروش",
      icon: KanbanSquare,
    },
    {
      id: "customers" as DashboardTab,
      label: "مشتریان ۳۶۰",
      icon: Users,
    },
    {
      id: "invoices" as DashboardTab,
      label: "فاکتور و چک صیادی",
      icon: Receipt,
    },
    {
      id: "tasks" as DashboardTab,
      label: "وظایف و تماس‌ها",
      icon: CheckSquare,
    },
    {
      id: "analytics" as DashboardTab,
      label: "گزارش‌ها و تحلیل",
      icon: BarChart3,
    },
  ];

  const signOut = async () => {
    try {
      await createClient().auth.signOut();
    } catch {}
    router.push("/login");
  };

  const setUserStatus = (s: string) => {
    setStatus(s);
    toast.success(`وضعیت شما به «${s}» تغییر یافت.`);
    if (userProfile?.id) updateUserStatus(userProfile.id, s as never);
  };

  return (
    <div className="min-h-screen bg-[#f8faff] text-slate-950 md:flex relative selection:bg-brand-500 selection:text-white md:pr-[264px]" dir="rtl">
      {/* Ambient background aura (Matches Landing / Login styling) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 h-96 w-96 rounded-full bg-brand-500/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 left-0 h-80 w-80 rounded-full bg-glow/5 blur-3xl"
      />

      {/* Desktop Sidebar — fixed to survive body overflow-x containers */}
      <aside
        style={{ right: "var(--removed-body-scroll-bar-size, 0px)" }}
        className="hidden md:flex fixed inset-y-0 right-0 right-scroll-bar-position w-[264px] shrink-0 flex-col border-l border-brand-100/80 bg-white/95 backdrop-blur-xl z-30 shadow-[0_10px_35px_-20px_rgba(16,28,69,0.1)] overflow-hidden"
      >
        {/* Brand & Workspace Header — single plan source lives in workspace banner */}
        <div className="px-5 pb-4 pt-5 border-b border-brand-100/60 bg-white">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <LightCrmLogo size="sm" />
            </Link>
          </div>

          {/* Current Workspace Banner */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-l from-brand-800 to-brand-950 p-3.5 text-white shadow-md shadow-brand-900/25">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-black leading-5">
                {userProfile?.companyName || "شرکت داده‌پردازی سپهر"}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-white/70">
                  {formatPlanFa(userProfile?.plan)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Create Deal Button */}
          <Button
            onClick={onOpenNewDealModal}
            className="mt-3.5 h-11 w-full bg-brand-700 font-black text-white hover:bg-brand-800 shadow-md shadow-brand-700/25 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 text-[13px]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
              <Plus className="h-3.5 w-3.5" />
            </span>
            ثبت معامله جدید
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3.5 py-4">
          <div className="px-3 pb-2 text-[11px] font-black text-slate-400">
            میز کار فروش و ارتباطات
          </div>
          {nav.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] transition-all cursor-pointer ${
                  active
                    ? "bg-brand-700 text-white font-black shadow-md shadow-brand-700/20"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-950 font-bold"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    active ? "text-white" : "text-brand-600 group-hover:text-brand-700"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer with zero layout shift and RTL dropdown */}
        <div className="border-t border-brand-100/60 p-3 bg-brand-50/30">
          <DropdownMenu modal={false} dir="rtl">
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-2xl p-2.5 text-right hover:bg-white cursor-pointer transition border border-transparent hover:border-brand-200 hover:shadow-xs data-[state=open]:bg-white data-[state=open]:border-brand-200 data-[state=open]:shadow-xs">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 border border-brand-200 text-brand-700 shadow-xs">
                  <User className="h-5 w-5" />
                  <span
                    className={`absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-white ${
                      status === "مشغول"
                        ? "bg-amber-500"
                        : status === "در جلسه کاری"
                        ? "bg-rose-500"
                        : "bg-emerald-500"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-black text-slate-900">
                    {userProfile?.fullName || "علیرضا رضایی"}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold mt-0.5">
                    <span>{status}</span>
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={8}
              className="w-56 bg-white rounded-2xl p-1.5 shadow-2xl border border-brand-100"
            >
              <DropdownMenuLabel className="text-right text-[11px] font-black text-slate-400 px-3 py-2">
                تغییر وضعیت کارشناس
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setUserStatus("آماده پاسخگویی")}
                className={`cursor-pointer text-right text-xs font-bold gap-2.5 rounded-xl px-2.5 py-2 ${
                  status === "آماده پاسخگویی" ? "bg-emerald-50 text-emerald-900" : ""
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="flex-1">آماده پاسخگویی</span>
                {status === "آماده پاسخگویی" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setUserStatus("مشغول")}
                className={`cursor-pointer text-right text-xs font-bold gap-2.5 rounded-xl px-2.5 py-2 ${
                  status === "مشغول" ? "bg-amber-50 text-amber-900" : ""
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <span className="flex-1">مشغول</span>
                {status === "مشغول" && <Check className="h-3.5 w-3.5 text-amber-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setUserStatus("در جلسه کاری")}
                className={`cursor-pointer text-right text-xs font-bold gap-2.5 rounded-xl px-2.5 py-2 ${
                  status === "در جلسه کاری" ? "bg-rose-50 text-rose-900" : ""
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <span className="flex-1">در جلسه کاری</span>
                {status === "در جلسه کاری" && <Check className="h-3.5 w-3.5 text-rose-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-brand-100/70 my-1" />
              <DropdownMenuItem
                onClick={signOut}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer text-right text-xs font-bold gap-2.5 rounded-xl px-2.5 py-2"
              >
                <LogOut className="h-4 w-4 shrink-0 text-rose-600" />
                <span className="flex-1">خروج از حساب</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-20 border-b border-brand-100/80 bg-white/85 backdrop-blur-xl shadow-xs">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="min-w-0">
              <h1 className="truncate text-[15.5px] font-black text-brand-950">
                {TITLES[activeTab].t}
              </h1>
              <p className="hidden truncate text-[11.5px] text-slate-500 sm:block">
                {TITLES[activeTab].d}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search Bar without ⌘K */}
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="جستجو در معاملات، مشتریان، فاکتورها…"
                  className="h-10 w-72 rounded-2xl border border-brand-100 bg-brand-50/50 pr-9 pl-4 text-[12.5px] focus:border-brand-500 focus:bg-white focus:outline-none transition font-bold"
                />
              </div>

              {/* Notification Bell */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-100 bg-white cursor-pointer hover:bg-brand-50 transition shadow-xs">
                    <Bell className="h-[18px] w-[18px] text-slate-700" />
                    {unread > 0 && (
                      <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-black text-white shadow-xs">
                        {faDigits(unread)}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-white p-2.5 rounded-2xl shadow-xl border border-brand-100">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                    <b className="text-[13px] font-black text-slate-900">اعلان‌های سیستم CRM</b>
                    {unread > 0 && onMarkAllNotificationsRead && (
                      <button
                        onClick={() => onMarkAllNotificationsRead()}
                        className="flex items-center gap-1 text-[11px] font-bold text-brand-700 cursor-pointer hover:underline"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        خواندن همه
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 space-y-1.5 overflow-y-auto pt-2">
                    {notifications.length === 0 && (
                      <div className="py-8 text-center text-[12px] text-slate-400">
                        اعلانی برای نمایش وجود ندارد
                      </div>
                    )}
                    {notifications.slice(0, 8).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => onMarkNotificationRead?.(n.id)}
                        className={`w-full rounded-xl border p-3 text-right cursor-pointer transition ${
                          n.read
                            ? "border-slate-100 bg-white hover:bg-slate-50"
                            : "border-brand-200 bg-brand-50/60 hover:bg-brand-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <b className="truncate text-[12.5px] text-slate-900">{n.title}</b>
                          <span
                            className="shrink-0 text-[10px] text-slate-400"
                            title={n.createdAt ? formatJalaliDate(n.createdAt, "full") : undefined}
                          >
                            {n.createdAt && formatRelativeFa(n.createdAt) !== "—"
                              ? formatRelativeFa(n.createdAt)
                              : n.time || "همین الان"}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11.5px] leading-5 text-slate-600">
                          {n.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Quick Action & Avatar */}
              <Button
                onClick={onOpenNewDealModal}
                className="h-10 bg-brand-700 font-bold hover:bg-brand-800 md:hidden rounded-xl shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <button
                onClick={() => setDrawer(true)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-700"
                aria-label="حساب"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="px-4 pb-2.5 sm:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجو در معاملات و مشتریان…"
                className="h-10 w-full rounded-xl border border-brand-100 bg-brand-50/50 pr-9 text-[12.5px]"
              />
            </div>
          </div>
        </header>

        {/* Mobile User Drawer */}
        <Sheet open={drawer} onOpenChange={setDrawer}>
          <SheetContent side="bottom" className="rounded-t-3xl bg-white p-5 border-t border-brand-100" dir="rtl">
            <SheetTitle className="sr-only">پروفایل کاربری و تنظیمات</SheetTitle>
            <SheetDescription className="sr-only">اطلاعات حساب کاربری و گزینه‌های خروج</SheetDescription>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-200" />
            <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-3.5">
              <Avatar className="h-11 w-11 rounded-xl">
                <AvatarFallback className="rounded-xl bg-brand-700 text-white font-bold">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-black text-[14px]">
                  {userProfile?.fullName || "علیرضا رضایی"}
                </div>
                <div className="text-[12px] text-slate-500">
                  {userProfile?.companyName || "شرکت داده‌پردازی سپهر"}
                </div>
              </div>
              <Badge className="mr-auto bg-brand-100 text-brand-800 font-bold">{formatPlanFa(userProfile?.plan)}</Badge>
            </div>
            <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
              {[
                ["معاملات", counts.deals],
                ["مشتریان", counts.customers],
                ["وظایف", counts.tasks],
              ].map(([l, v]) => (
                <div
                  key={l as string}
                  className="rounded-2xl border border-slate-200/80 p-2.5 bg-slate-50"
                >
                  <div className="text-[11px] text-slate-500 font-bold">{l}</div>
                  <div className="font-black text-sm mt-0.5">
                    {faDigits(v as number)}
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              className="mt-4 h-11 w-full border-red-200 text-red-600 rounded-xl font-bold"
            >
              <LogOut className="h-4 w-4 ml-2" />
              خروج از سیستم
            </Button>
          </SheetContent>
        </Sheet>

        {/* Mobile 'More' Sheet */}
        <Sheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-3xl bg-white p-5 border-t border-brand-100" dir="rtl">
            <SheetTitle className="sr-only">سایر بخش‌های داشبورد</SheetTitle>
            <SheetDescription className="sr-only">دسترسی سریع به وظایف و گزارش‌های آماری</SheetDescription>
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200" />
            <div className="text-[14px] font-black mb-3">سایر بخش‌های CRM</div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onTabChange("tasks");
                  setMoreSheetOpen(false);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-right font-bold transition ${
                  activeTab === "tasks"
                    ? "bg-brand-50 border-brand-300 text-brand-700"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CheckSquare className="h-5 w-5 text-brand-700" />
                <div>
                  <div className="text-[13px]">وظایف و پیگیری</div>
                  <div className="text-[11px] text-slate-400 font-normal">
                    {faDigits(counts.tasks)} وظیفه
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  onTabChange("analytics");
                  setMoreSheetOpen(false);
                }}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-right font-bold transition ${
                  activeTab === "analytics"
                    ? "bg-brand-50 border-brand-300 text-brand-700"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <BarChart3 className="h-5 w-5 text-brand-700" />
                <div>
                  <div className="text-[13px]">گزارش و تحلیل</div>
                  <div className="text-[11px] text-slate-400 font-normal">
                    قیف و نرخ برد
                  </div>
                </div>
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Body */}
        <main className="p-4 sm:p-6 pb-28 md:pb-10 flex-1">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>

        {/* Mobile Floating Bottom Navigation Dock */}
        <nav className="fixed bottom-0 right-0 left-0 z-40 border-t border-brand-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden shadow-lg">
          <div className="flex">
            {nav.slice(0, 4).map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative flex-1 rounded-xl py-2 cursor-pointer"
                >
                  {active && (
                    <motion.span
                      layoutId="mnav"
                      className="absolute inset-0 rounded-xl bg-brand-50 border border-brand-200"
                    />
                  )}
                  <span className="relative flex flex-col items-center gap-1">
                    <item.icon
                      className={`h-5 w-5 ${
                        active ? "text-brand-700" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`text-[10px] ${
                        active ? "font-black text-brand-950" : "text-slate-500 font-bold"
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setMoreSheetOpen(true)}
              className={`relative flex-1 rounded-xl py-2 cursor-pointer ${
                activeTab === "tasks" || activeTab === "analytics"
                  ? "text-brand-700 font-black"
                  : "text-slate-500"
              }`}
            >
              <span className="relative flex flex-col items-center gap-1">
                <MoreHorizontal className="h-5 w-5 text-slate-400" />
                <span className="text-[10px] font-bold">بیشتر</span>
              </span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
