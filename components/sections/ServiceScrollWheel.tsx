"use client";

import { useCallback, useEffect, useRef } from "react";
import { SERVICES } from "@/lib/constants";

const ITEM_H = 56; // matches h-14
const VISIBLE = 7; // odd: center + 3 each side
const CONTAINER_H = ITEM_H * VISIBLE;
const PAD = (CONTAINER_H - ITEM_H) / 2;

interface Props {
  active: number;
  onActiveChange: (index: number) => void;
}

export function ServiceScrollWheel({ active, onActiveChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const lastSnapped = useRef(active);
  const programmatic = useRef(false);

  // Style each item based on its distance from the viewport center.
  const paint = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const center = c.scrollTop + CONTAINER_H / 2;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const itemCenter = PAD + i * ITEM_H + ITEM_H / 2;
      const dist = (itemCenter - center) / ITEM_H;
      const abs = Math.abs(dist);
      const opacity = Math.max(0.12, 1 - abs * 0.27);
      const scale = Math.max(0.78, 1 - abs * 0.06);
      const rotateX = Math.max(-66, Math.min(66, dist * -22));
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) scale(${scale})`;
      el.style.fontWeight = abs < 0.5 ? "600" : "400";
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      paint();
      const c = containerRef.current;
      if (!c) return;
      const snapped = Math.max(
        0,
        Math.min(SERVICES.length - 1, Math.round(c.scrollTop / ITEM_H)),
      );
      if (snapped !== lastSnapped.current) {
        lastSnapped.current = snapped;
        onActiveChange(snapped);
        if (!programmatic.current && typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate?.(8);
        }
      }
    });
  }, [paint, onActiveChange]);

  // Set the initial scroll position + paint once on mount.
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.scrollTop = active * ITEM_H;
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToIndex = (i: number) => {
    const c = containerRef.current;
    if (!c) return;
    programmatic.current = true;
    c.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
    window.setTimeout(() => {
      programmatic.current = false;
    }, 600);
  };

  return (
    <div className="relative mx-auto w-full max-w-md" style={{ height: CONTAINER_H }}>
      {/* center selection band */}
      <div
        className="pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/[0.03]"
        style={{ height: ITEM_H }}
        aria-hidden
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]"
        role="listbox"
        aria-label="Our services"
        tabIndex={0}
      >
        <div style={{ paddingTop: PAD, paddingBottom: PAD }}>
          {SERVICES.map((service, i) => (
            <button
              key={service.name}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              onClick={() => scrollToIndex(i)}
              role="option"
              aria-selected={active === i}
              className="flex h-14 w-full snap-center items-center justify-center px-4 text-center font-display text-lg text-white will-change-transform"
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
