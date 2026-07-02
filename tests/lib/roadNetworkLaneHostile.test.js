/**
 * roadNetworkLaneHostile.test.js — country-lane connectivity vs hostile pairs (lib#16).
 *
 * The module header promises "every placement is connected to at least one
 * other". The lane pass used to link each unconnected placement to its single
 * nearest node — but addEdge silently no-ops a lane across a hostile pair, so a
 * placement whose NEAREST neighbour is a rival was left isolated. The fix walks
 * candidates in ascending distance and connects to the nearest non-hostile peer.
 */
import { describe, test, expect } from 'vitest';
import { computeRoadEdges } from '../../src/lib/roadNetwork.js';

const placement = (burgId, x, y, settlementId) => [burgId, { x, y, settlementId }];

const edgesTouching = (edges, burgId) =>
  edges.filter(e => e.fromBurgId === burgId || e.toBurgId === burgId);

describe('computeRoadEdges — lane pass honours the connectivity contract past a hostile nearest', () => {
  test('an isolated village whose NEAREST neighbour is hostile still gets a lane to the next-nearest peer', () => {
    // Villages (rank < 4) → no highway MST; no trade links → the lane pass owns
    // connectivity. N's nearest node H is hostile; F is farther but friendly.
    const saves = [
      { id: 'N', settlement: { tier: 'village', neighbourNetwork: [{ id: 'H', relationshipType: 'hostile' }] } },
      { id: 'H', settlement: { tier: 'village', neighbourNetwork: [] } },
      { id: 'F', settlement: { tier: 'village', neighbourNetwork: [] } },
    ];
    const placements = Object.fromEntries([
      placement('n', 0, 0, 'N'),
      placement('h', 10, 0, 'H'),   // nearest to N, but hostile
      placement('f', 40, 0, 'F'),   // farther, friendly
    ]);

    const edges = computeRoadEdges(saves, placements);

    // No lane road across the hostile N-H pair.
    const nh = edges.find(e =>
      [e.fromBurgId, e.toBurgId].sort().join('|') === ['n', 'h'].sort().join('|'));
    expect(nh).toBeUndefined();

    // But N is NOT isolated — it has a lane to the next-nearest (friendly) peer.
    const nEdges = edgesTouching(edges, 'n');
    expect(nEdges.length).toBeGreaterThan(0);
    expect(nEdges.some(e => e.fromBurgId === 'f' || e.toBurgId === 'f')).toBe(true);
  });
});
