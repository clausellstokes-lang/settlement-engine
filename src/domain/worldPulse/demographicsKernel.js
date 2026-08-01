/**
 * demographicsKernel.js — WAVE P1 (THE DEMOGRAPHIC ENGINE), THE STEP AND THE ONE WRITER.
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §3 (natural demography) is this file's contract.
 *
 * ONE LINE OF ARITHMETIC IS THE WHOLE CURE:
 *
 *     next = population + births - deaths
 *
 * with every term an integer, both stochastic terms drawn from ONE keyed fork
 * (`demographics:<settlementId>`) in a FIXED order, and the whole thing named in the
 * receipt in words a person can read. There is no growth term that is not a birth and
 * no shrink that is not a death (law 1). The x1.07 compound dies here: equilibrium is
 * where the rates meet, not where a clamp bites, and nothing in this file clamps a
 * population (J-P5 — brief overshoot is famine lag, and it is narratable).
 *
 * DORMANCY. Gated on the NEW virtual flag `demographicsEnabled` (ABSENT from
 * DEFAULT_SIMULATION_RULES, declared FALSE in the full_simulation preset so the
 * certification totality walker can census it). Dark ⇒ an immediate no-op returning
 * the SAME worldState and settlementUpdates REFERENCES: zero forks, zero keys, zero
 * receipts. The fenced dormancy golden asserts object IDENTITY, not deep equality,
 * exactly as the J1 route-lifecycle precedent does.
 *
 * NAMED SOULS ARE EXEMPT (law 3, H3's floor). The death draw is taken against
 * `population - residentNamedNpcCount(settlement)`, and the result floors at the
 * named count, so the engine starves the NUMBER and never the cast. Nothing here
 * reads or writes an npc roster; it only counts one. The DM's KILL verb remains the
 * only named death.
 *
 * WAVE P2 ADDS THE THIRD AND FOURTH TERMS. `next = pop + births - deaths + arrivals -
 * departures` is the design's §3 line in full, and the two migration terms are owned
 * by demographicsMigration.js, called from this one entry point immediately after the
 * natural step. Births and deaths are what a settlement does to itself; arrivals and
 * departures are what the realm does between settlements, and both halves must land on
 * the same settlementUpdates in one pass or a tick could read its own population two
 * different ways.
 *
 * WHAT P1/P2 DO NOT DO, recorded so nobody re-finds it as a bug:
 *   • NO NEW worldState key. P1 persists nothing at all; P2's transit accounting rides
 *     the EXISTING `spatialLedgers.migration` columns (design §4: zero new ledger
 *     kinds), and the design's `migrationDebt` is deliberately not built, because per
 *     settlement in and out totals are derivable from those columns and a second
 *     accounting surface could only ever drift from the first.
 *   • NO overflow, NO satellite founding, NO promotion response, NO plans. P3 owns all
 *     four, and it asks P2's `competeForDestinations` FIRST.
 *   • NO stressor coupling and NO road mortality. P4.
 *   • NO wizard news. The Herald's demographic lines are P4; the receipt shapes here
 *     are authored honestly now so P4 consumes them rather than re-deriving them.
 *
 * DETERMINISM. The parent pulse rng is already seeded per tick
 * (`<rngSeed>::tick:<n>::<interval>`, pulseKernel.js), so the design's
 * `demographics:<id>` fork key is a distinct stream per settlement PER TICK without
 * embedding the tick a second time. Settlements are visited in codepoint order and
 * each consumes EXACTLY TWO draws from its own fork, births first, deaths second: a
 * settlement skipped for having nobody left consumes none, and because every fork is
 * keyed by its own settlement id, skipping one cannot move another's stream.
 *
 * Pure and headless: no store, no React, no I/O, no clock, no ambient randomness.
 *
 * @enforced-by tests/domain/demographicsKernel.test.js (the step, the seam, the fenced
 *   dormancy golden), tests/domain/demographicsCure.test.js (the 300-year plateau and
 *   its two reverted negative controls)
 */

import { formatCount } from '../formatNumber.js';
import { residentNamedNpcCount } from './npcReplacement.js';
import { advanceDemographicMigration } from './demographicsMigration.js';
import {
  demographicsActive,
  demographicRates,
  densityCeilingOf,
  effectiveBoundOf,
  foodCapacityOf,
  foodDeficit01Of,
  integerize,
  pressureOf,
} from './demographicsRates.js';

/** @typedef {import('./demographicsRates.js').DemoSettlement} DemoSettlement */
/** @typedef {import('./demographicsPushPull.js').DemoCausal} DemoCausal */
/** @typedef {import('./demographicsPushPull.js').DemoPressureIndex} DemoPressureIndex */
/** The pulse snapshot item, with the causal scores wave P2's push drivers read.
 *  @typedef {{ id?: (string|number), name?: string, settlement?: DemoSettlement, causal?: DemoCausal }} DemoSnapItem */
