/**
 * migration.js — Phase 5.5 mover wave M4: MIGRATION-WITH-MORTALITY.
 *
 * Population as a spatial FLOW (design §4c). When a settlement sheds population
 * (the existing mass-emigration event), the displaced pool no longer teleports a
 * flat fraction into its aspatial neighbours. Instead it becomes a REFUGEE COLUMN
 * that travels a ROUTE, loses people to TWO mortality sinks, and arrives — FEWER
 * than left, LATER than it departed — at a destination chosen over four axes.
 *
 * THE MODEL (pure; the kernel adapter supplies the live reads):
 *
 *   1. CARRYING-CAPACITY TOLERANCE τ (context-dependent, §4c). Prosperity +
 *      connectivity + granary RAISE an origin's tolerance — a prosperous, well-
 *      connected, granaried town PROVISIONS its displaced (most survive to travel);
 *      a poor cut-off town's weak/old die where they stand. τ governs the ORIGIN
 *      SURVIVAL split, NOT the shed amount (see the reconciliation note below).
 *
 *   2. TWO MORTALITY SINKS, both EVENTS with receipts (§4c "make something of it"):
 *      • ORIGIN death — a τ-scaled fraction of the displaced pool perishes at the
 *        origin (the weak, the old, those who cannot travel).
 *      • ROAD death — a fraction of the TRAVELLERS perishes in transit, scaled by
 *        the route's M1 EMBATTLEMENT × the M3 SEASON (refugees through a winter war
 *        zone die more) — BOUNDED (ROAD_DEATH_MAX): a war-zone column dies MORE but
 *        is NEVER wiped out ("rescuable, not annihilated").
 *
 *   3. THE 4-AXIS DESTINATION CHOICE (§4c, round 6). Travellers weight each reachable
 *      destination by CLOSENESS (path cost) + CULTURE AFFINITY (least drift — the
 *      §II.5-2 cultureDistance composite, a LIVE read) + SAFETY (least hostile) +
 *      RICHNESS (prosperity gravity). A PRNG SCATTER FRACTION disperses to the
 *      "wrong" place (not all cluster in the nearest friendly town).
 *
 *   4. THE CO-BUILT BRAKES (all mandatory, §II.3-3):
 *      • CONGESTION PUSHBACK — a hub's RICHNESS pull DECAYS as it fills (per-capita
 *        saturation + crowding + size-scaled crime, folded into one capacityPressure
 *        term) so no megacity forms.
 *      • SCATTER-FLOOR — the aspatial 'concentrated' distribution mode (100% into one
 *        destination) is FORBIDDEN under spatial; a minimum SCATTER_FLOOR always
 *        disperses, so a single hub can never swallow a whole region's refugees.
 *      • TRANSPORT LAG — arrivals are QUEUED (the in-transit column ledger, arrivalTick
 *        = now + hopWeeks); the lag itself smooths the migration wave (a stabilizer).
 *      • ORIGIN-LOSS-PROXY RECONCILIATION — the aspatial `abs*0.45` proxy (which shed
 *        the full `abs` and vanished 55% untracked) BECOMES the ORIGIN-MORTALITY
 *        stage: under spatial we NEVER apply `abs*0.45`; the origin sheds the same
 *        `abs` (byte-parity origin trajectory) and that pool splits EXACTLY into
 *        originDeaths + roadDeaths + arrivals — no double-count, no untracked vanish.
 *      • THE CONSERVATION-LEDGER INVARIANT — for every dispatch,
 *        Σarrivals + originDeaths + ΣroadDeaths == departures (== the shed `abs`),
 *        EXACT integers by construction (`assertMigrationConservation`).
 *
 * NAMED-NPC SAFETY (owner product-scope boundary, BINDING): M4 mortality is
 * AGGREGATE POPULATION ONLY — a count reduction on a settlement, never the death or
 * removal of a NAMED NPC. This module moves NUMBERS; it holds no npc ids, reads no
 * npc roster, and returns no npc mutation. Named-NPC movement is the §4h excursion
 * model (a separate, protected, round-trip mover) — never this.
 *
 * DORMANCY (constitutional): the column ledger materializes ONLY under the
 * spatialCanonVersion marker AND only while a column is actually in transit (sparse).
 * Off the marker the whole pass is a no-op and no `migration` key is ever written —
 * the aspatial population path (populationDynamics.js) stays BYTE-IDENTICAL.
 *
 * PURE + LAZY: no Date, no Math.random, no mutation, no tier/auth. A spatial leaf
 * (the lazy engine chunk) — zero first-paint bytes; the migration ledger nests under
 * the FP-R `spatialLedgers` namespace (setSpatialLedger), so a NEW mover ledger costs
 * ZERO eager bytes. The seeded PRNG (scatter + the split tie-break) is forked from a
 * stable composite key at the call site (`migration:${originId}:${tick}`).
 */

