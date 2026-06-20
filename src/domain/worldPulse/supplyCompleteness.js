/**
 * domain/worldPulse/supplyCompleteness.js — Feature B primitive (NET-NEW, pure).
 *
 * `supplyCompleteness(snapshot, supplierId, commodity)` → 0..1: how completely
 * `supplierId` can supply `commodity` to a buyer. It is the trade war's
 * "supply-chain readiness" term — the §3.2 `w_sup` factor.
 *
 * Two halves, blended:
 *   1. PRODUCTION — does the supplier actually export/produce this good? A good
 *      it lists in `economicState.primaryExports` (or yields as an active chain
 *      output) earns the production credit; a supplier that does not make the
 *      good at all scores ~0 (it cannot be a credible primary supplier).
 *   2. CHAIN HEALTH — of the supplier's OWN supply chains that bear on this good
 *      (its activeChains whose outputs/inputs match K, plus the health of its
 *      INBOUND trade_dependency/trade_route channels carrying K's inputs), what
 *      fraction are healthy ("stable")? A supplier whose own feedstock is
 *      blockaded cannot reliably re-export — its completeness sags.
 *
 * DETERMINISM: pure. Reads only the pre-tick snapshot (settlement.economicState,
 * the regional graph's confirmed channels). No RNG, no Date, no Map/Set output
 * iteration — every scan is a reduce/filter over an array, order-independent.
 */

import { normalizeGood } from '../region/goodsCatalog.js';
import { deriveAllSupplyChainStates } from '../supplyChainState.js';

/** @param {any} value */
function clamp01(value) {
  const n = Number.isFinite(value) ? Number(value) : 0;
  return Math.max(0, Math.min(1, n));
}

/**
 * Canonical good id for a label/object, or a slug fallback — never throws.
 * @param {any} value
 */
function goodId(value) {
  const good = normalizeGood(value);
  return good ? good.id : null;
}

/**
 * Does any label in `list` resolve to the same canonical good as `commodityId`?
 * @param {any} list
 * @param {string|null} commodityId
 */
function listMatchesCommodity(list, commodityId) {
  if (!commodityId) return false;
  for (const entry of list || []) {
    if (goodId(entry) === commodityId) return true;
  }
  return false;
}

/**
 * The canonical good ids a chain touches (outputs ∪ rawInputs ∪ intermediates).
 * @param {any} chain
 */
function chainGoodIds(chain) {
  const out = new Set();
  /** @param {any} arr */
  const collect = (arr) => {
    for (const v of Array.isArray(arr) ? arr : []) {
      const id = goodId(v);
      if (id) out.add(id);
    }
  };
  collect(chain?.outputs);
  collect(chain?.rawInputs);
  collect(chain?.intermediateGoods);
  collect(chain?.dependencies);
  if (chain?.resource) { const id = goodId(chain.resource); if (id) out.add(id); }
  return out;
}

/**
 * Confirmed INBOUND trade channels that carry `commodityId` into `supplierId`
 * (the supplier's own feedstock for K). A channel with NO declared goods is a
 * general trade tie and counts as relevant only as a weak fallback.
 * @param {any} snapshot
 * @param {string} supplierId
 * @param {string|null} commodityId
 */
function inboundCommodityChannels(snapshot, supplierId, commodityId) {
  const id = String(supplierId);
  const channels = snapshot?.regionalGraph?.channels || snapshot?.channels || [];
  const carriers = ['trade_dependency', 'trade_route', 'export_market'];
  const out = [];
  for (const channel of channels) {
    if (String(channel?.to) !== id) continue;
    if (!carriers.includes(String(channel?.type))) continue;
    if (String(channel?.status || 'confirmed') !== 'confirmed') continue;
    const goods = Array.isArray(channel?.goods) ? channel.goods : [];
    const carriesK = goods.length === 0
      ? null // general tie — relevance unknown
      : goods.some(/** @param {any} g */ g => goodId(g) === commodityId);
    if (carriesK === false) continue; // explicitly carries OTHER goods, not K
    out.push({ channel, specific: carriesK === true });
  }
  return out;
}

/**
 * 0..1 supply completeness of `supplierId` for `commodity` to an arbitrary buyer.
 *
 * @param {any} snapshot      the SINGLE pre-tick world snapshot
 * @param {string} supplierId
 * @param {string|object} commodity  a good label, id, or normalized-good object
 * @returns {number} 0..1
 */
export function supplyCompleteness(snapshot, supplierId, commodity) {
  const commodityId = goodId(commodity);
  if (!commodityId) return 0;
  const entry = snapshot?.byId?.get?.(String(supplierId));
  const settlement = entry?.settlement;
  if (!settlement) return 0;

  const eco = settlement.economicState || settlement.economy || {};
  const exportsList = eco.primaryExports || eco.exports || [];

  // ── Production credit: the supplier must actually make/export K. ───────────
  const chains = deriveAllSupplyChainStates(settlement);
  const producesK = listMatchesCommodity(exportsList, commodityId)
    || chains.some(/** @param {any} chain */ chain => chainGoodIds(chain).has(commodityId));
  if (!producesK) return 0; // cannot be a credible primary supplier of K

  // ── Chain health: fraction of the supplier's K-relevant chains that are
  //    "stable" (healthy). A blockaded/collapsing feedstock sags completeness. ─
  const relevantChains = chains.filter(/** @param {any} chain */ chain => chainGoodIds(chain).has(commodityId));
  let chainScore = 1; // a producer with no modeled chains is treated as healthy
  if (relevantChains.length) {
    const healthy = relevantChains.filter(/** @param {any} chain */ chain => chain.status === 'stable').length;
    chainScore = healthy / relevantChains.length;
  }

  // ── Inbound feedstock: the supplier's OWN trade dependencies for K's inputs.
  //    A confirmed inbound carrier is a positive (the inputs flow); none is
  //    neutral (the supplier may be self-sufficient). Specific carriers (a
  //    channel whose goods include K) weigh full; general ties weigh half. ────
  const inbound = inboundCommodityChannels(snapshot, supplierId, commodityId);
  let inboundScore = 0.6; // self-sufficient baseline (no modeled inbound need)
  if (inbound.length) {
    let strengthSum = 0;
    let weightSum = 0;
    for (const { channel, specific } of inbound) {
      const w = specific ? 1 : 0.5;
      strengthSum += clamp01(channel.strength ?? channel.severity ?? 0.45) * w;
      weightSum += w;
    }
    inboundScore = weightSum > 0 ? clamp01(strengthSum / weightSum) : 0.6;
    // A present-but-weak feedstock pins completeness down; a strong one lifts it.
    inboundScore = clamp01(0.4 + inboundScore * 0.6);
  }

  // Blend: production is the gate (already passed → full base), chain health and
  // inbound feedstock modulate. Weighted so a producer with healthy chains and
  // sound feedstock approaches 1, a strained one drops toward ~0.4.
  return clamp01(0.4 + chainScore * 0.4 + inboundScore * 0.2);
}
