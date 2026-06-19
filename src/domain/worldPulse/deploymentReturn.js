/**
 * domain/worldPulse/deploymentReturn.js — contextual return outcomes (Feature A).
 *
 * A clone of the coup-verdict idiom (coup.js): when a deployment CLEARS (its siege
 * resolved this tick) the army marches home, and the outcome is CONTEXTUAL to the
 * home's predicament — "the troops come home to trouble":
 *
 *   home OCCUPIED   → `occupation_lifted` (the returning army breaks the occupation)
 *   home UNDER SIEGE → `siege_lifted`     (the returning army relieves the siege)
 *   home is a VASSAL → a coup verdict by legitimacy (resolveCoupVerdict) — low
 *                       ruling_authority ⇒ the seat may fall, else the order holds
 *   else            → a GENERIC clear, no residual (the army simply stands down)
 *
 * The generic clear emits NOTHING (mirrors isCoupResidualOutcome / the no-echo
 * carve-out, §5): a stood-down army must not pollute the chronicle with "the
 * deployment passes into history."
 *
 * Deterministic: rng forked on `'deployment-return'` then per-record on the home id;
 * codepoint-sorted iteration; reads only the (post-tick) graph + pre-tick snapshot.
 */

import { resolveCoupVerdict } from '../rulingPower.js';
import {
  relationshipKeyFromEdge,
  normalizeRelationshipEdge,
  ensureRelationshipState,
  relationshipRoles,
} from './relationshipEvolution.js';
import { stablePart } from './worldState.js';

/** @param {string} a @param {string} b */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** @param {number} min @param {number} max @param {number} value */
function clamp(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Is `homeId` itself besieged — a CONFIRMED war_front pointing at it?
 * @param {any} graph
 * @param {string} homeId
 */
function isBesieged(graph, homeId) {
  for (const channel of graph?.channels || []) {
    if (channel.type !== 'war_front') continue;
    if (channel.status !== 'confirmed') continue;
    if (String(channel.to) === String(homeId)) return true;
  }
  return false;
}

/**
 * Does `homeId` carry an active war_pressure condition (an occupation / assault aftermath)?
 * @param {any} item
 */
function isOccupied(item) {
  const conditions = item?.activeConditions || [];
  return conditions.some(/** @param {any} cond */ cond => cond?.archetype === 'war_pressure' && (cond.status !== 'easing'));
}

/**
 * Is `homeId` a vassal (the JUNIOR side of a resolved vassal edge)?
 * @param {any} snapshot
 * @param {string} homeId
 */
function isVassal(snapshot, homeId) {
  const states = snapshot?.worldState?.relationshipStates || {};
  for (const rawEdge of snapshot?.regionalGraph?.edges || snapshot?.relationships || []) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (relState.relationshipType !== 'vassal') continue;
    const roles = relationshipRoles(edge, relState);
    if (String(roles.juniorId) === String(homeId)) return true;
  }
  return false;
}

/**
 * Build the contextual return outcomes for armies that came home this tick.
 *
 * @param {Object} args
 * @param {Array<{attackerId:string, deployment:any, targetId:string, outcome:string}>} args.resolvedDeployments
 * @param {any} args.snapshot   the pre-tick world snapshot (byId carries settlement + causal)
 * @param {any} args.graph      the regional graph AFTER this tick's mints (so "besieged" is current)
 * @param {{ random: () => number, fork: (label:string) => any }} args.rng
 * @param {number} [args.tick]
 * @returns {any[]} probability-1 condition / power_transfer outcomes for applyWorldPulseOutcomes
 */