import { hasSpatialLedger, getSpatialLedger } from './distanceRead.js';

// ── Tuning (documented here; retuned in the M4 + checkpoint soaks) ────────────
// Every constant is NAMED with its game-feel effect so the owner can retune WITHOUT
// a rebuild. The soak-observed effect of each block is recorded in the wave report.
export const MIGRATION_TUNING = Object.freeze({
  // CARRYING-CAPACITY TOLERANCE τ ∈ [0,1] (§4c). τ raises ORIGIN SURVIVAL. A bare
  // settlement (no prosperity/connectivity/granary) reads TOL_BASE; the three
  // context terms add toward 1. A prosperous, connected, granaried origin loses far
  // fewer of its displaced to origin-death.
  TOL_BASE: 0.15,
  W_PROSPERITY: 0.4,   // a wealthy origin provisions the journey (τ↑)
  W_CONNECTIVITY: 0.25, // a well-connected origin imports relief (τ↑)
  W_GRANARY: 0.2,      // stored food buys the weak time to travel (τ↑)

  // ORIGIN MORTALITY. originDeathRate = MIN + (MAX-MIN)·(1-τ): at τ=1 (max
  // tolerance) only ORIGIN_DEATH_MIN die at origin; at τ=0 up to ORIGIN_DEATH_MAX.
  // Conservative: even the poorest origin sheds a MAJORITY as travellers (no
  // origin annihilation).
  ORIGIN_DEATH_MIN: 0.05,
  ORIGIN_DEATH_MAX: 0.4,

  // ROAD MORTALITY. roadDeathRate = clamp(BASE + EMBATTLE·danger·seasonFactor, 0,
  // ROAD_DEATH_MAX). BASE is the toll of distance/terrain on a safe peaceful road;
  // EMBATTLE is the added toll per unit of route danger (M1 embattlement level);
  // the season factor (SEASON_ROAD_DEATH) makes a WINTER war zone deadlier. MAX is
  // the hard bound — a refugee stream through the worst passage dies MORE but is
  // NEVER wiped out (echoes M3's slow-not-sever).
  ROAD_DEATH_BASE: 0.03,
  ROAD_DEATH_EMBATTLE: 0.35,
  ROAD_DEATH_MAX: 0.5,

  // THE 4-AXIS DESTINATION WEIGHTS (§4c round 6). Closeness + culture affinity +
  // safety + richness. Sum need not be 1 (the split normalizes). Richness is the
  // gravity term the congestion brake fights.
  W_CLOSE: 0.32,
  W_CULTURE: 0.26,
  W_SAFETY: 0.24,
  W_RICH: 0.18,

  // CONGESTION PUSHBACK (§II.3-3 brake). A destination's RICHNESS pull is scaled by
  // (1 - CONGEST_DECAY·capacityPressure01): a saturated hub (capacityPressure→1)
  // loses up to CONGEST_DECAY of its richness gravity, so its pull DECAYS as it fills
  // and migrants spread elsewhere — the megacity damper.
  CONGEST_DECAY: 0.85,

  // SCATTER (§4c "a scatter fraction goes to the wrong place"). SCATTER_FRACTION of
  // travellers disperse by a FLAT (score-blind) seeded weight instead of the 4-axis
  // score — some refugees end up somewhere unlikely. SCATTER_FLOOR is the co-built
  // scatter-floor brake: even when the top destination dominates the score, at least
  // this fraction is spread across the OTHER reachable destinations, so the
  // 'concentrated' mode (100% into one) is structurally impossible under spatial.
  SCATTER_FRACTION: 0.18,
  SCATTER_FLOOR: 0.1,

  // How many reachable destinations a column may split across (bounds the ledger
  // cardinality: ≤ MAX_DESTINATIONS columns per dispatch). Mirrors the aspatial
  // top-4 disperse cap.
  MAX_DESTINATIONS: 4,

  // A column carrying fewer than this many people is not worth a ledger record —
  // its arrivals fold into origin-death (too few to make the journey as a column).
  // Keeps the ledger sparse and the split from minting 1-person columns.
  MIN_COLUMN: 2,
});

