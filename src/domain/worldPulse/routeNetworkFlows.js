/**
 * routeNetworkFlows.js — THE FLOW LEDGER (W-J slice J2; binding law
 * docs/DESIGN_ROUTE_LIFECYCLE.md §4).
 *
 * §4 in one sentence: the movers already move, and this layer only COUNTS. Nothing
 * here dispatches a caravan, plans a march, or sheds a population. It reads the
 * ledgers the existing movers have already written for their own reasons and asks
 * one question of each row: which two places did this pass between, and which of
 * the three named classes was it? Then it accrues that traversal onto the corridor
 * (when no road serves the pair) or onto the edge (when one does). That is the
 * whole slice, and the discipline of it is why the route lifecycle can never
 * disagree with the economy about what moved: there is no second opinion to hold.
 *
 * ── ATTRIBUTION IS A TABLE, NOT AN ARGUMENT (the pinned law) ────────────────
 * Every traversal names its SOURCE, and `ROUTE_FLOW_SOURCES` maps a source to its
 * class. No function in this file takes a class as a parameter, so a goods mover
 * cannot credit the population tally even by mistake: to mis-attribute a flow you
 * would have to edit the table, which is one line, in one place, that a pin reads.
 * The alternative (each extractor passing its own class along) is the shape where
 * a copy-pasted extractor silently credits the wrong class forever.
 *
 * ── THE BOUNDED CORRIDOR SET (§3, and the B1 quadratic lesson is law) ───────
 * A traversal may only accrue onto a pair that is ADMISSIBLE: the genesis
 * candidate set (k-NN + ports totality + user routes, all linear) unioned with the
 * pairs that already carry an edge. Flow is evidence, but evidence may not mint
 * unbounded state: without this rule a realm whose armies criss-cross it would
 * grow an all-pairs corridor ledger, which is the exact quadratic the roads
 * program already paid for once. An inadmissible traversal is NOT silently
 * dropped; it is counted into `offNetwork` on the result, so the honesty is
 * visible in a receipt without any unbounded key being persisted.
 *
 * ── INTEGERS, NOT WEIGHTS ──────────────────────────────────────────────────
 * Every accrual adds a WHOLE NUMBER from a tuning band. A float accumulator drifts
 * by rounding, and a drift that takes a century of ticks to surface is the worst
 * possible violation of THE PROMISE, because by then the world has been played.
 * The band word a surface reads is DERIVED from the integer, never stored as the
 * accumulator itself.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store. Every ledger is
 * walked in codepoint-sorted key order, so the accrual is a function of the world
 * and never of the order a Map happened to enumerate.
 */

import { normalizeGood } from '../region/goodsCatalog.js';
import { genesisCandidatePairs } from './routeNetworkGenesis.js';
import { buildMaterialIndex, connectedSuppliers } from './routeNetworkFlowsMaterial.js';
import {
  corridorDemand,
  corridorId,
  emptyRouteNetwork,
  orderedRouteEndpoints,
  readRouteNetwork,
  routeLifecycleActive,
  withCorridors,
  withEdgeUsage,
  writeRouteNetwork,
} from './routeNetworkLedger.js';

/**
 * THE SOURCE TABLE: every mover this layer counts, and the ONE class it may ever
 * credit (§4's three named classes). This constant is the single writer of
 * attribution in the estate.
 *
 * POPULATION is walking, in both its shapes: `migration` is the shed column that
 * left because it had to, `mission` is the envoy who left because he chose to.
 * §4 calls the second one a DESIRE PATH, and the distinction matters to the story
 * the Herald tells later, which is why they stay separate sources under one class
 * rather than collapsing into a single spelling.
 *
 * GOODS is the material half, and it has three shapes because demand is not the
 * same thing as trade: `shipment` is a caravan that is actually riding,
 * `unmet_import` is a settlement that declares it needs a good a neighbour makes,
 * and `supply_starved` is a live supply link that has run dry. The last two are
 * §4's UNMET-DEMAND PRESSURE, and they are what let a road be earned by a want
 * rather than only by a habit.
 *
 * MILITARY is strategy moving: `army_transit` is a column on the road right now,
 * `deployment` is a standing commitment that got there and stayed.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const ROUTE_FLOW_SOURCES = Object.freeze({
  migration: 'population',
  mission: 'population',
  shipment: 'goods',
  unmet_import: 'goods',
  supply_starved: 'goods',
  army_transit: 'military',
  deployment: 'military',
});

/**
 * The closed BAND vocabulary a corridor or an edge reports (§4: weights are tuning
 * bands). Ordered weakest to strongest. `none` is the absence reading and is never
 * persisted: a class at `none` is dropped from the record entirely.
 * @type {ReadonlyArray<string>}
 */
