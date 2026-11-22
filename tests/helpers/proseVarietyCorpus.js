/**
 * tests/helpers/proseVarietyCorpus.js — THE VARIETY CORPUS (ARCH §3.4, §7).
 *
 * WHY A THIRD CORPUS, AND WHY IT IS NOT THE DRIFT ONE. Every draw in this model is a function
 * of the SEED and the pool identity: `avalanche32(fnv1a32(seed::block::pool)) % eligible`.
 * The golden master's 525 rows carry ONE seed on 516 of them, so on the DRIFT corpus two
 * towns in one state cell draw the same variant with probability 1 — a corpus on which every
 * repetition instrument reads its own construction back. The VARIETY corpus is the same 525
 * CONFIGURATIONS re-seeded, so the state cells are the golden's and the draws are not.
 *
 * ⛔ A PER-CAR INSTRUMENT, NEVER PER-CI. 525 × 8 is 4,200 generations. It runs from
 * `scripts/prose-duplicate-units.mjs` at a car, prints its cost, and gates nothing.
 *
 * ⚠ THE SEED COUNT IS AN ARGUMENT AND THE FIGURES CARRY IT. A rate measured at 8 seeds and a
 * rate measured at 60 are different measurements of the same corpus, and a receipt that prints
 * one without its seed count has said nothing a reader can reproduce.
 */
import { goldenCorpus, keyOf } from './goldenMasterCorpus.js';

export { keyOf };

/** ARCH §3.4's own count: eight seeds over the 525 configurations, 4,200 towns. */
export const VARIETY_SEEDS = 8;

/**
 * The corpus. `configs` may be a slice (a plant measures on one) and `seeds` may be raised
 * (a per-pool arithmetic needs independent DRAWS, and one seed is one draw per pool however
 * many towns carry it).
 * @param {{seeds?: number, configs?: ReadonlyArray<object>}} [options]
 * @returns {Array<object>} configurations, each carrying its own `_seed`
 */
export function varietyConfigs(options = {}) {
  const seeds = Number.isInteger(options.seeds) && options.seeds > 0 ? options.seeds : VARIETY_SEEDS;
  const base = options.configs || goldenCorpus();
  /** @type {Array<object>} */
  const out = [];
  for (let i = 0; i < seeds; i++) {
    for (const config of base) out.push({ ...config, _seed: `prose-${i}` });
  }
  return out;
}

/**
 * The (position, text) pair separator, written as an ESCAPE and never as a raw byte. A raw
 * NUL in source is the corruption class `tests/lint/controlBytes.test.js` exists to refuse,
 * and a separator that CAN occur in the subject (a space, a colon) makes two different pairs
 * read as one, silently. U+0000 occurs in neither a mount name nor a hex digest.
 */
const PAIR_SEPARATOR = '\u0000';

/**
 * THE DUPLICATE-UNIT RATE (ARCH §7) — the owner-facing staleness statistic, and the one
 * instrument that has power at this corpus size.
 *
 * A UNIT is a (position, text) pair: the mount plus rung index a sentence was read at, and
 * the sentence itself. The rate is the share of unit INSTANCES whose (position, text) pair is
 * seen on more than one town, pooled over every cell. It is a share of INSTANCES and not of
 * distinct pairs, because the owner's question is "how often does a reader meet a sentence
 * they have already met", and a pair seen on 400 towns is 400 such meetings.
 *
 * ⛔ IT IS NOT A DEFECT RATE AND IT IS NOT A FLOOR. Two towns in one state cell SHOULD read
 * the same fact; whether they read the same WORDS is what the pieces and the faces change.
 * The number ships as a BASELINE before any text moves, with its N and its seed count, so
 * that every later car's claim is a measured delta rather than an impression.
 * @param {ReadonlyArray<{cell: string, textSha: string}>} cells
 * @returns {{units: number, duplicateUnits: number, rateBp: number, distinctPairs: number,
 *   pairsSeenTwice: number, byPosition: Array<[string, {units: number, duplicates: number}]>}}
 */
export function duplicateUnits(cells) {
  /** @type {Map<string, number>} the (position, text) pair to how many town-instances carry it */
  const pairs = new Map();
  /** @type {Map<string, {units: number, duplicates: number}>} */
  const byPosition = new Map();
  for (const cell of cells) {
    const position = positionOf(cell.cell);
    const pair = `${position}${PAIR_SEPARATOR}${cell.textSha}`;
    pairs.set(pair, (pairs.get(pair) || 0) + 1);
  }
  let units = 0;
  let duplicateUnitsCount = 0;
  for (const cell of cells) {
    const position = positionOf(cell.cell);
    const pair = `${position}${PAIR_SEPARATOR}${cell.textSha}`;
    const seen = pairs.get(pair) || 0;
    units += 1;
    const seat = byPosition.get(position) || { units: 0, duplicates: 0 };
    seat.units += 1;
    if (seen > 1) { duplicateUnitsCount += 1; seat.duplicates += 1; }
    byPosition.set(position, seat);
  }
  return {
    units,
    duplicateUnits: duplicateUnitsCount,
    rateBp: units ? Math.round((duplicateUnitsCount / units) * 10000) : 0,
    distinctPairs: pairs.size,
    pairsSeenTwice: [...pairs.values()].filter((n) => n > 1).length,
    byPosition: [...byPosition].sort((a, b) => b[1].units - a[1].units),
  };
}

/**
 * A cell key is `${config}::${audience}::${mount}::${rungIndex}`; the POSITION is everything
 * but the configuration, because the same mount at the same rung on two towns is one position.
 * @param {string} cell
 * @returns {string}
 */
export function positionOf(cell) {
  const parts = String(cell).split('::');
  return parts.slice(1).join('::');
}
