import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// OpenAI-compatible chat endpoint. Defaults to Groq (free tier, real API key).
// Set CHAT_API_KEY in Vercel to switch the assistant on. Optionally override
// CHAT_API_URL / CHAT_MODEL to use a different provider — no code change needed.
const CHAT_API_URL =
  process.env.CHAT_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const CHAT_MODEL = process.env.CHAT_MODEL ?? "llama-3.3-70b-versatile";

const STATUS_WORDS: Record<string, string> = {
  submitted: "just received, we're about to review it",
  in_review: "being reviewed by the team right now",
  in_progress: "actively being built",
  review: "ready for them to look over and approve",
  completed: "finished and live",
  cancelled: "on hold",
};

function basePrompt() {
  return [
    "You're the person who answers messages for NetRive, a small web design studio in Cape Town, South Africa.",
    "You talk like a real, calm, friendly human texting a customer. Not like a bot.",
    "",
    "How you write:",
    "Keep it short and warm, usually one to three sentences. Use everyday words and contractions (you're, we'll, it's).",
    "Never use dashes of any kind in your writing. No em dashes, no hyphenated asides. Use commas or full stops or just start a new sentence instead.",
    "Never say you are an AI, a bot, a model, or an assistant. Never say 'as an AI' or 'I'm just a'. You're simply the NetRive team member on chat.",
    "No bullet points or numbered lists. No corporate filler. No exclamation overload. Stay relaxed and genuine.",
    "If you don't know something, say you'll check with the team, don't make it up.",
    "",
    "About NetRive: we build fast, modern websites, online stores, booking systems and custom web apps for businesses. ",
    "We build a free preview first and you only pay once you approve it. Maintenance starts at R250 a month. Delivery is roughly 24 to 72 hours depending on the plan. ",
    "For pricing, don't invent exact numbers, point them to the pricing page or offer to get them a quick quote. ",
    "If someone wants to start, point them to the Start a Project button. If they want a real person, let them know they can tap the 'Talk to the team' option any time and we'll jump in.",
  ].join("\n");
}

function projectContext(p: {
  title: string;
  status: string;
  progress: number;
  package: string | null;
  preview_url: string | null;
  invoice_status: string | null;
}) {
  const lines = [
    "",
    "You're chatting with an existing client who is logged in. Here is the live state of THEIR project. Use it to answer naturally, in plain language, not as a data readout:",
    `Project: ${p.title}`,
    p.package ? `Plan: ${p.package}` : "",
    `Stage: ${p.status} (${STATUS_WORDS[p.status] ?? p.status})`,
    `Progress: ${p.progress}% complete`,
    p.preview_url ? "A preview is available for them to view." : "No preview is ready yet.",
    p.invoice_status && p.invoice_status !== "none"
      ? `Invoice status: ${p.invoice_status}.`
      : "No invoice has been sent yet.",
    "",
    "If they ask how far along their project is, answer warmly and specifically using the progress and stage, like a teammate giving a real update. For example if it's around halfway and being built, you might say it's coming along nicely, you're roughly halfway, the team is deep in the build sorting out the layout and images. Keep it natural and reassuring.",
  ];
  return lines.filter(Boolean).join("\n");
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

  // ── Build the system prompt, with the client's live project if we can verify it ──
  let system = basePrompt();
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
        // Only inject context if this user actually owns the project
        if (project && project.client_id === user.id) {
          verifiedProjectId = project.id;
          system += "\n" + projectContext(project);
        }
      }
    } catch {
      // ignore — fall back to the generic assistant
    }
  }

  const apiKey = process.env.CHAT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "Thanks for the message. Our chat helper isn't switched on at this moment, but the team will see this. You can also tap Talk to the team and we'll get right back to you.",
    });
  }

  // ── Call the OpenAI-compatible chat endpoint ──
  let reply = "";
  try {
    const res = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        temperature: 0.6,
        max_tokens: 400,
        messages: [{ role: "system", content: system }, ...trimmed],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        reply:
          "I'm having a small hiccup connecting. Give it another go in a sec, or tap Talk to the team and we'll come help you directly.",
      });
    }

    const data = await res.json();
    reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I want to get this right, let me loop in the team. You can also tap Talk to the team and we'll jump in.";
  } catch {
    return NextResponse.json({
      reply: "Something glitched on my side. Try again, or tap Talk to the team and we'll help.",
    });
  }

  // ── Log the exchange against the project (best-effort) ──
  if (verifiedProjectId) {
    try {
      const adminDb = createAdminClient();
      const lastUser = trimmed[trimmed.length - 1];
      await adminDb.from("ai_chat_logs").insert([
        { project_id: verifiedProjectId, role: "user", content: lastUser.content },
        { project_id: verifiedProjectId, role: "assistant", content: reply },
      ]);
    } catch {
      // ignore logging failures
    }
  }

  return NextResponse.json({ reply });
}
