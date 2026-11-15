/**
 * domain/summary/storesSpanWords.js — THE SPAN OF THE STORES IN WORDS, A PURE LEAF (TAIL-TIES-6, the chair's ruling (T23)
 * of 2026-11-15, vetoable by the owner): `storesSpanWords`, the days a month of stores is read as (`DAYS_PER_MONTH`) and
 * the number words it says them in, moved verbatim out of `summary/tonightSheet.js`, which re-exports the two exported
 * names, so every reader is one reading.
 *
 * WHY A LEAF. `display/defenseDisplay.js` (the Defence tab's food endurance line, TAIL-DEFECON-D) read the span from
 * `tonightSheet.js`. That one edge pulled the tonight sheet and everything it reads (the plot hooks, the hook lines, the
 * crisis summary, the cast) into the derivation's EAGER `engine-core` chunk, whose static edges into the lazy
 * `coherence-lazy` chunk put it in first paint (tests/architecture/engineCoreLazyEdge.test.js), and it closed the import
 * cycle crisisCast | crisisHooks | defenseDisplay | plotHooks | factsOf | tonightSheet (tests/architecture/
 * layerBoundaries.test.js) whose evaluation order left `crisisHooks.js` reading an uninitialised binding. This file
 * imports nothing, so wherever it rides it carries no edge; both ends read it.
 *
 * Pure: no randomness, no clock.
 */

/** The days a month of stores is read as (the food record counts stores in months): a year of
 *  1461 days in four, over 48 months. */
export const DAYS_PER_MONTH = 1461 / 48;

/**
 * THE SPAN OF THE STORES IN WORDS — ONE HOME (R2-CODE-B item 3; the cold list REVIEW-W2A-3 #149
 * #856 #872: "No granary; a few weeks in the larder." and "a granary, a few weeks of grain" where
 * the record holds `storageMonths` 0.1, about three days). Every span under a month was "a few
 * weeks". It is now true at days, weeks and months, read from the record's months: under a day,
 * "less than a day"; up to ten days, "about N days"; under a month, "about N weeks"; from a month,
 * the months as before ("about a month", "N months"). Any line that speaks of the stores' span in
 * words reads this (the Defence tab's food endurance line is owed the same switch:
 * defenseDisplay.js :: monthsInWords, the third leaves seat's file).
 * ROUND THREE (the chair's ruling on the increment's #472 #668 #769: "No granary; two months in household stores" where the
 * record holds 1.5): THE WORDS CONTAIN THE FIGURE, and a band's word is true of every figure in the band. From a month up
 * the span is said with "about", to the nearest half month below three months ("about a month and a half", "about two and a
 * half months") and to the nearest month from there ("about three months"): never a whole number rounded up and said bare.
 * @param {number} months the record's `storageMonths` @returns {string} '' for no stores
 */
export function storesSpanWords(months) {
  if (!Number.isFinite(months) || months <= 0) return '';
  if (months >= 1) {
    const halves = Math.round(months * 2);
    if (halves >= 6) return `about ${numberWord(Math.round(months))} months`; // three months and up: the nearest month
    const whole = Math.floor(halves / 2);
    const half = halves % 2 === 1;
    if (whole <= 1) return half ? 'about a month and a half' : 'about a month';
    return half ? `about ${numberWord(whole)} and a half months` : `about ${numberWord(whole)} months`;
  }
  const days = months * DAYS_PER_MONTH;
  if (days < 1) return 'less than a day';
  const d = Math.round(days);
  if (d <= 1) return 'about a day';
  if (d <= 10) return `about ${numberWord(d)} days`;
  return `about ${numberWord(Math.max(2, Math.round(days / 7)))} weeks`;
}

/** @param {number} n @returns {string} */
function numberWord(n) {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  return n >= 0 && n < words.length ? words[n] : String(n);
}
