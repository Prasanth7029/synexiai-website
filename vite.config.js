import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  assetsInclude: ['**/*.md'], // ✅ Required for raw .md import
});