// The DISTRIBUTION MODE is fixed to 'disperse' under spatial — the aspatial
// 'concentrated' mode is FORBIDDEN (the scatter-floor brake). Exported so a caller /
// test can assert the forbidden mode is never selected.
export const SPATIAL_DISTRIBUTION_MODE = 'disperse';
export const FORBIDDEN_DISTRIBUTION_MODE = 'concentrated';

// Per-season ROAD-DEATH multiplier (M3 composition): winter is deadliest on the
// road (the granary is dry AND the passage is hard); spring/summer are kind. Bounded
// so the season alone never breaches ROAD_DEATH_MAX. Null/unknown season ⇒ 1.
export const SEASON_ROAD_DEATH = Object.freeze({
  spring: 0.85, summer: 1, autumn: 1.1, winter: 1.6,
});

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── The activation gate (dormancy / byte-identity seam) ───────────────────────
/**
 * Migration-with-mortality is LIVE iff the spatial-canon marker is present. Like
 * embattlement/supply it is a PHYSICAL layer (NOT info-mode gated). Absent ⇒ every
 * pass is a no-op and no `migration` key is ever materialized (byte-exact).
 * @param {{ spatialCanonVersion?: unknown } | null | undefined} worldState
 * @returns {boolean}
 */
export function migrationActive(worldState) {
  if (!worldState || typeof worldState !== 'object') return false;
  const marker = worldState.spatialCanonVersion;
  return Number.isInteger(marker) && Number(marker) > 0;
}

// ── 1. CARRYING-CAPACITY TOLERANCE (context-dependent, §4c) ───────────────────
/**
 * The origin's carrying-capacity tolerance τ ∈ [0,1] — prosperity + connectivity +
 * granary RAISE it. A high-τ origin provisions its displaced (they survive to
 * travel); a low-τ origin loses more to origin-death. Pure; the caller supplies the
 * three already-read 0..1 primitives.
 * @param {{ prosperity01?: number, connectivity01?: number, granary01?: number }} [inputs]
 * @returns {number} τ in [0, 1]
 */
export function carryingCapacityTolerance(inputs = {}) {
  const T = MIGRATION_TUNING;
  const pros = clamp01(finiteNumber(inputs.prosperity01, 0));
  const conn = clamp01(finiteNumber(inputs.connectivity01, 0));
  const gran = clamp01(finiteNumber(inputs.granary01, 0));
  return clamp01(T.TOL_BASE + T.W_PROSPERITY * pros + T.W_CONNECTIVITY * conn + T.W_GRANARY * gran);
}

/**
 * The origin-death RATE (fraction of the displaced pool that perishes at origin) for
 * a tolerance τ: MIN at full tolerance, up to MAX at zero tolerance. Bounded so the
 * MAJORITY always survives to travel (no origin annihilation).
 * @param {number} tolerance τ in [0,1]
 * @returns {number} in [ORIGIN_DEATH_MIN, ORIGIN_DEATH_MAX]
 */
export function originDeathRate(tolerance) {
  const T = MIGRATION_TUNING;
  const tau = clamp01(finiteNumber(tolerance, 0));
  return T.ORIGIN_DEATH_MIN + (T.ORIGIN_DEATH_MAX - T.ORIGIN_DEATH_MIN) * (1 - tau);
}

/**
 * The road-death RATE for a route of the given danger (M1 embattlement level 0..1)
 * in the given season. BASE + EMBATTLE·danger·seasonFactor, CLAMPED to
 * [0, ROAD_DEATH_MAX] — a war-zone winter road kills more, never everyone.
 * @param {number} routeDanger01 the route's embattlement level (0..1)
 * @param {string|null|undefined} season
 * @returns {number} in [0, ROAD_DEATH_MAX]
 */
export function roadDeathRate(routeDanger01, season) {
  const T = MIGRATION_TUNING;
  const danger = clamp01(finiteNumber(routeDanger01, 0));
  const seasonFactor = finiteNumber(
    /** @type {Record<string, number>} */ (SEASON_ROAD_DEATH)[String(season)], 1);
  const rate = T.ROAD_DEATH_BASE + T.ROAD_DEATH_EMBATTLE * danger * seasonFactor;
  return Math.min(T.ROAD_DEATH_MAX, Math.max(0, rate));
}

