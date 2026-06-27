import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendUsLeadConfirmationEmail, sendUsLeadNotificationEmail } from "@/lib/email";

// POST /api/leads — lead capture for the /us "free website preview" form.
// 1. Persists the lead in the `leads` table (so it shows in the admin dashboard,
//    tagged market = US, status = new).
// 2. Sends the lead an auto-reply confirmation (from hello@).
// 3. Notifies the owner so they see it even outside the dashboard.
// US leads are cold — no account is created (unlike /api/projects/submit).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, business, email, phone, serviceType, message } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // 1. Persist the lead so it appears in the admin dashboard.
    let leadId = "";
    try {
      const db = createAdminClient();
      const { data, error } = await db
        .from("leads")
        .insert({
          market: "US",
          business_name: business?.trim() || null,
          service_type: serviceType?.trim() || null,
          contact_name: name.trim(),
          email: cleanEmail,
          phone: phone?.trim() || null,
          message: message?.trim() || null,
          source: "/us",
          status: "new",
        })
        .select("id")
        .single();
      if (error) throw error;
      leadId = data.id;
    } catch (e) {
      // Never lose a lead if the DB write fails — the emails below still fire.
      console.error("[leads] DB insert failed (lead still emailed):", e);
    }

    // 2. Notifications — best-effort, never block the lead on email delivery.
    await Promise.allSettled([
      sendUsLeadConfirmationEmail({ to: cleanEmail, business, name }),
      sendUsLeadNotificationEmail({
        leadId: leadId || "unknown",
        contactName: name,
        business,
        serviceType,
        email: cleanEmail,
        phone,
        message,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[leads] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 500 },
    );
  }
}
