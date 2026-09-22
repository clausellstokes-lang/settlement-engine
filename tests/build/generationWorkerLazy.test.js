/**
 * generationWorkerLazy.test.js — THE CONTRACT OF THE GENERATION TRANSPORT'S
 * LAZY BOUNDARY.
 *
 * The generation lane left the eager store slice so that the entry chunk stops
 * carrying it, and the worker transport was built wire-lean so that the happy
 * path never fetches the engine chunk on the main thread at all. Both are
 * SOURCE-SHAPE properties that a single careless static import would undo
 * silently, which is why they are pinned here rather than trusted:
 *
 *   1. the slice reaches the lane only through `import()`;
 *   2. the lane, the client, the core and the protocol are all outside vite's
 *      OWN derivation of the eager first-paint graph;
 *   3. the client never imports the core, so the fallback (and only the
 *      fallback) pays for the engine chunk;
 *   4. nothing under `src/workers/` imports the store or a persistence service;
 *   5. the protocol leaf really is import-free, which is what lets it be
 *      co-located into every chunk that needs it at zero cost.
 *
 * ⭐⭐ AND THE PRODUCTION ARM BELOW NO LONGER SAYS "ONE CHUNK", BECAUSE THE BUILD
 * SAID OTHERWISE (lane LIGHT, car 3b). It used to assert that the emitted worker
 * carried NO `import(` at all, on the stated premise that "vite inlines a worker
 * entry's dynamic imports". That premise was false for this repo the moment the
 * worker's graph could reach one: `vite.config.js` sets `worker: { format: 'es' }`
 * so a worker entry is a real ES build that CODE-SPLITS, and the client builds
 * this worker with `{ type: 'module' }`, which is exactly what lets the emitted
 * `import(` execute. Measured at `dd0b68c0d`: the worker emits
 * `livingContentRoster-*.js` at 55,465 B beside a 1,404,493 B bundle.
 *
 * ⛔ THE OTHER HALF OF THAT PREMISE WAS FALSE TOO, AND IT IS WORTH WRITING DOWN
 * RATHER THAN INHERITING: the split chunk is NOT shared with the main graph.
 * Vite bundles every worker entry as its OWN rollup build, so the same source
 * module is emitted three times in this dist under three hashes (the main graph's
 * at 1,788 B via `engine-*.js`, this worker's at 55,465 B, the preview worker's
 * at 1,094 B), and each is referenced by exactly one bundle. The sizes differ
 * because each build carries whatever of the roster's closure its own bundle does
 * not already hold. That is a duplicate on disk, it is what a per-entry worker
 * build costs, and the arm below pins the shape rather than wishing it away.
 *
 * The dist arms are `describe.runIf(distExists)` in the estate's idiom: a stale
 * or missing dist can only UNDER-report, and the post-build `VERIFY_DIST=1`
 * re-run is what makes them binding. The unconditional anti-vacuity `it` below
 * turns "VERIFY_DIST=1 with no dist" into a hard failure instead of a skip.
 *
 * ⭐ `WORKER_BUNDLE_CEILING_BYTES` — MINTED FROM A MEASURED BUILD at the §900 composition
 * (Fable chair, `build-900-chair.log`, tree `f6545dcd9`): `dist/assets/generation.worker-*.js`
 * measured 1,404,242 bytes. The ceiling is MONOTONE-DOWN: a rebuild that measures lower may
 * lower it (with the log cited); a rise is a chair ruling with a reason, never a lane's edit.
 * HORIZON-B2 refused to write this arm without a build — rightly (a pin with no receipt is the
 * false-instrument class) — and the landing that built paid it.
 *
 * ⭐ RE-MINTED BY THE CHAIR AT THE §917 LANDING (Fable chair, 2026-09-09; the LIGHT lane's control
 * builds at dd0b68c0d / f88d6bc54, receipt-light.md § CAR 3): 1,404,242 -> 1,404,493 bytes. The
 * reason, measured and not argued: lighting the living-content dial puts an irreducible 245 B into
 * this worker (the seam's loader, the emitted `import(`, the await) and the rest of §917 put 6 B in
 * — a build with the lazy edge removed entirely still read 1,404,248 B, above the §900 ceiling — so
 * no transport-side shave could clear it; the alternative (inlining the roster, +55,465 B) is the
 * regression this ceiling exists to refuse. The capability is the owner's order ("land everything lit
 * on"); the rise is declared here, in the ledger row, and is vetoable. The ceiling stays
 * MONOTONE-DOWN from this value.
 *
 * ⭐ RE-MINTED DOWNWARD BY THE WORKER-HEADROOM CAR (Opus lane, 2026-09-18, branch
 * `fix-worker-headroom-2026-09-18`): 1,404,493 -> 1,398,705 bytes, measured on
 * `dist/assets/generation.worker-CXHCiqmL.js` from a worktree verified lockfile-clean
 * (588 of 588 installed packages at their locked versions — the box-drift hazard makes
 * a locally built figure worthless otherwise). This is a SHRINK and needs no ruling:
 * the ceiling may always follow a lower measurement down.
 *
 * What bought the 6,439 B, both PROVEN INVISIBLE to generated output (the golden master
 * and the espionage fence ran plain and green across the change):
 *   • `src/domain/customContentSchema.js` — sixteen derived `_KEYS` constants took a
 *     rollup PURE annotation. Five engine modules import that file for `passesTierGate`
 *     and `tradeCategoryLabelOf` and nothing else; its authoring vocabulary (content
 *     groups, criticality, economic weight, defense roles, power authorities, food
 *     impact, satisfies, and the whole deity chart) has ZERO readers under
 *     src/generators, src/workers, src/lib, src/kernel or src/data. It rode in anyway
 *     because `Object.freeze(Y.map(f))` lets rollup drop the binding and KEEP the call.
 *   • `src/generators/steps/stepMetadata.js` — the rail's 22 labels and 22 descriptions
 *     moved to a sibling table on the same file, `STEP_PRESENTATION`, read only by
 *     src/components/PipelineRail.jsx. The worker's `metaForStep` reads `summary` alone
 *     and the packet on the wire is `{ id, index, summary }`, so the words were paying
 *     rent in this bundle to be read by nobody.
 *
 * ⚠ THE HEADROOM IS IN THE BUNDLE, NOT IN THE CEILING. Re-minting at the exact
 * measurement is what monotone-down means, so this arm is again at 0 B slack by
 * construction; the 6,439 B of room bought here is room in the WORKER, spent by the next
 * car that adds authored content, and it is measured before it is spent.
 *
 * ⭐ RE-MINTED UPWARD BY THE CHAIR AT THE 2026-09-18 FIXES CONSIST (Fable chair, ODQ §934.19; the
 * consist's final tip 2b0322992, lockfile-clean; a control build at the worker-headroom car's own
 * consist position 96cfd7e17 reproduced its mint to the byte — 1,398,705, generation.worker-CXHCiqmL.js):
 * 1,398,705 -> 1,399,318 bytes. The 613 B are the cars composed after that car, and they are the
 * owner's content cures, counted in the bundle: the parish-church text cure (§934.13) puts twelve
 * "house of worship" strings here where there were none; the food writer publishes the split it
 * carries (§934.15; `importCoverage` 1 -> 4); the article decided by sound; the label ladder in its
 * shared home; the verdict reading `viable` alone; the hook-framing table. Nothing eager re-merged
 * and no authoring vocabulary rode along (the two finds above are still out); lanes 22–24 added 0 B.
 * The capability is the owner's order ("impliment every fix"); the rise is declared here, in the
 * ledger row, in the report and the pull request, and is vetoable — a veto returns the constant and
 * takes a headroom hunt (a shrink) in its place. The ceiling stays MONOTONE-DOWN from this value.
 *
 * @enforced-by this test
 */

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { EAGER_FIRST_PAINT_MODULES } from '../../vite.config.js';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const ASSETS = join(DIST, 'assets');
const DIST_EXISTS = existsSync(DIST) && existsSync(ASSETS);
const REQUIRE_DIST = process.env.VERIFY_DIST === '1';
const SENTINEL = 'settlementforge:generation:worker-v1';
/** Measured 1,399,318 B by the chair at the 2026-09-18 fixes consist's final tip (2b0322992,
 *  generation.worker-DNFpfUQI.js, lockfile-clean; ODQ §934.19); monotone-down — see the docblock
 *  for what the bytes are. */
