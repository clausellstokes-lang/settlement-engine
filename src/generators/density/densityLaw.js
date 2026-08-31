/**
 * densityLaw.js — THE VERSION GATE for the tier-gated political-density law
 * (ODQ §810 R5: "this changes generation distributions, so it lands as a
 * VERSIONED GENERATION LAW … existing worlds keep their version verbatim; new
 * worlds roll the new ladder").
 *
 * THE IDIOM IS `layoutLawVersion`'s, deliberately and in every detail
 * (domain/townMap/mapEdits.js). The four properties copied verbatim, because
 * each one is load-bearing under THE PROMISE ("a seed is a STARTING world
 * forever"):
 *
 *   1. THE DEFAULT IS DORMANT AND THE MARKER IS OMITTED WHEN DEFAULT. A world
 *      whose config carries no `_densityLawVersion` is a v1 world, and a v1
 *      world's config is byte-identical to one generated before this law
 *      existed. `newSettlementDensityLaw()` returns an EMPTY object while the
 *      dial sits at the default, so even the create boundary writes nothing.
 *   2. THE READ IS A CLOSED MEMBERSHIP TEST, NOT A `>=` COMPARE. Anything that
 *      is not an enabled version — absent, garbage, a future v3 that has not
 *      shipped — coerces to the default. Fail closed, exactly as
 *      `readLayoutLawVersion` does.
 *   3. THERE IS NO MIGRATION, DELIBERATELY. An existing world never acquires
 *      the new law by upgrade. Its law travels in its own persisted `config`
 *      (the same bag that carries `_seed`), so a save, a load, a same-seed
 *      regen and an undo all replay the law the world was BORN under. The
 *      only way a world runs v2 is to have been created under v2.
 *   4. THE DIAL IS ONE LINE. `NEW_SETTLEMENT_DENSITY_LAW_VERSION` is the sole
 *      place a new world's law is chosen; flipping it is the owner's tuning-
 *      signature act (car D4), and reverting it is the same one line.
 *
 * ⛔ THE DIAL IS AT 1 AND THAT IS THE RULING, NOT AN OMISSION. Register VII's
 * ladder values are DRAFTS until the owner's pen lands at the tuning pass
 * (tuning-is-last). Minting new worlds under unsigned numbers would ship draft
 * distributions into real settlements, which §810 R5 forbids. The machinery is
 * complete and exercised — the distribution-shape fixtures drive v2 explicitly.
 *
 * ⛔⛔ THE FLIP IS NOT YET ONE LINE, AND THE MISSING PIECE IS NAMED HERE RATHER
 * THAN DISCOVERED LATER. `newSettlementDensityLaw()` has NO CALLER: this car
 * deliberately did not wire it into the store, because the store's generate
 * action is BOTH a birth and a regeneration (`settlementSlice.js`'s
 * `generateSettlementPipeline(fullConfig, …)` is reached by each), and
 * `fullConfig` for a regeneration is the existing world's own config. Minting
 * there unconditionally — or even non-clobbering, since a pre-law world's
 * config is markerless — would stamp the new law onto worlds that already
 * exist the first time they were regenerated after the flip. That is precisely
 * the PROMISE breach this gate exists to prevent, and it is why
 * `layoutLawVersion` mints at the SAVE chokepoints (three of them, each
 * demonstrably a create) rather than at generation.
 *
 * ⇒ OWED BEFORE THE FLIP: a create-boundary car that establishes which store
 * path is a BIRTH and mints there. Until it lands, the dial is flip-ready but
 * unreachable from the product, and a v2 world can only be produced by passing
 * `_densityLawVersion: 2` in a config explicitly (which is how every fixture in
 * `tests/generators/densityLaw.test.js` drives it).
 *
 * Pure. No RNG, no store, no React.
 */

/** The density-law versions this build can generate under. v1 is the DORMANT
 *  default (absent ⇒ v1 ⇒ byte-identical to every pre-law world and golden);
 *  v2 is Register VII's tier-gated ladder.
 *  @type {ReadonlyArray<number>} */
export const DENSITY_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dormant) density-law version — the pre-Register-VII generator. */
export const DEFAULT_DENSITY_LAW_VERSION = 1;

/** The version Register VII's ladder rolls under. */
export const REGISTER_VII_DENSITY_LAW_VERSION = 2;

/** ⭐ THE ONE DIAL — the density law a NEWLY-created world mints under. Held at
 *  the dormant default until the owner signs Register VII's values at the
 *  tuning pass; flipping it to REGISTER_VII_DENSITY_LAW_VERSION is that pass's
 *  one-line act, and reverting is the same one line. EXISTING worlds are
 *  untouched either way — they never pass through create again. */
