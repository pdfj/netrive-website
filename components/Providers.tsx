"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CurrencyProvider } from "@/components/CurrencyProvider";

/** Global motion config (respects reduced-motion) + geo currency context. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CurrencyProvider>{children}</CurrencyProvider>
    </MotionConfig>
  );
}