// ── 3. THE 4-AXIS DESTINATION SCORE (+ congestion pushback) ───────────────────
/**
 * A reachable destination candidate for a migration, with its four normalized axes
 * (0..1, higher = more attractive on that axis) already read by the kernel adapter.
 * @typedef {Object} DestinationCandidate
 * @property {string} destId
 * @property {number} closeness01      1 = nearest reachable; 0 = the map's far edge.
 * @property {number} cultureAffinity01 1 = same culture; 0 = maximally distant (1 - cultureDistance).
 * @property {number} safety01         1 = peaceful/friendly; 0 = hostile/at-war (1 - hostility).
 * @property {number} richness01       1 = the richest reachable hub; 0 = destitute.
 * @property {number} capacityPressure01 0 = empty/room to grow; 1 = saturated (congestion brake input).
 * @property {number} routeDanger01    the route's M1 embattlement level (road-death input).
 * @property {number} arrivalTick      now + hopWeeks(origin, dest, season) (transport lag).
 */

/**
 * The 4-axis attractiveness score of a destination, with CONGESTION PUSHBACK folded
 * into the richness axis: a saturated destination (capacityPressure01→1) loses up to
 * CONGEST_DECAY of its richness gravity, so a hub's pull DECAYS as it fills. Always
 * ≥ 0. Pure.
 * @param {DestinationCandidate} candidate
 * @returns {number} the (unnormalized) destination weight, ≥ 0.
 */
export function destinationScore(candidate) {
  const T = MIGRATION_TUNING;
  const close = clamp01(finiteNumber(candidate.closeness01, 0));
  const culture = clamp01(finiteNumber(candidate.cultureAffinity01, 0));
  const safety = clamp01(finiteNumber(candidate.safety01, 0));
  const rawRich = clamp01(finiteNumber(candidate.richness01, 0));
  const pressure = clamp01(finiteNumber(candidate.capacityPressure01, 0));
  // Congestion pushback: the richness pull decays as the destination fills.
  const richEff = rawRich * (1 - T.CONGEST_DECAY * pressure);
  const score = T.W_CLOSE * close + T.W_CULTURE * culture + T.W_SAFETY * safety + T.W_RICH * richEff;
  return score > 0 ? score : 0;
}

// ── The integer split (conserving; scatter-floored; never 'concentrated') ─────
/**
 * Split `travellers` across the scored destinations. A blend of a SCORE-weighted
 * share (the 4-axis pull) and a FLAT scatter share (SCATTER_FRACTION, score-blind —
 * "some go to the wrong place"), with the SCATTER-FLOOR brake guaranteeing the
 * top destination never takes everything (the 'concentrated' mode is forbidden).
 * Conserves EXACTLY: Σ split == travellers (the last share absorbs the rounding
 * remainder, clamped ≥ 0). Deterministic: destinations are pre-sorted by the caller
 * (score desc, codepoint id); the seeded rng only shuffles the scatter share.
 * @param {number} travellers                 the pool leaving on the road (integer ≥ 0)
 * @param {DestinationCandidate[]} destinations already ranked (score desc, id asc), ≤ MAX_DESTINATIONS
 * @param {number[]} weights                   destinationScore per destination (aligned to `destinations`)
 * @param {{ random: () => number } | null | undefined} rng the seeded scatter rng
 * @returns {Array<{ destId: string, travellers: number }>} per-destination traveller counts (>0), Σ == travellers
 */
