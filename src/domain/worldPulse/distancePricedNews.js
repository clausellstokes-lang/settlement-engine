/**
 * distancePricedNews.js — D1 (DESIGN_SIM_DEPTH_R2 D1): the pure distance→staleness
 * math, factored into a tiny leaf so BOTH the belief engine (beliefMap) and the
 * rumor DISPLAY (settlementRumors) share one source of truth WITHOUT the display
 * pulling in the whole belief engine. Imports only the light `hopWeeks` reader.
 *
 * Information pays for distance the way grain does: a fact about a FAR origin reads
 * STALER to a distant observer. This is an ADDITIVE recency surcharge on top of the
 * existing rumor-relay latency (rumorNetwork already stamps arrivalTick += hopWeeks
 * per graph hop) — the design's explicit `effective age = actual age + hopDelayTicks
 * (dist(O,S))`, applied ONCE per consuming path. Gated by the VIRTUAL flag
 * `distancePricedNewsEnabled` at the call sites (the gate lives with beliefsActive in
 * beliefMap; absent ⇒ dark EVERYWHERE ⇒ byte-identical). Pure; no rng, no wall clock.
 */

import { hopWeeks } from '../spatial/distanceRead.js';

/** News runs faster than caravans by this factor: hopDelayTicks = floor(hopWeeks(O,S)
 *  × NEWS_SPEED_FACTOR). 0.5 ⇒ word travels twice as fast as goods. Owner-retunable
 *  (soak); a named, frozen constant so the tuning has one home. */
export const NEWS_SPEED_FACTOR = 0.5;

/** The additive information-age surcharge (in ticks = weeks) for a fact about origin
 *  `originId` reaching observer `observerId`, off the frozen digest's distance matrix.
 *  Same settlement / adjacent ⇒ 0 (floor(≤1 week × 0.5) = 0 — the adjacent-adds-nothing
 *  pin); unreachable/unmapped (hopWeeks null) ⇒ 0 (no path ⇒ no surcharge — the
 *  mappedDistanceWeight no-op discipline); monotone non-decreasing in distance (pin 3).
 *  @param {import('../spatial/distanceRead.js').SpatialDigest | null | undefined} digest
 *  @param {string} originId @param {string} observerId @returns {number} integer ≥ 0 */
export function hopDelayTicks(digest, originId, observerId) {
  if (!digest || String(originId) === String(observerId)) return 0;
  const weeks = hopWeeks(digest, String(originId), String(observerId));
  if (weeks == null || !(weeks > 0)) return 0;
  return Math.floor(weeks * NEWS_SPEED_FACTOR);
}
