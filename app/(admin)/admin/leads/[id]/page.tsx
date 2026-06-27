import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Mail, Phone, CalendarCheck } from "lucide-react";
import { AdminLeadControls } from "@/components/admin/AdminLeadControls";
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from "@/lib/leads";
import { US_CALENDLY_URL } from "@/lib/us-config";

export default async function AdminLeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = createAdminClient();
  const { data: lead } = await db
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!lead) notFound();

  const date = new Date(lead.created_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-haze transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> All submissions
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-pill border border-blue-400/30 bg-blue-400/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
              🇺🇸 US Lead
            </span>
            <span
              className={`rounded-pill border px-2.5 py-1 text-xs font-medium ${LEAD_STATUS_COLORS[lead.status] ?? ""}`}
            >
              {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {lead.business_name || lead.contact_name}
          </h1>
          <p className="mt-2 text-sm text-haze">
            Submitted {date} · from {lead.source ?? "/us"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left — lead details + quick actions */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-card glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Submission</h2>
            <dl className="space-y-2.5 text-sm">
              {[
                ["Business", lead.business_name ?? "—"],
                ["Service type", lead.service_type ?? "—"],
                ["Contact name", lead.contact_name ?? "—"],
                ["Email", lead.email ?? "—"],
                ["Phone", lead.phone ?? "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <dt className="w-28 shrink-0 text-haze">{label}</dt>
                  <dd className="text-white">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-2 rounded-btn bg-sky/15 px-4 py-2 text-sm font-medium text-sky transition hover:bg-sky/25"
              >
                <Mail className="h-4 w-4" /> Email lead
              </a>
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-2 rounded-btn bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.1]"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              )}
              <a
                href={US_CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-btn bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.1]"
              >
                <CalendarCheck className="h-4 w-4" /> Booking link
              </a>
            </div>
          </div>

          {lead.message && (
            <div className="rounded-card glass p-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-white">Their message</h2>
              <p className="whitespace-pre-wrap text-sm leading-[1.8] text-haze">{lead.message}</p>
            </div>
          )}
        </div>

        {/* Right — status + notes */}
        <div className="lg:col-span-2">
          <AdminLeadControls
            leadId={lead.id}
            initialStatus={lead.status}
            initialNotes={lead.admin_notes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
