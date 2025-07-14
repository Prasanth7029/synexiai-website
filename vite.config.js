import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 👈 This is correct for custom domain!
  plugins: [react()],
});
