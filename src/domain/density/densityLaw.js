/**
 * densityLaw.js — THE VERSION GATE for the tier-gated political-density law
 * (ODQ §810 R5: "this changes generation distributions, so it lands as a
 * VERSIONED GENERATION LAW … existing worlds keep their version verbatim; new
 * worlds roll the new ladder").
 *
 * THE IDIOM IS `layoutLawVersion`'s, deliberately and in every detail — the
 * estate's one prior versioned-generation-law gate. Its reader is spelled
 * `readLayoutLawVersion` (named again in property 2 below), and grepping that
 * symbol is how a reader reaches it. ⚠ The module PATH is deliberately NOT
 * spelled here, and that is a law rather than a style: ODQ §725 made the layout
 * surface a separate module, and a terminal census holds its surviving
 * vocabulary to a closed allowlist of retained surfaces. A generator citing that
 * path would have to widen the allowlist for a provenance note — the exact
 * direction the census exists to refuse. Naming the SYMBOL costs the reader
 * nothing and the census nothing.
 * The four properties are copied verbatim, because
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
 *   4. THE DIAL HAS ONE SOURCE. `NEW_SETTLEMENT_DENSITY_LAW_VERSION` is the sole
 *      place a new world's law is chosen, and car D4 gave that choice a single
 *      home to be MADE in: it is derived from `densityBands.REGISTER_VII_SIGNATURE`
 *      and from nothing else, so the owner's tuning signature — the numbers AND
 *      the go-live — is one file's diff. Nothing here is edited to sign or to
 *      revert.
 *
 * ⛔ THE DIAL IS AT 1 AND THAT IS THE RULING, NOT AN OMISSION. Register VII's
 * ladder values are DRAFTS until the owner's pen lands at the tuning pass
 * (tuning-is-last). Minting new worlds under unsigned numbers would ship draft
 * distributions into real settlements, which §810 R5 forbids — and since D4 that
 * refusal is STRUCTURAL: the signature's `live` word cannot light the law while its
 * `signed` word is false. The machinery is complete and exercised — the
 * distribution-shape fixtures drive v2 explicitly.
 *
 * ⭐ THE FLIP IS NOW ONE LINE, AND THE BLOCKER THIS FILE USED TO NAME IS
 * DISCHARGED. D1 recorded here that `newSettlementDensityLaw()` had NO CALLER,
 * because the store's generate action looked like both a birth and a regeneration
 * and minting there would have stamped the new law onto worlds that already exist —
 * the PROMISE breach this gate exists to prevent. §822 chartered the cure and D2
 * built it: `densityCreateBoundary.js` classifies every module that can reach the
 * settlement pipeline as BIRTH / DERIVED / PREVIEW, `birthConfig` is the one mint,
 * and the two BIRTH callers (`store/settlementSlice.js`,
 * `lib/instantWorld/composeInstantWorld.js`) both spread it today.
 * `tests/lint/densityCreateBoundary.walker.test.js` holds that manifest to the tree,
 * so a new pipeline reacher cannot get its class wrong silently. D1's own premise
 * was OVERTURNED on executed evidence in the same car: `state.config` is the wizard's
 * FORM state, so the store's generate action is an unambiguous birth. ⚠ AND THE
 * GROUND FOR THAT IS NOT THE ONE THIS PARAGRAPH USED TO GIVE (§913). It said
 * `state.config` "is never hydrated from a save", which is FALSE: the Library's
 * "Apply Saved Configuration & Regenerate" runs
 * `updateConfig(migrateConfig(data.settlement?._config || data.config))`, and
 * `updateConfig` admits the whole underscore family by prefix
 * (`isAllowedConfigKey`: `key.startsWith('_')`), so a saved world's law marker really
 * does arrive in the form state. What makes the birth unambiguous is the CLAMP in
 * `birthConfig`, which destructures the marker off the incoming config before
 * spreading the mint — an absence would have been luck; the clamp is a mechanism.
 * The correction is kept rather than deleted because the reasoning
 * that looked right is the reasoning a future reader will re-derive.
 *
 * Pure. No RNG, no store, no React.
 */

import { REGISTER_VII_SIGNATURE } from './densityBands.js';

/** The density-law versions this build can generate under. v1 is the DORMANT
 *  default (absent ⇒ v1 ⇒ byte-identical to every pre-law world and golden);
 *  v2 is Register VII's tier-gated ladder.
 *  @type {ReadonlyArray<number>} */
export const DENSITY_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dormant) density-law version — the pre-Register-VII generator. */
export const DEFAULT_DENSITY_LAW_VERSION = 1;

/** The version Register VII's ladder rolls under. */
export const REGISTER_VII_DENSITY_LAW_VERSION = 2;

/** ⭐ THE ONE DIAL — the density law a NEWLY-created world mints under. It is
 *  DERIVED, never edited: `densityBands.REGISTER_VII_SIGNATURE` is where the owner
 *  signs the values and lights the law, and this reads that pair so the whole tuning
 *  act stays one file's diff (car D4). Both words must be true — §810 R5's "never
 *  mint under unsigned numbers", made structural. EXISTING worlds are untouched
 *  either way; they never pass through create again. */
export const NEW_SETTLEMENT_DENSITY_LAW_VERSION =
  REGISTER_VII_SIGNATURE.signed && REGISTER_VII_SIGNATURE.live
    ? REGISTER_VII_DENSITY_LAW_VERSION
    : DEFAULT_DENSITY_LAW_VERSION;

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
