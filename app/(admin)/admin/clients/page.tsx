import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminClientsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = createAdminClient();
  const { data: clients } = await db
    .from("profiles")
    .select("id, full_name, business_name, phone, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Clients</h1>
        <p className="mt-1 text-sm text-haze">{clients?.length ?? 0} total</p>
      </div>

      <div className="rounded-card glass overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Name</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Business</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze sm:table-cell">Phone</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {!clients?.length ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-haze">No clients yet.</td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-4 font-medium text-white">{c.full_name ?? "—"}</td>
                  <td className="px-5 py-4 text-haze">{c.business_name ?? "—"}</td>
                  <td className="hidden px-5 py-4 text-haze sm:table-cell">
                    {c.phone ? (
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        {c.phone}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-4 text-haze">
                    {new Date(c.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
