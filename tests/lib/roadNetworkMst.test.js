/**
 * roadNetworkMst.test.js — highway MST + supply-chain index refactor.
 *
 * The highway tier is now built with Prim's algorithm backed by a binary-heap
 * priority queue (replacing the O(V²)-per-step greedy nearest-neighbour scan),
 * and the supply-chain trade pass walks a precomputed chain-membership index
 * instead of an O(P²) all-pairs buildChainEdges scan.
 *
 * These tests lock in the three guarantees of the refactor:
 *   1. DETERMINISM      — identical input ⇒ byte-identical output every run.
 *   2. VALID MST        — highways form a spanning tree over all city+ nodes:
 *                          exactly V-1 edges that connect every city+ node.
 *   3. MINIMALITY       — total highway weight equals the true MST weight
 *                          (Prim is exact, unlike the old heuristic), with a
 *                          stable tie-break by the sorted `[a,b].sort().join('|')`
 *                          burg-pair key.
 */
import { describe, test, expect } from 'vitest';
import { computeRoadEdges } from '../../src/lib/roadNetwork.js';

const placement = (burgId, x, y, settlementId) => [burgId, { x, y, settlementId }];

/** Build a saves[]/placements pair of `count` city-tier nodes at given coords. */
function cityWorld(coords) {
  const saves = coords.map((_, i) => ({
    id: 'S' + i,
    settlement: { tier: 'city', neighbourNetwork: [] },
  }));
  const placements = Object.fromEntries(
    coords.map(([x, y], i) => placement('b' + i, x, y, 'S' + i)),
  );
  return { saves, placements, coords };
}

const w = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;

/** Brute-force minimum spanning-tree weight (Prim over a dense matrix). */
function mstWeight(coords) {
  const n = coords.length;
  if (n < 2) return 0;
  const inTree = new Array(n).fill(false);
  const best = new Array(n).fill(Infinity);
  best[0] = 0;
  let total = 0;
  for (let it = 0; it < n; it++) {
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!inTree[v] && (u === -1 || best[v] < best[u])) u = v;
    }
    inTree[u] = true;
    total += best[u];
    for (let v = 0; v < n; v++) {
      if (!inTree[v]) best[v] = Math.min(best[v], w(coords[u], coords[v]));
    }
  }
  return total;
}

/** Total weight of the emitted highway edges, keyed back to coords by burgId. */
function highwayWeight(edges, coords) {
  let total = 0;
  for (const e of edges) {
    if (e.tier !== 'highway') continue;
    const fi = Number(e.fromBurgId.slice(1));
    const ti = Number(e.toBurgId.slice(1));
    total += w(coords[fi], coords[ti]);
  }
  return total;
}

