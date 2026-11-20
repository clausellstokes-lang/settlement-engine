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
 * THE RUNGS (the chair's ruling of 09:23 UTC): a house of the roster that is a RUNG of a chain's house (its kind, by
 * `houseHead`, not its spelling: "Sawmill (commercial)" beside the chain's "Sawmill") whose every input the one reading
 * calls absent (`src/domain/facts/houseInputAtHand.js`) must print its gap line too: a rung the gap writer never asked
 * printed no line and no mark (16 towns of the census's 720 at b193fa89a). The first two arms read the record alone and
 * run at a base that predates the fact; this arm reads the fact (run at a base, it counts what that base never asked).
 */
import { resourceGapLines } from '../../src/domain/display/validationOnPage.js';
import { institutionDisplayName } from '../../src/domain/display/institutionDisplayName.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { isMaterializedCustomContent } from '../../src/domain/content/customContentSemanticAuthority.js';
import { RESOURCE_CHAINS } from '../../src/data/goods/chains.js';
import { CHAIN_INPUTS, houseHead, houseInputAtHand } from '../../src/domain/facts/houseInputAtHand.js';

/** What a house makes of its input, by the record's own good names (the economy's output gate for a sawn good). */
const OUTPUTS = Object.freeze({ Sawmill: /^Milled (?:lumber|timber)$/i });

/** @param {unknown} x @returns {any[]} */
const arr = (x) => (Array.isArray(x) ? x : []);

/**
 * @param {any} record a born settlement
 * @param {{ rungHeads?: ReadonlyArray<string> | null }} [options] the kinds whose rungs are read (the cured scope, the chair's
 *   R2: the sawmill; `null` reads every kind: the measured kind for the next round, 774 in 328 towns of the 720)
 * @returns {Array<{ house: string, chain: string, lines: string[] }>} every house the record calls short whose gap line
 *   the page does not print, or whose output the town still makes or sells (`chain` then reads `output: <good>`)
 */
export function houseInputSplits(record, { rungHeads = ['sawmill'] } = {}) {
  const lines = resourceGapLines(record).map((l) => String(l.impact));
  // RE-KEYED BY IDENTITY (BAR8-J-ROWS G1, 2026-11-17): the page says no input reaches a house by its general gap line, or, for a
  // house whose supply story has its own line (worked out on its spent ground; the failed venture), by that line alone: the
  // general line beside it is struck (one house, one material, one line)
  const said = (/** @type {string} */ l) => l.match(/^No .+ reach(?:es)? the (.+)\.$/)?.[1] ?? l.match(/^The (.+?) (?:is|are) (?:worked out|failing):/)?.[1] ?? l.match(/^The (.+?) stands? abandoned\b/)?.[1];
  const reached = new Set(lines.map(said).filter(Boolean).map((h) => String(h).toLowerCase()));
  /** @type {Array<{ house: string, chain: string, lines: string[] }>} */
  const out = [];
  const seen = new Set();
  for (const g of arr(record?.resourceAnalysis?.gaps)) {
    if (!g?.institution || g.kind !== 'missing' || seen.has(g.institution)) continue;
    seen.add(g.institution);
    const shown = String(institutionDisplayName(g.institution) || g.institution).replace(/^access to (?:an? )?/i, '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    if (!reached.has(shown)) out.push({ house: String(g.institution), chain: String(g.chain), lines });
    const made = /** @type {RegExp | undefined} */ (/** @type {Record<string, RegExp>} */ (OUTPUTS)[g.institution]);
    const es = record?.economicState || {};
    const sold = made ? [...arr(es.localProduction), ...arr(es.primaryExports)].map(String).find((x) => made.test(x)) : undefined;
    if (sold) out.push({ house: String(g.institution), chain: `output: ${sold}`, lines });
  }
  // THE RUNGS: a house of a chain's kind, not of its spelling, its every input absent, and no gap line names it.
  for (const inst of liveInstitutions(record)) {
    const name = String(inst?.name || '');
    if (!name || isMaterializedCustomContent(inst) || seen.has(name)) continue;
    if (rungHeads && !rungHeads.includes(houseHead(name))) continue;
    const chains = Object.entries(RESOURCE_CHAINS).filter(([key, c]) => CHAIN_INPUTS[key]
      && !arr(c.processingInstitutions).includes(name) && arr(c.processingInstitutions).some((h) => houseHead(h) === houseHead(name)));
    if (!chains.length || chains.some(([key, c]) => houseInputAtHand(record, key, inst, c) !== 'missing')) continue;
    const exploited = arr(record?.resourceAnalysis?.exploitation?.fullyExploited).concat(arr(record?.resourceAnalysis?.exploitation?.partiallyExploited));
    if (chains.some(([, c]) => exploited.some((x) => x?.rawResource === c.rawResource))) continue; // a chain worked here: the gap writer's own rule
    const shown = String(institutionDisplayName(name) || name).replace(/^access to (?:an? )?/i, '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
    if (!reached.has(shown)) out.push({ house: name, chain: `rung of ${chains.map(([k]) => k).join(',')}`, lines });
  }
  return out;
}
