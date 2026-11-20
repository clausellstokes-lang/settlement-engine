/**
 * domain/display/outputInWords.js — WHAT THE TOWN'S WORK YIELDS, IN WORDS (PAGE-1's OUTPUT unit, F3b; BUILD.md
 * of 2026-11-20). The one reader every surface that used to print the economy's output figure calls.
 *
 * WHY. The Economics header printed `economicState.compound.economyOutput` as "n/100" beside the prosperity word,
 * and the PDF's Economics strip printed it bare. The figure is the economy dial after its drags
 * (`generators/priorityHelpers.js :: getInstFlags`, the economy output block): it never passed 50 in the chair's
 * 300 towns, and it stood two steps from the prosperity word (another model's) in 36% of them. A grade out of 100
 * beside a word it cannot agree with tells the DM nothing true. This reader says instead, in plain words, how much
 * of what its own work could yield the town gets.
 *
 * WHAT IT READS, BOTH STORED ON THE RECORD AT BIRTH (`economicState.compound`, stamped once): the figure
 * (`compound.economyOutput`) and what the town's work could yield, its own economy dial (`compound.raw.economy`).
 * The share is the one over the other; nothing the generator decided is redone. The words are the NAMED FRACTION
 * nearest the share (`FRACTIONS`: each row is the fraction its words say, so the ladder carries no threshold of its
 * own).
 *
 * ⛔ WHICH DRAG HOLDS IT BACK MOST IS NOT SAID HERE, AND WHY (the unit's STOP, reported to PAGE-1). The record keeps
 * the product and the drags' inputs (the market, crime, the magic dial, the crises, the neighbour) but not the
 * drags' weights: those live only inside `getInstFlags`. Ranking the drags would need a second copy of the
 * generator's weights here, which the tuning register refuses (the values are the owner's; a new file's dials are
 * at zero). The drag clause waits for the generator to export its weights as a registered table (or to store the
 * factors), which is generators/ work, not a display lane's.
 *
 * WHAT IT SAYS (no figure out of 100, none of the model's working):
 *   "It gets about three parts in four of what its work could yield."
 *   "It gets all its work could yield."
 *   "It gets more than its work alone could yield."
 * Null where the record holds no figure or no dial (then the surface prints nothing in the figure's place).
 *
 * Pure: no store, no React, no rng.
 */

/**
 * @typedef {{ economicState?: { compound?: { economyOutput?: unknown, raw?: { economy?: unknown } | null } | null } | null }} OutputRecord
 */

/** The named fractions, as [parts, of, words]: the share is said as the one it stands nearest. */
const FRACTIONS = Object.freeze(/** @type {ReadonlyArray<readonly [number, number, string]>} */ ([
  [1, 10, 'very little'],
  [1, 5, 'about a fifth'],
  [1, 4, 'about a quarter'],
  [1, 3, 'about a third'],
  [1, 2, 'about half'],
  [2, 3, 'about two parts in three'],
  [3, 4, 'about three parts in four'],
  [4, 5, 'about four parts in five'],
  [9, 10, 'nearly all'],
  [1, 1, 'all'],
  [6, 5, 'more than'],
]));

/** @param {unknown} v @returns {number | null} */
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/**
 * The share the town gets of what its work could yield, and the words for it; null with no figure or no dial.
 * @param {OutputRecord | null | undefined} settlement
 * @returns {{ share: number, words: string } | null}
 */
export function outputReading(settlement) {
  const c = settlement?.economicState?.compound;
  const figure = num(c?.economyOutput), dial = num(c?.raw?.economy);
  if (figure === null || dial === null || dial <= 0) return null;
  const share = figure / dial;
  let best = FRACTIONS[0];
  for (const row of FRACTIONS) if (Math.abs(share - row[0] / row[1]) < Math.abs(share - best[0] / best[1])) best = row;
  return { share, words: best[2] };
}

/**
 * The one line every surface prints in the figure's place, or null where the record holds no figure.
 * @param {OutputRecord | null | undefined} settlement
 * @returns {string | null}
 */
export function outputInWords(settlement) {
  const r = outputReading(settlement);
  if (!r) return null;
  if (r.words === 'all') return 'It gets all its work could yield.';
  if (r.words === 'more than') return 'It gets more than its work alone could yield.';
  return `It gets ${r.words} of what its work could yield.`;
}
