/**
 * lib/pricingLens.js — lightweight, deterministic, privacy-light LENS inference
 * for the funnel (UX Phase 9, plan §3.3).
 *
 * The plan asks for "a lightweight lens inference (from chosen size / slider use
 * / whether the map was opened) that tailors the moment copy + the default
 * altitude." This module is that inference — and ONLY that. It is:
 *
 *   - PURE: a plain function of a small signal bag. No store, no React, no
 *     network, no wall clock, no rng. The same signals always yield the same
 *     lens (deterministic → testable, cacheable, safe to run anywhere).
 *   - PRIVACY-LIGHT: it reads only coarse, already-local product signals (the
 *     size the user picked, whether they touched a slider, whether they opened
 *     the map). No identity, no content, no history is consulted.
 *
 * The lens it produces is the SAME three-way axis the rest of the funnel speaks
 * (new / intermediate / worldbuilder — see useReaderAudience.js). useReaderAudience
 * derives it from ACCOUNT behavior (saves/exports/narrate); this module derives a
 * fast PRE-ACCOUNT guess from in-session config signals so an anon visitor gets a
 * tailored pitch + a sensible default altitude before they've saved anything.
 *
 * Two outputs the funnel consumes:
 *   - inferPricingLens(signals)  → 'new' | 'intermediate' | 'worldbuilder'
 *   - lensDefaultAltitude(lens)  → 'guided' | 'standard' | 'expert' (the
 *                                  default progressive-disclosure rung — §3.2)
 *   - lensMomentReason(systemHint, lens) → which simulation-intent pricing
 *                                  moment best fits a reach toward a system,
 *                                  given the lens (tailors the moment copy).
 */

/** @typedef {'new' | 'intermediate' | 'worldbuilder'} PricingLens */

// The settlement-size tiers in ascending scale. A worldbuilder reaches for the
// big sizes; a new DM picks a town. Used to bucket the chosen size.
const SIZE_RANK = Object.freeze({
  thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5,
});

/**
 * Infer the reader lens from coarse, in-session, privacy-light config signals.
 * Deterministic: identical signals → identical lens.
 *
 * Signal weighting (intentionally simple — this is a HINT, not a profile):
 *   - Opening the map is the strongest worldbuilder tell (regional intent).
 *   - Reaching for a city/metropolis OR touching the sliders signals a hands-on
 *     DM who wants control → at least intermediate, worldbuilder if combined.
 *   - Everything else (a town, defaults untouched, map unopened) → new.
 *
 * @param {Object} [signals]
 * @param {string}  [signals.chosenSize]   the picked settlement size tier id.
 * @param {boolean} [signals.touchedSliders] did the user move a priority slider?
 * @param {boolean} [signals.openedMap]     did the user open the World Map / Realm?
 * @returns {PricingLens}
 */
export function inferPricingLens(signals = {}) {
  const { chosenSize, touchedSliders = false, openedMap = false } = signals || {};
  const sizeRank = Object.prototype.hasOwnProperty.call(SIZE_RANK, String(chosenSize))
    ? SIZE_RANK[String(chosenSize)]
    : -1;

  const reachedBig = sizeRank >= SIZE_RANK.city;     // city or metropolis
  const handsOn = touchedSliders || reachedBig;       // wants control

  // Opening the map is regional intent. Paired with any hands-on signal it's a
  // worldbuilder; on its own it's still a strong regional lean → worldbuilder
  // (the map IS the regional surface).
  if (openedMap) return 'worldbuilder';

  // Hands-on but map-unopened: a power-leaning DM who hasn't gone regional yet.
  if (handsOn) return 'intermediate';

  return 'new';
}

/**
 * The default progressive-disclosure altitude for a lens (§3.2). A new DM lands
 * at Overview (guided); an intermediate at Detail (standard); a worldbuilder at
 * Engine (expert). The user's explicit choice always overrides this — it is only
 * the INFERRED default before they pick.
 *
 * @param {PricingLens} lens
 * @returns {'guided' | 'standard' | 'expert'}
 */
export function lensDefaultAltitude(lens) {
  switch (lens) {
    case 'worldbuilder': return 'expert';
    case 'intermediate': return 'standard';
    default:             return 'guided';
  }
}

// The simulation-intent moments, keyed by the system a non-premium user reached
// toward. These are the reasons the pricingMoments registry resolves copy for.
const SYSTEM_MOMENT = Object.freeze({
  advance:  'first_advance_attempt',
  war:      'war_layer_curiosity',
  pantheon: 'pantheon_preview',
  realm:    'map_realm_teaser',
});

/**
 * Which pricing-moment reason fits a reach toward a simulation system, tailored
 * by lens. A worldbuilder who reaches for the map gets the realm teaser; a
 * new/intermediate DM who pokes "advance time" gets the advance moment. The
 * mapping is deterministic — the lens only RESOLVES ambiguity, it never invents
 * a system the user didn't reach for.
 *
 * @param {'advance'|'war'|'pantheon'|'realm'} systemHint  the system reached toward.
 * @param {PricingLens} [lens]  the inferred lens (tailors only the realm/advance
 *                              split — a worldbuilder's generic realm reach pitches
 *                              the realm; everyone else's pitches the concrete system).
 * @returns {string} a moment reason key in COPY.pricing.moments, or '' when unknown.
 */
export function lensMomentReason(systemHint, lens = 'new') {
  if (Object.prototype.hasOwnProperty.call(SYSTEM_MOMENT, String(systemHint))) {
    return SYSTEM_MOMENT[String(systemHint)];
  }
  // An unspecified reach defaults to the broad realm teaser for a worldbuilder
  // (regional framing) and stays empty otherwise (no moment without a system).
  return lens === 'worldbuilder' ? SYSTEM_MOMENT.realm : '';
}
