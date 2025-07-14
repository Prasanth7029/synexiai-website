import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/synexiai-website/', // 👈 use '/REPO-NAME/'
  plugins: [react()],
});
