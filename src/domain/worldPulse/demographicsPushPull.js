/**
 * demographicsPushPull.js — WAVE P2 (THE HOMEOSTAT), THE READS.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §2b (THREE READINGS) and §4 (push-pull) are this
 * file's contract. Pure, total, zero-PRNG, zero-write: every function here answers a
 * question and none of them changes anything.
 *
 * ── §2b IS THE WHOLE DISCIPLINE: THREE READINGS, NEVER ONE DIAGNOSIS ────────
 * A settlement can be food-insecure, reserve-rich and overcrowded AT ONCE, and it can
 * only afford to answer one of those. So this file exposes THREE independent readings,
 * each with its own closed band vocabulary, and it deliberately publishes NO function
 * that collapses them into a single binding-cause word:
 *
 *   • foodFlowRatio    K_food / population. FLOW ONLY. P1 built K_food from
 *                      dailyProduction and never from storageMonths, and that
 *                      exclusion is pinned: a warehouse of grain buys TIME, never
 *                      permanent headroom.
 *   • reserveCoverage  storageMonths / the granary's own capacity. How long the stores
 *                      cover the gap. It scales HOW FAST people leave and never WHERE
 *                      they go, which is exactly "reserves delay crisis, never create
 *                      permanent capacity" (acceptance claim 2) expressed as code.
 *   • urbanLoadRatio   population / D_tier.
 *
 * min(K_food, D_tier) survives ONLY as the safety bound and the pressure01
 * denominator (P1 owns it), never as the behavior selector. The proof that the three
 * really are separate is behavioural and it is pinned: a food-poor migrant and a
 * space-poor migrant, handed the SAME menu of destinations, choose differently.
 *
 * ── THE PUSH SIDE: FIVE DRIVERS, EACH WITH AN APPLICABILITY GUARD ──────────
 * The owner's ratified design names emigration "under food deficit, low prosperity,
 * low defense, and low internal security, WHERE APPROPRIATE". The where-appropriate
 * clause is not decoration: it is a per-driver guard, and the owner's own example is
 * the one that shaped them. A garrison town does not shed its soldiers over
 * prosperity, because being poor and armed is what a garrison IS.
 *
 * The fifth driver, CROWDING, is a judgment recorded in the slice report and vetoable.
 * The owner's four are all DISTRESS drivers, and a settlement that is crowded and WELL
 * FED reads zero on every one of them by construction: its granaries are ample, so the
 * food driver is silent. Without a crowding driver the wave's own cure at the top tail
 * cannot fire at all, because §4's promise ("the overcrowded city sheds toward the
 * starving village") has no term to fire on. Crowding is therefore read from §2b's
 * urbanLoadRatio, and its guard is what keeps it from double-counting: it applies only
 * where the DENSITY is the binding wall. Where the granary is the wall, the food driver
 * already owns that settlement's story, and shedding twice for one cause would be the
 * collapsed diagnosis §2b forbids.
 *
 * ── THE PULL SIDE: ONLY WHERE THE ROADS GO (J-P3) ──────────────────────────
 * Pull is scored against a destination the traveller can actually REACH, priced by the
 * hop costs people actually pay, and discounted by that price. This file scores; the
 * reachability walk itself belongs to the migration lane, which asks J4 for it.
 *
 * FINITE SEMANTICS: every dial below is a closed authored table keyed by the driver
 * vocabulary or a named band. No caller passes a float in and no surface shows one.
 * Every band here is design §10 tuning-pass property, owner-signed at the soak redo.
 *
 * @enforced-by tests/domain/demographicsMigration.test.js
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { storageCapacityMonths } from './foodStockpile.js';
import {
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
} from './demographicsRates.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */
/**
 * The causal scores the dossier already computes for every settlement. Read here
 * rather than re-derived: these are the SAME three reads the migration lane already
 * takes (migrationKernel.originTolerance reads economic_capacity through this exact
 * path), and a second spelling of "how prosperous is this place" is the kind of drift
 * that shows up a wave later as two surfaces disagreeing about one town.
 * @typedef {{ scores?: { economic_capacity?: number, defense_readiness?: number,
 *   criminal_opportunity?: number, trade_connectivity?: number } }} DemoCausal
 */
