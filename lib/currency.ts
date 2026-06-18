// ─────────────────────────────────────────────────────────────
// Geo currency — map a visitor's country to a currency, convert from
// ZAR (the base prices live in ZAR), and format. Live rates are fetched
// in /api/geo with these as the fallback.
// ─────────────────────────────────────────────────────────────

const EUROZONE = [
  "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PT", "SK", "SI", "ES", "HR",
];

const COUNTRY_CCY: Record<string, string> = {
  ZA: "ZAR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD", NZ: "NZD",
  AE: "AED", SA: "SAR", QA: "QAR", IN: "INR", NG: "NGN", KE: "KES",
  GH: "GHS", NA: "NAD", BW: "BWP", CH: "CHF", JP: "JPY", SG: "SGD",
  HK: "HKD", CN: "CNY", BR: "BRL", MX: "MXN", NO: "NOK", SE: "SEK",
  DK: "DKK", PL: "PLN",
};
for (const c of EUROZONE) COUNTRY_CCY[c] = "EUR";

/** Country (ISO-2) → currency. No country (SA base / unknown) → ZAR; other → USD. */
export function currencyForCountry(country?: string | null): string {
  if (!country) return "ZAR";
  return COUNTRY_CCY[country.toUpperCase()] ?? "USD";
}

/** Approximate units of each currency per 1 ZAR — fallback when live rates fail. */
export const FALLBACK_RATES: Record<string, number> = {
  ZAR: 1, USD: 0.054, EUR: 0.05, GBP: 0.043, AUD: 0.083, CAD: 0.075,
  NZD: 0.092, AED: 0.198, SAR: 0.2, QAR: 0.197, INR: 4.6, NGN: 86,
  KES: 7, GHS: 0.8, NAD: 1, BWP: 0.74, CHF: 0.048, JPY: 8.3, SGD: 0.073,
  HKD: 0.42, CNY: 0.39, BRL: 0.3, MXN: 1.0, NOK: 0.58, SEK: 0.57,
  DKK: 0.37, PLN: 0.22,
};

/**
 * Format a ZAR amount in the visitor's currency. ZAR keeps the familiar
 * "R1 500"; everything else uses the local symbol with no decimals.
 */
export function formatMoney(zar: number, code: string, rate: number): string {
  if (code === "ZAR" || !rate) {
    return "R" + Math.round(zar).toLocaleString("en-ZA");
  }
  const local = Math.round(zar * rate);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(local);
  } catch {
    return `${code} ${local.toLocaleString("en-US")}`;
  }
}
