import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { AdminProjectControls } from "@/components/admin/AdminProjectControls";
import { AdminInvoiceCard } from "@/components/admin/AdminInvoiceCard";
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

  const { data: aiLogs } = await db
    .from("ai_chat_logs")
    .select("id, role, content, created_at")
    .eq("project_id", project.id)
    .order("created_at", { ascending: true });

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

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{project.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-sm text-haze">Submitted {date}</p>
            <span className="glass-electric inline-flex items-center rounded-pill px-3 py-1 font-mono text-xs font-bold text-white">
              {project.reference ?? `#${project.id.slice(0, 8).toUpperCase()}`}
            </span>
          </div>
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

          {/* Invoice */}
          <AdminInvoiceCard
            projectId={project.id}
            reference={project.reference ?? `#${String(project.id).slice(0, 8).toUpperCase()}`}
            invoice={{
              invoice_amount: project.invoice_amount ?? null,
              invoice_monthly: project.invoice_monthly ?? null,
              invoice_installments: project.invoice_installments ?? null,
              invoice_status: project.invoice_status ?? "none",
              invoice_issued_at: project.invoice_issued_at ?? null,
              invoice_paid_claimed_at: project.invoice_paid_claimed_at ?? null,
              invoice_confirmed_at: project.invoice_confirmed_at ?? null,
            }}
          />

          {/* Admin controls */}
          <AdminProjectControls
            project={{
              id: project.id,
              status: project.status,
              progress: project.progress,
              admin_notes: project.admin_notes ?? "",
              preview_url: project.preview_url ?? "",
              quoted_price: project.quoted_price ?? "",
              monthly_maintenance: project.monthly_maintenance ?? "",
              customer_message: project.customer_message ?? "",
            }}
            existingUpdates={updates ?? []}
          />
        </div>

        {/* Right col — chat + AI logs */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-card glass p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">Chat with Client</h2>
            <AdminChatBox projectId={project.id} adminUserId={user.id} clientId={client?.id ?? ""} />
          </div>

          {/* AI assistant chat history */}
          <div className="rounded-card glass p-6">
            <h2 className="mb-1 font-display text-lg font-semibold text-white">AI chat history</h2>
            <p className="mb-4 text-xs text-haze">
              What the client asked the website assistant.
            </p>
            {!aiLogs?.length ? (
              <p className="text-sm text-haze">No AI conversations on this project yet.</p>
            ) : (
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {aiLogs.map((m) => {
                  if (m.role === "note") {
                    return (
                      <p
                        key={m.id}
                        className="rounded-input border border-yellow-400/20 bg-yellow-400/[0.07] px-3 py-2 text-center text-xs font-medium text-yellow-300"
                      >
                        {m.content}
                      </p>
                    );
                  }
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-[14px] px-3.5 py-2 text-sm leading-[1.6] ${
                          isUser
                            ? "rounded-br-sm bg-white/[0.08] text-white"
                            : "rounded-bl-sm bg-sky/[0.1] text-white/90"
                        }`}
                      >
                        {!isUser && (
                          <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-sky">
                            Assistant
                          </span>
                        )}
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
