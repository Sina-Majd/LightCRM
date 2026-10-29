"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X, Building2, FileText } from "lucide-react";
import type { Invoice, Customer } from "@/lib/crm/types";
import {
  formatToman,
  formatTomanCompact,
  formatJalaliDate,
  INVOICE_TYPE_MAP,
  faDigits,
} from "@/lib/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  customer?: Customer | null;
  companyName?: string;
  /** Optional seller contact — omitted from the document when absent
      rather than printing a fabricated phone/address. */
  companyPhone?: string;
  companyAddress?: string;
}

function Cell({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="shrink-0 text-slate-500">{label}:</span>
      <b className="text-slate-900">{value}</b>
    </div>
  );
}

export function InvoicePrintModal({
  isOpen,
  onClose,
  invoice,
  customer,
  companyName = "شرکت داده‌پردازی و نرم‌افزار لایت",
  companyPhone,
  companyAddress,
}: Props) {
  if (!invoice) return null;

  const isProforma = invoice.type === "proforma";
  const items = invoice.items || [];
  const docTitle = isProforma
    ? "پیش‌فاکتور فروش کالا و خدمات"
    : "صورتحساب رسمی فروش کالا و خدمات";

  const handlePrint = () => {
    // Let the dialog settle before handing off to the print dialog.
    window.requestAnimationFrame(() => window.print());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        dir="rtl"
        className="flex max-h-[94vh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-0 text-right sm:max-w-6xl"
      >
        {/* Toolbar — screen only; never prints. */}
        <div className="print-hide flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <FileText className="size-4.5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="truncate text-[14px] font-black text-slate-900">
                پیش‌نمایش چاپ — {INVOICE_TYPE_MAP[invoice.type]}
              </DialogTitle>
              <DialogDescription className="truncate text-[11px] text-slate-500">
                سند {faDigits(invoice.number)} · فقط همین برگه چاپ می‌شود
              </DialogDescription>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-brand-700 px-4 text-xs font-black text-white hover:bg-brand-800"
            >
              <Printer className="size-4" />
              چاپ / ذخیره PDF
            </Button>
            <DialogClose asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-9 cursor-pointer items-center gap-1.5 rounded-xl border-slate-300 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <X className="size-4" />
                بستن
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* Scrollable preview. The sheet below is what actually prints. */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div
            id="invoice-printable"
            className="mx-auto flex max-w-4xl flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 text-right text-slate-800 shadow-sm sm:p-8"
          >
            {/* Document masthead */}
            <header className="flex flex-col gap-4 border-b-2 border-slate-900 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-[15px] font-black leading-6 text-slate-950">
                  {companyName}
                </h2>
                <p className="mt-0.5 text-[11.5px] text-slate-500">
                  سیستم یکپارچه فروش و خدمات
                </p>
              </div>

              <div className="sm:text-left">
                <h1 className="text-[17px] font-black leading-7 text-slate-900">
                  {docTitle}
                </h1>
                <dl className="mt-2 space-y-1 text-[11.5px]">
                  <div className="flex gap-2 sm:justify-end">
                    <dt className="text-slate-500">شماره سند:</dt>
                    <dd className="font-black text-slate-900">
                      {faDigits(invoice.number)}
                    </dd>
                  </div>
                  <div className="flex gap-2 sm:justify-end">
                    <dt className="text-slate-500">تاریخ صدور:</dt>
                    <dd className="font-bold text-slate-900">
                      {formatJalaliDate(invoice.issueDate)}
                    </dd>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex gap-2 sm:justify-end">
                      <dt className="text-slate-500">
                        {isProforma ? "تاریخ اعتبار:" : "تاریخ سررسید:"}
                      </dt>
                      <dd className="font-bold text-slate-900">
                        {formatJalaliDate(invoice.dueDate)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </header>

            {/* Parties */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2.5 flex items-center gap-1.5 text-[12px] font-black text-slate-900">
                  <Building2 className="size-3.5 text-slate-500" />
                  مشخصات فروشنده
                </h3>
                <dl className="space-y-1.5 text-[11.5px]">
                  <Cell label="نام شرکت" value={companyName} />
                  <Cell label="شماره تماس" value={companyPhone} />
                  <Cell label="نشانی" value={companyAddress} />
                </dl>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2.5 flex items-center gap-1.5 text-[12px] font-black text-slate-900">
                  <Building2 className="size-3.5 text-slate-500" />
                  مشخصات خریدار
                </h3>
                <dl className="space-y-1.5 text-[11.5px]">
                  <Cell
                    label="طرف حساب"
                    value={customer?.company || invoice.customerName}
                  />
                  <Cell label="مسئول خرید" value={customer?.name} />
                  <Cell
                    label="شناسه ملی"
                    value={customer?.nationalId ? faDigits(customer.nationalId) : null}
                  />
                  <Cell label="شماره تماس" value={customer?.phone} />
                </dl>
              </div>
            </section>

            {/* Line items — description gets the room, numbers stay narrow. */}
            <section className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full table-fixed text-right text-[11.5px]">
                <colgroup>
                  <col className="w-12" />
                  <col />
                  <col className="w-16" />
                  <col className="w-32" />
                  <col className="w-28" />
                  <col className="w-36" />
                </colgroup>
                <thead className="border-b border-slate-300 bg-slate-100 text-slate-800">
                  <tr>
                    <th className="p-2.5 text-center font-black">ردیف</th>
                    <th className="p-2.5 font-black">شرح کالا یا خدمات</th>
                    <th className="p-2.5 text-center font-black">تعداد</th>
                    <th className="p-2.5 text-center font-black">قیمت واحد</th>
                    <th className="p-2.5 text-center font-black">تخفیف</th>
                    <th className="p-2.5 text-center font-black">مبلغ کل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        اقلامی ثبت نشده است
                      </td>
                    </tr>
                  ) : (
                    items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="p-2.5 text-center font-bold text-slate-500">
                          {faDigits(idx + 1)}
                        </td>
                        <td className="p-2.5 font-bold leading-6 text-slate-800">
                          {/* Long descriptions must wrap, not overflow. */}
                          <span className="block break-words whitespace-pre-wrap">
                            {it.description}
                          </span>
                        </td>
                        <td className="p-2.5 text-center tabular-nums">
                          {faDigits(it.quantity)}
                        </td>
                        <td className="p-2.5 text-center tabular-nums">
                          {formatTomanCompact(it.unitPrice)}
                        </td>
                        <td className="p-2.5 text-center tabular-nums text-rose-600">
                          {it.discount > 0 ? formatTomanCompact(it.discount) : "۰"}
                        </td>
                        <td className="p-2.5 text-center font-black tabular-nums text-slate-900">
                          {formatTomanCompact(it.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <p className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-[10.5px] text-slate-500">
                همه مبالغ به تومان
              </p>
            </section>

            {/* Notes + totals */}
            <section className="grid gap-4 sm:grid-cols-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-3">
                <h3 className="mb-2 text-[12px] font-black text-slate-900">
                  شرایط و توضیحات
                </h3>
                <p className="text-[11.5px] leading-6 text-slate-700">
                  {invoice.notes?.trim() ||
                    (isProforma
                      ? "کلیه مبالغ به تومان است و این پیش‌فاکتور تا پایان مهلت اعتبار، اعتبار قانونی دارد."
                      : "کلیه مبالغ به تومان است و این صورتحساب جهت پرداخت صادر شده است.")}
                </p>
              </div>

              <div className="rounded-xl border border-slate-300 bg-white p-4 sm:col-span-2">
                <dl className="space-y-2 text-[11.5px]">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">جمع ناخالص</dt>
                    <dd className="font-bold text-slate-900">
                      {formatToman(invoice.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">تخفیف</dt>
                    <dd className="font-bold text-rose-600">
                      {invoice.discount > 0
                        ? formatToman(invoice.discount)
                        : "۰ تومان"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">مالیات ارزش افزوده</dt>
                    <dd className="font-bold text-slate-900">
                      {formatToman(invoice.tax)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-2.5">
                    <dt className="text-[12px] font-black text-slate-950">
                      مبلغ نهایی
                    </dt>
                    <dd className="text-[14px] font-black tabular-nums text-brand-800">
                      {formatToman(invoice.total)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Signatures */}
            <section className="print-keep grid grid-cols-2 gap-5 border-t border-slate-200 pt-5 text-center">
              <div className="flex h-24 flex-col justify-between rounded-xl border border-dashed border-slate-300 p-3">
                <span className="text-[11.5px] font-bold text-slate-700">
                  مهر و امضای فروشنده
                </span>
              </div>
              <div className="flex h-24 flex-col justify-between rounded-xl border border-dashed border-slate-300 p-3">
                <span className="text-[11.5px] font-bold text-slate-700">
                  مهر و امضای خریدار
                </span>
              </div>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}