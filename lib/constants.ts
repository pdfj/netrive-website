// ─────────────────────────────────────────────────────────────
// NetRive — central content & data source
// Currency: ZAR primary, USD secondary at 1 USD = 18.50 ZAR
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: "NetRive",
  domain: "netrive.com",
  url: "https://netrive.com",
  location: "Cape Town, South Africa",
  tagline: "Websites That Work. Businesses That Grow.",
  positioning: "Human-led. AI-Powered.",
  description:
    "NetRive is Cape Town's premier web agency, delivering fast, modern, high-converting websites for ambitious businesses across South Africa and beyond.",
  phoneDisplay: "+27 65 653 8435",
  phoneRaw: "27656538435",
  whatsapp: "https://wa.me/27656538435",
  email: "hello@netrive.com",
  emailAlt: "netrive.agency@gmail.com",
  instagram: "https://www.instagram.com/netrive_",
  instagramHandle: "@netrive_",
  tiktok: "https://www.tiktok.com/@netrive.com",
  tiktokHandle: "@netrive.com",
  rating: "4.9",
  reviewsCount: "50+",
  usdRate: 18.5,
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

// Section 4 — iOS scroll-wheel services (16)
export const SERVICES = [
  { name: "Web Design", description: "We craft stunning, conversion-focused designs tailored to your brand." },
  { name: "Web Development", description: "Clean, fast code built to perform and scale with your business." },
  { name: "E-commerce Stores", description: "Full online stores with payments, inventory, and customer accounts." },
  { name: "Mobile Apps", description: "Responsive web apps that feel native on any device." },
  { name: "SEO Optimization", description: "Get found on Google. We optimize your site from day one." },
  { name: "Blog & Content Writing", description: "SEO-driven content that attracts customers and builds authority." },
  { name: "Branding & Logo Design", description: "Your visual identity, crafted to be unforgettable." },
  { name: "Google Ads Management", description: "Targeted campaigns that turn ad spend into real revenue." },
  { name: "Meta Ads Campaigns", description: "Reach your customers on Instagram and Facebook." },
  { name: "Social Media Management", description: "Consistent, professional presence across all platforms." },
  { name: "Website Maintenance", description: "We keep your site secure, updated, and always running. From R250/month, scaled to your project." },
  { name: "Booking Systems", description: "Let clients book appointments directly through your site." },
  { name: "Payment Integration", description: "Accept payments online with Yoco, PayFast, or Stripe." },
  { name: "Custom Web Applications", description: "Complex tools and dashboards built to your exact specs." },
  { name: "API Integrations", description: "Connect your website to any third-party service or system." },
  { name: "WhatsApp Business Integration", description: "Turn website visitors into WhatsApp conversations." },
] as const;

// Section 6 — services grid (12), icon = lucide-react export name
export const SERVICES_GRID = [
  { icon: "Palette", title: "Web Design", desc: "Stunning, conversion-focused designs tailored to your brand." },
  { icon: "Code2", title: "Web Development", desc: "Clean, fast code built to perform and scale." },
  { icon: "ShoppingCart", title: "E-commerce Stores", desc: "Online stores with payments, inventory & accounts." },
  { icon: "Search", title: "SEO Optimization", desc: "Get found on Google from day one." },
  { icon: "PenTool", title: "Branding & Logo", desc: "A visual identity crafted to be unforgettable." },
  { icon: "Megaphone", title: "Google & Meta Ads", desc: "Campaigns that turn ad spend into real revenue." },
  { icon: "CalendarCheck", title: "Booking Systems", desc: "Let clients book appointments through your site." },
  { icon: "CreditCard", title: "Payment Integration", desc: "Yoco, PayFast or Stripe, fully integrated." },
  { icon: "Smartphone", title: "Mobile Web Apps", desc: "Responsive apps that feel native on any device." },
  { icon: "Wrench", title: "Website Maintenance", desc: "Secure, updated and always running — from R250/mo." },
  { icon: "MessageCircle", title: "WhatsApp Integration", desc: "Turn visitors into WhatsApp conversations." },
  { icon: "Boxes", title: "Custom Applications", desc: "Dashboards and tools built to your exact specs." },
] as const;

// Section 5 — process
export const PROCESS = [
  { icon: "Search", title: "Discovery", desc: "We listen. We learn your business, goals, and target audience." },
  { icon: "Palette", title: "Design", desc: "We create a custom design that reflects your brand and converts visitors." },
  { icon: "Zap", title: "Build", desc: "We code your site clean, fast, and fully responsive." },
  { icon: "Rocket", title: "Launch", desc: "Your site goes live — fast. From 24 to 72 hours depending on your plan." },
] as const;

// Section 7 — portfolio (real projects, cards link to the live sites)
export const PORTFOLIO = [
  {
    name: "Pacôme Pertant",
    type: "Interactive Portfolio",
    url: "https://pacomepertant.com/",
    domain: "pacomepertant.com",
    tags: ["Web Design", "3D & Motion"],
    result: "Immersive WebGL portfolio with spiral project navigation",
  },
  {
    name: "Storytelling by Noomo",
    type: "Brand Experience",
    url: "https://storytelling.noomoagency.com/",
    domain: "storytelling.noomoagency.com",
    tags: ["Web Design", "Animation"],
    result: "Award-grade digital storytelling experience in 3D",
  },
  {
    name: "Sohub",
    type: "Agency Platform",
    url: "https://sohub.digital/",
    domain: "sohub.digital",
    tags: ["Web Design", "Development"],
    result: "Bold digital agency platform — your story builds our history",
  },
  {
    name: "Seoul Glow",
    type: "E-commerce Store",
    url: "https://seoulglow.net/",
    domain: "seoulglow.net",
    tags: ["E-commerce", "Branding"],
    result: "K-beauty store with a glass-skin glow aesthetic, built to convert",
  },
] as const;

