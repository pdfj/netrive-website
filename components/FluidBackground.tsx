"use client";

import { useEffect, useRef } from "react";

/**
 * Aurora Drift — a slow-flowing cyan→blue fluid layer behind the whole site.
 * Pure CSS motion (transform/opacity only); blur is rasterised once. Fixed
 * at z-index -1 so content scrolls over it and the glass cards sample its
 * colour. Pauses while the tab is hidden to spend zero compositor ticks.
 */
export function FluidBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onVisibility = () => {
      el.dataset.paused = document.hidden ? "true" : "false";
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div ref={ref} className="aurora" aria-hidden data-paused="false">
      <span className="aurora-blob aurora-1" />
      <span className="aurora-blob aurora-2" />
      <span className="aurora-blob aurora-3" />
      <div className="aurora-vignette" />
      <div className="aurora-noise" />
    </div>
  );
}
