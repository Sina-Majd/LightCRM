"use client";

import { useAsyncAction, type AsyncAction } from "@/lib/use-async-action";

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
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Wallet,
  User,
  Mail,
  KanbanSquare,
  UserCheck,
  PlusCircle,
} from "lucide-react";
import type {
  Deal,
  DealPriority,
  Customer,
  CustomerTier,
  PipelineStage,
  RecordType,
} from "@/lib/crm/types";
import { probabilityForStage } from "@/lib/crm/pipeline";
import { formatToman, parseTomanInput } from "@/lib/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: RecordType;
  defaultStageId?: string;
  stages: PipelineStage[];
  onCreateDeal: AsyncAction<[Deal]>;
  onCreateCustomer: AsyncAction<[Customer]>;
}

const STAGE_FA: Record<string, string> = {
  "stage-new": "سرنخ‌های ورودی",
  "stage-qualified": "ارزیابی و تایید نیاز",
  "stage-proposal": "ارسال پیش‌فاکتور و دمو",
  "stage-negotiation": "مذاکره و توافق نهایی",
  "stage-won": "موفق و بسته شد",
};

export function CreateRecordDialog({
  isOpen,
  onClose,
  defaultType = "deal",
  defaultStageId,
  stages,
  onCreateDeal,
  onCreateCustomer,
}: Props) {
  const { isPending, run } = useAsyncAction();
  const [tab, setTab] = useState<RecordType>(defaultType);
  const [prevOpen, setPrevOpen] = useState(isOpen);
  const [prevType, setPrevType] = useState(defaultType);


  const [dealTitle, setDealTitle] = useState("");
  const [dealCompany, setDealCompany] = useState("");
  const [dealContact, setDealContact] = useState("");
  const [dealEmail, setDealEmail] = useState("");
  const [dealValue, setDealValue] = useState<number | string>("");
  const [dealStageId, setDealStageId] = useState(
    defaultStageId || stages[0]?.id || "stage-new"
  );
  const [dealPriority, setDealPriority] = useState<DealPriority>("high");

  const [custSegment, setCustSegment] = useState<Customer["segment"]>("customer");
  const [custType, setCustType] = useState<Customer["customerType"]>("company");
  const [custCompany, setCustCompany] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custTier, setCustTier] = useState<CustomerTier>("سازمانی");
  const [custLtv, setCustLtv] = useState<number | string>(0);

  const [prevStage, setPrevStage] = useState(defaultStageId);
  if (isOpen !== prevOpen || defaultType !== prevType || defaultStageId !== prevStage) {
    setPrevOpen(isOpen);
    setPrevType(defaultType);
    setPrevStage(defaultStageId);
    if (isOpen) {
      setTab(defaultType);
      setDealStageId(defaultStageId || stages[0]?.id || "stage-new");
    }
  }

  const close = () => onClose();

  const submitDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim() || !dealCompany.trim()) return;
    const numeric = parseTomanInput(String(dealValue));
    const saved = await run(() => onCreateDeal({
      id: `deal-${Date.now()}`,
      title: dealTitle.trim(),
      company: dealCompany.trim(),
      contact: dealContact || "مخاطب اصلی",
      email: dealEmail.trim(),
      phone: "",
      value: numeric,
      formattedValue: formatToman(numeric),
      stageId: dealStageId || stages[0]?.id,
      priority: dealPriority,
      probability: probabilityForStage(stages, dealStageId),
      tags: ["معامله جدید"],
      notes: "ثبت سریع در پایپ‌لاین",
      daysInStage: 0,
      lastActivity: "همین حالا",
      nextActionTitle: "برقراری تماس اولیه و بررسی نیازها",
      nextActionDue: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      assignee: { name: "شما", avatar: "" },
    }));
    if (!saved) return;
    close();
    setDealTitle("");
    setDealCompany("");
    setDealContact("");
    setDealEmail("");
  };

  const submitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || (custType === "company" && !custCompany.trim())) return;
    const numeric = parseTomanInput(String(custLtv));
    const saved = await run(() => onCreateCustomer({
      id: `cust-${Date.now()}`,
      name: custName.trim(),
      company: custCompany.trim(),
      email: custEmail.trim(),
      phone: custPhone.trim(),
      customerType: custType,
      segment: custSegment,
      ltv: numeric,
      formattedLtv: formatToman(numeric),
      activeDealsCount: 0,
      healthScore: 90,
      healthStatus: "good",
      tier: custTier,
      renewalDate: "—",
      lastTouch: "همین حالا",
      location: "",
      industry: "",
    }));
    if (!saved) return;
    close();
    setCustCompany("");
    setCustName("");
    setCustEmail("");
    setCustPhone("");
  };

  const field = "space-y-1.5";

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="rounded-3xl border border-brand-100 bg-white p-6 sm:max-w-xl text-right shadow-2xl max-h-[92vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-black text-slate-900">
            <PlusCircle className="h-5 w-5 text-brand-700" /> ایجاد رکورد جدید
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-bold">
            معامله، سرنخ یا مشتری را مستقیم وارد فضای کاری لایت کنید.
          </DialogDescription>
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-brand-100 bg-brand-50/40 p-1.5 pt-2 mt-3">
            {(
              [
                ["deal", "معامله فروش", KanbanSquare],
                ["customer", "پرونده مشتری", UserCheck],
              ] as const
            ).map(([v, l, Icon]) => (
              <button
                key={v}
                type="button"
                onClick={() => setTab(v)}
                className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-[12.5px] font-black cursor-pointer transition-all ${
                  tab === v
                    ? "bg-brand-950 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {l}
              </button>
            ))}
          </div>
        </DialogHeader>

        {tab === "deal" && (
          <form aria-busy={isPending} onSubmit={submitDeal} className="space-y-3.5 pt-2">
            <div className={field}>
              <Label htmlFor="record-dealTitle" requiredIndicator>عنوان معامله</Label>
              <Input
                id="record-dealTitle"
                required
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                placeholder="مثلاً: سامانه مدیریت دانش سازمانی"
                className="h-10 rounded-xl border-brand-100 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label htmlFor="record-dealCompany" requiredIndicator>شرکت طرف حساب</Label>
                <Input
                  id="record-dealCompany"
                  required
                  value={dealCompany}
                  onChange={(e) => setDealCompany(e.target.value)}
                  placeholder="نام شرکت یا برند"
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label htmlFor="record-dealValue" requiredIndicator>ارزش تخمینی (تومان)</Label>
                <NumberInput
                  id="record-dealValue"
                  value={dealValue}
                  onChange={setDealValue}
                  step={1}
                  min={0}
                  icon={<Wallet className="h-3.5 w-3.5 text-emerald-600" />}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label htmlFor="record-dealContact">مخاطب اصلی</Label>
                <Input
                  id="record-dealContact"
                  value={dealContact}
                  onChange={(e) => setDealContact(e.target.value)}
                  placeholder="نام رابط تصمیم‌گیرنده"
                  icon={<User className="h-3.5 w-3.5" />}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label htmlFor="record-dealEmail">ایمیل کاری</Label>
                <Input
                  id="record-dealEmail"
                  type="email"
                  value={dealEmail}
                  onChange={(e) => setDealEmail(e.target.value)}
                  placeholder="contact@company.ir"
                  icon={<Mail className="h-3.5 w-3.5" />}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label>مرحله در پایپ‌لاین</Label>
                <Select value={dealStageId} onValueChange={setDealStageId}>
                  <SelectTrigger aria-label="مرحله معامله" className="h-10 rounded-xl border-brand-100 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-100 bg-white">
                    {stages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {STAGE_FA[s.id] || s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className={field}>
                <Label>سطح فوریت</Label>
                <Select
                  value={dealPriority}
                  onValueChange={(v) => setDealPriority(v as DealPriority)}
                >
                  <SelectTrigger aria-label="اولویت معامله" className="h-10 rounded-xl border-brand-100 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-100 bg-white">
                    <SelectItem value="urgent">فوری</SelectItem>
                    <SelectItem value="high">مهم</SelectItem>
                    <SelectItem value="medium">عادی</SelectItem>
                    <SelectItem value="low">کم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit" disabled={isPending}
              className="h-11 w-full rounded-xl bg-brand-700 font-black text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20 cursor-pointer"
            >
              ثبت معامله در پایپ‌لاین
            </Button>
          </form>
        )}

        {tab === "customer" && (
          <form aria-busy={isPending} onSubmit={submitCustomer} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label htmlFor="record-customer-type">نوع مخاطب</Label>
                <Select value={custType} onValueChange={(value) => setCustType(value as Customer["customerType"])}>
                  <SelectTrigger id="record-customer-type"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="company">شرکت / سازمان</SelectItem><SelectItem value="individual">شخص حقیقی</SelectItem></SelectContent>
                </Select>
              </div>
              <div className={field}>
                <Label htmlFor="record-customer-segment">نوع پرونده</Label>
                <Select value={custSegment} onValueChange={(value) => setCustSegment(value as Customer["segment"])}>
                  <SelectTrigger id="record-customer-segment"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="customer">مشتری</SelectItem><SelectItem value="lead">سرنخ</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label htmlFor="record-custCompany" requiredIndicator={custType === "company"}>شرکت / سازمان</Label>
                <Input
                  id="record-custCompany"
                  required={custType === "company"}
                  value={custCompany}
                  onChange={(e) => setCustCompany(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label htmlFor="record-custName" requiredIndicator>مخاطب اصلی</Label>
                <Input
                  id="record-custName"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label htmlFor="record-custEmail">ایمیل</Label>
                <Input
                  id="record-custEmail"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label htmlFor="record-custPhone">تلفن</Label>
                <Input
                  id="record-custPhone"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label>سطح مشتری</Label>
                <Select
                  value={custTier}
                  onValueChange={(v) => setCustTier(v as CustomerTier)}
                >
                  <SelectTrigger aria-label="سطح مشتری" className="h-10 rounded-xl border-brand-100 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-100 bg-white">
                    <SelectItem value="سازمانی">سازمانی (Enterprise)</SelectItem>
                    <SelectItem value="در حال رشد">رشد (Growth)</SelectItem>
                    <SelectItem value="استارتاپ">استارتاپ (Startup)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={field}>
                <Label htmlFor="record-custLtv">ارزش چرخه حیات تقریبی (تومان)</Label>
                <NumberInput
                  id="record-custLtv"
                  value={custLtv}
                  onChange={setCustLtv}
                  step={1}
                  min={0}
                />
              </div>
            </div>
            <Button
              type="submit" disabled={isPending}
              className="h-11 w-full rounded-xl bg-brand-700 font-black text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20 cursor-pointer"
            >
              ثبت پرونده مشتری
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
