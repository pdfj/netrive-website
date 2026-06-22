import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

// POST /api/messages — send a chat message (client or admin)
export async function POST(request: NextRequest) {
  // 1. Verify the user is authenticated
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, content } = await request.json();

  if (!projectId || !content?.trim()) {
    return NextResponse.json(
      { error: "projectId and content required" },
      { status: 400 }
    );
  }

  // 2. Use the service-role client for the actual insert so RLS never blocks
  //    admins (who have no client_id relationship to the project).
  const adminDb = createAdminClient();

  const { data, error } = await adminDb
    .from("messages")
    .insert({
      project_id: projectId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("[messages] insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. If a CLIENT sent this, email the admin so no message goes unseen.
  //    Best-effort — never blocks or fails the send.
  try {
    const { data: senderProfile } = await adminDb
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (senderProfile?.role !== "admin") {
      const { data: project } = await adminDb
        .from("projects")
        .select("title, reference")
        .eq("id", projectId)
        .single();

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "NetRive <info@netrive.com>",
        replyTo: "hello@netrive.com",
        to: process.env.ADMIN_EMAIL ?? "hello@netrive.com",
        subject: `💬 New message from ${senderProfile?.full_name ?? "a client"} — ${project?.reference ?? project?.title ?? "project"}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fff;border-radius:16px;">
          <p style="margin:0 0 4px;font-size:12px;color:#9aa3b2;text-transform:uppercase;letter-spacing:0.1em;">New chat message</p>
          <p style="margin:0 0 16px;font-size:16px;font-weight:bold;">${senderProfile?.full_name ?? "Client"} · ${project?.title ?? ""} ${project?.reference ? `(${project.reference})` : ""}</p>
          <div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:14px 18px;font-size:14px;line-height:1.7;">${content.trim().replace(/</g, "&lt;")}</div>
          <a href="${siteUrl}/admin/projects/${projectId}" style="display:inline-block;margin-top:18px;background:linear-gradient(120deg,#00d4ff,#2563eb);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 24px;border-radius:50px;">Reply in Admin →</a>
        </div>`,
      });
    }
  } catch (notifyErr) {
    console.error("[messages] admin notify failed (non-fatal):", notifyErr);
  }

  return NextResponse.json(data);
}
