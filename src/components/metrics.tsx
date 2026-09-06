"use client";

import React from "react";
import { CRM_STATS } from "@/data/mock-data";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Metrics() {
  return (
    <section id="metrics" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-r from-cyan-500/10 via-indigo-600/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

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
            <TrendingUp className="h-3 w-3 mr-1 text-cyan-400" />
            Proven Business Impact
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Clear results for every business.{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Zero complexity.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Real time saved and faster payments reported by business owners, freelancers, and growing teams.
          </p>
        </motion.div>

        {/* 3 Large Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CRM_STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            >
              <Card className="glass-panel glass-panel-hover p-6 sm:p-8 h-full flex flex-col justify-between border-white/[0.08] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                <div>
                  <div className="font-mono text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 tracking-tight">
                    {stat.value}
                  </div>
                  <h3 className="mt-3 text-base sm:text-lg font-bold text-white tracking-tight">
                    {stat.label}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {stat.subtext}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span className="font-mono text-xs text-cyan-300 font-medium">
                    {stat.highlight}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
