import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/messages — send a chat message
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, content } = await request.json();
  if (!projectId || !content?.trim()) {
    return NextResponse.json({ error: "projectId and content required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({ project_id: projectId, sender_id: user.id, content: content.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
