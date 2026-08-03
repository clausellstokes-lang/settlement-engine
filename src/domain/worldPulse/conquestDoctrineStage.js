/**
 * conquestDoctrineStage.js — WR-8's pulse stage: where the conquest belief is
 * ASSEMBLED and where the campaign shape it implies reaches the war layer.
 *
 * THE DIVISION OF LABOUR, AND WHY IT IS THE WHOLE DESIGN. `conquestFeasibility.js`
 * is the belief COMPOSITE and reaches nothing at all — zero imports, pinned that
 * way in `envoyK3BeliefSeam.test.js`, so no refactor can put a settlement's true
 * strength inside it. This file is the STAGE: it gathers the closed banded words
 * the composite eats, from the court's own belief map, and hands the answer back.
 * It is therefore EXEMPT from the K3 negotiation set for exactly the reason
 * `envoyInterceptionStage.js` is — an orchestration layer that legitimately
 * touches real state — and the exemption is declared there WITH this reason
 * rather than left as a silence.
 *
 * WHAT IS BELIEF AND WHAT IS SELF-KNOWLEDGE (the §IV.4 carve-out, cited not
 * invented): everything about the RIVAL arrives through `beliefRecord` and may be
 * stale, wrong, or planted. Everything about the court's OWN granary and its own
 * open fronts is a SELF-READ, which the belief layer has always taken as ground
 * truth — a court does not need a rumor to count its own barns. That asymmetry is
 * the fog, and it is why a mistaken-feasibility receipt is reachable at all.
 *
 * DORMANCY IS THE DEFAULT AND IT IS BYTE-IDENTICAL. `conquestDoctrineEnabled` is
 * absent from DEFAULT_SIMULATION_RULES, and the flag-dependency ruling makes WR-8
 * the LAST of its chain: it requires WR-1/WR-2/WR-6/WR-7's flags and the
 * `demographicsEnabled` lit-precondition alongside its own. Dark on any one of
 * them, `conquestMarchOrder` returns THE INPUT ARRAY REFERENCE — not a copy, not
 * an equal array — so the dormant loop is identical rather than merely equivalent,
 * which is the idiom `warIntent.js` already holds itself to.
 *
 * PURE over its arguments: no rng, no wall-clock, no mutation, no writes. The
 * stage reads and returns; it mints no ledger and stamps no order.
 */

import {
  conquestMarchAdvised,
  readConquestFeasibility,
} from './conquestFeasibility.js';
import { beliefRecord, beliefsActive } from './beliefMap.js';
import { storageCapacityMonths } from './foodStockpile.js';

/**
 * THE LIGHTING ORDER, spelled out. The flag-dependency ruling says WR-8 lights
 * only behind WR-1/WR-2/WR-6/WR-7 and behind demographics, and that a flag lit
 * out of order is an invalid config. Every one of these must be explicitly true;
 * a missing rules object is dark, not permissive.
 */
export const CONQUEST_REQUIRED_RULES = Object.freeze([
  'warLayerEnabled',
  'warTerminationEnabled',
  'peaceEngineEnabled',
  'dispositionChannelsEnabled',
  'coalitionLedgerEnabled',
  'envoyDiplomacyEnabled',
  'demographicsEnabled',
  'conquestDoctrineEnabled',
]);

/**
 * The five belief strength bands, index 0..4, spelled in the negotiation
 * picture's own words. `beliefMap` stores the INDEX; the composite eats the
 * WORD, and this is the one place the two spellings meet.
 */
const BELIEF_STRENGTH_WORDS = Object.freeze([
  'spent', 'strained', 'ready', 'strong', 'dominant',
]);

/**
 * Relationship labels a court reads as FRIENDLY. Re-declared here rather than
 * imported, on the `envoyTestimony` precedent: this stage needs a closed
 * two-way census and must not acquire a reach it does not otherwise need. The
 * hostile side is everything the belief layer already treats as hostile.
 */
const FRIENDLY_LABELS = Object.freeze(new Set(['allied', 'alliance', 'friendly', 'ally', 'vassal', 'suzerain']));
const HOSTILE_LABELS = Object.freeze(new Set(['hostile', 'cold_war', 'rival']));

/** The pressure ladder's words, in ascending order, minus `unknown`. */
const PRESSURE_WORDS = Object.freeze(['quiet', 'present', 'pressing', 'decisive']);

/** The stores ladder's words, in ascending order, minus `unknown`. */
const STORES_WORDS = Object.freeze(['bare', 'thin', 'stocked', 'deep']);

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {number} value @param {number} lo @param {number} hi @returns {number} */
function clamp(value, lo, hi) {
  return value < lo ? lo : value > hi ? hi : value;
}

