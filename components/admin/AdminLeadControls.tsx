"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Trash2 } from "lucide-react";
import { LEAD_STATUSES } from "@/lib/leads";

export function AdminLeadControls({
  leadId,
  initialStatus,
  initialNotes,
}: {
  leadId: string;
  initialStatus: string;
  initialNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save(patch: Record<string, unknown>) {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Update failed");
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function onStatusChange(next: string) {
    const prev = status;
    setStatus(next); // optimistic
    try {
      await save({ status: next });
    } catch {
      setStatus(prev);
    }
  }

  async function deleteLead() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Delete failed");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="space-y-5 rounded-card glass p-6">
      <div>
        <label className="mb-2.5 block text-sm font-medium text-white">Status</label>
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onStatusChange(s.value)}
              disabled={saving}
              className={`rounded-pill border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
                status === s.value
                  ? "border-sky/40 bg-sky/15 text-white"
                  : "border-white/10 text-haze hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="lead-notes" className="mb-2 block text-sm font-medium text-white">
          Private notes
        </label>
        <textarea
          id="lead-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notes only you can see…"
          className="w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-sky focus:outline-none"
        />
        <button
          type="button"
          onClick={() => save({ admin_notes: notes })}
          disabled={saving}
          className="mt-3 inline-flex items-center gap-2 rounded-btn bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.1] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : null}
          {saved ? "Saved" : "Save notes"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="border-t border-white/[0.06] pt-5">
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 rounded-btn px-3 py-2 text-sm font-medium text-red-400/90 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" /> Delete lead
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-haze">Delete this lead permanently?</span>
            <button
              type="button"
              onClick={deleteLead}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-btn bg-red-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
              className="rounded-btn px-3 py-2 text-sm font-medium text-haze transition hover:text-white disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
