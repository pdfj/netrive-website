import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Preview · NetRive",
  robots: { index: false, follow: false },
};

// Repeating diagonal "NetRive Preview" watermark as an inline SVG data URI.
const WATERMARK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='220'%3E%3Ctext x='10' y='130' transform='rotate(-28 10 130)' fill='rgba(120,130,150,0.16)' font-size='24' font-family='Arial, sans-serif' font-weight='bold'%3ENetRive Preview%3C/text%3E%3C/svg%3E\")";

export default async function PreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const db = createAdminClient();
  const { data: preview } = await db
    .from("previews")
    .select("slug, title, target_url, client_label, enabled")
    .eq("slug", params.slug)
    .maybeSingle();

  // Not found / disabled — branded message
  if (!preview || !preview.enabled) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
        <Link href="/" className="mb-6 font-display text-2xl font-bold text-white">
          Net<span className="gradient-text-accent">Rive</span>
        </Link>
        <h1 className="font-display text-2xl font-semibold text-white">Preview unavailable</h1>
        <p className="mt-2 max-w-sm text-sm leading-[1.7] text-haze">
          This preview link is no longer active. If you were expecting a demo, message us and
          we&apos;ll send a fresh link.
        </p>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-bg mt-6 rounded-btn px-6 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          Chat with NetRive
        </a>
      </div>
    );
  }

  const approveMsg = encodeURIComponent(
    `Hi NetRive! I've viewed my preview "${preview.title ?? preview.slug}" and I'd like to approve it and get my invoice.`
  );
  const approveUrl = `${SITE.whatsapp}?text=${approveMsg}`;

  return (
    <div className="fixed inset-0 flex flex-col bg-ink">
      {/* Top bar */}
      <header className="z-20 flex h-12 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-night px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-display text-base font-bold text-white">
            Net<span className="gradient-text-accent">Rive</span>
          </span>
          <span className="rounded-pill bg-electric/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky">
            Preview
          </span>
          <span className="hidden truncate text-xs text-haze sm:block">
            {preview.client_label ? `${preview.client_label} · ` : ""}
            {preview.title ?? preview.slug} — demo, not the final live site
          </span>
        </div>
        <a
          href={approveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-bg shrink-0 rounded-btn px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:opacity-90"
        >
          Approve &amp; get invoice
        </a>
      </header>

      {/* Demo + watermark */}
      <div className="relative flex-1">
        <iframe
          src={preview.target_url}
          title={preview.title ?? "Preview"}
          className="absolute inset-0 h-full w-full border-0"
          // Allow the demo to run fully; it's a site you built and control
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
        />
        {/* Watermark — sits over the demo but never blocks interaction */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: WATERMARK, backgroundRepeat: "repeat" }}
          aria-hidden
        />
      </div>
    </div>
  );
}
