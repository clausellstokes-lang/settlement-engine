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
 * THE SECOND INSTANCE (mountain_pass, 2026-07-30): the same class recurred from
 * the other direction. The panel gained a seventh option that no route pool
 * rolls, nothing mapped it, and it scored 'unknown' — mechanically WORSE than
 * isolated, because the fail-closed unknown reading denied it even the
 * minor-route food trickle. Its cure is the `seasonal` tier below, and the
 * structural cure is SELECTABLE_ROUTE_VALUES at the foot of this file: the
 * drift list now reads the panel's own vocabulary, not the roll pools'.
 *
 * Pure; no side effects. Unknown / missing values resolve to the neutral
 * 'unknown' tier (all-zero deltas) so a genuinely unrecognized value never
 * mis-scores — it just contributes nothing, exactly as before.
 */

/**
 * THE SEASONAL TIER. A mountain pass is not a weaker road; it is a different
 * kind of connection. In season it carries a steady stream of merchants and
 * travellers, and in winter the snow closes it to near-total isolation. Scoring
 * it as `standard` overstates a settlement that spends part of every year cut
 * off; scoring it as `isolated` (or leaving it unrecognized, which is worse,
 * because unrecognized routes are fail-closed and earn not even the isolated
 * minor-route trickle) denies the traffic the pass exists to service.
 *
 * So the profile is annualized: roughly two seasons run open, one runs
 * unreliable in shoulder weather, and one is closed, which is about two fifths
 * (0.4) of a year-round road's throughput. Every seasonal number in this module
 * is that share applied to the corresponding standard-tier number and rounded,
 * so the whole profile moves together if the share is ever retuned.
 */

/**
 * Per-tier scoring contributions. Each consumer reads the field it cares about:
 *   - connectivity → causalState trade_connectivity
 *   - transport    → capacityModel transport supply
 *   - foodSupply   → capacityModel food supply (major-tier routes supplement food)
 *
 * The seasonal row is SEASONAL_OPEN_SHARE × the standard row, rounded:
 * 0.4 × 8 = 3.2 → +3 connectivity, 0.4 × 12 = 4.8 → +5 transport. Positive
 * (a pass is a real connection) but well under road and river.
 */
const TIER_DELTAS = Object.freeze({
  major:    { connectivity: +18, transport: +22, foodSupply: +6 },
  standard: { connectivity:  +8, transport: +12, foodSupply:  0 },
  seasonal: { connectivity:  +3, transport:  +5, foodSupply:  0 },
  isolated: { connectivity: -12, transport: -15, foodSupply:  0 },
  unknown:  { connectivity:   0, transport:   0, foodSupply:  0 },
});

/**
 * Food-deficit import coverage a seasonally-open route carries, as a share of
 * the raw deficit. SEASONAL_OPEN_SHARE × the road rung (0.35) = 0.14: below
 * road, and comfortably above the minor-route trickle an isolated settlement
 * receives (FOOD_IMPORT_RATES.minorRoutes 0.08 / minorRoutesVillage 0.05), so
 * the pass is worth having and still cannot feed the place through a winter.
 * Both food models (generators/economy/foodBalance, generators/foodGenerator)
 * read this one constant so their route ladders cannot drift apart.
 */
export const SEASONAL_ROUTE_FOOD_IMPORT_RATE = 0.14;

/**
 * Raw route value → canonical tier. Covers the values generation actually emits
 * AND the legacy major/minor/standard/none vocabulary the old readers branched on.
 */
/** @type {Readonly<Record<string, 'major'|'standard'|'seasonal'|'isolated'>>} */
const ROUTE_TIER = Object.freeze({
  // Real generated values
  crossroads:    'major',     // multi-route hub
  port:          'major',     // sea trade + harbor
  river:         'standard',  // water route
  road:          'standard',  // single main road
  coastal:       'standard',  // coastal access (treated like river)
  mountain_pass: 'seasonal',  // open in season, snowed shut in winter
  isolated:      'isolated',
  // Legacy / sample vocabulary
  major:         'major',
  minor:         'standard',
  standard:      'standard',
  none:          'isolated',
});

/**
 * @param {string|null|undefined} value raw trade-route value
 * @returns {'major'|'standard'|'seasonal'|'isolated'|'unknown'} the canonical tier for a route value.
 */
export function tradeRouteTier(value) {
  if (!value) return 'unknown';
  return ROUTE_TIER[String(value).toLowerCase()] || 'unknown';
}

/**
 * True when the route is isolated/none (no dependable regional connection).
 *
 * Prefer this name in new code: it describes the operational fact consumers
 * need without forcing them to know that both the authored `none` value and the
 * generated `isolated` value occupy the same canonical tier.
 *
 * @param {string|null|undefined} value raw trade-route value
 * @returns {boolean}
 */
export function isTradeRouteDisconnected(value) {
  return tradeRouteTier(value) === 'isolated';
}

/**
 * Compatibility name retained for existing domain consumers.
 *
 * @param {string|null|undefined} value raw trade-route value
 * @returns {boolean}
 */
export function isIsolatedRoute(value) {
  return isTradeRouteDisconnected(value);
}

/**
 * True only when a recognized route provides a physical regional connection.
 * Seasonal routes count: a pass that is open two seasons in three carries real
 * goods, and consumers that need a graded answer read the tier or the deltas.
 * Unknown values stay fail-closed: they must not fabricate import capacity.
 *
 * @param {string|null|undefined} value raw trade-route value
 * @returns {boolean}
 */
export function hasTradeRouteConnection(value) {
  const tier = tradeRouteTier(value);
  return tier === 'major' || tier === 'standard' || tier === 'seasonal';
}

/**
 * @typedef {Object} TradeRouteSemantics
 * @property {string|null} value         the raw input value
 * @property {'major'|'standard'|'seasonal'|'isolated'|'unknown'} tier
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

/** The route values the random route pools can roll (resolveConfig TERRAIN_ROUTE_POOLS). */
export const GENERATED_ROUTE_VALUES = Object.freeze([
  'road', 'river', 'crossroads', 'port', 'isolated',
]);

/**
 * Every route value a user can choose, which is the rolled set plus the ones
 * only an explicit choice reaches: resolveConfig passes an authored
 * tradeRouteAccess through verbatim, so a ConfigurationPanel option that no
 * pool rolls still arrives here.
 *
 * THIS is the drift list. mountain_pass shipped as a panel option, was absent
 * from the rolled set, and therefore scored the neutral 'unknown' tier for its
 * whole life. Tests walk the panel's own <option> values against this list and
 * against tradeRouteTier, so the next option added to the panel either lands a
 * tier here or reds.
 */
export const SELECTABLE_ROUTE_VALUES = Object.freeze([
  ...GENERATED_ROUTE_VALUES, 'mountain_pass',
]);
