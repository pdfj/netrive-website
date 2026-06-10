"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteClientButton({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/clients/${clientId}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Delete failed");
      setBusy(false);
      setConfirming(false);
    } else {
      router.refresh();
    }
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          onClick={remove}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-pill bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete {clientName}?
        </button>
        {!busy && (
          <button
            onClick={() => setConfirming(false)}
            className="text-xs text-haze hover:text-white"
          >
            Cancel
          </button>
        )}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${clientName}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-haze transition hover:bg-red-500/15 hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
