"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Flame,
  UserPlus,
  Mail,
  Phone,
  ArrowRightLeft,
  Building2,
  Download,
  CheckSquare,
  MoreHorizontal,
  Trash2,
  Calendar,
  PhoneCall,
  CheckCircle2,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { Lead, LeadStatus, LeadSource } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeadsViewProps {
  leads: Lead[];
  onConvertToDeal: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
  onDeleteLead?: (leadId: string) => void;
  onUpdateLeadStatus?: (leadId: string, status: LeadStatus) => void;
  searchQuery: string;
}

const statusConfig: Record<
  LeadStatus,
  { label: string; badge: string; icon?: boolean }
> = {
  hot: {
    label: "Hot",
    badge: "border-rose-500/40 text-rose-300 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
    icon: true,
  },
  warm: {
    label: "Warm",
    badge: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  },
  qualified: {
    label: "Qualified",
    badge: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  },
  cold: {
    label: "Cold",
    badge: "border-zinc-700 text-zinc-400 bg-zinc-800/40",
  },
};

export function LeadsView({
  leads,
  onConvertToDeal,
  onOpenNewLeadModal,
  onDeleteLead,
  onUpdateLeadStatus,
  searchQuery,
}: LeadsViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);


  // Filter leads with guaranteed unique IDs
  const filteredLeads = React.useMemo(() => {
    const seen = new Set<string>();
    return leads.filter((lead) => {
      if (!lead || !lead.id || seen.has(lead.id)) return false;
      seen.add(lead.id);

      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      const matchesSource =
        sourceFilter === "all" || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConvert = (lead: Lead) => {
    onConvertToDeal(lead);
    toast.success("Lead Converted", {
      description: `${lead.name} (${lead.company}) converted into an active pipeline opportunity.`,
      icon: <ArrowRightLeft className="h-4 w-4 text-cyan-400" />,
    });
  };

  const handleDeleteSingle = (lead: Lead) => {
    onDeleteLead?.(lead.id);
    setSelectedLeadIds((prev) => prev.filter((id) => id !== lead.id));
    toast.info("Lead Removed", {
      description: `${lead.name} removed from your database.`,
    });
  };

  const handleBatchDelete = () => {
    selectedLeadIds.forEach((id) => onDeleteLead?.(id));
    toast.info("Batch Delete Complete", {
      description: `Removed ${selectedLeadIds.length} leads.`,
    });
    setSelectedLeadIds([]);
  };

  return (
    <div className="space-y-4">

      {/* Top Filter and Controls Bar using Shadcn Tabs and Select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#111117] p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Tabs */}
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-auto"
          >
            <TabsList className="h-9">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="hot" className="text-rose-400">
                Hot
              </TabsTrigger>
              <TabsTrigger value="warm" className="text-amber-400">
                Warm
              </TabsTrigger>
              <TabsTrigger value="qualified" className="text-cyan-400">
                Qualified
              </TabsTrigger>
              <TabsTrigger value="cold" className="text-zinc-400">
                Cold
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Source Shadcn Select */}
          <div className="w-40">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Outbound">Outbound</SelectItem>
                <SelectItem value="Product Hunt">Product Hunt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onOpenNewLeadModal}
            className="h-9 px-3.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar (when items selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-medium">
            <CheckSquare className="h-4 w-4 text-cyan-400" />
            <span>{selectedLeadIds.length} leads selected</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] border-rose-500/30 text-rose-300 hover:bg-rose-500/10 cursor-pointer"
              onClick={() => {
                selectedLeadIds.forEach((id) => onUpdateLeadStatus?.(id, "hot"));
                toast.success("Leads Updated", {
                  description: `Marked ${selectedLeadIds.length} leads as Hot.`,
                  icon: <Flame className="h-4 w-4 text-rose-400" />,
                });
              }}
            >
              <Flame className="h-3 w-3 mr-1 text-rose-400" />
              Mark Hot
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 cursor-pointer"
              onClick={() => {
                selectedLeadIds.forEach((id) => onUpdateLeadStatus?.(id, "qualified"));
                toast.success("Leads Updated", {
                  description: `Marked ${selectedLeadIds.length} leads as Qualified.`,
                  icon: <CheckCircle2 className="h-4 w-4 text-cyan-400" />,
                });
              }}
            >
              <CheckCircle2 className="h-3 w-3 mr-1 text-cyan-400" />
              Mark Qualified
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[11px] border-white/10 text-zinc-300 hover:bg-white/[0.06] cursor-pointer"
              onClick={() =>
                toast.success("CSV Export Complete", {
                  description: `Exported ${selectedLeadIds.length} leads to CSV.`,
                  icon: <Download className="h-3 w-3 text-zinc-300" />,
                })
              }
            >
              <Download className="h-3 w-3 mr-1" />
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 text-[11px] bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              onClick={handleBatchDelete}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete ({selectedLeadIds.length})
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[11px] text-zinc-400 hover:text-white"
              onClick={() => setSelectedLeadIds([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Leads Table using Shadcn Table Component */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0f0f16] overflow-hidden shadow-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.08] hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    filteredLeads.length > 0 &&
                    selectedLeadIds.length === filteredLeads.length
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>Contact & Company</TableHead>
              <TableHead>Lead Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Estimated Value</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => {
              const status = statusConfig[lead.status];
              const isSelected = selectedLeadIds.includes(lead.id);

              return (
                <TableRow
                  key={lead.id}
                  className={`group transition-colors ${
                    isSelected ? "bg-cyan-500/[0.07]" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleLead(lead.id)}
                    />
                  </TableCell>

                  {/* Contact Person & Company */}
                  <TableCell>
                    <div>
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="h-3 w-3 text-zinc-500" />
                        <span>{lead.company}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-zinc-400">{lead.title}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Lead Score Flame Bar */}
                  <TableCell className="font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold flex items-center gap-0.5 ${
                          lead.score >= 85
                            ? "text-rose-400"
                            : lead.score >= 70
                            ? "text-amber-400"
                            : "text-zinc-400"
                        }`}
                      >
                        {lead.score >= 85 && (
                          <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                        )}
                        {lead.score}
                      </span>
                      <div className="h-1.5 w-16 rounded-full bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            lead.score >= 85
                              ? "bg-rose-500"
                              : lead.score >= 70
                              ? "bg-amber-400"
                              : "bg-cyan-500"
                          }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono py-0.5 px-2 capitalize ${status.badge}`}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>

                  {/* Source */}
                  <TableCell>
                    <span className="rounded-md bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 text-[11px] text-zinc-300 font-mono">
                      {lead.source}
                    </span>
                  </TableCell>

                  {/* Estimated Value */}
                  <TableCell className="font-mono font-semibold text-emerald-400">
                    {lead.formattedValue}
                  </TableCell>

                  {/* Assigned Owner */}
                  <TableCell className="text-zinc-300 text-[11px]">
                    {lead.assignedTo}
                  </TableCell>

                  {/* Primary Convert CTA and Three-Dots Menu */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Convert Action with ArrowRightLeft Icon */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleConvert(lead)}
                        className="h-7 px-2.5 text-[11px] font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-white rounded-lg transition-all cursor-pointer shadow-xs"
                      >
                        <ArrowRightLeft className="h-3 w-3 mr-1.5 text-cyan-400" />
                        <span>Convert</span>
                      </Button>

                      {/* Full Actions Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-[#12121c] border-white/10 text-zinc-100 p-1 shadow-2xl"
                        >
                          <DropdownMenuLabel className="text-[10px] font-mono uppercase text-zinc-500">
                            Lead Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleConvert(lead)}
                            className="text-xs cursor-pointer flex items-center gap-2 text-cyan-300"
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Convert to Opportunity</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => (window.location.href = `mailto:${lead.email}`)}
                            className="text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Compose Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success("Call Logged", {
                                description: `Call recorded with ${lead.name}.`,
                                icon: <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />,
                              })
                            }
                            className="text-xs cursor-pointer flex items-center gap-2"
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                            <span>Log Phone Call</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success("Meeting Scheduled", {
                                description: `Meeting invite generated for ${lead.name}.`,
                                icon: <Calendar className="h-3.5 w-3.5 text-cyan-400" />,
                              })
                            }
                            className="text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Schedule Meeting</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-white/10" />

                          <DropdownMenuLabel className="text-[10px] font-mono uppercase text-zinc-500">
                            Change Status
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => onUpdateLeadStatus?.(lead.id, "hot")}
                            className="text-xs cursor-pointer flex items-center gap-2 text-rose-400"
                          >
                            <Flame className="h-3.5 w-3.5" />
                            <span>Mark as Hot</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateLeadStatus?.(lead.id, "qualified")}
                            className="text-xs cursor-pointer flex items-center gap-2 text-cyan-400"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Mark as Qualified</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-white/10" />

                          {/* Delete Lead */}
                          <DropdownMenuItem
                            onClick={() => handleDeleteSingle(lead)}
                            className="text-xs cursor-pointer flex items-center gap-2 text-red-400 focus:text-red-300 focus:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Lead</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {filteredLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-zinc-500">
                  No leads found matching current search or filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
