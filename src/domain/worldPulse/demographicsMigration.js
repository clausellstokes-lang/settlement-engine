/**
 * demographicsMigration.js — WAVE P2 (THE HOMEOSTAT), THE WRITER.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §4 (push-pull), law 4 (damage transmutes, people
 * account) and §11 P2 are this file's contract.
 *
 * P1 gave the realm a difference of rates and killed the runaway; P1a thawed the
 * floor so a dying town may die. Neither of them REDISTRIBUTES anybody, and the
 * bifurcation's cure needs both tails to meet: the design's own words are that the
 * overcrowded city sheds toward the starving village and the floored six become
 * destinations the moment they have food slack. This file is that movement.
 *
 * ── WHY THIS SLICE PRECEDES THE VALVES (review amendment 2, binding) ────────
 * You cannot choose between filling a half-empty village and founding a new steading
 * until the destinations COMPETE. So destination competition is built first, and
 * `competeForDestinations` below is the seam P3 asks: it consumes the spare capacity
 * of every reachable viable settlement in rank order and reports what it could NOT
 * place. That leftover, and only that leftover, is what could ever justify a founding.
 * A founding lane that never asked would be minting settlements over a realm with
 * empty houses in it.
 *
 * ── LAW 4, AND WHY THE LEDGER IS THE EXISTING ONE ──────────────────────────
 * Every emigrant is an arrival or a column still on the road. The realm total moves
 * only through births, deaths and world edges, never through arithmetic convenience,
 * and the accounting identity this file maintains is exact:
 *
 *     departures == arrivals + still-in-transit + returned + lost
 *
 * The columns live in `spatialLedgers.migration`, which M4 already built for crisis
 * flight, because J2's population extractor already counts exactly that ledger as a
 * population-class flow. Reusing it means the roads earn their grade from the
 * homeostat's traffic for free and the wave adds ZERO new ledger kinds, which is what
 * §4's last sentence asks for. The two lanes are gated on different flags and cannot
 * collide: each column carries its owning class (spatial/migration.js declares it),
 * and each release pass lands only its own.
 *
 * ── ZERO ROAD MORTALITY HERE, ON PURPOSE ───────────────────────────────────
 * M4's crisis columns lose people at the origin and on the road, and they should: a
 * refugee march out of a sacked town is a mortality event. A HOMEOSTAT column is not.
 * Law 5 says curbs are world events and never invisible math, and P2 has no stressor
 * coupling at all (that is P4). So a P2 column arrives whole, every death in this wave
 * is a death P1's rates named, and the conservation pin can be exact rather than
 * approximately exact. When P4 wires the stressor couplings, road mortality arrives as
 * a NAMED cause class on this same ledger.
 *
 * ── DETERMINISM ────────────────────────────────────────────────────────────
 * ZERO forks and ZERO draws. The one stochastic step, turning an expected departure
 * count into a whole number, is integerized through the wave's own `integerize`
 * primitive against a HASH of (settlement, tick), which is the idiom P1a chose for
 * exactly this reason: threading an rng here would open a new per-tick stream beside
 * P1's `demographics:<id>` fork, and a lane that opens a stream can steal draws from
 * one that does not (the wave-E stream-theft law). P1's pin that each settlement
 * consumes EXACTLY TWO draws therefore still holds with this lane lit.
 *
 * Settlements are visited in codepoint order and every menu is codepoint-ordered, so
 * the same world always produces the same roads and the same columns.
 *
 * Pure and headless: no store, no React, no I/O, no clock, no ambient randomness.
 *
 * @enforced-by tests/domain/demographicsMigration.test.js
 */

