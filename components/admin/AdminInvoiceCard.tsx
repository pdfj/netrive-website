"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Receipt, CheckCircle2, Clock, Send, Download } from "lucide-react";

type InvoiceState = {
  invoice_amount: number | null;
  invoice_monthly: number | null;
  invoice_status: string;
  invoice_issued_at: string | null;
  invoice_paid_claimed_at: string | null;
  invoice_confirmed_at: string | null;
};

const inputClass =
  "w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky";

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminInvoiceCard({
  projectId,
  reference,
  invoice,
}: {
  projectId: string;
  reference: string;
  invoice: InvoiceState;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(invoice.invoice_amount?.toString() ?? "");
  const [monthly, setMonthly] = useState(invoice.invoice_monthly?.toString() ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = invoice.invoice_status ?? "none";

  const call = async (body: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, ...body }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong");
    } else {
      router.refresh();
    }
    setBusy(false);
  };

  return (
    <div className="rounded-card glass p-6">
      <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-white">
        <Receipt className="h-5 w-5 text-sky" /> Invoice
      </h2>
      <p className="mb-4 font-mono text-xs text-sky/80">{reference}</p>

      {/* Status banner */}
      {status === "issued" && (
        <div className="mb-4 flex items-center gap-2 rounded-input border border-yellow-400/20 bg-yellow-400/[0.07] px-4 py-3 text-sm text-yellow-300">
          <Clock className="h-4 w-4 shrink-0" />
          Issued {fmtDate(invoice.invoice_issued_at)} — waiting for client payment
        </div>
      )}
      {status === "client_paid" && (
        <div className="mb-4 rounded-input border border-sky/25 bg-sky/[0.08] px-4 py-3 text-sm text-sky">
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Client says they paid ({fmtDate(invoice.invoice_paid_claimed_at)})
          </p>
          <p className="mt-1 text-xs text-sky/70">
            Check your bank for reference {reference}, then confirm below.
          </p>
        </div>
      )}
      {status === "confirmed" && (
        <div className="mb-4 flex items-center gap-2 rounded-input border border-green-400/20 bg-green-400/[0.07] px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Paid &amp; confirmed {fmtDate(invoice.invoice_confirmed_at)} 🎉
        </div>
      )}

      {/* Amount summary when issued */}
      {status !== "none" && invoice.invoice_amount && (
        <div className="mb-4">
          <p className="text-sm text-haze">
            Amount:{" "}
            <span className="font-display text-lg font-bold text-white">
              R{Number(invoice.invoice_amount).toLocaleString("en-ZA")}
            </span>
            {invoice.invoice_monthly ? (
              <span> + R{Number(invoice.invoice_monthly).toLocaleString("en-ZA")}/mo maintenance</span>
            ) : null}
          </p>
          <a
            href={`/api/invoices/${projectId}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-sky transition hover:text-white"
          >
            <Download className="h-4 w-4" /> View / download the PDF invoice
          </a>
        </div>
      )}

      {/* Issue / re-issue form */}
      {(status === "none" || status === "issued") && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Amount (R)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="3500"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Monthly (R, optional)</label>
              <input
                type="number"
                min="0"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="250"
                className={inputClass}
              />
            </div>
          </div>
          <button
            onClick={() => call({ action: "issue", amount: Number(amount), monthly: monthly ? Number(monthly) : null })}
            disabled={busy || !amount}
            className="gradient-bg flex items-center gap-2 rounded-btn px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {status === "issued" ? "Re-issue invoice" : "Issue invoice"}
          </button>
          <p className="text-xs text-haze">
            Emails the client an invoice with reference {reference} and shows it on their dashboard.
          </p>
        </div>
      )}

      {/* Confirm payment */}
      {status === "client_paid" && (
        <button
          onClick={() => call({ action: "confirm" })}
          disabled={busy}
          className="flex items-center gap-2 rounded-btn bg-green-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Confirm payment received
        </button>
      )}

      {error && (
        <p className="mt-3 rounded-input border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
