"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Global motion config — respects the user's reduced-motion preference. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
