"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Lock, Mail, MapPin, Phone, Loader2, Eye } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PRICING, SITE } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      business: (form.elements.namedItem("business") as HTMLInputElement).value,
      email,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      package: (form.elements.namedItem("package") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      password,
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
      setReference(json.reference ?? null);

      // Sign the client in with the password they just set, then send them to their dashboard.
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      setTimeout(() => {
        window.location.href = signInError ? "/auth/login" : "/dashboard";
      }, 2200);
    } catch (err) {
      setSubmitted(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      {/* Ambient glow behind the form */}
      <div
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-[70%] -translate-x-1/2 rounded-full opacity-[0.08] blur-[100px]"
        style={{ background: "linear-gradient(135deg, #00d4ff, #7C3AED)" }}
        aria-hidden
      />

      <SectionHeading
        title="Ready to Build Something Remarkable?"
        subtitle="Start your project below — we build a free preview first, and you only pay once you approve it."
      />

      <div className="relative mt-16 grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="rounded-card glass-strong p-7 sm:p-8 lg:col-span-3">
          {submitted ? (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-14 w-14 text-sky" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-white">
                Project received! 🚀
              </h3>
              {reference && (
                <div className="glass-electric mt-4 rounded-input px-5 py-3">
                  <p className="text-xs uppercase tracking-wider text-haze">Your project reference</p>
                  <p className="mt-1 font-mono text-lg font-bold gradient-text-accent">{reference}</p>
                </div>
              )}
              <p className="mt-4 max-w-sm text-sm leading-[1.7] text-haze">
                Your account is ready — taking you to your dashboard now…
              </p>
              <Loader2 className="mt-3 h-5 w-5 animate-spin text-sky" />
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
                <label htmlFor="password" className="mb-1.5 block text-sm text-white/80">
                  Create a password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className={inputClass}
                />
                <p className="mt-1.5 text-xs text-haze">
                  This creates your client account so you can track your project and preview.
                </p>
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
                className="gradient-bg-animated group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-btn px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating your account…</>
                ) : (
                  <>Start Your Project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="glass-electric flex items-start gap-4 rounded-card p-5">
            <span className="gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-glow-cyan">
              <Eye className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">See a free preview before you pay</span>
              <span className="mt-0.5 block text-sm leading-[1.6] text-haze">
                Submit your project and we build a demo first. Only pay once you love it — then pay securely by EFT invoice using your unique reference.
              </span>
            </span>
          </div>

          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-card glass p-5 transition-all hover:border-sky/25 hover:bg-white/[0.06]"
          >
            <span className="gradient-bg flex h-11 w-11 items-center justify-center rounded-full text-white shadow-glow-cyan">
              <Phone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-haze">Call / WhatsApp</span>
              <span className="block text-sm font-medium text-white">{SITE.phoneDisplay}</span>
            </span>
          </a>

          <a
            href={`mailto:${SITE.email}`}
            className="group flex items-center gap-4 rounded-card glass p-5 transition-all hover:border-sky/25 hover:bg-white/[0.06]"
          >
            <span className="gradient-bg flex h-11 w-11 items-center justify-center rounded-full text-white shadow-glow-cyan">
              <Mail className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-haze">Email</span>
              <span className="block text-sm font-medium text-white">{SITE.email}</span>
            </span>
          </a>

          <div className="flex items-center gap-4 rounded-card glass p-5">
            <span className="gradient-bg flex h-11 w-11 items-center justify-center rounded-full text-white shadow-glow-cyan">
              <MapPin className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-haze">Location</span>
              <span className="block text-sm font-medium text-white">{SITE.location}</span>
            </span>
          </div>

          <div className="mt-auto inline-flex items-center gap-2 rounded-pill glass px-4 py-2.5 text-xs text-white/70">
            <Lock className="h-4 w-4 text-sky" /> Pay by EFT invoice · Cape Town, South Africa
          </div>
        </div>
      </div>
    </section>
  );
}
