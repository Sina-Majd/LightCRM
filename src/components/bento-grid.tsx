"use client";

import React, { useState } from "react";
import {
  MousePointerClick,
  Smartphone,
  Tablet,
  Laptop,
  RefreshCw,
  PhoneCall,
  Plus,
  PenLine,
  Download,
  CheckCircle2,
  Package,
  FileText,
  Sparkles,
  Building2,
  Share2,
  CreditCard,
  Check,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BentoGrid() {
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);
  const [activeDevice, setActiveDevice] = useState<"phone" | "tablet" | "laptop">("phone");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleExport = (format: string) => {
    setExportedFormat(format);
    setTimeout(() => setExportedFormat(null), 2500);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 600);
  };

  return (
    <section id="overview" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-[650px] h-[400px] bg-cyan-600/15 blur-[110px] rounded-full pointer-events-none -z-10 animate-aurora-drift-1" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[380px] bg-indigo-600/15 blur-[110px] rounded-full pointer-events-none -z-10 animate-aurora-drift-2" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="indigo" className="mb-3.5 bg-cyan-500/10 text-cyan-300 border-cyan-500/25">
            <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />
            Simple & Practical Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            The core essentials you need.{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              None of the clutter.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            LightCRM cuts out the complicated menus and useless settings. You get clean, intuitive tools
            built to run your everyday business smoothly from day one.
          </p>
        </motion.div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1: Visual Order Workflow (Large 2-col) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:col-span-2 rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#14141c]/90 to-[#0e0e14]/95 p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors shadow-lg isolate"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <Badge variant="outline" className="mb-2 font-mono text-[11px] text-cyan-300 border-cyan-500/30">
                    ORDER & JOB TRACKER
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Visual Drag-and-Drop Order Stages
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-md">
                    Keep active customer jobs organized from new request to final delivery.
                    Advance status with one click so your team always knows what to do next.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-zinc-400">
                  <Package className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Zero Training Needed</span>
                </div>
              </div>

              {/* Interactive Simulated Order Reorder */}
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0c0c11] p-4">
                <div className="text-[11px] text-zinc-500 font-mono mb-3 flex items-center justify-between">
                  <span>INTERACTIVE ORDER DEMO (CLICK CARD TO ADVANCE)</span>
                  <span className="text-cyan-400">Live Status Sync</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/[0.06] bg-[#121218] p-3">
                    <div className="text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-wider flex items-center justify-between h-5">
                      <span className="truncate">In Progress</span>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0 ml-2">
                        {!orderCompleted ? "1 Active" : "0 Active"}
                      </span>
                    </div>
                    <div
                      onClick={() => setOrderCompleted(!orderCompleted)}
                      className={`rounded-md border p-3 transition-all cursor-pointer h-[86px] flex flex-col justify-between select-none ${
                        !orderCompleted
                          ? "border-cyan-500/40 bg-cyan-950/20 text-white shadow-md shadow-cyan-950/40"
                          : "border-white/[0.06] bg-white/[0.02] text-zinc-500 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <img
                            src="/solstice-logo.jpg"
                            alt="Solstice Creative"
                            className="h-4 w-4 rounded object-cover shrink-0"
                          />
                          <span className="text-xs font-semibold text-white truncate">Solstice Creative</span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-400 shrink-0">$4,800</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">Brand Identity & Design System</p>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                        <MousePointerClick className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{!orderCompleted ? "Click to mark complete" : "Completed · Click to reset"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-[#121218] p-3">
                    <div className="text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-wider flex items-center justify-between h-5">
                      <span className="truncate">Completed</span>
                      <span className="text-[10px] text-emerald-400 font-mono shrink-0 ml-2">
                        {orderCompleted ? "1 Ready" : "0 Ready"}
                      </span>
                    </div>
                    <div
                      onClick={() => setOrderCompleted(!orderCompleted)}
                      className={`rounded-md border p-3 transition-all cursor-pointer h-[86px] flex flex-col justify-between select-none ${
                        orderCompleted
                          ? "border-emerald-500/40 bg-emerald-950/20 text-white shadow-md shadow-emerald-950/40"
                          : "border-dashed border-white/10 bg-transparent text-zinc-500"
                      }`}
                    >
                      {orderCompleted ? (
                        <>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <img
                                src="/solstice-logo.jpg"
                                alt="Solstice Creative"
                                className="h-4 w-4 rounded object-cover shrink-0"
                              />
                              <span className="text-xs font-semibold text-white truncate">Solstice Creative</span>
                            </div>
                            <span className="font-mono text-[11px] text-emerald-400 shrink-0">$4,800</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">Brand Identity & Design System</p>
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">Ready! 1-click invoice</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <span className="text-xs text-zinc-500">Order appears here once finished</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Instant Customer Directory with Real Generated Avatar & Logo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#14141c]/90 to-[#0e0e14]/95 p-6 sm:p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors shadow-lg isolate"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <Badge variant="outline" className="mb-2 font-mono text-[11px] text-indigo-300 border-indigo-500/30">
                CUSTOMER DIRECTORY
              </Badge>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Companies & Customer Profiles
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                Instant access to phone numbers, emails, addresses, client notes, and past order history in under 1 second.
              </p>

              <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0d0d12] p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/astrid-avatar.jpg"
                      alt="Astrid Lindholm"
                      className="h-8 w-8 rounded-full object-cover border border-cyan-500/30 shrink-0"
                    />
                    <div>
                      <span className="text-white font-semibold">Astrid Lindholm</span>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <img
                          src="/solstice-logo.jpg"
                          alt="Solstice Creative"
                          className="h-3 w-3 rounded object-cover"
                        />
                        <span>Solstice Creative</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">$18.5k Spent</span>
                </div>

                <div className="text-[11px] text-zinc-400 border-t border-white/[0.06] pt-2 flex items-center justify-between">
                  <span>Phone: +1 (555) 234-8901</span>
                  <span className="text-cyan-400 font-medium">Verified Client</span>
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>3 orders completed · 100% on-time payment</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Works Everywhere on Any Device */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#14141c]/90 to-[#0e0e14]/95 p-6 sm:p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors shadow-lg isolate flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <Badge variant="outline" className="mb-2 font-mono text-[11px] text-purple-300 border-purple-500/30">
                  WORKS ANYWHERE
                </Badge>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Phone, Tablet & Laptop Access
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                  Run your business from your desk or on the go. View customer info, log new orders, and check paid invoices from anywhere.
                </p>

                {/* Device Selector Tabs */}
                <div className="mt-5 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#09090e] border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setActiveDevice("phone")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeDevice === "phone"
                        ? "bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDevice("tablet")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeDevice === "tablet"
                        ? "bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <Tablet className="h-3.5 w-3.5" />
                    <span>Tablet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDevice("laptop")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeDevice === "laptop"
                        ? "bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <Laptop className="h-3.5 w-3.5" />
                    <span>Laptop</span>
                  </button>
                </div>

                {/* Interactive Dynamic Mockup Display */}
                <div className="mt-3.5 rounded-xl border border-white/[0.08] bg-[#0c0c12] p-3.5 text-xs shadow-inner min-h-[140px] flex flex-col justify-between">
                  {activeDevice === "phone" && (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1.5 border-b border-white/[0.06]">
                        <span className="font-mono">Mobile PWA App</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online
                        </span>
                      </div>
                      <div className="rounded-lg bg-[#14141d] p-2.5 border border-white/[0.04] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="/astrid-avatar.jpg"
                            alt="Astrid"
                            className="h-6 w-6 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <div className="text-[11px] font-semibold text-white">Astrid Lindholm</div>
                            <div className="text-[10px] text-emerald-400">Order #2048 Paid • $4,800</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-mono text-zinc-400 border-white/10">
                          Just now
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <div className="flex-1 rounded-md bg-white/[0.03] border border-white/[0.06] py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] text-zinc-300 font-medium">
                          <PhoneCall className="h-3 w-3 text-cyan-400 shrink-0" />
                          <span>1-Tap Log Call</span>
                        </div>
                        <div className="flex-1 rounded-md bg-purple-500/10 border border-purple-500/20 py-1.5 px-2 flex items-center justify-center gap-1.5 text-[10px] text-purple-300 font-medium">
                          <Plus className="h-3 w-3 text-purple-300 shrink-0" />
                          <span>New Order</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeDevice === "tablet" && (
                    <motion.div
                      key="tablet"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1.5 border-b border-white/[0.06]">
                        <span className="font-mono">POS & Field Signature Mode</span>
                        <span className="text-purple-300 font-mono text-[10px]">Stylus Ready</span>
                      </div>
                      <div className="rounded-lg bg-[#14141d] p-2.5 border border-white/[0.04]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-zinc-300 font-medium">On-Site Client Approval</span>
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                            <Check className="h-3 w-3" />
                            <span>Signed</span>
                          </span>
                        </div>
                        <div className="h-6 rounded bg-black/40 border border-dashed border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                          <PenLine className="h-3 w-3 text-purple-400 shrink-0" />
                          <span>Astrid Lindholm (Digital Signoff)</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 px-0.5">
                        <span>Offline caching active</span>
                        <span className="text-cyan-400 font-mono">Syncs instantly</span>
                      </div>
                    </motion.div>
                  )}

                  {activeDevice === "laptop" && (
                    <motion.div
                      key="laptop"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pb-1.5 border-b border-white/[0.06]">
                        <span className="font-mono">Desktop Power Workspace</span>
                        <span className="text-zinc-400 font-mono text-[10px]">Multi-tab sync</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-[#14141d] p-2 border border-white/[0.04]">
                          <div className="text-[10px] text-zinc-400">Monthly Revenue</div>
                          <div className="text-xs font-mono font-bold text-white mt-0.5">$34,800.00</div>
                        </div>
                        <div className="rounded-lg bg-[#14141d] p-2 border border-white/[0.04]">
                          <div className="text-[10px] text-zinc-400">Active Deals</div>
                          <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">18 Closed</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                        <span className="font-mono text-zinc-500">Universal Palette:</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px] font-mono text-zinc-300">
                          ⌘ + K Quick Search
                        </kbd>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Bottom Interactive Cloud Sync Bar */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </div>
                  <div className="text-[11px]">
                    <div className="font-medium text-zinc-200">
                      {isSyncing ? "Syncing devices..." : syncSuccess ? "Synced across devices!" : "Cloud Synced"}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {syncSuccess ? "Latency 14ms • Up to date" : "Instant real-time updates"}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleTriggerSync}
                  disabled={isSyncing}
                  className="h-7 px-2.5 text-[11px] border-white/10 hover:border-purple-500/40 hover:bg-purple-500/10 text-zinc-300 cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 text-purple-400 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? "Syncing" : "Sync Now"}</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Card 4: 1-Click Invoices & Live Payment Simulator (Completely Redesigned UI/UX) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="md:col-span-2 rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#14141c]/90 to-[#0e0e14]/95 p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors shadow-lg isolate"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <Badge variant="outline" className="mb-2 font-mono text-[11px] text-cyan-300 border-cyan-500/30">
                    1-CLICK INVOICES & PAYMENTS
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Get Paid Faster With Professional Invoices
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                    Turn completed orders into clean, professional invoices in seconds.
                    Clients pay directly online with one click, and your dashboard updates in real time.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("PDF Invoice")}
                    className="h-8 text-xs border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04] text-zinc-300 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                    <span>Download PDF</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("Payment Link")}
                    className="h-8 text-xs border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04] text-zinc-300 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                    <span>Copy Link</span>
                  </Button>
                </div>
              </div>

              {/* Export notification badge if triggered */}
              {exportedFormat && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 p-2.5 text-xs text-emerald-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Generated {exportedFormat}! Link copied to clipboard & invoice ready.</span>
                </motion.div>
              )}

              {/* Rich Interactive Dual-Panel Invoice & Payment Simulator */}
              <div className="rounded-xl border border-white/[0.08] bg-[#0c0c12] p-4 sm:p-5 shadow-inner">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Panel Left: Branded Invoice Mockup */}
                  <div className="lg:col-span-7 rounded-lg border border-white/[0.06] bg-[#12121a] p-4 space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/solstice-logo.jpg"
                          alt="Solstice Creative"
                          className="h-7 w-7 rounded-md object-cover border border-white/10"
                        />
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">Solstice Creative</div>
                          <div className="text-[10px] font-mono text-zinc-500">Invoice #INV-2048</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-zinc-400">
                        Due: Oct 20, 2026
                      </Badge>
                    </div>

                    {/* Customer Billed */}
                    <div className="flex items-center justify-between text-xs bg-white/[0.02] rounded p-2 border border-white/[0.04]">
                      <span className="text-zinc-400 text-[11px]">Billed To:</span>
                      <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                        <img
                          src="/astrid-avatar.jpg"
                          alt="Astrid Lindholm"
                          className="h-4 w-4 rounded-full object-cover"
                        />
                        <span>Astrid Lindholm</span>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between py-1 text-zinc-300">
                        <span className="text-[11px]">Brand Identity & Design System</span>
                        <span className="font-mono text-zinc-300">$3,200.00</span>
                      </div>
                      <div className="flex items-center justify-between py-1 text-zinc-300">
                        <span className="text-[11px]">UI Component Library & Assets</span>
                        <span className="font-mono text-zinc-300">$1,600.00</span>
                      </div>
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between font-semibold">
                        <span className="text-zinc-200">Total Amount Due:</span>
                        <span className="font-mono text-base font-bold text-emerald-400">$4,800.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Panel Right: Interactive Client Payment Terminal */}
                  <div className="lg:col-span-5 rounded-lg border border-white/[0.06] bg-[#12121a] p-4 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                          Payment Status
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono py-0.5 px-2 inline-flex items-center gap-1.5 ${
                            invoicePaid
                              ? "text-emerald-300 bg-emerald-950/30 border-emerald-500/30"
                              : "text-amber-300 bg-amber-950/30 border-amber-500/30"
                          }`}
                        >
                          {invoicePaid ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span>Paid in Full</span>
                            </>
                          ) : (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                              <span>Awaiting Payment</span>
                            </>
                          )}
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {invoicePaid
                          ? "Payment of $4,800 received instantly. Receipt sent to astrid@solsticecreative.com."
                          : "Client receives a frictionless 1-click checkout page with instant Apple Pay or card payments."}
                      </p>
                    </div>

                    {/* Interactive Button */}
                    <div className="space-y-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => setInvoicePaid(!invoicePaid)}
                        className={`w-full text-xs font-semibold cursor-pointer transition-all shadow-md ${
                          invoicePaid
                            ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-950/40"
                        }`}
                      >
                        {invoicePaid ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Reset Payment Demo</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <CreditCard className="h-3.5 w-3.5" />
                            <span>Simulate 1-Click Payment</span>
                          </span>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 pt-1">
                        <span>Apple Pay</span>
                        <span>•</span>
                        <span>Visa / Mastercard</span>
                        <span>•</span>
                        <span>Direct Wire</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
