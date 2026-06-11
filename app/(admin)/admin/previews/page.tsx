import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PreviewManager } from "@/components/admin/PreviewManager";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";

export default async function AdminPreviewsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const db = createAdminClient();

  const [{ data: previews }, { data: projects }] = await Promise.all([
    db.from("previews").select("*").order("created_at", { ascending: false }),
    db.from("projects").select("id, title, reference").order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Previews</h1>
        <p className="mt-1 text-sm text-haze">
          Turn a deployed demo into a branded, watermarked link under netrive.com.
        </p>
      </div>

      <PreviewManager
        initial={previews ?? []}
        projects={projects ?? []}
        siteUrl={SITE_URL}
      />
    </div>
  );
}
