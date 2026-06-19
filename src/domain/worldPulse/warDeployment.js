/**
 * domain/worldPulse/warDeployment.js — Feature A core (war & deployment).
 *
 * A settlement fields EXACTLY ONE army (`worldState.deployments[saveId]`). It may
 * deploy that army to besiege a target it is hostile toward IF it is confident in
 * its military. Multiple besiegers converging on one target form a COALITION siege
 * (one big siege, many `war_front` channels). Sustaining a siege drains the home
 * economy (the `war_drain` condition → `economic_capacity`, the homeostasis SOURCE)
 * and thins the home garrison (`army_deployed` → `defense_readiness`). A besieged
 * target can FALL — a conquest power-transfer (cause:'conquest'). When a siege
 * resolves the besiegers' armies return home → contextual outcomes (deploymentReturn).
 *
 * DETERMINISM CONTRACT (sacred):
 *   - No Date.now / Math.random / argless new Date. The pulse threads `now` and an
 *     injected `rng`; every roll forks on a STABLE key (`rng.fork('siege:'+T+':'+tick)`,
 *     `rng.fork('deploy:'+S+':'+tick)`), never a list-order stream.
 *   - Every iteration that feeds output is over a CODEPOINT-SORTED key list — never a
 *     Map/Set/Object insertion order.
 *   - All cross-settlement reads come from the SINGLE pre-tick snapshot. `war_drain`
 *     severity is derived from the PRE-TICK channel count (NOT this-tick's fresh mints)
 *     to avoid intra-tick read-after-write — a fresh deploy raises drain only NEXT tick.
 *
 * GATED + byte-identical when OFF: when `rules.warLayerEnabled` is false this is a
 * pure no-op returning the world's existing deployments untouched.
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
import { mintDirectedChannel } from '../region/graph.js';
import { logistic, clamp01 } from '../region/contestMath.js';
import { stablePart } from './worldState.js';

// ── Tunables (calibration is load-bearing — see GEOPOLITICAL_WAR_LAYER §2.4/§6) ──
// HOSTILE_CONFIDENCE gates whether a settlement is strong enough to open a war at
// all. CONQUEST_MARGIN keeps a deploy from firing on a coin-flip strength edge.
// SIEGE_K is the log-odds slope of the siege verdict; SIEGE_HOLD_BIAS makes a
// defender's home ground worth something, so an evenly-matched siege HOLDS (the
// drain keeps accruing) rather than instantly toppling — wars take time.
const HOSTILE_CONFIDENCE = 0.42;
const CONQUEST_MARGIN = 0.12;
const SIEGE_K = 6;
const SIEGE_HOLD_BIAS = 0.55;
const WAR_DRAIN_PER_FRONT = 0.34; // severity per active war_front from the home (capped 1)
const ARMY_DEPLOYED_SEVERITY = 0.5;

// ── Z2a war-exhaustion SCAR tunables (the homeostasis closer) ────────────────────
// The scar is a worldState ledger (warExhaustion[homeId] → 0..1) ratcheted up while a
// deployment is sustained and decayed only SLOWLY when the war ends — so a long war
// leaves a lasting economic wound that keeps pushing the realm toward suing for peace,
// UNLIKE a relationship (which mean-reverts ~12%/tick). The scar is surfaced as a
// war_exhaustion condition (economic_capacity sink + a direct settlementStrength
// penalty), which is what flips a stubborn aggressor's confidence below the gate.
const EXHAUSTION_ACCRUE_PER_TICK = 0.16; // ratchet up per tick of sustained deployment
const EXHAUSTION_DECAY_PER_TICK = 0.03;  // decay when the army is HOME — ~5× slower (non-reverting)
// Above one tick of accrual (0.16) on purpose: the scar is about SUSTAINED war, so a
// single deploy tick stamps only war_drain/army_deployed; the war_exhaustion condition
// first registers on the SECOND tick of an unbroken campaign and deepens from there.
const EXHAUSTION_CONDITION_FLOOR = 0.20;

const HOSTILE_TYPES = new Set(['hostile', 'cold_war', 'rival']);

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Active CONFIRMED war_front channels FROM a settlement, read from a graph snapshot.
 * Codepoint-sorted by `to` for deterministic iteration.
 * @param {any} graph
 * @param {any} fromId
 * @returns {string[]}
 */
