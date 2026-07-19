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
// OVER-INCLUSION TRIM (FP-G7, 2026-07-15): the derived closure above routes into
// engine-core every domain module ANY generator imports — conservatively, even
// modules NO first-paint code reaches. These leaves are generator-only /
// lazy-only consumers (verified: no eager entry-closure edge reads them), so
// they can ride the lazy `engine` chunk with the generators instead of sitting
// eager in engine-core. Excised here so BOTH the chunk routing and the
// eager-graph classifier (line ~143) agree.
// FP-G11 (2026-07-17): formatNumber.js — the FP-G7 note DEFERRED this one ("kept
// until measured worth it") over a shared-chunk-churn worry. MEASURED at this fold:
// NO first-paint module reaches it (every one of its ~19 importers is generator-/
// worldPulse-/display-lazy — verified: zero store/eager-domain importer), so it
// rode eager engine-core for nothing. Excising it moves its single main-graph copy
// to the lazy `engine` chunk (where its worldPulse consumers already live): closure
// 1,035,024 -> 1,034,683 (-341 B; engine-core 80,961 -> 80,617). The churn worry does
// NOT materialize — the only OTHER chunks carrying it are the two web-worker bundles
// (advanceInterval.worker, pdfRender.worker), independent entry bundles that always
// carried their own copy and are untouched here. Pure deterministic formatter ⇒
// chunk placement is behaviorally invisible (goldens byte-identical).
// @guarded-by tests/build/vendorPdfLazy.test.js: engine-absent-from-closure +
// the first-paint byte budget (re-entry of any of these reds one or the other).
// FP-G8 (2026-07-16): settlement.schema.js — a pure schema/constant LEAF (zero
// static imports) reached at runtime ONLY by normalizeSettlement.js +
// settlementMigrations.js, BOTH of which are pinned to the LAZY
// `settlement-normalize` chunk (manualChunks below). NO first-paint module
// statically imports it — every other mention across src is a JSDoc
// `@param {import('./settlement.schema.js').T}` type-only annotation (stripped
// by the eager-graph parser) or the `settlement.schemaVersion` property access.
// ESD force-routed its ~68 kB into eager engine-core for zero benefit (the FP-1
// normalize-pin note below even documented it "stays in engine-core"). Excised
// here AND pinned to settlement-normalize below, so it rides the lazy chunk with
// its two importers and both the routing and the eager-graph classifier agree.
// DE-EAGER LANE (2026-07-19): customContentSchema.js — the custom-content
// validation/taxonomy module. ESD derived it into eager engine-core because the
// generator tier-gate steps import passesTierGate — but its EAGER consumers
// (customContentSlice's validateDeity/validateTradition chokepoint,
// settlementSlice's eligibleCustomContent in the async generate action) now
// reach it ONLY by dynamic import, and every static importer is lazy
// (generators/engine, compendium UI, contentPacks, gallery TIER_ORDER,
// contentVocabulary). Excised here AND pinned to the lazy 'custom-schema'
// chunk below so routing and the eager-graph classifier agree (the FP-G7/FP-G8
// excision convention). Its TRADITION_*_KEYS mirror of the corpus stays
// deliberately duplicated — now to keep the corpus tables out of the small
// validation chunk — with the customContentTraditions drift guard unchanged.
for (const frag of [
  '/src/domain/customCategories.js',
  '/src/domain/magicFilter.js',
  '/src/domain/resolveTerrain.js',
  '/src/domain/region/foldTradeCategories.js',
  '/src/domain/settlement.schema.js',
  '/src/domain/formatNumber.js',
  '/src/domain/customContentSchema.js',
]) ENGINE_SHARED_DOMAIN.delete(frag);
const isEngineSharedDomain = (id) => {
  for (const frag of ENGINE_SHARED_DOMAIN) if (id.includes(frag)) return true;
  return false;
};

