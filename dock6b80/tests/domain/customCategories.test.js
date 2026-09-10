import { describe, it, expect } from 'vitest';
import { BUILTIN_CATEGORIES, SERVICE_TYPES, serviceTypeKeyFromCategory, selectCustomCategories, categoryOptions } from '../../src/domain/customCategories.js';

describe('BUILTIN_CATEGORIES', () => {
  it('institutions use the 11 canonical generation categories', () => {
    expect(BUILTIN_CATEGORIES.institutions).toEqual([
      'Adventuring', 'Crafts', 'Criminal', 'Defense', 'Economy', 'Entertainment',
      'Exotic', 'Government', 'Infrastructure', 'Magic', 'Religious',
    ]);
    expect(BUILTIN_CATEGORIES.resources).toEqual(['water', 'land', 'special', 'subterranean']);
  });

  it('services group by buyable-service TYPE (labels), not institution categories', () => {
    // §14 — a custom service picks its service type at creation so it groups in
    // the dossier exactly like a generated service.
    expect(BUILTIN_CATEGORIES.services).toEqual(SERVICE_TYPES.map((t) => t.label));
    expect(BUILTIN_CATEGORIES.services).toContain('Food & Drink');
    expect(BUILTIN_CATEGORIES.services).not.toContain('Crafts'); // institution-only
  });
});

describe('serviceTypeKeyFromCategory', () => {
  it('maps a service-type label to its availableServices key', () => {
    expect(serviceTypeKeyFromCategory('Food & Drink')).toBe('food');
    expect(serviceTypeKeyFromCategory('Magical Services')).toBe('magic');
    expect(serviceTypeKeyFromCategory('Legal & Financial')).toBe('legal');
  });

  it('accepts a bare key, is case-insensitive, and returns null for unknown', () => {
    expect(serviceTypeKeyFromCategory('healing')).toBe('healing');
    expect(serviceTypeKeyFromCategory('FOOD & DRINK')).toBe('food');
    expect(serviceTypeKeyFromCategory('Crafts')).toBeNull(); // institution category, not a service type
    expect(serviceTypeKeyFromCategory('')).toBeNull();
    expect(serviceTypeKeyFromCategory(null)).toBeNull();
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
