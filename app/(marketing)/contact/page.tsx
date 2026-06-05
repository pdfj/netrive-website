import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/PageTransition";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with NetRive — Cape Town's premier web agency. Start your project today.",
};

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        <Contact />
      </main>
    </PageTransition>
  );
}
