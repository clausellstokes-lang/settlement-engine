/**
 * commodityFlow.js — Phase 5.5 mover wave M6a: COMMODITY CONTINUITY (round 22.3).
 *
 * The upgrade of M2's supply layer from TIME-denominated buffers to QUANTITY-
 * denominated goods with origin→destination PHYSICAL truth. Goods stop teleporting:
 * a town needing ore gets it from a caravan that travelled from an ore-EXPORTING
 * settlement; that caravan is TAPPED by intermediaries that consume ore along the
 * way; the destination's stockpile drains until the next SOURCED caravan lands; and
 * a producer is no longer an infinite fountain — it holds a FINITE stock that
 * depletes as it ships and refills at a production RATE.
 *
 * THE MODEL (pure; the kernel adapter supplies the live reads):
 *
 *   1. FINITE ORIGIN STOCKS. An exporting settlement produces each good at a RATE
 *      derived from its activeChains (how many chains output the good — the kernel
 *      counts them; `productionRateFor` turns the count into units/week) and holds a
 *      finite stock, capped at a warehouse ceiling. Producing REFILLS the stock;
 *      shipping DRAINS it. A depleted origin (stock below ORIGIN_MIN_AVAILABLE)
 *      cannot supply until it reproduces — the failover walks past it exactly as it
 *      walks past a besieged one.
 *
 *   2. QUANTITY-DENOMINATED STOCKPILES (the M2 buffer, reconciled). Every
 *      (settlement, good) that activeChains produce or consume holds ONE sparse
 *      scalar `stock` — a QUANTITY, not a span of weeks. M2's BUFFER_WEEKS becomes
 *      STOCKPILE_TARGET units at CONSUMPTION_RATE = 1 unit/week, so the quantity IS
 *      the weeks-of-buffer at the reconciliation boundary — the same number, now
 *      generalized to also debit a finite origin and be tapped en route. The
 *      quantity representation REPLACES the time buffer under this layer's gate
 *      (NEVER both): a consumer stock drains CONSUMPTION_RATE/tick and a landed
 *      caravan refills it toward STOCKPILE_TARGET — numerically parallel to M2, so
 *      the reconciliation is a pure re-denomination, no double-count.
 *
 *   3. EN-ROUTE DEPLETION. At arrival a caravan's route is re-scored (deterministic,
 *      the frozen digest); every INTERMEDIARY on that route that CONSUMES the carried
 *      good TAPS it — a bounded draw credited to the intermediary's own stock — so
 *      the carried quantity DROPS at each consuming stop and the destination receives
 *      LESS the more mouths line the road. (Banditry then nicks the remainder — M1's
 *      delivered-fraction, on the quantity.)
 *
 *   4. THE GOODS-CONSERVATION INVARIANT (the M4 pattern applied to goods). Every
 *      tick balances EXACTLY, integer:
 *        before + produced == after + consumed + lost
 *      where before/after = Σ(all stock) + Σ(all in-transit carried) at tick start /
 *      end, produced = Σ realized production, consumed = Σ drawn by consumption, lost
 *      = Σ banditry loss + Σ carried on caravans CUT mid-transit. Integrated from an
 *      empty world this is the spec's `Σproduced + initial == Σin-transit + Σconsumed
 *      + Σstockpiled + Σlost` — with no banditry and no initial it reduces to the
 *      literal `Σproduced == Σin-transit + Σconsumed + Σstockpiled`. Asserted by
 *      `assertGoodsConservation` (dev + the multi-tick fixture pin).
 *
 * NO NUMERIC PRICES (backlog-frozen). Stock levels surface ONLY as the qualitative
 * BANDS shortage / adequate / surplus (`commodityBand`) — a pure helper the existing
 * prosperity/impairment reads consume (a critical input in `shortage` feeds the M2
 * supply_starved impairment) and that M6c/M6d read later for the need-premium + the
 * economics drift. This module builds neither the dispatch EV (M6c) nor the
 * economics read-model (M6d) — only the physical substrate + the band they read.
 *
 * AGGREGATE + SPARSE (the M2 cardinality law holds). ONE caravan record per active
 * link (never per-crate); stock is a sparse scalar materialized ONLY where
 * activeChains actually produce/consume (no dense goods matrix).
 *
 * DORMANCY (constitutional). LIVE only under `commodityFlowActive` — the spatial-
 * canon marker AND the commodity-flow opt-in. Absent EITHER ⇒ this module never
 * runs: the M2 time-buffer path runs verbatim (pre-M6a byte-identity) and an
 * aspatial world is untouched. Both ledgers (`commodityStocks`, `supplyShipments`)
 * nest under the FP-R `spatialLedgers` namespace (setSpatialLedger), so this new
 * layer costs ZERO first-paint bytes.
 *
 * PURE + LAZY: no Date, no Math.random, no mutation of inputs, no tier/auth read. A
 * spatial leaf; the seeded banditry rng is forked from a stable composite key at the
 * call site (`banditry:${linkKey}:${arrivalTick}`), the mutation order is codepoint-
 * sorted, and time is tick-time only.
 */

import { hasSpatialLedger, getSpatialLedger } from './distanceRead.js';
import { chooseRoute, banditryLoss, embattlementLevel } from './embattlement.js';
import { supplyActive, routeIntercepted, routeWeeks, pickSource, starvationReceipt } from './supplyShipments.js';
import { dispatchDecision, appetiteOf, stepAppetite, needPremium, DISPATCH_TUNING } from './dispatchEV.js';
import {
  worstGate, smuggleSuccessChance, smuggleDetected, smugglePipeline, seizureTake,
  goodsResistance, smuggleDispatchWarrant,
} from './smuggle.js';

/** @typedef {import('./distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('./supplyShipments.js').SupplyLink} SupplyLink */

