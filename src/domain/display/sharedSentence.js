/**
 * domain/display/sharedSentence.js — DO TWO LINES SHARE A SENTENCE? One home for the test (BIRTH-1 D2b, the tenth chair's
 * ruling G8 (3) as re-set: "the SAME sentence test the Overview's reader uses (one function, both callers), so the draw and the
 * page cannot disagree about what 'shares a sentence' means"). A zero-import leaf; pure.
 *
 * Moved VERBATIM from `components/new/tabs/OverviewTab.jsx` (X-50, BOILERPLATE ONCE: the pressure line yields where it tells the
 * same pair's story as the notable connection's phrasing, the two sharing a sentence word for word under different openings).
 * A sentence is a run ending in . ! or ?, trimmed, its closing marks dropped, of four words or more. Its callers: the Overview
 * (the reader's drop, kept for places born before the draw's cure) and the pressure step (`narrativeGenerator.js ::
 * generatePressureSentence`, the draw's cure).
 */

/** The sentences of a line, as the test reads them. @param {unknown} text @returns {Set<string>} */
export const sentenceSetOf = (text) => new Set(String(text || '').split(/(?<=[.!?])\s+/)
  .map((x) => x.trim().replace(/[.!?]+$/, '')).filter((x) => x.split(/\s+/).length >= 4));

/** Does `a` share a sentence with `b`? @param {unknown} a @param {unknown} b @returns {boolean} */
export const sharesSentence = (a, b) => {
  const of = sentenceSetOf(b);
  return [...sentenceSetOf(a)].some((x) => of.has(x));
};
