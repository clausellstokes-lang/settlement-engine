/**
 * domain/worldPulse/settlementStrategyReads.js — THE STRENGTH-AND-EDGE READ LAYER the
 * settlement-tier strategy chooser scores over.
 *
 * Carved out of settlementStrategy.js, which stood 12 effective lines OVER the 800-line
 * domain ceiling and was frozen there by scripts/.size-baseline.json. Every body below is
 * VERBATIM — only the address moved, so a same-seed world moves zero bytes.
 *
 * THE SEAM. A declaration belongs here when its subject is HOW STRONG A COURT IS AND WHO
 * IT IS BOUND TO: the memoized strength lookup over the shared pressure index (the same
 * index the relationship contests and the war layer read, which is why the chooser's "do I
 * out-muscle this target?" can never diverge from the deploy gate), the hostile axis
 * itself, the raw edge that pairs two settlements, and the strongest non-hostile
 * neighbour. That is INTERIOR's subject verbatim, on exactly the reading that gave
 * strategicPosture.js its family — the distinction is SUBJECT, not program.
 *
 * WHAT DELIBERATELY DID NOT COME WITH IT, and none of it is a line count:
 *   • the belief-fogged reads (`misjudgmentFor`, `trueRelationshipType`,
 *     `makeBeliefStrengthFor`) — their subject is INFO, and moving them here would make
 *     this leaf speak a SECOND port and mint a cross-layer coupling;
 *   • the exhaustion pair (`economicExhaustion`, `perceivedPeaceExhaustion`) — the first
 *     is the chooser's ONE observed-shape reader (`economic_capacity on scores`, frozen by
 *     address in scripts/.observed-shape-readers-baseline.json) and the second is its
 *     fidelity-fogged twin; they belong together, at the address the register names;
 *   • the siege-awareness reads — they are what routes settlementStrategy.js through the
 *     shared warFrontReads provenance gate.
 *
 * IMPORT DIRECTION IS ONE-WAY and the reach is ONE MODULE: the chooser imports this leaf,
 * this leaf imports nothing from the chooser, and its only import at all is
 * relationshipEvolution.js — INTERIOR's own — so the family is acyclic and this home mints
 * no cross-layer pair. Nothing here forks an rng or touches world state.
 */
import {
  settlementStrength,
  buildPressureSummary,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
} from './relationshipEvolution.js';

/** @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot */

// The hostile/adversarial axis a settlement can act on (besiege / escalate).
export const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);

/**
 * The relationship edge between two settlements (raw), for a sue-for-peace proposal.
 * @param {PulseSnapshot} snapshot @param {unknown} a @param {unknown} b
 */
export function hostileEdgeBetween(snapshot, a, b) {
  const aId = String(a);
  const bId = String(b);
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const s = getRelationshipSettlements(edge);
    const paired = (String(s.from) === aId && String(s.to) === bId)
      || (String(s.from) === bId && String(s.to) === aId);
    if (paired) return rawEdge;
  }
  return null;
}

/**
 * The strongest NON-hostile neighbour of `sId` — the target for the outward/build M9a
 * levers (credit / missionize / legitimacy). Codepoint-stable tie-break; null when the
 * settlement has no non-hostile edge. Reads only the pre-tick snapshot (order-free).
 * @param {PulseSnapshot} snapshot @param {string|number} sId @param {(id:string)=>number} strengthFor @returns {string|null}
 */
export function strongestNonHostileNeighbour(snapshot, sId, strengthFor) {
  const id = String(sId);
  const states = snapshot?.worldState?.relationshipStates || {};
  /** @type {string|null} */
  let best = null;
  let bestStrength = -Infinity;
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (HOSTILE_TYPES.has(relState.relationshipType)) continue;
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a !== id && b !== id) continue;
    const other = a === id ? b : a;
    if (!snapshot?.byId?.has?.(other)) continue;
    const s = strengthFor(other);
    if (s > bestStrength || (s === bestStrength && (best == null || other < best))) {
      bestStrength = s;
      best = other;
    }
  }
  return best;
}

/**
 * Per-settlement strength lookup from the SINGLE pre-tick snapshot, using the SAME
 * pressure index the relationship contests + the war layer read — so the chooser's
 * "do I out-muscle this target?" can never diverge from the deploy gate.
 * @param {PulseSnapshot} snapshot @param {unknown} pressureIdx @returns {(id: unknown) => number}
 */
export function buildStrengthLookup(snapshot, pressureIdx) {
  const cache = new Map();
  return (/** @type {unknown} */ id) => {
    const key = String(id);
    if (cache.has(key)) return cache.get(key);
    const item = snapshot?.byId?.get?.(key);
    if (!item) {
      cache.set(key, 0);
      return 0;
    }
    const strength = settlementStrength(item, buildPressureSummary(pressureIdx, key));
    cache.set(key, strength);
    return strength;
  };
}
