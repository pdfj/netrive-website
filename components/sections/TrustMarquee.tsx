import { CheckCircle2, Lock, Star, Zap } from "lucide-react";
import { MARQUEE_ITEMS } from "@/lib/constants";

const ICONS: Record<string, typeof Star> = {
  "4.9 Google Rating": Star,
  "50+ Projects Delivered": CheckCircle2,
  "Secured by Yoco": Lock,
  "24–72hr Delivery": Zap,
};

export function TrustMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]; // doubled for a seamless loop

  return (
    <section className="relative border-y border-white/[0.07] bg-night/40 py-6">
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-ink to-transparent" />

      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max items-center">
          {items.map((item, i) => {
            const Icon = ICONS[item];
            return (
              <span
                key={`${item}-${i}`}
                className="inline-flex shrink-0 items-center font-grotesk text-sm text-haze"
              >
                <span className="inline-flex items-center gap-2">
                  {Icon && (
                    <Icon
                      className={
                        item.includes("Rating")
                          ? "h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                          : "h-3.5 w-3.5 text-sky"
                      }
                    />
                  )}
                  {item}
                </span>
                <span className="mx-8 h-1 w-1 rounded-full bg-gradient-to-r from-sky to-[#7C3AED]" />
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
