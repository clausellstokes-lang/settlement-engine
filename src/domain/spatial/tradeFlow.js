/**
 * tradeFlow.js — Phase 5.5 mover wave M6d: FLOW-DERIVED ECONOMICS (the arrivals
 * tally + the flow bands).
 *
 * The grounded seam (round 22.2): supplyKernel already DISCARDS its arrivals —
 * pulseKernel reads only `supply.changed`, so no throughput count exists anywhere
 * in the tree. THIS module gives those arrivals a home: a SPARSE, WINDOWED
 * (decayed) per-settlement throughput tally — goods IN (a caravan lands) + goods
 * OUT (a caravan its produced departs) — that the M6a commodity kernel writes at
 * its outcome loop, and the display read-model (display/tradeFlowEconomics.js)
 * reads to compute a LIVE trade-dependency DRIFT.
 *
 * ── GENERATION IS SACRED (the ruling). ───────────────────────────────────────
 * This tally is DISPLAY SUBSTRATE ONLY. It never writes economicState — the
 * seeded exports/imports/prosperity/tradeDependencies stay the byte-identical
 * baseline; the drift the display derives from this tally is a MODIFIER on top,
 * never a replacement. Absent tally ⇒ the tab renders the generation baseline
 * verbatim.
 *
 * ── MODALITY-WEIGHTED (a ROSTER read). ───────────────────────────────────────
 * Every mapped settlement receives caravans by LAND (the base weight). Its
 * roster ADDS capacity: a harbour/dock moves goods by sea, an airship dock by
 * air, a teleportation circle instantly — each raises the per-arrival weight
 * (`settlementModalityWeight`). No arrivals reach an isolated settlement ⇒ no
 * measured flow ⇒ autarky (the "no movers ⇒ no live trade effects" law).
 *
 * ── WINDOWED (decayed). ──────────────────────────────────────────────────────
 * Each tick the tally DECAYS toward zero (`DECAY` per elapsed tick) before this
 * tick's weighted arrivals are added, and an entry that decays below `EPS` is
 * PRUNED. So a blockade / winter / quarantine that stops arrivals is
 * economically real for free: the tally fades, the drift fades, and the ledger
 * eventually drops to absent (byte-identical dormancy restored) — no new
 * mechanism required.
 *
 * PURE + LAZY (constitutional). No Date, no Math.random, no mutation, no tier /
 * auth read. A spatial leaf (the lazy engine chunk) — zero first-paint bytes.
 * The tally nests under `spatialLedgers` (distanceRead.js's setSpatialLedger) so
 * it costs ZERO eager bytes; it materializes ONLY under the M6-family double gate
 * (spatial marker AND commodityFlowEnabled — the kernel's gate) and only for
 * settlements that actually move goods (sparse). Codepoint-sorted; drop-when-empty.
 * Strict-clean; zero any-casts.
 */

import { hasSpatialLedger, getSpatialLedger } from './distanceRead.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

// ── Tuning (documented; retuned in the M6d + checkpoint soaks) ────────────────
export const TRADE_FLOW_TUNING = Object.freeze({
  // The per-tick WINDOW decay. A tally halves in ~1.4 ticks; a settlement whose
  // flow stops drains from a steady value to below EPS (pruned) in ~6 ticks — the
  // "blockade → tally decays → drift fades → autarky" envelope. 0<DECAY<1.
  DECAY: 0.6,
  // Prune threshold: an entry whose IN and OUT both fall below this is dropped
  // (sparse, drop-when-empty ⇒ dormant byte-identity when the whole web goes quiet).
  EPS: 0.05,
  // MODALITY weights (the roster read). LAND is the caravan base every mapped
  // settlement carries; the others STACK on top (a port that ALSO has an airship
  // dock moves more). Retunable — the relative ordering is the load-bearing part.
  MODALITY: Object.freeze({ LAND: 1, SEA: 1, AIRSHIP: 1.5, TELEPORT: 2 }),
  // The qualitative throughput bands (windowed, decayed count — NOT a price). Below
  // STRAIN_FLOOR a trade-dependent town reads SHORTAGE (its trade has gone quiet);
  // above ABUNDANT_CEIL it reads SURPLUS (unusually brisk). Between ⇒ ADEQUATE.
  STRAIN_FLOOR: 0.5,
  ABUNDANT_CEIL: 3.0,
  // Inbound / outbound texture bands (a decayed count → a plain word, no number).
  QUIET_MAX: 0.25,
  TRICKLE_MAX: 0.9,
  STEADY_MAX: 2.5,
});

