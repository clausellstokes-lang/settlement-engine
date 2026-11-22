/**
 * entrepots.js — Phase 5.5 mover wave M6b: ENTREPÔTS / TOLLS.
 *
 * The CONSTRUCTIVE half of the spatial economy (embattlement/interdiction is the
 * destructive half): geography rewards the towns trade actually flows THROUGH. A
 * settlement that many caravans PASS THROUGH accrues EARNED CENTRALITY — not the raw
 * digest geometry (a geometrically-central town with no traffic earns nothing), but
 * the real gate-crossings of the M2/M6a active shipments. That centrality drives a
 * SPATIALLY-DRIVEN founding/growth lane (§4b): toll income lifts prosperity (feeding
 * the W-C3 build gate) and, when sustained, UNLOCKS transshipment institutions
 * (warehouse → customs house → carriers' guild).
 *
 * THE SELF-BALANCING TOLL (§4b/§6). A settlement's toll rate joins the M1 route
 * re-score as a per-through-node surcharge (embattlement.tollRateOf, read in
 * scoreRoute) — so a GREEDY toll DIVERTS shipments to a cheaper toll-free detour,
 * which EARNS the greedy town LESS centrality, which LOWERS its toll. The counterforce
 * is built in: no hard ceiling is needed for the equilibrium, only the co-built brakes
 * below prevent a pathological runaway.
 *
 * THE FOUR CO-BUILT BRAKES (design §V.6 + §VI.1 — ZERO trade-side damping existed
 * in-tree, so ALL are built here):
 *   1. GATE THROUGHPUT CEILING (congestion). A gate passes only so much: crossings
 *      beyond THROUGHPUT_CEILING earn NO extra centrality (the per-tick load is
 *      normalized against the ceiling, clamped ≤ 1) — a hub cannot mint unbounded
 *      centrality by absorbing the whole realm's trade.
 *   2. TOLL UPKEEP (infra isn't free money). Net toll income = gross − UPKEEP_RATE ×
 *      infrastructure (infra scales with centrality), so a marginal entrepôt whose
 *      upkeep exceeds its takings nets NOTHING — the prosperity lift is bounded and
 *      earned only above a break-even centrality.
 *   3. WARTIME TARGETING (a fat entrepôt is a juicy siege target). Centrality feeds a
 *      BOUNDED premium into the M1 embattlement ramp (entrepotTargetPremium →
 *      rampThreat) — capped below the hysteresis ENTER threshold so it never ALONE
 *      embattles a peaceful hub, but in wartime the wealthy crossroads is targeted
 *      first, its routes turn dangerous, and trade routes AWAY (the systemic brake:
 *      centrality concentrates risk, §V.6).
 *   4. RENT EXTRACTION BOUNDED. A HARD cap (TOLL_MAX) on the toll rate — no settlement
 *      becomes a pure tollbooth however central it grows.
 *
 * DORMANCY (constitutional). LIVE only under `entrepotActive` — the SAME gate as the
 * commodity layer (the spatial-canon marker AND `simulationRules.commodityFlowEnabled`;
 * the entrepôt layer is part of the same trade bundle, no second flag). Absent EITHER
 * ⇒ this module never runs: no `entrepots` ledger materializes, tollRateOf reads 0 so
 * the M1 re-score is BYTE-IDENTICAL, prosperity is untouched, and M6a is untouched.
 *
 * PURE + LAZY: no Date, no Math.random (centrality/toll are deterministic derivations
 * of state — no seeded rng needed), no mutation of inputs, no tier/auth read. A spatial
 * leaf (the lazy engine chunk) — zero first-paint bytes; the `entrepots` ledger nests
 * under the FP-R `spatialLedgers` namespace (setSpatialLedger). Codepoint-sorted
 * mutation order; tick-time only.
 *
 * CLEAN SEAMS for the rest of M6:
 *   • M6c (dispatch EV): the centrality/toll reads + the need-premium band (M6a's
 *     commodityBand) are the origin-side inputs the go/no-go EV will consume.
 *   • M6d (flow-derived economics): tollProsperityFor is the FIRST flow-derived drift;
 *     the windowed centrality is the throughput-tally shape M6d's read-model extends.
 */

import { hasSpatialLedger, getSpatialLedger } from './distanceRead.js';
import { chooseRoute } from './embattlement.js';
import { commodityFlowActive } from './commodityFlow.js';

