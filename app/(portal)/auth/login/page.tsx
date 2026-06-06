"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  const supabase = createClient();

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMagicSent(true);
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-input border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition-colors";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-4">
      {/* Arch background glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(44,95,255,0.22) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      {/* Logo */}
      <Link href="/" className="relative mb-10 font-display text-2xl font-bold text-white">
        Net<span className="text-electric">Rive</span>
        <span className="ml-2 rounded-pill bg-electric/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric">
          Portal
        </span>
      </Link>

      <div className="relative w-full max-w-[420px] rounded-card glass-strong p-8">
        {magicSent ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-electric/15">
              <span className="text-2xl">📧</span>
            </div>
            <h2 className="font-display text-xl font-semibold text-white">Check your email</h2>
            <p className="mt-2 text-sm leading-[1.7] text-haze">
              We&apos;ve sent a sign-in link to{" "}
              <strong className="text-white">{email}</strong>. Click it to access your dashboard.
            </p>
            <button
              onClick={() => { setMagicSent(false); setError(null); }}
              className="mt-5 text-xs text-haze hover:text-white"
            >
              ← Try a different email
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-white">Sign in</h1>
            <p className="mt-1 text-sm text-haze">Access your project dashboard</p>

            <form
              onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm text-white/80">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={input}
                />
              </div>

              {mode === "password" && (
                <div>
                  <label className="mb-1.5 block text-sm text-white/80">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={input}
                  />
                </div>
              )}

              {error && (
                <p className="rounded-input border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-btn bg-electric py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "password" ? (
                  <>Sign In <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Send Magic Link <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <button
              onClick={() => {
                setMode(mode === "password" ? "magic" : "password");
                setError(null);
              }}
              className="mt-4 w-full text-center text-sm text-haze transition hover:text-white"
            >
              {mode === "password"
                ? "Forgot password? Sign in with email link instead →"
                : "← Sign in with password instead"}
            </button>
          </>
        )}
      </div>

      <p className="relative mt-6 text-xs text-white/30">
        Not a client yet?{" "}
        <Link href="/#contact" className="text-electric hover:underline">
          Start a project
        </Link>
      </p>
    </div>
  );
}
