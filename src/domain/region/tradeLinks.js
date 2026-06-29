/**
 * tradeLinks — good-level cross-settlement trade reconciliation.
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
import { finishedGoodsCategoryOf } from '../../data/economicData.js';

// Relationships under which the settlements don't openly trade goods.
const NO_TRADE_RELATIONSHIPS = new Set(['hostile']);

/**
 * Good-level cross-settlement trade with the imported neighbour. Two matchers:
 *   1. canonical good id (goodsCatalog) — same good on both sides;
 *   2. CATEGORY bridge — a finished-goods demand category (military/etc.) we
 *      supply matches one the neighbour trades, so a specific custom good
 *      (Dragonbone Greatswords, satisfies:military) fills a neighbour's generic
 *      "Advanced weapons and armour" demand. Our side's category comes from
 *      opts.satisfiesOf (a custom good's declared `satisfies`) falling back to
 *      the label's own category; the neighbour's from its labels.
 * @param {string[]} exportsList - this settlement's primaryExports
 * @param {string[]} importsList - this settlement's primaryImports
 * @param {{name?:string, relationshipType?:string, primaryExports?:string[], primaryImports?:string[], dynamics?:{economyMode?:string}}} neighbourProfile
 * @param {{satisfiesOf?:(label:string)=>(string|null)}} [opts]
 * @returns {Array<{good:string, goodId:string, direction:string, partner:string, viaNeighbour:boolean, viaCategory?:boolean}>}
 */
export function deriveTradeLinks(exportsList, importsList, neighbourProfile, opts = {}) {
  const np = neighbourProfile;
  if (!np || !np.name) return [];
  if (NO_TRADE_RELATIONSHIPS.has(/** @type {string} */ (np.relationshipType)) || np.dynamics?.economyMode === 'suppress') return [];

  /** @type {Array<{good:string, goodId:string, direction:string, partner:string, viaNeighbour:boolean, viaCategory?:boolean}>} */
  const links = [];
  const seen = new Set(); // `${direction}:${goodLabelLower}` so the two matchers don't duplicate

  /** @param {any} good @param {any} goodId @param {any} direction @param {any} viaCategory */
  const push = (good, goodId, direction, viaCategory) => {
    const key = `${direction}:${String(good).toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push({ good, goodId, direction, partner: /** @type {string} */ (np.name), viaNeighbour: true, ...(viaCategory ? { viaCategory: true } : {}) });
  };

  // 1) canonical good id — same good traded both ways.
  for (const m of goodsIntersect(importsList || [], np.primaryExports || [])) push(m.sourceLabel, m.id, 'import', false);
  for (const m of goodsIntersect(exportsList || [], np.primaryImports || [])) push(m.sourceLabel, m.id, 'export', false);

  // 2) category bridge — one link per category per direction.
  const ourCat = (/** @type {any} */ label) => (opts.satisfiesOf && opts.satisfiesOf(label)) || finishedGoodsCategoryOf(label);
  const neighExportCats = new Set((np.primaryExports || []).map(finishedGoodsCategoryOf).filter(Boolean));
  const neighImportCats = new Set((np.primaryImports || []).map(finishedGoodsCategoryOf).filter(Boolean));
  const usedCat = new Set(); // `${direction}:${cat}` — one bridged link per category/direction
  for (const g of (importsList || [])) {
    const c = ourCat(g);
    if (c && neighExportCats.has(c) && !usedCat.has(`import:${c}`)) { usedCat.add(`import:${c}`); push(g, `category.${c}`, 'import', true); }
  }
  for (const g of (exportsList || [])) {
    const c = ourCat(g);
    if (c && neighImportCats.has(c) && !usedCat.has(`export:${c}`)) { usedCat.add(`export:${c}`); push(g, `category.${c}`, 'export', true); }
  }

  return links;
}

export default deriveTradeLinks;
