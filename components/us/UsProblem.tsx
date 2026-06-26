import { AlertTriangle, SearchX, DoorOpen } from "lucide-react";

const PAINS = [
  {
    icon: AlertTriangle,
    title: "Your site looks outdated",
    desc: "An old, clunky website makes customers wonder if you're even still in business — so they call the competitor whose site looks the part.",
  },
  {
    icon: SearchX,
    title: "You don't show up on Google",
    desc: "If you're not on page one for “plumber near me,” you're invisible to the exact people searching for you right now.",
  },
  {
    icon: DoorOpen,
    title: "Visitors leave instead of calling",
    desc: "A confusing site with no clear way to call or book means hard-won clicks bounce — that's money walking straight out the door.",
  },
];

export function UsProblem() {
  return (
    <section className="mx-auto max-w-content px-6 py-20 sm:py-24">
      <h2 className="mx-auto max-w-3xl text-center font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.12] tracking-tight text-white">
        Your competitors are getting the calls{" "}
        <span className="gradient-text">you</span> should be getting.
      </h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {PAINS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-card glass p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-[1.7] text-haze">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