import { formatCount } from '../formatNumber.js';
import { clamp01 } from '../../kernel/math.js';
import { hash01 } from '../region/contestMath.js';
import { residentNamedNpcCount } from './npcReplacement.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger } from '../spatial/distanceRead.js';
import {
  assertMigrationConservation,
  enqueueColumns,
  isDemographicColumn,
  readMigrationColumn,
} from '../spatial/migration.js';
import { livedCostsFrom } from './routeNetworkConsumers.js';
import { livedLegTicks } from './routeNetworkConsumersTransit.js';
import { demographicsActive, integerize, tierViabilityOf } from './demographicsRates.js';
import { encouragement01Of } from './demographicsWorks.js';
import {
  PUSH_PULL_TUNING,
  demographicReadings,
  needVectorOf,
  departureRateOf,
  prosperity01Of,
  pressureScore,
  pullScoreOf,
  pushScoreOf,
} from './demographicsPushPull.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */
/** @typedef {import('./demographicsPushPull.js').DemoItem} DemoItem */
/** @typedef {import('./demographicsPushPull.js').DemoPressureIndex} DemoPressureIndex */
/** @typedef {import('./demographicsPushPull.js').DestinationReading} DestinationReading */
/** @typedef {import('./demographicsPushPull.js').NeedVector} NeedVector */
/** @typedef {import('./demographicsPushPull.js').DemographicReadings} DemographicReadings */
/** @typedef {import('../spatial/migration.js').MigrationColumn} MigrationColumn */
/** @typedef {{ saveId?: (string|number), settlement?: DemoSettlement }} MigUpdate */
/** @typedef {{ settlements?: DemoItem[] }} MigSnapshot */

const T = PUSH_PULL_TUNING;

/**
 * The closed REFUSAL vocabulary. Every column that did not form names why, because a
 * lane that answers P3's "could these people go somewhere that already exists" needs
 * to distinguish "there is nowhere" from "there is somewhere and it is full", and
 * "returned null" is not a reason.
 * @type {ReadonlyArray<string>}
 */
export const MIGRATION_REFUSALS = Object.freeze([
  'none', 'partial', 'unreachable', 'no_capacity', 'unattractive',
]);

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Codepoint comparator (device/locale-stable ordering). @param {string} a @param {string} b */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * WHAT ONE HOP COSTS A POPULATION COLUMN, and which hops it may not take at all.
 *
 * The price is J4's own grade pricing, unchanged: a column pays what the roads cost
 * the people who walk them (J-P3, "people move the way goods do"). A HIDDEN hop is
 * refused outright by returning null, and that refusal is the reachability law with
 * teeth: an overgrown remnant is a way a smuggler can push through, not a road three
 * hundred villagers walk with their carts.
 *
 * No traveller kind is claimed. J4's kind vocabulary is closed and totality-pinned,
 * and a migration column is none of its four; the access rule it needs is one line and
 * it is this one, spelled the same way `livedDegree` spells it (a hidden path is not
 * a living route).
 *
 * @param {Record<string, unknown>} worldState
 * @param {string|null} season
 * @returns {(fromId: string, hop: import('./routeNetworkConsumers.js').LivedHop) => number|null}
 */
export function populationLegCost(worldState, season) {
  return (fromId, hop) => {
    if (hop.hidden) return null;
    return livedLegTicks({ worldState, fromId, hop, season: season || null });
  };
}

/**
 * @typedef {Object} MigrationPlacement
 * @property {string} destId
 * @property {number} count   people bound for this destination
 * @property {number} ticks   the journey's price
 * @property {number} pull    the score that won it this share
 */

/**
 * @typedef {Object} CompetitionResult
 * @property {ReadonlyArray<MigrationPlacement>} placements  codepoint-stable, rank-ordered
 * @property {number} placed     Σ placements, the people who actually leave
 * @property {number} unplaced   the people the existing realm could not take
 * @property {string} refusal    one of MIGRATION_REFUSALS
 * @property {number} considered how many reachable destinations were on the menu
 */

