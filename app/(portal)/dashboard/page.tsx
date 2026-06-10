import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Clock, CheckCircle2, Hammer, Eye, PlusCircle } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  submitted: { label: "Submitted", color: "text-sky bg-sky/10 border-sky/20", icon: <Clock className="h-3 w-3" /> },
  in_review: { label: "In Review", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: <Eye className="h-3 w-3" /> },
  in_progress: { label: "In Progress", color: "text-electric bg-electric/10 border-electric/20", icon: <Hammer className="h-3 w-3" /> },
  review: { label: "Your Review", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: <Eye className="h-3 w-3" /> },
  completed: { label: "Completed", color: "text-green-400 bg-green-400/10 border-green-400/20", icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", color: "text-haze bg-white/5 border-white/10", icon: null },
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  // Show password prompt for magic-link-only accounts (no password set yet)
  const needsPassword = !user.app_metadata?.password_hash && user.app_metadata?.provider !== "email";

  return (
    <div>
      {/* Set password banner — shown when user logged in via magic link only */}
      {needsPassword && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-card border border-yellow-400/20 bg-yellow-400/[0.06] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-yellow-300">Set your password</p>
            <p className="text-xs text-yellow-300/70">
              You logged in via email link. Set a password so you can sign in anytime.
            </p>
          </div>
          <Link
            href="/dashboard/account"
            className="shrink-0 rounded-btn border border-yellow-400/40 px-4 py-2 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-400/10"
          >
            Set Password →
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Hey, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-haze">
            {projects?.length
              ? `You have ${projects.length} project${projects.length !== 1 ? "s" : ""} with us.`
              : "Ready to start your first project?"}
          </p>
        </div>
        <Link
          href="/#contact"
          className="flex items-center gap-2 rounded-btn bg-electric px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg"
        >
          <PlusCircle className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Projects grid */}
      {!projects?.length ? (
        <div className="flex flex-col items-center justify-center rounded-card glass py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-electric/10">
            <Hammer className="h-7 w-7 text-electric" />
          </div>
          <h2 className="font-display text-xl font-semibold text-white">No projects yet</h2>
          <p className="mt-2 max-w-xs text-sm text-haze">
            Submit your project brief and our team will get back to you within a few hours.
          </p>
          <Link
            href="/#contact"
            className="mt-6 flex items-center gap-2 rounded-btn bg-electric px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg"
          >
            Start a Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.submitted;
            const date = new Date(project.created_at).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group flex flex-col rounded-card glass p-6 transition-all hover:-translate-y-1 hover:border-electric/30 hover:shadow-glow"
              >
                {/* Status badge */}
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-medium ${cfg.color}`}
                >
                  {cfg.icon}
                  {cfg.label}
                </span>

                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white">
                  {project.title}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {project.package && (
                    <p className="text-xs text-haze">{project.package}</p>
                  )}
                  <p className="font-mono text-xs font-semibold text-sky">
                    {project.reference ?? `#${project.id.slice(0, 8).toUpperCase()}`}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-haze">
                    <span>Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-pill bg-white/10">
                    <div
                      className="h-full rounded-pill bg-electric transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-haze">{date}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-electric opacity-0 transition group-hover:opacity-100">
                    View <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
