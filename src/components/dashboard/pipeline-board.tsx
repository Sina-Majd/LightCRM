"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  TrendingUp,
  Search,
  Filter,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Deal, PipelineStage } from "@/data/dashboard-mock-data";
import { DealCard } from "./deal-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

interface PipelineBoardProps {
  stages: PipelineStage[];
  deals: Deal[];
  onDealsChange: (updatedDeals: Deal[]) => void;
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDealModal: (stageId?: string) => void;
  onDeleteDeal?: (dealId: string) => void;
  searchQuery: string;
}

export function PipelineBoard({
  stages,
  deals,
  onDealsChange,
  onSelectDeal,
  onOpenNewDealModal,
  onDeleteDeal,
  searchQuery,
}: PipelineBoardProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [celebrateWon, setCelebrateWon] = useState<string | null>(null);

  // Filter deals based on search term & priority
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contact.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || deal.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Calculate overall metrics
  const totalPipelineValue = deals
    .filter((d) => d.stageId !== "stage-won")
    .reduce((sum, d) => sum + d.value, 0);

  const totalWonValue = deals
    .filter((d) => d.stageId === "stage-won")
    .reduce((sum, d) => sum + d.value, 0);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid drop target
    if (!destination) return;

    // Dropped in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStageId = source.droppableId;
    const destStageId = destination.droppableId;

    // Copy array
    const updated = [...deals];
    const movedDealIndex = updated.findIndex((d) => d.id === draggableId);
    if (movedDealIndex === -1) return;

    const [movedDeal] = updated.splice(movedDealIndex, 1);

    // Update the stage if moved to another column
    const updatedDeal: Deal = {
      ...movedDeal,
      stageId: destStageId,
      daysInStage: sourceStageId === destStageId ? movedDeal.daysInStage : 0,
      lastActivity: "Just now",
      probability:
        destStageId === "stage-won"
          ? 100
          : destStageId === "stage-negotiation"
          ? 85
          : destStageId === "stage-proposal"
          ? 70
          : destStageId === "stage-qualified"
          ? 50
          : 30,
    };

    // If moved to Closed Won, trigger celebration flash
    if (destStageId === "stage-won" && sourceStageId !== "stage-won") {
      setCelebrateWon(`🎉 ${updatedDeal.company} moved to Closed Won!`);
      setTimeout(() => setCelebrateWon(null), 4500);
    }

    // Insert back in target column position
    const destColumnDeals = updated.filter((d) => d.stageId === destStageId);
    const otherColumnDeals = updated.filter((d) => d.stageId !== destStageId);

    destColumnDeals.splice(destination.index, 0, updatedDeal);

    onDealsChange([...otherColumnDeals, ...destColumnDeals]);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Controls & Stage Value Ticker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#111117] border border-white/[0.08] rounded-xl p-3 sm:px-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Active Pipeline:</span>
            <span className="font-mono text-sm font-bold text-cyan-300">
              ${totalPipelineValue.toLocaleString()}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs text-zinc-400 font-medium">Won Revenue:</span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              ${totalWonValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Priority Filter via Shadcn Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-[11px] font-mono uppercase text-zinc-500 mr-1 hidden sm:inline">
            Priority:
          </span>
          <Tabs
            value={priorityFilter}
            onValueChange={setPriorityFilter}
            className="w-auto"
          >
            <TabsList className="h-8 bg-black/40 border border-white/10 p-0.5">
              <TabsTrigger value="all" className="text-xs px-2.5 py-1">
                All
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-xs px-2.5 py-1 text-rose-400">
                Urgent
              </TabsTrigger>
              <TabsTrigger value="high" className="text-xs px-2.5 py-1 text-amber-400">
                High
              </TabsTrigger>
              <TabsTrigger value="medium" className="text-xs px-2.5 py-1 text-cyan-400">
                Medium
              </TabsTrigger>
              <TabsTrigger value="low" className="text-xs px-2.5 py-1 text-zinc-400">
                Low
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            size="sm"
            onClick={() => onOpenNewDealModal()}
            className="ml-2 h-8 px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New Opportunity</span>
          </Button>
        </div>
      </div>

      {/* Celebratory Won Alert Banner */}
      <AnimatePresence>
        {celebrateWon && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-emerald-500/40 bg-emerald-950/70 p-3 text-xs font-semibold text-emerald-300 flex items-center justify-between shadow-lg shadow-emerald-950/30"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-spin" />
              <span>{celebrateWon}</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400/80">
              Revenue added to closed pool
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag and Drop Stage Columns Container */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-start pb-6">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter(
              (deal) => deal.stageId === stage.id
            );
            const stageTotalValue = stageDeals.reduce(
              (acc, d) => acc + d.value,
              0
            );

            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-[#0f0f16] overflow-hidden min-h-[580px] shadow-sm"
              >
                {/* Stage Header */}
                <div className={`p-3.5 border-b border-white/[0.06] bg-gradient-to-b ${stage.bgGradient}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${stage.color.replace("text-", "bg-")}`} />
                      <h3 className="text-xs font-bold text-white tracking-tight">
                        {stage.title}
                      </h3>
                    </div>

                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono py-0 px-1.5 bg-white/[0.05] border-white/10 text-zinc-300"
                    >
                      {stageDeals.length}
                    </Badge>
                  </div>

                  {/* Stage Value Metric */}
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Stage Sum</span>
                    <span className={`font-semibold ${stage.color}`}>
                      ${stageTotalValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Droppable Stage Column Body */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 space-y-3 min-h-[460px] ${
                        snapshot.isDraggingOver
                          ? "bg-cyan-500/[0.06] ring-1 ring-inset ring-cyan-500/30 rounded-b-2xl"
                          : ""
                      }`}
                    >
                      {stageDeals.map((deal, idx) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          index={idx}
                          onSelect={onSelectDeal}
                          onDeleteDeal={onDeleteDeal}
                          onMoveToStage={(dealId, targetStageId) => {
                            onDealsChange(
                              deals.map((d) =>
                                d.id === dealId ? { ...d, stageId: targetStageId } : d
                              )
                            );
                            if (targetStageId === "stage-won") {
                              setCelebrateWon(`🎉 ${deal.company} moved to Closed Won!`);
                              setTimeout(() => setCelebrateWon(null), 4500);
                            }
                          }}
                        />
                      ))}

                      {provided.placeholder}

                      {/* Empty Column State */}
                      {stageDeals.length === 0 && !snapshot.isDraggingOver && (
                        <div className="h-40 rounded-xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-xs text-zinc-500">
                            No deals in {stage.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenNewDealModal(stage.id)}
                            className="mt-2 h-7 text-[11px] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add deal
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>

                {/* Quick Add Button at bottom of column */}
                <div className="p-2.5 border-t border-white/[0.04] bg-[#0c0c12]/60">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenNewDealModal(stage.id)}
                    className="w-full h-8 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    <span>Add Deal</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
