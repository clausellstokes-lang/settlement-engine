/**
 * livingContentLaw.js — THE VERSION GATE for living-content materialization
 * (ODQ §866: four whole reference-pack categories — stressors, factions,
 * deities, traditions — never materialize into a generated settlement at all,
 * so 26 of the 52 presentation-claim cases discover nothing and half that
 * instrument proves nothing).
 *
 * THE IDIOM IS `densityLaw.js`'s, deliberately and in every detail, and that
 * file in turn copies `layoutLawVersion`'s. All four properties are reproduced
 * here because each one is load-bearing under THE PROMISE ("a seed is a
 * STARTING world forever"):
 *
 *   1. THE DEFAULT IS DORMANT AND THE MARKER IS OMITTED WHEN DEFAULT. A world
 *      whose config carries no `_livingContentLawVersion` is a v1 world, and a
 *      v1 world's settlement is byte-identical to one generated before this law
 *      existed. `newSettlementLivingContentLaw()` returns an EMPTY object while
 *      the dial sits at the default, so even the create boundary writes nothing.
 *   2. THE READ IS A CLOSED MEMBERSHIP TEST, NOT A `>=` COMPARE. Anything that
 *      is not an enabled version — absent, garbage, a future v3 that has not
 *      shipped — coerces to the default. Fail closed.
 *   3. THERE IS NO MIGRATION, DELIBERATELY. An existing world never acquires
 *      the new law by upgrade. Its law travels in its own persisted `config`
 *      (the same bag that carries `_seed`), so a save, a load, a same-seed
 *      regen and an undo all replay the law the world was BORN under.
 *   4. THE DIAL IS ONE LINE. `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION` is the
 *      sole place a new world's law is chosen, and reverting is the same line.
 *
 * ⛔ THE DIAL IS AT 1 AND THAT IS THE RULING, NOT AN OMISSION. Lighting this
 * law is a SEPARATE owner decision, for a reason this module states rather than
 * leaves to be rediscovered: the four categories are the estate's LIVING
 * CONTENT, and `tests/fixtures/customContentReferencePack.js` states the
 * governing law in its own header — "the living-content definitions
 * deliberately have no automatic activation event: their presence in a reviewed
 * environment must not make a generated settlement silently adopt a deity,
 * faction, stressor, or tradition."
 *
 * ⭐ MATERIALIZATION IS NOT ADOPTION, AND THE WHOLE DESIGN TURNS ON THAT
 * DISTINCTION. What v2 lights is a roster — `settlement.customContentRoster` —
 * that RECORDS which reviewed living-content definitions were in scope for the
 * run. It is inert: no generator reads it, no mechanic consults it, and it is
 * built after every RNG draw is finished. What v2 emphatically does NOT do is
 * write into `settlement.factions`, `settlement.stressors`,
 * `settlement.traditions` or `config.primaryDeitySnapshot` — the four surfaces
 * `settlementContentProvenance.js` already reads. Those are the MECHANICAL
 * surfaces, and writing a custom definition into any of them is adoption, which
 * is both the fixture's forbidden act and a presentation→mechanical promotion
 * of the F2c tripwire class. That promotion is OWNER-GATED and is not taken
 * here; `tests/domain/livingContentMaterialization.test.js` pins the gap so
 * crossing it reds instead of arriving quietly.
 *
 * Pure. No RNG, no store, no React.
 */

/** The living-content law versions this build can generate under. v1 is the
 *  DORMANT default (absent ⇒ v1 ⇒ byte-identical to every pre-law world and
 *  golden); v2 materializes the inert roster.
 *  @type {ReadonlyArray<number>} */
export const LIVING_CONTENT_LAW_VERSIONS = Object.freeze([1, 2]);

/** The default (dormant) living-content law version — no roster, no key. */
export const DEFAULT_LIVING_CONTENT_LAW_VERSION = 1;

/** The version the inert living-content roster materializes under. */
export const ROSTER_LIVING_CONTENT_LAW_VERSION = 2;

/** ⭐ THE ONE DIAL — the living-content law a NEWLY-created world mints under.
 *  Held at the dormant default until the owner rules on lighting; flipping it to
 *  ROSTER_LIVING_CONTENT_LAW_VERSION is that ruling's one-line act, and
 *  reverting is the same one line. EXISTING worlds are untouched either way —
 *  they never pass through create again. */