export const ROUTE_FLOW_BANDS = Object.freeze([
  'none', 'trace', 'stirring', 'steady', 'established',
]);

/**
 * ROUTE_LIFECYCLE_TUNING, the flow half (§12: every entry a band, soak-vetoable).
 *
 * SOURCE_WEIGHT is the per-traversal integer each source contributes. The ordering
 * carries the design's opinion and not much more: an army column wears a way
 * harder than one envoy does, a starving link presses harder than a satisfied
 * import declaration. These are the numbers the tuning pass owns.
 *
 * COLUMN_STEPS gives a large migration column extra weight, banded so a column of
 * 400 and a column of 480 accrue identically. Bands rather than a ratio, because a
 * ratio would make the accumulator a float.
 *
 * BAND_FLOOR maps the integer tally to the band word, read high to low.
 *
 * @type {Readonly<Record<string, unknown>>}
 */
export const ROUTE_FLOW_TUNING = Object.freeze({
  SOURCE_WEIGHT: Object.freeze({
    migration: 2,
    mission: 1,
    shipment: 2,
    unmet_import: 1,
    supply_starved: 2,
    army_transit: 3,
    deployment: 2,
  }),
  COLUMN_STEPS: Object.freeze([
    Object.freeze({ atLeast: 500, add: 2 }),
    Object.freeze({ atLeast: 100, add: 1 }),
  ]),
  BAND_FLOOR: Object.freeze([
    Object.freeze({ atLeast: 48, band: 'established' }),
    Object.freeze({ atLeast: 16, band: 'steady' }),
    Object.freeze({ atLeast: 4, band: 'stirring' }),
    Object.freeze({ atLeast: 1, band: 'trace' }),
  ]),
  RECEIPT_SOURCE_CAP: 4,
  REASON_GOODS_CAP: 3,
});

/** @typedef {import('./routeNetworkLedger.js').FlowAccrual} FlowAccrual */
/** @typedef {import('./routeNetworkLedger.js').CorridorDemand} CorridorDemand */
/** @typedef {import('./routeNetworkLedger.js').RouteNetwork} RouteNetwork */

/**
 * @typedef {Object} FlowTraversal
 * @property {string} a       endpoint, codepoint-low
 * @property {string} b       endpoint, codepoint-high
 * @property {string} source  a key of ROUTE_FLOW_SOURCES
 * @property {number} weight  the whole number this traversal accrues
 * @property {string|null} good  the goods-vocabulary id, when the source names one
 */

/**
 * @typedef {Object} FlowMember
 * @property {string} id
 * @property {Record<string, unknown>} config    the frozen generation config
 * @property {Record<string, unknown>} settlement the live settlement record
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function asId(value) {
  return value == null ? '' : String(value);
}

/** @param {unknown} value @returns {number} */
function asCount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * THE ONE SHAPE ADAPTER, the sibling of `genesisMembersFromSnapshot`. A pulse
 * snapshot carries `{ id, settlement: { config, economicState } }`; this leaf needs
 * both halves, so the mapping lives here in exactly one function. A reader that
 * guesses at a writer's spelling is the estate's most expensive recurring bug.
 *
 * @param {ReadonlyArray<{ id?: unknown, settlement?: unknown }>|null|undefined} items
 * @returns {Array<FlowMember>}
 */
