/**
 * domain/worldPulse/settlementStrategy.js — the SETTLEMENT-tier
 * strategy chooser. A deliberative "enumerate candidate moves, score each, pick
 * one" agent — the same idiom as npcAgency.evaluateNpcRules (the NPC-tier chooser),
 * lifted to the settlement tier and made RNG-VARIED via a softmax sample (so a
 * strong move is most likely but not certain — controlled variety) rather than a
 * hard argmax.
 *
 * Each settlement gets AT MOST ONE strategy candidate per tick (the loop runs ONCE
 * per settlement — codepoint-sorted — NOT per edge, so a settlement on N hostile
 * edges does not emit N candidates and starve the per-settlement auto budget).
 *
 * DETERMINISM CONTRACT (sacred):
 *   - GATED behind `simulationRules.settlementStrategyEnabled` (default FALSE).
 *     When OFF this returns [] — no candidate, no rng draw — so a legacy / layer-off
 *     campaign is BYTE-IDENTICAL.
 *   - No Date.now / Math.random / argless new Date. The move is SAMPLED via an
 *     injected `rng` forked on a STABLE key (`strategy:<S>:<tick>`), never a
 *     list-order stream. The hard-override return-home bypasses the sample entirely
 *     (it is DETERMINISTIC — an emergency recall cannot be out-competed by a high
 *     deploy weight).
 *   - Every iteration that feeds output is over a CODEPOINT-SORTED key list — the
 *     settlement loop AND the legal-move enumeration — never a Map/Set/Object
 *     insertion order. Reversing the saves/edges array yields identical chosen moves.
 *   - All cross-settlement reads come from the SINGLE pre-tick snapshot.
 *
 * PROBABILITY-1, NO DOUBLE-RANDOMIZE: the chosen move was ALREADY sampled here by
 * the softmax draw. It is emitted at probability 1 so `rollCandidates` treats it as
 * a guaranteed consequence — a second Bernoulli would double-randomize it.
 *
 * EXCLUSIVE-TAG DE-CONFLICT: every strategy candidate carries a `strategy:<S>`
 * exclusive tag. The reactive per-edge war candidates (hostileRules raid /
 * occupation pressure) where S is the state-decided aggressor ALSO resolve to
 * `strategy:<S>` (derived from their `metadata.aggressorSaveId` in
 * candidateEvents.exclusiveTags), so resolveCandidateConflicts admits exactly ONE
 * — and the strategy move WINS because it is emitted with the highest severity in
 * the exclusive group. This is what makes the hard-override return-home actually
 * SUPPRESS the reactive escalation for S (no double-fire) without weakening the
 * reactive rules themselves.
 */

import {
  settlementStrength,
  buildPressureSummary,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
  relationshipRoles,
} from './relationshipEvolution.js';
import { computeAggressiveness } from './disposition.js';
import { softmaxWeights, stableSampleByWeight, clamp01, hash01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// The hostile/adversarial axis a settlement can act on (besiege / escalate).
const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);

// Softmax temperature (decisiveness). Load-bearing: too high collapses to a hard
// argmax (the RNG never varies the move, defeating the "controlled variety"
// requirement); too low routs/sues at random. Mid-range — the best move is most
// likely, upsets happen.
const STRATEGY_K = 3.5;

// Severity floor that guarantees a strategy move outranks the reactive war
// candidates it shares the `strategy:<S>` exclusive tag with (hostileRules raid
// severity tops out ≈0.64). The hard override sits even higher so an emergency
// recall always wins its group.
const MOVE_SEVERITY = 0.72;
const OVERRIDE_SEVERITY = 0.95;

/**
 * Confirmed war_front channels INTO a settlement (it is besieged), codepoint-sorted sources.
 * @param {any} graph @param {any} toId @returns {string[]}
 */
function warFrontsInto(graph, toId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (channel.type !== 'war_front' || channel.status !== 'confirmed') continue;
    if (String(channel.to) !== String(toId)) continue;
    out.push(String(channel.from));
  }
  return out.sort(codepoint);
}

/**
 * Confirmed war_front channels FROM a settlement (it is besieging), codepoint-sorted targets.
 * @param {any} graph @param {any} fromId @returns {string[]}
 */
