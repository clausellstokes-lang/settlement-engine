import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Optional bundle visualizer — opt in with `ANALYZE=1 npm run build`
// (writes dist/stats.html). Off by default so the normal build stays fast.
const analyze = process.env.ANALYZE === '1';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(ROOT, 'src');

// ── Engine-shared domain vocabulary (for the engine-core chunk) ──────────────
// generators and domain are mutually-dependent PEER engine layers: the
// generators import a slice of domain (trace, magicFilter, goodsCatalog,
// customContentSchema, the settlement schema/migrations, deterministicSort,
// clock, corruption, faction* …). Those same domain modules are ALSO reached
// eagerly by the store/domain code that runs on first paint. Left unassigned,
// Rollup co-locates them into the big lazy `engine` chunk (they're pulled by
// the generators there), and because first-paint code needs them the ENTRY is
// forced to statically import `engine` — dragging the whole 656 kB engine chunk
// into first paint through a back door that has nothing to do with generation.
//
// So we route that shared domain slice into the small first-paint `engine-core`
// chunk instead. This set is DERIVED from the import graph — the transitive
// closure, within src/domain, of every domain module any src/generators module
// imports — not hand-curated, so it can't silently drift and re-drag the engine
// into first paint. (None of these modules import a generator, so engine-core
// stays closed over {engine-core, kernel, data} and never points back at
// `engine`; the generators only ever reach the lazy worldPulse sim via dynamic
// import, never statically, so that heavy graph never enters this set.)
// @enforced-by tests/build/vendorPdfLazy.test.js (engine-absent-from-closure).
function computeEngineSharedDomain() {
  const walk = (d, out = []) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.jsx?$/.test(e)) out.push(p);
    }
    return out;
  };
  const resolveRel = (from, spec) => {
    if (!spec.startsWith('.')) return null;
    const base = resolve(dirname(from), spec);
    for (const c of [base, `${base}.js`, `${base}.jsx`, join(base, 'index.js'), join(base, 'index.jsx')])
      if (existsSync(c) && statSync(c).isFile()) return c;
    return null;
  };
  const importsOf = (file) => {
    const code = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    const specs = [];
    for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
    for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
    return specs.map((s) => resolveRel(file, s)).filter(Boolean);
  };
  const DOMAIN = `${join(SRC, 'domain')}/`;
  const seed = new Set();
  for (const g of walk(join(SRC, 'generators')))
    for (const dep of importsOf(g)) if (dep.startsWith(DOMAIN)) seed.add(dep);
  const seen = new Set(seed);
  const queue = [...seed];
  while (queue.length) {
    const f = queue.shift();
    for (const dep of importsOf(f)) if (dep.startsWith(DOMAIN) && !seen.has(dep)) { seen.add(dep); queue.push(dep); }
  }
  // Store as project-relative "/src/domain/…" fragments so the manualChunks id
  // check matches the same way the rest of this file does (id.includes).
  return new Set([...seen].map((p) => p.slice(ROOT.length)));
}
const ENGINE_SHARED_DOMAIN = computeEngineSharedDomain();
const isEngineSharedDomain = (id) => {
  for (const frag of ENGINE_SHARED_DOMAIN) if (id.includes(frag)) return true;
  return false;
};

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
    // NOTE on engine: `engine` is intentionally NOT in this filter, and no
    // longer needs to be — the engine chunk (~656 kB / 214 kB gz) is now
    // ABSENT from the entry's first-paint static closure. The eager store/
    // domain edges that used to reach it (neighbour backlink, coherence
    // draft-check, defense display, and the createPRNG seam) now resolve to
    // the small `kernel` + `engine-core` chunks instead (see manualChunks
    // below), so the big engine chunk is genuinely lazy — fetched only when
    // the user Generates (settlementSlice's loadEngine dynamic import) or a
    // lazy dossier tab pulls it. A preload filter would be moot: the entry
    // has no static edge to engine to hint in the first place.
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

          // ── Kernel (shared determinism primitives) ────────────────
          // src/kernel/ holds the seeded-PRNG seam (prng.js) + its global
          // context (rngContext.js): a tiny, dependency-free layer that
          // sits BELOW both generators and domain. It is legitimately in
          // the first-paint closure (domain/events/mutate reaches createPRNG
          // eagerly), so give it its own small chunk instead of letting
          // Rollup fold it into the big lazy engine chunk. Nothing here
          // imports a generator, so this never drags the engine.
          if (id.includes('/src/kernel/'))
            return 'kernel';

          // ── Lookups (catalog/tier accessors, no generator deps) ──
          // Synchronously loaded by selectors.js + InstitutionalGrid.
          // Lives semantically with the data tables it accesses, so we
          // route it into the data chunk to keep first-paint payload
          // grouped. Must match BEFORE the /src/generators/ rule below.
          if (id.includes('/src/generators/lookups.js'))
            return 'data';

          // ── Engine-core (the first-paint slice of the {generators,domain} ──
          // engine layers). Two kinds of module live here:
          //
          //  (a) The GENERATOR SPINE the entry reaches eagerly — the coherence
          //      draft-check (checkStructuralValidity), the neighbour backlink
          //      (crossSettlementConflicts, deterministic wrapper), the
          //      pipeline-rail labels (stepMetadata), and the influence-scoring
          //      modules those pull in (helpers, priorityHelpers,
          //      institutionProbability, neighbourGenerator). Small, pure, and
          //      needed on first paint.
          //  (b) The DOMAIN VOCABULARY the engine leans on (ENGINE_SHARED_DOMAIN,
          //      computed above) — the src/domain modules generators import,
          //      which first-paint store/domain code needs too.
          //
          // Under the blanket /src/generators/ → 'engine' rule below (and
          // Rollup's default co-location of the shared domain into that chunk),
          // each of those edges dragged the WHOLE 656 kB engine chunk into the
          // first-paint static closure. Splitting them into this small chunk
          // keeps their transitive imports within {engine-core, kernel, data} —
          // never a heavy generator (economy/power/npc/history/narrative/
          // faction/services/steps) — so 'engine-core' never pulls 'engine'.
          // The big engine chunk imports engine-core (it uses helpers et al.),
          // but that edge points the safe way: engine (lazy) → engine-core
          // (first-paint), never the reverse. This is what keeps the 656 kB
          // engine chunk OUT of first paint. Must match BEFORE /src/generators/
          // and BEFORE the /src/data/ rule (some domain here re-exports data).
          // @enforced-by tests/build/vendorPdfLazy.test.js (engine-absent-from-
          // closure contract + first-paint byte budget).
          if (
            id.includes('/src/generators/structuralValidator.js') ||
            id.includes('/src/generators/helpers.js') ||
            id.includes('/src/generators/priorityHelpers.js') ||
            id.includes('/src/generators/institutionProbability.js') ||
            id.includes('/src/generators/neighbourGenerator.js') ||
            id.includes('/src/generators/crossSettlementConflicts.js') ||
            id.includes('/src/generators/steps/stepMetadata.js') ||
            isEngineSharedDomain(id)
          )
            return 'engine-core';

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
          // STATUS: the engine chunk is now genuinely LAZY — it is ABSENT
          // from the entry's first-paint static closure (asserted by
          // tests/build/vendorPdfLazy.test.js). The eager store/domain edges
          // that used to anchor it here were cut: the createPRNG seam moved to
          // src/kernel/ (routed above), buildThreatAssessment moved to a pure
          // domain leaf (domain/display/threatAssessment.js), and the
          // remaining entry-reachable generator leaves (structuralValidator,
          // crossSettlementConflicts, stepMetadata + their influence-scoring
          // spine) were split into the small 'engine-core' chunk above. What
          // is left under this rule is the heavy generation-only code
          // (economy/power/npc/history/narrative/faction/services/steps),
          // fetched on first Generate via settlementSlice's loadEngine()
          // dynamic import (and by lazy dossier tabs). Keep it that way: never
          // add an EAGER store/domain/first-paint-UI static import of a module
          // that lands in this chunk — import from kernel/engine-core/data (or
          // extract a leaf) instead. @enforced-by vendorPdfLazy.test.js.
          if (id.includes('/src/generators/'))
            return 'engine';

          // ── Data tables (static, highly cacheable) ────────────────
          // narrativeData.js still calls into the engine's PRNG/helpers at
          // runtime, so it's not pure data — keeping it in the engine chunk
          // avoids the data ↔ engine circular-import warning Rollup would
          // otherwise emit.
          //
          // stressTypes.js USED to be routed here too (same reason), but its
          // executable, rng-capturing summary closures were split out into
          // stressTypesMeta.js — the file is now pure data with zero imports.
          // It MUST NOT stay in 'engine': helpers.js (engine-core) re-exports
          // STRESS_INSTITUTION_EFFECTS from it, so an 'engine' assignment would
          // make engine-core → engine and drag the 656 kB engine chunk back
          // into first paint. Let it fall through to the 'data' rule below.
          if (id.includes('/src/data/narrativeData.js'))
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
