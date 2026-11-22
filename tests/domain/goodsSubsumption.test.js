/**
 * tests/domain/goodsSubsumption.test.js — subsumption merges on proof, not
 * resemblance.
 *
 * The wave's broadened generic aliases ("metal goods", "metal ore", "sea
 * salt", "fuel wood") pushed fuzzyMatch's token overlap far enough that
 * DISTINCT goods started sharing a canonical id — "Baked goods" became iron,
 * "Smoked seafood" became salt — and subsumeTradeGoods/reconcileTradeLists
 * erased real exports on a guess. These pins hold the fix:
 *   • only an EXACT alias hit may merge labels or drop an export;
 *   • fuzzy-only labels stay verbatim, like unrecognized ones;
 *   • raw/custom labels key on exact lowercase text, so labels differing
 *     only by parenthetical never collapse (the opaque contract);
 *   • economyReconcilePass flattens the §14 customTradeLabels OBJECT
 *     ({exports, imports}) instead of throwing, and re-reconciles exports
 *     after demand imports land.
 */

import { describe, expect, test } from 'vitest';
import { subsumeTradeGoods, reconcileTradeLists, exactGoodId } from '../../src/domain/region/goodsCatalog.js';
import { finalizeTradeLists } from '../../src/generators/steps/economyReconcilePass.js';

describe('subsumeTradeGoods: distinct goods never merge on a fuzzy match', () => {
  // Each pair fuzzy-matched to one canonical id pre-fix and collapsed to a
  // single label. They are different goods; both must survive, in order.
  const DISTINCT_PAIRS = [
    ['Iron ore', 'Baked goods'],      // iron via 'metal goods'
    ['Iron ore', 'Precious metals'],  // iron via 'metal ore'
    ['Salt', 'Smoked seafood'],       // salt via 'sea salt' ('seafood'.startsWith('sea'))
    ['Charcoal', 'Sacred wood'],      // fuel via 'fuel wood'
    ['Salted fish', 'Fish oil'],      // both ~ fish, neither an exact alias
  ];

  test('the confirmed fuzzy-merge pairs all stay distinct', () => {
    for (const pair of DISTINCT_PAIRS) {
      expect(subsumeTradeGoods(pair)).toEqual(pair);
    }
  });

  test('same-canonical duplicates still collapse via exact aliases', () => {
    expect(subsumeTradeGoods(['Sea salt', 'Rock salt', 'Salt'])).toEqual(['Salt']);
    expect(subsumeTradeGoods(['Iron ore', 'Refined iron and metalwork', 'Metal goods']))
      .toEqual(['Iron ore']);
  });

  test('annotated exact-alias labels still merge, annotation surviving', () => {
    const out = subsumeTradeGoods(['Refined iron', 'Iron ore (local mines exhausted)']);
    expect(out).toEqual(['Iron ore (local mines exhausted)']);
  });

  test('identical unrecognized labels still dedupe', () => {
    expect(subsumeTradeGoods(['Glassware', 'Glassware'])).toEqual(['Glassware']);
  });
});

describe('subsumeTradeGoods: raw/custom labels key on exact text', () => {
  test('custom labels differing only by parenthetical never merge (opaque contract)', () => {
    const labels = ['Healing crystals (raw)', 'Healing crystals (cut)'];
    const opaque = new Set(labels.map((l) => l.toLowerCase()));
    expect(subsumeTradeGoods(labels, { opaque })).toEqual(labels);
  });

  test('unrecognized labels with different annotations never merge even without the opaque set', () => {
    const labels = ['Healing crystals (raw)', 'Healing crystals (cut)'];
    expect(subsumeTradeGoods(labels)).toEqual(labels);
  });
});

describe('reconcileTradeLists: exact contradictions only', () => {
  test('never drops an export whose import match was only fuzzy', () => {
    expect(reconcileTradeLists(['Baked goods'], ['Refined iron and metalwork']))
      .toEqual(['Baked goods']);
    expect(reconcileTradeLists(['Iron ore'], ['Baked goods'])).toEqual(['Iron ore']);
  });

  test('exact-alias contradictions still reconcile, sparing transit', () => {
    expect(reconcileTradeLists(
      ['Iron ore', 'Metal goods (transit)'], ['Refined iron and metalwork']
    )).toEqual(['Metal goods (transit)']);
  });
});

describe('economyReconcilePass.finalizeTradeLists', () => {
  test('§14 customTradeLabels object does not throw; both sub-arrays stay opaque', () => {
    const eco = {
      primaryExports: ['Grain', 'Bulk grain and foodstuffs', 'Dragonbone charms'],
      primaryImports: ['Voidglass shards'],
      customTradeLabels: { exports: ['Dragonbone charms'], imports: ['Voidglass shards'] },
    };
    expect(() => finalizeTradeLists(eco)).not.toThrow();
    expect(eco.primaryExports).toEqual(['Grain', 'Dragonbone charms']);
    expect(eco.primaryImports).toEqual(['Voidglass shards']);
  });

  test('missing customTradeLabels (vanilla generation) still works', () => {
    const eco = { primaryExports: ['Grain', 'Grain and malt'], primaryImports: [] };
    expect(() => finalizeTradeLists(eco)).not.toThrow();
    expect(eco.primaryExports).toEqual(['Grain']);
  });

  test('a demand import canonicalizing to a surviving export re-reconciles it away, sparing transit', () => {
    const eco = {
      primaryExports: ['Quality cloth', 'Furs and pelts (transit)'],
      primaryImports: ['Luxury textiles', 'Furs and pelts'],
    };
    finalizeTradeLists(eco);
    expect(eco.primaryExports).toEqual(['Furs and pelts (transit)']);
    expect(eco.primaryImports).toEqual(['Luxury textiles', 'Furs and pelts']);
  });
});

describe('exactGoodId — the display predicates\' safe comparison key', () => {
  test('alias spellings of one good share an id; distinct goods do not', () => {
    // Same canonical good across alias renames (what subsumption may surface):
    expect(exactGoodId('Boots and shoes')).toBe(exactGoodId('Leather goods'));
    expect(exactGoodId('Peat fuel')).toBe(exactGoodId('Coal'));
    // The fuzzy traps stay null — never a guessed id:
    expect(exactGoodId('Baked goods')).toBeNull();
    expect(exactGoodId('Smoked seafood')).not.toBe(exactGoodId('Sea salt'));
    // Distinct goods resolve to distinct ids:
    expect(exactGoodId('Iron ore')).not.toBe(exactGoodId('Leather goods'));
  });

  test('services and unrecognized labels return null', () => {
    expect(exactGoodId('Dragonbone charms')).toBeNull();
    expect(exactGoodId('')).toBeNull();
    expect(exactGoodId(null)).toBeNull();
  });
});

describe('preferTradeLabel: the transit marker survives same-canonical merges', () => {
  test('an occupation-taxed entrepot pair keeps its (transit) label and the reconcile sparing', () => {
    // Occupation maps the whole list, yielding two annotated iron labels —
    // the (transit) one must win the merge or reconcileTradeLists drops the
    // survivor against an iron import (the exact sparing the docstring promises).
    const exports_ = ['Iron ore (taxed by occupation)', 'Refined iron (transit) (taxed by occupation)'];
    const merged = subsumeTradeGoods(exports_);
    expect(merged).toEqual(['Refined iron (transit) (taxed by occupation)']);
    expect(reconcileTradeLists(merged, ['Iron'])).toEqual(merged);
  });
});
