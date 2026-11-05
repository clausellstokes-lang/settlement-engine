// CENSUS-4 R12 (faction-role-fit): no generated faction seats a member whose role does not fit
// its kind, and the re-home is a pure, roll-free pass that leaves a fitting roster untouched.
import { describe, it, expect, beforeAll } from 'vitest';
import { fitFactionRoster } from '../../src/generators/power/factionRoleFit.js';
import { factionRoleFits, seatFactions } from '../../src/domain/roles/roleClass.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const factions = [
  { faction: 'Faithful', category: 'religious' },
  { faction: 'Guard', category: 'military' },
  { faction: 'Council', category: 'government' },
];

describe('fitFactionRoster', () => {
  it('returns the very same array when every member fits (byte-identical births)', () => {
    const npcs = [{ id: 'a', role: 'Priest', factionAffiliation: 'Faithful' }, { id: 'b', role: 'Guard Captain', factionAffiliation: 'Guard' }];
    expect(fitFactionRoster(npcs, { powerStructure: { factions } })).toBe(npcs);
  });
  it('re-homes a misfit to a fitting faction by hash, and is deterministic', () => {
    const npcs = [{ id: 'p', role: 'Wandering Peddler', factionAffiliation: 'Faithful' }, { id: 'r', role: 'Priest', factionAffiliation: 'Faithful' }];
    const out = fitFactionRoster(npcs, { powerStructure: { factions } });
    expect(out).not.toBe(npcs);
    expect(out[0].factionAffiliation).toBe('Council');
    expect(npcs[0].factionAffiliation).toBe('Faithful'); // no mutation
    expect(fitFactionRoster(npcs, { powerStructure: { factions } })).toEqual(out);
  });
  it('never re-homes an office-holder off the seat (a governing faction is an office, ruling Q1)', () => {
    const npcs = [{ id: 'e', role: 'Elder', factionAffiliation: 'Faithful' }];
    expect(fitFactionRoster(npcs, { powerStructure: { governingName: 'Faithful', factions } })).toBe(npcs);
  });
  it('never strips a faction of its last member, and never leaves an NPC unaffiliated (the density law)', () => {
    const last = [{ id: 'q', role: 'Wandering Peddler', factionAffiliation: 'Faithful' }];
    expect(fitFactionRoster(last, { powerStructure: { factions } })).toBe(last);
    const nowhere = [{ id: 'q', role: 'Priest', factionAffiliation: 'Guard' }, { id: 'g', role: 'Guard Captain', factionAffiliation: 'Guard' }];
    expect(fitFactionRoster(nowhere, { powerStructure: { factions: [{ faction: 'Guard', category: 'military' }] } })).toBe(nowhere);
  });
});

describe('every misfit a birth keeps is one the density law protects (reader:faction-role-fit)', () => {
  beforeAll(async () => { await ensureLaws(); });
  it('holds on soak1k-0..11: a kept misfit is its faction\'s last member, or no other faction fits it', () => {
    const rows = [];
    for (let i = 0; i < 12; i += 1) {
      const { seed, settlement: s } = birth(i);
      const seat = seatFactions(s);
      const factionsOf = s.powerStructure?.factions || [];
      for (const f of factionsOf) {
        const members = (s.npcs || []).filter((n) => n.factionAffiliation === f.faction);
        for (const n of members) {
          if (factionRoleFits(f.category, n.role, { seat: seat.has(f.faction) })) continue;
          const elsewhere = factionsOf.some((g) => g.faction !== f.faction && factionRoleFits(g.category, n.role, { seat: seat.has(g.faction) }));
          if (members.length > 1 && elsewhere) rows.push(`${seed}: ${f.faction} (${f.category}) keeps ${n.role}`);
        }
      }
    }
    expect(rows).toEqual([]);
  }, 120000);
});
