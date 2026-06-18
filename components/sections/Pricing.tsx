"use client";

import Link from "next/link";
import { Check, Lock, Wrench, Zap } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRICING } from "@/lib/constants";
import { useCurrency } from "@/components/CurrencyProvider";
import { cn } from "@/lib/utils";

export function Pricing({ hideSectionHeading }: { hideSectionHeading?: boolean } = {}) {
  const { format, isZar } = useCurrency();
  return (
    <section id="pricing" className="relative mx-auto max-w-content px-6 py-12 sm:py-16">
      {!hideSectionHeading && (
        <SectionHeading
          label="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="No hidden fees. No surprises. Delivered fast."
        />
      )}

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PRICING.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className={cn(
              "relative flex flex-col rounded-card p-7 transition-colors duration-300",
              plan.featured
                ? "glass-electric shadow-glow lg:-mt-4 lg:mb-4"
                : "glass hover:border-white/[0.16]",
            )}
          >
            {plan.featured && (
              <span className="gradient-bg absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-glow">
                Most Popular
              </span>
            )}

            <h3 className="font-grotesk text-sm uppercase tracking-[0.16em] text-white/70">
              {plan.name}
            </h3>

            <div className="mt-4 flex items-end gap-2">
              {plan.custom ? (
                <span className="font-display text-4xl font-bold gradient-text">
                  Let&apos;s Talk
                </span>
              ) : (
                <>
                  <span className="font-display text-4xl font-bold text-white">
                    {format(plan.zar!)}
                  </span>
                  <span className="mb-1 text-sm text-haze">
                    {isZar ? `~$${plan.usd}` : `≈ R${plan.zar!.toLocaleString("en-ZA")}`}
                  </span>
                </>
              )}
            </div>

            <p className="mt-3 text-sm leading-[1.6] text-haze">{plan.tagline}</p>

            {plan.delivery && (
              <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-pill border border-sky/20 bg-sky/[0.08] px-3 py-1 text-xs font-medium text-sky">
                <Zap className="h-3.5 w-3.5" /> Delivered in {plan.delivery}
              </div>
            )}

            <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-white/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className={cn(
                "mt-7 inline-flex w-full cursor-pointer items-center justify-center rounded-btn px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]",
                plan.featured
                  ? "gradient-bg text-white shadow-glow hover:shadow-glow-lg"
                  : plan.custom
                    ? "gradient-border bg-transparent text-white"
                    : "glass-btn text-white",
              )}
            >
              {plan.custom ? plan.cta : "Get Started"}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Maintenance banner */}
      <div className="glass-bright mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center gap-2 rounded-card px-6 py-5 text-center sm:flex-row sm:gap-3">
        <Wrench className="h-5 w-5 shrink-0 text-sky" />
        <p className="text-sm leading-[1.6] text-white/85">
          <span className="font-semibold text-white">Monthly maintenance from {format(250)}/month</span>
          {" "}— security, updates and uptime handled for you, priced to the size of your project.
        </p>
      </div>

      {/* Trust footer */}
      <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center text-sm text-haze sm:flex-row sm:gap-8">
        <span className="inline-flex items-center gap-2">
          <Lock className="h-4 w-4 text-sky" />
          Free preview first — pay only when you approve
        </span>
        <span className="inline-flex items-center gap-2">
          <Zap className="h-4 w-4 text-sky" />
          Fastest delivery in Cape Town — from 24 to 72 hours
        </span>
      </div>
    </section>
  );
}