// ── Tuning (documented; retuned in the M6a + checkpoint soaks) ────────────────
// Every constant is NAMED with its game-feel effect so the owner can retune WITHOUT
// a rebuild. The reconciliation anchor (STOCKPILE_TARGET == M2's BUFFER_WEEKS at
// CONSUMPTION_RATE 1) is load-bearing — see the module header.
export const COMMODITY_TUNING = Object.freeze({
  // THE RECONCILIATION ANCHOR. A consumer's stockpile target, in UNITS. Equals M2's
  // BUFFER_WEEKS (8) so that at CONSUMPTION_RATE = 1 unit/week the quantity stock IS
  // the weeks-of-buffer — the M2 buffer re-denominated, never doubled.
  STOCKPILE_TARGET: 8,
  // A consuming link's per-week draw on its stockpile. 1 unit/week keeps the quantity
  // numerically equal to M2's weeks; a coarse tick passes its own week span.
  CONSUMPTION_RATE: 1,
  DEFAULT_TICK_WEEKS: 1,

  // FINITE ORIGIN STOCKS. A producing chain outputs this many units/week; a bare
  // exporter with no explicit producing chain still produces at the FLOOR. Set well
  // above a single consumer's draw so a healthy producer sustains several roads — a
  // finite fountain, not a trickle. The warehouse ceiling is rate × CAP_WEEKS; a new
  // origin starts stocked at the ceiling (cold-start).
  PRODUCTION_PER_CHAIN: 6,
  PRODUCTION_FLOOR: 3,
  ORIGIN_CAP_WEEKS: 6,
  // An origin holding less than this cannot dispatch (depleted — failover walks past
  // it, exactly as past a severed one). Keeps a near-empty origin from minting a
  // 0-unit caravan.
  ORIGIN_MIN_AVAILABLE: 1,

  // A caravan carries at most this many units (one link, one aggregate wagon-train);
  // and a link with a deficit below MIN_SHIP does NOT dispatch (keeps the ledger
  // sparse — no 1-unit top-up caravans; mirrors M4's MIN_COLUMN).
  MAX_SHIP: 12,
  MIN_SHIP: 2,

  // EN-ROUTE DEPLETION. An intermediary that consumes the carried good taps toward
  // its OWN target, capped at TAP_CAP units per stop (a road-side town takes a share,
  // never the whole train), bounded by the caravan's remaining load.
  TAP_CAP: 3,

  // THE ≥2-source co-built brake (inherited from M2 via assessSourceRedundancy on the
  // link): a fragile critical link is flagged, never starved.
  STARVE_AFTER_WEEKS: 1,

  // QUALITATIVE BANDS (no numeric prices). Relative to the (settlement, good) target:
  // below SHORTAGE_FRAC ⇒ shortage; above SURPLUS_FRAC ⇒ surplus; else adequate.
  SHORTAGE_FRAC: 0.35,
  SURPLUS_FRAC: 1.25,
});

