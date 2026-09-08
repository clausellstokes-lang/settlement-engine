import { describe, it, expect } from 'vitest';
import { foldTradeCategories } from '../../src/domain/region/foldTradeCategories.js';

// §14 — custom goods fold into their declared trade CATEGORY (satisfies) so the
// Economics tab shows one bucket per category, not a pill per custom good.
describe('foldTradeCategories', () => {
  it('folds a custom good into its demand-category label + records the member', () => {
    const idx = new Map([['dragonbone greatswords', 'military']]);
    const r = foldTradeCategories(['Dragonbone Greatswords'], idx);
    expect(r.labels).toEqual(['Weapons & armour']);
    expect(r.members).toEqual({ 'Weapons & armour': ['Dragonbone Greatswords'] });
    expect(r.custom).toEqual(['Weapons & armour']);
  });

  it('folds a free-text ("Other") category under the typed label as-is', () => {
    const idx = new Map([['rune-etched idols', 'Dragoncraft']]);
    const r = foldTradeCategories(['Rune-etched Idols'], idx);
    expect(r.labels).toEqual(['Dragoncraft']);
    expect(r.members).toEqual({ Dragoncraft: ['Rune-etched Idols'] });
  });

  it('collapses two goods of the same category into one line with both members', () => {
    const idx = new Map([['dragonbone greatswords', 'military'], ['mithril plate', 'military']]);
    const r = foldTradeCategories(['Dragonbone Greatswords', 'Mithril Plate'], idx);
    expect(r.labels).toEqual(['Weapons & armour']);
    expect(r.members['Weapons & armour']).toEqual(['Dragonbone Greatswords', 'Mithril Plate']);
  });

  it('passes built-in labels through untouched and not flagged custom', () => {
    const idx = new Map([['dragonbone greatswords', 'military']]);
    const r = foldTradeCategories(['Grain', 'Dragonbone Greatswords', 'Timber'], idx);
    expect(r.labels).toEqual(['Grain', 'Weapons & armour', 'Timber']);
    expect(r.custom).toEqual(['Weapons & armour']); // built-ins not custom
  });

  it('keeps a custom good with no satisfies under its own name + flagged via priorCustom', () => {
    const idx = new Map(); // good has no satisfies entry
    const r = foldTradeCategories(['Singing Swords'], idx, new Set(['singing swords']));
    expect(r.labels).toEqual(['Singing Swords']);
    expect(r.members).toEqual({});
    expect(r.custom).toEqual(['Singing Swords']);
  });

  it('is order-preserving and dedupes a category that also matches a built-in label', () => {
    const idx = new Map([['fine wine', 'luxury']]);
    // a built-in "Luxury goods" export already present + a custom luxury good
    const r = foldTradeCategories(['Luxury goods', 'Fine Wine'], idx);
    expect(r.labels).toEqual(['Luxury goods']); // deduped into one line
    expect(r.members['Luxury goods']).toEqual(['Fine Wine']);
  });

  it('returns empty structures for empty input', () => {
    const r = foldTradeCategories([], new Map());
    expect(r).toEqual({ labels: [], members: {}, custom: [] });
  });
});
