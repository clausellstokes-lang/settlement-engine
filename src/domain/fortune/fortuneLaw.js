/**
 * fortuneLaw.js — THE FORTUNE LAW (FS5): the fourth birth law, and the ONE reader every later unit
 * of the fortune build asks "was this world born under the fortune law?" (FORTUNE-1, unit U1).
 *
 * The law this gates is FORTUNE-1's rule (the proposal's section 3, items 1 to 8, ruled by the
 * seventh chair on 2026-11-20 at 10:33 UTC): a place's fortune (`prosperity.js`) and its public
 * standing (`factionDynamics.js :: computePublicLegitimacy`) are read against its OWN SIZE rather
 * than against a ladder that pays a place for being large. Version 2 is that law; version 1 is
 * every world before it. Nothing the law changes lives in this file except its one tuning table:
 * it answers which law a world was born under, and every behaviour of the build branches on that
 * answer through `isSizeRelativeFortune`, the one predicate U2 and U3 call.
 *
 * THE IDIOM IS THE SEAT LAW'S (`src/domain/seat/seatLaw.js`, itself the living-content law's), and
 * its four properties hold here in these words:
 *
 *   1. DORMANT BY DEFAULT, AND THE DEFAULT WRITES NOTHING. A config with no `_fortuneLawVersion`
 *      is a law-1 world, and a law-1 world is byte-identical to one generated before this file
 *      existed. While the dial sits at the default, `newSettlementFortuneLaw()` returns an EMPTY
 *      object, so the create boundary spreads not one byte.
 *   2. A CLOSED MEMBERSHIP READ THAT FAILS CLOSED. Only the NUMBER 2 selects anything; absent,
 *      garbage, a string (even '2'), NaN, an unshipped v3 all read as 1. A marker is minted as a
 *      number and nothing in the estate writes it as a string, so a string is a foreign value and
 *      is refused rather than interpreted.
 *   3. NO MIGRATION, DELIBERATELY. A WORLD BORN BEFORE THE LIGHT NEVER CHANGES: it never acquires
 *      this law by upgrade or by any stamp on a read, save, load, regen, undo or import path. Its
 *      law travels in its own persisted `config` (echoed on `_config`), so every replay obeys the
 *      law it was BORN under, and while the dial is dark zero bytes of any born town move.
 *   4. THE DIAL IS ONE LINE. `NEW_SETTLEMENT_FORTUNE_LAW_VERSION` is the only place a new world's
 *      fortune law is chosen, and the mint reads it and nothing else, so lighting it and reverting
 *      it are the same one-line act.
 *
 * ⛔ THE LAW IS DARK, AND LIGHTING IT IS THE OWNER'S WORD, NOT A LANE'S. The build lands DARK (the
 * chair's rulings of 2026-11-20 10:33 UTC): every unit proves its behaviour on its own fixture arm
 * that sets `_fortuneLawVersion: 2` explicitly AFTER `birthConfig`, and the light comes on the
 * owner's word alone. A lit dial would move every born pin of every later unit at once.
 *
 * ⛔ THE FORTUNE LAW IS NEVER LIT BEFORE THE SEAT'S LAW (`src/domain/seat/seatLaw.js`, the seat
 * lane): under the old contest code a weaker incumbent in a crisis-born large place amplifies a
 * fault the seat's law cures (the chair's ruling 3 of 2026-11-20 10:33 UTC).
 *
 * ⛔ THE VERSION NUMBERS ARE SPELLED ONCE, IN `FORTUNE_LAW_VERSIONS`, AND THE NAMED VERSIONS ARE
 * READ FROM IT. They are vocabulary, not tuning: reading the two names off the frozen list keeps
 * one spelling of each number and adds no named-constant row to `tests/lint/.tuning-inventory.json`.
 *
 * ⛔ THE LAW'S FIGURES LIVE IN ONE REGISTERED TABLE, `FORTUNE_LAW_TUNING`, AND EVERY ONE IS A
 * DRAFT. They are the proposal's sections 10 and 15, registered DRAFT in
 * `tests/lint/.tuning-register.json` and signed by none: a tuning value is the owner's. The
 * standing points live here (not in `factionDynamics.js`) so the chair's second column (Prosperous
 * 24, and Wealthy 25 to keep the ladder's order) can change before the signature with no second
 * unit.
 *
 * ⛔ IT IMPORTS NOTHING. It is a dependency-free leaf for the seat law's two reasons: no cycle can
 * form through it, and nothing rides behind it into whichever chunk its importer lands in. Its one
 * importer on the generation side today is the create boundary
 * (`src/domain/density/densityCreateBoundary.js :: birthConfig`).
 *
 * Pure. No RNG, no store, no React, no wall clock, no module state.
 *
 * @guarded-by tests/domain/fortuneLawWiring.test.js (the arms of U1) and
 *   tests/lint/densityCreateBoundary.walker.test.js (`GENERATION_LAWS`, `MINT_SYMBOLS`,
 *   `MINT_HOMES`), and tests/lint/tuningRegister.walker.test.js (`FORTUNE_LAW_TUNING`, DRAFT).
 */

