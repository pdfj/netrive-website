import { CheckCircle2, Lock, Star, Zap } from "lucide-react";
import { MARQUEE_ITEMS } from "@/lib/constants";

const ICONS: Record<string, typeof Star> = {
  "4.9 Google Rating": Star,
  "50+ Projects Delivered": CheckCircle2,
  "Secured by Yoco": Lock,
  "Up to 48hr Delivery": Zap,
};

export function TrustMarquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section className="relative border-y border-white/10 bg-night/50 py-6">
      <div className="group relative overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
          {items.map((item, i) => {
            const Icon = ICONS[item];
            const isRating = item === "4.9 Google Rating";
            return (
              <div
                key={i}
                className="flex shrink-0 items-center gap-2 rounded-pill glass px-5 py-2 text-sm text-white/55"
              >
                {Icon ? (
                  <Icon
                    className={
                      isRating ? "h-4 w-4 fill-yellow-400 text-yellow-400" : "h-4 w-4 text-electric"
                    }
                  />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-electric/70" />
                )}
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