export function splitTravellers(travellers, destinations, weights, rng) {
  const T = MIGRATION_TUNING;
  const total = Math.max(0, Math.floor(finiteNumber(travellers, 0)));
  const dests = Array.isArray(destinations) ? destinations : [];
  if (total <= 0 || dests.length === 0) return [];
  if (dests.length === 1) return [{ destId: String(dests[0].destId), travellers: total }];

  const wSum = weights.reduce((s, w) => s + Math.max(0, finiteNumber(w, 0)), 0);
  // FLAT scatter weights: a seeded jitter in [0.5, 1.5] so the scatter share is not
  // itself score-shaped (the "wrong place" really can win a share). Deterministic
  // given the forked rng; falls back to uniform when no rng is threaded.
  const scatterW = dests.map(() => (rng && typeof rng.random === 'function' ? 0.5 + rng.random() : 1));
  const scatterSum = scatterW.reduce((s, w) => s + w, 0);

  // Per-destination target FRACTION: a blend of score share and flat scatter share.
  // The SCATTER-FLOOR guarantees the flat component's weight is at least SCATTER_FLOOR
  // even if SCATTER_FRACTION is retuned to 0 — so no single hub can take 100%.
  const scatterFrac = Math.max(T.SCATTER_FLOOR, clamp01(T.SCATTER_FRACTION));
  const scoreFrac = 1 - scatterFrac;
  const fractions = dests.map((_, i) => {
    const scoreShare = wSum > 0 ? Math.max(0, finiteNumber(weights[i], 0)) / wSum : 1 / dests.length;
    const scatterShare = scatterSum > 0 ? scatterW[i] / scatterSum : 1 / dests.length;
    return scoreFrac * scoreShare + scatterFrac * scatterShare;
  });

  /** @type {Array<{ destId: string, travellers: number }>} */
  const out = [];
  let assigned = 0;
  for (let i = 0; i < dests.length; i++) {
    const last = i === dests.length - 1;
    const remaining = total - assigned;
    const share = last ? remaining : Math.min(remaining, Math.max(0, Math.round(total * fractions[i])));
    if (share > 0) out.push({ destId: String(dests[i].destId), travellers: share });
    assigned += share;
  }
  return out;
}

// ── 2 + THE PLAN: the full fate of one shed pool (the conservation core) ───────
/**
 * @typedef {Object} MigrationDispatch
 * @property {string} originId
 * @property {string} destId
 * @property {number} travellers   left the origin bound for this destination
 * @property {number} roadDeaths   died on THIS route (embattlement × season)
 * @property {number} arrivals     will reach this destination (travellers - roadDeaths)
 * @property {number} arrivalTick  the tick the column lands (now + hopWeeks)
 */

/**
 * @typedef {Object} MigrationPlan
 * @property {string} originId
 * @property {number} departures   the shed pool (== the aspatial `abs`; origin trajectory unchanged)
 * @property {number} originDeaths perished at origin (the reconciled abs*0.45 stage)
 * @property {number} roadDeaths   Σ perished on the road
 * @property {number} arrivals     Σ reaching a destination
 * @property {MigrationDispatch[]} dispatches one per receiving destination (arrivals > 0)
 * @property {string} mode         ALWAYS 'disperse' — 'concentrated' is forbidden under spatial
 */

/**
 * Plan the full fate of a shed pool: origin mortality → the 4-axis traveller split →
 * per-route road mortality → queued arrivals. The whole pool is accounted EXACTLY
 * (departures == originDeaths + roadDeaths + arrivals) — the conservation invariant
 * holds by construction. AGGREGATE (people counts only; no named NPC touched, ever).
 * @param {Object} args
 * @param {string} args.originId
 * @param {number} args.departures                the shed pool (the aspatial `abs`)
 * @param {number} args.tolerance                 the origin's carrying-capacity τ
 * @param {DestinationCandidate[]} args.candidates reachable destinations (with axes + arrivalTick + routeDanger)
 * @param {string|null|undefined} args.season      the M3 road season (road-death modulation)
 * @param {{ random: () => number } | null | undefined} args.rng the seeded scatter rng
 * @returns {MigrationPlan}
 */
