/**
 * routeNetworkConsumersInterdiction.js — THE NAMED MATERIAL ARTERY (W-J slice J4;
 * binding law docs/DESIGN_ROUTE_LIFECYCLE.md §0, §4, §10 and §13's integration pin
 * "interdiction reads the ledger", with DESIGN_SUPPLY_WEB_WARFARE.md §4's
 * INTERDICTION instrument: patrol the routes rather than strike the sources).
 *
 * §0 is the law this file exists to honour: every change is an event with an address
 * and a reason DENOMINATED IN GOODS, PEOPLE, OR STRATEGY. An interdiction that cuts
 * "a supply link" is a number moving; an interdiction that cuts "the iron road out of
 * Brackwater" is a thing that happened to a place. The difference is entirely whether
 * the war layer can ask the route ledger what a road actually carries, and this module
 * is that question.
 *
 * ── IT READS THE LEDGER THE CHARTER EVENTS WRITE, NOT A SECOND ONE ──────────
 * The goods on an artery are `edge.usage`, which is J2's flow accrual: the same
 * record whose band J3's decay ladder reads and whose `reasonGoods` a charter event
 * quotes when it says why a road was struck. There is no separate interdiction
 * ledger, no re-derivation of what moves where, and therefore no way for the war
 * layer and the Herald to disagree about which artery was cut.
 *
 * ── A HIDDEN PATH CANNOT BE INTERDICTED, AND THAT IS THE DESIGN ─────────────
 * An interdiction PATROLS. A hidden path is, by Law 5, the way the realm has
 * forgotten: no traffic, no upkeep, nobody watching it. §5b's smuggler extreme says
 * the dangerous goods take the overgrown road precisely because it is the road
 * nobody is standing on. So a target reachable only by a hidden way reads
 * `hidden_only` and the patrol severs nothing. That is not a gap in the model; it is
 * the model saying that strangling a town with smugglers in it is harder, which is
 * the same sentence §5's ALLIED RELIEF makes from the other side.
 *
 * ── READS ONLY, STRUCTURALLY ────────────────────────────────────────────────
 * There is no setter here, nothing takes a worldState to write to, and nothing
 * returns a successor world. The severance is a READING the war layer acts on with
 * its own machinery; this module never touches the route ledger, so an interdiction
 * cannot silently retune the network it is describing. That is the same shape
 * npcCirculationBelief takes, and for the same reason.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store, no mutation.
 */

import { normalizeGood } from '../region/goodsCatalog.js';
import { livedNeighbours } from './routeNetworkConsumers.js';
import { routeLifecycleActive } from './routeNetworkLedger.js';

/**
 * The closed SEVERANCE VERDICT vocabulary. Every way an interdiction fails to cut
 * anything has its own word, because "returned nothing" is not a reason a receipt
 * can carry and the difference between them is the difference between a target that
 * has no road, a target whose road is idle, and a target whose road is a smuggler's.
 * @type {ReadonlyArray<string>}
 */
export const SEVERANCE_VERDICTS = Object.freeze([
  'severed', 'no_route', 'no_traffic', 'hidden_only', 'dormant',
]);

/** The flow class an artery is denominated in (§4's three named classes). @type {string} */
export const ARTERY_FLOW_CLASS = 'goods';

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value);
}

