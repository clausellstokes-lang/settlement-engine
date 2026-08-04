/**
 * domain/worldPulse/warCapacityReads.js — the war layer's PURE SNAPSHOT READS.
 *
 * THE DECOMPOSITION WAVE (war tranche, ruling R-BLD-4). `warDeployment.js` is a
 * writer FAMILY: `evaluateWarLayer` stays the head — the one entry that mints
 * outcomes, seeds deployments and mutates the ledgers — and everything that is a
 * pure READ of the pre-tick snapshot lives here, where nothing can reach a ledger.
 *
 * Every function in this file is TOTAL and SIDE-EFFECT FREE: it takes the single
 * pre-tick snapshot (plus, for the capacity lookup, the live one-army ledger it only
 * READS) and returns a number, a lookup closure, or a list. No rng, no clock, no
 * store, no mutation. That is the property the split buys: a future edit cannot make
 * a capacity read write a deployment, because the module it lives in cannot see one.
 *
 * The three lookups are CACHED PER ID and built ONCE per tick by the head, so the
 * war layer's cross-settlement reads all come from the same pre-tick snapshot — the
 * determinism contract warDeployment.js's header states.
 */

import {
  settlementStrength,
  buildPressureSummary,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
} from './relationshipEvolution.js';
import { deriveSettlementPressures, pressureIndex } from './pressureModel.js';
import { warFrontsInto } from './warFrontReads.js';
import { clamp01 } from '../region/contestMath.js';
import { deriveMilitaryCapacity } from './militaryStrength.js';
import { classifyFeasibility, verdictPermitsSiege } from './feasibilityGate.js';

/**
 * Shared war/trade/occupation sim-shape typedefs (see ./pulseShapes.js) — named,
 * index-signature-backed loose bags, aliased locally so the annotations below read
 * the same as they did in warDeployment.js before the split.
 * @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot
 * @typedef {import('./pulseShapes.js').WorldState} WorldState
 * @typedef {import('./pulseShapes.js').RegionGraph} RegionGraph
 * @typedef {import('./pulseShapes.js').DeploymentRecord} DeploymentRecord
 */

/** @param {any} a @param {any} b @returns {number} */
export const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// ── War-specific MILITARY CAPACITY tunables. The deploy/siege math reads the
// structured `deriveMilitaryCapacity` model as the WAR strength source, NOT the
// coarse settlementStrength (which stays the relationship-dynamics confidence input).
// `theoreticalCapacity` is latent; `currentCapacity` is the live fighting strength —
// theoretical MINUS war_exhaustion/war_drain (the model already subtracts those)
// MINUS the army-deployed-away penalty (subtracted HERE: a settlement with its army
// committed abroad fights home battles at reduced strength). The siege contest uses
// CURRENT capacity. Capacities are 0..100; the logistic slope is calibrated for that
// scale.
export const ARMY_DEPLOYED_CAPACITY_PENALTY = 14; // home-defense points lost while the army is abroad

// Ally defense (P3, flag-gated). Support relationships whose neighbour may send relief,
// and the fraction of that neighbour's home defense it contributes to the besieged town.
const ALLY_SUPPORT_TYPES = new Set(['allied', 'ally', 'vassal', 'patron', 'defensive_pact']);
const ALLY_RELIEF_FRACTION = 0.4;

/**
 * Relief a besieged target can draw from its support-relationship neighbours (P3). Sums a
 * fraction of each allied/vassal/patron neighbour's home defense — but an ally that is
 * ITSELF under siege this tick can't spare relief. Pure + order-independent (codepoint-
 * sorted). Mirrors the hostile-edge reader; returns 0 for a friendless target.
 * @param {PulseSnapshot} snapshot @param {string} targetId @param {(id:any)=>any} capacityFor @param {Set<string>} besiegedSet
 * @returns {number}
 */
export function computeAllyRelief(snapshot, targetId, capacityFor, besiegedSet, coalitionLit = false) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const allies = new Set();
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (!ALLY_SUPPORT_TYPES.has(relState.relationshipType)) continue;
    // WR-6: peer alliances become priced, explicit deployments.  They may no
    // longer appear a second time as free wall relief.  Hierarchical protection
    // (vassal/patron) remains the separate existing institution it always was.
    if (coalitionLit && relState.relationshipType !== 'vassal' && relState.relationshipType !== 'patron') continue;
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a === String(targetId) && snapshot?.byId?.has?.(b)) allies.add(b);
    else if (b === String(targetId) && snapshot?.byId?.has?.(a)) allies.add(a);
  }
  let relief = 0;
  for (const ally of [...allies].sort(codepoint)) {
    if (besiegedSet.has(ally)) continue; // an ally under its own siege sends nothing
    relief += (Number(capacityFor(ally)?.homeDefense) || 0) * ALLY_RELIEF_FRACTION;
  }
  return relief;
}

