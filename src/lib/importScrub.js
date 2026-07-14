/**
 * importScrub.js — the SINGLE writer for the imported-settlement dormancy strip.
 *
 * An imported settlement (a gallery clone or an account-file import) must arrive
 * DORMANT: it carries NO foreign pantheon and cannot regenerate its unsanitized
 * original. BOTH import paths — galleryImportSettlement.js and accountImport.js —
 * route their config scrub through here, so a NEW deity/faith embed key can never
 * re-open the resurrection gap in one path only (store-4: cultDeitySnapshots was
 * missed by both hand-maintained strips).
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
