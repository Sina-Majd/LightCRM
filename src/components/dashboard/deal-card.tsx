"use client";

import React from "react";
import ReactDOM from "react-dom";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import {
  Clock,
  MoreHorizontal,
  Trash2,
  Eye,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  CalendarCheck,
  PhoneCall,
} from "lucide-react";
import { Deal, PipelineStage } from "@/data/dashboard-mock-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDealNextActionState, faDigits } from "@/lib/fa";

interface Props {
  deal: Deal;
  index?: number;
  stages?: PipelineStage[];
  showNextStageButton?: boolean;
  isDraggable?: boolean;
  onSelect: (deal: Deal) => void;
  onDeleteDeal?: (dealId: string) => void;
  onMoveToStage?: (dealId: string, stageId: string) => void;
  onOpenQuickCall?: (deal: Deal) => void;
}

const PRI: Record<string, { fa: string; dot: string; chip: string }> = {
  urgent: { fa: "فوری", dot: "bg-rose-500", chip: "border-rose-200 bg-rose-50 text-rose-800" },
  high: { fa: "مهم", dot: "bg-amber-500", chip: "border-amber-200 bg-amber-50 text-amber-900" },
  medium: { fa: "عادی", dot: "bg-brand-600", chip: "border-brand-200 bg-brand-50 text-brand-900" },
  low: { fa: "کم", dot: "bg-slate-400", chip: "border-slate-200 bg-slate-100 text-slate-700" },
};

export function DealCard({
  deal,
  index = 0,
  stages = [],
  showNextStageButton = false,
  isDraggable = true,
  onSelect,
  onDeleteDeal,
  onMoveToStage,
  onOpenQuickCall,
}: Props) {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [open, setOpen] = React.useState(false);
  const pr = PRI[deal.priority] || PRI.medium;
  const stageIdx = stages.findIndex((s) => s.id === deal.stageId);
  const next = stageIdx >= 0 && stageIdx < stages.length - 1 ? stages[stageIdx + 1] : null;

  const nextActionState = getDealNextActionState(deal.nextActionDue, deal.nextActionTitle);
  const alert = nextActionState.isStale || nextActionState.isOverdue;

  const body = (provided?: DraggableProvided, snapshot?: DraggableStateSnapshot) => {
    const dragging = snapshot?.isDragging ?? false;

    return (
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        onClick={(e) => {
          const t = e.target as HTMLElement;
          if (t.closest("button,[role=menu],[data-radix-dropdown-menu-content]")) return;
          onSelect(deal);
        }}
        style={provided?.draggableProps?.style}
        className={cn(
          // Alert state is carried by the rail, not a card-wide tint.
          "group relative cursor-pointer rounded-xl border border-slate-200 bg-white transition-shadow select-none hover:shadow-md",
          alert ? "border-r-2 border-r-rose-500" : "border-r-2 border-r-transparent",
          dragging
            ? "z-[9999] border-brand-600 opacity-95 shadow-2xl ring-2 ring-brand-500/30"
            : "",
          isDraggable && !dragging && "cursor-grab active:cursor-grabbing"
        )}
      >
        <div className="p-3.5">
          {/* Row 1 — stage position + priority */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              {stageIdx >= 0 && (
                <span className="shrink-0 text-[10.5px] font-black tabular-nums text-slate-400">
                  {faDigits(stageIdx + 1)}/{faDigits(stages.length)}
                </span>
              )}
              <span className="truncate text-[12px] font-bold text-slate-600">
                {deal.company}
              </span>
            </span>

            <span className="flex shrink-0 items-center gap-1">
              <span className={`size-1.5 rounded-full ${pr.dot}`} />
              <span className="text-[10.5px] font-bold text-slate-600">{pr.fa}</span>
            </span>
          </div>

          {/* Row 2 — title */}
          <h4 className="mt-2 line-clamp-2 text-[13px] font-black leading-6 text-slate-900">
            {deal.title}
          </h4>

          {/* Row 3 — value + probability on one line */}
          <div className="mt-2.5 flex items-end justify-between gap-2">
            <span className="text-[15px] font-black tabular-nums text-slate-900">
              {deal.formattedValue}
            </span>
            <span className="shrink-0 text-[11px] font-black tabular-nums text-slate-500">
              {faDigits(deal.probability)}٪
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{ width: `${deal.probability}%` }}
            />
          </div>

          {/* Row 4 — next action. The reason the card exists. */}
          <div
            className={cn(
              "mt-2.5 flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-bold",
              nextActionState.badgeClass
            )}
          >
            {nextActionState.isStale ? (
              <AlertCircle className="size-3.5 shrink-0" />
            ) : (
              <CalendarCheck className="size-3.5 shrink-0" />
            )}
            <span className="truncate">{nextActionState.label}</span>
          </div>

          {/* Row 5 — quiet metadata */}
          <div className="mt-2.5 flex items-center gap-2.5 text-[10.5px] text-slate-500">
            <span className="flex shrink-0 items-center gap-1">
              <Clock className="size-3" />
              {faDigits(deal.daysInStage)} روز
            </span>
            <span className="h-3 w-px shrink-0 bg-slate-200" />
            <span className="truncate">{deal.contact}</span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-between gap-2 border-t border-slate-100 px-2 py-1.5"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {showNextStageButton && next ? (
            <button
              onClick={() => onMoveToStage?.(deal.id, next.id)}
              className="flex h-7 max-w-[60%] cursor-pointer items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-2 text-[11px] font-bold text-brand-800 transition-colors hover:bg-brand-100"
            >
              <span className="truncate">{next.title}</span>
              <ChevronLeft className="size-3 shrink-0" />
            </button>
          ) : (
            <span />
          )}

          <div className="flex shrink-0 items-center gap-1">
            {onOpenQuickCall && (
              <button
                onClick={() => onOpenQuickCall(deal)}
                aria-label={`ثبت تماس با ${deal.company}`}
                title="ثبت تماس"
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                <PhoneCall className="size-3.5" />
              </button>
            )}
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-7 cursor-pointer p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 rounded-xl border border-slate-200 bg-white p-1.5"
                onCloseAutoFocus={(e: Event) => e.preventDefault()}
              >
                <DropdownMenuLabel className="px-2 py-1 text-right text-[11px] font-black text-slate-500">
                  عملیات معامله
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onSelect(deal)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-right text-xs font-bold hover:bg-brand-50 hover:text-brand-900"
                >
                  <Eye className="size-3.5 shrink-0 text-brand-600" />
                  مشاهده و تعیین اقدام بعدی
                </DropdownMenuItem>
                {onOpenQuickCall && (
                  <DropdownMenuItem
                    onClick={() => onOpenQuickCall(deal)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-right text-xs font-bold hover:bg-brand-50 hover:text-brand-900"
                  >
                    <PhoneCall className="size-3.5 shrink-0 text-brand-600" />
                    ثبت تماس
                  </DropdownMenuItem>
                )}
                {next && (
                  <DropdownMenuItem
                    onClick={() => onMoveToStage?.(deal.id, next.id)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-right text-xs font-bold hover:bg-brand-50 hover:text-brand-900"
                  >
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                    انتقال به: {next.title}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem
                  onClick={() => onDeleteDeal?.(deal.id)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-right text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="size-3.5 shrink-0" />
                  حذف معامله
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  };

  if (!isDraggable) {
    return body();
  }

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => {
        const cardNode = body(provided, snapshot);
        if (snapshot.isDragging && isMounted) {
          return ReactDOM.createPortal(cardNode, document.body);
        }
        return cardNode;
      }}
    </Draggable>
  );
}