// 1,399,318 → 1,399,946 (2026-09-19, the chair, ODQ §934.19 addendum): +628 B minified,
// ATTRIBUTED PER MODULE by a control build at the previous mint (d17f171b0) against the tip —
// exactly ONE module moved: src/generators/spatialGenerator.js, 14,050 → 17,359 rendered bytes,
// the §934.22 sacred-house derivation (every layout line derives the house the settlement
// holds instead of saying 'church'). A buy-back inside that file is the named alternative;
// the rise is offered for the owner's ratification like the mint it follows.
// 1,399,946 → 1,401,128 (2026-09-19, the chair, ODQ §934.19 addendum 2): +1,182 B minified,
// ATTRIBUTED PER MODULE by a control build at train EM-T1's green terminal (ed9d99295)
// against the EM-T2 cure tip (023eda2ec) — exactly TWO modules moved, and they are EM-P0's
// two: src/generators/pipeline.js, 9,843 → 12,548 rendered bytes, and
// src/generators/steps/generatePopulation.js, 6,864 → 9,702 rendered bytes. Nothing else in
// the whole build moved a rendered byte. The bytes are EM-P0's pipeline seam (ODQ §934.47,
// the owner's editor program): the runner hands `pins` to every step and refuses a partial
// pin, and generatePopulation consults a pin at each of its four choosers (npcs,
// relationships, factions, conflicts) on its ONE stream. That is generation code in the
// generation worker, where it belongs; nothing eager re-merged. A buy-back inside those two
// files is the named alternative; the rise is offered for the owner's ratification like the
// mints it follows. The ceiling stays MONOTONE-DOWN from this value.
// 1,401,128 → 1,401,208 (2026-09-19, EM-P3's build lane, under the standing conditional ruling of
// ODQ §934.19 addendum 2 and the EDIT-MODE-TRAIN charter's amendment of 2026-09-19): +80 B minified,
// ATTRIBUTED PER MODULE by a control build on this packet's own base tree (af36a626d, whose src/ and
// tests/ are byte-identical to the verified base 4928be0ab — the one commit between them is the
// docs-only promotion) against this tip, both built with `npm run build`. A whole-build sweep over
// all 545 emitted chunks finds exactly THREE modules whose rendered length moved ANYWHERE, and all
// three are EM-P3's own manifest paths: src/generators/steps/resolveConfig.js 14,417 → 14,304 (the
// two literals left it), src/data/worldFactOptions.js new → 2,500 (they arrived), and
// src/components/gallery/galleryUtils.js 4,987 → 4,990 in the gallery's own lazy chunk, which is not
// in this bundle at all. This worker: 230 → 231 modules, nothing left it. The bytes are EM-P3's two
// world-fact option lists (TERRAIN_WEIGHTS and CULTURES) moving to their one home, which the
// generator still reads — generation data in the generation worker, where it belongs.
// ⭐ THE CURE WAS THE PLACEMENT BEFORE IT WAS THE CEILING. The citation index WORLD_FACT_SOURCES is
// an index of OTHER modules' addresses that this worker never reads, so it was placed in the
// domain-reachable leaf src/domain/worldFactOptions.js instead: measured, that leaf and
// galleryUtils.js appear nowhere in this bundle, and the alternative (the map beside the lists)
// priced 428 B more into a zero-slack ceiling for bytes the worker would never execute. Nothing
// eager re-merged: the eager first-paint set is byte-identical at 268 modules and engine-core's
// chunk hash did not move; the lazy engine SHRANK 678,131 → 677,935 B. A buy-back inside
// resolveConfig.js is the named alternative; the rise is offered for the owner's ratification like
// the mints it follows. The ceiling stays MONOTONE-DOWN from this value.
// 1,401,208 → 1,396,015 (2026-09-22, the chair, judgment 160): train EM-T12 read +565 B at its
// terminal, ATTRIBUTED PER MODULE by the chair's control build at efd0eb448 against the cured tip
// bfca6b7d6 — 231 modules both sides, nothing entered or left, and exactly TWO moved:
// src/generators/steps/assembleInstitutions.js 31,117 → 32,656 rendered bytes and
// src/generators/steps/generatePower.js 6,656 → 7,820, which are EM-B2a3's two pin-seam consults. A
// shave inside those consults was measured INFEASIBLE (the rise is the whole minified size of the
// addition, so no shave that keeps the mechanism — two gated consults with clones over five keys —
// reaches zero), so the bytes were BOUGHT BACK where the ceiling's own message says to buy them:
// src/kernel/prng.js now imports seedrandom's ARC4 core alone instead of the package's umbrella
// index, and six generators this estate never names (alea, xor128, xorwow, xorshift7, xor4096,
// tychei) leave every bundle that reaches it. THE DRAWS ARE BYTE-IDENTICAL, measured, not argued:
// the umbrella IS the core object (index.js hangs the six off it and re-exports it), and 150,000
// draws — 30,000 over each of five seeds — plus int32(), quick() and double() agree exactly on both
// sides. The worker 1,401,773 → 1,396,015 (−5,758 B); the other chunks that carried them:
// advanceInterval.worker 2,657,906 → 2,652,094 (−5,812 B); pdfRender.worker 2,303,451 → 2,297,639
// (−5,812 B); customContentPreview.worker 1,628,487 → 1,622,729 (−5,758 B); kernel 10,465 → 4,722
// (−5,743 B). The ceiling follows the measurement DOWN and stays MONOTONE-DOWN from this value; the
// buy-back is offered for the owner's ratification like the mints it follows (vetoable: the
// umbrella import returns and the ceiling re-mints upward, which is his).
export const WORKER_BUNDLE_CEILING_BYTES = 1396015;

