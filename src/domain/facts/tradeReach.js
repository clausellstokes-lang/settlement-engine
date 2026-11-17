/**
 * domain/facts/tradeReach.js — WHETHER ANY ROAD REACHES AN ISOLATED PLACE (BAR6-RECORD, LAW 9's 9d.isolated, the
 * chair's direction (c) of BRIEF-BAR6: "ISOLATED WITH A ROAD CHANNEL IS A POOR ROAD, NOT NO TRADE"; vetoable by the owner).
 *
 * An isolated route (`config.tradeRouteAccess` / `economicState.tradeAccess` = 'isolated') is, in the economy's own
 * reading, a poor road and seasonal tracks: the food balance still brings in "expensive, irregular, politically
 * controlled imports — minor routes, sanctioned caravans" for a village or larger (`economy/foodBalance.js`, its minor
 * route rate, printed as the channel "minor routes and sanctioned caravans", 5% to 21% of the food in every isolated
 * instance of the census's 720, the fresh 300 and the 150 wide-read towns), and only a siege severs them. Three writers
 * read the same word as NO TRADE AT ALL ("No trade access: running on existing stockpiles only.", `economicState.js`;
 * "N institutions operating on stockpiles only (isolated trade)", `viability.js`; "run on stored iron: no trade road
 * reaches", `data/crisisDependence.js`) beside "carts bring in about half the rest" (REVIEW-WIDE-6 C193977, C194173,
 * C194531, bar0-town-occupied-rand-38).
 *
 *   minorRoutesReach({ route, tier, siege })   THE ONE READER: true where the route is isolated, no siege has cut it, and
 *                                              the place is a village or larger: the tiers the food balance gives a minor
 *                                              route (a thorp or a hamlet off every road has none). False on any other
 *                                              route (that is ordinary trade, not this fact).
 *
 * The rule is the food balance's own (`_minorRouteRate`: 0 under a siege's isolation, the village rate for a village,
 * the town rate for a town, a city or a metropolis, 0 below); that file keeps its private copy (no seat holds it this
 * round: named in BAR6-RECORD's hand-back). Layer 1 (over the config). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/generators/bar6RecordGuards.test.js
 */

import { isTradeRouteDisconnected } from '../tradeRouteSemantics.js';

/** The tiers the food balance gives a minor route when the road is isolated (`foodImportRates.js`'s two rates). */
const MINOR_ROUTE_TIERS = Object.freeze(['village', 'town', 'city', 'metropolis']);

/**
 * Does a poor road still reach this isolated place (minor routes and sanctioned caravans)?
 * @param {{ route?: unknown, tier?: unknown, siege?: unknown }} at the route token, the tier, and whether a siege is in force
 * @returns {boolean}
 */
export function minorRoutesReach(at) {
  if (!at || !isTradeRouteDisconnected(/** @type {string|null|undefined} */ (at.route ?? null)) || at.siege === true) return false;
  return MINOR_ROUTE_TIERS.includes(String(at.tier ?? ''));
}
