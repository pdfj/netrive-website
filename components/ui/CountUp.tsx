"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

const NUM = /^(\d+(?:\.\d+)?)(\+?)$/;

/**
 * Rolls a numeric stat up to its value when it scrolls into view (once).
 * Non-numeric values (e.g. "24–72hrs", "SA · US") render unchanged.
 * Respects prefers-reduced-motion by snapping straight to the value.
 */
export function CountUp({ value }: { value: string }) {
  const m = value.match(NUM);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [text, setText] = useState(m ? `0${m[2]}` : value);

  useEffect(() => {
    const mm = value.match(NUM);
    if (!mm || !inView) return;
    const target = parseFloat(mm[1]);
    const decimals = mm[1].includes(".") ? 1 : 0;
    const suffix = mm[2];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(target.toFixed(decimals) + suffix);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setText(v.toFixed(decimals) + suffix),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{text}</span>;
}
