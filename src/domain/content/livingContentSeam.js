/**
 * livingContentSeam.js — THE LAZY SEAM the inert living-content roster is
 * reached through, and the ONLY part of that law the generator engine carries.
 *
 * ⛔ WHY A SEAM AT ALL, MEASURED RATHER THAN ASSUMED. `livingContentRoster.js`
 * imports `customContentManifest.js`; the pipeline is a GENERATOR; and
 * `vite.config.js`'s `computeEngineSharedDomain()` routes into the EAGER
 * `engine-core` chunk the transitive closure, within src/domain, of every
 * domain module any generator statically imports. A plain
 * `import { buildLivingContentRoster } from '.../livingContentRoster.js'` in
 * the pipeline therefore does not cost the ~1.3 kB the roster weighs — it drags
 * the whole content-vocabulary closure out of its lazy chunk and into FIRST
 * PAINT. Measured at 3f9201e39: engine-core 125,141 → 185,142 and the
 * first-paint static closure 1,045,910 → 1,095,584 against a 1,047,000 ceiling.
 *
 * A DYNAMIC import is a lazy boundary that BOTH derivations in vite.config.js
 * deliberately do not follow (`computeEngineSharedDomain` / `computeEagerModule
 * Graph`), so routing the roster behind one keeps every byte of it — and of its
 * manifest closure — out of first paint AND out of the budgeted `engine` chunk.
 * What stays behind is this file: a one-slot registry and the loader.
 *
 * ⛔ THE VERSION GATE ITSELF NOW LIVES IN `livingContentLawVersion.js`, AND THAT
 * MOVE WAS FORCED BY A CYCLE, NOT BY TASTE. The vocabulary was declared here and
 * read by BOTH siblings, so with the dynamic edge counted as an edge — and
 * `tests/architecture/layerBoundaries.test.js` counts it, correctly — seam,
 * roster and law formed one strongly-connected component of size 3 and the
 * shrink-only cycle ratchet went RED. The dynamic edge below is the one edge
 * that could not move, so the shared vocabulary moved instead, into a
 * dependency-free leaf (the `deityConstants.js` pattern the ratchet's own
 * message prescribes). This file still answers dormant-or-lit SYNCHRONOUSLY,
 * because the leaf it imports loads nothing.
 *
 * ⭐ THE DARK PATH LOADS NOTHING AND CANNOT DIVERGE. `livingContentRosterFor`
 * tests the law FIRST and returns the same `null` a run with no pack returns, so
 * a v1 world never touches the registry, never awaits anything, and is
 * byte-identical to a world generated before this law existed.
 * ⚠ THE PARENTHESIS THAT USED TO STAND HERE — "which is every world the product
 * mints today" — IS FALSE SINCE 2026-09-08, when the dial was lit: every world a
 * BIRTH mints is a v2 world now. What is still true, and is the whole of what
 * this paragraph needed, is that a v1 world takes the dark branch, and every
 * world born before the flip is a v1 world for ever (there is no migration, by
 * `livingContentLaw.js`'s property 3). Measured at the lighting on 1,293
 * configurations of two corpora: not one byte of a world moves between the two
 * laws but the law's own declaration.
 *
 * ⛔ AND THE LIT PATH FAILS LOUD, NEVER QUIET. If a world's own config says v2
 * and the roster module was never loaded, this throws instead of returning
 * `null`. A silent `null` there would be a same-seed divergence that depends on
 * whether a chunk happened to be fetched — exactly the class of bug a lazy seam
 * must never introduce. Throwing converts it into a build-time-visible error the
 * lighting car cannot miss.
 *
 * Pure. No RNG, no store, no React. One module-level slot, written once.
 *
 * @guarded-by tests/build/vendorPdfLazy.test.js (the first-paint byte budget +
 *   the engine ceiling), tests/build/livingContentSeamLazy.test.js and
 *   tests/domain/livingContentMaterialization.test.js.
 */

// The gate is the LEAF's. Importing it here is what keeps this file's answer
// synchronous while the payload stays behind the dynamic boundary below; the
// leaf imports nothing, so this edge costs no closure.
import { materializesLivingContent } from './livingContentLawVersion.js';

/** @type {((customContent:unknown, config:Record<string,unknown>|null|undefined) => unknown)|null} */
let rosterBuilder = null;

/**
 * Register the lazily-loaded roster builder. Called by `loadLivingContentRoster`
 * and, in tests, directly — so a suite can drive the lit path synchronously
 * without asserting on module-load order.
 *
 * @param {(customContent:unknown, config:Record<string,unknown>|null|undefined) => unknown} builder
 * @returns {void}
 */
export function registerLivingContentRosterBuilder(builder) {
  rosterBuilder = typeof builder === 'function' ? builder : null;
}

/** Has the roster payload been loaded into this module instance?
 *  @returns {boolean} */
export function livingContentRosterLoaded() {
  return rosterBuilder !== null;
}

/**
 * Load the roster payload and register it. IDEMPOTENT and memoized on the slot,
 * so a second call after the first resolves is free.
 *
 * ⚠ THE DYNAMIC FORM IS LOAD-BEARING, NOT STYLE. It must stay `import(` with no
 * space and no `from` clause: both vite.config.js derivations match static edges
 * with a `from`-clause regex, and a static edge here would put the whole roster
 * closure back into eager `engine-core`.
 *
 * ⭐ ITS CALLER IS `loadGenerationLawPayloads()` IN
 * `src/domain/density/densityCreateBoundary.js` — plus, since lane LIGHT's car
 * 3a, the two WORKER SHELLS, which call this loader directly. The create boundary
 * is where "which laws does a generation obey" is already answered, so on the
 * main thread the payload a law needs is loaded in the same place rather than in
 * seven. A worker is the measured exception: it evaluates its own copy of the
 * graph, the boundary module is otherwise absent from that graph while this seam
 * is already in it, and a worker bundle is held under a monotone-down byte
 * ceiling, so routing a worker's arming through the aggregate costs bytes for
 * nothing. `tests/lint/densityCreateBoundary.walker.test.js` declares those two
 * rows by name and reds if the aggregate ever grows a second payload the shells
 * would miss. For the whole dormant life of this law the function had NO caller
 * at all, which meant lighting the dial would have thrown out of every generation
 * instead of building a roster; that walker holds the caller set to the tree so
 * the state cannot return unnoticed.
 *
 * @returns {Promise<void>}
 */
export async function loadLivingContentRoster() {
  if (rosterBuilder) return;
  const mod = await import('./livingContentRoster.js');
  registerLivingContentRosterBuilder(mod.buildLivingContentRoster);
}

/**
 * The pipeline's one call: the inert roster for this run, or `null`.
 *
 * THE GATE IS FIRST AND IT IS THE WHOLE DARK PATH. A dormant run returns before
 * the registry is consulted, so it neither loads nor allocates.
 *
 * @param {unknown} customContent  the run's custom-content snapshot
 * @param {Record<string, unknown>|null|undefined} config  the resolved config
 * @returns {unknown}  the frozen roster, or null
 */
export function livingContentRosterFor(customContent, config) {
  if (!materializesLivingContent(config)) return null;
  if (!rosterBuilder) {
    throw new Error('[livingContentSeam] v2 world, roster payload not loaded');
  }
  return rosterBuilder(customContent, config);
}
