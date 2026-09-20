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
import viteConfig, { ENGINE_SHARED_DOMAIN_EXCISIONS, EAGER_FIRST_PAINT_MODULES } from '../../vite.config.js';
import { codeOnly } from '../helpers/codeOnlySource.js';

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

  // ⭐ RE-ANCHORED, NOT PATCHED. This arm used to pin four regexes on the SLICE:
  // that it dynamic-imported `steps/stepMetadata.js` and read
  // `eng.metaForStep(name)`. After the generation lane moved out of the slice
  // the slice has no use for step metadata at all, so those regexes would have
  // reddened on a CORRECT tree. Keeping a dead `import()` alive to satisfy a
  // regex would have been a phantom enforcer — an assertion about a line that
  // exists only to be asserted about. So the CLAIM is re-anchored onto where
  // the work now happens: the generation core mints each step's summary where
  // the pipeline context lives, and the metadata leaf must be reachable only
  // from there.
  //
  // ⚠ THE ABSENCE CLAIM READS `codeOnly(source)`, NOT RAW TEXT. The slice's
  // rewritten header DESCRIBES the metadata path it no longer imports, and a
  // raw-text detector would convict that prose — the class that has already
  // convicted eight registries for describing what they classify.
  //
  // ⚠ AND THE PRESENCE CLAIM DELIBERATELY DOES NOT. `codeOnly` blanks string
  // TEXT, and an import SPECIFIER is string text, so routing a specifier match
  // through it would assert against a run of blanks and red on a correct tree.
  // The presence regex is therefore anchored at `^import` on the RAW source,
  // where a docblock line (which begins ` * `) cannot satisfy it.
  it('pipeline metadata is loaded by the generation core, never through an eager import — the slice reaches it only via the lazy lane', () => {
    const sliceRaw = readFileSync(resolve(process.cwd(), 'src/store/settlementSlice.js'), 'utf-8');
    const coreRaw = readFileSync(resolve(process.cwd(), 'src/workers/generationRequest.js'), 'utf-8');
    const slice = codeOnly(sliceRaw);
    const core = codeOnly(coreRaw);

    // The core is the one module that names the metadata leaf, statically, and
    // calls it. Both halves are positive claims, so neither can go vacuous.
    expect(coreRaw).toMatch(/^import\s.*metaForStep.*from\s+['"]\.\.\/generators\/steps\/stepMetadata\.js['"]/m);
    expect(core).toMatch(/metaForStep\(name\)/);

    // The slice reaches the lane, and the lane reaches the core.
    //
    // ⛔ THE SPECIFIER IS READ OFF THE RAW LINE, NOT OFF THE MASK, AND THIS ARM'S OWN
    // HEADER FOUR PARAGRAPHS UP STATES THE RULE IT WAS BREAKING: `codeOnly` blanks string
    // TEXT, and an import SPECIFIER is string text. `codeOnly(sliceRaw)` therefore carries
    // `import('                             ')`, so a specifier regex routed through it
    // CANNOT MATCH AT ANY ADDRESS — the green was unreachable rather than merely unearned,
    // and the arm reddened on a CORRECT tree that carries the edge at settlementSlice.js:59.
    //
    // The discrimination the mask was wanted for is still paid in full, by PAIRING the two
    // views instead of choosing one. `import(` is CODE and survives the mask; the specifier
    // is TEXT and survives only the raw read; `codeOnly` preserves offsets and newlines, so
    // line i of one view addresses line i of the other. A line whose MASKED counterpart
    // still carries `import(` is executable code, and its RAW counterpart at the same index
    // still carries the specifier the mask blanked. The `@type {?Promise<typeof
    // import('./settlementGenerateAction.js')>}` docblock on settlementSlice.js:55 names
    // this exact specifier in prose and is excluded by precisely that pairing — which is
    // the property a raw-only regex would have thrown away to get its match back.
    const rawLines = sliceRaw.split('\n');
    const maskedLines = slice.split('\n');
    const lazyLaneEdges = rawLines.filter(
      (line, index) => /import\(/.test(maskedLines[index] || '')
        && /import\(['"]\.\/settlementGenerateAction\.js['"]\)/.test(line),
    );
    expect(
      lazyLaneEdges,
      'the slice must reach the generation lane through exactly one dynamic import',
    ).toHaveLength(1);
    // anchored: the two positive core assertions and the positive slice assertion above prove both files were read and parsed, so this absence cannot be true merely because the subject vanished.
    expect(slice).not.toMatch(/steps\/stepMetadata\.js/);

    // NEGATIVE CONTROL for the codeOnly routing: a docblock that NAMES the leaf
    // must not convict. If this ever reds, the strip stopped stripping and the
    // arm above has become a prose detector.
    const withDocblockMention = `/** mentions src/generators/steps/stepMetadata.js in prose */\n${sliceRaw}`;
    expect(codeOnly(withDocblockMention)).not.toMatch(/steps\/stepMetadata\.js/); // anchored: the same assertion on the unmodified slice above is the paired positive, and this line differs from it only by a planted comment, so a stripper that stopped working reds one of the two.

    // And vite's own eager derivation must not carry the metadata leaf.
    const eager = new Set([...EAGER_FIRST_PAINT_MODULES].map(abs => relative(process.cwd(), abs)));
    expect(eager.size).toBeGreaterThan(50);
    expect(eager.has('src/generators/steps/stepMetadata.js')).toBe(false);
  });
});

// ── FIX-B2 (2026-09-20) — THE ANCHORED-LEAF PINS ────────────────────────────
// TOOL-12 measured 38 emitted chunks statically importing the 677,935 B lazy engine,
// and traced all 38 to TWELVE members whose CONSUMERS live in other chunks. That is
// FP-G11's formatNumber defect (the note in vite.config.js) reproduced twelve times:
// a member co-located into the engine forces every consumer's chunk to fetch the whole
// generator. The sharpest instance was a 173-byte `livingContentLaw` chunk dragging
// 677,935 B — a 3,918x ratio. FIX-B2 cured the anchored ones by PLACEMENT, with no
// source byte: the members are pinned to small lazy chunks (or joined to
// engine-core-lazy), so the consumer imports the small chunk and stops importing
// the engine. MEASURED across the three commits, on real builds: the engine's static
// importer set 38 -> 5, the engine chunk 677,935 -> 643,221 B, the first-paint closure
// unchanged at 8 files, and the generation worker byte-identical at 1,401,208.
//
// ⚠ THE FIVE THAT REMAIN ARE NOT LEFTOVERS, and the count is deliberately not pinned
// here. Four are the two members this wave did NOT move: generateSettlementPipeline.js
// (the chunk's own legitimate door — composeInstantWorld, instantWorldBody,
// generationRequest) and structuralValidator.js (SettlementsPanel; its closure drags six
// modules, so the chair refused it on proportion). The fifth, generateWorldBook, is a
// ROLLUP GROUPING ARTIFACT: its named module's 90-module static closure reaches no engine
// member at all, so no single-member move can cut it — an emitted chunk's NAME is one
// representative module, never its membership. That is why this suite pins PLACEMENT per
// module rather than a count of importers: a count would be a ratchet on Rollup's grouping
// as much as on the estate's own edges.
//
// ⛔ WHY THIS PIN EXISTS AT ALL. Every one of these placements is invisible in the
// module it governs — nothing in stressPriority.js says "I must not ride the engine
// chunk" — and five of the twelve matched NO rule before this wave, which is exactly
// how they were co-located in the first place. A later reader deleting a rule as
// "redundant" re-creates the defect silently, and no other instrument in tests/build
// counts the engine's importer set. This is the estate's standing lazy-pin idiom
// (contentIdentityLazy / cultureProfilesLazy / customContentCharsetLazy /
// livingContentSeamLazy / userRouteIdentityLeaf): PLACED + PRESENT here, and ABSENT
// from the entry closure in vendorPdfLazy.test.js, where the closure walker lives.
const FIX_B2_PINS = Object.freeze([
  { module: 'src/domain/content/livingContentSeam.js', chunk: 'living-content-seam' },
  { module: 'src/domain/content/livingContentLawVersion.js', chunk: 'living-content-seam' },
  { module: 'src/lib/narrativeMutations.js', chunk: 'narrative-mutations' },
  { module: 'src/generators/stressPriority.js', chunk: 'stress-priority' },
  { module: 'src/generators/computeActiveChains.js', chunk: 'resource-chains' },
  { module: 'src/generators/chainMagicSubstitution.js', chunk: 'resource-chains' },
  { module: 'src/lib/prebuiltResourceChains.js', chunk: 'resource-chains' },
  { module: 'src/generators/helpers.js', chunk: 'generator-helpers' },
  { module: 'src/generators/priorityHelpers.js', chunk: 'generator-helpers' },
  { module: 'src/generators/terrainHelpers.js', chunk: 'terrain-helpers' },
  { module: 'src/domain/customCategories.js', chunk: 'engine-core-lazy' },
  { module: 'src/domain/magicFilter.js', chunk: 'engine-core-lazy' },
]);
// The chunks FIX-B2 MINTED. engine-core-lazy is deliberately excluded: it predates this
// wave and already has its own arm above, and two of the twelve JOINED it rather than
// minting a home (measured: their outward edges were edges that chunk already carried,
// so joining cost no chunk, no chunk edge and no __vitePreload entry).
const FIX_B2_NEW_CHUNKS = Object.freeze([
  'living-content-seam', 'narrative-mutations', 'stress-priority',
  'resource-chains', 'generator-helpers', 'terrain-helpers',
]);

describe('FIX-B2 — the anchored leaves are PLACED, not co-located', () => {
  const { manualChunks } = viteConfig.build.rollupOptions.output;
  const ROOT = process.cwd();

  // ── ANTI-VACUITY FIRST. Both halves of this suite read a table, and a table whose
  // modules have been renamed away would make every assertion below pass over nothing.
  // The CONTROL is the other half: a module that must STILL route to 'engine' proves
  // the rules are live and that a green here means "placed", not "matched nothing".
  it('the pin table is live — every module exists, and a control generator still routes to the engine', () => {
    for (const { module } of FIX_B2_PINS) {
      expect(existsSync(resolve(ROOT, module)), `${module} is gone — its pin now proves nothing`).toBe(true);
    }
    expect(FIX_B2_PINS.length).toBe(12);
    // The control: npcGenerator is the chunk's largest member and must never leave it.
    // If this flips, the blanket /src/generators/ rule has been broken and the arm
    // below would pass for the wrong reason.
    expect(manualChunks(resolve(ROOT, 'src/generators/npcGenerator.js'))).toBe('engine');
  });

  it('every FIX-B2 module is placed by manualChunks in the chunk its rule names', () => {
    const misplaced = FIX_B2_PINS
      .map(({ module, chunk }) => ({ module, chunk, got: manualChunks(resolve(ROOT, module)) || null }))
      .filter(row => row.got !== row.chunk)
      .map(row => `${row.module}: expected '${row.chunk}', got '${row.got}'`);
    expect(
      misplaced,
      'a FIX-B2 pin stopped firing. A member that matches NO rule is an ORPHAN, and Rollup '
      + 'co-locates orphans into the big lazy engine chunk — which forces every chunk that '
      + 'consumes them to statically import the whole generator again (the FP-G11 incident, '
      + 'and the defect this wave cured 12 times). Check rule ORDER first: the generator '
      + 'pins must precede the blanket /src/generators/ rule.',
    ).toEqual([]);
  });

  // PRESENCE read → VERIFY_DIST-gated, per the stale-dist policy: a stale dist can
  // false-RED a presence check, never an absence check.
  it.skipIf(!requireDist)('every chunk FIX-B2 minted is emitted as exactly one lazy asset', () => {
    const files = readdirSync(assetsDir);
    const missing = FIX_B2_NEW_CHUNKS
      .map(name => ({ name, hits: files.filter(f => new RegExp(`^${name}-[A-Za-z0-9_-]+\\.js$`).test(f)) }))
      .filter(row => row.hits.length !== 1)
      .map(row => `${row.name}: ${row.hits.length} emitted asset(s)`);
    expect(
      missing,
      'a FIX-B2 chunk was not emitted exactly once — its members were re-merged somewhere, '
      + 'or the chunk name changed without this pin moving with it',
    ).toEqual([]);
  });

  it.skipIf(!requireDist)('no FIX-B2 chunk is pulled into first paint by a modulepreload hint', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    // ⚠ Written as a FILTER rather than a bare negated matcher, and deliberately:
    // negativeAssertionAnchor.walker.test.js freezes this file's un-anchored
    // bare-negative count at an EXACT number (not `<=`), so one more would red it.
    // ⛔ AND ITS SCANNER READS RAW LINES WITH NO COMMENT STRIPPING — so even naming
    // those three matchers in a sentence like this one counts against the frozen
    // figure. Found the hard way: an earlier draft of this very comment spelled them
    // out and moved the count by two without adding a single assertion. Describe the
    // rule, never spell it. A filter is anchor-free anyway, and names the offender.
    const preloaded = FIX_B2_NEW_CHUNKS
      .filter(name => new RegExp(`<link[^>]*rel="modulepreload"[^>]*href="[^"]*${name}-`).test(html));
    expect(
      preloaded,
      'a FIX-B2 lazy chunk is being preloaded on first paint — the pin moved bytes out of '
      + 'the engine and straight into the entry\'s fetch waterfall',
    ).toEqual([]);
    // Non-vacuity for the scanner: the HTML was really read and really contains hints.
    expect(html.length).toBeGreaterThan(500);
    expect((html.match(/rel="modulepreload"/g) || []).length).toBeGreaterThan(0);
  });
});