/** The config key the law rides on. Underscore-prefixed like `_seed`: a resolved generation
 *  input, carried on the persisted `settlement.config` and its `_config` echo. */
export const FORTUNE_LAW_CONFIG_KEY = '_fortuneLawVersion';

/** The fortune-law versions this build can generate under: 1 is the dormant default (absent
 *  means 1), 2 is the fortune law (fortune and standing read against the place's own size).
 *  @type {ReadonlyArray<number>} */
export const FORTUNE_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dormant) fortune-law version: today's fortune, unchanged. */
export const DEFAULT_FORTUNE_LAW_VERSION = FORTUNE_LAW_VERSIONS[0];

/** The version the fortune law (fortune and standing relative to the place's size) runs under. */
export const SIZE_RELATIVE_FORTUNE_LAW_VERSION = FORTUNE_LAW_VERSIONS[1];

/** ⭐ THE ONE DIAL — the fortune law a NEWLY-created world mints under. AT THE DEFAULT: lighting
 *  it is the owner's word, never before the seat's law, and reverting is the same one line.
 *  The `@type {number}` is the living-content dial's earned lesson (TS2367 under the strict
 *  kernel the day that dial was lit): a dial's type is the SPACE of versions, never today's
 *  setting, so the mint's dormant comparison stays reachable when the dial moves.
 *  @type {number} */
export const NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION;

