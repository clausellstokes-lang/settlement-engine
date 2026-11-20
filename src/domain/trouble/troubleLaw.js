/**
 * troubleLaw.js — THE TROUBLE LAW: which troubles a place is born with, weighted by how much of a
 * thing the place holds rather than by whether it holds any (lane KINDS-1, unit K1), and the ONE
 * reader `historyGenerator.js :: buildHistoricalEvent` asks "was this world born under the weighted
 * trouble law?".
 *
 * THE FAULT IT CURES (the chair's prompt KINDS-1.txt, measured by K0 on 900 visitor births): three
 * fixed numbers in `buildHistoricalEvent` read only whether a thing is PRESENT, never how much of it
 * there is — (a) a crime wave on a coin (`_rng() > 0.5`) wherever any criminal institution stands;
 * (b) three fill picks in ten swapped for the guild conflict (`_rng() > 0.7`) wherever any guild
 * stands; (c) a thorp, hamlet or village with no crisis ALWAYS takes a crime wave where an
 * institution's name holds fence, smuggl, bandit or outlaw. So half of cities carry a guild conflict
 * and nearly half a crime wave. Version 2 turns the three numbers into WEIGHTS that read how much of
 * the thing is there; version 1 is TODAY'S THREE FIXED NUMBERS, BYTE FOR BYTE.
 *
 * THE OWNER'S TWO RULES, VERBATIM, which bind every figure below:
 *
 *   "culture only shifts the weight of RNG, never determines it by itself. It goes with the other considered factors."
 *
 *   "A calm town should be as it currently is… Don't invent drama capitalize on what's already there if it's there. Sometimes a calm place is precisely what's needed… We are not creating the campaign."
 *
 * So no read alone sets a chance to 0 or to 1 (every row has 0 < floor <= ceiling < 1), and law 2
 * only LOWERS a chance where a place holds little of the thing: every ceiling is today's number or
 * less. The number of troubles a place is asked for, the crisis-mapped trouble, the scarcity add,
 * every admission and truth check, the fill's flat pick and the order of the list are untouched.
 *
 * THE IDIOM IS THE FORTUNE LAW'S (`src/domain/fortune/fortuneLaw.js` on the fortune lane, itself the
 * seat and living-content laws'), and its four properties hold here in these words:
 *
 *   1. DARK BY DEFAULT, AND THE DEFAULT WRITES NOTHING. A config with no `_troubleLawVersion` is a
 *      law-1 world, and a law-1 world is byte-identical to one generated before this file existed.
 *      While the dial sits at the default, `newSettlementTroubleLaw()` returns an EMPTY object, so the
 *      create boundary spreads not one byte.
 *   2. A CLOSED MEMBERSHIP READ THAT FAILS CLOSED. Only the NUMBER 2 selects anything; absent,
 *      garbage, a string (even '2'), NaN, an unshipped v3 all read as 1.
 *   3. NO MIGRATION, DELIBERATELY. A WORLD BORN BEFORE THE LIGHT NEVER CHANGES: a saved place, and any
 *      config without the key or with 1, reads law 1 for ever. It never acquires this law by upgrade
 *      or by any stamp on a read, save, load, regen, undo or import path; its law travels in its own
 *      persisted `config` (echoed on `_config`).
 *   4. THE DIAL IS ONE LINE. `NEW_SETTLEMENT_TROUBLE_LAW_VERSION` is the only place a new world's
 *      trouble law is chosen, and the mint reads it and nothing else.
 *
 * ⛔ THE LAW IS DARK, AND LIGHTING IT IS THE OWNER'S WORD, NOT A LANE'S (the chair's one unit at the
 * close). Every proof of law 2 sets `_troubleLawVersion: 2` explicitly AFTER `birthConfig`, in a test
 * or in the lane's instrument, never as a default under `src/`.
 *
 * ⛔ THE VERSION NUMBERS ARE SPELLED ONCE, IN `TROUBLE_LAW_VERSIONS`, AND THE NAMED VERSIONS ARE READ
 * FROM IT (vocabulary, not tuning).
 *
 * ⛔ THE LAW'S FIGURES LIVE IN ONE TABLE, `TROUBLE_WEIGHT_TUNING`, AND EVERY ONE IS A DRAFT, signed by
 * none: a tuning value is the owner's ("FOR THE OWNER'S SIGNING").
 *
 * ⛔ IT IMPORTS NOTHING. A dependency-free leaf: no cycle can form through it, and nothing rides behind
 * it into whichever chunk its importer lands in. Its importers are the create boundary
 * (`src/domain/density/densityCreateBoundary.js :: birthConfig`) and the history generator; it is
 * pinned to its own lazy `trouble-law` chunk (`vite.config.js`), never first paint.
 *
 * THE GENERATOR ONLY CALLS (`historyGenerator.js :: buildHistoricalEvent`, its three lines changed in
 * place): (a) `_rng() > crimeWaveBar(config, economicState)`; (b) `_rng() > guildSwapBar(config,
 * factions)`; (c) `hasCrimInst && (!isWeightedTrouble(config) || _rng() < smallPlaceCrimeChance(...))`,
 * the one coin law 2 adds, drawn only where today's branch fires. Every weight is computed here.
 *
 * Pure. No import, no RNG, no store, no React, no wall clock, no module state.
 *
 * @guarded-by tests/domain/trouble/troubleLawWiring.test.js, tests/domain/trouble/troubleLawWeights.test.js
 *   and tests/lint/densityCreateBoundary.walker.test.js (`GENERATION_LAWS`, `MINT_SYMBOLS`, `MINT_HOMES`).
 */

