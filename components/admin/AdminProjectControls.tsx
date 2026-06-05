"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, PlusCircle } from "lucide-react";

const STATUSES = [
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In Review" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Client Review" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

type Update = { id: string; message: string; created_at: string };

export function AdminProjectControls({
  project,
  existingUpdates,
}: {
  project: { id: string; status: string; progress: number; admin_notes: string };
  existingUpdates: Update[];
}) {
  const [status, setStatus] = useState(project.status);
  const [progress, setProgress] = useState(project.progress);
  const [notes, setNotes] = useState(project.admin_notes);
  const [updateMsg, setUpdateMsg] = useState("");
  const [updates, setUpdates] = useState<Update[]>(existingUpdates);
  const [saving, setSaving] = useState(false);
  const [addingUpdate, setAddingUpdate] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveProject = async () => {
    setSaving(true);
    await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, progress, admin_notes: notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const postUpdate = async () => {
    if (!updateMsg.trim()) return;
    setAddingUpdate(true);
    const res = await fetch("/api/admin/updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, message: updateMsg }),
    });
    if (res.ok) {
      const newUpdate = await res.json();
      setUpdates([newUpdate, ...updates]);
      setUpdateMsg("");
    }
    setAddingUpdate(false);
  };

  const inputClass =
    "w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-card glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Project Controls</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-night">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 flex justify-between text-sm text-white/80">
              <span>Progress</span>
              <span className="font-semibold text-white">{progress}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-pill bg-white/10 accent-electric"
            />
            <div className="mt-1.5 h-2 overflow-hidden rounded-pill bg-white/10">
              <div
                className="h-full rounded-pill bg-electric transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/80">Internal Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes only visible to you…"
              className={inputClass}
            />
          </div>

          <button
            onClick={saveProject}
            disabled={saving}
            className="flex items-center gap-2 rounded-btn bg-electric px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <><CheckCircle2 className="h-4 w-4" /> Saved</>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Post update */}
      <div className="rounded-card glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Post Update to Client</h2>
        <p className="mb-3 text-xs text-haze">This appears in the client&apos;s project timeline.</p>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={updateMsg}
            onChange={(e) => setUpdateMsg(e.target.value)}
            placeholder="e.g. Design mockup is ready for your review…"
            className={`flex-1 resize-none ${inputClass}`}
          />
          <button
            onClick={postUpdate}
            disabled={!updateMsg.trim() || addingUpdate}
            className="flex items-center gap-1.5 rounded-btn bg-electric px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {addingUpdate ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          </button>
        </div>

        {/* Updates list */}
        {updates.length > 0 && (
          <div className="mt-5 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-haze">Previous updates</p>
            {updates.map((u) => (
              <div key={u.id} className="rounded-input border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className="text-sm text-white">{u.message}</p>
                <p className="mt-1 text-xs text-haze">
                  {new Date(u.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
