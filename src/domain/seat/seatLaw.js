/**
 * seatLaw.js — THE SEAT LAW (CS10): the third birth law, and the ONE reader every later unit of
 * the seat train asks "was this world born under the seat law?" (SEAT-1 train 1, unit U1).
 *
 * The law this gates is the owner's model of 2026-11-20: the FORM of government
 * (`powerStructure.government`), the HOLDER (the power that holds the seat) and the PERSON in it
 * are three things, correlated, never one ("Every power group should be able to compete for
 * leadership or the seat given the right circumstances"). Version 2 is that law; version 1 is
 * every world before it. Nothing the law changes lives in this file: it only answers which law a
 * world was born under, and every behaviour of the train branches on that answer.
 *
 * THE IDIOM IS THE LIVING-CONTENT LAW'S (`livingContentLawVersion.js` and `livingContentLaw.js`),
 * and its four properties hold here in these words:
 *
 *   1. DORMANT BY DEFAULT, AND THE DEFAULT WRITES NOTHING. A config with no `_seatLawVersion` is
 *      a law-1 world, and a law-1 world is byte-identical to one generated before this file
 *      existed. While the dial sits at the default, `newSettlementSeatLaw()` returns an EMPTY
 *      object, so the create boundary spreads not one byte.
 *   2. A CLOSED MEMBERSHIP READ THAT FAILS CLOSED. Only an enabled version that is not the
 *      default selects anything; absent, garbage, a string, NaN, an unshipped v3 all read as 1.
 *      ⚠ STRICTER THAN THE TEMPLATE ON ONE POINT, BY THE BRIEF: the living-content reader coerces
 *      with `Number(value)`, so the string '2' reads as 2 there; here only the NUMBER 2 does. A
 *      marker is minted as a number and nothing in the estate writes it as a string, so a string
 *      is a foreign value and is refused rather than interpreted.
 *   3. NO MIGRATION, DELIBERATELY. A world never acquires this law by upgrade or by any stamp on a
 *      read, save, load, regen, undo or import path. Its law travels in its own persisted
 *      `config` (echoed on `_config`), so every replay obeys the law it was BORN under.
 *   4. THE DIAL IS ONE LINE. `NEW_SETTLEMENT_SEAT_LAW_VERSION` is the only place a new world's
 *      seat law is chosen, and the mint reads it and nothing else, so lighting it and reverting
 *      it are the same one-line act.
 *
 * ⛔ THE DIAL IS AT THE DEFAULT, AND LIGHTING IT IS THE OWNER'S WORD, NOT A LANE'S. The train
 * lands DARK (the chair's ruling (a) on CS10, 2026-11-20): every unit proves its behaviour on its
 * own fixture arm that sets `_seatLawVersion: 2` explicitly, and the light (U8) comes last, on
 * the owner's word — the living-content precedent, whose dial was lit on the owner's word of
 * 2026-09-08 (`livingContentLaw.js`'s header). A lit dial here would move every born pin of every
 * later unit at once and convict nobody.
 *
 * ⛔ THE VERSION NUMBERS ARE SPELLED ONCE, IN `SEAT_LAW_VERSIONS`, AND THE NAMED VERSIONS ARE READ
 * FROM IT. They are vocabulary, not tuning, and the train's law 6 admits no new top-level named
 * numeric constant outside a registered tuning table; reading the two names off the frozen list
 * keeps one spelling of each number and adds no row to `tests/lint/.tuning-inventory.json`.
 *
 * ⛔ IT IMPORTS NOTHING. It is the dependency-free leaf the living-content vocabulary is, for the
 * same two reasons: no cycle can form through it, and nothing rides behind it into whichever chunk
 * its importer lands in. Its generation-side importers: the create boundary (`densityCreateBoundary.js :: birthConfig`),
 * the band (`npc/powerBand.js`) and the two regen passes (`generateSettlementPipeline.js`, `withRecordSeatLaw`).
 *
 * Pure. No RNG, no store, no React, no wall clock, no module state.
 *
 * @guarded-by tests/domain/seatLawWiring.test.js (the five arms of U1) and
 *   tests/lint/densityCreateBoundary.walker.test.js (`GENERATION_LAWS`, `MINT_SYMBOLS`,
 *   `MINT_HOMES`).
 */

/** The config key the law rides on. Underscore-prefixed like `_seed`: a resolved generation
 *  input, carried on the persisted `settlement.config` and its `_config` echo. */
export const SEAT_LAW_CONFIG_KEY = '_seatLawVersion';

/** The seat-law versions this build can generate under: 1 is the dormant default (absent means
 *  1), 2 is the seat law (the form, the holder and the person read apart).
 *  @type {ReadonlyArray<number>} */
