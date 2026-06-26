import { NextRequest, NextResponse } from "next/server";
import { sendAdminNotificationEmail } from "@/lib/email";

// POST /api/leads — lightweight lead capture for the /us page.
// Reuses the SAME admin notification email as a normal project submission,
// but does NOT create an account (US leads are cold; the admin builds a free
// preview and follows up). Non-destructive: brand-new endpoint.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, business, email, phone, serviceType, message } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const projectTitle = `🇺🇸 US Lead — ${business?.trim() || name.trim()}${
      serviceType ? ` (${serviceType})` : ""
    }`;
    const description = [
      serviceType ? `Service type: ${serviceType}` : null,
      message?.trim() ? message.trim() : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    // Best-effort — never block the lead on email delivery.
    await sendAdminNotificationEmail({
      clientName: name,
      clientEmail: cleanEmail,
      clientPhone: phone || undefined,
      businessName: business || undefined,
      pkg: serviceType || "US — Free preview request",
      projectTitle,
      description: description || undefined,
    }).catch((e) => console.error("[leads] admin email failed (non-fatal):", e));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[leads] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 500 },
    );
  }
}
