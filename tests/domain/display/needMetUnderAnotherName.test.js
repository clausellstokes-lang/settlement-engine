/**
 * needMetUnderAnotherName.test.js — W2-C-LEAVES item 4(b), the precondition (2026-11-13; REVIEW-W2A-3 R2; the first
 * leaves lane's hand-back, "For W2-C-LEAVES": `needed` may print as "not met" only after a need an import meets under
 * another name is matched — 8 of 30 read were such: "Luxury goods" beside "Luxury textiles and exotic goods", "Metals"
 * beside "Iron", "Timber (for large vessels)" beside "Shipbuilding timber").
 *
 * The leaf of imports as printed (`tradeListDisplay.js :: importsAsPrinted`) now leaves out of `needed` a need an
 * arriving import meets by its material (`needMetBy`); a worked good meets no raw need.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { importsAsPrinted, needMetBy } from '../../../src/domain/display/tradeListDisplay.js';

/** The census's shape. @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};

describe('a need an import meets under another name is not a need left unmet (item 4(b))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: by material, never by a worked good, whole words', () => {
    const met = /** @type {Array<[string, string]>} */ ([
      ['luxury goods', 'Luxury textiles and exotic goods'], ['metals', 'Iron'], ['timber (for large vessels)', 'Shipbuilding timber (local shipbuilding stands cleared)'],
      ['gold/silver ore', 'Precious metals'], ['iron ore', 'Iron'], ['desert_salt', 'Salt'], ['Bulk grain and flour', 'Grain'],
      ['stone (for major construction)', 'Dressed stone (local quarry depleted)'], ['fine textiles', 'Luxury textiles and exotic goods'],
    ]);
    const unmet = /** @type {Array<[string, string]>} */ ([
      ['copper ore', 'Iron'], ['copper ore', 'Precious metals'], ['grapes', 'Grain'], ['mountain_timber', 'Ritual wood and herbs (ancient grove damaged)'],
      ['metals', 'Quality iron tools and fittings'], ['metals', 'Gold and silver torcs'], ['clay', 'Raw cloth'], ['spices', 'Salt'],
    ]);
    expect(met.filter(([need, imp]) => !needMetBy(need, imp))).toEqual([]);
    expect(unmet.filter(([need, imp]) => needMetBy(need, imp))).toEqual([]);
  });

  test('the leaf on the census\'s towns: r2r-city-0\'s luxury goods are met; r2r-town-17\'s mountain timber is not', () => {
    const city = birthCensus('r2r-city-0');
    const cityLists = importsAsPrinted(city);
    expect(cityLists.arriving, 'anchored: the city brings in luxury textiles').toContain('Luxury textiles and exotic goods');
    expect(cityLists.needed.filter((n) => n === 'luxury goods')).toEqual([]);
    const town = importsAsPrinted(birthCensus('r2r-town-17'));
    expect(town.needed).toContain('mountain_timber');
  }, 120000);
});
