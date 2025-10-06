// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ makes asset paths relative (important for Render)
  server: {
    proxy: {
      // ✅ Works locally, ignored in production
      '/api': {
        target: 'https://news-bias-aggregator.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // default, just ensuring consistency
  },
});
