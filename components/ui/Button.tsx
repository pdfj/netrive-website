import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "white" | "glass" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-electric text-white shadow-glow hover:brightness-110 hover:shadow-glow-lg",
  white: "bg-white text-black hover:shadow-[0_10px_30px_rgba(255,255,255,0.18)]",
  glass: "glass text-white hover:border-white/25 hover:bg-white/[0.07]",
  ghost: "border border-white/20 text-white hover:border-electric",
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  external?: boolean;
}

/**
 * Pill button. Renders a Next Link when `href` is set (use `external` for raw <a>),
 * otherwise a <button>. Animates with transform/opacity only for GPU performance.
 */
export function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
  ariaLabel,
  external,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn px-7 py-3.5 text-sm font-semibold transition-all duration-200 will-change-transform hover:scale-[1.03] active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
    variants[variant],
    className,
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
