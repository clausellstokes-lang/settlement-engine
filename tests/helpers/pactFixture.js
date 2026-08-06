/**
 * pactFixture.js — the GR-2 world every pact battery is driven against.
 *
 * ONE fixture, shared by the behaviour tests and the dormancy fence, because a fence that
 * runs a QUIETER world than the pins do proves dormancy of a world where nothing was going
 * to happen anyway — the vacuous green every dormancy claim drifts toward. Everything here
 * is built so that the LIT run really opens, really answers and really mints.
 *
 * THE SHAPE. Two courts that need each other in opposite directions:
 *   A imports grain (food `scant` by its own ground truth) and exports iron.
 *   B imports iron  (raw_material `scant`) and exports grain.
 * and each BELIEVES the other holds what it lacks. That is a `trade_demand` crossing in
 * both directions, which is what makes the reciprocal grain-for-ore sheet reachable — two
 * economic terms with OPPOSED beneficiaries on ONE instrument.
 *
 * A third court `C` exists for the `shared_threat` arm and is hostile to both, with an
 * ally `D` so the depth-two web has something to walk.
 */

/**
 * The governing-seat key the belief map files every court's beliefs under.
 *
 * ⚠ IMPORTED, NEVER RESTATED, and this line was a real bug for one gate run. The first
 * draft hard-coded `'governing_seat'`; the constant is `'seat'`, so every belief this
 * fixture wrote was filed under a key no reader looks in, and fifteen stage pins failed at
 * once with "no crossing" — the recorded writer/reader spelling-drift class, reproduced by
 * a test helper. Derive-don't-restate applies to fixtures exactly as it applies to code.
 */
export { GOVERNING_SEAT_KEY as SEAT } from '../../src/domain/worldPulse/beliefMap.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipState.js';

/**
 * The relationship-state key, MINTED BY THE ESTATE'S OWN PRIMITIVE.
 *
 * ⚠ THE SECOND RESTATEMENT BUG IN THIS FILE, and a worse one than the first. The draft
 * spelled these keys `'A|B'`, which exists nowhere in the estate — and every stage pin
 * still passed, because the SOURCE had been written to the same invented spelling. The
 * fixture and the deriver agreed with each other and with nothing else, which is the
 * recorded fixture-mirrors-the-deriver class: the arms were dead and self-consistently
 * green. It surfaced only when a REAL consumer (`canonicalAllianceRows`) was driven and
 * returned an empty web.
 */
export const relKey = (a, b) => String(relationshipKeyFromEdge({ from: a, to: b }));

/** @param {string} id @param {Record<string, unknown>} economicState */
const town = (id, economicState) => ({ id, settlement: { id, name: id, economicState } });

/** A imports grain and makes iron; B imports iron and makes grain. */
export const A_ECONOMY = Object.freeze({
  necessityImports: [{ name: 'Grain', category: 'food' }],
  localProduction: [{ name: 'Iron', category: 'metal' }],
  primaryExports: [{ name: 'Iron', category: 'metal' }],
});
export const B_ECONOMY = Object.freeze({
  necessityImports: [{ name: 'Iron', category: 'metal' }],
  localProduction: [{ name: 'Grain', category: 'food' }],
  primaryExports: [{ name: 'Grain', category: 'food' }],
});

/**
 * The snapshot. `edges` carries the alliance edge the depth-two web walks; the pact lane
 * itself reads no edge, so an empty graph is a legal world for every other arm.
 * @param {{withThreat?: boolean}} [args]
 */
export function pactSnapshot({ withThreat = false } = {}) {
  // D and E carry a real `militaryStrength` so the depth-two web has WEIGHT to price. The
  // read routes every strength through the observer's belief and falls back to this truth
  // when the observer holds none, so the fixture works whether or not beliefs are active —
  // which matters, because belief activation needs a spatial-canon marker this aspatial
  // fixture deliberately does not carry.
  const armed = { militaryStrength: 0.95 };
  const settlements = [
    town('A', { ...A_ECONOMY }),
    town('B', { ...B_ECONOMY }),
    ...(withThreat
      ? [town('C', {}), { id: 'D', settlement: { id: 'D', name: 'D', ...armed } },
        { id: 'E', settlement: { id: 'E', name: 'E', ...armed } }]
      : []),
  ];
  return {
    settlements,
    regionalGraph: {
      edges: withThreat ? [{ from: 'C', to: 'D' }, { from: 'C', to: 'E' }] : [],
    },
  };
}

/**
 * The believed halves. A believes B `plentiful` in food; B believes A `plentiful` in
 * raw_material. Both ends of every demand are beliefs — the wrong-market tragedy stays
 * legal because nothing here is checked against the other town's real granary.
 * @param {{aSeesB?: Record<string, unknown>, bSeesA?: Record<string, unknown>,
 *   extra?: Record<string, unknown>}} [args]
 */
export function pactBeliefs({ aSeesB, bSeesA, extra } = {}) {
  return {
    A: { [GOVERNING_SEAT_KEY]: { B: aSeesB || { scarcityBands: { food: 'plentiful', raw_material: 'scant' } } } },
    B: { [GOVERNING_SEAT_KEY]: { A: bSeesA || { scarcityBands: { food: 'scant', raw_material: 'plentiful' } } } },
    ...(extra || {}),
  };
}

/**
 * THE WORLD.
 *
 * @param {{flag?: unknown, relationship?: Record<string, unknown>,
 *   relationshipStates?: Record<string, unknown>, beliefs?: unknown,
 *   dispositionStats?: Record<string, unknown>, credibility?: Record<string, unknown>,
 *   treaties?: Record<string, unknown>, rules?: Record<string, unknown>}} [args]
 *   `flag` is spelled explicitly at every call so the ABSENT vs FALSE differential can
 *   drive a truthy-but-not-`true` value through the same builder.
 */
export function pactWorld({
  flag, relationship, relationshipStates, beliefs, dispositionStats, credibility, treaties,
  rules,
} = {}) {
  /** @type {Record<string, unknown>} */
  const simulationRules = { ...(rules || {}) };
  // ABSENT is a real configuration and must stay reachable: only a supplied value is
  // written, so `pactWorld({})` carries no key at all.
  if (flag !== undefined) simulationRules.pactFormationEnabled = flag;
  /** @type {Record<string, unknown>} */
  const spatialLedgers = { beliefMaps: beliefs === null ? {} : (beliefs || pactBeliefs()) };
  if (credibility) spatialLedgers.credibility = credibility;
  if (treaties) spatialLedgers.treaties = treaties;
  return {
    rngSeed: 'pact-fixture',
    simulationRules,
    relationshipStates: relationshipStates || {
      [relKey('A', 'B')]: { relationshipType: 'trade_partner', trust: 0.6, ...(relationship || {}) },
    },
    ...(dispositionStats ? { dispositionStats } : {}),
    spatialLedgers,
  };
}

/** The tick a crossing opens on, and the tick its answer is due. The dwell is TWO legs
 *  plus the deliberation; with no digest the legs floor at one week each, so an answer
 *  opened at 10 is owed at 14 — the near end of the measured 2..8-week spectrum. */
export const OPEN_TICK = 10;
export const DUE_TICK = 14;
