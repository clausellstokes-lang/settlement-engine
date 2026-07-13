/**
 * migrationKernel.js — the M4 MIGRATION-WITH-MORTALITY kernel adapter (Phase 5.5).
 *
 * The pure migration engine (spatial/migration.js) + the culture composite
 * (spatial/cultureDistance.js) own the mechanics; THIS module is the thin kernel-side
 * adapter that supplies the LIVE reads the engine needs and writes its outcomes back:
 *
 *   • RELEASE (early, before the apply pass): fire the in-transit columns whose
 *     arrivalTick has come, crediting each destination's population (the transport-lag
 *     arrival) — the migration wave lands FEWER + LATER than it left.
 *   • DISPATCH (late, with the movers, after the apply pass debited the origin): for
 *     each applied mass-emigration event, extract the origin's carrying-capacity
 *     tolerance + build the 4-axis reachable-destination candidates (closeness /
 *     cultureAffinity — a LIVE cultureDistance read / safety / richness with the
 *     congestion-pressure brake), plan the fate (two mortality sinks), ASSERT the
 *     conservation invariant, and enqueue the arrival columns.
 *
 * AGGREGATE, NAMED-NPC-SAFE (owner boundary): this moves population COUNTS only. It
 * reads no npc roster and returns no npc mutation — named NPCs are the §4h protected
 * excursion model, never emigration/mortality.
 *
 * DORMANT (constitutional): a no-op without the spatial-canon marker (migrationActive
 * false) — an aspatial world keeps populationDynamics' exact path (byte-identical), no
 * `migration` ledger key, no death/arrival receipts. The ledger nests under the FP-R
 * `spatialLedgers` namespace ⇒ ZERO eager first-paint bytes. Pure + deterministic; the
 * caller threads the tick + the pulse rng (the scatter fork).
 */

