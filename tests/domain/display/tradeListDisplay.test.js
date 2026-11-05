/**
 * tests/domain/display/tradeListDisplay.test.js — CENSUS-3b unit 3: THE TRADE LISTS AS PRINTED
 * (`src/domain/display/tradeListDisplay.js`; the vocabulary rulings §7; the lane's rulings 1-4).
 *
 * @enforced-by npx vitest run tests/domain/display/tradeListDisplay.test.js
 */
import { describe, expect, it } from 'vitest';
import { displayTradeList, tradeMarkOf, tradeMarksOnPage } from '../../../src/domain/display/tradeListDisplay.js';
import { LUXURY_CLASS, NOT_A_GOOD } from '../../../src/data/tradeListDeclarations.js';
import { SUPPLY_CHAIN_NEEDS } from '../../../src/data/supplyChainData.js';
import { TERRAIN_DATA } from '../../../src/data/geographyData.js';
import { RESOURCE_DATA } from '../../../src/data/resourceData.js';
import { assertDeclarable } from '../../../src/domain/facts/factVocabulary.js';

const place = (tier, extra = {}) => ({ tier, institutions: [], ...extra });

describe('the luxury band (tier: ≥ village), filtered through filterDeclared', () => {
  const imports = ['Salt', 'Fine textiles', 'Luxury goods', 'Spices', 'Quality textiles', 'camel_herds', 'Grain'];
  it('a thorp and a hamlet print no luxury import; a village and above print them all', () => {
    expect(displayTradeList(imports, place('thorp'), { side: 'imports' })).toEqual(['Salt', 'Grain']);
    expect(displayTradeList(imports, place('hamlet'), { side: 'imports' })).toEqual(['Salt', 'Grain']);
    expect(displayTradeList(imports, place('village'), { side: 'imports' })).toEqual(imports);
    expect(displayTradeList(imports, place('city'), { side: 'imports' })).toEqual(imports);
  });
  it('the band rides the label under its trade mark, on the exports too', () => {
    expect(displayTradeList(['Fine textiles (transit)', 'Timber'], place('hamlet'))).toEqual(['Timber']);
  });
  it('every luxury row declares a declarable band', () => {
    for (const row of LUXURY_CLASS) for (const a of row.needs) expect(() => assertDeclarable(a)).not.toThrow();
  });
});

describe('the category errors leave the lists; the export wins', () => {
  it('a revenue or a fee is not a good shipped', () => {
    expect(displayTradeList(['Toll income', 'Market taxes', 'Wool', 'Transit trade (transit)'], place('town'))).toEqual(['Wool']);
    expect(NOT_A_GOOD).toContain('Toll revenue');
  });
  it('a good on both lists prints as an export only', () => {
    const exports = ['Fine textiles', 'Wool (taxed by occupation)'];
    expect(displayTradeList(['Fine textiles', 'Wool', 'Iron'], place('city'), { side: 'imports', exports })).toEqual(['Iron']);
  });
});

describe('the trade mark is a display read model; the legend reads the page', () => {
  it('reads each stored suffix into its kind, stacked marks included', () => {
    expect(tradeMarkOf('Salted fish (naval route only)')).toMatchObject({ label: 'Salted fish', kind: 'naval' });
    expect(tradeMarkOf('Wool (taxed by occupation)')).toMatchObject({ label: 'Wool', kind: 'occupation' });
    expect(tradeMarkOf('Silk (transit) (naval route only)')).toMatchObject({ label: 'Silk', kinds: ['transit', 'naval'] });
    expect(tradeMarkOf('Timber')).toMatchObject({ label: 'Timber', kind: null });
  });
  it('the transit legend has a mark to explain only when a transit item is printed', () => {
    expect(tradeMarksOnPage(['Timber', 'Silk (transit)']).has('transit')).toBe(true);
    expect(tradeMarksOnPage(['Timber']).has('transit')).toBe(false);
  });
});

describe('the camel chain declares the desert (the lane ruling 2)', () => {
  const camel = SUPPLY_CHAIN_NEEDS.trade_entrepot.chains.find((c) => c.id === 'camel_caravan');
  it('declares terrain: desert and no culture', () => {
    expect(camel.needs).toEqual(['terrain: desert']);
    expect((camel.needs || []).some((a) => a.startsWith('culture'))).toBe(false);
  });
  it('its resource is a desert resource, allowed on the desert alone', () => {
    expect(RESOURCE_DATA.camel_herds.terrain).toBe('desert');
    const allowing = Object.entries(TERRAIN_DATA).filter(([, t]) => (t.allowedResources || []).includes('camel_herds')).map(([k]) => k);
    expect(allowing).toEqual(['desert']);
  });
});
