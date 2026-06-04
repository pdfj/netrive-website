"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, ChevronDown, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Run before paint on the client; fall back to useEffect on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

function Word({ children, gradient }: { children: string; gradient?: boolean }) {
  return (
    <span className="mr-[0.22em] inline-block overflow-hidden align-bottom last:mr-0">
      <span data-word className={cn("inline-block will-change-transform", gradient && "gradient-text")}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const words = root.querySelectorAll<HTMLElement>("[data-word]");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 120, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.07,
        delay: 0.15,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* Background: arch gradient + corner glow + particles */}
      <div className="absolute inset-0">
        <div className="arch-gradient animate-breathe absolute inset-[-5%] will-change-transform" />
        {/* Deepen the lower corners back to pure black */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_120%,rgba(0,0,0,0.95),transparent_70%)]" />
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="animate-float-up absolute bottom-[-12px] rounded-full bg-white/30 will-change-transform"
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

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-32 text-center">
        <div className="mb-7 inline-flex items-center gap-2 rounded-pill glass px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.14em] text-white/90 shadow-glow">
          <Sparkles className="h-3.5 w-3.5 text-sky" />
          Cape Town&apos;s Premier Web Agency
        </div>

        <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
          <span className="block">
            {LINE_ONE.map((word, i) => (
              <Word key={i}>{word}</Word>
            ))}
          </span>
          <span className="block">
            {LINE_TWO.map((word, i) => (
              <Word key={i} gradient>
                {word}
              </Word>
            ))}
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-[1.7] text-haze sm:text-lg">
          From landing pages to full e-commerce stores — NetRive delivers fast, modern,
          high-converting websites for ambitious businesses across South Africa and beyond.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" variant="primary">
            Start Your Project
          </Button>
          <Button href="/portfolio" variant="white">
            See Our Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-haze">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.9 Google Rating
          </span>
          <span className="text-white/20">·</span>
          <span>50+ Projects Delivered</span>
          <span className="text-white/20">·</span>
          <span>Cape Town, SA</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="animate-bounce-arrow h-6 w-6 text-white/60" />
      </div>
    </section>
  );
}
