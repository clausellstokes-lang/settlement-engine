/**
 * tests/domain/factionArchetypes.test.js — P2.2 canonical archetype detector.
 *
 * One detector replaces the four divergent inference blocks. Pin: category wins
 * over name; name inference covers every archetype; the ordering resolves the
 * overlaps that tripped the legacy matchers (occupation vs military, criminal
 * 'guild' vs merchant 'guild', noble vs government); OTHER is the safe default.
 */

import { describe, it, expect } from 'vitest';
import {
  factionArchetype, FACTION_ARCHETYPES as A, supportedFactionArchetypes,
} from '../../src/domain/factionArchetypes.js';

describe('factionArchetype — category authority', () => {
  it('uses a recognized category over the name', () => {
    expect(factionArchetype({ category: 'criminal', name: 'The Merchant Council' })).toBe(A.CRIMINAL);
    expect(factionArchetype({ category: 'economy', name: 'Whatever' })).toBe(A.MERCHANT);
    expect(factionArchetype({ category: 'watch', name: 'Whatever' })).toBe(A.MILITARY);
  });
  it('falls back to name when the category is unknown/absent', () => {
    expect(factionArchetype({ category: 'mystery', name: "Thieves' Guild" })).toBe(A.CRIMINAL);
    expect(factionArchetype({ name: 'Temple of the Dawn' })).toBe(A.RELIGIOUS);
  });
});

describe('factionArchetype — name inference per archetype', () => {
  const cases = [
    ["Thieves' Guild", A.CRIMINAL],
    ['Smugglers Ring', A.CRIMINAL],
    ['Grand Cathedral Order', A.RELIGIOUS],
    ["Mages' College", A.ARCANE],
    ['City Watch', A.MILITARY],
    ['Merchant Caravan League', A.MERCHANT],
    ['House Valeric', A.NOBLE],
    ["Stonecutters' Craft Guild", A.CRAFT],
    ['Dockworkers Union', A.LABOR],
    ['Foreign Embassy', A.OUTSIDER],
    ['Imperial Occupation Force', A.OCCUPATION],
    ['Town Council', A.GOVERNMENT],
    ['The Quiet Society', A.OTHER],
  ];
  for (const [name, expected] of cases) {
    it(`"${name}" → ${expected}`, () => {
      expect(factionArchetype({ name })).toBe(expected);
    });
  }
});

describe('factionArchetype — overlap ordering', () => {
  it('a criminal "guild" is criminal, not merchant', () => {
    expect(factionArchetype({ name: "Thieves' Guild" })).toBe(A.CRIMINAL);
  });
  it('an occupying garrison is occupation, not military', () => {
    expect(factionArchetype({ name: 'Imperial Occupation Garrison' })).toBe(A.OCCUPATION);
  });
  it('a craft guild is craft, not merchant', () => {
    expect(factionArchetype({ name: "Artisans' Craft Guild" })).toBe(A.CRAFT);
  });
});

describe('factionArchetype — robustness', () => {
  it('accepts a bare string', () => {
    expect(factionArchetype('Black Market Cartel')).toBe(A.CRIMINAL);
  });
  it('returns OTHER for empty/garbage', () => {
    expect(factionArchetype(null)).toBe(A.OTHER);
    expect(factionArchetype({})).toBe(A.OTHER);
    expect(factionArchetype({ name: '' })).toBe(A.OTHER);
  });
  it('reads description text too', () => {
    expect(factionArchetype({ name: 'The Order', description: 'A secretive smuggling network.' })).toBe(A.CRIMINAL);
  });
  it('exposes all archetypes', () => {
    expect(supportedFactionArchetypes()).toContain(A.GOVERNMENT);
    expect(supportedFactionArchetypes().length).toBeGreaterThanOrEqual(12);
  });
});
