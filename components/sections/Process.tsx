"use client";

import { Palette, Rocket, Search, Zap, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = { Search, Palette, Zap, Rocket };

export function Process() {
  return (
    <section className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      <SectionHeading label="The Process" title="How We Work" />

      <div className="relative mt-16">
        {/* dashed gradient connector (desktop) */}
        <div
          className="absolute left-[12%] right-[12%] top-9 hidden h-px md:block"
          style={{
            background:
              "repeating-linear-gradient(to right, rgba(44,95,255,0.6) 0 8px, transparent 8px 18px)",
          }}
          aria-hidden
        />

        <ol className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          {PROCESS.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.li
                key={step.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
              >
                <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl glass">
                  <Icon className="h-7 w-7 text-sky" />
                  <span className="absolute -right-2 -top-3 font-display text-2xl font-bold gradient-text">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-medium text-white">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-[220px] text-sm leading-[1.7] text-haze">
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
