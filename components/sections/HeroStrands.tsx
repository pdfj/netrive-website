"use client";

import { useEffect, useRef, useState } from "react";
import { useDesktopMotion } from "@/lib/useDesktopMotion";
import Strands from "@/components/reactbits/Strands";

/**
 * Mounts the Strands WebGL hero backdrop ONLY on desktop + non-reduced-motion,
 * and unmounts it (freeing the GL context) once the hero scrolls out of view.
 * On mobile / reduced-motion nothing here renders — the arch-gradient + aurora
 * are the hero ambient instead. Zero perpetual loops on phones.
 */
export function HeroStrands() {
  const enabled = useDesktopMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 hidden md:block motion-reduce:!hidden" aria-hidden>
      {enabled && inView && (
        <Strands
          colors={["#06B6D4", "#163cf9", "#7C3AED"]}
          count={10}
          speed={0.18}
          amplitude={0.95}
          waviness={0.9}
          thickness={0.65}
          glow={0.9}
          taper={3.2}
          spread={1.1}
          intensity={0.5}
          saturation={1.3}
          opacity={0.5}
          scale={1.2}
        />
      )}
    </div>
  );
}