describe('computeRoadEdges — highway MST (Prim + heap)', () => {
  test('is deterministic: identical input ⇒ byte-identical output across many runs', () => {
    // A geometry rich enough to exercise the heap and tie-breaks.
    const { saves, placements } = cityWorld([
      [0, 0], [0, 10], [10, 0], [10, 10], [5, 5], [20, 3], [3, 20],
    ]);
    const first = JSON.stringify(computeRoadEdges(saves, placements));
    for (let i = 0; i < 25; i++) {
      expect(JSON.stringify(computeRoadEdges(saves, placements))).toBe(first);
    }
  });

  test('order is stable, not just the set (deep-equals the first run)', () => {
    const { saves, placements } = cityWorld([
      [0, 0], [4, 3], [8, 0], [4, -3], [20, 0],
    ]);
    const a = computeRoadEdges(saves, placements);
    const b = computeRoadEdges(saves, placements);
    expect(b).toEqual(a);
  });

  test('forms a valid spanning tree: exactly V-1 highway edges that connect every city+ node', () => {
    const { saves, placements, coords } = cityWorld([
      [0, 0], [0, 10], [10, 0], [10, 10], [5, 5], [20, 3],
    ]);
    const edges = computeRoadEdges(saves, placements);
    const highways = edges.filter(e => e.tier === 'highway');

    // V-1 edges.
    expect(highways.length).toBe(coords.length - 1);

    // Connectivity: union-find over the highway edges must collapse to 1 set
    // covering all city nodes.
    const parent = new Map(coords.map((_, i) => ['b' + i, 'b' + i]));
    const find = (x) => {
      while (parent.get(x) !== x) {
        parent.set(x, parent.get(parent.get(x)));
        x = parent.get(x);
      }
      return x;
    };
    const union = (x, y) => parent.set(find(x), find(y));
    for (const e of highways) union(e.fromBurgId, e.toBurgId);
    const roots = new Set(coords.map((_, i) => find('b' + i)));
    expect(roots.size).toBe(1);

    // No duplicate undirected highway edges.
    const keys = highways.map(e => [e.fromBurgId, e.toBurgId].sort().join('|'));
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('is a true minimum spanning tree: total weight equals the brute-force MST weight', () => {
    // Several geometries, including a tie-heavy unit square.
    const geometries = [
      [[0, 0], [0, 10], [10, 0], [10, 10]],                 // square (ties)
      [[0, 0], [4, 3], [8, 0], [4, -3], [20, 0]],           // diamond + outlier
      [[0, 0], [1, 0], [100, 0], [101, 0], [50, 80]],       // two clusters + bridge
      [[0, 0], [0, 10], [10, 0], [10, 10], [5, 5], [20, 3]],
    ];
    for (const coords of geometries) {
      const { saves, placements } = cityWorld(coords);
      const edges = computeRoadEdges(saves, placements);
      expect(highwayWeight(edges, coords)).toBe(mstWeight(coords));
    }
  });

  test('tie-break is by the sorted burg-pair key (deterministic edge selection on a square)', () => {
    // b0=(0,0); b1=(0,10) and b2=(10,0) are both distance² 100 from the seed b0.
    // The stable tie-break (lexicographic on the sorted pair key) resolves every
    // tie the same way every run:
    //   pop b0|b1 (100, < b0|b2)  → tree {b0,b1}
    //   pop b0|b2 (100, < b1|b3)  → tree {b0,b1,b2}
    //   pop b1|b3 (100, < b2|b3)  → tree {b0,b1,b2,b3}
    // giving a fixed, reproducible minimum spanning tree of cost 300.
    const { saves, placements } = cityWorld([[0, 0], [0, 10], [10, 0], [10, 10]]);
    const edges = computeRoadEdges(saves, placements);
    const keys = edges
      .filter(e => e.tier === 'highway')
      .map(e => [e.fromBurgId, e.toBurgId].sort().join('|'));
    expect(keys).toEqual(['b0|b1', 'b0|b2', 'b1|b3']);
  });

  test('single city+ node yields no highway edges', () => {
    const saves = [
      { id: 'A', settlement: { tier: 'city', neighbourNetwork: [] } },
      { id: 'B', settlement: { tier: 'village', neighbourNetwork: [] } },
    ];
    const placements = Object.fromEntries([
      placement('b1', 0, 0, 'A'),
      placement('b2', 50, 0, 'B'),
    ]);
    const edges = computeRoadEdges(saves, placements);
    expect(edges.some(e => e.tier === 'highway')).toBe(false);
  });

  test('hostile city pair is still suppressed from the MST highway', () => {
    // Three cities in a line; A↔B hostile. The MST would normally link A-B-C,
    // but the hostile A-B pair must not produce a highway edge.
    const saves = [
      { id: 'A', settlement: { tier: 'city', neighbourNetwork: [{ id: 'B', relationshipType: 'hostile' }] } },
      { id: 'B', settlement: { tier: 'city', neighbourNetwork: [] } },
      { id: 'C', settlement: { tier: 'city', neighbourNetwork: [] } },
    ];
    const placements = Object.fromEntries([
      placement('b1', 0, 0, 'A'),
      placement('b2', 10, 0, 'B'),
      placement('b3', 20, 0, 'C'),
    ]);
    const edges = computeRoadEdges(saves, placements);
    const hostileKey = ['b1', 'b2'].sort().join('|');
    const hwKeys = edges
      .filter(e => e.tier === 'highway')
      .map(e => [e.fromBurgId, e.toBurgId].sort().join('|'));
    expect(hwKeys).not.toContain(hostileKey);
  });
});

describe('computeRoadEdges — supply-chain membership index', () => {
  const chainSettlement = (id, resources, institutions) => ({
    id,
    settlement: {
      tier: 'village',
      name: id,
      neighbourNetwork: [],
      config: { nearbyResources: resources },
      institutions: institutions.map(n => ({ id: n })),
    },
  });

  test('connects producer→consumer pairs within a chain, with the chain id(s) in the reason', () => {
    const saves = [
      chainSettlement('A', ['iron_ore'], []),            // produces iron
      chainSettlement('B', [], ['smithy']),              // consumes iron
      chainSettlement('C', ['grain'], ['armorer']),      // produces grain, consumes iron
      chainSettlement('D', [], ['bakery', 'weaponsmith']), // consumes grain + iron
      chainSettlement('E', ['timber'], []),              // produces timber, no consumer present
    ];
    const placements = Object.fromEntries(
      saves.map((s, i) => placement('b' + i, i * 7 + (i % 2) * 3, (i * 5) % 11, s.id)),
    );
    const chainEdges = computeRoadEdges(saves, placements)
      .filter(e => e.tier === 'trade' && e.reason.startsWith('chain:'))
      .map(e => ({ key: [e.fromBurgId, e.toBurgId].sort().join('|'), reason: e.reason }));

    // Iron producer A connects to every iron consumer (B, C, D); grain producer
    // C connects to grain consumer D. Timber producer E has no consumer ⇒ no edge.
    expect(chainEdges).toEqual([
      { key: 'b0|b1', reason: 'chain:iron' },
      { key: 'b0|b2', reason: 'chain:iron' },
      { key: 'b0|b3', reason: 'chain:iron' },
      { key: 'b2|b3', reason: 'chain:grain' },
    ]);
  });

  test('a pair sharing multiple chains lists all chain ids (CHAIN_DEFS order)', () => {
    const saves = [
      chainSettlement('A', ['iron_ore', 'grain'], ['bakery']), // produces iron+grain
      chainSettlement('B', [], ['smithy', 'bakery']),          // consumes iron+grain
    ];
    const placements = Object.fromEntries([
      placement('b0', 0, 0, 'A'),
      placement('b1', 5, 5, 'B'),
    ]);
    const trade = computeRoadEdges(saves, placements).find(e => e.reason?.startsWith('chain:'));
    expect(trade).toBeTruthy();
    expect(trade.reason).toBe('chain:iron,grain');
  });

  test('supply-chain edges are deterministic across runs', () => {
    const saves = [
      chainSettlement('A', ['iron_ore'], ['bakery']),
      chainSettlement('B', ['grain'], ['smithy']),
      chainSettlement('C', ['timber'], ['carpenter', 'armorer']),
      chainSettlement('D', [], ['weaver', 'tavern']),
    ];
    const placements = Object.fromEntries(
      saves.map((s, i) => placement('b' + i, i * 9, (i * 4) % 7, s.id)),
    );
    const first = JSON.stringify(computeRoadEdges(saves, placements));
    for (let i = 0; i < 25; i++) {
      expect(JSON.stringify(computeRoadEdges(saves, placements))).toBe(first);
    }
  });
});