function warFrontsFrom(graph, fromId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (channel.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (String(channel.from) !== String(fromId)) continue;
    out.push(String(channel.to));
  }
  return out.sort(codepoint);
}

/**
 * Active CONFIRMED war_front channels INTO a settlement (besiegers), codepoint-sorted.
 * @param {any} graph
 * @param {any} toId
 * @returns {string[]}
 */
function warFrontsInto(graph, toId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (channel.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (String(channel.to) !== String(toId)) continue;
    out.push(String(channel.from));
  }
  return out.sort(codepoint);
}

/**
 * Build a per-settlement strength lookup from the SINGLE pre-tick snapshot. The
 * pressure vector is the SAME one the relationship contests read (buildPressureSummary
 * over the derived pressure index), so a deploy-confidence gate and the subjugation
 * gate can never diverge. Returns `(id) => number` 0..1, defaulting to 0 for unknown.
 * @param {any} snapshot
 * @returns {(id: any) => number}
 */
function buildStrengthLookup(snapshot) {
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
 * A settlement is "besieged/occupied" if any CONFIRMED war_front points AT it. A
 * besieged settlement cannot itself open a new siege (its army defends home).
 * @param {any} graph
 * @param {any} id
 * @returns {boolean}
 */
function isBesieged(graph, id) {
  return warFrontsInto(graph, id).length > 0;
}

/**
 * Hostile targets of a settlement, read from the pre-tick relationshipStates +
 * edges. Returns codepoint-sorted target ids the settlement could besiege.
 * @param {any} snapshot
 * @param {any} fromId
 * @returns {string[]}
 */
function hostileTargetsOf(snapshot, fromId) {
  const states = snapshot?.worldState?.relationshipStates || {};
  const out = new Set();
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    // The hostile axis is symmetric/adversarial only (hostile/cold_war/rival); a
    // vassal/patron hierarchy edge is never a besiege candidate.
    if (!HOSTILE_TYPES.has(relState.relationshipType)) continue;
    const { from, to } = getRelationshipSettlements(edge);
    const a = String(from);
    const b = String(to);
    if (a === String(fromId) && snapshot?.byId?.has?.(b)) out.add(b);
    else if (b === String(fromId) && snapshot?.byId?.has?.(a)) out.add(a);
  }
  return [...out].sort(codepoint);
}

/**
 * A condition outcome (the coup-verdict shape, §A1). Flows through
 * applyWorldPulseOutcomes UNCHANGED — it already applies `condition` via
 * withActiveCondition.
 * @param {{ id: any, archetype: any, targetSaveId: any, severity: any, headline: any, summary: any, reasons: any, tick: any, sourceEventTargetId: any, causes: any }} args
 */
