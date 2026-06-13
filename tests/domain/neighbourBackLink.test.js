/**
 * Tests for buildNeighbourBackLink — the bidirectional neighbour-linking logic
 * used by the canonical save flow (lib/saves.js). Settlements here carry no
 * npcs/factions so the cross-settlement NPC/conflict generators return empty
 * sets, keeping assertions deterministic; the focus is the reciprocal
 * neighbourNetwork wiring.
 */
import { describe, test, expect } from 'vitest';
import { buildNeighbourBackLink } from '../../src/domain/relationships/neighbourBackLink.js';

const partner = {
  id: 'partner-1',
  name: 'Eastgate',
  tier: 'town',
  settlement: { name: 'Eastgate', tier: 'town', npcs: [], factions: [], neighbourNetwork: [] },
};

function newEntry(neighborRelationship) {
  return {
    id: 'new-1',
    name: 'Westford',
    tier: 'village',
    settlement: { name: 'Westford', tier: 'village', npcs: [], factions: [], neighborRelationship },
  };
}

describe('buildNeighbourBackLink', () => {
  test('returns null when the settlement has no neighborRelationship', () => {
    expect(buildNeighbourBackLink(newEntry(undefined), [partner])).toBeNull();
  });

  test('returns null when no save matches the named neighbour', () => {
    const entry = newEntry({ name: 'Nowhere', relationshipType: 'trade_partner' });
    expect(buildNeighbourBackLink(entry, [partner])).toBeNull();
  });

  test('wires reciprocal neighbourNetwork entries on both sides', () => {
    const entry = newEntry({ name: 'Eastgate', tier: 'town', relationshipType: 'trade_partner' });
    const result = buildNeighbourBackLink(entry, [partner]);
    expect(result).toBeTruthy();

    // Own side references the partner...
    const ownLink = result.settlement.neighbourNetwork.find(n => n.id === 'partner-1');
    expect(ownLink).toBeTruthy();
    expect(ownLink.neighbourName).toBe('Eastgate');
    expect(ownLink.relationshipType).toBe('trade_partner');
    expect(ownLink.bidirectional).toBe(true);

    // ...and the partner side references the new save by its id.
    expect(result.partner.id).toBe('partner-1');
    const partnerLink = result.partner.settlement.neighbourNetwork.find(n => n.id === 'new-1');
    expect(partnerLink).toBeTruthy();
    expect(partnerLink.neighbourName).toBe('Westford');
    expect(partnerLink.bidirectional).toBe(true);

    // Both links share one linkId.
    expect(ownLink.linkId).toBe(partnerLink.linkId);
  });

  test('replaces the generated stub for the same neighbour rather than duplicating it', () => {
    const entry = newEntry({ name: 'Eastgate', tier: 'town', relationshipType: 'trade_partner' });
    // Simulate the own-side stub already added by withNeighbourNetworkFromRelationship.
    entry.settlement.neighbourNetwork = [{ id: 'generated_Eastgate', name: 'Eastgate', neighbourName: 'Eastgate', fromGeneration: true }];

    const result = buildNeighbourBackLink(entry, [partner]);
    const eastgateEntries = result.settlement.neighbourNetwork.filter(n => (n.neighbourName || n.name) === 'Eastgate');
    expect(eastgateEntries).toHaveLength(1);
    expect(eastgateEntries[0].id).toBe('partner-1');
    expect(eastgateEntries[0].fromGeneration).toBeUndefined();
  });

  test('is idempotent — re-running does not duplicate links on the partner', () => {
    const entry = newEntry({ name: 'Eastgate', tier: 'town', relationshipType: 'trade_partner' });
    const first = buildNeighbourBackLink(entry, [partner]);
    // Feed the partner's now-linked state back in and re-run.
    const linkedPartner = { ...partner, settlement: first.partner.settlement };
    const second = buildNeighbourBackLink(entry, [linkedPartner]);
    const links = second.partner.settlement.neighbourNetwork.filter(n => n.id === 'new-1');
    expect(links).toHaveLength(1);
  });
});
