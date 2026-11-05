import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Baut eine einzelne IIFE-Datei + CSS direkt in die Theme-Assets.
export default defineConfig({
  plugins: [react()],
  publicDir: false, // public/ gehört zum Vercel-Server, nicht ins Theme
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: '../theme/assets',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: { entry: 'src/main.jsx', name: 'AzizamBerater', formats: ['iife'], fileName: () => 'azizam-berater.js' },
    rollupOptions: { output: { assetFileNames: 'azizam-berater.[ext]' } },
  },
});