// isLiveWarFront / isRelationshipMintedFront / warFrontsFrom / warFrontsInto — the
// provenance-gated siege reads — live in ./warFrontReads.js (imported above) so the
// head and its sibling readers share ONE definition of a live siege.

/**
 * The channel IDs of CONFIRMED war_front channels FROM `fromId` TO `toId`, read straight
 * off the pre-tick graph (so the id matches whatever the graph actually carries — robust
 * against any id-format drift). Used to RETIRE a front when its siege resolves (conquest
 * or withdrawal): a resolved siege must drop its war_front channel(s) to 'dormant' so the
 * next tick does not re-discover the same besieger→target front and re-fire the conquest.
 * Codepoint-sorted for determinism.
 * @param {RegionGraph} graph
 * @param {any} fromId
 * @param {any} toId
 * @returns {string[]}
 */
export function warFrontChannelIds(graph, fromId, toId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (channel.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (String(channel.from) !== String(fromId)) continue;
    if (String(channel.to) !== String(toId)) continue;
    if (channel.id != null) out.push(String(channel.id));
  }
  return out.sort(codepoint);
}

/**
 * Build a per-settlement strength lookup from the SINGLE pre-tick snapshot. The
 * pressure vector is the SAME one the relationship contests read (buildPressureSummary
 * over the derived pressure index), so a deploy-confidence gate and the subjugation
 * gate can never diverge. Returns `(id) => number` 0..1, defaulting to 0 for unknown.
 * @param {PulseSnapshot} snapshot
 * @returns {(id: any) => number}
 */
export function buildStrengthLookup(snapshot) {
  const pIndex = pressureIndex(deriveSettlementPressures(snapshot));
  const cache = new Map();
  return (/** @type {any} */ id) => {
    const key = String(id);
    if (cache.has(key)) return cache.get(key);
    const item = snapshot?.byId?.get?.(key);
    if (!item) {
      cache.set(key, 0);
      return 0;
    }
    const strength = settlementStrength(item, buildPressureSummary(pIndex, key));
    cache.set(key, strength);
    return strength;
  };
}

/**
 * Build a per-settlement MILITARY-CAPACITY lookup from the single pre-tick snapshot.
 * Returns `(id) => { theoretical, offensive, homeDefense, facets }`:
 *   - `theoretical`  — latent strength (the model's full capacity).
 *   - `offensive`    — the fighting strength a settlement PROJECTS (theoretical minus
 *                      war_exhaustion/war_drain — the model subtracts those). The army
 *                      committed to a siege IS the offensive force, so the army-away
 *                      penalty is NOT applied here.
 *   - `homeDefense`  — the strength defending HOME: `offensive` MINUS the army-away
 *                      penalty (an army abroad cannot man the home walls). This is the
 *                      DEFENDER side of a siege contest.
 * The siege contest reads the besieger's `offensive` (force at the walls) vs the
 * defender's `homeDefense` (force on the walls). Cached per id; zero envelope for an
 * unknown id.
 * @param {PulseSnapshot} snapshot
 * @param {Record<string, DeploymentRecord>} deployments  the live one-army ledger (army-away read).
 * @returns {(id: any) => { theoretical: number, offensive: number, homeDefense: number, facets: any }}
 */
export function buildCapacityLookup(snapshot, deployments) {
  /** @type {Map<string, { theoretical: number, offensive: number, homeDefense: number, facets: any }>} */
  const cache = new Map();
  return (/** @type {any} */ id) => {
    const key = String(id);
    const hit = cache.get(key);
    if (hit) return hit;
    const item = snapshot?.byId?.get?.(key);
    if (!item) {
      const zero = { theoretical: 0, offensive: 0, homeDefense: 0, facets: {} };
      cache.set(key, zero);
      return zero;
    }
    const economicCapacityScore = item?.causal?.scores?.economic_capacity;
    const model = deriveMilitaryCapacity(item, {
      economicCapacityScore: Number.isFinite(economicCapacityScore) ? economicCapacityScore : undefined,
    });
    const offensive = Math.max(0, model.currentCapacity);
    // The home-defense reading subtracts the army-away penalty: a settlement whose
    // army is committed abroad defends its OWN walls at reduced strength.
    const armyAway = deployments && deployments[key]?.targetId ? ARMY_DEPLOYED_CAPACITY_PENALTY : 0;
    const homeDefense = Math.max(0, offensive - armyAway);
    const out = { theoretical: model.theoreticalCapacity, offensive, homeDefense, facets: model.facets };
    cache.set(key, out);
    return out;
  };
}

