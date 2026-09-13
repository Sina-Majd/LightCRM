"use client";

import React, { useState, useEffect } from "react";
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
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Phone,
  Briefcase,
  MapPin,
  Flame,
  PlusCircle,
  Kanban,
  Users,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  Deal,
  DealPriority,
  Lead,
  LeadStatus,
  LeadSource,
  Customer,
  CustomerTier,
  CustomerHealth,
  PipelineStage,
} from "@/data/dashboard-mock-data";

export type RecordType = "deal" | "lead" | "customer";

interface CreateRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: RecordType;
  defaultStageId?: string;
  stages: PipelineStage[];
  onCreateDeal: (deal: Deal) => void;
  onCreateLead: (lead: Lead) => void;
  onCreateCustomer: (customer: Customer) => void;
}

export function CreateRecordDialog({
  isOpen,
  onClose,
  defaultType = "deal",
  defaultStageId,
  stages,
  onCreateDeal,
  onCreateLead,
  onCreateCustomer,
}: CreateRecordDialogProps) {
  const [activeTab, setActiveTab] = useState<RecordType>(defaultType);

  // Sync defaultType whenever dialog opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultType);
    }
  }, [isOpen, defaultType]);

  // Deal Form State
  const [dealTitle, setDealTitle] = useState("");
  const [dealCompany, setDealCompany] = useState("");
  const [dealContact, setDealContact] = useState("");
  const [dealEmail, setDealEmail] = useState("");
  const [dealValue, setDealValue] = useState<number | string>(25000);
  const [dealStageId, setDealStageId] = useState(defaultStageId || stages[0]?.id || "stage-new");
  const [dealPriority, setDealPriority] = useState<DealPriority>("high");
  const [dealNotes, setDealNotes] = useState("");

  // Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadTitle, setLeadTitle] = useState("");
  const [leadScore, setLeadScore] = useState<number | string>(85);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("hot");
  const [leadSource, setLeadSource] = useState<LeadSource>("Website");
  const [leadValue, setLeadValue] = useState<number | string>(18000);
  const [leadNotes, setLeadNotes] = useState("");

  // Customer Form State
  const [custCompany, setCustCompany] = useState("");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custTier, setCustTier] = useState<CustomerTier>("Growth");
  const [custHealth, setCustHealth] = useState<CustomerHealth>("excellent");
  const [custLtv, setCustLtv] = useState<number | string>(45000);
  const [custIndustry, setCustIndustry] = useState("");
  const [custLocation, setCustLocation] = useState("");

  // Reset helper
  const handleClose = () => {
    onClose();
  };

  // Submit Handlers
  const handleSubmitDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealCompany) return;

    const numeric = typeof dealValue === "number" ? dealValue : parseFloat(dealValue) || 10000;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: dealTitle,
      company: dealCompany,
      contact: dealContact || "Primary Contact",
      email: dealEmail || "contact@company.com",
      phone: "+1 (555) 000-0000",
      value: numeric,
      formattedValue: `$${numeric.toLocaleString()}`,
      stageId: dealStageId || stages[0]?.id,
      priority: dealPriority,
      probability: dealStageId === "stage-won" ? 100 : dealStageId === "stage-negotiation" ? 85 : 50,
      tags: ["Direct Inbound"],
      notes: dealNotes || "Added via quick opportunity creator.",
      daysInStage: 0,
      lastActivity: "Just now",
      assignee: {
        name: "You",
        avatar: "",
      },
    };

    onCreateDeal(newDeal);
    handleClose();
    setDealTitle("");
    setDealCompany("");
    setDealContact("");
    setDealEmail("");
    setDealNotes("");
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadCompany) return;

    const numericVal = typeof leadValue === "number" ? leadValue : parseFloat(leadValue) || 12000;
    const numericScore = typeof leadScore === "number" ? leadScore : parseInt(leadScore as string) || 80;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadName,
      company: leadCompany,
      email: leadEmail || "lead@company.com",
      phone: leadPhone || "+1 (555) 123-4567",
      title: leadTitle || "Operations Manager",
      score: Math.min(100, Math.max(1, numericScore)),
      status: leadStatus,
      source: leadSource,
      estimatedValue: numericVal,
      formattedValue: `$${numericVal.toLocaleString()}`,
      createdDate: "Just now",
      notes: leadNotes || "Inbound lead inquiry.",
      assignedTo: "You",
    };

    onCreateLead(newLead);
    handleClose();
    setLeadName("");
    setLeadCompany("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadTitle("");
    setLeadNotes("");
  };

  const handleSubmitCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custCompany || !custName) return;

    const numericLtv = typeof custLtv === "number" ? custLtv : parseFloat(custLtv) || 35000;
    const healthScore = custHealth === "excellent" ? 95 : custHealth === "good" ? 88 : 72;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: custName,
      company: custCompany,
      email: custEmail || "info@company.com",
      phone: custPhone || "+1 (555) 987-6543",
      ltv: numericLtv,
      formattedLtv: `$${numericLtv.toLocaleString()}`,
      activeDealsCount: 1,
      healthScore,
      healthStatus: custHealth,
      tier: custTier,
      renewalDate: "In 12 Months",
      lastTouch: "Just now",
      location: custLocation || "Global",
      industry: custIndustry || "Technology & Services",
    };

    onCreateCustomer(newCust);
    handleClose();
    setCustCompany("");
    setCustName("");
    setCustEmail("");
    setCustPhone("");
    setCustIndustry("");
    setCustLocation("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-xl bg-[#0d0d14] border-white/10 text-zinc-100 p-6 shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-cyan-400" />
            <span>Create CRM Record</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Add a new Opportunity, Lead, or Customer directly into your workspace.
          </DialogDescription>

          {/* Unified Record Type Selector Tabs */}
          <div className="pt-3">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as RecordType)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full h-10 p-1 bg-black/60 rounded-xl border border-white/10 overflow-hidden">
                <TabsTrigger
                  value="deal"
                  className="flex items-center justify-center gap-1.5 h-full rounded-lg"
                >
                  <Kanban className="h-3.5 w-3.5" />
                  <span>Opportunity</span>
                </TabsTrigger>
                <TabsTrigger
                  value="lead"
                  className="flex items-center justify-center gap-1.5 h-full rounded-lg"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>New Lead</span>
                </TabsTrigger>
                <TabsTrigger
                  value="customer"
                  className="flex items-center justify-center gap-1.5 h-full rounded-lg"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Customer 360°</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        {/* 1. OPPORTUNITY / DEAL TAB */}
        {activeTab === "deal" && (
          <form onSubmit={handleSubmitDeal} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="deal-title" requiredIndicator>
                Deal / Scope Title
              </Label>
              <Input
                id="deal-title"
                required
                placeholder="e.g. Enterprise Cloud License"
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="deal-company" requiredIndicator>
                  Company Name
                </Label>
                <Input
                  id="deal-company"
                  required
                  placeholder="e.g. Apex Global"
                  value={dealCompany}
                  onChange={(e) => setDealCompany(e.target.value)}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deal-value" requiredIndicator>
                  Contract Value ($)
                </Label>
                <NumberInput
                  id="deal-value"
                  value={dealValue}
                  onChange={setDealValue}
                  step={1000}
                  min={0}
                  icon={<DollarSign className="h-3.5 w-3.5 text-emerald-400" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="deal-contact">Primary Contact</Label>
                <Input
                  id="deal-contact"
                  placeholder="e.g. Marcus Chen"
                  value={dealContact}
                  onChange={(e) => setDealContact(e.target.value)}
                  icon={<User className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deal-email">Email Address</Label>
                <Input
                  id="deal-email"
                  type="email"
                  placeholder="marcus@apex.io"
                  value={dealEmail}
                  onChange={(e) => setDealEmail(e.target.value)}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="deal-stage">Pipeline Stage</Label>
                <Select value={dealStageId} onValueChange={setDealStageId}>
                  <SelectTrigger id="deal-stage" className="h-10">
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
                <Label htmlFor="deal-priority">Priority</Label>
                <Select
                  value={dealPriority}
                  onValueChange={(val) => setDealPriority(val as DealPriority)}
                >
                  <SelectTrigger id="deal-priority" className="h-10">
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

            <div className="space-y-1.5">
              <Label htmlFor="deal-notes">Notes & Deliverables</Label>
              <Input
                id="deal-notes"
                placeholder="Key scope requirements or client preferences..."
                value={dealNotes}
                onChange={(e) => setDealNotes(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="text-xs border-white/10 hover:bg-white/[0.06]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                Add Opportunity
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* 2. NEW LEAD TAB */}
        {activeTab === "lead" && (
          <form onSubmit={handleSubmitLead} className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lead-name" requiredIndicator>
                  Full Name
                </Label>
                <Input
                  id="lead-name"
                  required
                  placeholder="e.g. Rachel Thorne"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  icon={<User className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-company" requiredIndicator>
                  Company Name
                </Label>
                <Input
                  id="lead-company"
                  required
                  placeholder="e.g. Vanguard Partners"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lead-email">Email Address</Label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="rachel@vanguard.co"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-phone">Phone Number</Label>
                <Input
                  id="lead-phone"
                  placeholder="+1 (555) 000-0000"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lead-title">Job Title</Label>
                <Input
                  id="lead-title"
                  placeholder="VP Operations"
                  value={leadTitle}
                  onChange={(e) => setLeadTitle(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-score">Lead Score (1-100)</Label>
                <NumberInput
                  id="lead-score"
                  value={leadScore}
                  onChange={setLeadScore}
                  min={1}
                  max={100}
                  step={5}
                  icon={<Flame className="h-3.5 w-3.5 text-rose-400" />}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-est-value">Est. Value ($)</Label>
                <NumberInput
                  id="lead-est-value"
                  value={leadValue}
                  onChange={setLeadValue}
                  step={1000}
                  min={0}
                  icon={<DollarSign className="h-3.5 w-3.5 text-emerald-400" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lead-source">Lead Source</Label>
                <Select
                  value={leadSource}
                  onValueChange={(val) => setLeadSource(val as LeadSource)}
                >
                  <SelectTrigger id="lead-source" className="h-10">
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Outbound">Outbound</SelectItem>
                    <SelectItem value="Product Hunt">Product Hunt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-status">Status</Label>
                <Select
                  value={leadStatus}
                  onValueChange={(val) => setLeadStatus(val as LeadStatus)}
                >
                  <SelectTrigger id="lead-status" className="h-10">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot (High Intent)</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-notes">Background & Inquiry Details</Label>
              <Input
                id="lead-notes"
                placeholder="Product interest, discovery notes, or follow-up needs..."
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
                className="h-10 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="text-xs border-white/10 hover:bg-white/[0.06]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                Add Lead
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* 3. NEW CUSTOMER TAB */}
        {activeTab === "customer" && (
          <form onSubmit={handleSubmitCustomer} className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cust-company" requiredIndicator>
                  Account / Company
                </Label>
                <Input
                  id="cust-company"
                  required
                  placeholder="e.g. Beacon Tech Labs"
                  value={custCompany}
                  onChange={(e) => setCustCompany(e.target.value)}
                  icon={<Building2 className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-name" requiredIndicator>
                  Primary Decision Maker
                </Label>
                <Input
                  id="cust-name"
                  required
                  placeholder="e.g. Astrid Lindholm"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  icon={<User className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cust-email">Billing / Contact Email</Label>
                <Input
                  id="cust-email"
                  type="email"
                  placeholder="finance@company.com"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  icon={<Mail className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-phone">Direct Phone</Label>
                <Input
                  id="cust-phone"
                  placeholder="+1 (555) 000-0000"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  icon={<Phone className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cust-tier">Account Tier</Label>
                <Select
                  value={custTier}
                  onValueChange={(val) => setCustTier(val as CustomerTier)}
                >
                  <SelectTrigger id="cust-tier" className="h-10">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Startup">Startup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-health">Account Standing</Label>
                <Select
                  value={custHealth}
                  onValueChange={(val) => setCustHealth(val as CustomerHealth)}
                >
                  <SelectTrigger id="cust-health" className="h-10">
                    <SelectValue placeholder="Health" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent (Prime)</SelectItem>
                    <SelectItem value="good">Good (Stable)</SelectItem>
                    <SelectItem value="warning">Needs Attention</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-ltv">Initial / Total LTV ($)</Label>
                <NumberInput
                  id="cust-ltv"
                  value={custLtv}
                  onChange={setCustLtv}
                  step={2500}
                  min={0}
                  icon={<DollarSign className="h-3.5 w-3.5 text-emerald-400" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cust-industry">Industry Sector</Label>
                <Input
                  id="cust-industry"
                  placeholder="e.g. FinTech / SaaS"
                  value={custIndustry}
                  onChange={(e) => setCustIndustry(e.target.value)}
                  icon={<Briefcase className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cust-location">Headquarters Location</Label>
                <Input
                  id="cust-location"
                  placeholder="e.g. San Francisco, CA"
                  value={custLocation}
                  onChange={(e) => setCustLocation(e.target.value)}
                  icon={<MapPin className="h-3.5 w-3.5" />}
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="text-xs border-white/10 hover:bg-white/[0.06]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                Add Customer
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