export function planMigration({ originId, departures, tolerance, candidates, season, rng }) {
  const T = MIGRATION_TUNING;
  const origin = String(originId);
  const dep = Math.max(0, Math.floor(finiteNumber(departures, 0)));
  const empty = /** @type {MigrationPlan} */ ({
    originId: origin, departures: dep, originDeaths: dep, roadDeaths: 0, arrivals: 0,
    dispatches: [], mode: SPATIAL_DISTRIBUTION_MODE,
  });
  if (dep <= 0) return { ...empty, originDeaths: 0 };

  // Stage 1 — ORIGIN MORTALITY (the reconciled abs*0.45 proxy). A τ-scaled fraction
  // dies at origin; the rest become travellers. No reachable destination (isolated /
  // unmapped origin) ⇒ the WHOLE pool is origin-loss (nowhere to go).
  const ranked = (Array.isArray(candidates) ? candidates.slice() : [])
    .filter((c) => c && c.destId != null && String(c.destId) !== origin)
    .map((c) => ({ candidate: c, weight: destinationScore(c) }))
    .sort((a, b) => (b.weight - a.weight)
      || (String(a.candidate.destId) < String(b.candidate.destId) ? -1
        : String(a.candidate.destId) > String(b.candidate.destId) ? 1 : 0))
    .slice(0, T.MAX_DESTINATIONS);
  if (!ranked.length) return empty;

  let originDeaths = Math.round(dep * originDeathRate(tolerance));
  let travellers = dep - originDeaths;
  // Too few to form a column ⇒ fold the remainder into origin-loss (keeps the ledger
  // sparse; a handful of people do not mount a refugee march).
  if (travellers < T.MIN_COLUMN) return empty;

  // Stage 2 — THE 4-AXIS SPLIT (scatter-floored; never 'concentrated').
  const split = splitTravellers(
    travellers,
    ranked.map((r) => r.candidate),
    ranked.map((r) => r.weight),
    rng,
  );

  // Stage 3 — ROAD MORTALITY per route (embattlement × season) + the queued arrival.
  const byId = new Map(ranked.map((r) => [String(r.candidate.destId), r.candidate]));
  /** @type {MigrationDispatch[]} */
  const dispatches = [];
  let roadDeaths = 0;
  let arrivals = 0;
  let travellersPlaced = 0;
  for (const s of split) {
    const cand = byId.get(String(s.destId));
    if (!cand) continue;
    travellersPlaced += s.travellers;
    const rDeaths = Math.round(s.travellers * roadDeathRate(cand.routeDanger01, season));
    const arr = Math.max(0, s.travellers - rDeaths);
    roadDeaths += rDeaths;
    arrivals += arr;
    dispatches.push({
      originId: origin, destId: String(s.destId), travellers: s.travellers,
      roadDeaths: rDeaths, arrivals: arr,
      arrivalTick: Math.max(0, Math.floor(finiteNumber(cand.arrivalTick, 0))),
    });
  }
  // Any travellers the split could not place (defensive; splitTravellers conserves)
  // are booked as origin-loss so the ledger stays exact.
  originDeaths += travellers - travellersPlaced;

  return { originId: origin, departures: dep, originDeaths, roadDeaths, arrivals, dispatches, mode: SPATIAL_DISTRIBUTION_MODE };
}

// ── THE CONSERVATION-LEDGER INVARIANT (asserted at dispatch) ──────────────────
/**
 * The exact conservation check for one plan: Σarrivals + originDeaths + ΣroadDeaths
 * == departures. True by construction; this makes it ASSERTABLE (the M4 test pins it
 * on a multi-tick fixture, and the kernel can assert it in dev). Also confirms the
 * FORBIDDEN 'concentrated' mode is never selected.
 * @param {MigrationPlan} plan
 * @returns {boolean}
 */
export function assertMigrationConservation(plan) {
  if (!plan || typeof plan !== 'object') return false;
  if (plan.mode === FORBIDDEN_DISTRIBUTION_MODE) return false;
  const arrivals = plan.dispatches.reduce((s, d) => s + Math.max(0, Math.floor(finiteNumber(d.arrivals, 0))), 0);
  const roadDeaths = plan.dispatches.reduce((s, d) => s + Math.max(0, Math.floor(finiteNumber(d.roadDeaths, 0))), 0);
  return arrivals + Math.max(0, plan.originDeaths) + roadDeaths === Math.max(0, plan.departures)
    && arrivals === Math.max(0, plan.arrivals)
    && roadDeaths === Math.max(0, plan.roadDeaths);
}

// ── THE IN-TRANSIT COLUMN LEDGER (transport lag / the arrival queue) ──────────
/**
 * @typedef {Object} MigrationColumn
 * @property {string} originId
 * @property {string} destId
 * @property {number} arrivals    people who will LAND (road death already booked at dispatch)
 * @property {number} departTick  the tick the column left the origin
 * @property {number} arrivalTick the tick the column lands (now + hopWeeks)
 */

/** The codepoint-stable AGGREGATE column key — one record per origin→dest per
 *  dispatch tick (never per-person). @param {string} o @param {string} d @param {number} t @returns {string} */
export function columnKey(o, d, t) {
  return `${String(o)}:${String(d)}:${Math.max(0, Math.floor(finiteNumber(t, 0)))}`;
}