/** The config key the law rides on. Underscore-prefixed like `_seed`: a resolved generation input,
 *  carried on the persisted `settlement.config` and its `_config` echo. */
export const TROUBLE_LAW_CONFIG_KEY = '_troubleLawVersion';

/** The trouble-law versions this build can generate under: 1 is the dark default (absent means 1),
 *  2 is the weighted trouble law.
 *  @type {ReadonlyArray<number>} */
export const TROUBLE_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dark) trouble-law version: today's three fixed numbers, unchanged. */
export const DEFAULT_TROUBLE_LAW_VERSION = TROUBLE_LAW_VERSIONS[0];

/** The version the weighted trouble law (the three numbers read how much is there) runs under. */
export const WEIGHTED_TROUBLE_LAW_VERSION = TROUBLE_LAW_VERSIONS[1];

/** ⭐ THE ONE DIAL — the trouble law a NEWLY-created world mints under. AT THE DEFAULT: lighting it is
 *  the owner's word, and reverting is the same one line. Typed as the SPACE of versions (the
 *  living-content dial's lesson), so the mint's dark comparison stays reachable when the dial moves.
 *  @type {number} */
export const NEW_SETTLEMENT_TROUBLE_LAW_VERSION = DEFAULT_TROUBLE_LAW_VERSION;

/**
 * ⭐ THE TROUBLE LAW'S ONE TUNING TABLE. EVERY VALUE IS A DRAFT, signed by none (the seat KINDS-1's
 * figures, 2026-11-20; the crime row is the chair's choice B50 of 22:10 UTC). Read only under law 2; a
 * law-1 world never reads it.
 *
 * A row's chance is `floor + (ceiling - floor) * clamp((read - readLow) / (readHigh - readLow), 0, 1)`;
 * a read that is not a finite number gives the row's midpoint `(floor + ceiling) / 2`.
 *
 *   crimeWave       — (a) the crime coin's chance (today 0.5), read on `criminalEffective`: the place's
 *     own crime strength, `economicState.compound.criminalEffective` as `buildHistoricalEvent` receives it.
 *   guildConflict   — (b) the guild swap's chance (today 0.3), read on `economyPowers`: the count of the
 *     powers of the economy category (`category === 'economy'`) on the PRE-TRIM roster
 *     `buildHistoricalEvent` is handed. An empty roster reads 0, a real read (the floor).
 *   smallPlaceCrime — (c) the small place's crime wave (today always), read on `criminalEffective`.
 *
 * @type {Readonly<Record<'crimeWave'|'guildConflict'|'smallPlaceCrime', Readonly<{read: string, floor: number, ceiling: number, readLow: number, readHigh: number}>>>}
 */
