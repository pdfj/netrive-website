import { Quote, Star } from "lucide-react";
import { US_TESTIMONIALS, US_STATS } from "@/lib/us-config";

export function UsTestimonials() {
  return (
    <section className="relative bg-night/40 py-20 sm:py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-grotesk text-xs uppercase tracking-[0.2em] text-sky">Results</p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.12] tracking-tight text-white">
            Home service pros, <span className="gradient-text">booked solid.</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {US_TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-card glass p-7">
              <Quote className="h-7 w-7 text-sky/40" aria-hidden />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-[1.8] text-white/85">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-white/[0.07] pt-4">
                <span className="block text-sm font-medium text-white">{t.name}</span>
                <span className="block text-xs text-haze">{t.company}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Stat band */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-card glass px-6 py-5 text-center sm:gap-x-6">
          {US_STATS.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-x-3 text-sm font-medium text-white/85 sm:gap-x-6">
              {s}
              {i < US_STATS.length - 1 && <span className="text-sky/40">·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