import { evil01, chaos01 } from './deityAxes.js';
import { settlementAlignment } from './settlementAlignment.js';
import { factionArchetype } from '../factionArchetypes.js';
import { governingFactionOf } from '../rulingPower.js';
import { storageCapacityMonths } from './foodStockpile.js';
import { canonicalRelationshipLabel } from '../region/graph.js';
import {
  migrationActive, planMigration, assertMigrationConservation, enqueueColumns,
  releaseArrivals, carryingCapacityTolerance, MIGRATION_TUNING,
} from '../spatial/migration.js';
import { cultureAffinity } from '../spatial/cultureDistance.js';
import { pathCost, hopWeeks, distanceWeight, isMapped, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import { chooseRoute, riskToleranceFromAlignment } from '../spatial/embattlement.js';

// ── Kernel-local read-shapes (0-hole discipline: no `any`) ────────────────────
/** @typedef {{ population?: number, config?: { primaryDeitySnapshot?: { alignmentAxis?: string, lawAxis?: string } | null },
 *   economicState?: { prosperity?: unknown, foodSecurity?: { storageMonths?: number } | null },
 *   powerStructure?: { governingName?: string } | null,
 *   populationHistory?: Array<{ tick: number|null, delta: number, population: number, reason: string, outcomeId?: string }> } } MigSettlement */
/** @typedef {{ id?: (string|number), name?: string, settlement?: MigSettlement,
 *   causal?: { scores?: { economic_capacity?: number, trade_connectivity?: number } } }} MigSnapItem */
/** @typedef {{ settlements?: MigSnapItem[], regionalGraph?: { edges?: MigEdge[] } | null }} MigSnapshot */
/** @typedef {{ from?: string|number, source?: string|number, to?: string|number, target?: string|number, relationshipType?: string, type?: string }} MigEdge */
/** @typedef {import('../spatial/distanceRead.js').SpatialDigest} SpatialDigest */
/** @typedef {import('../spatial/cultureDistance.js').CultureVector} CultureVector */
/** @typedef {{ get: (id: string|number, kind: string) => { score?: number } | undefined }} PressureIndex */

/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

// ── Congestion + carrying-capacity anchors (documented tuning) ────────────────
export const MIGRATION_KERNEL_TUNING = Object.freeze({
  // The population at which a destination reads "saturated" (capacityPressure→1) on
  // the SIZE axis alone — a big city's pull decays as it approaches this. A
  // per-capita saturation anchor, not a hard cap (the pull just fades). Retunable.
  SATURATION_POP: 9000,
  // Congestion pressure = the max of size-saturation, crowding food deficit, and
  // size-scaled crime (§II.3-3): a hub that is BIG, HUNGRY, or CRIME-RIDDEN pushes
  // migrants away. These weight the crime/food terms into the pressure.
  W_SIZE: 1,
  W_CROWD_FOOD: 0.8,
  W_SIZE_CRIME: 0.7,
  // The origin's CONNECTIVITY (carrying-capacity term): trade_connectivity/100, or a
  // reachable-neighbour-count fallback normalized by this anchor.
  CONNECTIVITY_NEIGHBOURS: 4,
  // The origin's GRANARY term: storageMonths / storageCapacityMonths (0..1); a full
  // granary raises tolerance (the weak survive the winter to travel in spring).
  // Only the nearest CANDIDATE_POOL reachable settlements are scored per emigration
  // (bounds the per-tick work; planMigration then keeps MAX_DESTINATIONS).
  CANDIDATE_POOL: 8,
  // A merchant-caravan-grade danger-reading fidelity for the refugee route choice
  // when the origin has no alignment signal (mirrors supplyKernel's steady default).
  DEFAULT_RISK_TOLERANCE: 0.5,
});

// ── Live culture-vector extraction (the §II.5-2 LIVE read) ────────────────────
/**
 * Build a settlement's CULTURE VECTOR from CURRENT worldState (never the frozen
 * digest): dominant-deity axes, W0 alignment, economic character, governing archetype
 * + identity. Pure live read.
 * @param {MigSnapItem} item @param {Record<string, unknown>} worldState
 * @returns {CultureVector}
 */
export function buildCultureVector(item, worldState) {
  const settlement = item?.settlement || {};
  const deity = settlement?.config?.primaryDeitySnapshot || null;
  const align = settlementAlignment(
    /** @type {import('./disposition.js').AlignmentItem} */ (/** @type {unknown} */ (item)),
    /** @type {import('./disposition.js').AlignmentActsSource} */ (/** @type {unknown} */ (worldState)),
  );
  const econCapacity = num(item?.causal?.scores?.economic_capacity, 50) / 100;
  const governing = governingFactionOf(
    /** @type {Parameters<typeof governingFactionOf>[0]} */ (/** @type {unknown} */ (settlement)));
  return {
    faithEvil01: evil01(deity),
    faithChaos01: chaos01(deity),
    lawfulness01: num(align?.lawfulness01, 0.5),
    malice01: num(align?.malice01, 0.5),
    economy01: clamp01(econCapacity),
    archetype: factionArchetype(governing || settlement?.powerStructure?.governingName || null),
    governingName: String(settlement?.powerStructure?.governingName || ''),
  };
}

// ── Pairwise live reads (trade tie + hostility) over the regional graph ────────
/** The canonical relationship label between two ids over the regional graph, or ''
 *  (the worst/hostile label wins when several edges exist — nobody flees into a war). */
/** @param {MigEdge[]} edges @param {string} a @param {string} b @returns {string} */
function relationshipLabelBetween(edges, a, b) {
  /** @type {string[]} */
  const labels = [];
  for (const edge of edges) {
    const from = String(edge?.from ?? edge?.source ?? '');
    const to = String(edge?.to ?? edge?.target ?? '');
    if ((from === a && to === b) || (from === b && to === a)) {
      labels.push(canonicalRelationshipLabel(String(edge?.relationshipType || edge?.type || '').toLowerCase()));
    }
  }
  if (labels.includes('hostile')) return 'hostile';
  if (labels.includes('cold_war')) return 'cold_war';
  if (labels.includes('rival')) return 'rival';
  return labels[0] || '';
}

// tradeTie: a heavy established trade tie CLOSES culture distance (§II.5-2 term 4).
const TRADE_TIE = Object.freeze({ trade_partner: 1, allied: 0.7, vassal: 0.6, patron: 0.6 });
// hostility: the safety axis — nobody flees INTO a settlement at war with them.
const HOSTILITY = Object.freeze({ hostile: 1, cold_war: 0.6, rival: 0.4 });

// ── The destination candidate (the 4-axis + congestion + route reads) ─────────
/**
 * Build the 4-axis DestinationCandidate for one reachable destination (all live
 * reads). closeness = distanceWeight; cultureAffinity = the LIVE cultureDistance;
 * safety = 1 - hostility; richness = economic character; capacityPressure = the
 * congestion brake input (size saturation ∨ crowding food deficit ∨ size-scaled
 * crime). routeDanger + arrivalTick ride the M1/M3 route.
 * @param {Object} args
 * @param {SpatialDigest} args.digest @param {Record<string, unknown>} args.worldState
 * @param {string} args.originId @param {MigSnapItem} args.destItem
 * @param {CultureVector} args.originVector @param {PressureIndex} args.pIndex
 * @param {MigEdge[]} args.edges @param {number} args.riskTolerance
 * @param {string|null} args.season @param {number} args.tick
 * @returns {import('../spatial/migration.js').DestinationCandidate|null}
 */
function buildDestinationCandidate({ digest, worldState, originId, destItem, originVector, pIndex, edges, riskTolerance, season, tick }) {
  const destId = String(destItem.id);
  if (destId === originId || !isMapped(digest, destId)) return null;
  const cost = pathCost(digest, originId, destId, season);
  if (cost == null) return null; // unreachable over the frozen geometry
  const route = chooseRoute(digest, worldState, originId, destId, riskTolerance, season);
  const weeks = hopWeeks(digest, originId, destId, season);
  if (weeks == null) return null;

  const closeness01 = clamp01(distanceWeight(digest, originId, destId));
  const destVector = buildCultureVector(destItem, worldState);
  const tradeLabel = relationshipLabelBetween(edges, originId, destId);
  const tradeTie01 = num(/** @type {Record<string, number>} */ (TRADE_TIE)[tradeLabel], 0);
  const cultureAffinity01 = cultureAffinity(originVector, destVector, { tradeTie01 });

  const pairHostility = num(/** @type {Record<string, number>} */ (HOSTILITY)[tradeLabel], 0);
  const destConflict = clamp01(num(pIndex.get(destId, 'conflict')?.score, 0));
  const safety01 = clamp01(1 - Math.max(pairHostility, destConflict));

  const richness01 = clamp01(num(destItem?.causal?.scores?.economic_capacity, 50) / 100);

  // Congestion pressure (§II.3-3 brake input): the hub's pull decays as it fills.
  const K = MIGRATION_KERNEL_TUNING;
  const pop = Math.max(0, num(destItem?.settlement?.population, 0));
  const sizeSat = clamp01(pop / K.SATURATION_POP);
  const foodDeficit = clamp01(num(pIndex.get(destId, 'food')?.score, 0));
  const crime = clamp01(num(pIndex.get(destId, 'crime')?.score, 0));
  const capacityPressure01 = clamp01(Math.max(
    K.W_SIZE * sizeSat,
    K.W_CROWD_FOOD * foodDeficit,
    K.W_SIZE_CRIME * sizeSat * crime + 0.5 * crime, // size-SCALED crime (a big crime-ridden hub repels most)
  ));

  // routeDanger: the M1 embattlement summed over the chosen route's hops (clamped).
  const routeDanger01 = clamp01(num(route?.danger, 0));

  return {
    destId, closeness01, cultureAffinity01, safety01, richness01,
    capacityPressure01, routeDanger01, arrivalTick: tick + weeks,
  };
}

/**
 * The origin's carrying-capacity TOLERANCE (context-dependent, §4c): prosperity
 * (economic capacity) + connectivity (trade connectivity / reachable neighbours) +
 * granary (food storage fill) RAISE it. Pure live read.
 * @param {MigSnapItem} originItem @param {number} reachableCount @returns {number} τ
 */
export function originTolerance(originItem, reachableCount) {
  const K = MIGRATION_KERNEL_TUNING;
  const settlement = originItem?.settlement || {};
  const prosperity01 = clamp01(num(originItem?.causal?.scores?.economic_capacity, 50) / 100);
  const connByScore = originItem?.causal?.scores?.trade_connectivity;
  const connectivity01 = clamp01(
    typeof connByScore === 'number' && Number.isFinite(connByScore)
      ? connByScore / 100
      : Math.max(0, reachableCount) / K.CONNECTIVITY_NEIGHBOURS,
  );
  const storageMonths = num(settlement?.economicState?.foodSecurity?.storageMonths, 0);
  const capMonths = Math.max(1, num(storageCapacityMonths(
    /** @type {Parameters<typeof storageCapacityMonths>[0]} */ (/** @type {unknown} */ (settlement))), 12));
  const granary01 = clamp01(storageMonths / capMonths);
  return carryingCapacityTolerance({ prosperity01, connectivity01, granary01 });
}

// ── RELEASE — credit the in-transit arrivals that have landed (early) ──────────
/**
 * Release every migration column whose arrivalTick has come, crediting each
 * destination's population (transport-lag arrival) in the mutable settlement map, and
 * update the ledger. DORMANT ⇒ { worldState, changed:false }. Pure over its inputs
 * except the localSettlements write-back (mirrors supplyKernel).
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {Map<string, MigSettlement>} args.localSettlements the mutable settlement map (written back)
 * @param {MigSnapItem[]} args.settlements the tick's settlement items (fallback lookup)
 * @param {number} args.tick
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, arrivals: Array<{ destId: string, count: number }> }}
 */
export function releaseMigrationArrivals({ worldState, localSettlements, settlements, tick }) {
  if (!migrationActive(worldState)) return { worldState, changed: false, arrivals: [] };
  const released = releaseArrivals(worldState, tick);
  if (!released.changed && !released.arrivals.length) return { worldState, changed: false, arrivals: [] };

  const itemById = new Map((Array.isArray(settlements) ? settlements : []).map((it) => [String(it.id), it]));
  for (const arrival of released.arrivals) {
    const sid = String(arrival.destId);
    const settlement = localSettlements.get(sid) || itemById.get(sid)?.settlement;
    if (!settlement) continue; // destination gone — the arrivals are lost (a real loss)
    const current = Math.max(0, Math.round(num(settlement.population, 0)));
    const nextPopulation = current + Math.max(0, Math.round(arrival.count));
    localSettlements.set(sid, {
      ...settlement,
      population: nextPopulation,
      populationHistory: [
        ...(Array.isArray(settlement.populationHistory) ? settlement.populationHistory.slice(-11) : []),
        {
          tick: Math.max(0, Math.floor(num(tick, 0))),
          delta: nextPopulation - current,
          population: nextPopulation,
          reason: 'Refugee column arrives from a shed settlement.',
          outcomeId: `migration.arrival.${sid}.${Math.max(0, Math.floor(num(tick, 0)))}`,
        },
      ],
    });
  }

  let nextWorldState = worldState;
  if (released.changed) {
    if (released.next) nextWorldState = setSpatialLedger(worldState, 'migration', released.next);
    else nextWorldState = dropSpatialLedger(worldState, 'migration');
  }
  return { worldState: nextWorldState, changed: released.changed || released.arrivals.length > 0, arrivals: released.arrivals.map((a) => ({ destId: a.destId, count: a.count })) };
}

// ── DISPATCH — plan + enqueue this tick's shed pools (late, post-apply) ────────
/**
 * @typedef {Object} EmigrationEvent
 * @property {string} originId
 * @property {number} loss  the shed pool (the aspatial `abs`; origin already debited)
 */

/**
 * REALIZED-DEBIT RECONCILIATION (the conservation guard on the shed pool). Collect the
 * mass-emigration events whose origin was ACTUALLY DEBITED by this tick's apply pass, so
 * the dispatch releases survivors only for population an origin truly lost — never
 * minting people. The exclusion that matters:
 *   - a PROPOSAL-mode outcome is QUEUED, not applied: applyWorldPulse.js's
 *     `applyMode === 'proposal'` branch upserts a pending proposal and `continue`s
 *     BEFORE applyOutcomeToSettlement debits the origin. Its people stay put, so
 *     dispatching its `spatialEmigration.loss` would MINT them at the destinations
 *     (origin undebited + arrivals credited = net population created). Reachable via
 *     populationDynamics.js: a MAJOR emigration under `majorChangesRequireProposal`
 *     routes to applyMode 'proposal'. The migration releases only once the DM APPROVES
 *     it and the proposal resolver forces applyMode 'auto' (the debit is then realized).
 * AUTO-mode ⇒ every emigration flows through ⇒ byte-identical to the pre-guard path.
 * @param {Array<{ applyMode?: string, candidateType?: string, targetSaveId?: (string|number),
 *   metadata?: { spatialEmigration?: { loss?: (number|string) } | null } | null }>|null|undefined} outcomes
 *   this tick's outcomesToApply (the queued set, pre-realization)
 * @returns {EmigrationEvent[]} the debited shed pools, safe to dispatch
 */
export function collectRealizedEmigrationEvents(outcomes) {
  /** @type {EmigrationEvent[]} */
  const events = [];
  for (const outcome of outcomes || []) {
    // Queued (proposal) ⇒ origin NOT debited this tick ⇒ never dispatch (would mint).
    if (outcome?.applyMode === 'proposal') continue;
    const shed = outcome?.metadata?.spatialEmigration;
    if (outcome?.candidateType === 'population_emigration' && shed && Number(shed.loss) > 0) {
      events.push({ originId: String(outcome.targetSaveId), loss: Math.max(0, Math.floor(Number(shed.loss))) });
    }
  }
  return events;
}

/**
 * Dispatch this tick's applied mass-emigration events into in-transit columns: per
 * event, build the reachable-destination candidates + plan the fate (two mortality
 * sinks, 4-axis destinations, congestion + scatter brakes), ASSERT conservation, and
 * enqueue the arrival columns. DORMANT ⇒ { worldState, changed:false }.
 * @param {Object} args
 * @param {EmigrationEvent[]} args.events
 * @param {MigSnapshot} args.snapshot
 * @param {PressureIndex} args.pIndex
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {Record<string, unknown>} args.worldState
 * @param {{ fork?: (k: string) => { random: () => number } }|null} args.rng
 * @param {string|null} args.season
 * @param {number} args.tick
 * @returns {{ worldState: Record<string, unknown>, changed: boolean,
 *   receipts: Array<{ originId: string, originDeaths: number, roadDeaths: number, arrivals: number, departures: number }> }}
 */
export function dispatchMigrations({ events, snapshot, pIndex, digest, worldState, rng, season, tick }) {
  if (!migrationActive(worldState) || !digest || !Array.isArray(events) || !events.length) {
    return { worldState, changed: false, receipts: [] };
  }
  const itemById = new Map((snapshot?.settlements || []).map((it) => [String(it.id), it]));
  const edges = snapshot?.regionalGraph?.edges || [];
  const K = MIGRATION_KERNEL_TUNING;
  // Seed the working column ledger from the current namespace (the RELEASE pass may
  // have already run this tick + drained arrivals). enqueueColumns folds onto it.
  const priorNs = /** @type {{ migration?: Record<string, import('../spatial/migration.js').MigrationColumn> }} */ (
    (worldState && typeof worldState === 'object' ? worldState.spatialLedgers : null) || {});
  /** @type {Record<string, import('../spatial/migration.js').MigrationColumn>} */
  let ledger = { ...(priorNs.migration || {}) };

  /** @type {Array<{ originId: string, originDeaths: number, roadDeaths: number, arrivals: number, departures: number }>} */
  const receipts = [];
  let changed = false;

  // Codepoint-sorted event order (deterministic scatter forks).
  for (const event of [...events].sort((a, b) => (String(a.originId) < String(b.originId) ? -1 : String(a.originId) > String(b.originId) ? 1 : 0))) {
    const originId = String(event.originId);
    const originItem = itemById.get(originId);
    const loss = Math.max(0, Math.floor(num(event.loss, 0)));
    if (!originItem || loss <= 0 || !isMapped(digest, originId)) continue;

    const originVector = buildCultureVector(originItem, worldState);
    const originAlign = settlementAlignment(
      /** @type {import('./disposition.js').AlignmentItem} */ (/** @type {unknown} */ (originItem)),
      /** @type {import('./disposition.js').AlignmentActsSource} */ (/** @type {unknown} */ (worldState)),
    );
    const riskTolerance = riskToleranceFromAlignment(originAlign) || K.DEFAULT_RISK_TOLERANCE;

    // The nearest reachable settlements (bounded candidate pool), by frozen cost.
    const reachable = (snapshot?.settlements || [])
      .map((it) => ({ it, cost: pathCost(digest, originId, String(it.id), season) }))
      .filter((r) => String(r.it.id) !== originId && r.cost != null && isMapped(digest, String(r.it.id)))
      .sort((a, b) => (num(a.cost, 0) - num(b.cost, 0)) || (String(a.it.id) < String(b.it.id) ? -1 : 1))
      .slice(0, K.CANDIDATE_POOL);

    /** @type {import('../spatial/migration.js').DestinationCandidate[]} */
    const candidates = [];
    for (const { it } of reachable) {
      const cand = buildDestinationCandidate({
        digest, worldState, originId, destItem: it, originVector, pIndex, edges, riskTolerance, season, tick,
      });
      if (cand) candidates.push(cand);
    }

    const tolerance = originTolerance(originItem, reachable.length);
    const plan = planMigration({
      originId, departures: loss, tolerance, candidates, season,
      rng: rng && typeof rng.fork === 'function' ? rng.fork(`migration:${originId}:${tick}`) : null,
    });
    // THE CONSERVATION-LEDGER INVARIANT — assert every dispatch (exact integers).
    if (!assertMigrationConservation(plan)) {
      // Never silently leak: fold the whole loss to origin-death (still exact) rather
      // than enqueue an inconsistent column. (Defensive; unreachable by construction.)
      receipts.push({ originId, originDeaths: loss, roadDeaths: 0, arrivals: 0, departures: loss });
      continue;
    }
    if (plan.dispatches.length) {
      ledger = enqueueColumns(ledger, plan, tick);
      changed = true;
    }
    receipts.push({
      originId, originDeaths: plan.originDeaths, roadDeaths: plan.roadDeaths,
      arrivals: plan.arrivals, departures: plan.departures,
    });
  }

  let nextWorldState = worldState;
  if (changed) {
    nextWorldState = Object.keys(ledger).length
      ? setSpatialLedger(worldState, 'migration', ledger)
      : dropSpatialLedger(worldState, 'migration');
  }
  return { worldState: nextWorldState, changed, receipts };
}

export { MIGRATION_TUNING };
