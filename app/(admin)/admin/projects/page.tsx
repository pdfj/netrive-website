import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubmissionsTable, type SubmissionRow } from "@/components/admin/SubmissionsTable";
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from "@/lib/leads";

const STATUS_COLORS: Record<string, string> = {
  submitted: "text-sky bg-sky/10 border-sky/20",
  in_review: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  in_progress: "text-electric bg-electric/10 border-electric/20",
  review: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  completed: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-haze bg-white/5 border-white/10",
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  in_review: "In Review",
  in_progress: "In Progress",
  review: "Client Review",
  completed: "Completed",
  cancelled: "Cancelled",
};

type LeadLite = {
  id: string;
  business_name: string | null;
  service_type: string | null;
  contact_name: string | null;
  status: string;
  created_at: string;
};

type Row = SubmissionRow & { ts: number };

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = createAdminClient();

  // SA submissions — the existing projects table.
  const { data: projects } = await db
    .from("projects")
    .select("id, title, package, status, created_at, reference, profiles(full_name, business_name)")
    .order("created_at", { ascending: false });

  // US submissions — the leads table (migration 007). Tolerate it not existing
  // yet so the SA list never breaks if the migration hasn't been run.
  let leads: LeadLite[] = [];
  try {
    const { data, error } = await db
      .from("leads")
      .select("id, business_name, service_type, contact_name, status, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) leads = data as LeadLite[];
  } catch {
    leads = [];
  }

  const projectRows: Row[] = (projects ?? []).map((p) => {
    const rawClient = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    const client = rawClient as { full_name: string | null; business_name: string | null } | null;
    return {
      id: p.id,
      market: "SA",
      primary: p.title,
      reference: p.reference ?? `#${String(p.id).slice(0, 8).toUpperCase()}`,
      client: client?.business_name ?? client?.full_name ?? "—",
      type: p.package ?? "—",
      status: p.status,
      statusLabel: STATUS_LABELS[p.status] ?? p.status,
      statusColor: STATUS_COLORS[p.status] ?? "",
      date: new Date(p.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }),
      href: `/admin/projects/${p.id}`,
      ts: new Date(p.created_at).getTime(),
    };
  });

  const leadRows: Row[] = leads.map((l) => ({
    id: l.id,
    market: "US",
    primary: l.business_name || l.contact_name || "US lead",
    reference: null,
    client: l.contact_name ?? "—",
    type: l.service_type ?? "—",
    status: l.status,
    statusLabel: LEAD_STATUS_LABELS[l.status] ?? l.status,
    statusColor: LEAD_STATUS_COLORS[l.status] ?? "",
    date: new Date(l.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    href: `/admin/leads/${l.id}`,
    ts: new Date(l.created_at).getTime(),
  }));

  const rows: Row[] = [...projectRows, ...leadRows].sort((a, b) => b.ts - a.ts);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">All Submissions</h1>
        <p className="mt-1 text-sm text-haze">{rows.length} total · SA projects + US leads</p>
      </div>
      <SubmissionsTable rows={rows} />
    </div>
  );
}
