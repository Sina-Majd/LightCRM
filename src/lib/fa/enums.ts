export type CustomerType = "individual" | "company";
export type CustomerSegment = "lead" | "customer";

export const CUSTOMER_TYPE_MAP: Record<CustomerType, { label: string; badgeClass: string }> = {
  individual: {
    label: "شخص حقیقی",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200 font-black",
  },
  company: {
    label: "شخص حقوقی (شرکت)",
    badgeClass: "bg-brand-50 text-brand-900 border-brand-200 font-black",
  },
};

export const CUSTOMER_SEGMENT_MAP: Record<CustomerSegment, string> = {
  lead: "سرنخ",
  customer: "مشتری معامله‌دار",
};

export type CallResult =
  | "connected"
  | "busy"
  | "no_answer"
  | "wrong_number"
  | "follow_up_scheduled";

export const CALL_RESULT_MAP: Record<CallResult, { label: string; colorClass: string }> = {
  connected: {
    label: "صحبت شد / پاسخ داد",
    colorClass: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  busy: {
    label: "اشغال بود",
    colorClass: "text-amber-600 bg-amber-50 border-amber-200",
  },
  no_answer: {
    label: "بی‌پاسخ / در دسترس نبود",
    colorClass: "text-rose-600 bg-rose-50 border-rose-200",
  },
  wrong_number: {
    label: "شماره اشتباه / واگذارشده",
    colorClass: "text-slate-600 bg-slate-50 border-slate-200",
  },
  follow_up_scheduled: {
    label: "تنظیم پیگیری مجدد",
    colorClass: "text-blue-600 bg-blue-50 border-blue-200",
  },
};

export const ACTIVITY_KIND_MAP: Record<string, { label: string; icon: string }> = {
  call: { label: "تماس تلفنی", icon: "Phone" },
  meeting: { label: "جلسه حضوری / آنلاین", icon: "Calendar" },
  note: { label: "یادداشت پیگیری", icon: "FileText" },
  email: { label: "مکاتبه / ایمیل", icon: "Mail" },
  stage_change: { label: "تغییر مرحله معامله", icon: "TrendingUp" },
  payment: { label: "ثبت دریافت مالی", icon: "CreditCard" },
  cheque_status: { label: "تغییر وضعیت چک", icon: "Receipt" },
};

export const DEAL_PRIORITY_MAP: Record<string, { label: string; colorClass: string }> = {
  urgent: { label: "فوری و حیاتی", colorClass: "text-rose-800 bg-rose-50 border-rose-200 font-black" },
  high: { label: "بالا", colorClass: "text-amber-900 bg-amber-50 border-amber-200 font-black" },
  medium: { label: "عادی", colorClass: "text-brand-900 bg-brand-50 border-brand-200 font-black" },
  low: { label: "پایین", colorClass: "text-slate-700 bg-slate-100 border-slate-200 font-black" },
};