/** @typedef {import('./distanceRead.js').SpatialDigest} SpatialDigest */

// ── Tuning (documented; retuned in the M6b + checkpoint soaks) ────────────────
export const ENTREPOT_TUNING = Object.freeze({
  // CENTRALITY WINDOW (earned from crossings). Each tick centrality is an EWMA of the
  // normalized per-tick crossing load: centrality ← centrality·(1−DECAY) + load01·DECAY,
  // where load01 = min(crossings, THROUGHPUT_CEILING)/THROUGHPUT_CEILING ∈ [0,1]. So
  // centrality is a decayed AVERAGE of throughput, naturally in [0,1]; DECAY sets the
  // window (0.08 ⇒ ~12-tick / ~3-month memory). A town that stops carrying trade
  // decays back below MIN_CENTRALITY and is pruned (sparse ledger).
  CENTRALITY_DECAY: 0.08,
  MIN_CENTRALITY: 0.02,
  // BRAKE 1 — GATE THROUGHPUT CEILING (congestion). Crossings beyond this in one tick
  // add NO extra centrality (the load saturates at 1.0). ~6 concurrent caravan-links
  // is a busy gate; more just queues.
  THROUGHPUT_CEILING: 6,
  // Toll derivation. toll = min(TOLL_MAX, TOLL_PER_CENTRALITY · centrality). In
  // median-primary-hop units: a max-throughput hub tolls ~one extra hop to pass
  // through — enough that a one-hop-longer toll-free detour wins (the divert).
  TOLL_PER_CENTRALITY: 1.0,
  // BRAKE 4 — RENT EXTRACTION BOUNDED. The HARD cap on the toll rate (median-hop
  // units). No settlement becomes a pure tollbooth however central it grows.
  TOLL_MAX: 1.0,
  // Toll PROSPERITY (the W-C3 build-gate health lift) + BRAKE 2 (upkeep).
  //   gross  = centrality · toll            (traffic × rate captured)
  //   net    = gross − UPKEEP_RATE · centrality   (infra maintenance ∝ centrality)
  //   lift   = PROSPERITY_W · clamp01(net)
  // Upkeep ∝ centrality but gross ∝ centrality·toll (≈ centrality²), so a marginal
  // entrepôt (low centrality) nets ≤ 0 — infra isn't free money; only a genuinely
  // busy hub profits, and the lift is bounded by PROSPERITY_W.
  PROSPERITY_W: 0.3,
  UPKEEP_RATE: 0.35,
  // BRAKE 3 — WARTIME TARGETING. The bounded premium fed into the M1 embattlement
  // ramp. TARGET_PREMIUM_MAX is kept BELOW the hysteresis ENTER threshold (0.55) so a
  // fat entrepôt is never embattled by its wealth ALONE — but in wartime it is the
  // first target (its ramp already carries siege/occupation terms).
  TARGET_W: 0.3,
  TARGET_PREMIUM_MAX: 0.2,
  // Transshipment INSTITUTION UNLOCK. Centrality at/above INSTITUTION_CENTRALITY for
  // INSTITUTION_STREAK consecutive ticks (~2 months) unlocks the next transshipment
  // institution on the founding lane (one per streak crossing; bounded to the three).
  INSTITUTION_CENTRALITY: 0.5,
  INSTITUTION_STREAK: 8,
  // Default caravan risk tolerance for recomputing shipment crossings (mirrors the M2
  // dispatcher SUPPLY_RISK_TOLERANCE — the routes were dispatched at this fidelity).
  DEFAULT_RISK_TOLERANCE: 0.6,
});

