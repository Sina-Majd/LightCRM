"use client";

import React from "react";
import { ArrowRight, Play, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { CLIENT_LOGOS } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 md:pt-24 md:pb-16 overflow-hidden">
      {/* Hero Radiant Light & Concentric Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
        <div className="absolute top-[-50px] w-[700px] sm:w-[900px] h-[400px] rounded-full bg-gradient-to-b from-cyan-500/30 via-indigo-600/30 to-purple-500/20 blur-[100px] animate-halo-pulse" />
        <div className="absolute top-[30px] w-[600px] sm:w-[800px] h-[300px] rounded-full bg-gradient-to-tr from-cyan-400/25 via-indigo-600/30 to-violet-600/25 blur-[90px] animate-aurora-drift-1" />

        <div className="absolute top-[50px] w-[640px] sm:w-[820px] h-[340px] rounded-[50%] border border-cyan-400/30 shadow-[0_0_90px_rgba(56,189,248,0.3)] opacity-85" />
        <div className="absolute top-[85px] w-[500px] sm:w-[660px] h-[260px] rounded-[50%] border border-indigo-400/25 shadow-[0_0_60px_rgba(99,102,241,0.25)] opacity-65" />
        <div className="absolute top-[120px] w-[360px] sm:w-[500px] h-[180px] rounded-[50%] border border-purple-400/20 opacity-45" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Announcement Banner Pill */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 pr-3.5 text-xs text-zinc-300 backdrop-blur-md hover:border-cyan-500/30 hover:bg-white/[0.07] transition-colors group cursor-pointer"
        >
          <Badge variant="indigo" className="gap-1.5 py-0.5 text-[11px] font-medium shadow-xs bg-cyan-500/15 text-cyan-300 border-cyan-500/30">
            <Zap className="h-3 w-3 text-cyan-400" />
            What's new
          </Badge>
          <span className="font-normal text-zinc-300">
            Faster invoicing, smarter order tracking — agencies, shops, freelancers & consultants
          </span>
          <ChevronRight className="h-3 w-3 text-zinc-500 group-hover:translate-x-0.5 group-hover:text-cyan-300 transition-transform" />
        </motion.div>

        {/* Universal Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
          className="mt-8 max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]"
        >
          Simplify Everything: One CRM for all your critical{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
            customer data and orders.
          </span>
        </motion.h1>

        {/* Clear Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal"
        >
          Run your entire business in one easy place. Keep client and company records organized,
          track every order from start to finish, send professional invoices, and see clear financial reports.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          <Button
            size="lg"
            asChild
            className="w-full sm:w-auto shadow-xl shadow-cyan-950/40 group cursor-pointer hover:shadow-[0_0_28px_rgba(56,189,248,0.35)] hover:bg-zinc-100 transition-all duration-200 bg-white text-zinc-950 font-semibold"
          >
            <a href="#pricing" className="inline-flex items-center gap-2">
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="h-4 w-4 text-zinc-900 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto gap-2.5 cursor-pointer group hover:bg-white/[0.08] hover:border-white/25 hover:text-white transition-all duration-200"
          >
            <a href="#pipeline" className="inline-flex items-center gap-2">
              <Play className="h-3.5 w-3.5 fill-current text-white/90 group-hover:text-white transition-colors" />
              <span>Explore Interactive Dashboard</span>
            </a>
          </Button>
        </motion.div>

        {/* Clean Social Proof Strip */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
          className="mt-16 sm:mt-20 w-full max-w-5xl pt-4"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Trusted by businesses, agencies, and entrepreneurs worldwide
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center">
            {CLIENT_LOGOS.map((client, idx) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 + idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center gap-2 group cursor-default opacity-60 hover:opacity-100 transition-opacity duration-200"
              >
                <div className="h-2 w-2 rounded-sm bg-zinc-600 group-hover:bg-cyan-400 transition-colors duration-200" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200 uppercase">
                  {client.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
