// tailwind.config.js
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";

/**
 * ✅ SynexiAI Tailwind Config — Production Ready
 * - Adds consistent container paddings for any laptop/monitor (13–17")
 * - Keeps screen breakpoints aligned to design scale
 * - Removes unneeded plugins (e.g. line-clamp now custom in index.css)
 */

export default {
  darkMode: "class", // support light/dark toggle
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        lg: "2rem",
        xl: "2.5rem",
      },
    },
    screens: {
      xs: "360px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        text: "var(--text-color)",
        "text-muted": "var(--color-muted)",
        bg: "var(--color-bg)",
        link: "var(--link)",
        "link-hover": "var(--link-hover)",
        border: "var(--color-border)",
        primary: "var(--brand-cyan)",
        secondary: "var(--brand-cyan-600)",
      },
    },
  },
  plugins: [typography, forms],
};