// Section 8 — pricing (ZAR primary, USD @ 18.50)
export const PRICING = [
  {
    name: "Micro",
    zar: 1500,
    usd: 81,
    tagline: "Single-page landing site. Fast, clean, professional.",
    features: ["1-page website", "Mobile responsive", "Contact button & WhatsApp", "Basic SEO"],
    delivery: "Up to 24 hours",
    cta: "Get Started — R1,500",
    featured: false,
    custom: false,
  },
  {
    name: "Starter",
    zar: 2800,
    usd: 151,
    tagline: "3-page website. Everything a small business needs.",
    features: [
      "3 pages (Home, About, Contact)",
      "Mobile responsive design",
      "Contact form",
      "Google Maps integration",
      "SEO setup",
    ],
    delivery: "Up to 24 hours",
    cta: "Get Started — R2,800",
    featured: false,
    custom: false,
  },
  {
    name: "Business",
    zar: 3500,
    usd: 189,
    tagline: "5 pages. Custom design. Ready to impress clients.",
    features: [
      "5 pages",
      "Custom design",
      "Photo gallery",
      "Contact & enquiry forms",
      "Social media links",
      "Full SEO optimisation",
    ],
    delivery: "Up to 48 hours",
    cta: "Get Started — R3,500",
    featured: false,
    custom: false,
  },
  {
    name: "Growth",
    zar: 5000,
    usd: 270,
    tagline: "Full website + booking system. Built to convert.",
    features: [
      "Up to 8 pages",
      "Booking / appointment form",
      "WhatsApp chat button",
      "Image slider & gallery",
      "Google Analytics setup",
      "3 months free support",
    ],
    delivery: "Up to 72 hours",
    cta: "Get Started — R5,000",
    featured: true,
    custom: false,
  },
  {
    name: "Pro",
    zar: 8000,
    usd: 432,
    tagline: "E-commerce or web app. Sell products online.",
    features: [
      "Unlimited pages",
      "Online store / e-commerce",
      "Payment integration",
      "Product management",
      "Customer accounts",
      "Priority support (6 months)",
    ],
    delivery: "Up to 72 hours",
    cta: "Get Started — R8,000",
    featured: false,
    custom: false,
  },
  {
    name: "Custom",
    zar: null,
    usd: null,
    tagline: "Enterprise, complex apps, or something unique. We handle it.",
    features: [
      "Web applications",
      "Custom integrations / APIs",
      "Multi-language websites",
      "CMS & admin dashboards",
      "Ongoing retainer support",
      "Dedicated project manager",
    ],
    delivery: null,
    cta: "Get a Custom Quote",
    featured: false,
    custom: true,
  },
] as const;

// Section 9 — testimonials
export const TESTIMONIALS = [
  {
    quote:
      "NetRive completely transformed our online presence. Professional, fast, and exactly what we needed.",
    name: "Sarah M.",
    company: "Apex Digital Solutions",
  },
  {
    quote:
      "Delivered our e-commerce site in under 48 hours. Absolutely blown away by the quality.",
    name: "Thabo K.",
    company: "Coastal Brands Co.",
  },
  {
    quote:
      "Best web agency in Cape Town. Our site looks better than we ever imagined. 100% recommend.",
    name: "Priya N.",
    company: "Summit Health Clinics",
  },
  {
    quote:
      "Our bookings tripled within a month of launching. The ROI was immediate. NetRive delivered.",
    name: "James V.",
    company: "Harbour Point Studios",
  },
  {
    quote:
      "Finally a web agency that actually delivers fast without sacrificing quality. Exceptional work.",
    name: "Amahle D.",
    company: "Zenith Retail Group",
  },
] as const;

// Section 10 — stats
export const STATS = [
  { icon: "Zap", value: "24–72hrs", label: "Delivery" },
  { icon: "CheckCircle2", value: "50+", label: "Sites Launched" },
  { icon: "Star", value: "4.9", label: "Google Rating" },
  { icon: "Globe", value: "SA & Beyond", label: "Clients Served" },
] as const;

// Section 3 — trust marquee items
export const MARQUEE_ITEMS = [
  "4.9 Google Rating",
  "Apex Digital Solutions",
  "Coastal Brands Co.",
  "Meridian Properties",
  "Cape Core Logistics",
  "Zenith Retail Group",
  "Harbour Point Studios",
  "Summit Health Clinics",
  "Atlantic Bay Consulting",
  "50+ Projects Delivered",
  "Secured by Yoco",
  "24–72hr Delivery",
  "Maintenance from R250/mo",
] as const;

// Blog page — posts go live here when published (layout ships empty by design)
export type BlogPost = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
};

export const BLOG_POSTS: readonly BlogPost[] = [] as const;

// Blog categories shown in the layout even before posts exist
export const BLOG_CATEGORIES = ["Strategy", "Guides", "SEO", "Performance"] as const;
