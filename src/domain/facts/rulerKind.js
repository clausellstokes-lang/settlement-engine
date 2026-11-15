/**
 * domain/facts/rulerKind.js — THE RULER-KIND HOME (CENSUS-1 wave 0, fact 8; the design's §1 row
 * "ruler kind": no reader before this one; `governingFactionOf` answers the faction, not the kind).
 *
 * ONE reader over `powerStructure.government`, the label `rulingPower.js :: governmentLabelFor`
 * and the generator write. The kinds (elder, lord, priest, mayor, occupier, council) and the one
 * predicate over a label live in the pure leaf `facts/rulerKindLabel.js` (TAIL-TIES-5, ruling (T22):
 * moved verbatim so the eager `facts/rulingBody.js` reads the table without an edge into this file's
 * lazy chunk), re-exported here so every reader is one reading. An unrecognised label reads
 * `council`, an absent one null.
 *
 * Pure: no randomness, no clock.
 */
import { rulerKindOfLabel } from './rulerKindLabel.js';

export { RULER_KINDS, rulerKindOfLabel } from './rulerKindLabel.js';

/**
 * THE ONE READER.
 * @param {{ powerStructure?: { government?: unknown } | null } | null | undefined} record a settlement record
 * @returns {string|null} a value of RULER_KINDS, or null when the record names no government
 */
export function rulerKindOf(record) {
  return rulerKindOfLabel(record?.powerStructure?.government);
}
