/**
 * sovereigntyReach.js — WR-10 amendment S: THE GEOGRAPHIC BOUND. A buyer must be able
 * to HOLD what it buys.
 *
 * "lived-route reachability AND reinforcement reach within an army-transit leg band
 * AND existing trade-flow connection. All three read from J4/spatial substrate; fail
 * any ⇒ the trade is not offered."
 *
 * THE BOUND SHAPES THE CANDIDATE SET, PLAN-LANE STYLE. Failing it is SILENCE, not a
 * receipt: a court on the far side of the world was never considering the purchase, so
 * there is no decision to record and nothing for a chronicle to say. `sovereigntyReach`
 * still returns its three sub-readings because a DM inspector and a test both need to
 * know WHICH leg failed — but `reachableAssetsFor` simply omits what cannot be held,
 * and that omission is the design rather than a lost receipt.
 *
 * ALL THREE READS ARE THE ENGINE'S OWN, NOT NEW ONES. This mattered enough to census
 * before writing a line, because inventing a reachability number here would be new
 * capability wearing repair's clothes:
 *
 *   1. LIVED ROUTE — `livedRouteToward` priced with `livedLegTicks`, the identical
 *      pair `routeNetworkConsumersTransit` uses for every other traveller. If the
 *      roads cannot carry a person there, they cannot carry a governor there.
 *   2. REINFORCEMENT REACH — `hopWeeks` (the spatial digest's own cost calibration)
 *      run through `armyMarchWeeks`, which is the EXACT function `planMarch` uses to
 *      decide when a real column arrives. The band is a march-week ceiling, so
 *      "reinforcement reach" means literally "an army of mine could get there in
 *      time", computed by the same arithmetic that moves armies. It reads the ARMY
 *      physics deliberately: the courier road and the marching road are calibrated
 *      differently in this engine, and a holding you can write to but not garrison is
 *      exactly the holding a buyer loses.
 *   3. TRADE-FLOW CONNECTION — every consecutive hop along the lived path must carry
 *      a goods flow above `none` in the route ledger's own accrual. A road that exists
 *      but nothing moves on is not a connection; it is a line on a map.
 *
 * ⚠ armyTransitKernel.js sits at 798/800 and is NOT touched: this leaf imports the
 * pure spatial primitives it and `planMarch` both consume. A two-line edit there would
 * red the layer rule, and the composition belongs in a leaf regardless.
 *
 * ⚠ MAX_REINFORCEMENT_WEEKS IS AN UNSOAKED BAND — §7 THE TUNING SURFACE, owner-signed
 * at the soak redo. It is the whole content of "within an army-transit leg band".
 *
 * PURE READ: no mutation, no rng, no wall-clock.
 */
import { livedRouteToward, consumableRouteNetwork } from './routeNetworkConsumers.js';
import { livedLegTicks } from './routeNetworkConsumersTransit.js';
import { edgeIdForPair } from './routeNetworkFlows.js';
import { armyMarchWeeks, ARMY_TRANSIT_TUNING } from '../spatial/armyTransit.js';
import { hopWeeks } from '../spatial/distanceRead.js';

/** The closed failure vocabulary — every way of not being able to hold a place. */
export const SOVEREIGNTY_REACH_FAILURES = Object.freeze([
  'unrouted', 'unmapped', 'out_of_march_band', 'untraded',
]);

export const SOVEREIGNTY_REACH_TUNING = Object.freeze({
  /**
   * The army-transit leg band: a buyer whose column would take longer than this to
   * arrive cannot hold the place, so the place is never offered to it.
   *
   * ⚠⚠ THIS NUMBER WAS MEASURED, NOT CHOSEN, AND THE FIRST CHOICE WAS DEAD. The
   * obvious band — something safely under `ARMY_TRANSIT_TUNING.MAX_MARCH_WEEKS` (52),
   * which is the ceiling a march is clamped to — is UNREACHABLE. `hopWeeks` does not
   * return a distance; it returns a distance through the digest's OWN `weeksPerCost`
   * CALIBRATION, which normalizes each realm to a bounded span. Measured on a 20-seat
   * 48x36 realm, every ordered pair in the whole world falls in a five-rung spectrum:
   *
   *     2w: 54 pairs   3w: 58   5w: 47   6w: 26   8w: 5
   *
   * A band of 12 therefore admits EVERY PAIR IN EVERY REALM: the guard would compile,
   * pass, and never once refuse a trade — the dead-band class this estate has already
   * been bitten by (a "N× stronger" band above a maximum expressible ratio of 1.50).
   * Making the map larger does not help, because calibration is the whole point of
   * `weeksPerCost`: a bigger world has longer weeks, not more of them.
   *
   * 5 sits inside the measured spectrum with both arms live — near holdings (2w/3w/5w)
   * are reachable, distant ones (6w/8w) are not — and the pin in
   * sovereigntyMarketReadsWr10.test.js proves BOTH SIDES on a real digest so this can
   * never quietly go dead again. ⚠ UNSOAKED BAND: §7 THE TUNING SURFACE owns the
   * value; what is NOT retunable is that it must stay inside the reachable spectrum.
   */
  MAX_REINFORCEMENT_WEEKS: 5,
  /** The readiness a reach question assumes when the caller names none. Neutral by
   *  construction: `armyMarchWeeks`'s speed multiplier is 1 exactly at 0.5, so a
   *  reach read with no readiness opinion applies no readiness opinion. */
  NEUTRAL_READINESS: 0.5,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);

/**
 * Does every consecutive hop on this path carry goods? Reads the route ledger's own
 * per-edge flow accrual — the same `usage.flows.goods` band the interdiction reader
 * calls an ARTERY.
 * @param {Record<string, unknown>} worldState @param {ReadonlyArray<string>} path
 * @returns {{ connected: boolean, deadHops: number }}
 */
function goodsFlowAlong(worldState, path) {
  if (!Array.isArray(path) || path.length < 2) return { connected: false, deadHops: 0 };
  const network = consumableRouteNetwork(worldState);
  const edges = recordOf(recordOf(network).edges);
  let deadHops = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const edgeId = edgeIdForPair(network, path[i], path[i + 1]);
    const usage = recordOf(recordOf(edges[String(edgeId)]).usage);
    const band = text(recordOf(usage.flows).goods) || 'none';
    if (!edgeId || band === 'none') deadHops += 1;
  }
  return { connected: deadHops === 0, deadHops };
}

