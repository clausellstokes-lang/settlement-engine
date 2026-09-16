/**
 * civilityVectors.js — THE ONE TEST-VECTOR FILE for the civility guard
 * (docs/DESIGN_PROFILE_IMAGE.md §9).
 *
 * ⚠️ THE ANTI-DRIFT ARTIFACT. The guard has TWO MIRRORS — the client validator
 * (src/lib/civility.js) and the server validator (supabase/migrations/
 * 195_civility_guard.sql, `public.civility_blocked`). The design's ruling is
 * that "the two mirrors share ONE test-vector file so they can never drift".
 * This is that file. Every consumer imports these arrays; nobody writes their
 * own inline vectors. That is the writer/reader-drift hazard applied to
 * validation: a fix that lands on one mirror and not the other must turn a test
 * red HERE, at the shared contract, rather than in production on whichever
 * mirror was forgotten.
 *
 * Consumers:
 *   - tests/lib/civility.test.js          (the client mirror, executed)
 *   - tests/lint/civilityMirrors.test.js  (the server mirror's SQL is asserted
 *                                          to carry the same lists + folds; the
 *                                          SQL itself runs only against a live
 *                                          database, which this suite has none of)
 *
 * The vectors are deliberately CLINICAL and few. They are not a corpus — they
 * are the named fixture SETS the design pins:
 *   §9 "the Scunthorpe fixture set (innocent-containing-substring names PASS)"
 *   §9 "the evasion fixture set (casual leet/spacing variants FAIL)"
 */

/**
 * Confusable characters the evasion vectors need, CONSTRUCTED rather than
 * pasted. A literal zero-width space or Cyrillic lookalike sitting in this
 * source would be invisible in review, indistinguishable from its ASCII twin,
 * and liable to be silently normalized away by an editor — which would quietly
 * turn an evasion vector into a duplicate of a plain one and retire the pin
 * without anybody noticing. Naming the code point keeps the intent readable.
 */
const ZERO_WIDTH_SPACE = String.fromCharCode(0x200b);
const CYRILLIC_SMALL_DZE = String.fromCharCode(0x0455);

/**
 * THE SCUNTHORPE SET — text that MUST NOT be blocked.
 *
 * Every entry contains a blocked term as a SUBSTRING, or folds close to one.
 * A substring matcher convicts all of them; the token matcher clears all of
 * them. This set is the whole reason the guard matches tokens, and in a
 * fantasy-name product these are not exotic cases — they are Tuesday.
 *
 * @type {ReadonlyArray<{ text: string, why: string }>}
 */
export const CLEAN_VECTORS = Object.freeze([
  { text: 'Scunthorpe', why: 'the canonical case: contains "cunt" mid-word' },
  { text: 'Penistone', why: 'a real English town; contains an unfortunate substring' },
  { text: 'Cockburn', why: 'a common surname' },
  { text: 'Assassin of the Amber Gate', why: 'contains "ass"; a plausible NPC title' },
  { text: 'The Bass Quarter', why: '"bass" squeezes to "bas", never the entry' },
  { text: 'Classical analysis', why: '"class"/"analysis" both carry the substring' },
  { text: 'Niger', why: 'THE load-bearing length-floor case: squeezes onto a blocked entry, saved only by the length floor' },
  { text: 'Nigeria', why: 'the same fold, one letter longer' },
  { text: 'fagot', why: 'a bundle of sticks / a bassoon: squeezes onto a blocked entry, saved by the length floor' },
  { text: 'Shitake Grove', why: 'contains the term as a prefix of a longer token' },
  { text: 'Grape harvest at Rapeseed Hollow', why: 'both tokens merely contain "rape"' },
  { text: 'Nazir the Cartographer', why: 'a name that begins with a blocked term' },
  { text: 'a b', why: 'a two-letter run must not be joined into anything' },
  { text: 'Quiet Cartographer 418', why: 'a generated external_name with digits that leet-fold harmlessly' },
  { text: '', why: 'empty text is never blocked' },
]);

/**
 * THE EVASION SET — text that MUST be blocked.
 *
 * Casual evasion only: case, padding, repeats, leet digits, spacing, homoglyphs
 * and the closed suffix set. DETERMINED evasion is explicitly out of scope
 * (civility.js's ceiling note) and this set does not pretend otherwise.
 *
 * @type {ReadonlyArray<{ text: string, why: string }>}
 */
export const BLOCKED_VECTORS = Object.freeze([
  { text: 'shit', why: 'the bare term' },
  { text: 'SHIT', why: 'case fold' },
  { text: 'Sh1t', why: 'leet digit fold' },
  { text: 'shiiiit', why: 'repeated-character collapse' },
  { text: 'niggger', why: 'over-repeated letters still clear the length floor' },
  { text: 'sh it', why: 'split into two short chunks' },
  { text: 's h i t', why: 'spaced letter by letter' },
  { text: 'b1tch', why: 'leet inside a longer term' },
  { text: 'bitches', why: 'closed suffix set: -es' },
  { text: 'raping', why: 'closed suffix set: -ing' },
  { text: 'n4z1', why: 'two digits folding onto letters produce the term' },
  { text: 'you are a nazi', why: 'a blocked token inside an ordinary sentence' },
  { text: `Welcome, Sh${ZERO_WIDTH_SPACE}it`, why: 'zero-width padding inside the word' },
  { text: `${CYRILLIC_SMALL_DZE}hit`, why: 'Cyrillic homoglyph for the leading letter' },
]);

/**
 * VEIL vectors — private-origin text and the public projection it must produce.
 *
 * `masked` uses the literal veil mark so a change to VEIL_MARK turns these red
 * deliberately (the mark is user-visible product surface, not an implementation
 * detail). The pin that matters most is not the exact glyph but the two
 * invariants either side of it: the public artifact carries no flagged term,
 * and the author's stored original is untouched.
 *
 * @type {ReadonlyArray<{ text: string, masked: string, why: string }>}
 */
export const VEIL_VECTORS = Object.freeze([
  {
    text: 'The baron is a shit and the guards know it.',
    masked: 'The baron is a ▒▒▒ and the guards know it.',
    why: 'one term veiled, the sentence around it intact',
  },
  {
    text: 'Scunthorpe is fine but shit is not.',
    masked: 'Scunthorpe is fine but ▒▒▒ is not.',
    why: 'the Scunthorpe defense holds inside the veil path too',
  },
  {
    text: 'A quiet plot hook with nothing flagged.',
    masked: 'A quiet plot hook with nothing flagged.',
    why: 'clean text passes through byte-identical',
  },
]);
