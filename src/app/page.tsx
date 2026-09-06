"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { HeroMockup } from "@/components/hero-mockup";
import { PersonaTabs } from "@/components/persona-tabs";
import { BentoGrid } from "@/components/bento-grid";
import { Metrics } from "@/components/metrics";
import { Pricing } from "@/components/pricing";
import { CtaBanner } from "@/components/cta-banner";
import { Footer } from "@/components/footer";
import { CommandMenu } from "@/components/command-menu";
import { AmbientBackground } from "@/components/ambient-background";

export default function Home() {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen isolate bg-[#09090b] text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-white">
      {/* Dynamic Ambient Background System */}
      <AmbientBackground />

      {/* Sticky Header Navigation */}
      <Navbar
        onOpenCommand={() => setCommandMenuOpen(true)}
      />

      <main className="flex-1">
        {/* Section 1 & 2: Hero Section with headline & logos */}
        <Hero />

        {/* Section 3: Interactive Sales Pipeline Mockup */}
        <HeroMockup />

        {/* Section 4: Dual-Perspective Feature Showcase */}
        <PersonaTabs />

        {/* Section 5: Bento Grid: Core Technical Innovations */}
        <BentoGrid />

        {/* Section 6: Quantifiable Revenue Metrics */}
        <Metrics />

        {/* Section 7: Transparent Pricing Plans */}
        <Pricing />

        {/* Section 8: High-Conversion CTA Banner */}
        <CtaBanner />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Command Menu (⌘K) Modal */}
      <CommandMenu
        isOpen={commandMenuOpen}
        onClose={() => setCommandMenuOpen(false)}
      />
    </div>
  );
}
