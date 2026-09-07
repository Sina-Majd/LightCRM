"use client";

import React, { useState } from "react";
import {
  Users,
  Package,
  FileText,
  TrendingUp,
  Check,
  Building2,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  CreditCard,
  Send,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TABS = [
  {
    id: "customers",
    label: "Companies & Customers",
    icon: Users,
    solidBg: "bg-cyan-600",
    shadow: "shadow-cyan-600/30",
  },
  {
    id: "orders",
    label: "Orders & Projects",
    icon: Package,
    solidBg: "bg-indigo-600",
    shadow: "shadow-indigo-600/30",
  },
  {
    id: "invoices",
    label: "Invoices & Payments",
    icon: FileText,
    solidBg: "bg-blue-600",
    shadow: "shadow-blue-600/30",
  },
  {
    id: "reports",
    label: "Reports & Charts",
    icon: TrendingUp,
    solidBg: "bg-purple-600",
    shadow: "shadow-purple-600/30",
  },
] as const;

export function PersonaTabs() {
  const [activeTab, setActiveTab] = useState<string>("customers");
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Dynamic Section Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-indigo-500/15 to-transparent blur-[110px] rounded-full animate-aurora-drift-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[380px] bg-gradient-to-bl from-purple-600/20 via-cyan-500/15 to-transparent blur-[110px] rounded-full animate-aurora-drift-2" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <Badge variant="indigo" className="mb-3.5 bg-cyan-500/10 text-cyan-300 border-cyan-500/25 font-medium">
            <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />
            Simple Core Tools
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything your business needs in one place.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            No messy spreadsheets or complicated enterprise setups. Just clean tools that save you time every day.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full"
        >
          <Tabs
            defaultValue="customers"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Centered Tab Triggers */}
            <div className="flex justify-center mb-10">
              <TabsList className="bg-[#121218]/90 border border-white/10 p-1.5 rounded-xl h-auto flex-wrap sm:flex-nowrap gap-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="relative rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer overflow-hidden data-[state=active]:bg-transparent data-[state=active]:shadow-none text-zinc-400 hover:text-white data-[state=active]:text-white"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="persona-active-tab-indicator"
                          className={`absolute inset-0 rounded-lg ${tab.solidBg} shadow-md ${tab.shadow}`}
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Contents with Smooth Animated Transition */}
            <TabsContent value={activeTab} className="focus-visible:outline-none mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activeTab === "customers" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <Badge variant="outline" className="mb-2 text-cyan-400 border-cyan-500/30 font-mono text-[11px]">
                      CLIENT PROFILES
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      All your customer details and history at a glance.
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                      Never dig through scattered emails or lost notebooks again. LightCRM stores contact information,
                      past orders, company notes, and communication history in one clean customer profile.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>Instant phone number, email, and address lookup</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>Complete timeline of every past order and invoice</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>Private notes on client preferences and special requests</span>
                    </div>
                  </div>
                </div>

                {/* Right UI Card */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-white/10 bg-[#0e0e15]/90 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src="/solstice-logo.jpg"
                          alt="Solstice Creative"
                          className="h-11 w-11 rounded-xl object-cover border border-cyan-500/30 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                        />
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Solstice Creative</span>
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-cyan-500/30 text-cyan-300 font-mono">
                              Studio
                            </Badge>
                          </div>
                          <div className="text-xs text-zinc-400">Customer since Jan 2024 · Verified Account</div>
                        </div>
                      </div>

                      <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 bg-emerald-950/20 font-mono">
                        $18,500 Total Spent
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-xs">
                        <div className="text-zinc-500 text-[10px] uppercase">Primary Contact</div>
                        <div className="flex items-center gap-2.5 mt-1.5">
                          <img
                            src="/astrid-avatar.jpg"
                            alt="Astrid Lindholm"
                            className="h-8 w-8 rounded-full object-cover border border-white/15"
                          />
                          <div>
                            <div className="text-white font-semibold text-xs leading-none">Astrid Lindholm</div>
                            <div className="text-zinc-400 text-[11px] mt-1">astrid@solsticecreative.com</div>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-xs">
                        <div className="text-zinc-500 text-[10px] uppercase">Phone & Location</div>
                        <div className="text-white font-medium mt-1">+1 (555) 234-8901</div>
                        <div className="text-zinc-400 text-[11px] mt-0.5">San Francisco, CA</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-zinc-300">Recent Customer Activity:</div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5 flex items-center justify-between text-xs">
                        <span className="text-zinc-300">Brand Identity Package</span>
                        <span className="font-mono text-emerald-400">$4,800 · Invoiced</span>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5 flex items-center justify-between text-xs">
                        <span className="text-zinc-300">Product Photography Asset Pack</span>
                        <span className="font-mono text-zinc-400">$2,400 · Paid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

                {/* Tab 2: Orders */}
                {activeTab === "orders" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <Badge variant="outline" className="mb-2 text-indigo-400 border-indigo-500/30 font-mono text-[11px]">
                      ORDER TRACKING
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      Track customer orders from request to delivery.
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                      Whether you sell products, professional services, or custom deliverables, keep every active job
                      on track with intuitive stages and clear deadlines.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>Visual Kanban view for orders and ongoing work</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>Set due dates and receive automatic deadline alerts</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>One-click conversion from accepted order to final invoice</span>
                    </div>
                  </div>
                </div>

                {/* Right UI Card */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-white/10 bg-[#0e0e15]/90 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        Active Order Workflow (ORD-103)
                      </div>
                      <Badge variant="outline" className="text-[10px] text-cyan-300 border-cyan-500/30">
                        In Progress · Due Oct 15
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Apex Logistics Group</span>
                          <span className="font-mono text-xs font-bold text-emerald-400">$8,400</span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1">
                          Custom Fleet Inventory Portal & Driver Mobile App
                        </p>
                      </div>

                      {/* Order Milestones */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs rounded bg-white/[0.02] p-2 border border-white/[0.04]">
                          <span className="flex items-center gap-2 text-zinc-200">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>1. Scope of Work Signed</span>
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400">Complete</span>
                        </div>

                        <div className="flex items-center justify-between text-xs rounded bg-white/[0.02] p-2 border border-white/[0.04]">
                          <span className="flex items-center gap-2 text-zinc-200">
                            <Clock className="h-3.5 w-3.5 text-cyan-400" />
                            <span>2. Prototype Review & Client Feedback</span>
                          </span>
                          <span className="font-mono text-[10px] text-cyan-300">In Progress</span>
                        </div>

                        <div className="flex items-center justify-between text-xs rounded bg-white/[0.02] p-2 border border-white/[0.04]">
                          <span className="flex items-center gap-2 text-zinc-400">
                            <span className="h-3.5 w-3.5 rounded-full border border-zinc-600 inline-block" />
                            <span>3. Final Delivery & Invoice Reconciliation</span>
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500">Upcoming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

                {/* Tab 3: Invoices */}
                {activeTab === "invoices" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <Badge variant="outline" className="mb-2 text-cyan-400 border-cyan-500/30 font-mono text-[11px]">
                      SIMPLE INVOICING
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      Get paid on time with 1-click professional invoices.
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                      Generate clean invoices in seconds, attach credit card or bank transfer payment links,
                      and send gentle automated reminders so you never have to chase payments.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>Integrated online payments (credit card, bank transfer)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>Automatic notifications when invoices are viewed and paid</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>Real-time dashboard of total paid vs. outstanding invoices</span>
                    </div>
                  </div>
                </div>

                {/* Right UI Card */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-white/10 bg-[#0e0e15]/90 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                      <div>
                        <div className="text-xs font-bold text-white uppercase">Invoice #1085 · GreenLeaf Cafe</div>
                        <div className="text-[11px] text-zinc-400">Due October 20, 2026</div>
                      </div>

                      <Badge
                        variant="outline"
                        className={`text-xs font-mono py-1 px-2.5 ${
                          invoicePaid
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/30"
                            : "text-amber-300 border-amber-500/30 bg-amber-950/20"
                        }`}
                      >
                        {invoicePaid ? "Status: Paid ✓" : "Status: Payment Pending"}
                      </Badge>
                    </div>

                    <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3.5 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300">Point-of-Sale Hardware Installation</span>
                        <span className="font-mono text-white font-semibold">$1,650.00</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium">Total Balance Due:</span>
                        <span className="font-mono text-base font-bold text-emerald-400">$1,650.00</span>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => setInvoicePaid(!invoicePaid)}
                        className={`text-xs h-8 cursor-pointer font-semibold transition-all ${
                          invoicePaid
                            ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                        }`}
                      >
                        {invoicePaid ? "Undo Mark Paid" : "Mark as Paid"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReminderSent(true)}
                        className="text-xs h-8 border-white/10 hover:border-cyan-500/40 text-zinc-300 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                        <span>{reminderSent ? "Reminder Sent!" : "Send Friendly Reminder"}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

                {/* Tab 4: Reports & Charts */}
                {activeTab === "reports" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <Badge variant="outline" className="mb-2 text-purple-400 border-purple-500/30 font-mono text-[11px]">
                      BUSINESS REPORTS & CHARTS
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      Know your numbers without spreadsheet headaches.
                    </h3>
                    <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                      No complicated formulas or expensive accounting software required. LightCRM generates visual
                      charts of your monthly income, cash flow, and client accounts in real time.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span>Track payments received vs. outstanding invoices automatically</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span>Identify your top spending clients and repeat customers</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                      <span>1-click export for tax season or your bookkeeper (CSV & PDF)</span>
                    </div>
                  </div>
                </div>

                {/* Right UI Card */}
                <div className="lg:col-span-7">
                  <div className="rounded-2xl border border-white/10 bg-[#0e0e15]/90 backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">
                          Monthly Financial Overview · October 2026
                        </div>
                        <div className="text-[11px] text-zinc-400">Automated Financial Health Telemetry</div>
                      </div>

                      <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30 bg-emerald-950/20">
                        Cashflow Positive (+14%)
                      </Badge>
                    </div>

                    {/* Quick Metric Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
                        <div className="text-zinc-500 text-[10px] uppercase">Collected This Month</div>
                        <div className="font-mono text-base font-bold text-white mt-0.5">$48,200</div>
                        <div className="text-[10px] text-emerald-400 mt-0.5">↑ 14% vs last month</div>
                      </div>

                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
                        <div className="text-zinc-500 text-[10px] uppercase">Pending Invoices</div>
                        <div className="font-mono text-base font-bold text-amber-400 mt-0.5">$14,250</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">3.2 days avg turnaround</div>
                      </div>

                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 col-span-2 sm:col-span-1">
                        <div className="text-zinc-500 text-[10px] uppercase">On-Time Pay Rate</div>
                        <div className="font-mono text-base font-bold text-cyan-300 mt-0.5">96.5%</div>
                        <div className="text-[10px] text-cyan-400 mt-0.5">Industry avg: 78%</div>
                      </div>
                    </div>

                    {/* Monthly Goal Progress Bar */}
                    <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3.5 mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-zinc-300 font-medium">Monthly Revenue Target ($50,000)</span>
                        <span className="font-mono font-bold text-cyan-300">96.4% Reached</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: "96.4%" }}
                        />
                      </div>
                    </div>

                    {/* Top Customers Breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-zinc-300">Top Revenue Clients This Period:</div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5 flex items-center justify-between text-xs">
                        <span className="text-zinc-300">Solstice Creative</span>
                        <span className="font-mono text-emerald-400 font-semibold">$18,500</span>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5 flex items-center justify-between text-xs">
                        <span className="text-zinc-300">Apex Logistics Group</span>
                        <span className="font-mono text-emerald-400 font-semibold">$8,400</span>
                      </div>
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5 flex items-center justify-between text-xs">
                        <span className="text-zinc-300">Beacon Technology</span>
                        <span className="font-mono text-emerald-400 font-semibold">$12,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
