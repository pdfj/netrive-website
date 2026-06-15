"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Receipt, CheckCircle2, Clock, Download } from "lucide-react";

type InvoiceState = {
  invoice_amount: number | null;
  invoice_monthly: number | null;
  invoice_status: string;
};

export function InvoiceCard({
  projectId,
  reference,
  invoice,
}: {
  projectId: string;
  reference: string;
  invoice: InvoiceState;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = invoice.invoice_status ?? "none";
  if (status === "none" || !invoice.invoice_amount) return null;

  const markPaid = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/invoices/paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Something went wrong — try again.");
    } else {
      router.refresh();
    }
    setBusy(false);
  };

  return (
    <div className="glass-electric rounded-card p-5 sm:p-6">
      <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-white">
        <Receipt className="h-5 w-5 text-sky" /> Your invoice
      </h2>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-bold text-white">
            R{Number(invoice.invoice_amount).toLocaleString("en-ZA")}
          </p>
          {invoice.invoice_monthly ? (
            <p className="mt-0.5 text-sm text-haze">
              + R{Number(invoice.invoice_monthly).toLocaleString("en-ZA")}/month maintenance
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-haze">Payment reference</p>
          <p className="font-mono text-base font-bold gradient-text-accent">{reference}</p>
        </div>
      </div>

      <a
        href={`/api/invoices/${projectId}/pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-btn border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-sky/40 hover:bg-white/[0.05]"
      >
        <Download className="h-4 w-4" /> Download PDF invoice
      </a>

      {status === "issued" && (
        <>
          {/* Banking details — pay by immediate EFT */}
          <div className="mt-4 rounded-input border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky">
              Pay by EFT to
            </p>
            <dl className="space-y-1 text-sm">
              {[
                ["Bank", "GoTyme Bank"],
                ["Account name", "Bushirah Bongani Jamirah"],
                ["Account number", "51010767417"],
                ["Account type", "Current Account"],
                ["Branch code", "678910"],
                ["Reference", reference],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-haze">{k}</dt>
                  <dd className={k === "Reference" ? "font-mono font-bold text-sky" : "font-medium text-white"}>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs font-semibold text-sky">
              Please send an immediate / real-time payment, and use the reference above.
            </p>
          </div>

          <p className="mt-3 text-sm leading-[1.7] text-white/80">
            Once you&apos;ve paid, tap the button below — we&apos;ll confirm within{" "}
            <span className="font-semibold text-white">12–24 hours</span> and deliver your live site.
          </p>
          <button
            onClick={markPaid}
            disabled={busy}
            className="gradient-bg mt-4 flex items-center gap-2 rounded-btn px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            I&apos;ve paid this invoice
          </button>
        </>
      )}

      {status === "client_paid" && (
        <div className="mt-4 flex items-start gap-2 rounded-input border border-yellow-400/20 bg-yellow-400/[0.07] px-4 py-3 text-sm text-yellow-300">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Thanks! We&apos;re confirming your payment — please allow{" "}
            <span className="font-semibold">12–24 hours</span>. Your live site will be delivered
            right after confirmation.
          </span>
        </div>
      )}

      {status === "confirmed" && (
        <div className="mt-4 flex items-start gap-2 rounded-input border border-green-400/20 bg-green-400/[0.07] px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Payment confirmed 🎉 — your live website is being delivered. We&apos;ll be in touch with
            the final details.
          </span>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-input border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
