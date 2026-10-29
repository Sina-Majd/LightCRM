"use client";

import { useAsyncAction, type AsyncAction } from "@/lib/use-async-action";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Send,
  FileText,
  User,
  Trash2,
  CalendarCheck,
  AlertCircle,
  PhoneCall,
  Clock,
  X,
} from "lucide-react";
import { normalizePhone, whatsappNumber } from "@/lib/fa/phone";
import type { Deal, PipelineStage } from "@/lib/crm/types";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import {
  getDealNextActionState,
  CallResult,
  CALL_RESULT_MAP,
  faDigits,
} from "@/lib/fa";
import { toast } from "sonner";

interface Props {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  stages: PipelineStage[];
  onStageChange?: AsyncAction<[string, string]>;
  onDeleteDeal?: AsyncAction<[string]>;
  onUpdateNextAction?: AsyncAction<[string, string | null, string | null]>;
  onLogCall?: AsyncAction<[string, CallResult, string]>;
  onAddNote?: AsyncAction<[string, string]>;
}

/** Call outcomes — one segmented row, dots carry the status. */
const CALL_OUTCOMES: { id: CallResult; label: string; dot: string }[] = [
  { id: "connected", label: "صحبت شد", dot: "bg-emerald-500" },
  { id: "busy", label: "اشغال بود", dot: "bg-amber-500" },
  { id: "no_answer", label: "بی‌پاسخ", dot: "bg-rose-500" },
  { id: "follow_up_scheduled", label: "پیگیری بعدی", dot: "bg-brand-600" },
];

/**
 * Design rules for this panel:
 *   - RTL throughout: spacing uses logical properties (ps/pe/ms/me) so the
 *     panel mirrors correctly, and "forward" chevrons point left.
 *   - Solid colours only. Reduced opacity thins the strokes of Persian glyphs.
 *   - One radius scale: surfaces rounded-2xl, interactive rounded-xl, pills full.
 *   - Colour signals state; type carries hierarchy.
 */