export const TROUBLE_WEIGHT_TUNING = Object.freeze({
  crimeWave: Object.freeze({ read: 'criminalEffective', floor: 0.05, ceiling: 0.50, readLow: 20, readHigh: 90 }),
  guildConflict: Object.freeze({ read: 'economyPowers', floor: 0.05, ceiling: 0.25, readLow: 1, readHigh: 4 }),
  smallPlaceCrime: Object.freeze({ read: 'criminalEffective', floor: 0.50, ceiling: 0.90, readLow: 15, readHigh: 60 }),
});

/**
 * A row's chance for a read: from the floor at `readLow` to the ceiling at `readHigh`, straight between
 * and flat beyond; the midpoint where the read is absent (not a finite number). Never 0, never 1.
 *
 * @param {{floor: number, ceiling: number, readLow: number, readHigh: number}} row
 * @param {unknown} read
 * @returns {number}
 */
export function troubleChance(row, read) {
  if (typeof read !== 'number' || !Number.isFinite(read)) return (row.floor + row.ceiling) / 2;
  const t = Math.min(1, Math.max(0, (read - row.readLow) / (row.readHigh - row.readLow)));
  return row.floor + (row.ceiling - row.floor) * t;
}

/** (a) The crime coin's chance under law 2, on the place's crime strength.
 *  @param {unknown} criminalEffective @returns {number} */
export function crimeWaveChance(criminalEffective) {
  return troubleChance(TROUBLE_WEIGHT_TUNING.crimeWave, criminalEffective);
}

/** (b) The guild swap's chance under law 2, on the count of economy powers (pre-trim roster).
 *  @param {unknown} economyPowers @returns {number} */
export function guildConflictChance(economyPowers) {
  return troubleChance(TROUBLE_WEIGHT_TUNING.guildConflict, economyPowers);
}

/** (c) The small place's crime-wave chance under law 2, on the place's crime strength.
 *  @param {unknown} criminalEffective @returns {number} */
export function smallPlaceCrimeChance(criminalEffective) {
  return troubleChance(TROUBLE_WEIGHT_TUNING.smallPlaceCrime, criminalEffective);
}

/**
 * TODAY'S TWO BARS, BYTE FOR BYTE: the thresholds law 1 compares the same `_rng()` call against, (a) the
 * crime coin's `_rng() > 0.5` and (b) the guild swap's `_rng() > 0.7`. Vocabulary of law 1, not tuning:
 * moved here from `buildHistoricalEvent` so the generator's two lines change in place to one call each.
 */
export const LAW_ONE_TROUBLE_BARS = Object.freeze({ crimeWave: 0.5, guildSwap: 0.7 });

/** The count of the economy powers on a roster (`category === 'economy'`); not an array reads 0.
 *  @param {unknown} factions @returns {number} */
export function economyPowersOf(factions) {
  return Array.isArray(factions) ? factions.filter((f) => f?.category === 'economy').length : 0;
}

/**
 * (a) THE CRIME COIN'S BAR, the threshold `buildHistoricalEvent` compares its one `_rng()` call against
 * (`_rng() > crimeWaveBar(config, economicState)`). Law 1: today's 0.5. Law 2: 1 minus the crime row's
 * chance on the place's own crime strength. NO DRAW, under either law.
 *
 * @param {unknown} config the birth's config (the law is read from it)
 * @param {any} economicState the economy as `buildHistoricalEvent` receives it
 * @param {typeof TROUBLE_WEIGHT_TUNING} [table] the table (the tests' seam; the generator never passes it)
 * @returns {number}
 */
