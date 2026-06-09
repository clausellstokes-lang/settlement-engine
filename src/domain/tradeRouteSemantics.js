/**
 * domain/tradeRouteSemantics.js — the single canonical reading of a settlement's
 * trade-route access.
 *
 * THE BUG THIS FIXES: generation emits `config.tradeRouteAccess` as one of
 * road / river / crossroads / port / coastal / isolated. But the causal substrate
 * (causalState.deriveTradeConnectivity) and the capacity model branched on a
 * DIFFERENT, legacy vocabulary — major / minor / standard / none — so river,
 * crossroads, and port scored *neutral* (no branch matched) and a `road` town got
 * a transport boost but zero trade-connectivity. Three of the five real route
 * types were silently mis-derived.
 *
 * This module is the one place that maps ANY route value (the real ones AND the
 * legacy ones) to a canonical tier and the scoring contributions each consumer
 * needs. Every reader now agrees by construction. The tier deltas are anchored to
 * the values the readers already used (major / standard / isolated), so road,
 * major, and isolated behavior is unchanged — only the previously-neutral
 * river / crossroads / port / coastal are corrected into their proper tier.
 *
 * Pure; no side effects. Unknown / missing values resolve to the neutral
 * 'unknown' tier (all-zero deltas) so a genuinely unrecognized value never
 * mis-scores — it just contributes nothing, exactly as before.
 */

/**
 * Per-tier scoring contributions. Each consumer reads the field it cares about:
 *   - connectivity → causalState trade_connectivity
 *   - transport    → capacityModel transport supply
 *   - foodSupply   → capacityModel food supply (major-tier routes supplement food)
 */
const TIER_DELTAS = Object.freeze({
  major:    { connectivity: +18, transport: +22, foodSupply: +6 },
  standard: { connectivity:  +8, transport: +12, foodSupply:  0 },
  isolated: { connectivity: -12, transport: -15, foodSupply:  0 },
  unknown:  { connectivity:   0, transport:   0, foodSupply:  0 },
});

/**
 * Raw route value → canonical tier. Covers the values generation actually emits
 * AND the legacy major/minor/standard/none vocabulary the old readers branched on.
 */
const ROUTE_TIER = Object.freeze({
  // Real generated values
  crossroads: 'major',     // multi-route hub
  port:       'major',     // sea trade + harbor
  river:      'standard',  // water route
  road:       'standard',  // single main road
  coastal:    'standard',  // coastal access (treated like river)
  isolated:   'isolated',
  // Legacy / sample vocabulary
  major:      'major',
  minor:      'standard',
  standard:   'standard',
  none:       'isolated',
});

/** @returns {'major'|'standard'|'isolated'|'unknown'} the canonical tier for a route value. */
export function tradeRouteTier(value) {
  if (!value) return 'unknown';
  return ROUTE_TIER[String(value).toLowerCase()] || 'unknown';
}

/** True when the route is isolated/none (no real regional connection). */
export function isIsolatedRoute(value) {
  return tradeRouteTier(value) === 'isolated';
}

/**
 * @typedef {Object} TradeRouteSemantics
 * @property {string|null} value         the raw input value
 * @property {'major'|'standard'|'isolated'|'unknown'} tier
 * @property {boolean} isolated
 * @property {number}  connectivity      causal trade_connectivity delta
 * @property {number}  transport         capacity transport-supply delta
 * @property {number}  foodSupply        capacity food-supply delta
 */

/**
 * Canonical semantics for a trade-route value.
 * @param {string|null|undefined} value
 * @returns {TradeRouteSemantics}
 */
export function tradeRouteSemantics(value) {
  const tier = tradeRouteTier(value);
  const deltas = TIER_DELTAS[tier];
  return {
    value: value || null,
    tier,
    isolated: tier === 'isolated',
    connectivity: deltas.connectivity,
    transport: deltas.transport,
    foodSupply: deltas.foodSupply,
  };
}

/** The route values generation can emit — used by tests + drift detection. */
export const GENERATED_ROUTE_VALUES = Object.freeze([
  'road', 'river', 'crossroads', 'port', 'isolated',
]);
