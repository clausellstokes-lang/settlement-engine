/**
 * domain/worldPulse/mobilizationReactions.js — Phase B1 NEIGHBOUR REACTIONS.
 *
 * A settlement that enters war_preparation is VISIBLE to its neighbours (the
 * `information_flow` mobilization signal, mobilizationEffects.js). Threatened
 * neighbours — a RIVAL of the mobilizer, the mobilizer's likely TARGET, or a
 * TRADE-DEPENDENT of it — REACT through the EXISTING candidate substrate (these are
 * new candidates flowing through resolveCandidateConflicts → rollCandidates → apply,
 * NOT a parallel system):
 *
 *   - fortify       — raise defences (a defense_readiness-flavoured posture marker).
 *   - seek_allies   — reach for protection (a relationship overture).
 *   - negotiate     — open negotiations to defuse (a de-escalation overture).
 *   - pre_empt      — strike first IF disposition + strength support it.
 *
 * Which reaction a neighbour picks is a DETERMINISTIC choice from its disposition
 * (a belligerent neighbour pre-empts / fortifies; a pacific one negotiates) and its
 * relationship to the mobilizer — NO rng here (the candidate's own roll, downstream,
 * is the only stochastic step). The covert-prep convention is honoured: a COVERT
 * mobilizer is invisible to player views, so a player-facing reaction never fires on
 * it — only the rival's GM-side reaction can.
 *
 * DETERMINISM CONTRACT (sacred):
 *   - GATED behind `simulationRules.warLayerEnabled` (default false ⇒ [] ⇒ no
 *     candidate, byte-identical).
 *   - PURE + rng-FREE here; reads only the pre-tick snapshot's persisted
 *     `worldState.warPosture` + edges. Every iteration is codepoint-sorted.
 *   - At most ONE reaction candidate per (reactor) settlement (the loop runs once per
 *     reactor — they share a `strategy:<reactor>` exclusive tag so a reactor's
 *     reaction and its own strategy move can't double-fire).
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import {
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
  settlementStrength,
  buildPressureSummary,
} from './relationshipEvolution.js';
import { computeAggressiveness } from './disposition.js';
import { stablePart } from './worldState.js';

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));

// The posture states that count as "visibly mobilizing" (the trigger for a reaction).
// peace / alert are below the threshold; demobilizing is winding down (no threat).
const MOBILIZING_STATES = new Set(['war_preparation', 'mobilized', 'deployed']);

// Relationship classes that make a neighbour FEEL THREATENED by a mobilizer.
const RIVAL_TYPES = new Set(['rival', 'cold_war', 'hostile']);
const DEPENDENT_TYPES = new Set(['trade_partner', 'client', 'vassal']);

// Reaction-candidate severities — below the strategy MOVE floor (0.72) so a
// reactor's own strategy move (if any) wins the shared exclusive group, but above
// the reactive-raid floor so the reaction is not crowded out by ambient noise.
const REACT_SEVERITY = Object.freeze({
  pre_empt: 0.66,
  fortify: 0.5,
  seek_allies: 0.46,
  negotiate: 0.42,
});

// Disposition (aggressiveness, centered on 1.0) thresholds that pick the reaction.
const PRE_EMPT_AGGR = 1.18;   // a notably belligerent neighbour strikes first
const FORTIFY_AGGR = 0.95;    // a neutral-to-belligerent neighbour digs in

// war-6 — the DE-ESCALATION half now BITES. negotiate / seek_allies carry a BOUNDED,
// AUTO relationship nudge (applied through applyRelationshipPatch, like the strategy
// levers) so a pacific reaction moves real diplomatic state instead of being a
// narrative no-op — the missing counterweight to the martial reactions. Gentle deltas
// (mean-reversion pulls them back over time) — a reaction is a pressure, not a shove.
const REACT_NUDGE = 0.05;
const REACT_NUDGE_SOFT = 0.04;
const REACT_EFFECT = Object.freeze({
  // negotiate: open talks with the MOBILIZER to defuse — warm the edge, cool the fear.
  negotiate: Object.freeze({ trust: +REACT_NUDGE_SOFT, resentment: -REACT_NUDGE, fear: -REACT_NUDGE_SOFT }),
  // seek_allies: reach toward a protector — a warmth + dependency overture.
  seek_allies: Object.freeze({ trust: +REACT_NUDGE, dependency: +REACT_NUDGE_SOFT }),
});

// Loose sim shapes for the war-6 nudge helpers below (zero any-holes: the looseness
// lives in the referenced typedefs' own baselines). EdgeStateView is the read-only
// string-indexed view of an ensureRelationshipState record the nudge math reads.
/** @typedef {import('./pulseShapes.js').PulseSnapshot} PulseSnapshot */
/** @typedef {import('./pulseShapes.js').RelationshipNudge} RelationshipNudge */
/** @typedef {Record<string, unknown>} EdgeStateView */

