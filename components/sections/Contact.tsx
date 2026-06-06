"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Lock, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRICING, SITE } from "@/lib/constants";

const inputClass =
  "w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      business: (form.elements.namedItem("business") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      package: (form.elements.namedItem("package") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/projects/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setSubmitted(true);

      // New user: auto-redirect via magic link so they land on dashboard already logged in
      if (json.dashboardLink) {
        setCountdown(3);
        let count = 3;
        const timer = setInterval(() => {
          count -= 1;
          setCountdown(count);
          if (count === 0) {
            clearInterval(timer);
            window.location.href = json.dashboardLink as string;
          }
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      <SectionHeading
        title="Ready to Build Something Remarkable?"
        subtitle="Let's turn your vision into a website that works — and a business that grows."
      />

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="rounded-card glass p-7 sm:p-8 lg:col-span-3">
          {submitted ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-14 w-14 text-electric" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-white">
                Project received! 🚀
              </h3>
              {countdown !== null ? (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-haze">
                    Opening your dashboard in <span className="font-bold text-electric">{countdown}</span>…
                  </p>
                  <div className="mx-auto h-1 w-40 overflow-hidden rounded-pill bg-white/10">
                    <div
                      className="h-full rounded-pill bg-electric transition-all duration-1000"
                      style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-haze/60">
                    You&apos;ll also receive a confirmation email with a link to set your password.
                  </p>
                </div>
              ) : (
                <p className="mt-2 max-w-sm text-sm leading-[1.7] text-haze">
                  We&apos;ve sent you a login link. Check your email to access your client dashboard and track progress.
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm text-white/80">
                    Full Name
                  </label>
                  <input id="name" name="name" required placeholder="Jane Doe" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="business" className="mb-1.5 block text-sm text-white/80">
                    Business Name
                  </label>
                  <input id="business" name="business" placeholder="Acme Co." className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm text-white/80">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@acme.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm text-white/80">
                    Phone / WhatsApp
                  </label>
                  <input id="phone" name="phone" placeholder="+27 ..." className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="package" className="mb-1.5 block text-sm text-white/80">
                  Package Interest
                </label>
                <select id="package" name="package" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Select a package
                  </option>
                  {PRICING.map((p) => (
                    <option key={p.name} value={p.name} className="bg-night">
                      {p.name}
                      {p.zar ? ` — R${p.zar.toLocaleString("en-ZA")}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm text-white/80">
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="What are you looking to build?"
                  className={inputClass}
                />
              </div>

              {error && (
                <p className="rounded-input border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-btn bg-electric px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                ) : (
                  <>Start Your Project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-card glass p-5 transition-colors hover:bg-white/[0.06]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-electric/15 text-electric">
              <Phone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-haze">Call / WhatsApp</span>
              <span className="block text-sm font-medium text-white">{SITE.phoneDisplay}</span>
            </span>
          </a>

          <a
            href={`mailto:${SITE.email}`}
            className="group flex items-center gap-4 rounded-card glass p-5 transition-colors hover:bg-white/[0.06]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-electric/15 text-electric">
              <Mail className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-haze">Email</span>
              <span className="block text-sm font-medium text-white">{SITE.email}</span>
              <span className="block text-sm text-haze">{SITE.emailAlt}</span>
            </span>
          </a>

          <div className="flex items-center gap-4 rounded-card glass p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-electric/15 text-electric">
              <MapPin className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-haze">Location</span>
              <span className="block text-sm font-medium text-white">{SITE.location}</span>
            </span>
          </div>

          <div className="mt-auto inline-flex items-center gap-2 rounded-pill glass px-4 py-2.5 text-xs text-white/70">
            <Lock className="h-4 w-4 text-electric" /> Secured by Yoco · South Africa&apos;s trusted
            payment platform
          </div>
        </div>
      </div>
    </section>
  );
}
