/**
 * tradeLinks — good-level cross-settlement trade reconciliation (§14 Phase 3b).
 *
 * At generation a settlement may be created with an imported NEIGHBOUR. This
 * resolves the actual trade between them at the level of individual goods, using
 * the canonical goods normalizer so variant spellings / categories line up
 * (e.g. our "Raw dragonbone" import matches the neighbour's "Dragonbone" export):
 *
 *   - We IMPORT a good the neighbour EXPORTS  → inbound link (sourced from them)
 *   - We EXPORT a good the neighbour IMPORTS  → outbound link (sold to them)
 *
 * Pure + deterministic; no rng, no store. Empty when there's no neighbour, the
 * relationship is hostile/suppressed, or there's no overlap — so it never
 * perturbs a settlement generated without a neighbour.
 */
import { goodsIntersect } from './goodsCatalog.js';

// Relationships under which the settlements don't openly trade goods.
const NO_TRADE_RELATIONSHIPS = new Set(['hostile']);

/**
 * @param {string[]} exportsList - this settlement's primaryExports
 * @param {string[]} importsList - this settlement's primaryImports
 * @param {{name?:string, relationshipType?:string, primaryExports?:string[], primaryImports?:string[], dynamics?:{economyMode?:string}}} neighbourProfile
 * @returns {Array<{good:string, goodId:string, direction:string, partner:string, viaNeighbour:boolean}>}
 */
export function deriveTradeLinks(exportsList, importsList, neighbourProfile) {
  const np = neighbourProfile;
  if (!np || !np.name) return [];
  if (NO_TRADE_RELATIONSHIPS.has(np.relationshipType) || np.dynamics?.economyMode === 'suppress') return [];

  const links = [];
  const seen = new Set();

  // We import X, the neighbour exports X → we source it from them.
  for (const m of goodsIntersect(importsList || [], np.primaryExports || [])) {
    const key = `in:${m.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({ good: m.sourceLabel, goodId: m.id, direction: 'import', partner: np.name, viaNeighbour: true });
  }

  // We export X, the neighbour imports X → we sell it to them.
  for (const m of goodsIntersect(exportsList || [], np.primaryImports || [])) {
    const key = `out:${m.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push({ good: m.sourceLabel, goodId: m.id, direction: 'export', partner: np.name, viaNeighbour: true });
  }

  return links;
}

export default deriveTradeLinks;