/** A bounded relationship-nudge patch from a reaction's scalar deltas + the CURRENT edge
 *  state (applyRelationshipPatch SETS absolute values, so we read-then-clamp here).
 *  @param {Readonly<Record<string, number>>} nudges @param {EdgeStateView|null|undefined} relState @returns {Record<string, number>} */
function nudgePatch(nudges, relState) {
  /** @type {Record<string, number>} */
  const patch = {};
  for (const [scalar, delta] of Object.entries(nudges)) {
    patch[scalar] = clamp01((Number(relState?.[scalar]) || 0) + delta);
  }
  return patch;
}

/**
 * The strongest NON-hostile neighbour of the reactor (for seek_allies) with its edge key,
 * or null. Codepoint-stable tie-break; reads only the pre-tick snapshot (order-free).
 * @param {PulseSnapshot} snapshot @param {string|number} reactorId @param {EdgeStateView} states @param {(id:string)=>number} strengthFor
 * @returns {{ otherId: string, edgeKey: string, relState: EdgeStateView }|null}
 */
function strongestProtector(snapshot, reactorId, states, strengthFor) {
  const id = String(reactorId);
  /** @type {{ otherId: string, edgeKey: string, relState: EdgeStateView }|null} */
  let best = null;
  let bestStrength = -Infinity;
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const edgeKey = relationshipKeyFromEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[edgeKey]);
    if (RIVAL_TYPES.has(String(relState.relationshipType))) continue; // reach for a NON-hostile tie
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a !== id && b !== id) continue;
    const other = a === id ? b : a;
    if (!snapshot?.byId?.has?.(other)) continue;
    const s = strengthFor(other);
    if (s > bestStrength || (s === bestStrength && (best == null || other < best.otherId))) {
      bestStrength = s;
      best = { otherId: other, edgeKey, relState };
    }
  }
  return best;
}

/**
 * Resolve who is visibly mobilizing this tick from the persisted posture ledger
 * (the NEXT-tick ledger the war block already wrote onto worldState). Covert
 * mobilizers are flagged so a player-facing reaction can skip them.
 * @param {any} worldState
 * @returns {Array<{ id: string, state: string, covert: boolean }>}
 */
function visibleMobilizers(worldState) {
  const ledger = worldState?.warPosture && typeof worldState.warPosture === 'object' ? worldState.warPosture : {};
  /** @type {Array<{ id: string, state: string, covert: boolean }>} */
  const out = [];
  for (const id of Object.keys(ledger).sort(codepoint)) {
    const rec = ledger[id] || {};
    if (!MOBILIZING_STATES.has(String(rec.state))) continue;
    out.push({ id, state: String(rec.state), covert: rec.covert === true });
  }
  return out;
}

/**
 * Build one reaction candidate (probability 1 — the reaction is the DECISION; its
 * downstream roll governs whether it lands). Shares the `strategy:<reactor>`
 * exclusive tag so a reactor cannot both react AND make a separate strategy move.
 * @param {{ move: string, reactorId: string, mobilizerId: string, tick: number, severity: number, headline: string, summary: string, reasons: string[], relationshipNudge?: RelationshipNudge|null }} args
 */