// The qualitative band vocabulary — the SAME words as M6a's commodityBand
// (spatial/commodityFlow.js COMMODITY_BANDS), re-declared here so this leaf's only
// import stays the zero-cost distanceRead accessors (no cross-engine chunk edge).
export const FLOW_BANDS = Object.freeze({ SHORTAGE: 'shortage', ADEQUATE: 'adequate', SURPLUS: 'surplus' });
export const FLOW_MAGNITUDE = Object.freeze({ QUIET: 'quiet', TRICKLE: 'trickle', STEADY: 'steady', BUSY: 'busy' });

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 2-dp round for byte-tidy persisted floats */
function round2(v) {
  return Math.round(finiteNumber(v, 0) * 100) / 100;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @returns {number} non-negative finite */
function nonNeg(v) {
  const n = finiteNumber(v, 0);
  return n > 0 ? n : 0;
}

// ── The MODALITY roster read ──────────────────────────────────────────────────
// Name signals for the transport modalities a settlement's roster can carry. LAND
// (caravans) is universal to any mapped settlement, so it is the base weight and
// needs no signal.
const PORT_RE = /harbou?r|\bdocks?\b|wharf|\bpier\b|\bquay\b|seaport|shipyard|shipwright/i;
const AIRSHIP_RE = /airship/i;
const TELEPORT_RE = /teleport|planar|extradimensional/i;

/** @typedef {{ name?: string }} RosterInstitution */
/** @typedef {{ name?: string, institutions?: RosterInstitution[],
 *   config?: { tradeRouteAccess?: unknown, [k: string]: unknown },
 *   economicState?: { tradeAccess?: unknown, [k: string]: unknown } }} RosterSettlement */

/** Does this settlement's generation/roster state read as a sea port?
 *  @param {RosterSettlement | null | undefined} settlement @returns {boolean} */
function hasSeaPort(settlement) {
  const access = String(settlement?.economicState?.tradeAccess ?? settlement?.config?.tradeRouteAccess ?? '').toLowerCase();
  return access === 'port' || access === 'sea' || access === 'river' || access === 'coastal';
}

/**
 * The per-arrival throughput WEIGHT for a settlement — a pure ROSTER read. LAND is
 * the caravan base (every mapped settlement is on the road network); a harbour/dock,
 * an airship dock, and a teleportation circle each STACK their weight on top. A
 * higher weight means the same number of caravans registers as heavier throughput —
 * a trade hub's flow is felt more than a landlocked hamlet's.
 * @param {RosterSettlement | null | undefined} settlement
 * @returns {number} ≥ MODALITY.LAND
 */
export function settlementModalityWeight(settlement) {
  const M = TRADE_FLOW_TUNING.MODALITY;
  let weight = M.LAND;
  let sea = hasSeaPort(settlement);
  let airship = false;
  let teleport = false;
  // LIVE roster only — a calamity-destroyed harbour / airship dock / teleport circle no
  // longer moves goods, so it must not stack modality throughput weight (ruin-filter class).
  for (const inst of liveInstitutions(settlement)) {
    const n = String(inst?.name || '');
    // Classify each institution to AT MOST one modality — airship / teleport win so an
    // "airship dock" reads as AIR, never SEA (the generic dock/port match is the fallback).
    if (AIRSHIP_RE.test(n)) airship = true;
    else if (TELEPORT_RE.test(n)) teleport = true;
    else if (!sea && PORT_RE.test(n)) sea = true;
  }
  if (sea) weight += M.SEA;
  if (airship) weight += M.AIRSHIP;
  if (teleport) weight += M.TELEPORT;
  return round2(weight);
}

// ── The TALLY step (advance one tick) ─────────────────────────────────────────
/**
 * @typedef {Object} FlowArrival
 * @property {string} destId        the settlement a caravan LANDED at (inbound)
 * @property {string} sourceId      the settlement the caravan came FROM (outbound)
 * @property {number} destWeight    the destination's modality weight (inbound amount)
 * @property {number} sourceWeight  the source's modality weight (outbound amount)
 */

/**
 * @typedef {Object} FlowTallyRecord
 * @property {number} in        the windowed inbound throughput (decayed count)
 * @property {number} out       the windowed outbound throughput (decayed count)
 * @property {number} lastTick  the tick this entry was last advanced (for decay)
 */

/**
 * Advance the per-settlement arrivals tally one tick: DECAY every prior entry by
 * `DECAY^(tick - lastTick)`, ADD this tick's modality-weighted arrivals (inbound at
 * the destination, outbound at the source), PRUNE below EPS, and return the next
 * sparse ledger (codepoint-sorted, drop-when-empty). Pure — the caller owns the
 * double-gate (this runs only when the M6a commodity layer is live) and the arrival
 * list (from the outcome loop). No arrivals + no prior ⇒ { next:null, changed:false }.
 * @param {Object} args
 * @param {{ spatialLedgers?: unknown } | null | undefined} args.worldState
 * @param {number} args.tick
 * @param {FlowArrival[]} [args.arrivals]
 * @returns {{ next: Record<string, FlowTallyRecord> | null, changed: boolean }}
 */
export function advanceTradeFlowTally({ worldState, tick, arrivals = [] }) {
  const T = TRADE_FLOW_TUNING;
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const prior = hasSpatialLedger(worldState, 'tradeFlow')
    ? /** @type {Record<string, FlowTallyRecord>} */ (asObject(getSpatialLedger(worldState, 'tradeFlow')))
    : null;

  /** @type {Map<string, { in: number, out: number }>} */
  const work = new Map();
  // DECAY every prior entry toward zero (robust to skipped ticks via the exponent).
  for (const sid of Object.keys(prior || {})) {
    const rec = asObject(prior?.[sid]);
    const age = Math.max(0, now - Math.floor(finiteNumber(rec.lastTick, now)));
    const factor = T.DECAY ** age;
    work.set(sid, { in: round2(nonNeg(rec.in) * factor), out: round2(nonNeg(rec.out) * factor) });
  }
  // ADD this tick's weighted arrivals: inbound at the destination, outbound at the source.
  for (const a of Array.isArray(arrivals) ? arrivals : []) {
    const dest = a?.destId != null ? String(a.destId) : '';
    const src = a?.sourceId != null ? String(a.sourceId) : '';
    if (dest) {
      const e = work.get(dest) || { in: 0, out: 0 };
      e.in = round2(e.in + nonNeg(a.destWeight));
      work.set(dest, e);
    }
    if (src) {
      const e = work.get(src) || { in: 0, out: 0 };
      e.out = round2(e.out + nonNeg(a.sourceWeight));
      work.set(src, e);
    }
  }
  // Build the next ledger: prune below EPS, codepoint-sorted keys, stamp lastTick.
  /** @type {Record<string, FlowTallyRecord>} */
  const next = {};
  for (const sid of [...work.keys()].sort()) {
    const e = work.get(sid);
    if (!e || (e.in < T.EPS && e.out < T.EPS)) continue;
    next[sid] = { in: e.in, out: e.out, lastTick: now };
  }
  const nextOrNull = Object.keys(next).length ? next : null;
  const changed = JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull);
  return { next: changed ? nextOrNull : (prior && Object.keys(prior).length ? prior : null), changed };
}

