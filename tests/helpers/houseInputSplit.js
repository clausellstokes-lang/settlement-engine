/**
 * tests/helpers/houseInputSplit.js — THE DETECTOR OF KIND R1 (BAR4-RECORD; BRIEF-BAR4 amendment K1): A HOUSE SHORT OF ITS
 * INPUT THAT THE PAGE STILL COUNTS. Pure, over a town's RECORD and the lines its page prints from it: for every house the
 * record's own gap calls short (`resourceAnalysis.gaps[]`, an `institution` row of kind `missing`), the page's gap
 * reader must print that house's gap line ("No timber reaches the sawmill."; `validationOnPage.js :: resourceGapLines`),
 * the line the row's shortage mark is tied to; and the economy must not still make or sell what the idle house would
 * have made (`OUTPUTS`: the sawmill's sawn goods in `economicState.localProduction` and `primaryExports`, the lists the
 * trade pills and the chain cards print). An instance is a disagreement: the record says short and the page is silent,
 * or the town still makes the short house's output. It reads no sentence a reader met; it reads the record's gap, the
 * page's own reader and the record's trade lists.
 *
 * It does not import the fact both writers now call (`src/domain/facts/houseInputAtHand.js`), so it runs unchanged at a
 * base that predates that home (where it fires: 67 rows in 64 towns of the census's 720 at c4ac1ef84a).
 */
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { institutionDisplayName } from '../../src/domain/display/institutionDisplayName.js';

/** What a house makes of its input, by the record's own good names (the economy's output gate for a sawn good). */
const OUTPUTS = Object.freeze({ Sawmill: /^Milled (?:lumber|timber)$/i });

/** @param {unknown} x @returns {any[]} */
const arr = (x) => (Array.isArray(x) ? x : []);

/**
 * @param {any} record a born settlement
 * @returns {Array<{ house: string, chain: string, lines: string[] }>} every house the record calls short whose gap line
 *   the page does not print, or whose output the town still makes or sells (`chain` then reads `output: <good>`)
 */
export function houseInputSplits(record) {
  const lines = resourceGapLines(record).map((l) => String(l.impact));
  const reached = new Set(lines.map((l) => l.match(/^No .+ reach(?:es)? the (.+)\.$/)?.[1]).filter(Boolean).map((h) => String(h).toLowerCase()));
  /** @type {Array<{ house: string, chain: string, lines: string[] }>} */
  const out = [];
  const seen = new Set();
  for (const g of arr(record?.resourceAnalysis?.gaps)) {
    if (!g?.institution || g.kind !== 'missing' || seen.has(g.institution)) continue;
    seen.add(g.institution);
    const shown = String(institutionDisplayName(g.institution) || g.institution).replace(/^access to (?:an? )?/i, '').toLowerCase();
    if (!reached.has(shown)) out.push({ house: String(g.institution), chain: String(g.chain), lines });
    const made = /** @type {RegExp | undefined} */ (/** @type {Record<string, RegExp>} */ (OUTPUTS)[g.institution]);
    const es = record?.economicState || {};
    const sold = made ? [...arr(es.localProduction), ...arr(es.primaryExports)].map(String).find((x) => made.test(x)) : undefined;
    if (sold) out.push({ house: String(g.institution), chain: `output: ${sold}`, lines });
  }
  return out;
}
