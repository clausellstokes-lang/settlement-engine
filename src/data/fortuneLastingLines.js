/**
 * data/fortuneLastingLines.js — THE SECOND MERIT'S SENTENCE, A PLACE THAT HAS LASTED (FORTUNE U7b; the chair's words E57
 * of 08:21 UTC 2026-11-22 and E57 amended of 08:27 UTC, vetoable by the owner; the wordings and the time words are the
 * chair's, VERBATIM: band-neutral, no "stand", no possessive of {seat}, no verb that must agree with {seat}).
 *
 * Under the fortune law (version 2), a place `fortune/fortuneMerits.js :: meritsOf` credits with 'lasting' says so in
 * its governance paragraph (`display/governanceAccount.js`, "2. THE STANDING"), directly after the standing sentence and
 * after the first merit's sentence where that prints, on screen and in print alike. `{place}` is the paragraph's place and
 * `{seat}` the governing power as the paragraph carries it mid-sentence (`powerNameInProse`).
 *
 * THE FOUR ROWS (E57 amended (1)): A, B and C (`when: 'alone'`) are DRAWN where LASTING credits alone; the fixed row
 * (`when: 'both'`) prints where both merits credit AND the first merit's sentence printed in the paragraph (the chair's
 * ruling of 12:28 UTC 2026-11-22), with no draw, and opens on the name, not "It", because the sentence before it has the
 * event as its subject; where both credit but that sentence did not print, the drawn rows serve, as where LASTING is
 * alone. E57 amended (2): where a drawn row prints and the sentence directly before is one of the bare standing lines
 * that open on the place, the drawn row opens on "It" in place of `{place}`.
 *
 * THE TIME WORDS band the record's `history.age`, never a figure: under `FORTUNE_LASTING_CENTURIES_YEARS` reads
 * `generations`, otherwise `centuries`. Every row takes the one `{span}` slot. The cut-off is a WORDING threshold, not a
 * law tuning (E57): it lives here beside the words it chooses, and nothing that computes the merit, the birth or any
 * score reads it.
 *
 * THE PICK among A, B and C is the kernel's mixed keyed pick (`kernel/proseHash.js :: pickVariantMixed`) keyed on
 * `${place}::${age}`, drawn through the one door (`facts/drawDeclared.js :: drawDeclared`) at its one call site; no roll,
 * no draw count changed. The rows declare no atom: the merit's predicate gates the pool, and every field it and the fills
 * read is served on every shared read (tests/domain/fortuneLastingVeil.test.js); none is a house or a fact about crime.
 *
 * Pure data. Imported only by `display/governanceAccount.js` (lazy, its FIRSTPAINT-4 pin), never by an eager module.
 *
 * @enforced-by tests/domain/fortuneLastingSentence.test.js
 */

/** The four rows, in the chair's order: A, B and C drawn where LASTING credits alone; the fixed row where both credit. */
export const FORTUNE_LASTING_LINES = Object.freeze([
  Object.freeze({ id: 'A', when: 'alone', text: '{place} has lasted {span}, and its people count that in favour of {seat}.' }),
  Object.freeze({ id: 'B', when: 'alone', text: '{place} has been here {span}, and people there are loath to see {seat} unsettled.' }),
  Object.freeze({ id: 'C', when: 'alone', text: '{place} has endured {span}, and its people give {seat} some of the credit.' }),
  Object.freeze({ id: 'both', when: 'both', text: '{place} has also lasted {span}, and that too counts for {seat}.' }),
]);

/** The centuries band's cut-off: a place at least this many years old takes the `centuries` time words. */
export const FORTUNE_LASTING_CENTURIES_YEARS = 200;

/** The time words, by band of the record's `history.age`. */
export const FORTUNE_LASTING_TIME_WORDS = Object.freeze({
  generations: Object.freeze({ span: 'for generations' }),
  centuries: Object.freeze({ span: 'for centuries' }),
});
