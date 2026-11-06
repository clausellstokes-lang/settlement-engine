/**
 * domain/facts/institutions.js — THE INSTITUTION-PRESENCE HOME (CENSUS-1 wave 0, fact 11; the
 * design's §1 row "institutions present": no reader for most single institutions).
 *
 * `hasInstitution(record, kind)` answers "does a LIVE institution of this kind stand here", by the
 * native name (`nativeSemanticName`, the same name every defence and market reader uses) over the
 * live roster (`institutions/institutionRoster.js :: liveInstitutions`). One pattern per kind, in
 * `INSTITUTION_KIND_PATTERNS`, so a kind means one thing everywhere:
 *   hospital  a hospital only (the chair's ruling: a healer, a monastery or a friary is not one)
 *   healer    a healer or an infirmary
 *   monastery a monastery or a friary
 *   mill · smith · bathhouse · docks · quarry · mine · tavern · school · temple · granary
 * A row naming ACCESS to a neighbour's facility (`ACCESS_ONLY`) is none of them (CENSUS-1c unit 6).
 * `defense/defenseFacts.js` reads hospital and healer through this table (its `hasHealer` is the
 * healer OR monastery union it always meant, so its answer does not move).
 *
 * NOT RETIRED: `foodBalance.js :: hasImportProcessor` asks a different question (which building
 * PROCESSES a given import, by resource, with tier and custom-content rules) and reads the raw
 * roster at a generation step; moving it to the live roster is a birth question, left to the lane
 * that declares against it.
 *
 * Pure: no randomness, no clock.
 */
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

/** kind → the native-name pattern that means it. @type {Readonly<Record<string, RegExp>>} */
export const INSTITUTION_KIND_PATTERNS = Object.freeze({
  hospital: /\bhospital/i,
  healer: /\bhealer\b|\binfirmar/i,
  monastery: /\bmonaster|\bfriary\b/i,
  mill: /\bmill(?:s|er|ers)?\b/i, // a sawmill is not one: no word boundary before its "mill"
  smith: /\bsmith(?:y|ies|s)?\b|\bforge\b|\bblacksmith/i,
  bathhouse: /\bbath(?:s|house|houses)?\b/i,
  docks: /\bdocks?\b|\bharbou?r\b|\bwharf|\bquay|\bport\b/i,
  quarry: /\bquarr(?:y|ies)\b/i,
  mine: /\bmines?\b|\bmining\b/i,
  tavern: /\btavern|\binns?\b|\bale ?house/i, // CENSUS-1c unit 6: 'Ale house' (the village row) too
  school: /\bschool|\bacademy|\bcollege|\buniversity/i,
  temple: /\btemple|\bchurch|\bcathedral|\bshrine|\bchapel|\babbey/i,
  granary: /\bgranar/i,
});

/** The kinds a line may declare. @type {ReadonlyArray<string>} */
export const INSTITUTION_KINDS = Object.freeze(Object.keys(INSTITUTION_KIND_PATTERNS));

/**
 * The live roster's native names.
 * @param {{ institutions?: unknown } | null | undefined} record
 * @returns {string[]}
 */
export function liveInstitutionNames(record) {
  return liveInstitutions(record).map((inst) => String(nativeSemanticName(inst) || '')).filter(Boolean);
}

/**
 * THE ONE READER.
 * @param {{ institutions?: unknown } | null | undefined} record a settlement record (or any record carrying `institutions`)
 * @param {string} kind a key of INSTITUTION_KIND_PATTERNS
 * @returns {boolean}
 */
export function hasInstitution(record, kind) {
  const re = INSTITUTION_KIND_PATTERNS[kind];
  if (!re) throw new Error(`hasInstitution: unknown institution kind '${kind}'`);
  return liveInstitutionNames(record).some((n) => !ACCESS_ONLY.test(n) && re.test(n));
}

/**
 * A row that names ACCESS to a neighbour's facility ('Access to external mill', 'Access to parish
 * church') is not that institution standing here (CENSUS-1c unit 6, the vocabulary rulings §6; the
 * faith home already reads the church row as access-only, `faithReading.js :: faithReadingOf`).
 */
export const ACCESS_ONLY = /^access to\b/i;
