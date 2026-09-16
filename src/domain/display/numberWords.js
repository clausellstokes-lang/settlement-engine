/**
 * numberWords.js — THE ONE SPELLING OF A SMALL COUNT, as a zero-import leaf.
 *
 * The house rule the Herald wave settled (§754.3, as the owner then narrowed it):
 * abstract engine scalars die at mint, and HONEST CONCRETE COUNTS IN WORLD WORDS
 * STAY. "Three settlements" is a fact a reader can act on; "0.62" is the engine
 * reading its own arithmetic aloud. So a count reaches a reader as a NUMBER WORD,
 * and a surface that speaks one mints no digit.
 *
 * ── WHY THIS FILE EXISTS RATHER THAN A SECOND TABLE ─────────────────────────
 * This table was written for NAME-4's force-composition prose and lived inside it,
 * module-private. WEAVE SEAM-5 needs the same spelling for a settings surface, and
 * the two honest options were a second copy of a twenty-four-word table or one
 * leaf with two consumers. The estate has already paid for the first answer once —
 * six copies of `fnv1a32` are a chartered consolidation for exactly this reason —
 * so the table moves HERE and `forceComposition.js` reads it from here. The words
 * are unchanged, so no prose anywhere moves; this is a re-home, not a re-write.
 *
 * ZERO IMPORTS, AND THAT IS LOAD-BEARING. One consumer is a war-display leaf on the
 * PDF chain and the other is a campaign-settings control on the Library surface;
 * a shared spelling must not drag either one's graph into the other's chunk.
 */

/**
 * The closed table, 1..24 — every value NAME-4's contingent bands can produce, and
 * far past anything a re-map prompt will. Index 0 is the empty string so the array
 * is index-addressed rather than offset by one.
 * @type {ReadonlyArray<string>}
 */
export const NUMBER_WORDS = Object.freeze([
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four',
]);

/**
 * The word for a count, or 'several' outside the table — which is honest rather
 * than wrong, and is the fallback NAME-4 chose when this table was its own.
 *
 * ⚠ THE BODY IS VERBATIM, INCLUDING WHAT IT DOES WITH ZERO. `NUMBER_WORDS[0]` is
 * the empty string, which is falsy, so a count of zero reads 'several' — and that
 * is preserved deliberately, because this is a RE-HOME and a re-home that quietly
 * improved an edge case would move NAME-4's prose without a word said. A caller
 * with nothing to report must not call this at all; SEAM-5's reader guards on the
 * count before it asks for a word.
 *
 * @param {number} n
 * @returns {string}
 */
export function numberWord(n) {
  return NUMBER_WORDS[n] || 'several';
}
