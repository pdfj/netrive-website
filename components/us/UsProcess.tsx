import { Search, Eye, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    label: "Discovery",
    desc: "Tell us about your business and the jobs you want more of. Ten minutes, zero pressure.",
  },
  {
    icon: Eye,
    label: "Free Preview",
    desc: "We build a real, custom preview of your new site — first. You see exactly what you're getting before you pay a cent.",
  },
  {
    icon: Rocket,
    label: "Launch",
    desc: "Love it? We go live and point you at more booked jobs. Don't love it? You pay nothing.",
  },
];

export function UsProcess() {
  return (
    <section className="mx-auto max-w-content px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-grotesk text-xs uppercase tracking-[0.2em] text-sky">How it works</p>
        <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.12] tracking-tight text-white">
          We build your site <span className="gradient-text">first.</span> You only pay when you love it.
        </h2>
      </div>

      <ol className="mt-14 grid gap-10 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, label, desc }, i) => (
          <li key={label} className="relative text-center">
            <div className="gradient-border relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-ink">
              <Icon className="h-7 w-7 text-sky" />
              <span className="absolute -right-3 -top-3.5 font-display text-2xl font-bold gradient-text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-6 font-display text-xl font-medium text-white">{label}</h3>
            <p className="mx-auto mt-2 max-w-[260px] text-sm leading-[1.7] text-haze">{desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
