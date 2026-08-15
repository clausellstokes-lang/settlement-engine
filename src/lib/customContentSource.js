/**
 * lib/customContentSource.js — the EAGER seam between the store and the LAZY
 * custom-content registry (the de-eager lane, 2026-07-19).
 *
 * dependencyEngine.js + customRegistry.js (~41 KB minified with stressTypesMeta)
 * used to ride the first-paint closure solely because the store wired
 * setCustomContentSource at boot and the slice invalidated the registry cache
 * after cloud syncs. This tiny zero-dependency module inverts both edges so the
 * registry code loads ON DEMAND (first generation / Compendium open / deity
 * assignment) instead of before first paint:
 *
 *   • the store registers its customContent GETTER here at boot;
 *     dependencyEngine reads it from here when it (lazily) loads.
 *   • dependencyEngine registers its cache INVALIDATOR here when it loads;
 *     the slice calls invalidateCustomDepsIfLoaded() after cloud syncs. Before
 *     the module has loaded there is NO cache to invalidate, so the no-op is
 *     exact — the registry's first build always reads the current source.
 *
 * PURITY: no store/React/registry imports in either direction — the seam must
 * stay a leaf or it would drag the registry straight back into first paint
 * (the eager entry statically imports THIS file; the lazy registry chunk
 * statically imports it too, which is the safe lazy→eager edge direction).
 * @enforced-by tests/build/customRegistryLazy.test.js (registry absent from the
 *   entry closure) + tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 */

/** @type {() => any} */
let _getter = () => ({});
/** @type {(() => void) | null} */
let _invalidate = null;

/**
 * Wire the global custom-content source. Called once at app startup (store
 * init) with a function returning the live store's customContent slice. Also
 * invalidates the registry cache when the registry module is already loaded
 * (a re-wire must not leave a stale registry built from the old source).
 * @param {(() => any) | null | undefined} getter
 */
export function setCustomContentSource(getter) {
  _getter = typeof getter === 'function' ? getter : () => ({});
  if (_invalidate) _invalidate();
}

/** The current source getter (read by dependencyEngine on each registry build).
 *  @returns {() => any} */
export function getCustomContentSource() {
  return _getter;
}

/**
 * dependencyEngine self-registers its cache invalidator here on (lazy) load.
 * @param {() => void} fn
 */
export function registerCustomDepsInvalidate(fn) {
  _invalidate = typeof fn === 'function' ? fn : null;
}

/**
 * Invalidate the (lazy) registry cache IF the registry module has loaded.
 * Exact by construction: before the module loads there is no cache, and its
 * first build reads the live source — so skipping is not a stale-read risk.
 */
export function invalidateCustomDepsIfLoaded() {
  if (_invalidate) _invalidate();
}
