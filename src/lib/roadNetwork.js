/**
 * roadNetwork.js — derive the list of road edges to render on the map.
 *
 * Design (see chat transcript for full architecture):
 *   - Three tiers: highway / trade / lane + an implicit "sea" mode
 *   - Highways connect all city+ placements via a greedy nearest-neighbour MST
 *   - Trade roads follow explicit relationship or supply-chain links
 *   - Country lanes ensure every placement is connected to at least one other
 *   - Sea mode is chosen iframe-side when both endpoints are coastal and the
 *     water path is cheaper than the land path.
 *
 * This module decides WHICH edges to route; the actual A* pathfinding runs
 * in the iframe (main.js :: settlementEngine:computeRoadNetwork), because
 * that's where `pack.cells` lives.
 */

import { buildChainEdges } from './supplyChains.js';

const TIER_RANK = {
  thorp:      0,
  hamlet:     1,
  village:    2,
  town:       3,
  city:       4,
  metropolis: 5,
};

const TRADE_RELATIONSHIPS = new Set([
  'trade_partner', 'allied', 'patron', 'client',
]);

const HOSTILE_RELATIONSHIPS = new Set([
  'rival', 'cold_war', 'hostile',
]);

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

  // Track hostile pairs so we don't draw an MST link between them.
  const hostilePairs = new Set();
  for (const n of nodes) {
    if (!n.sett) continue;
    const nbs = n.sett?.neighbourNetwork || n.save?.neighbourNetwork || [];
    for (const link of nbs) {
      if (!link?.id) continue;
      const rel = link.relationshipType;
      if (!HOSTILE_RELATIONSHIPS.has(rel)) continue;
      const other = nodes.find(o => o.settlementId === String(link.id));
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

  // ── 1. Highways — MST over city+ placements ──────────────────────────────
  const topNodes = nodes.filter(n => n.rank >= 4);
  if (topNodes.length >= 2) {
    const connected = new Set([topNodes[0].burgId]);
    const byId = new Map(topNodes.map(n => [n.burgId, n]));

    while (connected.size < topNodes.length) {
      let best = null;
      let bestDist = Infinity;
      for (const a of connected) {
        const na = byId.get(a);
        for (const nb of topNodes) {
          if (connected.has(nb.burgId)) continue;
          const d = (na.x - nb.x) ** 2 + (na.y - nb.y) ** 2;
          if (d < bestDist) { bestDist = d; best = [na, nb]; }
        }
      }
      if (!best) break;
      addEdge(best[0], best[1], 'highway', 'mst');
      connected.add(best[1].burgId);
    }
  }

  // ── 2. Trade roads — chains + trade/allied/patron relationships ──────────
  const nodeBySettId = new Map();
  for (const n of nodes) {
    if (n.settlementId) nodeBySettId.set(n.settlementId, n);
  }

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

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    if (!a.sett) continue;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (!b.sett) continue;
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
    let best = null, bd = Infinity;
    for (const o of nodes) {
      if (o.burgId === n.burgId) continue;
      const d = (n.x - o.x) ** 2 + (n.y - o.y) ** 2;
      if (d < bd) { bd = d; best = o; }
    }
    if (best) addEdge(n, best, 'lane', 'nearest');
  }

  return edges;
}
