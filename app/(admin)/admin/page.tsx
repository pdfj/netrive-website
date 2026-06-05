import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FolderOpen, Users, Clock, ArrowRight } from "lucide-react";

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

export default async function AdminOverviewPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = createAdminClient();

  const [{ count: totalProjects }, { count: totalClients }, { data: recentProjects }] =
    await Promise.all([
      db.from("projects").select("*", { count: "exact", head: true }),
      db.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
      db
        .from("projects")
        .select("id, title, status, progress, created_at, profiles(full_name, business_name)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const activeCount = recentProjects?.filter((p) =>
    ["submitted", "in_review", "in_progress", "review"].includes(p.status)
  ).length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-haze">Overview of all client projects</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { label: "Total Projects", value: totalProjects ?? 0, icon: <FolderOpen className="h-5 w-5 text-electric" /> },
          { label: "Active Projects", value: activeCount, icon: <Clock className="h-5 w-5 text-yellow-400" /> },
          { label: "Total Clients", value: totalClients ?? 0, icon: <Users className="h-5 w-5 text-sky" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-card glass p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-haze">{s.label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]">
                {s.icon}
              </div>
            </div>
            <p className="mt-3 font-display text-4xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="rounded-card glass p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Recent Projects</h2>
          <Link href="/admin/projects" className="flex items-center gap-1 text-sm text-electric hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {!recentProjects?.length ? (
            <p className="text-sm text-haze">No projects yet.</p>
          ) : (
            recentProjects.map((p) => {
              const raw = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
              const client = raw as { full_name: string | null; business_name: string | null } | null;
              return (
                <Link
                  key={p.id}
                  href={`/admin/projects/${p.id}`}
                  className="group flex items-center justify-between rounded-input border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-electric/30 hover:bg-white/[0.05]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">{p.title}</p>
                    <p className="text-xs text-haze">{client?.full_name ?? "Unknown"}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-4">
                    <div className="hidden sm:block">
                      <div className="mb-1 flex justify-between text-[10px] text-haze">
                        <span>{p.progress}%</span>
                      </div>
                      <div className="h-1 w-20 overflow-hidden rounded-pill bg-white/10">
                        <div className="h-full rounded-pill bg-electric" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <span className={`rounded-pill border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[p.status] ?? ""}`}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
