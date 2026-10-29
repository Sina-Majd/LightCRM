"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JalaliDatePicker } from "@/components/ui/jalali-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Banknote, CheckCircle2, Building2, Hash, User } from "lucide-react";
import type { Customer, Cheque } from "@/lib/crm/types";
import {
  IRANIAN_BANKS,
  parseTomanInput,
  formatToman,
  ChequeStatus,
  enDigits,
  faDigits,
} from "@/lib/fa";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  defaultCustomer?: Customer | null;
  onCreateCheque: (cheque: Partial<Cheque>) => void;
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 text-[12.5px] font-bold text-slate-700"
    >
      {children}
    </Label>
  );
}

export function ChequeRegisterDialog({
  isOpen,
  onClose,
  customers,
  defaultCustomer,
  onCreateCheque,
}: Props) {
  const [customerId, setCustomerId] = useState<string>(
    defaultCustomer?.id || customers[0]?.id || ""
  );
  const [sayadNumber, setSayadNumber] = useState("");
  const [bankName, setBankName] = useState(IRANIAN_BANKS[0]);
  const [branchName, setBranchName] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [amountToman, setAmountToman] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  });
  const [status] = useState<ChequeStatus>("in_hand");

  const cleanSayad = enDigits(sayadNumber).replace(/[^0-9]/g, "");
  const isValidSayad = cleanSayad.length === 16;
  const rialAmount = parseTomanInput(amountToman);
  const canSubmit = isValidSayad && rialAmount > 0 && Boolean(dueDate);

  const reset = () => {
    setSayadNumber("");
    setAmountToman("");
    setBranchName("");
    setAccountOwner("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSayad) {
      toast.error("شناسه صیادی باید دقیقاً ۱۶ رقم عددی باشد.");
      return;
    }
    if (rialAmount <= 0) {
      toast.error("مبلغ چک باید بیشتر از صفر باشد.");
      return;
    }
    if (!dueDate) {
      toast.error("تاریخ سررسید را انتخاب کنید.");
      return;
    }

    const customer = customers.find((c) => c.id === customerId);

    onCreateCheque({
      customerId: customer?.id || null,
      customerName: customer?.name || customer?.company || "مشتری عمومی",
      sayadNumber: cleanSayad,
      bankName,
      branchName,
      accountOwner: accountOwner.trim() || customer?.name || "صاحب حساب",
      amount: rialAmount,
      dueDate,
      status,
      statusUpdatedAt: new Date().toISOString(),
    });

    toast.success("چک صیادی با موفقیت در دفتر چک ثبت گردید.");
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        dir="rtl"
        className="flex max-h-[94vh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-right sm:max-w-2xl"
      >
        <DialogHeader className="shrink-0 border-b border-slate-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-3 text-[15px] font-black text-slate-900">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Banknote className="size-5" />
            </span>
            ثبت چک صیادی
          </DialogTitle>
          <DialogDescription className="text-[12px] font-medium text-slate-500">
            مشخصات شناسه ۱۶ رقمی صیاد، بانک و سررسید چک را وارد نمایید.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Sayad ID — the field that must be exactly 16 digits. */}
            <div className="space-y-2">
              <FieldLabel htmlFor="chq-sayad">
                <Hash className="size-3.5 text-slate-400" />
                شناسه صیادی
                <span className="text-slate-400">(۱۶ رقم)</span>
              </FieldLabel>
              <Input
                id="chq-sayad"
                value={sayadNumber}
                onChange={(e) => setSayadNumber(e.target.value)}
                placeholder="۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶"
                inputMode="numeric"
                maxLength={20}
                dir="ltr"
                className="h-12 rounded-xl border-slate-300 bg-white text-center text-[15px] font-black tracking-[0.3em]"
              />
              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    isValidSayad
                      ? "text-[11.5px] font-bold text-emerald-700"
                      : "text-[11.5px] font-bold text-slate-500"
                  }
                >
                  {faDigits(cleanSayad.length)} از ۱۶ رقم
                </span>
                {isValidSayad ? (
                  <span className="flex items-center gap-1 text-[11.5px] font-bold text-emerald-700">
                    <CheckCircle2 className="size-3.5" />
                    شناسه معتبر است
                  </span>
                ) : cleanSayad.length > 0 ? (
                  <span className="text-[11.5px] font-bold text-rose-600">
                    شناسه ناقص است
                  </span>
                ) : null}
              </div>
            </div>

            {/* Payer + amount */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="chq-customer">
                  <User className="size-3.5 text-slate-400" />
                  مشتری صادرکننده
                </FieldLabel>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger
                    id="chq-customer"
                    className="h-11 w-full rounded-xl border-slate-300 bg-white text-[13px] font-bold"
                  >
                    <SelectValue placeholder="انتخاب مشتری…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 rounded-xl border-slate-200 bg-white">
                    {customers.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className="text-[13px] font-bold"
                      >
                        {c.company || c.name}
                        {c.company && c.name ? ` — ${c.name}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="chq-amount">مبلغ چک (تومان)</FieldLabel>
                <Input
                  id="chq-amount"
                  value={amountToman}
                  onChange={(e) => setAmountToman(e.target.value)}
                  inputMode="numeric"
                  placeholder="مبلغ به تومان"
                  className="h-11 rounded-xl border-slate-300 bg-white text-center text-[14px] font-black tabular-nums"
                />
                {rialAmount > 0 && (
                  <p className="text-[11.5px] font-bold text-emerald-700">
                    معادل {formatToman(rialAmount)}
                  </p>
                )}
              </div>
            </div>

            {/* Bank + branch */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="chq-bank">
                  <Building2 className="size-3.5 text-slate-400" />
                  نام بانک
                </FieldLabel>
                <Select value={bankName} onValueChange={setBankName}>
                  <SelectTrigger
                    id="chq-bank"
                    className="h-11 w-full rounded-xl border-slate-300 bg-white text-[13px] font-bold"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 rounded-xl border-slate-200 bg-white">
                    {IRANIAN_BANKS.map((b) => (
                      <SelectItem
                        key={b}
                        value={b}
                        className="text-[13px] font-bold"
                      >
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="chq-branch">نام / کد شعبه</FieldLabel>
                <Input
                  id="chq-branch"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="مثال: ونک — کد ۱۲۳"
                  className="h-11 rounded-xl border-slate-300 bg-white text-[13px]"
                />
              </div>
            </div>

            {/* Signer + Jalali due date */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel htmlFor="chq-owner">
                  صادرکننده / امضاکننده
                </FieldLabel>
                <Input
                  id="chq-owner"
                  value={accountOwner}
                  onChange={(e) => setAccountOwner(e.target.value)}
                  placeholder="نام صاحب حساب یا مدیرعامل…"
                  className="h-11 rounded-xl border-slate-300 bg-white text-[13px]"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="chq-due">تاریخ سررسید چک</FieldLabel>
                <JalaliDatePicker
                  id="chq-due"
                  value={dueDate}
                  onChange={setDueDate}
                />
              </div>
            </div>
          </div>

          {/* Actions — anchored to the start edge, i.e. the right in RTL. */}
          <div className="flex shrink-0 items-center justify-start gap-2.5 border-t border-slate-200 bg-white px-6 py-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="h-11 cursor-pointer rounded-xl bg-brand-700 px-6 text-[13px] font-black text-white hover:bg-brand-800 disabled:pointer-events-none disabled:opacity-50"
            >
              ثبت در دفتر چک
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 cursor-pointer rounded-xl border-slate-300 px-5 text-[13px] font-bold text-slate-700 hover:bg-slate-50"
            >
              انصراف
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}