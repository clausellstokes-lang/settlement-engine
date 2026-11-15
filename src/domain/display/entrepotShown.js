/**
 * domain/display/entrepotShown.js — WHERE THE PAGE SAYS ENTREPÔT (TAIL-EXPORTS-PDF-3, the chair's ruling E21 of
 * 2026-11-15; vetoable by the owner).
 *
 * The Economics tab's flows say entrepôt where a chain on its page is an entrepôt: its filter chip "Entrepôt (N)"
 * counts the record's chains flagged `entrepot` (`EconomicsTab.jsx :: EconomicFlowsSection`, composed inline). The
 * PDF's ENTREPÔT tag read the record's town-wide `economicState.isEntrepot` instead, which stands on thorps, hamlets
 * and villages working no entrepôt chain and is absent from cities that work several. One reader for both: the chains
 * the page prints. (The tab's switch to this leaf is named for the group that holds the tab.)
 *
 * Pure: reads the record, writes nothing.
 */

/**
 * The page's entrepôt chains: the chains flagged `entrepot`, as the tab's chip counts them.
 * @param {unknown} chains the record's `economicState.activeChains`
 * @returns {number}
 */
export function entrepotChainCount(chains) {
  return Array.isArray(chains) ? chains.filter((c) => !!c && typeof c === 'object' && !!(/** @type {{ entrepot?: unknown }} */ (c)).entrepot).length : 0;
}

/**
 * Whether the page says entrepôt: a chain on it is an entrepôt.
 * @param {unknown} chains the record's `economicState.activeChains`
 * @returns {boolean}
 */
export function pageSaysEntrepot(chains) {
  return entrepotChainCount(chains) > 0;
}
