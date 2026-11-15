/**
 * domain/facts/liveInstitutionNames.js — THE LIVE ROSTER'S NATIVE NAMES AND THE ACCESS-ONLY ROW, A PURE LEAF (TAIL-TIES-6,
 * the chair's ruling (T23) of 2026-11-15, vetoable by the owner): `liveInstitutionNames` and `ACCESS_ONLY`, moved verbatim
 * out of `facts/institutions.js`, which re-exports both, so every reader is one reading.
 *
 * WHY A LEAF. `facts/institutions.js` is pinned to the lazy `coherence-lazy` chunk. `display/clergyHouse.js` (the threat
 * rows' clergy line and the governing power's faith chip, TAIL-DISPLAY-CIVIC-2) rides the EAGER `engine-core` chunk, and its
 * import of `institutions.js` was an engine-core -> coherence-lazy edge (tests/architecture/engineCoreLazyEdge.test.js).
 * This file imports only the two import-free roster leaves (`institutions/institutionRoster.js`,
 * `content/customContentSemanticAuthority.js`), so wherever it rides it carries no lazy edge; `clergyHouse.js` reads it,
 * and `institutions.js` reads it from its lazy chunk.
 *
 * Pure: no randomness, no clock.
 */
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * The live roster's native names.
 * @param {{ institutions?: unknown } | null | undefined} record
 * @returns {string[]}
 */
export function liveInstitutionNames(record) {
  return liveInstitutions(record).map((inst) => String(nativeSemanticName(inst) || '')).filter(Boolean);
}

/**
 * A row that names ACCESS to a neighbour's facility ('Access to external mill', 'Access to parish
 * church') is not that institution standing here (CENSUS-1c unit 6, the vocabulary rulings §6; the
 * faith home already reads the church row as access-only, `faithReading.js :: faithReadingOf`).
 */
export const ACCESS_ONLY = /^access to\b/i;
