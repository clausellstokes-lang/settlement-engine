/**
 * institutionsForCategory.test.js — the Power-tab institution footprint.
 *
 * Live-app bug: only powers backed by a sub-faction GROUP showed associated
 * institutions; a faction-less power (Religious Authorities, Merchant Guilds)
 * rendered nothing, because the footprint was inferred ONLY from sub-faction
 * members. institutionsForCategory maps a power's CATEGORY (its domain) straight
 * to the institutions it touches, so EVERY power gets its footprint regardless of
 * whether it has members. This pins that mapping.
 */

import { describe, it, expect } from 'vitest';
import { institutionsForCategory } from '../../src/domain/npcProfile.js';

const settlement = {
  institutions: [
    { name: 'The Iron Garrison' },     // military
    { name: 'Temple of the Dawn' },    // religious
    { name: 'Riverside Shrine' },      // religious (2nd)
    { name: 'The Grand Market' },      // economy
    { name: "Coopers' Guild Hall" },   // economy/craft (matches both hints)
    { name: 'Town Council Hall' },     // government
    { name: "The Mage's Tower" },      // arcane
    { name: 'A quiet orchard' },       // matches nothing
  ],
};

describe('institutionsForCategory — every power gets its institutional footprint', () => {
  it('maps a category to ALL matching institutions, not just the first', () => {
    const religious = institutionsForCategory('religious', settlement);
    expect(religious).toEqual(['Temple of the Dawn', 'Riverside Shrine']);
  });

  it('covers the faction-less power domains the bug missed', () => {
    expect(institutionsForCategory('military', settlement)).toContain('The Iron Garrison');
    expect(institutionsForCategory('economy', settlement)).toContain('The Grand Market');
    expect(institutionsForCategory('religious', settlement)).toContain('Temple of the Dawn');
  });

  it('honours the generator-category aliases (magic→arcane, noble→government, crafts→craft)', () => {
    expect(institutionsForCategory('magic', settlement)).toContain("The Mage's Tower");
    expect(institutionsForCategory('noble', settlement)).toContain('Town Council Hall');
    expect(institutionsForCategory('crafts', settlement)).toContain("Coopers' Guild Hall");
  });

  it('is case-insensitive on the category and dedupes by institution name', () => {
    const out = institutionsForCategory('RELIGIOUS', settlement);
    expect(out).toEqual(['Temple of the Dawn', 'Riverside Shrine']);
    expect(new Set(out).size).toBe(out.length);
  });

  it('returns [] for an unknown category, a missing settlement, or no institutions', () => {
    expect(institutionsForCategory('zzz', settlement)).toEqual([]);
    expect(institutionsForCategory('religious', { institutions: [] })).toEqual([]);
    expect(institutionsForCategory('religious', null)).toEqual([]);
    expect(institutionsForCategory(null, settlement)).toEqual([]);
  });

  it('never matches an institution whose name fits no domain hint', () => {
    const all = ['military', 'religious', 'economy', 'government', 'arcane', 'craft', 'criminal']
      .flatMap(cat => institutionsForCategory(cat, settlement));
    expect(all).not.toContain('A quiet orchard');
  });
});