function reactionCandidate({ move, reactorId, mobilizerId, tick, severity, headline, summary, reasons, relationshipNudge = null }) {
  const base = {
    id: `candidate.mobilization_reaction.${move}.${stablePart(reactorId)}.${stablePart(mobilizerId)}.${tick}`,
    type: relationshipNudge ? 'relationship' : 'condition',
    candidateType: `mobilization_reaction_${move}`,
    ruleId: `mobilization_reaction_${move}`,
    ruleFamily: 'mobilization_reaction',
    targetSaveId: String(reactorId),
    severity,
    // Below 1 so it flows through the normal roll (it CAN be crowded out / fail) —
    // unlike the war layer's guaranteed conditions. A modest, near-certain pass.
    probability: 0.9,
    applyMode: 'auto',
    headline,
    summary,
    reasons: reasons.slice(0, 4),
    metadata: {
      settlementId: String(reactorId),
      mobilizerId: String(mobilizerId),
      reactionMove: move,
      // war-6: applyRelationshipPatch stamps recentIncidents with this type so the drift
      // reads the de-escalation/overture (a distinct event from the martial reactions).
      ...(relationshipNudge ? { incidentType: relationshipNudge.incidentType } : {}),
    },
    // The reactor's exclusive tag (allow-listed `strategy:<S>` in candidateEvents) so
    // a reactor's reaction and its own strategy move resolve as one slot.
    conflictTags: [`strategy:${String(reactorId)}`],
    condition: move === 'fortify' || move === 'pre_empt'
      ? {
          archetype: 'war_mobilization',
          severity: clamp01(severity * 0.7),
          triggeredAt: { tick, sourceEventType: 'WAR_LAYER_REACTION', sourceEventTargetId: String(reactorId) },
          causes: [{ source: String(reactorId), effect: 'war_mobilization', reason: `Reacting to ${mobilizerId} mobilizing.` }],
        }
      : undefined,
    generatedAtTick: tick,
  };
  // war-6 — the pacific reactions (negotiate / seek_allies) carry a BOUNDED relationship
  // nudge so choosing peace is never a mechanical no-op. Applied via applyRelationshipPatch
  // (auto — no DM proposal, no label change, no wind-down).
  if (relationshipNudge) {
    return {
      ...base,
      relationshipKey: relationshipNudge.relationshipKey,
      relationshipPatch: relationshipNudge.relationshipPatch,
    };
  }
  return base;
}

/**
 * Evaluate the neighbour-reaction layer for one tick.
 *
 * @param {any} snapshot       the SINGLE pre-tick snapshot (carries the persisted
 *                             worldState.warPosture written by the war block).
 * @param {any} pressureIdx    the derived pressure index (settlementStrength input).
 * @param {Object} context
 * @param {number} [context.tick]
 * @param {{ warLayerEnabled?: boolean }} [context.simulationRules]
 * @returns {any[]} at most ONE reaction candidate per reactor; [] when OFF.
 */
