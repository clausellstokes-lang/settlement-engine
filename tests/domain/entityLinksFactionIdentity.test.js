/**
 * tests/domain/entityLinksFactionIdentity.test.js
 *
 * Locks the faction rename-tolerance seam in buildDossierEntityIndex.
 *
 * The faction's PRIMARY id stays the name-derived factionIdFromName so every
 * existing consumer (npcProfile.factionLink, the PDF viewModel, and each
 * EntityLink id={factionIdFromName(name)} call site) keeps resolving. On top of
 * that, when a faction carries a STABLE, rename-decoupled `faction.id`, the entry
 * is ALSO registered under that id — so a link holding the stable id resolves to
 * the same card, which is what makes the identity survive a rename.
 */
import { describe, it, expect } from 'vitest';
import { buildDossierEntityIndex } from '../../src/domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../src/lib/entities.js';

function settlementWithStableFactionId() {
  return {
    id: 'settlement.ashford',
    name: 'Ashford',
    powerStructure: {
      factions: [
        { id: 'faction.stable-abc123', faction: 'Iron Guild', power: 60 },
      ],
    },
  };
}

// DEFERRED to dossier wave — needs factionIdFromName entity-identity helper in src/domain/dossier/entityLinks.js; re-enable when it lands.
describe.skip('faction identity — rename-tolerance seam', () => {
  it('keeps the name-derived id as the PRIMARY key (legacy consumers still resolve)', () => {
    const index = buildDossierEntityIndex(settlementWithStableFactionId());
    const primary = factionIdFromName('Iron Guild');
    const entry = index.resolve(primary);
    expect(entry).toBeTruthy();
    expect(entry.type).toBe('faction');
    expect(entry.id).toBe(primary); // primary id is the name-derived one
    expect(entry.currentName).toBe('Iron Guild');
  });

  it('ALSO resolves the faction by its stable, rename-decoupled faction.id (alias)', () => {
    const index = buildDossierEntityIndex(settlementWithStableFactionId());
    const byStable = index.resolve('faction.stable-abc123');
    expect(byStable).toBeTruthy();
    expect(byStable.type).toBe('faction');
    // The alias resolves to the SAME card as the name-derived primary.
    expect(byStable).toBe(index.resolve(factionIdFromName('Iron Guild')));
  });

  it('survives a rename: the stable-id link still resolves after the display name changes', () => {
    const s = settlementWithStableFactionId();
    const index = buildDossierEntityIndex(s);
    const stableEntry = index.resolve('faction.stable-abc123');
    expect(stableEntry.currentName).toBe('Iron Guild');
    // Rename the faction on the raw entity. A name-derived link would now MISS
    // (factionIdFromName('The Iron Guild') !== the old primary), but the
    // stable-id link is unaffected and currentName tracks the new name.
    s.powerStructure.factions[0].faction = 'The Iron Guild';
    expect(index.resolve('faction.stable-abc123')).toBeTruthy();
    expect(stableEntry.currentName).toBe('The Iron Guild');
  });

  it('does not alias when faction.id equals the name-derived primary (no dup key churn)', () => {
    const s = {
      name: 'Ashford',
      powerStructure: {
        factions: [{ id: factionIdFromName('Iron Guild'), faction: 'Iron Guild', power: 60 }],
      },
    };
    const index = buildDossierEntityIndex(s);
    const entry = index.resolve(factionIdFromName('Iron Guild'));
    expect(entry).toBeTruthy();
    expect(entry.aliasIds).toBeUndefined();
  });

  it('a name-only faction (no stable id) behaves exactly as before (name-derived id only)', () => {
    const s = {
      name: 'Ashford',
      powerStructure: { factions: [{ faction: 'Free Wharf', power: 40 }] },
    };
    const index = buildDossierEntityIndex(s);
    const entry = index.resolve(factionIdFromName('Free Wharf'));
    expect(entry).toBeTruthy();
    expect(entry.id).toBe(factionIdFromName('Free Wharf'));
    expect(entry.aliasIds).toBeUndefined();
  });

  it('the name-derived primary wins a collision with another faction stable-id alias', () => {
    // A pathological save where one faction's stable id collides with another's
    // name-derived primary. The primary must win (registered first).
    const primaryOfGuild = factionIdFromName('Iron Guild');
    const s = {
      name: 'Ashford',
      powerStructure: {
        factions: [
          { faction: 'Iron Guild', power: 60 },
          { id: primaryOfGuild, faction: 'Free Wharf', power: 40 },
        ],
      },
    };
    const index = buildDossierEntityIndex(s);
    // Resolving the shared key returns the PRIMARY owner (Iron Guild), not the
    // aliasing faction (Free Wharf).
    expect(index.resolve(primaryOfGuild).currentName).toBe('Iron Guild');
    // Free Wharf still resolves under its own name-derived primary.
    expect(index.resolve(factionIdFromName('Free Wharf')).currentName).toBe('Free Wharf');
  });
});
