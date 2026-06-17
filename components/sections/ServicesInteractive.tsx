"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ServicesInteractive() {
  const [active, setActive] = useState(0);
  const service = SERVICES[active];

  return (
    <section className="relative overflow-hidden bg-night/50 py-24 sm:py-32">
      {/* Ambient top glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(56,189,248,0.16), transparent 65%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-content px-6">
        <SectionHeading
          label="What We Do"
          title="Pick a Service. We Handle the Rest."
          subtitle="Sixteen capabilities, one team. Tap any service to see how it grows your business."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Service list */}
          <div className="no-scrollbar flex max-h-[440px] flex-col gap-1.5 overflow-y-auto pr-1">
            {SERVICES.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "group flex shrink-0 items-center justify-between rounded-input px-5 py-3.5 text-left transition-all duration-200",
                  i === active
                    ? "glass-electric text-white"
                    : "text-haze hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={cn(
                      "font-grotesk text-xs tabular-nums",
                      i === active ? "gradient-text-accent font-bold" : "text-white/30",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium">{s.name}</span>
                </span>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    i === active
                      ? "translate-x-0 text-sky opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                  )}
                />
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="relative flex min-h-[320px] items-center overflow-hidden rounded-card glass-bright p-8 sm:p-10">
            {/* Panel corner glow */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-[90px]"
              style={{ background: "linear-gradient(135deg, #00d4ff, #2563eb)" }}
              aria-hidden
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <span className="font-display text-7xl font-bold gradient-text-accent opacity-30">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-3xl font-semibold text-white">
                  {service.name}
                </h3>
                <p className="mt-4 max-w-md text-base leading-[1.8] text-haze">
                  {service.description}
                </p>
                <Link
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-sky transition-colors hover:text-white"
                >
                  Start with {service.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