// ── The qualitative bands (no numeric prices) ─────────────────────────────────
/**
 * A decayed windowed count → a plain in-world word for how much is moving. Pure.
 * @param {number} value @returns {'quiet'|'trickle'|'steady'|'busy'}
 */
export function flowMagnitudeBand(value) {
  const T = TRADE_FLOW_TUNING;
  const v = nonNeg(value);
  if (v < T.QUIET_MAX) return FLOW_MAGNITUDE.QUIET;
  if (v < T.TRICKLE_MAX) return FLOW_MAGNITUDE.TRICKLE;
  if (v < T.STEADY_MAX) return FLOW_MAGNITUDE.STEADY;
  return FLOW_MAGNITUDE.BUSY;
}

/**
 * The qualitative TRADE-FLOW band for a settlement — the M6a commodityBand
 * vocabulary (shortage / adequate / surplus), NO numeric price. A TRADE-DEPENDENT
 * town starved of measured throughput reads SHORTAGE (its trade choked); a brisk
 * one reads SURPLUS; between ⇒ ADEQUATE. A self-sufficient town reads its measured
 * flow as pure upside (never a shortage — it does not depend on the roads).
 * @param {number} inflow @param {number} outflow @param {boolean} tradeDependent
 * @returns {'shortage'|'adequate'|'surplus'}
 */
export function throughputBand(inflow, outflow, tradeDependent) {
  const T = TRADE_FLOW_TUNING;
  const throughput = nonNeg(inflow) + nonNeg(outflow);
  if (tradeDependent) {
    if (throughput < T.STRAIN_FLOOR) return FLOW_BANDS.SHORTAGE;
    if (throughput > T.ABUNDANT_CEIL) return FLOW_BANDS.SURPLUS;
    return FLOW_BANDS.ADEQUATE;
  }
  return throughput > T.ABUNDANT_CEIL ? FLOW_BANDS.SURPLUS : FLOW_BANDS.ADEQUATE;
}
