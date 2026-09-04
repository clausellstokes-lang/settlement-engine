/**
 * routeNetworkConsumersStrategic.js — THE GARRISON ASYMMETRY (W-J slice J4; binding
 * law docs/DESIGN_ROUTE_LIFECYCLE.md §7's asymmetry and §6's last sentence, with
 * DESIGN_REALM_DIRECTIVES.md J-D9 (l): the war layer writes strategicNeed into the
 * same ledger, and a militarily critical route RESISTS DECAY while that need persists
 * even after trade dies).
 *
 * J3 built both halves of the asymmetry and could wire neither. `garrisonFloorGrade`
 * reads `edge.strategicNeed` and holds a needed road at `road` however quiet the
 * trade; `evaluateMilitaryCharter` takes strategic-need rows and buys a road demand
 * has not worn yet. Both were fed by hand, because the war ledger's shape is the war
 * layer's and J3 declined to invent a second opinion about what a garrison is. This
 * module is that read, and it is the LAST link in the asymmetry: with it, a road that
 * trade abandoned genuinely stops decaying, end to end, without anybody passing a
 * literal into a test.
 *
 * ── THREE SOURCES, AND THE STRONGEST WINS ───────────────────────────────────
 * Each is an existing war-layer fact read where the war layer already keeps it, and
 * none of them is re-derived here:
 *   FRONT      a live war_front channel between the two places. The road IS the
 *              front; nothing about it is negotiable while the siege stands.
 *   GARRISON   a standing deployment from a home to a target, or an occupation held
 *              by an occupier. Both are an army that must be able to get back, and
 *              §7's floor is exactly the road it marches on.
 *   WATCH      an endpoint on a war footing. The realm is looking at its roads, which
 *              is a real fact and a receipt, but not yet a reason to maintain one.
 *
 * ── WATCH IS DERIVED AND NEVER PERSISTED, AND THAT IS A JUDGMENT ────────────
 * `watch` ranks BELOW the band both consumers read: the garrison floor and the
 * military charter bar are both `garrison`, so a persisted `watch` would change
 * nothing about the world while adding a key to every edge of every mobilized seat
 * and churning it out again when the posture cooled. The ledger stores the durable
 * half of a status (the institution-status precedent), so this module persists only
 * bands that DO something and reports the rest as a receipt. `watch` therefore stays
 * a real word in the vocabulary, minted by the derivation, read by the military
 * charter as its own refusal reading, and absent from the save.
 *
 * ── A LAPSED NEED DROPS THE KEY ─────────────────────────────────────────────
 * The write is not additive. When a war ends, the deployment comes home and the
 * occupation lifts, the edges that carried a need have the key REMOVED, so an edge
 * whose war is over is byte-identical to an edge that never had one. Without that,
 * the garrison floor would outlive every war the realm ever fought and the decay
 * ladder would quietly stop working a century in. That is the lifecycle path this
 * estate has been bitten by before: the write that survives one path and ghosts
 * another.
 *
 * PURE, TOTAL, DETERMINISTIC: no clock, no RNG, no I/O, no store. Every ledger is
 * walked in codepoint order, so the rows are a function of the world.
 */

import { isLiveWarFront } from './warFrontReads.js';
import { edgeIdForPair } from './routeNetworkFlows.js';
import {
  ROUTE_CHARTER_TUNING,
  ROUTE_STRATEGIC_BANDS,
  strategicNeedRank,
} from './routeNetworkCharter.js';
import {
  corridorId as corridorIdOf,
  emptyRouteNetwork,
  readRouteNetwork,
  routeLifecycleActive,
  writeRouteNetwork,
} from './routeNetworkLedger.js';

/**
 * ROUTE_LIFECYCLE_TUNING, the strategic half (§12: every entry a band).
 *
 * PERSIST_BAND is READ FROM THE CHARTER TUNING rather than declared, because it is
 * the same band the garrison floor and the military charter bar already speak. A
 * second literal here would be a third opinion about what a garrison is, and the
 * first thing a tuning pass would do is move one of them.
 *
 * WATCH_POSTURES is the mobilization vocabulary a `watch` reading answers to. It is
 * the READY set plus the seat that is climbing toward it: a realm at
 * war_preparation is already looking at its roads.
 *
 * @type {Readonly<Record<string, unknown>>}
 */
