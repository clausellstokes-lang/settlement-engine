/**
 * Faction compendium tests — ADD_FACTION offers built-in faction names from
 * the descriptor database, grouped by category, minus whatever the settlement
 * already has.
 */

import { describe, test, expect } from 'vitest';
import {
  factionCompendium, factionCompendiumFlat, presentFactionNames, FACTION_CATEGORY_LABELS,
} from '../../src/domain/factions/factionCatalog.js';

describe('faction compendium', () => {
  test('presentFactionNames reads powerStructure.factions and the flat fallback', () => {
    const ps = { powerStructure: { factions: [{ name: 'The Merchant Bloc' }, { faction: 'The Hidden Hand' }] } };
    expect(presentFactionNames(ps).has('the merchant bloc')).toBe(true);
    expect(presentFactionNames(ps).has('the hidden hand')).toBe(true);

    const flat = { factions: [{ faction: 'The Garrison Bloc' }] };
    expect(presentFactionNames(flat).has('the garrison bloc')).toBe(true);

    expect(presentFactionNames(null).size).toBe(0);
  });

  test('factionCompendium groups by category with display labels', () => {
    const groups = factionCompendium({});
    expect(groups.length).toBeGreaterThan(0);
    const economy = groups.find(g => g.category === 'economy');
    expect(economy).toBeTruthy();
    expect(economy.label).toBe(FACTION_CATEGORY_LABELS.economy);
    expect(economy.options.every(o => o.category === 'economy')).toBe(true);
    expect(economy.options.some(o => o.name === 'The Trade Compact')).toBe(true);
  });

  test('factions already in the settlement are filtered out (case-insensitive)', () => {
    const settlement = {
      powerStructure: { factions: [{ name: 'the trade compact' }] },
    };
    const flat = factionCompendiumFlat(settlement);
    expect(flat.some(o => o.name === 'The Trade Compact')).toBe(false);
    // Other economy options remain available.
    expect(flat.some(o => o.name === 'The Merchant Bloc')).toBe(true);
  });

  test('a category whose options are all present is dropped entirely', () => {
    // Mark every economy descriptor as present; the economy group should vanish.
    const all = factionCompendium({});
    const economyNames = (all.find(g => g.category === 'economy')?.options || []).map(o => ({ name: o.name }));
    const settlement = { powerStructure: { factions: economyNames } };
    const groups = factionCompendium(settlement);
    expect(groups.some(g => g.category === 'economy')).toBe(false);
    // But unrelated categories survive.
    expect(groups.some(g => g.category === 'criminal')).toBe(true);
  });
});
