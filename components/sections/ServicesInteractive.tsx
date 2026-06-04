"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { ServiceScrollWheel } from "./ServiceScrollWheel";

export function ServicesInteractive() {
  const [active, setActive] = useState(0);
  const service = SERVICES[active];

  return (
    <section className="relative overflow-hidden bg-night py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(44,95,255,0.18), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Left — static heading + dynamic description */}
        <div>
          <span className="font-grotesk text-xs uppercase tracking-[0.18em] text-electric">
            Our Services
          </span>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight gradient-text">
            What Can We Do For Your Business?
          </h2>

          <div className="mt-7 min-h-[96px] max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-display text-xl font-medium text-white">{service.name}</h3>
                <p className="mt-2 text-base leading-[1.7] text-haze">{service.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link
            href="/services"
            className="group mt-8 inline-flex items-center gap-2 rounded-btn glass px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/[0.08]"
          >
            Explore All Services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Right — the iOS scroll wheel */}
        <ServiceScrollWheel active={active} onActiveChange={setActive} />
      </div>
    </section>
  );
}