/**
 * ⭐ THE FORTUNE LAW'S ONE TUNING TABLE. EVERY VALUE IS A DRAFT, signed by none (the proposal's
 * sections 10 and 15; registered DRAFT in `tests/lint/.tuning-register.json`). Read only under
 * the law (version 2); a law-1 world never reads it.
 *
 *   developmentFigure — replaces the tier bonus (0, 0, 0, 1, 1, 2) at every size: the pooled
 *     mean of the terms the rule removes, measured on the derivation set (seeds hxe).
 *   magicScale        — replaces the magic tier scale (0, 0, 0.3, 0.6, 1.0, 1.4): the town's,
 *     the middle of the old ladder, at every size.
 *   depthExpectation  — each size's MEASURED median count of trades (seeds hxe), against which
 *     the depth term keeps the code's own thin (0.75) and deep (1.3) ratios.
 *   standing.prosperityPoints   — the standing term by the size-relative label. EQUAL TO TODAY'S
 *     `PROSPERITY_CONTRIB` ON PURPOSE: the chair's second column (Prosperous 24) changes HERE.
 *   standing.defenceUsualRange  — each size's usual [low, high] defence band (p10 to p90, hxe).
 *   standing.defencePointsPerBand — the points a band above or below that range is worth,
 *   standing.defenceBound         — within plus or minus this bound, before the size's existing
 *     scale (`legitimacyDefScale`, unchanged) weighs it.
 *   standing.safetyCalmLadder   — the calm safety labels LOWEST FIRST (`safetyProfile.js`'s five
 *     base labels; no exported list of them exists, so the leaf holds it, guarded by
 *     `tests/generators/fortuneLawSafety.test.js`). A label off it keeps today's points.
 *   standing.safetyUsualRange   — each size's usual [low, high] band of that ladder (p10 to p90,
 *     hxe; U5-PROPOSAL section 3): inside it a label is worth 0, outside it its own points less
 *     those of the range's nearest band (FORTUNE-3 U5s, the chair's ruling of 15:58 UTC).
 *   THE MERITS OF RULE (FORTUNE-3 U5a; U5-PROPOSAL sections 4, 5 and 10; the chair's condition 1 and its rulings of
 *   2026-11-20 19:33 and 19:38 UTC: a merit claims an OUTCOME and reads only what every shared read serves; read by
 *   `src/domain/fortune/fortuneMerits.js`, the one home of the predicates the birth and the page share):
 *   standing.meritPoints          — the points one counted merit adds, only upward, only at Tolerated or better (the
 *     gate is READ from `LEGITIMACY_CUTS.tolerated` by the predicates, never copied here).
 *   standing.weatheredWithinYears — a catastrophe weathered within this many years (a generation) is a merit.
 *   standing.endorsedMinReasons   — Endorsed never stands on fewer reasons than this (a reason: a merit, or a positive
 *     term of the sum).
 *   standing.lastingAgeBySize     — the second merit, A PLACE THAT HAS LASTED (FORTUNE-7 U7; the chair's decision E32 of
 *     2026-11-22 04:51 UTC, on the owner's word "build it"): a place whose `history.age` is at or above its own size's
 *     figure. Each is the p90 of `history.age` at that size (nearest rank, `ceil(0.9·150) − 1`, 150 visitor births a
 *     size; FORTUNE-4 `measures/bands/BANDS.md`, re-measured unchanged by FORTUNE-7 `measures/lasting/AGES.md`). IN PLAIN
 *     WORDS, for the owner's signing: a hamlet's lasting age (108) is below a thorp's (269) because the age table draws a
 *     hamlet's age from 30 to 120 years and a thorp's from 15 to 300 (`src/data/historyData.js :: AGE_BY_TIER`). That is
 *     a property of the age's own generator, told to the chair, not cured in this unit.
 *   VOCABULARY, NOT TUNING (read, not chosen): standing.weatheredSeverity (the history's grade of a catastrophe) and
 *   standing.rulerTroubleKinds (the tension types that concern the ruler). NO capture rung, no governing power's name,
 *   kind or house, no card's trait: the chair barred each (the rung is DM-only; memberships ride per row by the veil).
 */
export const FORTUNE_LAW_TUNING = Object.freeze({
  developmentFigure: 1,
  magicScale: 0.6,
  depthExpectation: Object.freeze({ thorp: 3, hamlet: 5, village: 8, town: 20, city: 42, metropolis: 53 }),
  standing: Object.freeze({
    prosperityPoints: Object.freeze({
      Struggling: -20, Subsistence: -20, Poor: -10, Moderate: 0, Comfortable: 8, Prosperous: 15, Wealthy: 20,
    }),
    defenceUsualRange: Object.freeze({
      thorp: Object.freeze(['Vulnerable', 'Vulnerable']),
      hamlet: Object.freeze(['Undefended', 'Vulnerable']),
      village: Object.freeze(['Undefended', 'Vulnerable']),
      town: Object.freeze(['Lightly Defended', 'Defensible']),
      city: Object.freeze(['Well-Defended', 'Fortress']),
      metropolis: Object.freeze(['Well-Defended', 'Fortress']),
    }),
    defencePointsPerBand: 4,
    defenceBound: 10,
    safetyCalmLadder: Object.freeze(['Dangerous', 'Unsafe', 'Moderate', 'Safe', 'Very Safe']),
    safetyUsualRange: Object.freeze({
      thorp: Object.freeze(['Moderate', 'Moderate']),
      hamlet: Object.freeze(['Moderate', 'Moderate']),
      village: Object.freeze(['Moderate', 'Moderate']),
      town: Object.freeze(['Moderate', 'Moderate']),
      city: Object.freeze(['Unsafe', 'Moderate']),
      metropolis: Object.freeze(['Moderate', 'Moderate']),
    }),
    meritPoints: 10,
    weatheredWithinYears: 40,
    endorsedMinReasons: 2,
    lastingAgeBySize: Object.freeze({ thorp: 269, hamlet: 108, village: 225, town: 276, city: 441, metropolis: 731 }),
    weatheredSeverity: 'catastrophic',
    rulerTroubleKinds: Object.freeze(['succession_crisis', 'corruption_scandal', 'tyranny', 'popular_uprising', 'legitimacy_crisis', 'leadership_vacuum']),
  }),
});