export function deploymentReturnOutcomes({ resolvedDeployments = [], snapshot, graph, rng, tick = 0 }) {
  const outcomes = [];
  const baseRng = rng.fork('deployment-return');
  // Codepoint-sort by home id so iteration order never leaks into output.
  const sorted = [...resolvedDeployments].sort((a, b) => codepoint(String(a.attackerId), String(b.attackerId)));

  for (const record of sorted) {
    const homeId = String(record.attackerId);
    const item = snapshot?.byId?.get?.(homeId);
    if (!item?.settlement) continue;
    const homeName = item.name || item.settlement?.name || homeId;
    const sourceId = `deployment.${stablePart(homeId)}.${stablePart(record.targetId)}`;

    if (isOccupied(item)) {
      // The returning army breaks the foreign occupation → an easing recovery.
      outcomes.push({
        id: `world_outcome.occupation_lifted.${stablePart(homeId)}.${tick}`,
        type: 'condition',
        candidateType: 'occupation_lifted',
        ruleId: 'deployment_return_occupation_lifted',
        ruleFamily: 'stressor',
        applyMode: 'auto',
        probability: 1,
        targetSaveId: homeId,
        severity: 0.3,
        headline: `${homeName} throws off its occupiers`,
        summary: `${homeName}'s army returned to a captured home and broke the occupation; the settlement begins restoring its own authority.`,
        reasons: ['A deployed army returned to an occupied home.'],
        condition: {
          archetype: 'occupation_lifted',
          severity: 0.3,
          triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
          causes: [{ source: homeId, effect: 'occupation_lifted', reason: `${homeName}'s returning army broke the occupation.` }],
        },
      });
      continue;
    }

    if (isBesieged(graph, homeId)) {
      // The returning army relieves the home siege → an easing recovery.
      outcomes.push({
        id: `world_outcome.siege_lifted.${stablePart(homeId)}.${tick}`,
        type: 'condition',
        candidateType: 'siege_lifted',
        ruleId: 'deployment_return_siege_lifted',
        ruleFamily: 'stressor',
        applyMode: 'auto',
        probability: 1,
        targetSaveId: homeId,
        severity: 0.3,
        headline: `${homeName} lifts the siege at its gates`,
        summary: `${homeName}'s army returned to a besieged home and relieved it; the settlement begins to recover.`,
        reasons: ['A deployed army returned to a besieged home.'],
        condition: {
          archetype: 'siege_lifted',
          severity: 0.3,
          triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
          causes: [{ source: homeId, effect: 'siege_lifted', reason: `${homeName}'s returning army relieved the siege.` }],
        },
      });
      continue;
    }

    if (isVassal(snapshot, homeId)) {
      // A vassal whose army comes home is a coup risk: legitimacy decides whether
      // the returning host topples the seat or merely reinforces the order.
      const verdict = resolveCoupVerdict({
        settlement: item.settlement,
        rng: baseRng.fork(homeId),
        severity: 0.6,
        rulingAuthorityScore: item.causal?.scores?.ruling_authority ?? null,
      });
      if (verdict.holds || !verdict.winner) continue; // order held — generic clear (no residual)
      const winner = /** @type {{ name: string, archetype: string }} */ (verdict.winner);
      const incumbentName = /** @type {any} */ (verdict.incumbent)?.name || 'the ruling power';
      const losers = (verdict.challengers || [])
        .filter(/** @param {any} c */ c => c.name !== winner.name)
        .map(/** @param {any} c */ c => c.name);
      outcomes.push({
        id: `world_outcome.return_coup.${stablePart(homeId)}.${tick}`,
        type: 'power_transfer',
        candidateType: 'coup_succeeded',
        ruleId: 'deployment_return_coup',
        ruleFamily: 'stressor',
        applyMode: 'auto',
        probability: 1,
        targetSaveId: homeId,
        severity: clamp(0.45, 1, 0.6),
        headline: `${winner.name} seizes power in ${homeName}`,
        summary: `${homeName}'s army marched home and the ${String(incumbentName).toLowerCase()} could not hold it. ${winner.name} now commands the government.`,
        reasons: [verdict.reason, `Hold chance ${verdict.pHold}, roll ${verdict.roll}.`],
        powerTransfer: {
          toPowerName: winner.name,
          cause: 'coup',
          tick,
          losers,
          sourceStressorId: sourceId,
        },
        condition: {
          archetype: 'government_overthrown',
          severity: clamp(0.45, 0.8, 0.6),
          triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
          causes: [{
            source: homeId,
            effect: 'government_overthrown',
            reason: `${winner.name} overthrew ${incumbentName} when the army returned.`,
          }],
        },
      });
      continue;
    }

    // Generic clear: the army stands down, no residual, no echo (§5 carve-out).
  }

  return outcomes;
}
