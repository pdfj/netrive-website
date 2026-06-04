import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing from R1,500. No hidden fees — websites delivered in as little as 12 hours.",
};

export default function PricingPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="mx-auto max-w-content px-6 py-16 text-center">
          <span className="font-grotesk text-xs uppercase tracking-[0.18em] text-electric">Transparent Pricing</span>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
            Pick Your Package
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
            From a R1,500 landing page to a full custom web application. No hidden fees, no surprises — just real websites delivered fast.
          </p>
        </div>
        <Pricing hideSectionHeading />
        <Testimonials />
        <Contact />
      </main>
    </PageTransition>
  );
}
