import { toLocalISODate, toValidDate } from "../fa/jalali";
import type { CRMTask } from "./types";

export function taskDueCategory(dueDate: string, now = new Date()): CRMTask["dueCategory"] {
  const due = toValidDate(dueDate);
  if (!due) return "upcoming";
  const day = toLocalISODate(due);
  const today = toLocalISODate(now);
  return day < today ? "overdue" : day === today ? "today" : "upcoming";
}
