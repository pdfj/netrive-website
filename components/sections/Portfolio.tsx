"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortfolioImage } from "@/components/ui/PortfolioImage";
import { PORTFOLIO } from "@/lib/constants";

const PROJECT_IMAGES = [
  "/images/portfolio/apex-digital.jpg",
  "/images/portfolio/coastal-brands.jpg",
  "/images/portfolio/meridian-properties.jpg",
  "/images/portfolio/summit-health.jpg",
];

const HUES = [220, 200, 245, 190];

export function Portfolio() {
  return (
    <section className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      <SectionHeading
        label="Selected Work"
        title="Work We're Proud Of"
        subtitle="Real websites. Real results. Real businesses growing online."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {PORTFOLIO.map((project, i) => (
          <motion.article
            key={project.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="group cursor-pointer rounded-[24px] glass p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
          >
            {/* Browser chrome */}
            <div className="overflow-hidden rounded-card border border-white/10 bg-night">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 h-4 flex-1 rounded-full bg-white/[0.04]" />
              </div>

              {/* Image with hover overlay */}
              <div className="relative">
                <PortfolioImage
                  src={PROJECT_IMAGES[i] ?? ""}
                  alt={`${project.name} website screenshot`}
                  hue={HUES[i % HUES.length]}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-btn bg-white px-5 py-2.5 text-sm font-semibold text-black">
                    View Project <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>

            <div className="px-3 pb-3 pt-5">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-pill border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-medium text-sky"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 font-display text-2xl font-medium text-white">{project.name}</h3>
              <p className="mt-1 text-sm text-haze">{project.type}</p>
              <p className="mt-3 text-sm leading-[1.7] text-white/80">{project.result}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
