/**
 * domain/facts/rulerKind.js — THE RULER-KIND HOME (CENSUS-1 wave 0, fact 8; the design's §1 row
 * "ruler kind": no reader before this one; `governingFactionOf` answers the faction, not the kind).
 *
 * ONE reader over `powerStructure.government`, the label `rulingPower.js :: governmentLabelFor`
 * and the generator write. The kinds:
 *   elder   an elder council, a headman, a household council
 *   lord    a noble, feudal, ducal or royal authority; a steward or an appointee
 *   priest  a church, theocratic, ecclesiastical council or priestly guidance (the priest-king)
 *   mayor   a mayor or an elected reeve
 *   occupier an occupation, foreign or martial administration
 *   council every other council, senate, assembly, oligarchy, consortium or command
 * The vocabulary is the one measured on soak1k-0..999's born records (2026-11-04: 36 labels),
 * plus `governmentLabelFor`'s table; an unrecognised label reads `council`, an absent one null.
 *
 * Pure: no randomness, no clock.
 */

/** @type {ReadonlyArray<readonly [string, RegExp]>} first match wins, in this order */
const KIND_RULES = Object.freeze([
  ['occupier', /\b(?:occupation|foreign|martial administration)\b/i],
  ['priest', /\b(?:church|theocratic|ecclesiastical|priestly|priest)\b/i],
  ['elder', /\b(?:elder|headman|household council)\b/i],
  ['mayor', /\b(?:mayor|reeve)\b/i],
  ['lord', /\b(?:feudal|royal|noble|ducal|governorship|stewardship|appointee|regency|lord)\b/i],
]);

/** The kinds a line may declare. @type {ReadonlyArray<string>} */
export const RULER_KINDS = Object.freeze(['elder', 'lord', 'priest', 'mayor', 'occupier', 'council']);

/**
 * The kind a government label names.
 * @param {unknown} label
 * @returns {string|null}
 */
export function rulerKindOfLabel(label) {
  if (typeof label !== 'string' || label.trim() === '') return null;
  for (const [kind, re] of KIND_RULES) if (re.test(label)) return kind;
  return 'council';
}

/**
 * THE ONE READER.
 * @param {{ powerStructure?: { government?: unknown } | null } | null | undefined} record a settlement record
 * @returns {string|null} a value of RULER_KINDS, or null when the record names no government
 */
export function rulerKindOf(record) {
  return rulerKindOfLabel(record?.powerStructure?.government);
}
