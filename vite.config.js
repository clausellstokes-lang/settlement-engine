import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// Optional bundle visualizer — opt in with `ANALYZE=1 npm run build`
// (writes dist/stats.html). Off by default so the normal build stays fast.
const analyze = process.env.ANALYZE === '1';

export default defineConfig({
  // Vite/Vitest's Rolldown parser still needs an explicit JSX transform
  // path for .jsx test files. Without this, component tests that contain
  // inline JSX fail before the React plugin can transform them.
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
    // The only chunks above Vite's default 500 kB warning line are deliberate
    // lazy/manual chunks (engine and vendor-pdf). Keep the warning meaningful
    // for true runaway bundles without failing every healthy production build.
    chunkSizeWarningLimit: 2000,
    // modulePreload policy — strips the <link rel="modulepreload"> HINT
    // for vendor-pdf. IMPORTANT: this filter only removes a preload hint;
    // it does NOT remove a static import edge. It is therefore only
    // effective for a chunk that is NOT already in the entry's static
    // import closure — for a chunk the entry statically imports, the
    // browser fetches it regardless of any preload hint. The thing that
    // actually keeps vendor-pdf out of the first-paint static graph is the
    // helper pin in manualChunks (see the "Vite runtime helpers" rule
    // above); this filter is the belt-and-suspenders that also suppresses
    // the redundant preload hint once the static edge is gone.
    //
    //   - vendor-pdf (~616 kB gz): only fetched when the user exports a PDF.
    //     Trade-off: first PDF export takes an extra ~50-500ms (broadband /
    //     mobile) for the network fetch; subsequent exports hit the HTTP
    //     cache.
    //
    // NOTE on engine: `engine` is intentionally NOT in this filter. Unlike
    // vendor-pdf, the engine chunk (~214 kB gz) is *genuinely* in the
    // entry's first-paint static closure today — it's reached by several
    // eager store/domain edges (worldPulse advance, neighbour backlink,
    // coherence draft-check, defense display). Filtering its preload hint
    // would only hide that cost, not remove it: the browser would still
    // fetch it (just later, unhinted), which is strictly worse. Making
    // engine truly lazy requires converting those call-sites to dynamic
    // import() — tracked separately, out of scope here.
    modulePreload: {
      resolveDependencies(_filename, deps) {
        return deps.filter(d => !/\/vendor-pdf-[A-Za-z0-9_-]+\.js$/.test(d));
      },
    },
    rollupOptions: {
      // Fail the build on missing / unresolved named imports. Rollup only
      // *warns* on `import { X } from './y'` when './y' has no export named X
      // — it then emits `undefined` for X. That ships a silent bug to prod
      // (renders undefined) AND hard-crashes the dev ESM loader, yet sails
      // through the whole gate: ESLint doesn't resolve imports, no-unused-vars
      // is only a warning, and tsconfig.json type-checks src/domain only. The
      // production build is the one place that *sees* the bad import, so make
      // it authoritative: promote those warning classes to hard errors.
      onwarn(warning, warn) {
        if (
          warning.code === 'MISSING_EXPORT' ||
          warning.code === 'UNRESOLVED_IMPORT' ||
          /is not exported by/.test(warning.message || '')
        ) {
          throw new Error(`[build] ${warning.code || 'IMPORT_ERROR'}: ${warning.message}`);
        }
        warn(warning);
      },
      output: {
        manualChunks(id) {
          // ── Vite runtime helpers (MUST be first) ──────────────────
          // Vite injects a tiny (~20-line) __vitePreload helper whenever
          // the app uses dynamic import(). Rollup is free to co-locate
          // that helper into ANY chunk it emits — and it picks the
          // vendor-pdf chunk. The entry then statically imports vendor-pdf
          // (`import{_ as D}from"./vendor-pdf-*.js"`) *just to reach the
          // 20-line helper*, dragging the whole 1.85 MB / 616 kB gz PDF
          // stack into the first-paint static graph and defeating the
          // lazy boundary entirely.
          //
          // Pin the helper into vendor-state — a tiny chunk (~16 kB) that
          // is always eager on first paint anyway (zustand/immer). Now the
          // entry's static edge for the helper points at a chunk it already
          // loads, and vendor-pdf leaves the static closure. This is the
          // fix that actually keeps vendor-pdf lazy; the modulePreload
          // filter below only strips a preload *hint*, it can't remove a
          // real static import edge.
          if (id.includes('vite/preload-helper') || id.includes('vite/dynamic-import-helper'))
            return 'vendor-state';

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
          // loadEngine() for the generation path, and the catalog lookups
          // that were pure sync importers were extracted into lookups.js
          // (routed to data above).
          //
          // HONEST STATUS: despite the naming, the engine chunk is NOT lazy
          // today. The entry statically reaches it (~660 kB / 214 kB gz)
          // through several eager store/domain edges that run on first
          // paint, not behind loadEngine() — among them worldPulse advance,
          // neighbour backlink resolution, the coherence draft-check, and
          // the defense display path. So engine sits in the first-paint
          // static closure and the first-paint byte budget in
          // tests/build/vendorPdfLazy.test.js accounts for it.
          //
          // Making engine truly lazy requires converting those call-sites
          // to dynamic import() (and untangling the data ↔ engine circular
          // imports). Tracked separately — out of scope for the vendor-pdf
          // helper-pin fix that keeps THIS file's changes surgical.
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
    // Raise the per-test timeout above Vitest's 5000ms default. The
    // generation-heavy suites (e.g. tests/domain/distribution.test.js)
    // push 40–80 settlements through the FULL pipeline per test; in
    // isolation that runs in ~2s, but under 127-file parallel CPU
    // contention it crosses 5s and fails as a *timeout* (not a logic
    // failure — population output is deterministic). 20s gives ample
    // headroom on loaded/CI machines while still failing genuinely hung
    // tests in reasonable time.
    testTimeout: 20000,
    // Exclude Playwright E2E specs — they live in e2e/ and require a
    // running dev server (handled by playwright.config.js#webServer).
    // Without this exclusion, vitest tries to load them and fails on
    // the Playwright-only `test.describe` global.
    // supabase/functions/** are Deno edge functions; their *.test.ts use Deno
    // APIs and run under the dedicated `deno-tests` CI job, not vitest.
    // .claude/worktrees/** — agent/background-session worktrees carry their
    // own (older) copies of the whole test tree; sweeping them fails vitest
    // on stale sources that aren't part of this checkout.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', '.git/**', 'supabase/functions/**', '.claude/worktrees/**'],
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
      // ── Coverage floors for the money / security modules (a RATCHET, not an
      //    aspiration). These per-file thresholds fail `npm run test:coverage`
      //    (and the dedicated `test:coverage:floors`) if coverage on any of
      //    these files regresses more than ~5 points below where it is today, so
      //    a change that quietly deletes a spend/refund/save/checkout test can't
      //    ship green. Only these globs are floored; the rest of src/ is
      //    unthresholded so the warning rate stays low.
      //
      //    Floors were set to measured − ~5pts (min 0), from a full-suite
      //    `vitest run --coverage` on 2026-07-09. Measured % Stmts/Branch/Funcs/
      //    Lines are in the trailing comment on each entry. Re-measure and raise
      //    a floor whenever you meaningfully add coverage — never lower one to
      //    make a red build pass.
      thresholds: {
        'src/lib/checkoutReconcile.js': { statements: 83, branches: 78, functions: 61, lines: 83 }, // measured 88.09 / 83.33 / 66.66 / 88.88
        'src/lib/creditLedger.js':      { statements: 10, branches: 21, functions: 23, lines: 12 }, // measured 15.38 / 26.08 / 28.57 / 17.24 (known-thin: mostly async supabase paths)
        'src/lib/pendingDossier.js':    { statements: 78, branches: 77, functions: 85, lines: 86 }, // measured 83.18 / 82.00 / 90.00 / 91.30
        'src/lib/saves.js':             { statements: 68, branches: 68, functions: 75, lines: 79 }, // measured 73.36 / 73.97 / 80.95 / 84.55
        'src/lib/stripe.js':            { statements: 0,  branches: 0,  functions: 9,  lines: 0 },  // measured 3.57 / 0.00 / 14.28 / 4.16 (known-thin: redirect-only, exercised via UI smoke)
        'src/store/aiSlice.js':         { statements: 42, branches: 39, functions: 35, lines: 46 }, // measured 47.48 / 44.85 / 40.16 / 51.37
        'src/store/creditsSlice.js':    { statements: 11, branches: 0,  functions: 7,  lines: 11 }, // measured 16.12 / 0.00 / 12.50 / 16.00
      },
    },
  },
});
