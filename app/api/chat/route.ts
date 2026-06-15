import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// OpenAI-compatible chat endpoint. Defaults to Groq (free tier, real API key).
// Set CHAT_API_KEY in Vercel to upgrade to full AI. Without it, a built-in
// knowledge base answers the common questions for free.
const CHAT_API_URL =
  process.env.CHAT_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const CHAT_MODEL = process.env.CHAT_MODEL ?? "llama-3.3-70b-versatile";

type ProjectCtx = {
  title: string;
  status: string;
  progress: number;
  package: string | null;
  preview_url: string | null;
  invoice_status: string | null;
};

const STATUS_WORDS: Record<string, string> = {
  submitted: "just received, we're about to review it",
  in_review: "being reviewed by the team right now",
  in_progress: "actively being built",
  review: "ready for you to look over and approve",
  completed: "finished and live",
  cancelled: "on hold",
};

function basePrompt() {
  return [
    "You're the person who answers messages for NetRive, a small web design studio in Cape Town, South Africa.",
    "You talk like a real, calm, friendly human texting a customer. Not like a bot.",
    "",
    "How you write:",
    "Keep it short and warm, usually one to three sentences. Use everyday words and contractions.",
    "Never use dashes of any kind. No em dashes, no hyphenated asides. Use commas or full stops instead.",
    "Never say you are an AI, a bot, a model, or an assistant. You're simply the NetRive team member on chat.",
    "No bullet points or numbered lists. No corporate filler. Stay relaxed and genuine.",
    "Always try to actually answer the question first. Only suggest talking to the team if they ask for a human or it's something you truly cannot help with.",
    "",
    "Facts you can use:",
    "We build websites, online stores, booking systems and custom web apps for businesses.",
    "We build a free preview first and you only pay once you approve it.",
    "Pricing starts around R1500 for a simple site and goes up depending on the work. For an exact figure, point them to the pricing page or offer a quick free quote. Don't invent precise numbers.",
    "Maintenance starts at R250 a month.",
    "Delivery is roughly 24 to 72 hours depending on the plan.",
    "Payment is by EFT once they approve their preview, and they get an invoice with banking details and a reference.",
    "We're based in Cape Town and work with clients across South Africa and beyond.",
    "Our WhatsApp is +27 65 653 8435 and email is hello@netrive.com.",
    "To start, they tap the Start a Project button on the site.",
  ].join("\n");
}

function projectContextForAI(p: ProjectCtx) {
  return [
    "",
    "You're chatting with an existing client who is logged in. Here is the live state of THEIR project. Use it to answer naturally, not as a data readout:",
    `Project: ${p.title}`,
    p.package ? `Plan: ${p.package}` : "",
    `Stage: ${p.status} (${STATUS_WORDS[p.status] ?? p.status})`,
    `Progress: ${p.progress}% complete`,
    p.preview_url ? "A preview is ready for them to view." : "No preview is ready yet.",
    p.invoice_status && p.invoice_status !== "none" ? `Invoice status: ${p.invoice_status}.` : "No invoice sent yet.",
    "",
    "If they ask how far along their project is, give a warm, specific update using the progress and stage, like a teammate.",
  ]
    .filter(Boolean)
    .join("\n");
}

// ── Built-in answers (work with zero setup / zero cost) ──────────────
function statusAnswer(p: ProjectCtx): string {
  const pct = p.progress;
  if (p.status === "completed")
    return "Great news, your site is all done and live. If anything needs a little tweak, just say the word and we'll sort it.";
  if (p.status === "review" || p.preview_url)
    return "Your preview is ready for you to look over. Have a peek, and once you're happy we'll send the invoice and get you live.";
  if (p.status === "submitted")
    return "We've got your project and we're about to dive in. I'll keep you posted right here as it moves along.";
  if (p.status === "in_review")
    return "Your project is with the team for review right now while we map out the plan. It won't be long before the build kicks off.";
  if (p.status === "cancelled")
    return "This one is on hold at the moment. If you'd like to pick it back up, just let me know.";
  // in_progress
  if (pct < 34)
    return `We're in the early build stage, getting the foundations and layout in place. You're about ${pct}% of the way there and moving nicely.`;
  if (pct < 67)
    return `Good news, you're roughly ${pct}% there. The team is deep in the build right now, sorting out the layout and setting up your images and content.`;
  return `Almost there, you're around ${pct}% done. We're polishing things up and doing the final checks before it's ready for you to look over.`;
}

