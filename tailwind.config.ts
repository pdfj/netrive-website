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
        ink: "#000000", // pure black background
        night: "#050a1a", // secondary background
        navy: "#0a1628",
        electric: "#2c5fff", // primary electric blue
        sky: "#93b4ff", // light blue
        haze: "#a0aaba", // secondary text
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
        glow: "0 0 40px rgba(44,95,255,0.35)",
        "glow-lg": "0 8px 60px rgba(44,95,255,0.45)",
        card: "0 8px 40px rgba(0,0,0,0.4)",
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        breathe: {
          "0%,100%": { filter: "brightness(1) blur(0px)", transform: "scale(1)" },
          "50%": { filter: "brightness(1.15) blur(2px)", transform: "scale(1.02)" },
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
      },
      animation: {
        breathe: "breathe 5s ease-in-out infinite",
        "float-up": "floatUp 14s linear infinite",
        "bounce-arrow": "bounceArrow 2s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
