"use client";

import { Palette, Rocket, Search, Zap, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = { Search, Palette, Zap, Rocket };

export function Process() {
  return (
    <section className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      <SectionHeading
        label="The Process"
        title="Discovery → Design → Build → Launch"
        subtitle="Four steps. Zero friction. Your site live in as little as 24 hours."
      />

      <div className="relative mt-16">
        {/* gradient connector (desktop) */}
        <div
          className="absolute left-[12%] right-[12%] top-9 hidden h-px md:block"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,212,255,0.5) 15%, rgba(0,102,255,0.5) 85%, transparent)",
          }}
          aria-hidden
        />

        <ol className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          {PROCESS.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.li
                key={step.title}
                className="group relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <div className="gradient-border relative mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-night transition-transform duration-300 group-hover:-translate-y-1.5">
                  <Icon className="h-7 w-7 text-sky" />
                  <span className="absolute -right-3 -top-3.5 font-display text-2xl font-bold gradient-text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-medium text-white">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-[230px] text-sm leading-[1.7] text-haze">
                  {step.desc}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
