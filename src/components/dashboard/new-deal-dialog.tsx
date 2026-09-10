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
  DollarSign,
  User,
  Mail,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { Deal, DealPriority, PipelineStage } from "@/data/dashboard-mock-data";

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
  const [stageId, setStageId] = useState(defaultStageId || stages[0]?.id || "stage-new");
  const [priority, setPriority] = useState<DealPriority>("high");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !value) return;

    const numericValue = parseFloat(value.replace(/[^0-9.]/g, "")) || 10000;

    const deal: Deal = {
      id: `deal-${Date.now()}`,
      title,
      company,
      contact: contact || "Primary Lead",
      email: email || "contact@company.com",
      phone: "+1 (555) 000-0000",
      value: numericValue,
      formattedValue: `$${numericValue.toLocaleString()}`,
      stageId: stageId || defaultStageId || stages[0]?.id,
      priority,
      probability: stageId === "stage-won" ? 100 : stageId === "stage-negotiation" ? 85 : 50,
      tags: ["New Opportunity"],
      notes: notes || "Added via quick pipeline creator.",
      daysInStage: 0,
      lastActivity: "Just now",
      assignee: {
        name: "You",
        avatar: "",
        initials: "ME",
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
      <DialogContent className="sm:max-w-lg bg-[#0d0d14] border-white/10 text-zinc-100 p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Create Opportunity</span>
          </div>
          <DialogTitle className="text-xl font-bold text-white">
            Add New Deal to Pipeline
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Create an opportunity card to track through your sales stages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Opportunity Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" requiredIndicator>
              Opportunity / Deal Title
            </Label>
            <Input
              id="title"
              required
              placeholder="e.g. Enterprise Cloud License"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 text-xs bg-black/40 border-white/10"
            />
          </div>

          {/* Company & Deal Value Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company" requiredIndicator>
                Company Name
              </Label>
              <Input
                id="company"
                required
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                icon={<Building2 className="h-3.5 w-3.5" />}
                className="h-10 text-xs bg-black/40 border-white/10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="value" requiredIndicator>
                Deal Value ($)
              </Label>
              <Input
                id="value"
                required
                type="number"
                placeholder="25000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                icon={<DollarSign className="h-3.5 w-3.5 text-emerald-400" />}
                className="h-10 text-xs bg-black/40 border-white/10 font-mono"
              />
            </div>
          </div>

          {/* Contact Person & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="contact">Primary Contact</Label>
              <Input
                id="contact"
                placeholder="e.g. Sarah Connor"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                icon={<User className="h-3.5 w-3.5" />}
                className="h-10 text-xs bg-black/40 border-white/10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="sarah@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-3.5 w-3.5" />}
                className="h-10 text-xs bg-black/40 border-white/10"
              />
            </div>
          </div>

          {/* Stage & Priority Shadcn Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="stage-select">Initial Stage</Label>
              <Select value={stageId} onValueChange={setStageId}>
                <SelectTrigger id="stage-select" className="h-10">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority-select">Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as DealPriority)}
              >
                <SelectTrigger id="priority-select" className="h-10">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes & Key Deliverables</Label>
            <Input
              id="notes"
              placeholder="Key project requirements or scope highlights..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-10 text-xs bg-black/40 border-white/10"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs border-white/10 hover:bg-white/[0.06]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              Create Opportunity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
