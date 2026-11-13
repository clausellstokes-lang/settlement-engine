/**
 * domain/chainYield.js — DOES THIS CHAIN YIELD WHAT ITS TABLE SAYS? (COHERENCE-AGREE-4, item 3′, the chair's
 * ruling of 2026-11-12: one fact, one answer.)
 *
 * A supply chain's `outputs` are its table's (`data/goods/chains.js`): what the chain makes when it is whole.
 * The exporter (`generators/computeActiveChains.js :: deriveExportsFromChains`) refuses a chain's outputs when
 * the chain is impaired or its primary input is depleted, so the town does not sell them. Every page that
 * prints a town's chain asks the same question — are these outputs, or what the chain yields when whole? —
 * and reads THIS predicate, so the card, the PDF and the trade list give one answer.
 *
 * A leaf: no generator import, so the PDF's chunk can read it. Pure.
 */

/** The label a page prints over a refused chain's table outputs (the chair's wording, vetoable). */
export const NORMALLY_YIELDS = 'Normally yields';

/**
 * Does the exporter refuse this chain's outputs: is it impaired, or is its primary input depleted? The
 * record's own condition on the chain answers first; a chain without one falls back to its depletion mark,
 * then to the caller's depleted-resource test (the exporter passes the record's depleted list; a page that
 * holds only the chain passes none).
 * @param {unknown} chain a chain of `economicState.activeChains`
 * @param {((resource: string) => boolean) | null} [isDepletedResource]
 * @returns {boolean}
 */
export function chainYieldRefused(chain, isDepletedResource = null) {
  if (!chain || typeof chain !== 'object') return false;
  const c = /** @type {{ status?: unknown, resourceInputCondition?: unknown, resourceDepleted?: unknown, resource?: unknown }} */ (chain);
  if (c.status === 'impaired') return true;
  if (c.resourceInputCondition) return c.resourceInputCondition === 'depleted';
  return Boolean(c.resourceDepleted
    || (typeof isDepletedResource === 'function' && typeof c.resource === 'string' && c.resource && isDepletedResource(c.resource)));
}

/**
 * The goods a town's chains yield ONLY through chains this leaf refuses: every output of a refused chain that no
 * yielding chain also makes, lower-cased (COHERENCE-AGREE-6, F2, the chair's ruling of 2026-11-12). Such a good is
 * neither exported nor produced locally, so the export list and "Produced locally" give the card's one answer:
 * every writer of either list asks this set before it writes a good (`economy/finishedGoodsDemand.js`'s export
 * bonus; `computeActiveChains.js :: deriveExportsFromChains` and `:: deriveLocalProductionFromChains`).
 * @param {unknown} chains `economicState.activeChains`
 * @param {((resource: string) => boolean) | null} [isDepletedResource]
 * @returns {Set<string>}
 */
export function goodsOnlyRefusedChainsMake(chains, isDepletedResource = null) {
  /** @type {Set<string>} */
  const refused = new Set();
  /** @type {Set<string>} */
  const yielding = new Set();
  for (const chain of Array.isArray(chains) ? chains : []) {
    const outputs = /** @type {{ outputs?: unknown }} */ (chain)?.outputs;
    const into = chainYieldRefused(chain, isDepletedResource) ? refused : yielding;
    for (const output of Array.isArray(outputs) ? outputs : []) into.add(String(output).toLowerCase());
  }
  return new Set([...refused].filter((good) => !yielding.has(good)));
}
