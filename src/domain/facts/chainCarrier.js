/**
 * domain/facts/chainCarrier.js — WHAT CARRIES A CHAIN (W2-A-LEAVES, 2026-11-12; the class table §5.1's homeless
 * condition "a chain's carrier", pattern 11: a flow card's source named the catalogue's resource in a town that
 * lacks it, 411 of 720).
 *
 * The chain record already says it, in flags nothing printed reads: `resourceKey` against the town's own
 * `config.nearbyResources`, `resourceActive`, `substituteActive`, `entrepot`. This leaf is the one reading:
 *   own         the town's own resource carries it (its label is the chain's `resource`);
 *   substitute  a substitute carries it;
 *   transit     it runs on passing trade (an entrepôt);
 *   bought      the input is bought in;
 *   none        the chain works no resource (a service, a house of worship).
 * The flow card and the three PDF chain writers read it (W2-C-LEAVES's cure of pattern 11 prints it); never the
 * catalogue's resource where the town lacks it.
 *
 * Layer 2 (the economy over the base). Pure: no randomness, no clock, no write.
 */

/** @typedef {'own'|'substitute'|'transit'|'bought'|'none'} CarrierKind */

/**
 * @param {unknown} chain one of `economicState.activeChains`
 * @param {unknown} record the settlement record (its `config.nearbyResources`)
 * @returns {{ kind: CarrierKind, resource: string|null }}
 */
export function chainCarrierOf(chain, record) {
  const c = chain && typeof chain === 'object' ? /** @type {{ resource?: unknown, resourceKey?: unknown, resourceActive?: unknown, substituteActive?: unknown, entrepot?: unknown }} */ (chain) : {};
  const config = record && typeof record === 'object' ? /** @type {{ config?: { nearbyResources?: unknown } }} */ (record).config : null;
  const near = new Set((Array.isArray(config?.nearbyResources) ? config.nearbyResources : []).map(String));
  const key = typeof c.resourceKey === 'string' && c.resourceKey ? c.resourceKey : null;
  if (!key) return { kind: 'none', resource: null };
  if (near.has(key) && c.resourceActive !== false) return { kind: 'own', resource: typeof c.resource === 'string' ? c.resource : null };
  if (c.substituteActive === true) return { kind: 'substitute', resource: null };
  if (c.entrepot === true) return { kind: 'transit', resource: null };
  return { kind: 'bought', resource: null };
}
