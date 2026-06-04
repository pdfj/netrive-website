"use client";

import { CheckCircle2, Globe, Star, Zap, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { STATS } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = { Zap, CheckCircle2, Star, Globe };

export function HumanAi() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      {/* Full-intensity arch gradient behind the statement */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-x-0 top-0 h-full"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% 0%, rgba(240,248,255,0.45) 0%, rgba(147,180,255,0.5) 18%, rgba(44,95,255,0.55) 38%, rgba(10,22,40,0.9) 66%, #000 88%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.95] tracking-tight"
        >
          <span className="block gradient-text">Human-led.</span>
          <span className="block gradient-text">AI-Powered.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-xl text-base leading-[1.7] text-white/80 sm:text-lg"
        >
          We combine expert human creativity and strategy with the precision and speed of
          AI — delivering better websites, faster than anyone else.
        </motion.p>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = ICONS[stat.icon];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="rounded-card glass p-5"
              >
                <Icon className="mx-auto h-6 w-6 text-sky" />
                <div className="mt-3 font-display text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-haze">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
