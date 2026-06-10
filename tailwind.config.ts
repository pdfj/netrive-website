import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a", // premium black base
        night: "#0a0f1c", // deep blue-black secondary
        navy: "#0d1830",
        electric: "#0066ff", // primary blue
        sky: "#00d4ff", // cyan accent
        haze: "#9aa3b2", // secondary text
      },
      fontFamily: {
        display: ["Clash Display", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        grotesk: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        card: "20px",
        input: "14px",
        btn: "50px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0,150,255,0.35)",
        "glow-lg": "0 8px 60px rgba(0,170,255,0.45)",
        "glow-cyan": "0 0 30px rgba(0,212,255,0.3)",
        card: "0 8px 40px rgba(0,0,0,0.4)",
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        breathe: {
          "0%,100%": { filter: "brightness(1)", transform: "scale(1)" },
          "50%": { filter: "brightness(1.18)", transform: "scale(1.03)" },
        },
        floatUp: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": {
            transform: "translateY(-110vh) translateX(var(--drift, 0px))",
            opacity: "0",
          },
        },
        wordFloat: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        orbDrift: {
          "0%,100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.08)" },
          "66%": { transform: "translate(-30px, 20px) scale(0.95)" },
        },
        bounceArrow: {
          "0%,100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.5)" },
          "50%": { boxShadow: "0 0 0 14px rgba(37,211,102,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
        "float-up": "floatUp 14s linear infinite",
        "word-float": "wordFloat 4s ease-in-out infinite",
        "orb-drift": "orbDrift 18s ease-in-out infinite",
        "bounce-arrow": "bounceArrow 2s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