/**
 * Is the conquest doctrine lit for this world? Every prerequisite law must be
 * explicitly true, in the `envoyDiplomacyActive` idiom.
 * @param {unknown} worldStateOrRules
 * @returns {boolean}
 */
export function conquestDoctrineActive(worldStateOrRules) {
  const root = asObject(worldStateOrRules);
  const rules = Object.prototype.hasOwnProperty.call(root, 'simulationRules')
    ? asObject(root.simulationRules)
    : root;
  return CONQUEST_REQUIRED_RULES.every((key) => rules[key] === true);
}

/**
 * A count folded onto the pressure ladder. Zero is `quiet`; the top band needs a
 * genuinely crowded picture, so a court with one ally does not believe itself
 * the head of an alliance.
 * @param {number} count @returns {string}
 */
function pressureWordForCount(count) {
  if (count <= 0) return PRESSURE_WORDS[0];
  if (count === 1) return PRESSURE_WORDS[1];
  if (count <= 3) return PRESSURE_WORDS[2];
  return PRESSURE_WORDS[3];
}

/**
 * The court's belief-side coalition census: how many settlements it believes
 * stand with it, and how many it believes stand against it.
 *
 * THE SECOND NUMBER IS A HEURISTIC AND IS DECLARED AS ONE. A court's belief map
 * records what IT believes about each neighbour's stance toward ITSELF; it holds
 * no entry for who the rival's friends are. So the rival's believed reach is read
 * off the court's own enemies — whoever is my enemy may be their friend — which
 * is a real court's reasoning and, more to the point, is entirely belief-sourced.
 * It is wrong exactly as often as the map is, which is the design.
 *
 * @param {unknown} worldState @param {string} observerId @param {string} rivalId
 * @returns {{ ownWord: string, rivalWord: string, friends: number, enemies: number }}
 */
export function coalitionCensusFor(worldState, observerId, rivalId) {
  const maps = asObject(asObject(asObject(worldState).spatialLedgers).beliefMaps);
  const observerMap = asObject(asObject(maps[observerId]).seat);
  let friends = 0;
  let enemies = 0;
  for (const subjectId of Object.keys(observerMap).sort()) {
    if (subjectId === rivalId || subjectId === observerId) continue;
    const label = String(asObject(observerMap[subjectId]).allianceLabel || '');
    if (FRIENDLY_LABELS.has(label)) friends += 1;
    else if (HOSTILE_LABELS.has(label)) enemies += 1;
  }
  return {
    ownWord: pressureWordForCount(friends),
    rivalWord: pressureWordForCount(enemies),
    friends,
    enemies,
  };
}

/**
 * The court's OWN granary, folded onto the stores ladder. A self-read: the §IV.4
 * carve-out says a settlement knows its own state, and no rumor is needed to
 * count barns. Absent food machinery reads `unknown`, which propagates to an
 * unknown feasibility rather than to a flattering one.
 * @param {unknown} item a snapshot item ({ settlement }) or a settlement
 * @returns {string}
 */
export function ownStoresWord(item) {
  const row = asObject(item);
  const settlement = Object.keys(asObject(row.settlement)).length
    ? asObject(row.settlement)
    : row;
  const security = asObject(asObject(settlement.economicState).foodSecurity);
  const months = Number(security.storageMonths);
  if (!Number.isFinite(months)) return 'unknown';
  const cap = Number(storageCapacityMonths(
    /** @type {Parameters<typeof storageCapacityMonths>[0]} */ (settlement),
  ));
  if (!Number.isFinite(cap) || cap <= 0) return 'unknown';
  const fill = clamp(months / cap, 0, 1);
  const index = fill >= 0.75 ? 3 : fill >= 0.45 ? 2 : fill >= 0.15 ? 1 : 0;
  return STORES_WORDS[index];
}

/**
 * The court's OWN weariness, read off how many fronts it is holding open right
 * now. Also a self-read, and deliberately derived from the CANDIDATE LIST the
 * caller already computed rather than from a second census — a court fighting on
 * four axes is wearier than one fighting on one, and no new state is invented to
 * say so.
 * @param {unknown} openFronts @returns {string}
 */
export function ownExhaustionWord(openFronts) {
  return pressureWordForCount(Math.max(0, Number(openFronts) || 0) - 1);
}

/**
 * Assemble the closed banded row `readConquestFeasibility` eats, for one court
 * against one rival. Returns null when the doctrine is dark, when the belief
 * layer itself is dormant, or when the court simply has no belief about the
 * rival — an absent belief is silence, never a neutral fact.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, observerId?: unknown,
 *   rivalId?: unknown, openFronts?: unknown }} args
 * @returns {Record<string, string> | null}
 */
