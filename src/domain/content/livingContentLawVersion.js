/**
 * livingContentLawVersion.js — THE LIVING-CONTENT LAW'S VERSION VOCABULARY, and
 * the ONE home of every symbol that answers "is this world's living-content law
 * lit?" without loading anything.
 *
 * ⛔ WHY THIS IS ITS OWN FILE, AND WHY IT IMPORTS NOTHING. This vocabulary was
 * declared in `livingContentSeam.js` and read from all three living-content
 * modules, which made those three a DEPENDENCY CYCLE the moment the seam's lazy
 * boundary was counted as an edge:
 *
 *     seam →(dynamic import) roster →(static) law →(static) seam
 *     seam →(dynamic import) roster →(static) seam
 *
 * `tests/architecture/layerBoundaries.test.js` counts `import(` specifiers as
 * graph edges (it must — a dynamic edge is still a real dependency), so those
 * two directed loops formed one strongly-connected component of size 3 and the
 * shrink-only cycle ratchet went RED. Its failure message names the cure and
 * forbids the cheap one: "route the offending import through a dependency-free
 * leaf, the deityConstants.js pattern … Never extend the list to pass."
 *
 * ⭐ THE SEAM'S DYNAMIC EDGE IS THE ONE EDGE THAT COULD NOT MOVE, so the cut had
 * to be made on the other three. Every symbol the seam SHARED with its two
 * siblings lives here now; the seam keeps only the loader half. The resulting
 * graph is acyclic — seam → this leaf, law → this leaf, roster → this leaf,
 * roster → law, seam →(dynamic) roster — and no allowlist row was spent.
 *
 * ⛔ MOVED, NOT COPIED — the single-writer law. There is exactly ONE definition
 * of each symbol below in the estate. A second, drifting copy of
 * `_livingContentLawVersion` is precisely what the seam's own header set out to
 * prevent when it declared the key in one place, and splitting the file must not
 * quietly undo that. Consumers import from HERE; neither the seam nor the law
 * re-exports these, because a convenience re-export was written first and
 * MEASURED on the law side (the engine chunk grew ~1,047 B on the day the
 * payload is retained, against a three-figure ceiling margin) — see the note in
 * `livingContentLaw.js`. Importing the leaf directly is also the honest edge:
 * this is ENGINE-SIDE vocabulary, not lazy vocabulary.
 *
 * ⛔ AND IT MUST STAY ZERO-IMPORT — A BYTE CONTRACT, NOT TIDINESS. Two things
 * break if a static import is added here. First, the cycle re-opens the moment
 * that target imports anything in this family back. Second, and less obvious:
 * this leaf is generator-reachable (pipeline → seam → here), so it enters
 * `computeEngineSharedDomain()`'s eager closure WITH EVERYTHING IT NAMES.
 * `vite.config.js` excises this file itself from that set — that excision is
 * applied by `.delete()` AFTER the closure is derived, so it removes this ONE
 * fragment and nothing else. Anything this file imported would therefore stay in
 * eager `engine-core` and be charged to FIRST PAINT, against a ceiling whose
 * margin is three figures. The excision keeps the cure free only for as long as
 * this file has nothing behind it. MEASURED at the cure: with the excision in
 * place, all 483 chunks are byte- and content-hash-identical to the pre-cure
 * build; without it, first paint pays +214 B and 112 chunks are re-hashed.
 *
 * Pure. No RNG, no store, no React, no wall clock, no module state.
 *
 * @guarded-by tests/architecture/layerBoundaries.test.js (the cycle ratchet this
 *   file exists to keep green), tests/domain/livingContentLawVersion.test.js and
 *   tests/build/livingContentSeamLazy.test.js.
 */

/** The config key the law rides on. Underscore-prefixed like `_seed`: a
 *  resolved generation input, carried on the persisted `settlement.config`.
 *  Declared HERE, in the dependency-free leaf, so the engine-side gate and the
 *  lazy-side law read one spelling and cannot drift apart. */
export const LIVING_CONTENT_LAW_CONFIG_KEY = '_livingContentLawVersion';

/** The living-content law versions this build can generate under. v1 is the
 *  DORMANT default (absent ⇒ v1 ⇒ byte-identical to every pre-law world and
 *  golden); v2 materializes the inert roster.
 *  @type {ReadonlyArray<number>} */
export const LIVING_CONTENT_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dormant) living-content law version — no roster, no key. */
export const DEFAULT_LIVING_CONTENT_LAW_VERSION = 1;

/** The version the inert living-content roster materializes under. */
export const ROSTER_LIVING_CONTENT_LAW_VERSION = 2;

/**
 * The living-content law version a value selects. Absent / unknown /
 * non-enabled ⇒ the dormant default, so every pre-law world and golden stays
 * byte-identical and a future version cannot be selected by accident before it
 * ships. A CLOSED membership test, not a `>=` compare — fail closed.
 *
 * @param {unknown} value
 * @returns {number}
 */
export function readLivingContentLawVersion(value) {
  const n = Number(value);
  return LIVING_CONTENT_LAW_VERSIONS.includes(n)
    && n !== DEFAULT_LIVING_CONTENT_LAW_VERSION
    ? n
    : DEFAULT_LIVING_CONTENT_LAW_VERSION;
}

/**
 * The living-content law version a generation run obeys, read from its config.
 *
 * ⚠ THIS READS THE CONFIG AND NOTHING ELSE, ON PURPOSE. It must NOT fall back
 * to `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION`: an existing world's persisted
 * config carries no marker, so a dial-derived fallback would silently re-birth
 * every old world under the new law the moment the dial flipped — the exact
 * PROMISE breach the version gate exists to prevent.
 *
 * @param {Record<string, unknown>|null|undefined} config
 * @returns {number}
 */
export function resolveLivingContentLawVersion(config) {
  return readLivingContentLawVersion(config?.[LIVING_CONTENT_LAW_CONFIG_KEY]);
}

/** Does this config's world materialize the inert living-content roster?
 *  @param {Record<string, unknown>|null|undefined} config @returns {boolean} */
export function materializesLivingContent(config) {
  return resolveLivingContentLawVersion(config)
    === ROSTER_LIVING_CONTENT_LAW_VERSION;
}
