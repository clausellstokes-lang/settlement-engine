/**
 * domain/facts/chainWorking.js — A CHAIN WORKS THIS RESOURCE HERE (COHERENCE-AGREE-7, REVIEW-AGREE-2 F4; the chair's
 * re-ruling of 2026-11-12: the leaf only, not the generator's gate).
 *
 * F4: an income line said a resource is worked here ("Local ore feeds the smithy", "Local quarry provides dressed
 * stone", "managed felling and sawmilling") where the roster and the Resources tab said no one works it. "Does the
 * town hold the resource?" is the resource fact; "is the resource WORKED here?" is a second fact, and the chain model
 * already answers it in each chain's own state. This leaf is that answer's one home:
 *
 *   a chain works resource K here  ⇔  some chain of the record's `economicState.activeChains`
 *     · takes K as its input (`resourceInputKey`),
 *     · has its input (`resourceInputAvailable === true`: the town's own, live; measured over the lane's 4,141
 *       births, the flag and the record's live roster agree on every one of 28,298 chains that name an input), and
 *     · is working (`status` one of WORKING_CHAIN_STATUSES: running, operational, entrepôt, vulnerable, magically
 *       sustained; an impaired chain's input is spent, and an unexploited one has no one at it).
 *
 * The income source itself is unchanged (the chair: "the income source stays as it is"). The lines that read this
 * leaf are the second wave's (lane/w2-a-leaves-2026-11-12, lane/w2-b-declare-2026-11-12).
 *
 * Layer 2 (the economy over the base). Pure: no randomness, no clock, no write; it reads the record and nothing else.
 */

/** The chain states in which a chain is working its input (computeActiveChains.js :: the status ladder). */
export const WORKING_CHAIN_STATUSES = Object.freeze(['running', 'operational', 'entrepot', 'vulnerable', 'magically_sustained']);

/**
 * The record's chains that work any of these resources here.
 * @param {unknown} record the settlement record (its `economicState.activeChains`)
 * @param {string | ReadonlyArray<string>} resourceKeys one catalogue resource key, or several (a family: any of them)
 * @returns {ReadonlyArray<object>} the working chains, in the record's order (empty where none works them)
 */
export function chainsWorking(record, resourceKeys) {
  const keys = new Set((Array.isArray(resourceKeys) ? resourceKeys : [resourceKeys]).map(String));
  const economicState = record && typeof record === 'object'
    ? /** @type {{ economicState?: { activeChains?: unknown } }} */ (record).economicState
    : null;
  const chains = Array.isArray(economicState?.activeChains) ? economicState.activeChains : [];
  return Object.freeze(chains.filter((chain) => {
    const c = chain && typeof chain === 'object'
      ? /** @type {{ resourceInputKey?: unknown, resourceInputAvailable?: unknown, status?: unknown }} */ (chain)
      : null;
    return c !== null
      && typeof c.resourceInputKey === 'string' && keys.has(c.resourceInputKey)
      && c.resourceInputAvailable === true
      && WORKING_CHAIN_STATUSES.includes(String(c.status));
  }));
}

/**
 * THE ONE ANSWER to "does a chain work this resource here?".
 * @param {unknown} record the settlement record
 * @param {string | ReadonlyArray<string>} resourceKeys one catalogue resource key, or a family of them (any)
 * @returns {boolean}
 */
export function chainWorksResource(record, resourceKeys) {
  return chainsWorking(record, resourceKeys).length > 0;
}

/**
 * WHETHER THE CHAIN MODEL SPEAKS OF THIS RESOURCE AT ALL (W2-C-LEAVES, 2026-11-13): some chain of the record takes it
 * as its input, in any state. Where none does, the leaf's "no" is the model's silence and not a reading: measured
 * at the merged base on the census's 720, every half-way gap line the leaf would answer "no" (9) sits on a resource
 * no chain of the record takes (fish in a thorp, a hot spring, gemstones), beside the house that works it part-way.
 * @param {unknown} record the settlement record
 * @param {string | ReadonlyArray<string>} resourceKeys one catalogue resource key, or a family of them (any)
 * @returns {boolean}
 */
export function chainModelsResource(record, resourceKeys) {
  const keys = new Set((Array.isArray(resourceKeys) ? resourceKeys : [resourceKeys]).map(String));
  const economicState = record && typeof record === 'object'
    ? /** @type {{ economicState?: { activeChains?: unknown } }} */ (record).economicState
    : null;
  const chains = Array.isArray(economicState?.activeChains) ? economicState.activeChains : [];
  return chains.some((chain) => {
    const key = chain && typeof chain === 'object' ? /** @type {{ resourceInputKey?: unknown }} */ (chain).resourceInputKey : null;
    return typeof key === 'string' && keys.has(key);
  });
}