export function conquestBeliefBandsFor({
  worldState = null, snapshot = null, observerId = '', rivalId = '', openFronts = 1,
} = {}) {
  if (!conquestDoctrineActive(worldState)) return null;
  if (!beliefsActive(/** @type {Parameters<typeof beliefsActive>[0]} */ (worldState))) return null;
  const observer = String(observerId || '');
  const rival = String(rivalId || '');
  if (!observer || !rival || observer === rival) return null;
  const rivalBelief = beliefRecord(
    /** @type {Parameters<typeof beliefRecord>[0]} */ (worldState), observer, rival,
  );
  const selfBelief = beliefRecord(
    /** @type {Parameters<typeof beliefRecord>[0]} */ (worldState), observer, observer,
  );
  if (!rivalBelief) return null;
  const rivalIndex = Number(asObject(rivalBelief).strengthBand);
  if (!Number.isInteger(rivalIndex)) return null;
  // The court's own strength is a self-read too: it appears in its own map only
  // in worlds that seeded one, so the fallback is the belief layer's own neutral
  // band rather than an invented number.
  const ownIndexRaw = Number(asObject(selfBelief).strengthBand);
  const ownIndex = Number.isInteger(ownIndexRaw) ? ownIndexRaw : 2;
  const census = coalitionCensusFor(worldState, observer, rival);
  const byId = asObject(snapshot).byId;
  const item = byId instanceof Map ? byId.get(observer) : null;
  return {
    partyId: observer,
    counterpartId: rival,
    ownStrengthBand: BELIEF_STRENGTH_WORDS[clamp(ownIndex, 0, BELIEF_STRENGTH_WORDS.length - 1)],
    rivalStrengthBand: BELIEF_STRENGTH_WORDS[clamp(rivalIndex, 0, BELIEF_STRENGTH_WORDS.length - 1)],
    ownAllyStrengthBand: census.ownWord,
    rivalAllyStrengthBand: census.rivalWord,
    ownStoresBand: ownStoresWord(item),
    ownWarExhaustionBand: ownExhaustionWord(openFronts),
  };
}

/**
 * The full read for one court against one rival, or null when dark/unreadable.
 * @param {{ worldState?: unknown, snapshot?: unknown, observerId?: unknown,
 *   rivalId?: unknown, openFronts?: unknown }} args
 * @returns {ReturnType<typeof readConquestFeasibility> | null}
 */
export function readConquestFeasibilityFor(args) {
  const bands = conquestBeliefBandsFor(args);
  return bands ? readConquestFeasibility(bands) : null;
}

/**
 * THE MOVEMENT CONSUMER, WIRED. The candidate list a settlement may open a war
 * on, re-ordered so the targets its court BELIEVES a conquest is in reach of
 * come first. Ordering, never admission: nothing is added, nothing is removed,
 * and every hard gate downstream — the one-army constraint, the posture gate,
 * `classifyFeasibility` itself — still runs exactly as before. A hopeless war
 * still does not open; it merely stops being an alphabetical accident which of
 * the plausible ones does.
 *
 * BYTE-IDENTICAL WHEN DORMANT: the INPUT ARRAY REFERENCE comes back untouched
 * when the doctrine is dark, when fewer than two targets are offered, or when no
 * target earns the march — no copy, no re-sort, in `intentTargetOrder`'s idiom.
 * The order among the advised is the incoming order, and so is the order among
 * the rest, so the result is a pure function of the input list.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, fromId?: unknown,
 *   targets?: string[] }} args
 * @returns {string[]}
 */
export function conquestMarchOrder({ worldState = null, snapshot = null, fromId = '', targets = [] } = {}) {
  if (!Array.isArray(targets) || targets.length < 2) return targets;
  // A SHORT-CIRCUIT, NOT THE GATE — measured, and said plainly rather than left
  // to look like more than it is. Dormancy is OWNED by the assembly gate inside
  // `conquestBeliefBandsFor`; a mutant that deletes this line alone leaves every
  // dormancy pin green, because the assembler still refuses to produce a read
  // and nothing is ever advised. What this line buys is the hot loop: without
  // it, a dark world pays one belief-map lookup per hostile target per
  // settlement per tick to be told what the flags already said.
  if (!conquestDoctrineActive(worldState)) return targets;
  /** @type {string[]} */
  const advised = [];
  /** @type {string[]} */
  const rest = [];
  for (const target of targets) {
    const read = readConquestFeasibilityFor({
      worldState, snapshot, observerId: fromId, rivalId: String(target), openFronts: targets.length,
    });
    if (read && conquestMarchAdvised(read)) advised.push(target);
    else rest.push(target);
  }
  if (advised.length === 0 || rest.length === 0) return targets;
  return [...advised, ...rest];
}
