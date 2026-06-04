import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  label?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {label && (
        <Reveal>
          <span className="font-grotesk text-xs uppercase tracking-[0.18em] text-electric">
            {label}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-balance">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base leading-[1.7] text-haze">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