// The qualitative band vocabulary (no numeric prices; M6c/M6d read these).
export const COMMODITY_BANDS = Object.freeze({ SHORTAGE: 'shortage', ADEQUATE: 'adequate', SURPLUS: 'surplus' });

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @param {number} fallback @returns {number} integer ≥ 0 */
function intNonNeg(v, fallback) {
  return Math.max(0, Math.floor(finiteNumber(v, fallback)));
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats (M6c ranDanger) */
function round4(v) {
  return Math.round(finiteNumber(v, 0) * 10000) / 10000;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── The activation gate (dormancy / pre-M6a byte-identity seam) ───────────────
/**
 * Commodity continuity is LIVE iff the spatial-canon marker is present AND the
 * commodity-flow opt-in (`simulationRules.commodityFlowEnabled`) is set. The opt-in
 * is what keeps the M2 time-buffer path BYTE-IDENTICAL: a spatial world that has not
 * opted in (the M2 supply tests, every existing spatial canon) runs M2 verbatim, and
 * an aspatial world is untouched. The two representations are gated — one or the
 * other, never both (the M4 origin-loss-proxy discipline).
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function commodityFlowActive(worldState) {
  if (!supplyActive(worldState)) return false;
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).commodityFlowEnabled === true);
}

// ── THE QUALITATIVE BAND (no numeric prices — the M6c/M6d read seam) ──────────
/**
 * The qualitative stock band for a (settlement, good): 'shortage' / 'adequate' /
 * 'surplus' relative to the target. NO numeric price is exposed — this band is the
 * whole economic read this layer surfaces, feeding the existing prosperity/impairment
 * reads and (later) M6c's need-premium + M6d's flow-derived drift. Pure, total.
 * @param {number} stock   the current quantity on hand
 * @param {number} target  the (settlement, good) target (STOCKPILE_TARGET for a
 *   consumer; the warehouse cap for a producer)
 * @returns {'shortage' | 'adequate' | 'surplus'}
 */
export function commodityBand(stock, target) {
  const T = COMMODITY_TUNING;
  const s = Math.max(0, finiteNumber(stock, 0));
  const tgt = Math.max(1, finiteNumber(target, T.STOCKPILE_TARGET));
  if (s < T.SHORTAGE_FRAC * tgt) return COMMODITY_BANDS.SHORTAGE;
  if (s > T.SURPLUS_FRAC * tgt) return COMMODITY_BANDS.SURPLUS;
  return COMMODITY_BANDS.ADEQUATE;
}

// ── FINITE ORIGIN STOCKS — the production rate derived from activeChains ───────
/**
 * The production RATE (units/week) an exporter makes a good at, derived from how many
 * of its activeChains produce that good (the kernel counts the chains whose output /
 * exportable resource is the good). More producing chains ⇒ a faster fountain; a bare
 * exporter with zero matched chains still produces at the FLOOR. Pure.
 * @param {{ producingChainCount?: number }} [inputs]
 * @returns {number} units/week ≥ PRODUCTION_FLOOR
 */
export function productionRateFor({ producingChainCount = 0 } = {}) {
  const T = COMMODITY_TUNING;
  const n = intNonNeg(producingChainCount, 0);
  return Math.max(T.PRODUCTION_FLOOR, n * T.PRODUCTION_PER_CHAIN);
}

/** The warehouse ceiling for an origin producing at `rate` units/week. */
/** @param {number} rate @returns {number} */
export function originStockCap(rate) {
  return Math.max(1, Math.round(Math.max(0, finiteNumber(rate, 0)) * COMMODITY_TUNING.ORIGIN_CAP_WEEKS));
}

// ── The sparse (settlement, good) stock map ───────────────────────────────────
/**
 * Read the sparse stock for a (settlement, good), or a fallback when absent (the
 * cold-start value the caller supplies). Never mutates.
 * @param {Record<string, Record<string, number>> | null | undefined} stocks
 * @param {string} settlementId @param {string} goodId @param {number} [fallback]
 * @returns {number}
 */
export function stockOf(stocks, settlementId, goodId, fallback = 0) {
  const s = asObject(stocks);
  const bySettlement = asObject(s[String(settlementId)]);
  const v = bySettlement[String(goodId)];
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** Set a (settlement, good) stock on a mutable nested map (integer, ≥ 0). */
/** @param {Record<string, Record<string, number>>} stocks @param {string} sid @param {string} gid @param {number} qty */
function setStock(stocks, sid, gid, qty) {
  const s = String(sid);
  const g = String(gid);
  if (!stocks[s]) stocks[s] = {};
  stocks[s][g] = Math.max(0, Math.floor(qty));
}

// ── THE GOODS-CONSERVATION INVARIANT (the M4 pattern applied to goods) ────────
/**
 * @typedef {Object} GoodsAccounting
 * @property {number} before    Σ(all stock) + Σ(in-transit carried) at tick start
 * @property {number} produced  Σ realized production this tick
 * @property {number} after     Σ(all stock) + Σ(in-transit carried) at tick end
 * @property {number} consumed  Σ drawn by consumption this tick
 * @property {number} lost      Σ banditry loss + Σ carried on caravans cut mid-transit
 */

/**
 * The exact per-tick goods-conservation check: before + produced == after + consumed
 * + lost, integers. TRUE by construction (every unit is accounted at every transition
 * — production into stock, arrival split into taps+delivered+loss, consumption out of
 * stock, dispatch stock↔carried). This makes conservation ASSERTABLE (the M6a fixture
 * pins it every tick of a multi-tick run; the kernel can assert it in dev).
 * @param {GoodsAccounting} acc
 * @returns {boolean}
 */
export function assertGoodsConservation(acc) {
  if (!acc || typeof acc !== 'object') return false;
  const before = Math.round(finiteNumber(acc.before, NaN));
  const produced = Math.round(finiteNumber(acc.produced, NaN));
  const after = Math.round(finiteNumber(acc.after, NaN));
  const consumed = Math.round(finiteNumber(acc.consumed, NaN));
  const lost = Math.round(finiteNumber(acc.lost, NaN));
  if ([before, produced, after, consumed, lost].some((n) => !Number.isFinite(n))) return false;
  return before + produced === after + consumed + lost;
}

// ── Ledger typedefs ───────────────────────────────────────────────────────────
/**
 * A producing (settlement, good) source — sparse, one per exported good the
 * activeChains actually make.
 * @typedef {Object} CommodityProducer
 * @property {string} settlementId
 * @property {string} good
 * @property {number} rate   units/week (productionRateFor)
 * @property {number} cap    warehouse ceiling (originStockCap)
 */

/**
 * A consuming link (the M2 SupplyLink identity + the M6a quantity fields). The engine
 * reads the link's live stock from the `commodityStocks` map (cold-starting at
 * `target`), NOT from the M2 time buffer.
 * @typedef {SupplyLink & { target?: number, consumptionRate?: number }} CommodityLink
 */

/**
 * The in-transit caravan record (SUBSUMES the M2 shipment record — same key + fields,
 * plus the carried QUANTITY). One per active link (aggregate; never per-crate).
 * @typedef {Object} CommodityShipment
 * @property {string} institutionId
 * @property {string} settlementId
 * @property {string} input
 * @property {string} sourceId
 * @property {number} arrivalTick
 * @property {number} carried     the QUANTITY on the caravan (drawn from the origin)
 * @property {boolean} starving   TEMPORARY supply-starvation latch (lifts on arrival)
 * @property {number} [ranDanger] M6c: the believed danger this caravan set out into
 *   (only stamped when ≥ RISKY_DANGER_FLOOR — a peaceful record is byte-identical to
 *   M6a). Read at arrival/cut to move the origin's dynamic appetite.
 * @property {boolean} [smuggle] M7: this caravan is a SMUGGLE run — the criminal channel
 *   dispatched it when the legal EV refused / the road was blocked (the M6c EV-spill).
 *   Only stamped on smuggle runs (a legal record is byte-identical to M6a); read by the
 *   pulse kernel to light the criminal rumor carrier along the run's endpoints.
 */

/**
 * @typedef {Object} CommodityLinkOutcome
 * @property {string} settlementId
 * @property {string} input
 * @property {string} institutionId
 * @property {string} [institutionName]
 * @property {number} stock                 the consumer stock at tick end (quantity)
 * @property {number} target
 * @property {'shortage'|'adequate'|'surplus'} band
 * @property {boolean} starving
 * @property {boolean} arrived              a caravan landed this tick
 * @property {string|null} receipt          the mandatory receipt when it starts starving
 * @property {boolean} fragile              the ≥2-source brake tripped (warning, not starve)
 * @property {boolean} [evRefused]          M6c: the dispatch EV REFUSED this link (danger
 *   beat the premium) — the caravan did not go and the shortage PERSISTS. The clean M7
 *   unmet-demand-under-danger signal (undefined when M6c dormant ⇒ M6a outcome shape).
 * @property {number} [believedDanger]      M6c: the belief-gated destination danger read
 *   for the refusal (the M7 signal's magnitude).
 * @property {'seizure'|'confiscation'|'smuggled'} [smuggleBranch]  M7: the arrival smuggle
 *   pipeline outcome at the worst gate this tick — a SEIZURE (hostile), a CONFISCATION
 *   (contraband), or SMUGGLED through (the trickle delivered). Undefined ⇒ no gate event
 *   (M6 arrival shape). Read for the DM smuggle-hook receipts.
 * @property {string} [smuggleGateId]       M7: the worst gate the roll was made against.
 * @property {number} [seizedTake]          M7: units the seizer looted (conscience-gated).
 * @property {boolean} [smuggleDispatched]  M7: the criminal channel dispatched this link
 *   this tick (the EV-spill / besieged-trickle run) — lights the criminal rumor carrier.
 */

/** The codepoint-stable ledger key for a link (uniqueness ⇒ cardinality = links). */
/** @param {string|number} settlementId @param {string|number} institutionId @param {string|number} input @returns {string} */
export function commodityLinkKey(settlementId, institutionId, input) {
  return `${String(settlementId)}:${String(institutionId)}:${String(input)}`;
}

/**
 * M6c — the DISPATCH EV context the kernel threads (the live reads the pure EV
 * engine needs). ABSENT ⇒ M6a dispatch verbatim. Every read is bound to a (origin,
 * dest) pair or an origin; the pure engine (dispatchEV.js) owns the decision math.
 * @typedef {Object} DispatchEVContext
 * @property {(originId: string, destId: string) => number} believedDanger  belief-gated
 *   destination danger (dispatchEV.believedDestinationDanger) — the deterrent.
 * @property {(originId: string) => number} caution   the ONE W0 risk-tolerance read
 *   (riskToleranceFromAlignment on the origin's settlementAlignment) — never a second
 *   alignment derivation.
 * @property {(originId: string) => number} baseline  the origin's appetite disposition
 *   baseline (dispatchEV.merchantBaseline: merchant strength raises it, lawfulness lowers).
 * @property {(link: CommodityLink, sourceId: string) => ('must-go'|'relief'|null)} [override]
 *   the EV overrides (vassal tribute must-go / ally relief). Absent ⇒ no override.
 */

/**
 * M7 — the SMUGGLE context the kernel threads (the criminal tail of the same trade
 * bundle). ABSENT ⇒ no smuggle roll, no contraband policy, no criminal carrier ⇒ the M6
 * arrival path runs verbatim, byte-identical. Every read is per-endpoint or per-gate; the
 * pure engine (smuggle.js) owns the decision math (worst gate, roll, pipeline, take).
 * @typedef {Object} SmuggleContext
 * @property {(originId: string, destId: string) => number} networkStrength  the shipment's
 *   criminal-network strength (criminalNetworkStrength over the endpoints' thieves-guilds).
 * @property {(gateId: string) => number} corruptionOf  the gate's corruption / leakiness
 *   (its thieves-guild strength) — the HINGE that raises smuggle success (a leaky gate leaks).
 * @property {(gateId: string) => number} conscienceOf  the gate's conscience read (0 evil …
 *   1 good/lawful) — W-C2 gates a seizure's loot TAKE.
 * @property {(originId: string) => number} boldnessOf  the mover's boldness (1 − the ONE W0
 *   caution read) — the risk-tolerance ATTEMPT gate.
 * @property {(gateId: string, originId: string, goodId: string) => boolean} isContrabandAt
 *   the RELATIONAL contraband rule (cultureDistance(gate, origin) + the gate's alignment).
 * @property {(goodId: string) => (string|null)} categoryOf  the good's contraband category
 *   (for the smuggle resistance read); null ⇒ freely traded.
 */

// ── Cut-check for an in-transit record (M2 parity: severed source / hostile gate) ──
/**
 * @param {CommodityShipment} rec
 * @param {{ digest: SpatialDigest, worldState: { spatialLedgers?: unknown }, riskTolerance: number, season: string|null,
 *   sourceSevered: (id: string) => boolean, isHostileToDestination: (id: string) => boolean }} ctx
 * @param {boolean} [skipInterception]  M7: when the smuggle layer is live the hostile-gate
 *   cut is DEFERRED to the arrival smuggle pipeline (ONE roll vs the worst gate — a hostile
 *   gate no longer HARD-cuts mid-transit; the caravan gets its smuggle chance at the gate).
 *   Absent/false ⇒ the M2/M6 interception cut runs verbatim (byte-identical).
 * @returns {boolean} true when the caravan is cut mid-transit (its carried load is lost)
 */
function shipmentCut(rec, ctx, skipInterception) {
  if (ctx.sourceSevered(String(rec.sourceId))) return true;
  const route = chooseRoute(ctx.digest, ctx.worldState, String(rec.sourceId), String(rec.settlementId), ctx.riskTolerance, ctx.season);
  const path = route && Array.isArray(route.path) ? route.path : [];
  if (!path.length) return true; // unroutable now ⇒ stranded ⇒ cut
  return skipInterception ? false : routeIntercepted(path, ctx.isHostileToDestination);
}

// ── THE ORCHESTRATOR — advance the whole commodity flow one tick ──────────────
/**
 * Advance the commodity flow one tick: PRODUCE (finite origins refill), ARRIVE (land
 * valid caravans — en-route tapping + banditry split the carried quantity), CONSUME
 * (drain consumer stockpiles), DISPATCH (a below-target consumer draws a caravan from
 * the cheapest CLEAR + STOCKED origin), STARVE (empty + totally cut + not fragile).
 * Codepoint-sorted throughout; the goods-conservation invariant holds by construction
 * and is returned for assertion. DORMANT (no marker / opt-in off) is the caller's gate
 * — this runs only when live.
 *
 * @param {Object} args
 * @param {CommodityProducer[]} args.producers   sparse producing (settlement, good) sources
 * @param {CommodityLink[]} args.links           consuming links (pre-ranked sources)
 * @param {Record<string, unknown>} args.worldState
 * @param {SpatialDigest} args.digest
 * @param {number} args.tick
 * @param {number} [args.tickWeeks]
 * @param {string|null} [args.season]
 * @param {{ fork?: (k: string) => { random: () => number } }|null} [args.rng]
 * @param {(destId: string, sourceId: string) => boolean} [args.sourceSeveredFor]
 * @param {(destId: string, gateId: string) => boolean} [args.hostileToDestinationFor]
 * @param {(link: CommodityLink) => number} [args.riskToleranceFor]
 * @param {(settlementId: string, goodId: string) => boolean} [args.consumesGood]  en-route tap predicate
 * @param {(link: CommodityLink) => (string|undefined)} [args.severingCauseFor]
 * @param {DispatchEVContext | null} [args.ev]  M6c THE DISPATCH EV. ABSENT (M6a/M2 callers,
 *   dormant, opt-in off) ⇒ the dispatch runs UNCHANGED (dispatch whenever cur<target,
 *   no EV gate) and no appetite/willingness ledger materializes — BYTE-IDENTICAL to
 *   M6a. Present ⇒ the origin's greed-vs-danger EV gates each dispatch (belief-gated
 *   deterrent, dynamic appetite, the M1 hysteresis), risky-run outcomes move the
 *   per-origin appetite, and EV-refused links expose the M7 unmet-demand signal.
 * @param {SmuggleContext | null} [args.smuggle]  M7 THE SMUGGLE LAYER (the criminal tail).
 *   ABSENT ⇒ no smuggle roll, no contraband policy, no criminal carrier ⇒ the interception
 *   cut + arrival run verbatim, BYTE-IDENTICAL to M6. Present ⇒ a hostile gate no longer
 *   hard-cuts (ONE smuggle roll vs the route's WORST gate at arrival: seizure → confiscation
 *   → toll, §II.3-4-e), a legally-refused / blocked link can spill to the criminal channel
 *   (the besieged TRICKLE), and seizures are conscience-gated (W-C2).
 * @returns {{ nextStocks: Record<string, Record<string, number>>|null,
 *   nextShipments: Record<string, CommodityShipment>|null,
 *   nextAppetite: Record<string, import('./dispatchEV.js').AppetiteRecord>|null,
 *   nextWillingness: Record<string, import('./dispatchEV.js').WillingnessRecord>|null,
 *   emboldenEvents: Array<{ originId: string, destId: string }>,
 *   changed: boolean, outcomes: Record<string, CommodityLinkOutcome>, accounting: GoodsAccounting }}
 */
export function advanceCommodityFlow({
  producers, links, worldState, digest, tick, tickWeeks, season = null, rng = null,
  sourceSeveredFor, hostileToDestinationFor, riskToleranceFor, consumesGood, severingCauseFor,
  ev = null, smuggle = null,
}) {
  const T = COMMODITY_TUNING;
  const now = intNonNeg(tick, 0);
  const span = Math.max(0, finiteNumber(tickWeeks, T.DEFAULT_TICK_WEEKS));
  const producerList = Array.isArray(producers) ? producers : [];
  const linkList = Array.isArray(links) ? links : [];

  const priorStocks = hasSpatialLedger(worldState, 'commodityStocks')
    ? asObject(getSpatialLedger(worldState, 'commodityStocks'))
    : {};
  const priorShipments = hasSpatialLedger(worldState, 'supplyShipments')
    ? asObject(getSpatialLedger(worldState, 'supplyShipments'))
    : {};
  // M6c THE DISPATCH EV (only when the ev context is threaded). The two sub-ledgers
  // ride the SAME spatialLedgers namespace (zero eager bytes); both stay ABSENT when
  // ev is null (M6a/M2 callers) or when nothing deviates from baseline / stays willing.
  const priorAppetite = ev && hasSpatialLedger(worldState, 'merchantAppetite')
    ? asObject(getSpatialLedger(worldState, 'merchantAppetite')) : {};
  const priorWillingness = ev && hasSpatialLedger(worldState, 'dispatchWillingness')
    ? asObject(getSpatialLedger(worldState, 'dispatchWillingness')) : {};
  // Risky-run outcome tallies per ORIGIN (a deterministic accumulator over outcomes
  // already rolled this tick — no new rng): a risky delivery EMBOLDENS, a risky loss COWS.
  /** @type {Map<string, { paid: number, lost: number }>} */
  const appetiteEvents = new Map();
  /** @type {Array<{ originId: string, destId: string }>} */
  const emboldenEvents = [];
  const bumpAppetite = (/** @type {string} */ originId, /** @type {'paid'|'lost'} */ kind) => {
    const o = String(originId);
    const e = appetiteEvents.get(o) || { paid: 0, lost: 0 };
    e[kind] += 1;
    appetiteEvents.set(o, e);
  };

  // Mutable working stock map (deep-cloned from prior; cold-start fills below).
  /** @type {Record<string, Record<string, number>>} */
  const stocks = {};
  for (const sid of Object.keys(priorStocks)) {
    const by = asObject(priorStocks[sid]);
    /** @type {Record<string, number>} */
    const row = {};
    for (const gid of Object.keys(by)) row[gid] = intNonNeg(by[gid], 0);
    stocks[sid] = row;
  }

  // COLD-START (the reconciliation): a first-seen consumer stocks at its target
  // (== M2's initial full BUFFER_WEEKS); a first-seen origin stocks at its warehouse
  // cap. Done BEFORE `before` so the initial stock is counted in the balance (it is
  // this world's `initial` term, not goods conjured mid-tick).
  /** @type {Map<string, CommodityLink>} */
  const linkByKey = new Map();
  for (const link of linkList) {
    const key = commodityLinkKey(link.settlementId, link.institutionId, link.input);
    linkByKey.set(key, link);
    const sid = String(link.settlementId);
    const gid = String(link.input);
    if (!(stocks[sid] && gid in stocks[sid])) setStock(stocks, sid, gid, intNonNeg(link.target, T.STOCKPILE_TARGET));
  }
  for (const p of producerList) {
    const sid = String(p.settlementId);
    const gid = String(p.good);
    if (!(stocks[sid] && gid in stocks[sid])) setStock(stocks, sid, gid, intNonNeg(p.cap, originStockCap(p.rate)));
  }

  // `before` = Σ(all stock) + Σ(prior carried).
  let before = 0;
  for (const sid of Object.keys(stocks)) for (const gid of Object.keys(stocks[sid])) before += stocks[sid][gid];
  for (const key of Object.keys(priorShipments)) before += intNonNeg(asObject(priorShipments[key]).carried, 0);

  let produced = 0;
  let consumed = 0;
  let lost = 0;

  // ── PRODUCE (finite origins refill toward the warehouse cap) ────────────────
  for (const p of [...producerList].sort((a, b) => byProducer(a, b))) {
    const sid = String(p.settlementId);
    const gid = String(p.good);
    const cap = intNonNeg(p.cap, originStockCap(p.rate));
    const cur = stockOf(stocks, sid, gid, 0);
    const add = Math.max(0, Math.min(Math.floor(Math.max(0, finiteNumber(p.rate, 0)) * span), cap - cur));
    if (add > 0) { setStock(stocks, sid, gid, cur + add); produced += add; }
  }

  // Per-link context factory (severance / hostility / risk, bound to the destination).
  /** @param {CommodityLink} link */
  const ctxFor = (link) => ({
    digest, worldState, season: season ?? null,
    riskTolerance: riskToleranceFor ? finiteNumber(riskToleranceFor(link), 1) : 1,
    sourceSevered: (/** @type {string} */ id) => !!(sourceSeveredFor && sourceSeveredFor(String(link.settlementId), id)),
    isHostileToDestination: (/** @type {string} */ id) => !!(hostileToDestinationFor && hostileToDestinationFor(String(link.settlementId), id)),
  });

  // ── ARRIVE (land valid caravans; cut invalid ones) ─────────────────────────
  /** @type {Record<string, CommodityShipment>} */
  const carriedForward = {};
  /** @type {Set<string>} */
  const arrivedKeys = new Set();
  // M7: per-link smuggle-pipeline outcomes this tick (seizure / confiscation / smuggled
  // through). Empty + unread when the smuggle layer is dormant ⇒ M6 outcome shape.
  /** @type {Record<string, { branch: 'seizure'|'confiscation'|'smuggled', gateId: string, take?: number }>} */
  const smuggleArrivals = {};
  for (const key of Object.keys(priorShipments).sort()) {
    const raw = asObject(priorShipments[key]);
    const link = linkByKey.get(key);
    const rec = /** @type {CommodityShipment} */ ({
      institutionId: String(raw.institutionId ?? ''), settlementId: String(raw.settlementId ?? ''),
      input: String(raw.input ?? ''), sourceId: String(raw.sourceId ?? ''),
      arrivalTick: intNonNeg(raw.arrivalTick, now), carried: intNonNeg(raw.carried, 0),
      starving: !!raw.starving,
    });
    // M6c: the believed danger this caravan set out into (0 when absent / peaceful).
    const ranDanger = ev ? finiteNumber(raw.ranDanger, 0) : 0;
    if (ranDanger >= DISPATCH_TUNING.RISKY_DANGER_FLOOR) rec.ranDanger = round4(ranDanger);
    // M7: carry the smuggle marker across in-transit ticks. Without it a multi-tick smuggle
    // run loses smuggle:true on reconstruction and the criminal rumor carrier (pulseKernel
    // reads r.smuggle on the just-advanced ledger) goes dark after the dispatch tick — the
    // besieged trickle would light the crime lane once, then vanish mid-transit. A
    // non-smuggle record has no smuggle field ⇒ byte-identical (the lane stays dormant).
    if (raw.smuggle) rec.smuggle = true;
    // A ledger-only starvation latch (M2 wrote sourceId '' / arrivalTick -1) carries no
    // goods — drop it (this tick recomputes starvation fresh).
    if (!rec.sourceId || rec.carried <= 0) continue;
    const ctx = link ? ctxFor(link) : {
      digest, worldState, season: season ?? null, riskTolerance: 1,
      sourceSevered: () => false, isHostileToDestination: () => false,
    };
    // M7: with the smuggle layer live, a HOSTILE gate no longer HARD-cuts mid-transit —
    // the caravan gets its ONE smuggle roll at the arrival gate below (§II.3-4-f). The
    // severed-source / unroutable cut still applies. Dormant ⇒ M2/M6 interception verbatim.
    if (shipmentCut(rec, ctx, !!smuggle)) {
      lost += rec.carried; // cut mid-transit ⇒ load lost
      // M6c: a RISKY caravan CUT COWS its origin's appetite (a loss it can feel).
      if (ev && ranDanger >= DISPATCH_TUNING.RISKY_DANGER_FLOOR) bumpAppetite(rec.sourceId, 'lost');
      continue;
    }

    if (now >= rec.arrivalTick) {
      const route = chooseRoute(digest, worldState, rec.sourceId, rec.settlementId, ctx.riskTolerance, season ?? null);
      const path = route && Array.isArray(route.path) ? route.path : [];

      // ── M7 THE PER-GATE PIPELINE (§II.3-4-e) — ONE roll vs the route's WORST gate.
      //    smuggle roll → (detected ∧ hostile) SEIZURE → (elif contraband) CONFISCATION →
      //    else TOLL (delivered — the besieged TRICKLE survives). Only when the layer is
      //    live AND the worst gate poses a threat; otherwise the M6 arrival runs unchanged.
      if (smuggle && path.length > 2) {
        const worst = worstGate(path.slice(1, -1).map((gid) => ({
          id: String(gid),
          hostile: ctx.isHostileToDestination(String(gid)),
          contraband: smuggle.isContrabandAt(String(gid), rec.sourceId, rec.input),
          danger: embattlementLevel(worldState, String(gid)),
        })));
        if (worst && (worst.kind === 'hostile' || worst.kind === 'contraband')) {
          const chance = smuggleSuccessChance({
            network: smuggle.networkStrength(rec.sourceId, rec.settlementId),
            corruption: smuggle.corruptionOf(worst.id),
            goodsResistance: goodsResistance(smuggle.categoryOf(rec.input)),
            boldness: smuggle.boldnessOf(rec.sourceId),
          });
          const forked = rng && typeof rng.fork === 'function' ? rng.fork(`smuggle:${key}:${rec.arrivalTick}`) : null;
          const draw = forked ? clamp01(finiteNumber(forked.random(), 1)) : 1;
          const detected = smuggleDetected(chance, draw);
          const branch = smugglePipeline({ detected, hostile: worst.kind === 'hostile', contraband: worst.kind === 'contraband' });
          if (branch === 'seizure' || branch === 'confiscation') {
            // The destination is DENIED the load. A SEIZURE loots a conscience-gated TAKE
            // to the gate (W-C2 — an evil seizer takes near-all, a good one little); the
            // rest spoils. A CONFISCATION frees/destroys the whole contraband load.
            lost += rec.carried;
            let take = 0;
            if (branch === 'seizure') {
              take = seizureTake(rec.carried, smuggle.conscienceOf(worst.id));
              if (take > 0) {
                setStock(stocks, worst.id, rec.input, stockOf(stocks, worst.id, rec.input, 0) + take);
                lost -= take; // the looted units survive as the gate's stock (conservation)
              }
            }
            smuggleArrivals[key] = { branch, gateId: worst.id, ...(take > 0 ? { take } : {}) };
            // A RISKY caravan lost to a seizure/confiscation COWS its origin's appetite.
            if (ev && ranDanger >= DISPATCH_TUNING.RISKY_DANGER_FLOOR) bumpAppetite(rec.sourceId, 'lost');
            continue; // no delivery — the shortage persists (the DM's smuggle hook)
          }
          // detected === false ⇒ SMUGGLED THROUGH: falls to TOLL ⇒ delivered (the trickle).
          if (!detected) smuggleArrivals[key] = { branch: 'smuggled', gateId: worst.id };
        }
      }

      // EN-ROUTE DEPLETION — intermediaries that consume the good tap the caravan.
      let remaining = rec.carried;
      for (let i = 1; i < path.length - 1 && remaining > 0; i++) {
        const interId = String(path[i]);
        if (!(consumesGood && consumesGood(interId, rec.input))) continue;
        const deficit = Math.max(0, T.STOCKPILE_TARGET - stockOf(stocks, interId, rec.input, 0));
        const tap = Math.min(remaining, T.TAP_CAP, deficit);
        if (tap > 0) { setStock(stocks, interId, rec.input, stockOf(stocks, interId, rec.input, 0) + tap); remaining -= tap; }
      }
      // Banditry on the remainder (M1's delivered fraction, on the quantity).
      const forked = rng && typeof rng.fork === 'function' ? rng.fork(`banditry:${key}:${rec.arrivalTick}`) : null;
      const danger = embattlementLevel(worldState, rec.sourceId);
      const bandit = banditryLoss({ channelStrength: 1, dangerLevel: danger, rng: forked || undefined });
      const delivered = Math.max(0, Math.min(remaining, Math.floor(remaining * clamp01(finiteNumber(bandit.delivered, 1)))));
      lost += remaining - delivered;
      setStock(stocks, rec.settlementId, rec.input, stockOf(stocks, rec.settlementId, rec.input, 0) + delivered);
      arrivedKeys.add(key); // landed this tick — the consumer's stockpile refilled
      // M6c: a RISKY delivery that ARRIVED (delivered > 0) EMBOLDENS its origin — the
      // caravan that ran real danger and got through ("emboldened by the <dest> run").
      if (ev && ranDanger >= DISPATCH_TUNING.RISKY_DANGER_FLOOR && delivered > 0) {
        bumpAppetite(rec.sourceId, 'paid');
        emboldenEvents.push({ originId: rec.sourceId, destId: rec.settlementId });
      }
    } else {
      carriedForward[key] = rec; // still in transit
    }
  }

  // ── CONSUME (drain consumer stockpiles) ────────────────────────────────────
  for (const key of [...linkByKey.keys()].sort()) {
    const link = linkByKey.get(key);
    if (!link) continue;
    const sid = String(link.settlementId);
    const gid = String(link.input);
    const rate = Math.max(0, finiteNumber(link.consumptionRate, T.CONSUMPTION_RATE));
    const draw = Math.min(Math.floor(rate * span), stockOf(stocks, sid, gid, 0));
    if (draw > 0) { setStock(stocks, sid, gid, stockOf(stocks, sid, gid, 0) - draw); consumed += draw; }
  }

  // ── DISPATCH (below-target consumers draw a caravan from a clear, STOCKED origin) ──
  /** @type {Record<string, CommodityShipment>} */
  const nextShipments = { ...carriedForward };
  /** @type {Record<string, CommodityLinkOutcome>} */
  const outcomes = {};
  // M6c: the next willingness latch — starts EMPTY and keeps ONLY the links that are
  // re-evaluated AND still REFUSING this tick (an adequate / dispatched / physically-cut
  // link auto-prunes to willing). Codepoint-stable via the sorted key walk below.
  /** @type {Record<string, import('./dispatchEV.js').WillingnessRecord>} */
  const nextWillingness = {};
  for (const key of [...linkByKey.keys()].sort()) {
    const link = linkByKey.get(key);
    if (!link) continue;
    const sid = String(link.settlementId);
    const gid = String(link.input);
    const target = intNonNeg(link.target, T.STOCKPILE_TARGET);
    const ctx = ctxFor(link);
    const priorStarving = !!(asObject(priorShipments[key]).starving);
    const fragile = fragileLink(link);
    const cur = stockOf(stocks, sid, gid, 0);

    let record = nextShipments[key] || null; // a still-in-transit caravan blocks re-dispatch
    let dispatched = false;
    // M6c dispatch-EV outcome fields (undefined when M6c dormant ⇒ M6a outcome shape).
    /** @type {boolean|undefined} */
    let evRefused;
    /** @type {number|undefined} */
    let evBelievedDanger;
    // M7: did the CRIMINAL channel dispatch this link this tick (the EV-spill / trickle)?
    /** @type {boolean|undefined} */
    let smuggleDispatched;
    if (!record && cur < target) {
      // FAILOVER — the cheapest source that is clear AND holds ≥ ORIGIN_MIN_AVAILABLE.
      const stocked = (link.rankedSources || []).filter((s) => stockOf(stocks, String(s.sourceId), gid, 0) >= T.ORIGIN_MIN_AVAILABLE);
      const picked = pickSource(stocked, {
        digest, worldState, destinationId: sid, riskTolerance: ctx.riskTolerance, season: season ?? null,
        sourceSevered: ctx.sourceSevered, isHostileToDestination: ctx.isHostileToDestination,
      });
      let goDispatch = false;
      let isSmuggle = false;
      /** @type {{ sourceId: string, route: import('./embattlement.js').ScoredRoute }|null} */
      let dispatchPick = picked || null;
      if (picked) {
        const originId = String(picked.sourceId);
        // ── THE GREED-vs-DANGER DISPATCH EV (M6c). Absent ev ⇒ dispatch UNCONDITIONALLY
        //    (M6a verbatim). Present ⇒ the origin weighs the destination's need-premium ×
        //    its dynamic appetite against the BELIEVED danger × its caution, with the M1
        //    hysteresis; a refusal leaves the shortage to persist (the M7 signal).
        goDispatch = true;
        if (ev) {
          const baseline = finiteNumber(ev.baseline(originId), DISPATCH_TUNING.BASELINE_MID);
          const appetite = appetiteOf(priorAppetite, originId, baseline);
          const believedDanger = finiteNumber(ev.believedDanger(originId, sid), 0);
          const caution = finiteNumber(ev.caution(originId), 1);
          const priorW = /** @type {import('./dispatchEV.js').WillingnessRecord|null} */ (
            asObject(priorWillingness[key]).phase === 'refusing' ? asObject(priorWillingness[key]) : null
          );
          const override = ev.override ? ev.override(link, originId) : null;
          const decision = dispatchDecision({
            short: true, needPremium: needPremium(cur, target), appetite, believedDanger, caution,
            priorWillingness: priorW, now, override,
          });
          goDispatch = decision.dispatch;
          evBelievedDanger = decision.believedDanger;
          if (decision.willingness) nextWillingness[key] = decision.willingness; // still refusing ⇒ latch
          if (decision.refuse) evRefused = true; // the caravan did not go ⇒ shortage persists (M7 seam)
        }
        // ── M7 THE EV-SPILL (round 22.4): the legal caravan REFUSED but the road is clear —
        //    the criminal channel runs the deep-shortage link (the tail of the greed curve).
        if (smuggle && !goDispatch && smuggleDispatchWarrant({
          needPremium: needPremium(cur, target), network: smuggle.networkStrength(originId, sid), boldness: smuggle.boldnessOf(originId),
        })) { goDispatch = true; isSmuggle = true; }
      } else if (smuggle) {
        // ── M7 THE BESIEGED TRICKLE (§II.3-4-f): every legal route is blocked (all sources
        //    severed / intercepted). The smuggler runs the blockaded road anyway — pick a
        //    source IGNORING hostility; the ONE arrival roll then decides seizure vs trickle.
        const smuggPick = pickSource(stocked, {
          digest, worldState, destinationId: sid, riskTolerance: ctx.riskTolerance, season: season ?? null,
          sourceSevered: ctx.sourceSevered, isHostileToDestination: () => false,
        });
        if (smuggPick && smuggleDispatchWarrant({
          needPremium: needPremium(cur, target), network: smuggle.networkStrength(String(smuggPick.sourceId), sid), boldness: smuggle.boldnessOf(String(smuggPick.sourceId)),
        })) { dispatchPick = smuggPick; goDispatch = true; isSmuggle = true; }
      }
      if (goDispatch && dispatchPick) {
        const originId = String(dispatchPick.sourceId);
        // A smuggle run stamps the danger it ran so its arrival outcome moves the appetite.
        if (isSmuggle && ev && evBelievedDanger == null) evBelievedDanger = round4(finiteNumber(ev.believedDanger(originId, sid), 0));
        const originAvail = stockOf(stocks, originId, gid, 0);
        const want = Math.min(target - cur, T.MAX_SHIP, originAvail);
        if (want >= T.MIN_SHIP) {
          setStock(stocks, originId, gid, originAvail - want); // finite origin DEPLETES
          record = {
            institutionId: String(link.institutionId), settlementId: sid, input: gid,
            sourceId: originId, arrivalTick: now + routeWeeks(digest, dispatchPick.route.baseCost),
            carried: want, starving: false,
          };
          // M6c: stamp the danger it set out into (only when RISKY) so the arrival can
          // embolden the origin — a peaceful record stays byte-identical to M6a.
          if (ev && evBelievedDanger != null && evBelievedDanger >= DISPATCH_TUNING.RISKY_DANGER_FLOOR) {
            record.ranDanger = round4(evBelievedDanger);
          }
          // M7: mark the smuggle run (lights the criminal rumor carrier at the pulse kernel).
          if (isSmuggle) { record.smuggle = true; smuggleDispatched = true; }
          nextShipments[key] = record;
          dispatched = true;
        }
      }
    }

    // STARVE — empty + totally cut (no clear stocked source, none in transit) + not fragile.
    const anySource = dispatched || record != null || hasClearStockedSource(link, gid, stocks, ctx);
    const starving = cur <= 0 && !anySource && !fragile;
    const receipt = starving && !priorStarving
      ? starvationReceipt({
          institutionName: link.institutionName || String(link.institutionId),
          input: gid, cause: severingCauseFor ? severingCauseFor(link) : undefined,
          weeksCut: T.STARVE_AFTER_WEEKS,
        })
      : null;
    if (record) record.starving = starving;

    const smuggleArrival = smuggleArrivals[key];
    outcomes[key] = {
      settlementId: sid, input: gid, institutionId: String(link.institutionId),
      institutionName: link.institutionName, stock: cur, target,
      band: commodityBand(cur, target), starving,
      arrived: arrivedKeys.has(key), receipt, fragile,
      ...(evRefused ? { evRefused, believedDanger: evBelievedDanger } : {}),
      // M7: the arrival smuggle-pipeline outcome + the criminal-dispatch flag (undefined ⇒
      // no gate event / no spill this tick ⇒ M6 outcome shape).
      ...(smuggleArrival ? { smuggleBranch: smuggleArrival.branch, smuggleGateId: smuggleArrival.gateId, ...(smuggleArrival.take ? { seizedTake: smuggleArrival.take } : {}) } : {}),
      ...(smuggleDispatched ? { smuggleDispatched: true } : {}),
    };
    // A starving link with no caravan still leaves a ledger latch (M2 parity, for the
    // M2b interdiction read) — a sourceId-less, 0-carry record.
    if (!nextShipments[key] && starving) {
      nextShipments[key] = { institutionId: String(link.institutionId), settlementId: sid, input: gid, sourceId: '', arrivalTick: -1, carried: 0, starving: true };
    }
  }

  // `after` = Σ(all stock) + Σ(next carried).
  let after = 0;
  for (const sid of Object.keys(stocks)) for (const gid of Object.keys(stocks[sid])) after += stocks[sid][gid];
  for (const key of Object.keys(nextShipments)) after += intNonNeg(nextShipments[key].carried, 0);

  const accounting = { before, produced, after, consumed, lost };

  // ── M6c: STEP THE DYNAMIC APPETITE (per origin; a deterministic accumulator over the
  //    outcomes already rolled). Every origin that holds a prior appetite (decay toward
  //    baseline) OR saw a risky outcome this tick (embolden/cow) is stepped, codepoint-
  //    sorted; a scalar settled within EPS of its baseline is pruned (sparse ledger).
  let nextAppetiteOrNull = null;
  let appetiteChanged = false;
  if (ev) {
    const originIds = new Set([...Object.keys(priorAppetite), ...appetiteEvents.keys()].map(String));
    /** @type {Record<string, import('./dispatchEV.js').AppetiteRecord>} */
    const nextAppetite = {};
    for (const originId of [...originIds].sort()) {
      const prior = asObject(priorAppetite[originId]);
      const priorRec = typeof prior.level === 'number' ? /** @type {import('./dispatchEV.js').AppetiteRecord} */ (prior) : null;
      const evt = appetiteEvents.get(originId) || { paid: 0, lost: 0 };
      const rec = stepAppetite(priorRec, { baseline: finiteNumber(ev.baseline(originId), DISPATCH_TUNING.BASELINE_MID), paid: evt.paid, lost: evt.lost, now });
      if (rec) nextAppetite[originId] = rec;
    }
    nextAppetiteOrNull = Object.keys(nextAppetite).length ? nextAppetite : null;
    const priorAppetiteOrNull = Object.keys(priorAppetite).length ? sortedRecordMap(priorAppetite) : null;
    appetiteChanged = JSON.stringify(priorAppetiteOrNull) !== JSON.stringify(nextAppetiteOrNull);
  }

  // Codepoint-tidy + sort the persisted stock map (drop empty settlement rows; sorted
  // keys give a byte-stable, order-independent ledger).
  const tidied = tidyStocks(stocks);
  const nextStocks = tidied ? sortedStocks(tidied) : null;
  const nextShipmentsOrNull = Object.keys(nextShipments).length ? sortedShipments(nextShipments) : null;
  const priorStocksOrNull = Object.keys(priorStocks).length ? priorStocks : null;
  const priorShipmentsOrNull = Object.keys(priorShipments).length ? priorShipments : null;
  const stocksChanged = JSON.stringify(priorStocksOrNull && sortedStocks(priorStocksOrNull)) !== JSON.stringify(nextStocks);
  const shipmentsChanged = JSON.stringify(priorShipmentsOrNull && sortedShipments(priorShipmentsOrNull)) !== JSON.stringify(nextShipmentsOrNull);

  // M6c willingness ledger (only refusing links; sorted for byte-stability).
  const nextWillingnessOrNull = /** @type {Record<string, import('./dispatchEV.js').WillingnessRecord>|null} */ (
    ev && Object.keys(nextWillingness).length ? sortedRecordMap(nextWillingness) : null
  );
  const priorWillingnessOrNull = ev && Object.keys(priorWillingness).length ? sortedRecordMap(priorWillingness) : null;
  const willingnessChanged = !!ev && JSON.stringify(priorWillingnessOrNull) !== JSON.stringify(nextWillingnessOrNull);

  return {
    nextStocks,
    nextShipments: nextShipmentsOrNull,
    nextAppetite: nextAppetiteOrNull,
    nextWillingness: nextWillingnessOrNull,
    emboldenEvents,
    changed: stocksChanged || shipmentsChanged || appetiteChanged || willingnessChanged,
    outcomes,
    accounting,
  };
}

// ── Small pure helpers (module-local) ─────────────────────────────────────────
/** Codepoint order for producers (settlement, then good). */
/** @param {CommodityProducer} a @param {CommodityProducer} b @returns {number} */
function byProducer(a, b) {
  const ka = `${a.settlementId}:${a.good}`;
  const kb = `${b.settlementId}:${b.good}`;
  return ka < kb ? -1 : ka > kb ? 1 : 0;
}

/** The ≥2-source co-built brake, inherited from M2 (a fragile CRITICAL link is
 *  flagged, never starved). @param {CommodityLink} link @returns {boolean} */
function fragileLink(link) {
  const count = Array.isArray(link.rankedSources) ? link.rankedSources.length : 0;
  return count < 2 && link.critical !== false;
}

/**
 * Is there a clear, STOCKED source for this link right now (used for the starvation
 * total-cut precondition)? A source counts only if not severed, holds stock, and is
 * routable without interception.
 * @param {CommodityLink} link @param {string} gid
 * @param {Record<string, Record<string, number>>} stocks
 * @param {{ digest: SpatialDigest, worldState: { spatialLedgers?: unknown }, riskTolerance: number, season: string|null,
 *   sourceSevered: (id: string) => boolean, isHostileToDestination: (id: string) => boolean }} ctx
 * @returns {boolean}
 */
function hasClearStockedSource(link, gid, stocks, ctx) {
  const stocked = (link.rankedSources || []).filter((s) => stockOf(stocks, String(s.sourceId), gid, 0) >= COMMODITY_TUNING.ORIGIN_MIN_AVAILABLE);
  const picked = pickSource(stocked, {
    digest: ctx.digest, worldState: ctx.worldState, destinationId: String(link.settlementId),
    riskTolerance: ctx.riskTolerance, season: ctx.season,
    sourceSevered: ctx.sourceSevered, isHostileToDestination: ctx.isHostileToDestination,
  });
  return picked != null;
}

/** Drop empty settlement rows; return null when wholly empty (sparse discipline). */
/** @param {Record<string, Record<string, number>>} stocks @returns {Record<string, Record<string, number>>|null} */
function tidyStocks(stocks) {
  /** @type {Record<string, Record<string, number>>} */
  const out = {};
  for (const sid of Object.keys(stocks)) {
    const row = stocks[sid];
    if (row && Object.keys(row).length) out[sid] = row;
  }
  return Object.keys(out).length ? out : null;
}

/** A codepoint-sorted copy of the shipment ledger (byte-stable, order-independent). */
/** @param {Record<string, unknown>} ships @returns {Record<string, CommodityShipment>} */
function sortedShipments(ships) {
  /** @type {Record<string, CommodityShipment>} */
  const out = {};
  for (const key of Object.keys(asObject(ships)).sort()) out[key] = /** @type {CommodityShipment} */ (asObject(ships)[key]);
  return out;
}

/** A codepoint-sorted shallow copy of a flat id→record ledger (M6c appetite +
 *  willingness — byte-stable, order-independent change-detection + persist). */
/** @param {Record<string, unknown>} rows @returns {Record<string, unknown>} */
function sortedRecordMap(rows) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of Object.keys(asObject(rows)).sort()) out[key] = asObject(rows)[key];
  return out;
}

/** A codepoint-sorted deep copy of a stock map (stable change-detection + persist). */
/** @param {Record<string, unknown>} stocks @returns {Record<string, Record<string, number>>} */
function sortedStocks(stocks) {
  /** @type {Record<string, Record<string, number>>} */
  const out = {};
  for (const sid of Object.keys(asObject(stocks)).sort()) {
    const by = asObject(asObject(stocks)[sid]);
    /** @type {Record<string, number>} */
    const row = {};
    for (const gid of Object.keys(by).sort()) row[gid] = intNonNeg(by[gid], 0);
    out[sid] = row;
  }
  return out;
}
