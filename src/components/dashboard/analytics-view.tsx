"use client";

import React from "react";
import {
  TrendingUp,
  Award,
  Zap,
  Clock,
  Target,
  Sparkles,
} from "lucide-react";
import { PIPELINE_ANALYTICS, Deal } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface AnalyticsViewProps {
  deals: Deal[];
}

const chartConfig = {
  actual: {
    label: "Actual Revenue ($k)",
    color: "#38bdf8",
  },
  target: {
    label: "Quota Target ($k)",
    color: "#818cf8",
  },
} satisfies ChartConfig;

export function AnalyticsView({ deals }: AnalyticsViewProps) {
  const wonDeals = deals.filter((d) => d.stageId === "stage-won");
  const wonTotal = wonDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      {/* High-Level Metric Tiles via Shadcn Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-500">
                Win Rate
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                {PIPELINE_ANALYTICS.winRate}%
              </span>
              <span className="inline-flex items-center text-[11px] font-mono font-semibold text-emerald-400">
                +4.8%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Based on completed evaluation cycles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-500">
                Avg Deal Size
              </span>
              <Target className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-black text-white">
              {PIPELINE_ANALYTICS.formattedAvgDealSize}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Across active pipeline contracts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-500">
                Avg Sales Velocity
              </span>
              <Clock className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-black text-white">
              {PIPELINE_ANALYTICS.avgDealCycleDays} Days
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Inquiry to signed contract
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-500">
                Won Revenue
              </span>
              <Award className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-black text-emerald-400">
              ${wonTotal.toLocaleString()}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {wonDeals.length} deals closed won
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Velocity & Monthly Target Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-7 bg-[#0f0f16] border-white/[0.08] shadow-xl">
          <CardHeader className="pb-4 border-b border-white/[0.06] flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <CardTitle className="text-sm font-bold text-white">
                  Monthly Quota Target vs. Actual Closed
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-zinc-400 mt-0.5">
                Performance across recent sales quarters ($ in thousands)
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                <span className="text-zinc-300">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#818cf8]" />
                <span className="text-zinc-300">Target</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="w-full h-[240px]">
              <ChartContainer config={chartConfig} className="h-[240px] w-full">
                <BarChart
                  data={PIPELINE_ANALYTICS.monthlyPerformance}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#71717a", fontSize: 10 }}
                    tickFormatter={(val) => `$${val}k`}
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="actual"
                    fill="var(--color-actual)"
                    radius={[4, 4, 0, 0]}
                    name="Actual Revenue"
                  />
                  <Bar
                    dataKey="target"
                    fill="var(--color-target)"
                    radius={[4, 4, 0, 0]}
                    name="Target Quota"
                    opacity={0.6}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Stage Conversion Analysis */}
        <Card className="lg:col-span-5 bg-[#0f0f16] border-white/[0.08] shadow-xl flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-white/[0.06] flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-400" />
              <CardTitle className="text-sm font-bold text-white">
                Stage Conversion Funnel
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/30 text-indigo-300">
              Live Conversion
            </Badge>
          </CardHeader>

          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              {PIPELINE_ANALYTICS.funnelMetrics.map((step, idx) => (
                <div key={step.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">
                      {idx + 1}. {step.stage}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-zinc-400">{step.count} deals</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-cyan-400 font-bold">
                        {step.conversionRate}
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                      style={{
                        width: step.conversionRate,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl border border-white/[0.06] bg-black/40 text-xs text-zinc-400 flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>
                Highest friction point detected between <strong>Proposal</strong> and{" "}
                <strong>Negotiation</strong> (44% to 28%).
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
