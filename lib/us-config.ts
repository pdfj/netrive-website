// ─────────────────────────────────────────────────────────────
// NetRive — US market (/us) content & data. Home-services focus.
// USD only · no WhatsApp · no Cape Town in main content.
// ─────────────────────────────────────────────────────────────

// Calendly link used by "Book a Free Call" across the /us page.
export const US_CALENDLY_URL = "https://calendly.com/hello-netrive/30min";

export const US = {
  tagline: "Websites That Book More Jobs.",
  email: "hello@netrive.com",
  serving: "Serving the US & beyond.",
} as const;

export const US_SERVICE_TYPES = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "Roofing",
  "Landscaping",
  "Pest Control",
  "Cleaning",
  "Other",
] as const;

export const US_PRICING = [
  {
    name: "Launch",
    price: "$1,200",
    note: "one-time",
    tagline: "A sharp, fast 1–3 page site that gets the phone ringing.",
    features: [
      "Up to 3 pages",
      "Mobile responsive",
      "Click-to-call",
      "Google Maps",
      "Basic SEO",
    ],
    featured: false,
  },
  {
    name: "Pro",
    price: "$1,900",
    note: "one-time",
    tagline: "Everything a growing home service business needs to win local jobs.",
    features: [
      "Up to 6 pages",
      "Custom design",
      "Local SEO",
      "Lead / booking form",
      "Gallery",
      "Google reviews integration",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "$2,900",
    note: "one-time",
    tagline: "The full package — built to dominate your area.",
    features: [
      "Up to 10 pages",
      "Advanced local SEO",
      "Online booking",
      "Service-area pages",
      "Analytics",
      "Priority delivery",
    ],
    featured: false,
  },
] as const;

export const US_TESTIMONIALS = [
  {
    quote: "Our booked jobs jumped within the first month.",
    name: "Mike R.",
    company: "Reliable Plumbing Co.",
  },
  {
    quote: "Live in 4 days and looks better than companies 10x our size.",
    name: "Dana W.",
    company: "Summit HVAC",
  },
  {
    quote: "We finally show up on Google. The phone hasn't stopped.",
    name: "Carlos M.",
    company: "BrightSpark Electric",
  },
] as const;

export const US_STATS = [
  "500+ Sites Launched",
  "4.9 Avg Rating",
  "Up to 72hr Delivery",
  "US & Beyond",
] as const;
