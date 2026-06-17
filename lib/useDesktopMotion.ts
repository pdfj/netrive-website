"use client";

import { useEffect, useState } from "react";

/**
 * True only on desktop-width AND when the user hasn't asked for reduced motion.
 * Use to conditionally MOUNT heavy effects (WebGL, per-word blur) so they never
 * instantiate on phones or for reduced-motion users. Returns false during SSR
 * and the first client paint, so the lightweight fallback renders first.
 */
export function useDesktopMotion(minWidth = 769) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`);
    const noReduce = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(wide.matches && noReduce.matches);
    update();
    wide.addEventListener("change", update);
    noReduce.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      noReduce.removeEventListener("change", update);
    };
  }, [minWidth]);

  return enabled;
}
