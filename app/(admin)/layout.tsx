import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { LayoutDashboard, FolderOpen, Users, ExternalLink, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Verify admin role
  const adminDb = createAdminClient();
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/[0.06] bg-night">
        {/* Logo + badge */}
        <div className="flex h-16 items-center gap-3 px-5">
          <Link href="/" className="font-display text-xl font-bold text-white">
            Net<span className="text-electric">Rive</span>
          </Link>
          <span className="rounded-pill bg-electric/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-electric">
            Admin
          </span>
        </div>

        {/* Admin info */}
        <div className="mx-3 mb-5 rounded-input glass px-3 py-2.5">
          <p className="text-xs text-haze">Signed in as</p>
          <p className="truncate text-sm font-medium text-white">{profile.full_name ?? user.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.05] hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4 text-electric" />
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.05] hover:text-white"
          >
            <FolderOpen className="h-4 w-4" />
            All Projects
          </Link>
          <Link
            href="/admin/clients"
            className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.05] hover:text-white"
          >
            <Users className="h-4 w-4" />
            Clients
          </Link>
        </nav>

        {/* Footer */}
        <div className="space-y-1 px-3 pb-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.05] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.05] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
