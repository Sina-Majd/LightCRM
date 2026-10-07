import { formatRelativeFa, toValidDate } from "./jalali";

export type NextActionAlert = "stale" | "overdue" | "today" | "future";

export interface NextActionState {
  isStale: boolean;
  isOverdue: boolean;
  alertType: NextActionAlert;
  label: string;
  badgeClass: string;
}

export function getDealNextActionState(
  nextActionDue: string | Date | null | undefined,
  nextActionTitle?: string | null
): NextActionState {
  if (!nextActionDue) {
    return {
      isStale: true,
      isOverdue: false,
      alertType: "stale",
      label: "معامله رهاشده (فاقد اقدام بعدی)",
      badgeClass:
        "bg-rose-50 text-rose-800 border-rose-200 font-black",
    };
  }

  const d = toValidDate(nextActionDue);
  if (!d) {
    return {
      isStale: true,
      isOverdue: false,
      alertType: "stale",
      label: "معامله رهاشده (فاقد اقدام بعدی)",
      badgeClass:
        "bg-rose-50 text-rose-800 border-rose-200 font-black",
    };
  }

  const now = new Date();
  const title = nextActionTitle?.trim() ? ` «${nextActionTitle.trim()}»` : "";

  if (d.getTime() < now.getTime()) {
    return {
      isStale: false,
      isOverdue: true,
      alertType: "overdue",
      label: `پیگیری معوق${title} (${formatRelativeFa(d)})`,
      badgeClass:
        "bg-amber-50 text-amber-900 border-amber-200 font-black",
    };
  }

  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (isToday) {
    return {
      isStale: false,
      isOverdue: false,
      alertType: "today",
      label: `اقدام امروز${title}`,
      badgeClass:
        "bg-emerald-50 text-emerald-900 border-emerald-200 font-black",
    };
  }

  return {
    isStale: false,
    isOverdue: false,
    alertType: "future",
    label: `پیگیری بعدی${title}: ${formatRelativeFa(d)}`,
    badgeClass:
      "bg-brand-50 text-brand-900 border-brand-200 font-black",
  };
}
