import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing from R1,500. No hidden fees — websites delivered in as little as 12 hours.",
};

export default function PricingPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse 90% 90% at 50% 0%, rgba(0,150,255,0.18) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-6 py-16 text-center">
            <span className="font-grotesk text-xs uppercase tracking-[0.18em] gradient-text-accent">
              Transparent Pricing
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
              Pick Your Package
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
              From a R1,500 landing page to a full custom web application. No hidden fees,
              no surprises — just real websites delivered fast.
            </p>
          </div>
        </div>
        <Pricing hideSectionHeading />
        <Testimonials />
        <Contact />
      </main>
    </PageTransition>
  );
}
