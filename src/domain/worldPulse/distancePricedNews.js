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

/** The route-status impedance: at full endpoint embattlement (level 1) a news path's distance
 *  surcharge is scaled UP by this factor (1.0 ⇒ the delay roughly doubles). Owner-retunable
 *  (soak); a named, frozen constant so the tuning has one home. */
export const ROUTE_IMPEDANCE_FACTOR = 1.0;

/** @param {number} x @returns {number} 0..1 */
function clamp01local(x) { return x > 1 ? 1 : x < 0 ? 0 : x; }

/**
 * V-24b PER-ROUTE RE-PROPAGATION — the ROUTE-STATUS-AWARE distance surcharge. The geometric
 * hopDelayTicks REACTS to route transitions: when the origin or observer settlement is embattled
 * (a route severed by siege/blockade), the news path is impeded and the surcharge RISES; when the
 * route opens (embattlement clears), it falls back to the geometric value. Because it is recomputed
 * on EVERY read, an IN-FLIGHT rumor re-prices tick-to-tick as routes transition — no new mover, no
 * stored cost to re-stamp (it rides the existing per-read call). `embattlementOf(id)` yields a
 * settlement's 0..1 embattlement level; ABSENT or all-calm ⇒ EXACTLY hopDelayTicks (the
 * byte-identical geometric case — the calm-route pin). Monotone non-decreasing in embattlement;
 * bounded (≤ base × (1 + ROUTE_IMPEDANCE_FACTOR)). Pure; no rng, no wall clock.
 *
 * HONEST SCOPE: the route-status signal is the ENDPOINT embattlement (the settlements the news
 * travels between). A full believed-path read (an intermediate hop severed while both endpoints
 * stay calm) is a recorded follow-on; endpoints capture the common case — a besieged/blockaded
 * settlement impedes its own news — and react to every embattlement enter/exit + blockade set/clear
 * transition (embattlementLevel already folds the blockade pressure into a settlement's level).
 *  @param {import('../spatial/distanceRead.js').SpatialDigest | null | undefined} digest
 *  @param {string} originId @param {string} observerId
 *  @param {((id: string) => number) | null | undefined} embattlementOf  sid → 0..1 level, or null
 *  @returns {number} integer ≥ 0 */
export function routeAwareHopDelayTicks(digest, originId, observerId, embattlementOf) {
  const base = hopDelayTicks(digest, originId, observerId);
  if (base <= 0 || typeof embattlementOf !== 'function') return base;
  const emb = Math.max(
    clamp01local(Number(embattlementOf(originId)) || 0),
    clamp01local(Number(embattlementOf(observerId)) || 0),
  );
  if (emb <= 0) return base; // calm route ⇒ geometric (byte-identical)
  // ROUND (not floor) so a meaningfully-severed route (emb ≳ 0.5/base) actually re-prices — a
  // floor would swallow the reactivity for near-ish origins (base 1). Bounded at base×FACTOR.
  return base + Math.round(base * emb * ROUTE_IMPEDANCE_FACTOR);
}
