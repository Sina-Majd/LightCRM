"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CtaBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="cta" className="relative py-20 sm:py-28">
      {/* Contained Soft Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[320px] pointer-events-none -z-10">
        <div className="w-full h-full bg-gradient-to-r from-cyan-500/20 via-indigo-600/20 to-purple-500/15 blur-[90px] rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* High-Contrast Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#13131c]/95 via-[#0e0e15]/95 to-[#0a0a0f]/98 px-6 py-14 sm:px-12 sm:py-20 text-center shadow-[0_24px_80px_-16px_rgba(0,0,0,0.9)]"
        >
          {/* Subtle blueprint pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Pill */}
            <Badge variant="indigo" className="mb-4 gap-1.5 py-1 px-3 bg-cyan-500/15 text-cyan-300 border-cyan-500/30">
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Instant 2-Minute Setup · No Credit Card Required</span>
            </Badge>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to run your business with{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                complete clarity?
              </span>
            </h2>

            {/* Subhead */}
            <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              Start your free 14-day trial today. Keep your customer contacts organized, track every active order,
              send clean invoices, and never chase unpaid bills again.
            </p>

            {/* Form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 px-6 py-4 text-sm text-emerald-300 shadow-xl"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>
                  Welcome to LightCRM! Your setup link has been sent to{" "}
                  <strong>{email}</strong>.
                </span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto shrink-0 font-semibold shadow-lg shadow-cyan-950/50 hover:shadow-[0_0_24px_rgba(56,189,248,0.4)] transition-all cursor-pointer bg-white text-zinc-950 hover:bg-zinc-200"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>Start Free Trial</span>
                    <ArrowRight className="h-4 w-4 text-zinc-950" />
                  </span>
                </Button>
              </form>
            )}

            {/* Feature Checklist */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>14-day free access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Easy CSV contacts import</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Cancel or change plans anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
