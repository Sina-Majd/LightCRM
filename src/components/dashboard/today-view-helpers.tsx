"use client";

import { useEffect, useState } from "react";
import {
  Banknote,
  CalendarCheck,
  CreditCard,
  FileText,
  PhoneCall,
  TrendingUp,
} from "lucide-react";
import { toValidDate, faDigits } from "@/lib/fa";

/** Days after today for "within the last N days" queries (negative = past). */
export function daysSince(dateStr: string | null | undefined): number | null {
  const d = daysUntil(dateStr);
  return d === null ? null : -d;
}

/* ------------------------------------------------------------------ */
/* Time bucketing — gives a bare total the "direction" dashboards need */
/* ------------------------------------------------------------------ */

export interface Segment {
  key: string;
  label: string;
  amount: number;
  count: number;
  barClass: string;
  textClass: string;
}

export interface BucketDef {
  key: string;
  label: string;
  /** Receives days-until-due; negative means overdue. */
  test: (days: number) => boolean;
  barClass: string;
  textClass: string;
}

export interface DatedAmount {
  date: string | null | undefined;
  amount: number;
}

/**
 * Splits dated amounts into ordered segments. Rows without a parseable date
 * are dropped rather than silently landing in the first bucket.
 */
export function bucketize(
  rows: DatedAmount[],
  defs: BucketDef[]
): Segment[] {
  const out: Segment[] = defs.map((d) => ({
    key: d.key,
    label: d.label,
    amount: 0,
    count: 0,
    barClass: d.barClass,
    textClass: d.textClass,
  }));

  for (const row of rows) {
    const days = daysUntil(row.date);
    if (days === null) continue;
    const idx = defs.findIndex((d) => d.test(days));
    // No bucket matches (a "later than N days" catch-all is expected to).
    if (idx === -1) continue;
    out[idx].amount += row.amount;
    out[idx].count += 1;
  }

  return out;
}

/** How much of the total each segment represents, 0-100, for bar widths. */
export function segmentPercents(segments: Segment[]): number[] {
  const total = segments.reduce((s, x) => s + x.amount, 0);
  if (total <= 0) return segments.map(() => 0);
  return segments.map((s) => Math.max(0, (s.amount / total) * 100));
}

/** Local-time YYYY-MM-DD. Avoids toISOString(), which shifts the day boundary in UTC+3:30. */
export function localDateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Days from today (local midnight) to `dateStr`. Negative = overdue. */
export function daysUntil(dateStr: string | null | undefined): number | null {
  const d = toValidDate(dateStr);
  if (!d) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(d);
  target.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getChequeDueNote(
  dueDateStr: string
): { label: string; isUrgent: boolean } {
  const diffDays = daysUntil(dueDateStr);
  if (diffDays === null) return { label: "بدون تاریخ", isUrgent: false };
  if (diffDays < 0)
    return { label: `معوق (${faDigits(Math.abs(diffDays))} روز)`, isUrgent: true };
  if (diffDays === 0) return { label: "سررسید امروز", isUrgent: true };
  if (diffDays === 1) return { label: "سررسید فردا", isUrgent: true };
  return { label: `${faDigits(diffDays)} روز تا سررسید`, isUrgent: false };
}

/** Eases an integer toward `target`. Honours prefers-reduced-motion. */
export function useCountUp(target: number, durationMs = 750): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let frame = 0;

    // Every setState stays inside an async callback — a synchronous one in the
    // effect body triggers a cascading render.
    if (reduce || target === 0) {
      frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

export function getActivityIcon(kind: string) {
  switch (kind) {
    case "call":
      return <PhoneCall className="h-3.5 w-3.5 text-blue-600" />;
    case "meeting":
      return <CalendarCheck className="h-3.5 w-3.5 text-purple-600" />;
    case "payment":
      return <CreditCard className="h-3.5 w-3.5 text-emerald-600" />;
    case "stage_change":
      return <TrendingUp className="h-3.5 w-3.5 text-brand-600" />;
    case "cheque_status":
      return <Banknote className="h-3.5 w-3.5 text-amber-600" />;
    case "note":
    default:
      return <FileText className="h-3.5 w-3.5 text-slate-500" />;
  }
}