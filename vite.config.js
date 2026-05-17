import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// Optional bundle visualizer — opt in with `ANALYZE=1 npm run build`
// (writes dist/stats.html). Off by default so the normal build stays fast.
const analyze = process.env.ANALYZE === '1';

export default defineConfig({
  // Vite 5+ uses oxc as its internal JS transformer. @vitejs/plugin-react 4.x
  // still configures the legacy `esbuild` options, which results in plain
  // .jsx files (those not specifically processed by react()'s babel
  // transform) reaching the import-analysis stage with raw JSX intact.
  // Setting oxc.jsx tells the transformer to handle JSX in any .jsx file.
  oxc: {
    jsx: 'automatic',
  },
  plugins: [
    // Explicit include — keeps the babel transform applied to .jsx/.tsx
    // for HMR + fast refresh; oxc handles the JSX-to-JS lowering for
    // any caller (notably vitest test files that import .jsx components).
    react({ include: /\.(mjs|jsx|tsx)$/ }),
    analyze && visualizer({
      filename: 'dist/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ].filter(Boolean),
  build: {
    outDir: 'dist',
    // Tighter modulePreload policy. By default Vite preloads every chunk
    // reachable from the entry (including lazy-import targets), so even
    // chunks we deliberately gated behind user action (vendor-pdf, engine)
    // get downloaded on first paint — defeating the lazy boundary.
    //
    // This filter keeps preload for genuinely-sync deps and drops the
    // chunks that only fire on user interaction:
    //   - vendor-pdf (~619 kB gz): only when the user exports a PDF
    //   - engine     (~187 kB gz): only when the user generates / regenerates
    //
    // Trade-off: first PDF export and first generation each take an extra
    // ~50-500ms (broadband / mobile) for the network fetch. Subsequent
    // calls hit the HTTP cache. Net: shave ~800 kB gz off first paint
    // for the common case where the user is browsing the world map or
    // existing campaigns and never touches Generate / Export.
    modulePreload: {
      resolveDependencies(_filename, deps) {
        return deps.filter(d => !/\/(vendor-pdf|engine)-[A-Za-z0-9_-]+\.js$/.test(d));
      },
    },
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
          // @react-pdf/renderer + jsPDF are huge and only needed when the
          // user clicks "Export PDF" — pull them out of the main bundle so
          // they download lazily on first export, not on first paint.
          if (id.includes('node_modules/@react-pdf') || id.includes('node_modules/jspdf') || id.includes('node_modules/pdfkit') || id.includes('node_modules/fontkit'))
            return 'vendor-pdf';

          // ── Lookups (catalog/tier accessors, no generator deps) ──
          // Synchronously loaded by selectors.js + InstitutionalGrid.
          // Lives semantically with the data tables it accesses, so we
          // route it into the data chunk to keep first-paint payload
          // grouped. Must match BEFORE the /src/generators/ rule below.
          if (id.includes('/src/generators/lookups.js'))
            return 'data';

          // ── customRegistry + dependencyEngine ──────────────────────
          // These are reached from BOTH the entry (via store/index →
          // dependencyEngine) AND from lazy generator code. Without
          // this explicit assignment, Rollup auto-merges them into the
          // engine chunk to avoid duplication, which pulls the entire
          // engine chunk into the entry's static graph. Routing them
          // to the data chunk (where they semantically belong as data
          // wiring) preserves the engine chunk's lazy boundary.
          if (id.includes('/src/lib/customRegistry.js') ||
              id.includes('/src/lib/dependencyEngine.js'))
            return 'data';

          // ── Generator engine (all generators together — they have ──
          // ── circular imports that prevent clean sub-chunking)      ──
          //
          // settlementSlice dynamically imports the generators via
          // loadEngine(), and the catalog lookups that were the only
          // pure sync importers were extracted into lookups.js (routed
          // to data above). Engine module code therefore no longer
          // executes at startup for catalog reads.
          //
          // Residual: store/index → lib/dependencyEngine → customRegistry
          // → data/stressTypes → generators/rngContext keeps a small
          // static engine reference in the entry chunk. Removing it
          // requires extracting STRESS_INSTITUTION_EFFECTS out of
          // stressTypes.js (which also depends on rngContext at runtime).
          // Deferred — small payoff vs. the data ↔ engine circular-import
          // restructure needed to do it cleanly.
          if (id.includes('/src/generators/'))
            return 'engine';

          // ── Data tables (static, highly cacheable) ────────────────
          // narrativeData.js and stressTypes.js call into the engine's
          // PRNG/helpers at runtime, so they're not pure data — putting
          // them in the engine chunk avoids the data ↔ engine circular
          // import warning Rollup would otherwise emit.
          if (id.includes('/src/data/narrativeData.js') ||
              id.includes('/src/data/stressTypes.js'))
            return 'engine';
          if (id.includes('/src/data/'))
            return 'data';
        },
      },
    },
  },
  // Vitest configuration — coverage is opt-in via `npm run test:coverage`.
  // Not part of the default check gate because thresholds are easy to set
  // wrong and the warning rate would be high.
  test: {
    // Default env is node (faster, no DOM machinery). Files that need a
    // DOM opt in with /** @vitest-environment jsdom */ at the top.
    // Component smoke tests in tests/ui/ use that pragma.
    environment: 'node',
    // Route .jsx/.tsx files through Vite's web transform (which applies
    // the @vitejs/plugin-react JSX transform) instead of the default
    // SSR transform (which doesn't). Without this, importing any .jsx
    // file from a test crashes with "Failed to parse source — invalid
    // JS syntax."
    server: { deps: { inline: [/@testing-library\//] } },
    transformMode: { web: [/\.[jt]sx$/] },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/**/*.spec.{js,jsx}',
        'src/data/**',           // pure data tables, no logic to cover
        'src/main.jsx',          // bootstrap entry
        'src/pdf/**',            // PDF renderer — covered by visual QA
        'src/components/**/*.jsx', // UI; tested via integration/E2E if added later
      ],
    },
  },
});
