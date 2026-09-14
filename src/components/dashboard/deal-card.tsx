import React from "react";
import ReactDOM from "react-dom";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import {
  Building2,
  Clock,
  User,
  TrendingUp,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Eye,
  Mail,
  ArrowRight,
  Kanban,
  ChevronDown,
} from "lucide-react";
import { Deal, PipelineStage } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

interface DealCardProps {
  deal: Deal;
  index?: number;
  stages?: PipelineStage[];
  showNextStageButton?: boolean;
  isDraggable?: boolean;
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

function useIsDesktop(): boolean {
  return React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => (typeof window !== "undefined" ? window.innerWidth >= 768 : true),
    () => true
  );
}

export function DealCard({
  deal,
  index = 0,
  stages = [],
  showNextStageButton = false,
  isDraggable = true,
  onSelect,
  onDeleteDeal,
  onMoveToStage,
}: DealCardProps) {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isStageMenuOpen, setIsStageMenuOpen] = React.useState(false);
  const isDesktop = useIsDesktop();

  const handleOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
    if (!open) {
      setIsStageMenuOpen(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        "button, [role='button'], [role='menu'], [role='menuitem'], [data-radix-dropdown-menu-content]"
      )
    ) {
      return;
    }
    onSelect(deal);
  };

  const priority = priorityConfig[deal.priority];

  // Calculate next logical stage in pipeline progression
  const currentStageIndex = stages.findIndex((s) => s.id === deal.stageId);
  const nextStage =
    currentStageIndex >= 0 && currentStageIndex < stages.length - 1
      ? stages[currentStageIndex + 1]
      : null;

  const renderCardContent = (
    provided?: DraggableProvided,
    snapshot?: DraggableStateSnapshot
  ) => {
    const isDragging = snapshot?.isDragging ?? false;

    return (
      <div
        ref={provided?.innerRef}
        {...(provided ? provided.draggableProps : {})}
        {...(provided ? provided.dragHandleProps : {})}
        onClick={handleCardClick}
        style={{
          ...(provided?.draggableProps?.style || {}),
        }}
        className={`group relative rounded-xl border p-4 select-none ${
          isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
        } ${
          isDragging
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

            {/* Deal Title - Clickable for details */}
            <div
              onClick={() => onSelect(deal)}
              className="cursor-pointer"
            >
              <h4 className="text-xs font-medium text-zinc-100 leading-snug line-clamp-2 hover:text-cyan-300 transition-colors">
                {deal.title}
              </h4>
            </div>

            {/* Tags */}
            {deal.tags && deal.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
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
            <div className="mt-2.5">
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
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <User className="h-3 w-3 text-zinc-500 shrink-0" />
              <span className="truncate">{deal.contact}</span>
            </div>

            {/* Bottom Row: Deal Value, Next Stage Action & Quick Actions */}
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/[0.06] gap-2"
            >
              <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400 tracking-tight">
                {deal.formattedValue}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* 1-Tap Next Stage Advancement (Mobile only) */}
                {showNextStageButton && nextStage && (
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveToStage?.(deal.id, nextStage.id);
                    }}
                    title={`Move to ${nextStage.title}`}
                    className="h-6 px-1.5 text-[10px] font-mono bg-cyan-500/[0.08] hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{nextStage.title.split(" ")[0]}</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Button>
                )}

                <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 hidden sm:flex">
                  <Clock className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span>{deal.daysInStage}d</span>
                </div>

                {/* Card Context Menu via DropdownMenu */}
                <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="h-7 w-7 p-0 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#12121c] border-white/10 text-zinc-100 p-1 shadow-2xl"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuLabel className="text-[10px] font-mono uppercase text-zinc-500">
                      Opportunity Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                        onSelect(deal);
                      }}
                      className="text-xs cursor-pointer flex items-center gap-2 text-cyan-300"
                    >
                      <Eye className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Inspect Details</span>
                    </DropdownMenuItem>

                    {/* Quick Move To Stage: Mobile (Inline Expandable) vs Desktop (Radix Submenu) */}
                    {stages.length > 0 &&
                      (!isDesktop ? (
                        <div>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsStageMenuOpen((prev) => !prev);
                            }}
                            className="w-full flex cursor-pointer select-none items-center justify-between rounded-lg px-2 py-1.5 text-xs outline-none transition-colors hover:bg-white/[0.08] hover:text-white text-zinc-300 active:bg-white/[0.1]"
                          >
                            <div className="flex items-center gap-2">
                              <Kanban className="h-3.5 w-3.5 text-cyan-400" />
                              <span>Move to Stage</span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 text-zinc-400 transition-transform duration-200",
                                isStageMenuOpen && "rotate-180"
                              )}
                            />
                          </div>

                          {isStageMenuOpen && (
                            <div className="my-1 ml-2.5 pl-2 border-l border-white/10 space-y-0.5 animate-in fade-in-0 zoom-in-95 duration-150">
                              {stages.map((stg) => (
                                <button
                                  key={stg.id}
                                  type="button"
                                  disabled={stg.id === deal.stageId}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onMoveToStage?.(deal.id, stg.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left text-xs py-1.5 px-2 rounded-md flex items-center justify-between transition-colors",
                                    stg.id === deal.stageId
                                      ? "opacity-40 text-zinc-500 cursor-not-allowed"
                                      : "text-zinc-300 hover:text-white hover:bg-white/[0.08] active:bg-cyan-500/20 active:text-cyan-300 cursor-pointer"
                                  )}
                                >
                                  <span>{stg.title}</span>
                                  {stg.id === deal.stageId && (
                                    <span className="text-[9px] font-mono text-zinc-500">
                                      Current
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="text-xs cursor-pointer flex items-center gap-2">
                            <Kanban className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Move to Stage</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent
                            sideOffset={6}
                            alignOffset={-4}
                            className="w-48 bg-[#12121c]/95 border-white/10 text-zinc-100 p-1 shadow-2xl backdrop-blur-2xl"
                          >
                            {stages.map((stg) => (
                              <DropdownMenuItem
                                key={stg.id}
                                disabled={stg.id === deal.stageId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMoveToStage?.(deal.id, stg.id);
                                }}
                                className={`text-xs cursor-pointer flex items-center justify-between ${
                                  stg.id === deal.stageId
                                    ? "opacity-50"
                                    : "hover:text-cyan-300"
                                }`}
                              >
                                <span>{stg.title}</span>
                                {stg.id === deal.stageId && (
                                  <span className="text-[9px] font-mono text-zinc-500">
                                    Current
                                  </span>
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      ))}

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(false);
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
                          setIsDropdownOpen(false);
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
                        setIsDropdownOpen(false);
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
      };

      if (!isDraggable) {
        return renderCardContent();
      }

      return (
        <Draggable draggableId={deal.id} index={index}>
          {(provided, snapshot) => {
            const cardContent = renderCardContent(provided, snapshot);

            // When dragging, use createPortal to document.body to prevent containing block offset bugs
            if (snapshot.isDragging && isMounted && typeof document !== "undefined") {
              return ReactDOM.createPortal(cardContent, document.body);
            }

            return cardContent;
          }}
        </Draggable>
      );
    }

