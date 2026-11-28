/**
 * foodWordsGoodsListMarks.test.js — W2-C-LEAVES-7 item 8: THE GOODS-LIST LICENCE READS THE PAGE'S TRADE MARKS.
 *
 * F3's licence (`domain/coherence/foodWordsFindings.js :: isGoodsList`) reads an Exports row as goods, not a sentence,
 * when it is made only of the record's own export goods. The Economics tab's reader prints an entrepôt's carried good
 * with the page's transit mark ("Preserved foods (transit)", `tradeListDisplay.js :: pillAsPrinted`); since item 8 the
 * Foundry journal's row reads that same reader, so the mark was left over after the goods and the row was read as a
 * sentence about the table ("The place has no grain source." of "Desert grain", soak1k-9764 and -6525). The three
 * trade marks the lists print (`tradeMarkOf`: transit, naval route only, taxed by occupation) are no words of a
 * sentence; any other word still is.
 */
import { describe, expect, test } from 'vitest';
import { foodWordsFindings } from '../../../src/domain/coherence/foodWordsFindings.js';

const town = { economicState: { primaryExports: ['Desert grain', 'Meals and drink', 'Preserved foods'],
  foodSecurity: { foodRecord: { band: 'pressured', foodSources: ['livestock'], storageMonths: 2 } } } };

describe('an Exports row of the record\'s goods with the page\'s trade marks is goods, not a sentence', () => {
  test('anchored: a sentence about the table that names grain is read (the place has no grain source)', () => {
    expect(foodWordsFindings(town, 'The table holds desert grain and meals.').map((f) => f.code)).toEqual(['source_not_held']);
  });
  test('the journal\'s row with a transit mark is licensed (soak1k-9764\'s shape)', () => {
    expect(foodWordsFindings(town, '- **Exports:** Desert grain, Meals and drink, Preserved foods \\(transit\\)')).toEqual([]);
  });
  test('the other two marks, stacked, are licensed too', () => {
    expect(foodWordsFindings(town, '- **Exports:** Desert grain \\(taxed by occupation\\), Meals and drink, Preserved foods \\(transit\\) \\(naval route only\\)')).toEqual([]);
  });
  test('a bracket that is no trade mark is still read', () => {
    expect(foodWordsFindings(town, '- **Exports:** Desert grain, Meals and drink, Preserved foods \\(from the table\\)').map((f) => f.code)).toEqual(['source_not_held']);
  });
});
