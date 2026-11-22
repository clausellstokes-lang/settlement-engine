/**
 * tests/domain/foodWordsFindings.test.js — the food words agree with the food record
 * (FOOD lane acceptance 6; fix shape C of docs/GENERATION_ROOT_CAUSES_2026-11-02.md, appendix 1).
 *
 * src/domain/coherence/foodWordsFindings.js :: foodWordsFindings reads a settlement's rendered
 * text against its one food record. It is standalone; the chair wires it into the receipt.
 */
import { describe, expect, it } from 'vitest';

import { foodWordsFindings } from '../../src/domain/coherence/foodWordsFindings.js';
import { deriveFoodRecord } from '../../src/generators/economy/foodBalance.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const withRecord = (input) => ({ economicState: { foodSecurity: { foodRecord: deriveFoodRecord(input) } } });
const DEFICIT_PLACE = withRecord({ dailyNeed: 100, dailyProduction: 40, importCoverage: 5, magicOffset: 0, deficitPct: 55, surplusPct: 0, stressFamine: false, storageMonths: 1.5, hasGranary: false });
const FED_PLACE = withRecord({ dailyNeed: 100, dailyProduction: 115, importCoverage: 0, magicOffset: 0, deficitPct: 0, surplusPct: 15, stressFamine: false, storageMonths: 3, hasGranary: true });

describe('foodWordsFindings — the food words agree with the food record', () => {
  it('a surplus sentence planted on a deficit record is found', () => {
    const findings = foodWordsFindings(DEFICIT_PLACE, 'The farm surplus covers what the hamlet needs. Subsistence with surplus');
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings.map((f) => f.code)).toContain('surplus_without_surplus');
  });

  it('starving words, a harvest ratio dressed as days of reserves, and "no reserves" beside months in store are found', () => {
    const text = 'The settlement is starving. The settlement has 16 days of reserves. The hamlet holds no food against a bad year.';
    const codes = foodWordsFindings(FED_PLACE, text).map((f) => f.code);
    expect(codes).toEqual(['starving_without_deficit', 'reserve_days_disagree', 'no_reserves_with_stores']);
  });

  it('words that match the record are not findings', () => {
    expect(foodWordsFindings(FED_PLACE, 'Subsistence with surplus. The settlement has 90 days of reserves.')).toEqual([]);
    expect(foodWordsFindings(DEFICIT_PLACE, 'The settlement is starving.')).toEqual([]);
    expect(foodWordsFindings({}, 'The settlement is starving.'), 'no record, nothing to hold the words to').toEqual([]);
  });

  it('a "Needs X" row says the place LACKS X, so it is no claim to hold X (soak R7)', () => {
    const record = deriveFoodRecord({ dailyNeed: 100, dailyProduction: 60, importCoverage: 0, magicOffset: 0, deficitPct: 40, surplusPct: 0, stressFamine: false, storageMonths: 1.5, hasGranary: false, foodSources: ['livestock'] });
    const s = { economicState: { foodSecurity: { foodRecord: record } } };
    expect(foodWordsFindings(s, 'Needs Grain · affects: meals')).toEqual([]);
    expect(foodWordsFindings(s, 'Needs Grain · affects: meals, ale, lodging')).toEqual([]);
    // The excuse covers the needs clause only: a source claimed after it is still read.
    expect(foodWordsFindings(s, 'Needs Grain · affects: meals of fish from the local waters').map((f) => f.code)).toEqual(['source_not_held']);
  });

  it('the food lines this lane writes agree with the record across the six tiers', () => {
    const findings = [];
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (let i = 0; i < 4; i += 1) {
        const s = generateSettlementPipeline({ settType: tier }, null, { seed: `food-words-${tier}-${i}`, customContent: {} });
        const own = [s.economicState?.situationDesc, s.economicState?.foodSecurity?.storageNote].join('\n');
        findings.push(...foodWordsFindings(s, own).map((f) => `${tier}-${i}: ${f.code}`));
      }
    }
    expect(findings).toEqual([]);
  });
});
