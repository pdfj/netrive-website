import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with NetRive — Cape Town's premier web agency. Start your project today.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[380px]"
            style={{
              background:
                "radial-gradient(ellipse 90% 90% at 50% 0%, rgba(255,122,26,0.18) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-6 pt-16 text-center">
            <span className="font-grotesk text-xs uppercase tracking-[0.18em] gradient-text-accent">
              Contact
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
              Let&apos;s Talk
            </h1>
          </div>
        </div>
        <div className="-mt-10">
          <Contact />
        </div>
      </main>
    </PageTransition>
  );
}
