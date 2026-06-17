"use client";

import { CheckCircle2, Globe, Star, Zap, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { STATS } from "@/lib/constants";
import { useMotionOK } from "@/lib/useMotionOK";
import TrueFocus from "@/components/reactbits/TrueFocus";

const ICONS: Record<string, LucideIcon> = { Zap, CheckCircle2, Star, Globe };

export function HumanAi() {
  // TrueFocus runs on mobile too now (motion-only gating). The blur transition
  // only fires on word change (~every 1.8s), not per frame — light enough for
  // phones. Reduced-motion + SSR fall back to a plain, legible <h2>.
  const showFocus = useMotionOK();
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      {/* Cyan-blue light field */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-x-0 top-0 h-full"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% 0%, rgba(235,250,255,0.42) 0%, rgba(0,212,255,0.42) 16%, rgba(56,189,248,0.44) 34%, rgba(37,99,235,0.4) 52%, rgba(10,15,28,0.92) 72%, #0a0a0a 90%)",
          }}
        />
        <div className="grid-bg absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_20%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-content px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-grotesk text-xs uppercase tracking-[0.2em] text-white/80"
        >
          The NetRive Difference
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-4 max-w-3xl"
        >
          {showFocus ? (
            <div className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-tight text-white">
              <TrueFocus
                sentence="Human-led AI-Powered"
                borderColor="#00d4ff"
                glowColor="rgba(56,189,248,0.6)"
                blurAmount={3}
                animationDuration={0.6}
                pauseBetweenAnimations={1.2}
              />
            </div>
          ) : (
            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-tight text-white">
              Human-led.{" "}
              <span className="gradient-text">AI-Powered.</span>
            </h2>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-white/75 sm:text-lg"
        >
          Expert human creativity, multiplied by AI precision. That&apos;s how we
          deliver agency-quality websites in days, not months — without ever
          compromising on craft.
        </motion.p>

        {/* Stats row */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = ICONS[stat.icon];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                className="rounded-card glass-strong p-5"
              >
                {Icon && <Icon className="mx-auto h-5 w-5 text-sky" />}
                <p className="mt-3 font-display text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/60">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
