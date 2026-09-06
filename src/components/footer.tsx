"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { LightCrmLogo } from "@/components/lightcrm-logo";

export function Footer() {
  return (
    <footer className="w-full bg-transparent pt-16 pb-12 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-white/[0.06]">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center">
              <LightCrmLogo size="md" />
            </div>

            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
              The simple, modern CRM designed to help every business manage companies, customers,
              orders, invoices, and reports with zero complexity.
            </p>

            {/* Live Systems Status Indicator */}
            <Badge variant="emerald" className="py-1 px-3 font-mono text-xs gap-2 bg-emerald-950/30 border-emerald-500/30 text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>All systems operational (100% cloud synced)</span>
            </Badge>
          </div>

          {/* Column 1: Core CRM Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#pipeline" className="hover:text-white transition-colors">
                  Business Dashboard
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Customer Directory
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Order & Job Tracker
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Invoices & Payments
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Reports & Charts
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Who It's For */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Who It's For
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Small Businesses
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Agencies & Studios
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Freelancers
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Consultants
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Local Shops & Retail
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tools & Export */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Tools & Data
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  1-Click PDF Invoicing
                </a>
              </li>
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  CSV & Excel Export
                </a>
              </li>
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Online Payment Links
                </a>
              </li>
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Mobile & Tablet Access
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  14-Day Free Trial
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#metrics" className="hover:text-white transition-colors">
                  Why LightCRM
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>
              © {new Date().getFullYear()} LightCRM. The simple CRM built for every business.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#pricing" className="hover:text-zinc-300 transition-colors">
              Pricing
            </a>
            <a href="#pipeline" className="hover:text-zinc-300 transition-colors">
              Dashboard
            </a>
            <a href="#features" className="hover:text-zinc-300 transition-colors">
              Features
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
