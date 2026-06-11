import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLiveAgentRequestEmail } from "@/lib/email";

// POST /api/chat/live — visitor asks to talk to a real person.
// Emails the owner (personal inbox) and logs a note on the project if known.
export async function POST(req: NextRequest) {
  let projectId: string | null = null;
  let transcript: { role: string; content: string }[] = [];
  let guestName = "";
  let guestContact = "";
  try {
    const body = await req.json();
    projectId = body?.projectId || null;
    transcript = Array.isArray(body?.transcript) ? body.transcript.slice(-8) : [];
    guestName = (body?.name ?? "").toString().slice(0, 120);
    guestContact = (body?.contact ?? "").toString().slice(0, 160);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const adminDb = createAdminClient();

  // If a logged-in client, enrich with their details + verify project ownership
  let clientName = guestName || "A website visitor";
  let clientEmail: string | null = guestContact || null;
  let projectTitle: string | null = null;
  let reference: string | null = null;
  let verifiedProjectId: string | null = null;

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      clientEmail = user.email ?? clientEmail;
      const { data: profile } = await adminDb
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (profile?.full_name) clientName = profile.full_name;

      if (projectId) {
        const { data: project } = await adminDb
          .from("projects")
          .select("id, client_id, title, reference")
          .eq("id", projectId)
          .single();
        if (project && project.client_id === user.id) {
          verifiedProjectId = project.id;
          projectTitle = project.title;
          reference = project.reference ?? `#${project.id.slice(0, 8).toUpperCase()}`;
        }
      }
    }
  } catch {
    // continue with whatever we have
  }

  const recent = transcript
    .map((m) => `${m.role === "user" ? "Them" : "Assistant"}: ${m.content}`)
    .join("\n")
    .slice(0, 2000);

  // Log a note on the project timeline (best-effort)
  if (verifiedProjectId) {
    try {
      await adminDb.from("ai_chat_logs").insert({
        project_id: verifiedProjectId,
        role: "note",
        content: "Client requested to speak to the live team.",
      });
    } catch {
      /* ignore */
    }
  }

  // Email the owner (best-effort, never fail the request)
  try {
    await sendLiveAgentRequestEmail({
      clientName,
      clientEmail,
      projectTitle,
      reference,
      projectId: verifiedProjectId,
      recent,
    });
  } catch (e) {
    console.error("[chat/live] email failed (non-fatal):", e);
  }

  return NextResponse.json({ ok: true });
}
