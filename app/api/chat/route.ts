import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are NetRive's friendly website assistant. NetRive is a Cape Town, South Africa web design and development agency that builds fast, modern, high-converting websites for businesses across South Africa and beyond. " +
  "What NetRive offers: web design, web development, e-commerce stores, SEO, branding and logo design, Google and Meta ads, social media management, website maintenance, booking systems, payment integration, custom web apps, and WhatsApp business integration. " +
  "How it works: a client submits a project on the site, NetRive builds a free preview/demo first, and the client only pays once they approve the preview. Projects typically take up to 3 days to build. " +
  "Your job: answer visitor questions helpfully and concisely (2 to 4 sentences), in a warm, confident tone. Encourage visitors to start a project (the Start a Project button or contact page) or message on WhatsApp (+27 83 515 3674) for a quote. Do NOT invent specific prices; for pricing, tell them to request a free quote via the contact form, since every project is custom. If asked something unrelated to NetRive, gently steer back to how NetRive can help with their website.";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        "Our AI assistant isn't switched on just yet! In the meantime, tap the WhatsApp button or hit Start a Project and a real human at NetRive will get right back to you.",
    });
  }

  let messages: { role: "user" | "assistant"; content: string }[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ reply: "Sorry, I didn't catch that. Could you try again?" });
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
    return NextResponse.json({
      reply: "Hi! Ask me anything about NetRive and how we can help with your website.",
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({
        reply:
          "I'm having a moment. Please try again, or tap the WhatsApp button to chat with the NetRive team directly.",
      });
    }

    const data = await res.json();
    const reply =
      data?.content?.[0]?.text?.trim() ||
      "I'm not sure how to answer that. Try rephrasing, or reach out via WhatsApp and we'll help!";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply: "Something went wrong on my end. Please try again or message us on WhatsApp.",
    });
  }
}
