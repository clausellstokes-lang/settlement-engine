/**
 * tests/generators/famineReservesHolder.test.js — R2-CODE-A P1 (c) and item 2 (the cold list
 * REVIEW-W2A-3, HIGH #891): "Stormthorpe is two bad weeks from genuine starvation; Military/Guard
 * controls the remaining reeds reserves" — the City granaries are held by Knud Leidolfsson of the
 * Arcane Council (the crisis cast's lever). The line named the leading power as the holder. The record
 * names the holder only in the crisis cast, which is derived AFTER the pressure sentence is drawn
 * (`steps/resolveCrisisCast.js` runs after `assembleSettlement`), so by the chair's ruling (c) the line
 * names none. Its food word reads the food record, now handed to the pressure lines
 * (`narrativeGenerator.js :: genPressureDetail`): "grain" where the record keeps grain.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { foodStoreWord } from '../../src/generators/economy/foodBalance.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe('the famine reserves line names no holder', () => {
  it('no famine line hands the reserves to the leading power', () => {
    const lines = PRESSURE_SENTENCES.famine({ name: 'X', topFaction: 'Military/Guard', govFaction: 'the city council', foodRecord: { hasGranary: true } }).map((l) => (typeof l === 'string' ? l : l.text));
    expect(lines.filter((l) => /Military\/Guard controls/.test(l))).toEqual([]);
    expect(lines).toContain('X is two bad weeks from genuine starvation; the remaining grain reserves are in few hands, and whoever holds them is not discussing it openly.');
  });
});

describe('the cold list\'s famine city, born as the app births it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-city-famine-1 (#891): no holder named; the reserves are the grain its granary keeps', () => {
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city', selectedStressesRandom: false, selectedStresses: ['famine'], _randomizePriorities: true }), null, { seed: 'rw3-city-famine-1', customContent: {} }));
    expect(foodStoreWord(s.economicState.foodSecurity.foodRecord)).toBe('grain');
    expect(s.pressureSentence).toBe('Stormthorpe is two bad weeks from genuine starvation; the remaining grain reserves are in few hands, and whoever holds them is not discussing it openly.');
  });
});
