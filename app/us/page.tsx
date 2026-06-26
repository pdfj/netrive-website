import type { Metadata } from "next";
import { UsHero } from "@/components/us/UsHero";
import { UsProblem } from "@/components/us/UsProblem";
import { UsWhatWeBuild } from "@/components/us/UsWhatWeBuild";
import { UsBand } from "@/components/us/UsBand";
import { UsProcess } from "@/components/us/UsProcess";
import { UsPricing } from "@/components/us/UsPricing";
import { UsTestimonials } from "@/components/us/UsTestimonials";
import { UsGuarantee } from "@/components/us/UsGuarantee";
import { UsContact } from "@/components/us/UsContact";

export const metadata: Metadata = {
  title: "NetRive — Websites That Book More Jobs for Home Service Pros",
  description:
    "High-converting websites for US home service businesses — plumbing, HVAC, electrical, roofing, landscaping. See a free custom preview of your new site before you pay. Live in days, not months.",
  keywords: [
    "home service website design",
    "plumber website design",
    "HVAC website design",
    "electrician website",
    "roofing website design",
    "landscaping website",
    "local SEO for home services",
    "contractor website design",
    "US web design agency",
  ],
  openGraph: {
    locale: "en_US",
    title: "NetRive — Websites That Book More Jobs",
    description:
      "High-converting websites for US home service pros. Free custom preview before you pay. Built in days, not months.",
  },
  alternates: { canonical: "/us" },
};

export default function UsHome() {
  return (
    <main>
      <UsHero />
      <UsProblem />
      <UsWhatWeBuild />
      <UsBand
        src="/us/work.webp"
        alt="Home service technician on the job"
        eyebrow="On the job"
        title="Built for the trades — and the customers searching for you right now."
      />
      <UsProcess />
      <UsPricing />
      <UsTestimonials />
      <UsGuarantee />
      <UsContact />
    </main>
  );
}
