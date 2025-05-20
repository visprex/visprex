import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: "bundle-report.html",
      gzipSize: true,
      brotliSize: true,
    }),
    Sitemap({
      hostname: 'https://visprex.com',
      generateRobotsTxt: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
