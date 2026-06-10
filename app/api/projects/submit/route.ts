import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendProjectConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";
import { sendProjectConfirmationWhatsApp, sendAdminWhatsAppNotification } from "@/lib/whatsapp";

function genReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `NR-${s}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, business, email, phone, package: pkg, message, password } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";
    const cleanEmail = String(email).toLowerCase().trim();

    // 1. Find or create the auth user
    const { data: existingList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existingUser = existingList?.users?.find((u) => u.email === cleanEmail);

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      if (!password || String(password).length < 6) {
        return NextResponse.json(
          { error: "Please choose a password (at least 6 characters) to create your account." },
          { status: 400 }
        );
      }
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: cleanEmail,
        password: String(password),
        email_confirm: true,
        user_metadata: { full_name: name },
      });
      if (createErr || !created.user) {
        throw new Error(`Could not create user: ${createErr?.message}`);
      }
      userId = created.user.id;
      isNewUser = true;
      await supabase.from("profiles").insert({
        id: userId,
        full_name: name,
        business_name: business || null,
        phone: phone || null,
        role: "client",
      });
    }

    // 2. Create the project with a unique reference code
    const reference = genReference();
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
        reference,
      })
      .select()
      .single();

    if (projErr || !project) {
      throw new Error(`Could not create project: ${projErr?.message}`);
    }

    // 3. Notifications (best-effort, never block submission)
    const dashboardLink = `${siteUrl}/dashboard`;
    await Promise.allSettled([
      sendProjectConfirmationEmail({ to: cleanEmail, name, projectTitle, dashboardLink, isNewUser, reference }),
      phone ? sendProjectConfirmationWhatsApp({ to: phone, name, projectTitle }) : Promise.resolve(),
      sendAdminNotificationEmail({
        clientName: name,
        clientEmail: cleanEmail,
        clientPhone: phone,
        businessName: business,
        pkg,
        projectTitle,
        description: message,
      }),
      sendAdminWhatsAppNotification({ clientName: name, clientEmail: cleanEmail, projectTitle }),
    ]);

    return NextResponse.json({
      success: true,
      projectId: project.id,
      reference,
      isNewUser,
      existing: !isNewUser,
    });
  } catch (err) {
    console.error("[submit] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
