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

  // F10: the cross-settlement conflicts persisted into both saves must be
  // reproducible. Same settlement pair + relType ⇒ byte-identical conflicts,
  // so the persisted state replays from its seed and does not drift on re-save.
  test('persisted cross-settlement conflicts are deterministic and linkId-stamped', () => {
    const npcs = (p) => ([
      { id: `${p}_e`, name: `${p} Merchant`, role: 'Trader', category: 'economy' },
      { id: `${p}_m`, name: `${p} Captain`, role: 'Officer', category: 'military' },
    ]);
    const rivalPartner = {
      id: 'partner-9', name: 'Redkeep', tier: 'town',
      settlement: { _seed: 'seed-redkeep', name: 'Redkeep', tier: 'town', npcs: npcs('R'), factions: [{ name: 'R Guild', dominantCategory: 'economy' }], neighbourNetwork: [] },
    };
    const rivalEntry = {
      id: 'new-9', name: 'Blackford', tier: 'village',
      settlement: {
        _seed: 'seed-blackford', name: 'Blackford', tier: 'village', npcs: npcs('B'),
        factions: [{ name: 'B Guild', dominantCategory: 'economy' }],
        neighborRelationship: { name: 'Redkeep', tier: 'town', relationshipType: 'rival' },
      },
    };

    const run = () => buildNeighbourBackLink(rivalEntry, [rivalPartner]);
    const first = run();
    const second = run();

    const conflictsOf = (res) =>
      res.settlement.interSettlementRelationships.filter(x => x.type === 'conflict' || x.type === 'faction_engagement');
    const c1 = conflictsOf(first);
    expect(c1.length).toBeGreaterThan(0);
    // Reproducible across independent runs (fresh objects each time).
    expect(conflictsOf(second)).toEqual(c1);
    // Every conflict carries the shared linkId.
    const linkId = first.settlement.neighbourNetwork.find(n => n.id === 'partner-9').linkId;
    c1.forEach(x => expect(x.linkId).toBe(linkId));
  });

  // ── Wave B: canonical-edge invariant ──────────────────────────────────────
  // canonicalEdgeForLink only returns null when a source/target id is missing.
  // In the real save flow saveId is guarded non-empty and every partner save
  // row carries a store primary key, so the edge is never null. These pin both
  // sides of that invariant.
  test('builds an edge with a defaulted (neutral) relationshipType without throwing', () => {
    // No relationshipType on the link → relType defaults to 'neutral' at the
    // canonicalEdgeForLink call. The invariant must hold: edge is non-null.
    const entry = newEntry({ name: 'Eastgate', tier: 'town' });
    let result;
    expect(() => { result = buildNeighbourBackLink(entry, [partner]); }).not.toThrow();
    expect(result).toBeTruthy();
    const ownLink = result.settlement.neighbourNetwork.find(n => n.id === 'partner-1');
    expect(ownLink.relationshipType).toBe('neutral');
  });

  test('throws a clear invariant error when the partner save carries no id anywhere', () => {
    // Degenerate shape unreachable in production (every persisted save row has a
    // primary key): the partner has neither a top-level id nor a settlement id,
    // so canonicalEdgeForLink would return null. The invariant fires instead of
    // dereferencing null.
    const idlessPartner = { name: 'Eastgate', tier: 'town', settlement: { name: 'Eastgate', tier: 'town', neighbourNetwork: [] } };
    const entry = newEntry({ name: 'Eastgate', tier: 'town', relationshipType: 'trade_partner' });
    expect(() => buildNeighbourBackLink(entry, [idlessPartner])).toThrow(/canonical edge unexpectedly null/);
  });
});
