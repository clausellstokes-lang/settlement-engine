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
 * TWO STRIPS, at two levels, because the hazards live at two levels:
 *   • `scrubImportedConfig`   — over `settlement.config` (seed + faith embeds);
 *   • `scrubImportedTreasury` — over the SETTLEMENT (the W-COIN state coin ledger,
 *     which lives at `economicState.treasury` and is therefore unreachable from the
 *     config destructure — see that function's own note).
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