export function flowMembersFromSnapshot(items) {
  if (!Array.isArray(items)) return [];
  /** @type {Array<FlowMember>} */
  const out = [];
  for (const item of items) {
    const id = asId(item && item.id);
    if (!id) continue;
    const settlement = asRecord(item && item.settlement);
    out.push({ id, config: asRecord(settlement.config), settlement });
  }
  return out;
}

/**
 * The class a source credits. An unknown source answers null and the accrual
 * refuses it, which is the fail-closed reading: a mover this layer has never heard
 * of must not silently land in whichever class happened to be first.
 *
 * @param {string} source
 * @returns {string|null}
 */
export function flowClassOfSource(source) {
  const known = ROUTE_FLOW_SOURCES[String(source)];
  return typeof known === 'string' ? known : null;
}

/**
 * The band word for an exact tally. Total: a negative or non-finite tally reads
 * `none`, because a band is a statement about observed traffic and nothing is not
 * traffic.
 *
 * @param {number} tally
 * @returns {string}
 */
export function flowBand(tally) {
  const n = Number(tally);
  if (!Number.isFinite(n) || n < 1) return 'none';
  const floors = /** @type {ReadonlyArray<{ atLeast: number, band: string }>} */ (
    ROUTE_FLOW_TUNING.BAND_FLOOR);
  for (const rung of floors) {
    if (n >= rung.atLeast) return rung.band;
  }
  return 'none';
}

/** An accrual carrying nothing. Never persisted. @returns {FlowAccrual} */
export function emptyFlowAccrual() {
  return { flows: {}, tally: {}, receipts: {} };
}

/**
 * True when an accrual has counted nothing at all, and therefore must not be
 * written onto a corridor or an edge.
 * @param {FlowAccrual|null|undefined} accrual
 * @returns {boolean}
 */
export function isFlowAccrualEmpty(accrual) {
  if (!accrual || typeof accrual !== 'object') return true;
  return Object.keys(asRecord(accrual.tally)).length === 0;
}

/**
 * THE ONE ACCRUAL WRITER. Adds one traversal's weight to an accrual and returns
 * the successor, leaving the input untouched.
 *
 * Everything the receipts law asks for happens here, together, so the three maps
 * cannot fall out of step: the tally rises, the band is re-derived from the new
 * tally, and the source joins that class's receipt list. There is no path that
 * moves a band without naming what moved it.
 *
 * @param {FlowAccrual} accrual
 * @param {string} source a key of ROUTE_FLOW_SOURCES
 * @param {number} weight the whole number to add
 * @param {string|null} [good] the goods-vocabulary id, when one drove it
 * @returns {FlowAccrual}
 */
export function withFlowStep(accrual, source, weight, good = null) {
  const flowClass = flowClassOfSource(source);
  const step = Math.max(0, Math.floor(asCount(weight)));
  if (!flowClass || step <= 0) return accrual;
  const base = accrual && typeof accrual === 'object' ? accrual : emptyFlowAccrual();
  const tally = { ...asRecord(base.tally) };
  const flows = { ...asRecord(base.flows) };
  /** @type {Record<string, ReadonlyArray<string>>} */
  const receipts = { ...(base.receipts || {}) };

  const nextTally = asCount(tally[flowClass]) + step;
  tally[flowClass] = nextTally;
  flows[flowClass] = flowBand(nextTally);

  const cap = Number(ROUTE_FLOW_TUNING.RECEIPT_SOURCE_CAP);
  const named = new Set(receipts[flowClass] || []);
  named.add(String(source));
  receipts[flowClass] = Object.freeze([...named].sort().slice(0, cap));

  /** @type {FlowAccrual} */
  const next = {
    flows: /** @type {Record<string, string>} */ (flows),
    tally: /** @type {Record<string, number>} */ (tally),
    receipts,
  };
  const goodsCap = Number(ROUTE_FLOW_TUNING.REASON_GOODS_CAP);
  const goods = new Set(base.reasonGoods || []);
  if (good) goods.add(String(good));
  // Conditional, drop-when-empty: a corridor that only ever saw armies serializes
  // with no reasonGoods key at all, because naming a good there would be a receipt
  // with nothing behind it.
  if (goods.size > 0) next.reasonGoods = Object.freeze([...goods].sort().slice(0, goodsCap));
  return next;
}