const source = (path) => readFileSync(join(ROOT, path), 'utf8');

/**
 * ⭐ THE WORKER'S DECLARED LAZY EDGES — the FROZEN table the production arm holds
 * the emitted bundle to (lane LIGHT, car 3b).
 *
 * `module` is the SOURCE module's basename as it survives into the emitted
 * specifier (`./livingContentRoster-CE43XTKG.js`), so the row is stable across
 * content hashes and names the thing a reader can actually find in `src/`.
 * `payloadSentinel` is an export name of that module which minification keeps:
 * it must be present in the split chunk and ABSENT from the worker bundle, which
 * is how "split out" is told apart from "split out AND inlined as well", the byte
 * regression the retired single-chunk arm existed to catch.
 *
 * Adding a row is a byte decision, not a formality: every row is one more cold
 * fetch sitting inside the user's generation wait.
 *
 * @type {ReadonlyArray<{module: string, payloadSentinel: string, why: string}>}
 */
const WORKER_LAZY_EDGES = Object.freeze([
  Object.freeze({
    module: 'livingContentRoster',
    payloadSentinel: 'LIVING_CONTENT_ROSTER_SCHEMA_VERSION',
    why: 'the living-content roster rides `livingContentSeam.js`\'s dynamic import, and the '
      + 'worker shell awaits the seam\'s loader before it runs a request because a Web Worker '
      + 'evaluates its own copy of the graph and a main-thread load does not arm this seam. '
      + 'The edge cannot become static: the seam is what keeps the roster and its whole '
      + 'content-manifest closure out of eager engine-core on the MAIN thread.',
  }),
]);

