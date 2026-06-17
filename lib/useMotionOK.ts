"use client";

import { useEffect, useState } from "react";

/**
 * True when the user hasn't asked for reduced motion — regardless of screen
 * width. Use this (instead of useDesktopMotion) for lightweight motion that
 * SHOULD run on phones too, like the TrueFocus headline. Returns false during
 * SSR / first paint so a plain, fully-legible fallback renders first (and is
 * what crawlers see).
 */
export function useMotionOK() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setOk(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return ok;
}