function warFrontsFrom(graph, fromId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (channel.type !== 'war_front' || channel.status !== 'confirmed') continue;
    if (String(channel.from) !== String(fromId)) continue;
    out.push(String(channel.to));
  }
  return out.sort(codepoint);
}

/**
 * A settlement is besieged/occupied if any confirmed war_front points AT it.
 * @param {any} graph @param {any} id @returns {boolean}
 */
function isBesieged(graph, id) {
  return warFrontsInto(graph, id).length > 0;
}

/**
 * Per-settlement strength lookup from the SINGLE pre-tick snapshot, using the SAME
 * pressure index the relationship contests + the war layer read — so the chooser's
 * "do I out-muscle this target?" can never diverge from the deploy gate.
 * @param {any} snapshot @param {any} pressureIdx @returns {(id: any) => number}
 */
function buildStrengthLookup(snapshot, pressureIdx) {
  const cache = new Map();
  return (/** @type {any} */ id) => {
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

/**
 * Economic exhaustion of a settlement in 0..1 (higher = more drained). Reads the
 * LIVE economic_capacity causal score (0..100, the Phase-0 / homeostasis dial), so
 * sue-for-peace weight tracks war bankruptcy. Missing score ⇒ 0 (not exhausted).
 * @param {any} item @returns {number}
 */
function economicExhaustion(item) {
  const cap = item?.causal?.scores?.economic_capacity;
  if (!Number.isFinite(cap)) return 0;
  return clamp01(1 - cap / 100);
}

/**
 * Resolve, from the pre-tick edges + relationshipStates, the geopolitical context
 * a single settlement S reasons about: its hostile targets, its vassals, whether it
 * (or any vassal) is besieged/occupied. All sets codepoint-sorted / order-free.
 * @param {any} snapshot @param {any} graph @param {any} sId
 */
function contextFor(snapshot, graph, sId) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const id = String(sId);
  const hostileTargets = new Set();
  const vassalIds = new Set();

  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a !== id && b !== id) continue;
    const other = a === id ? b : a;
    if (!snapshot?.byId?.has?.(other)) continue;

    if (HOSTILE_TYPES.has(relState.relationshipType)) {
      hostileTargets.add(other);
    }
    // A vassal obligation: S is the senior (overlord) of `other`.
    if (relState.relationshipType === 'vassal') {
      const { seniorId, juniorId } = relationshipRoles(edge, relState);
      if (String(seniorId) === id) vassalIds.add(String(juniorId));
    }
  }

  const homeBesieged = isBesieged(graph, id);
  const vassalBesieged = [...vassalIds].some((vid) => isBesieged(graph, vid));

  return {
    hostileTargets: [...hostileTargets].sort(codepoint),
    vassalIds: [...vassalIds].sort(codepoint),
    homeBesieged,
    vassalBesieged,
    besieging: warFrontsFrom(graph, id),
  };
}

/**
 * The relationship edge between two settlements (raw), for a sue-for-peace proposal.
 * @param {any} snapshot @param {any} a @param {any} b
 */
