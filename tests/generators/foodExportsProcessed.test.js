/**
 * tests/generators/foodExportsProcessed.test.js — F3 FOOD-WORDS unit 2b (the chair's ruling,
 * 2026-11-04): FOOD-EXPORTS' rule extended from the surplus goods to the processed food goods.
 * A processed food good whose input is the place's own food (cheese from its pastures, bread and
 * ale from its fields, preserved meat from its herds) is an export only where the food record
 * offers a surplus (domain/foodSurplus.js :: offersFoodSurplus). A good fed by imports (the salt
 * and wine entrepôts) or by the catch (the fish chains) keeps its own rule.
 * Red before the cure: soak1k-12, a thorp in famine, exported Mountain cheese.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { ownFoodGoodsHeldByFoodRecord } from '../../src/domain/foodSurplus.js';

const SHORT = { growsMoreThanEats: false, band: 'pressured' };
const SURPLUS = { growsMoreThanEats: true, band: 'surplus' };

describe('the processed-food rule', () => {
  it('drops an own-food processed good where the record offers no surplus', () => {
    expect(ownFoodGoodsHeldByFoodRecord(['Raw wool', 'Mountain cheese', 'Live sheep'], 'alpine_pasture', SHORT)).toEqual(['Raw wool', 'Live sheep']);
    expect(ownFoodGoodsHeldByFoodRecord(['Preserved foods', 'Leather goods'], 'livestock', SHORT)).toEqual(['Leather goods']);
  });
  it('keeps it on a surplus, and keeps import-fed and fish goods everywhere', () => {
    expect(ownFoodGoodsHeldByFoodRecord(['Mountain cheese'], 'alpine_pasture', SURPLUS)).toEqual(['Mountain cheese']);
    expect(ownFoodGoodsHeldByFoodRecord(['Preserved foods'], 'salt', SHORT)).toEqual(['Preserved foods']);
    expect(ownFoodGoodsHeldByFoodRecord(['Meals and drink', 'Preserved foods'], 'wine_spirits', SHORT)).toEqual(['Meals and drink', 'Preserved foods']);
    expect(ownFoodGoodsHeldByFoodRecord(['Salted fish', 'Smoked seafood'], 'fishing', SHORT)).toEqual(['Salted fish', 'Smoked seafood']);
  });
});

describe('exports on their seeds', () => {
  beforeAll(async () => { await ensureLaws(); });
  /** @param {number} i */
  const exportsOf = (i) => birth(i).settlement.economicState.primaryExports;
  it('soak1k-12: a thorp in famine exports no Mountain cheese', () => {
    expect(Array.isArray(exportsOf(12))).toBe(true);
    expect(exportsOf(12)).not.toContain('Mountain cheese'); // anchored: the line above proves the export list is read off the record, and the rule's executed twin above (SURPLUS keeps Mountain cheese) pins the member
  });
  it('soak1k-3: a town in famine exports no Baked goods, and keeps its salted fish', () => {
    const list = exportsOf(3);
    expect(list).not.toContain('Baked goods'); // anchored: the next line pins the salted fish in this same list
    expect(list).toEqual(expect.arrayContaining(['Salted fish', 'Smoked seafood']));
  });
  it('soak1k-5: an import-fed metropolis keeps its Preserved foods (the salt and wine trade)', () => {
    expect(exportsOf(5)).toContain('Preserved foods');
  });
});
