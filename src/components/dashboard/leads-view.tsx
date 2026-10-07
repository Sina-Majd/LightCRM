"use client";

import React, { useState } from "react";
import {
  Flame,
  UserPlus,
  Mail,
  Phone,
  ChevronLeft,
  Building2,
  Download,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { Lead, LeadStatus } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { faDigits } from "@/lib/fa";

interface Props {
  leads: Lead[];
  onConvertToDeal: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
  onDeleteLead?: (leadId: string) => void;
  onUpdateLeadStatus?: (leadId: string, status: LeadStatus) => void;
  searchQuery: string;
}

const STATUS_FA: Record<LeadStatus, { fa: string; cls: string }> = {
  hot: { fa: "داغ", cls: "bg-rose-50 text-rose-800 border-rose-200 font-black" },
  warm: { fa: "گرم", cls: "bg-amber-50 text-amber-900 border-amber-200 font-black" },
  qualified: { fa: "واجد شرایط", cls: "bg-brand-50 text-brand-900 border-brand-200 font-black" },
  cold: { fa: "سرد", cls: "bg-slate-100 text-slate-700 border-slate-200 font-black" },
};

export function LeadsView({
  leads,
  onConvertToDeal,
  onOpenNewLeadModal,
  onDeleteLead,
  onUpdateLeadStatus,
  searchQuery,
}: Props) {
  const [statusF, setStatusF] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [toDelete, setToDelete] = useState<Lead | null>(null);

  const filtered = React.useMemo(() => {
    const seen = new Set<string>();
    return leads.filter((l) => {
      if (!l?.id || seen.has(l.id)) return false;
      seen.add(l.id);
      const q = searchQuery.trim().toLowerCase();
      const okQ =
        !q || (l.name + l.company + l.email + l.title).toLowerCase().includes(q);
      const okS = statusF === "all" || l.status === statusF;
      return okQ && okS;
    });
  }, [leads, searchQuery, statusF]);

  const convert = (lead: Lead) => {
    onConvertToDeal(lead);
    toast.success("تبدیل با موفقیت انجام شد", {
      description: `${lead.name} به پایپ‌لاین فروش منتقل شد.`,
    });
  };

  const toggle = (id: string) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  return (
    <div className="space-y-4" dir="rtl">
      {/* Filter and Action Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-100/80 bg-white p-3 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {[
            ["all", "همه"],
            ["hot", "داغ"],
            ["warm", "گرم"],
            ["qualified", "واجد شرایط"],
            ["cold", "سرد"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setStatusF(v)}
              className={`rounded-xl px-3.5 py-2 text-[12px] font-black cursor-pointer transition-all ${
                statusF === v
                  ? "bg-brand-950 text-white shadow-sm"
                  : "bg-brand-50/50 text-slate-600 hover:bg-brand-100/60"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-bold text-slate-400">
            {faDigits(filtered.length)} سرنخ
          </span>
          <Button
            size="sm"
            onClick={onOpenNewLeadModal}
            className="h-9 gap-1.5 rounded-xl bg-brand-700 font-black text-white hover:bg-brand-800 shadow-sm shadow-brand-700/20"
          >
            <UserPlus className="h-4 w-4" />
            سرنخ جدید
          </Button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-[12.5px]">
          <b className="text-brand-900 font-black">
            {faDigits(selected.length)} رکورد انتخاب شده
          </b>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 rounded-xl bg-white text-xs font-bold"
              onClick={() => toast.success("خروجی با موفقیت تهیه شد")}
            >
              <Download className="h-3.5 w-3.5" />
              خروجی اکسل
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 gap-1 rounded-xl text-xs font-bold"
              onClick={() => {
                selected.forEach((id) => onDeleteLead?.(id));
                setSelected([]);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف
            </Button>
            <button
              onClick={() => setSelected([])}
              className="text-[12px] font-bold text-slate-500 cursor-pointer px-2"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-3xl border border-brand-100/80 bg-white shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-50/50 border-b border-brand-100 text-slate-700 font-black">
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    filtered.length > 0 && selected.length === filtered.length
                  }
                  onCheckedChange={(c) =>
                    setSelected(c ? filtered.map((l) => l.id) : [])
                  }
                />
              </TableHead>
              <TableHead>مخاطب و شرکت</TableHead>
              <TableHead>امتیاز کیفی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>ارزش تقریبی</TableHead>
              <TableHead>اقدام</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => {
              const st = STATUS_FA[lead.status];
              const sel = selected.includes(lead.id);
              return (
                <TableRow
                  key={lead.id}
                  className={`hover:bg-brand-50/30 transition ${
                    sel ? "bg-brand-50/60" : ""
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={sel}
                      onCheckedChange={() => toggle(lead.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-black text-slate-900">{lead.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-slate-500 font-bold">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      {lead.company} · {lead.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {lead.score >= 85 && (
                        <Flame className="h-4 w-4 fill-rose-500 text-rose-500" />
                      )}
                      <b
                        className={
                          lead.score >= 85
                            ? "text-rose-600 font-black"
                            : lead.score >= 70
                            ? "text-amber-600 font-black"
                            : "text-slate-500 font-bold"
                        }
                      >
                        {faDigits(lead.score)}
                      </b>
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                        <span
                          className="block h-full rounded-full bg-brand-600"
                          style={{ width: `${lead.score}%` }}
                        />
                      </span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${st.cls}`}
                    >
                      {st.fa}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <b className="font-black text-emerald-700 tracking-tight">
                      {lead.formattedValue}
                    </b>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => convert(lead)}
                        className="h-8 gap-1 rounded-xl bg-brand-50 text-brand-800 border border-brand-200 hover:bg-brand-700 hover:text-white font-black text-xs"
                      >
                        تبدیل به معامله <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-brand-50 rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-2xl border border-brand-100 bg-white p-1.5 shadow-xl text-right"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                            onClick={() => onUpdateLeadStatus?.(lead.id, "hot")}
                          >
                            تغییر به سرنخ داغ
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-brand-50"
                            onClick={() =>
                              onUpdateLeadStatus?.(lead.id, "qualified")
                            }
                          >
                            تغییر به واجد شرایط
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-rose-600 text-xs font-bold rounded-xl py-2 px-2.5 hover:bg-rose-50"
                            onClick={() => setToDelete(lead)}
                          >
                            حذف سرنخ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-slate-400 font-bold"
                >
                  سرنخی با این مشخصات یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Stack */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((lead) => {
          const st = STATUS_FA[lead.status];
          return (
            <div
              key={lead.id}
              className="rounded-3xl border border-brand-100/80 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-black text-slate-900">{lead.name}</div>
                  <div className="mt-0.5 text-[12px] text-slate-500 font-bold">
                    {lead.company}
                  </div>
                </div>
                <Badge
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${st.cls}`}
                >
                  {st.fa}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-brand-100/60 pt-3">
                <b className="font-black text-emerald-700 tracking-tight">
                  {lead.formattedValue}
                </b>
                <span className="flex gap-1.5">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700"
                    aria-label="تماس"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${lead.email}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700"
                    aria-label="ایمیل"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <Button
                    size="sm"
                    onClick={() => convert(lead)}
                    className="h-9 rounded-xl bg-brand-700 font-black text-white hover:bg-brand-800"
                  >
                    تبدیل
                  </Button>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="حذف سرنخ"
        itemName={toDelete ? `${toDelete.name}` : undefined}
        description="این سرنخ برای همیشه از لیست خارج می‌شود."
        confirmLabel="حذف سرنخ"
        onConfirm={() => {
          if (toDelete) {
            onDeleteLead?.(toDelete.id);
            setToDelete(null);
          }
        }}
      />
    </div>
  );
}
