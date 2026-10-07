import { faDigits, enDigits } from "./money";

export type ChequeStatus = "in_hand" | "deposited" | "cleared" | "bounced";

export interface ChequeStatusMeta {
  label: string;
  badgeClass: string;
  dotColor: string;
}

export const CHEQUE_STATUS_MAP: Record<ChequeStatus, ChequeStatusMeta> = {
  in_hand: {
    label: "نزد صندوق (دریافت شده)",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50",
    dotColor: "bg-amber-500",
  },
  deposited: {
    label: "واگذار به بانک",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50",
    dotColor: "bg-blue-500",
  },
  cleared: {
    label: "وصول شده",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50",
    dotColor: "bg-emerald-500",
  },
  bounced: {
    label: "برگشت خورده",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50",
    dotColor: "bg-rose-500",
  },
};

export const IRANIAN_BANKS = [
  "بانک ملی ایران",
  "بانک ملت",
  "بانک صادرات ایران",
  "بانک سپه",
  "بانک تجارت",
  "بانک پاسارگاد",
  "بانک سامان",
  "بانک پارسیان",
  "بانک آینده",
  "بانک شهر",
  "بانک اقتصاد نوین",
  "بانک رفاه کارگران",
  "بانک کشاورزی",
  "بانک مسکن",
  "بانک قرض‌الحسنه رسالت",
  "بانک قرض‌الحسنه مهر ایران",
  "بانک کارآفرین",
  "بانک خاورمیانه",
  "پست بانک ایران",
];

export function validateSayadNumber(raw: string): boolean {
  if (!raw) return false;
  const cleaned = enDigits(raw).replace(/[^0-9]/g, "");
  return cleaned.length === 16;
}

export function formatSayadNumber(raw: string): string {
  if (!raw) return "";
  const cleaned = enDigits(raw).replace(/[^0-9]/g, "");
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1-");
  return faDigits(formatted);
}

export function getChequeStatusMeta(status: string): ChequeStatusMeta {
  return CHEQUE_STATUS_MAP[status as ChequeStatus] ?? CHEQUE_STATUS_MAP.in_hand;
}
