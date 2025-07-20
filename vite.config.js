// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load env vars for this mode (so import.meta.env.VITE_* works)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: '/',                   // root of both local and prod
    assetsInclude: ['**/*.html'],// treat HTML as static asset
    plugins: [react()],

    server: {
      /*fs: { strict: false },
      // Only proxy in dev; ignored in prod builds*/
      proxy: mode === 'development'
        ? {
            '/.netlify/functions': {
              target: 'http://localhost:9999',
              changeOrigin: true,
            },
          }
        : {},
    },

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
  });
};
