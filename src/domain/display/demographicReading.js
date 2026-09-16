/**
 * demographicReading.js — CAPACITY C2, THE READING.
 *
 * THE QUESTION THIS LEAF ANSWERS, IN THE WORDS A PERSON WOULD USE: how much room does
 * this town have left, and what runs out first?
 *
 * WHY IT EXISTS BESIDE THE CROWDING LINE RATHER THAN INSTEAD OF IT. The Herald's crowding
 * line is a CROSSING: it fires the week a settlement grows into its bound, and then it is
 * silent, correctly, possibly for decades. A reader at a table does not arrive on that
 * week. They arrive at year eleven and ask the question above, and a crossing-only surface
 * has nothing to tell them. So this is the STATE surface: it answers at ANY year, without
 * waiting for anything to happen.
 *
 * ⭐ THE GAME-GRADE LAW IS THE WHOLE POINT OF THE FILE. The engine knows a pressure ratio,
 * a binding kind and five band words. None of those is an answer to the question. What
 * reaches the surface is ONE authored sentence naming what runs out first and what that
 * costs, plus four chips carrying authored labels. A ratio a DM cannot read is not a
 * feature.
 *
 * ⛔ AND NO NUMBER, RATIO OR LADDER RUNG REACHES THE SURFACE. `pressure01` stays DERIVED
 * and is never persisted and never printed; the twelve sentences and the fourteen chip
 * labels are AUTHORED, never composed from a number. FINITE SEMANTICS: this leaf mints no
 * ladder of its own. Every band word it reports is a member of a vocabulary that already
 * existed, and the composition of those ladders IS the view.
 *
 * DARK BY CONSTRUCTION. The flag is read once, first, through the kernel's own
 * `demographicsActive`. A dark world reads `null`, and a surface rendering a dark
 * mechanism must be honest ABSENCE rather than a hedged sentence.
 *
 * INERT, NEVER A CRASH (the seat-leaf law). An absent world, an absent settlement, a
 * garbage ledger and a settlement with no derivable bound all read `null`. A display leaf
 * that throws takes a tab down with it.
 *
 * Pure leaf: no store, no React, no clock, no randomness, no I/O, no writes.
 *
 * @enforced-by tests/domain/demographicReading.test.js
 */

import {
  BINDING_KINDS,
  BIRTH_BAND_WORDS,
  DEATH_BAND_WORDS,
  crisisStress01,
  demographicRates,
  demographicsActive,
  foodDeficit01Of,
  pressureOf,
} from '../worldPulse/demographicsRates.js';
import {
  FOOD_FLOW_BANDS,
  RESERVE_BANDS,
  URBAN_LOAD_BANDS,
  demographicReadings,
} from '../worldPulse/demographicsPushPull.js';
import { OVERFLOW_BANDS, overflowBandOf } from '../worldPulse/demographicsResponses.js';

/**
 * THE PLACEMENT SENTINEL, and an honest note about what it can and cannot prove.
 *
 * The whole car's byte argument is that this leaf rides the lazy Outlook chunk and never
 * the first-paint closure, and a sentinel is how that argument stops being a claim and
 * becomes a grep.
 *
 * ⚠ BUT A DEAD STANDALONE CONST CANNOT CARRY THAT GUARD, and the estate has the receipt:
 * `AFFORDANCE_MANIFEST_LAZY_SENTINEL` is tree-shaken out of every app chunk, so its
 * absence-from-first-paint arm proves nothing at all. This constant has the same shape and
 * would have the same problem. So the BUILD arms in `tests/build/vendorPdfLazy.test.js`
 * key on a LIVE authored sentence from the table below instead — a string a lazy consumer
 * genuinely reads, which therefore survives into the lazy chunk — and they assert BOTH its
 * absence from the entry closure AND its presence somewhere, which is the real non-vacuity
 * check. This export stays as the NAMED handle the domain test pins.
 */
export const DEMOGRAPHIC_READING_SENTINEL = 'demographic-reading-lazy-leaf-sentinel';

/** The live authored fragment the build-time placement arms grep for. It is a substring of
 *  four cells of OCCUPANCY_SENTENCES, so it cannot be tree-shaken while the table is read. */
export const DEMOGRAPHIC_READING_LIVE_MARK = 'Nobody has counted the harvest';

