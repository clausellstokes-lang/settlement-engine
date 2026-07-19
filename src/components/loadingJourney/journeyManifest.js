/**
 * journeyManifest.js — THE LOADING JOURNEYS media map (Slice C2L).
 *
 * Pure data: the per-leg video URLs, per-stop still URLs, and the tier→legs
 * mapping for the generation loading film. Everything derives from the canonical
 * TIER_ORDER (copy law: tier names from config, zero hand-typed tier strings) —
 * the sole hand-typed literal is ORIGIN ('desk'), the pre-tier starting frame of
 * the growth film, which is not a settlement tier and has no config home.
 *
 * The URLs are STRINGS pointing at static assets under public/media/ — the media
 * is NEVER imported into JS (Slice C2 engineering law #6). This module is reached
 * only by the lazy loading-surface chunks (PipelineReveal is React.lazy in
 * GenerateWizard; the realm film is React.lazy), so it adds ZERO eager bytes
 * (enforced by tests/build/loadingJourneyLazy.test.js).
 *
 * Media sets (owner ruled BOTH ship to the taste walk; the toggle switches at
 * runtime; the losing set is deleted at the walk ruling):
 *   - 'bg'      : six 5.04s legs (CRF 25-27, ~42 MB, all-keyframe 121/121 I)
 *   - 'journey' : six 2.5s  legs (CRF 23,    ~10 MB, all-keyframe  60/60 I)
 * Both under public/media/journey-legs/<set>/, filenames identical between sets.
 */

import { TIER_ORDER } from '../../data/constants.js';

// Load-bearing fingerprint minted by the film layer (rendered as a data-attribute
// so it survives minification). The lazy ratchet (tests/build/loadingJourneyLazy.test.js)
// asserts this string is ABSENT from the entry's transitive static closure — i.e.
// the conductor never reaches first paint (Slice C2 engineering law #2, ZERO EAGER JS).
export const JOURNEY_FILM_FINGERPRINT = '::loading-journey:v1:';

// The growth film's stages, in play order: the desk (origin, pre-settlement)
// then every settlement tier. ORIGIN is the one literal the config can't supply.
export const ORIGIN = 'desk';
export const JOURNEY_STAGES = Object.freeze([ORIGIN, ...TIER_ORDER]);

// The two produced media sets. Keys are the public/ subdirectory names.
export const JOURNEY_SETS = Object.freeze(['bg', 'journey']);

const MEDIA_ROOT = '/media/journey-legs';

/**
 * legsForTier(tier) — how many travel legs a settlement of this tier plays.
 * desk→thorp is leg 1, thorp→hamlet leg 2, … city→metropolis leg 6. A hamlet
 * order plays legs 1–2; a metropolis plays all six. Unknown/undefined tier →
 * the full journey (6), so the film degrades to the complete growth arc rather
 * than nothing.
 */
export function legsForTier(tier) {
  const i = TIER_ORDER.indexOf(tier);
  return i < 0 ? TIER_ORDER.length : i + 1;
}

/**
 * legVideoUrl(set, n) — URL of travel leg n (1-based). Leg n travels from
 * JOURNEY_STAGES[n-1] to JOURNEY_STAGES[n], matching the produced filenames
 * (leg-1-desk-to-thorp.mp4 … leg-6-city-to-metropolis.mp4).
 */
export function legVideoUrl(set, n) {
  const from = JOURNEY_STAGES[n - 1];
  const to = JOURNEY_STAGES[n];
  return `${MEDIA_ROOT}/${set}/leg-${n}-${from}-to-${to}.mp4`;
}

/**
 * stopStillUrl(set, stopIndex) — URL of the crisp stop still at stopIndex
 * (0 = desk … 6 = metropolis), matching the produced filenames
 * (still-0-desk.jpg … still-6-metropolis.jpg). These are THE FLOOR — the
 * complete journey renders from stills alone with the film entirely absent.
 */
export function stopStillUrl(set, stopIndex) {
  return `${MEDIA_ROOT}/${set}/still-${stopIndex}-${JOURNEY_STAGES[stopIndex]}.jpg`;
}