/** @param {ReadonlyArray<unknown>|unknown} path @returns {Array<[string, string]>} */
function pathHops(path) {
  if (!Array.isArray(path)) return [];
  /** @type {Array<[string, string]>} */
  const hops = [];
  for (let index = 1; index < path.length; index += 1) {
    const from = asId(path[index - 1]);
    const to = asId(path[index]);
    if (!from || !to || from === to) continue;
    hops.push([from, to]);
  }
  return hops;
}

/**
 * @param {Array<FlowTraversal>} out
 * @param {string} source @param {string} a @param {string} b
 * @param {number} weight @param {string|null} good
 * @param {Set<string>} members
 */
function pushTraversal(out, source, a, b, weight, good, members) {
  if (!a || !b || a === b) return;
  if (!members.has(a) || !members.has(b)) return;
  const [low, high] = orderedRouteEndpoints(a, b);
  out.push({ a: low, b: high, source, weight, good });
}

/** @param {number} arrivals @returns {number} */
function migrationColumnWeight(arrivals) {
  const weights = /** @type {Record<string, number>} */ (ROUTE_FLOW_TUNING.SOURCE_WEIGHT);
  const steps = /** @type {ReadonlyArray<{ atLeast: number, add: number }>} */ (
    ROUTE_FLOW_TUNING.COLUMN_STEPS);
  let weight = weights.migration;
  for (const step of steps) {
    if (arrivals >= step.atLeast) { weight += step.add; break; }
  }
  return weight;
}

/**
 * THE POPULATION EXTRACTOR (§4: walking wears roads). Two ledgers, one class.
 *
 * The migration ledger holds the columns currently in flight, so counting the
 * present rows every pulse is exactly the physical claim: a column on the road
 * this week wore the road this week. A mission is counted per HOP of its frozen
 * path rather than once end to end, because an envoy who crosses three ways wore
 * three ways, and the corridor between the two waypoints is the one that earns the
 * road.
 *
 * @param {Record<string, unknown>} worldState
 * @param {Set<string>} members
 * @returns {Array<FlowTraversal>}
 */
export function populationTraversals(worldState, members) {
  /** @type {Array<FlowTraversal>} */
  const out = [];
  const ledgers = asRecord(asRecord(worldState).spatialLedgers);
  const migration = asRecord(ledgers.migration);
  for (const key of Object.keys(migration).sort()) {
    const column = asRecord(migration[key]);
    const arrivals = Math.max(0, asCount(column.arrivals));
    if (arrivals <= 0) continue;
    pushTraversal(out, 'migration', asId(column.originId), asId(column.destId),
      migrationColumnWeight(arrivals), null, members);
  }
  const weights = /** @type {Record<string, number>} */ (ROUTE_FLOW_TUNING.SOURCE_WEIGHT);
  const missions = asRecord(asRecord(ledgers.roads).missions);
  for (const key of Object.keys(missions).sort()) {
    const mission = asRecord(missions[key]);
    const hops = pathHops(mission.path);
    if (hops.length === 0) {
      pushTraversal(out, 'mission', asId(mission.homeId), asId(mission.destId),
        weights.mission, null, members);
      continue;
    }
    for (const [from, to] of hops) {
      pushTraversal(out, 'mission', from, to, weights.mission, null, members);
    }
  }
  return out;
}

