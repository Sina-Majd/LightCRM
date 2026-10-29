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
  Phone,
  KanbanSquare,
  Users,
  UserCheck,
  PlusCircle,
} from "lucide-react";
import { Lead, LeadStatus } from "@/data/dashboard-mock-data";
import type { Deal, DealPriority, Customer, CustomerTier, CustomerHealth, PipelineStage } from "@/lib/crm/types";
import { formatToman } from "@/lib/fa";

export type RecordType = "deal" | "lead" | "customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: RecordType;
  defaultStageId?: string;
  stages: PipelineStage[];
  onCreateDeal: (deal: Deal) => void;
  onCreateLead: (lead: Lead) => void;
  onCreateCustomer: (customer: Customer) => void;
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
  onCreateLead,
  onCreateCustomer,
}: Props) {
  const [tab, setTab] = useState<RecordType>(defaultType);
  const [prevOpen, setPrevOpen] = useState(isOpen);
  const [prevType, setPrevType] = useState(defaultType);
  if (isOpen !== prevOpen || defaultType !== prevType) {
    setPrevOpen(isOpen);
    setPrevType(defaultType);
    if (isOpen) setTab(defaultType);
  }

  const [dealTitle, setDealTitle] = useState("");
  const [dealCompany, setDealCompany] = useState("");
  const [dealContact, setDealContact] = useState("");
  const [dealEmail, setDealEmail] = useState("");
  const [dealValue, setDealValue] = useState<number | string>(150000000);
  const [dealStageId, setDealStageId] = useState(
    defaultStageId || stages[0]?.id || "stage-new"
  );
  const [dealPriority, setDealPriority] = useState<DealPriority>("high");

  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadScore, setLeadScore] = useState<number | string>(85);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("hot");

  const [custCompany, setCustCompany] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custTier, setCustTier] = useState<CustomerTier>("سازمانی");
  const [custLtv, setCustLtv] = useState<number | string>(350000000);

  const close = () => onClose();

  const submitDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealCompany) return;
    const numeric =
      typeof dealValue === "number"
        ? dealValue
        : parseFloat(dealValue as string) || 150000000;
    onCreateDeal({
      id: `deal-${Date.now()}`,
      title: dealTitle,
      company: dealCompany,
      contact: dealContact || "مخاطب اصلی",
      email: dealEmail || "contact@company.ir",
      phone: "۰۲۱۸۸۰۰۰۰۰۰",
      value: numeric,
      formattedValue: formatToman(numeric),
      stageId: dealStageId || stages[0]?.id,
      priority: dealPriority,
      probability:
        dealStageId === "stage-won"
          ? 100
          : dealStageId === "stage-negotiation"
          ? 85
          : 50,
      tags: ["معامله جدید"],
      notes: "ثبت سریع در پایپ‌لاین",
      daysInStage: 0,
      lastActivity: "همین حالا",
      nextActionTitle: "برقراری تماس اولیه و بررسی نیازها",
      nextActionDue: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      assignee: { name: "شما", avatar: "" },
    });
    close();
    setDealTitle("");
    setDealCompany("");
    setDealContact("");
    setDealEmail("");
  };

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadCompany) return;
    const score = Math.min(
      100,
      Math.max(
        1,
        typeof leadScore === "number"
          ? leadScore
          : parseInt(leadScore as string) || 80
      )
    );
    onCreateLead({
      id: `lead-${Date.now()}`,
      name: leadName,
      company: leadCompany,
      email: leadEmail || "lead@company.ir",
      phone: leadPhone || "۰۹۱۲۰۰۰۰۰۰۰",
      title: "مدیر توسعه بازار",
      score,
      status: leadStatus,
      source: "وبسایت",
      estimatedValue: 120000000,
      formattedValue: formatToman(120000000),
      createdDate: "همین حالا",
      notes: "",
      assignedTo: "شما",
    });
    close();
    setLeadName("");
    setLeadCompany("");
    setLeadEmail("");
    setLeadPhone("");
  };

  const submitCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custCompany || !custName) return;
    const numeric =
      typeof custLtv === "number"
        ? custLtv
        : parseFloat(custLtv as string) || 350000000;
    onCreateCustomer({
      id: `cust-${Date.now()}`,
      name: custName,
      company: custCompany,
      email: custEmail || "info@company.ir",
      phone: custPhone || "۰۲۱۸۸۰۰۰۰۰۰",
      customerType: "company",
      segment: "customer",
      ltv: numeric,
      formattedLtv: formatToman(numeric),
      activeDealsCount: 1,
      healthScore: 90,
      healthStatus: "good",
      tier: custTier,
      renewalDate: "۱۲ ماه بعد",
      lastTouch: "همین حالا",
      location: "تهران",
      industry: "فناوری اطلاعات و خدمات",
    });
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
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-brand-100 bg-brand-50/40 p-1.5 pt-2 mt-3">
            {(
              [
                ["deal", "معامله فروش", KanbanSquare],
                ["lead", "سرنخ بازاریابی", Users],
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
          <form onSubmit={submitDeal} className="space-y-3.5 pt-2">
            <div className={field}>
              <Label requiredIndicator>عنوان معامله</Label>
              <Input
                required
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                placeholder="مثلاً: سامانه مدیریت دانش سازمانی"
                className="h-10 rounded-xl border-brand-100 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label requiredIndicator>شرکت طرف حساب</Label>
                <Input
                  required
                  value={dealCompany}
                  onChange={(e) => setDealCompany(e.target.value)}
                  placeholder="نام شرکت یا برند"
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label requiredIndicator>ارزش تخمینی (تومان)</Label>
                <NumberInput
                  value={dealValue}
                  onChange={setDealValue}
                  step={10000000}
                  min={0}
                  icon={<Wallet className="h-3.5 w-3.5 text-emerald-600" />}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label>مخاطب اصلی</Label>
                <Input
                  value={dealContact}
                  onChange={(e) => setDealContact(e.target.value)}
                  placeholder="نام رابط تصمیم‌گیرنده"
                  icon={<User className="h-3.5 w-3.5" />}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label>ایمیل کاری</Label>
                <Input
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
                  <SelectTrigger className="h-10 rounded-xl border-brand-100 bg-white">
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
                  <SelectTrigger className="h-10 rounded-xl border-brand-100 bg-white">
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
              type="submit"
              className="h-11 w-full rounded-xl bg-brand-700 font-black text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20 cursor-pointer"
            >
              ثبت معامله در پایپ‌لاین
            </Button>
          </form>
        )}

        {tab === "lead" && (
          <form onSubmit={submitLead} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label requiredIndicator>نام و نام‌خانوادگی</Label>
                <Input
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                  placeholder="نام سرنخ"
                />
              </div>
              <div className={field}>
                <Label requiredIndicator>شرکت</Label>
                <Input
                  required
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                  placeholder="شرکت یا سازمان"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label>ایمیل</Label>
                <Input
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                  icon={<Mail className="h-3.5 w-3.5" />}
                />
              </div>
              <div className={field}>
                <Label>تلفن همراه</Label>
                <Input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                  icon={<Phone className="h-3.5 w-3.5" />}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label>وضعیت حرارت</Label>
                <Select
                  value={leadStatus}
                  onValueChange={(v) => setLeadStatus(v as LeadStatus)}
                >
                  <SelectTrigger className="h-10 rounded-xl border-brand-100 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-100 bg-white">
                    <SelectItem value="hot">داغ</SelectItem>
                    <SelectItem value="warm">گرم</SelectItem>
                    <SelectItem value="qualified">واجد شرایط</SelectItem>
                    <SelectItem value="cold">سرد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={field}>
                <Label>امتیاز کیفی (۱ تا ۱۰۰)</Label>
                <NumberInput
                  value={leadScore}
                  onChange={setLeadScore}
                  min={1}
                  max={100}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-brand-700 font-black text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20 cursor-pointer"
            >
              ثبت سرنخ جدید
            </Button>
          </form>
        )}

        {tab === "customer" && (
          <form onSubmit={submitCustomer} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label requiredIndicator>شرکت / سازمان</Label>
                <Input
                  required
                  value={custCompany}
                  onChange={(e) => setCustCompany(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label requiredIndicator>مخاطب اصلی</Label>
                <Input
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={field}>
                <Label>ایمیل</Label>
                <Input
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="h-10 rounded-xl border-brand-100 bg-white"
                />
              </div>
              <div className={field}>
                <Label>تلفن</Label>
                <Input
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
                  <SelectTrigger className="h-10 rounded-xl border-brand-100 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-brand-100 bg-white">
                    <SelectItem value="سازمانی">سازمانی (Enterprise)</SelectItem>
                    <SelectItem value="رشد">رشد (Growth)</SelectItem>
                    <SelectItem value="استارتاپ">استارتاپ (Startup)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className={field}>
                <Label>ارزش چرخه حیات تقریبی (تومان)</Label>
                <NumberInput
                  value={custLtv}
                  onChange={setCustLtv}
                  step={10000000}
                  min={0}
                />
              </div>
            </div>
            <Button
              type="submit"
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

export type { CustomerHealth };
