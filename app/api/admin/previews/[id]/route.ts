import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// DELETE /api/admin/previews/[id] — remove a preview link
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminDb = createAdminClient();
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Clear the linked project's preview_url if it pointed at this preview
  const { data: preview } = await adminDb
    .from("previews")
    .select("slug, project_id")
    .eq("id", params.id)
    .single();

  if (preview?.project_id) {
    await adminDb
      .from("projects")
      .update({ preview_url: null })
      .eq("id", preview.project_id)
      .like("preview_url", `%/preview/${preview.slug}`);
  }

  const { error } = await adminDb.from("previews").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
