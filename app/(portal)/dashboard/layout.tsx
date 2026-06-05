import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, FolderOpen, User, ExternalLink } from "lucide-react";

async function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.05] hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </form>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-white/[0.06] bg-night">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="font-display text-xl font-bold text-white">
            Net<span className="text-electric">Rive</span>
          </Link>
        </div>

        {/* User info */}
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
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-white/80 transition hover:bg-white/[0.05] hover:text-white"
          >
            <FolderOpen className="h-4 w-4 text-electric" />
            My Projects
          </Link>
          <Link
            href="/dashboard/account"
            className="flex items-center gap-3 rounded-input px-3 py-2.5 text-sm text-haze transition hover:bg-white/[0.05] hover:text-white"
          >
            <User className="h-4 w-4" />
            Account
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
            netrive.com
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
}
