import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Vendor chunks (stable, cached across deploys) ─────────
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/'))
            return 'vendor-react';
          if (id.includes('node_modules/zustand') || id.includes('node_modules/immer'))
            return 'vendor-state';
          if (id.includes('node_modules/lucide-react'))
            return 'vendor-icons';
          if (id.includes('node_modules/@supabase'))
            return 'vendor-supabase';
          if (id.includes('node_modules/html2canvas'))
            return 'vendor-html2canvas';

          // ── Generator engine (all generators together — they have ──
          // ── circular imports that prevent clean sub-chunking)      ──
          if (id.includes('/src/generators/'))
            return 'engine';

          // ── Data tables (static, highly cacheable) ────────────────
          if (id.includes('/src/data/'))
            return 'data';
        },
      },
    },
  },
});
