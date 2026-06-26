import Image from "next/image";
import { ArrowRight, CalendarCheck, Star } from "lucide-react";
import { US_CALENDLY_URL } from "@/lib/us-config";

export function UsHero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32">
      <div className="arch-gradient absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-content items-center gap-10 px-6 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-pill glass px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.16em] text-white/90 shadow-glow-cyan">
            <Star className="h-3.5 w-3.5 fill-sky text-sky" /> For US home service pros
          </div>
          <h1 className="font-display text-[clamp(2.1rem,5vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-white">
            More Calls. More Booked Jobs.{" "}
            <span className="gradient-text">Better Than Your Current Site — Or You Don&apos;t Pay.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-[1.75] text-haze sm:text-lg">
            NetRive builds high-converting websites for home service pros across the US.
            See a free custom preview of YOUR new site before you pay a cent.
          </p>
          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
            <a
              href="#contact"
              className="gradient-bg-animated group inline-flex items-center justify-center gap-2 rounded-btn px-7 py-4 text-base font-semibold text-white shadow-glow transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-lg"
            >
              Get My Free Website Preview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={US_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn inline-flex items-center justify-center gap-2 rounded-btn px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
            >
              <CalendarCheck className="h-4 w-4" /> Book a Free Call
            </a>
          </div>
          <p className="mt-6 text-sm font-medium text-white/70">
            ⭐ 5.0 rating · 50+ sites launched · Built in days, not months
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-white/10 shadow-card">
            <Image
              src="/us/hero.webp"
              alt="Home service professional ready to take the call"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
