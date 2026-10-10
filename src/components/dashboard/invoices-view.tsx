"use client";

import React, { useState } from "react";
import {
  Receipt,
  Banknote,
  Plus,
  Printer,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { Invoice, Cheque, Customer } from "@/data/dashboard-mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatToman,
  formatJalaliDate,
  formatSayadNumber,
  INVOICE_STATUS_MAP,
  INVOICE_TYPE_MAP,
  getChequeStatusMeta,
  ChequeStatus,
  faDigits,
} from "@/lib/fa";
import dynamic from "next/dynamic";

const CreateInvoiceDialog = dynamic(
  () => import("./create-invoice-dialog").then((m) => m.CreateInvoiceDialog),
  { ssr: false }
);
const InvoicePrintModal = dynamic(
  () => import("./invoice-print-modal").then((m) => m.InvoicePrintModal),
  { ssr: false }
);
const ChequeRegisterDialog = dynamic(
  () => import("./cheque-register-dialog").then((m) => m.ChequeRegisterDialog),
  { ssr: false }
);

import { RawInvoiceItem } from "@/lib/fa";
import { toast } from "sonner";

interface Props {
  invoices: Invoice[];
  cheques: Cheque[];
  customers: Customer[];
  searchQuery: string;
  onCreateInvoice: (inv: Partial<Invoice>, items: RawInvoiceItem[]) => void;
  onCreateCheque: (chq: Partial<Cheque>) => void;
  onUpdateChequeStatus: (chequeId: string, status: ChequeStatus) => void;
}

