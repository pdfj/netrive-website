import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ServicesInteractive } from "@/components/sections/ServicesInteractive";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web design, development, e-commerce, mobile apps, SEO, branding, Google & Meta ads, booking systems, payment integration and more — everything your business needs online.",
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
            style={{
              background:
                "radial-gradient(ellipse 90% 90% at 50% 0%, rgba(255,122,26,0.2) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-6 py-16 text-center">
            <span className="font-grotesk text-xs uppercase tracking-[0.18em] gradient-text-accent">
              What We Do
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
              Everything Your Business Needs Online
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
              From a single landing page to a full e-commerce empire — sixteen services,
              one team, zero excuses. Fast, modern, high-converting.
            </p>
          </div>
        </div>
        <div className="-mt-8">
          <ServicesInteractive />
        </div>
        <ServicesGrid />
        <Process />
        <Contact />
      </main>
    </PageTransition>
  );
}