export function crimeWaveBar(config, economicState, table = TROUBLE_WEIGHT_TUNING) {
  if (!isWeightedTrouble(config)) return LAW_ONE_TROUBLE_BARS.crimeWave;
  return 1 - troubleChance(table.crimeWave, economicState?.compound?.criminalEffective);
}

/**
 * (b) THE GUILD SWAP'S BAR (`_rng() > guildSwapBar(config, factions)` in the fill). Law 1: today's 0.7.
 * Law 2: 1 minus the guild row's chance on the count of economy powers on the PRE-TRIM roster
 * `buildHistoricalEvent` is handed (never the final record's: the density trim moves it). NO DRAW.
 *
 * @param {unknown} config
 * @param {unknown} factions the pre-trim roster
 * @param {typeof TROUBLE_WEIGHT_TUNING} [table] the table (the tests' seam; the generator never passes it)
 * @returns {number}
 */
export function guildSwapBar(config, factions, table = TROUBLE_WEIGHT_TUNING) {
  if (!isWeightedTrouble(config)) return LAW_ONE_TROUBLE_BARS.guildSwap;
  return 1 - troubleChance(table.guildConflict, economyPowersOf(factions));
}

/**
 * The trouble-law version a value selects. Only an enabled NUMBER that is not the default selects
 * anything; everything else — absent, a string, NaN, an unshipped version — is the default.
 *
 * @param {unknown} value
 * @returns {number}
 */
export function readTroubleLawVersion(value) {
  return typeof value === 'number'
    && TROUBLE_LAW_VERSIONS.includes(value)
    && value !== DEFAULT_TROUBLE_LAW_VERSION
    ? value
    : DEFAULT_TROUBLE_LAW_VERSION;
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isBag = (value) => value !== null && typeof value === 'object';

/**
 * The trouble-law version a world obeys, read from a config or from a settlement that carries one:
 * the value itself when it carries the key (a config); else the settlement's own `config` (read
 * FIRST); else its `_config` echo. Anything that is not a bag reads as the default.
 *
 * ⚠ THIS READS THE WORLD AND NOTHING ELSE, ON PURPOSE. It never falls back to
 * `NEW_SETTLEMENT_TROUBLE_LAW_VERSION`: a world born before the law carries no marker, and a
 * dial-derived fallback would silently re-birth every such world the day the dial is lit.
 *
 * @param {unknown} configOrSettlement
 * @returns {number}
 */
export function resolveTroubleLawVersion(configOrSettlement) {
  if (!isBag(configOrSettlement)) return DEFAULT_TROUBLE_LAW_VERSION;
  if (Object.hasOwn(configOrSettlement, TROUBLE_LAW_CONFIG_KEY)) {
    return readTroubleLawVersion(configOrSettlement[TROUBLE_LAW_CONFIG_KEY]);
  }
  const { config, _config: echo } = configOrSettlement;
  const bag = isBag(config) ? config : isBag(echo) ? echo : null;
  return readTroubleLawVersion(bag?.[TROUBLE_LAW_CONFIG_KEY]);
}

/** Was this world born under the weighted trouble law? The one predicate the generator calls.
 *  @param {unknown} configOrSettlement @returns {boolean} */
export function isWeightedTrouble(configOrSettlement) {
  return resolveTroubleLawVersion(configOrSettlement) === WEIGHTED_TROUBLE_LAW_VERSION;
}

/**
 * The config fragment a NEWLY-created world is minted with, spread into the fresh config by the create
 * boundary (`densityCreateBoundary.js :: birthConfig`), and nowhere else. EMPTY while the dial sits at
 * the default, so the boundary calls it unconditionally and writes not one byte.
 *
 * @returns {Record<string, number>}
 */
export function newSettlementTroubleLaw() {
  return NEW_SETTLEMENT_TROUBLE_LAW_VERSION === DEFAULT_TROUBLE_LAW_VERSION
    ? {}
    : { [TROUBLE_LAW_CONFIG_KEY]: NEW_SETTLEMENT_TROUBLE_LAW_VERSION };
}
