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
import { HeroStrands } from "@/components/sections/HeroStrands";
import { useMotionOK } from "@/lib/useMotionOK";
import TrueFocus from "@/components/reactbits/TrueFocus";
import { cn } from "@/lib/utils";

// Deterministic particle field — hardcoded so SSR and client markup match.
const PARTICLES = [
  { left: 6, size: 2, delay: 0, duration: 16, drift: 20 },
  { left: 13, size: 3, delay: 3, duration: 19, drift: -15 },
  { left: 19, size: 2, delay: 6, duration: 14, drift: 10 },
  { left: 25, size: 2, delay: 1.5, duration: 18, drift: -25 },
  { left: 31, size: 3, delay: 8, duration: 20, drift: 15 },
  { left: 37, size: 2, delay: 4, duration: 15, drift: -10 },
  { left: 43, size: 2, delay: 9.5, duration: 17, drift: 30 },
  { left: 49, size: 3, delay: 2, duration: 19, drift: -20 },
  { left: 55, size: 2, delay: 6.5, duration: 14, drift: 12 },
  { left: 60, size: 2, delay: 11, duration: 18, drift: -30 },
  { left: 66, size: 3, delay: 0.8, duration: 16, drift: 18 },
  { left: 72, size: 2, delay: 5, duration: 20, drift: -12 },
  { left: 78, size: 2, delay: 8.5, duration: 15, drift: 25 },
  { left: 83, size: 3, delay: 3.5, duration: 19, drift: -18 },
  { left: 88, size: 2, delay: 7, duration: 17, drift: 14 },
  { left: 92, size: 2, delay: 10, duration: 14, drift: -22 },
  { left: 96, size: 3, delay: 1.2, duration: 18, drift: 16 },
  { left: 3, size: 2, delay: 12, duration: 20, drift: -8 },
  { left: 46, size: 2, delay: 13.5, duration: 16, drift: 28 },
  { left: 70, size: 3, delay: 9, duration: 19, drift: -16 },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // Swap to the kinetic TrueFocus headline once the client confirms motion is
  // OK (works on mobile too); SSR + reduced-motion render the plain <h1>.
  const showFocus = useMotionOK();

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
      {/* ── Background layers ─────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Luminous top-glow light field — lit from above, fades into the base
            (not a mid-page black wall). Also the mobile / reduced-motion ambient. */}
        <div className="arch-gradient animate-breathe absolute inset-[-5%] will-change-transform" />
        {/* Blueprint grid, faded by mask */}
        <div
          className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_42%,black_30%,transparent_75%)]"
          aria-hidden
        />

        {/* Desktop Strands WebGL backdrop — flowing cyan/blue light ribbons.
            Desktop + non-reduced-motion only; mobile shows the glow instead. */}
        <HeroStrands />
        {/* Legibility veil over Strands only (desktop). Lighter than before so
            the luminous look survives, with a centre radial for the headline. */}
        <div
          className="absolute inset-0 hidden md:block motion-reduce:!hidden"
          style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.30) 0%, rgba(10,10,10,0.5) 58%, #0a0a0a 100%)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden md:block motion-reduce:!hidden"
          style={{ background: "radial-gradient(ellipse 85% 75% at 50% 48%, rgba(10,10,10,0) 20%, rgba(10,10,10,0.78) 100%)" }}
          aria-hidden
        />

        {/* Drifting gradient orbs — desktop only; cyan + blue (no violet) */}
        <div
          className="animate-orb-drift absolute left-[12%] top-[20%] hidden h-72 w-72 rounded-full opacity-30 blur-[70px] md:block"
          style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="animate-orb-drift absolute right-[10%] top-[42%] hidden h-80 w-80 rounded-full opacity-25 blur-[70px] md:block"
          style={{
            background: "radial-gradient(circle, #2563eb 0%, transparent 70%)",
            animationDelay: "-9s",
          }}
          aria-hidden
        />

        {/* Rising particles — desktop only (cyan / sky-blue) */}
        <div className="absolute inset-0 hidden overflow-hidden sm:block" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={cn(
                "animate-float-up absolute bottom-[-12px] rounded-full will-change-transform",
                i % 2 === 0 ? "bg-sky/40" : "bg-[#38bdf8]/35",
              )}
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                ["--drift" as string]: `${p.drift}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Foreground ────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32 text-center">
        {/* Local scrim — keeps white text crisp over the bright glow without
            dimming the overall luminosity. */}
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

        {/* Kinetic TrueFocus headline (motion) / plain legible <h1> (SSR + reduced) */}
        <div className="relative">
          {showFocus ? (
            <div
              aria-label="We Build Websites That Get You Paid"
              className="font-display text-[clamp(2.1rem,7.5vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white text-shadow-hero"
            >
              <TrueFocus
                sentence="We Build Websites That Get You Paid"
                borderColor="#38bdf8"
                glowColor="rgba(56,189,248,0.65)"
                blurAmount={4}
                animationDuration={0.6}
                pauseBetweenAnimations={1.1}
              />
            </div>
          ) : (
            <h1 className="font-display text-[clamp(2.1rem,7.5vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white text-shadow-hero">
              We Build Websites <span className="gradient-text">That Get You Paid.</span>
            </h1>
          )}
        </div>

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
          <Button href="/contact" variant="glassCta" className="w-full sm:w-auto">
            Start Your Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button href="/portfolio" variant="glassBright" className="w-full sm:w-auto">
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
