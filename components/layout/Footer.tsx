import Link from "next/link";
import { Lock, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, SERVICES_GRID, SITE } from "@/lib/constants";
import { LogoMark } from "@/components/ui/Logo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-night/60">
      {/* Top gradient hairline */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,122,26,0.6) 30%, rgba(217,119,87,0.6) 70%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* Faint corner glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "linear-gradient(135deg, #ff7a1a, #d97757)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-content grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <span className="inline-flex items-center gap-2.5">
            <LogoMark className="h-8 w-auto" />
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              Net<span className="gradient-text-accent">Rive</span>
            </span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-[1.7] text-haze">
            {SITE.tagline} {SITE.positioning} Built in Cape Town — serving businesses
            across South Africa &amp; the US.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: InstagramIcon, label: "Instagram", href: SITE.instagram },
              { Icon: TikTokIcon, label: "TikTok", href: SITE.tiktok },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`NetRive on ${label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full glass-btn text-white/70 transition-colors hover:text-sky"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-grotesk text-xs uppercase tracking-[0.18em] text-white/50">
            Services
          </h4>
          <ul className="mt-4 space-y-3">
            {SERVICES_GRID.slice(0, 6).map((s) => (
              <li key={s.title}>
                <Link
                  href="/services"
                  className="text-sm text-haze transition-colors hover:text-white"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-grotesk text-xs uppercase tracking-[0.18em] text-white/50">
            Company
          </h4>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/about" className="text-sm text-haze transition-colors hover:text-white">
                About
              </Link>
            </li>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-haze transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/auth/login" className="text-sm text-haze transition-colors hover:text-white">
                Client Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-grotesk text-xs uppercase tracking-[0.18em] text-white/50">
            Get in Touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-haze">
            <li>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-sky" /> {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-sky" /> {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky" /> {SITE.location}
            </li>
          </ul>
          <div className="mt-5 inline-flex items-center gap-2 rounded-pill glass-btn px-3 py-1.5 text-xs text-white/70">
            <Lock className="h-3.5 w-3.5 text-sky" /> Secured by Yoco
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-content px-6 py-6 text-center text-xs text-haze">
          © 2026 NetRive. All rights reserved. Built by NetRive — Cape Town, South Africa.
        </div>
      </div>
    </footer>
  );
}