export const NEW_SETTLEMENT_DENSITY_LAW_VERSION = DEFAULT_DENSITY_LAW_VERSION;

/** The config key the law rides on. Underscore-prefixed like `_seed`: a
 *  resolved generation input, carried on the persisted `settlement.config`. */
export const DENSITY_LAW_CONFIG_KEY = '_densityLawVersion';

/**
 * ⛔ THE v1 NAMED-NPC MASS BAND — SHIPPED LAW, FROZEN FOREVER.
 *
 * This table lived inside `npcGenerator.js` as the private `getNPCCountRange`;
 * it is moved here so BOTH laws' mass bands have one home, each labelled by its
 * version. Nothing about its VALUES moved — R-DENSITY-CENSUS §2.2 measured the
 * real corpus landing exactly inside it at every tier, and every settlement ever
 * generated was born under it.
 *
 * It is NOT a tuning row and it does not belong in `densityBands.js`. Register
 * VII's numbers are drafts awaiting the owner's pen; these are the law every
 * existing world was born under, and THE PROMISE ("a seed is a STARTING world
 * forever") makes them immutable. Retuning a v1 band would re-roll worlds that
 * already exist; a new band gets a new VERSION instead.
 *
 * @type {Readonly<Record<string, {min: number, max: number}>>}
 */
export const LEGACY_MASS_RANGE = Object.freeze({
  thorp:      Object.freeze({ min: 2,  max: 3 }),
  hamlet:     Object.freeze({ min: 3,  max: 5 }),
  village:    Object.freeze({ min: 4,  max: 7 }),
  town:       Object.freeze({ min: 6,  max: 10 }),
  city:       Object.freeze({ min: 10, max: 15 }),
  metropolis: Object.freeze({ min: 15, max: 20 }),
});

/** The v1 mass band for a tier. Unknown tiers fall back to the town row, which
 *  is the behaviour `getNPCCountRange` has always had.
 *  @param {string|null|undefined} tier @returns {{min: number, max: number}} */
export function legacyMassRange(tier) {
  return LEGACY_MASS_RANGE[String(tier || '')] || LEGACY_MASS_RANGE.town;
}

/**
 * The density-law version a value selects. Absent / unknown / non-enabled ⇒ the
 * dormant default, so every pre-law world and golden stays byte-identical and a
 * future version cannot be selected by accident before it ships.
 *
 * @param {unknown} value
 * @returns {number}
 */
export function readDensityLawVersion(value) {
  const n = Number(value);
  return DENSITY_LAW_VERSIONS.includes(n) && n !== DEFAULT_DENSITY_LAW_VERSION
    ? n
    : DEFAULT_DENSITY_LAW_VERSION;
}

/**
 * The density-law version a generation run obeys, read from its config bag.
 *
 * ⚠ THIS READS THE CONFIG AND NOTHING ELSE, ON PURPOSE. It must NOT fall back
 * to `NEW_SETTLEMENT_DENSITY_LAW_VERSION`: an existing world's persisted config
 * carries no marker, so a dial-derived fallback would silently re-birth every
 * old world under the new ladder the moment the dial flipped — the exact
 * PROMISE breach the version gate exists to prevent. New worlds acquire their
 * marker at the CREATE boundary (`newSettlementDensityLaw`), never here.
 *
 * @param {Record<string, unknown>|null|undefined} config
 * @returns {number}
 */
export function resolveDensityLawVersion(config) {
  return readDensityLawVersion(config?.[DENSITY_LAW_CONFIG_KEY]);
}

/** Does this config's world roll Register VII's ladder?
 *  @param {Record<string, unknown>|null|undefined} config @returns {boolean} */
export function rollsRegisterVii(config) {
  return resolveDensityLawVersion(config) === REGISTER_VII_DENSITY_LAW_VERSION;
}

/**
 * The config fragment a NEWLY-created world is minted with, to be spread into
 * the fresh config at the settlement-CREATE boundary.
 *
 * Returns an EMPTY object while the dial sits at the default — so the create
 * boundary can call this unconditionally today and write not one byte, and the
 * flip needs no second edit at the call site.
 *
 * @returns {Record<string, number>}
 */
export function newSettlementDensityLaw() {
  return NEW_SETTLEMENT_DENSITY_LAW_VERSION === DEFAULT_DENSITY_LAW_VERSION
    ? {}
    : { [DENSITY_LAW_CONFIG_KEY]: NEW_SETTLEMENT_DENSITY_LAW_VERSION };
}
