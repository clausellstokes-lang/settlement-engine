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
 *           'Fragile' / 'Collapsing', reading BOTH `viable` and a `verdict` field.
 *
 * So a DM read "NOT COHERENT" on the tab and "Not Viable" in the document they had paid
 * for. That is not a case divergence; it is two different readings of one model, and
 * re-casing either would only have made them disagree more quietly.
 *
 * ⚠ THE FIRST VERSION OF THIS PARAGRAPH ALSO SAID the screen "could not say 'Fragile' or
 * 'Collapsing' at all", and treated that as a second defect this lift would fix. IT WAS NOT
 * ONE: measurement (see the function's own note below) shows no writer anywhere produces a
 * `verdict` token, so NEITHER surface could ever reach those two words. The `verdict` field
 * was never "richer" — it was empty. Keeping the claim here as a corrected record rather
 * than deleting it, because it is the reason the dead branches were carried across.
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
/**
 * @typedef {object} ViabilityVerdict
 * @property {string} tone abstract tone token: 'good' | 'warn' | 'bad'
 * @property {string} label the verdict word, sentence case
 * @property {string} glyph '✓' for viable, '✗' for not viable, '' otherwise
 */

/**
 * The coherence verdict for a viability slice, for BOTH surfaces.
 *
 * ⛔⛔ IT READS `viable` AND NOTHING ELSE, AND THAT IS A MEASUREMENT RATHER THAN A
 * SIMPLIFICATION (2026-09-19). The first cut read `verdict` and `verdictTone` as well, on
 * the reasonable-sounding ground that the print desk's private `verdictOf` had. It was
 * wrong, and the observed-shape ratchet is what said so: lifting this out of `src/pdf`
 * moved those reads into the scanned tree and they landed as TWO NEW reader-without-writer
 * identities — `verdict on economicViability` (3 reads) and `verdictTone on
 * economicViability` (2). MEASURED on the executed corpus, over 1,299 observed shapes, a
 * generated `economicViability` carries exactly:
 *
 *   ["dependencies","issues","metrics","plotHooks","suggestions","summary","viable","warnings"]
 *
 * No `verdict`. No `verdictTone`. Nothing in `src/` writes either onto that record, so the
 * 'Fragile' and 'Collapsing' branches could never fire on any world this estate can
 * generate, and the module's own header sentence — "the screen could not say 'Fragile' or
 * 'Collapsing' at all" — was describing words NEITHER surface could reach. The
 * reader-without-writer doctrine is CURE, NOT ADMIT: the dead arms are deleted rather than
 * banked behind a ratchet row.
 *
 * ⚠ THE PRINT SLICE'S OWN `verdict` IS NOT A COUNTER-EXAMPLE, and it is worth naming because
 * it looks like one. `pdf/lib/viewModel.js:586-587` synthesises `verdict` and `verdictTone`
 * onto its viability slice — but both are DERIVED FROM `viable` right there
 * (`v?.viable === true ? 'viable' : …`), so reading them back here was reading this
 * function's own input through a second spelling. The two branches they fed were exactly
 * redundant with the two `viable` branches above them.
 *
 * ⭐ ONE DELIBERATE BEHAVIOUR SHIFT, on the PDF only, and it CLOSES a divergence rather than
 * opening one. In the third state (`viable` neither true nor false) the page used to take
 * its tone from the slice's synthesised `verdictTone`, which is `'muted'` there, while the
 * screen — whose `v` is the raw record and has no such key — took the default `'warn'`. Two
 * tones for one fact, inside the very module written to end that. The third state is now
 * `'warn'` on both surfaces. The LABEL is unchanged ('Uncertain'), and no new word is
 * introduced.
 *
 * @param {{ viable?: unknown }|null|undefined} v
 * @returns {ViabilityVerdict}
 */
export function viabilityVerdict(v) {
  if (v?.viable === true) return { tone: 'good', label: 'Viable', glyph: '✓' };
  if (v?.viable === false) return { tone: 'bad', label: 'Not viable', glyph: '✗' };
  return { tone: 'warn', label: 'Uncertain', glyph: '' };
}
