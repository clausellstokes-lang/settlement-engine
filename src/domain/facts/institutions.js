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
 *   bank      a money changer, a bank or a counting house (COHERENCE-PRESUME, 2026-11-11)
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
// TAIL-TIES-6 (the chair's ruling (T23)): the live roster's native names and the access-only row live in the pure leaf
// `liveInstitutionNames.js` (one home; `display/clergyHouse.js` reads them there, from the eager chunk, with no edge into this one).
import { ACCESS_ONLY, liveInstitutionNames } from './liveInstitutionNames.js';
export { ACCESS_ONLY, liveInstitutionNames };

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
  // COHERENCE-PRESUME (the chair's ruling of 2026-11-11, additions only): a money changer, a bank or a
  // counting house — the houses a line naming coin-changing or banking presumes
  bank: /\bbank(?:s|ing|ers?)?\b|\bmoney.?changers?\b|\bcounting.?houses?\b/i,
});

/** The kinds a line may declare. @type {ReadonlyArray<string>} */
export const INSTITUTION_KINDS = Object.freeze(Object.keys(INSTITUTION_KIND_PATTERNS));

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
 * A GRAIN mill's name, lower-cased (a Mill, Mills (2-5)): a sawmill saws and a maltster malts, and neither grinds flour;
 * an "access to external" row is a neighbour's (TAIL-CLOSE-SRC-4: moved verbatim from `generators/computeActiveChains.js
 * :: gateKeywordPredicate`'s 'grain mill' row, TAIL-DEFECON-C-4 D33, into the institutions home; the `mill` kind above is
 * the wider "a mill of any kind").
 * @param {string} n an institution's name, lower-cased @returns {boolean}
 */
export const namesGrainMill = (n) => (n === 'mill' || n.startsWith('mills (')) && !n.includes('access to external');
