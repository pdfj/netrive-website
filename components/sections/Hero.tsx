"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse-tracking parallax for the sub-copy — springs keep it silky
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const subX = useTransform(smx, [-0.5, 0.5], [-8, 8]);
  const subY = useTransform(smy, [-0.5, 0.5], [-5, 5]);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* ── Background: soft, STATIC orange blur-gradient (no glow, no Strands) ── */}
      <div className="absolute inset-0 z-0">
        <div className="arch-gradient absolute inset-0" />
        {/* Subtle blueprint grid, faded by mask */}
        <div
          className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_42%,black_30%,transparent_75%)]"
          aria-hidden
        />
      </div>

      {/* ── Foreground ────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32 text-center">
        {/* Local scrim — keeps text crisp on the dark canvas */}
        <div className="hero-text-scrim pointer-events-none absolute inset-0 -z-10" aria-hidden />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-pill glass px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.16em] text-white/90 shadow-glow-cyan"
        >
          <Star className="h-3.5 w-3.5 fill-sky text-sky" />
          4.9 rating · 50+ sites shipped · SA &amp; US
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.4rem,7.5vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white text-shadow-hero"
        >
          We Build Websites <br className="hidden sm:block" />
          <span className="gradient-text">That Get You Paid.</span>
        </motion.h1>

        <motion.p
          style={{ x: subX, y: subY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-xl text-balance text-base leading-[1.75] text-white/80 text-shadow-hero sm:text-lg"
        >
          From landing pages to full e-commerce stores — NetRive delivers fast,
          modern, high-converting websites for ambitious businesses across South
          Africa, the US and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="/contact" variant="primary" className="w-full sm:w-auto">
            Start Your Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button href="/portfolio" variant="glass" className="w-full sm:w-auto">
            See Our Work
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white/75"
        >
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.9 Google Rating
          </span>
          <span className="text-white/20">·</span>
          <span>50+ Projects Delivered</span>
          <span className="text-white/20">·</span>
          <span>South Africa &amp; the US</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="animate-bounce-arrow h-6 w-6 text-sky/70" />
      </div>
    </section>
  );
}
