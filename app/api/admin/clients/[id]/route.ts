import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// DELETE /api/admin/clients/[id] — permanently remove a client account.
// We delete dependent rows in dependency order with the service role, then
// remove the auth user. This works regardless of whether the FK cascade
// migration (003) has been run, and surfaces a clear error if anything fails.
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

  const clientId = params.id;

  // 1. Find this client's projects
  const { data: projects } = await adminDb
    .from("projects")
    .select("id")
    .eq("client_id", clientId);
  const projectIds = (projects ?? []).map((p) => p.id);

  // 2. Delete messages + updates tied to those projects, plus anything this
  //    user authored directly (defensive against missing cascades).
  if (projectIds.length) {
    await adminDb.from("messages").delete().in("project_id", projectIds);
    await adminDb.from("project_updates").delete().in("project_id", projectIds);
  }
  await adminDb.from("messages").delete().eq("sender_id", clientId);
  await adminDb.from("project_updates").delete().eq("created_by", clientId);

  // 3. Delete projects, then the profile row
  const { error: projErr } = await adminDb.from("projects").delete().eq("client_id", clientId);
  if (projErr) {
    return NextResponse.json({ error: `Couldn't remove projects: ${projErr.message}` }, { status: 500 });
  }
  const { error: profErr } = await adminDb.from("profiles").delete().eq("id", clientId);
  if (profErr) {
    return NextResponse.json({ error: `Couldn't remove profile: ${profErr.message}` }, { status: 500 });
  }

  // 4. Finally remove the auth user (cascade now has nothing to block on)
  const { error } = await adminDb.auth.admin.deleteUser(clientId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