// ── The eager (first-paint) module graph ─────────────────────────────────────
// The set of source modules that land in an EAGER chunk — i.e. a chunk inside
// the entry's transitive static closure. This is the single derivation the
// first-paint splits below (lazy-only lucide icons, lazy-only data tables)
// classify against: a module/icon/table is "eager" iff something in THIS set
// statically reaches it. CHUNK-level, not entry-module-level: the seeds are
// every module the manualChunks rules route into an eager chunk —
//   • the src/main.jsx static graph            (the entry chunk itself),
//   • the engine-core generator spine + ENGINE_SHARED_DOMAIN (engine-core),
//   • src/kernel/**                            (kernel),
//   • lookups.js                               (routed to 'data') —
//     (customRegistry + dependencyEngine were seeds until the de-eager lane,
//      2026-07-19 — they now ride the lazy 'custom-registry' chunk) —
// because a static edge from ANY of those chunks into a "lazy" chunk would
// drag that chunk straight back into the first-paint closure (the W4h lesson:
// follow the chunk graph, not intuition). Dynamic import() is a lazy boundary
// and is deliberately NOT followed. Misclassifying a module as eager is
// harmless (its bytes just stay in first paint); a missed eager edge re-enters
// the closure and fails the first-paint byte budget loudly.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
function computeEagerModuleGraph() {
  const walk = (d, out = []) => {
    if (!existsSync(d)) return out;
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
  // Static edges only — `[^'"()]` keeps dynamic `import(...)` out of the
  // `from`-clause match, so a dynamic import stays a lazy boundary.
  const importsOf = (file) => {
    const code = readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    const specs = [];
    for (const m of code.matchAll(/(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g)) specs.push(m[1]);
    for (const m of code.matchAll(/(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g)) specs.push(m[1]);
    return specs.map((s) => resolveRel(file, s)).filter(Boolean);
  };
  const seeds = [
    join(SRC, 'main.jsx'),
    // engine-core generator spine (the explicit pins in manualChunks below).
    // FP-G8 (2026-07-16): only these TWO are genuinely eager-reached now — the
    // neighbour backlink (via eager neighbourBackLink.js) and the pipeline-rail
    // labels (via eager settlementSlice.js). The former five (structuralValidator/
    // helpers/priorityHelpers/institutionProbability/neighbourGenerator) lost their
    // last eager consumer when the coherence draft-check went lazy, so they are no
    // longer seeded here — they ride the lazy `engine` chunk (and spatialData, only
    // structuralValidator reaches it, drops to data-lazy). Both routing and this
    // classifier agree, per the FP-G7 excision convention.
    join(SRC, 'generators/crossSettlementConflicts.js'),
    join(SRC, 'generators/steps/stepMetadata.js'),
    // libs routed into the eager 'data' chunk below
    // DE-EAGER LANE (2026-07-19): customRegistry.js + dependencyEngine.js are
    // NO LONGER seeded here — the store now reaches them only through the
    // lib/customContentSource.js seam + dynamic imports, so they ride the lazy
    // 'custom-registry' chunk (pinned below). Re-seeding either would silently
    // re-drag ~41 KB (registry code + stressTypesMeta) into first paint; the
    // customRegistryLazy build test + the byte budget both fail loudly if an
    // eager static edge into them ever returns.
    join(SRC, 'generators/lookups.js'),
    // kernel chunk
    ...walk(join(SRC, 'kernel')),
    // engine-core's shared-domain members (fragments → absolute paths)
    ...[...ENGINE_SHARED_DOMAIN].map((frag) => join(ROOT, frag.slice(1))),
  ].filter((p) => existsSync(p));
  const seen = new Set(seeds);
  const queue = [...seeds];
  while (queue.length) {
    const f = queue.shift();
    for (const dep of importsOf(f)) if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
  }
  return seen;
}
const EAGER_MODULES = computeEagerModuleGraph();

// ── Map-only lucide icons (split them out of the first-paint vendor-icons) ────
// lucide-react ships one module per icon (dist/esm/icons/<kebab>.js), but a
// single `vendor-icons` chunk collects EVERY icon the app uses anywhere. Because
// first-paint UI imports SOME icons, that whole chunk lands in the first-paint
// static closure — so every icon only the (lazy) World Map surfaces use was
// still paying first-paint bytes, coupling the byte budget to map work that has
// nothing to do with first paint.
//
// This DERIVES, from the source graph, the set of icons imported ONLY by
// src/components/map/** and nowhere else, and routes just those into a separate
// 'vendor-icons-map' chunk that loads with the map. An icon shared with any
// non-map surface stays in vendor-icons (first paint), so nothing a first-paint
// view needs can be moved out — the split is provably safe and can only shrink
// first paint. Not hand-curated (mirrors the ENGINE_SHARED_DOMAIN derivation),
// so a new map-only icon auto-moves and a newly-shared one auto-returns.
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget) +
//              tests/build/iconChunkSplit.test.js (the split's shape).
// An icon is EAGER iff a module in the eager first-paint graph
// (EAGER_MODULES above) imports it — those stay in vendor-icons. Everything
// else is lazy-only: map-exclusive icons keep their own `vendor-icons-map`
// chunk (the existing pin); the rest share `vendor-icons-lazy`. This replaced
// the old hand-listed LAZY_ICON_DIRS (FP-1): the dir list only ever covered
// five surfaces, so every icon used by an unlisted lazy surface (settlement
// detail, dossier tabs, wizard, auth, …) still paid first-paint bytes. The
// graph derivation is exact and self-maintaining: an icon a new eager module
// imports auto-returns to vendor-icons; one that loses its last eager
// importer auto-moves out. A missed eager edge is caught loudly — the eager
// chunk would statically pull vendor-icons-lazy back into the closure and the
// first-paint byte budget fails.
const MAP_DIR = join(SRC, 'components', 'map');
function computeLucideIconSplit() {
  const walk = (d, out = []) => {
    if (!existsSync(d)) return out;
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(jsx?|tsx?)$/.test(e)) out.push(p);
    }
    return out;
  };
  const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-z])([0-9])/g, '$1-$2').toLowerCase();
  const iconsOf = (file) => {
    const code = readFileSync(file, 'utf8');
    const set = new Set();
    for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/g)) {
      for (let part of m[1].split(',')) {
        const name = part.trim().split(/\s+as\s+/)[0].trim(); // `X as Y` → X
        if (/^[A-Z][A-Za-z0-9]*$/.test(name)) set.add(name);
      }
    }
    return set;
  };
  const inMap = (f) => f.startsWith(MAP_DIR);
  const mapIcons = new Set();
  const nonMapIcons = new Set();
  const eagerIcons = new Set(); // imported by a module in the eager first-paint graph
  for (const f of walk(SRC)) {
    const icons = iconsOf(f);
    const map = inMap(f);
    for (const i of icons) {
      (map ? mapIcons : nonMapIcons).add(i);
      if (EAGER_MODULES.has(f)) eagerIcons.add(i);
    }
  }
  const mapOnly = new Set();  // map-exclusive → vendor-icons-map (existing pin)
  const lazyOnly = new Set(); // other lazy-only (incl. map+other-lazy) → vendor-icons-lazy
  for (const i of new Set([...mapIcons, ...nonMapIcons])) {
    if (eagerIcons.has(i)) continue;                 // a first-paint file needs it → stays
    if (mapIcons.has(i) && !nonMapIcons.has(i)) mapOnly.add(kebab(i));
    else if (mapIcons.has(i) || nonMapIcons.has(i)) lazyOnly.add(kebab(i));
  }
  return { mapOnly, lazyOnly };
}
const { mapOnly: MAP_ONLY_ICONS, lazyOnly: LAZY_ONLY_ICONS } = computeLucideIconSplit();
// Match `/lucide-react/dist/esm/icons/<kebab>.js` (never the barrel) → its chunk.
const lucideIconChunk = (id) => {
  const m = id.match(/lucide-react\/dist\/esm\/icons\/([a-z0-9-]+)\.[cm]?js/);
  if (!m) return 'vendor-icons';
  if (MAP_ONLY_ICONS.has(m[1])) return 'vendor-icons-map';
  if (LAZY_ONLY_ICONS.has(m[1])) return 'vendor-icons-lazy';
  return 'vendor-icons';
};

