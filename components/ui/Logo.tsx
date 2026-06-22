import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * NetRive logo mark — the fluid orange ribbon "N" (designed in Gemini,
 * keyed to transparent). Use inside the lockups below or standalone.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt="NetRive"
      width={1845}
      height={1753}
      priority
      className={className}
    />
  );
}

/** Mark + wordmark lockup used in the navbar and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-auto" />
      <span className="font-display text-2xl font-bold tracking-tight text-white">
        Net<span className="gradient-text-accent">Rive</span>
      </span>
    </span>
  );
}
