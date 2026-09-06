"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  Package,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  INITIAL_ORDERS_DATA,
  MONTHLY_REVENUE_DATA,
  BUSINESS_DASHBOARD_STATS,
  BusinessOrder,
} from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  received: {
    label: "Received Revenue ($k)",
    color: "#38bdf8",
  },
  invoiced: {
    label: "Total Invoiced ($k)",
    color: "#818cf8",
  },
} satisfies ChartConfig;

export function HeroMockup() {
  const [ordersData] = useState(INITIAL_ORDERS_DATA);
  const [activeOrderId, setActiveOrderId] = useState<string>("order-101");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="pipeline" className="relative px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl relative">
        {/* Soft, modern ambient luminous backplate aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[520px] bg-gradient-to-r from-cyan-500/15 via-indigo-600/15 to-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Outer App Window Frame with Silky Smooth Fade-in and Stable Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/10 bg-[#0c0c11]/95 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden"
        >
          {/* Top Window Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] bg-[#121217]/95 px-4 py-3 sm:px-5">
            {/* Left: Window Controls + Breadcrumbs */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f]/90 border border-[#1aab29]" />
              </div>

              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-zinc-400">Business Hub</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  Customers & Orders
                </span>
                <span className="text-zinc-600">/</span>
                <Badge variant="outline" className="font-mono text-[11px] py-0.5 px-2 bg-white/[0.03] border-white/10 text-cyan-300">
                  Active
                </Badge>
              </div>
            </div>

            {/* Right: Real-time Quick KPI Summary */}
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-zinc-300 font-semibold">{BUSINESS_DASHBOARD_STATS.totalCustomers}</span>
                <span className="text-zinc-500">Customers</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-zinc-300 font-semibold">{BUSINESS_DASHBOARD_STATS.activeOrders}</span>
                <span className="text-zinc-500">Orders</span>
              </div>
            </div>
          </div>

          {/* Quick Business KPI Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06] border-b border-white/[0.06] bg-[#0e0e14]/70">
            <div className="p-3 sm:px-5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">This Month's Revenue</div>
              <div className="font-mono text-base font-bold text-white mt-0.5">
                {BUSINESS_DASHBOARD_STATS.monthlyRevenue}
              </div>
            </div>
            <div className="p-3 sm:px-5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Unpaid Invoices</div>
              <div className="font-mono text-base font-bold text-amber-400 mt-0.5">
                {BUSINESS_DASHBOARD_STATS.unpaidInvoices}
              </div>
            </div>
            <div className="p-3 sm:px-5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Paid On Time</div>
              <div className="font-mono text-base font-bold text-emerald-400 mt-0.5">
                {BUSINESS_DASHBOARD_STATS.paidOnTimeRate}
              </div>
            </div>
            <div className="p-3 sm:px-5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Avg Pay Turnaround</div>
              <div className="font-mono text-base font-bold text-cyan-300 mt-0.5">
                {BUSINESS_DASHBOARD_STATS.avgInvoiceTurnaround}
              </div>
            </div>
          </div>

          {/* Main Content Area: Universal Business Orders & Customers */}
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ordersData.map((column) => (
                <div
                  key={column.id}
                  className="flex flex-col rounded-xl border border-white/[0.07] bg-[#111117]/80 p-3.5"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-200">
                        {column.title}
                      </span>
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.2 text-[10px] font-mono text-zinc-400">
                        {column.count}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] font-semibold text-emerald-400">
                      {column.totalValue}
                    </span>
                  </div>

                  {/* Order & Customer Cards */}
                  <div className="space-y-3">
                    {column.orders.map((order) => {
                      const isSelected = activeOrderId === order.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setActiveOrderId(order.id)}
                          className={`group rounded-lg border p-3.5 transition-all cursor-pointer ${
                            isSelected
                              ? "border-cyan-500/50 bg-[#151522] shadow-[0_0_20px_rgba(56,189,248,0.12)] ring-1 ring-cyan-500/30"
                              : "border-white/[0.08] bg-[#14141c]/90 hover:border-white/20 hover:bg-[#181822]"
                          }`}
                        >
                          {/* Card Top: Customer Company & Invoice Status */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 truncate">
                              <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                              <span className="text-xs font-bold text-white tracking-tight truncate">
                                {order.company}
                              </span>
                            </div>

                            <span
                              className={`rounded border px-1.5 py-0.5 text-[10px] font-medium font-mono ${
                                order.invoiceStatus === "Paid"
                                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : order.invoiceStatus === "Sent"
                                  ? "text-cyan-300 bg-cyan-500/10 border-cyan-500/20"
                                  : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                              }`}
                            >
                              Invoice: {order.invoiceStatus}
                            </span>
                          </div>

                          {/* Order Scope / Title */}
                          <p className="mt-1.5 text-xs text-zinc-300 font-medium leading-snug">
                            {order.orderTitle}
                          </p>

                          {/* Contact Person */}
                          <div className="mt-1 text-[11px] text-zinc-400">
                            Customer: <span className="text-zinc-300">{order.customer}</span>
                          </div>

                          {/* Amount & Due Date */}
                          <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
                            <div className="font-mono text-xs font-bold text-emerald-400">
                              {order.formattedAmount}
                            </div>

                            <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                              <Clock className="h-3 w-3 text-zinc-500" />
                              <span>{order.date}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Real Interactive Business Revenue Chart */}
            <div className="mt-5 rounded-xl border border-white/[0.1] bg-[#101016]/95 p-4 sm:p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Monthly Revenue & Invoicing Report
                    </h4>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-emerald-500/30 text-emerald-300 bg-emerald-950/30 font-mono">
                      Cash Flow Healthy
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Clear overview of total payments received vs. outstanding customer invoices
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                    <span className="text-zinc-300">Received ($k)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#818cf8]" />
                    <span className="text-zinc-300">Invoiced ($k)</span>
                  </div>
                </div>
              </div>

              {/* Responsive Chart Container with Stable Height and Zero-Jitter SSR Skeleton */}
              <div className="mt-4 w-full h-[220px] min-h-[220px] relative">
                {isMounted ? (
                  <ChartContainer config={chartConfig} className="h-[220px] w-full aspect-auto">
                    <BarChart
                      accessibilityLayer
                      data={MONTHLY_REVENUE_DATA}
                      margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fill: "#a1a1aa", fontSize: 11 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tick={{ fill: "#71717a", fontSize: 10 }}
                        tickFormatter={(val) => `$${val}k`}
                      />
                      <ChartTooltip
                        cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar
                        isAnimationActive={false}
                        dataKey="received"
                        fill="var(--color-received)"
                        radius={[4, 4, 0, 0]}
                        name="Received Revenue"
                      />
                      <Bar
                        isAnimationActive={false}
                        dataKey="invoiced"
                        fill="var(--color-invoiced)"
                        radius={[4, 4, 0, 0]}
                        name="Total Invoiced"
                        opacity={0.65}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  /* Static SVG Skeleton for instant SSR rendering with zero shift */
                  <div className="h-[220px] w-full flex flex-col justify-end pb-6 px-4">
                    <div className="flex items-end justify-between h-[170px] border-b border-white/[0.06] pb-2">
                      {MONTHLY_REVENUE_DATA.map((item) => (
                        <div key={item.month} className="flex flex-col items-center gap-1.5 w-12">
                          <div className="flex items-end gap-1.5 h-[140px]">
                            <div
                              className="w-3 sm:w-4 bg-[#38bdf8] rounded-t"
                              style={{ height: `${(item.received / 60) * 130}px` }}
                            />
                            <div
                              className="w-3 sm:w-4 bg-[#818cf8]/65 rounded-t"
                              style={{ height: `${(item.invoiced / 60) * 130}px` }}
                            />
                          </div>
                          <span className="text-[11px] text-zinc-400 font-mono">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