// The transshipment founding lane (§4b), in unlock ORDER. A sustained entrepôt grows
// these one at a time on the W-C3 machinery (the kernel applies the next missing one).
export const TRANSSHIPMENT_INSTITUTIONS = Object.freeze([
  Object.freeze({ name: 'Warehouse', category: 'commerce', tags: Object.freeze(['storage', 'transshipment', 'trade']) }),
  Object.freeze({ name: 'Customs House', category: 'civic', tags: Object.freeze(['toll', 'transshipment', 'trade']) }),
  Object.freeze({ name: "Carriers' Guild", category: 'commerce', tags: Object.freeze(['guild', 'transshipment', 'trade']) }),
]);

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── The activation gate (dormancy / byte-identity seam) ───────────────────────
/**
 * The entrepôt layer is LIVE iff the commodity layer is (the SAME double gate: the
 * spatial-canon marker AND `simulationRules.commodityFlowEnabled` — the entrepôt layer
 * rides the same trade bundle, no second flag). Absent EITHER ⇒ the advance is a no-op,
 * no `entrepots` ledger is materialized, tollRateOf reads 0 (the M1 re-score is
 * byte-identical), and prosperity/M6a are untouched.
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function entrepotActive(worldState) {
  return commodityFlowActive(worldState);
}

// ── The record ────────────────────────────────────────────────────────────────
/**
 * @typedef {Object} EntrepotRecord
 * @property {number} centrality  0..1 EARNED centrality (windowed crossing load)
 * @property {number} toll        0..TOLL_MAX toll rate (median-hop units; the M1 read)
 * @property {number|null} since  tick sustained-centrality began (null when not sustained-eligible)
 * @property {number} lastTick    tick this record last advanced
 */

// ── Derived reads (pure functions of a record — the seams M1/W-C3/M5 consume) ──
/**
 * The toll RATE for an entrepôt record, capped by the rent-extraction bound. This is
 * what embattlement.tollRateOf surfaces to the route re-score. Pure.
 * @param {number} centrality @returns {number} in [0, TOLL_MAX]
 */
export function tollFromCentrality(centrality) {
  const T = ENTREPOT_TUNING;
  const c = clamp01(finiteNumber(centrality, 0));
  return Math.min(T.TOLL_MAX, T.TOLL_PER_CENTRALITY * c);
}

/**
 * The 0..PROSPERITY_W economy-health lift a settlement's toll income contributes — the
 * bounded market boom the W-C3 institution-build gate reads. Net of upkeep (BRAKE 2):
 * a marginal entrepôt nets nothing. 0 when no record. Pure.
 * @param {EntrepotRecord|null|undefined} record @returns {number}
 */
export function tollProsperityOf(record) {
  if (!record) return 0;
  const T = ENTREPOT_TUNING;
  const centrality = clamp01(finiteNumber(record.centrality, 0));
  const toll = Math.max(0, finiteNumber(record.toll, 0));
  const gross = centrality * toll;
  const net = gross - T.UPKEEP_RATE * centrality;
  return T.PROSPERITY_W * clamp01(net);
}

/**
 * Economy-health lift for a settlement id, read straight off the `entrepots` ledger.
 * 0 when absent/dormant (byte-identical). The W-C3 lane folds this into `health` exactly
 * as it folds conquestProsperityFor. Pure.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState @param {string|number} id
 * @returns {number}
 */
export function tollProsperityFor(worldState, id) {
  const rec = recordOf(asObject(getSpatialLedger(worldState, 'entrepots')), String(id));
  return tollProsperityOf(rec);
}

/**
 * The BOUNDED wartime-targeting premium (BRAKE 3) an entrepôt's centrality adds to the
 * M1 embattlement ramp — capped below the hysteresis ENTER threshold so wealth alone
 * never embattles a peaceful hub. 0 when absent/dormant (rampThreat byte-identical). Pure.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState @param {string|number} id
 * @returns {number} in [0, TARGET_PREMIUM_MAX]
 */
export function entrepotTargetPremium(worldState, id) {
  const T = ENTREPOT_TUNING;
  const rec = recordOf(asObject(getSpatialLedger(worldState, 'entrepots')), String(id));
  if (!rec) return 0;
  const centrality = clamp01(finiteNumber(rec.centrality, 0));
  return Math.min(T.TARGET_PREMIUM_MAX, T.TARGET_W * centrality);
}

/** Is this settlement's centrality SUSTAINED long enough to unlock a transshipment
 *  institution? @param {EntrepotRecord|null|undefined} rec @param {number} now @returns {boolean} */
export function isSustainedEntrepot(rec, now) {
  const T = ENTREPOT_TUNING;
  if (!rec) return false;
  const centrality = clamp01(finiteNumber(rec.centrality, 0));
  if (centrality < T.INSTITUTION_CENTRALITY) return false;
  const since = Number.isFinite(rec.since) ? Number(rec.since) : null;
  return since != null && (Math.floor(finiteNumber(now, 0)) - since) >= T.INSTITUTION_STREAK;
}

