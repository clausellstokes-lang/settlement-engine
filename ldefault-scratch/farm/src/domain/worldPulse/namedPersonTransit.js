/**
 * namedPersonTransit.js — THE SHARED NAMED-PERSON TRAVEL PHYSICS.
 *
 * This leaf owns the two rules every named-person mover must share:
 *   - a route leg costs at least one whole weekly tick, after an injected route-grade
 *     multiplier is applied; and
 *   - a traveller has a deterministic mid-route position until that leg arrives.
 *
 * Geometry and route choice stay with their existing owners. Callers inject the
 * nominal week price and grade multiplier, which keeps this module independent of the
 * frozen digest, lived-route ledgers, truth state, stores, UI, clocks, and RNG.
 *
 * PURE + TOTAL: no mutation, no I/O, and no random draws.
 */

import { clamp01 } from '../../kernel/math.js';

export const NAMED_PERSON_TRANSIT_TUNING = Object.freeze({
  MIN_LEG_TICKS: 1,
  NEUTRAL_GRADE_MULTIPLIER: 1,
  UNPRICED_LEG_WEEKS: 1,
});

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value);
}

/** @param {unknown} value @returns {number} a non-negative whole tick */
function tickOf(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** @param {unknown} value @param {number} fallback @returns {number} */
function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Price one named-person route leg in whole weekly ticks.
 *
 * `gradeMultiplier` is deliberately injected: J4 owns the grade vocabulary today,
 * while a later mode-speed table can supply another multiplier without creating a
 * second floor or position model. Unknown/non-positive prices fall back to one week;
 * unknown/non-positive multipliers are neutral.
 *
 * @param {{
 *   nominalWeeks: unknown,
 *   gradeMultiplier?: unknown,
 *   unpricedWeeks?: unknown,
 * }} input
 * @returns {number}
 */
export function namedPersonLegTicks(input) {
  const a = input && typeof input === 'object' ? input : /** @type {never} */ ({});
  const fallback = positive(a.unpricedWeeks, NAMED_PERSON_TRANSIT_TUNING.UNPRICED_LEG_WEEKS);
  const nominal = positive(a.nominalWeeks, fallback);
  const multiplier = positive(
    a.gradeMultiplier,
    NAMED_PERSON_TRANSIT_TUNING.NEUTRAL_GRADE_MULTIPLIER,
  );
  return Math.max(
    NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS,
    Math.floor(nominal * multiplier),
  );
}

/**
 * The arrival tick for a newly opened named-person leg.
 *
 * @param {{
 *   departTick: unknown,
 *   nominalWeeks: unknown,
 *   gradeMultiplier?: unknown,
 *   unpricedWeeks?: unknown,
 * }} input
 * @returns {number}
 */
export function namedPersonArrivalTick(input) {
  const a = input && typeof input === 'object' ? input : /** @type {never} */ ({});
  return tickOf(a.departTick) + namedPersonLegTicks(a);
}

/**
 * @typedef {Object} NamedPersonLeg
 * @property {string} fromId
 * @property {string} toId
 * @property {number} departTick
 * @property {number} arrivalTick
 * @property {true} [hidden]
 */

/**
 * Open one persisted named-person leg. The shape is the established H3/J4 shape.
 *
 * @param {{
 *   fromId: unknown,
 *   toId: unknown,
 *   departTick: unknown,
 *   nominalWeeks: unknown,
 *   gradeMultiplier?: unknown,
 *   unpricedWeeks?: unknown,
 *   hidden?: boolean,
 * }} input
 * @returns {NamedPersonLeg}
 */
export function openNamedPersonLeg(input) {
  const a = input && typeof input === 'object' ? input : /** @type {never} */ ({});
  const departTick = tickOf(a.departTick);
  /** @type {Record<string, unknown>} */
  const leg = {
    fromId: text(a.fromId),
    toId: text(a.toId),
    departTick,
    arrivalTick: namedPersonArrivalTick({ ...a, departTick }),
  };
  if (a.hidden === true) leg.hidden = true;
  return /** @type {NamedPersonLeg} */ (leg);
}

/**
 * A named person's position on one leg. While travelling they are explicitly not at
 * either settlement; `progress01` is their real mid-route coordinate.
 *
 * @param {NamedPersonLeg|null|undefined} leg
 * @param {unknown} tick
 * @returns {{ arrived: boolean, atSettlementId: string|null, progress01: number }}
 */
export function namedPersonLegPosition(leg, tick) {
  if (!leg || !text(leg.fromId) || !text(leg.toId)) {
    return { arrived: true, atSettlementId: null, progress01: 1 };
  }
  const now = tickOf(tick);
  const depart = tickOf(leg.departTick);
  const arrive = Math.max(
    depart + NAMED_PERSON_TRANSIT_TUNING.MIN_LEG_TICKS,
    tickOf(leg.arrivalTick),
  );
  if (now >= arrive) {
    return { arrived: true, atSettlementId: text(leg.toId), progress01: 1 };
  }
  return {
    arrived: false,
    atSettlementId: null,
    progress01: clamp01((now - depart) / (arrive - depart)),
  };
}

/**
 * Project a leg onto a caller-owned frozen route. Roads stores the whole outbound
 * route, so return travel sets `reverse:true` and reads the same array backwards.
 * The node and hop indices preserve Roads' existing floor-based interpolation.
 *
 * @param {{
 *   path: ReadonlyArray<unknown>|null|undefined,
 *   departTick: unknown,
 *   arrivalTick: unknown,
 *   tick: unknown,
 *   reverse?: boolean,
 * }} input
 * @returns {{
 *   arrived: boolean,
 *   progress01: number,
 *   nodeId: string,
 *   nodeIndex: number,
 *   hopIndex: number,
 * }}
 */
export function namedPersonPathPosition(input) {
  const a = input && typeof input === 'object' ? input : /** @type {never} */ ({});
  const path = Array.isArray(a.path) ? a.path.map(text) : [];
  if (!path.length) {
    return { arrived: true, progress01: 1, nodeId: '', nodeIndex: -1, hopIndex: -1 };
  }
  if (path.length === 1) {
    return { arrived: true, progress01: 1, nodeId: path[0], nodeIndex: 0, hopIndex: -1 };
  }
  const reverse = a.reverse === true;
  const leg = /** @type {NamedPersonLeg} */ ({
    fromId: reverse ? path[path.length - 1] : path[0],
    toId: reverse ? path[0] : path[path.length - 1],
    departTick: tickOf(a.departTick),
    arrivalTick: tickOf(a.arrivalTick),
  });
  const position = namedPersonLegPosition(leg, a.tick);
  const last = path.length - 1;
  const alongStoredPath = reverse ? 1 - position.progress01 : position.progress01;
  const nodeIndex = Math.max(0, Math.min(last, Math.floor(alongStoredPath * last)));
  const hopIndex = reverse
    ? Math.max(0, Math.min(last - 1, nodeIndex - 1))
    : Math.max(0, Math.min(last - 1, nodeIndex));
  return {
    arrived: position.arrived,
    progress01: position.progress01,
    nodeId: path[nodeIndex],
    nodeIndex,
    hopIndex,
  };
}
