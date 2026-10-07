"use client";

import React, { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Receipt } from "lucide-react";
import { Customer, Invoice } from "@/data/dashboard-mock-data";
import {
  formatToman,
  parseTomanInput,
  calculateItemTotal,
  calculateInvoiceTotals,
  RawInvoiceItem,
  InvoiceType,
  faDigits,
} from "@/lib/fa";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  defaultCustomer?: Customer | null;
  onCreateInvoice: (invoice: Partial<Invoice>, items: RawInvoiceItem[]) => void;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPriceToman: string;
  discountToman: string;
  taxRate: number;
}

const emptyItem = (): LineItem => ({
  description: "",
  quantity: 1,
  unitPriceToman: "",
  discountToman: "0",
  taxRate: 10,
});

/** A row only counts if it has both a description and a price. */
function isComplete(item: RawInvoiceItem): boolean {
  return item.description.trim().length > 0 && item.unit_price > 0;
}

export function CreateInvoiceDialog({
  isOpen,
  onClose,
  customers,
  defaultCustomer,
  onCreateInvoice,
}: Props) {
  const [customerId, setCustomerId] = useState<string>(
    defaultCustomer?.id || customers[0]?.id || ""
  );
  const [type, setType] = useState<InvoiceType>("proforma");
  const [notes, setNotes] = useState("");
  const [dueDays, setDueDays] = useState("5");
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);

  const updateItem = (index: number, field: keyof LineItem, value: unknown) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  // Convert to the Rial shape the calculation helpers expect.
  const rawItems: RawInvoiceItem[] = useMemo(
    () =>
      items.map((it) => {
        const unitPriceRial = parseTomanInput(it.unitPriceToman);
        const discountRial = parseTomanInput(it.discountToman);
        const { total } = calculateItemTotal(
          it.quantity,
          unitPriceRial,
          discountRial,
          it.taxRate
        );
        return {
          description: it.description,
          quantity: it.quantity,
          unit_price: unitPriceRial,
          discount: discountRial,
          tax_rate: it.taxRate,
          total,
        };
      }),
    [items]
  );

  const validItems = useMemo(() => rawItems.filter(isComplete), [rawItems]);

  // Totals must be derived from exactly the rows that get persisted —
  // otherwise the confirmed header can disagree with the stored invoice.
  const totals = useMemo(() => calculateInvoiceTotals(validItems), [validItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validItems.length === 0) {
      toast.error("لطفاً حداقل یک ردیف کالا یا خدمات با شرح و قیمت وارد کنید.");
      return;
    }

    const customer = customers.find((c) => c.id === customerId);
    const now = new Date();
    // Local calendar date — toISOString() is UTC and can land on the
    // previous day for Iran (UTC+3:30) in the early hours.
    const iso = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    const days = parseInt(dueDays, 10) || 5;
    const dueObj = new Date(now.getTime());
    dueObj.setDate(dueObj.getDate() + days);

    onCreateInvoice(
      {
        customerId: customer?.id || null,
        customerName: customer?.name || customer?.company || "مشتری عمومی",
        type,
        status: "draft",
        issueDate: iso(now),
        dueDate: iso(dueObj),
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        notes,
      },
      validItems
    );

    toast.success(
      type === "proforma"
        ? "پیش‌فاکتور با موفقیت صادر شد."
        : "فاکتور رسمی با موفقیت ثبت شد."
    );
    setItems([emptyItem()]);
    setNotes("");
    onClose();
  };

  const incompleteCount = rawItems.length - validItems.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        dir="rtl"
        className="flex max-h-[94vh] w-[calc(100vw-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-right sm:max-w-5xl"
      >
        <DialogHeader className="shrink-0 border-b border-slate-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-3 text-[15px] font-black text-slate-900">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Receipt className="size-5" />
            </span>
            <span>صدور سند مالی</span>
          </DialogTitle>
          <DialogDescription className="text-[12px] font-medium text-slate-500">
            اقلام کالا یا خدمات، مالیات بر ارزش افزوده و شرایط تسویه را مشخص کنید.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* Document settings */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label
                  htmlFor="inv-customer"
                  className="text-[12.5px] font-bold text-slate-700"
                >
                  مشتری / طرف حساب
                </Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger
                    id="inv-customer"
                    className="h-11 w-full rounded-xl border-slate-300 bg-white text-[13px] font-bold"
                  >
                    <SelectValue placeholder="انتخاب مشتری…" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 bg-white">
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
                <Label
                  htmlFor="inv-type"
                  className="text-[12.5px] font-bold text-slate-700"
                >
                  نوع سند
                </Label>
                <Select
                  value={type}
                  onValueChange={(v: InvoiceType) => setType(v)}
                >
                  <SelectTrigger
                    id="inv-type"
                    className="h-11 w-full rounded-xl border-slate-300 bg-white text-[13px] font-bold"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 bg-white">
                    <SelectItem value="proforma" className="text-[13px] font-bold">
                      پیش‌فاکتور فروش (معتبر)
                    </SelectItem>
                    <SelectItem value="invoice" className="text-[13px] font-bold">
                      فاکتور رسمی فروش
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="inv-due"
                  className="text-[12.5px] font-bold text-slate-700"
                >
                  {type === "proforma" ? "مدت اعتبار" : "مهلت پرداخت"}
                </Label>
                <Select value={dueDays} onValueChange={setDueDays}>
                  <SelectTrigger
                    id="inv-due"
                    className="h-11 w-full rounded-xl border-slate-300 bg-white text-[13px] font-bold"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 bg-white">
                    <SelectItem value="3" className="text-[13px] font-bold">
                      ۳ روز کاری
                    </SelectItem>
                    <SelectItem value="5" className="text-[13px] font-bold">
                      ۵ روز کاری
                    </SelectItem>
                    <SelectItem value="15" className="text-[13px] font-bold">
                      ۱۵ روزه
                    </SelectItem>
                    <SelectItem value="30" className="text-[13px] font-bold">
                      ۳۰ روزه (ماهانه)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Line items */}
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[13px] font-black text-slate-900">
                  اقلام فاکتور
                  <span className="mr-2 font-medium text-slate-500">
                    ({faDigits(items.length)} ردیف)
                  </span>
                </h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setItems((p) => [...p, emptyItem()])}
                  className="h-9 cursor-pointer items-center gap-1.5 rounded-xl border-slate-300 px-3 text-[12px] font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="size-4" />
                  افزودن ردیف
                </Button>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                {/* Column header */}
                <div className="hidden grid-cols-12 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[12px] font-black text-slate-600 md:grid">
                  <div className="col-span-5">شرح کالا یا خدمات</div>
                  <div className="col-span-1 text-center">تعداد</div>
                  <div className="col-span-2 text-center">قیمت واحد (تومان)</div>
                  <div className="col-span-2 text-center">تخفیف (تومان)</div>
                  <div className="col-span-2 text-center">مبلغ کل</div>
                </div>

                <ul className="divide-y divide-slate-100">
                  {items.map((item, index) => {
                    const rowTotal = rawItems[index]?.total || 0;
                    const rowValid = isComplete(rawItems[index] ?? {
                      description: "",
                      quantity: 0,
                      unit_price: 0,
                      discount: 0,
                      tax_rate: 0,
                      total: 0,
                    });
                    return (
                      <li
                        key={index}
                        className="grid grid-cols-1 gap-3 px-4 py-3.5 md:grid-cols-12 md:items-center"
                      >
                        <div className="md:col-span-5">
                          <label
                            htmlFor={`inv-desc-${index}`}
                            className="mb-1.5 block text-[11.5px] font-bold text-slate-500 md:sr-only"
                          >
                            شرح
                          </label>
                          <Input
                            id={`inv-desc-${index}`}
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            placeholder="مثلاً: لایسنس نرم‌افزار سازمانی"
                            className="h-11 rounded-xl border-slate-300 bg-white text-[13px]"
                          />
                        </div>

                        <div className="md:col-span-1">
                          <label
                            htmlFor={`inv-qty-${index}`}
                            className="mb-1.5 block text-[11.5px] font-bold text-slate-500 md:sr-only"
                          >
                            تعداد
                          </label>
                          <Input
                            id={`inv-qty-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                Math.max(1, parseInt(e.target.value, 10) || 1)
                              )
                            }
                            className="h-11 rounded-xl border-slate-300 bg-white text-center text-[13px] font-black"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor={`inv-price-${index}`}
                            className="mb-1.5 block text-[11.5px] font-bold text-slate-500 md:sr-only"
                          >
                            قیمت واحد
                          </label>
                          <Input
                            id={`inv-price-${index}`}
                            inputMode="numeric"
                            value={item.unitPriceToman}
                            onChange={(e) =>
                              updateItem(index, "unitPriceToman", e.target.value)
                            }
                            placeholder="۰"
                            className="h-11 rounded-xl border-slate-300 bg-white text-center text-[13px] font-bold tabular-nums"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor={`inv-disc-${index}`}
                            className="mb-1.5 block text-[11.5px] font-bold text-slate-500 md:sr-only"
                          >
                            تخفیف
                          </label>
                          <Input
                            id={`inv-disc-${index}`}
                            inputMode="numeric"
                            value={item.discountToman}
                            onChange={(e) =>
                              updateItem(index, "discountToman", e.target.value)
                            }
                            placeholder="۰"
                            className="h-11 rounded-xl border-slate-300 bg-white text-center text-[13px] font-bold tabular-nums"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2 md:col-span-2">
                          <span className="text-[11.5px] font-bold text-slate-500 md:hidden">
                            مبلغ کل
                          </span>
                          <span
                            className={`text-[13px] font-black tabular-nums ${
                              rowValid ? "text-emerald-700" : "text-slate-400"
                            }`}
                          >
                            {rowValid ? formatToman(rowTotal) : "—"}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={items.length <= 1}
                            aria-label={`حذف ردیف ${index + 1}`}
                            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-40"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {incompleteCount > 0 && (
                <p className="text-[11.5px] font-bold text-amber-700">
                  {faDigits(incompleteCount)} ردیف بدون شرح یا قیمت — در صدور
                  نادیده گرفته می‌شود.
                </p>
              )}
            </section>

            {/* Notes + totals */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="inv-notes"
                  className="text-[12.5px] font-bold text-slate-700"
                >
                  شرایط پرداخت و توضیحات
                </Label>
                <textarea
                  id="inv-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="مثال: تسویه ۵۰٪ پیش‌پرداخت همزمان با امضای قرارداد و مابقی طی چک صیادی ۳۰ روزه…"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-[13px] font-medium leading-6 text-slate-800 transition-colors focus:border-brand-500 focus:outline-none"
                />
              </div>

              <dl className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12.5px]">
                <div className="flex justify-between">
                  <dt className="text-slate-600">جمع ناخالص اقلام</dt>
                  <dd className="font-black tabular-nums text-slate-900">
                    {formatToman(totals.subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">تخفیف کل</dt>
                  <dd className="font-black tabular-nums text-rose-600">
                    {totals.discount > 0 ? formatToman(totals.discount) : "۰ تومان"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-600">مالیات بر ارزش افزوده (۱۰٪)</dt>
                  <dd className="font-black tabular-nums text-slate-900">
                    {formatToman(totals.tax)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-slate-300 pt-3">
                  <dt className="text-[13px] font-black text-slate-950">
                    مبلغ نهایی قابل پرداخت
                  </dt>
                  <dd className="text-[17px] font-black tabular-nums text-brand-800">
                    {formatToman(totals.total)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Sticky actions */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
            <span className="text-[11.5px] font-medium text-slate-500">
              {faDigits(validItems.length)} ردیف معتبر از {faDigits(items.length)}{" "}
              ردیف
            </span>
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 cursor-pointer rounded-xl border-slate-300 px-5 text-[13px] font-bold text-slate-700 hover:bg-slate-50"
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={validItems.length === 0}
                className="h-11 cursor-pointer rounded-xl bg-brand-700 px-6 text-[13px] font-black text-white hover:bg-brand-800 disabled:pointer-events-none disabled:opacity-50"
              >
                تایید و صدور {type === "proforma" ? "پیش‌فاکتور" : "فاکتور رسمی"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
