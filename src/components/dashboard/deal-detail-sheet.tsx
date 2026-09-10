"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Send,
  MessageSquare,
  FileText,
  User,
  Trash2,
} from "lucide-react";
import { Deal, PipelineStage } from "@/data/dashboard-mock-data";

interface DealDetailSheetProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  stages: PipelineStage[];
  onStageChange?: (dealId: string, newStageId: string) => void;
  onDeleteDeal?: (dealId: string) => void;
}

export function DealDetailSheet({
  deal,
  isOpen,
  onClose,
  stages,
  onStageChange,
  onDeleteDeal,
}: DealDetailSheetProps) {
  const [newNote, setNewNote] = useState("");
  const [notesList, setNotesList] = useState<
    Array<{ text: string; author: string; time: string }>
  >([]);

  if (!deal) return null;

  const currentStage = stages.find((s) => s.id === deal.stageId);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList([
      {
        text: newNote.trim(),
        author: "You",
        time: "Just now",
      },
      ...notesList,
    ]);
    setNewNote("");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-[#0d0d14]/98 border-white/10 text-zinc-100 p-0 flex flex-col overflow-hidden"
      >
        {/* Header Strip */}
        <div className="p-6 pr-14 border-b border-white/[0.08] bg-[#11111a]/80">
          <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Deal Details
            </span>
            <span className="text-zinc-600">·</span>
            <Badge
              variant="outline"
              className="font-mono text-[10px] border-emerald-500/30 text-emerald-300 bg-emerald-950/40 px-2 py-0.5"
            >
              Active Opportunity
            </Badge>
          </div>

          <SheetTitle className="text-xl font-bold text-white tracking-tight leading-snug">
            {deal.title}
          </SheetTitle>
          <SheetDescription className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-300 font-semibold">{deal.company}</span>
            <span className="text-zinc-600">·</span>
            <span>Created 14 days ago</span>
          </SheetDescription>

          {/* Deal Value Hero Callout */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/40 p-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">
                Total Deal Value
              </div>
              <div className="font-mono text-2xl font-black text-emerald-400 mt-0.5">
                {deal.formattedValue}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-zinc-500">
                Win Probability
              </div>
              <div className="font-mono text-base font-bold text-cyan-300 mt-0.5">
                {deal.probability}%
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stage Progression Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2 font-mono">
              Pipeline Stage
            </label>
            <div className="grid grid-cols-5 gap-1 rounded-xl bg-black/40 border border-white/[0.08] p-1.5">
              {stages.map((stage) => {
                const isSelected = stage.id === deal.stageId;
                return (
                  <Button
                    key={stage.id}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onStageChange?.(deal.id, stage.id)}
                    className={`rounded-lg py-2 px-1 h-auto text-center transition-all cursor-pointer text-[10px] font-medium leading-tight ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {stage.title.split(" ")[0]}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Contact Information Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[#12121c] p-4">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              Primary Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Name</span>
                <span className="font-semibold text-white">{deal.contact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Email</span>
                <a
                  href={`mailto:${deal.email}`}
                  className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  {deal.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Phone</span>
                <a
                  href={`tel:${deal.phone}`}
                  className="font-mono text-zinc-300 hover:text-white flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  {deal.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Owner</span>
                <span className="text-zinc-200 flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  {deal.assignee.name}
                </span>
              </div>
            </div>
          </div>

          {/* Notes and Context */}
          <div className="rounded-xl border border-white/[0.08] bg-[#12121c] p-4">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              Executive Summary & Scope
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/[0.04]">
              {deal.notes}
            </p>
          </div>

          <Separator />

          {/* Activity Log / Notes Stream */}
          <div>
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
              Activity Stream & Notes
            </h4>

            {/* Quick Note Input */}
            <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
              <Input
                placeholder="Log a client note or call update..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="h-9 text-xs bg-black/40 border-white/10"
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>

            <div className="space-y-3">
              {notesList.map((note, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] p-3 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 mb-1">
                    <span>{note.author}</span>
                    <span>{note.time}</span>
                  </div>
                  <p className="text-zinc-200">{note.text}</p>
                </div>
              ))}

              {/* Mock history item */}
              <div className="rounded-lg border border-white/[0.06] bg-black/30 p-3 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                  <span>{deal.assignee.name}</span>
                  <span>{deal.lastActivity}</span>
                </div>
                <p className="text-zinc-300">
                  Updated opportunity stage and scheduled executive demo presentation.
                </p>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-black/30 p-3 text-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                  <span>System Workflow</span>
                  <span>3 days ago</span>
                </div>
                <p className="text-zinc-300">
                  Calculated win probability raised to {deal.probability}% based on engagement velocity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] bg-[#11111a] flex items-center justify-between gap-3">
          <div>
            {onDeleteDeal && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onDeleteDeal(deal.id);
                  onClose();
                }}
                className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete Opportunity
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              asChild
              className="text-xs border-white/10 text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 cursor-pointer"
            >
              <a href={`mailto:${deal.email}`}>
                <Mail className="h-3.5 w-3.5 mr-1" />
                Quick Email
              </a>
            </Button>
            <Button
              type="button"
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 cursor-pointer"
              onClick={() => onStageChange?.(deal.id, "stage-won")}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Mark as Won
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