function hostileEdgeBetween(snapshot, a, b) {
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
 * Build a probability-1 strategy candidate. The `strategy:<S>` exclusive tag is what
 * the reactive escalation for S contends with; severity is set ABOVE the reactive
 * war candidates so the strategy move wins the exclusive group.
 *
 * @param {{ move: string, sId: string, tick: number, severity: number, headline: string,
 *   summary: string, reasons: string[], proposal?: any, condition?: any }} args
 */
function strategyCandidate({ move, sId, tick, severity, headline, summary, reasons, proposal, condition }) {
  const base = {
    id: `candidate.strategy.${move}.${stablePart(sId)}.${tick}`,
    type: (proposal || condition) ? (proposal ? 'relationship' : 'condition') : 'condition',
    candidateType: `strategy_${move}`,
    ruleId: `settlement_strategy_${move}`,
    ruleFamily: 'strategy',
    targetSaveId: String(sId),
    severity,
    probability: 1, // ALREADY sampled here — no second roll.
    applyMode: proposal ? 'proposal' : 'auto',
    headline,
    summary,
    reasons,
    metadata: { settlementId: String(sId), strategyMove: move },
    // `strategy:<S>` is the exclusive tag (allow-listed in candidateEvents). The
    // reactive raid/occupation candidates where S is the aggressor resolve to the
    // SAME tag (via their metadata.aggressorSaveId) — exactly one is admitted.
    conflictTags: [`strategy:${String(sId)}`],
    generatedAtTick: tick,
  };
  if (proposal) {
    return {
      ...base,
      relationshipKey: proposal.relationshipKey,
      relationshipPatch: proposal.relationshipPatch,
      proposalPayload: proposal.proposalPayload,
      conflictTags: [...base.conflictTags, `label:${proposal.relationshipKey}`],
    };
  }
  // condition is OPT-IN (only the `deploy` move carries army_deployed). defend /
  // hold / return_home emit an INERT marker (no `condition`) so they win the
  // exclusive group + suppress the reactive escalation WITHOUT a stray
  // defense/economy debuff — a status-quo decision has no world-state cost.
  return condition ? { ...base, condition } : base;
}

/**
 * The legal move set for a settlement, codepoint-sorted, each with a deterministic
 * utility score. The move space mirrors the spec's enumeration (defend / deploy /
 * relieve-ally / liberate / hold / attrition / rout / sue-for-peace); we ship the
 * subset that maps onto built levers (defend / deploy / hold / sue_for_peace),
 * scored from aggressiveness, strength vs targets, current war/siege state, vassal
 * status, and economic exhaustion. Returns `[{ move, score }, ...]` sorted by move
 * key (NOT by score) so the softmax input order is canonical and order-free.
 * @param {{ sId: any, ctx: any, aggressiveness: number, strengthFor: (id: any) => number, exhaustion: number }} args
 */
function enumerateMoves({ sId, ctx, aggressiveness, strengthFor, exhaustion }) {
  const sStrength = strengthFor(sId);
  const aggr = aggressiveness - 1; // signed drive ∈ ~[-0.5, 0.5]
  /** @type {Record<string, number>} */
  const scored = {};

  // defend — always legal. Strong when besieged or when the settlement is weak.
  scored.defend = clamp01(0.35 + (ctx.homeBesieged ? 0.4 : 0) + (0.5 - sStrength) * 0.4 - aggr * 0.3);

  // hold — passive status-quo. The baseline fallback; mildly favored by a pacific
  // disposition and an exhausted economy that can't afford a new front.
  scored.hold = clamp01(0.4 - aggr * 0.2 + exhaustion * 0.15);

  // deploy — only legal if NOT besieged at home, confident, and there's a hostile
  // target it clearly out-muscles. Scaled by aggressiveness; damped by exhaustion.
  if (!ctx.homeBesieged) {
    let best = -Infinity;
    for (const targetId of ctx.hostileTargets) {
      const margin = sStrength - strengthFor(targetId);
      if (margin > best) best = margin;
    }
    if (best > -Infinity && best > 0.05) {
      scored.deploy = clamp01(0.3 + best * 0.6 + aggr * 0.5 - exhaustion * 0.4);
    }
  }

  // sue_for_peace — GATED: S and ALL its vassals must be free (not besieged/
  // occupied), and S must actually be in a hostile posture (a target or a front).
  // WEIGHTED by economic exhaustion (war bankruptcy → seek peace) and a pacific
  // disposition. Pulls the EXISTING de-escalation levers on apply.
  const peaceGateOpen = !ctx.homeBesieged && !ctx.vassalBesieged;
  const inConflict = ctx.hostileTargets.length > 0 || ctx.besieging.length > 0;
  if (peaceGateOpen && inConflict) {
    scored.sue_for_peace = clamp01(0.15 + exhaustion * 0.6 - aggr * 0.4);
  }

  return Object.keys(scored)
    .sort(codepoint)
    .map((move) => ({ move, score: scored[move] }));
}

/**
 * Emit the chosen move as a probability-1 candidate. `deploy` carries an
 * army_deployed condition; `sue_for_peace` carries a relationship_label_change
 * proposal (pulling the existing de-escalation levers); `defend` / `hold` emit an
 * INERT marker (no condition, no patch) that still wins the `strategy:<S>`
 * exclusive group and so suppresses the reactive escalation for S — the chooser
 * decided NOT to escalate this tick, with no stray world-state cost.
 * @param {{ move: string, sId: any, item: any, ctx: any, tick: number, exhaustion: number, snapshot: any, strengthFor: (id: any) => number }} args
 */
function emitMove({ move, sId, item, ctx, tick, exhaustion, snapshot, strengthFor }) {
  const name = item?.name || item?.settlement?.name || String(sId);

  if (move === 'sue_for_peace') {
    // Target the strongest hostile edge to wind down. Codepoint-first for stability.
    const target = ctx.hostileTargets[0] || ctx.besieging[0];
    const edge = target ? hostileEdgeBetween(snapshot, sId, target) : null;
    if (!edge) return null; // no edge to de-escalate — fall through to nothing
    const key = relationshipKeyFromEdge(edge);
    return strategyCandidate({
      move,
      sId,
      tick,
      severity: MOVE_SEVERITY,
      headline: `${name} sues for peace`,
      summary: `War-weary and economically drained, ${name} seeks to wind the conflict down.`,
      reasons: [
        `Economic exhaustion ${exhaustion.toFixed(2)} drives ${name} to the table.`,
        'Sue-for-peace pulls the existing de-escalation levers (hostile_truce / wind-down).',
      ],
      proposal: {
        relationshipKey: key,
        relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
        proposalPayload: {
          kind: 'relationship_label_change',
          relationshipKey: key,
          fromType: 'hostile',
          toType: 'cold_war',
          reason: `${name} sued for peace; the sponsored hostility winds down.`,
        },
      },
    });
  }

  if (move === 'deploy') {
    // The deploy DECISION; the war layer owns the actual front mint when its
    // own gate passes. We emit a guaranteed army_deployed-flavored marker so the
    // posture is visible AND it wins the exclusive group over the reactive raid.
    const target = ctx.hostileTargets.find((/** @type {any} */ t) => strengthFor(sId) > strengthFor(t)) || ctx.hostileTargets[0];
    return strategyCandidate({
      move,
      sId,
      tick,
      severity: MOVE_SEVERITY,
      headline: `${name} resolves to march`,
      summary: `${name} commits to an offensive posture against ${target ? (snapshot?.byId?.get?.(String(target))?.name || target) : 'its rival'}.`,
      reasons: [`${name}'s strategy chooser selected an offensive deployment.`],
      condition: {
        archetype: 'army_deployed',
        severity: clamp01(MOVE_SEVERITY * 0.6),
        triggeredAt: { tick, sourceEventType: 'SETTLEMENT_STRATEGY', sourceEventTargetId: String(sId) },
        causes: [{ source: String(sId), effect: 'army_deployed', reason: `${name} mustered its army for an offensive.` }],
      },
    });
  }

  // defend / hold — a benign, guaranteed posture marker. It carries the
  // strategy:<S> exclusive tag so the reactive escalation for S is suppressed (the
  // settlement chose NOT to escalate this tick), but applies a low-severity
  // army_deployed=0 marker condition (no economic/defense hit) so it is inert.
  return strategyCandidate({
    move,
    sId,
    tick,
    severity: MOVE_SEVERITY,
    headline: move === 'defend' ? `${name} stands to its walls` : `${name} holds its posture`,
    summary: move === 'defend'
      ? `${name} marshals to defend rather than escalate this tick.`
      : `${name} holds the status quo rather than open a new front.`,
    reasons: [`${name}'s strategy chooser selected ${move}.`],
  });
}

/**
 * Evaluate the settlement strategy layer for one tick.
 *
 * @param {any} snapshot       the SINGLE pre-tick world snapshot.
 * @param {any} pressureIdx    the derived pressure index (settlementStrength input).
 * @param {Object} context
 * @param {number} [context.tick]
 * @param {{ settlementStrategyEnabled?: boolean }} [context.simulationRules]
 * @param {{ random: () => number, fork: (label:string) => any }} [context.rng]
 * @returns {any[]} at most ONE probability-1 candidate per settlement.
 */
export function evaluateSettlementStrategyRules(snapshot, pressureIdx, context = {}) {
  const rules = context.simulationRules || {};
  // ── Gate: byte-identical no-op (no candidate, no rng draw) when OFF. ──────────
  if (!rules.settlementStrategyEnabled) return [];

  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const graph = snapshot?.regionalGraph || {};
  const worldState = snapshot?.worldState || {};
  const deployments = worldState.deployments || {};
  const rng = context.rng;
  const strengthFor = buildStrengthLookup(snapshot, pressureIdx);

  const out = [];

  // ONE pass per settlement, codepoint-sorted (NOT per edge — avoids N-edge
  // double-fire + per-settlement budget starvation).
  const settlementIds = (snapshot?.settlements || [])
    .map((/** @type {any} */ item) => String(item.id))
    .sort(codepoint);

  for (const sId of settlementIds) {
    const item = snapshot?.byId?.get?.(sId);
    if (!item) continue;
    const ctx = contextFor(snapshot, graph, sId);
    const deployment = deployments[sId];
    const hasArmyAbroad = !!deployment?.targetId;

    // ── HARD-OVERRIDE: return-home. If S has its army committed ABROAD while its
    // home (or a vassal obligation) is compromised — besieged/occupied — it RECALLS
    // the army, deterministically (probability 1, BYPASSING the softmax). An
    // emergency recall cannot be out-competed by a high deploy weight. The
    // strategy:<S> exclusive tag SUPPRESSES the reactive escalation for S (no
    // double-fire). ──────────────────────────────────────────────────────────────
    if (hasArmyAbroad && (ctx.homeBesieged || ctx.vassalBesieged)) {
      const name = item?.name || item?.settlement?.name || sId;
      out.push(strategyCandidate({
        move: 'return_home',
        sId,
        tick,
        severity: OVERRIDE_SEVERITY,
        headline: `${name} recalls its army`,
        summary: ctx.homeBesieged
          ? `${name} is itself besieged — its army abroad is recalled to defend the home walls.`
          : `A vassal of ${name} is under siege — ${name} recalls its army to relieve it.`,
        reasons: [
          ctx.homeBesieged
            ? `${name} is besieged at home while its army is committed against ${deployment.targetId}.`
            : `${name} has an army abroad while a vassal is besieged — an emergency recall.`,
          'Hard override: deterministic, bypasses the softmax sample (probability 1).',
        ],
      }));
      continue; // exactly one candidate for S; skip the sample.
    }

    // ── Else: enumerate → score → softmax → sample ONE move. ─────────────────────
    const aggressiveness = computeAggressiveness(item, worldState);
    const exhaustion = economicExhaustion(item);
    const moves = enumerateMoves({ sId, ctx, aggressiveness, strengthFor, exhaustion });
    if (!moves.length) continue;

    const weights = softmaxWeights(moves.map((m) => m.score), STRATEGY_K);
    // Sample ONCE on a stable per-settlement fork. A missing rng/fork (test stubs)
    // falls back to the canonical top (index 0) — deterministic either way.
    let idx = 0;
    if (rng && typeof rng.fork === 'function') {
      idx = stableSampleByWeight(weights, rng.fork(`strategy:${stablePart(sId)}:${tick}`));
    } else if (weights.length) {
      // No rng: pick the argmax (canonical), tie-broken by the codepoint move key.
      let best = -Infinity;
      for (let i = 0; i < weights.length; i += 1) {
        if (weights[i] > best) { best = weights[i]; idx = i; }
      }
    }
    if (idx < 0 || idx >= moves.length) idx = 0;
    const chosen = moves[idx].move;

    const candidate = emitMove({ move: chosen, sId, item, ctx, tick, exhaustion, snapshot, strengthFor });
    if (candidate) out.push(candidate);
  }

  return out;
}

export const STRATEGY_TUNING = Object.freeze({ STRATEGY_K, MOVE_SEVERITY, OVERRIDE_SEVERITY });
// `hash01` is imported for parity with the contest fork recipe; re-exported so
// tests can assert the fork-key discipline without reaching into contestMath.
export { hash01 };
