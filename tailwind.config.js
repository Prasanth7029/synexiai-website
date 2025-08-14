export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"], // uses our token
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
  plugins: [require("@tailwindcss/typography")],
};
