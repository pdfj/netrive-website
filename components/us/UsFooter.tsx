import { Lock, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { US, US_CALENDLY_URL } from "@/lib/us-config";

export function UsFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-night/60">
      <div className="mx-auto flex max-w-content flex-col items-center gap-5 px-6 py-12 text-center">
        <Logo />
        <p className="max-w-md text-sm leading-[1.7] text-haze">
          {US.tagline} {US.serving}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-haze">
          <a
            href={`mailto:${US.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4 text-sky" /> {US.email}
          </a>
          <a
            href={US_CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Book a Free Website Preview Call
          </a>
        </div>
        <div className="inline-flex items-center gap-2 rounded-pill glass px-4 py-2 text-xs text-white/70">
          <Lock className="h-3.5 w-3.5 text-sky" /> Pay securely by card — Stripe
        </div>
        <p className="text-xs text-haze">© 2026 NetRive. {US.serving}</p>
      </div>
    </footer>
  );
}
