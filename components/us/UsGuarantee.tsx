import { ShieldCheck } from "lucide-react";

export function UsGuarantee() {
  return (
    <section className="mx-auto max-w-content px-6 py-20 sm:py-24">
      <div className="relative overflow-hidden rounded-card glass-electric px-8 py-14 text-center shadow-glow sm:px-12">
        <span className="gradient-bg inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-glow-cyan">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] tracking-tight text-white">
          See It Before You Pay.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-[1.7] text-white/85">
          If your new site isn&apos;t clearly better than what you have now,{" "}
          <span className="font-semibold text-white">you pay nothing.</span>
        </p>
        <a
          href="#contact"
          className="gradient-bg-animated mt-8 inline-flex items-center gap-2 rounded-btn px-8 py-4 text-base font-semibold text-white shadow-glow transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-lg"
        >
          Get My Free Website Preview
        </a>
      </div>
    </section>
  );
}