function conditionOutcome({ id, archetype, targetSaveId, severity, headline, summary, reasons, tick, sourceEventTargetId, causes }) {
  return {
    id,
    type: 'condition',
    candidateType: archetype,
    ruleId: `war_layer_${archetype}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId,
    severity,
    headline,
    summary,
    reasons,
    condition: {
      archetype,
      severity,
      triggeredAt: { tick, sourceEventType: 'WAR_LAYER', sourceEventTargetId },
      causes,
    },
  };
}

/**
 * The siege verdict for a single target: does the besieging coalition break the
 * defender this tick? Log-odds (logistic of a strength delta minus the home-ground
 * hold bias) — NEVER a raw product. Deterministic: forked on `siege:<T>:<tick>`.
 * @param {{ targetId: any, besiegers: any[], strengthFor: (id: any) => number, rng: any, tick: any }} args
 */
function resolveSiegeVerdict({ targetId, besiegers, strengthFor, rng, tick }) {
  // Coalition strength sums member strengths (codepoint-sorted membership), so the
  // aggregate is order-independent. Defender strength is the target's own.
  let coalitionStrength = 0;
  for (const id of besiegers) coalitionStrength += strengthFor(id);
  const defenderStrength = strengthFor(targetId);
  const logOdds = SIEGE_K * (coalitionStrength - defenderStrength) - SIEGE_HOLD_BIAS;
  const pFall = clamp01(logistic(logOdds));
  const roll = rng.fork(`siege:${stablePart(targetId)}:${tick}`).random();
  return { falls: roll < pFall, pFall, roll, coalitionStrength, defenderStrength };
}

/**
 * Pick the conquering settlement: the strongest besieger, codepoint tie-break.
 * @param {any[]} besiegers
 * @param {(id: any) => number} strengthFor
 */
function pickOccupier(besiegers, strengthFor) {
  let best = null;
  let bestStrength = -Infinity;
  for (const id of besiegers) {
    const s = strengthFor(id);
    if (s > bestStrength || (s === bestStrength && (best == null || id < best))) {
      best = id;
      bestStrength = s;
    }
  }
  return best;
}

/**
 * Evaluate the war layer for one tick.
 *
 * @param {Object} args
 * @param {any} args.snapshot       the SINGLE pre-tick world snapshot (byId carries
 *                                  settlement + causal + save; regionalGraph is pre-tick)
 * @param {any} args.worldState
 * @param {{ random: () => number, fork: (label:string) => any }} args.rng
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @param {{ warLayerEnabled?: boolean }} args.rules
 * @returns {{ outcomes: any[], deployments: Record<string, any>, graphChannels: any[], resolvedDeployments: any[], dispositionDeltas: Array<{id:string, outcome:'win'|'loss', magnitude?:number}>, warExhaustion: Record<string, number> }}
 *   - outcomes: probability-1 condition / power_transfer outcomes for applyWorldPulseOutcomes
 *   - deployments: the UPDATED one-army ledger to persist onto worldState
 *   - graphChannels: war_front directed channels to upsert into the regional graph
 *   - resolvedDeployments: armies that returned home this tick (for deploymentReturn)
 *   - dispositionDeltas: id-stable win/loss attributions from sieges resolved this tick (Feature C)
 *   - warExhaustion: the UPDATED non-reverting war-exhaustion scar ledger (Z2a) to persist
 */
export function evaluateWarLayer({ snapshot, worldState, rng, tick = 0, now = null, rules = {} }) {
  const existing = worldState?.deployments || {};
  // ── Gate: byte-identical no-op when the war layer is OFF. ────────────────────
  if (!rules?.warLayerEnabled) {
    return { outcomes: [], deployments: existing, graphChannels: [], resolvedDeployments: [], dispositionDeltas: [], warExhaustion: worldState?.warExhaustion || {} };
  }

  const graph = snapshot?.regionalGraph || {};
  const strengthFor = buildStrengthLookup(snapshot);
  const outcomes = [];
  const graphChannels = [];
  const resolvedDeployments = [];
  // Feature C (C1) write-side: id-stable win/loss attributions from the contests
  // resolved THIS tick. The occupier/conquered ids are already state-decided
  // (occupier = strongest besieger, codepoint tie-break; conquered = the target),
  // so a reversed-authored save credits the SAME winner. Folded into the next-tick
  // dispositionStats ledger post-apply by the caller. Empty when nothing resolves.
  /** @type {Array<{id:string, outcome:'win'|'loss', magnitude?:number}>} */
  const dispositionDeltas = [];
  // Copy the ledger; never mutate worldState's record in place.
  const deployments = { ...existing };
  // Z2a — copy the NON-REVERTING war-exhaustion scar ledger (read-last/write-next).
  /** @type {Record<string, number>} */
  const warExhaustion = { ...(worldState?.warExhaustion || {}) };

  const settlementNameFor = (/** @type {any} */ id) => {
    const item = snapshot?.byId?.get?.(String(id));
    return item?.name || item?.settlement?.name || String(id);
  };

  // ── Step 3: resolve sieges. Iterate every target that has at least one besieger
  // (the union of war_front recipients and deployment targets), codepoint-sorted. ─
  const targetSet = new Set();
  for (const channel of graph?.channels || []) {
    if (channel.type === 'war_front' && channel.status === 'confirmed') {
      targetSet.add(String(channel.to));
    }
  }
  for (const attackerId of Object.keys(deployments)) {
    const dep = deployments[attackerId];
    if (dep?.targetId) targetSet.add(String(dep.targetId));
  }
  const targets = [...targetSet].sort(codepoint);

  // Collect the attacker ids whose deployment cleared this tick (their armies return).
  const clearedAttackers = new Set();

  for (const targetId of targets) {
    if (!snapshot?.byId?.has?.(targetId)) continue;
    // Besiegers = war_front sources INTO T ∪ deployment.targetId === T (dedup, sorted).
    const besiegerSet = new Set(warFrontsInto(graph, targetId));
    for (const attackerId of Object.keys(deployments)) {
      if (String(deployments[attackerId]?.targetId) === targetId) besiegerSet.add(String(attackerId));
    }
    const besiegers = [...besiegerSet].filter(id => snapshot?.byId?.has?.(id)).sort(codepoint);
    if (!besiegers.length) continue;

    const verdict = resolveSiegeVerdict({ targetId, besiegers, strengthFor, rng, tick });
    if (!verdict.falls) continue; // siege holds — drain keeps accruing (step 5).

    // ── CONQUEST: the strongest besieger (codepoint tie-break) occupies T. ──────
    const occupierId = pickOccupier(besiegers, strengthFor);
    const occupierName = settlementNameFor(occupierId);
    const targetName = settlementNameFor(targetId);
    const losers = besiegers.filter(id => id !== occupierId).map(id => settlementNameFor(id));

    outcomes.push({
      id: `world_outcome.conquest.${stablePart(targetId)}.${tick}`,
      type: 'power_transfer',
      candidateType: 'conquest',
      ruleId: 'war_layer_conquest',
      ruleFamily: 'stressor',
      applyMode: 'auto',
      probability: 1,
      targetSaveId: targetId,
      severity: clamp01(0.6 + verdict.coalitionStrength * 0.2),
      headline: `${occupierName} storms ${targetName}`,
      summary: `The siege of ${targetName} broke. ${occupierName}'s army holds the walls; an occupation authority now rules in the conqueror's name.`,
      reasons: [
        `Coalition strength ${verdict.coalitionStrength.toFixed(2)} vs defender ${verdict.defenderStrength.toFixed(2)}.`,
        `Fall chance ${verdict.pFall.toFixed(2)}, roll ${verdict.roll.toFixed(2)}.`,
      ],
      powerTransfer: {
        toPowerName: `${occupierName} occupation authority`,
        cause: 'conquest',
        tick,
        losers,
        sourceStressorId: `war_front.${stablePart(occupierId)}.${stablePart(targetId)}`,
      },
      condition: {
        archetype: 'war_pressure',
        severity: clamp01(0.55 + verdict.coalitionStrength * 0.2),
        triggeredAt: { tick, sourceEventType: 'WAR_LAYER_CONQUEST', sourceEventTargetId: targetId },
        causes: [{
          source: occupierId,
          effect: 'war_pressure',
          reason: `${occupierName} conquered ${targetName}.`,
        }],
      },
    });

    // C1 ratchet: the conqueror banked a war WIN; the conquered settlement a LOSS.
    dispositionDeltas.push({ id: String(occupierId), outcome: 'win', magnitude: 1 });
    dispositionDeltas.push({ id: String(targetId), outcome: 'loss', magnitude: 1 });

    // ALL besiegers' armies return home — the siege is over (won). Clear their
    // deployments; deploymentReturn turns each return into a contextual outcome.
    for (const attackerId of besiegers) {
      if (deployments[attackerId]) {
        resolvedDeployments.push({ attackerId, deployment: deployments[attackerId], targetId, outcome: 'conquest' });
        delete deployments[attackerId];
        clearedAttackers.add(attackerId);
      }
    }
  }

  // ── Step 4: new deployments. Iterate every candidate settlement codepoint-sorted. ─
  const candidateIds = (snapshot?.settlements || [])
    .map((/** @type {any} */ item) => String(item.id))
    .sort(codepoint);

  for (const fromId of candidateIds) {
    if (deployments[fromId]) continue;                 // one-army constraint
    if (clearedAttackers.has(fromId)) continue;        // army just returned this tick
    if (isBesieged(graph, fromId)) continue;           // can't march while besieged/occupied
    const fromStrength = strengthFor(fromId);
    if (fromStrength < HOSTILE_CONFIDENCE) continue;   // not confident enough to wage war

    // Pick the weakest hostile target this settlement clearly out-muscles
    // (codepoint-sorted hostiles; the first qualifying target wins — deterministic).
    let chosenTarget = null;
    for (const targetId of hostileTargetsOf(snapshot, fromId)) {
      if (isBesieged(graph, targetId)
          && warFrontsInto(graph, targetId).includes(fromId)) {
        // already besieging it (shouldn't happen without a deployment, but guard)
        continue;
      }
      if (fromStrength > strengthFor(targetId) + CONQUEST_MARGIN) {
        chosenTarget = targetId;
        break;
      }
    }
    if (!chosenTarget) continue;

    deployments[fromId] = { targetId: chosenTarget, sinceTick: tick, role: 'siege' };
    graphChannels.push(mintDirectedChannel({
      type: 'war_front',
      from: fromId,
      to: chosenTarget,
      strength: clamp01(0.5 + fromStrength * 0.3),
      confidence: 0.8,
      explanation: `${settlementNameFor(fromId)} marches on ${settlementNameFor(chosenTarget)}.`,
      relationshipKey: `war_front.${stablePart(fromId)}.${stablePart(chosenTarget)}`,
      source: 'war_layer_deploy',
      now,
    }));
  }

  // ── Step 5: re-upsert the home conditions each tick for every active deployer.
  // war_drain severity ∝ the count of active war_fronts FROM S in the PRE-TICK graph
  // (NOT this-tick's fresh mints) — avoids intra-tick read-after-write, so a fresh
  // deploy raises the drain only NEXT tick. army_deployed is a flat garrison debuff. ─
  const activeDeployers = new Set(Object.keys(deployments).map(String));
  for (const fromId of Object.keys(deployments).sort(codepoint)) {
    const preTickFrontCount = warFrontsFrom(graph, fromId).length;
    // A just-deployed settlement has 0 pre-tick fronts → minimum-severity drain this
    // tick (the army IS away), scaling up next tick once the mint lands in the graph.
    const frontCount = Math.max(preTickFrontCount, 1);
    const drainSeverity = clamp01(frontCount * WAR_DRAIN_PER_FRONT);
    const name = settlementNameFor(fromId);
    const targetName = settlementNameFor(deployments[fromId].targetId);

    // Z2a — RATCHET the non-reverting exhaustion scar UP for every sustained
    // deployment (read-last/write-next: read the pre-tick ledger value, accrue, write
    // the next-tick value). Capped at 1. The condition emitted below carries the
    // ratcheted value, so it lands on the home and bites settlementStrength NEXT tick.
    const prevScar = clamp01(warExhaustion[fromId] || 0);
    const nextScar = clamp01(prevScar + EXHAUSTION_ACCRUE_PER_TICK);
    warExhaustion[fromId] = nextScar;

    outcomes.push(conditionOutcome({
      id: `world_outcome.war_drain.${stablePart(fromId)}.${tick}`,
      archetype: 'war_drain',
      targetSaveId: fromId,
      severity: drainSeverity,
      headline: `${name}'s war chest bleeds`,
      summary: `Sustaining the campaign against ${targetName} drains the home economy.`,
      reasons: [`${frontCount} active war front${frontCount === 1 ? '' : 's'} from ${name}.`],
      tick,
      sourceEventTargetId: deployments[fromId].targetId,
      causes: [{ source: fromId, effect: 'war_drain', reason: `${name} is besieging ${targetName}.` }],
    }));

    outcomes.push(conditionOutcome({
      id: `world_outcome.army_deployed.${stablePart(fromId)}.${tick}`,
      archetype: 'army_deployed',
      targetSaveId: fromId,
      severity: ARMY_DEPLOYED_SEVERITY,
      headline: `${name}'s garrison marches abroad`,
      summary: `${name}'s standing army is committed against ${targetName}, thinning the home garrison.`,
      reasons: [`Army deployed to besiege ${targetName}.`],
      tick,
      sourceEventTargetId: deployments[fromId].targetId,
      causes: [{ source: fromId, effect: 'army_deployed', reason: `${name}'s army is away besieging ${targetName}.` }],
    }));

    // Z2a — surface the scar as a war_exhaustion condition once it clears the floor.
    // This is THE homeostasis closer: it feeds economic_capacity (the sink) AND a
    // direct settlementStrength penalty, so a protracted siege eventually drops the
    // aggressor's confidence below HOSTILE_CONFIDENCE/CONQUEST_MARGIN — the realm can
    // no longer sustain or escalate the war and the loop converges toward peace.
    if (nextScar >= EXHAUSTION_CONDITION_FLOOR) {
      outcomes.push(conditionOutcome({
        id: `world_outcome.war_exhaustion.${stablePart(fromId)}.${tick}`,
        archetype: 'war_exhaustion',
        targetSaveId: fromId,
        severity: nextScar,
        headline: `${name} grows war-weary`,
        summary: `The long campaign against ${targetName} has left ${name} a lasting wound — the treasury thins and the public tires of war.`,
        reasons: [`Sustained war-exhaustion scar at ${nextScar.toFixed(2)} (non-reverting).`],
        tick,
        sourceEventTargetId: deployments[fromId].targetId,
        causes: [{ source: fromId, effect: 'war_exhaustion', reason: `${name} has campaigned too long against ${targetName}.` }],
      }));
    }
  }

  // ── Step 5b: DECAY the scar for homes whose army is no longer deployed. The decay
  // is ~5× slower than the accrual (EXHAUSTION_DECAY_PER_TICK ≪ ACCRUE), so a long
  // war leaves a wound that lingers for many ticks after the peace — non-reverting by
  // construction, the opposite of a mean-reverting relationship. Codepoint-sorted;
  // entries that reach 0 are dropped so the ledger never accumulates dead keys. A
  // still-significant scar keeps stamping its war_exhaustion condition (the realm is
  // recovering but not yet whole — peace holds because the wound persists).
  for (const homeId of Object.keys(warExhaustion).sort(codepoint)) {
    if (activeDeployers.has(homeId)) continue;
    const decayed = clamp01((warExhaustion[homeId] || 0) - EXHAUSTION_DECAY_PER_TICK);
    if (decayed <= 0) {
      delete warExhaustion[homeId];
      continue;
    }
    warExhaustion[homeId] = decayed;
    if (decayed >= EXHAUSTION_CONDITION_FLOOR && snapshot?.byId?.has?.(homeId)) {
      const name = settlementNameFor(homeId);
      outcomes.push(conditionOutcome({
        id: `world_outcome.war_exhaustion.${stablePart(homeId)}.${tick}`,
        archetype: 'war_exhaustion',
        targetSaveId: homeId,
        severity: decayed,
        headline: `${name} nurses its war wounds`,
        summary: `${name}'s army is home, but the cost of the war it waged still weighs on the economy and the public.`,
        reasons: [`War-exhaustion scar slowly fading at ${decayed.toFixed(2)}.`],
        tick,
        sourceEventTargetId: homeId,
        causes: [{ source: homeId, effect: 'war_exhaustion', reason: `${name} is recovering from a costly war.` }],
      }));
    }
  }

  return { outcomes, deployments, graphChannels, resolvedDeployments, dispositionDeltas, warExhaustion };
}
