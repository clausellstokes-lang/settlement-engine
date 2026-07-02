/**
 * tests/domain/goodsCatalogMemo.test.js — perf-advance surface fix (goodsCatalog).
 *
 * normalizeGood's fuzzy fallback is on the per-tick hot path (the regional
 * graph normalizes every settlement's trade lists every kernel tick), so
 * fuzzyMatch now (1) tokenizes the static catalog ONCE (FUZZY_CANDIDATES) and
 * (2) memoizes results per comparable-label key (FUZZY_MEMO, misses included,
 * bounded). The cache must be INVISIBLE: identical results for identical
 * inputs, fresh result objects every call, no drift after the memo's bound
 * clears. These tests pin that equivalence contract.
 */

import { describe, expect, test } from 'vitest';

import { normalizeGood, normalizeGoodsList } from '../../src/domain/region/goodsCatalog.js';

describe('goodsCatalog — fuzzyMatch memo is behavior-invisible', () => {
  test('exact, fuzzy, custom, and empty labels resolve identically across repeated calls', () => {
    const labels = [
      'Bulk grain and foodstuffs', // exact alias → grain
      'fresh river fish', // fuzzy (no verbatim alias) → fish
      'salted fish barrels', // fuzzy → fish
      'Dragon-scale kites', // no match → custom
      'Weapons and armour (ceremonial)', // annotation-stripped exact → arms
      '', // empty → null
      null, // null → null
    ];
    const first = labels.map(l => normalizeGood(l));
    const second = labels.map(l => normalizeGood(l));
    expect(second).toEqual(first);
    expect(first.map(g => g?.id ?? null)).toEqual([
      'grain', 'fish', 'fish', 'custom.dragon_scale_kites', 'arms', null, null,
    ]);
  });

  test('memoized fuzzy hits still return FRESH objects — a caller mutation cannot poison later calls', () => {
    const a = normalizeGood('fresh river fish');
    expect(a.id).toBe('fish');
    const b = normalizeGood('fresh river fish');
    expect(b).not.toBe(a);
    expect(b).toEqual(a);

    // Tamper with one result; the next call must be pristine.
    a.criticality = 999;
    a.label = 'tampered';
    a.aliases.length && a.aliases.push('tampered-alias');
    const c = normalizeGood('fresh river fish');
    expect(c.id).toBe('fish');
    expect(c.label).toBe('Fish');
    expect(c.criticality).toBe(0.82);
  });

  test('fuzzy MISSES are memoized without capturing the custom result shape', () => {
    const first = normalizeGood('Dragon-scale kites');
    const second = normalizeGood('Dragon-scale kites');
    expect(first.custom).toBe(true);
    expect(second).toEqual(first);
    expect(second).not.toBe(first);
  });

  test('results stay correct after the bounded memo clears (600 unique labels > the 512 cap)', () => {
    expect(normalizeGood('fresh river fish').id).toBe('fish');
    for (let i = 0; i < 600; i++) {
      // Unique unmatched labels churn the memo past its bound.
      expect(normalizeGood(`unheard-of ware ${i}`).id).toBe(`custom.unheard_of_ware_${i}`);
    }
    expect(normalizeGood('fresh river fish').id).toBe('fish');
    expect(normalizeGood('Bulk grain and foodstuffs').id).toBe('grain');
  });

  test('normalizeGoodsList dedupe by canonical id is unchanged', () => {
    const goods = normalizeGoodsList([
      'Bulk grain and foodstuffs', 'Grain', 'fresh river fish', 'salted fish barrels',
    ]);
    expect(goods.map(g => g.id)).toEqual(['grain', 'fish']);
  });
});
