// The law marker's ONE spelling, read from the dependency-free leaf that declares
// it rather than re-typed in a strip: a second copy of `_livingContentLawVersion`
// is exactly the drift that leaf exists to prevent. It imports nothing, so this
// edge costs no closure. (It sits above the module docblock because that block is
// also `scrubImportedConfig`'s JSDoc and must abut its function.)
import { LIVING_CONTENT_LAW_CONFIG_KEY } from '../domain/content/livingContentLawVersion.js';

/**
 * importScrub.js — the SINGLE writer for the imported-settlement dormancy strip.
 *
 * An imported settlement (a gallery clone or an account-file import) must arrive
 * DORMANT: it carries NO foreign pantheon, NO foreign coin, and cannot regenerate its
 * unsanitized original. ALL THREE import paths — galleryImportSettlement.js,
 * galleryImportMap.js and accountImport.js — route their scrub through here, so a NEW
 * deity/faith embed key can never re-open the resurrection gap in one path only
 * (store-4: cultDeitySnapshots was missed by both hand-maintained strips).
 *
 * THREE STRIPS, at two levels, because the hazards live at two levels:
 *   • `scrubImportedConfig`   — over `settlement.config` (seed + faith embeds);
 *   • `scrubImportedTreasury` — over the SETTLEMENT (the W-COIN state coin ledger,
 *     which lives at `economicState.treasury` and is therefore unreachable from the
 *     config destructure — see that function's own note);
 *   • `scrubGalleryImportLivingContent` — over the SETTLEMENT, on the GALLERY paths
 *     ONLY (the two custom-content exactness records + the living-content law
 *     marker). Its own note says why it is gallery-scoped and why the account path
 *     must NOT share it.
 *
 * The keys dropped, and why each is a dormancy hazard:
 *   • primaryDeitySnapshot / cultDeitySnapshots — the religion subsystem gate flips
 *     ON when either is present (subsystemActivation.js), and both survive the
 *     server's public projection (they are revealed content), so this CLIENT strip is
 *     the ONLY dormancy guard. Left in place, a foreign god the importer never
 *     authored enters their pantheon ratchet.
 *   • primaryDeityRef — the account-scoped `deity:<scope>:<slug>` identity ref the
 *     snapshot resolves against; useless (and cross-account) once imported.
 *   • faithProfile — the pulse's live projection of that pantheon (piety / martial /
 *     divine-mandate), read directly by martialReadiness / legitimacy / fidelityNoise
 *     WITHOUT the subsystem gate; a dormant import must carry no faith projection or a
 *     foreign pantheon's effects ghost in even while the gate stays closed.
 *   • _seed — dropped so the deterministic engine can never regenerate the
 *     pre-sanitization original from the imported copy.
 *
 * Pure: returns the input unchanged when it is not a plain object (a legacy save may
 * carry a null/absent config).
 *
 * @param {Record<string, any>|null|undefined} config
 * @returns {Record<string, any>|null|undefined}
 */
export function scrubImportedConfig(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) return config;
  const {
    // eslint-disable-next-line no-unused-vars -- intentional drop of seed + faith embeds
    _seed, primaryDeityRef, primaryDeitySnapshot, cultDeitySnapshots, faithProfile,
    ...rest
  } = /** @type {Record<string, any>} */ (config);
  return rest;
}

/**
 * THE IMPORT COIN STRIP (W-COIN A1.8) — an imported settlement arrives COINLESS.
 *
 * ⚠ WHY THIS IS A SECOND FUNCTION RATHER THAN A SIXTH KEY IN THE DESTRUCTURE ABOVE.
 * `scrubImportedConfig` strips keys from `settlement.config`. The state treasury does
 * NOT live in config — it lives at `settlement.economicState.treasury`, written only by
 * the pulse (domain/worldPulse/treasury.js#advanceTreasury). Adding `treasury` to the
 * destructure above would have been a NO-OP that read like a guarantee, which is the
 * worst of both: A1.8 shipped as a false green. So the strip is expressed at the level
 * it is stated — the settlement — and this module stays what its header says it is: the
 * SINGLE WRITER for the imported-settlement dormancy strip.
 *
 * WHY IT IS A DORMANCY HAZARD, in the same voice as the keys above: coin is a CONSERVED
 * stock with exactly one mint, and every coin in a world is meant to be traceable to a
 * receipted mint on that world's own ledger. A foreign balance riding in on an import
 * would be coin that no tick of this campaign ever minted — untraceable by construction,
 * and immune to the no-backfill law because that law is enforced at the writer, which
 * never sees an import. Stripping at the boundary is what keeps the conservation claim
 * true across the one path that can smuggle a stock in from outside.
 *
 * Pure, and REFERENCE-IDENTICAL when there is nothing to strip: a settlement with no
 * treasury key (which is every settlement in every dark campaign, i.e. all of them
 * today) comes back as the very object that went in, so this can never move a byte on
 * the dormant path.
 *
 * @param {Record<string, any>|null|undefined} settlement
 * @returns {Record<string, any>|null|undefined}
 */
