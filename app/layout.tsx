import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "NetRive — Websites That Work. Businesses That Grow.",
    template: "%s · NetRive",
  },
  description: SITE.description,
  keywords: [
    "web design Cape Town",
    "web agency South Africa",
    "e-commerce development",
    "website design",
    "NetRive",
    "fast websites",
  ],
  authors: [{ name: "NetRive" }],
  creator: "NetRive",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE.url,
    siteName: SITE.name,
    title: "NetRive — Websites That Work. Businesses That Grow.",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "NetRive — Websites That Work. Businesses That Grow.",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-ink font-sans text-white antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
