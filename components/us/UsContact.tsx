"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { US_SERVICE_TYPES, US_CALENDLY_URL } from "@/lib/us-config";

const inputClass =
  "w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky";

export function UsContact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      business: (form.elements.namedItem("business") as HTMLInputElement).value,
      serviceType: (form.elements.namedItem("serviceType") as HTMLSelectElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-content px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.12] tracking-tight text-white">
          Get your <span className="gradient-text">free website preview.</span>
        </h2>
        <p className="mt-3 text-haze">
          Tell us about your business — we&apos;ll build a custom preview of your new site, free.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-card glass-strong p-7 sm:p-8">
        {submitted ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-14 w-14 text-sky" />
            <h3 className="mt-5 font-display text-2xl font-semibold text-white">Request received! 🚀</h3>
            <p className="mt-3 max-w-sm text-sm leading-[1.7] text-haze">
              We&apos;ll build a free custom preview and send it within{" "}
              <span className="font-semibold text-white">72 hours</span>.
            </p>
            <a
              href={US_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky transition-colors hover:text-white"
            >
              <CalendarCheck className="h-4 w-4" /> Book a Free Call
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm text-white/80">Full Name</label>
                <input id="name" name="name" required placeholder="John Smith" className={inputClass} />
              </div>
              <div>
                <label htmlFor="business" className="mb-1.5 block text-sm text-white/80">Business Name</label>
                <input id="business" name="business" placeholder="Smith Plumbing" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="serviceType" className="mb-1.5 block text-sm text-white/80">Service Type</label>
              <select id="serviceType" name="serviceType" defaultValue="" className={inputClass} required>
                <option value="" disabled>Select your trade</option>
                {US_SERVICE_TYPES.map((s) => (
                  <option key={s} value={s} className="bg-night">{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm text-white/80">Email</label>
                <input id="email" name="email" type="email" required placeholder="john@smithplumbing.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm text-white/80">Phone</label>
                <input id="phone" name="phone" placeholder="(555) 123-4567" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm text-white/80">Tell us about your business</label>
              <textarea id="message" name="message" rows={4} placeholder="What services do you offer, and what jobs do you want more of?" className={inputClass} />
            </div>

            {error && (
              <p className="rounded-input border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="gradient-bg-animated group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-btn px-7 py-4 text-base font-semibold text-white shadow-glow transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                <>Get My Free Website Preview <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </button>
            <p className="text-center text-sm text-haze">
              We&apos;ll build a free custom preview and send it within 72 hours.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
