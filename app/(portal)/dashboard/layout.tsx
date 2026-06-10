import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, FolderOpen, User, ExternalLink } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name, role")
    .eq("id", user.id)
    .single();

  // Redirect admins to the admin dashboard
  if (profile?.role === "admin") redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-ink md:flex-row">
      {/* Subtle background glow (desktop) */}
      <div
        className="pointer-events-none fixed inset-y-0 left-0 hidden w-80 md:block"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 0% 50%, rgba(0,150,255,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Mobile top bar ───────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-night/90 backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/" className="font-display text-lg font-bold text-white">
            Net<span className="gradient-text-accent">Rive</span>
            <span className="ml-2 rounded-pill bg-electric/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky">
              Client
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <span className="mr-1 max-w-[120px] truncate text-xs text-haze">
              {profile?.full_name?.split(" ")[0] ?? ""}
            </span>
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
        </div>
        {/* Mobile nav tabs */}
        <nav className="flex gap-1 px-3 pb-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-pill px-4 py-1.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
          >
            <FolderOpen className="h-3.5 w-3.5 text-sky" />
            My Projects
          </Link>
          <Link
            href="/dashboard/account"
            className="flex items-center gap-2 rounded-pill px-4 py-1.5 text-sm font-medium text-haze transition hover:bg-white/[0.06] hover:text-white"
          >
            <User className="h-3.5 w-3.5" />
            Account
          </Link>
        </nav>
      </header>

      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/[0.07] bg-night/80 backdrop-blur-xl md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="font-display text-xl font-bold text-white">
            Net<span className="gradient-text-accent">Rive</span>
          </Link>
          <span className="ml-2 rounded-pill bg-electric/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky">
            Client
          </span>
        </div>

        {/* User card */}
        <div className="mx-3 mb-4 rounded-input glass px-3 py-3">
          <p className="truncate text-sm font-medium text-white">
            {profile?.full_name ?? user.email}
          </p>
          {profile?.business_name && (
            <p className="truncate text-xs text-haze">{profile.business_name}</p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3">
          {[
            { href: "/dashboard", icon: FolderOpen, label: "My Projects" },
            { href: "/dashboard/account", icon: User, label: "Account" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition-all hover:bg-white/[0.06] hover:text-white"
            >
              <Icon className="h-4 w-4 text-sky/70" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="space-y-1 px-3 pb-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.06] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            netrive.com
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 md:ml-60 md:p-8">{children}</main>
    </div>
  );
}
