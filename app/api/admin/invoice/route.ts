import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInvoiceEmail, sendPaymentConfirmedEmail } from "@/lib/email";
import { renderInvoicePdf } from "@/lib/invoice-pdf";

// POST /api/admin/invoice
// { projectId, action: "issue", amount, monthly? }  → issue invoice + email client
// { projectId, action: "confirm" }                  → confirm payment + email client
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminDb = createAdminClient();
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { projectId, action, amount, monthly, installments } = await request.json();
  if (!projectId || !action) {
    return NextResponse.json({ error: "projectId and action required" }, { status: 400 });
  }

  // Load project + client
  const { data: project, error: projErr } = await adminDb
    .from("projects")
    .select("*, profiles(full_name, business_name)")
    .eq("id", projectId)
    .single();
  if (projErr || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { data: authUser } = await adminDb.auth.admin.getUserById(project.client_id);
  const clientEmail = authUser?.user?.email ?? null;
  const clientProfile = project.profiles as { full_name: string | null; business_name: string | null } | null;
  const clientName = clientProfile?.full_name ?? "there";
  const reference: string =
    project.reference ?? `#${String(project.id).slice(0, 8).toUpperCase()}`;

  if (action === "issue") {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return NextResponse.json({ error: "A valid amount is required" }, { status: 400 });
    }
    const monthlyAmt = monthly ? Number(monthly) : null;
    const inst = Number(installments) === 3 || Number(installments) === 6 ? Number(installments) : null;

    const { data, error } = await adminDb
      .from("projects")
      .update({
        invoice_amount: amt,
        invoice_monthly: monthlyAmt,
        invoice_installments: inst,
        invoice_status: "issued",
        invoice_issued_at: new Date().toISOString(),
        invoice_paid_claimed_at: null,
        invoice_confirmed_at: null,
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      const hint = error.message.includes("column")
        ? " — run supabase/migrations/002_invoices.sql in the Supabase SQL editor first"
        : "";
      return NextResponse.json({ error: error.message + hint }, { status: 500 });
    }

    if (clientEmail) {
      try {
        // Generate the branded PDF invoice (best-effort — never blocks issuing)
        let pdf: Buffer | null = null;
        try {
          pdf = await renderInvoicePdf({
            reference,
            projectTitle: project.title,
            packageName: project.package,
            amount: amt,
            monthly: monthlyAmt,
            installments: inst,
            clientName,
            businessName: clientProfile?.business_name ?? null,
            clientEmail,
            issuedAt: data.invoice_issued_at,
          });
        } catch (pdfErr) {
          console.error("[invoice] pdf render failed (non-fatal):", pdfErr);
        }

        await sendInvoiceEmail({
          to: clientEmail,
          name: clientName,
          projectTitle: project.title,
          reference,
          amount: amt,
          monthly: monthlyAmt,
          installments: inst,
          pdf,
        });
      } catch (e) {
        console.error("[invoice] email failed (non-fatal):", e);
      }
    }

    return NextResponse.json(data);
  }

  if (action === "confirm") {
    const { data, error } = await adminDb
      .from("projects")
      .update({
        invoice_status: "confirmed",
        invoice_confirmed_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (clientEmail) {
      try {
        await sendPaymentConfirmedEmail({
          to: clientEmail,
          name: clientName,
          projectTitle: project.title,
          reference,
        });
      } catch (e) {
        console.error("[invoice] confirm email failed (non-fatal):", e);
      }
    }

    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