/**
 * Reusable hard feasibility read for a coalition join, including delayed
 * proposal approval. A compact can authorize mobilization; it cannot make an
 * independently hopeless army pass the one opener's physical siege law.
 *
 * The four parameters carried no annotations while this lived in warDeployment.js,
 * where their four implicit-anys sat inside that file's strict baseline. A NEW file
 * must be strict-clean, so they are typed here off the shared sim-shape aliases —
 * a burn-down of four holes, not a relocation of them.
 *
 * @param {PulseSnapshot} snapshot
 * @param {WorldState} worldState
 * @param {unknown} partyId   `unknown`, not `any`: both ids are String()-coerced on
 * @param {unknown} enemyId   the first two lines, so nothing may read through them.
 * @returns {{ allowed: boolean, verdict: string }}
 */
export function coalitionJoinFeasibility(snapshot, worldState, partyId, enemyId) {
  const party = String(partyId || '');
  const enemy = String(enemyId || '');
  if (!party || !enemy || party === enemy
    || !snapshot?.byId?.has?.(party) || !snapshot?.byId?.has?.(enemy)) {
    return { allowed: false, verdict: 'auto_fail' };
  }
  const capacityFor = buildCapacityLookup(snapshot, worldState?.deployments || {});
  const attacker = capacityFor(party);
  const defender = capacityFor(enemy);
  const { verdict } = classifyFeasibility({
    attackerCurrent: attacker.offensive,
    defenderCurrent: defender.homeDefense,
    coalitionSize: 1,
    defenderItem: snapshot.byId.get(enemy),
    attackerFacets: attacker.facets,
    defenderFacets: defender.facets,
  });
  return { allowed: verdictPermitsSiege(verdict), verdict };
}

/**
 * The 0..1 ORIGIN ENVELOPE the reinforcement model reads: the home's economy /
 * manpower / materiel / food / trade / legitimacy, plus its war-exhaustion scar and
 * whether it is itself threatened (besieged/occupied ⇒ it cannot reinforce abroad).
 * Pure read of the pre-tick snapshot + the capacity facets.
 *
 * @param {PulseSnapshot} snapshot
 * @param {RegionGraph} graph
 * @param {(id:any)=>{ facets:any }} capacityFor
 * @param {Record<string, number>} warExhaustion
 * @param {string} id
 * @returns {{ economy:number, manpower:number, materiel:number, food:number, trade:number, legitimacy:number, warExhaustion:number, threatened:boolean }}
 */
export function buildOriginEnvelope(snapshot, graph, capacityFor, warExhaustion, id) {
  const key = String(id);
  const item = snapshot?.byId?.get?.(key);
  const facets = capacityFor(key).facets || {};
  const n = (/** @type {any} */ v) => clamp01((Number(v) || 0) / 100);
  const legitScore = item?.settlement?.powerStructure?.publicLegitimacy?.score;
  const tradeScore = item?.causal?.scores?.trade_connectivity;
  return {
    economy: n(facets.economy),
    manpower: n(facets.manpower),
    materiel: n(facets.materiel),
    food: n(facets.logistics),
    trade: Number.isFinite(tradeScore) ? clamp01(tradeScore / 100) : 0.5,
    legitimacy: Number.isFinite(legitScore) ? clamp01(legitScore / 100) : 0.5,
    warExhaustion: clamp01(warExhaustion[key] || 0),
    threatened: isBesieged(graph, key),
  };
}

/**
 * Distance/route LOGISTICS BURDEN (0..1) between an origin and a target,
 * derived from the regional-graph edge (if any). A missing edge reads as a neutral
 * mid burden. Pure; deterministic. Today distance/route data is coarse, so this is a
 * conservative read of edge `distance`/`weight` with a neutral default — the
 * reinforcement model damps the flow ∝ this.
 *
 * @param {RegionGraph} graph
 * @param {string} fromId
 * @param {string} targetId
 * @returns {number} 0 (short/secure) .. 1 (long/unsafe)
 */
export function logisticsBurdenFor(graph, fromId, targetId) {
  for (const edge of graph?.edges || []) {
    const a = String(edge.from);
    const b = String(edge.to);
    if ((a === String(fromId) && b === String(targetId)) || (a === String(targetId) && b === String(fromId))) {
      const dist = Number(edge.distance);
      if (Number.isFinite(dist)) return clamp01(dist / 100);
      const weight = Number(edge.weight);
      // A high-weight (close/strong) edge → low burden; invert.
      if (Number.isFinite(weight)) return clamp01(1 - weight);
    }
  }
  return 0.4; // neutral default — a moderate supply line.
}

/**
 * A settlement is "besieged/occupied" if any CONFIRMED war_front points AT it. A
 * besieged settlement cannot itself open a new siege (its army defends home).
 * @param {RegionGraph} graph
 * @param {any} id
 * @returns {boolean}
 */
export function isBesieged(graph, id) {
  return warFrontsInto(graph, id).length > 0;
}
