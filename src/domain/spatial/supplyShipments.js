/**
 * supplyShipments.js — Phase 5.5 mover wave M2: CARAVANS / SUPPLY-STARVATION.
 *
 * The map finally makes trade TRAVEL. A consuming institution that needs an input
 * it does not produce (a smithy's iron, a bakery's grain the granary can't cover)
 * draws it along a ROUTE from a producer settlement — and that route can be cut.
 *
 * The design's four load-bearing ideas (§II.4, §II.3-4-g, §II.3-3):
 *
 *   1. PRE-RANKED SOURCES (§II.4). At trade-establishment the K cheapest REACHABLE
 *      producers of each (institution, input) are ranked ONCE from the FROZEN
 *      digest geometry (`rankSupplySources`) — a pure function of the immutable
 *      distanceMatrix. FAILOVER is then an O(K) LIST-WALK down that ranking
 *      (`pickSource`), NEVER a re-solve: when the current source is severed the
 *      caravan simply switches to the next clear producer on the pre-ranked list.
 *
 *   2. THE IN-TRANSIT SHIPMENT LEDGER — AGGREGATE, bounded, conditionally
 *      materialized. ONE record per ACTIVE LINK, keyed `${settlementId}:${
 *      institutionId}:${input}` → { institutionId, settlementId, input, sourceId,
 *      arrivalTick, starving }. The cardinality law: records = active links, NEVER
 *      per-wagon (a link shipping any quantity of iron is ONE record). Rides M1's
 *      hopWeeks: `arrivalTick = now + routeWeeks(the chosen route's cost)`.
 *
 *   3. GENERALIZED SUPPLY-STARVATION (§II.3-4-g). Starvation fires ONLY on an
 *      EXTENDED TOTAL cut: EVERY pre-ranked source severed AND the per-input
 *      stockpile buffer (the generalization of foodStockpile to iron/timber/… on
 *      economicState) drained to empty. It is TEMPORARY — it LIFTS the moment a
 *      shipment arrives — and it carries a MANDATORY causal receipt ("the smithy
 *      starves: the iron road is cut …; no shipment in N weeks"). The impairment
 *      kind is entities/status.js `supply_starved`, stamped under this module's own
 *      cause namespace so it never re-triggers blockadeTransport's 'access' mark.
 *      foodStockpile REMAINS the food buffer — food is never routed here (no
 *      double-count).
 *
 *   4. THE CO-BUILT BRAKE (§II.3-3). At establishment a critical input with FEWER
 *      than MIN_SOURCE_PATHS independent reachable producers is FLAGGED fragile
 *      (`assessSourceRedundancy`) — a warning surfaced to the DM, NOT a starvation.
 *      A single-sourced input is a known risk, not a famine.
 *
 * INTERCEPTION (basic, v1). A gate on the route that is HOSTILE TO THE DESTINATION
 * CUTS the shipment (`routeIntercepted`) — the full smuggle counterplay is M7. Real
 * shipments through embattled ground ride M1's banditryLoss on the delivered
 * quantity (a stable composite fork key `banditry:${shipmentId}:${arrivalTick}`).
 *
 * PURE + LAZY (constitutional). No Date, no Math.random, no mutation, no tier/auth
 * read. A spatial leaf (the lazy engine chunk) — zero first-paint bytes. The
 * ledger materializes ONLY under the spatialCanonVersion marker AND only for links
 * actually shipping/starving (sparse); a peaceful or aspatial world carries no
 * `supplyShipments` key and stays byte-identical. The kernel call site owns the
 * live reads (producers, hostility, buffers); this module owns the pure mechanics —
 * mirroring the embattlement.js discipline.
 */

import { pathCost, calibration, isMapped, hasSpatialLedger, getSpatialLedger } from './distanceRead.js';
import { chooseRoute, banditryLoss, embattlementLevel } from './embattlement.js';

