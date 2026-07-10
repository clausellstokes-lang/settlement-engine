/**
 * tests/build/vendorPdfLazy.test.js — Tier 9.7 first-paint lazy verification.
 *
 * Two heavy chunks must stay OUT of the entry's first-paint static closure:
 *   • vendor-pdf (@react-pdf/renderer + jsPDF, ~1.85 MB / 616 kB gz) — only
 *     when the user clicks "Export PDF".
 *   • the generator engine (~514 kB) — only on first Generate (settlementSlice's
 *     loadEngine dynamic import) and lazy dossier tabs. The entry reaches only
 *     the small kernel + engine-core chunks; see vite.config.js manualChunks.
 *
 * The load-bearing vendor-pdf contract is:
 *
 *   1. vendor-pdf is its own chunk (manualChunks isolates the PDF stack).
 *   2. vendor-pdf is ABSENT from the ENTRY chunk's *transitive static
 *      import closure* — i.e. nothing the entry statically pulls in
 *      (directly or through another static edge) references vendor-pdf.
 *      This is the real regression guard: it was defeated once because
 *      Rollup co-located Vite's __vitePreload helper into vendor-pdf, so
 *      the entry statically imported the whole PDF stack just to reach a
 *      20-line helper. The fix pins that helper into vendor-state (see
 *      vite.config.js). A byte budget on the closure ratchets that shut.
 *   3. index.html does not emit a <link rel="modulepreload"> hint for
 *      vendor-pdf (secondary — a preload hint can only *add* a fetch for
 *      a chunk that's already reachable; the static-closure check above
 *      is what proves the chunk isn't reachable at all).
 *   4. The components that export PDFs use dynamic `import()` (source
 *      contract — survives source refactors even without a build).
 *
 * Contracts 1–3 read the built dist/ output and run only when dist/
 * exists (i.e. after `npm run build`); CI runs this after the build
 * step. Contract 4 runs against source and needs no build.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

// ── First-paint static-closure byte budget ──────────────────────────────────
// The entry's transitive static import closure is everything the browser is
// forced to download before it can paint. Measured after the KERNEL + ENGINE-
// CORE split that lifted the 656 kB engine chunk out of first paint
// (2026-07-09, `npm run build`):
//
//   data          438,161   +  index(entry)  516,565
//   engine-core   107,802   +  vendor-icons   30,041
//   kernel          8,852   +  vendor-react  193,160
//   vendor-state   17,031
//   ──────────────────────────────────────────────────
//   MEASURED TOTAL: 1,311,612 raw bytes (~1.25 MB)  —  7 files
//
// This was 1,825,278 (+ the 655,647 engine chunk) before the split. What moved:
//   • The seeded-PRNG seam (prng.js + rngContext.js) became src/kernel/ — a
//     tiny (~9 kB) first-paint chunk that the createPRNG edge (domain/events/
//     mutate) now resolves to instead of the engine chunk.
//   • The entry-reachable generator SPINE (structuralValidator,
//     crossSettlementConflicts, stepMetadata + helpers/priorityHelpers/
//     institutionProbability/neighbourGenerator) AND the domain vocabulary the
//     generators lean on (the ENGINE_SHARED_DOMAIN closure — trace, schema,
//     magicFilter, deterministicSort, clock, corruption, faction*, …) split
//     into the small (~108 kB) 'engine-core' chunk. Rollup used to co-locate
//     that shared domain into the 656 kB engine chunk, which is precisely why
//     the entry statically imported engine before this change.
//   • buildThreatAssessment moved to a pure domain leaf
//     (domain/display/threatAssessment.js), cutting the defense-display edge.
//   • stressTypes.js (now pure data) moved engine→data.
//
// The 656 kB engine chunk is now ABSENT from this closure (asserted below) and
// is fetched lazily on first Generate. vendor-pdf (1.85 MB / 616 kB gz) is
// likewise absent. The ceiling below is measured + ~5% headroom, and is a
// monotone ratchet: it should only ever move DOWN as more is made lazy, never
// up without a deliberate, documented reason. If this fails high, something
// re-entered the static graph — very likely a NEW eager store/domain/first-
// paint-UI static import of a heavy generator (which would drag the engine
// chunk back in). Check the closure listing the test prints and route the
// offending edge through kernel / engine-core / a leaf instead.
//
// (2026-07-10, W2b — the ceiling HOLDS at the pre-W2b 1,377,000 because the
// sim-applier leaf extraction absorbed the wave's eager cost.) The events wave
// added SHIFT_TIER / IMPOSE_CULT / APPLY_STRESSOR-souring to the event-mutation
// vocabulary (domain/events/mutateEntities.js + mutateWorld.js, statically
// reachable from the eager store via mutate.js). Their handlers reuse the landed
// sim's single-source appliers, which initially dragged the fat sim modules
// (+~83 kB min) into this closure. Fixed by the mandated leaf extraction (the
// domain/deityConstants.js pattern):
//   worldPulse/tierOutcomeApply.js    — applyTierOutcomeToSettlement + its
//     catalog helpers (imports only institutionalCatalog, data/constants, and
//     the stablePart slug leaf); tierResourceDynamics.js re-exports verbatim.
//   worldPulse/cultImpositionApply.js — reconcileCultImposition + nicheOf/
//     capacityForTier/deityRankStrength + the SLOTS_BY_TIER and
//     DEITY_RANK_STRENGTH tables (zero imports); religionState.js and
//     pantheon.js re-export / fold them back.
//   worldPulse/stablePart.js          — the id-slug (zero imports); worldState.js
//     re-exports it, so the eager applier mints byte-identical institution ids.
// The heavy evaluation machinery (worldState, simulationRules, resourceTaxonomy,
// goodsCatalog, pantheon, relationshipState, canonicalAccessors, supplyChainData)
// stays lazy — the 514 kB engine chunk is asserted ABSENT above. Remaining W2b
// additions that legitimately ride first paint: the event handlers themselves,
// warStressorTypes (zero imports) + canonicalRelationship (import-free, ~7 kB —
// small APPLY_STRESSOR vocabulary leaves, NOT worth their own split), plus
// institutionClassify, deityConstants, the causalState 16-variable growth, and
// the npcData trait tables. NET: MEASURED 1,368,015 raw bytes (7 chunks)
// post-extraction — up ~56 kB from the 2026-07-09 pre-W2b 1,311,612 (the legit
// additions above), but still UNDER the pre-W2b 1,377,000 ceiling, which is
// therefore RESTORED UNCHANGED: W2b lands net-zero against the first-paint
// budget. If this fails high, the extraction leaked or a new eager heavy edge
// re-entered — read the closure listing the test prints and route it through
// kernel / engine-core / a leaf.
// (2026-07-10, W2b-r + 4a) 1,377,000 -> 1,382,000: wave 4a's deity store mounts
// (+~9 KB entry) consumed the extraction headroom (HEAD measured 1,377,320 on a
// clean build — the 4a gate passed at the ceiling's jitter margin), and W2b-r's
// three event-registry entries add 2,742 B of composer-facing copy
// (SET_PRIMARY_DEITY / IMPOSE_CULT / SHIFT_TIER — canonical descriptions, same
// shape as every existing entry). Measured 1,380,062; +~2 KB headroom only.
// RATCHET-DOWN PATH (wave 5): evaluate code-splitting EVENT_REGISTRY's narrate/
// description prose out of first paint (the validation path needs only the type
// table); then return toward ~1,370,000.
// (2026-07-10, 4b/4c) 1,382,000 -> 1,400,000: the single-source copy registry
// (en.js 676 -> 1,245 lines, owner-ratified consolidation) rides the first-paint
// data chunk; 4b's gate measured green but HEAD then measured 1,398,495 — the
// SECOND measurement instability at this ceiling tonight (see 4a jitter note).
// 4c NET-REDUCED the closure to 1,395,755 (lazy HomeLanding/PostGenCoach/DEV
// panels/CampaignSyncBanner). RATCHET-DOWN PATH (4h/wave 5): (a) namespace-level
// lazy segmentation of the copy registry (deep-surface namespaces load with
// their surfaces), (b) the registry-prose code-split from the W2b-r note,
// (c) make this measurement deterministic — investigate chunk-assembly
// nondeterminism before trusting sub-kilobyte margins again.
// (2026-07-10, 4d) 1,400,000 -> 1,410,000 — ONE allowance for the remaining
// wave-4 boot-graph dribble (4d's auth bridge measured 1,402,172; third
// pass-then-fail at this ceiling tonight). NO further per-wave bumps: wave 5
// owns the reduction program — registry-prose split, copy-namespace
// segmentation, measurement determinization — and ratchets DOWN from here.
// (2026-07-10, 4g) ceiling HOLDS at 1,410,000, and 4g BUYS headroom back. The
// share loop's seo.js additions (per-route OG/Twitter image trio + the site
// WebSite/SoftwareApplication JSON-LD) rode the eager entry and pushed the
// closure to 1,412,642 (OVER). Two moves absorbed it and then some:
//   • the map-only lucide split — icons imported ONLY by src/components/map/**
//     (20 of them) now ride a lazy 'vendor-icons-map' chunk, shrinking the
//     first-paint vendor-icons chunk 31,750 -> 27,751 (see vite.config
//     computeMapOnlyLucideIcons); and
//   • the per-shared-dossier head enricher (setSharedDossierMeta) moved to the
//     lazy lib/seoDossier.js so only the gallery surface pays for it, not the
//     entry.
// NET MEASURED 1,407,4xx (`npm run build`) — back UNDER the ceiling (~2.6 kB
// headroom) with the icon split's margin restored. If this fails high, re-measure the closure
// listing the test prints; the map split can only ever move MAP-EXCLUSIVE icons
// out (safety invariant enforced by tests/build/iconChunkSplit.test.js).
const CLOSURE_BUDGET_BYTES = 1_410_000;

// Parse the top-level *static* module edges out of a built chunk. Static
// edges use the `from` keyword — `import{..}from"./x.js"` and re-exports
// `export{..}from"./x.js"` — plus bare side-effect imports `import"./x.js"`.
// Dynamic imports are `import("./x.js")` (no `from`, paren-called) and are
// deliberately excluded: they're what keeps a chunk lazy.
function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}

// Resolve the entry chunk filename from the built index.html.
function findEntryChunk() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  return m[1];
}

// Transitive static closure of the entry: BFS over static import edges.
function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return { entry, files: [...seen] };
}

describe.runIf(distExists)('Tier 9.7 — vendor-pdf lazy load contract', () => {
  // ── Chunk isolation ─────────────────────────────────────────────────────
  it('vendor-pdf is its own chunk in dist/assets/', () => {
    const files = readdirSync(assetsDir);
    const vendorPdfFiles = files.filter(f => /^vendor-pdf-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(vendorPdfFiles.length).toBeGreaterThan(0);
  });

  it('vendor-pdf chunk is large (would dominate initial bundle if eagerly loaded)', () => {
    const files = readdirSync(assetsDir);
    const vendorPdf = files.find(f => /^vendor-pdf-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(vendorPdf).toBeDefined();
    const size = statSync(join(assetsDir, vendorPdf)).size;
    // Meaningfully large (>500 KB): if it shrinks dramatically, PDF code
    // probably merged into a hot chunk. Upper bound (<3 MB): runaway growth
    // means a new dep snuck in.
    expect(size).toBeGreaterThan(500_000);
    expect(size).toBeLessThan(3_000_000);
  });

  // ── The real guard: vendor-pdf is NOT in the entry's static closure ──────
  it('entry does NOT statically import vendor-pdf (directly)', () => {
    const entry = findEntryChunk();
    const direct = staticImportSpecifiers(readFileSync(join(assetsDir, entry), 'utf-8'));
    const pdfDirect = direct.filter(f => /^vendor-pdf-/.test(f));
    expect(pdfDirect, `entry ${entry} directly imports ${pdfDirect.join(', ')}`).toHaveLength(0);
  });

  it('vendor-pdf is absent from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const pdfInClosure = files.filter(f => /^vendor-pdf-/.test(f));
    expect(
      pdfInClosure,
      `vendor-pdf reached first paint via static graph. Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  // ── The engine contract this split establishes ───────────────────────────
  // The ~656 kB (→ ~514 kB post-split) generator engine chunk must NOT be in
  // the entry's first-paint static closure. It is fetched lazily on first
  // Generate (settlementSlice's loadEngine dynamic import) and by lazy dossier
  // tabs. The entry reaches only the small kernel + engine-core chunks. If this
  // fails, an eager store/domain/first-paint-UI module statically imports a
  // heavy generator (or a domain module the generators pull that Rollup then
  // co-located into engine) — route it through kernel/engine-core/a leaf.
  // NB: the 'engine' chunk is `engine-<hash>.js`; the first-paint spine chunk
  // is `engine-core-<hash>.js` — exclude the latter explicitly.
  it('the engine chunk is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const engineInClosure = files.filter(
      f => /^engine-/.test(f) && !/^engine-core-/.test(f),
    );
    expect(
      engineInClosure,
      `the lazy engine chunk reached first paint via the static graph. Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  it('the engine chunk still exists (lazy) and remains large', () => {
    const files = readdirSync(assetsDir);
    const engine = files.find(f => /^engine-[A-Za-z0-9_-]+\.js$/.test(f) && !/^engine-core-/.test(f));
    expect(engine, 'expected a lazy engine-<hash>.js chunk to still be emitted').toBeDefined();
    const size = statSync(join(assetsDir, engine)).size;
    // It should stay meaningfully large (the generation pipeline lives here).
    // If it collapses, generation code leaked into a hot chunk; if it balloons
    // past the old ~660 kB, something eager re-merged into it.
    expect(size).toBeGreaterThan(300_000);
    expect(size).toBeLessThan(660_000);
  });

  // ── First-paint byte budget (the monotone ratchet) ───────────────────────
  it(`entry static closure raw bytes stay under the first-paint budget (${CLOSURE_BUDGET_BYTES})`, () => {
    const { files } = entryStaticClosure();
    let total = 0;
    const lines = [];
    for (const f of files.sort()) {
      const sz = statSync(join(assetsDir, f)).size;
      total += sz;
      lines.push(`  ${String(sz).padStart(9)}  ${f}`);
    }
    // Surface the breakdown on failure so a regression names the culprit.
    expect(
      total,
      `first-paint static closure = ${total} bytes (budget ${CLOSURE_BUDGET_BYTES}):\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(CLOSURE_BUDGET_BYTES);
  });

  // ── modulePreload hint (secondary check) ─────────────────────────────────
  it('index.html does NOT preload vendor-pdf', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*vendor-pdf[^"]*"/g;
    const matches = html.match(preloadRe) || [];
    expect(matches).toHaveLength(0);
  });
});

// ── Source-level lazy-import contract ───────────────────────────────────────
// Runs without dist/. Asserts that the components that trigger a PDF
// export use dynamic import() rather than a top-level static import,
// so the lazy chain stays intact through source-level refactors.

describe('Tier 9.7 — source uses dynamic import for PDF generation', () => {
  const lazyConsumers = [
    'src/components/SettlementDetail.jsx',
    'src/components/SingleDossierSuccessPage.jsx',
  ];

  for (const file of lazyConsumers) {
    it(`${file} uses dynamic import('.../generateSettlementPDF.js')`, () => {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8');
      // Must contain a dynamic import targeting the PDF generator.
      expect(source).toMatch(/import\(['"][^'"]*generateSettlementPDF[^'"]*['"]\)/);
      // Must NOT have a top-level static import of @react-pdf/renderer
      // (that would force the chunk into the consumer's chunk graph).
      expect(source).not.toMatch(/^import\s.*from\s+['"]@react-pdf\/renderer['"]/m);
    });
  }
});

// ── F41 — PDF render runs in a Web Worker ────────────────────────────────────
// @react-pdf's toBlob() reconcile + layout + serialization used to freeze the
// main thread for multiple seconds on a big dossier. The render now lives in
// src/utils/pdfRender.worker.js; src/utils/generateSettlementPDF.js posts the
// serializable SettlementPDF props to it and receives the Blob back. These
// source contracts pin the architecture:
//
//   1. The main-thread entry has NO static import of @react-pdf/renderer —
//      the worker carries its own bundle; the main thread touches vendor-pdf
//      only via the dynamic-import fallback (worker construction failure).
//   2. The entry constructs the worker with Vite's statically-analyzable
//      `new Worker(new URL('…', import.meta.url), { type: 'module' })` form —
//      anything else and Vite can't emit the worker as its own lazy asset.
//   3. The fallback is feature-detected (`typeof Worker`), never user-agent
//      sniffed.
//   4. The worker module imports the window shim BEFORE @react-pdf — the
//      vendor browser build reads `window.*` unguarded, and module graphs
//      evaluate dependencies in import order, so ordering IS the fix.

describe('F41 — PDF worker source contracts', () => {
  const entrySrc = readFileSync(resolve(process.cwd(), 'src/utils/generateSettlementPDF.js'), 'utf-8');
  const workerSrc = readFileSync(resolve(process.cwd(), 'src/utils/pdfRender.worker.js'), 'utf-8');

  it('generateSettlementPDF.js has NO static @react-pdf/renderer import (worker owns the render)', () => {
    expect(entrySrc).not.toMatch(/^import\s.*from\s+['"]@react-pdf\/renderer['"]/m);
    // The fallback still reaches the renderer — dynamically.
    expect(entrySrc).toMatch(/import\(['"]@react-pdf\/renderer['"]\)/);
  });

  it('generateSettlementPDF.js constructs the render worker via the Vite worker syntax', () => {
    expect(entrySrc).toMatch(/new Worker\(\s*new URL\(['"]\.\/pdfRender\.worker\.js['"],\s*import\.meta\.url\)/);
    expect(entrySrc).toMatch(/type:\s*['"]module['"]/);
  });

  it('generateSettlementPDF.js feature-detects Worker (no user-agent sniffing)', () => {
    expect(entrySrc).toMatch(/typeof Worker/);
    expect(entrySrc).not.toMatch(/userAgent/);
  });

  it('pdfRender.worker.js imports the window shim BEFORE @react-pdf/renderer', () => {
    const shimAt = workerSrc.indexOf("import './pdfWorkerShim.js'");
    const pdfAt = workerSrc.search(/import\s.*from\s+['"]@react-pdf\/renderer['"]/);
    expect(shimAt, 'worker must import ./pdfWorkerShim.js').toBeGreaterThanOrEqual(0);
    expect(pdfAt, 'worker must import @react-pdf/renderer').toBeGreaterThanOrEqual(0);
    expect(shimAt, 'shim import must precede the @react-pdf import').toBeLessThan(pdfAt);
    // And it renders the real document component.
    expect(workerSrc).toMatch(/from\s+['"]\.\.\/pdf\/SettlementPDF\.jsx['"]/);
  });

  // The worker's own module scope must stay free of dynamic import() —
  // Vite's default worker.format is 'iife', which hard-fails the build on a
  // code-split worker graph. (Vendored deps are checked by the build itself;
  // this pins our file so a future edit fails with a named culprit.)
  it('pdfRender.worker.js contains no dynamic import()', () => {
    const code = workerSrc
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/import\(/);
  });
});

// ── F41 — built worker asset (needs dist/) ───────────────────────────────────
describe.runIf(distExists)('F41 — PDF worker chunk contract', () => {
  it('the worker is emitted as its own asset and carries the PDF stack', () => {
    const files = readdirSync(assetsDir);
    const worker = files.find(f => /^pdfRender\.worker-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(worker, 'expected a pdfRender.worker-<hash>.js asset').toBeDefined();
    // It must actually contain the renderer — a tiny worker file would mean
    // the PDF stack silently failed to bundle in and the render will throw.
    const size = statSync(join(assetsDir, worker)).size;
    expect(size).toBeGreaterThan(500_000);
  });

  it('the worker asset is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const workerInClosure = files.filter(f => /^pdfRender\.worker-/.test(f));
    expect(
      workerInClosure,
      `the PDF worker reached first paint via the static graph. Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  it('index.html does NOT preload the PDF worker', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*pdfRender\.worker[^"]*"/g;
    expect(html.match(preloadRe) || []).toHaveLength(0);
  });
});