/**
 * THE MILITARY EXTRACTOR (§4). An army in transit is counted per hop of the route
 * it is actually walking; a standing deployment is counted once against the pair
 * it commits, because the commitment is what keeps the way in use even after the
 * column has arrived. The transit ledger is read WITHOUT filtering on role, which
 * is what makes reinforcement columns count beside marches and retreats.
 *
 * ── ON MOBILIZATION, WHICH §4 NAMES AND THIS DOES NOT READ ─────────────────
 * Recorded rather than silently skipped. `worldState.warPosture` is a PER
 * SETTLEMENT SCALAR: a posture that ramps and cools in place. It says how ready a
 * seat is, never where anyone walked, so there is no traversal in it to count and
 * counting a posture as a corridor flow would be an invention. The levy sources a
 * mobilizing power draws on are computed transiently inside the war layer and are
 * never persisted as rows either. The movement mobilization actually produces DOES
 * reach this ledger: a levy that marches becomes an armyTransit record at the
 * `reinforcement` role, which the loop above already counts. If a later slice ever
 * persists a levy ledger with endpoints, it joins ROUTE_FLOW_SOURCES as one more
 * military source and nothing else here changes.
 *
 * @param {Record<string, unknown>} worldState
 * @param {Set<string>} members
 * @returns {Array<FlowTraversal>}
 */
export function militaryTraversals(worldState, members) {
  /** @type {Array<FlowTraversal>} */
  const out = [];
  const state = asRecord(worldState);
  const weights = /** @type {Record<string, number>} */ (ROUTE_FLOW_TUNING.SOURCE_WEIGHT);
  const transit = asRecord(asRecord(state.spatialLedgers).armyTransit);
  for (const key of Object.keys(transit).sort()) {
    const record = asRecord(transit[key]);
    const hops = pathHops(record.path);
    if (hops.length === 0) {
      pushTraversal(out, 'army_transit', asId(record.originId), asId(record.destId),
        weights.army_transit, null, members);
      continue;
    }
    for (const [from, to] of hops) {
      pushTraversal(out, 'army_transit', from, to, weights.army_transit, null, members);
    }
  }
  const deployments = asRecord(state.deployments);
  for (const key of Object.keys(deployments).sort()) {
    const record = asRecord(deployments[key]);
    pushTraversal(out, 'deployment', key, asId(record.targetId),
      weights.deployment, null, members);
  }
  return out;
}

/**
 * The goods a settlement's live supply links have run dry on, keyed by settlement
 * id. A STARVING shipment record is the one with no `sourceId` at all (the supply
 * layer writes `sourceId: ''` when the link starves), so the absence of a source
 * is precisely the presence of a want.
 *
 * @param {Record<string, unknown>} worldState
 * @returns {Map<string, Set<string>>}
 */
function starvedGoodsBySettlement(worldState) {
  /** @type {Map<string, Set<string>>} */
  const out = new Map();
  const shipments = asRecord(asRecord(asRecord(worldState).spatialLedgers).supplyShipments);
  for (const key of Object.keys(shipments).sort()) {
    const record = asRecord(shipments[key]);
    if (record.starving !== true) continue;
    const settlementId = asId(record.settlementId);
    if (!settlementId) continue;
    const good = normalizeGood(/** @type {never} */ (record.input));
    if (!good || !good.id) continue;
    const set = out.get(settlementId) || new Set();
    set.add(String(good.id));
    out.set(settlementId, set);
  }
  return out;
}