// The generalized supply-starvation impairment kind + its cause namespace. The
// KIND is declared in the entities/status.js InstitutionImpairmentType union; the
// runtime constants live HERE (the lazy leaf) so status.js adds no eager bytes.
// The cause prefix is DISJOINT from blockadeTransport's 'stressor-blockade:' — the
// two impairment systems share the status vocabulary but never each other's marks.
export const SUPPLY_STARVED_IMPAIRMENT = 'supply_starved';
export const SUPPLY_STARVED_CAUSE_PREFIX = 'supply-starved:';

// ── Tuning (documented; retuned in the M2 + checkpoint soaks) ─────────────────
export const SUPPLY_TUNING = Object.freeze({
  // How many cheapest reachable producers to pre-rank per (institution, input).
  // Small: a caravan picks among a few plausible roads (mirrors K_CANDIDATES).
  K_SOURCES: 3,
  // THE CO-BUILT BRAKE (§II.3-3): a critical input with fewer than this many
  // independent reachable producers is FLAGGED fragile — never starved on it.
  MIN_SOURCE_PATHS: 2,
  // The per-input stockpile buffer, in WEEKS of consumption (the foodStockpile
  // generalization). A link arrives with a full buffer; it drains while the road
  // is cut. Empty buffer + all-sources-severed = the starvation trigger.
  BUFFER_WEEKS: 8,
  // A link's per-tick consumption draw on its buffer (one-week ticks → 1 week).
  // The canonical pulse tick is one week; a coarse call passes its own span.
  DEFAULT_TICK_WEEKS: 1,
  // The starvation receipt fires only after the road has been cut this long — an
  // EXTENDED total cut, not a single quiet tick (the buffer already absorbs the
  // brief interruptions). Weeks, measured on the shipment ledger.
  STARVE_AFTER_WEEKS: 1,
});

/**
 * The worldState read-shape this module touches (all fields optional — the gate
 * reads the marker, the routing reads the embattlement field, the interdiction
 * read reads the ledger). Compatible with the embattlement.js reader shapes.
 * @typedef {{ spatialCanonVersion?: unknown, spatialDigest?: unknown,
 *   spatialLedgers?: unknown }} SupplyWorldState
 */