/**
 * @typedef {Object} SovereigntyReachRead
 * @property {string} buyerId
 * @property {string} assetId
 * @property {boolean} holds            all three legs passed
 * @property {boolean} routed           leg 1
 * @property {boolean} reinforceable    leg 2
 * @property {boolean} traded           leg 3
 * @property {number|null} routeTicks
 * @property {number|null} marchWeeks
 * @property {ReadonlyArray<string>} failures  SOVEREIGNTY_REACH_FAILURES members
 * @property {string} receipt
 */

/**
 * CAN THIS BUYER HOLD THIS PLACE? Three independent reads, conjoined. Each is reported
 * separately so a failure names itself; the trade is offered only when all three pass.
 *
 * @param {{
 *   worldState?: unknown, digest?: unknown, buyerId?: unknown, assetId?: unknown,
 *   season?: unknown, readiness01?: unknown,
 * }} input
 * @returns {SovereigntyReachRead}
 */
export function sovereigntyReach(input) {
  const row = recordOf(input);
  const worldState = recordOf(row.worldState);
  const buyerId = text(row.buyerId);
  const assetId = text(row.assetId);
  // The season is a NAMED word or nothing. Narrowing to `string|null` here rather than
  // passing `unknown` through is what keeps both spatial readers strict-clean, and it
  // is also the honest shape: a garbage season is not a season.
  const season = typeof row.season === 'string' ? row.season : null;
  const readiness01 = Number.isFinite(Number(row.readiness01))
    ? Number(row.readiness01)
    : SOVEREIGNTY_REACH_TUNING.NEUTRAL_READINESS;

  /** @type {string[]} */
  const failures = [];
  if (!buyerId || !assetId || buyerId === assetId) {
    return {
      buyerId,
      assetId,
      holds: false,
      routed: false,
      reinforceable: false,
      traded: false,
      routeTicks: null,
      marchWeeks: null,
      failures: Object.freeze(['unmapped']),
      receipt: 'a reach question needs a buyer and a holding that are two different places.',
    };
  }

  // LEG 1 — the lived road.
  const route = livedRouteToward({
    worldState,
    fromId: buyerId,
    destId: assetId,
    costOf: (fromId, hop) => livedLegTicks({ worldState, fromId, hop, season }),
  });
  const routed = route.reachable === true;
  if (!routed) failures.push('unrouted');

  // LEG 2 — could a column of mine actually get there, on the army's own physics?
  const base = hopWeeks(/** @type {never} */ (row.digest), buyerId, assetId, season);
  const marchWeeks = base == null ? null : armyMarchWeeks(Number(base), readiness01);
  if (marchWeeks == null) failures.push('unmapped');
  const reinforceable = marchWeeks != null
    && marchWeeks <= SOVEREIGNTY_REACH_TUNING.MAX_REINFORCEMENT_WEEKS;
  if (marchWeeks != null && !reinforceable) failures.push('out_of_march_band');

  // LEG 3 — does anything actually move along that road?
  const flow = routed ? goodsFlowAlong(worldState, route.path) : { connected: false, deadHops: 0 };
  const traded = flow.connected;
  if (!traded) failures.push('untraded');

  const holds = routed && reinforceable && traded;
  const receipt = holds
    ? `${buyerId} can hold ${assetId}: the road runs in ${route.ticks} ticks,`
      + ` a column arrives in ${marchWeeks} weeks, and goods already move the whole way.`
    : `${buyerId} cannot hold ${assetId} (${failures.join(', ')}),`
      + ' so the holding is never offered to it.';
  return {
    buyerId,
    assetId,
    holds,
    routed,
    reinforceable,
    traded,
    routeTicks: routed ? route.ticks : null,
    marchWeeks,
    failures: Object.freeze([...new Set(failures)].sort(codepoint)),
    receipt,
  };
}

/**
 * THE CANDIDATE SET, SHAPED. Every holding this buyer could actually hold, in
 * codepoint order. What it cannot hold is simply ABSENT — the plan-lane discipline
 * amendment S asks for, where an impossible option produces no decision and therefore
 * no receipt.
 *
 * @param {{
 *   worldState?: unknown, digest?: unknown, buyerId?: unknown,
 *   assetIds?: unknown, season?: unknown, readiness01?: unknown,
 * }} input
 * @returns {ReadonlyArray<string>}
 */
export function reachableAssetsFor(input) {
  const row = recordOf(input);
  const ids = Array.isArray(row.assetIds) ? row.assetIds.map(text).filter(Boolean) : [];
  return Object.freeze(
    [...new Set(ids)].sort(codepoint).filter(
      (assetId) => sovereigntyReach({ ...row, assetId }).holds,
    ),
  );
}

/** Re-exported so a caller banding a march never re-derives the army's speed law.
 *  Named rather than starred so the reach on this module stays a reviewed list. */
export { ARMY_TRANSIT_TUNING };
