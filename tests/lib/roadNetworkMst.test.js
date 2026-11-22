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

/**
 * Total weight of the emitted MST highway edges, keyed back to coords by burgId.
 *
 * ⚠ Scoped to `reason === 'mst'`, not to `tier === 'highway'`. Since WEAVE NET-1
 * the highway TIER also carries the Urquhart supergraph's trunk edges (reason
 * 'urquhart'), which are deliberately NOT part of the spanning tree — they are
 * the cycles a tree cannot have. The minimality guarantee below is a claim about
 * Prim's output, so it reads Prim's output.
 */
function highwayWeight(edges, coords) {
  let total = 0;
  for (const e of edges) {
    if (e.reason !== 'mst') continue;
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

  test('forms a valid spanning tree: exactly V-1 mst edges that connect every city+ node', () => {
    const { saves, placements, coords } = cityWorld([
      [0, 0], [0, 10], [10, 0], [10, 10], [5, 5], [20, 3],
    ]);
    const edges = computeRoadEdges(saves, placements);
    // reason-scoped, not tier-scoped — see highwayWeight's note: the highway tier
    // now also carries NET-1's Urquhart trunk edges, which are not tree edges.
    const highways = edges.filter(e => e.reason === 'mst');

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
      .filter(e => e.reason === 'mst')
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
    // Widened past the MST: NO pass may link a hostile pair except the trade tier,
    // which forces through by design. The Urquhart pass rides the same `addEdge`
    // chokepoint precisely so this stays true without a second suppression rule.
    const nonTradeKeys = edges
      .filter(e => e.tier !== 'trade')
      .map(e => [e.fromBurgId, e.toBurgId].sort().join('|'));
    expect(nonTradeKeys).not.toContain(hostileKey);
  });
});

