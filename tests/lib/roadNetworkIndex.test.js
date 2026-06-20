/**
 * roadNetworkIndex.test.js — B15 #15.
 *
 * The hostile-pair pass and trade-relationship pass now share one nodeBySettId
 * index instead of a per-link nodes.find() scan. This locks in the resulting
 * behaviour: hostile relationships suppress a highway link between the pair, and
 * trade relationships add a trade edge — both resolved via settlementId.
 *
 * The highway tier is built with Prim's algorithm (binary-heap priority queue)
 * rather than the old greedy nearest-neighbour scan; for the two-city cases
 * exercised here both yield the same single `mst` edge. Multi-city MST
 * minimality, determinism, and spanning-tree shape are covered in
 * roadNetworkMst.test.js.
 */
import { describe, test, expect } from 'vitest';
import { computeRoadEdges } from '../../src/lib/roadNetwork.js';

const placement = (burgId, x, y, settlementId) => [burgId, { x, y, settlementId }];

describe('computeRoadEdges — shared settlementId index (#15)', () => {
  test('a trade relationship produces a trade edge between the two placements', () => {
    const saves = [
      { id: 'A', settlement: { tier: 'town', neighbourNetwork: [{ id: 'B', relationshipType: 'trade_partner' }] } },
      { id: 'B', settlement: { tier: 'town', neighbourNetwork: [] } },
    ];
    const placements = Object.fromEntries([
      placement('b1', 0, 0, 'A'),
      placement('b2', 100, 0, 'B'),
    ]);
    const edges = computeRoadEdges(saves, placements);
    const trade = edges.find(e => e.tier === 'trade');
    expect(trade).toBeTruthy();
    expect([trade.fromBurgId, trade.toBurgId].sort()).toEqual(['b1', 'b2']);
  });

  test('a hostile relationship suppresses the highway MST link between the city pair', () => {
    // Two cities (rank>=4) that the MST would normally link, marked hostile.
    const saves = [
      { id: 'A', settlement: { tier: 'city', neighbourNetwork: [{ id: 'B', relationshipType: 'hostile' }] } },
      { id: 'B', settlement: { tier: 'city', neighbourNetwork: [] } },
    ];
    const placements = Object.fromEntries([
      placement('b1', 0, 0, 'A'),
      placement('b2', 50, 0, 'B'),
    ]);
    const edges = computeRoadEdges(saves, placements);
    // No highway edge between the hostile pair.
    const highway = edges.find(e => e.tier === 'highway');
    expect(highway).toBeUndefined();
  });

  test('non-hostile city pair still gets a highway MST link', () => {
    const saves = [
      { id: 'A', settlement: { tier: 'city', neighbourNetwork: [] } },
      { id: 'B', settlement: { tier: 'city', neighbourNetwork: [] } },
    ];
    const placements = Object.fromEntries([
      placement('b1', 0, 0, 'A'),
      placement('b2', 50, 0, 'B'),
    ]);
    const edges = computeRoadEdges(saves, placements);
    const highway = edges.find(e => e.tier === 'highway');
    expect(highway).toBeTruthy();
    // Prim's emits the single crossing edge with the canonical `mst` reason.
    expect(highway.reason).toBe('mst');
    expect([highway.fromBurgId, highway.toBurgId].sort()).toEqual(['b1', 'b2']);
  });
});
