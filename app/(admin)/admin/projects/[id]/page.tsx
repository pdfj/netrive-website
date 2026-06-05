import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { AdminProjectControls } from "@/components/admin/AdminProjectControls";
import { AdminChatBox } from "@/components/admin/AdminChatBox";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = createAdminClient();

  const { data: project } = await db
    .from("projects")
    .select("*, profiles(id, full_name, business_name, phone, role)")
    .eq("id", params.id)
    .single();

  if (!project) notFound();

  const { data: updates } = await db
    .from("project_updates")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  const client = project.profiles as {
    id: string;
    full_name: string | null;
    business_name: string | null;
    phone: string | null;
  } | null;

  const date = new Date(project.created_at).toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div>
      <Link href="/admin/projects" className="mb-6 inline-flex items-center gap-1.5 text-sm text-haze transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">{project.title}</h1>
          <p className="mt-1 text-sm text-haze">Submitted {date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left col — client info + controls + updates */}
        <div className="space-y-6 lg:col-span-3">
          {/* Client details */}
          <div className="rounded-card glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Client</h2>
            <dl className="space-y-2 text-sm">
              {[
                ["Name", client?.full_name ?? "—"],
                ["Business", client?.business_name ?? "—"],
                ["Phone/WhatsApp", client?.phone ?? "—"],
                ["Package", project.package ?? "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <dt className="w-28 shrink-0 text-haze">{label}</dt>
                  <dd className="text-white">{value}</dd>
                </div>
              ))}
            </dl>
            {client?.phone && (
              <a
                href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-btn bg-green-600/20 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-600/30"
              >
                WhatsApp Client
              </a>
            )}
          </div>

          {/* Project brief */}
          {project.description && (
            <div className="rounded-card glass p-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-white">Project Brief</h2>
              <p className="text-sm leading-[1.8] text-haze">{project.description}</p>
            </div>
          )}

          {/* Admin controls */}
          <AdminProjectControls
            project={{ id: project.id, status: project.status, progress: project.progress, admin_notes: project.admin_notes ?? "" }}
            existingUpdates={updates ?? []}
          />
        </div>

        {/* Right col — chat */}
        <div className="lg:col-span-2">
          <div className="rounded-card glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Chat with Client</h2>
            <AdminChatBox projectId={project.id} adminUserId={user.id} clientId={client?.id ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
