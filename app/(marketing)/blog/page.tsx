import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS, SITE } from "@/lib/constants";
import { PageTransition } from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Web design tips, SEO strategies and digital growth insights for South African businesses from the NetRive team.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Strategy: "from-[#00d4ff] to-[#0066ff]",
  Guides: "from-[#00e5c0] to-[#00a2ff]",
  SEO: "from-[#34d399] to-[#0d9488]",
  Performance: "from-[#818cf8] to-[#6d28d9]",
};

export default function BlogPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[380px]"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(0,150,255,0.2) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-content px-6 py-16 text-center">
            <span className="font-grotesk text-xs uppercase tracking-[0.18em] gradient-text-accent">
              Insights
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
              The NetRive Blog
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
              Web tips, SEO strategies and growth ideas for ambitious South African businesses.
            </p>

            {/* Category chips — the structure is live, posts drop in here */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {BLOG_CATEGORIES.map((cat) => (
                <span
                  key={cat}
                  className={`rounded-pill bg-gradient-to-r ${CATEGORY_COLORS[cat]} px-4 py-1.5 font-grotesk text-xs font-semibold uppercase tracking-wider text-white opacity-80`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Posts grid or empty state */}
        <section className="mx-auto max-w-content px-6 pb-32">
          {BLOG_POSTS.length === 0 ? (
            <div className="relative mx-auto max-w-xl overflow-hidden rounded-card glass-strong p-12 text-center">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-[80px]"
                style={{ background: "linear-gradient(135deg, #00d4ff, #0066ff)" }}
                aria-hidden
              />
              <span className="gradient-bg mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-glow-cyan">
                <PenLine className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold text-white">
                First posts are being written
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-[1.8] text-haze">
                We&apos;re crafting practical guides on SEO, web performance and growing your
                business online. In the meantime, talk to us directly — advice is free.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="gradient-bg inline-flex items-center gap-2 rounded-btn px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:scale-[1.03] hover:shadow-glow-lg"
                >
                  Start Your Project <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-btn px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-sky/30"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {BLOG_POSTS.map((post) => {
                const color = CATEGORY_COLORS[post.category] ?? "from-[#00d4ff] to-[#0066ff]";
                return (
                  <article
                    key={post.title}
                    className="group flex cursor-pointer flex-col overflow-hidden rounded-card glass transition-all duration-300 hover:-translate-y-1.5 hover:border-sky/30 hover:shadow-glow-cyan"
                  >
                    <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${color} opacity-80`}>
                      <span className="absolute left-4 top-4 z-10 rounded-pill bg-black/40 px-3 py-1 font-grotesk text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="font-grotesk text-xs text-haze">{post.date}</span>
                      <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                        {post.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-[1.7] text-haze">{post.excerpt}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sky transition-colors group-hover:text-white">
                        Read More
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </PageTransition>
  );
}