/** @typedef {{ id?: (string|number), name?: string, settlement?: DemoSettlement, causal?: DemoCausal }} DemoItem */
/** @typedef {{ get?: (id: (string|number), kind: string) => ({ score?: number }|undefined) }} DemoPressureIndex */

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {number} v @returns {number} 4dp, so a receipt compares by value across machines */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/**
 * A DIRECTIONAL RAMP between an ease point and a saturation point, in whichever
 * direction the reading runs. Food, prosperity, defense and security get WORSE as
 * their reading FALLS, and crowding gets worse as its reading RISES; one ramp serves
 * both because it reads the sign off the band pair rather than off a flag.
 * @param {number} reading @param {number} ease @param {number} full @returns {number}
 */
export function driverRamp(reading, ease, full) {
  const span = full - ease;
  if (!Number.isFinite(span) || span === 0) return reading === ease ? 0 : 1;
  return clamp01((num(reading, ease) - ease) / span);
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE THREE READINGS (§2b), each with its OWN closed band vocabulary
// ═══════════════════════════════════════════════════════════════════════════════

/** The FOOD FLOW band vocabulary, ordered worst first. @type {ReadonlyArray<string>} */
export const FOOD_FLOW_BANDS = Object.freeze(['famished', 'short', 'adequate', 'ample']);
/** The RESERVE COVERAGE band vocabulary, ordered thinnest first. @type {ReadonlyArray<string>} */
export const RESERVE_BANDS = Object.freeze(['bare', 'thin', 'stocked', 'deep']);
/** The URBAN LOAD band vocabulary, ordered emptiest first. @type {ReadonlyArray<string>} */
export const URBAN_LOAD_BANDS = Object.freeze(['open', 'settled', 'packed', 'overspilled']);

/** The closed PUSH DRIVER vocabulary, codepoint-ordered. @type {ReadonlyArray<string>} */
export const PUSH_DRIVERS = Object.freeze([
  'crowding', 'defense', 'food', 'prosperity', 'security',
]);

/** The closed DRIVER STRENGTH vocabulary, ordered lightest first. @type {ReadonlyArray<string>} */
export const DRIVER_STRENGTH_BANDS = Object.freeze(['none', 'slight', 'pressing', 'severe']);

/**
 * The closed MIGRANT CLASS vocabulary (design §11 P2: refugee vs voluntary). A
 * refugee flees regardless of destination quality; a voluntary migrant is choosy and
 * will simply stay home if nothing on the menu beats where they already live.
 * @type {ReadonlyArray<string>}
 */
export const MIGRANT_CLASSES = Object.freeze(['refugee', 'voluntary']);

/**
 * THE AUTHORED PUSH BANDS. `ease` is the reading at which a driver first bites and
 * `full` the reading at which it saturates; `crisis` is the reading past which the
 * driver makes REFUGEES rather than volunteers, and null means this driver never does.
 *
 * Only food and defense carry a crisis rung, and that is the design's opinion rather
 * than an omission: hunger and an enemy at the gate make people flee, while crowding,
 * poverty and thieves make people CHOOSE to leave. The class law falls out of the
 * table instead of being a second rule somewhere else.
 * @type {Readonly<Record<string, Readonly<{ ease: number, full: number, weight: number, crisis: (number|null) }>>>}
 */
export const PUSH_DRIVER_BANDS = Object.freeze({
  // foodFlowRatio: 1 is exactly fed. Below 0.55 the fields cannot feed half the town.
  food: Object.freeze({ ease: 1.00, full: 0.55, weight: 0.34, crisis: 0.70 }),
  // urbanLoadRatio: the walls start telling at 0.90 and are overspilled past 1.35.
  crowding: Object.freeze({ ease: 0.90, full: 1.35, weight: 0.24, crisis: null }),
  // prosperity01, defense01, security01 all read 1 = best, 0 = worst.
  prosperity: Object.freeze({ ease: 0.45, full: 0.10, weight: 0.16, crisis: null }),
  defense: Object.freeze({ ease: 0.45, full: 0.10, weight: 0.14, crisis: 0.20 }),
  security: Object.freeze({ ease: 0.45, full: 0.10, weight: 0.12, crisis: null }),
});

/**
 * THE REST OF THE TUNING SURFACE (design §10: push/pull driver bands + applicability
 * guards, migration column speed). Every entry named with the game-feel it carries.
 */
export const PUSH_PULL_TUNING = Object.freeze({
  // ── THE APPLICABILITY GUARDS, the "where appropriate" clause as numbers ──
  /** A settlement whose defense reads at or above this is a GARRISON, and a garrison
   *  does not shed its soldiers over prosperity. The owner's own example. */
  GARRISON_DEFENSE_FLOOR: 0.65,
  /** The defense driver needs an actual THREAT. Low readiness with nobody at the gate
   *  is a budget line, not a reason to walk. Read from the relationship-derived
   *  hostility pressure, which is deliberately NOT derived from defense readiness: a
   *  threat read off the same number as the driver would be a guard that always opens. */
  DEFENSE_THREAT_FLOOR: 0.25,
  /** The security driver needs something worth stealing. In a destitute place the food
   *  and prosperity drivers already own the story, and counting thieves there too would
   *  shed the same population twice for one cause. */
  SECURITY_WORTH_FLOOR: 0.20,

  // ── THE DEPARTURE SIZE ──
  /** The fraction of the anonymous pool that leaves in one tick at FULL push. The five
   *  driver weights sum to exactly 1, so FULL means a settlement that is starving AND
   *  overspilled AND destitute AND undefended AND lawless all at once; two percent of
   *  its pool a week is an exodus, and it is meant to be. A single saturated driver
   *  moves a fifth of that. MEASURED 2026-08-01 on the bifurcation fixture: a crowded
   *  fed town of 10,500 beside a viable village of 200 levels the pair by 1,126 people
   *  and then STOPS, because the village's own spare capacity is what bounds it. */
  DEPART_RATE_MAX: 0.020,
  /** Below this push score nobody moves at all: a place with a mild grievance does not
   *  produce a column, and a per-tick trickle from every settlement in the realm would
   *  make the ledger noise rather than a story. Set at a quarter of the lightest single
   *  driver, so ONE real complaint is enough and half a complaint is not. */
  DEPART_PUSH_FLOOR: 0.06,
  /** How much a FULL granary delays departure. Reserves buy time and nothing else:
   *  they never raise K_food (P1 pins that exclusion) and they never change where
   *  anyone goes. Acceptance claim 2, expressed as one multiplier. */
  RESERVE_DELAY_MAX: 0.60,

  // ── THE PULL WEIGHTS ──
  /** How hard a destination's food headroom pulls a migrant who NEEDS food. */
  W_NEED_FOOD: 0.40,
  /** How hard a destination's room headroom pulls a migrant who NEEDS room. */
  W_NEED_ROOM: 0.34,
  /** A destination with BOTH kinds of slack pulls hardest, for every migrant, whatever
   *  their own need vector says. §4's "a destination with both pulls hardest" is this
   *  term, and it is deliberately need-blind so the claim holds for the choosy and the
   *  desperate alike. */
  W_BOTH_SLACK: 0.18,
  /** Safety and prosperity weight the choice (§4). They are never the whole of it: a
   *  rich hostile city with no room takes nobody. */
  W_SAFETY: 0.22,
  /** Prosperity is the smallest term on purpose. Money is why people PREFER a place;
   *  food and room are why they can live there at all. */
  W_PROSPERITY: 0.16,
  /** The journey price at which a destination's pull is halved. The discount is
   *  1 / (1 + ticks / this), so a road twice as long pulls measurably less, and the
   *  curve never reaches zero: far is expensive, not forbidden. */
  DISTANCE_HALF_TICKS: 6,

  // ── THE VOLUNTARY MARGIN ──
  /** A voluntary migrant will not move unless the destination out-pulls their own home
   *  by this much. Without the margin every settlement in the realm would swap people
   *  with its neighbours forever, which is churn rather than a homeostat. A REFUGEE
   *  ignores this entirely: that is what makes the two classes diverge. */
  VOLUNTARY_MARGIN: 0.06,

  // ── THE DESTINATION'S ROOM ──
  /** A destination is filled only to this share of its own effective bound. P1
   *  measured the natural equilibrium at 76 to 83 percent of the bound, so a target
   *  above that band would push arrivals past the plateau the rates would hold them
   *  at, and the newcomers would simply die of the crowding they created. */
  DESTINATION_FILL_TARGET: 0.85,
  /** How many destinations one origin may split a tick's departures across. Bounds the
   *  column ledger's cardinality exactly as M4's MAX_DESTINATIONS does. */
  MAX_DESTINATIONS: 4,
  /** A column smaller than this is not worth a ledger record or a road. The people stay
   *  put; nobody is created or destroyed by the refusal. */
  MIN_COLUMN: 3,
});

const T = PUSH_PULL_TUNING;

/**
 * @typedef {Object} DemographicReadings
 * @property {boolean} foodKnown       the settlement carries real food physics
 * @property {number} foodFlowRatio    K_food / population, FLOW ONLY
 * @property {string} foodFlowBand     one of FOOD_FLOW_BANDS
 * @property {number} reserveCoverage  storageMonths / granary capacity
 * @property {string} reserveBand      one of RESERVE_BANDS
 * @property {number} urbanLoadRatio   population / D_tier
 * @property {string} urbanLoadBand    one of URBAN_LOAD_BANDS
 * @property {number} population
 * @property {number} foodCapacity     K_food
 * @property {number} densityCeiling   D_tier
 * @property {number} bound            min(K_food, D_tier), P1's safety bound and NOTHING else
 * @property {string} binding          which of the two is the wall (P1's reading)
 */

/** @param {number} ratio @returns {string} */
function foodFlowBandWord(ratio) {
  if (ratio >= 1.15) return 'ample';
  if (ratio >= 0.92) return 'adequate';
  if (ratio >= 0.70) return 'short';
  return 'famished';
}
/** @param {number} coverage @returns {string} */
function reserveBandWord(coverage) {
  if (coverage >= 0.75) return 'deep';
  if (coverage >= 0.45) return 'stocked';
  if (coverage >= 0.20) return 'thin';
  return 'bare';
}
/** @param {number} ratio @returns {string} */
function urbanLoadBandWord(ratio) {
  if (ratio >= 1.15) return 'overspilled';
  if (ratio >= 0.90) return 'packed';
  if (ratio >= 0.55) return 'settled';
  return 'open';
}

/**
 * THE THREE READINGS OF ONE SETTLEMENT (§2b). Derived every tick, never stored.
 *
 * There is deliberately NO fourth field here naming "the" cause. A caller that wants
 * to know why a place is in trouble reads all three and decides what it is for; a
 * caller that wants a safety bound reads P1's effectiveBoundOf. Collapsing the three
 * into one enum is the exact mistake §2b was written to forbid, and its absence is
 * pinned by a source scan rather than by this comment.
 *
 * @param {DemoSettlement|null|undefined} settlement
 * @param {{ spatialLedgers?: unknown, simulationRules?: unknown }|null|undefined} worldState
 * @param {string} settlementId
 * @returns {DemographicReadings}
 */
export function demographicReadings(settlement, worldState, settlementId) {
  const population = Math.max(0, Math.round(num(asObject(settlement).population, 0)));
  const food = foodCapacityOf(settlement, worldState, settlementId);
  const bound = effectiveBoundOf(food, densityCeilingOf(settlement));
  const mouths = Math.max(0, Math.round(num(food.mouths, 0)));
  // An unfed reading is NEVER a famine: a fixture with no food physics reads
  // foodKnown false and a neutral ratio of 1, exactly as P1a's viability read refuses
  // to call an absent measurement a failure.
  const foodFlowRatio = food.present ? mouths / Math.max(1, population) : 1;
  const stores = asObject(asObject(settlement).economicState);
  const months = num(asObject(asObject(stores).foodSecurity).storageMonths, 0);
  const capacity = Math.max(1, num(storageCapacityMonths(
    /** @type {Parameters<typeof storageCapacityMonths>[0]} */ (/** @type {unknown} */ (settlement))), 12));
  const reserveCoverage = clamp(months / capacity, 0, 2);
  const urbanLoadRatio = population / Math.max(1, bound.densityCeiling);
  return {
    foodKnown: food.present,
    foodFlowRatio: round4(foodFlowRatio),
    foodFlowBand: foodFlowBandWord(foodFlowRatio),
    reserveCoverage: round4(reserveCoverage),
    reserveBand: reserveBandWord(reserveCoverage),
    urbanLoadRatio: round4(urbanLoadRatio),
    urbanLoadBand: urbanLoadBandWord(urbanLoadRatio),
    population,
    foodCapacity: bound.foodCapacity,
    densityCeiling: bound.densityCeiling,
    bound: bound.bound,
    binding: bound.binding,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE DOSSIER READS the drivers stand on (existing surfaces, never re-derived)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * One pressure score off the index the pulse already built, or a fallback when no
 * index was threaded. Total: an absent index answers the fallback rather than
 * throwing, so every entry point here works on a bare fixture.
 * @param {DemoPressureIndex|null|undefined} pIndex @param {string} id @param {string} kind
 * @param {number} fallback @returns {number}
 */
export function pressureScore(pIndex, id, kind, fallback) {
  const get = pIndex && typeof pIndex.get === 'function' ? pIndex.get : null;
  if (!get) return fallback;
  const found = get.call(pIndex, id, kind);
  return clamp01(num(found && found.score, fallback));
}

/**
 * PROSPERITY, 0 worst to 1 best. The migration lane's existing read
 * (`economic_capacity` over 100, the same one migrationKernel.originTolerance takes),
 * reused verbatim so the two halves of the migration story cannot disagree about how
 * rich a town is. A settlement with no causal scores reads NEUTRAL, never destitute.
 * @param {DemoItem|null|undefined} item @returns {number}
 */
export function prosperity01Of(item) {
  return clamp01(num(asObject(asObject(item).causal).scores
    && /** @type {Record<string, number>} */ (asObject(asObject(asObject(item).causal).scores)).economic_capacity, 50) / 100);
}

/**
 * DEFENSE, 0 worst to 1 best. `defense_readiness` is the score the dossier's own
 * defense surface is built from.
 * @param {DemoItem|null|undefined} item @returns {number}
 */
export function defense01Of(item) {
  return clamp01(num(/** @type {Record<string, number>} */ (
    asObject(asObject(asObject(item).causal).scores)).defense_readiness, 50) / 100);
}

/**
 * INTERNAL SECURITY, 0 worst to 1 best. The WORSE of the two existing exposures: the
 * generated criminal-opportunity score, and the live crime pressure the pulse derives
 * (which already folds the crime conditions and the lean-winter term). Taking the
 * worse rather than blending them means a settlement cannot launder a live crime wave
 * behind a comfortable generation-time score.
 * @param {DemoItem|null|undefined} item @param {DemoPressureIndex|null|undefined} pIndex
 * @param {string} settlementId @returns {number}
 */
export function security01Of(item, pIndex, settlementId) {
  const opportunity = clamp01(num(/** @type {Record<string, number>} */ (
    asObject(asObject(asObject(item).causal).scores)).criminal_opportunity, 30) / 100);
  const live = pressureScore(pIndex, settlementId, 'crime', opportunity);
  return clamp01(1 - Math.max(opportunity, live));
}

/**
 * THE THREAT READ behind the defense guard: the relationship-derived hostility
 * pressure. Deliberately NOT the conflict pressure, which is itself derived from
 * defense readiness and would make the guard open exactly when the driver fires.
 * FAILS CLOSED: with no pressure index threaded there is no evidence of a threat, so
 * the guard stays shut and low readiness alone moves nobody.
 * @param {DemoPressureIndex|null|undefined} pIndex @param {string} settlementId @returns {number}
 */
export function threat01Of(pIndex, settlementId) {
  return pressureScore(pIndex, settlementId, 'hostility', 0);
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE PUSH SCORE (§4)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} PushDriverReading
 * @property {string} driver      one of PUSH_DRIVERS
 * @property {number} reading     the raw reading this driver stands on
 * @property {number} strength01  0 when eased or guarded off, 1 at saturation
 * @property {string} band        one of DRIVER_STRENGTH_BANDS
 * @property {boolean} applicable false when this driver's guard refused it
 * @property {string} guard       the guard's own word, for the receipt
 * @property {boolean} crisis     true when the reading is past this driver's crisis rung
 */

/**
 * @typedef {Object} PushScore
 * @property {number} score01                 the weighted push, 0 to 1
 * @property {string} migrantClass            one of MIGRANT_CLASSES
 * @property {ReadonlyArray<PushDriverReading>} drivers  every driver, applicable or not
 * @property {ReadonlyArray<string>} pressing the applicable drivers above `slight`
 */

/** @param {number} strength01 @returns {string} */
function strengthBandWord(strength01) {
  if (strength01 >= 0.66) return 'severe';
  if (strength01 >= 0.33) return 'pressing';
  if (strength01 > 0) return 'slight';
  return 'none';
}

/**
 * THE PUSH SCORE OF ONE SETTLEMENT (§4). Five banded drivers, each gated by its own
 * applicability guard, weighted into one number and one class.
 *
 * THE GUARDS ARE THE AMENDMENT. Each one states a "where appropriate" the owner's
 * design asks for, and each is a REFUSAL rather than a discount: a guarded driver
 * contributes exactly zero, so a garrison town's poverty is worth nothing at all to
 * its push rather than merely less. Half-measures here would be untestable.
 *
 * THE CLASS FALLS OUT OF THE TABLE. If any applicable driver is past its crisis rung
 * the column is a REFUGEE column; otherwise it is VOLUNTARY. Nothing else decides it,
 * so the class can never disagree with the drivers that produced it.
 *
 * @param {{ item?: DemoItem|null, settlement?: DemoSettlement|null,
 *   readings: DemographicReadings, pIndex?: DemoPressureIndex|null, settlementId: string }} input
 * @returns {PushScore}
 */
export function pushScoreOf(input) {
  const readings = input.readings;
  const id = String(input.settlementId);
  const item = input.item || null;
  const pIndex = input.pIndex || null;

  const prosperity01 = prosperity01Of(item);
  const defense01 = defense01Of(item);
  const security01 = security01Of(item, pIndex, id);
  const threat01 = threat01Of(pIndex, id);

  /** @type {Array<{ driver: string, reading: number, applicable: boolean, guard: string }>} */
  const raw = [
    {
      driver: 'crowding',
      reading: readings.urbanLoadRatio,
      // Where the granary is the wall, the food driver already owns this settlement's
      // story. Shedding for crowding there too would be the collapsed diagnosis §2b
      // forbids, and it would count one cause twice.
      applicable: readings.binding === 'walls',
      guard: 'the walls are the wall',
    },
    {
      driver: 'defense',
      reading: defense01,
      applicable: threat01 >= T.DEFENSE_THREAT_FLOOR,
      guard: 'a threat stands at the gate',
    },
    {
      driver: 'food',
      reading: readings.foodFlowRatio,
      // An absent measurement is never evidence of failure (P1a's viability law).
      applicable: readings.foodKnown === true,
      guard: 'the fields can be counted',
    },
    {
      driver: 'prosperity',
      reading: prosperity01,
      // THE OWNER'S OWN EXAMPLE: a garrison town does not shed its soldiers over
      // prosperity. Being poor and armed is what a garrison IS.
      applicable: defense01 < T.GARRISON_DEFENSE_FLOOR,
      guard: 'not a garrison seat',
    },
    {
      driver: 'security',
      reading: security01,
      applicable: prosperity01 >= T.SECURITY_WORTH_FLOOR,
      guard: 'something here is worth stealing',
    },
  ];

  /** @type {Array<PushDriverReading>} */
  const drivers = [];
  let score = 0;
  let crisis = false;
  for (const entry of raw) {
    const band = /** @type {Record<string, { ease: number, full: number, weight: number, crisis: (number|null) }>} */ (
      PUSH_DRIVER_BANDS)[entry.driver];
    const strength01 = entry.applicable ? driverRamp(entry.reading, band.ease, band.full) : 0;
    // The crisis rung is read in the driver's own direction: crowding worsens upward
    // and the other four worsen downward, so the comparison follows the band pair.
    const worseUp = band.full > band.ease;
    const atCrisis = entry.applicable && band.crisis != null && strength01 > 0
      && (worseUp ? entry.reading >= band.crisis : entry.reading <= band.crisis);
    if (atCrisis) crisis = true;
    score += band.weight * strength01;
    drivers.push({
      driver: entry.driver,
      reading: round4(entry.reading),
      strength01: round4(strength01),
      band: strengthBandWord(strength01),
      applicable: entry.applicable,
      guard: entry.guard,
      crisis: atCrisis,
    });
  }

  return {
    score01: round4(clamp01(score)),
    migrantClass: crisis ? 'refugee' : 'voluntary',
    drivers: Object.freeze(drivers),
    pressing: Object.freeze(drivers
      .filter(d => d.applicable && d.strength01 >= 0.33)
      .map(d => d.driver)),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// THE NEED VECTOR AND THE PULL SCORE (§4, J-P3)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} NeedVector
 * @property {number} food01  how badly these people need somewhere with food
 * @property {number} room01  how badly these people need somewhere with room
 */

/**
 * WHAT THESE PEOPLE ARE LOOKING FOR, read from their own settlement's first and third
 * readings. This is the vector that makes the anti-collapse claim behavioural: a
 * starving column and a crowded column carry DIFFERENT vectors and therefore rank the
 * same menu of destinations differently.
 *
 * reserveCoverage deliberately does NOT appear. Stores say how long you can wait, not
 * what you are waiting for; they scale the departure size in `departureRateOf` and
 * touch the destination choice nowhere.
 *
 * @param {DemographicReadings} readings @returns {NeedVector}
 */
export function needVectorOf(readings) {
  const food = /** @type {{ ease: number, full: number }} */ (PUSH_DRIVER_BANDS.food);
  const crowd = /** @type {{ ease: number, full: number }} */ (PUSH_DRIVER_BANDS.crowding);
  return {
    food01: round4(readings.foodKnown ? driverRamp(readings.foodFlowRatio, food.ease, food.full) : 0),
    room01: round4(driverRamp(readings.urbanLoadRatio, crowd.ease, crowd.full)),
  };
}

/**
 * THE FRACTION OF THE ANONYMOUS POOL THAT LEAVES THIS TICK, before integerization.
 *
 * Push sets the size and reserves delay it: a settlement with deep stores under the
 * same push sheds measurably fewer people this week than a settlement with bare ones,
 * and NEITHER of them has a different carrying capacity for it. That asymmetry is
 * acceptance claim 2 in one line.
 *
 * Below DEPART_PUSH_FLOOR nobody moves: a realm where every settlement trickles a few
 * people every week has a noisy ledger and no story in it.
 *
 * @param {{ push01: number, reserveCoverage: number }} input @returns {number}
 */
export function departureRateOf(input) {
  const push = clamp01(num(input.push01, 0));
  if (push < T.DEPART_PUSH_FLOOR) return 0;
  const delay = 1 - T.RESERVE_DELAY_MAX * clamp01(num(input.reserveCoverage, 0));
  return Math.max(0, T.DEPART_RATE_MAX * push * delay);
}

/**
 * @typedef {Object} DestinationReading
 * @property {string} destId
 * @property {number} ticks         the journey's price over the lived network
 * @property {number} foodSlack01   relative food headroom at the far end
 * @property {number} roomSlack01   relative room headroom at the far end
 * @property {number} safety01
 * @property {number} prosperity01
 * @property {number} spare         how many people the far end can actually take
 * @property {boolean} viable       false when the destination cannot hold its own tier
 */

/**
 * THE DISTANCE DISCOUNT (J-P3: people move the way goods do, and they pay for it).
 * A halving curve rather than a cutoff: a far destination pulls measurably less than
 * a near one of identical quality, and never exactly nothing.
 * @param {number} ticks @returns {number}
 */
export function distanceDiscount(ticks) {
  const price = Math.max(0, num(ticks, 0));
  return 1 / (1 + price / Math.max(1e-9, T.DISTANCE_HALF_TICKS));
}

/**
 * THE PULL OF ONE REACHABLE DESTINATION, for a column carrying this need vector.
 *
 * The three readings enter SEPARATELY and that is the whole point: the food term is
 * gated by the column's food need, the room term by its room need, and the both-slack
 * term by neither. A destination that has food and no room out-pulls a roomy famine
 * for a starving column and loses to it for a crowded one, from the same menu, with no
 * min() anywhere deciding on their behalf.
 *
 * @param {{ destination: DestinationReading, need: NeedVector }} input
 * @returns {number}
 */
export function pullScoreOf(input) {
  const d = input.destination;
  const need = input.need;
  if (!d || d.viable === false) return 0;
  const food = T.W_NEED_FOOD * clamp01(num(need.food01, 0)) * clamp01(num(d.foodSlack01, 0));
  const room = T.W_NEED_ROOM * clamp01(num(need.room01, 0)) * clamp01(num(d.roomSlack01, 0));
  const both = T.W_BOTH_SLACK * Math.min(clamp01(num(d.foodSlack01, 0)), clamp01(num(d.roomSlack01, 0)));
  const safety = T.W_SAFETY * clamp01(num(d.safety01, 0));
  const wealth = T.W_PROSPERITY * clamp01(num(d.prosperity01, 0));
  return round4(distanceDiscount(d.ticks) * (food + room + both + safety + wealth));
}