// ── Eager data tables (split the lazy-only tables out of first paint) ─────────
// A single `data` chunk used to collect EVERY src/data table. Because first-
// paint code (store/domain/lookups) statically reaches SOME of them, that whole
// chunk rode the first-paint static closure — so every generator-only table
// (namingData, historyData, …, ~140 kB source) paid first-paint bytes for
// generation work that is fetched lazily anyway.
//
// A table is EAGER iff a module in the eager first-paint graph (EAGER_MODULES
// above — chunk-level, so engine-core / kernel / data-routed members count as
// eager importers too) statically reaches it; only those ride the first-paint
// 'data' chunk. Every other table rides 'data-lazy' (fetched with whichever
// lazy chunk first imports it). Not hand-curated (same derivation family as
// ENGINE_SHARED_DOMAIN / the icon split): a table a new eager module imports
// auto-returns to 'data'; one that loses its last eager importer auto-moves
// out. Misclassifying eager is harmless (stays in 'data'); a missed eager
// edge only re-enters the closure, which the first-paint byte budget fails
// loudly. @enforced-by tests/build/vendorPdfLazy.test.js.
const EAGER_DATA = new Set(
  [...EAGER_MODULES]
    .filter((p) => p.startsWith(`${join(SRC, 'data')}/`))
    .map((p) => p.slice(ROOT.length)),
);
const isEagerData = (id) => {
  for (const frag of EAGER_DATA) if (id.includes(frag)) return true;
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
        // vendor-pdf AND the engine chunk (ported master fix): the heavy
        // generators should download on first GENERATE, not first paint — the
        // hint strip is graph-neutral (no closure-budget effect), it only stops
        // the browser pre-fetching the chunk alongside the entry.
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
            // Icons used ONLY by lazy route surfaces (map → vendor-icons-map;
            // settlements/account/admin/gallery/compendium → vendor-icons-lazy)
            // stop paying first-paint bytes; everything a first-paint or shared
            // surface uses stays in vendor-icons. See computeLucideIconSplit.
            return lucideIconChunk(id);
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

          // ── Settlement normalize/migration closure (its own LAZY chunk) ──
          // normalizeSettlement + its settlementMigrations chain (~30 kB) are the
          // canonical-shape adapter run on load / save / import and as
          // assembleSettlement's final generation step. Because a GENERATOR
          // (steps/assembleSettlement.js) statically imports normalizeSettlement,
          // computeEngineSharedDomain() auto-seeds BOTH modules into
          // ENGINE_SHARED_DOMAIN — which would route them into the EAGER
          // engine-core chunk (isEngineSharedDomain below) and drag the whole
          // migration closure into first paint, even though no anon-landing path
          // ever needs it. It also made the first-paint budget NON-DETERMINISTIC:
          // depending on Rollup's grouping the closure counted ~+200 B (stub) or
          // ~+30 kB (whole closure). Pin the two modules into their own small
          // lazy chunk instead. This is safe by construction:
          //   • The eager save/import modules (lib/saves.js, lib/accountImport.js)
          //     DYNAMIC-import normalizeSettlement (memoized loaders), so no eager
          //     chunk statically edges into this one.
          //   • assembleSettlement reaches it from the lazy `engine` chunk
          //     (engine → settlement-normalize is lazy → lazy).
          //   • Its only OUTWARD static edge is settlement.schema.js — a pure
          //     schema/constant leaf whose ONLY runtime importers are these two
          //     modules (verified FP-G8: every other mention is a JSDoc type
          //     annotation). It used to STAY in engine-core (ESD force-routed it
          //     eager for zero benefit); FP-G8 (2026-07-16) excised it from
          //     ENGINE_SHARED_DOMAIN and joins it to this pin, so the ~68 kB
          //     schema leaf rides the lazy chunk with its importers instead of
          //     paying first-paint bytes no anon-landing path ever needs.
          // Removing them from engine-core is what actually reclaims the closure
          // AND makes the measurement deterministic. Must match BEFORE the
          // isEngineSharedDomain rule below.
          // @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte
          //   budget + engine-absent-from-closure).
          if (id.includes('/src/domain/normalizeSettlement.js') ||
              id.includes('/src/domain/settlementMigrations.js') ||
              id.includes('/src/domain/settlement.schema.js'))
            return 'settlement-normalize';

          // ── Engine-core (the first-paint slice of the {generators,domain} ──
          // engine layers). Two kinds of module live here:
          //
          //  (a) The GENERATOR SPINE the entry ACTUALLY reaches eagerly — just
          //      two tiny modules: the neighbour backlink (crossSettlementConflicts,
          //      the deterministic wrapper — imported by the eager
          //      domain/relationships/neighbourBackLink.js; it pulls only kernel/
          //      prng), and the pipeline-rail labels (stepMetadata, metaForStep —
          //      imported by the eager store/settlementSlice.js; zero imports).
          //  (b) The DOMAIN VOCABULARY the engine leans on (ENGINE_SHARED_DOMAIN,
          //      computed above) — the src/domain modules generators import,
          //      which first-paint store/domain code needs too.
          //
          // FP-G8 OVER-PIN TRIM (2026-07-16): this pin USED to also force
          // structuralValidator + helpers + priorityHelpers + institutionProbability
          // + neighbourGenerator into engine-core, on the premise the entry reached
          // the coherence draft-check (checkStructuralValidity) eagerly. That premise
          // went STALE — checkDraftEdit (its sole first-paint consumer) is now lazy
          // (rides the SettlementsPanel chunk), so NO eager module reaches those five
          // anymore (verified: every real importer is the lazy `engine` chunk or a
          // lazy component chunk; crossSettlementConflicts + stepMetadata reach none
          // of them — the former imports only kernel/prng, the latter nothing). They
          // are pure over-inclusions paying ~first-paint bytes for a coherence check
          // that no longer runs on first paint. Un-pinned here (and dropped from the
          // eager-graph seeds above) so they ride the lazy `engine` chunk with the
          // generators. spatialData.js (structuralValidator's exclusive data table)
          // follows them out of the eager `data` chunk.
          //
          // Under the blanket /src/generators/ → 'engine' rule below (and
          // Rollup's default co-location of the shared domain into that chunk),
          // the retained edges would drag the WHOLE 656 kB engine chunk into the
          // first-paint static closure. Splitting them into this small chunk
          // keeps their transitive imports within {engine-core, kernel, data} —
          // never a heavy generator (economy/power/npc/history/narrative/
          // faction/services/steps) — so 'engine-core' never pulls 'engine'.
          // The big engine chunk imports engine-core, but that edge points the
          // safe way: engine (lazy) → engine-core (first-paint), never the
          // reverse. This is what keeps the 656 kB engine chunk OUT of first
          // paint. Must match BEFORE /src/generators/ and BEFORE the /src/data/
          // rule (some domain here re-exports data).
          // @enforced-by tests/build/vendorPdfLazy.test.js (engine-absent-from-
          // closure contract + first-paint byte budget).
          if (
            id.includes('/src/generators/crossSettlementConflicts.js') ||
            id.includes('/src/generators/steps/stepMetadata.js') ||
            isEngineSharedDomain(id)
          )
            return 'engine-core';

          // ── The custom-content source seam (EAGER, pinned to kernel) ──
          // lib/customContentSource.js is the tiny zero-dependency seam the
          // store wires at boot and the LAZY registry reads on load. It is
          // shared by the entry AND the custom-registry chunk — left unpinned,
          // Rollup co-located it INTO custom-registry, which made the ENTRY
          // statically import the whole registry chunk (and its data-lazy
          // deps): measured +351 kB of first-paint regression, the exact
          // inversion of the de-eager goal. Pin it to the eager kernel chunk
          // (the house home for tiny dependency-free seam layers, like the
          // PRNG context) so the edge direction stays custom-registry(lazy) →
          // kernel(eager), never entry → custom-registry. Must match BEFORE
          // the custom-registry rule below.
          if (id.includes('/src/lib/customContentSource.js'))
            return 'kernel';

          // ── customRegistry + dependencyEngine (LAZY since the de-eager ──
          // lane, 2026-07-19). These used to be routed into the EAGER 'data'
          // chunk because store/index statically imported dependencyEngine
          // (the setCustomContentSource wiring). That wiring now goes through
          // the tiny eager seam (lib/customContentSource.js), and every
          // remaining importer is lazy: the engine-chunk generators, the
          // compendium/wizard/deity UI chunks, and the dynamic-imported
          // settlementDeityHelpers. WITHOUT a pin Rollup would co-locate the
          // pair into the big engine chunk (their largest importer), forcing
          // every Compendium/wizard surface to fetch ~618 kB of generators
          // just to enumerate the registry — and pushing the engine chunk
          // against its 660 kB size assertion. The named lazy chunk keeps the
          // registry independently fetchable. The WHALE TABLES it enumerates
          // (institutionalCatalog, institutionServices, resourceData,
          // tradeGoodsData) STAY in the eager 'data' chunk — each has its own
          // first-paint consumer (FP-G11) — so this chunk statically imports
          // 'data', the safe lazy→eager direction.
          // @enforced-by tests/build/customRegistryLazy.test.js (absent from
          //   the entry closure + present in a lazy chunk) + the byte budget.
          if (id.includes('/src/lib/customRegistry.js') ||
              id.includes('/src/lib/dependencyEngine.js'))
            return 'custom-registry';

          // ── customContentSchema (LAZY, its own tiny chunk) ─────────
          // Excised from ENGINE_SHARED_DOMAIN above (de-eager lane). Pinned
          // to a dedicated ~3 kB chunk — NOT into 'custom-registry' — so the
          // slice's validation chokepoint (await import at add/update) and the
          // gallery's TIER_ORDER read fetch the schema alone, not the 41 kB
          // registry; the engine + compendium chunks statically import it the
          // safe lazy→lazy way. Its only outward edge is deterministicSort
          // (eager engine-core) — lazy→eager, safe.
          if (id.includes('/src/domain/customContentSchema.js'))
            return 'custom-schema';

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
          // Only the tables an eager chunk statically reaches ride the
          // first-paint 'data' chunk; the rest (generator-only naming/history/
          // sample tables, …) ride 'data-lazy' and are fetched with whichever
          // lazy chunk first imports them. Derived, not curated — see
          // computeEagerDataModules above. @enforced-by vendorPdfLazy.test.js.
          if (id.includes('/src/data/'))
            return isEagerData(id) ? 'data' : 'data-lazy';
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
    // Pin the property layer's fast-check seed globally (test-gate-honesty-2):
    // every fc.assert runs a deterministic, REPRODUCIBLE case sequence instead of
    // a fresh random one per run. Only the seed is set (numRuns et al keep their
    // library defaults). Rotation is a deliberate per-wave act — see the header.
    setupFiles: ['./tests/setup/fastCheckSeed.js'],
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
