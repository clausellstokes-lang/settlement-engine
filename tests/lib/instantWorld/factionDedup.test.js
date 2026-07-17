/**
 * tests/lib/instantWorld/factionDedup.test.js — the world-scoped faction-name dedup.
 *
 * Guards the CONTENT-GT-DOSSIER fix for the survey's worst thin-content surface: a
 * composed realm must not show the same FACTION_DESCRIPTORS name on two members. The
 * pass is a pure, rng-free rename over the already-minted bundle, so it must (a) leave
 * no cross-settlement collisions, (b) keep every reference consistent (conflicts parties/
 * desc), (c) be deterministic per seed, and (d) touch NOTHING in a single-settlement
 * (non-composed) generation.
 */
import { describe, it, expect } from 'vitest';
import { dedupeWorldFactionNames } from '../../../src/lib/instantWorld/factionDedup.js';
import { composeInstantWorld } from '../../../src/lib/instantWorld/composeInstantWorld.js';

const facNames = (m) => (m.settlement?.factions || []).map((f) => f.name);
const allFacNames = (members) => members.flatMap(facNames);

describe('dedupeWorldFactionNames — unit', () => {
  const build = () => [
    { id: 's0', _slot: 0, settlement: { factions: [{ name: 'The Trade Compact', category: 'economy' }], conflicts: [] } },
    { id: 's1', _slot: 1, settlement: {
      factions: [{ name: 'The Trade Compact', category: 'economy' }, { name: 'The Garrison Bloc', category: 'military' }],
      conflicts: [{ parties: ['The Trade Compact', 'The Garrison Bloc'], desc: 'The Trade Compact opposes the guard.' }],
    } },
    { id: 's2', _slot: 2, settlement: { factions: [{ name: 'The Trade Compact', category: 'economy' }], conflicts: [] } },
  ];

  it('renames every cross-settlement collision (first occurrence keeps the name)', () => {
    const members = build();
    const renames = dedupeWorldFactionNames(members);
    const names = allFacNames(members);
    expect(new Set(names).size, 'no duplicate faction names world-wide').toBe(names.length);
    expect(members[0].settlement.factions[0].name).toBe('The Trade Compact'); // slot 0 keeps it
    expect(renames.length).toBe(2); // s1 + s2's colliding "Trade Compact"
  });

  it('keeps conflicts references consistent with the renamed faction', () => {
    const members = build();
    dedupeWorldFactionNames(members);
    const s1 = members[1].settlement;
    const newName = s1.factions[0].name; // the renamed one
    expect(newName).not.toBe('The Trade Compact');
    expect(s1.conflicts[0].parties).toContain(newName);
    expect(s1.conflicts[0].parties).not.toContain('The Trade Compact');
    expect(s1.conflicts[0].desc).toContain(newName);
    expect(s1.conflicts[0].desc).not.toContain('The Trade Compact');
  });

  it('is deterministic (same input → same renames)', () => {
    const a = dedupeWorldFactionNames(build());
    const b = dedupeWorldFactionNames(build());
    expect(a).toEqual(b);
  });

  it('gives DISTINCT names to two same-named factions in ONE settlement (local dedup can cap out)', () => {
    // Regression: a name-match rename collapsed both to one string; identity rename must not.
    const members = [
      { id: 's0', _slot: 0, settlement: { factions: [{ name: 'The Free Alliance', category: 'other' }] } },
      { id: 's1', _slot: 1, settlement: { factions: [
        { name: 'The Free Alliance', category: 'other' },
        { name: 'The Free Alliance', category: 'other' },
      ] } },
    ];
    dedupeWorldFactionNames(members);
    const names = allFacNames(members);
    expect(new Set(names).size, `no dup after intra-settlement collision: ${names}`).toBe(names.length);
  });

  it('is a no-op when there are no collisions', () => {
    const members = [
      { id: 'a', _slot: 0, settlement: { factions: [{ name: 'The Merchant Bloc', category: 'economy' }] } },
      { id: 'b', _slot: 1, settlement: { factions: [{ name: 'The Garrison Bloc', category: 'military' }] } },
    ];
    expect(dedupeWorldFactionNames(members)).toEqual([]);
  });
});

describe('composeInstantWorld — no cross-settlement faction collisions + determinism', () => {
  const compose = (seed) => composeInstantWorld({ seed, basicConfig: { realmSize: 'large' } });

  it('a composed realm has zero duplicate faction names across its members', () => {
    const { settlements } = compose('realm-dedup-1');
    const names = allFacNames(settlements);
    expect(names.length, 'the realm has factions to check').toBeGreaterThan(1);
    expect(new Set(names).size, `duplicates: ${names.filter((n, i) => names.indexOf(n) !== i)}`).toBe(names.length);
  });

  it('same seed → identical member faction names (determinism preserved)', () => {
    const a = allFacNames(compose('realm-det').settlements);
    const b = allFacNames(compose('realm-det').settlements);
    expect(a).toEqual(b);
  });
});