export function InvoicesView({
  invoices,
  cheques,
  customers,
  searchQuery,
  onCreateInvoice,
  onCreateCheque,
  onUpdateChequeStatus,
}: Props) {
  const [subTab, setSubTab] = useState<"invoices" | "cheques">("invoices");

  // Modals state
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRegisterChequeOpen, setIsRegisterChequeOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] =
    useState<Invoice | null>(null);

  // Invoices metrics
  const totalInvoicesSum = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const paidInvoices = invoices.filter((i) => i.status === "paid");

  // Cheques metrics
  const inHandCheques = cheques.filter((c) => c.status === "in_hand");
  const clearedCheques = cheques.filter((c) => c.status === "cleared");

  // Filtered lists
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      String(inv.number).includes(q) ||
      (inv.customerName || "").toLowerCase().includes(q)
    );
  });

  const filteredCheques = cheques.filter((chq) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      chq.sayadNumber.includes(q) ||
      chq.bankName.toLowerCase().includes(q) ||
      (chq.customerName || "").toLowerCase().includes(q) ||
      chq.accountOwner.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* 4 Summary Bento Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Receipt className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">
                مجموع اسناد صادرشده
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight">
                {formatToman(totalInvoicesSum)}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>تعداد اسناد مالی</span>
            <b className="font-bold text-brand-700">
              {faDigits(invoices.length)} فقره سند
            </b>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">
                مطالبات تسویه‌شده
              </div>
              <div className="text-xl font-black text-emerald-700 tracking-tight">
                {formatToman(
                  paidInvoices.reduce((s, i) => s + (i.total || 0), 0)
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>فاکتورهای پرداخت‌شده</span>
            <b className="font-bold text-emerald-700">
              {faDigits(paidInvoices.length)} فاکتور
            </b>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Banknote className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">
                چک‌های نزد صندوق و بانک
              </div>
              <div className="text-xl font-black text-amber-700 tracking-tight">
                {formatToman(
                  inHandCheques.reduce((s, c) => s + (c.amount || 0), 0)
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>چک‌های در دست وصول</span>
            <b className="font-bold text-amber-700">
              {faDigits(inHandCheques.length)} فقره چک
            </b>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <FileCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-500">
                چک‌های وصول‌شده
              </div>
              <div className="text-xl font-black text-emerald-700 tracking-tight">
                {formatToman(
                  clearedCheques.reduce((s, c) => s + (c.amount || 0), 0)
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
            <span>وصول قطعی در حساب</span>
            <b className="font-bold text-emerald-700">
              {faDigits(clearedCheques.length)} فقره چک
            </b>
          </div>
        </div>
      </div>

      {/* Sub Tabs Bar & Primary Actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-100/80 bg-white p-3 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSubTab("invoices")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
              subTab === "invoices"
                ? "bg-brand-950 text-white shadow-sm"
                : "bg-brand-50/50 text-slate-600 hover:bg-brand-100/60"
            }`}
          >
            <Receipt className="h-4 w-4" />
            پیش‌فاکتورها و فاکتورها ({faDigits(invoices.length)})
          </button>
          <button
            onClick={() => setSubTab("cheques")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
              subTab === "cheques"
                ? "bg-brand-950 text-white shadow-sm"
                : "bg-brand-50/50 text-slate-600 hover:bg-brand-100/60"
            }`}
          >
            <Banknote className="h-4 w-4" />
            دفتر چک‌های صیادی ({faDigits(cheques.length)})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === "invoices" ? (
            <Button
              onClick={() => setIsCreateInvoiceOpen(true)}
              className="h-9 gap-1.5 rounded-xl bg-brand-700 text-xs font-black text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> صدور فاکتور / پیش‌فاکتور
            </Button>
          ) : (
            <Button
              onClick={() => setIsRegisterChequeOpen(true)}
              className="h-9 gap-1.5 rounded-xl bg-amber-600 text-xs font-black hover:bg-amber-700 text-white shadow-sm shadow-amber-600/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> ثبت چک صیادی جدید
            </Button>
          )}
        </div>
      </div>

      {/* TAB 1: INVOICES & PROFORMAS TABLE */}
      {subTab === "invoices" && (
        <div className="rounded-3xl border border-brand-100/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-brand-50/50 border-b border-brand-100 text-slate-700 font-black">
                <tr>
                  <th className="p-4">شماره سند</th>
                  <th className="p-4">نوع سند</th>
                  <th className="p-4">طرف حساب / مشتری</th>
                  <th className="p-4">تاریخ صدور</th>
                  <th className="p-4">سررسید / اعتبار</th>
                  <th className="p-4">مبلغ نهایی (تومان)</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/50">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                      فاکتوری با این مشخصات یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const statusMeta =
                      INVOICE_STATUS_MAP[inv.status] || INVOICE_STATUS_MAP.draft;
                    return (
                      <tr key={inv.id} className="hover:bg-brand-50/30 transition">
                        <td className="p-4 font-black text-slate-900">
                          فاکتور {faDigits(inv.number)}
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          {INVOICE_TYPE_MAP[inv.type]}
                        </td>
                        <td className="p-4 font-black text-slate-900">
                          {inv.customerName || "مشتری عمومی"}
                        </td>
                        <td className="p-4 text-slate-500 font-bold">
                          {formatJalaliDate(inv.issueDate)}
                        </td>
                        <td className="p-4 text-slate-500 font-bold">
                          {inv.dueDate ? formatJalaliDate(inv.dueDate) : "—"}
                        </td>
                        <td className="p-4 font-black text-emerald-700 tracking-tight">
                          {formatToman(inv.total)}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-black rounded-full px-2.5 py-0.5 ${statusMeta.badgeClass}`}
                          >
                            {statusMeta.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedInvoiceForPrint(inv)}
                              className="h-8 gap-1.5 text-[11px] font-black border-brand-200 rounded-xl hover:bg-brand-50 text-brand-700 cursor-pointer"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              چاپ / نمایش
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SAYAD CHEQUES MANAGEMENT */}
      {subTab === "cheques" && (
        <div className="rounded-3xl border border-brand-100/80 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-brand-50/50 border-b border-brand-100 text-slate-700 font-black">
                <tr>
                  <th className="p-4">شناسه صیادی (۱۶ رقم)</th>
                  <th className="p-4">بانک و شعبه</th>
                  <th className="p-4">مشتری و صادرکننده</th>
                  <th className="p-4">مبلغ چک (تومان)</th>
                  <th className="p-4">تاریخ سررسید</th>
                  <th className="p-4">وضعیت وصولی</th>
                  <th className="p-4 text-center">تغییر وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/50">
                {filteredCheques.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                      چکی در این بخش ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  filteredCheques.map((chq) => {
                    const statusMeta = getChequeStatusMeta(chq.status);
                    return (
                      <tr key={chq.id} className="hover:bg-brand-50/30 transition">
                        <td className="p-4 font-black text-slate-900 tracking-wider">
                          {formatSayadNumber(chq.sayadNumber)}
                        </td>
                        <td className="p-4 font-bold text-slate-800">
                          {chq.bankName} {chq.branchName ? `(${chq.branchName})` : ""}
                        </td>
                        <td className="p-4">
                          <div className="font-black text-slate-900">
                            {chq.customerName || chq.accountOwner}
                          </div>
                          <div className="text-[11px] text-slate-400 font-bold">
                            صاحب حساب: {chq.accountOwner}
                          </div>
                        </td>
                        <td className="p-4 font-black text-emerald-700 text-sm tracking-tight">
                          {formatToman(chq.amount)}
                        </td>
                        <td className="p-4 font-bold text-slate-700">
                          {formatJalaliDate(chq.dueDate)}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-black rounded-full px-2.5 py-0.5 ${statusMeta.badgeClass}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotColor}`}
                            />
                            {statusMeta.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-xl text-[11px] border-brand-200 font-bold hover:bg-brand-50"
                              >
                                تغییر وضعیت
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-52 rounded-2xl border border-brand-100 bg-white p-1.5 text-right shadow-xl"
                            >
                              <DropdownMenuItem
                                onClick={() => {
                                  onUpdateChequeStatus(chq.id, "in_hand");
                                  toast.success("وضعیت چک به نزد صندوق تغییر یافت.");
                                }}
                                className="cursor-pointer text-amber-700 text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-amber-50"
                              >
                                نزد صندوق (دریافت شده)
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  onUpdateChequeStatus(chq.id, "deposited");
                                  toast.success("وضعیت چک به واگذار به بانک تغییر یافت.");
                                }}
                                className="cursor-pointer text-brand-700 text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                              >
                                واگذار به بانک
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  onUpdateChequeStatus(chq.id, "cleared");
                                  toast.success("چک صیادی با موفقیت وصول گردید.");
                                }}
                                className="cursor-pointer text-emerald-700 text-xs font-black rounded-xl py-2 px-2.5 hover:bg-emerald-50"
                              >
                                وصول شده ✓
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  onUpdateChequeStatus(chq.id, "bounced");
                                  toast.error("چک به وضعیت برگشتی تغییر یافت.");
                                }}
                                className="cursor-pointer text-rose-700 text-xs font-black rounded-xl py-2 px-2.5 hover:bg-rose-50"
                              >
                                برگشت خورده (لاوصول)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Dialog */}
      <CreateInvoiceDialog
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        customers={customers}
        onCreateInvoice={onCreateInvoice}
      />

      {/* Register Cheque Dialog */}
      <ChequeRegisterDialog
        isOpen={isRegisterChequeOpen}
        onClose={() => setIsRegisterChequeOpen(false)}
        customers={customers}
        onCreateCheque={onCreateCheque}
      />

      {/* Invoice Print & Preview Modal */}
      <InvoicePrintModal
        isOpen={!!selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
        invoice={selectedInvoiceForPrint}
        customer={customers.find(
          (c) => c.id === selectedInvoiceForPrint?.customerId
        )}
      />
    </div>
  );
}
