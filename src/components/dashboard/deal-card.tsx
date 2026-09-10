"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Draggable } from "@hello-pangea/dnd";
import {
  Building2,
  Clock,
  User,
  TrendingUp,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Mail,
} from "lucide-react";
import { Deal } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DealCardProps {
  deal: Deal;
  index: number;
  onSelect: (deal: Deal) => void;
  onDeleteDeal?: (dealId: string) => void;
  onMoveToStage?: (dealId: string, stageId: string) => void;
}

const priorityConfig = {
  urgent: {
    label: "Urgent",
    badge: "border-rose-500/40 text-rose-300 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
    dot: "bg-rose-400 animate-pulse",
  },
  high: {
    label: "High",
    badge: "border-amber-500/40 text-amber-300 bg-amber-500/10",
    dot: "bg-amber-400",
  },
  medium: {
    label: "Medium",
    badge: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
    dot: "bg-cyan-400",
  },
  low: {
    label: "Low",
    badge: "border-zinc-700 text-zinc-400 bg-zinc-800/40",
    dot: "bg-zinc-500",
  },
};

export function DealCard({
  deal,
  index,
  onSelect,
  onDeleteDeal,
  onMoveToStage,
}: DealCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const priority = priorityConfig[deal.priority];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => {
        const cardContent = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => onSelect(deal)}
            style={{
              ...provided.draggableProps.style,
            }}
            className={`group relative rounded-xl border p-4 select-none cursor-grab active:cursor-grabbing ${
              snapshot.isDragging
                ? "border-cyan-500 bg-[#161626] shadow-[0_24px_48px_rgba(0,0,0,0.85),0_0_20px_rgba(56,189,248,0.25)] ring-2 ring-cyan-400/60 z-[9999]"
                : "border-white/[0.08] bg-[#111118] hover:border-white/20 hover:bg-[#151522] hover:shadow-md transition-colors duration-150"
            }`}
          >
            {/* Top Row: Company Name & Priority Badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                  {deal.company}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono py-0 px-2 flex items-center gap-1 font-medium shrink-0 ${priority.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                  {priority.label}
                </Badge>
              </div>
            </div>

            {/* Deal Title */}
            <div className="mt-2">
              <h4 className="text-xs font-medium text-zinc-100 leading-snug line-clamp-2 group-hover:text-cyan-200 transition-colors">
                {deal.title}
              </h4>
            </div>

            {/* Tags */}
            {deal.tags && deal.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {deal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] text-zinc-400 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Probability Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-cyan-400" />
                  <span>Win Probability</span>
                </span>
                <span className="font-semibold text-zinc-300">{deal.probability}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
            </div>

            {/* Contact Person */}
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <User className="h-3 w-3 text-zinc-500 shrink-0" />
              <span className="truncate">{deal.contact}</span>
            </div>

            {/* Bottom Row: Deal Value & Quick Actions */}
            <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
              <div className="font-mono text-sm font-bold text-emerald-400 tracking-tight">
                {deal.formattedValue}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                  <Clock className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span className="leading-none">{deal.daysInStage}d</span>
                </div>

                {/* Card Context Menu via Shadcn DropdownMenu (All secondary actions housed here) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="h-6 w-6 p-0 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-52 bg-[#12121c] border-white/10 text-zinc-100 p-1 shadow-2xl"
                  >
                    <DropdownMenuLabel className="text-[10px] font-mono uppercase text-zinc-500">
                      Opportunity Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(deal);
                      }}
                      className="text-xs cursor-pointer flex items-center gap-2 text-cyan-300"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span>Inspect Details</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `mailto:${deal.email}`;
                      }}
                      className="text-xs cursor-pointer flex items-center gap-2"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email {deal.contact}</span>
                    </DropdownMenuItem>

                    {deal.stageId !== "stage-won" && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveToStage?.(deal.id, "stage-won");
                        }}
                        className="text-xs cursor-pointer flex items-center gap-2 text-emerald-400"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Move to Closed Won</span>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDeal?.(deal.id);
                      }}
                      className="text-xs cursor-pointer flex items-center gap-2 text-red-400 focus:text-red-300 focus:bg-red-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Opportunity</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );

        // When dragging, use createPortal to document.body to prevent containing block offset bugs
        if (snapshot.isDragging && isMounted && typeof document !== "undefined") {
          return ReactDOM.createPortal(cardContent, document.body);
        }

        return cardContent;
      }}
    </Draggable>
  );
}
