"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { formatMoney } from "@/lib/currency";

type CurrencyState = {
  code: string;
  rate: number;
  ready: boolean;
  isZar: boolean;
  format: (zar: number) => string;
};

const CurrencyContext = createContext<CurrencyState>({
  code: "ZAR",
  rate: 1,
  ready: false,
  isZar: true,
  format: (zar) => formatMoney(zar, "ZAR", 1),
});

/**
 * Detects the visitor's country (via /api/geo → Vercel geo header) and exposes
 * the matching currency + a formatter. Defaults to ZAR until the lookup
 * resolves, so SA visitors never see a flash and the layout stays stable.
 */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [{ code, rate }, setCcy] = useState({ code: "ZAR", rate: 1 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.currency && typeof d.rate === "number") {
          setCcy({ code: d.currency, rate: d.rate });
        }
      })
      .catch(() => {})
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  const value: CurrencyState = {
    code,
    rate,
    ready,
    isZar: code === "ZAR",
    format: (zar) => formatMoney(zar, code, rate),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => useContext(CurrencyContext);