/** @param {unknown} rec @returns {MigrationColumn|null} */
function columnOf(rec) {
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return null;
  const r = /** @type {Record<string, unknown>} */ (rec);
  const arrivals = Math.max(0, Math.floor(finiteNumber(r.arrivals, 0)));
  return {
    originId: String(r.originId ?? ''),
    destId: String(r.destId ?? ''),
    arrivals,
    departTick: Math.max(0, Math.floor(finiteNumber(r.departTick, 0))),
    arrivalTick: Math.max(0, Math.floor(finiteNumber(r.arrivalTick, 0))),
  };
}

/**
 * ENQUEUE a plan's dispatches as in-transit columns onto a ledger object (pure —
 * returns a NEW ledger). One AGGREGATE column per dispatch (arrivals > 0). A column
 * whose arrivalTick is at or before `tick` still enqueues (the release pass fires it
 * next); a zero-arrival dispatch is skipped (nothing to land).
 * @param {Record<string, MigrationColumn>|null|undefined} ledger
 * @param {MigrationPlan} plan
 * @param {number} tick the dispatch tick (departTick)
 * @returns {Record<string, MigrationColumn>}
 */
export function enqueueColumns(ledger, plan, tick) {
  /** @type {Record<string, MigrationColumn>} */
  const next = {};
  for (const k of Object.keys(asObject(ledger))) {
    const col = columnOf(asObject(ledger)[k]);
    if (col) next[k] = col;
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  for (const d of (plan && Array.isArray(plan.dispatches) ? plan.dispatches : [])) {
    const arrivals = Math.max(0, Math.floor(finiteNumber(d.arrivals, 0)));
    if (arrivals <= 0) continue;
    const key = columnKey(d.originId, d.destId, now);
    const prior = columnOf(next[key]);
    // Two dispatches origin→dest on the SAME tick aggregate into one column (they
    // share the arrival tick — keep the later arrival to be safe).
    next[key] = {
      originId: String(d.originId), destId: String(d.destId),
      arrivals: (prior ? prior.arrivals : 0) + arrivals,
      departTick: now,
      arrivalTick: Math.max(prior ? prior.arrivalTick : 0, Math.max(0, Math.floor(finiteNumber(d.arrivalTick, now)))),
    };
  }
  return next;
}

/**
 * RELEASE every column whose arrivalTick is at or before `tick`: return the arrivals
 * to CREDIT (per destination, aggregated + codepoint-sorted) and the ledger with the
 * released columns removed. Pure. DORMANT (no marker / no ledger) ⇒ empty arrivals +
 * the prior ledger untouched.
 * @param {{ spatialCanonVersion?: unknown, spatialLedgers?: unknown }} worldState
 * @param {number} tick
 * @returns {{ arrivals: Array<{ destId: string, count: number, originIds: string[] }>,
 *   next: Record<string, MigrationColumn>|null, changed: boolean }}
 */
export function releaseArrivals(worldState, tick) {
  const prior = hasSpatialLedger(worldState, 'migration')
    ? asObject(getSpatialLedger(worldState, 'migration'))
    : null;
  if (!migrationActive(worldState) || !prior) {
    return { arrivals: [], next: prior && Object.keys(prior).length ? /** @type {Record<string, MigrationColumn>} */ (prior) : null, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  /** @type {Record<string, MigrationColumn>} */
  const next = {};
  /** @type {Map<string, { count: number, originIds: Set<string> }>} */
  const byDest = new Map();
  for (const key of Object.keys(prior).sort()) {
    const col = columnOf(prior[key]);
    if (!col) continue;
    if (col.arrivalTick <= now) {
      const bucket = byDest.get(col.destId) || { count: 0, originIds: new Set() };
      bucket.count += col.arrivals;
      bucket.originIds.add(col.originId);
      byDest.set(col.destId, bucket);
    } else {
      next[key] = col; // still in transit
    }
  }
  const arrivals = [...byDest.keys()].sort().map((destId) => ({
    destId,
    count: /** @type {{ count: number }} */ (byDest.get(destId)).count,
    originIds: [.../** @type {{ originIds: Set<string> }} */ (byDest.get(destId)).originIds].sort(),
  })).filter((a) => a.count > 0);
  const nextOrNull = Object.keys(next).length ? next : null;
  const changed = JSON.stringify(prior) !== JSON.stringify(nextOrNull);
  return { arrivals, next: changed ? nextOrNull : /** @type {Record<string, MigrationColumn>} */ (prior), changed };
}
