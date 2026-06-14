/**
 * @vitest-environment jsdom
 *
 * Integration test for the bidirectional neighbour back-link in the canonical
 * save flow (saves.save). When a settlement generated against an existing save
 * is saved, BOTH rows must end up referencing each other. Exercised against the
 * local backend (real jsdom localStorage); the supabase path uses the same
 * buildNeighbourBackLink helper but a batch RPC to persist.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';

describe('saves — bidirectional neighbour link (local backend)', () => {
  let saves;

  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));
    ({ saves } = await import('../../src/lib/saves.js'));
  });

  test('saving against an existing save links both rows reciprocally', async () => {
    // Existing partner save.
    await saves.save({
      id: 'eastgate-1', name: 'Eastgate', tier: 'town',
      settlement: { name: 'Eastgate', tier: 'town', npcs: [], factions: [], neighbourNetwork: [] },
    });

    // New settlement generated as a trade partner of Eastgate.
    await saves.save({
      id: 'westford-1', name: 'Westford', tier: 'village',
      settlement: {
        name: 'Westford', tier: 'village', npcs: [], factions: [],
        neighborRelationship: { name: 'Eastgate', tier: 'town', relationshipType: 'trade_partner' },
      },
    });

    const list = await saves.list();
    const westford = list.find(s => s.id === 'westford-1');
    const eastgate = list.find(s => s.id === 'eastgate-1');

    // New save references the partner.
    const ownLink = westford.settlement.neighbourNetwork.find(n => n.id === 'eastgate-1');
    expect(ownLink).toBeTruthy();
    expect(ownLink.neighbourName).toBe('Eastgate');
    expect(ownLink.bidirectional).toBe(true);

    // Partner row was updated with the reciprocal back-link.
    const backLink = eastgate.settlement.neighbourNetwork.find(n => n.id === 'westford-1');
    expect(backLink).toBeTruthy();
    expect(backLink.neighbourName).toBe('Westford');
    expect(backLink.bidirectional).toBe(true);
    expect(backLink.linkId).toBe(ownLink.linkId);
  });

  test('cross-settlement NPC contacts are written onto both rows', async () => {
    // Populated settlements so buildInterSettlementNPCs/generateCrossSettlementConflicts
    // actually run (the full save path, not just the neighbourNetwork wiring).
    await saves.save({
      id: 'eastgate-1', name: 'Eastgate', tier: 'town',
      settlement: {
        name: 'Eastgate', tier: 'town', factions: [], neighbourNetwork: [],
        npcs: [{ id: 'e-npc-1', name: 'Mara Vell', role: 'Guildmaster', category: 'economy' }],
      },
    });
    await saves.save({
      id: 'westford-1', name: 'Westford', tier: 'village',
      settlement: {
        name: 'Westford', tier: 'village', factions: [],
        npcs: [{ id: 'w-npc-1', name: 'Brannoc Tay', role: 'Reeve', category: 'economy' }],
        neighborRelationship: { name: 'Eastgate', tier: 'town', relationshipType: 'trade_partner' },
      },
    });

    const list = await saves.list();
    const westford = list.find(s => s.id === 'westford-1');
    const eastgate = list.find(s => s.id === 'eastgate-1');

    const ownIsr = westford.settlement.interSettlementRelationships || [];
    const partnerIsr = eastgate.settlement.interSettlementRelationships || [];
    expect(ownIsr.length).toBeGreaterThan(0);
    expect(partnerIsr.length).toBeGreaterThan(0);
    // Own side points at the partner settlement; partner side points back.
    expect(ownIsr.some(r => r.partnerSettlement === 'Eastgate')).toBe(true);
    expect(partnerIsr.some(r => r.partnerSettlement === 'Westford')).toBe(true);
    // Both sets share the link id that ties the two saves together.
    const ownLink = westford.settlement.neighbourNetwork.find(n => n.id === 'eastgate-1');
    expect(ownIsr.every(r => r.linkId === ownLink.linkId)).toBe(true);
    expect(partnerIsr.every(r => r.linkId === ownLink.linkId)).toBe(true);
  });

  test('saving with a generated neighbour that has no matching save keeps the derived stub only', async () => {
    await saves.save({
      id: 'lonely-1', name: 'Lonely', tier: 'village',
      settlement: {
        name: 'Lonely', tier: 'village', npcs: [], factions: [],
        neighborRelationship: { name: 'Phantom', tier: 'town', relationshipType: 'rival' },
      },
    });

    const [lonely] = await saves.list();
    expect(lonely.settlement.neighbourNetwork).toHaveLength(1);
    const stub = lonely.settlement.neighbourNetwork[0];
    expect(stub.neighbourName).toBe('Phantom');
    expect(stub.fromGeneration).toBe(true);
    // No partner exists, so nothing is marked bidirectional.
    expect(stub.bidirectional).toBeUndefined();
  });
});
