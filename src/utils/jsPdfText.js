/**
 * The ONE jsPDF text pass.
 *
 * Both jsPDF-backed paid surfaces (the campaign book and the World Book) used to
 * carry a private copy of this function. Two copies of a sanitiser is a fork that
 * drifts: the two bodies already differed by whitespace, and a reader had no way
 * to tell whether that was deliberate. This module is the single home, hoisted
 * byte-identical from the campaign spelling at generateCampaignPDF.js so the move
 * cannot change a painted byte.
 *
 * The character class is deliberately NOT derived here. The compiler measures the
 * set this function actually admits by EXECUTING it (see deriveCharsetTable in
 * scripts/generate-custom-content-manifest.mjs), which keeps the charset table a
 * measurement of the renderer rather than a second hand-typed authority. Deriving
 * the class FROM that table is a separate, owner-gated act because it changes what
 * a paid PDF prints.
 *
 * @param {unknown} v the value to render into a jsPDF text run
 * @returns {string} the value with everything the encoder cannot draw replaced by
 *   a space, runs of whitespace collapsed, and the result trimmed
 */
export function sanitizeJsPdfText(v) {
  // Negated class allows TAB/LF/CR (0x09/0x0A/0x0D), printable ASCII,
  // and printable Latin-1; everything else gets replaced with space
  // so PDF-bound strings don't contain unprintable control bytes.
  // eslint-disable-next-line no-control-regex
  return String(v||'').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g,' ').replace(/\s+/g,' ').trim();
}
