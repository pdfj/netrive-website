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

export default function Home() {
  return (
    <PageTransition>
      <main>
        <Hero />
        <TrustMarquee />
        <ServicesInteractive />
        <Process />
        <ServicesGrid />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <HumanAi />
        <Contact />
      </main>
    </PageTransition>
  );
}
