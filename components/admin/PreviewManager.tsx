"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Copy, ExternalLink, Trash2, Check } from "lucide-react";

type Preview = {
  id: string;
  slug: string;
  title: string | null;
  target_url: string;
  client_label: string | null;
  project_id: string | null;
  created_at: string;
};

type ProjectOpt = { id: string; title: string; reference: string | null };

const inputClass =
  "w-full rounded-input border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky";

export function PreviewManager({
  initial,
  projects,
  siteUrl,
}: {
  initial: Preview[];
  projects: ProjectOpt[];
  siteUrl: string;
}) {
  const router = useRouter();
  const [list, setList] = useState<Preview[]>(initial);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [projectId, setProjectId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const linkFor = (s: string) => `${siteUrl}/preview/${s}`;

  const create = async () => {
    if (!targetUrl.trim()) {
      setError("Paste the demo URL you deployed (e.g. from Vercel).");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/previews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, targetUrl, projectId: projectId || null }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Couldn't create the preview.");
    } else {
      setList([json, ...list]);
      setTitle("");
      setSlug("");
      setTargetUrl("");
      setProjectId("");
      router.refresh();
    }
    setBusy(false);
  };

  const remove = async (id: string) => {
    setList(list.filter((p) => p.id !== id));
    await fetch(`/api/admin/previews/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const copy = async (s: string) => {
    try {
      await navigator.clipboard.writeText(linkFor(s));
      setCopied(s);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-8">
      {/* Create */}
      <div className="rounded-card glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">New preview link</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-white/80">Demo URL (the site you deployed)</label>
            <input
              className={inputClass}
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://seoulglow-demo.vercel.app"
            />
            <p className="mt-1.5 text-xs text-haze">
              Build the demo in Claude Code, deploy it free (e.g. to Vercel), then paste its URL here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Title</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Seoul Glow"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-white/80">Custom slug (optional)</label>
              <input
                className={inputClass}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="seoulglow"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/80">Attach to a client project (optional)</label>
            <select className={inputClass} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">— Not linked (just a shareable link) —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-night">
                  {p.title} {p.reference ? `(${p.reference})` : ""}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-haze">
              If linked, the preview shows up on that client&apos;s dashboard as &quot;View your preview&quot;.
            </p>
          </div>

          {error && (
            <p className="rounded-input border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={create}
            disabled={busy}
            className="gradient-bg flex items-center gap-2 rounded-btn px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create preview link
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-card glass p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Your preview links</h2>
        {list.length === 0 ? (
          <p className="text-sm text-haze">No previews yet. Create one above.</p>
        ) : (
          <div className="space-y-3">
            {list.map((p) => (
              <div
                key={p.id}
                className="rounded-input border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-white">{p.title || p.slug}</p>
                    <a
                      href={linkFor(p.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all font-mono text-xs text-sky hover:underline"
                    >
                      {linkFor(p.slug)}
                    </a>
                    <p className="mt-1 truncate text-xs text-haze">→ {p.target_url}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => copy(p.slug)}
                      title="Copy link"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-haze transition hover:bg-white/[0.06] hover:text-white"
                    >
                      {copied === p.slug ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <a
                      href={linkFor(p.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open preview"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-haze transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => remove(p.id)}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-haze transition hover:bg-red-500/15 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