/**
 * @typedef {Object} DemographicReadingView
 * @property {string} occupancy  a member of OVERFLOW_BANDS
 * @property {string} binding    a member of BINDING_KINDS
 * @property {boolean} foodKnown
 * @property {string} foodFlow   a member of FOOD_FLOW_BANDS
 * @property {string} reserve    a member of RESERVE_BANDS
 * @property {string} urbanLoad  a member of URBAN_LOAD_BANDS
 * @property {string} births     a member of BIRTH_BAND_WORDS
 * @property {string} deaths     a member of DEATH_BAND_WORDS
 * @property {string} sentence   authored; no digit, ratio, ladder rung or id
 */

/**
 * THE TWELVE AUTHORED SENTENCES, keyed `${occupancy}|${binding}|${foodKnown}`.
 *
 * Sixteen keys, twelve sentences: when the harvest was never counted the two binding
 * values collapse, because a town whose food is unmeasured cannot honestly be told its
 * granaries are the wall. UNKNOWN FOOD IS NEVER NARRATED AS FAMINE.
 *
 * ⛔ NO RUNG OF THE OVERFLOW LADDER APPEARS IN ANY SENTENCE, and that is why the town
 * GROWS INTO its limit rather than FILLING, and why it has more mouths than its fields
 * feed rather than being PRESSED. The engine's four words for how full a place is are its
 * own; a reader must meet the consequence instead.
 * @type {Readonly<Record<string, string>>}
 */
export const OCCUPANCY_SENTENCES = Object.freeze({
  'easy|granary|true': 'There is room to grow here. The fields bring in far more than the town eats, and there is ground left to build on.',
  'easy|walls|true': 'There is room to grow here. The fields are generous, and it is the ground inside the walls that will run out first.',
  'easy|granary|false': 'There is room to grow here. Nobody has counted the harvest, but the ground the town stands on is a long way from full.',
  'easy|walls|false': 'There is room to grow here. Nobody has counted the harvest, but the ground the town stands on is a long way from full.',

  'filling|granary|true': 'The town is growing into what its fields can feed. The harvest is near its limit now, and fewer children are born each year.',
  'filling|walls|true': 'The town is growing into the ground inside its walls. There is a little left to build on, and fewer children are born each year.',
  'filling|granary|false': 'The town is growing into the ground it stands on. Nobody has counted the harvest, and the room left is running out.',
  'filling|walls|false': 'The town is growing into the ground it stands on. Nobody has counted the harvest, and the room left is running out.',

  'pressed|granary|true': 'The town has more mouths than its fields feed comfortably. The shortfall is paid in hard winters, and families are leaving.',
  'pressed|walls|true': 'The town has no ground left inside its walls to build on. Families are living on top of one another, and some are leaving.',
  'pressed|granary|false': 'The town has outgrown the ground it stands on. Families are living on top of one another, and some are leaving.',
  'pressed|walls|false': 'The town has outgrown the ground it stands on. Families are living on top of one another, and some are leaving.',

  'overflowing|granary|true': 'The town has more mouths than its fields can feed at all. Some will leave for better ground, and the lean years will thin the rest.',
  'overflowing|walls|true': 'The town has spilled past the ground its walls enclose. Some will leave for better ground, and the rest will crowd into what there is.',
  'overflowing|granary|false': 'The town has grown past what the ground beneath it can hold. Some will leave, and the rest will make do with less each year.',
  'overflowing|walls|false': 'The town has grown past what the ground beneath it can hold. Some will leave, and the rest will make do with less each year.',
});

/**
 * THE CHIP LABELS. Four chips ride beside the sentence, and each renders an AUTHORED
 * phrase rather than the band word behind it.
 *
 * ⛔ WHY A LABEL AND NOT THE TOKEN. A chip reading `walls` or `pressed` beside a sentence
 * is a label with its noun missing: the reader gets a word the engine chose for itself and
 * has to guess what it is a word ABOUT. Every value below is also written so it does not
 * merely avoid EQUALLING its token but avoids CONTAINING it, so a substring arm can hold
 * the law without a carve-out.
 * @type {Readonly<Record<string, string>>}
 */
