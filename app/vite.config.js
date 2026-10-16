import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev` proxies the progress API to the local server (node server.js on :5178).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:5178' },
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
