"use client";

import { useAsyncAction, type AsyncAction } from "@/lib/use-async-action";

import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Plus, Trophy, Wallet, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { Deal, PipelineStage } from "@/lib/crm/types";
import { probabilityForStage, isWonStage } from "@/lib/crm/pipeline";
import { dedupeById } from "@/lib/crm/collections";
import { formatTomanCompact, faDigits } from "@/lib/fa";
import { DealCard } from "./deal-card";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { useIsDesktop } from "@/lib/hooks";

/** Stage accent — one hue per stage, used as a hairline not a block of colour. */
const STAGE_ACCENT = [
  { dot: "bg-sky-500", text: "text-sky-700" },
  { dot: "bg-brand-600", text: "text-brand-700" },
  { dot: "bg-indigo-500", text: "text-indigo-700" },
  { dot: "bg-amber-500", text: "text-amber-700" },
  { dot: "bg-emerald-500", text: "text-emerald-700" },
];

const PRIORITY_FILTERS = [
  { v: "all", label: "همه" },
  { v: "urgent", label: "فوری" },
  { v: "high", label: "مهم" },
  { v: "medium", label: "عادی" },
];

interface Props {
  stages: PipelineStage[];
  deals: Deal[];
  onDealsChange: AsyncAction<[Deal[]]>;
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDealModal: (stageId?: string) => void;
  onDeleteDeal?: AsyncAction<[string]>;
  onOpenQuickCall?: (deal: Deal) => void;
  searchQuery: string;
}

