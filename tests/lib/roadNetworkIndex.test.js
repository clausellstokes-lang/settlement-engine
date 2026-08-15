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

/**
 * REGRESSION PIN for the ONE-TIME CORRECTION of 2026-08-11 (owner-approved).
 *
 * `isPort` read `sett.tradeRouteAccess` / `sett.port`. NEITHER address has a
 * writer: the resolved route is persisted at `.config.tradeRouteAccess`. isPort
 * was therefore always false and `preferSea` was always false — no road between
 * two ports had ever been marked as a sea crossing. These pins red if the read
 * regresses to either dead address, and they drive BOTH save shapes the module
 * supports, because `sett` is `save.settlement || save`.
 */
describe('computeRoadEdges — preferSea reads the route at its persisted address', () => {
  const portSave = (id, shape) => (shape === 'wrapped'
    ? { id, settlement: { tier: 'city', config: { tradeRouteAccess: 'port' }, neighbourNetwork: [] } }
    : { id, tier: 'city', config: { tradeRouteAccess: 'port' }, neighbourNetwork: [] });

  const pair = Object.fromEntries([
    placement('b1', 0, 0, 'A'),
    placement('b2', 50, 0, 'B'),
  ]);

  test.each(['wrapped', 'flattened'])(
    'two %s port saves produce a sea-preferring edge',
    (shape) => {
      const edges = computeRoadEdges([portSave('A', shape), portSave('B', shape)], pair);
      expect(edges).toHaveLength(1);
      expect(edges[0].preferSea).toBe(true);
    },
  );

  test('a non-port pair produces an edge that does NOT prefer sea', () => {
    const inland = (id) => ({
      id, settlement: { tier: 'city', config: { tradeRouteAccess: 'road' }, neighbourNetwork: [] },
    });
    const edges = computeRoadEdges([inland('A'), inland('B')], pair);
    expect(edges).toHaveLength(1);
    expect(edges[0].preferSea).toBe(false);
  });

  test('the two DEAD top-level addresses do not make a port', () => {
    // The live pair is the anchor: the SAME two cities, the same placements, the
    // same single emitted edge — but with the route at its real address it does
    // prefer sea. So `false` below is this read discriminating between addresses,
    // not an edge list that stopped being produced.
    const live = computeRoadEdges([portSave('A', 'wrapped'), portSave('B', 'wrapped')], pair);
    const deadAddress = (id) => ({
      id,
      settlement: { tier: 'city', tradeRouteAccess: 'port', port: true, neighbourNetwork: [] },
    });
    const dead = computeRoadEdges([deadAddress('A'), deadAddress('B')], pair);
    expect(live.map(e => e.preferSea)).toEqual([true]);
    expect(dead.map(e => e.preferSea)).toEqual([false]);
  });
});
