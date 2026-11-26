/**
 * viabilityProvisionsArrive.test.js — G72 (6): FOOD THAT ARRIVES UNDER OTHER NAMES.
 *
 * `display/commoditiesShown.js :: isFoodSourceGood` read only the food sources' own goods (`FAILED_GOODS`); a town whose
 * printed arriving list holds "Preserved provisions" and no food pounds printed "feeds itself" beside it (the second reader
 * of point 119, two towns). It also answers yes to the whole words `provisions` and `game`, a frozen list of its own.
 * The oracle here is the page's printed arriving list read by name, not the leaf under test.
 *
 * RED FIRST (ef10a71f3a + cures 1, 2, 4, 5): both towns failed "prints no feeds-itself line beside arriving Preserved
 * provisions": r7x-town-68 "Flachsteig feeds itself and pays its own way." (L1), C dp-town-101 "What Breitenfeld eats it
 * grows, and what it spends it earns; some of what it uses is bought in." (L5); and the word list's own test.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { isFoodSourceGood } from '../../src/domain/display/commoditiesShown.js';

/** The second reader's dials (its `r7x` corpus). */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** The lines that say the place feeds itself (the reader's L1, L2, L4, L5). */
const FEEDS_ITSELF = /feeds itself|eats it grows|grows what it eats/;

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

const TOWNS = /** @type {Array<[string, () => any]>} */ ([
  ['r7x-town-68', () => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'town' }), null, { seed: 'r7x-town-68', customContent: {} })],
  ['C dp-town-101', () => generateSettlementPipeline(birthConfig({ settType: 'town' }), null, { seed: 'dp-town-101', customContent: {} })],
]);

describe('G72 (6): "feeds itself" is not printed beside arriving Preserved provisions', () => {
  test.each(TOWNS)('%s prints no feeds-itself line beside arriving Preserved provisions', (_key, make) => {
    const s = make();
    expect(tradeListsAsPrinted(s).imports.map(String), 'the premise: Preserved provisions arrive').toContain('Preserved provisions');
    expect(String(deriveViability(s).summary)).not.toMatch(FEEDS_ITSELF);
  }, 120_000);
});

describe('G72 (6): the word list', () => {
  test('provisions and game are food by the whole word; FAILED_GOODS reads as before', () => {
    expect(['Preserved provisions', 'Game and hides (furs, leather)', 'Provisions', 'game meat'].map(isFoodSourceGood)).toEqual([true, true, true, true]);
    expect(['Gaming tables', 'Salt', 'Hides', 'Ship provisioning'].map(isFoodSourceGood)).toEqual([false, false, false, false]);
  });
});
