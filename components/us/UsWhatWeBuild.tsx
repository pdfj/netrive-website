import { PhoneCall, MapPin, MousePointerClick, Zap } from "lucide-react";

const CARDS = [
  {
    icon: PhoneCall,
    title: "Click-to-Call That Actually Works",
    desc: "One tap and your phone rings. Big, obvious call buttons on every screen so the job comes straight to you.",
  },
  {
    icon: MapPin,
    title: "Show Up on Google",
    desc: "Local SEO built in, so you rank for “plumber near me” and the local searches that actually fill your calendar.",
  },
  {
    icon: MousePointerClick,
    title: "Built to Convert",
    desc: "Clear offers, real trust signals, and booking forms that turn visitors into booked jobs — not bounces.",
  },
  {
    icon: Zap,
    title: "Live in Days",
    desc: "No three-month agency runaround. Your new site is up and earning in days, not months.",
  },
];

export function UsWhatWeBuild() {
  return (
    <section id="what-we-build" className="relative bg-night/40 py-20 sm:py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-grotesk text-xs uppercase tracking-[0.2em] text-sky">What we build</p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.12] tracking-tight text-white">
            Websites that turn searches into{" "}
            <span className="gradient-text">booked jobs.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-card glass-bright p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky/40 hover:shadow-glow-cyan"
            >
              <span className="gradient-bg flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow-cyan transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-[1.7] text-haze">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