/** @param {Record<string, unknown>|null} ledger @param {string} id @returns {EntrepotRecord|null} */
function recordOf(ledger, id) {
  const rec = ledger ? ledger[String(id)] : null;
  return rec && typeof rec === 'object' && !Array.isArray(rec) ? /** @type {EntrepotRecord} */ (rec) : null;
}

// ── EARNED CENTRALITY — count the gate-crossings of the ACTIVE shipments ───────
/**
 * Tally, per intermediary settlement, how many ACTIVE shipments actually PASS THROUGH
 * it this tick. This is EARNED centrality: a shipment's route is recomputed
 * deterministically (chooseRoute, toll-aware — the self-balancing) and every
 * INTERMEDIARY (path minus its producer origin and consumer destination) accrues one
 * crossing. A geometrically-central town with no shipments crossing it earns ZERO;
 * endpoints of a shipment earn nothing FROM that shipment (they are not gate-crossings).
 * Skips the M2/M6a starvation-latch records (no sourceId / no route). Codepoint-stable.
 * @param {Array<{ sourceId?: unknown, settlementId?: unknown }>} shipments
 * @param {SpatialDigest} digest
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {number} riskTolerance
 * @param {string|null} [season]
 * @returns {Record<string, number>} settlementId → crossing count (intermediaries only)
 */
export function countCrossings(shipments, digest, worldState, riskTolerance, season = null) {
  /** @type {Record<string, number>} */
  const crossings = {};
  const list = Array.isArray(shipments) ? shipments : [];
  const rt = finiteNumber(riskTolerance, ENTREPOT_TUNING.DEFAULT_RISK_TOLERANCE);
  for (const rec of list) {
    const sourceId = String(rec?.sourceId ?? '');
    const destId = String(rec?.settlementId ?? '');
    if (!sourceId || !destId || sourceId === destId) continue; // starvation latch / degenerate
    const route = chooseRoute(digest, worldState, sourceId, destId, rt, season ?? null);
    const path = route && Array.isArray(route.path) ? route.path : [];
    for (let i = 1; i < path.length - 1; i++) {
      const inter = String(path[i]);
      crossings[inter] = (crossings[inter] || 0) + 1;
    }
  }
  return crossings;
}

// ── The scalar + sustained step (one settlement) ──────────────────────────────
/**
 * Advance ONE entrepôt record from its crossing count this tick. Centrality is the
 * decayed EWMA of the normalized (throughput-ceilinged) load; the toll derives from it
 * (rent-bounded); the sustained clock ticks while centrality holds above the unlock
 * threshold. Returns null when a spent record decays below MIN_CENTRALITY (prune).
 * @param {EntrepotRecord|null} prior @param {number} crossings @param {number} now
 * @returns {EntrepotRecord|null}
 */
export function stepEntrepot(prior, crossings, now) {
  const T = ENTREPOT_TUNING;
  const priorCentrality = prior ? clamp01(finiteNumber(prior.centrality, 0)) : 0;
  const load = Math.max(0, finiteNumber(crossings, 0));
  const load01 = Math.min(1, load / T.THROUGHPUT_CEILING);
  const centrality = clamp01(priorCentrality * (1 - T.CENTRALITY_DECAY) + load01 * T.CENTRALITY_DECAY);

  // Prune only a SPENT record — negligible centrality AND no fresh crossing this tick
  // (a still-crossed record persists while it builds up, even below the floor; a
  // no-longer-crossed one decays out — the sparse-ledger discipline, mirroring M1).
  if (centrality < T.MIN_CENTRALITY && load <= 0) return null;

  const toll = tollFromCentrality(centrality);
  // Sustained clock: keep `since` while centrality stays at/above the unlock floor,
  // (re)start it on the crossing UP, drop it when centrality falls below the floor.
  let since = prior && Number.isFinite(prior.since) ? Number(prior.since) : null;
  if (centrality >= T.INSTITUTION_CENTRALITY) {
    if (since == null) since = Math.floor(finiteNumber(now, 0));
  } else {
    since = null;
  }
  return {
    centrality: round4(centrality),
    toll: round4(toll),
    since,
    lastTick: Math.floor(finiteNumber(now, 0)),
  };
}

// ── THE ORCHESTRATOR — advance the whole entrepôt ledger one tick ─────────────
/**
 * @typedef {Object} EntrepotOutcome
 * @property {number} centrality
 * @property {number} toll
 * @property {number} crossings   raw crossings this tick (pre-ceiling)
 * @property {number} prosperity  the W-C3 health lift (net of upkeep)
 * @property {number} targetPremium  the bounded wartime-targeting premium
 * @property {boolean} sustained  centrality sustained ⇒ eligible for a founding
 */