export const SEAT_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dormant) seat-law version: today's seat, unchanged. */
export const DEFAULT_SEAT_LAW_VERSION = SEAT_LAW_VERSIONS[0];

/** The version the seat law (the holder of the seat, read apart from the form) runs under. */
export const HOLDER_SEAT_LAW_VERSION = SEAT_LAW_VERSIONS[1];

/** ⭐ THE ONE DIAL — the seat law a NEWLY-created world mints under. AT THE DEFAULT: lighting it is
 *  U8, on the owner's word, and reverting is the same one line.
 *  The `@type {number}` is the living-content dial's earned lesson (TS2367 under the strict
 *  kernel the day that dial was lit): a dial's type is the SPACE of versions, never today's
 *  setting, so the mint's dormant comparison stays reachable when the dial moves.
 *  @type {number} */
export const NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION;

/**
 * The seat-law version a value selects. Only an enabled NUMBER that is not the default selects
 * anything; everything else — absent, a string, NaN, an unshipped version — is the default.
 *
 * @param {unknown} value
 * @returns {number}
 */
export function readSeatLawVersion(value) {
  return typeof value === 'number'
    && SEAT_LAW_VERSIONS.includes(value)
    && value !== DEFAULT_SEAT_LAW_VERSION
    ? value
    : DEFAULT_SEAT_LAW_VERSION;
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isBag = (value) => value !== null && typeof value === 'object';

/**
 * The seat-law version a world obeys, read from a config or from a settlement that carries one.
 *
 * The bag is chosen in this order: the value itself when it carries the key (a config); else the
 * settlement's own `config` (read FIRST, the order `regenSection` reads a world's law in); else
 * its `_config` echo. Anything that is not a bag reads as the default.
 *
 * ⚠ THIS READS THE WORLD AND NOTHING ELSE, ON PURPOSE. It never falls back to
 * `NEW_SETTLEMENT_SEAT_LAW_VERSION`: a world born before the law carries no marker, and a
 * dial-derived fallback would silently re-birth every such world the day the dial is lit.
 *
 * @param {unknown} configOrSettlement
 * @returns {number}
 */
export function resolveSeatLawVersion(configOrSettlement) {
  if (!isBag(configOrSettlement)) return DEFAULT_SEAT_LAW_VERSION;
  if (Object.hasOwn(configOrSettlement, SEAT_LAW_CONFIG_KEY)) {
    return readSeatLawVersion(configOrSettlement[SEAT_LAW_CONFIG_KEY]);
  }
  const { config, _config: echo } = configOrSettlement;
  const bag = isBag(config) ? config : isBag(echo) ? echo : null;
  return readSeatLawVersion(bag?.[SEAT_LAW_CONFIG_KEY]);
}

/** Was this world born under the seat law (the holder read apart from the form)?
 *  @param {unknown} configOrSettlement @returns {boolean} */
export function seatsByHolder(configOrSettlement) {
  return resolveSeatLawVersion(configOrSettlement) === HOLDER_SEAT_LAW_VERSION;
}

/**
 * The config a REGENERATE pass hands down: `config` with the seat key the RECORD's (UK-LEGACY, the chair's rule).
 *
 * A regenerate road is handed a config it did not choose (the store's `settlement.config || config` falls back to the
 * FORM config for a save with no `config`, and the form holds whatever world was loaded last). Every reader of the law
 * downstream reads it off that config (`npc/powerBand.js :: powerBandOfRole`), so the pass re-keys it here: the seat
 * key becomes the record's own marker, read through the one resolver above, or none (a record with no marker is law 1).
 * Every other key is the handed config's, untouched. Same reference when the two already agree, so a regen whose
 * handed config IS the record's config is byte-identical. Never called at BIRTH: there the born config IS the record's.
 *
 * @template {Record<string, unknown>} T
 * @param {T} config the handed config
 * @param {unknown} record the settlement being regenerated
 * @returns {T}
 */
export function withRecordSeatLaw(config, record) {
  const version = resolveSeatLawVersion(record);
  if (resolveSeatLawVersion(config) === version) return config;
  const { [SEAT_LAW_CONFIG_KEY]: _handed, ...rest } = config;
  return /** @type {T} */ (version === DEFAULT_SEAT_LAW_VERSION ? rest : { ...rest, [SEAT_LAW_CONFIG_KEY]: version });
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
export function newSettlementSeatLaw() {
  return NEW_SETTLEMENT_SEAT_LAW_VERSION === DEFAULT_SEAT_LAW_VERSION
    ? {}
    : { [SEAT_LAW_CONFIG_KEY]: NEW_SETTLEMENT_SEAT_LAW_VERSION };
}