/** @typedef {{ settlements?: DemoSnapItem[] }} DemoSnapshot */
/** @typedef {{ saveId?: (string|number), settlement?: DemoSettlement }} DemoUpdate */
/** @typedef {{ fork?: (k: string) => { random: () => number } }} DemoRng */

/**
 * One settlement's demographic line for this tick. The Herald consumes this in P4;
 * P1 authors the shape honestly so nothing downstream has to re-derive it.
 * @typedef {Object} DemographicReceipt
 * @property {string} id
 * @property {string} kind        always 'demographic_step'
 * @property {number} tick
 * @property {number} before
 * @property {number} after
 * @property {number} births
 * @property {number} deaths
 * @property {number} bound       min(K_food, D_tier)
 * @property {string} binding     'granary' or 'walls'
 * @property {number} foodCapacity
 * @property {number} densityCeiling
 * @property {boolean} foodKnown
 * @property {string} importSource
 * @property {number} arteries
 * @property {number} pressure01
 * @property {number} deficit01
 * @property {string} birthBand
 * @property {string} deathBand
 * @property {number} namedFloor
 * @property {string} line        the in-world sentence (legibility law)
 */

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
/** @param {number} v @returns {number} 4dp, so a receipt compares by value across machines */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/**
 * THE IN-WORLD SENTENCE. Names every term the step used, in the order a person reads
 * them: who, how many, how many born, how many buried, which wall, how close to it.
 * Locale-independent counts (formatCount, never toLocaleString).
 * @param {{ name: string, after: number, births: number, deaths: number,
 *   binding: string, bound: number, pressure01: number, foodKnown: boolean }} f
 * @returns {string}
 */
function demographicLine(f) {
  const wall = !f.foodKnown
    ? `The ground itself holds about ${formatCount(f.bound)} souls`
    : f.binding === 'granary'
      ? `The granaries are the wall at ${formatCount(f.bound)} mouths`
      : `The walls are the wall at ${formatCount(f.bound)} souls`;
  const share = Math.round(f.pressure01 * 100);
  const born = `${formatCount(f.births)} born`;
  const buried = `${formatCount(f.deaths)} buried`;
  return `${f.name} counts ${formatCount(f.after)} souls this week, ${born} and ${buried}. `
    + `${wall}, and the place stands at ${share} percent of it.`;
}

/**
 * @typedef {Object} DemographicAdvanceResult
 * @property {DemoUpdate[]} settlementUpdates
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {DemographicReceipt[]} receipts
 * @property {Array<Record<string, unknown>>} migrationReceipts WAVE P2: the homeostat's
 *   own per-origin and per-destination lines, kept in their own list so the natural
 *   step's receipt vocabulary stays exactly what P1 declared.
 * @property {{ departures: number, arrivals: number, inTransit: number, returned: number,
 *   lost: number, unplaced: number }} accounting WAVE P2, law 4: departures equals
 *   arrivals plus in transit plus returned plus lost, and a pin adds it up.
 * @property {Array<Record<string, unknown>>} newsEntries always empty (P4 owns the Herald)
 */

/** The accounting a dormant or unmoved tick reports. @returns {{ departures: number,
 *  arrivals: number, inTransit: number, returned: number, lost: number, unplaced: number }} */
function stillAccounting() {
  return { departures: 0, arrivals: 0, inTransit: 0, returned: 0, lost: 0, unplaced: 0 };
}

/**
 * ADVANCE THE DEMOGRAPHIC STEP ONE TICK for every settlement in the snapshot that the
 * apply pass can still write.
 *
 * DORMANT (flag absent) ⇒ the SAME references back, immediately.
 *
 * @param {Object} args
 * @param {DemoSnapshot} args.snapshot
 * @param {Record<string, unknown>} args.worldState
 * @param {DemoUpdate[]} args.settlementUpdates
 * @param {DemoRng|null} [args.rng]
 * @param {number} args.tick
 * @param {DemoPressureIndex|null} [args.pIndex] WAVE P2: the pressure index the pulse
 *   already built. Optional and total: absent, the push drivers fall back to the
 *   generation-time causal scores and the threat guard fails closed.
 * @param {string|null} [args.season] WAVE P2: the road season, for the hop pricing.
 * @returns {DemographicAdvanceResult}
 */