/**
 * THE GOODS EXTRACTOR (§4: commodity flow AND unmet-demand pressure, both
 * denominated in the goods vocabulary).
 *
 * Three shapes, and the second is the one that makes a road earnable by a want.
 *   1. SHIPMENT: a caravan is riding from a source to a consumer right now.
 *   2. UNMET IMPORT: a settlement declares it imports a good, an ADMISSIBLE partner
 *      exports it, AND NO ROAD ALREADY BRINGS IT. The pressure lands on the
 *      corridor between them, which is what "grain wants to move west" means as a
 *      ledger entry rather than as a sentence.
 *   3. SUPPLY STARVED: a live supply link for that good has run dry, which raises
 *      the same corridor by the starvation weight.
 *
 * THE "AND NO ROAD ALREADY BRINGS IT" CLAUSE IS LOAD-BEARING, and leaving it out
 * was the first shape of this function. A declared import is a STANDING want: it
 * is true every pulse, forever, so without the clause every complementary pair in
 * the realm accrues goods demand relentlessly whether or not the want is being
 * served, and every such corridor eventually crosses any threshold J3 sets. The
 * ledger would then be measuring COMPLEMENTARITY, which is a fact about the
 * generator, rather than UNMET DEMAND, which is a fact about the world. Reading
 * the lived network's components makes the word "unmet" literally true, and it is
 * also what lets the ledger and the objective's system term agree about the same
 * realm. Shape 3 is deliberately NOT filtered this way: a supply link that has run
 * dry is unmet whatever the map says, because the road exists and the grain is
 * still not arriving.
 *
 * All three are bounded by the admissible partner set, never by all pairs, so the
 * unmet-demand half cannot be the thing that reintroduces the quadratic.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   index: import('./routeNetworkFlowsMaterial.js').MaterialIndex,
 *   memberIds: Set<string>,
 *   partnersOf: Map<string, Set<string>>,
 * }} input
 * @returns {Array<FlowTraversal>}
 */
export function goodsTraversals(input) {
  /** @type {Array<FlowTraversal>} */
  const out = [];
  const index = input.index;
  const weights = /** @type {Record<string, number>} */ (ROUTE_FLOW_TUNING.SOURCE_WEIGHT);
  const shipments = asRecord(asRecord(asRecord(input.worldState).spatialLedgers).supplyShipments);
  for (const key of Object.keys(shipments).sort()) {
    const record = asRecord(shipments[key]);
    const sourceId = asId(record.sourceId);
    if (!sourceId) continue;
    const good = normalizeGood(/** @type {never} */ (record.input));
    pushTraversal(out, 'shipment', sourceId, asId(record.settlementId), weights.shipment,
      good && good.id ? String(good.id) : null, input.memberIds);
  }

  const starved = starvedGoodsBySettlement(input.worldState);
  for (const consumerId of index.memberIds) {
    const wanted = index.importsOf.get(consumerId) || new Set();
    const dry = starved.get(consumerId) || new Set();
    if (wanted.size === 0 && dry.size === 0) continue;
    const partners = [...(input.partnersOf.get(consumerId) || new Set())].sort();
    for (const partnerId of partners) {
      const supplied = index.exportsOf.get(partnerId);
      if (!supplied || supplied.size === 0) continue;
      for (const goodId of [...wanted].sort()) {
        if (!supplied.has(goodId)) continue;
        if (connectedSuppliers(index, consumerId, goodId).length > 0) continue;
        pushTraversal(out, 'unmet_import', consumerId, partnerId, weights.unmet_import,
          goodId, input.memberIds);
      }
      for (const goodId of [...dry].sort()) {
        if (!supplied.has(goodId)) continue;
        pushTraversal(out, 'supply_starved', consumerId, partnerId, weights.supply_starved,
          goodId, input.memberIds);
      }
    }
  }
  return out;
}

/**
 * @typedef {Object} AdmissibleCorridors
 * @property {Map<string, [string, string]>} pairs  corridor id to its endpoints
 * @property {Map<string, Set<string>>} partnersOf  member id to its admissible partners
 * @property {number} bound  the structural ceiling this selection may not exceed
 */

/**
 * THE ADMISSIBLE SET (§3's bounded candidate law, extended to the lived network).
 *
 * The genesis candidate set answers "which pairs could ever be roads", and the
 * existing edge set answers "which pairs already are". Their union is every pair
 * this layer may write, and both terms are linear: S*k + P + U for the first,
 * |edges| for the second. `bound` is that sum, exported so the anti-quadratic law
 * is a number a pin asserts rather than a claim a comment makes.
 *
 * @param {{
 *   members: ReadonlyArray<FlowMember>,
 *   worldState: Record<string, unknown>|null,
 *   network: RouteNetwork|null,
 * }} input
 * @returns {AdmissibleCorridors}
 */
