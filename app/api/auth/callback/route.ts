import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // PKCE flow — Supabase sends a one-time `code` param
  const code = searchParams.get("code");
  // Some flows pass a `next` redirect hint
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful — redirect to dashboard (or `next` if specified)
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[callback] exchangeCodeForSession error:", error.message);
  }

  // Magic-link / OTP implicit flow puts tokens in the URL hash (#access_token=…)
  // The browser never sends hash fragments to the server, so we redirect to a
  // lightweight client-side page that reads the hash and calls getSession().
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (tokenHash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as "magiclink" | "recovery" | "signup" | "email" });

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }

    console.error("[callback] verifyOtp error:", error.message);
  }

  // Fallback — redirect to login with an error hint
  return NextResponse.redirect(`${origin}/auth/login?error=login_failed`);
}
