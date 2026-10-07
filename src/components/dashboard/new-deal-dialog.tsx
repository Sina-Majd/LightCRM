"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import {
  Building2,
  Wallet,
  User,
  Mail,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { Deal, DealPriority, PipelineStage } from "@/data/dashboard-mock-data";
import { formatToman } from "@/lib/fa";

interface NewDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stages: PipelineStage[];
  defaultStageId?: string;
  onCreateDeal: (newDeal: Deal) => void;
}

export function NewDealDialog({
  isOpen,
  onClose,
  stages,
  defaultStageId,
  onCreateDeal,
}: NewDealDialogProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [value, setValue] = useState("");
  const [stageId, setStageId] = useState(
    defaultStageId || stages[0]?.id || "stage-new"
  );
  const [priority, setPriority] = useState<DealPriority>("high");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !value) return;

    const numericValue =
      parseFloat(value.replace(/[^0-9.]/g, "")) || 150000000;

    const deal: Deal = {
      id: `deal-${Date.now()}`,
      title,
      company,
      contact: contact || "مخاطب اصلی",
      email: email || "contact@company.ir",
      phone: "۰۲۱۸۸۰۰۰۰۰۰",
      value: numericValue,
      formattedValue: formatToman(numericValue),
      stageId: stageId || defaultStageId || stages[0]?.id,
      priority,
      probability:
        stageId === "stage-won"
          ? 100
          : stageId === "stage-negotiation"
          ? 85
          : 50,
      tags: ["معامله جدید"],
      notes: notes || "ثبت‌شده از طریق پایپ‌لاین سریع.",
      daysInStage: 0,
      lastActivity: "همین حالا",
      nextActionTitle: "پیگیری اولیه و تماس با رابط مشتری",
      nextActionDue: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      assignee: {
        name: "شما",
        avatar: "",
      },
    };

    onCreateDeal(deal);
    onClose();

    // Reset form
    setTitle("");
    setCompany("");
    setContact("");
    setEmail("");
    setValue("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-3xl border border-brand-100 bg-white p-6 shadow-2xl text-right" dir="rtl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-brand-700 text-xs font-black mb-1">
            <Sparkles className="h-4 w-4" />
            <span>ایجاد معامله جدید</span>
          </div>
          <DialogTitle className="text-xl font-black text-slate-900">
            افزودن معامله به پایپ‌لاین فروش
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-bold">
            کارت پرونده معامله را برای پیگیری مراحل فروش ثبت کنید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="title" requiredIndicator>
              عنوان معامله
            </Label>
            <Input
              id="title"
              required
              placeholder="مثلاً: توسعه نرم‌افزار سازمانی"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 text-xs rounded-xl border-brand-100 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company" requiredIndicator>
                نام شرکت
              </Label>
              <Input
                id="company"
                required
                placeholder="نام شرکت طرف حساب"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                icon={<Building2 className="h-3.5 w-3.5" />}
                className="h-10 text-xs rounded-xl border-brand-100 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="value" requiredIndicator>
                ارزش تخمینی (تومان)
              </Label>
              <Input
                id="value"
                required
                type="number"
                placeholder="150000000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                icon={<Wallet className="h-3.5 w-3.5 text-emerald-600" />}
                className="h-10 text-xs rounded-xl border-brand-100 bg-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact">رابط اصلی</Label>
              <Input
                id="contact"
                placeholder="نام رابط تصمیم‌گیرنده"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                icon={<User className="h-3.5 w-3.5" />}
                className="h-10 text-xs rounded-xl border-brand-100 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">ایمیل کاری</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.ir"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-3.5 w-3.5" />}
                className="h-10 text-xs rounded-xl border-brand-100 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="stage-select">مرحله اولیه</Label>
              <Select value={stageId} onValueChange={setStageId}>
                <SelectTrigger id="stage-select" className="h-10 rounded-xl border-brand-100 bg-white">
                  <SelectValue placeholder="انتخاب مرحله" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-brand-100 bg-white">
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority-select">اولویت</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as DealPriority)}
              >
                <SelectTrigger id="priority-select" className="h-10 rounded-xl border-brand-100 bg-white">
                  <SelectValue placeholder="انتخاب اولویت" />
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

          <div className="space-y-1.5">
            <Label htmlFor="notes">یادداشت و توافقات اولیه</Label>
            <Input
              id="notes"
              placeholder="نکات کلیدی یا نیازمندی‌های مطرح‌شده…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-10 text-xs rounded-xl border-brand-100 bg-white"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-brand-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs rounded-xl border-brand-200 hover:bg-brand-50 font-bold"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="gap-1.5 rounded-xl text-xs bg-brand-700 hover:bg-brand-800 text-white shadow-sm shadow-brand-700/20 font-black cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              ثبت معامله
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
