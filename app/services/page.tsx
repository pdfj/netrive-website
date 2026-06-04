import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ServicesInteractive } from "@/components/sections/ServicesInteractive";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Services",
  description: "Web design, development, e-commerce, SEO, branding, Google Ads and more — everything your business needs online.",
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="mx-auto max-w-content px-6 py-16 text-center">
          <span className="font-grotesk text-xs uppercase tracking-[0.18em] text-electric">What We Do</span>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
            Everything Your Business Needs Online
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
            From a single landing page to a full e-commerce empire — we build fast, modern, high-converting digital products for ambitious businesses across South Africa and beyond.
          </p>
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