export function PipelineBoard({
  stages,
  deals,
  onDealsChange,
  onSelectDeal,
  onOpenNewDealModal,
  onDeleteDeal,
  onOpenQuickCall,
  searchQuery,
}: Props) {
  const { isPending, run } = useAsyncAction();
  const isDesktop = useIsDesktop();
  const [filter, setFilter] = useState("all");
  const [toDelete, setToDelete] = useState<Deal | null>(null);
  const [mobileStage, setMobileStage] = useState(stages[0]?.id || "");

  const filtered = React.useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    return dedupeById(deals).filter((d) => {
      const okQ =
        !q ||
        (d.title + (d.company || "") + (d.contact || "")).toLowerCase().includes(q);
      const okP = filter === "all" || d.priority === filter;
      return okQ && okP;
    });
  }, [deals, searchQuery, filter]);

  const activeDeals = deals.filter((d) => !isWonStage(stages, d.stageId));
  const wonDeals = deals.filter((d) => isWonStage(stages, d.stageId));
  const activeValue = activeDeals.reduce((s, d) => s + d.value, 0);
  const wonValue = wonDeals.reduce((s, d) => s + d.value, 0);
  const winRate =
    deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;
  const weighted = activeDeals.reduce((s, d) => s + d.value * (d.probability / 100), 0);

  const inStage = (d: Deal, id: string) =>
    d.stageId === id || (!d.stageId && id === stages[0]?.id);

  const getStageColor = (stage: PipelineStage, index: number) => {
    if (stage.id === "stage-won" || stage.title.includes("موفق"))
      return STAGE_ACCENT[4];
    if (stage.id === "stage-negotiation" || stage.title.includes("مذاکره"))
      return STAGE_ACCENT[3];
    if (stage.id === "stage-proposal" || stage.title.includes("پیش‌فاکتور"))
      return STAGE_ACCENT[2];
    if (stage.id === "stage-qualified" || stage.title.includes("ارزیابی"))
      return STAGE_ACCENT[1];
    return STAGE_ACCENT[index % STAGE_ACCENT.length];
  };

  const move = async (dealId: string, target: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stageId === target) return;
    const targetStage = stages.find((s) => s.id === target);

    const prev = deals;
    const saved = await run(() => onDealsChange(
      deals.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stageId: target,
              daysInStage: 0,
              lastActivity: "همین حالا",
              probability: probabilityForStage(stages, target),
            }
          : d
      )
    ));
    if (!saved) return;
    toast(
      isWonStage(stages, target) ? "معامله برده شد 🎉" : "مرحله معامله به‌روزرسانی شد",
      {
        description: `${deal.company} → ${targetStage?.title || target}`,
        action: { label: "بازگردانی", onClick: () => { void run(() => onDealsChange(prev)); } },
      }
    );
  };

  const onDragEnd = async (r: DropResult) => {
    const { source, destination, draggableId } = r;
    if (!destination || isPending) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const moved = deals.find((d) => d.id === draggableId);
    if (!moved) return;

    const dest = destination.droppableId;

    const updated: Deal = {
      ...moved,
      stageId: dest,
      daysInStage: source.droppableId === dest ? moved.daysInStage : 0,
      lastActivity: "همین حالا",
      probability: probabilityForStage(stages, dest),
    };

    const others = deals.filter((d) => d.id !== draggableId);
    const destList = others.filter((d) => inStage(d, dest));
    destList.splice(Math.min(destination.index, destList.length), 0, updated);

    const next: Deal[] = [];
    for (const st of stages) {
      if (st.id === dest) next.push(...destList);
      else next.push(...others.filter((d) => inStage(d, st.id)));
    }
    const ids = new Set(next.map((d) => d.id));
    for (const d of others) if (!ids.has(d.id)) next.push(d);
    if (!await run(() => onDealsChange(next))) return;

    if (isWonStage(stages, dest)) {
      toast.success("معامله با موفقیت برده شد 🎉", {
        description: `${moved.company} نهایی شد.`,
      });
    }
  };

  const column = (stage: PipelineStage, index: number, mobile = false) => {
    const list = filtered.filter((d) => inStage(d, stage.id));
    const sum = list.reduce((s, d) => s + d.value, 0);
    const color = getStageColor(stage, index);
    const share = activeValue > 0 ? (sum / activeValue) * 100 : 0;

    return (
      <div
        key={stage.id}
        id={`pipeline-col-${stage.id}`}
        className={`flex flex-col rounded-2xl border border-slate-200 bg-slate-100/60 ${
          mobile ? "min-w-[84vw] snap-center sm:min-w-[320px]" : ""
        }`}
      >
        {/* Stage header */}
        <div className="border-b border-slate-200 px-4 pb-3.5 pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <span className={`size-2.5 shrink-0 rounded-full ${color.dot}`} />
              <span className="truncate text-[13.5px] font-black text-slate-900">
                {stage.title}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-black tabular-nums text-slate-600 ring-1 ring-slate-200">
              {faDigits(list.length)}
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <span className="text-[11.5px] font-bold text-slate-600">جمع مرحله</span>
            <span className={`text-[12.5px] font-black tabular-nums ${color.text}`}>
              {formatTomanCompact(sum)}
            </span>
          </div>

          {/* Share of active pipeline */}
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${color.dot}`}
                style={{ width: `${Math.min(100, share)}%` }}
              />
            </div>
            <span className="shrink-0 text-[10.5px] font-black tabular-nums text-slate-600">
              {faDigits(Math.round(share))}٪
            </span>
          </div>
        </div>

        {/* Droppable stack */}
        {isDesktop && !mobile ? (
          <Droppable droppableId={stage.id}>
            {(provided, snap) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex flex-1 flex-col gap-2 p-2 transition-colors ${
                  snap.isDraggingOver ? "bg-brand-50" : ""
                }`}
              >
                {list.map((deal, idx) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    index={idx}
                    stages={stages}
                    isDraggable={!isPending}
                    onSelect={onSelectDeal}
                    onDeleteDeal={() => setToDelete(deal)}
                    onMoveToStage={move}
                    onOpenQuickCall={onOpenQuickCall}
                  />
                ))}
                {provided.placeholder}
                {list.length === 0 && !snap.isDraggingOver && (
                  <button
                    onClick={() => onOpenNewDealModal(stage.id)}
                    className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-white text-[12px] font-bold text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                  >
                    <Plus className="size-4" />
                    ایجاد معامله در این مرحله
                  </button>
                )}
              </div>
            )}
          </Droppable>
        ) : (
          <div className="flex flex-1 flex-col gap-2 p-2">
            {list.map((deal, idx) => (
              <DealCard
                key={deal.id}
                deal={deal}
                index={idx}
                stages={stages}
                isDraggable={false}
                showNextStageButton
                onSelect={onSelectDeal}
                onDeleteDeal={() => setToDelete(deal)}
                onMoveToStage={move}
                onOpenQuickCall={onOpenQuickCall}
              />
            ))}
            {list.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-[11.5px] text-slate-600">
                معامله‌ای در این مرحله نیست
              </div>
            )}
          </div>
        )}

        {/* Quick add */}
        <div className="border-t border-slate-200 p-2">
          <button
            onClick={() => onOpenNewDealModal(stage.id)}
            className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl text-[11.5px] font-bold text-slate-600 transition-colors hover:bg-white hover:text-brand-800"
          >
            <Plus className="size-3.5" />
            افزودن
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* ===== KPI row — one figure per cell, evenly weighted ===== */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            icon: Wallet,
            label: "پایپ‌لاین فعال",
            value: formatTomanCompact(activeValue),
            meta: `${faDigits(activeDeals.length)} معامله در جریان`,
            valueClass: "text-slate-900",
            iconClass: "text-brand-700 bg-brand-50",
          },
          {
            icon: Target,
            label: "ارزش وزنی",
            value: formatTomanCompact(weighted),
            meta: "محاسبه‌شده با احتمالات",
            valueClass: "text-slate-900",
            iconClass: "text-indigo-700 bg-indigo-50",
          },
          {
            icon: Trophy,
            label: "برنده و بسته‌شده",
            value: formatTomanCompact(wonValue),
            meta: `${faDigits(wonDeals.length)} قرارداد منعقد`,
            valueClass: "text-emerald-700",
            iconClass: "text-emerald-700 bg-emerald-50",
          },
          {
            icon: TrendingUp,
            label: "نرخ برد",
            value: `${faDigits(winRate)}٪`,
            meta: `${faDigits(wonDeals.length)} از ${faDigits(deals.length)} معامله`,
            valueClass: "text-brand-800",
            iconClass: "text-brand-700 bg-brand-50",
            // Win rate is the only ratio here — show it as one.
            meter: winRate,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${s.iconClass}`}
              >
                <s.icon className="size-4" />
              </span>
              <span className="text-[12px] font-bold text-slate-600">{s.label}</span>
            </div>
            <div
              className={`mt-2.5 text-[19px] font-black tabular-nums leading-tight ${s.valueClass}`}
            >
              {s.value}
            </div>
            {s.meter !== undefined ? (
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${s.meter}%` }}
                />
              </div>
            ) : (
              <div className="mt-1 text-[11px] font-medium text-slate-600">{s.meta}</div>
            )}
          </div>
        ))}
      </div>

      {/* ===== Toolbar — filter + primary action, on their own row ===== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-slate-600">فیلتر اولویت</span>
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f.v}
                onClick={() => setFilter(f.v)}
                className={`cursor-pointer rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition ${
                  filter === f.v
                    ? "bg-white text-brand-800 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {filtered.length !== deals.length && (
            <span className="text-[11.5px] font-bold text-slate-600">
              {faDigits(filtered.length)} از {faDigits(deals.length)} معامله
            </span>
          )}
          <Button
            size="sm"
            onClick={() => onOpenNewDealModal()}
            className="h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-brand-700 px-4 text-xs font-black text-white hover:bg-brand-800"
          >
            <Plus className="size-4" />
            معامله جدید
          </Button>
        </div>
      </div>

      {/* Mobile stage selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        {stages.map((s, idx) => {
          const color = getStageColor(s, idx);
          return (
            <button
              key={s.id}
              onClick={() => {
                setMobileStage(s.id);
                document
                  .getElementById(`pipeline-col-${s.id}`)
                  ?.scrollIntoView({ behavior: "smooth", inline: "center" });
              }}
              className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition ${
                mobileStage === s.id
                  ? "border-brand-600 bg-brand-50 text-brand-900"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <span className={`size-1.5 rounded-full ${color.dot}`} />
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Columns */}
      {isDesktop ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid items-start gap-3 md:grid-cols-3 xl:grid-cols-5">
            {stages.map((s, idx) => column(s, idx))}
          </div>
        </DragDropContext>
      ) : (
        <div className="flex snap-x gap-3 overflow-x-auto pb-4">
          {stages.map((s, idx) => column(s, idx, true))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="حذف معامله"
        itemName={toDelete ? `${toDelete.title} (${toDelete.company})` : undefined}
        description="این معامله از پایپ‌لاین حذف می‌شود و پرونده آن بسته خواهد شد."
        confirmLabel="حذف معامله"
        onConfirm={async () => {
          if (!toDelete || !onDeleteDeal || await onDeleteDeal(toDelete.id) === false) return false;
          setToDelete(null);
        }}
      />
    </div>
  );
}
