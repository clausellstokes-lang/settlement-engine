/**
 * roadNetwork.js — derive the list of road edges to render on the map.
 *
 * Design (see chat transcript for full architecture):
 *   - Three tiers: highway / trade / lane + an implicit "sea" mode
 *   - Highways connect all city+ placements via a true minimum spanning tree
 *     (Prim's algorithm backed by a binary-heap priority queue)
 *   - Trade roads follow explicit relationship or supply-chain links
 *   - Country lanes ensure every placement is connected to at least one other
 *   - Sea mode is chosen iframe-side when both endpoints are coastal and the
 *     water path is cheaper than the land path.
 *
 * This module decides WHICH edges to route; the actual A* pathfinding runs
 * in the iframe (main.js :: settlementEngine:computeRoadNetwork), because
 * that's where `pack.cells` lives.
 *
 * Determinism: every code path here must produce an identical edge set in an
 * identical order for identical inputs. The MST uses a stable tie-break (by
 * squared distance, then by the sorted `[a,b].sort().join('|')` burg-pair key)
 * and the supply-chain pass walks a precomputed chain-membership index in
 * stable node-index order rather than a Math/locale-dependent ordering.
 */

import { buildChainEdges, CHAIN_DEFS } from './supplyChains.js';

/**
 * Minimal binary min-heap (priority queue) over arbitrary items, ordered by a
 * caller-supplied comparator. `less(a, b)` returns true when `a` should pop
 * before `b`. The comparator is the only source of ordering, so determinism is
 * the caller's responsibility (we supply a total order in the MST below).
 */
class MinHeap {
  /** @param {(a: any, b: any) => boolean} less */
  constructor(less) {
    /** @type {any[]} */
    this.items = [];
    this.less = less;
  }

  get size() {
    return this.items.length;
  }

  push(item) {
    const a = this.items;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.less(a[i], a[parent])) break;
      [a[i], a[parent]] = [a[parent], a[i]];
      i = parent;
    }
  }

  pop() {
    const a = this.items;
    const n = a.length;
    if (n === 0) return undefined;
    const top = a[0];
    const last = a.pop();
    if (n > 1) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let smallest = i;
        if (l < a.length && this.less(a[l], a[smallest])) smallest = l;
        if (r < a.length && this.less(a[r], a[smallest])) smallest = r;
        if (smallest === i) break;
        [a[i], a[smallest]] = [a[smallest], a[i]];
        i = smallest;
      }
    }
    return top;
  }
}

const TIER_RANK = {
  thorp:      0,
  hamlet:     1,
  village:    2,
  town:       3,
  city:       4,
  metropolis: 5,
};

const TRADE_RELATIONSHIPS = new Set([
  'trade_partner', 'allied', 'patron', 'client', 'vassal',
]);

const HOSTILE_RELATIONSHIPS = new Set([
  'rival', 'cold_war', 'hostile',
]);

/**
 * Classify a single settlement by which supply chains it produces for and which
 * it consumes from. Mirrors the resource/institution matching in
 * supplyChains.buildChainEdges exactly so the chain-membership index used by the
 * supply-chain road pass stays equivalent to the old all-pairs scan. Computing
 * this once per node (instead of per ordered pair) is the O(P²)→O(P) win.
 *
 * @param {Object} sett a settlement object (save.settlement | save)
 * @returns {{ producesByChain: Set<string>, consumesByChain: Set<string> }}
 */
function chainMembership(sett) {
  const normRes = (r) => {
    if (typeof r === 'string') return r.toLowerCase();
    if (r && typeof r === 'object') return (r.id || r.name || '').toLowerCase();
    return '';
  };
  const resList = sett?.config?.nearbyResources
    || sett?.nearbyResources
    || sett?.resources
    || [];
  const resources = new Set(resList.map(normRes).filter(Boolean));

  const normInst = (i) => (i?.id || i?.name || '').toLowerCase();
  const insts = new Set((sett?.institutions || []).map(normInst).filter(Boolean));

  const hasInst = (set, consumer) => {
    if (set.has(consumer)) return true;
    const needleSpaced = consumer.replace(/_/g, ' ');
    for (const inst of set) {
      if (inst.includes(needleSpaced)) return true;
    }
    return false;
  };

  const producesByChain = new Set();
  const consumesByChain = new Set();
  for (const chain of CHAIN_DEFS) {
    if (chain.resources.some(r => resources.has(r))) producesByChain.add(chain.id);
    if (chain.consumers.some(c => hasInst(insts, c))) consumesByChain.add(chain.id);
  }
  return { producesByChain, consumesByChain };
}

/**
 * @param {Array} saves       savedSettlements from the store
 * @param {Object} placements mapState.placements — keyed by burgId
 * @returns {Array<{id, fromBurgId, toBurgId, fromX, fromY, toX, toY, tier, preferSea, reason}>}
 */
