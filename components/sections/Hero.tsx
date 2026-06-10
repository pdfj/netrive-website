"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, ChevronDown, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const LINE_ONE = ["We", "Build", "Websites"];
const LINE_TWO = ["That", "Get", "You", "Paid."];

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

/**
 * A single headline word: entrance mask + perpetual float.
 * Outer span = overflow mask, middle = entrance slide, inner = CSS float loop.
 */
function Word({
  children,
  index,
  gradient,
}: {
  children: string;
  index: number;
  gradient?: boolean;
}) {
  return (
    <span className="mr-[0.22em] inline-block overflow-visible align-bottom last:mr-0">
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: "120%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{
          duration: 0.9,
          delay: 0.15 + index * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <span
          className={cn(
            "animate-word-float inline-block will-change-transform",
            gradient && "gradient-text",
          )}
          style={{ animationDelay: `${index * 0.35}s` }}
        >
          {children}
        </span>
      </motion.span>
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse-tracking 3D tilt — springs keep it silky
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotateX = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smx, [-0.5, 0.5], [-9, 9]);
  // Parallax for the sub-copy (moves slightly less = depth)
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
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* ── Background layers ─────────────────────────────── */}
      <div className="absolute inset-0">
        {/* Arch light field */}
        <div className="arch-gradient animate-breathe absolute inset-[-5%] will-change-transform" />
        {/* Deepen lower corners back to black */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_120%,rgba(10,10,10,0.96),transparent_70%)]" />
        {/* Blueprint grid, faded by mask */}
        <div
          className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_45%,black_30%,transparent_75%)]"
          aria-hidden
        />

        {/* Drifting gradient orbs — depth + life */}
        <div
          className="animate-orb-drift absolute left-[12%] top-[22%] h-72 w-72 rounded-full opacity-25 blur-[100px]"
          style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="animate-orb-drift absolute right-[10%] top-[40%] h-80 w-80 rounded-full opacity-25 blur-[110px]"
          style={{
            background: "radial-gradient(circle, #0066ff 0%, transparent 70%)",
            animationDelay: "-9s",
          }}
          aria-hidden
        />

        {/* Rising particles */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="animate-float-up absolute bottom-[-12px] rounded-full bg-sky/40 will-change-transform"
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
      <div className="perspective-1000 relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-pill glass px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.16em] text-white/90 shadow-glow-cyan"
        >
          <Sparkles className="h-3.5 w-3.5 text-sky" />
          Cape Town&apos;s Premier Web Agency
        </motion.div>

        {/* 3D tilting, floating headline */}
        <motion.h1
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="font-display text-[clamp(2.6rem,8vw,5.75rem)] font-bold leading-[1.04] tracking-tight will-change-transform"
        >
          <span
            className="block"
            style={{ transform: "translateZ(30px)" }}
          >
            {LINE_ONE.map((word, i) => (
              <Word key={word} index={i}>
                {word}
              </Word>
            ))}
          </span>
          <span
            className="block drop-shadow-[0_24px_60px_rgba(0,150,255,0.45)]"
            style={{ transform: "translateZ(60px)" }}
          >
            {LINE_TWO.map((word, i) => (
              <Word key={word} index={LINE_ONE.length + i} gradient>
                {word}
              </Word>
            ))}
          </span>
        </motion.h1>

        <motion.p
          style={{ x: subX, y: subY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-xl text-balance text-base leading-[1.75] text-haze sm:text-lg"
        >
          From landing pages to full e-commerce stores — NetRive delivers fast,
          modern, high-converting websites for ambitious businesses across South
          Africa and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="/contact" variant="primary">
            Start Your Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button href="/portfolio" variant="glass">
            See Our Work
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-haze"
        >
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.9 Google Rating
          </span>
          <span className="text-white/20">·</span>
          <span>50+ Projects Delivered</span>
          <span className="text-white/20">·</span>
          <span>Cape Town, SA</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="animate-bounce-arrow h-6 w-6 text-sky/70" />
      </div>
    </section>
  );
}
