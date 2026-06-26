import { Check, Wrench, CreditCard } from "lucide-react";
import { US_PRICING } from "@/lib/us-config";
import { cn } from "@/lib/utils";

export function UsPricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-content px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-grotesk text-xs uppercase tracking-[0.2em] text-sky">Pricing</p>
        <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.12] tracking-tight text-white">
          Simple, one-time pricing. <span className="gradient-text">No surprises.</span>
        </h2>
        <p className="mt-3 text-haze">You see your free preview first — pay only when you love it.</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {US_PRICING.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-card p-7 transition-colors duration-300",
              plan.featured ? "glass-electric shadow-glow lg:-mt-4 lg:mb-4" : "glass hover:border-white/[0.16]",
            )}
          >
            {plan.featured && (
              <span className="gradient-bg absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-glow">
                Most Popular
              </span>
            )}
            <h3 className="font-grotesk text-sm uppercase tracking-[0.16em] text-white/70">{plan.name}</h3>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-4xl font-bold text-white">{plan.price}</span>
              <span className="mb-1 text-sm text-haze">{plan.note}</span>
            </div>
            <p className="mt-3 text-sm leading-[1.6] text-haze">{plan.tagline}</p>
            <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className={cn(
                "mt-7 inline-flex w-full cursor-pointer items-center justify-center rounded-btn px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]",
                plan.featured ? "gradient-bg text-white shadow-glow hover:shadow-glow-lg" : "glass-btn text-white",
              )}
            >
              Get Started
            </a>
          </div>
        ))}
      </div>

      {/* Care plan */}
      <div className="glass-bright mx-auto mt-10 max-w-3xl rounded-card p-6 sm:p-7">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <span className="gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow-cyan">
            <Wrench className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              Keep It Running — Care Plans from $99/month
            </h3>
            <p className="mt-1 text-sm leading-[1.7] text-haze">
              Hosting, security, updates, unlimited small changes, and ongoing SEO. We keep your
              site fast, safe, and climbing Google while you run the business.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-haze">
        <CreditCard className="h-4 w-4 text-sky" /> Pay securely by card — Stripe.
      </p>
    </section>
  );
}
