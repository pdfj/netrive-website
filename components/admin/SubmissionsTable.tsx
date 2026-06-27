"use client";

import { useState } from "react";
import Link from "next/link";

export type SubmissionRow = {
  id: string;
  market: "US" | "SA";
  primary: string;
  reference: string | null;
  client: string;
  type: string;
  status: string;
  statusLabel: string;
  statusColor: string;
  date: string;
  href: string;
};

const MARKET_BADGE: Record<string, string> = {
  US: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  SA: "border-green-400/30 bg-green-400/10 text-green-300",
};

export function SubmissionsTable({ rows }: { rows: SubmissionRow[] }) {
  const [filter, setFilter] = useState<"all" | "US" | "SA">("all");

  const counts = {
    all: rows.length,
    US: rows.filter((r) => r.market === "US").length,
    SA: rows.filter((r) => r.market === "SA").length,
  };
  const filtered = filter === "all" ? rows : rows.filter((r) => r.market === filter);

  const tabs: { key: "all" | "US" | "SA"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "US", label: "🇺🇸 US" },
    { key: "SA", label: "🇿🇦 SA" },
  ];

  return (
    <div>
      <div className="mb-4 inline-flex items-center gap-1 rounded-pill border border-white/10 bg-white/[0.03] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className={`rounded-pill px-4 py-1.5 text-sm font-medium transition ${
              filter === t.key ? "bg-sky/20 text-white" : "text-haze hover:text-white"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs text-haze">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-card glass">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Submission</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Market</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze sm:table-cell">Client</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze md:table-cell">Type</th>
              <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze">Status</th>
              <th className="hidden px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-haze lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {!filtered.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-haze">
                  No submissions{filter !== "all" ? ` for ${filter}` : ""} yet.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={`${r.market}-${r.id}`} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={r.href} className="font-medium text-white hover:text-sky">
                      {r.primary}
                    </Link>
                    {r.reference && (
                      <span className="mt-0.5 block font-mono text-xs text-sky/80">{r.reference}</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-pill border px-2.5 py-1 text-xs font-bold ${MARKET_BADGE[r.market] ?? ""}`}>
                      {r.market}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-haze sm:table-cell">{r.client}</td>
                  <td className="hidden px-5 py-4 text-haze md:table-cell">{r.type}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-pill border px-2.5 py-1 text-xs font-medium ${r.statusColor}`}>
                      {r.statusLabel}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-haze lg:table-cell">{r.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