export const CHIP_LABELS = Object.freeze({
  // occupancy — how full
  easy: 'room to grow',
  filling: 'growing into its limit',
  pressed: 'running out of room',
  overflowing: 'past what it can hold',
  // binding — which wall
  granary: 'bound by its granaries',
  walls: 'bound by its ground',
  // foodFlow — what the fields do
  famished: 'the fields cannot feed it',
  short: 'the fields do not quite keep up',
  adequate: 'the fields keep up',
  ample: 'the fields are generous',
  // urbanLoad — how tightly it sits on the land
  open: 'ground to spare',
  settled: 'built up',
  packed: 'crowded quarters',
  overspilled: 'spilling beyond its bounds',
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * HOW MUCH ROOM DOES THIS TOWN HAVE LEFT?
 *
 * @param {{ settlement?: unknown, worldState?: unknown, settlementId?: unknown }} input
 * @returns {DemographicReadingView|null} null when the mechanism is dark, or when there is
 *   nothing readable here
 */
export function demographicReadingViewOf(input) {
  const args = asObject(input);
  /** The world, narrowed ONCE at the boundary rather than cast at each of its three
   *  read sites. A non-object world is `null`, which every read below already handles.
   *  @type {{ simulationRules?: unknown, spatialLedgers?: unknown }|null} */
  const worldState = args.worldState && typeof args.worldState === 'object'
    ? /** @type {{ simulationRules?: unknown, spatialLedgers?: unknown }} */ (args.worldState)
    : null;
  // THE DOOR, READ FIRST AND ONCE. A dark world has no reading, and the tab renders
  // byte-identically to a tree without this leaf in it.
  if (!demographicsActive(worldState)) return null;
  const settlement = asObject(args.settlement);
  // A READING NEEDS A REAL HEAD COUNT, AND THIS GUARD IS A MEASURED CURE RATHER THAN
  // DEFENSIVE HABIT. Without it `{ population: 'many', economicState: 'gone' }` reads as a
  // confident "there is room to grow here": the head count falls back to zero, the tier
  // falls back to a default density ceiling, and the view reports that fiction in an
  // authored sentence. A false reading stated confidently is worse than no reading, so a
  // settlement whose population is not a real count is not readable at all.
  const population = settlement.population;
  if (typeof population !== 'number' || !Number.isFinite(population) || population < 0) return null;
  const settlementId = args.settlementId == null ? '' : String(args.settlementId);

  const readings = demographicReadings(settlement, worldState, settlementId);
  // A settlement with no derivable bound has nothing to say about its room. INERT.
  if (!(readings.bound > 0)) return null;

  const pressure01 = pressureOf(readings.population, readings.bound);
  const occupancy = overflowBandOf(pressure01);
  const rates = demographicRates({
    settlement: /** @type {Parameters<typeof demographicRates>[0]['settlement']} */ (
      /** @type {unknown} */ (settlement)
    ),
    pressure01,
    deficit01: foodDeficit01Of(/** @type {Parameters<typeof foodDeficit01Of>[0]} */ (
      /** @type {unknown} */ (settlement)
    )),
    crisis01: crisisStress01({ settlement, worldState, settlementId }),
  });

  const binding = BINDING_KINDS.includes(String(readings.binding))
    ? String(readings.binding)
    : BINDING_KINDS[0];
  const sentence = OCCUPANCY_SENTENCES[`${occupancy}|${binding}|${readings.foodKnown === true}`];
  // A composition that cannot find its authored cell is a defect in the table, not a
  // licence to compose one: the view refuses rather than inventing a sentence.
  if (typeof sentence !== 'string' || sentence === '') return null;

  return Object.freeze({
    occupancy,
    binding,
    foodKnown: readings.foodKnown === true,
    foodFlow: String(readings.foodFlowBand),
    reserve: String(readings.reserveBand),
    urbanLoad: String(readings.urbanLoadBand),
    births: String(rates.birthBand),
    deaths: String(rates.deathBand),
    sentence,
  });
}

/**
 * The four chips the Room to Grow section renders, in reading order: how full, which wall,
 * what the fields do, how tightly it sits on the land. Each carries its AUTHORED label.
 * @param {DemographicReadingView|null|undefined} view
 * @returns {ReadonlyArray<{ key: string, label: string }>} empty for a dark or absent view
 */
export function readingChipsOf(view) {
  const v = asObject(view);
  if (typeof v.sentence !== 'string') return Object.freeze([]);
  const keys = [String(v.occupancy), String(v.binding), String(v.foodFlow), String(v.urbanLoad)];
  return Object.freeze(keys
    .filter((key) => typeof CHIP_LABELS[key] === 'string')
    .map((key) => Object.freeze({ key, label: CHIP_LABELS[key] })));
}

/** The vocabularies this view speaks, for a walker that wants to check them without
 *  re-importing four modules. Every one is a ladder that already existed.
 *  @type {Readonly<Record<string, ReadonlyArray<string>>>} */
export const READING_VOCABULARIES = Object.freeze({
  occupancy: OVERFLOW_BANDS,
  binding: BINDING_KINDS,
  foodFlow: FOOD_FLOW_BANDS,
  reserve: RESERVE_BANDS,
  urbanLoad: URBAN_LOAD_BANDS,
  births: BIRTH_BAND_WORDS,
  deaths: DEATH_BAND_WORDS,
});
