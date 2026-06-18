import { NextRequest, NextResponse } from "next/server";
import { currencyForCountry, FALLBACK_RATES } from "@/lib/currency";

export const runtime = "edge";

/**
 * Returns the visitor's country (from Vercel's geo header), the matching
 * currency, and the ZAR→currency rate (live from open.er-api.com, cached
 * 12h, with a hardcoded fallback). Used by CurrencyProvider to localise pricing.
 */
export async function GET(req: NextRequest) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "";
  const currency = currencyForCountry(country);
  let rate = FALLBACK_RATES[currency] ?? FALLBACK_RATES.USD;

  if (currency !== "ZAR") {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/ZAR", {
        next: { revalidate: 43200 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.rates?.[currency]) rate = data.rates[currency];
      }
    } catch {
      /* fall back to hardcoded rate */
    }
  } else {
    rate = 1;
  }

  return NextResponse.json(
    { country, currency, rate },
    { headers: { "cache-control": "public, max-age=0, s-maxage=3600" } },
  );
}