export const ROUTE_STRATEGIC_TUNING = Object.freeze({
  PERSIST_BAND: String(ROUTE_CHARTER_TUNING.MILITARY_CHARTER_BAND),
  WATCH_POSTURES: Object.freeze(['war_preparation', 'mobilized', 'deployed']),
});

/**
 * The closed STRATEGIC SOURCE vocabulary. Every row names which war-layer fact
 * produced it, so a receipt can say why a road is being kept.
 * @type {ReadonlyArray<string>}
 */
export const STRATEGIC_SOURCES = Object.freeze([
  'war_front', 'deployment', 'occupation', 'posture',
]);

/**
 * @typedef {Object} StrategicNeedRow
 * @property {string} a           endpoint, codepoint-low
 * @property {string} b           endpoint, codepoint-high
 * @property {string} band        one of ROUTE_STRATEGIC_BANDS, never 'none'
 * @property {string|null} byPowerRef  the seat whose need it is
 * @property {string} source      one of STRATEGIC_SOURCES
 * @property {string|null} edgeId the road that serves the pair, or null
 */

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

/**
 * True when `band` is a real rung of the closed vocabulary above absence. Fails
 * closed: a word this module has never heard of is not a strategic need.
 * @param {string} band @returns {boolean}
 */
function isLiveBand(band) {
  return band !== 'none' && ROUTE_STRATEGIC_BANDS.indexOf(band) > 0;
}

/**
 * Should this band be written onto the ledger? Only the bands a consumer actually
 * reads (see the header). Total.
 * @param {string|null|undefined} band @returns {boolean}
 */
export function isPersistedStrategicBand(band) {
  return strategicNeedRank(text(band))
    >= strategicNeedRank(String(ROUTE_STRATEGIC_TUNING.PERSIST_BAND));
}

/**
 * @param {Map<string, StrategicNeedRow>} into
 * @param {string} a @param {string} b @param {string} band
 * @param {string|null} byPowerRef @param {string} source
 */
function offer(into, a, b, band, byPowerRef, source) {
  const left = text(a);
  const right = text(b);
  if (!left || !right || left === right || !isLiveBand(band)) return;
  const id = corridorIdOf(left, right);
  const prior = into.get(id);
  // THE STRONGEST WINS, and a tie keeps the FIRST source in the codepoint-ordered
  // scan, so the same world always names the same reason for the same road.
  if (prior && strategicNeedRank(prior.band) >= strategicNeedRank(band)) return;
  const [low, high] = left <= right ? [left, right] : [right, left];
  into.set(id, {
    a: low,
    b: high,
    band,
    byPowerRef: byPowerRef == null ? null : text(byPowerRef),
    source,
    edgeId: null,
  });
}

/**
 * DERIVE EVERY STRATEGIC NEED THE WAR LAYER CURRENTLY HOLDS (§7, J-D9 (l)).
 *
 * Pure; writes nothing. Returns rows in codepoint order by corridor id, each already
 * resolved to the road that serves it (or to null when no road does, which is the
 * military charter's case).
 *
 * DORMANT returns an EMPTY list rather than the rows, because a dark world has no
 * network for a need to be about and handing rows to a dark charter sweep would
 * invite a caller to act on them.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   graph?: { channels?: ReadonlyArray<unknown> }|null,
 * }} input
 * @returns {ReadonlyArray<StrategicNeedRow>}
 */
