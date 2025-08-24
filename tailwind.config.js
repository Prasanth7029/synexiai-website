// tailwind.config.js
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
// ❌ remove this → import lineClamp from "@tailwindcss/line-clamp";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "360px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        bg: "var(--bg)",
        link: "var(--link)",
        "link-hover": "var(--link-hover)",
      },
    },
  },
  plugins: [typography, forms], // ✅ only keep needed ones
};
