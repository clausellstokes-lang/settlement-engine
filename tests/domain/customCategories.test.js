import { describe, it, expect } from 'vitest';
import { BUILTIN_CATEGORIES, selectCustomCategories, categoryOptions } from '../../src/domain/customCategories.js';

describe('BUILTIN_CATEGORIES', () => {
  it('institutions + services use the 11 canonical generation categories', () => {
    expect(BUILTIN_CATEGORIES.institutions).toEqual([
      'Adventuring', 'Crafts', 'Criminal', 'Defense', 'Economy', 'Entertainment',
      'Exotic', 'Government', 'Infrastructure', 'Magic', 'Religious',
    ]);
    expect(BUILTIN_CATEGORIES.services).toEqual(BUILTIN_CATEGORIES.institutions);
    expect(BUILTIN_CATEGORIES.resources).toEqual(['water', 'land', 'special', 'subterranean']);
  });
});

describe('selectCustomCategories', () => {
  it('returns only non-builtin categories in use, across all types', () => {
    const cc = {
      institutions: [{ name: 'A', category: 'Economy' }, { name: 'B', category: 'Smuggling Ring' }],
      tradeGoods: [{ name: 'C', category: 'Relics' }],
    };
    expect(selectCustomCategories(cc)).toEqual(['Relics', 'Smuggling Ring']); // sorted, builtins excluded
  });

  it('dedupes case-insensitively, keeping first-seen casing', () => {
    const cc = {
      institutions: [{ name: 'A', category: 'Relics' }],
      resources: [{ name: 'B', category: 'relics' }],
    };
    expect(selectCustomCategories(cc)).toEqual(['Relics']);
  });

  it('disappears when no item uses it (derived from live content)', () => {
    const withCustom = { institutions: [{ name: 'A', category: 'Smuggling Ring' }] };
    expect(selectCustomCategories(withCustom)).toContain('Smuggling Ring');
    // Remove the only item using it → option is gone.
    expect(selectCustomCategories({ institutions: [] })).toEqual([]);
    expect(selectCustomCategories({})).toEqual([]);
  });
});

describe('categoryOptions', () => {
  it('offers a custom category authored on one type in every type’s dropdown', () => {
    const cc = { institutions: [{ name: 'A', category: 'Smuggling Ring' }] };
    expect(categoryOptions('institutions', cc).customs).toContain('Smuggling Ring');
    expect(categoryOptions('resources', cc).customs).toContain('Smuggling Ring'); // shared across types
    expect(categoryOptions('tradeGoods', cc).builtins).toEqual(BUILTIN_CATEGORIES.tradeGoods);
  });

  it('never lists a built-in as a custom', () => {
    const cc = { institutions: [{ name: 'A', category: 'Economy' }] };
    expect(categoryOptions('institutions', cc).customs).not.toContain('Economy');
  });
});