/**
 * Advance the entrepôt ledger one tick from the ACTIVE shipments' gate-crossings.
 * DORMANT (no marker / opt-in off) ⇒ { next: prior, changed:false, outcomes:{} } — zero
 * work, an existing ledger PRESERVED untouched. Otherwise per settlement (prior ledger ∪
 * the crossed settlements, codepoint-sorted): step centrality/toll/sustained; drop the
 * pruned. Pure + deterministic (no rng — centrality is a derivation of crossings).
 * @param {Object} args
 * @param {Array<{ sourceId?: unknown, settlementId?: unknown }>} args.shipments  the active shipment ledger (M2/M6a)
 * @param {SpatialDigest} args.digest
 * @param {{ spatialLedgers?: unknown, spatialCanonVersion?: unknown, simulationRules?: unknown }} args.worldState
 * @param {number} args.tick
 * @param {string|null} [args.season]
 * @param {number} [args.riskTolerance]
 * @returns {{ next: Record<string, EntrepotRecord>|null, changed: boolean, outcomes: Record<string, EntrepotOutcome> }}
 */
export function advanceEntrepots({ shipments, digest, worldState, tick, season = null, riskTolerance }) {
  const prior = hasSpatialLedger(worldState, 'entrepots')
    ? /** @type {Record<string, EntrepotRecord>} */ (asObject(getSpatialLedger(worldState, 'entrepots')))
    : null;
  if (!entrepotActive(worldState) || !digest) {
    return { next: prior && Object.keys(prior).length ? prior : null, changed: false, outcomes: {} };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const rt = finiteNumber(riskTolerance, ENTREPOT_TUNING.DEFAULT_RISK_TOLERANCE);
  const crossings = countCrossings(shipments, digest, worldState, rt, season);

  const ids = new Set([...Object.keys(prior || {}), ...Object.keys(crossings)].map(String));
  /** @type {Record<string, EntrepotRecord>} */
  const next = {};
  /** @type {Record<string, EntrepotOutcome>} */
  const outcomes = {};
  for (const id of [...ids].sort()) {
    const record = stepEntrepot(recordOf(prior, id), crossings[id] || 0, now);
    if (!record) continue;
    next[id] = record;
    outcomes[id] = {
      centrality: record.centrality,
      toll: record.toll,
      crossings: crossings[id] || 0,
      prosperity: tollProsperityOf(record),
      targetPremium: Math.min(ENTREPOT_TUNING.TARGET_PREMIUM_MAX, ENTREPOT_TUNING.TARGET_W * record.centrality),
      sustained: isSustainedEntrepot(record, now),
    };
  }
  const nextOrNull = Object.keys(next).length ? next : null;
  const changed = JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull);
  return { next: changed ? nextOrNull : prior, changed, outcomes };
}

// ── The concentration (Gini) read — the soak-guard (no runaway toll-hub) ──────
/**
 * The Gini coefficient of the centrality distribution across the ledger — the
 * megacity-loop soak's bound. 0 = perfectly even, →1 = one hub takes everything. The
 * co-built brakes (throughput ceiling, toll-diverts-routing, wartime targeting, rent
 * cap) keep this bounded: no single settlement runs away to a toll monopoly. Pure.
 * @param {Record<string, EntrepotRecord>|null|undefined} ledger @returns {number} in [0, 1]
 */
export function centralityGini(ledger) {
  const recs = ledger && typeof ledger === 'object' ? Object.values(ledger) : [];
  const vals = recs.map((r) => Math.max(0, finiteNumber(/** @type {EntrepotRecord} */ (r)?.centrality, 0))).sort((a, b) => a - b);
  const n = vals.length;
  if (n === 0) return 0;
  const sum = vals.reduce((a, b) => a + b, 0);
  if (sum <= 0) return 0;
  // Gini = (2·Σ i·x_i) / (n·Σ x_i) − (n+1)/n  (1-indexed, ascending).
  let weighted = 0;
  for (let i = 0; i < n; i++) weighted += (i + 1) * vals[i];
  return clamp01((2 * weighted) / (n * sum) - (n + 1) / n);
}
