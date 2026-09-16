/**
 * domain/display/tradeFlowEconomics.js — the FLOW-DERIVED ECONOMICS read-model
 * (Phase 5.5 mover wave M6d). The economics tab's LIVE trade-dependency drift,
 * derived from MEASURED PHYSICAL FLOW (the arrivals tally), as a pure selector.
 *
 * ── GENERATION IS SACRED (the ruling, round 22.2). ───────────────────────────
 * The seeded exports / imports / prosperity / tradeDependencies on economicState
 * are the BYTE-IDENTICAL BASELINE. This selector NEVER mutates them and NEVER
 * replaces them — it reads the windowed arrivals tally (spatial/tradeFlow.js) and
 * returns a DRIFT MODIFIER the tab renders BESIDE the baseline. The economicState
 * passed in is read-only; nothing is written back.
 *
 * ── THE DORMANCY SHAPE (copied from settlementRumors.js). ────────────────────
 * Marker off / opt-in off / no measured flow ⇒ no `tradeFlow` sub-ledger (the
 * kernel's double gate never wrote it) ⇒ this selector returns NULL ⇒ the tab
 * renders TODAY's generation-time reads BYTE-IDENTICALLY. An ISOLATED settlement
 * (no caravans / docks / airship / teleport reach it) is autarky: no tally entry
 * ⇒ null ⇒ zero live drift. Blockade / winter / quarantine become economically
 * real for free (arrivals stop → the tally decays → the entry drops → null again).
 *
 * NO NUMERIC PRICES — the drift is QUALITATIVE only (the M6a commodityBand
 * vocabulary: shortage / adequate / surplus, plus plain inbound/outbound texture
 * words). The raw tally counts never surface.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent / garbage ledgers. Strict-clean; zero any-casts.
 */

import { getSpatialLedger } from '../spatial/distanceRead.js';
import { throughputBand, flowMagnitudeBand, FLOW_BANDS, TRADE_FLOW_TUNING } from '../spatial/tradeFlow.js';

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {number} non-negative finite */
function nonNeg(v) {
  const n = finiteNumber(v, 0);
  return n > 0 ? n : 0;
}
/** @param {unknown} v @returns {number} array length, or 0 */
function len(v) {
  return Array.isArray(v) ? v.length : 0;
}

// The economicState fields this read-model consults — GENERATION baseline, read
// ONLY (never mutated). Trade-dependence is derived from the seeded trade profile.
/** @typedef {{ primaryImports?: unknown, primaryExports?: unknown,
 *   tradeDependencies?: unknown, tradeLinks?: unknown }} EconomicBaseline */

/**
 * Is this settlement TRADE-DEPENDENT at generation? — it imports, exports, or
 * carries a recorded trade dependency. A self-sufficient town (none of these) reads
 * measured flow as pure upside, never a shortage. Pure read of the baseline.
 * @param {EconomicBaseline | null | undefined} eco
 * @returns {boolean}
 */
export function isTradeDependent(eco) {
  const e = eco || {};
  return len(e.primaryImports) > 0 || len(e.primaryExports) > 0
    || len(e.tradeDependencies) > 0 || len(e.tradeLinks) > 0;
}

// The human label + in-world sentence per band — the drift's dependency reading.
const BAND_COPY = Object.freeze({
  shortage: {
    label: 'Trade choked',
    dependency: 'strained',
    headline: 'The roads have gone quiet — little reaches the markets, and what the town depends on is not arriving.',
  },
  adequate: {
    label: 'Trade steady',
    dependency: 'met',
    headline: 'Caravans keep to their rounds — trade moves at its accustomed pace.',
  },
  surplus: {
    label: 'Trade brisk',
    dependency: 'abundant',
    headline: 'The roads are busy — caravans arrive thick and depart laden, and the markets are well-fed.',
  },
});

/**
 * The LIVE flow-derived trade-dependency drift for a settlement, or NULL when there
 * is no measured flow (dormant / isolated / decayed-away ⇒ the tab renders the
 * generation baseline byte-identically). A DRIFT MODIFIER — never a replacement.
 *
 * @param {Object} args
 * @param {{ tick?: number, spatialLedgers?: unknown } | null | undefined} args.worldState
 * @param {EconomicBaseline | null | undefined} args.economicState  the GENERATION
 *   baseline — read only, NEVER mutated.
 * @param {unknown} args.settlementId
 * @returns {{ band: 'shortage'|'adequate'|'surplus', label: string,
 *   dependency: 'strained'|'met'|'abundant', inbound: 'quiet'|'trickle'|'steady'|'busy',
 *   outbound: 'quiet'|'trickle'|'steady'|'busy', headline: string,
 *   tradeDependent: boolean } | null}
 */
export function flowDerivedDependency({ worldState, economicState, settlementId } = /** @type {never} */ ({})) {
  if (settlementId == null) return null;
  const ledger = /** @type {Record<string, { in?: unknown, out?: unknown }> | undefined} */ (
    getSpatialLedger(worldState, 'tradeFlow'));
  if (!ledger || typeof ledger !== 'object' || Array.isArray(ledger)) return null;
  const rec = ledger[String(settlementId)];
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return null;

  const inflow = nonNeg(rec.in);
  const outflow = nonNeg(rec.out);
  // Below EPS the entry is autarky-quiet (the kernel prunes these, but a stale read
  // fails closed too): no meaningful live drift ⇒ the baseline stands alone.
  if (inflow + outflow < TRADE_FLOW_TUNING.EPS) return null;

  const tradeDependent = isTradeDependent(economicState);
  const band = throughputBand(inflow, outflow, tradeDependent);
  const copy = BAND_COPY[band] || BAND_COPY[FLOW_BANDS.ADEQUATE];
  return {
    band,
    label: copy.label,
    dependency: /** @type {'strained'|'met'|'abundant'} */ (copy.dependency),
    inbound: flowMagnitudeBand(inflow),
    outbound: flowMagnitudeBand(outflow),
    headline: copy.headline,
    tradeDependent,
  };
}

/**
 * Panel-presence gate: does this world carry ANY measured trade flow? Dormant /
 * quiet ⇒ false ⇒ the live-flow section never renders ⇒ byte-identical tab.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function hasTradeFlow(worldState) {
  const ledger = getSpatialLedger(worldState, 'tradeFlow');
  return !!ledger && typeof ledger === 'object' && !Array.isArray(ledger)
    && Object.keys(ledger).length > 0;
}
