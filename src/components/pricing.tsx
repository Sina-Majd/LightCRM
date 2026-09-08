"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      description: "For freelancers, consultants, and solo business owners getting organized.",
      monthlyPrice: 19,
      annualPrice: 15,
      highlight: false,
      badge: "Solo & Freelance",
      features: [
        "Up to 150 customer & company profiles",
        "Visual order & deliverable tracking board",
        "1-click professional PDF & email invoices",
        "Online payment links (card & bank transfer)",
        "⌘K lightning customer & order search",
        "CSV & Excel data export anytime",
        "Standard email support",
      ],
      cta: "Start Free 14-Day Trial",
      href: "/register?plan=starter",
    },
    {
      name: "Business",
      description: "For small teams, shops, and agencies managing steady orders and client billing.",
      monthlyPrice: 49,
      annualPrice: 39,
      highlight: true,
      badge: "Most Popular",
      features: [
        "Everything in Starter, plus:",
        "Unlimited customers, companies & contacts",
        "Unlimited active orders & project workflows",
        "Custom invoice branding with your business logo",
        "Automated gentle payment reminder emails",
        "Visual monthly revenue & cash flow charts",
        "Up to 5 team members with role permissions",
        "Priority email & chat support",
      ],
      cta: "Start Free 14-Day Trial",
      href: "/register?plan=business",
    },
    {
      name: "Pro Team",
      description: "For growing businesses and studios that need full team collaboration and deep insights.",
      monthlyPrice: 99,
      annualPrice: 79,
      highlight: false,
      badge: "Teams & Scale",
      features: [
        "Everything in Business, plus:",
        "Unlimited team members & user seats",
        "Advanced visual reports & client spending analytics",
        "Multiple company profile management",
        "Automated recurring subscriptions & retainer orders",
        "1-on-1 personal setup & data migration help",
        "Dedicated VIP priority support",
      ],
      cta: "Start Free 14-Day Trial",
      href: "/register?plan=pro",
    },
  ];

  return (
    <section id="pricing" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] bg-gradient-to-r from-cyan-500/10 via-indigo-600/10 to-purple-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <Badge variant="indigo" className="mb-3.5 bg-cyan-500/10 text-cyan-300 border-cyan-500/25">
            <Sparkles className="h-3 w-3 mr-1 text-cyan-400" />
            Simple Transparent Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Fair, simple plans.{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              No hidden fees.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Start with a 14-day free trial. No credit card required. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#121218] p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                !annual ? "bg-white text-zinc-950 shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                annual ? "bg-white text-zinc-950 shadow-md" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                  annual
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-cyan-500/20 text-cyan-300"
                }`}
              >
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {tiers.map((tier, idx) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className="flex"
              >
                <Card
                  className={`relative flex flex-col justify-between w-full rounded-2xl p-6 sm:p-8 transition-all ${
                    tier.highlight
                      ? "border-cyan-500/50 bg-gradient-to-b from-[#141422] to-[#0e0e18] shadow-[0_20px_50px_-12px_rgba(56,189,248,0.2),0_0_0_1px_rgba(56,189,248,0.25)] ring-1 ring-cyan-500/30"
                      : "border-white/10 bg-[#0d0d12]/90 shadow-xl hover:border-white/20"
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                      {tier.badge}
                    </span>
                    {tier.highlight && (
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px] font-mono py-0.5">
                        Recommended
                      </Badge>
                    )}
                  </div>

                  {/* Plan Name & Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{tier.name}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed min-h-[40px]">
                      {tier.description}
                    </p>

                    {/* Price */}
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white">
                        ${price}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">/ month</span>
                    </div>
                    {annual && (
                      <p className="mt-1 text-[11px] font-mono text-emerald-400">
                        Billed annually (${price! * 12}/year)
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-white/[0.08]" />

                  {/* Features List */}
                  <div className="flex-1 space-y-3">
                    <div className="text-xs font-semibold text-zinc-300">Included features:</div>
                    <ul className="space-y-2.5">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 pt-4">
                    <Button
                      size="lg"
                      asChild
                      className={`w-full font-semibold cursor-pointer transition-all ${
                        tier.highlight
                          ? "bg-white text-zinc-950 hover:bg-zinc-100 shadow-lg shadow-cyan-950/40"
                          : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                      }`}
                    >
                      <Link href={tier.href} className="inline-flex items-center justify-center gap-2">
                        <span>{tier.cta}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