export function computeRoadEdges(saves, placements) {
  if (!placements) return [];

  // Index saves by id so we can attach settlement data to each placement
  const saveById = new Map();
  for (const s of Array.isArray(saves) ? saves : []) {
    if (s?.id) saveById.set(String(s.id), s);
  }

  // Build placement records
  const nodes = [];
  for (const [burgId, p] of Object.entries(placements)) {
    if (typeof p?.x !== 'number' || typeof p?.y !== 'number') continue;
    const save = p.settlementId ? saveById.get(String(p.settlementId)) : null;
    const sett = save?.settlement || save || null;
    const tier = sett?.tier || 'village';
    nodes.push({
      burgId: String(burgId),
      settlementId: p.settlementId ? String(p.settlementId) : null,
      x: p.x,
      y: p.y,
      tier,
      rank: TIER_RANK[tier] ?? 2,
      isPort: !!(sett?.tradeRouteAccess === 'port' || sett?.port),
      save,
      sett,
    });
  }

  if (nodes.length < 2) return [];

  const edges = [];
  const seen = new Set();

  // Index nodes by settlementId ONCE and reuse it for both the hostile-pair pass
  // and the trade-relationship pass below — replaces the per-link nodes.find()
  // linear scan (O(links·N) → O(links)). Keep the FIRST node per settlementId to
  // match the prior nodes.find() (first-match) semantics exactly.
  const nodeBySettId = new Map();
  for (const n of nodes) {
    if (n.settlementId && !nodeBySettId.has(n.settlementId)) nodeBySettId.set(n.settlementId, n);
  }

  // Track hostile pairs so we don't draw an MST link between them.
  const hostilePairs = new Set();
  for (const n of nodes) {
    if (!n.sett) continue;
    const nbs = n.sett?.neighbourNetwork || n.save?.neighbourNetwork || [];
    for (const link of nbs) {
      if (!link?.id) continue;
      const rel = link.relationshipType;
      if (!HOSTILE_RELATIONSHIPS.has(rel)) continue;
      const other = nodeBySettId.get(String(link.id));
      if (!other) continue;
      const key = [n.burgId, other.burgId].sort().join('|');
      hostilePairs.add(key);
    }
  }

  const addEdge = (a, b, tier, reason) => {
    if (!a || !b || a.burgId === b.burgId) return;
    const key = [a.burgId, b.burgId].sort().join('|');
    if (seen.has(key)) return;
    if (hostilePairs.has(key) && tier !== 'trade') return;  // no road between enemies unless forced
    seen.add(key);
    edges.push({
      id: `road_${key}`,
      fromBurgId: a.burgId,
      toBurgId:   b.burgId,
      fromX: a.x, fromY: a.y,
      toX:   b.x, toY:   b.y,
      tier,
      preferSea: a.isPort && b.isPort,
      reason,
    });
  };

  // ── 1. Highways — true MST over city+ placements (Prim + binary heap) ─────
  // Prim's algorithm grows one tree from a seed node, repeatedly pulling the
  // cheapest crossing edge from a binary-heap priority queue. This replaces the
  // old O(V²)-per-step greedy nearest-neighbour scan (overall O(V³)) with
  // O(E log V) ≈ O(V² log V), and — unlike the greedy heuristic — yields a true
  // minimum spanning tree.
  //
  // Determinism: ties in squared distance are broken by the sorted burg-pair key
  // `[a,b].sort().join('|')`, the same convention `addEdge` keys edges by. Since
  // every candidate pair has a unique key, the comparator is a strict total
  // order, so the popped edge sequence — and therefore the emitted edge set and
  // order — is identical on every run for identical input.
  const topNodes = nodes.filter(n => n.rank >= 4);
  if (topNodes.length >= 2) {
    const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    const pairKey = (a, b) => [a.burgId, b.burgId].sort().join('|');

    // Strict total order: cheaper weight first, then lexicographically smaller
    // burg-pair key. `key` is precomputed per heap entry so the comparator is
    // pure string/number comparison (no allocation, locale-independent).
    const less = (e1, e2) =>
      e1.w !== e2.w ? e1.w < e2.w : e1.key < e2.key;
    const heap = new MinHeap(less);

    const inTree = new Set();
    const seed = topNodes[0];
    inTree.add(seed.burgId);
    for (const nb of topNodes) {
      if (nb.burgId === seed.burgId) continue;
      heap.push({ from: seed, to: nb, w: dist2(seed, nb), key: pairKey(seed, nb) });
    }

    while (inTree.size < topNodes.length && heap.size > 0) {
      const edge = heap.pop();
      if (inTree.has(edge.to.burgId)) continue;  // stale — endpoint already attached
      addEdge(edge.from, edge.to, 'highway', 'mst');
      inTree.add(edge.to.burgId);
      // Relax: push crossing edges from the newly added node to outside nodes.
      const added = edge.to;
      for (const nb of topNodes) {
        if (inTree.has(nb.burgId)) continue;
        heap.push({ from: added, to: nb, w: dist2(added, nb), key: pairKey(added, nb) });
      }
    }
  }

  // ── 2. Trade roads — chains + trade/allied/patron relationships ──────────
  // (nodeBySettId built once above, reused here.)
  for (const n of nodes) {
    if (!n.sett) continue;
    const nbs = n.sett?.neighbourNetwork || n.save?.neighbourNetwork || [];
    for (const link of nbs) {
      if (!link?.id) continue;
      const rel = link.relationshipType;
      if (!TRADE_RELATIONSHIPS.has(rel)) continue;
      const other = nodeBySettId.get(String(link.id));
      if (!other) continue;
      addEdge(n, other, 'trade', 'rel:' + rel);
    }
  }

  // ── 2b. Supply-chain trade roads — chain-membership index ────────────────
  // The old pass ran buildChainEdges() over every O(P²) ordered pair of nodes
  // even though most pairs share no chain at all. Instead we classify each node
  // ONCE per chain as a producer and/or a consumer (mirroring buildChainEdges'
  // resource/institution matching), then only consider pairs that can actually
  // form a chain edge: a node belongs to a chain's candidate set iff it
  // produces OR consumes that chain. Connecting "within groups" this way is
  // equivalent to the all-pairs scan because buildChainEdges yields an edge for
  // a pair exactly when (one produces ∧ the other consumes) for some chain —
  // which can only happen when both nodes are in that chain's candidate set.
  //
  // Determinism: candidate pairs are deduped by node index and walked in
  // ascending (i, j) order — the same order the old i<j double loop used — so
  // the reason string and emit order are byte-for-byte stable.
  const chainNodes = nodes.filter(n => !!n.sett);
  if (chainNodes.length >= 2) {
    // Index of node → integer position, to preserve the original i<j ordering.
    const indexOf = new Map();
    chainNodes.forEach((n, i) => indexOf.set(n, i));

    // Per-node chain membership: produces[chainId] / consumes[chainId].
    const memberByChain = new Map();  // chainId → array of {node, produces, consumes}
    for (const chain of CHAIN_DEFS) memberByChain.set(chain.id, []);

    for (const n of chainNodes) {
      const { producesByChain, consumesByChain } = chainMembership(n.sett);
      for (const chain of CHAIN_DEFS) {
        const produces = producesByChain.has(chain.id);
        const consumes = consumesByChain.has(chain.id);
        if (produces || consumes) {
          memberByChain.get(chain.id).push({ node: n, produces, consumes });
        }
      }
    }

    // Collect candidate ordered pairs (i<j) that share at least one chain,
    // deduping across chains via the sorted burg-pair key.
    const pairSeen = new Set();
    /** @type {Array<[number, number, any, any]>} */
    const candidatePairs = [];
    for (const chain of CHAIN_DEFS) {
      const members = memberByChain.get(chain.id);
      // Only producer↔consumer crossings can yield an edge for this chain.
      for (let p = 0; p < members.length; p++) {
        for (let q = p + 1; q < members.length; q++) {
          const m1 = members[p];
          const m2 = members[q];
          const crosses =
            (m1.produces && m2.consumes) || (m2.produces && m1.consumes);
          if (!crosses) continue;
          const a = m1.node, b = m2.node;
          const key = [a.burgId, b.burgId].sort().join('|');
          if (pairSeen.has(key)) continue;
          pairSeen.add(key);
          const ia = indexOf.get(a), ib = indexOf.get(b);
          const [lo, loN, hiN] = ia < ib ? [ia, a, b] : [ib, b, a];
          candidatePairs.push([lo, indexOf.get(hiN), loN, hiN]);
        }
      }
    }

    // Walk pairs in ascending (i, j) order — matching the old double loop — and
    // build the reason via buildChainEdges so the chainId string is identical.
    candidatePairs.sort((p1, p2) => (p1[0] - p2[0]) || (p1[1] - p2[1]));
    for (const [, , a, b] of candidatePairs) {
      const chainEdges = buildChainEdges(a.sett, b.sett);
      if (chainEdges.length > 0) {
        const ids = chainEdges.map(c => c.chainId).join(',');
        addEdge(a, b, 'trade', 'chain:' + ids);
      }
    }
  }

  // ── 3. Country lanes — each unconnected placement → nearest other ────────
  const connectedIds = new Set();
  for (const e of edges) {
    connectedIds.add(e.fromBurgId);
    connectedIds.add(e.toBurgId);
  }
  for (const n of nodes) {
    if (connectedIds.has(n.burgId)) continue;
    // Connect to the nearest NON-HOSTILE neighbour. Walking candidates in
    // ascending distance (not just the single nearest) means a placement whose
    // closest neighbour is a rival still gets a lane to the next-nearest peer,
    // honouring the "every placement is connected" contract — a lane to a
    // hostile pair silently no-ops in addEdge and would leave n isolated.
    const candidates = [];
    for (const o of nodes) {
      if (o.burgId === n.burgId) continue;
      candidates.push({ dist: (n.x - o.x) ** 2 + (n.y - o.y) ** 2, node: o });
    }
    candidates.sort((c1, c2) => c1.dist - c2.dist);
    for (const { node: o } of candidates) {
      const key = [n.burgId, o.burgId].sort().join('|');
      if (hostilePairs.has(key)) continue;  // a lane road can't cross an enemy pair
      addEdge(n, o, 'lane', 'nearest');
      break;
    }
  }

  return edges;
}