/** @typedef {import('./distanceRead.js').SpatialDigest} SpatialDigest */

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 2-dp round for byte-tidy persisted floats */
function round2(v) {
  return Math.round(v * 100) / 100;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** The codepoint-stable ledger key for a link (uniqueness ⇒ cardinality = links). */
/** @param {string|number} settlementId @param {string|number} institutionId @param {string|number} input @returns {string} */
export function linkKey(settlementId, institutionId, input) {
  return `${String(settlementId)}:${String(institutionId)}:${String(input)}`;
}

// ── The activation gate (dormancy / byte-identity seam) ───────────────────────
/**
 * Supply-routing is LIVE iff the spatial-canon marker is present. Like embattlement
 * it is a PHYSICAL layer (NOT info-mode gated). Absent ⇒ the advance is a no-op and
 * no `supplyShipments` key is ever materialized (byte-exact).
 * @param {{ spatialCanonVersion?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function supplyActive(worldState) {
  if (!worldState || typeof worldState !== 'object') return false;
  const marker = worldState.spatialCanonVersion;
  return Number.isInteger(marker) && Number(marker) > 0;
}

// ── Cost → weeks for an arbitrary route cost (rides M1's calibration) ─────────
/**
 * Travel weeks for a route of the given frozen cost, using the digest's own
 * weeks-per-cost calibration (the §II.5-1 anchor). Floored at 1 (no zero-latency
 * cross-settlement caravan), capped at a season-scale ceiling so a pathological
 * diameter never parks a shipment forever.
 * @param {import('./distanceRead.js').SpatialDigest} digest @param {number} cost
 * @returns {number} integer weeks ≥ 1
 */
export function routeWeeks(digest, cost) {
  const c = Math.max(0, finiteNumber(cost, 0));
  const { weeksPerCost } = calibration(digest);
  const weeks = Math.round(c * weeksPerCost);
  return Math.min(52, Math.max(1, weeks));
}

// ── 1. PRE-RANK the K cheapest reachable producers (§II.4) ────────────────────
/**
 * Rank the producers of an input by FROZEN path cost from the consumer, keeping the
 * K cheapest REACHABLE ones (self excluded; unmapped/unreachable dropped). A pure
 * function of the immutable digest geometry + the producer set — so the ranking is
 * stable canon, and FAILOVER (`pickSource`) is a walk down it, never a re-solve.
 * Deterministic (cost asc, then codepoint id).
 * @param {import('./distanceRead.js').SpatialDigest} digest
 * @param {string|number} consumerId
 * @param {Array<string|number>} producerIds
 * @param {number} [k]
 * @returns {Array<{ sourceId: string, cost: number }>}
 */
export function rankSupplySources(digest, consumerId, producerIds, k = SUPPLY_TUNING.K_SOURCES) {
  const kk = Number.isInteger(k) && k > 0 ? k : SUPPLY_TUNING.K_SOURCES;
  const consumer = String(consumerId);
  /** @type {Array<{ sourceId: string, cost: number }>} */
  const ranked = [];
  const seen = new Set();
  for (const pid of Array.isArray(producerIds) ? producerIds : []) {
    const sourceId = String(pid);
    if (sourceId === consumer || seen.has(sourceId)) continue;
    seen.add(sourceId);
    if (!isMapped(digest, sourceId) || !isMapped(digest, consumer)) continue;
    const cost = pathCost(digest, sourceId, consumer);
    if (cost == null) continue; // unreachable over the frozen geometry
    ranked.push({ sourceId, cost });
  }
  ranked.sort((a, b) => (a.cost - b.cost) || (a.sourceId < b.sourceId ? -1 : a.sourceId > b.sourceId ? 1 : 0));
  return ranked.slice(0, kk);
}

// ── 4. THE CO-BUILT BRAKE — assert ≥2 independent source paths (§II.3-3) ──────
/**
 * Assess the source redundancy of a pre-ranked link. FEWER than MIN_SOURCE_PATHS
 * reachable producers ⇒ FRAGILE: a warning the DM should see, NEVER a starvation
 * trigger (a single-sourced input is a known risk, not a famine). The starvation
 * path (`advanceSupplyShipments`) reads `fragile` and refuses to starve a fragile
 * link — it can only report the fragility.
 * @param {Array<{ sourceId: string, cost: number }>} rankedSources
 * @returns {{ pathCount: number, fragile: boolean, single: boolean }}
 */
export function assessSourceRedundancy(rankedSources) {
  const pathCount = Array.isArray(rankedSources) ? rankedSources.length : 0;
  return {
    pathCount,
    fragile: pathCount < SUPPLY_TUNING.MIN_SOURCE_PATHS,
    single: pathCount === 1,
  };
}

// ── 5. INTERCEPTION — a hostile-to-destination gate on the route cuts it ──────
/**
 * True when the route crosses a GATE that is hostile to the DESTINATION — the
 * shipment is cut (basic interception; full smuggle counterplay is M7). The gate
 * nodes are the INTERMEDIARIES the route traverses (path minus its producer origin
 * and its consumer destination); a route with no intermediary can never be
 * intercepted. Pure — the caller supplies the live hostility predicate.
 * @param {string[]} path  source → … → destination
 * @param {(gateId: string) => boolean} isHostileToDestination
 * @returns {boolean}
 */
export function routeIntercepted(path, isHostileToDestination) {
  const nodes = Array.isArray(path) ? path : [];
  if (typeof isHostileToDestination !== 'function' || nodes.length < 3) return false;
  for (let i = 1; i < nodes.length - 1; i++) {
    if (isHostileToDestination(String(nodes[i]))) return true;
  }
  return false;
}

// ── 3. THE MANDATORY CAUSAL RECEIPT ───────────────────────────────────────────
/**
 * The starvation receipt — the "why" a supply-starved institution carries (design
 * mandate). Names the institution, the cut input, the severing cause, and how long
 * the road has been cut. e.g. "the smithy starves: the iron road is cut (every
 * supplier severed); no shipment in 4 weeks."
 * @param {{ institutionName?: string, input?: string, cause?: string, weeksCut?: number }} args
 * @returns {string}
 */
export function starvationReceipt({ institutionName, input, cause, weeksCut } = {}) {
  const who = institutionName || 'the institution';
  const road = input ? `the ${String(input)} road` : 'the supply road';
  const why = cause ? ` under ${cause}` : '';
  const weeks = Math.max(0, Math.floor(finiteNumber(weeksCut, 0)));
  const dur = weeks > 0 ? `; no shipment in ${weeks} week${weeks === 1 ? '' : 's'}` : '';
  return `${who} starves: ${road} is cut (every supplier severed)${why}${dur}.`;
}

// ── FAILOVER — the O(K) list-walk over the pre-ranked sources ──────────────────
/**
 * Pick the first pre-ranked source that is BOTH clear at origin (not severed) AND
 * routable without interception. An O(K) walk down the frozen ranking — NEVER a
 * re-solve. Returns the source + its chosen route, or null when EVERY source is
 * severed/unroutable/intercepted (the total-cut precondition for starvation).
 * @param {Array<{ sourceId: string, cost: number }>} rankedSources
 * @param {{ digest: SpatialDigest, worldState: SupplyWorldState, destinationId: string, riskTolerance: number,
 *   season?: string|null,
 *   sourceSevered: (id: string) => boolean, isHostileToDestination: (id: string) => boolean }} ctx
 * @returns {{ sourceId: string, route: import('./embattlement.js').ScoredRoute }|null}
 */
export function pickSource(rankedSources, ctx) {
  const list = Array.isArray(rankedSources) ? rankedSources : [];
  for (const src of list) {
    const sourceId = String(src.sourceId);
    if (ctx.sourceSevered && ctx.sourceSevered(sourceId)) continue; // producer output cut at origin
    const route = chooseRoute(ctx.digest, ctx.worldState, sourceId, ctx.destinationId, ctx.riskTolerance, ctx.season ?? null);
    if (!route || !route.path.length) continue; // unroutable this tick
    if (routeIntercepted(route.path, ctx.isHostileToDestination)) continue; // hostile gate cuts it
    return { sourceId, route };
  }
  return null;
}

/** Are ALL pre-ranked sources severed at origin? (the total-cut half of starvation) */
/** @param {Array<{ sourceId: string }>} rankedSources @param {(id: string) => boolean} sourceSevered */
function allSourcesSevered(rankedSources, sourceSevered) {
  const list = Array.isArray(rankedSources) ? rankedSources : [];
  if (!list.length) return true; // no reachable producer at all ⇒ totally cut
  if (typeof sourceSevered !== 'function') return false;
  return list.every((s) => sourceSevered(String(s.sourceId)));
}

// ── 2. THE SHIPMENT-LEDGER STEP (one active link, one tick) ───────────────────
/**
 * @typedef {Object} ShipmentRecord
 * @property {string} institutionId
 * @property {string} settlementId
 * @property {string} input
 * @property {string} sourceId
 * @property {number} arrivalTick
 * @property {boolean} starving   TEMPORARY supply-starvation latch (lifts on arrival)
 */

/**
 * @typedef {Object} SupplyLink
 * @property {string} institutionId
 * @property {string} settlementId
 * @property {string} input
 * @property {string} [institutionName]
 * @property {Array<{ sourceId: string, cost: number }>} rankedSources  pre-ranked (§II.4)
 * @property {number} bufferWeeks   the per-input stockpile buffer (economicState)
 * @property {boolean} [critical]   a critical input (the ≥2-source brake applies)
 */

/**
 * @typedef {Object} LinkOutcome
 * @property {ShipmentRecord|null} record   the next in-transit record (null ⇒ no shipment)
 * @property {number} bufferWeeks           the next per-input buffer
 * @property {boolean} starving             is the link supply-starved this tick?
 * @property {boolean} arrived              did a shipment arrive this tick?
 * @property {string|null} receipt          the mandatory receipt when it starts starving
 * @property {boolean} fragile              the ≥2-source brake tripped (warning, not starve)
 */

/**
 * Advance ONE supply link one tick. The order of operations:
 *   (a) VALIDATE an in-transit record — a shipment whose source went severed or
 *       whose route turned hostile mid-transit is CUT (dropped).
 *   (b) ARRIVE — a still-valid record whose arrivalTick is reached DELIVERS: the
 *       buffer refills (× the banditry-surviving fraction) and starvation LIFTS.
 *   (c) DRAW — no arrival ⇒ the buffer draws down one tick's consumption.
 *   (d) DISPATCH — no record ⇒ FAILOVER (`pickSource`) picks the cheapest clear
 *       source and dispatches a shipment (arrivalTick = now + routeWeeks).
 *   (e) STARVE — ONLY when every source is severed AND the buffer is empty AND the
 *       link is NOT fragile (the ≥2-source brake): latch starving + emit the receipt.
 * Pure + deterministic given the forked rng.
 * SEASONS-B (M3): `ctx.season` rides chooseRoute (route CHOICE reshaped by winter)
 * and, because the chosen route's baseCost is then season-adjusted, the dispatched
 * shipment's arrivalTick lengthens in winter (routeWeeks). No season / no overlay
 * ⇒ the geometric route + arrival, byte-identical.
 * @param {SupplyLink} link
 * @param {ShipmentRecord|null} prior
 * @param {{ digest: SpatialDigest, worldState: SupplyWorldState, tick: number, tickWeeks?: number,
 *   riskTolerance: number, season?: string|null, rng?: { fork?: (k: string) => { random: () => number } }|null,
 *   sourceSevered: (id: string) => boolean, isHostileToDestination: (id: string) => boolean,
 *   severingCause?: string }} ctx
 * @returns {LinkOutcome}
 */
export function stepSupplyLink(link, prior, ctx) {
  const tick = Math.max(0, Math.floor(finiteNumber(ctx.tick, 0)));
  const tickWeeks = Math.max(0, finiteNumber(ctx.tickWeeks, SUPPLY_TUNING.DEFAULT_TICK_WEEKS));
  const destinationId = String(link.settlementId);
  const key = linkKey(link.settlementId, link.institutionId, link.input);
  const priorStarving = !!(prior && prior.starving);
  const redundancy = assessSourceRedundancy(link.rankedSources);
  // The ≥2-source brake applies to CRITICAL inputs only (a non-critical single-
  // sourced input is ordinary trade). A fragile critical input is flagged, never starved.
  const fragile = redundancy.fragile && link.critical !== false;

  // Rehydrate ONLY a real in-transit shipment. The starvation SENTINEL the orchestrator
  // persists for a totally-cut link (sourceId '', arrivalTick -1) is a latch, NOT a
  // caravan: rehydrating it would trip ARRIVE (tick >= -1 is always true) and refill the
  // buffer for free with the road still severed — lifting starvation after one tick. Drop
  // it; STARVE below re-derives starvation from THIS tick's cut state, and priorStarving
  // (read above) still de-dups the receipt so the sentinel only suppresses a re-emit.
  /** @type {ShipmentRecord|null} */
  let record = prior && typeof prior === 'object' && !Array.isArray(prior)
    && String(prior.sourceId) !== '' && Number(prior.arrivalTick) >= 0
    ? { institutionId: String(link.institutionId), settlementId: destinationId, input: String(link.input),
        sourceId: String(prior.sourceId), arrivalTick: Math.floor(finiteNumber(prior.arrivalTick, tick)), starving: priorStarving }
    : null;
  let bufferWeeks = Math.max(0, finiteNumber(link.bufferWeeks, 0));
  let arrived = false;

  // (a) VALIDATE an in-transit record (source severed / route intercepted ⇒ cut).
  if (record) {
    const stillClear = ctx.sourceSevered && ctx.sourceSevered(record.sourceId)
      ? false
      : !routeIntercepted(
          chooseRoute(ctx.digest, ctx.worldState, record.sourceId, destinationId, ctx.riskTolerance, ctx.season ?? null)?.path || [],
          ctx.isHostileToDestination,
        );
    if (!stillClear) record = null; // the caravan is cut — failover below re-dispatches
  }

  // (b) ARRIVE — a valid shipment reaching its arrival tick delivers.
  if (record && tick >= record.arrivalTick) {
    const forked = ctx.rng && typeof ctx.rng.fork === 'function' ? ctx.rng.fork(`banditry:${key}:${record.arrivalTick}`) : null;
    // Real shipments ride M1's banditry through embattled ground (delivered fraction).
    const danger = embattlementLevel(ctx.worldState, record.sourceId);
    const bandit = banditryLoss({ channelStrength: 1, dangerLevel: danger, rng: forked || undefined });
    bufferWeeks = round2(SUPPLY_TUNING.BUFFER_WEEKS * clamp01(finiteNumber(bandit.delivered, 1)));
    record = null;
    arrived = true;
  }

  // (c) DRAW — no arrival this tick ⇒ the buffer feeds consumption and drains.
  if (!arrived) bufferWeeks = round2(Math.max(0, bufferWeeks - tickWeeks));

  // (d) DISPATCH — no in-transit record ⇒ failover to the cheapest clear source.
  if (!record) {
    const picked = pickSource(link.rankedSources, {
      digest: ctx.digest, worldState: ctx.worldState, destinationId,
      riskTolerance: ctx.riskTolerance, season: ctx.season ?? null, sourceSevered: ctx.sourceSevered,
      isHostileToDestination: ctx.isHostileToDestination,
    });
    if (picked) {
      const weeks = routeWeeks(ctx.digest, picked.route.baseCost);
      // arrivalTick rides the PULSE clock (tick increments once per pulse), but routeWeeks
      // is in real WEEKS — convert by the tick span so a coarse (monthly/seasonal) interval
      // doesn't stretch caravan latency by the tickWeeks factor while the buffer DRAW (above)
      // already drains in real weeks. Weekly ticks (tickWeeks 1) are unchanged:
      // round(weeks / 1) === weeks, byte-identical.
      const tw = tickWeeks > 0 ? tickWeeks : SUPPLY_TUNING.DEFAULT_TICK_WEEKS;
      const pulsesToArrive = Math.max(1, Math.round(weeks / tw));
      record = {
        institutionId: String(link.institutionId), settlementId: destinationId, input: String(link.input),
        sourceId: picked.sourceId, arrivalTick: tick + pulsesToArrive, starving: false,
      };
    }
  }

  // (e) STARVE — total cut (all sources severed) AND empty buffer AND not fragile-braked.
  const totallyCut = allSourcesSevered(link.rankedSources, ctx.sourceSevered) && !record;
  const starving = totallyCut && bufferWeeks <= 0 && !fragile;
  const receipt = starving && !priorStarving
    ? starvationReceipt({
        institutionName: link.institutionName || String(link.institutionId),
        input: link.input,
        cause: ctx.severingCause,
        weeksCut: SUPPLY_TUNING.STARVE_AFTER_WEEKS,
      })
    : null;
  if (record) record.starving = starving;

  return { record, bufferWeeks, starving, arrived, receipt, fragile };
}

// ── THE ORCHESTRATOR — advance the whole shipment ledger one tick ─────────────
/**
 * Advance the in-transit shipment ledger one tick over the active supply links.
 * DORMANT (no spatial marker) ⇒ { next: prior, changed: false } — zero work, an
 * existing ledger PRESERVED untouched. Otherwise, per link (codepoint-sorted by
 * key): step the shipment/buffer/starvation; keep a ledger record ONLY when a
 * shipment is in transit OR the link is starving (so the ledger stays
 * AGGREGATE + sparse — records = active links, never per-wagon). Returns the next
 * ledger plus the per-link outcomes the kernel writes back onto economicState
 * buffers + institution impairments.
 * @param {Object} args
 * @param {SupplyLink[]} args.links
 * @param {SupplyWorldState} args.worldState
 * @param {SpatialDigest} args.digest
 * @param {number} args.tick
 * @param {number} [args.tickWeeks]
 * @param {string|null} [args.season]  SEASONS-B: the current road season (derived
 *   free from seasonForTick). Null / no overlay ⇒ no seasonal modulation.
 * @param {{ fork?: (k: string) => { random: () => number } }|null} [args.rng]
 * @param {(destId: string, sourceId: string) => boolean} [args.sourceSeveredFor]
 * @param {(destId: string, gateId: string) => boolean} [args.hostileToDestinationFor]
 * @param {(link: SupplyLink) => number} [args.riskToleranceFor]
 * @param {(link: SupplyLink) => (string|undefined)} [args.severingCauseFor]
 * @returns {{ next: Record<string, ShipmentRecord>|null, changed: boolean,
 *   outcomes: Record<string, LinkOutcome> }}
 */
export function advanceSupplyShipments({
  links, worldState, digest, tick, tickWeeks, season = null,
  rng = null, sourceSeveredFor, hostileToDestinationFor, riskToleranceFor, severingCauseFor,
}) {
  const prior = hasSpatialLedger(worldState, 'supplyShipments')
    ? /** @type {Record<string, ShipmentRecord>} */ (asObject(getSpatialLedger(worldState, 'supplyShipments')))
    : null;
  if (!supplyActive(worldState)) {
    return { next: prior && Object.keys(prior).length ? prior : null, changed: false, outcomes: {} };
  }
  const list = Array.isArray(links) ? links : [];
  /** @type {Record<string, ShipmentRecord>} */
  const next = {};
  /** @type {Record<string, LinkOutcome>} */
  const outcomes = {};
  // Codepoint-sorted iteration (the mutation-order discipline) so the ledger +
  // the seeded banditry forks are order-independent.
  const byKey = new Map();
  for (const link of list) byKey.set(linkKey(link.settlementId, link.institutionId, link.input), link);
  for (const key of [...byKey.keys()].sort()) {
    const link = byKey.get(key);
    const ctx = {
      digest, worldState, tick, tickWeeks, season,
      rng,
      riskTolerance: riskToleranceFor ? finiteNumber(riskToleranceFor(link), 1) : 1,
      sourceSevered: (/** @type {string} */ id) => !!(sourceSeveredFor && sourceSeveredFor(String(link.settlementId), id)),
      isHostileToDestination: (/** @type {string} */ id) => !!(hostileToDestinationFor && hostileToDestinationFor(String(link.settlementId), id)),
      severingCause: severingCauseFor ? severingCauseFor(link) : undefined,
    };
    const outcome = stepSupplyLink(link, prior ? prior[key] : null, ctx);
    outcomes[key] = outcome;
    // AGGREGATE ledger: keep a record only while a shipment rides or the link
    // starves — an at-rest, fully-buffered link carries NO record (sparse).
    if (outcome.record) next[key] = outcome.record;
    else if (outcome.starving) {
      next[key] = {
        institutionId: String(link.institutionId), settlementId: String(link.settlementId),
        input: String(link.input), sourceId: '', arrivalTick: -1, starving: true,
      };
    }
  }
  const nextOrNull = Object.keys(next).length ? next : null;
  const changed = JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull);
  return { next: changed ? nextOrNull : prior, changed, outcomes };
}

// ── M2b — the supply-interdiction READ for the siege verdict ──────────────────
/**
 * How supply-starved a besieged settlement is, 0..1 — the M2b siege-interdiction
 * term's input. It reads the shipment ledger (freshly advanced THIS tick — M2's
 * pass runs BEFORE the war layer): the fraction of the settlement's active links
 * that are STARVING. DORMANT (no ledger / no marker) ⇒
 * exactly 0 ⇒ resolveSiegeVerdict's term contributes 0 ⇒ the aspatial siege path
 * is BYTE-IDENTICAL. A supply-starved city's hold weakens; a fed one is unchanged.
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {string|number} settlementId
 * @returns {number} 0..1
 */
export function supplyInterdictionLevel(worldState, settlementId) {
  if (!supplyActive(worldState)) return 0;
  const ledger = asObject(getSpatialLedger(worldState, 'supplyShipments'));
  const sid = String(settlementId);
  let total = 0;
  let starving = 0;
  for (const key of Object.keys(ledger)) {
    const rec = /** @type {ShipmentRecord} */ (ledger[key]);
    if (!rec || String(rec.settlementId) !== sid) continue;
    total += 1;
    if (rec.starving) starving += 1;
  }
  return total > 0 ? clamp01(starving / total) : 0;
}