export function deriveStrategicNeeds(input) {
  const worldState = input.worldState || {};
  if (!routeLifecycleActive(worldState)) return Object.freeze([]);
  const network = readRouteNetwork(worldState) || emptyRouteNetwork();

  /** @type {Map<string, StrategicNeedRow>} */
  const rows = new Map();

  // FRONT. A live war-layer front is a siege, and the way between the besieger and
  // the besieged is the front's own artery. The read is warFrontReads' own gate, so
  // a hostile-RELATIONSHIP front (which shares the channel shape but is not a
  // mobilized siege) cannot buy a road.
  const channels = input.graph && Array.isArray(input.graph.channels) ? input.graph.channels : [];
  /** @type {Array<{ from: string, to: string }>} */
  const fronts = [];
  for (const channel of channels) {
    if (!isLiveWarFront(channel)) continue;
    const record = asRecord(channel);
    fronts.push({ from: text(record.from), to: text(record.to) });
  }
  fronts.sort((x, y) => (x.from < y.from ? -1 : x.from > y.from ? 1
    : x.to < y.to ? -1 : x.to > y.to ? 1 : 0));
  for (const front of fronts) offer(rows, front.from, front.to, 'front', front.from, 'war_front');

  // GARRISON, first shape: a standing deployment. The key is the HOME seat and the
  // record names the target, which is the same reading J2's military flow extractor
  // takes, so the ledger and the need agree about which pair an army committed.
  const deployments = asRecord(worldState.deployments);
  for (const homeId of Object.keys(deployments).sort()) {
    const record = asRecord(deployments[homeId]);
    offer(rows, homeId, text(record.targetId), 'garrison', homeId, 'deployment');
  }

  // GARRISON, second shape: an occupation. The occupier holds the place and the road
  // to it is the road its garrison is fed down.
  const occupations = asRecord(worldState.occupations);
  for (const occupiedId of Object.keys(occupations).sort()) {
    const record = asRecord(occupations[occupiedId]);
    offer(rows, text(record.occupierId), occupiedId, 'garrison', text(record.occupierId), 'occupation');
  }

  // WATCH. A seat on a war footing is looking at the roads it HAS, so this arm walks
  // the lived edges rather than the candidate set: a watch is not a reason to build
  // anything, and offering pairs with no road would put noise into the charter sweep.
  const postures = asRecord(worldState.warPosture);
  const watching = new Set();
  const watchStates = /** @type {ReadonlyArray<string>} */ (ROUTE_STRATEGIC_TUNING.WATCH_POSTURES);
  for (const seatId of Object.keys(postures).sort()) {
    if (watchStates.indexOf(text(asRecord(postures[seatId]).state)) >= 0) watching.add(seatId);
  }
  if (watching.size > 0) {
    const edges = network.edges || {};
    for (const edgeId of Object.keys(edges).sort()) {
      const edge = asRecord(edges[edgeId]);
      const a = text(edge.a);
      const b = text(edge.b);
      const held = watching.has(a) ? a : watching.has(b) ? b : '';
      if (!held) continue;
      offer(rows, a, b, 'watch', held, 'posture');
    }
  }

  /** @type {Array<StrategicNeedRow>} */
  const out = [];
  for (const id of [...rows.keys()].sort()) {
    const row = /** @type {StrategicNeedRow} */ (rows.get(id));
    out.push({ ...row, edgeId: edgeIdForPair(network, row.a, row.b) });
  }
  return Object.freeze(out);
}

/**
 * The rows a MILITARY CHARTER should be evaluated for: a live need at or above the
 * charter bar on a pair NO ROAD SERVES. In J3's exact input shape, so the caller
 * hands this straight to `evaluateRouteCharters`.
 *
 * This is the seam J3's header named and deferred ("the wiring of that read is
 * J4's"), and it is one function rather than an argument threaded through the pulse
 * so that the war layer's shape is read in exactly one place.
 *
 * @param {ReadonlyArray<StrategicNeedRow>} needs
 * @returns {ReadonlyArray<{ a: string, b: string, band: string, byPowerRef?: string }>}
 */
export function strategicCharterNeeds(needs) {
  /** @type {Array<{ a: string, b: string, band: string, byPowerRef?: string }>} */
  const out = [];
  for (const row of Array.isArray(needs) ? needs : []) {
    if (row.edgeId) continue;
    if (!isPersistedStrategicBand(row.band)) continue;
    /** @type {{ a: string, b: string, band: string, byPowerRef?: string }} */
    const entry = { a: row.a, b: row.b, band: row.band };
    if (row.byPowerRef) entry.byPowerRef = row.byPowerRef;
    out.push(entry);
  }
  return Object.freeze(out);
}

/**
 * @typedef {Object} StrategicApplyResult
 * @property {Record<string, unknown>} worldState
 * @property {boolean} changed
 * @property {number} written  edges that gained or changed a need
 * @property {number} cleared  edges whose need lapsed and lost the key
 * @property {ReadonlyArray<string>} heldEdgeIds  every edge now carrying a live need
 */

