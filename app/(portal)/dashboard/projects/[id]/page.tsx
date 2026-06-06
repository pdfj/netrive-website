import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle2, Hammer } from "lucide-react";
import { ChatBox } from "@/components/portal/ChatBox";

const STATUS_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "in_review", label: "In Review" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "Your Review" },
  { key: "completed", label: "Completed" },
];

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .eq("client_id", user.id)
    .single();

  if (!project) notFound();

  const { data: updates } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  const currentStep = STATUS_STEPS.findIndex((s) => s.key === project.status);

  const date = new Date(project.created_at).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Back */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-haze transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      {/* Project header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">{project.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-haze">
          {project.package && <span className="text-white/70">{project.package}</span>}
          <span>Submitted {date}</span>
        </div>
      </div>

      {/* Preview & quote from NetRive */}
      {(project.preview_url || project.customer_message || project.quoted_price) && (
        <div className="mb-6 rounded-card border border-electric/20 bg-electric/[0.06] p-6">
          <h2 className="mb-3 font-display text-lg font-semibold text-white">Your Preview &amp; Quote</h2>
          {project.customer_message && (
            <p className="mb-4 text-sm leading-[1.7] text-white/80">{project.customer_message}</p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            {project.preview_url && (
              <a
                href={project.preview_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-btn bg-electric px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                View your preview
              </a>
            )}
            {project.quoted_price && (
              <span className="text-sm text-haze">
                Quote: <span className="font-semibold text-white">R{project.quoted_price}</span>
                {project.monthly_maintenance && (
                  <> · Maintenance: <span className="font-semibold text-white">R{project.monthly_maintenance}/mo</span></>
                )}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left col — progress + updates */}
        <div className="space-y-6 lg:col-span-3">
          {/* Progress */}
          <div className="rounded-card glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Progress</h2>

            {/* Step tracker */}
            <div className="mb-5 flex items-center gap-0">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={step.key} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      {i > 0 && (
                        <div className={`h-0.5 flex-1 transition-all ${done ? "bg-electric" : "bg-white/10"}`} />
                      )}
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                          done
                            ? "border-electric bg-electric text-white"
                            : "border-white/20 text-white/30"
                        } ${active ? "shadow-glow" : ""}`}
                      >
                        {i < currentStep ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 transition-all ${i < currentStep ? "bg-electric" : "bg-white/10"}`} />
                      )}
                    </div>
                    <span className={`mt-2 text-center text-[10px] ${done ? "text-white" : "text-haze"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Percentage bar */}
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-xs text-haze">
                <span>Overall completion</span>
                <span className="font-semibold text-white">{project.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-pill bg-white/10">
                <div
                  className="h-full rounded-pill bg-electric transition-all duration-700"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Project brief */}
          {project.description && (
            <div className="rounded-card glass p-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-white">Your Brief</h2>
              <p className="text-sm leading-[1.8] text-haze">{project.description}</p>
            </div>
          )}

          {/* Updates timeline */}
          <div className="rounded-card glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Updates</h2>
            {!updates?.length ? (
              <p className="text-sm text-haze">
                No updates yet — our team will post progress notes here as work progresses.
              </p>
            ) : (
              <ol className="space-y-4">
                {updates.map((u) => (
                  <li key={u.id} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-electric/15">
                        <Hammer className="h-3.5 w-3.5 text-electric" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm leading-[1.7] text-white">{u.message}</p>
                      <p className="mt-1 text-xs text-haze">
                        {new Date(u.created_at).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Right col — chat */}
        <div className="lg:col-span-2">
          <div className="rounded-card glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Chat with us</h2>
            <ChatBox projectId={project.id} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