/**
 * THE DESTINATION COMPETITION (review amendment 2, and the reason P2 precedes P3).
 *
 * Rank every reachable destination by its pull for THESE people, then consume spare
 * capacity in rank order until the column is placed or the realm runs out of room.
 * What is left over is `unplaced`, and that number is the whole of P3's licence to
 * found: spare capacity in a reachable viable settlement is consumed BEFORE any new
 * settlement could be justified.
 *
 * THE TWO CLASSES DIVERGE HERE AND NOWHERE ELSE. A VOLUNTARY migrant is choosy: a
 * destination must out-pull their own home by VOLUNTARY_MARGIN or they simply stay,
 * which is why a comfortable realm does not churn its people between neighbours
 * forever. A REFUGEE flees regardless of destination quality: the margin is not
 * applied at all, so a refugee column forms toward the least bad reachable place while
 * a voluntary column facing the identical menu never leaves. Capacity and viability
 * still bind for both, because a refugee arriving somewhere with no room to hold them
 * is a famine rather than a migration.
 *
 * A PLACEMENT UNDER MIN_COLUMN IS NOT A COLUMN. Those people stay home and are
 * reported as unplaced; nobody is created or destroyed by the refusal.
 *
 * PURE. This function decides nothing about the world; it answers a question, and the
 * caller (or P3) decides what to do with the answer.
 *
 * @param {{ menu: ReadonlyArray<DestinationReading>, need: NeedVector, migrants: number,
 *   migrantClass: string, homePull: number }} input
 * @returns {CompetitionResult}
 */
export function competeForDestinations(input) {
  const menu = Array.isArray(input.menu) ? input.menu : [];
  const migrants = Math.max(0, Math.floor(num(input.migrants, 0)));
  const choosy = String(input.migrantClass) !== 'refugee';
  const bar = choosy ? num(input.homePull, 0) + T.VOLUNTARY_MARGIN : -1;

  /** @type {Array<{ destination: DestinationReading, pull: number }>} */
  const scored = [];
  let sawViable = false;
  let sawRoom = false;
  for (const destination of menu) {
    if (destination.viable === false) continue;
    sawViable = true;
    if (destination.spare < 1) continue;
    sawRoom = true;
    const pull = pullScoreOf({ destination, need: input.need });
    if (pull <= bar) continue;
    scored.push({ destination, pull });
  }
  scored.sort((a, b) => (b.pull - a.pull) || codepoint(a.destination.destId, b.destination.destId));

  /** @type {Array<MigrationPlacement>} */
  const placements = [];
  let remaining = migrants;
  for (const entry of scored.slice(0, T.MAX_DESTINATIONS)) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, Math.max(0, Math.floor(entry.destination.spare)));
    if (take < T.MIN_COLUMN) continue;
    placements.push({
      destId: entry.destination.destId,
      count: take,
      ticks: entry.destination.ticks,
      pull: entry.pull,
    });
    remaining -= take;
  }

  const placed = placements.reduce((sum, p) => sum + p.count, 0);
  const refusal = placed === migrants && migrants > 0 ? 'none'
    : placed > 0 ? 'partial'
      : menu.length === 0 || !sawViable ? 'unreachable'
        : !sawRoom ? 'no_capacity'
          : scored.length === 0 ? 'unattractive'
            : 'no_capacity';
  return {
    placements: Object.freeze(placements),
    placed,
    unplaced: Math.max(0, migrants - placed),
    refusal,
    considered: menu.length,
  };
}

/**
 * @typedef {Object} MigrationReceipt
 * @property {string} id
 * @property {string} kind        'demographic_migration' or 'demographic_arrival'
 * @property {number} tick
 * @property {string} line        the in-world sentence (legibility law)
 */

/**
 * THE FULL MENU one settlement can see, over the LIVED network only (J-P3).
 *
 * ONE walk per origin per tick, not one per candidate pair: `livedCostsFrom` settles
 * the whole reachable component in a single solve, which is what keeps the homeostat
 * linear in the realm rather than quadratic in it.
 *
 * A destination is on the menu only if the pass can WRITE to it, because a place the
 * apply pass cannot reach is a place people cannot actually arrive at, and enqueueing
 * a column toward one would be a promise the release pass could not keep.
 *
 * `inbound` is the people already on the road toward each destination. Counting them
 * against its spare capacity is what stops two origins in the same tick, or two ticks
 * in a row, from both filling the same village and overspilling it on arrival.
 *
 * @param {{ worldState: Record<string, unknown>, originId: string,
 *   settlementOf: (id: string) => (DemoSettlement|null),
 *   itemOf: (id: string) => (DemoItem|null),
 *   inbound: Map<string, number>, pIndex?: DemoPressureIndex|null, season?: string|null }} input
 * @returns {ReadonlyArray<DestinationReading>}
 */
