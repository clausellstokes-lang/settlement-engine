/**
 * data/fortuneMeritLines.js — THE MERIT'S SENTENCE (FORTUNE U5b; the seventh chair's ruling of 22:26 UTC 2026-11-20,
 * vetoable by the owner; the wordings and the time words are the chair's, VERBATIM; A and C re-worded, and the `{ago}`
 * time words retired, by the chair's ruling of 03:38 UTC 2026-11-22: no wording says the event struck, since a tyranny or
 * an occupation is lived under, not a blow).
 *
 * Under the fortune law (version 2), a place `fortune/fortuneMerits.js :: meritsOf` credits with a catastrophe weathered
 * within a generation says so in its governance paragraph, directly after the standing sentence
 * (`display/governanceAccount.js`, "2. THE STANDING"), on screen and in print alike. Each wording opens on the event's
 * STORED name (`weatheredCatastrophe(record).name`); `{place}` is the paragraph's place and `{seat}` the governing power
 * as the paragraph carries it mid-sentence (`powerNameInProse`).
 *
 * THE TIME WORDS band the event's own `yearsAgo`, never a figure: at most `FORTUNE_MERIT_RECENT_YEARS` reads `recent`;
 * above it, to the law's `FORTUNE_LAW_TUNING.standing.weatheredWithinYears` (`fortune/fortuneLaw.js`, DRAFT), reads
 * `generation`. Every wording takes the one `{past}` slot. The recent cut-off is a WORDING threshold, not a law tuning (the
 * seventh chair's ruling of 01:48 UTC 2026-11-22): it lives here beside the words it chooses, and nothing that computes
 * the merit, the birth or any score reads it.
 *
 * THE PICK among A, B and C is the kernel's mixed keyed pick (`kernel/proseHash.js :: pickVariantMixed`), drawn through
 * the one door (`facts/drawDeclared.js :: drawDeclared`) at its one call site; no roll, no draw count changed. The lines
 * declare no atom: the merit's predicate gates the pool, and every field it and the fills read is served on every shared
 * read (COMMON-RULES 14(e)); none is a house or a fact about crime.
 *
 * Pure data. Imported only by `display/governanceAccount.js` (lazy, its FIRSTPAINT-4 pin), never by an eager module.
 *
 * @enforced-by tests/domain/fortuneMeritSentence.test.js
 */

/** The three wordings, in the chair's order A, B, C. */
export const FORTUNE_MERIT_LINES = Object.freeze([
  Object.freeze({ id: 'A', text: '{event} is {past} at {place}; the place came through it, and its people hold the more firmly to {seat}.' }),
  Object.freeze({ id: 'B', text: '{event} is {past} at {place}; having come through it, people there are slower to turn on {seat}.' }),
  Object.freeze({ id: 'C', text: '{event} is {past} at {place}, and coming through it has left its people readier to stand by {seat}.' }),
]);

/** The recent band's cut-off: an event at most this many years ago takes the `recent` time words. */
export const FORTUNE_MERIT_RECENT_YEARS = 10;

/** The time words, by band of the event's `yearsAgo`. */
export const FORTUNE_MERIT_TIME_WORDS = Object.freeze({
  recent: Object.freeze({ past: 'only a few years past' }),
  generation: Object.freeze({ past: 'within living memory' }),
});