/**
 * The fortune-law version a value selects. Only an enabled NUMBER that is not the default selects
 * anything; everything else — absent, a string, NaN, an unshipped version — is the default.
 *
 * @param {unknown} value
 * @returns {number}
 */
export function readFortuneLawVersion(value) {
  return typeof value === 'number'
    && FORTUNE_LAW_VERSIONS.includes(value)
    && value !== DEFAULT_FORTUNE_LAW_VERSION
    ? value
    : DEFAULT_FORTUNE_LAW_VERSION;
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isBag = (value) => value !== null && typeof value === 'object';

/**
 * The fortune-law version a world obeys, read from a config or from a settlement that carries one.
 *
 * The bag is chosen in this order: the value itself when it carries the key (a config); else the
 * settlement's own `config` (read FIRST, the order `regenSection` reads a world's law in); else
 * its `_config` echo. Anything that is not a bag reads as the default.
 *
 * ⚠ THIS READS THE WORLD AND NOTHING ELSE, ON PURPOSE. It never falls back to
 * `NEW_SETTLEMENT_FORTUNE_LAW_VERSION`: a world born before the law carries no marker, and a
 * dial-derived fallback would silently re-birth every such world the day the dial is lit.
 *
 * @param {unknown} configOrSettlement
 * @returns {number}
 */
export function resolveFortuneLawVersion(configOrSettlement) {
  if (!isBag(configOrSettlement)) return DEFAULT_FORTUNE_LAW_VERSION;
  if (Object.hasOwn(configOrSettlement, FORTUNE_LAW_CONFIG_KEY)) {
    return readFortuneLawVersion(configOrSettlement[FORTUNE_LAW_CONFIG_KEY]);
  }
  const { config, _config: echo } = configOrSettlement;
  const bag = isBag(config) ? config : isBag(echo) ? echo : null;
  return readFortuneLawVersion(bag?.[FORTUNE_LAW_CONFIG_KEY]);
}

/** Was this world born under the fortune law (fortune and standing read against its own size)?
 *  The one predicate U2 and U3 call.
 *  @param {unknown} configOrSettlement @returns {boolean} */
export function isSizeRelativeFortune(configOrSettlement) {
  return resolveFortuneLawVersion(configOrSettlement) === SIZE_RELATIVE_FORTUNE_LAW_VERSION;
}

/**
 * The config fragment a NEWLY-created world is minted with, spread into the fresh config by the
 * create boundary (`densityCreateBoundary.js :: birthConfig`), and nowhere else.
 *
 * Returns an EMPTY object while the dial sits at the default, so the boundary calls it
 * unconditionally and writes not one byte; the day the dial is lit it returns the marker, with no
 * second edit at the call site.
 *
 * @returns {Record<string, number>}
 */
export function newSettlementFortuneLaw() {
  return NEW_SETTLEMENT_FORTUNE_LAW_VERSION === DEFAULT_FORTUNE_LAW_VERSION
    ? {}
    : { [FORTUNE_LAW_CONFIG_KEY]: NEW_SETTLEMENT_FORTUNE_LAW_VERSION };
}
