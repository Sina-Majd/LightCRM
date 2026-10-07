"use client";

import React, { useState } from "react";
import {
  Plus,
  Clock,
  Mail,
  Phone,
  Video,
  FileText,
  Sparkles,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner";
import { CRMTask, DealPriority } from "@/data/dashboard-mock-data";
import { formatJalaliDate, faDigits } from "@/lib/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  tasks: CRMTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (t: CRMTask) => void;
  onDeleteTask?: (id: string) => void;
}

const TYPE_FA = {
  call: "تماس تلفنی",
  email: "ارسال ایمیل",
  meeting: "جلسه کاری",
  review: "بررسی و اقدام",
} as const;

const PRI_FA: Record<DealPriority, { fa: string; cls: string }> = {
  urgent: { fa: "فوری", cls: "bg-rose-50 text-rose-800 border-rose-200 font-black" },
  high: { fa: "مهم", cls: "bg-amber-50 text-amber-900 border-amber-200 font-black" },
  medium: { fa: "عادی", cls: "bg-brand-50 text-brand-900 border-brand-200 font-black" },
  low: { fa: "کم", cls: "bg-slate-100 text-slate-700 border-slate-200 font-black" },
};

export function TasksView({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}: Props) {
  const [tab, setTab] = useState("all");
  const [title, setTitle] = useState("");
  const [related, setRelated] = useState("");
  const [type, setType] = useState<"call" | "email" | "meeting" | "review">("call");
  const [pri, setPri] = useState<DealPriority>("high");
  const [toDelete, setToDelete] = useState<CRMTask | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: title.trim(),
      type,
      dueDate: new Date().toISOString().split("T")[0],
      dueCategory: "today",
      priority: pri,
      completed: false,
      relatedTo: related.trim() || "عمومی",
      relatedType: "deal",
    });
    toast.success("وظیفه جدید با موفقیت ثبت شد.");
    setTitle("");
    setRelated("");
  };

  const filtered = React.useMemo(() => {
    const seen = new Set<string>();
    return tasks.filter((t) => {
      if (!t?.id || seen.has(t.id)) return false;
      seen.add(t.id);
      if (tab === "pending") return !t.completed;
      if (tab === "completed") return t.completed;
      if (tab === "urgent")
        return !t.completed && (t.priority === "urgent" || t.priority === "high");
      return true;
    });
  }, [tasks, tab]);

  const pending = tasks.filter((t) => !t.completed).length;
  const icons = { call: Phone, email: Mail, meeting: Video, review: FileText };

  return (
    <div className="mx-auto max-w-5xl space-y-5" dir="rtl">
      {/* Quick Task Creator Card */}
      <div className="rounded-3xl border border-brand-100/80 bg-white p-5 shadow-sm">
        <div className="mb-3.5 flex items-center gap-2 text-[12.5px] font-black text-brand-800">
          <Sparkles className="h-4 w-4 text-brand-600" />
          <span>ثبت سریع پیگیری و وظیفه فروش</span>
        </div>
        <form onSubmit={submit} className="grid gap-2.5 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: تماس با مهندس رضایی جهت تایید پیش‌فاکتور…"
              className="h-10 rounded-xl border-brand-100 bg-white text-[13px]"
            />
          </div>
          <div className="sm:col-span-3">
            <Input
              value={related}
              onChange={(e) => setRelated(e.target.value)}
              placeholder="مربوط به شرکت یا معامله…"
              className="h-10 rounded-xl border-brand-100 bg-white text-[13px]"
            />
          </div>
          <div className="sm:col-span-2">
            <Select value={type} onValueChange={(v) => setType(v as never)}>
              <SelectTrigger className="h-10 rounded-xl border-brand-100 bg-white text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-brand-100 bg-white">
                <SelectItem value="call">تماس تلفنی</SelectItem>
                <SelectItem value="email">ارسال ایمیل</SelectItem>
                <SelectItem value="meeting">جلسه کاری</SelectItem>
                <SelectItem value="review">بررسی و اقدام</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Select
              value={pri}
              onValueChange={(v) => setPri(v as DealPriority)}
            >
              <SelectTrigger className="h-10 flex-1 rounded-xl border-brand-100 bg-white text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-brand-100 bg-white">
                <SelectItem value="urgent">فوری</SelectItem>
                <SelectItem value="high">مهم</SelectItem>
                <SelectItem value="medium">عادی</SelectItem>
                <SelectItem value="low">کم</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              className="h-10 w-10 shrink-0 rounded-xl bg-brand-700 font-bold text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-brand-100/80 bg-white p-2.5 shadow-sm">
        <div className="flex gap-1.5">
          {[
            ["all", `همه (${faDigits(tasks.length)})`],
            ["pending", `در انتظار انجام (${faDigits(pending)})`],
            ["urgent", "فوری و مهم"],
            ["completed", "انجام‌شده"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`rounded-xl px-4 py-2 text-[12px] font-black cursor-pointer transition-all ${
                tab === v
                  ? "bg-brand-950 text-white shadow-sm"
                  : "bg-brand-50/50 text-slate-600 hover:bg-brand-100/60"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <span className="hidden text-[12px] font-bold text-slate-400 sm:block px-2">
          {faDigits(pending)} اقدام باقی‌مانده
        </span>
      </div>

      {/* Tasks List */}
      <div className="rounded-3xl border border-brand-100/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-100/80 bg-brand-50/40 px-5 py-3.5">
          <div className="flex items-center gap-2 text-[13px] font-black text-slate-900">
            <Clock className="h-4 w-4 text-brand-700" />
            <span>برنامه پیگیری‌های امروز</span>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-brand-200 bg-white text-xs font-black text-brand-800"
          >
            {faDigits(filtered.length)} مورد
          </Badge>
        </div>
        <div className="space-y-2.5 p-4">
          {filtered.map((t) => {
            const Icon = icons[t.priority ? t.type : t.type] || Clock;
            const p = PRI_FA[t.priority] || PRI_FA.medium;
            return (
              <div
                key={t.id}
                className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                  t.completed
                    ? "border-slate-100 bg-slate-50/60 opacity-60"
                    : "border-brand-100/80 bg-white hover:border-brand-300 hover:shadow-sm"
                }`}
              >
                <Checkbox
                  checked={t.completed}
                  onCheckedChange={() => onToggleTask(t.id)}
                  className="mt-1"
                />
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 sm:flex">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onToggleTask(t.id)}
                      className={`text-right text-[13.5px] font-black leading-6 cursor-pointer ${
                        t.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-900 hover:text-brand-800"
                      }`}
                    >
                      {t.title}
                    </button>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge
                        className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-black ${p.cls}`}
                      >
                        {p.fa}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700 hover:bg-brand-50 rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-2xl border border-brand-100 bg-white p-1.5 shadow-xl"
                        >
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                            onClick={() => onToggleTask(t.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            {t.completed ? "بازگشت به انجام نشده" : "علامت‌گذاری به عنوان انجام‌شده"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                            onClick={() => toast.success("وظیفه برای فردا موکول شد.")}
                          >
                            <Calendar className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                            موکول به فردا
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer text-rose-600 text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-rose-50"
                            onClick={() => setToDelete(t)}
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                            حذف پیگیری
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-500">
                    <span className="rounded-full bg-brand-50 border border-brand-100 px-2.5 py-0.5 text-brand-800 font-bold">
                      {TYPE_FA[t.type]}
                    </span>
                    <span className="font-bold text-slate-700">{t.relatedTo}</span>
                    <span>·</span>
                    <span className="font-bold">{formatJalaliDate(t.dueDate)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-[13px] font-bold text-slate-400">
              هیچ وظیفه‌ای در این وضعیت ثبت نشده است. 🎉
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="حذف وظیفه"
        itemName={toDelete?.title}
        description="این وظیفه از لیست پیگیری‌های شما حذف می‌شود."
        confirmLabel="حذف وظیفه"
        onConfirm={() => {
          if (toDelete) onDeleteTask?.(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