/** Every dynamic import a bundle carries, opaque ones included (`import(name)`). */
const dynamicImportOpenings = (code) => code.match(/\bimport\s*\(/g) || [];

/** The literal `./chunk-HASH.js` specifiers a bundle imports dynamically. */
function dynamicImportTargets(code) {
  const out = [];
  const re = /\bimport\s*\(\s*["']\.\/([^"']+)["']\s*\)/g;
  let match;
  while ((match = re.exec(code)) !== null) out.push(match[1]);
  return out;
}

/** `livingContentRoster-CE43XTKG.js` → `livingContentRoster`. */
const sourceModuleOf = (chunkFile) => chunkFile.replace(/-[A-Za-z0-9_-]+\.js$/, '');

/**
 * The client must build this worker as a MODULE worker. A classic worker cannot
 * execute the `import(` the arm above permits, so this is not style: it is the
 * runtime precondition of the declared lazy edge.
 */
const MODULE_WORKER_CONSTRUCTION =
  /new Worker\(\s*new URL\(\s*['"]\.\.\/workers\/generation\.worker\.js['"],\s*import\.meta\.url\s*\),\s*\{\s*type:\s*['"]module['"]\s*\}\s*\)/;

/** Relative-specifier static imports, the customContentPreviewLazy idiom. */
function staticImports(code) {
  const out = new Set();
  const from = /\bfrom\s*["'](\.[^"']+\.js)["']/g;
  const bare = /(?:^|[;}])import\s*["'](\.[^"']+\.js)["']/g;
  let match;
  while ((match = from.exec(code)) !== null) out.add(match[1]);
  while ((match = bare.exec(code)) !== null) out.add(match[1]);
  return [...out];
}

function entryClosure() {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  const entry = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/)?.[1];
  if (!entry) throw new Error('Production entry chunk was not found.');
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    const code = readFileSync(join(ASSETS, file), 'utf8');
    for (const dependency of staticImports(code)) {
      const name = dependency.replace(/^\.\//, '');
      if (!seen.has(name)) {
        seen.add(name);
        queue.push(name);
      }
    }
  }
  return [...seen];
}

const eagerRelative = () => new Set(
  [...EAGER_FIRST_PAINT_MODULES].map(abs => relative(ROOT, abs).split('\\').join('/')),
);

describe('generation worker — source boundary', () => {
  it('the slice reaches the generation lane only through import(), never a static import', () => {
    const slice = source('src/store/settlementSlice.js');
    expect(slice).toMatch(/import\(['"]\.\/settlementGenerateAction\.js['"]\)/);
    // anchored: the positive toMatch on the line above proves the specifier is present in this file, so a drift that renamed or removed the lane would red there first rather than vacate this negative.
    expect(slice).not.toMatch(/^import\s[^;]*settlementGenerateAction/m);
  });

  it('the generation lane, the client, the core and the protocol are outside vite\'s own eager first-paint graph', () => {
    const eager = eagerRelative();
    // Non-vacuity first: the derivation must actually have produced a graph, or
    // "absent from the eager set" is true of every string in the world.
    expect(eager.size).toBeGreaterThan(50);
    expect(eager.has('src/store/settlementSlice.js')).toBe(true);

    const shouldBeLazy = [
      'src/store/settlementGenerateAction.js',
      'src/lib/generationClient.js',
      'src/lib/generationProtocol.js',
      'src/workers/generationRequest.js',
      'src/workers/generation.worker.js',
      'src/store/settlementContentRuntime.js',
      'src/lib/anonGenCounter.js',
    ];
    const leaked = shouldBeLazy.filter(rel => eager.has(rel));
    expect(
      leaked,
      `these modules are reachable from vite's EAGER first-paint graph and must not be: ${leaked.join(', ')}`,
    ).toEqual([]);
  });

  it('the client constructs the worker from its URL and never statically imports the core (the wire-lean law)', () => {
    const client = source('src/lib/generationClient.js');
    expect(client).toMatch(/new Worker\(new URL\(['"]\.\.\/workers\/generation\.worker\.js['"], import\.meta\.url\)/);
    expect(staticImports(client)).toEqual(['./generationProtocol.js']);
    // anchored: staticImports(client) is asserted to be exactly one entry on the line above, so this file's import list is proven non-empty and readable before the absence below is read.
    expect(client).not.toMatch(/generationRequest/);
  });

  it('the worker shell statically imports the core, the protocol and the lazy seam, and nothing under src/workers imports the store, saves or a DOM global', () => {
    const shell = source('src/workers/generation.worker.js');
    // ⭐ THE THIRD EDGE IS THE LAZY PAYLOAD'S LOADER, AND IT IS TRANSPORT WORK
    // (lane LIGHT, car 1a). A generation law can be obeyed by a module behind a
    // lazy seam — the living-content roster is — and the pipeline THROWS rather
    // than degrading when that payload is unloaded. The main thread's lane arms
    // it too, and that is not a duplicate: a Web Worker evaluates its OWN copy of
    // the module graph, so the seam's registry here is a different slot and a
    // main-thread load does not arm it.
    //
    // ⛔ IT IS THE SEAM'S `loadLivingContentRoster`, NOT THE CREATE BOUNDARY'S
    // `loadGenerationLawPayloads`, AND THE REASON IS MEASURED (car 3a). The
    // boundary module is otherwise absent from this worker's graph while the seam
    // is already in it, so routing through the aggregate cost the bundle 31 B for
    // nothing under a monotone-down ceiling. The main-thread reachers keep the
    // aggregate. `tests/lint/densityCreateBoundary.walker.test.js` declares the two
    // worker rows and reds if the aggregate ever grows a payload they would miss.
    //
    // The list stays EXACT rather than becoming a `toContain`, because the whole
    // point of this arm is that the shell's static surface is small and every
    // addition is argued; the seam is itself outside vite's eager first-paint
    // graph (the arm above pins the lane and the core the same way).
    expect(staticImports(shell).sort()).toEqual([
      '../domain/content/livingContentSeam.js',
      '../lib/generationProtocol.js',
      './generationRequest.js',
    ]);

    const workerFiles = readdirSync(join(ROOT, 'src/workers')).filter(f => /\.js$/.test(f));
    expect(workerFiles.length).toBeGreaterThanOrEqual(5); // the scan is not vacuous
    const offenders = [];
    for (const file of workerFiles) {
      const code = source(`src/workers/${file}`);
      for (const banned of ['store/index.js', 'savesService', 'localStorage', 'sessionStorage']) {
        if (code.includes(banned)) offenders.push(`src/workers/${file}: ${banned}`);
      }
    }
    expect(
      offenders,
      `a worker module reached for the store, a persistence service or browser storage: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('the protocol leaf has no imports', () => {
    const protocol = source('src/lib/generationProtocol.js');
    expect(staticImports(protocol)).toEqual([]);
    // anchored: the assertion above proves the parser ran over a real file whose import list is empty; this line pins that no dynamic import was added either, and the file is read by path so it cannot silently vanish.
    expect(protocol).not.toMatch(/\bimport\s*\(/);
    expect(protocol).toContain(SENTINEL);
  });

  it('when VERIFY_DIST=1, dist/ + dist/assets exist (post-build must verify, not skip)', () => {
    expect(
      !REQUIRE_DIST || DIST_EXISTS,
      'VERIFY_DIST=1 but dist/assets is absent — a skipped post-build chunk contract is green-on-nothing; run `npm run build` first',
    ).toBe(true);
  });
});

describe.runIf(DIST_EXISTS)('generation worker — production boundary', () => {
  it('the worker contract sentinel is absent from the entry static closure', () => {
    const closure = entryClosure();
    expect(closure.length).toBeGreaterThan(1); // the BFS actually walked
    const carriers = closure.filter(file => readFileSync(join(ASSETS, file), 'utf8').includes(SENTINEL));
    expect(
      carriers,
      `first-paint chunks carrying the generation worker contract: ${carriers.join(', ')}`,
    ).toEqual([]);
  });

  it('exactly one generation.worker bundle is emitted, and it carries exactly the lazy edges WORKER_LAZY_EDGES declares', () => {
    const bundles = readdirSync(ASSETS).filter(f => /^generation\.worker-.*\.js$/.test(f));
    expect(bundles.length).toBe(1);
    const code = readFileSync(join(ASSETS, bundles[0]), 'utf8');

    // ── NON-VACUITY, ON BOTH SCANNERS, BEFORE ANYTHING IS COUNTED ────────────
    // A count-shaped arm whose scanner cannot see a dynamic import reports every
    // bundle clean, and a table-shaped arm whose table is empty asserts nothing.
    expect(WORKER_LAZY_EDGES.length).toBeGreaterThan(0);
    const PLANT_ONE = 'const a=1;import("./livingContentRoster-AAAAAAAA.js");';
    const PLANT_TWO = `${PLANT_ONE}import("./somethingElse-BBBBBBBB.js");`;
    const PLANT_NONE = 'const a=1;reimport(x);const b="./livingContentRoster-AAAAAAAA.js";';
    expect(dynamicImportTargets(PLANT_ONE)).toEqual(['livingContentRoster-AAAAAAAA.js']);
    expect(dynamicImportTargets(PLANT_TWO).length).toBe(2);
    expect(dynamicImportOpenings(PLANT_NONE)).toEqual([]);
    expect(dynamicImportTargets(PLANT_NONE)).toEqual([]);
    expect(sourceModuleOf('livingContentRoster-AAAAAAAA.js')).toBe('livingContentRoster');

    // ── (a) THE COUNT EQUALS THE TABLE ───────────────────────────────────────
    // Openings are counted with the LOOSE form so an `import(someName)` whose
    // specifier is computed cannot slip past a literal-only scanner; the second
    // assertion is what makes the loose count readable, by requiring every
    // opening to have resolved to a literal chunk specifier.
    const openings = dynamicImportOpenings(code);
    const targets = dynamicImportTargets(code);
    expect(
      openings.length,
      `the worker bundle carries ${openings.length} dynamic import(s); WORKER_LAZY_EDGES `
      + `declares ${WORKER_LAZY_EDGES.length}. Every one of them is a cold fetch inside the `
      + 'user\'s generation wait: declare it with its reason, or take it out.',
    ).toBe(WORKER_LAZY_EDGES.length);
    expect(
      targets.length,
      'a dynamic import in the worker bundle has no literal chunk specifier, so this arm '
      + 'cannot tell which chunk it fetches',
    ).toBe(openings.length);
    expect(
      targets.map(sourceModuleOf).sort(),
      `the worker's lazy edges are ${targets.join(', ')}`,
    ).toEqual(WORKER_LAZY_EDGES.map(edge => edge.module).sort());
    // The worker entry is still a leaf in the STATIC graph: an emitted static
    // edge would be a chunk the browser fetches before the worker can run at all.
    expect(staticImports(code)).toEqual([]);

    // ── (b) EACH TARGET IS A REAL CHUNK, AND IT IS NOT ALSO INLINED ──────────
    for (const edge of WORKER_LAZY_EDGES) {
      const target = targets.find(file => sourceModuleOf(file) === edge.module);
      expect(target, `no emitted chunk for declared edge ${edge.module}`).toBeTruthy();
      expect(
        existsSync(join(ASSETS, target)),
        `the worker imports ${target}, which is not in dist/assets: the fetch would 404 `
        + 'inside the user\'s wait',
      ).toBe(true);
      const chunk = readFileSync(join(ASSETS, target), 'utf8');
      // Anchored: the sentinel is proved present in the chunk it names FIRST, so
      // the absence below is a fact about the worker bundle and not about a
      // needle that stopped matching anything anywhere.
      expect(
        chunk.includes(edge.payloadSentinel),
        `${edge.payloadSentinel} is not in ${target} — the sentinel is stale, and the `
        + 'duplication check under it proves nothing',
      ).toBe(true);
      expect(
        code.includes(edge.payloadSentinel),
        `${edge.module} is split into ${target} AND inlined into the worker bundle: the `
        + 'bytes are paid twice and the split buys nothing',
      ).toBe(false);
      // Measured at dd0b68c0d and pinned because it is the shape, not a wish: a
      // worker entry is its own rollup build, so this chunk belongs to this
      // worker alone. The main graph carries its own copy under another hash.
      const referrers = readdirSync(ASSETS)
        .filter(file => file.endsWith('.js') && file !== target)
        .filter(file => readFileSync(join(ASSETS, file), 'utf8').includes(target));
      expect(
        referrers,
        `${target} is referenced by ${referrers.join(', ') || 'nothing'} — this chunk is the `
        + 'worker build\'s own and only the worker bundle should name it',
      ).toEqual([bundles[0]]);
    }
  });

  it('the client builds this worker with { type: \'module\' }, which is what lets the declared lazy edge run', () => {
    const client = source('src/lib/generationClient.js');
    // Anchored both ways: the pattern must match the shipped construction, and
    // must NOT match a classic worker, or "module" would be true of every string.
    expect(
      MODULE_WORKER_CONSTRUCTION.test(client),
      'generationClient.js no longer constructs generation.worker.js with { type: \'module\' }. '
      + 'A classic worker cannot execute the import( the bundle now carries, so every generation '
      + 'would die on the seam load rather than on anything the user did.',
    ).toBe(true);
    expect(
      MODULE_WORKER_CONSTRUCTION.test(
        'new Worker(new URL(\'../workers/generation.worker.js\', import.meta.url))',
      ),
      'the pattern matches a CLASSIC worker construction, so it proves nothing about the type',
    ).toBe(false);
  });

  it('the sentinel ships outside first paint, in the generation lane\'s chunk and in the worker bundle', () => {
    const eagerSet = new Set(entryClosure());
    const carriers = readdirSync(ASSETS)
      .filter(f => f.endsWith('.js') && !eagerSet.has(f))
      .filter(f => readFileSync(join(ASSETS, f), 'utf8').includes(SENTINEL));
    expect(
      carriers.length,
      `chunks outside first paint carrying the contract: ${carriers.join(', ')}`,
    ).toBeGreaterThanOrEqual(2);
  });
  it('the generation worker bundle stays under its measured ceiling (monotone-down; WORKER_BUNDLE_CEILING_BYTES)', () => {
    const assets = readdirSync(join(ROOT, 'dist', 'assets'));
    const workers = assets.filter((f) => /^generation\.worker-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(workers, 'exactly one generation worker bundle in dist/assets').toHaveLength(1);
    const bytes = readFileSync(join(ROOT, 'dist', 'assets', workers[0])).length;
    // Read the measured figure from the failure, never compute the ceiling from the tree.
    expect(
      bytes,
      `generation worker bundle ${workers[0]} is ${bytes} B; the ceiling is `
      + `${WORKER_BUNDLE_CEILING_BYTES} B (re-minted by the worker-headroom car, 2026-09-18). `
      + 'A RISE IS NEVER A LANE\'S EDIT: buy the bytes back, or take the ruling.',
    ).toBeLessThanOrEqual(WORKER_BUNDLE_CEILING_BYTES);
  });

});
