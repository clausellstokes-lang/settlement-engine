/**
 * The revenues that left the trade lists (CENSUS-3c; the chair's ruling R-P 2): the income table
 * prints, as a display read model, a revenue the record holds the fact behind — and nothing the
 * record does not. Pages move; records do not.
 */
import { describe, it, expect } from 'vitest';
import { revenuesOffTheLists } from '../../../src/domain/display/tradeListDisplay.js';

/** @param {object} [over] */
const town = (over = {}) => ({
  tier: 'town',
  institutions: [{ name: 'Town gate', category: 'Defense' }, { name: 'Market square', category: 'Economy' }],
  config: { tradeRouteAccess: 'road' },
  economicState: {
    primaryExports: ['Toll revenue', 'Transit trade', 'Cultural tourism revenue', 'Wool'],
    primaryImports: ['Warehousing and logistics services'],
    incomeSources: [{ source: 'Property Rents', percentage: 100 }],
  },
  ...over,
});

describe('revenuesOffTheLists — R-P 2', () => {
  it('prints a revenue whose fact the record holds, once, in the income table’s words', () => {
    expect(revenuesOffTheLists(town()).map((r) => r.text)).toEqual(['Tolls', 'Transit trade']);
  });

  it('prints nothing an income row of the same family already speaks for', () => {
    const t = town();
    t.economicState.incomeSources = [{ source: 'Toll Revenue', percentage: 60 }, { source: 'Property Rents', percentage: 40 }];
    expect(revenuesOffTheLists(t)).toEqual([]);
  });

  it('refuses a revenue the record contradicts: no toll without a gate, no transit on an isolated road', () => {
    expect(revenuesOffTheLists(town({ institutions: [] })).map((r) => r.text)).toEqual(['Transit trade']);
    expect(revenuesOffTheLists(town({ config: { tradeRouteAccess: 'isolated' } }))).toEqual([]);
  });

  it('never homes a label with no fact behind it, nor an import of a service', () => {
    const texts = revenuesOffTheLists(town()).map((r) => r.text);
    expect(texts).toContain('Transit trade');
    expect(texts).not.toContain('Cultural tourism revenue'); // anchored: the line above proves the same list holds its fact-backed revenue
    expect(texts.join(' ')).not.toMatch(/warehous/i); // anchored: the same list is proven to hold 'Transit trade' two lines above
  });

  it('a record with no list reads empty', () => {
    expect(revenuesOffTheLists({})).toEqual([]);
    expect(revenuesOffTheLists(null)).toEqual([]);
  });
});
