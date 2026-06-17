import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Process } from "@/components/sections/Process";
import { HumanAi } from "@/components/sections/HumanAi";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "NetRive is Cape Town's premier web agency — human-led, AI-powered, delivering fast modern websites for ambitious businesses.",
};

const VALUES = [
  {
    title: "Speed without compromise",
    body: "We deliver in as little as 24 hours — not by cutting corners, but by working smarter with the best tools available.",
  },
  {
    title: "Real business focus",
    body: "Every pixel and line of code exists to grow your business. We build for conversions, not just aesthetics.",
  },
  {
    title: "Transparent & honest",
    body: "Clear pricing, clear timelines, no surprises. We do what we say, when we say it.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(99,102,241,0.22) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-6 py-20 text-center">
            <span className="font-grotesk text-xs uppercase tracking-[0.18em] gradient-text-accent">
              About NetRive
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
              Human-led. AI-Powered.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-[1.7] text-haze sm:text-lg">
              NetRive is a Cape Town-based web agency built on one idea: every business
              deserves a website that actually works. We combine expert human creativity
              with AI precision to deliver better websites, faster than anyone else.
            </p>
          </div>
        </div>

        <section className="mx-auto max-w-content px-6 py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="group relative overflow-hidden rounded-card glass p-7 transition-all duration-300 hover:-translate-y-1 hover:border-sky/25"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-25"
                  style={{ background: "linear-gradient(135deg, #00d4ff, #7C3AED)" }}
                  aria-hidden
                />
                <h3 className="font-display text-xl font-semibold text-white">{v.title}</h3>
                <p className="mt-3 text-sm leading-[1.7] text-haze">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <HumanAi />
        <Process />
        <Testimonials />
        <Contact />
      </main>
    </PageTransition>
  );
}
