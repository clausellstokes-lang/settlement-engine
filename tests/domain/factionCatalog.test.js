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

describe('faction compendium — custom factions (the FactionEventBanner promise)', () => {
  const custom = [
    { id: 'cf2', name: 'The Gilded Quill', description: 'Scribes with sharp knives.' },
    { id: 'cf1', name: 'Ash Circle', description: '' },
  ];

  test('compendium factions land in a trailing Custom group, codepoint-sorted, description carried', () => {
    const groups = factionCompendium({}, custom);
    const customGroup = groups[groups.length - 1];
    expect(customGroup.category).toBe('custom');
    expect(customGroup.label).toBe(FACTION_CATEGORY_LABELS.custom);
    // byNameCodepoint, not authoring order.
    expect(customGroup.options.map(o => o.name)).toEqual(['Ash Circle', 'The Gilded Quill']);
    const quill = customGroup.options.find(o => o.name === 'The Gilded Quill');
    expect(quill.description).toBe('Scribes with sharp knives.');
    expect(quill.isCustom).toBe(true);
  });

  test('a custom faction already in the settlement is filtered out (case-insensitive)', () => {
    const settlement = { powerStructure: { factions: [{ faction: 'the gilded quill' }] } };
    const groups = factionCompendium(settlement, custom);
    const options = groups.find(g => g.category === 'custom')?.options || [];
    expect(options.some(o => o.name === 'The Gilded Quill')).toBe(false);
    expect(options.some(o => o.name === 'Ash Circle')).toBe(true);
  });

  test('a custom name shadowing a built-in still on offer is dropped (no duplicate option values)', () => {
    const groups = factionCompendium({}, [{ name: 'the trade compact', description: 'shadow' }]);
    // The built-in keeps its listing; no Custom group appears for the shadow.
    expect(groups.find(g => g.category === 'economy').options.some(o => o.name === 'The Trade Compact')).toBe(true);
    expect(groups.some(g => g.category === 'custom')).toBe(false);
  });

  test('blank / duplicate custom names are dropped; no custom factions means no Custom group', () => {
    const groups = factionCompendium({}, [
      { name: '  ' }, { name: 'Ash Circle' }, { name: 'ash circle', description: 'dupe' },
    ]);
    expect(groups.find(g => g.category === 'custom').options).toHaveLength(1);
    expect(factionCompendium({}, []).some(g => g.category === 'custom')).toBe(false);
    // One-arg call (older callers) is unchanged.
    expect(factionCompendium({}).some(g => g.category === 'custom')).toBe(false);
  });

  test('factionCompendiumFlat threads custom factions through', () => {
    expect(factionCompendiumFlat({}, custom).some(o => o.name === 'Ash Circle')).toBe(true);
  });
});
