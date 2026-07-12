/**
 * spatialArrival.js — the propagation ARRIVAL QUEUE (Phase 5.5 MODULATION item 4).
 *
 * The §3 propagation FRONT, minimal form: a cross-settlement regional impact no
 * longer lands the instant it is derived — it TRAVELS, arriving hopWeeks() later.
 * This pure module is the in-transit ledger the kernel rides (the conquestFeeds
 * read-last/write-next pattern): under the spatial-canon marker, applyWorldPulse
 * PARKS each cross-settlement impact here keyed by impact id with an arrivalTick,
 * and at each tick start DRAINS the due ones back into the regional queue — where
 * the existing machinery materializes them + dates their Wizard News at ARRIVAL.
 *
 * Shape (a conditionally-materialized worldState ledger, OBJECT-keyed so the
 * CONDITIONAL_LEDGER_KEYS deep-clone accepts it — arrays are rejected there):
 *   worldState.spatialArrivals = { [impactId]: { arrivalTick, targetId, sourceId, impact } }
 * Absent whenever nothing is in transit ⇒ dormant / byte-identical off the spatial
 * path (an aspatial campaign never materializes the key).
 *
 * DETERMINISM: latency is pure integer ARITHMETIC (hopWeeks) — no rolls. Draining
 * is codepoint-sorted by impact id (stable application order). LOCAL (same-
 * settlement) effects are NEVER delayed (§2.3: arrival delay is cross-settlement
 * only); unmapped / unreachable pairs pass through to the aspatial queue.
 *
 * PURE + lazy: imported only by the (dynamically-loaded) sim, and it pulls just
 * the light distanceRead reader — never the digest BUILDER — so it adds no first-
 * paint weight.
 */

import { hopWeeks } from './distanceRead.js';

/**
 * A regional impact as it travels (only the fields the queue reads; the full shape
 * lives in region/propagation.js).
 * @typedef {{ id?: string, sourceSettlementId?: string, targetSettlementId?: string,
 *   delayTicks?: number, status?: string, [k: string]: unknown }} TravellingImpact
 * @typedef {{ arrivalTick: number, targetId: string, sourceId: string, impact: TravellingImpact }} ArrivalEntry
 * @typedef {Record<string, ArrivalEntry>} ArrivalLedger
 */

// Hard cap on simultaneously in-transit impacts (expiry/limit, per §2.2). If a
// park would exceed it, the FARTHEST-arriving entries are dropped so the soonest
// (most relevant) arrivals always survive — bounds save size under a pathological
// fan-out. Generous: a normal tick parks a handful.
export const SPATIAL_ARRIVAL_MAX = 256;

/** @param {unknown} v @returns {ArrivalLedger} */
function asObject(v) {
  return /** @type {ArrivalLedger} */ (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
}

/**
 * Park this tick's freshly-derived impacts. Cross-settlement, mapped, reachable
 * impacts are delayed by hopWeeks (arrivalTick = tick + weeks); everything else
 * (LOCAL same-settlement, unmapped, or unreachable) is returned in `passthrough`
 * for the caller to queue immediately (the aspatial behaviour).
 *
 * @param {ArrivalLedger|undefined} current   worldState.spatialArrivals (or undefined)
 * @param {Array<TravellingImpact>} impacts   the impacts derived this tick
 * @param {{ digest: import('./distanceRead.js').SpatialDigest, tick:number }} ctx
 * @returns {{ next: ArrivalLedger, passthrough: Array<TravellingImpact> }}
 */
export function parkArrivals(current, impacts, { digest, tick }) {
  const next = { ...asObject(current) };
  /** @type {Array<TravellingImpact>} */
  const passthrough = [];
  const now = Number.isFinite(tick) ? Math.floor(tick) : 0;
  // Deterministic scan order (codepoint by impact id) so a limit-eviction is
  // reproducible regardless of the caller's impact ordering.
  const ordered = (Array.isArray(impacts) ? impacts.slice() : [])
    .filter((i) => i && i.id != null)
    .sort((a, b) => (String(a.id) < String(b.id) ? -1 : String(a.id) > String(b.id) ? 1 : 0));

  for (const impact of ordered) {
    const sourceId = impact.sourceSettlementId == null ? null : String(impact.sourceSettlementId);
    const targetId = impact.targetSettlementId == null ? null : String(impact.targetSettlementId);
    // LOCAL effect (or a malformed impact) ⇒ no travel time ⇒ aspatial passthrough.
    if (sourceId == null || targetId == null || sourceId === targetId) {
      passthrough.push(impact);
      continue;
    }
    const weeks = hopWeeks(digest, sourceId, targetId);
    // Unmapped / unreachable pair ⇒ null ⇒ keep the aspatial instant path.
    if (weeks == null || weeks <= 0) {
      passthrough.push(impact);
      continue;
    }
    // Release-ready copy: delayTicks 0 so a drained impact is immediately available
    // (the arrival tick, not a residual per-hop count, is what gated it).
    next[String(impact.id)] = {
      arrivalTick: now + weeks,
      targetId,
      sourceId,
      impact: { ...impact, delayTicks: 0, status: 'queued' },
    };
  }

  return { next: enforceLimit(next), passthrough };
}

/**
 * Drain every arrival due at `tick` (arrivalTick <= tick), in codepoint id order.
 * @param {ArrivalLedger|undefined} current worldState.spatialArrivals (or undefined)
 * @param {number} tick
 * @returns {{ next: ArrivalLedger, due: Array<TravellingImpact> }} due = the released impacts.
 */
export function drainDueArrivals(current, tick) {
  const src = asObject(current);
  const now = Number.isFinite(tick) ? Math.floor(tick) : 0;
  /** @type {ArrivalLedger} */
  const next = {};
  /** @type {Array<TravellingImpact>} */
  const due = [];
  for (const key of Object.keys(src).sort()) {
    const entry = src[key];
    const arrivalTick = Number(entry?.arrivalTick);
    if (Number.isFinite(arrivalTick) && arrivalTick <= now && entry?.impact) {
      due.push(entry.impact);
    } else {
      next[key] = entry;
    }
  }
  return { next, due };
}

/**
 * Bound the ledger to SPATIAL_ARRIVAL_MAX entries, keeping the SOONEST-arriving
 * (ties broken by codepoint id). Pure; returns the same object when under cap.
 * @param {ArrivalLedger} ledger
 */
export function enforceLimit(ledger) {
  const keys = Object.keys(ledger);
  if (keys.length <= SPATIAL_ARRIVAL_MAX) return ledger;
  const kept = keys
    .sort((a, b) => {
      const ta = Number(ledger[a]?.arrivalTick) || 0;
      const tb = Number(ledger[b]?.arrivalTick) || 0;
      return ta !== tb ? ta - tb : (a < b ? -1 : a > b ? 1 : 0);
    })
    .slice(0, SPATIAL_ARRIVAL_MAX)
    .sort(); // re-sort by key so the stored object is codepoint-ordered (byte-stable)
  /** @type {ArrivalLedger} */
  const out = {};
  for (const k of kept) out[k] = ledger[k];
  return out;
}
