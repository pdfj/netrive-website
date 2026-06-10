import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInvoicePaidClaimEmail } from "@/lib/email";

// POST /api/invoices/paid — client marks their invoice as paid
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await request.json();
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const adminDb = createAdminClient();

  // Verify this project belongs to the caller and has an issued invoice
  const { data: project } = await adminDb
    .from("projects")
    .select("*, profiles(full_name)")
    .eq("id", projectId)
    .eq("client_id", user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  if (project.invoice_status !== "issued") {
    return NextResponse.json(
      { error: "No payable invoice on this project" },
      { status: 400 }
    );
  }

  const { data, error } = await adminDb
    .from("projects")
    .update({
      invoice_status: "client_paid",
      invoice_paid_claimed_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Tell the admin (best-effort)
  try {
    const clientProfile = project.profiles as { full_name: string | null } | null;
    await sendInvoicePaidClaimEmail({
      clientName: clientProfile?.full_name ?? "A client",
      projectTitle: project.title,
      reference:
        project.reference ?? `#${String(project.id).slice(0, 8).toUpperCase()}`,
      amount: project.invoice_amount ?? null,
      projectId: project.id,
    });
  } catch (e) {
    console.error("[invoices/paid] admin email failed (non-fatal):", e);
  }

  return NextResponse.json(data);
}
