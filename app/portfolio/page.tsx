import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Work",
  description: "Real websites, real results. See how NetRive has helped businesses across South Africa grow online.",
};

export default function PortfolioPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="mx-auto max-w-content px-6 py-16 text-center">
          <span className="font-grotesk text-xs uppercase tracking-[0.18em] text-electric">Selected Work</span>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
            Work We&apos;re Proud Of
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
            Real websites. Real results. Real businesses growing online.
          </p>
        </div>
        <div className="-mt-8">
          <Portfolio />
        </div>
        <Testimonials />
        <Contact />
      </main>
    </PageTransition>
  );
}
