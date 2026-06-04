"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-500",
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  const next = useCallback(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(next, 4000);
    return () => window.clearInterval(id);
  }, [next, reduce]);

  const t = TESTIMONIALS[index];
  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3">
          <GoogleG className="h-7 w-7" />
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight">
            <span className="text-yellow-400">4.9</span> on Google Reviews
          </h2>
        </div>
      </div>

      <div className="relative mx-auto mt-12 min-h-[260px] max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-card glass p-8 text-center sm:p-10"
          >
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="mt-6 font-display text-xl font-medium leading-[1.5] text-white sm:text-2xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-7 flex items-center justify-center gap-3">
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white",
                  AVATAR_COLORS[index % AVATAR_COLORS.length],
                )}
              >
                {initials}
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold text-white">{t.name}</span>
                <span className="block text-xs text-haze">{t.company}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show review ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-6 bg-electric" : "w-2 bg-white/20 hover:bg-white/40",
            )}
          />
        ))}
      </div>
    </section>
  );
}
