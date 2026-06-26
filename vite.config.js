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
    // Chunk-size warning ceiling. The old 2000 kB value was so high it silenced
    // the genuinely-large eager *entry* chunk too — defeating the warning's job
    // of catching entry-chunk bloat. Lowered to 700 kB so the entry surfaces and
    // any new growth there is a prompt to investigate (more code-splitting?).
    // This is a WARN only (it does not fail the build — only the onwarn
    // MISSING_EXPORT/UNRESOLVED_IMPORT guard below throws), so the deliberate
    // large *lazy* chunks (vendor-pdf ~619 kB gz, engine ~187 kB gz) will emit a
    // benign warning rather than going unnoticed. Treat their warnings as
    // expected; treat a NEW warning (esp. the entry chunk) as a signal to look.
    chunkSizeWarningLimit: 700,
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
          // ── Vendor chunks (stable, cached across deploys) ─────────
          // scheduler is React's own internal dep (react-dom pulls it in and it
          // loads eagerly with React regardless), so grouping it with vendor-react
          // is purely tighter cache grouping — it changes no lazy boundary.
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler'))
            return 'vendor-react';
          if (id.includes('node_modules/zustand') || id.includes('node_modules/immer'))
            return 'vendor-state';
          if (id.includes('node_modules/lucide-react'))
            return 'vendor-icons';
          if (id.includes('node_modules/@supabase'))
            return 'vendor-supabase';
          // @react-pdf/renderer + jsPDF are huge and only needed when the
          // user clicks "Export PDF" — pull them out of the main bundle so
          // they download lazily on first export, not on first paint.
          // NOTE: their transitive deps (brotli/restructure/linebreak/
          // unicode-trie/pako, …) are NOT named here on purpose — Rollup
          // already keeps them on the lazy side with their importer, so the
          // lazy boundary holds. They are intentionally left to Rollup rather
          // than enumerated (the list drifts on every PDF-lib upgrade).
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
    // **/.claude/** keeps a bare `vitest run` from discovering DUPLICATE test
    // copies in concurrent-automation git worktrees under .claude/worktrees/.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', '.git/**', 'supabase/functions/**', '**/.claude/**'],
    // Route .jsx/.tsx files through Vite's web transform (which applies
    // the @vitejs/plugin-react JSX transform) instead of the default
    // SSR transform (which doesn't). Without this, importing any .jsx
    // file from a test crashes with "Failed to parse source — invalid
    // JS syntax."
    server: { deps: { inline: [/@testing-library\//] } },
    transformMode: { web: [/\.[jt]sx$/] },
    // Two-project split (vitest 4 test.projects, NOT the removed workspace
    // file) to tame flaky pglite-WASM contention.
    //
    // Each of the 28 tests/security pglite.test.js files spins up an
    // in-process WASM Postgres (PGlite). Run under full file-parallelism
    // they contend for memory/CPU and intermittently fail, and vitest's
    // forks pool can exit 0 even with those failures, so the flake quietly
    // muddies our single most-important gate signal.
    //
    // Fix: isolate the pglite suites into their own project that runs one
    // file at a time (fileParallelism:false), so the WASM instances are
    // created and torn down serially. Everything else stays in a second
    // project at vitest's default full parallelism so the fast unit suites
    // are unaffected.
    //
    // Both projects `extends: true` to inherit every root `test` setting
    // above (environment: node, the jsdom pragma opt-in, testTimeout,
    // transformMode web, server.deps inline, and the exclude globs incl.
    // the .claude worktrees). Coverage stays root-level (it is not a
    // per-project option). Projects only override include plus pool, so
    // there is no config drift between them and the root.
    projects: [
      {
        extends: true,
        test: {
          name: 'pglite',
          // Match the in-process WASM-Postgres security suites only.
          include: ['tests/security/**/*.pglite.test.js'],
          // One WASM Postgres at a time: with fileParallelism:false vitest 4
          // runs these files serially (it forces maxWorkers to 1), so no two
          // pglite instances are ever live at once, removing the memory/CPU
          // contention that produced the intermittent (exit-0) failures.
          // forks pool keeps each file in its own child process for clean
          // WASM teardown. (poolOptions was removed in vitest 4; the pool
          // knobs are top-level now, and fileParallelism alone serializes.)
          pool: 'forks',
          fileParallelism: false,
        },
      },
      {
        extends: true,
        test: {
          name: 'vendor-libs',
          // The three supply-chain build tests that touch the SHARED
          // public/map/libs/ tree. vendorManifestExactSet WRITES it (adds a probe
          // file, renames flatqueue.js away) to assert the validator's failure
          // paths, while ciGateHardening + vendorManifestNonEmpty READ every pinned
          // file's sha256/byteSize. At full parallelism a reader could observe the
          // tree mid-mutation (flatqueue.js momentarily gone) and flake. Pinning all
          // three into one fileParallelism:false project runs them serially — the
          // writer never overlaps a reader — and they are subtracted from `unit`
          // below so no other project reads the tree concurrently. No other test
          // under tests/ references public/map/libs/, so this fully closes the race.
          include: [
            'tests/build/ciGateHardening.test.js',
            'tests/build/vendorManifestExactSet.test.js',
            'tests/build/vendorManifestNonEmpty.test.js',
          ],
          fileParallelism: false,
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          // Everything EXCEPT the pglite + vendor-libs suites, at full parallelism
          // (vitest's default pool/concurrency, left untouched here).
          // Mirrors vitest's default include extension set so no suite is
          // silently dropped, then subtracts the isolated files via exclude.
          include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
          exclude: [
            'tests/security/**/*.pglite.test.js',
            'tests/build/ciGateHardening.test.js',
            'tests/build/vendorManifestExactSet.test.js',
            'tests/build/vendorManifestNonEmpty.test.js',
            'e2e/**',
            'node_modules/**',
            'dist/**',
            '.git/**',
            'supabase/functions/**',
            '**/.claude/**',
          ],
        },
      },
    ],
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
