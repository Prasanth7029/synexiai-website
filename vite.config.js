// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";

  return defineConfig({
    base: "/",

    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    test: {
      environment: "jsdom",
      coverage: { provider: "v8", reporter: ["text", "html"] },
      passWithNoTests: true,
    },

    server: {
      proxy: isDev
        ? {
            "/.netlify/functions": {
              target: "http://localhost:9999",
              changeOrigin: true,
              // (rewrite not strictly needed here, but harmless)
            },
          }
        : {},
    },

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
  });
};
