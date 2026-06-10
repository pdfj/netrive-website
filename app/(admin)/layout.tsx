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
    <div className="flex min-h-screen flex-col bg-ink md:flex-row">
      {/* ── Mobile top bar ───────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-night/90 backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/admin" className="font-display text-lg font-bold text-white">
            Net<span className="gradient-text-accent">Rive</span>
            <span className="ml-2 rounded-pill bg-electric/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky">
              Admin
            </span>
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full text-haze transition hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
        {/* Mobile nav tabs */}
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2">
          {[
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/projects", icon: FolderOpen, label: "Projects" },
            { href: "/admin/clients", icon: Users, label: "Clients" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-2 rounded-pill px-4 py-1.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
            >
              <Icon className="h-3.5 w-3.5 text-sky" />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[0.06] bg-night md:flex">
        {/* Logo + badge */}
        <div className="flex h-16 items-center gap-3 px-5">
          <Link href="/" className="font-display text-xl font-bold text-white">
            Net<span className="gradient-text-accent">Rive</span>
          </Link>
          <span className="rounded-pill bg-electric/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky">
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
            <LayoutDashboard className="h-4 w-4 text-sky" />
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
      <main className="flex-1 p-4 sm:p-6 md:ml-64 md:p-8">{children}</main>
    </div>
  );
}
