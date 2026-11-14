/**
 * domain/display/chainPrintName.js — THE NAME AND THE SOURCE A CHAIN PRINTS UNDER (COHERENCE-AGREE-6, REVIEW-AGREE-2
 * F1; the chair's ruling of 2026-11-12: the rename at print time).
 *
 * The crossroads toll runs on every hub access: a river town with a toll bridge and a port with a customs house do
 * take tolls. The model is right; the name "Strategic Crossroads Toll — Strategic Crossroads" is false off a
 * crossroads. The RECORD keeps the catalogue's strings (fifteen logic readers and a saved world's re-derivation read
 * them); the PAGE asks this leaf what to print.
 *
 * THE RULE: where the chain's resource row requires an access the town lacks (`RESOURCE_DATA[resourceKey].requires`,
 * the same datum the roll, the wizard and the validator read), and the chain's own catalogue entry names the town's
 * access (`namesByAccess`, whose one home is `data/chainAccessNames.js`, a leaf, so the chains table stays out of the
 * first-paint graph), the page prints that entry; otherwise the record's own label and resource. Every page
 * that prints an active chain's name or source calls this leaf (`tests/lint/chainPrintSites.walker.test.js` holds the
 * list); the generation's coherence receipt reads what is printed through it.
 */
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { CHAIN_NAMES_BY_ACCESS } from '../../data/chainAccessNames.js';

/**
 * @param {{ label?: unknown, resource?: unknown, resourceKey?: unknown, needKey?: unknown, chainId?: unknown } | null | undefined} chain
 *   an entry of `economicState.activeChains`
 * @param {string | { config?: { tradeRouteAccess?: unknown } } | null | undefined} town the settlement, or its access
 * @returns {{ label: unknown, resource: unknown }}
 */
export function chainPrintName(chain, town) {
  const own = { label: chain?.label, resource: chain?.resource };
  const route = typeof town === 'string' ? town : String(town?.config?.tradeRouteAccess ?? '');
  const row = /** @type {{ requires?: unknown } | undefined} */ (RESOURCE_DATA[/** @type {keyof typeof RESOURCE_DATA} */ (String(chain?.resourceKey ?? ''))]);
  if (!route || !Array.isArray(row?.requires) || row.requires.includes(route)) return own;
  const byAccess = /** @type {Record<string, Record<string, { label: string, resource: string }>>} */ (CHAIN_NAMES_BY_ACCESS)[String(chain?.chainId ?? '')];
  const named = byAccess?.[route];
  return named ? { label: named.label, resource: named.resource } : own;
}
