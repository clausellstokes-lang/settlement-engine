/**
 * THE TONIGHT SHEET'S FAMINE LINE READS THE TOWN'S GRAIN (JOIN-4 item 4, the chair's brief of 2026-11-14): the sheet's
 * head carries the OFFICIAL vantage of the worst crisis (summary/tonightSheet.js :: crisisOf, via
 * crisis/crisisSummaryVantage.js :: crisisSummaryForSurface). The famine's official line "{name} has lost a second
 * harvest." printed in towns whose record grows no grain (54 of 58 as named). The vantage half (the r3-code-c lane's
 * R3-CODE-C-10 (c)) takes the record's facts as a fourth argument and speaks its twin "{name} has gone short of food for
 * a second season." where `atomHolds('grain', facts)` is false; the caller hands it `factsOf(source)`.
 *
 * Births the cure was not tuned on: every r2s famine birth of three sizes and every rr3 famine birth of the random route,
 * seeds 0-5, and the siege-with-famine births of the smallest and largest sizes, seeds 0-3, born whole by the reader's cfgFor. The arm on the sheet itself (composeTonightSheet(s).opening).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { composeTonightSheet } from '../../../src/domain/summary/tonightSheet.js';
import { crisisSummaryForSurface } from '../../../src/domain/crisis/crisisSummaryVantage.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../../src/domain/facts/factVocabulary.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's cfgFor for the two seed families used here. @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-(\d+)$/));
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true });
};

const SEEDS = [];
for (let n = 0; n < 6; n += 1) {
  for (const size of ['village', 'town', 'city']) SEEDS.push(`r2s-famine-${size}-${n}`);
  for (const size of ['thorp', 'town', 'metropolis']) SEEDS.push(`rr3-${size}-famine-rand-${n}`);
}
// Under a siege as well: the sheet's lead is the worst crisis, and no line of it may say a second harvest was lost.
for (let n = 0; n < 4; n += 1) for (const size of ['thorp', 'metropolis']) SEEDS.push(`rr3-${size}-under_siege+famine-rand-${n}`);

const HARVEST = /has lost a second harvest\./;
const SHORT = /has gone short of food for a second season\./;

/** @type {Array<{ seed: string, town: string, grain: boolean, bare: string, sheet: string }>} */
let towns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  towns = SEEDS.map((seed) => {
    const s = /** @type {any} */ (generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
    const famine = [].concat(s.stress || []).find((/** @type {any} */ e) => e?.type === 'famine');
    return { seed, town: String(s.name), grain: atomHolds('grain', factsOf(s)) !== false, bare: String(famine ? crisisSummaryForSurface(famine, s.name, 'tonight') : ''), sheet: String(composeTonightSheet(s).opening || '') };
  });
}, 600000);

describe("the Tonight sheet's famine line reads the town's grain", () => {
  it('a town whose record grows no grain is never told on the sheet that it has lost a second harvest; it is told it has gone short', () => {
    const watched = towns.filter((t) => !t.grain && HARVEST.test(t.bare));
    // The arm meets the line it watches: towns with no grain where the vantage, handed no facts, says "a second harvest".
    expect(watched.length, 'no-grain famine towns whose bare official line is the harvest line').toBeGreaterThanOrEqual(3);
    expect(watched.filter((t) => HARVEST.test(t.sheet)).map((t) => `${t.seed}: ${t.sheet}`)).toEqual([]);
    // Where the famine leads the sheet, its twin is said, of the town by name.
    const famineLed = watched.filter((t) => t.sheet.startsWith('Famine.'));
    expect(famineLed.length, 'of them, sheets the famine leads').toBeGreaterThanOrEqual(3);
    expect(famineLed.filter((t) => !SHORT.test(t.sheet) || !t.sheet.includes(t.town)).map((t) => `${t.seed}: ${t.sheet}`)).toEqual([]);
  });

  it('the guard: a town whose record grows grain keeps the harvest line on the sheet', () => {
    const guard = towns.filter((t) => t.grain && HARVEST.test(t.bare));
    expect(guard.length, 'grain-growing famine towns whose official line is the harvest line').toBeGreaterThanOrEqual(1);
    expect(guard.filter((t) => !HARVEST.test(t.sheet)).map((t) => `${t.seed}: ${t.sheet}`)).toEqual([]);
  });
});
