"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      <SectionHeading
        label="Testimonials"
        title="Trusted by Ambitious Businesses"
        subtitle={
          <span className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            4.9 average rating across 50+ projects
          </span>
        }
      />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.09, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className={cn(
              "relative flex flex-col rounded-card glass p-7 transition-all duration-300 hover:-translate-y-1",
              i % 3 === 2 ? "hover:border-[#2563eb]/45" : "hover:border-sky/25",
              // bento offset on large screens for a less template-y rhythm
              i === 1 && "lg:translate-y-6",
              i === 4 && "lg:translate-y-6",
            )}
          >
            <Quote
              className={cn("h-7 w-7", i % 3 === 2 ? "text-[#38bdf8]/55" : "text-sky/40")}
              aria-hidden
            />
            <blockquote className="mt-4 flex-1 text-sm leading-[1.8] text-white/85">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-5">
              <span className="gradient-bg flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold text-white">
                {t.name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-medium text-white">{t.name}</span>
                <span className="block text-xs text-haze">{t.company}</span>
              </span>
              <span className="ml-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
