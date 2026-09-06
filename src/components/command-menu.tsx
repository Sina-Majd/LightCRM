"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  DollarSign,
  FileText,
  Package,
  Search,
  Download,
  Check,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Keyboard shortcut listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  const handleSelect = (actionName: string) => {
    setSelectedAction(actionName);
    setTimeout(() => {
      setSelectedAction(null);
      onClose();
    }, 1200);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Type a command or search customers, orders, invoices..." />

      <CommandList className="max-h-[380px] p-2">
        <CommandEmpty>No results found for your search.</CommandEmpty>

        {/* Action Confirmation Banner */}
        {selectedAction && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 p-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="truncate">Executed: {selectedAction}</span>
          </div>
        )}

        {/* Group 1: Quick Business Actions */}
        <CommandGroup heading="Quick Business Actions">
          <CommandItem
            onSelect={() => handleSelect("Add New Customer Profile")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                <Users className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">Add New Customer Profile</div>
                <div className="text-[11px] text-zinc-500">
                  Save customer name, company, email, phone & notes
                </div>
              </div>
            </div>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => handleSelect("Create & Send New Invoice")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">Create & Send New Invoice</div>
                <div className="text-[11px] text-zinc-500">
                  Select customer, add order items, and send payment link
                </div>
              </div>
            </div>
            <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => handleSelect("Log New Order / Job")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
                <Package className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">Log New Customer Order</div>
                <div className="text-[11px] text-zinc-500">
                  Track deliverables, target completion date & budget
                </div>
              </div>
            </div>
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => handleSelect("Mark Invoice #1085 as Paid ($1,650)")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
                <DollarSign className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">Record Payment Received</div>
                <div className="text-[11px] text-zinc-500">
                  Update customer ledger and reconcile payment
                </div>
              </div>
            </div>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {/* Group 2: Reports & Overview */}
        <CommandGroup heading="Reports & Financials">
          <CommandItem
            onSelect={() => handleSelect("Open Monthly Revenue Report")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">View Monthly Revenue & Invoicing</div>
                <div className="text-[11px] text-zinc-500">
                  $48,200 collected · 96.5% on-time payment rate
                </div>
              </div>
            </div>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => handleSelect("Filter Unpaid Invoices ($14,250 Total)")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">View Unpaid Invoices</div>
                <div className="text-[11px] text-zinc-500">
                  3 pending customer invoices awaiting payment
                </div>
              </div>
            </div>
            <CommandShortcut>⌘U</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => handleSelect("Export Customer Directory to CSV")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                <Download className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">Export Customer Data (CSV)</div>
                <div className="text-[11px] text-zinc-500">
                  Download all client contacts and transaction history
                </div>
              </div>
            </div>
            <CommandShortcut>⌘E</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {/* Group 3: Customer Directory Lookup */}
        <CommandGroup heading="Customer Profiles">
          <CommandItem
            onSelect={() => handleSelect("Open Solstice Creative profile")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">Solstice Creative (Astrid Lindholm)</div>
                <div className="text-[11px] text-zinc-500">
                  $18,500 total spent · Active client
                </div>
              </div>
            </div>
            <CommandShortcut>Jump</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => handleSelect("Open Apex Logistics Group profile")}
            className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-white/[0.06] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-medium text-white">Apex Logistics Group (Marcus Chen)</div>
                <div className="text-[11px] text-zinc-500">
                  Order #ORD-103 in progress · Due Oct 15
                </div>
              </div>
            </div>
            <CommandShortcut>Jump</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