export const NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION =
  DEFAULT_LIVING_CONTENT_LAW_VERSION;

/** The config key the law rides on. Underscore-prefixed like `_seed`: a
 *  resolved generation input, carried on the persisted `settlement.config`. */
export const LIVING_CONTENT_LAW_CONFIG_KEY = '_livingContentLawVersion';

/**
 * ⛔ THE FOUR LIVING-CONTENT BUCKETS, AND WHY THESE FOUR.
 *
 * They are not a taste grouping. They are exactly the authorable buckets whose
 * definitions reach no generated settlement (§866, re-measured by TE-INSTR-1 as
 * 26 of 52 presentation cases), and exactly the buckets the reference-pack
 * fixture calls living content. The other four authorable buckets —
 * institutions, services, resources, tradeGoods — are SETTLEMENT-BEARING: they
 * already materialize through their own generators and must never appear here,
 * because a second materialization path for an already-materializing bucket
 * would produce two truths about one definition.
 *
 * @type {ReadonlyArray<string>}
 */
export const LIVING_CONTENT_BUCKETS = Object.freeze([
  'deities',
  'factions',
  'stressors',
  'traditions',
]);

/**
 * The living-content law version a value selects. Absent / unknown /
 * non-enabled ⇒ the dormant default, so every pre-law world and golden stays
 * byte-identical and a future version cannot be selected by accident before it
 * ships.
 *
 * @param {unknown} value
 * @returns {number}
 */
export function readLivingContentLawVersion(value) {
  const n = Number(value);
  return LIVING_CONTENT_LAW_VERSIONS.includes(n)
    && n !== DEFAULT_LIVING_CONTENT_LAW_VERSION
    ? n
    : DEFAULT_LIVING_CONTENT_LAW_VERSION;
}

/**
 * The living-content law version a generation run obeys, read from its config.
 *
 * ⚠ THIS READS THE CONFIG AND NOTHING ELSE, ON PURPOSE. It must NOT fall back
 * to `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION`: an existing world's persisted
 * config carries no marker, so a dial-derived fallback would silently re-birth
 * every old world under the new law the moment the dial flipped — the exact
 * PROMISE breach the version gate exists to prevent. New worlds acquire their
 * marker at the CREATE boundary (`newSettlementLivingContentLaw`), never here.
 *
 * @param {Record<string, unknown>|null|undefined} config
 * @returns {number}
 */
export function resolveLivingContentLawVersion(config) {
  return readLivingContentLawVersion(config?.[LIVING_CONTENT_LAW_CONFIG_KEY]);
}

/** Does this config's world materialize the inert living-content roster?
 *  @param {Record<string, unknown>|null|undefined} config @returns {boolean} */
export function materializesLivingContent(config) {
  return resolveLivingContentLawVersion(config)
    === ROSTER_LIVING_CONTENT_LAW_VERSION;
}

/**
 * The config fragment a NEWLY-created world is minted with, to be spread into
 * the fresh config at the settlement-CREATE boundary.
 *
 * Returns an EMPTY object while the dial sits at the default — so a create
 * boundary can call this unconditionally and write not one byte, and the flip
 * needs no second edit at the call site.
 *
 * ⚠ LIKE `newSettlementDensityLaw()`, THIS HAS NO CALLER YET, and for the same
 * measured reason: the store's generate action is BOTH a birth and a
 * regeneration, so minting there would stamp the new law onto worlds that
 * already exist the first time they were regenerated after a flip. The
 * create-boundary car that establishes which store path is a BIRTH is owed
 * before the dial can be reached from the product; until then a v2 world can
 * only be produced by passing `_livingContentLawVersion: 2` in a config
 * explicitly, which is how this lane's fixtures drive it.
 *
 * @returns {Record<string, number>}
 */
export function newSettlementLivingContentLaw() {
  return NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION
    === DEFAULT_LIVING_CONTENT_LAW_VERSION
    ? {}
    : {
      [LIVING_CONTENT_LAW_CONFIG_KEY]:
          NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
    };
}
