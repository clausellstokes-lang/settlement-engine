/**
 * domain/resolveCulture.js — the ONE culture read.
 *
 * Sibling of domain/resolveTerrain.js, and it exists for the same reason. The
 * engine persists the resolved culture as `config.culture`
 * (generators/steps/resolveConfig.js rolls the `random_culture` sentinel away;
 * generators/steps/assembleSettlement.js writes effectiveConfig to
 * `settlement.config`) and ALSO materializes it at the settlement root as
 * `culturalIdentity.key`. Those two are the whole live surface.
 *
 * ⚠ A top-level `settlement.culture` HAS NO WRITER — not in the generator, not
 * in normalizeSettlement (whose identity lift is still deferred), not in any
 * import path. components/map/PlacementDetailCard.jsx recorded it in prose
 * ("`s.culture` … have no writer at all") and the reader-with-no-writer ratchet
 * carried `culture on settlement` frozen for BOTH jsPDF exporters. So it is not
 * a fallback leg here: reading a key nothing writes is the defect, not the cure.
 *
 * Scattering this chain across call sites is exactly how the campaign PDF and
 * the World Book both ended up printing a blank culture for every settlement the
 * current generator produces. Every culture read goes through here.
 *
 * Canonical vocabulary (CULTURE_OPTIONS + the resolveCultureProfileKey
 * fallback): germanic | latin | celtic | arabic | norse | slavic | east_asian
 * | mesoamerican | south_asian | steppe | greek | mixed
 *
 * ⚠ `settlement._config` is deliberately NOT a leg. It is the RAW pre-resolution
 * config with its sentinels intact (assembleSettlement.js) — reading it is how a
 * random setting gets pinned to its first roll.
 */

/** The UI sentinel resolveConfig rolls away; never a culture. */
const RANDOM_CULTURE_SENTINEL = 'random_culture';

/**
 * Guard a single already-extracted culture value against the `random_culture`
 * UI sentinel. For values that bypass the config chain — e.g. the gallery facet
 * column, whose rows can store the sentinel verbatim.
 * @param {string|null|undefined} value
 * @returns {string|null}
 */
export function cultureOrNull(value) {
  return value && value !== RANDOM_CULTURE_SENTINEL ? String(value) : null;
}

/**
 * Resolve the culture of a settlement config. Pure read.
 * Postcondition: never returns the `random_culture` sentinel.
 * @param {{ culture?: string|null }|null|undefined} config
 * @returns {string|null} the resolved culture, or null when the config carries none.
 */
export function resolveCulture(config) {
  return cultureOrNull((config || {}).culture) || null;
}

/**
 * Resolve the culture of a SETTLEMENT (not a save row — pass `save.settlement`).
 * Tries the resolved config first, then the materialized cultural identity's key,
 * which assembleSettlement stamps on the root for exactly this kind of reader and
 * which survives a config-stripped save.
 * @param {{ config?: object, culturalIdentity?: { key?: string } }|null|undefined} settlement
 * @returns {string|null}
 */
export function resolveSettlementCulture(settlement) {
  const s = settlement || {};
  return resolveCulture(s.config)
    || cultureOrNull(s.culturalIdentity?.key)
    || null;
}
