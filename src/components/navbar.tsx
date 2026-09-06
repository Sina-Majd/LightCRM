"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Users,
  Package,
  FileText,
  Store,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LightCrmLogo } from "@/components/lightcrm-logo";

interface NavbarProps {
  onOpenCommand?: () => void;
}

export function Navbar({ onOpenCommand }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false);
    }, 180);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center group">
            <LightCrmLogo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 text-xs font-medium text-zinc-400">
            <a
              href="#pipeline"
              className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Dashboard
            </a>

            {/* Who is it for Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setSolutionsOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
                  solutionsOpen
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                }`}
                aria-expanded={solutionsOpen}
              >
                <span>For Your Business</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    solutionsOpen ? "rotate-180 text-white" : "text-zinc-400"
                  }`}
                />
              </button>

              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-white/[0.12] bg-[#0d0d12]/95 p-2 shadow-2xl backdrop-blur-2xl z-50 pointer-events-auto"
                  >
                    <div className="space-y-1">
                      <a
                        href="#features"
                        onClick={() => setSolutionsOpen(false)}
                        className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/[0.06]"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                          <Store className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            Small Businesses & Local Shops
                          </div>
                          <p className="mt-0.5 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            Organize client orders, customer records, and daily invoices with zero complexity.
                          </p>
                        </div>
                      </a>

                      <a
                        href="#features"
                        onClick={() => setSolutionsOpen(false)}
                        className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/[0.06]"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            Agencies & Freelancers
                          </div>
                          <p className="mt-0.5 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            Track client deliverables, send professional invoices, and get paid on time.
                          </p>
                        </div>
                      </a>

                      <a
                        href="#features"
                        onClick={() => setSolutionsOpen(false)}
                        className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-white/[0.06]"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                          <UserCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            Consultants & Services
                          </div>
                          <p className="mt-0.5 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                            Keep conversation notes, schedule client work, and monitor your monthly income.
                          </p>
                        </div>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#features"
              className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Features
            </a>
            <a
              href="#overview"
              className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="rounded-md px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              Pricing
            </a>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCommand}
            className="hidden sm:flex items-center gap-2 h-8 px-2.5 text-xs text-zinc-400 hover:border-white/20 hover:text-zinc-200 shadow-sm cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[11px]">Search Customers & Orders</span>
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.05]"
          >
            <a href="#pricing">Sign In</a>
          </Button>

          <Button
            size="sm"
            asChild
            className="h-8 px-3.5 text-xs font-semibold group hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-shadow cursor-pointer bg-white text-zinc-950 hover:bg-zinc-200"
          >
            <a href="#pricing" className="inline-flex items-center gap-1.5">
              <span>Try for Free</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center rounded-lg border border-white/10 p-2 text-zinc-400 hover:text-white hover:bg-white/[0.05]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0c0c10]/95 px-4 pt-3 pb-6 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/[0.05] hover:text-white"
            >
              Dashboard
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/[0.05] hover:text-white"
            >
              Features & Tools
            </a>
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/[0.05] hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-zinc-300 hover:bg-white/[0.05] hover:text-white"
            >
              Pricing Plans
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommand?.();
              }}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-zinc-500" />
                Search Customers & Orders
              </span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                ⌘K
              </kbd>
            </button>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 shadow-md cursor-pointer hover:bg-zinc-200 transition-colors"
            >
              <span>Try for Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
