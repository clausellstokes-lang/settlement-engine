/**
 * finishedGoodsCategory.test.js — §14 label→category classifier guard.
 *
 * finishedGoodsCategoryOf used to guard only falsy input, so a whitespace label
 * (' ') slipped through, and the symmetric reversed arm `l.includes(s)` let a
 * short input match the FIRST multi-word index phrase that happened to contain
 * it — a single space matched "Quality weapons and armour" → misclassified as
 * 'military'. The fix trims, rejects inputs shorter than 3 chars, and keeps only
 * the s.includes(l) direction so a short input can't match a longer phrase.
 */
import { describe, expect, test } from 'vitest';
import { finishedGoodsCategoryOf } from '../../src/data/economicData.js';

describe('finishedGoodsCategoryOf — short / whitespace inputs do not misclassify', () => {
  test("a single-space label returns null (not 'military')", () => {
    expect(finishedGoodsCategoryOf(' ')).toBeNull();
  });

  test('a 1-2 char label returns null', () => {
    expect(finishedGoodsCategoryOf('a')).toBeNull();
    expect(finishedGoodsCategoryOf('ab')).toBeNull();
    expect(finishedGoodsCategoryOf('  ')).toBeNull();
  });

  test('falsy input still returns null', () => {
    expect(finishedGoodsCategoryOf('')).toBeNull();
    expect(finishedGoodsCategoryOf(null)).toBeNull();
    expect(finishedGoodsCategoryOf(undefined)).toBeNull();
  });

  test('a real index label still classifies', () => {
    expect(finishedGoodsCategoryOf('Advanced weapons and armour (bulk contract)')).toBe('military');
    expect(finishedGoodsCategoryOf('Incense and votive candles')).toBe('religious');
  });

  test('a keyword-only label still classifies via the fallback', () => {
    expect(finishedGoodsCategoryOf('Ornate ceremonial sword')).toBe('military');
  });
});
