import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = createAdminClient();
  const { data: projects } = await db
    .from("projects")
    .select("id, title, package, status, progress, created_at, reference, profiles(full_name, business_name, phone)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">All Projects</h1>
        <p className="mt-1 text-sm text-haze">{projects?.length ?? 0} total</p>
      </div>

      <div className="rounded-card glass overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Project</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Client</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze sm:table-cell">Package</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Status</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze lg:table-cell">Progress</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {!projects?.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-haze">
                  No projects yet.
                </td>
              </tr>
            ) : (
              projects.map((p) => {
                const rawClient = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
                const client = rawClient as { full_name: string | null; business_name: string | null; phone: string | null } | null;
                const date = new Date(p.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
                return (
                  <tr key={p.id} className="transition hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <Link href={`/admin/projects/${p.id}`} className="font-medium text-white hover:text-sky">
                        {p.title}
                      </Link>
                      <span className="mt-0.5 block font-mono text-xs text-sky/80">
                        {p.reference ?? `#${p.id.slice(0, 8).toUpperCase()}`}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-haze">
                      {client?.business_name ?? client?.full_name ?? "—"}
                    </td>
                    <td className="hidden px-5 py-4 text-haze sm:table-cell">{p.package ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-pill border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[p.status] ?? ""}`}>
                        {STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-pill bg-white/10">
                          <div className="h-full rounded-pill bg-electric" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs text-haze">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 text-haze md:table-cell">{date}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
