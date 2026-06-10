"use client";

import {
  Boxes,
  CalendarCheck,
  Code2,
  CreditCard,
  Megaphone,
  MessageCircle,
  Palette,
  PenTool,
  Search,
  ShoppingCart,
  Smartphone,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES_GRID } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Palette,
  Code2,
  ShoppingCart,
  Search,
  PenTool,
  Megaphone,
  CalendarCheck,
  CreditCard,
  Smartphone,
  Wrench,
  MessageCircle,
  Boxes,
};

export function ServicesGrid() {
  return (
    <section className="relative mx-auto max-w-content px-6 py-24 sm:py-32">
      <SectionHeading
        label="Capabilities"
        title="Everything Your Business Needs Online"
      />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES_GRID.map((service, i) => {
          const Icon = ICONS[service.icon];
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="group relative overflow-hidden rounded-card glass p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky/30 hover:shadow-glow-cyan"
            >
              {/* Hover corner glow */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-25"
                style={{ background: "linear-gradient(135deg, #00d4ff, #0066ff)" }}
                aria-hidden
              />
              <div className="gradient-bg relative flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-glow-cyan transition-transform duration-300 group-hover:scale-110">
                {Icon ? <Icon className="h-6 w-6" /> : null}
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.7] text-haze">{service.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
