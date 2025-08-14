// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";

  return defineConfig({
    base: "/", // always serve from /

    plugins: [react()],
    test: {
      environment: 'jsdom',
      coverage: { provider: 'v8', reporter: ['text', 'html'] },
      passWithNoTests: true
    },

    server: {
      // ONLY in dev: proxy any /.netlify/functions/* to your local lambdas
      proxy: isDev
        ? {
            "/.netlify/functions": {
              target: "http://localhost:9999",
              changeOrigin: true,
              rewrite: (path) =>
                path.replace(/^\/\.netlify\/functions/, "/.netlify/functions"),
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
