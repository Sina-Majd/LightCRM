import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { AudienceStrip } from "@/components/landing/audience-strip";
import { BeforeAfter } from "@/components/landing/before-after";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AudienceTabs } from "@/components/landing/audience-tabs";
import { Commitments } from "@/components/landing/commitments";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingFaq } from "@/components/landing/faq";
import { LandingCta } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <LandingNavbar />
      <main>
        <LandingHero />
        <AudienceStrip />
        <BeforeAfter />
        <Features />
        <HowItWorks />
        <AudienceTabs />
        <Commitments />
        <LandingPricing />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
