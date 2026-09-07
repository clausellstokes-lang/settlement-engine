/**
 * tests/build/engineChunkLazy.test.js — engine chunk first-paint contract.
 *
 * The generation engine (all of src/generators/* — economicGenerator,
 * powerGenerator, npcGenerator, …) is bundled into one "engine-*" chunk
 * (~655 kB raw / ~212 kB gz). It must not weigh on first paint: settlement
 * generation is a deliberate user action (loadEngine() dynamic import), so the
 * heavy generators should download on first generate, not first paint.
 *
 * Contracts pinned here (all currently TRUE — regressions of these are caught):
 *   1. The engine stack is its own chunk, within a sane size band.
 *   2. The LAZY engine chunk is excluded from <link rel="modulepreload"> (the
 *      vite modulePreload.resolveDependencies filter) so the browser doesn't
 *      pre-fetch it on first paint — while the EAGER engine-core chunk KEEPS
 *      its hint. Stripping an eager chunk's hint cannot make it lazy; it only
 *      serializes that chunk's fetch behind the entry's download and parse.
 *   3. settlementSlice reaches the heavy generators via dynamic import()
 *      (loadEngine), not a top-level static import.
 *   4. Pipeline receipt metadata is a small independent lazy chunk. Generation
 *      acquires it through the same memoized loader, and the lazy PipelineRail
 *      can read it without fetching the complete generation engine.
 *
 * Anti-vacuity (mirrors vendorPdfLazy): the dist/ suite is runIf(distExists) and
 * silently no-ops pre-build; CI re-runs with VERIFY_DIST=1, where a missing dist/
 * is a HARD failure.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, dirname, relative } from 'node:path';
import viteConfig, { ENGINE_SHARED_DOMAIN_EXCISIONS } from '../../vite.config.js';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
// The BIG lazy generator chunk (`engine-<hash>.js`) — NOT the small first-paint
// `engine-core-<hash>.js` shared-vocabulary chunk (vite.config manualChunks). The
// negative lookahead makes `.find`/`.filter` deterministic: `engine-core-*` sorts
// before `engine-<hash>` in readdir order, so a bare /^engine-.../ matcher would
// non-deterministically pick engine-core whenever the big chunk's content hash
// happens to sort after "core" — a latent flake, independent of any real size
// change. Selecting on identity (not hash order) is the fix.
const ENGINE_CHUNK_RE = /^engine-(?!core-)[A-Za-z0-9_-]+\.js$/;
const ENGINE_CORE_LAZY_CHUNK_RE =
  /^engine-core-lazy-[A-Za-z0-9_-]+\.js$/;
const PIPELINE_METADATA_CHUNK_RE = /^pipeline-metadata-[A-Za-z0-9_-]+\.js$/;
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDist = process.env.VERIFY_DIST === '1';

describe.runIf(requireDist)('engine chunk dist verification is not vacuously skipped', () => {
  it('dist/ + dist/assets exist when VERIFY_DIST=1 (a skipped post-build contract is green-on-nothing)', () => {
    expect(distExists, 'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first').toBe(true);
  });
});

describe.runIf(distExists)('engine chunk — first-paint contract', () => {
  it('engine is its own chunk in dist/assets/', () => {
    const engine = readdirSync(assetsDir).filter(f => ENGINE_CHUNK_RE.test(f));
    expect(engine.length).toBeGreaterThan(0);
  });

  it('engine chunk is within a sane size band (catches both a merge-into-hot-chunk and runaway growth)', () => {
    const engine = readdirSync(assetsDir).find(f => ENGINE_CHUNK_RE.test(f));
    expect(engine).toBeDefined();
    const size = statSync(join(assetsDir, engine)).size;
    expect(size).toBeGreaterThan(200_000);   // < this → engine likely merged into a hot chunk
    expect(size).toBeLessThan(1_400_000);     // > this → a heavy dep snuck into the engine
  });

  // The `(?!core-)` guard is the same one ENGINE_CHUNK_RE carries, for the same
  // reason: a bare `engine-` also matches `engine-core-<hash>`, because the hash
  // character class contains `-`. This assertion and vite.config.js's
  // modulePreload filter must move together — an unguarded matcher here would
  // red on the (correct) engine-core hint.
  it('index.html does NOT modulepreload the lazy engine chunk (the real first-paint mitigation)', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*engine-(?!core-)[^"]*"/g;
    expect(html.match(preloadRe) || []).toHaveLength(0);
  });

  // PRESENCE read → VERIFY_DIST-gated (the stale-dist policy documented in
  // vendorPdfLazy.test.js: a stale dist can false-RED a presence check, never an
  // absence check). engine-core is inside the entry's static closure, so the
  // browser fetches it either way; without the hint that fetch cannot start until
  // the entry has downloaded and begun parsing.
  it.skipIf(!requireDist)('index.html DOES modulepreload the eager engine-core chunk', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*engine-core-(?!lazy-)[^"]*"/g;
    expect(html.match(preloadRe) || []).toHaveLength(1);
  });

  it('pipeline metadata is an independent lazy chunk, not a first-paint preload', () => {
    const metadata = readdirSync(assetsDir).filter(f => PIPELINE_METADATA_CHUNK_RE.test(f));
    expect(metadata).toHaveLength(1);
    const size = statSync(join(assetsDir, metadata[0])).size;
    expect(size).toBeGreaterThan(1_000);
    expect(size).toBeLessThan(20_000);

    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    expect(html).not.toMatch(/modulepreload[^>]*pipeline-metadata-/);
  });

  it('lazy-only shared presentation vocabulary stays outside eager engine-core', () => {
    const chunks = readdirSync(assetsDir)
      .filter(file => ENGINE_CORE_LAZY_CHUNK_RE.test(file));
    expect(chunks).toHaveLength(1);
    const size = statSync(join(assetsDir, chunks[0])).size;
    expect(size).toBeGreaterThan(5_000);
    expect(size).toBeLessThan(50_000);

    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    expect(html).not.toMatch(/modulepreload[^>]*engine-core-lazy-/);
  });
});

// ── The modulePreload filter itself (needs no build) ────────────────────────
// The dist assertion above can only speak after `npm run build`; this executes
// the SHIPPED filter, so an over-matching regex reds on the next test run rather
// than surviving until a VERIFY_DIST cycle. It imports vite.config.js instead of
// restating the regex — a mirrored copy is precisely what let the config and the
// gate disagree about engine vs engine-core.
describe('engine chunk — modulePreload filter contract', () => {
  const { resolveDependencies } = viteConfig.build.modulePreload;
  // Representative names, not live hashes — nothing here needs refreshing per
  // build. What they encode is the hazard: Rollup hashes contain `-` and `_`, so
  // `engine-[A-Za-z0-9_-]+` swallows `engine-core-<hash>` whole.
  const LAZY_ENGINE = '/assets/engine-DiF-w7GX.js';
  const EAGER_ENGINE_CORE = '/assets/engine-core-C9WT3-vc.js';
  const LAZY_ENGINE_CORE = '/assets/engine-core-lazy-Dfgb5qrh.js';
  const VENDOR_PDF = '/assets/vendor-pdf-C-K1N_XW.js';
  const KERNEL = '/assets/kernel-BPO_CD3E.js';
  const ALL = [LAZY_ENGINE, EAGER_ENGINE_CORE, LAZY_ENGINE_CORE, VENDOR_PDF, KERNEL];
  const filtered = () =>
    resolveDependencies('index.html', ALL, { hostId: 'index.html', hostType: 'html' });

  it('strips the preload hint for the lazy engine chunk and vendor-pdf', () => {
    const kept = filtered();
    expect(kept).not.toContain(LAZY_ENGINE);
    expect(kept).not.toContain(VENDOR_PDF);
  });

  it('KEEPS the preload hint for the eager engine-core chunk', () => {
    expect(filtered()).toContain(EAGER_ENGINE_CORE);
  });

  it('leaves unrelated first-paint chunks untouched', () => {
    const kept = filtered();
    expect(kept).toContain(KERNEL);
    expect(kept).toContain(LAZY_ENGINE_CORE);
  });
});

// ── The orphan-excision guard (FP-G17, 2026-08-05; needs no build) ──────────
// vite.config.js excises modules from the derived ENGINE_SHARED_DOMAIN on ONE
// premise: "no first-paint module reaches this file". Excision alone does not
// place a module — an excised-and-UNPINNED module is an ORPHAN, and Rollup
// co-locates orphans into the big lazy `engine` chunk. That is harmless while
// the premise holds and catastrophic the moment it stops: an EAGER importer of
// a module living in the engine chunk re-parents the WHOLE chunk (and, hoisted
// behind it, custom-registry / custom-schema / engine-core-lazy / data-lazy)
// into first paint. That is exactly what WR-7b did to resolveTerrain.js by
// adding one static edge in worldPulse, two days before any gate read a dist.
//
// This guard is the SOURCE-level early warning the class was missing: it runs
// in plain `npm test`, before any build, and it names the file. It mirrors
// NOTHING — the excision list is imported from the config, and the pin is read
// by EXECUTING the shipped manualChunks. Its boundary is honest: it proves an
// eager-reachable excision is PLACED, not that its chunk is first-paint-safe
// (an excision pinned to a lazy chunk is caught by the dist closure guards in
// this file and vendorPdfLazy.test.js).
describe('engine chunk — no first-paint-reachable excision is left unpinned', () => {
  const ROOT = process.cwd();
  const SRC = resolve(ROOT, 'src');

  const strip = code =>
    code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  // Static edges only: `[^'"()]` keeps dynamic `import(...)` out of the
  // `from`-clause match, so a dynamic import stays a lazy boundary — the same
  // spelling vite.config.js's own eager-graph derivation uses.
  function staticSpecifiers(file) {
    const code = strip(readFileSync(file, 'utf8'));
    const out = new Set();
    for (const m of code.matchAll(
      /(?:^|[^.\w])import\s+(?:[^'"()]*?\sfrom\s+)?['"]([^'"]+)['"]/g,
    )) out.add(m[1]);
    for (const m of code.matchAll(
      /(?:^|[^.\w])export\s+[^'"]*?\sfrom\s+['"]([^'"]+)['"]/g,
    )) out.add(m[1]);
    return [...out];
  }

  function resolveRelative(from, specifier) {
    if (!specifier.startsWith('.')) return null;
    const base = resolve(dirname(from), specifier);
    for (const candidate of [
      base, `${base}.js`, `${base}.jsx`,
      join(base, 'index.js'), join(base, 'index.jsx'),
    ]) if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
    return null;
  }

  function eagerSourceGraph() {
    const entry = resolve(SRC, 'main.jsx');
    const seen = new Set([entry]);
    const queue = [entry];
    while (queue.length > 0) {
      const file = queue.shift();
      for (const specifier of staticSpecifiers(file)) {
        const dependency = resolveRelative(file, specifier);
        if (!dependency || seen.has(dependency)) continue;
        seen.add(dependency);
        queue.push(dependency);
      }
    }
    return seen;
  }

  const graph = eagerSourceGraph();
  const reachable = ENGINE_SHARED_DOMAIN_EXCISIONS
    .filter(frag => graph.has(join(ROOT, frag.slice(1))));

  // ANTI-VACUITY. Both halves can go silently empty: a broken resolver would
  // give an empty graph, and a premise that held for every excision would give
  // an empty reachable set — either would make the assertion below prove
  // nothing. Anchor on a module that IS eager, and require the guard to have
  // real work to do (deterministicSort + contentFingerprint are eager by
  // design, pinned to content-identity, so this cannot go empty by accident).
  it('the derivation is not vacuous (real graph, at least one reachable excision)', () => {
    expect(graph.has(resolve(SRC, 'store/index.js'))).toBe(true);
    expect(graph.size).toBeGreaterThan(100);
    expect(
      reachable,
      'no excision is first-paint reachable — the guard below would prove nothing',
    ).not.toHaveLength(0);
  });

  it('every excised module the first paint reaches is PLACED by manualChunks', () => {
    const { manualChunks } = viteConfig.build.rollupOptions.output;
    const orphans = reachable.filter(frag => !manualChunks(join(ROOT, frag.slice(1))));
    expect(
      orphans,
      `first-paint-reachable but UNPINNED (Rollup co-locates these into the lazy `
      + `engine chunk, which an eager importer then drags into first paint):\n  `
      + `${orphans.join('\n  ')}\nEither pin the module in vite.config.js's `
      + `manualChunks, or drop it from ENGINE_SHARED_DOMAIN_EXCISIONS so the `
      + `derived engine-core membership places it.`,
    ).toEqual([]);
  });

  it('reports the excisions whose lazy premise still holds (documentation, not a gate)', () => {
    const unreached = ENGINE_SHARED_DOMAIN_EXCISIONS.filter(f => !reachable.includes(f));
    // Not an assertion about WHICH — only that the two halves partition the
    // list, so a fragment can never fall out of both and escape the guard.
    expect(unreached.length + reachable.length).toBe(ENGINE_SHARED_DOMAIN_EXCISIONS.length);
    expect(relative(ROOT, SRC)).toBe('src');
  });
});

describe('engine chunk — source uses dynamic import for the heavy generators', () => {
  it('settlementSlice loadEngine() dynamic-imports generateSettlementPipeline (not a static top-level import)', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/store/settlementSlice.js'), 'utf-8');
    expect(src).toMatch(/import\(['"][^'"]*generateSettlementPipeline[^'"]*['"]\)/);
    expect(src).not.toMatch(/^import\s.*from\s+['"][^'"]*generators\/generateSettlementPipeline[^'"]*['"]/m);
  });

  it('settlementSlice loads pipeline metadata on generation, never through its eager imports', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/store/settlementSlice.js'), 'utf-8');
    expect(src).toMatch(/import\(['"][^'"]*steps\/stepMetadata\.js['"]\)/);
    expect(src).not.toMatch(/^import\s.*from\s+['"][^'"]*steps\/stepMetadata\.js['"]/m);
    expect(src).toMatch(/metaForStep:\s+metadata\.metaForStep/);
    expect(src).toMatch(/eng\.metaForStep\(name\)/);
  });
});
