import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendProjectConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";
import { sendProjectConfirmationWhatsApp, sendAdminWhatsAppNotification } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, business, email, phone, package: pkg, message } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";

    // ── 1. Find or create the auth user ──────────────────────────
    const { data: existingList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existingUser = existingList?.users?.find((u) => u.email === email.toLowerCase().trim());

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        email_confirm: true,
        user_metadata: { full_name: name },
      });

      if (createErr || !created.user) {
        throw new Error(`Could not create user: ${createErr?.message}`);
      }

      userId = created.user.id;
      isNewUser = true;

      // Create profile row
      await supabase.from("profiles").insert({
        id: userId,
        full_name: name,
        business_name: business || null,
        phone: phone || null,
        role: "client",
      });
    }

    // ── 2. Create the project ─────────────────────────────────────
    const projectTitle = business
      ? `${business} — ${pkg || "Website Project"}`
      : `${name} — ${pkg || "Website Project"}`;

    const { data: project, error: projErr } = await supabase
      .from("projects")
      .insert({
        client_id: userId,
        title: projectTitle,
        description: message || null,
        package: pkg || null,
        status: "submitted",
        progress: 0,
      })
      .select()
      .single();

    if (projErr || !project) {
      throw new Error(`Could not create project: ${projErr?.message}`);
    }

    // ── 3. Generate magic link — routes through callback so session cookie is set ─────
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: email.toLowerCase().trim(),
      options: {
        // Must go through our callback, which calls exchangeCodeForSession and sets the cookie
        redirectTo: `${siteUrl}/api/auth/callback`,
      },
    });

    const dashboardLink =
      linkData?.properties?.action_link ?? `${siteUrl}/auth/login`;

    // ── 4. Send notifications (best-effort — don't fail submission) ─
    await Promise.allSettled([
      sendProjectConfirmationEmail({ to: email, name, projectTitle, dashboardLink, isNewUser }),
      phone ? sendProjectConfirmationWhatsApp({ to: phone, name, projectTitle }) : Promise.resolve(),
      sendAdminNotificationEmail({ clientName: name, clientEmail: email, clientPhone: phone, businessName: business, pkg, projectTitle, description: message }),
      sendAdminWhatsAppNotification({ clientName: name, clientEmail: email, projectTitle }),
    ]);

    // Return the magic link so the frontend can auto-redirect (new users only)
    return NextResponse.json({
      success: true,
      projectId: project.id,
      // Only send the auto-login link for brand-new users; returning users are already logged in
      dashboardLink: isNewUser ? dashboardLink : null,
    });
  } catch (err) {
    console.error("[submit] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