export function destinationMenuFor(input) {
  const reach = livedCostsFrom({
    worldState: input.worldState,
    fromId: input.originId,
    costOf: populationLegCost(input.worldState, input.season || null),
  });
  /** @type {Array<DestinationReading>} */
  const menu = [];
  for (const destId of [...reach.keys()].sort(codepoint)) {
    const settlement = input.settlementOf(destId);
    if (!settlement) continue;
    const raw = asObject(settlement);
    // A remnant is frozen history: nobody moves into a place the terminal lane has
    // closed, exactly as P1 refuses to breed one.
    if (raw.lifecycleStatus || asObject(raw.config).lifecycleStatus) continue;
    const ticks = num(/** @type {{ ticks: number }} */ (reach.get(destId)).ticks, 0);
    const readings = demographicReadings(settlement, input.worldState, destId);
    const viability = tierViabilityOf(settlement, input.worldState, destId);
    const pop = readings.population;
    const foodSlack01 = readings.foodKnown
      ? clamp01((readings.foodCapacity - pop) / Math.max(1, readings.foodCapacity))
      : 0;
    const roomSlack01 = clamp01((readings.densityCeiling - pop) / Math.max(1, readings.densityCeiling));
    const hostility = pressureScore(input.pIndex, destId, 'hostility', 0);
    const conflict = pressureScore(input.pIndex, destId, 'conflict', 0);
    const enRoute = Math.max(0, num(input.inbound.get(destId), 0));
    const room = Math.floor(readings.bound * T.DESTINATION_FILL_TARGET) - pop - enRoute;
    menu.push({
      destId,
      ticks,
      foodSlack01,
      roomSlack01,
      safety01: clamp01(1 - Math.max(hostility, conflict)),
      prosperity01: prosperity01Of(input.itemOf(destId)),
      spare: Math.max(0, room),
      viable: viability.nonviable !== true,
    });
  }
  return Object.freeze(menu);
}

/**
 * THE PULL OF STAYING WHERE YOU ARE. The origin scored by the SAME function as every
 * destination, at zero journey price, so the voluntary margin compares like with like.
 * Without this a voluntary migrant would be measuring an absolute number against a
 * threshold, and the threshold would silently mean something different in a rich realm
 * than in a poor one.
 * @param {{ readings: DemographicReadings, need: NeedVector, item: DemoItem|null,
 *   pIndex?: DemoPressureIndex|null, settlementId: string }} input
 * @returns {number}
 */
export function homePullOf(input) {
  const r = input.readings;
  const pop = r.population;
  const hostility = pressureScore(input.pIndex, input.settlementId, 'hostility', 0);
  const conflict = pressureScore(input.pIndex, input.settlementId, 'conflict', 0);
  return pullScoreOf({
    need: input.need,
    destination: {
      destId: String(input.settlementId),
      ticks: 0,
      foodSlack01: r.foodKnown ? clamp01((r.foodCapacity - pop) / Math.max(1, r.foodCapacity)) : 0,
      roomSlack01: clamp01((r.densityCeiling - pop) / Math.max(1, r.densityCeiling)),
      safety01: clamp01(1 - Math.max(hostility, conflict)),
      prosperity01: prosperity01Of(input.item),
      spare: 0,
      viable: true,
    },
  });
}

/**
 * @typedef {Object} MigrationAdvanceResult
 * @property {MigUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} receipts
 * @property {{ departures: number, arrivals: number, inTransit: number, returned: number,
 *   lost: number, unplaced: number }} accounting  law 4, in one object a pin can add up
 */