function localAnswer(text: string, p: ProjectCtx | null): string {
  const t = text.toLowerCase();
  const has = (...ws: string[]) => ws.some((w) => t.includes(w));

  // Project status (only meaningful for a logged-in client with a project)
  if (p && has("how far", "progress", "status", "how long left", "how's my", "hows my", "almost done", "ready yet", "update on", "where are we", "how is my project", "my project")) {
    if (has("how far", "progress", "status", "ready", "update", "where are we", "almost", "done", "long left") || t.includes("my project"))
      return statusAnswer(p);
  }

  if (has("hi", "hey", "hello", "good morning", "good afternoon", "howzit") && t.length < 25)
    return "Hey, good to have you here. What can I help you with today?";

  if (has("thank", "thanks", "appreciate", "cheers"))
    return "Anytime, happy to help. Anything else you'd like to know?";

  if (has("price", "pricing", "cost", "how much", "quote", "charge", "rate", "budget", "afford"))
    return "It depends on what you need. Simple sites start around R1500 and go up from there based on pages and features. The quickest way is to start a project and we'll send you a free preview and an exact quote, no obligation. You can also check the pricing page for the packages.";

  if (has("package", "plan", "tier"))
    return "We've got a few packages, from a single landing page up to full online stores and custom web apps. Have a look at the pricing page and I can help you figure out which fits, or we can just build you a free preview to see it in action.";

  if (has("ecommerce", "e-commerce", "online store", "shop", "sell online", "products", "store"))
    return "Yes, we build full online stores with payments, product management and the lot. We'd build you a free preview first so you can see your shop before paying anything.";

  if (has("how long", "turnaround", "how fast", "how quick", "delivery", "days", "timeline", "when will", "time frame", "timeframe"))
    return "Pretty fast. Most sites are ready in roughly 24 to 72 hours depending on the size of the project. We'll give you a clear timeline once we see what you need.";

  if (has("how do", "how does it work", "process", "preview", "demo", "free", "before i pay", "before pay", "trial"))
    return "Simple. You tell us what you want, we build a free preview of your site, and you only pay once you're happy with it. After you approve, we send an invoice and your live site goes out within 12 to 24 hours of payment.";

  if (has("maintenance", "support", "updates", "look after", "manage my"))
    return "We can look after your site for you with maintenance from R250 a month, covering security, updates and keeping everything running smoothly.";

  if (has("pay", "payment", "eft", "bank", "capitec", "invoice"))
    return "Once you approve your preview, we send you an invoice with our banking details and a reference. You pay by EFT, tap the I've paid button, and we confirm and deliver your live site. Nice and simple.";

  if (has("whatsapp", "phone", "call", "number", "contact", "email", "reach", "get hold"))
    return "You can reach us on WhatsApp at +27 65 653 8435 or email hello@netrive.com. I'm also right here if you want to keep chatting.";

  if (has("where", "based", "location", "country", "city", "cape town", "south africa", "local"))
    return "We're based in Cape Town, South Africa, and we work with businesses across the country and beyond.";

  if (has("start", "get started", "begin", "sign up", "signup", "new project", "build me", "i want a", "i need a", "make me"))
    return "Love it. Tap the Start a Project button and tell us a bit about what you want. We'll build you a free preview so you can see it before you pay anything.";

  if (has("seo", "google", "rank", "search engine", "found on google"))
    return "Yes, we set your site up properly for Google from the start, and we offer SEO and ads if you want to push harder on getting found.";

  if (has("logo", "brand", "branding", "design"))
    return "We do branding and logo design too, so your whole look stays consistent across your site and socials.";

  // Soft catch-all that still helps, without hard-deferring
  return "Happy to help with that. I can tell you about our pricing, the kinds of sites we build, how the free preview works, or how long things take. What would you like to know? And if you'd ever prefer a real person, the Talk to the team button is right there.";
}

export async function POST(req: NextRequest) {
  let messages: { role: "user" | "assistant"; content: string }[] = [];
  let projectId: string | null = null;
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
    projectId = body?.projectId || null;
  } catch {
    return NextResponse.json({ reply: "Sorry, I didn't catch that. Mind saying it again?" });
  }

  const trimmed = messages
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!trimmed.length) {
    return NextResponse.json({ reply: "Hey, how can I help with your website today?" });
  }

  const lastUser = [...trimmed].reverse().find((m) => m.role === "user")?.content ?? "";

  // ── Verify the client's project (for context + logging) ──
  let projectCtx: ProjectCtx | null = null;
  let verifiedProjectId: string | null = null;
  if (projectId) {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const adminDb = createAdminClient();
        const { data: project } = await adminDb
          .from("projects")
          .select("id, client_id, title, status, progress, package, preview_url, invoice_status")
          .eq("id", projectId)
          .single();
        if (project && project.client_id === user.id) {
          verifiedProjectId = project.id;
          projectCtx = project;
        }
      }
    } catch {
      /* ignore */
    }
  }

  // The built-in answer always works (free, no setup)
  const fallback = localAnswer(lastUser, projectCtx);
  let reply = fallback;

  // If an AI key is configured, prefer the AI (richer answers); fall back on error
  const apiKey = process.env.CHAT_API_KEY;
  if (apiKey) {
    try {
      let system = basePrompt();
      if (projectCtx) system += "\n" + projectContextForAI(projectCtx);
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: CHAT_MODEL,
          temperature: 0.6,
          max_tokens: 400,
          messages: [{ role: "system", content: system }, ...trimmed],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const aiReply = data?.choices?.[0]?.message?.content?.trim();
        if (aiReply) reply = aiReply;
      }
    } catch {
      /* keep the built-in answer */
    }
  }

  // Log against the project (best-effort)
  if (verifiedProjectId) {
    try {
      const adminDb = createAdminClient();
      await adminDb.from("ai_chat_logs").insert([
        { project_id: verifiedProjectId, role: "user", content: lastUser },
        { project_id: verifiedProjectId, role: "assistant", content: reply },
      ]);
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ reply });
}