// ── WEAVE NET-1 · the Urquhart supergraph ───────────────────────────────────
describe('computeRoadEdges — Urquhart supergraph (WEAVE NET-1)', () => {
  const key = e => [e.fromBurgId, e.toBurgId].sort().join('|');
  const keySet = edges => new Set(edges.map(key));

  /** A mixed-tier world: `spec` is [x, y, tier] triples. */
  function mixedWorld(spec) {
    const saves = spec.map(([, , tier], i) => ({
      id: 'S' + i, settlement: { tier, neighbourNetwork: [] },
    }));
    const placements = Object.fromEntries(spec.map(([x, y], i) => [
      'b' + String(i).padStart(2, '0'), { x, y, settlementId: 'S' + i },
    ]));
    return { saves, placements };
  }

  /** Largest connected component size over the emitted edges. */
  function largestComponent(edges, placements) {
    const ids = Object.keys(placements);
    const adj = new Map(ids.map(k => [k, []]));
    for (const e of edges) {
      adj.get(e.fromBurgId)?.push(e.toBurgId);
      adj.get(e.toBurgId)?.push(e.fromBurgId);
    }
    let best = 0;
    const global = new Set();
    for (const start of ids) {
      if (global.has(start)) continue;
      const seen = new Set([start]);
      const stack = [start];
      while (stack.length) {
        for (const nb of adj.get(stack.pop()) || []) {
          if (!seen.has(nb)) { seen.add(nb); stack.push(nb); }
        }
      }
      for (const s of seen) global.add(s);
      if (seen.size > best) best = seen.size;
    }
    return best;
  }

  test('the Urquhart rule itself: a triangle keeps its two short sides and drops its longest', () => {
    // A wide, flat triangle of three cities: b0—b1 (10) and b1—b2 (10) are the
    // short sides; b0—b2 (19.something) is the longest and must NOT be drawn.
    const { saves, placements } = mixedWorld([
      [0, 0, 'city'], [10, 3, 'city'], [19, 0, 'city'],
    ]);
    const keys = keySet(computeRoadEdges(saves, placements));
    expect(keys.has('b00|b01')).toBe(true);
    expect(keys.has('b01|b02')).toBe(true);
    expect(keys.has('b00|b02')).toBe(false);
  });

  test('a square of cities gains its fourth side: the MST tree becomes a cycle', () => {
    // Prim emits three of the four sides (see the tie-break test above). The
    // Urquhart graph of a square is all four sides — each triangle drops the
    // shared diagonal — so the missing side arrives with reason 'urquhart'.
    const { saves, placements } = mixedWorld([
      [0, 0, 'city'], [0, 10, 'city'], [10, 0, 'city'], [10, 10, 'city'],
    ]);
    const edges = computeRoadEdges(saves, placements);
    const mst = edges.filter(e => e.reason === 'mst').map(key);
    const urq = edges.filter(e => e.reason === 'urquhart');
    expect(mst).toEqual(['b00|b01', 'b00|b02', 'b01|b03']);
    expect(urq.map(key)).toEqual(['b02|b03']);
    // Two city+ endpoints ⇒ the trunk tier, not a country lane.
    expect(urq[0].tier).toBe('highway');
    // Neither diagonal is drawn.
    const keys = keySet(edges);
    expect(keys.has('b00|b03')).toBe(false);
    expect(keys.has('b01|b02')).toBe(false);
  });

  test('the pass is purely ADDITIVE: every pre-Urquhart pass keeps its edges, tiers and reasons', () => {
    // The Urquhart pass runs LAST, so an edge an earlier pass claimed is already
    // in `seen` and cannot be re-tiered or re-reasoned. Pin the shape that makes
    // the route_count shift monotonic: nothing before it changes.
    const { saves, placements } = mixedWorld([
      [0, 0, 'metropolis'], [120, 20, 'city'], [60, 90, 'town'],
      [10, 140, 'village'], [130, 150, 'hamlet'], [200, 60, 'city'],
      [70, 200, 'thorp'], [190, 200, 'village'],
    ]);
    const edges = computeRoadEdges(saves, placements);
    const before = edges.filter(e => e.reason !== 'urquhart');
    // Every non-urquhart edge sits in an unbroken prefix — the urquhart edges are
    // appended, never interleaved.
    expect(edges.slice(0, before.length)).toEqual(before);
    // The MST is intact and every one of its pairs survives.
    expect(before.filter(e => e.reason === 'mst').length).toBeGreaterThan(0);
    // And the pass really did something (an empty pass would pass every assertion above).
    expect(edges.length).toBeGreaterThan(before.length);
  });

  test('cures the disconnected-clumps map: the emitted network spans every placement', () => {
    // The lane pass gives an unlinked placement exactly ONE edge, to its nearest
    // peer, which leaves small mutually-nearest clumps orphaned from the trunk.
    // This geometry has three such clumps around two cities.
    const { saves, placements } = mixedWorld([
      [0, 0, 'city'], [300, 0, 'city'],
      [20, 200, 'village'], [40, 205, 'hamlet'],       // clump 1
      [280, 210, 'village'], [300, 215, 'thorp'],      // clump 2
      [150, 400, 'hamlet'], [170, 405, 'thorp'],       // clump 3
    ]);
    const edges = computeRoadEdges(saves, placements);
    expect(largestComponent(edges, placements)).toBe(Object.keys(placements).length);
    // Not vacuous: without the Urquhart edges the same graph is fragmented.
    expect(largestComponent(edges.filter(e => e.reason !== 'urquhart'), placements))
      .toBeLessThan(Object.keys(placements).length);
  });

  test('never mints a trade-tier edge, and never crosses a hostile pair', () => {
    const spec = [
      [0, 0, 'city'], [100, 10, 'city'], [50, 90, 'town'],
      [10, 150, 'village'], [110, 160, 'hamlet'],
    ];
    const { saves, placements } = mixedWorld(spec);
    // b00 ↔ b02 are rivals; b03 ↔ b04 are cold-war.
    saves[0].settlement.neighbourNetwork.push({ id: 'S2', relationshipType: 'rival' });
    saves[3].settlement.neighbourNetwork.push({ id: 'S4', relationshipType: 'cold_war' });
    const edges = computeRoadEdges(saves, placements);
    const urq = edges.filter(e => e.reason === 'urquhart');
    expect(urq.length).toBeGreaterThan(0);
    for (const e of urq) expect(['highway', 'lane']).toContain(e.tier);
    const keys = keySet(edges.filter(e => e.tier !== 'trade'));
    expect(keys.has('b00|b02')).toBe(false);
    expect(keys.has('b03|b04')).toBe(false);
  });

  test('tier follows the endpoints: city+↔city+ is a highway, anything else a lane', () => {
    const { saves, placements } = mixedWorld([
      [0, 0, 'metropolis'], [90, 0, 'city'], [45, 70, 'city'],
      [45, -70, 'village'], [140, 60, 'thorp'],
    ]);
    const rankOf = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, metropolis: 5 };
    const tierOfBurg = Object.fromEntries(
      Object.keys(placements).map((b, i) => [b, ['metropolis', 'city', 'city', 'village', 'thorp'][i]]),
    );
    for (const e of computeRoadEdges(saves, placements).filter(e => e.reason === 'urquhart')) {
      const bothTop = rankOf[tierOfBurg[e.fromBurgId]] >= 4 && rankOf[tierOfBurg[e.toBurgId]] >= 4;
      expect(e.tier).toBe(bothTop ? 'highway' : 'lane');
    }
  });

  test('is deterministic AND independent of the placements key order', () => {
    const spec = [];
    for (let i = 0; i < 24; i++) {
      // Index-derived scatter — no RNG anywhere in the fixture.
      spec.push([(i * 137) % 500, (i * 89) % 400, i % 5 === 0 ? 'city' : 'village']);
    }
    const { saves, placements } = mixedWorld(spec);
    const first = JSON.stringify(computeRoadEdges(saves, placements));
    for (let i = 0; i < 15; i++) {
      expect(JSON.stringify(computeRoadEdges(saves, placements))).toBe(first);
    }
    // The triangulation inserts points in ascending burg-id order, so the road
    // network a world gets no longer depends on the iteration order of the
    // `placements` object. MEASURED: on this fixture the pre-NET-1 module emitted
    // a DIFFERENT PAIR SET when `placements` was reversed; with the Urquhart pass
    // closing the geometry, the pair set and the count are both stable.
    //
    // The one thing reordering still moves is the REASON LABEL on a pair both the
    // lane pass and the Urquhart pass would claim ('nearest' vs 'urquhart') — the
    // lane pass walks `nodes` in placements order and whichever pass reaches a
    // pair first owns it. That is pre-existing lane-pass character, it moves no
    // edge and no count, and the label is internal (nothing renders it).
    const reversed = Object.fromEntries(Object.entries(placements).reverse());
    const fwdEdges = JSON.parse(first);
    const revEdges = computeRoadEdges(saves, reversed);
    expect(revEdges.length).toBe(fwdEdges.length);
    const fwd = keySet(fwdEdges);
    const rev = keySet(revEdges);
    expect(fwd.size).toBeGreaterThan(0);
    expect([...fwd].sort()).toEqual([...rev].sort());
  });

  test('stays planar: the Urquhart web never exceeds the 3n-6 planar edge bound', () => {
    for (const n of [12, 30, 48]) {
      const spec = [];
      for (let i = 0; i < n; i++) spec.push([(i * 211) % 900, (i * 307) % 700, 'village']);
      const { saves, placements } = mixedWorld(spec);
      const urq = computeRoadEdges(saves, placements).filter(e => e.reason === 'urquhart');
      expect(urq.length).toBeLessThanOrEqual(3 * n - 6);
      expect(urq.length).toBeGreaterThan(0);
    }
  });

  test('degenerate geometries do not throw and do not invent edges', () => {
    // (a) Every placement collinear — the Delaunay is empty, so the pass adds
    //     nothing beyond what the MST/lane passes already drew.
    const line = mixedWorld([[0, 0, 'city'], [10, 0, 'city'], [20, 0, 'city'], [30, 0, 'village']]);
    const lineEdges = computeRoadEdges(line.saves, line.placements);
    expect(lineEdges.length).toBeGreaterThan(0);
    expect(lineEdges.every(e => Number.isFinite(e.fromX) && Number.isFinite(e.toY))).toBe(true);

    // (b) Two placements sharing one exact coordinate — the second sits the pass
    //     out (distinct points only) but is still served by the lane pass.
    const dup = mixedWorld([
      [0, 0, 'city'], [50, 0, 'city'], [25, 40, 'village'], [25, 40, 'hamlet'],
    ]);
    const dupEdges = computeRoadEdges(dup.saves, dup.placements);
    const touched = new Set(dupEdges.flatMap(e => [e.fromBurgId, e.toBurgId]));
    expect(touched.has('b03')).toBe(true);

    // (c) Fewer than three placements — no triangulation is possible.
    const pair = mixedWorld([[0, 0, 'city'], [10, 0, 'city']]);
    expect(computeRoadEdges(pair.saves, pair.placements)
      .some(e => e.reason === 'urquhart')).toBe(false);
  });

  test('contains the Euclidean MST over ALL placements (the supergraph guarantee)', () => {
    // EMST ⊆ RNG ⊆ Urquhart is the classical containment this pass relies on for
    // its connectivity claim. Prove it against a brute-force EMST, not by assertion.
    const spec = [];
    for (let i = 0; i < 20; i++) spec.push([(i * 173) % 600, (i * 251) % 500, 'village']);
    const { saves, placements } = mixedWorld(spec);
    const ids = Object.keys(placements);
    const pts = ids.map(k => placements[k]);
    const inT = new Array(ids.length).fill(false);
    const best = new Array(ids.length).fill(Infinity);
    const from = new Array(ids.length).fill(-1);
    best[0] = 0;
    const emst = new Set();
    for (let it = 0; it < ids.length; it++) {
      let u = -1;
      for (let v = 0; v < ids.length; v++) if (!inT[v] && (u === -1 || best[v] < best[u])) u = v;
      inT[u] = true;
      if (from[u] >= 0) emst.add([ids[u], ids[from[u]]].sort().join('|'));
      for (let v = 0; v < ids.length; v++) {
        if (inT[v]) continue;
        const d = w([pts[u].x, pts[u].y], [pts[v].x, pts[v].y]);
        if (d < best[v]) { best[v] = d; from[v] = u; }
      }
    }
    const emitted = keySet(computeRoadEdges(saves, placements));
    expect(emst.size).toBe(ids.length - 1);
    for (const k of emst) expect(emitted.has(k)).toBe(true);
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

  test('custom-only native-key spelling cannot mint a trade road', () => {
    const producer = chainSettlement('A', ['iron_ore'], []);
    producer.settlement.config.nearbyResourcesNative = [];
    producer.settlement.config.nearbyResourcesCustom = ['iron_ore'];
    const consumer = chainSettlement('B', [], ['smithy']);
    const saves = [producer, consumer];
    const placements = Object.fromEntries([
      placement('b0', 0, 0, 'A'),
      placement('b1', 5, 5, 'B'),
    ]);
    const chainRoads = currentSaves => computeRoadEdges(
      currentSaves,
      placements,
    ).filter(edge => edge.reason?.startsWith('chain:'));

    expect(chainRoads(saves)).toEqual([]);

    const dualOwner = {
      ...producer,
      settlement: {
        ...producer.settlement,
        config: {
          ...producer.settlement.config,
          nearbyResourcesNative: ['iron_ore'],
        },
      },
    };
    expect(chainRoads([dualOwner, consumer]))
      .toContainEqual(expect.objectContaining({ reason: 'chain:iron' }));
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