export function evaluateMobilizationReactions(snapshot, pressureIdx, context = {}) {
  const rules = context.simulationRules || {};
  if (!rules.warLayerEnabled) return []; // GATE: byte-identical no-op when OFF.

  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const worldState = snapshot?.worldState || {};
  const mobilizers = visibleMobilizers(worldState);
  if (!mobilizers.length) return [];

  const states = worldState.relationshipStates || {};

  // Strength lookup (same pressure index the war layer reads) for the pre-empt gate.
  const strengthFor = (/** @type {string} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    if (!item) return 0;
    return settlementStrength(item, buildPressureSummary(pressureIdx, String(id)));
  };

  // For each MOBILIZER, find the threatened neighbours and (at most) one reaction
  // per neighbour. A neighbour reacting to several mobilizers reacts to the FIRST
  // (codepoint-sorted) — exactly one candidate per reactor via the loop dedup below.
  /** @type {Map<string, any>} */
  const byReactor = new Map();

  for (const mob of mobilizers) {
    const mobId = mob.id;
    // Codepoint-sorted edges incident to the mobilizer.
    /** @type {Array<{ otherId: string, relType: string, edgeKey: string, relState: EdgeStateView }>} */
    const incident = [];
    for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
      const edge = normalizeRelationshipEdge(rawEdge);
      const { from, to } = getRelationshipSettlements(edge);
      const a = String(from);
      const b = String(to);
      if (a !== mobId && b !== mobId) continue;
      const other = a === mobId ? b : a;
      if (!snapshot?.byId?.has?.(other)) continue;
      const edgeKey = relationshipKeyFromEdge(rawEdge);
      const relState = ensureRelationshipState(edge, states[edgeKey]);
      incident.push({ otherId: other, relType: String(relState.relationshipType || 'neutral'), edgeKey, relState });
    }
    incident.sort((x, y) => codepoint(x.otherId, y.otherId));

    for (const { otherId, relType, edgeKey, relState: mobEdgeState } of incident) {
      if (byReactor.has(otherId)) continue; // one reaction per reactor (first mobilizer wins)
      const isRival = RIVAL_TYPES.has(relType);
      const isDependent = DEPENDENT_TYPES.has(relType);
      if (!isRival && !isDependent) continue; // a neutral/allied neighbour is not threatened

      // COVERT-PREP visibility: a covert mobilizer is hidden from player views. Only a
      // RIVAL (the adversary tracking it via GM-side intelligence) can react to a
      // covert mobilization; a trade-dependent (a player-facing economic reaction)
      // cannot see it. This honours the channel-visibility convention end to end.
      if (mob.covert && !isRival) continue;

      const reactorItem = snapshot?.byId?.get?.(otherId);
      const aggr = computeAggressiveness(reactorItem, worldState);
      const reactorName = reactorItem?.name || reactorItem?.settlement?.name || otherId;
      const mobName = snapshot?.byId?.get?.(mobId)?.name || mobId;

      let move;
      if (isRival && aggr >= PRE_EMPT_AGGR && strengthFor(otherId) >= strengthFor(mobId)) {
        move = 'pre_empt';
      } else if (isDependent) {
        // A trade-dependent's instinct is to defuse (protect its lifeline) unless it
        // is itself belligerent, in which case it fortifies.
        move = aggr >= FORTIFY_AGGR ? 'fortify' : 'negotiate';
      } else if (aggr >= FORTIFY_AGGR) {
        move = 'fortify';
      } else {
        move = 'seek_allies';
      }

      const headline = /** @type {Record<string, string>} */ ({
        pre_empt: `${reactorName} moves to strike first`,
        fortify: `${reactorName} raises its defences`,
        seek_allies: `${reactorName} seeks allies`,
        negotiate: `${reactorName} opens negotiations`,
      })[move] || `${reactorName} reacts`;
      const summary = /** @type {Record<string, string>} */ ({
        pre_empt: `Seeing ${mobName} mobilize, the belligerent ${reactorName} prepares a pre-emptive move.`,
        fortify: `${reactorName} answers ${mobName}'s mobilization by hardening its own defences.`,
        seek_allies: `${reactorName} reaches for protection as ${mobName} gears for war.`,
        negotiate: `${reactorName} opens talks to defuse ${mobName}'s mobilization before it threatens trade.`,
      })[move] || `${reactorName} reacts to ${mobName} mobilizing.`;

      // war-6 — the pacific reactions gain a BOUNDED relationship nudge. negotiate warms
      // the edge to the MOBILIZER (defuse); seek_allies reaches an overture toward the
      // reactor's strongest non-hostile neighbour (a protector). Absent a valid edge the
      // nudge is null and the reaction falls back to its (former) inert marker.
      let relationshipNudge = null;
      if (move === 'negotiate') {
        relationshipNudge = { relationshipKey: edgeKey, relationshipPatch: nudgePatch(REACT_EFFECT.negotiate, mobEdgeState), incidentType: 'negotiation' };
      } else if (move === 'seek_allies') {
        const protector = strongestProtector(snapshot, otherId, states, strengthFor);
        if (protector) {
          relationshipNudge = { relationshipKey: protector.edgeKey, relationshipPatch: nudgePatch(REACT_EFFECT.seek_allies, protector.relState), incidentType: 'alliance_overture' };
        }
      }

      byReactor.set(otherId, reactionCandidate({
        move,
        reactorId: otherId,
        mobilizerId: mobId,
        tick,
        severity: /** @type {Record<string, number>} */ (REACT_SEVERITY)[move],
        headline,
        summary,
        reasons: [
          `${reactorName} is a ${relType} of the mobilizing ${mobName}.`,
          `Disposition ${aggr.toFixed(2)} (centered on 1.0) → ${move}.`,
          ...(relationshipNudge ? [`A bounded ${Object.keys(relationshipNudge.relationshipPatch).join('/')} nudge (${relationshipNudge.incidentType}).`] : []),
        ],
        relationshipNudge,
      }));
    }
  }

  return [...byReactor.keys()].sort(codepoint).map((rid) => byReactor.get(rid));
}

export const REACTION_TUNING = Object.freeze({ REACT_SEVERITY, PRE_EMPT_AGGR, FORTIFY_AGGR });
