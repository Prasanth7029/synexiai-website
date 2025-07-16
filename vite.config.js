import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? '/synexiai-website/' : '/',
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
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
