import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Hero } from "@/components/sections/Hero";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { ServicesInteractive } from "@/components/sections/ServicesInteractive";
import { Process } from "@/components/sections/Process";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Portfolio } from "@/components/sections/Portfolio";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { HumanAi } from "@/components/sections/HumanAi";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "NetRive — Websites That Work. Businesses That Grow.",
  description:
    "Cape Town's web agency, delivering fast, modern, high-converting websites for ambitious businesses across South Africa. Free preview first — pay only when you approve.",
  openGraph: { locale: "en_ZA" },
  alternates: { canonical: "/sa" },
};

// South African version of the homepage — same sections, Rand pricing forced.
export default function SaHome() {
  return (
    <PageTransition>
      <main>
        <Hero />
        <TrustMarquee />
        <ServicesInteractive />
        <Process />
        <ServicesGrid />
        <Portfolio />
        <Pricing forceZar />
        <Testimonials />
        <HumanAi />
        <Contact />
      </main>
    </PageTransition>
  );
}
