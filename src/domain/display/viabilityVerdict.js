/**
 * domain/display/viabilityVerdict.js — ONE VERDICT WORD FOR ONE FACT.
 *
 * ── THE DEFECT THIS EXISTS FOR (the label ladder, 2026-09-18) ────────────────────────
 * The settlement's coherence verdict had TWO VOCABULARIES, one per surface, for the same
 * derived fact:
 *
 *   SCREEN  `ViabilityTab` printed '✗ NOT COHERENT' / '✓ COHERENT' / 'MARGINAL COHERENCE',
 *           forked inline on `viable === false / true / neither`.
 *   PRINT   `ViabilityAssessment`'s private `verdictOf()` printed 'Viable' / 'Not Viable' /
 *           'Fragile' / 'Collapsing', reading BOTH `viable` and the richer `verdict` field.
 *
 * So a DM read "NOT COHERENT" on the tab and "Not Viable" in the document they had paid
 * for — and worse, the screen could not say 'Fragile' or 'Collapsing' at all, because its
 * three-way fork had nowhere to put them. That is not a case divergence; it is two
 * different readings of one model, and re-casing either would only have made them disagree
 * more quietly.
 *
 * This module is the single derivation. `src/pdf` reads `domain/display/*` in a dozen
 * places already and the screen tabs read it everywhere, so it sits on an edge both
 * surfaces already have. The PDF's copy is deleted, not duplicated.
 *
 * ⛔ THE GLYPH AND THE COLOUR ARE NOT HERE, AND THAT IS DELIBERATE. `tone` is the estate's
 * abstract tone token ('good' / 'warn' / 'bad'); each surface keys its own palette and its
 * own affordances off it — the screen keeps its ✓ / ✗ and its tinted callout, the page
 * keeps its Callout tone. What is shared is the WORD and the JUDGEMENT, which is exactly
 * what must not differ.
 *
 * The words are rung-3 STATUS VALUES: sentence case, because the colour and the weight
 * already carry the meaning. 'Not Viable' therefore became 'Not viable' when this moved.
 */
import { tokenCase } from './labelCase.js';

/**
 * @typedef {object} ViabilityVerdict
 * @property {string} tone abstract tone token: 'good' | 'warn' | 'bad'
 * @property {string} label the verdict word, sentence case
 * @property {string} glyph '✓' for viable, '✗' for not viable, '' otherwise
 */

/**
 * The coherence verdict for a viability slice, for BOTH surfaces.
 *
 * `viable` wins over `verdict` where both are present, because that is the order the print
 * desk already resolved them in and it is the field the screen had. An unrecognised verdict
 * token falls through to `tokenCase`, NOT to a bare capitalisation: the token may carry an
 * underscore, and 'Vassal_extraction' is not a word a reader should ever see.
 *
 * @param {{ viable?: unknown, verdict?: unknown, verdictTone?: unknown }|null|undefined} v
 * @returns {ViabilityVerdict}
 */
export function viabilityVerdict(v) {
  const verdict = String(v?.verdict ?? '').toLowerCase();
  if (v?.viable === true || verdict === 'viable') {
    return { tone: 'good', label: 'Viable', glyph: '✓' };
  }
  if (v?.viable === false || verdict === 'notviable') {
    return { tone: 'bad', label: 'Not viable', glyph: '✗' };
  }
  if (verdict === 'fragile') return { tone: 'warn', label: 'Fragile', glyph: '' };
  if (verdict === 'collapsing') return { tone: 'bad', label: 'Collapsing', glyph: '' };
  return {
    tone: typeof v?.verdictTone === 'string' ? v.verdictTone : 'warn',
    label: String(tokenCase(v?.verdict ? String(v.verdict) : 'Uncertain')),
    glyph: '',
  };
}