export function advanceDemographics({ snapshot, worldState, settlementUpdates, rng, tick, pIndex, season }) {
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // ── DORMANCY GATE: flag absent ⇒ an immediate no-op. No fork, no key, no clone. ──
  if (!demographicsActive(worldState)) {
    return {
      worldState,
      settlementUpdates: updates,
      changed: false,
      receipts: [],
      migrationReceipts: [],
      accounting: stillAccounting(),
      newsEntries: [],
    };
  }

  const items = Array.isArray(asObject(snapshot).settlements)
    ? /** @type {DemoSnapItem[]} */ (asObject(snapshot).settlements)
    : [];
  /** @type {Map<string, number>} */
  const updateIndex = new Map();
  updates.forEach((u, i) => updateIndex.set(String(u.saveId), i));
  /** @type {Map<string, string>} */
  const nameById = new Map(items.map((it) => [String(it.id), String(it.name || it.id)]));

  let nextUpdates = updates;
  let cloned = false;
  const ensureCloned = () => { if (!cloned) { nextUpdates = updates.slice(); cloned = true; } };

  /** @type {DemographicReceipt[]} */
  const receipts = [];
  const stepTick = Math.max(0, Math.round(num(tick, 0)));

  for (const id of items.map((it) => String(it.id)).sort(codepoint)) {
    const ui = updateIndex.get(id);
    if (ui === undefined) continue;                       // nothing to write into
    const settlement = /** @type {DemoSettlement} */ (asObject(nextUpdates[ui]).settlement || {});
    const raw = asObject(settlement);
    // A remnant is frozen history: the first-class terminal lane owns it, unchanged.
    if (raw.lifecycleStatus || asObject(raw.config).lifecycleStatus) continue;
    const before = Math.max(0, Math.round(num(settlement.population, 0)));
    // An empty settlement is the zombie cure's territory, not demography's: births
    // against nobody are zero anyway, and forking here would spend a stream to
    // compute two zeroes. Skipping is stream-safe because every fork is keyed by its
    // own settlement id.
    if (before <= 0) continue;

    const named = residentNamedNpcCount(settlement);
    const food = foodCapacityOf(settlement, worldState, id);
    const bound = effectiveBoundOf(food, densityCeilingOf(settlement));
    const pressure01 = pressureOf(before, bound.bound);
    const deficit01 = foodDeficit01Of(settlement);
    const rates = demographicRates({ settlement, pressure01, deficit01 });

    // ONE fork per settlement per tick; EXACTLY TWO draws, births then deaths.
    const fork = rng && typeof rng.fork === 'function' ? rng.fork(`demographics:${id}`) : null;
    const draw = () => (fork && typeof fork.random === 'function' ? fork.random() : 1);
    const births = integerize(before * rates.birth01, draw());
    // THE H3 FLOOR COMPOSES STRUCTURALLY: the draw is taken against the anonymous
    // pool, so the cast is never in the lottery.
    const pool = Math.max(0, before - named);
    const deaths = Math.min(pool, integerize(pool * rates.death01, draw()));
    const after = Math.max(named, before + births - deaths);

    if (births === 0 && deaths === 0) continue;           // a still week writes nothing

    const name = nameById.get(id) || String(settlement.name || id);
    receipts.push({
      id,
      kind: 'demographic_step',
      tick: stepTick,
      before,
      after,
      births,
      deaths,
      bound: bound.bound,
      binding: bound.binding,
      foodCapacity: bound.foodCapacity,
      densityCeiling: bound.densityCeiling,
      foodKnown: bound.foodKnown,
      importSource: food.importSource,
      arteries: food.arteries,
      pressure01: round4(pressure01),
      deficit01: round4(deficit01),
      birthBand: rates.birthBand,
      deathBand: rates.deathBand,
      namedFloor: named,
      line: demographicLine({
        name, after, births, deaths,
        binding: bound.binding, bound: bound.bound, pressure01, foodKnown: bound.foodKnown,
      }),
    });

    if (after === before) continue;                        // births matched deaths exactly
    ensureCloned();
    const live = /** @type {DemoSettlement} */ (asObject(nextUpdates[ui]).settlement || {});
    const history = Array.isArray(asObject(live).populationHistory)
      ? /** @type {Array<Record<string, unknown>>} */ (asObject(live).populationHistory)
      : [];
    nextUpdates[ui] = {
      ...nextUpdates[ui],
      settlement: {
        ...live,
        population: after,
        populationHistory: [
          ...history.slice(-11),
          {
            tick: stepTick,
            delta: after - before,
            population: after,
            reason: `${formatCount(births)} born and ${formatCount(deaths)} buried.`,
            outcomeId: `demographics.${id}.${stepTick}`,
          },
        ],
      },
    };
  }

  // ── WAVE P2, THE HOMEOSTAT (design §4). Arrivals and departures, on the SAME
  // settlementUpdates the natural step just wrote, so a tick can never hold two
  // readings of one settlement's head count. Runs after the rates because a column is
  // drawn against the population the births and deaths have already settled. ──
  const moved = advanceDemographicMigration({
    snapshot: /** @type {import('./demographicsMigration.js').MigSnapshot} */ (
      /** @type {unknown} */ (snapshot)),
    worldState,
    settlementUpdates: /** @type {import('./demographicsMigration.js').MigUpdate[]} */ (
      /** @type {unknown} */ (nextUpdates)),
    tick: stepTick,
    pIndex: pIndex || null,
    season: season || null,
  });

  return {
    worldState: moved.worldState,
    settlementUpdates: /** @type {DemoUpdate[]} */ (/** @type {unknown} */ (moved.settlementUpdates)),
    changed: cloned || moved.changed,
    receipts,
    migrationReceipts: moved.receipts,
    accounting: moved.accounting,
    newsEntries: [],
  };
}
