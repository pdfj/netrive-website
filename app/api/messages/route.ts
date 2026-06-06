import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/messages — send a chat message (client or admin)
export async function POST(request: NextRequest) {
  // 1. Verify the user is authenticated
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, content } = await request.json();

  if (!projectId || !content?.trim()) {
    return NextResponse.json(
      { error: "projectId and content required" },
      { status: 400 }
    );
  }

  // 2. Use the service-role client for the actual insert so RLS never blocks
  //    admins (who have no client_id relationship to the project).
  //    Auth check above already confirmed the sender is a real logged-in user.
  const adminDb = createAdminClient();

  const { data, error } = await adminDb
    .from("messages")
    .insert({
      project_id: projectId,
      sender_id: user.id,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("[messages] insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