export function admissibleCorridors(input) {
  const members = Array.isArray(input.members) ? input.members : [];
  const candidates = genesisCandidatePairs({
    members: members.map(m => ({ id: m.id, config: m.config })),
    worldState: input.worldState,
  });
  /** @type {Map<string, [string, string]>} */
  const pairs = new Map();
  for (const [a, b] of candidates.all) pairs.set(corridorId(a, b), [a, b]);
  const edges = input.network && input.network.edges ? input.network.edges : {};
  let edgePairs = 0;
  for (const id of Object.keys(edges).sort()) {
    const edge = asRecord(edges[id]);
    const a = asId(edge.a);
    const b = asId(edge.b);
    if (!a || !b) continue;
    edgePairs += 1;
    pairs.set(corridorId(a, b), orderedRouteEndpoints(a, b));
  }
  /** @type {Map<string, Set<string>>} */
  const partnersOf = new Map();
  for (const [a, b] of pairs.values()) {
    const forA = partnersOf.get(a) || new Set();
    forA.add(b);
    partnersOf.set(a, forA);
    const forB = partnersOf.get(b) || new Set();
    forB.add(a);
    partnersOf.set(b, forB);
  }
  return { pairs, partnersOf, bound: candidates.bound + edgePairs };
}

/**
 * The edge id serving a pair, or null when no road does. Codepoint-first when both
 * a land road and a sea lane exist between the same two places, so a pair with two
 * roads accrues onto ONE of them deterministically instead of double counting the
 * same caravan twice.
 *
 * It matches on the edge RECORD's endpoints rather than on an id prefix, and that
 * is deliberate: an id prefix built here would be a SECOND SPELLING of §3's edge
 * identity, and the whole point of that law is that the ledger, the user-route lane
 * and migration 193 all say it exactly once each. The source scan in
 * routeNetworkLedger.test.js enforces that, and it caught this function trying to
 * spell it a second time.
 *
 * @param {RouteNetwork|null} network
 * @param {string} a @param {string} b
 * @returns {string|null}
 */
export function edgeIdForPair(network, a, b) {
  const edges = network && network.edges ? network.edges : {};
  const [low, high] = orderedRouteEndpoints(a, b);
  for (const id of Object.keys(edges).sort()) {
    const edge = asRecord(edges[id]);
    if (asId(edge.a) === low && asId(edge.b) === high) return id;
  }
  return null;
}

/**
 * @typedef {Object} FlowAccrualResult
 * @property {Record<string, unknown>} worldState  the world with the ledger folded on
 * @property {boolean} changed
 * @property {number} traversals    how many traversals the movers offered
 * @property {number} accrued       how many of them landed on the ledger
 * @property {number} offNetwork    how many were refused by the bounded-candidate law
 * @property {number} corridorsTouched
 * @property {number} edgesTouched
 * @property {Record<string, number>} byClass  class to accrued traversal count
 */

/**
 * ACCRUE ONE PULSE OF FLOW (§4, the whole slice).
 *
 * DORMANT (the virtual flag absent) returns the INPUT worldState BY REFERENCE, not
 * an equal copy, exactly as `ensureGenesisRouteNetwork` does. Wiring this into the
 * pulse on a dark world cannot perturb a single byte, by object identity, and the
 * dormancy pin asserts that identity rather than a deep equality.
 *
 * The corridor cursor `lastCharterEval` is deliberately NOT advanced here: J2
 * measures and J3 evaluates, and a cursor moved by the measurer would tell the
 * evaluator a corridor had been considered when nothing had considered it.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   members: ReadonlyArray<FlowMember>,
 *   tick?: number,
 * }} input
 * @returns {FlowAccrualResult}
 */
