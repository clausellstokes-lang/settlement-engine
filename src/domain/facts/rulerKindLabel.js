/**
 * domain/facts/rulerKindLabel.js — THE RULER-KIND TABLE, A PURE LEAF (TAIL-TIES-5, the chair's ruling (T22) of
 * 2026-11-15, vetoable by the owner): the kinds and the one predicate over a government LABEL, moved verbatim out
 * of `facts/rulerKind.js`, which re-exports both, so every reader is one reading.
 *
 * WHY A LEAF. `facts/rulerKind.js` is pinned to the lazy `coherence-lazy` chunk (vite.config.js ::
 * FIRSTPAINT2_LAZY_DOMAIN). `facts/rulingBody.js` (the vocabulary's atom `ruling body`) is generator-reached and
 * unpinned, so the derivation routes it into the EAGER `engine-core` chunk; its import of `rulerKind.js` was an
 * engine-core -> coherence-lazy edge that put coherence-lazy and data-lazy in first paint and closed the chunk
 * cycle whose throw stopped the shipped bundle booting (tests/architecture/engineCoreLazyEdge.test.js,
 * tests/build/bootSmoke.test.js, tests/build/vendorPdfLazy.test.js). This file imports nothing, so wherever it
 * rides it carries no edge; `rulingBody.js` reads it, and `rulerKind.js` reads it from its lazy chunk.
 *
 * The kinds:
 *   elder   an elder council, a headman, a household council
 *   lord    a noble, feudal, ducal or royal authority; a steward or an appointee
 *   priest  a church, theocratic, ecclesiastical council or priestly guidance (the priest-king)
 *   mayor   a mayor or an elected reeve
 *   occupier an occupation, foreign or martial administration
 *   council every other council, senate, assembly, oligarchy, consortium or command
 * The vocabulary is the one measured on soak1k-0..999's born records (2026-11-04: 36 labels),
 * plus `governmentLabelFor`'s table; an unrecognised label reads `council`, an absent one null.
 *
 * Pure: no imports, no randomness, no clock.
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