/**
 * ADVANCE THE HOMEOSTAT ONE TICK.
 *
 * Two stages, in this order and for this reason: the columns that have LANDED are
 * credited first, so a village that just received people is already fuller when the
 * next settlement asks whether it has room. Departing first would let one tick's
 * arrivals be invisible to the same tick's competition, and the realm would
 * consistently over-send toward places that had just filled up.
 *
 * DORMANT (flag absent) ⇒ the SAME worldState and settlementUpdates REFERENCES back,
 * immediately: zero keys, zero receipts, zero reads.
 *
 * @param {Object} args
 * @param {MigSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {MigUpdate[]} args.settlementUpdates
 * @param {number} args.tick
 * @param {DemoPressureIndex|null} [args.pIndex]
 * @param {string|null} [args.season]
 * @returns {MigrationAdvanceResult}
 */
export function advanceDemographicMigration({ snapshot, worldState, settlementUpdates, tick, pIndex, season }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  /** @type {MigrationAdvanceResult} */
  const inert = {
    worldState,
    settlementUpdates: updates,
    changed: false,
    receipts: [],
    accounting: { departures: 0, arrivals: 0, inTransit: 0, returned: 0, lost: 0, unplaced: 0 },
  };
  if (!demographicsActive(worldState)) return inert;

  const items = Array.isArray(asObject(snapshot).settlements)
    ? /** @type {DemoItem[]} */ (asObject(snapshot).settlements)
    : [];
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  /** @type {Map<string, DemoItem>} */
  const itemById = new Map(items.map((it) => [String(it.id), it]));
  /** @type {Map<string, string>} */
  const nameById = new Map(items.map((it) => [String(it.id), String(it.name || it.id)]));

  let nextUpdates = updates;
  let cloned = false;
  const ensureCloned = () => { if (!cloned) { nextUpdates = updates.slice(); cloned = true; } };

  /** The settlement the apply pass can still WRITE, or null. @param {string} id */
  const writable = (id) => {
    const ui = updateIndex.get(String(id));
    if (ui === undefined) return null;
    return /** @type {DemoSettlement} */ (asObject(nextUpdates[ui]).settlement || {});
  };
  /** @param {string} id @param {number} delta @param {string} reason @param {string} outcomeId */
  const shift = (id, delta, reason, outcomeId) => {
    const ui = updateIndex.get(String(id));
    if (ui === undefined || !delta) return 0;
    ensureCloned();
    const live = /** @type {DemoSettlement} */ (asObject(nextUpdates[ui]).settlement || {});
    const current = Math.max(0, Math.round(num(live.population, 0)));
    const next = Math.max(0, current + Math.round(delta));
    const history = Array.isArray(asObject(live).populationHistory)
      ? /** @type {Array<Record<string, unknown>>} */ (asObject(live).populationHistory)
      : [];
    nextUpdates[ui] = {
      ...nextUpdates[ui],
      settlement: {
        ...live,
        population: next,
        populationHistory: [
          ...history.slice(-11),
          { tick, delta: next - current, population: next, reason, outcomeId },
        ],
      },
    };
    return next - current;
  };

  const stepTick = Math.max(0, Math.round(num(tick, 0)));
  /** @type {Array<Record<string, unknown>>} */
  const receipts = [];
  const accounting = { departures: 0, arrivals: 0, inTransit: 0, returned: 0, lost: 0, unplaced: 0 };

  // ── THE WORKING LEDGER. Every column in the world, ours and M4's; we only ever
  // land or raise our own, and M4's ride through untouched. ──
  const prior = asObject(getSpatialLedger(worldState, 'migration'));
  /** @type {Record<string, MigrationColumn>} */
  let ledger = {};
  for (const key of Object.keys(prior).sort()) {
    const column = readMigrationColumn(prior[key]);
    if (column) ledger[key] = column;
  }
  const priorKeys = Object.keys(ledger).length;
  let ledgerChanged = false;

  // ── STAGE 1: THE COLUMNS THAT HAVE LANDED ──
  /** @type {Map<string, { count: number, origins: Set<string> }>} */
  const landed = new Map();
  for (const key of Object.keys(ledger).sort()) {
    const column = ledger[key];
    if (!isDemographicColumn(column)) continue;
    if (column.arrivalTick > stepTick) continue;
    const arrivals = Math.max(0, Math.floor(num(column.arrivals, 0)));
    if (arrivals <= 0) { delete ledger[key]; ledgerChanged = true; continue; }
    // The destination first; the origin as the turn-back; and only if BOTH are gone is
    // this a world edge, which is named in the accounting rather than absorbed.
    const target = writable(column.destId) ? column.destId
      : writable(column.originId) ? column.originId
        : null;
    if (target === null) {
      accounting.lost += arrivals;
    } else if (target === column.destId) {
      const bucket = landed.get(target) || { count: 0, origins: new Set() };
      bucket.count += arrivals;
      bucket.origins.add(String(column.originId));
      landed.set(target, bucket);
      accounting.arrivals += arrivals;
    } else {
      shift(target, arrivals, 'A column that could not land turns back.',
        `demographics.migration.return.${target}.${stepTick}`);
      accounting.returned += arrivals;
    }
    delete ledger[key];
    ledgerChanged = true;
  }
  for (const destId of [...landed.keys()].sort(codepoint)) {
    const bucket = /** @type {{ count: number, origins: Set<string> }} */ (landed.get(destId));
    const name = nameById.get(destId) || destId;
    shift(destId, bucket.count, `${formatCount(bucket.count)} newcomers arrive on the road.`,
      `demographics.migration.arrival.${destId}.${stepTick}`);
    receipts.push({
      id: `demographics.arrival.${destId}.${stepTick}`,
      kind: 'demographic_arrival',
      tick: stepTick,
      destId,
      arrivals: bucket.count,
      origins: [...bucket.origins].sort(codepoint),
      line: `${formatCount(bucket.count)} newcomers reach ${name} and are taken in.`,
    });
  }

  // ── THE INBOUND CENSUS, rebuilt from the ledger AFTER the landings, so a
  // destination's spare room already accounts for everyone still walking toward it. ──
  /** @type {Map<string, number>} */
  const inbound = new Map();
  for (const key of Object.keys(ledger)) {
    const column = ledger[key];
    if (!isDemographicColumn(column)) continue;
    inbound.set(column.destId, (inbound.get(column.destId) || 0) + Math.max(0, num(column.arrivals, 0)));
  }

  // ── STAGE 2: WHO LEAVES, AND WHERE THE REALM CAN PUT THEM ──
  for (const originId of items.map((it) => String(it.id)).sort(codepoint)) {
    const settlement = writable(originId);
    if (!settlement) continue;
    const raw = asObject(settlement);
    if (raw.lifecycleStatus || asObject(raw.config).lifecycleStatus) continue;
    const population = Math.max(0, Math.round(num(settlement.population, 0)));
    if (population <= 0) continue;

    const readings = demographicReadings(settlement, worldState, originId);
    const item = itemById.get(originId) || null;
    const push = pushScoreOf({ item, settlement, readings, pIndex, settlementId: originId });
    const rate = departureRateOf({
      push01: push.score01,
      reserveCoverage: readings.reserveCoverage,
      // WAVE P3: a completed emigration plan is a standing policy, read through the
      // works leaf's ONE writer. No works ⇒ 0 ⇒ this line is P2's own arithmetic.
      encouragement01: encouragement01Of(worldState, originId),
    });
    if (rate <= 0) continue;

    // THE H3 FLOOR COMPOSES STRUCTURALLY (law 3). The column is drawn against the
    // ANONYMOUS POOL: the named cast never emigrates on this lane, because H3's
    // circulation owns every named soul's movement and a number is all this lane moves.
    const named = residentNamedNpcCount(settlement);
    const pool = Math.max(0, population - named);
    if (pool <= 0) continue;
    const wish = Math.min(pool, integerize(
      pool * rate,
      hash01(`demographics.migration.${originId}.${stepTick}`),
    ));
    if (wish < T.MIN_COLUMN) continue;

    const need = needVectorOf(readings);
    const menu = destinationMenuFor({
      worldState,
      originId,
      settlementOf: writable,
      itemOf: (id) => itemById.get(id) || null,
      inbound,
      pIndex,
      season: season || null,
    });
    const result = competeForDestinations({
      menu,
      need,
      migrants: wish,
      migrantClass: push.migrantClass,
      homePull: homePullOf({ readings, need, item, pIndex, settlementId: originId }),
    });
    accounting.unplaced += result.unplaced;
    const name = nameById.get(originId) || originId;

    if (result.placed <= 0) {
      // A REFUSAL IS A RECEIPT, and it is the one P3 reads. The people stayed, so no
      // population moved and the accounting is untouched.
      receipts.push({
        id: `demographics.migration.${originId}.${stepTick}`,
        kind: 'demographic_migration',
        tick: stepTick,
        originId,
        migrantClass: push.migrantClass,
        push01: push.score01,
        pressing: push.pressing,
        departures: 0,
        placements: [],
        unplaced: result.unplaced,
        refusal: result.refusal,
        considered: result.considered,
        line: `${formatCount(result.unplaced)} would leave ${name}, and the realm has nowhere to put them.`,
      });
      continue;
    }

    // THE PLAN, in the shape the ONE column writer already takes, so the conservation
    // assertion M4 wrote applies to this lane verbatim.
    const plan = {
      originId,
      departures: result.placed,
      originDeaths: 0,
      roadDeaths: 0,
      arrivals: result.placed,
      mode: 'disperse',
      travelClass: push.migrantClass,
      dispatches: result.placements.map((p) => ({
        originId,
        destId: p.destId,
        travellers: p.count,
        roadDeaths: 0,
        arrivals: p.count,
        arrivalTick: stepTick + Math.max(1, Math.ceil(num(p.ticks, 1))),
      })),
    };
    // Never enqueue an inconsistent column: a plan that cannot add up does not travel.
    if (!assertMigrationConservation(/** @type {Parameters<typeof assertMigrationConservation>[0]} */ (plan))) continue;

    shift(originId, -result.placed,
      `${formatCount(result.placed)} take the road for somewhere else.`,
      `demographics.migration.depart.${originId}.${stepTick}`);
    accounting.departures += result.placed;
    ledger = enqueueColumns(ledger, /** @type {Parameters<typeof enqueueColumns>[1]} */ (plan), stepTick);
    ledgerChanged = true;
    for (const p of result.placements) {
      inbound.set(p.destId, (inbound.get(p.destId) || 0) + p.count);
    }

    const first = result.placements[0];
    const whither = nameById.get(first.destId) || first.destId;
    const why = push.pressing.length ? push.pressing.join(' and ') : 'the pull of somewhere better';
    receipts.push({
      id: `demographics.migration.${originId}.${stepTick}`,
      kind: 'demographic_migration',
      tick: stepTick,
      originId,
      migrantClass: push.migrantClass,
      push01: push.score01,
      pressing: push.pressing,
      departures: result.placed,
      placements: result.placements,
      unplaced: result.unplaced,
      refusal: result.refusal,
      considered: result.considered,
      line: `${formatCount(result.placed)} leave ${name} for ${whither} over ${why}.`,
    });
  }

  for (const key of Object.keys(ledger)) {
    if (isDemographicColumn(ledger[key])) {
      accounting.inTransit += Math.max(0, Math.floor(num(ledger[key].arrivals, 0)));
    }
  }

  let nextWorldState = worldState;
  if (ledgerChanged) {
    const keys = Object.keys(ledger).length;
    // Conditional and drop-when-empty: the last column to land takes the key with it,
    // and an emptied world is byte-identical to one that never migrated.
    nextWorldState = keys > 0
      ? setSpatialLedger(worldState, 'migration', ledger)
      : (priorKeys > 0 ? dropSpatialLedger(worldState, 'migration') : worldState);
  }

  return {
    worldState: nextWorldState,
    settlementUpdates: nextUpdates,
    changed: cloned || nextWorldState !== worldState,
    receipts,
    accounting,
  };
}