export function accrueRouteFlows(input) {
  const worldState = input.worldState;
  /** @type {FlowAccrualResult} */
  const inert = {
    worldState,
    changed: false,
    traversals: 0,
    accrued: 0,
    offNetwork: 0,
    corridorsTouched: 0,
    edgesTouched: 0,
    byClass: {},
  };
  if (!routeLifecycleActive(worldState)) return inert;

  const members = Array.isArray(input.members) ? input.members : [];
  const tick = Number.isFinite(input.tick) ? Number(input.tick) : 0;
  const memberIds = new Set(members.map(m => m.id).filter(Boolean));
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();
  const admissible = admissibleCorridors({ members, worldState, network });
  const index = buildMaterialIndex({ members, network });

  const traversals = [
    ...populationTraversals(worldState, memberIds),
    ...militaryTraversals(worldState, memberIds),
    ...goodsTraversals({ worldState, index, memberIds, partnersOf: admissible.partnersOf }),
  ];
  if (traversals.length === 0) return inert;

  /** @type {Record<string, CorridorDemand>} */
  const nextCorridors = {};
  /** @type {Record<string, FlowAccrual & { lastTick: number }>} */
  const nextUsage = {};
  /** @type {Record<string, number>} */
  const byClass = {};
  let accrued = 0;
  let offNetwork = 0;

  // Codepoint-stable traversal order, so the receipt caps keep the same members
  // whichever mover ran first this pulse.
  const ordered = [...traversals].sort((x, y) => {
    const left = `${x.a}|${x.b}|${x.source}|${x.good || ''}`;
    const right = `${y.a}|${y.b}|${y.source}|${y.good || ''}`;
    return left < right ? -1 : left > right ? 1 : 0;
  });

  for (const traversal of ordered) {
    const id = corridorId(traversal.a, traversal.b);
    if (!admissible.pairs.has(id)) { offNetwork += 1; continue; }
    const flowClass = flowClassOfSource(traversal.source);
    if (!flowClass) { offNetwork += 1; continue; }
    const edgeId = edgeIdForPair(network, traversal.a, traversal.b);
    if (edgeId) {
      const prior = nextUsage[edgeId]
        || /** @type {FlowAccrual & { lastTick: number }} */ (
          { ...(asRecord(network.edges[edgeId]).usage
            ? /** @type {FlowAccrual} */ (asRecord(network.edges[edgeId]).usage)
            : emptyFlowAccrual()), lastTick: tick });
      const stepped = withFlowStep(prior, traversal.source, traversal.weight, traversal.good);
      nextUsage[edgeId] = { ...stepped, lastTick: tick };
    } else {
      const prior = nextCorridors[id]
        || /** @type {CorridorDemand} */ (network.corridor[id])
        || corridorDemand({ a: traversal.a, b: traversal.b, sinceTick: tick });
      const stepped = withFlowStep(prior, traversal.source, traversal.weight, traversal.good);
      nextCorridors[id] = {
        a: prior.a,
        b: prior.b,
        flows: stepped.flows,
        tally: stepped.tally,
        receipts: stepped.receipts,
        ...(stepped.reasonGoods ? { reasonGoods: stepped.reasonGoods } : {}),
        sinceTick: Number.isFinite(prior.sinceTick) ? prior.sinceTick : tick,
        lastCharterEval: Number.isFinite(prior.lastCharterEval) ? prior.lastCharterEval : tick,
      };
    }
    accrued += 1;
    byClass[flowClass] = (byClass[flowClass] || 0) + 1;
  }

  if (accrued === 0) {
    return { ...inert, traversals: traversals.length, offNetwork };
  }
  const folded = withEdgeUsage(withCorridors(network, nextCorridors), nextUsage);
  return {
    worldState: writeRouteNetwork(worldState, folded),
    changed: true,
    traversals: traversals.length,
    accrued,
    offNetwork,
    corridorsTouched: Object.keys(nextCorridors).length,
    edgesTouched: Object.keys(nextUsage).length,
    byClass,
  };
}