export function DealDetailSheet({
  deal,
  isOpen,
  onClose,
  stages,
  onStageChange,
  onDeleteDeal,
  onUpdateNextAction,
  onLogCall,
  onAddNote,
}: Props) {
  const { isPending, run } = useAsyncAction();
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(false);

  const [nextActionTitle, setNextActionTitle] = useState("");
  const [nextActionHours, setNextActionHours] = useState("24");
  const [isEditingAction, setIsEditingAction] = useState(false);

  if (!deal) return null;

  const nextActionState = getDealNextActionState(
    deal.nextActionDue,
    deal.nextActionTitle
  );
  const isStale = nextActionState.isStale;
  const stageIdx = stages.findIndex((s) => s.id === deal.stageId);
  const stage = stages[stageIdx];

  const handleSaveNextAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextActionTitle.trim()) {
      toast.error("عنوان اقدام بعدی نمی‌تواند خالی باشد.");
      return;
    }
    const hours = parseInt(nextActionHours, 10) || 24;
    const dueDate = new Date(Date.now() + hours * 3600 * 1000).toISOString();
    if (!onUpdateNextAction || !await run(() => onUpdateNextAction(deal.id, nextActionTitle.trim(), dueDate))) return;
    toast.success("اقدام بعدی ثبت شد.");
    setIsEditingAction(false);
    setNextActionTitle("");
  };

  const handleCallResult = async (res: CallResult) => {
    if (!onLogCall || !await run(() => onLogCall(deal.id, res, `تماس ثبت‌شده برای ${deal.title}`))) return;
    toast.success(`نتیجه تماس: ${CALL_RESULT_MAP[res].label}`);
    if (res === "follow_up_scheduled" || res === "connected") {
      setIsEditingAction(true);
      setNextActionTitle(`پیگیری مذاکره با ${deal.contact}`);
    }
  };

  const waNumber = whatsappNumber(deal.phone || "");

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="left"
        showCloseButton={false}
        dir="rtl"
        className="flex w-full flex-col gap-0 overflow-y-auto border-0 bg-white p-0 text-right sm:max-w-2xl"
      >
        {/* ===== Dark identity header. Own close button so it stays legible
                on the dark surface instead of floating over it. ===== */}
        <div className="sticky top-0 z-10 bg-brand-900 px-4 pb-5 pt-4 text-white sm:px-5">
          {/* Row 1 — eyebrow alone on the start side, close button alone in
              the outer corner so it never crowds the title. */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10.5px] font-bold text-brand-300">
              پرونده جامع معامله
            </span>
            <SheetClose
              aria-label="بستن"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-brand-700 bg-brand-800 text-brand-200 transition-colors hover:bg-brand-700 hover:text-white"
            >
              <X className="size-4" />
            </SheetClose>
          </div>

          <SheetTitle className="mt-2 text-[17px] font-black leading-7 text-white">
            {deal.title}
          </SheetTitle>

          <SheetDescription className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11.5px] font-bold text-brand-200">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5 shrink-0 text-brand-300" />
              <span className="text-white">{deal.company}</span>
            </span>
            <span className="text-brand-500">·</span>
            <span>{deal.contact}</span>
            {stage && (
              <span className="flex items-center gap-1.5 rounded-full border border-brand-700 bg-brand-800 px-2 py-0.5 text-[10px] font-black text-white">
                <span className="tabular-nums text-brand-300">
                  {faDigits(Math.max(1, stageIdx + 1))}/{faDigits(stages.length)}
                </span>
                {stage.title}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-full border border-brand-700 bg-brand-800 px-2 py-0.5 text-[10px] font-black text-white">
              <Clock className="size-3 text-brand-300" />
              {faDigits(deal.daysInStage)} روز در این مرحله
            </span>
          </SheetDescription>

          {/* Three figures on one row, each with its own label */}
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <dt className="text-[10.5px] font-bold text-brand-300">ارزش معامله</dt>
              <dd className="mt-0.5 text-[16px] font-black tabular-nums text-glow sm:text-[19px]">
                {deal.formattedValue}
              </dd>
            </div>
            <div>
              <dt className="text-[10.5px] font-bold text-brand-300">احتمال موفقیت</dt>
              <dd className="mt-0.5 text-[16px] font-black tabular-nums text-white sm:text-[19px]">
                {faDigits(deal.probability)}٪
              </dd>
            </div>
          </dl>

          {/* Probability bar — spans the header, one glance */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-brand-800">
            <div
              className="h-full rounded-full bg-glow"
              style={{ width: `${deal.probability}%` }}
            />
          </div>
        </div>

        {/* ===== Scrollable body ===== */}
        <div className="flex-1 space-y-4 p-5">
          {/* ---- Primary zone: next action + call logging ---- */}
          <section
            className={`rounded-2xl border-2 p-4 ${
              isStale ? "border-rose-200 bg-rose-50" : "border-brand-200 bg-brand-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                    isStale ? "bg-rose-100 text-rose-700" : "bg-brand-100 text-brand-700"
                  }`}
                >
                  {isStale ? (
                    <AlertCircle className="size-5" />
                  ) : (
                    <CalendarCheck className="size-5" />
                  )}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-black text-slate-900">اقدام بعدی</h3>
                  <p
                    className={`mt-0.5 text-[11.5px] font-bold ${
                      isStale ? "text-rose-700" : "text-brand-800"
                    }`}
                  >
                    {nextActionState.label}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingAction(!isEditingAction)}
                className="h-8 shrink-0 cursor-pointer rounded-xl border-slate-300 bg-white px-3 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
              >
                {isEditingAction ? "انصراف" : "تعیین / تغییر"}
              </Button>
            </div>

            {isEditingAction && (
              <form
                onSubmit={handleSaveNextAction}
                className="mt-3 space-y-2 border-t border-brand-200 pt-3"
              >
                <Input
                  value={nextActionTitle}
                  onChange={(e) => setNextActionTitle(e.target.value)}
                  placeholder="مثال: تماس تلفنی جهت تایید پیش‌فاکتور…"
                  className="h-10 rounded-xl border-slate-200 bg-white text-xs"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select value={nextActionHours} onValueChange={setNextActionHours}>
                      <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 bg-white">
                        <SelectItem value="2">۲ ساعت بعد</SelectItem>
                        <SelectItem value="24">فردا (۲۴ ساعت)</SelectItem>
                        <SelectItem value="48">۲ روز بعد</SelectItem>
                        <SelectItem value="72">۳ روز بعد</SelectItem>
                        <SelectItem value="168">هفته آینده</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit" disabled={isPending}
                    size="sm"
                    className="h-10 shrink-0 cursor-pointer rounded-xl bg-brand-700 px-4 text-xs font-black text-white hover:bg-brand-800"
                  >
                    ذخیره
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-3 border-t border-brand-200 pt-3">
              <div className="mb-2 flex items-center gap-1.5 text-[11.5px] font-black text-slate-800">
                <PhoneCall className="size-3.5 text-brand-700" />
                ثبت نتیجه تماس
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {CALL_OUTCOMES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCallResult(c.id)}
                    className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                  >
                    <span className={`size-1.5 rounded-full ${c.dot}`} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ---- Supporting panels ---- */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Stage selector */}
            <section className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-[12.5px] font-black text-slate-900">مرحله پایپ‌لاین</h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {stages.map((s) => {
                  const sel = s.id === deal.stageId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => !sel && onStageChange?.(deal.id, s.id)}
                      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                        sel
                          ? "border-brand-700 bg-brand-700 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                      }`}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-slate-200 p-4">
              <h3 className="flex items-center gap-1.5 text-[12.5px] font-black text-slate-900">
                <User className="size-3.5 text-brand-700" />
                ارتباط با مخاطب
              </h3>
              <dl className="mt-2.5 space-y-2 text-[11.5px]">
                <div className="flex items-center justify-between gap-2">
                  <dt className="shrink-0 font-bold text-slate-500">تلفن</dt>
                  <dd className="flex min-w-0 items-center gap-1.5">
                    <a
                      href={`tel:${normalizePhone(deal.phone)}`}
                      className="flex items-center gap-1 font-black text-brand-700 hover:underline"
                    >
                      <Phone className="size-3 shrink-0" />
                      {/* bdi isolates the number from the RTL bidi algorithm
                          so "+1 (555) 000-0000" does not get reordered. */}
                      <bdi>{deal.phone}</bdi>
                    </a>
                    {waNumber && (
                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 hover:bg-emerald-100"
                      >
                        واتساپ
                      </a>
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="shrink-0 font-bold text-slate-500">ایمیل</dt>
                  <dd className="min-w-0">
                    <a
                      href={`mailto:${deal.email}`}
                      className="flex items-center gap-1 font-bold text-slate-700 hover:underline"
                    >
                      <Mail className="size-3 shrink-0" />
                      <bdi className="min-w-0 truncate">{deal.email}</bdi>
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="shrink-0 font-bold text-slate-500">آخرین فعالیت</dt>
                  <dd className="font-black text-slate-700">
                    {/* lastActivity is already a human-readable Persian
                        phrase (e.g. "۲ ساعت پیش"), not a date string —
                        running it through a date formatter yields "—". */}
                    {deal.lastActivity || "—"}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          {/* ---- Notes ---- */}
          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="flex items-center gap-1.5 text-[12.5px] font-black text-slate-900">
              <FileText className="size-3.5 text-brand-600" />
              یادداشت‌های مذاکره
            </h3>

            <p className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[12px] leading-6 text-slate-700">
              {deal.notes?.trim() || "توضیحاتی ثبت نشده است."}
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!note.trim() || !onAddNote) return;
                if (!await run(() => onAddNote(deal.id, note.trim()))) return;
                setNote("");
                toast.success("یادداشت اضافه شد.");
              }}
              className="mt-2.5 flex gap-2"
            >
              <Input
                aria-label="یادداشت مذاکره"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="یادداشت تماس یا توافقات مذاکره…"
                className="h-10 rounded-xl border-slate-200 bg-white text-xs"
              />
              <Button
                type="submit" disabled={isPending || !onAddNote}
                aria-label="ثبت یادداشت"
                className="size-10 shrink-0 cursor-pointer rounded-xl bg-brand-700 text-white hover:bg-brand-800"
              >
                <Send className="size-4" />
              </Button>
            </form>

          </section>
        </div>

        {/* ===== Footer ===== */}
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-5 py-3">
          {onDeleteDeal ? (
            <Button
              variant="outline"
              onClick={() => setConfirm(true)}
              className="h-9 cursor-pointer items-center gap-1.5 rounded-xl border-slate-200 px-3 text-[11px] font-bold text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="size-3.5" />
              حذف
            </Button>
          ) : (
            <span />
          )}

          {deal.stageId !== "stage-won" ? (
            <Button
              onClick={() => onStageChange?.(deal.id, "stage-won")}
              className="h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 text-[11.5px] font-black text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="size-4" />
              موفق و بسته شد
            </Button>
          ) : (
            <Badge className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 font-black text-emerald-700">
              موفق و بسته شد ✓
            </Badge>
          )}
        </div>
      </SheetContent>

      <ConfirmDeleteDialog
        open={confirm}
        onOpenChange={setConfirm}
        onConfirm={async () => {
          if (!onDeleteDeal || await onDeleteDeal(deal.id) === false) return false;
          setConfirm(false);
          onClose();
        }}
        title="حذف معامله"
        description={`آیا از حذف معامله «${deal.title}» مطمئن هستید؟`}
      />
    </Sheet>
  );
}
