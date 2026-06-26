"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { US_CALENDLY_URL } from "@/lib/us-config";

export function UsNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/us" aria-label="NetRive home">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={US_CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-sm font-medium text-haze transition-colors hover:text-white sm:inline-flex"
          >
            <CalendarCheck className="h-4 w-4" /> Book a Call
          </a>
          <a
            href="#contact"
            className="gradient-bg group inline-flex items-center gap-2 rounded-btn px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:scale-[1.03] sm:px-5"
          >
            Get My Free Preview
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </nav>
    </header>
  );
}
