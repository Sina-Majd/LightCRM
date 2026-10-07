"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronRight, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { faDigits } from "@/lib/fa";
import { useIsClient } from "@/lib/hooks";
import {
  FA_WEEKDAYS,
  JALALI_MONTH_NAMES,
  toJalaliParts,
  fromJalaliParts,
  jalaliMonthLength,
  toValidDate,
} from "@/lib/fa/jalali";

interface Props {
  /** Local YYYY-MM-DD. */
  value: string;
  onChange: (isoDate: string) => void;
  minDate?: string;
  id?: string;
  placeholder?: string;
  className?: string;
}

const WEEKDAY_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const GRID_CELLS = 42; // Always 6 rows — a constant panel height means the
// picker never grows or shrinks between months and never shifts the
// layout around when the user pages through the year.

/** Formats a Date as "۲۹ مهر ۱۴۰۵". */
function formatJalaliShort(d: Date | null): string {
  if (!d) return "";
  const p = toJalaliParts(d);
  if (!p) return "";
  return `${faDigits(p.jd)} ${JALALI_MONTH_NAMES[p.jm - 1]} ${faDigits(p.jy)}`;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function JalaliDatePicker({
  value,
  onChange,
  minDate,
  id,
  placeholder = "انتخاب تاریخ",
  className,
}: Props) {
  const selected = toValidDate(value);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState(() => {
    const p = toJalaliParts(selected ?? new Date());
    return { jy: p?.jy ?? 0, jm: p?.jm ?? 1 };
  });

  const isClient = useIsClient();

  const selectedParts = useMemo(() => toJalaliParts(selected), [selected]);
  const todayParts = useMemo(() => toJalaliParts(new Date()), []);

  const cells = useMemo(() => {
    if (!view.jy) return [];
    const monthLen = jalaliMonthLength(view.jy, view.jm);
    const first = fromJalaliParts(view.jy, view.jm, 1);
    // Saturday-first index: getDay() is 0=Sun..6=Sat.
    const lead = (first.getDay() + 1) % 7;

    const out: Array<{ date: Date; jd: number } | null> = Array.from(
      { length: lead },
      () => null
    );
    for (let i = 0; i < monthLen; i++) {
      out.push({ date: fromJalaliParts(view.jy, view.jm, i + 1), jd: i + 1 });
    }
    while (out.length < GRID_CELLS) out.push(null);

    return out;
  }, [view]);

  /* ---------------------------------------------------------------- */
  /* Portal + positioning                                              */
  /*                                                                    */
  /* The panel is portalled to <body> with fixed positioning. Rendered  */
  /* in place it was clipped by the dialog's scroll container and its  */
  /* sticky header — a portal is the only way to guarantee it is never  */
  /* cut off, whatever the form around it happens to be doing.          */
  /* ---------------------------------------------------------------- */

  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [dropUp, setDropUp] = useState(false);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger) return;

    const tr = trigger.getBoundingClientRect();
    const ph = panel?.offsetHeight ?? 330;
    const pw = panel?.offsetWidth ?? 304;
    const GAP = 8;
    const MARGIN = 8;

    // Flip up when there is not enough room underneath.
    const spaceBelow = window.innerHeight - tr.bottom - GAP - MARGIN;
    setDropUp(spaceBelow < ph);

    const top = dropUp
      ? Math.max(MARGIN, tr.top - ph - GAP)
      : Math.min(window.innerHeight - ph - MARGIN, tr.bottom + GAP);

    // Align the panel's inline-start edge with the trigger, then keep it
    // inside the viewport.
    const rawLeft = tr.right - pw;
    const left = Math.min(
      Math.max(MARGIN, rawLeft),
      Math.max(MARGIN, window.innerWidth - pw - MARGIN)
    );

    setPos({ top, left });
  }, [dropUp]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  /* Dismiss on outside click / Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    // Capture phase: Radix's own outside-press handling runs on the
    // document too, and we want to close before it tears the dialog down.
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown, true);
    };
  }, [open]);

  const shiftMonth = (delta: number) => {
    setView((v) => {
      let { jy, jm } = v;
      jm += delta;
      if (jm > 12) {
        jm = 1;
        jy += 1;
      }
      if (jm < 1) {
        jm = 12;
        jy -= 1;
      }
      return { jy, jm };
    });
  };

  const pick = (d: Date) => {
    onChange(toISO(d));
    setOpen(false);
  };

  const isDisabled = (d: Date) => {
    if (!minDate) return false;
    const min = toValidDate(minDate);
    if (!min) return false;
    min.setHours(0, 0, 0, 0);
    return d.getTime() < min.getTime();
  };

  const triggerLabel = selected ? formatJalaliShort(selected) : placeholder;

  const panel = open && isClient && pos && (
    <div
      ref={panelRef}
      role="dialog"
      data-jalali-panel=""
      aria-label="انتخاب تاریخ شمسی"
      style={{ top: pos.top, left: pos.left }}
      className="pointer-events-auto fixed z-[100] w-[19rem] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
    >
      {/* Month navigation — in RTL "previous" sits on the right. */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="ماه قبل"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
        >
          <ChevronRight className="size-4" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <div className="truncate text-[13px] font-black text-slate-900">
            {JALALI_MONTH_NAMES[view.jm - 1]}
          </div>
          <div className="text-[11px] font-bold text-slate-500">{faDigits(view.jy)}</div>
        </div>

        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="ماه بعد"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>

      {/* Weekday header — شنبه first, rightmost in RTL */}
      <div className="grid grid-cols-7 gap-1 pb-1">
        {WEEKDAY_SHORT.map((d, i) => (
          <div
            key={d + i}
            className="py-1 text-center text-[11px] font-black text-slate-500"
            title={FA_WEEKDAYS[i]}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid — always 42 cells, so height is constant */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`pad-${i}`} className="aspect-square" />;
          const iso = toISO(cell.date);
          const isSelected =
            selectedParts?.jy === view.jy &&
            selectedParts?.jm === view.jm &&
            selectedParts?.jd === cell.jd;
          const isToday =
            todayParts?.jy === view.jy &&
            todayParts?.jm === view.jm &&
            todayParts?.jd === cell.jd;
          const disabled = isDisabled(cell.date);

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => pick(cell.date)}
              aria-label={formatJalaliShort(cell.date)}
              aria-current={isToday ? "date" : undefined}
              className={cn(
                "flex aspect-square cursor-pointer items-center justify-center rounded-lg text-[12.5px] font-bold transition-colors",
                disabled && "cursor-not-allowed text-slate-300 hover:bg-transparent",
                !disabled && !isSelected && "text-slate-700 hover:bg-brand-50 hover:text-brand-800",
                isToday && !isSelected && "border border-brand-300 text-brand-800",
                isSelected && "bg-brand-700 text-white"
              )}
            >
              {faDigits(cell.jd)}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            if (!isDisabled(now)) pick(now);
          }}
          className="cursor-pointer rounded-lg px-2 py-1 text-[11.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
        >
          امروز
        </button>
        <button
          type="button"
          onClick={() => {
            const d = new Date();
            d.setDate(d.getDate() + 14);
            if (!isDisabled(d)) pick(d);
          }}
          className="cursor-pointer rounded-lg px-2 py-1 text-[11.5px] font-bold text-brand-700 transition-colors hover:bg-brand-50"
        >
          دو هفته دیگر
        </button>
      </div>
    </div>
  );

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        ref={triggerRef}
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-[13px] font-bold transition-colors",
          selected
            ? "border-slate-300 text-slate-900 hover:border-brand-400"
            : "border-slate-300 text-slate-500 hover:border-brand-400"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-brand-600" />
          <span className="truncate">{triggerLabel}</span>
        </span>
        {selected && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="پاک کردن تاریخ"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-3.5" />
          </span>
        )}
      </button>

      {panel ? createPortal(panel, document.body) : null}
    </div>
  );
}