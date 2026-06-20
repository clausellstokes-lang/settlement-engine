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
 * @param {{ move: string, reactorId: string, mobilizerId: string, tick: number, severity: number, headline: string, summary: string, reasons: string[] }} args
 */
function reactionCandidate({ move, reactorId, mobilizerId, tick, severity, headline, summary, reasons }) {
  return {
    id: `candidate.mobilization_reaction.${move}.${stablePart(reactorId)}.${stablePart(mobilizerId)}.${tick}`,
    type: 'condition',
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
    metadata: { settlementId: String(reactorId), mobilizerId: String(mobilizerId), reactionMove: move },
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
    /** @type {Array<{ otherId: string, relType: string }>} */
    const incident = [];
    for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
      const edge = normalizeRelationshipEdge(rawEdge);
      const { from, to } = getRelationshipSettlements(edge);
      const a = String(from);
      const b = String(to);
      if (a !== mobId && b !== mobId) continue;
      const other = a === mobId ? b : a;
      if (!snapshot?.byId?.has?.(other)) continue;
      const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
      incident.push({ otherId: other, relType: String(relState.relationshipType || 'neutral') });
    }
    incident.sort((x, y) => codepoint(x.otherId, y.otherId));

    for (const { otherId, relType } of incident) {
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
        ],
      }));
    }
  }

  return [...byReactor.keys()].sort(codepoint).map((rid) => byReactor.get(rid));
}

export const REACTION_TUNING = Object.freeze({ REACT_SEVERITY, PRE_EMPT_AGGR, FORTIFY_AGGR });
