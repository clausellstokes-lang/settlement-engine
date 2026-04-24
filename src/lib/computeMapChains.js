/**
 * computeMapChains — derives chain edges for the map overlay.
 *
 * Input:  savedSettlements[] + mapState.placements
 * Output: [{ id, good, color, path: [settlementId, settlementId] }, ...]
 *
 * Only pairs where BOTH settlements are actually placed on the map contribute
 * edges — otherwise there's nothing to draw between. Chains are pairwise
 * (length 2 path); multi-hop tracing can come later if useful.
 *
 * ChainEdges.jsx consumes this shape directly via `useStore(s => s.supplyChains)`.
 */

import { CHAIN_DEFS, buildChainEdges } from './supplyChains.js';

/** Map chain id → display color (single source of truth). */
const CHAIN_COLOR = Object.fromEntries(CHAIN_DEFS.map(c => [c.id, c.color]));

export function computeMapChains(saves, placements) {
  if (!Array.isArray(saves) || !placements) return [];

  // Only consider settlements that are placed on the map.
  const placedIds = new Set();
  for (const p of Object.values(placements)) {
    if (p?.settlementId) placedIds.add(String(p.settlementId));
  }
  if (placedIds.size < 2) return [];

  const placedSaves = saves.filter(s => s?.id && placedIds.has(String(s.id)));

  const byName = new Map();
  for (const s of placedSaves) {
    const name = s.name || s.settlement?.name;
    if (name) byName.set(name, s);
  }

  const out = [];
  const seen = new Set();  // dedupe symmetric pairs per chain/direction

  for (let i = 0; i < placedSaves.length; i++) {
    for (let j = i + 1; j < placedSaves.length; j++) {
      const a = placedSaves[i];
      const b = placedSaves[j];
      const settA = a.settlement || a;
      const settB = b.settlement || b;

      const edges = buildChainEdges(settA, settB);
      for (const e of edges) {
        // buildChainEdges returns {from, to} as names — map back to ids.
        const fromSave = byName.get(e.from);
        const toSave   = byName.get(e.to);
        if (!fromSave || !toSave) continue;

        const key = `${e.chainId}:${fromSave.id}→${toSave.id}`;
        if (seen.has(key)) continue;
        seen.add(key);

        out.push({
          id: key,
          good: e.chainId,
          color: CHAIN_COLOR[e.chainId] || '#a0762a',
          path: [String(fromSave.id), String(toSave.id)],
        });
      }
    }
  }

  return out;
}
