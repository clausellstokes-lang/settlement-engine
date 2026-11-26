/**
 * traditionFieldRiteGrainPage.test.js — G72 (4): THE FIELD RULE READS THE PAGE'S GRAIN.
 *
 * `traditions/genesis.js :: fieldRiteRefused` read only the food record; a page whose own "Produced locally" or Exports
 * list prints a grain good (the whole word `grain`, lower-cased; `flour` does not count: a mill is not a field, G71) keeps
 * its rite of the fields. The lists are read through the leaf that prints them (`display/tradeListDisplay.js ::
 * tradeListsAsPrinted`).
 *
 * RED FIRST (ef10a71f3a): "the reader's case keeps The Procession of the Fields" failed: r7d-city-24 (desert, date palms,
 * sources ["fish"]) prints Exports "Desert grain" and Produced locally "grain", and was refused the rite.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { deriveFoundingTraditions, fieldRiteRefused } from '../../src/domain/traditions/genesis.js';
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { GENERATOR_VERSION } from '../../src/domain/settlement.schema.js';

/** The second reader's dials (its `r7x` corpus), with the desert set (its `r7d` keys). */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @type {any} */ let city;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  city = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'city', terrainOverride: 'desert' }), null, { seed: 'r7d-city-24', customContent: {} });
}, 120_000);

/** @param {any} s */
const printed = (s) => { const l = tradeListsAsPrinted(s); return [...l.exports, ...l.local].map((x) => String(x).toLowerCase()); };

describe('G72 (4): the reader\'s case, r7d-city-24', () => {
  test('the premise: the food record names fish alone, and the page prints grain', () => {
    expect(city.economicState.foodSecurity.foodRecord.foodSources).toEqual(['fish']);
    expect(printed(city).some((x) => /\bgrain\b/.test(x))).toBe(true);
  });
  test('the reader\'s case keeps The Procession of the Fields', () => {
    expect(fieldRiteRefused(city)).toBe(false);
    expect(deriveFoundingTraditions(city).map((t) => t.name)).toContain('The Procession of the Fields');
  });
});

describe('G72 (4): flour is not grain', () => {
  /** The furrow seed (traditionFieldRite.test.js): a plains road town whose row 1 draws a rite of the fields; its mill grinds
   * grain bought in (an import, not a list the rule reads), so the page prints flour made and sent out, and no grain. */
  const place = {
    _seed: 'furrow-4', tier: 'town', population: 3000, generatorVersion: GENERATOR_VERSION,
    config: { culture: 'celtic', terrainType: 'plains', tradeRouteAccess: 'road' },
    institutions: [{ name: 'Tavern' }, { name: 'Mill' }],
    economicState: { foodSecurity: { foodRecord: { foodSources: ['livestock', 'fish'] } }, localProduction: ['Flour'], primaryExports: ['Flour'], primaryImports: ['Grain'] },
  };
  test('a place whose page prints only flour is still refused', () => {
    expect(printed(place), 'the premise: the page prints flour, and no grain').toContain('flour');
    expect(printed(place).some((x) => /\bgrain\b/.test(x))).toBe(false);
    expect(fieldRiteRefused(place)).toBe(true);
    expect(deriveFoundingTraditions(place).map((t) => t.coreMotif.element)).not.toContain('field');
  });
});
