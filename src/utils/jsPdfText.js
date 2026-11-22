/**
 * The ONE jsPDF text pass.
 *
 * Both jsPDF-backed paid surfaces (the campaign book and the World Book) used to
 * carry a private copy of this function. Two copies of a sanitiser is a fork that
 * drifts: the two bodies already differed by whitespace, and a reader had no way
 * to tell whether that was deliberate. This module is the single home.
 *
 * ⭐ THE CLASS IS DERIVED FROM THE EMBEDDED FACE, NOT FROM AN ENCODER TABLE.
 * The pass used to admit `\x20-\x7E` and `\xA0-\xFF` — jsPDF's standard-14 Latin-1
 * reach — and replace everything else with a space. That bounded the two paid books
 * at 190 codepoints while the dossier drew 759, and it is why
 * tests/data/namingDataCharset.test.js could count 41 shipped pool names the books
 * could not print: `Đorđević` reached a paid page as "or evi", which is not a
 * truncation but a name a reader cannot recognise. The books now embed Lora
 * (src/utils/jsPdfBookFont.js), so the honest question is no longer "what can
 * WinAnsi encode" but "what can the embedded roster DRAW" — and that question is
 * answered by measuring the three .ttf files, never by a hand-typed list.
 *
 * ⚠ ONE-TIME PAID-SURFACE SHIFT, STATED: every campaign PDF and World Book
 * containing an affected name changes its painted bytes. Same-seed GENERATION does
 * not move — no pool length or order is touched, so namingDecontamination.test.js's
 * size pins hold. And the new set is NOT a strict superset of the old one: U+00AD
 * SOFT HYPHEN leaves it, because Lora has no glyph for it. That loss is nominal
 * (U+00AD is on the manifest's `invisible` ban list and the `\s+` collapse removed
 * it anyway) but it is declared here rather than discovered later.
 *
 * ⛔ WHY THE PASS AND THE EMBED ARE ONE ACT, IN BOTH DIRECTIONS. An embedded
 * 778-codepoint face behind a pass that still erased above U+00FF would cure
 * nothing. And a widened pass in front of no embedded face would be worse than the
 * defect: under Identity-H a codepoint below U+0100 with no glyph makes jsPDF's
 * `pdfEscape16` return early and TRUNCATE THE REST OF THE TEXT RUN.
 *
 * The compiler still measures the set this function actually admits by EXECUTING
 * it (see deriveCharsetTable in scripts/generate-custom-content-manifest.mjs), so
 * the charset table stays a measurement of the renderer rather than a second
 * hand-typed authority.
 *
 * @param {unknown} v the value to render into a jsPDF text run
 * @returns {string} the value with everything the embedded roster cannot draw
 *   replaced by a space, runs of whitespace collapsed, and the result trimmed
 */
import { bookDrawable } from './jsPdfBookFont.js';

export function sanitizeJsPdfText(v) {
  // Negated class allows TAB/LF/CR (0x09/0x0A/0x0D) through to the whitespace
  // collapse below, which is the only place they can survive to; every other
  // character is kept iff the embedded book roster carries a real glyph for it,
  // so nothing reaches the encoder that it would silently drop or truncate on.
  // eslint-disable-next-line no-control-regex
  return String(v||'').replace(/[^\x09\x0A\x0D]/g,(c)=>bookDrawable(c.charCodeAt(0))?c:' ').replace(/\s+/g,' ').trim();
}
