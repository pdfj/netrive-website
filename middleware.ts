import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Geo redirect for the root ──────────────────────────────────────────────
  // Visitors landing on the bare domain are routed to the right market page:
  //   • South Africa (ZA)            → /sa  (Rand pricing, WhatsApp, existing site)
  //   • Any other detected country   → /us  (USD pricing, US home-services)
  //   • Country undetectable (rare)  → /sa  (SAFE default: keep the existing SA
  //                                          experience for current clients)
  // Only the EXACT root "/" is touched — /sa, /us, /api, /dashboard, /admin,
  // assets and every other route are left alone, so there is no redirect loop.
  // Handled before any Supabase work so the homepage stays fast.
  // Reversible: delete this block and remove "/" from the matcher below.
  if (pathname === "/") {
    const country = (
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      ""
    ).toUpperCase();
    const url = request.nextUrl.clone(); // preserves any query string / hash
    url.pathname = country && country !== "ZA" ? "/us" : "/sa";
    return NextResponse.redirect(url); // 307 temporary — a visitor's geo can change
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — essential for keeping auth state current
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /dashboard — redirect to login if not authenticated
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Protect /admin — redirect to login if not authenticated
  if (pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If logged-in user hits login page, send them to their dashboard
  if (pathname === "/auth/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/", // root only — geo redirect to /sa or /us
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/login",
  ],
};
