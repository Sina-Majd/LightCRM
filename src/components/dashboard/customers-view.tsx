"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Plus,
  UserPlus,
  MoreHorizontal,
  Trash2,
  Phone,
  User,
  ShieldCheck,
  MessageSquare,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import { Customer } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  formatToman,
  CUSTOMER_TYPE_MAP,
  CustomerSegment,
  faDigits,
} from "@/lib/fa";

interface Props {
  customers: Customer[];
  searchQuery: string;
  onSelectCustomer?: (c: Customer) => void;
  onOpenNewCustomerModal?: () => void;
  onDeleteCustomer?: (id: string) => void;
  onAddOpportunityForCustomer?: (c: Customer) => void;
  onOpenInvoiceForCustomer?: (c: Customer) => void;
}

const HEALTH_FA: Record<string, { fa: string; cls: string; dot: string }> = {
  excellent: { fa: "عالی", cls: "text-emerald-700", dot: "bg-emerald-500" },
  good: { fa: "خوب", cls: "text-brand-700", dot: "bg-brand-600" },
  warning: { fa: "نیاز به توجه", cls: "text-amber-700", dot: "bg-amber-500" },
  critical: { fa: "در خطر ریزش", cls: "text-rose-600", dot: "bg-rose-500" },
};

export function CustomersView({
  customers,
  searchQuery,
  onSelectCustomer,
  onOpenNewCustomerModal,
  onDeleteCustomer,
  onAddOpportunityForCustomer,
  onOpenInvoiceForCustomer,
}: Props) {
  const [segmentFilter, setSegmentFilter] = useState<"all" | CustomerSegment>("all");
  const [selected360, setSelected360] = useState<Customer | null>(null);

  const filtered = React.useMemo(() => {
    const seen = new Set<string>();
    return customers.filter((c) => {
      if (!c?.id || seen.has(c.id)) return false;
      seen.add(c.id);

      const q = searchQuery.trim().toLowerCase();
      const matchQ =
        !q ||
        (
          c.name +
          (c.company || "") +
          (c.industry || "") +
          (c.location || "") +
          (c.nationalId || "") +
          (c.phone || "")
        )
          .toLowerCase()
          .includes(q);

      const matchSeg =
        segmentFilter === "all" ||
        c.segment === segmentFilter ||
        (!c.segment && segmentFilter === "customer");

      return matchQ && matchSeg;
    });
  }, [customers, searchQuery, segmentFilter]);

  const totalLtv = customers.reduce((s, c) => s + (c.ltv || 0), 0);
  const leadsCount = customers.filter((c) => c.segment === "lead").length;
  const activeCustomersCount = customers.filter(
    (c) => c.segment === "customer" || !c.segment
  ).length;

  return (
    <div className="space-y-6" dir="rtl">
      {/* 4 Summary Bento Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Wallet className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">ارزش کل سبد تجاری</div>
              <div className="text-xl font-black text-emerald-700 tracking-tight">
                {formatToman(totalLtv)}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>مجموع ارزش چرخه حیات (LTV)</span>
            <b className="font-bold text-emerald-700">فعال</b>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Building2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">مشتریان فعال</div>
              <div className="text-xl font-black text-slate-900 tracking-tight">
                {faDigits(activeCustomersCount)}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>حساب‌های دارای معامله</span>
            <b className="font-bold text-brand-700">قرارداد معتبر</b>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Users className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">سرنخ‌های اولیه</div>
              <div className="text-xl font-black text-slate-900 tracking-tight">
                {faDigits(leadsCount)}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>در حال ارزیابی اولیه</span>
            <b className="font-bold text-amber-700">پتانسیل بالا</b>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">شاخص سلامت روابط</div>
              <div className="text-xl font-black text-slate-900 tracking-tight">
                {faDigits(
                  Math.round(
                    customers.reduce((s, c) => s + c.healthScore, 0) /
                      (customers.length || 1)
                  )
                )}
                ٪
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>میانگین رضایت و تعامل</span>
            <b className="font-bold text-sky-700">پایدار</b>
          </div>
        </div>
      </div>

      {/* Segment Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-100/80 bg-white p-3 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSegmentFilter("all")}
            className={`rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
              segmentFilter === "all"
                ? "bg-brand-950 text-white shadow-sm"
                : "bg-brand-50/50 text-slate-600 hover:bg-brand-100/60"
            }`}
          >
            همه مخاطبان ({faDigits(customers.length)})
          </button>
          <button
            onClick={() => setSegmentFilter("customer")}
            className={`rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
              segmentFilter === "customer"
                ? "bg-brand-950 text-white shadow-sm"
                : "bg-brand-50/50 text-slate-600 hover:bg-brand-100/60"
            }`}
          >
            مشتریان فعال ({faDigits(activeCustomersCount)})
          </button>
          <button
            onClick={() => setSegmentFilter("lead")}
            className={`rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
              segmentFilter === "lead"
                ? "bg-brand-950 text-white shadow-sm"
                : "bg-brand-50/50 text-slate-600 hover:bg-brand-100/60"
            }`}
          >
            سرنخ‌ها ({faDigits(leadsCount)})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-bold">
            نمایش {faDigits(filtered.length)} مخاطب
          </span>
          {onOpenNewCustomerModal && (
            <Button
              size="sm"
              onClick={onOpenNewCustomerModal}
              className="h-9 gap-1.5 rounded-xl bg-brand-700 font-black text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" /> افزودن مشتری / سرنخ
            </Button>
          )}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const h = HEALTH_FA[c.healthStatus] || HEALTH_FA.good;
          const typeMeta =
            CUSTOMER_TYPE_MAP[c.customerType] || CUSTOMER_TYPE_MAP.company;
          const isCompany = c.customerType === "company";

          // Format WhatsApp URL
          const cleanPhone = (c.phone || "").replace(/[^0-9]/g, "");
          const waNumber = cleanPhone.startsWith("0")
            ? `98${cleanPhone.slice(1)}`
            : cleanPhone;

          return (
            <div
              key={c.id}
              className="flex flex-col rounded-3xl border border-brand-100/80 bg-white p-5 text-right shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
            >
              {/* Header: Company/Person & Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 font-black">
                    {isCompany ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate text-[14px] font-black text-slate-900">
                      {isCompany ? c.company : c.name}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 truncate font-bold">
                      <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                      {c.location || "ایران"}
                    </span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] shrink-0 font-black rounded-full px-2.5 py-0.5 ${typeMeta.badgeClass}`}
                >
                  {typeMeta.label}
                </Badge>
              </div>

              {/* Identity & Legal Data */}
              <div className="mt-4 space-y-2 border-t border-brand-100/60 pt-3 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">رابط اصلی:</span>
                  <b className="text-slate-900">{c.name}</b>
                </div>
                {c.nationalId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">
                      {isCompany ? "شناسه ملی:" : "کد ملی:"}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {faDigits(c.nationalId)}
                    </span>
                  </div>
                )}
                {c.economicCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">کد اقتصادی:</span>
                    <span className="text-xs font-bold text-slate-700">
                      {faDigits(c.economicCode)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">وضعیت سلامت:</span>
                  <span className={`flex items-center gap-1.5 text-xs font-black ${h.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${h.dot}`} />
                    {faDigits(c.healthScore)}٪ · {h.fa}
                  </span>
                </div>
              </div>

              {/* LTV & Deals Block */}
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-brand-100/60 bg-brand-50/30 p-3 text-[11.5px]">
                <div>
                  <div className="text-[10.5px] font-bold text-slate-400">ارزش کل سبد</div>
                  <b className="mt-0.5 block text-xs font-black text-emerald-700 tracking-tight">
                    {c.formattedLtv}
                  </b>
                </div>
                <div>
                  <div className="text-[10.5px] font-bold text-slate-400">بخش / وضعیت</div>
                  <Badge
                    variant="outline"
                    className="text-[10px] mt-0.5 font-black border-brand-200 bg-white"
                  >
                    {c.segment === "lead" ? "سرنخ اولیه" : "مشتری رسمی"}
                  </Badge>
                </div>
              </div>

              {/* Footer: Contacts & Menu */}
              <div className="mt-4 flex items-center justify-between border-t border-brand-100/60 pt-3">
                <span className="text-[11px] text-slate-400 font-bold">
                  آخرین تماس: {c.lastTouch}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelected360(c);
                      onSelectCustomer?.(c);
                    }}
                    className="h-8 rounded-xl bg-brand-50 text-brand-800 border border-brand-200 hover:bg-brand-700 hover:text-white font-black text-xs transition-colors cursor-pointer"
                  >
                    پروفایل ۳۶۰
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer text-slate-400 hover:text-slate-700 hover:bg-brand-50 rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 rounded-2xl border border-brand-100 bg-white p-1.5 text-right shadow-xl"
                    >
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-right text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                        onClick={() => onAddOpportunityForCustomer?.(c)}
                      >
                        <Plus className="h-3.5 w-3.5 text-brand-700 shrink-0" />
                        ایجاد معامله جدید
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-right text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                        onClick={() => onOpenInvoiceForCustomer?.(c)}
                      >
                        <Receipt className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        صدور پیش‌فاکتور
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-right text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                        onClick={() => {
                          if (c.phone) window.open(`tel:${c.phone}`);
                        }}
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        تماس تلفنی مستقیم
                      </DropdownMenuItem>
                      {waNumber && (
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer text-right text-xs font-bold rounded-xl py-2 px-2.5 text-emerald-700 hover:bg-emerald-50"
                          onClick={() =>
                            window.open(`https://wa.me/${waNumber}`, "_blank")
                          }
                        >
                          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                          ارسال پیام در واتساپ
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-brand-100/60 my-1" />
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-right text-xs font-bold rounded-xl py-2 px-2.5 text-rose-600 hover:bg-rose-50"
                        onClick={() => onDeleteCustomer?.(c.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 shrink-0" />
                        حذف مخاطب
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer 360 Slide-over Sheet */}
      <Sheet open={!!selected360} onOpenChange={(open) => !open && setSelected360(null)}>
        <SheetContent
          side="left"
          className="w-full bg-white p-6 sm:max-w-xl text-right overflow-y-auto"
          dir="rtl"
        >
          {selected360 && (
            <div className="space-y-5">
              <div className="border-b border-brand-100 pb-4">
                <span className="text-xs font-black text-brand-700">
                  پروفایل ۳۶۰ درجه مشتری
                </span>
                <SheetTitle className="text-xl font-black mt-1.5 text-slate-900">
                  {selected360.company || selected360.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 mt-1">
                  {selected360.customerType === "company"
                    ? "شخص حقوقی سازمانی"
                    : "شخص حقیقی"}{" "}
                  · شناسه ملی: {faDigits(selected360.nationalId || "ثبت نشده")}
                </SheetDescription>
              </div>

              {/* Fast Financials */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[11px] text-emerald-800 font-bold">
                    ارزش چرخه حیات (LTV)
                  </div>
                  <div className="text-lg font-black text-emerald-950 mt-1 tracking-tight">
                    {selected360.formattedLtv}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100">
                  <div className="text-[11px] text-brand-800 font-bold">
                    تعداد معاملات فعال
                  </div>
                  <div className="text-lg font-black text-brand-950 mt-1">
                    {faDigits(selected360.activeDealsCount)} معامله
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => onAddOpportunityForCustomer?.(selected360)}
                  className="flex-1 gap-1.5 rounded-xl bg-brand-700 font-black text-xs h-10 text-white hover:bg-brand-800"
                >
                  <Plus className="h-4 w-4" /> معامله جدید
                </Button>
                <Button
                  onClick={() => onOpenInvoiceForCustomer?.(selected360)}
                  variant="outline"
                  className="flex-1 gap-1.5 rounded-xl border-brand-200 font-black text-xs h-10 text-brand-800 hover:bg-brand-50"
                >
                  <Receipt className="h-4 w-4" /> صدور پیش‌فاکتور
                </Button>
              </div>

              {/* Contact Information */}
              <div className="space-y-2.5 p-4 rounded-2xl border border-brand-100/80 bg-brand-50/20 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">رابط اصلی:</span>
                  <b className="text-slate-900">{selected360.name}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">شماره تلفن:</span>
                  <a
                    href={`tel:${selected360.phone}`}
                    className="font-bold text-brand-700"
                  >
                    <bdi>{selected360.phone}</bdi>
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">ایمیل کاری:</span>
                  <a
                    href={`mailto:${selected360.email}`}
                    className="text-slate-700 font-bold"
                  >
                    {selected360.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">موقعیت و شهر:</span>
                  <span className="text-slate-700 font-bold">
                    {selected360.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">حوزه فعالیت:</span>
                  <span className="text-slate-700 font-bold">
                    {selected360.industry}
                  </span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