export function scrubImportedTreasury(settlement) {
  if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return settlement;
  const economicState = settlement.economicState;
  if (!economicState || typeof economicState !== 'object' || Array.isArray(economicState)) return settlement;
  if (!Object.hasOwn(economicState, 'treasury')) return settlement;
  const {
    // eslint-disable-next-line no-unused-vars -- intentional drop of a foreign coin ledger
    treasury,
    ...restEconomicState
  } = /** @type {Record<string, any>} */ (economicState);
  return { ...settlement, economicState: restEconomicState };
}

/**
 * THE GALLERY-INGEST LIVING-CONTENT STRIP (lane L-MAT-FIX, DEF-1).
 *
 * A gallery clone is a copy of ANOTHER account's world. Two records on it are
 * account-scoped EXACTNESS claims — `customContentRoster` (which reviewed
 * living-content definitions were in scope for that run) and
 * `customContentProvenance` (which of them materialized) — and both are keyed on
 * `customDefinition*` identifiers that belong to the SOURCE account's ledger.
 * The account-file importer resolves those identifiers through an archive-backed
 * identity map, or drops the whole record and says so. THIS boundary has no
 * identity map and never can: a gallery dossier carries no archive, no receipt
 * and no pack, so there is nothing to resolve against. A DROP is therefore the
 * honest act — the alternative is a destination world asserting an exact scope
 * in a namespace where those ids mean nothing.
 *
 * The living-content law marker goes with them, and that is the same claim one
 * level down. The public projection drops the roster but lets the marker ride
 * (it discloses birth-era law only), so an ingest that kept the marker would
 * import a world that says it was born under the roster law while carrying no
 * roster — a world that lies about its own scope, permanently, because nothing
 * downstream re-mints a roster. Dropping the marker makes the imported clone say
 * what it is: a v1 world with no exactness record.
 *
 * ⛔ WHY THIS IS GALLERY-SCOPED AND MUST NOT MOVE INTO `scrubImportedConfig`.
 * That destructure is shared by all three import paths, and the ACCOUNT path is
 * the user's OWN estate moving between their OWN accounts. There the roster is
 * REMAPPED (accountImportBody.js, through the archive receipt) rather than
 * dropped, and the marker is a saved world's immutable birth law — erasing it
 * would silently reclassify a v2 world as v1, and would leave the remapped
 * roster attached to a world that denies the law that minted it. Two different
 * boundaries, two different honest acts; the single-writer module holds both.
 *
 * Pure, and REFERENCE-IDENTICAL when there is nothing to strip: a settlement
 * with none of the three keys comes back as the very object that went in.
 * ⚠ THE PARENTHESIS HERE SAID "which is every settlement this build generates,
 * the dial being dormant", AND THE DIAL WAS LIT ON 2026-09-08. A generated world
 * now carries the law marker on its config, so the reference-identical branch is
 * taken for a NARROWER set than it was: worlds born before the flip, and imported
 * worlds carrying none of the three. The strip itself is unchanged, and it never
 * rested on the dial — a record reaches this boundary from an import FILE, which
 * is exactly where one comes from with no dial moving at all.
 *
 * @param {Record<string, any>|null|undefined} settlement
 * @returns {Record<string, any>|null|undefined}
 */
export function scrubGalleryImportLivingContent(settlement) {
  if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return settlement;
  const hasRecord = Object.hasOwn(settlement, 'customContentRoster')
    || Object.hasOwn(settlement, 'customContentProvenance');
  const config = settlement.config;
  const configIsRecord = Boolean(config) && typeof config === 'object' && !Array.isArray(config);
  const hasMarker = configIsRecord && Object.hasOwn(config, LIVING_CONTENT_LAW_CONFIG_KEY);
  if (!hasRecord && !hasMarker) return settlement;
  const {
    // eslint-disable-next-line no-unused-vars -- intentional drop of two source-account exactness records
    customContentRoster, customContentProvenance,
    ...rest
  } = /** @type {Record<string, any>} */ (settlement);
  if (!hasMarker) return rest;
  const {
    // The underscore-prefixed binding is the intentional drop of a foreign
    // world's birth-law marker; the lint config already admits that name shape,
    // so no disable directive is needed (and an unused one is itself a warning).
    [LIVING_CONTENT_LAW_CONFIG_KEY]: _livingContentLawVersion,
    ...restConfig
  } = /** @type {Record<string, any>} */ (config);
  return { ...rest, config: restConfig };
}
