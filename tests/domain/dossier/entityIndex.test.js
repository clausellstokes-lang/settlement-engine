/**
 * tests/domain/dossier/entityIndex.test.js
 *
 * Pins the Phase A dossier hyperlink index: buildDossierEntityIndex turns a
 * settlement into an id->entity resolver covering each structured entity type,
 * and currentName is resolved LIVE so a rename is reflected without rebuilding.
 */
import { describe, it, expect } from 'vitest';
import { buildDossierEntityIndex } from '../../../src/domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../../src/lib/entities.js';

function sampleSettlement() {
  return {
    id: 'settlement.ashford',
    name: 'Ashford',
    npcs: [
      { id: 'npc_1', name: 'Mara Voss', role: 'Reeve', factionAffiliation: 'Iron Guild' },
      { id: 'npc_2', name: 'Toller Finch', role: 'Smuggler', factionAffiliation: 'Iron Guild' },
    ],
    powerStructure: {
      factions: [
        { faction: 'Iron Guild', power: 60, desc: 'The metalworkers.' },
        { faction: 'Free Wharf', power: 40, desc: 'The dockers.' },
      ],
    },
    institutions: [
      { id: 'institution.town_watch', name: 'Town Watch' },
    ],
  };
}

describe('buildDossierEntityIndex', () => {
  it('resolves each entity type to the right { type, currentName, tab }', () => {
    const index = buildDossierEntityIndex(sampleSettlement());

    const npc = index.resolve('npc_1');
    expect(npc).toBeTruthy();
    expect(npc.type).toBe('npc');
    expect(npc.currentName).toBe('Mara Voss');
    expect(npc.tab).toBe('npcs');

    const faction = index.resolve(factionIdFromName('Iron Guild'));
    expect(faction).toBeTruthy();
    expect(faction.type).toBe('faction');
    expect(faction.currentName).toBe('Iron Guild');
    expect(faction.tab).toBe('power');

    const inst = index.resolve('institution.town_watch');
    expect(inst).toBeTruthy();
    expect(inst.type).toBe('institution');
    expect(inst.currentName).toBe('Town Watch');
    expect(inst.tab).toBe('power');

    const settlement = index.resolve('settlement.ashford');
    expect(settlement).toBeTruthy();
    expect(settlement.type).toBe('settlement');
    expect(settlement.currentName).toBe('Ashford');
    expect(settlement.tab).toBe('overview');
  });

  it("keys factions by factionIdFromName so an NPC's affiliation resolves with no name-matching", () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    // The id an NPC card computes for its faction link (factionIdFromName of the
    // stated affiliation) MUST hit the faction's own index entry.
    const linkId = factionIdFromName(s.npcs[0].factionAffiliation);
    expect(index.resolve(linkId)).toBeTruthy();
    expect(index.resolve(linkId).currentName).toBe('Iron Guild');
  });

  it('returns null for an unknown id (broken-link guard)', () => {
    const index = buildDossierEntityIndex(sampleSettlement());
    expect(index.resolve('faction.does_not_exist')).toBeNull();
    expect(index.resolve(undefined)).toBeNull();
  });

  it('resolves currentName LIVE so a rename shows the new name (rename-safe)', () => {
    const s = sampleSettlement();
    const index = buildDossierEntityIndex(s);
    const entry = index.resolve('npc_1');
    expect(entry.currentName).toBe('Mara Voss');

    // Mutate the underlying raw entity AFTER the index was built. Because
    // currentName is a live getter off the raw entity (never cached), the
    // same entry now reports the new name with no rebuild.
    s.npcs[0].name = 'Mara the Reeve';
    expect(entry.currentName).toBe('Mara the Reeve');

    // Factions rename-safely the same way for their display name.
    const faction = index.resolve(factionIdFromName('Iron Guild'));
    s.powerStructure.factions[0].faction = 'Iron Guild';
    s.powerStructure.factions[0].name = undefined;
    s.powerStructure.factions[0].faction = 'The Iron Guild';
    expect(faction.currentName).toBe('The Iron Guild');
  });
});
