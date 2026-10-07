import { faDigits } from "./money";

export const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const FA_WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
];

export function toValidDate(val: string | Date | null | undefined): Date | null {
  if (!val) return null;
  const d = typeof val === "string" ? new Date(val) : val;
  return isNaN(d.getTime()) ? null : d;
}

export function formatJalaliDate(
  val: string | Date | null | undefined,
  variant: "short" | "medium" | "full" | "timeOnly" = "medium"
): string {
  const d = toValidDate(val);
  if (!d) return "—";

  try {
    if (variant === "short") {
      // 1405/07/17
      const formatter = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        calendar: "persian",
      });
      return formatter.format(d);
    }

    if (variant === "timeOnly") {
      const formatter = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return formatter.format(d);
    }

    if (variant === "full") {
      // ۱۷ مهر ۱۴۰۵، ساعت ۱۸:۳۰
      const datePart = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "persian",
      }).format(d);

      const timePart = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);

      return `${datePart}، ساعت ${timePart}`;
    }

    // Default "medium": ۱۷ مهر ۱۴۰۵
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "persian",
    }).format(d);
  } catch {
    return d.toLocaleDateString("fa-IR");
  }
}

export function formatRelativeFa(val: string | Date | null | undefined): string {
  const d = toValidDate(val);
  if (!d) return "—";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // Future check
  if (diffMs < -60000) {
    const futureSec = Math.abs(diffSec);
    const futureMin = Math.floor(futureSec / 60);
    const futureHour = Math.floor(futureMin / 60);
    const futureDay = Math.floor(futureHour / 24);

    if (futureDay === 0) return "امروز";
    if (futureDay === 1) return "فردا";
    if (futureDay < 7) return `${faDigits(futureDay)} روز دیگر`;
    return formatJalaliDate(d, "medium");
  }

  if (diffSec < 45) return "همین الان";
  if (diffMin < 60) return `${faDigits(diffMin)} دقیقه پیش`;
  if (diffHour < 24) return `${faDigits(diffHour)} ساعت پیش`;
  if (diffDay === 1) return "دیروز";
  if (diffDay < 7) return `${faDigits(diffDay)} روز پیش`;
  if (diffDay < 30) {
    const weeks = Math.floor(diffDay / 7);
    return `${faDigits(weeks)} هفته پیش`;
  }

  return formatJalaliDate(d, "medium");
}

export function isOverdue(val: string | Date | null | undefined): boolean {
  const d = toValidDate(val);
  if (!d) return false;
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return d.getTime() < new Date().getTime();
}

/**
 * Returns Saturday 00:00:00 of the week for date d.
 * In JS: Sunday is 0, Monday is 1, ..., Saturday is 6.
 * For Saturday: diff is 0.
 * For Sunday (0): diff is -1 (previous day was Saturday).
 */
export function startOfFaWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sun, 6 is Sat
  const diffToSaturday = day === 6 ? 0 : (day + 1);
  d.setDate(d.getDate() - diffToSaturday);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* ------------------------------------------------------------------ */
/* Jalali <-> Gregorian conversion                                      */
/*                                                                     */
/* formatJalaliDate uses Intl, which can only go Gregorian -> Jalali. */
/* A calendar *picker* also needs the reverse, to turn the day a user */
/* taps into the YYYY-MM-DD string the rest of the app stores.          */
/* ------------------------------------------------------------------ */

export interface JalaliParts {
  jy: number;
  jm: number; // 1-12
  jd: number; // 1-31
}

export interface GregorianParts {
  gy: number;
  gm: number; // 1-12
  gd: number; // 1-31
}

/** Number of days in a Jalali month — Esfand is 30 in a leap year. */
export function isJalaliLeapYear(jy: number): boolean {
  return jalaliYearLength(jy) === 366;
}

/**
 * Length of a Jalali month. Esfand's length is derived from the measured
 * length of the year rather than a hardcoded leap table — a 33-year leap
 * table is easy to get subtly wrong (a table claiming 1401 is a leap year
 * would misreport Esfand by a day), whereas this cannot drift from Intl.
 */
export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // Months 1-11 are always 6×31 + 5×30 = 336 days.
  return jalaliYearLength(jy) - 336;
}

/** Days in a Jalali year: 365, or 366 when it is a leap year. */
export function jalaliYearLength(jy: number): number {
  const start = findJalaliNewYear(jy);
  const end = findJalaliNewYear(jy + 1);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

/** Gregorian Date -> Jalali year/month/day. */
export function toJalaliParts(val: string | Date | null | undefined): JalaliParts | null {
  const d = toValidDate(val);
  if (!d) return null;

  // Derive the Jalali day number by measuring from the Jalali new year,
  // which avoids depending on a hardcoded epoch table.
  try {
    const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(d);
    const num = (t: string) =>
      Number(parts.find((p) => p.type === t)?.value ?? NaN);
    const jy = num("year");
    const jm = num("month");
    const jd = num("day");
    if (!jy || !jm || !jd) return null;
    return { jy, jm, jd };
  } catch {
    return null;
  }
}

/** Jalali year/month/day -> Gregorian Date at local midnight. */
export function fromJalaliParts(jy: number, jm: number, jd: number): Date {
  // Walk forward from 1 Farvardin, accumulating the length of every month
  // that precedes the target month, then the day offset within it.
  const newYear = findJalaliNewYear(jy);
  const d = new Date(newYear.getTime());

  let remaining = jd - 1;
  const targetMonth = Math.min(12, Math.max(1, jm));
  for (let m = 1; m < targetMonth; m++) {
    remaining += jalaliMonthLength(jy, m);
  }

  d.setDate(d.getDate() + remaining);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Locates 1 Farvardin of `jy` by probing early March — the Persian new year
 * always falls on 20 or 21 March, so a short search finds it exactly.
 */
function findJalaliNewYear(jy: number): Date {
  const cached = newYearCache.get(jy);
  if (cached) return new Date(cached.getTime());

  // Jalali year 1405 begins in Gregorian 2026, i.e. Gregorian = jy + 621.
  // Nowruz always falls on 20 or 21 March, so seed 20 March and probe.
  const approx = new Date(jy + 621, 2, 20, 0, 0, 0, 0);
  let found = approx;
  for (let offset = -2; offset <= 2; offset++) {
    const candidate = new Date(approx.getTime());
    candidate.setDate(candidate.getDate() + offset);
    const parts = toJalaliParts(candidate);
    if (parts && parts.jy === jy && parts.jm === 1 && parts.jd === 1) {
      found = candidate;
      break;
    }
  }
  newYearCache.set(jy, found);
  return new Date(found.getTime());
}

const newYearCache = new Map<number, Date>();

/** Local-time YYYY-MM-DD. Avoids toISOString(), which is UTC. */
export function toLocalISODate(val: string | Date): string {
  const d = toValidDate(val) || new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function jalaliMonthKey(val: string | Date = new Date()): string {
  const d = toValidDate(val) || new Date();
  try {
    const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
    }).formatToParts(d);
    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    return `${year}-${month}`;
  } catch {
    return d.toISOString().slice(0, 7);
  }
}

export function jalaliMonthName(val: string | Date = new Date()): string {
  const d = toValidDate(val) || new Date();
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      calendar: "persian",
    }).format(d);
  } catch {
    return "";
  }
}