/** @param {unknown} value @returns {number} */
function count(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * THE CANONICAL GOOD ID for whatever spelling a caller holds. Routed through the
 * goods catalog rather than compared as a raw string, because the supply layer names
 * a link by its catalog NAME and the route ledger stores its catalog ID. Comparing
 * those two directly is the hand-rolled-key defect this estate has a standing hazard
 * record for; the resolver is the cure.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function arteryGoodId(value) {
  const good = normalizeGood(/** @type {never} */ (value));
  return good && good.id ? String(good.id) : '';
}

/**
 * @typedef {Object} RouteArtery
 * @property {string} edgeId
 * @property {string} partnerId  the far end
 * @property {string} grade
 * @property {string} mode
 * @property {ReadonlyArray<string>} goods  the goods the ledger says move here
 * @property {string} band       the goods band this road carries
 * @property {number} tally      the exact goods tally the ledger accrued
 * @property {ReadonlyArray<string>} receipts  the flow sources that named it
 * @property {number} lastTick   the last tick a flow walked it
 */

/**
 * @param {Record<string, unknown>} edgeUsage
 * @param {import('./routeNetworkConsumers.js').LivedHop} hop
 * @returns {RouteArtery}
 */
function arteryOf(edgeUsage, hop) {
  const flows = asRecord(edgeUsage.flows);
  const tally = asRecord(edgeUsage.tally);
  const receipts = asRecord(edgeUsage.receipts);
  const named = receipts[ARTERY_FLOW_CLASS];
  const goods = Array.isArray(edgeUsage.reasonGoods) ? edgeUsage.reasonGoods.map(text) : [];
  return {
    edgeId: hop.edgeId,
    partnerId: hop.toId,
    grade: hop.grade,
    mode: hop.mode,
    goods: Object.freeze([...goods].sort()),
    band: text(flows[ARTERY_FLOW_CLASS]) || 'none',
    tally: count(tally[ARTERY_FLOW_CLASS]),
    receipts: Object.freeze(Array.isArray(named) ? [...named].map(text).sort() : []),
    lastTick: count(edgeUsage.lastTick),
  };
}

/**
 * EVERY MATERIAL ARTERY INTO ONE SETTLEMENT (§4's ledger, read as a war question).
 *
 * A road only counts as an artery when the flow ledger says GOODS actually move on
 * it. A way that has only ever carried armies is a military corridor and cutting it
 * strangles nobody, so it is not offered to an instrument whose whole purpose is to
 * starve a town. Hidden ways are excluded for the reason in the header.
 *
 * Codepoint-ordered by edge id, so a plan that picks the first artery picks the same
 * one on every machine.
 *
 * @param {{ worldState: Record<string, unknown>, targetId: string }} input
 * @returns {ReadonlyArray<RouteArtery>}
 */
export function interdictableArteries(input) {
  const worldState = input.worldState || {};
  if (!routeLifecycleActive(worldState)) return Object.freeze([]);
  const network = asRecord(asRecord(worldState.spatialLedgers).routeNetwork);
  const edges = asRecord(network.edges);
  /** @type {Array<RouteArtery>} */
  const out = [];
  for (const hop of livedNeighbours(worldState, input.targetId, {})) {
    if (hop.hidden) continue;
    const usage = asRecord(asRecord(edges[hop.edgeId]).usage);
    const artery = arteryOf(usage, hop);
    if (artery.tally <= 0) continue;
    out.push(artery);
  }
  out.sort((x, y) => (x.edgeId < y.edgeId ? -1 : x.edgeId > y.edgeId ? 1 : 0));
  return Object.freeze(out);
}

/**
 * @typedef {Object} SeveranceReading
 * @property {string} verdict     one of SEVERANCE_VERDICTS
 * @property {boolean} severs     the one-word reading of `verdict`
 * @property {string|null} edgeId
 * @property {string} targetId
 * @property {string} satelliteId
 * @property {string} namedGood   the good the instrument meant to cut, canonical
 * @property {boolean} namedGoodCarried  the artery actually moves that good
 * @property {ReadonlyArray<string>} goods  everything the artery moves
 * @property {string} band
 * @property {number} tally
 * @property {RouteArtery|null} artery
 */

/**
 * @param {Partial<SeveranceReading> & { verdict: string, targetId: string, satelliteId: string }} f
 * @returns {SeveranceReading}
 */
function severanceOf(f) {
  return {
    verdict: f.verdict,
    severs: f.verdict === 'severed',
    edgeId: f.edgeId == null ? null : text(f.edgeId),
    targetId: f.targetId,
    satelliteId: f.satelliteId,
    namedGood: text(f.namedGood),
    namedGoodCarried: f.namedGoodCarried === true,
    goods: Object.freeze([...(f.goods || [])].map(text)),
    band: text(f.band) || 'none',
    tally: count(f.tally),
    artery: f.artery || null,
  };
}

/**
 * WHAT DOES THIS INTERDICTION ACTUALLY CUT? (§13's integration pin.)
 *
 * The caller is a supply-web campaign stage, which already names a satellite and the
 * good it means to sever. This answers with the ROAD between them and the goods that
 * road really carries, so the news the war layer writes can name a material artery
 * instead of an abstraction.
 *
 * `namedGoodCarried` is deliberately a separate reading from `severs`. An instrument
 * chosen off a fog-gated web read may patrol a road that does not carry the grain the
 * commander meant to stop: the road is still cut, and the honest receipt says what
 * was on it. Collapsing the two would either refuse a real severance or claim a good
 * that was never moving.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   targetId: string,
 *   satelliteId: string,
 *   input?: unknown,
 * }} args
 * @returns {SeveranceReading}
 */
export function interdictionSeverance(args) {
  const worldState = args.worldState || {};
  const targetId = text(args.targetId);
  const satelliteId = text(args.satelliteId);
  const namedGood = arteryGoodId(args.input);
  const base = { targetId, satelliteId, namedGood };
  if (!routeLifecycleActive(worldState)) return severanceOf({ ...base, verdict: 'dormant' });
  if (!targetId || !satelliteId || targetId === satelliteId) {
    return severanceOf({ ...base, verdict: 'no_route' });
  }

  const network = asRecord(asRecord(worldState.spatialLedgers).routeNetwork);
  const edges = asRecord(network.edges);
  /** @type {import('./routeNetworkConsumers.js').LivedHop|null} */
  let open = null;
  let hiddenOnly = false;
  for (const hop of livedNeighbours(worldState, targetId, {})) {
    if (hop.toId !== satelliteId) continue;
    if (hop.hidden) { hiddenOnly = true; continue; }
    if (!open) open = hop;
  }
  if (!open) {
    return severanceOf({ ...base, verdict: hiddenOnly ? 'hidden_only' : 'no_route' });
  }

  const artery = arteryOf(asRecord(asRecord(edges[open.edgeId]).usage), open);
  if (artery.tally <= 0) {
    return severanceOf({ ...base, verdict: 'no_traffic', edgeId: artery.edgeId, artery });
  }
  return severanceOf({
    ...base,
    verdict: 'severed',
    edgeId: artery.edgeId,
    namedGoodCarried: !!namedGood && artery.goods.indexOf(namedGood) >= 0,
    goods: artery.goods,
    band: artery.band,
    tally: artery.tally,
    artery,
  });
}

/**
 * THE GOODS-DENOMINATED REASONS for one severance (§0's law, as prose the Herald can
 * carry). Named for the good, never for the number: a band is a word about how much
 * moves, and a surface renders the word.
 *
 * Returns an EMPTY list for anything that did not sever, because a reason for a thing
 * that did not happen is the kind of receipt that outlives its own truth.
 *
 * @param {SeveranceReading} reading
 * @param {(id: string) => string} [nameOf]
 * @returns {ReadonlyArray<string>}
 */
export function severanceReasons(reading, nameOf) {
  if (!reading || !reading.severs) return Object.freeze([]);
  const label = typeof nameOf === 'function' ? nameOf : (/** @type {string} */ id) => id;
  const from = label(reading.satelliteId);
  const to = label(reading.targetId);
  /** @type {Array<string>} */
  const out = [];
  if (reading.goods.length > 0) {
    out.push(`The road from ${from} carried ${reading.goods.join(', ')} into ${to}.`);
  } else {
    out.push(`The road from ${from} carried the trade that fed ${to}.`);
  }
  out.push(`Traffic on that way stood at ${reading.band}.`);
  if (reading.namedGood && !reading.namedGoodCarried) {
    out.push(`The patrol was set for ${reading.namedGood}, which does not move on this road.`);
  }
  return Object.freeze(out);
}
