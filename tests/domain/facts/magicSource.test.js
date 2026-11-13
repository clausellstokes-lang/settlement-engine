/**
 * magicSource.test.js — where the magic a place relies on comes from (W2-A-LEAVES, 2026-11-12; census row 3, the
 * chair's ruling). The leaf names the practitioners, then the houses that supply a dependent chain's magic; its
 * note table classes every note the substitution step can write, and nothing else.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MAGIC_NOTE_TRADITION, magicSourceOf } from '../../../src/domain/facts/magicSource.js';
import { MAGIC_TRADITION_HOUSES } from '../../../src/data/magicTraditionHouses.js';

const WORLD = { magicExists: true, priorityMagic: 66, magicLevel: 'high' };

describe('the note table', () => {
  test('classes EVERY note chainMagicSubstitution.js can write, and nothing else; each into a tradition of the table', () => {
    const src = readFileSync(join(process.cwd(), 'src/generators/chainMagicSubstitution.js'), 'utf8');
    // every single-quoted sentence of the step: a capital, then words (its chain-id lists are lower-case single words)
    const notes = [...src.matchAll(/'([A-Z][a-z]+ [^'\n]+)'/g)].map((m) => m[1]);
    expect(notes.length).toBeGreaterThan(12);
    expect(Object.keys(MAGIC_NOTE_TRADITION).sort()).toEqual([...new Set(notes)].sort());
    for (const tradition of Object.values(MAGIC_NOTE_TRADITION)) expect(Object.keys(MAGIC_TRADITION_HOUSES)).toContain(tradition);
  });
});

describe('the source', () => {
  test('a chain that needs magic: the houses its row records', () => {
    const s = { tier: 'city', config: WORLD, institutions: [{ name: 'Parish churches (10-30)' }, { name: 'Multiple monasteries' }], npcs: [],
      economicState: { activeChains: [{ chainId: 'divine_healing', label: 'Divine & Magical Healing', processingInstitutions: ['Parish church', 'Multiple monasteries'] }] } };
    expect(magicSourceOf(s)).toEqual({ houses: ['Parish church', 'Multiple monasteries'], people: [] });
  });
  test('a chain magic holds up: the houses here of the tradition that wrote its note', () => {
    const s = { tier: 'city', config: WORLD, npcs: [],
      institutions: [{ name: 'Stable district' }, { name: 'Parish churches (10-30)', catalogId: 'parish_churches_10_30' }, { name: 'Cathedral (10,000+ only)', catalogId: 'cathedral_10_000_only' }],
      economicState: { activeChains: [{ chainId: 'livestock', label: 'Livestock & Dairy', processingInstitutions: ['Stable district'], magicNote: 'Blessed stores; divine provision fills the gap' }] } };
    expect(magicSourceOf(s).houses).toEqual(['Parish churches (10-30)', 'Cathedral (10,000+ only)']);
  });
  test('the practitioners first; nothing supplies an arcane note where no arcane house stands; nothing where magic does not work', () => {
    const witch = { tier: 'hamlet', config: WORLD, institutions: [{ name: 'Subsistence farming' }], npcs: [{ name: 'Thorkel', role: 'Hedge Witch' }],
      economicState: { activeChains: [{ chainId: 'grain', label: 'Grain & Bread', magicNote: 'Arcane quickening of growth provides minor food supplement' }] } };
    expect(magicSourceOf(witch)).toEqual({ houses: [], people: ['Thorkel'] });
    expect(magicSourceOf({ ...witch, npcs: [] })).toEqual({ houses: [], people: [] });
    expect(magicSourceOf({ ...witch, config: { magicExists: false, priorityMagic: 0 } })).toEqual({ houses: [], people: [] });
    expect(magicSourceOf(null)).toEqual({ houses: [], people: [] });
  });
});
