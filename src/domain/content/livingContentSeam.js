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
 * What stays behind is this file: the version gate, a one-slot registry, and the
 * loader.
 *
 * ⭐ THE DARK PATH LOADS NOTHING AND CANNOT DIVERGE. `livingContentRosterFor`
 * tests the law FIRST and returns the same `null` a run with no pack returns, so
 * a v1 world — which is every world the product mints today — never touches the
 * registry, never awaits anything, and is byte-identical to a world generated
 * before this law existed. The seam is therefore invisible to same-seed output
 * while the dial is dark, and that is provable rather than argued: the dormant
 * corpus hash is unchanged.
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
 *   the engine ceiling) and tests/domain/livingContentSeam.test.js.
 */

/** The config key the law rides on. Underscore-prefixed like `_seed`: a
 *  resolved generation input, carried on the persisted `settlement.config`.
 *  Declared HERE, not in `livingContentLaw.js`, so the engine-side gate and the
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

/** @type {((customContent:unknown, config:unknown) => unknown)|null} */
let rosterBuilder = null;

/**
 * Register the lazily-loaded roster builder. Called by `loadLivingContentRoster`
 * and, in tests, directly — so a suite can drive the lit path synchronously
 * without asserting on module-load order.
 *
 * @param {(customContent:unknown, config:unknown) => unknown} builder
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
