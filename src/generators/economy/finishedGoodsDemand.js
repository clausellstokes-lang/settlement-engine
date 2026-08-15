/**
 * economy/finishedGoodsDemand.js — finished-goods supply/demand gap -> import/export label derivation.
 */

import { customDeps as _customDeps } from '../../lib/dependencyEngine.js';
import { INSTITUTION_FINISHED_GOODS_DEMAND } from '../../data/economicData.js';
import {
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';


// ── Finished goods demand-gap computation ────────────────────────────────────
// Computes the gap between what military/religious/maritime/luxury/alchemical
// institutions consume and what local supply chains produce.
// Pushes import labels when demand exceeds supply; export bonus when surplus.
// Builds on top of TRADE_DEPENDENCY_NEEDS (raw resources) without replacing it.
// Returns source additions so the flat-list caller can retain exact ownership.
export function computeFinishedGoodsDemand(tier, tradeRoute, institutions, nearbyResources, chainExports, chainImports) {
  const projection = {
    customTradeEndpoints: [],
    nativeExportsAdded: [],
    nativeImportsAdded: [],
  };
  const TIER_ORDER = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const tierIdx = TIER_ORDER.indexOf(tier);
  const instNames = nativeSemanticNames(institutions)
    .map(name => name.toLowerCase());
  const resKeys = nearbyResources || [];

  const hasInst = (keyword) => instNames.some((n) => n.includes(keyword.toLowerCase()));
  const hasRes = (key) => resKeys.some((r) => r === key || r.includes(key));
  const alreadyImporting = (label) => chainImports.some((i) => i.toLowerCase().includes(label.toLowerCase()));
  const alreadyExporting = (label) => chainExports.some((e) => e.toLowerCase().includes(label.toLowerCase()));

  for (const [category, cfg] of Object.entries(INSTITUTION_FINISHED_GOODS_DEMAND)) {
    // Tier gate
    const minTierIdx = TIER_ORDER.indexOf(cfg.minTier || 'thorp');
    if (tierIdx < minTierIdx) continue;

    // Route gate (maritime only fires on water routes)
    if (cfg.routeRequired && !cfg.routeRequired.includes(tradeRoute)) continue;

    // ── Compute total demand from present consumer institutions ────────────
    let totalDemand = 0;
    for (const [keyword, { demand }] of Object.entries(cfg.consumers)) {
      if (hasInst(keyword)) totalDemand += demand;
    }

    // §14 — local supply the user's PRESENT custom content contributes to this
    // demand category (a good/institution declaring `satisfies: <category>`).
    // Shrinks the import gap (e.g. an institution needing arms buys local
    // Dragonbone Greatswords); named goods export once local demand is covered.
    // Empty + inert when the user has no satisfying custom content, so existing
    // generations stay byte-identical.
    const customSupply = _customDeps.finishedGoodsSupply?.(
      category,
      institutions,
      tier,
      { includeTradeGoodOwners: true },
    ) || { supply: 0, goods: [], tradeGoodOwners: [] };

    if (totalDemand === 0 && customSupply.goods.length === 0) continue; // nothing to resolve

    // ── Compute local supply from present supplier institutions/resources ──
    let totalSupply = customSupply.supply;
    for (const [keyword, { supply }] of Object.entries(cfg.suppliers)) {
      // Some suppliers are resource keys (e.g. 'managed_forest', 'magical_node')
      if (keyword.includes('_')) {
        if (hasRes(keyword)) totalSupply += supply;
      } else {
        if (hasInst(keyword)) totalSupply += supply;
      }
    }

    const gap = totalDemand - totalSupply;

    // ── Import: demand exceeds local supply ───────────────────────────────
    if (gap > 0 && cfg.importLabels?.length) {
      // Scale label to gap magnitude
      const labelIdx = gap <= 2 ? 0 : gap <= 4 ? 1 : 2;
      const label = cfg.importLabels[Math.min(labelIdx, cfg.importLabels.length - 1)];
      if (label && !alreadyImporting(label.split(' ')[0])) {
        chainImports.push(label);
        projection.nativeImportsAdded.push(label);
      }
    }

    // §14 — local custom production meets/exceeds demand → export the surplus
    // specialty goods (e.g. Dragonbone Greatswords) by name.
    if (gap <= 0 && customSupply.goods.length) {
      for (const g of customSupply.goods) {
        if (!alreadyExporting(g)) chainExports.push(g);
      }
      projection.customTradeEndpoints.push(
        ...(customSupply.tradeGoodOwners || []),
      );
    }

    // ── Export bonus: supply substantially exceeds demand ─────────────────
    if (gap < -2 && cfg.exportBonus && !alreadyExporting(cfg.exportBonus)) {
      chainExports.push(cfg.exportBonus);
      projection.nativeExportsAdded.push(cfg.exportBonus);
    }
  }
  return projection;
}
