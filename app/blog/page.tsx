import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";
import { PageTransition } from "@/components/layout/PageTransition";
import { BlogCoverImage } from "@/components/ui/BlogCoverImage";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Web design tips, SEO strategies and digital growth insights for South African businesses from the NetRive team.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Strategy: "from-blue-500 to-indigo-500",
  Guides: "from-sky-500 to-blue-600",
  SEO: "from-emerald-500 to-teal-500",
  Performance: "from-violet-500 to-purple-600",
};

const GRADIENT_COVERS = [
  "from-[#0a1628] via-[#1a2f5a] to-[#2c5fff]",
  "from-[#050a1a] via-[#0f2048] to-[#1a3a8a]",
  "from-[#000000] via-[#0a1a3a] to-[#2c5fff]",
  "from-[#050a1a] via-[#152b5e] to-[#4b7bff]",
  "from-[#000000] via-[#0d1f45] to-[#1d3580]",
  "from-[#0a0a0a] via-[#112040] to-[#2c5fff]",
];

// File names match the prompts below — drop images into /public/images/blog/
const BLOG_IMAGES = [
  "/images/blog/why-website.jpg",
  "/images/blog/choose-package.jpg",
  "/images/blog/seo-south-africa.jpg",
  "/images/blog/fast-websites.jpg",
  "/images/blog/web-agency.jpg",
  "/images/blog/ecommerce-vs-landing.jpg",
];

export default function BlogPage() {
  return (
    <PageTransition>
      <main className="pt-20">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 0%, rgba(44,95,255,0.22) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="mx-auto max-w-content px-6 py-16 text-center">
            <span className="font-grotesk text-xs uppercase tracking-[0.18em] text-electric">
              Insights
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight gradient-text">
              The NetRive Blog
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-[1.7] text-haze">
              Web tips, SEO strategies and growth ideas for ambitious South African businesses.
            </p>
          </div>
        </div>

        {/* Grid */}
        <section className="mx-auto max-w-content px-6 pb-32">
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post, i) => {
              const color = CATEGORY_COLORS[post.category] ?? "from-blue-600 to-indigo-600";
              const cover = GRADIENT_COVERS[i % GRADIENT_COVERS.length];
              const imgSrc = BLOG_IMAGES[i];
              return (
                <article
                  key={post.title}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-card glass transition-all duration-300 hover:-translate-y-1.5 hover:border-electric/30 hover:shadow-glow"
                >
                  {/* Cover — real image with CSS gradient fallback */}
                  <div className="relative h-48 overflow-hidden">
                    <BlogCoverImage src={imgSrc ?? ""} alt={post.title} fallbackClass={cover} />
                    {/* Category badge always on top */}
                    <span
                      className={`absolute left-4 top-4 z-10 rounded-pill bg-gradient-to-r ${color} px-3 py-1 font-grotesk text-xs font-semibold uppercase tracking-wider text-white shadow-sm`}
                    >
                      {post.category}
                    </span>
                    {/* Subtle gradient scrim at the bottom of the image */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-grotesk text-xs text-haze">{post.date}</span>
                    <h2 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-[1.7] text-haze">{post.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sky transition-colors group-hover:text-electric">
                      Read More
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
