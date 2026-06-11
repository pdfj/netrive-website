import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.netrive.com";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 as const };
  const adminDb = createAdminClient();
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Forbidden", status: 403 as const };
  return { adminDb };
}

// POST — create a preview link
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { adminDb } = auth;

  const body = await request.json();
  const title = (body.title ?? "").toString().trim();
  let targetUrl = (body.targetUrl ?? "").toString().trim();
  const projectId = body.projectId || null;
  const clientLabel = (body.clientLabel ?? "").toString().trim() || null;

  if (!targetUrl) {
    return NextResponse.json({ error: "A demo URL is required." }, { status: 400 });
  }
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = `https://${targetUrl}`;
  try {
    new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "That demo URL isn't valid." }, { status: 400 });
  }

  let slug = slugify(body.slug || title || "");
  if (!slug) slug = `preview-${Math.random().toString(36).slice(2, 8)}`;

  // Ensure unique slug
  const { data: existing } = await adminDb.from("previews").select("slug").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;

  const { data, error } = await adminDb
    .from("previews")
    .insert({ slug, title: title || slug, target_url: targetUrl, client_label: clientLabel, project_id: projectId })
    .select()
    .single();

  if (error) {
    const hint = error.message.includes("relation") || error.message.includes("does not exist")
      ? " — run supabase/migrations/004_previews.sql in the Supabase SQL editor first"
      : "";
    return NextResponse.json({ error: error.message + hint }, { status: 500 });
  }

  const previewUrl = `${SITE_URL}/preview/${slug}`;

  // If linked to a project, surface the branded link on the client's dashboard
  if (projectId) {
    await adminDb.from("projects").update({ preview_url: previewUrl }).eq("id", projectId);
  }

  return NextResponse.json({ ...data, previewUrl });
}