/** @param {Record<string, unknown>} worldState @returns {StrategicApplyResult} */
function inertApply(worldState) {
  return {
    worldState, changed: false, written: 0, cleared: 0, heldEdgeIds: Object.freeze([]),
  };
}

/**
 * WRITE THE WAR LAYER'S NEED ONTO THE LEDGER (§3's `strategicNeed?: band`).
 *
 * The one writer of `edge.strategicNeed` in the estate. Two directions, and the
 * second is the one that keeps the ladder honest:
 *   - a pair with a live need at or above the persist band gets the band written;
 *   - an edge carrying a need that is NO LONGER DERIVED has the key REMOVED, so the
 *     garrison floor lifts the moment the war it belonged to ends.
 *
 * DORMANT returns the INPUT worldState BY REFERENCE, as every entry point in this
 * program does, so wiring this into a dark pulse cannot perturb a byte.
 *
 * IDEMPOTENT: applying the same rows twice returns the same reference the second
 * time, because nothing moved.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   needs: ReadonlyArray<StrategicNeedRow>,
 * }} input
 * @returns {StrategicApplyResult}
 */
export function applyStrategicNeeds(input) {
  const worldState = input.worldState;
  if (!routeLifecycleActive(worldState)) return inertApply(worldState);
  const network = readRouteNetwork(worldState);
  if (!network) return inertApply(worldState);

  /** @type {Map<string, string>} */
  const wanted = new Map();
  for (const row of Array.isArray(input.needs) ? input.needs : []) {
    if (!row.edgeId || !isPersistedStrategicBand(row.band)) continue;
    const prior = wanted.get(row.edgeId);
    if (prior && strategicNeedRank(prior) >= strategicNeedRank(row.band)) continue;
    wanted.set(row.edgeId, row.band);
  }

  const edges = network.edges || {};
  /** @type {Record<string, import('./routeNetworkLedger.js').RouteEdge>} */
  const next = {};
  /** @type {Array<string>} */
  const held = [];
  let written = 0;
  let cleared = 0;
  for (const edgeId of Object.keys(edges).sort()) {
    const edge = edges[edgeId];
    next[edgeId] = edge;
    if (!edge || typeof edge !== 'object') continue;
    const band = wanted.get(edgeId) || '';
    const current = text(edge.strategicNeed);
    if (band) {
      held.push(edgeId);
      if (current === band) continue;
      next[edgeId] = { ...edge, strategicNeed: band };
      written += 1;
      continue;
    }
    if (!current) continue;
    // DROP THE KEY, never write a 'none'. An edge whose war is over must serialize
    // exactly like an edge that never had one.
    const { strategicNeed: _lapsed, ...rest } = edge;
    next[edgeId] = /** @type {import('./routeNetworkLedger.js').RouteEdge} */ (rest);
    cleared += 1;
  }

  if (written === 0 && cleared === 0) {
    return { worldState, changed: false, written: 0, cleared: 0, heldEdgeIds: Object.freeze(held) };
  }
  return {
    worldState: writeRouteNetwork(worldState, { edges: next, corridor: network.corridor || {} }),
    changed: true,
    written,
    cleared,
    heldEdgeIds: Object.freeze(held),
  };
}

/**
 * THE WHOLE READ AND WRITE IN ONE CALL, for the pulse seam. Derives the war layer's
 * needs, folds them onto the ledger, and hands back the charter rows the military
 * charter arm should see this pass.
 *
 * @param {{
 *   worldState: Record<string, unknown>,
 *   graph?: { channels?: ReadonlyArray<unknown> }|null,
 * }} input
 * @returns {StrategicApplyResult & {
 *   needs: ReadonlyArray<StrategicNeedRow>,
 *   charterNeeds: ReadonlyArray<{ a: string, b: string, band: string, byPowerRef?: string }>,
 * }}
 */
export function applyWarLayerRouteNeeds(input) {
  const needs = deriveStrategicNeeds(input);
  const applied = applyStrategicNeeds({ worldState: input.worldState, needs });
  return { ...applied, needs, charterNeeds: strategicCharterNeeds(needs) };
}
