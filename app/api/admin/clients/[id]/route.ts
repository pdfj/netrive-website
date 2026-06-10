import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// DELETE /api/admin/clients/[id] — permanently remove a client account
// (cascades: profile -> projects -> messages/updates via FK on delete cascade)
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

  // Safety rails: never delete yourself or another admin
  if (params.id === user.id) {
    return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
  }
  const { data: target } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", params.id)
    .single();
  if (target?.role === "admin") {
    return NextResponse.json({ error: "Admin accounts can't be deleted here" }, { status: 400 });
  }

  const { error } = await adminDb.auth.admin.deleteUser(params.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
