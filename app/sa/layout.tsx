import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AiChat } from "@/components/AiChat";

// South African market layout — same chrome as the main site (Navbar, Footer,
// WhatsApp, AI chat). New route; does not affect the existing homepage.
export default function SaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
      <AiChat />
    </>
  );
}
