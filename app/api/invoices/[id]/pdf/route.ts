import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderInvoicePdf } from "@/lib/invoice-pdf";

// GET /api/invoices/[id]/pdf — download the invoice PDF.
// Allowed for the project's own client, or any admin.
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminDb = createAdminClient();

  const { data: project } = await adminDb
    .from("projects")
    .select("*, profiles(full_name, business_name)")
    .eq("id", params.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Authorisation: the owning client, or an admin
  const { data: me } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isAdmin = me?.role === "admin";
  const isOwner = project.client_id === user.id;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!project.invoice_amount || project.invoice_status === "none") {
    return NextResponse.json({ error: "No invoice has been issued for this project yet." }, { status: 404 });
  }

  const { data: authUser } = await adminDb.auth.admin.getUserById(project.client_id);
  const clientProfile = project.profiles as { full_name: string | null; business_name: string | null } | null;
  const reference: string =
    project.reference ?? `#${String(project.id).slice(0, 8).toUpperCase()}`;

  const pdf = await renderInvoicePdf({
    reference,
    projectTitle: project.title,
    packageName: project.package,
    amount: Number(project.invoice_amount),
    monthly: project.invoice_monthly ? Number(project.invoice_monthly) : null,
    installments: project.invoice_installments ? Number(project.invoice_installments) : null,
    clientName: clientProfile?.full_name ?? "Client",
    businessName: clientProfile?.business_name ?? null,
    clientEmail: authUser?.user?.email ?? null,
    issuedAt: project.invoice_issued_at,
  });

  return new NextResponse(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Invoice-${reference}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
