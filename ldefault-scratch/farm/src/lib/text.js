/**
 * text.js — pure string helpers shared by components, exporters, and domain code.
 *
 * Keep this module dependency-free: deterministic domain code imports it, so it
 * must stay pure (no imports, no environment access, no randomness).
 */

/**
 * Truncate `text` to at most `maxChars` characters without cutting mid-word.
 *
 * - Input at or under the limit passes through untouched (no ellipsis).
 * - When cut, the trailing partial word is dropped and `ellipsis` is appended;
 *   the result (ellipsis included) never exceeds `maxChars`.
 * - If the first word alone overflows the budget, it is hard-cut so something
 *   readable still survives (single-giant-word inputs).
 *
 * @param {*} text       coerced via String(); null/undefined become ''
 * @param {number} maxChars  maximum length of the returned string
 * @param {string} [ellipsis] marker appended when text was cut (default '…')
 * @returns {string}
 */
export function truncateAtWord(text, maxChars, ellipsis = '…') {
  const t = text == null ? '' : String(text);
  if (t.length <= maxChars) return t;
  const budget = Math.max(1, maxChars - ellipsis.length);
  let cut = t.slice(0, budget);
  // If the character just past the budget is not whitespace, the slice ended
  // mid-word — drop the partial word.
  if (!/\s/.test(t[budget])) cut = cut.replace(/\S+$/, '');
  cut = cut.trimEnd();
  return (cut || t.slice(0, budget)) + ellipsis;
}
