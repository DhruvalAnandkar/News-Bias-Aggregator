// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// -------------------------------
//  Explanation:
// - base: './'  → ensures assets load correctly on Vercel/Render
// - proxy → works locally for testing your backend on localhost
// - build.outDir → defines the dist folder for deployment
// -------------------------------

export default defineConfig({
  plugins: [react()],
  base: './', //  makes all assets load with relative paths (important for hosting)
  server: {
    proxy: {
      //  Local development proxy — ignored in production
      '/api': {
        target: 'http://localhost:3000', // your backend when running locally
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // where the static build files will go
  },
});
