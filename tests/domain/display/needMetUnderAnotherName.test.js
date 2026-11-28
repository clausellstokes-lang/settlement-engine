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

  // RE-KEYED BY IDENTITY 2026-11-18 (LEFT-KEYS K4, R8): the supply rule (BIRTH-3, BR4/BR5) has r2r-town-17 buy its timber in,
  // so its mountain timber need is met now. The same claim on r2r-village-3 (a road, no crisis): its need of mountain timber
  // is met by no import, under any name (one of the 720's five that print it needed).
  // RE-KEYED BY IDENTITY 2026-11-19 (LASTCLOSE-DOORS, the last close's whole check, C1 (b)): FAULTS-BIRTH's second ring (point 63,
  // 5eb9f6add; measured at its parent and at the merge) proves r2r-village-3's managed forest by its Woodcutter's camp (the
  // Resources tab prints it, the house tells a local story, no house is short), so the record names no critical import of
  // mountain timber and its need is truly met. The same claim on r2r-village-20 (a village, no crisis): its need of mountain
  // timber is met by no import under any name (it brings in salt, silver, livestock); one of the 720's four that print it needed.
  test('the leaf on the census\'s towns: r2r-city-0\'s luxury goods are met; r2r-village-20\'s mountain timber is not', () => {
    const city = birthCensus('r2r-city-0');
    const cityLists = importsAsPrinted(city);
    expect(cityLists.arriving, 'anchored: the city brings in luxury textiles').toContain('Luxury textiles and exotic goods');
    expect(cityLists.needed.filter((n) => n === 'luxury goods')).toEqual([]);
    const town = importsAsPrinted(birthCensus('r2r-village-20'));
    expect(town.needed).toContain('mountain_timber');
  }, 120000);
});

// RULING-R (the eleventh chair, 2026-11-27), R8 luxury (unit B4): a need the place's OWN resources supply (a commodity the
// Resources tab lists for it, `commoditiesShown.js :: commoditiesShown`, not marked failed) is not printed under "Needed, and
// not brought in", matched as an import is (`needMetBy`). The one pair that collapses over the measure's C and V: "luxury
// goods" beside the chip "luxury" of gemstone deposits or precious-metal veins (the chair reads the list). The measure's
// worked example: C dp-village-2 printed "Needed, and not brought in: stone, luxury goods." beside its "luxury" chip.
describe('a need the place\'s own resources supply is not a need left unmet (RULING-R, R8 luxury)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  test('C dp-village-2: its gemstones\' "luxury" leaves "luxury goods" off the need list; its stone need stays', async () => {
    const { commoditiesShown } = await import('../../../src/domain/display/commoditiesShown.js');
    const s = generateSettlementPipeline(birthConfig({ settType: 'village' }), null, { seed: 'dp-village-2', customContent: {} });
    expect(s.config.nearbyResources).toContain('gemstone_deposits');
    expect(commoditiesShown(s).filter((c) => !c.failed).map((c) => c.label)).toContain('luxury');
    expect(importsAsPrinted(s).needed).toEqual(['stone']);
  }, 120000);
  test('the same village without its own "luxury" keeps the need (the chip, not the place, answers it)', () => {
    const s = generateSettlementPipeline(birthConfig({ settType: 'village' }), null, { seed: 'dp-village-2', customContent: {} });
    const bare = { ...s, resourceAnalysis: { ...s.resourceAnalysis, availableResources: s.resourceAnalysis.availableResources.filter((/** @type {string} */ k) => k !== 'luxury') } };
    expect(importsAsPrinted(bare).needed).toEqual(['stone', 'luxury goods']);
  }, 120000);
});
