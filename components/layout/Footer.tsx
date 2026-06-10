import Link from "next/link";
import { Lock, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, SERVICES_GRID, SITE } from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9H16l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.25 8h4.5v12h-4.5V8zM8 8h4.3v1.64h.06c.6-1.06 2.06-2.18 4.24-2.18 4.54 0 5.38 2.86 5.38 6.58V20h-4.5v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V20H8V8z" />
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
            "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.6) 35%, rgba(0,102,255,0.6) 65%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* Faint corner glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "linear-gradient(135deg, #00d4ff, #0066ff)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-content grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            Net<span className="gradient-text-accent">Rive</span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-[1.7] text-haze">
            {SITE.tagline} {SITE.positioning} Cape Town&apos;s premier web agency.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: InstagramIcon, label: "Instagram" },
              { Icon: FacebookIcon, label: "Facebook" },
              { Icon: LinkedinIcon, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={`NetRive on ${label}`}
                className="flex h-9 w-9 items-center justify-center rounded-full glass text-white/70 transition-colors hover:text-sky"
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
          <div className="mt-5 inline-flex items-center gap-2 rounded-pill glass px-3 py-1.5 text-xs text-white/70">
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
