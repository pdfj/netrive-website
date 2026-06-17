import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Real websites, real results. See how NetRive has helped businesses across South Africa grow online.",
};

export default function PortfolioPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse 90% 90% at 50% 0%, rgba(255,122,26,0.18) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-6 py-16 text-center">
            <span className="font-grotesk text-xs uppercase tracking-[0.18em] gradient-text-accent">
              Selected Work
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
              Work We&apos;re Proud Of
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
              Real websites. Real results. Real businesses growing online.
            </p>
          </div>
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
