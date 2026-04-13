import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cached across page loads
          'vendor-react': ['react', 'react-dom'],
          // State management
          'vendor-state': ['zustand', 'immer'],
          // Icons (lucide-react is large)
          'vendor-icons': ['lucide-react'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
          // Generator engine (data tables + algorithms)
          'engine': [
            './src/generators/generateSettlement.js',
            './src/generators/generateSettlementPipeline.js',
            './src/generators/pipeline.js',
            './src/generators/prng.js',
            './src/generators/economicGenerator.js',
            './src/generators/npcGenerator.js',
            './src/generators/powerGenerator.js',
            './src/generators/narrativeGenerator.js',
            './src/generators/historyGenerator.js',
            './src/generators/cascadeGenerator.js',
            './src/generators/stressGenerator.js',
          ],
          // Data tables (institutional catalog, terrain, resources)
          'data': [
            './src/data/institutionalCatalog.js',
            './src/data/constants.js',
            './src/data/geographyData.js',
            './src/data/resourceData.js',
          ],
        },
      },
    },
  },
});
