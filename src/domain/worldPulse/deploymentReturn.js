/**
 * domain/worldPulse/deploymentReturn.js — contextual return outcomes (Feature A + B2).
 *
 * A clone of the coup-verdict idiom (coup.js): when a deployment CLEARS (its siege
 * resolved this tick) the army marches home, and the outcome is CONTEXTUAL to the
 * home's predicament — "the troops come home to trouble":
 *
 *   home OCCUPIED   → `occupation_lifted` (a STRONG army breaks the occupation) vs a
 *                       failed rebellion (a DEPLETED one cannot)
 *   home UNDER SIEGE → `siege_lifted`     (a STRONG army relieves it) vs a failed
 *                       relief (a DEPLETED one is brushed aside)
 *   home is a VASSAL → a coup (a STRONG army topples the seat) vs a disbanded host
 *                       (a DEPLETED one cannot, and may splinter)
 *   else            → a GENERIC clear; a BADLY-DAMAGED army that returns to an
 *                       untroubled home still SPLINTERS (deserters / rebels / a
 *                       loyalist remnant) — a low-strength return is destabilizing.
 *
 * STRENGTH-SCALED RESOLUTION. The army now carries a `currentEffectiveStrength`
 * (relative to its `maxStartStrength` and to the home situation). The branch is still
 * contextual, but its RESOLUTION is strength-scaled: a deterministic threshold on the
 * army's remaining-strength ratio + a plausibility-banded roll (NOT a coin flip). A
 * strong returning army succeeds; a depleted one fails, negotiates from weakness, or
 * splinters. The returning strength feeds siege-relief / occupation-rebellion /
 * vassal-rebellion / coup / faction-confidence / ruler-legitimacy / war-exhaustion /
 * postwar-instability.
 *
 * The generic clear of a HEALTHY army emits NOTHING (mirrors isCoupResidualOutcome /
 * the no-echo carve-out, §5): a stood-down intact army must not pollute the chronicle.
 *
 * Deterministic: rng forked on `'deployment-return'` then per-record on the home id;
 * codepoint-sorted iteration; reads only the (post-tick) graph + pre-tick snapshot +
 * the stateful deployment record carried on each resolved deployment.
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

const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, Number(v) || 0));

// ── Strength-scaled return tunables (calibration is load-bearing). ───────────────
// The army's REMAINING-STRENGTH RATIO (currentEffectiveStrength / maxStartStrength,
// 0..1) is the spine of every return resolution. A high ratio ⇒ a strong host that
// breaks the siege / liberates / coups; a low ratio ⇒ a spent host that fails,
// negotiates from weakness, or splinters.
//
// The resolution is a DETERMINISTIC THRESHOLD + a PLAUSIBILITY-BANDED roll (NOT a
// coin flip): the success probability is the strength ratio mapped through a band, so
// a near-full army nearly always succeeds and a gutted one nearly always fails, with
// a contested middle where the (deterministic, id-forked) roll decides.
const STRONG_RETURN_RATIO = 0.62;   // at/above this the host is "strong" (high success odds)
const SPLINTER_RATIO = 0.3;         // below this a returning host is at risk of splintering
const RETURN_SUCCESS_FLOOR = 0.06;  // even a gutted army has a sliver of a chance (a desperate sally)
const RETURN_SUCCESS_CEIL = 0.96;   // even a full army can be unlucky (fog of war)

/**
 * The army's remaining-strength ratio (0..1) from its stateful deployment record. A
 * light/pre-B2 record (no strength fields) reads as a FULL army (1.0) — so the legacy
 * binary behaviour (a returning army always succeeds) is the limiting case of the
 * strength-scaled one. A `withdrawal` (the army gave up a stalled siege) is treated as
 * already somewhat spent regardless.
 * @param {any} deployment  the resolved deployment record.
 * @param {string} outcome  the resolution that returned it ('conquest'|'withdrawal'|…).
 * @returns {number} 0..1
 */
function strengthRatioOf(deployment, outcome) {
  const d = deployment || {};
  const max = Number(d.maxStartStrength);
  const cur = Number(d.currentEffectiveStrength);
  let ratio = Number.isFinite(max) && max > 0 && Number.isFinite(cur)
    ? clamp01(cur / max)
    : 1.0; // light record ⇒ full strength (legacy binary limit).
  // A withdrawal is a retreat off a stalled siege — the host is demoralized even if
  // its headcount held. Cap its effective return strength a little.
  if (outcome === 'withdrawal') ratio = Math.min(ratio, 0.85);
  return ratio;
}

/**
 * The success probability of a strength-scaled return resolution: the army's strength
 * ratio mapped through the plausibility band, optionally tilted by a context factor
 * (e.g. the home's own fragility makes a coup easier). Deterministic; bounded. The
 * caller draws ONE id-forked roll against this.
 * @param {number} ratio       0..1 remaining-strength ratio.
 * @param {number} [contextTilt] additive tilt (e.g. +0.15 when the home is fragile).
 * @returns {number} 0..1
 */
function returnSuccessProbability(ratio, contextTilt = 0) {
  // A smooth ramp centred on STRONG_RETURN_RATIO: well below ⇒ near the floor, well
  // above ⇒ near the ceiling, a contested band around the threshold.
  const centered = (clamp01(ratio) - SPLINTER_RATIO) / Math.max(1e-6, STRONG_RETURN_RATIO - SPLINTER_RATIO);
  const ramp = clamp01(0.5 * centered + 0.25); // ratio at SPLINTER → 0.25, at STRONG → 0.75
  return clamp(RETURN_SUCCESS_FLOOR, RETURN_SUCCESS_CEIL, ramp + contextTilt);
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
 * A FAILED / destabilizing strength-scaled return outcome. A depleted army that
 * cannot liberate / relieve / coup — or a gutted host that splinters on the way home —
 * leaves a WOUND on the home order rather than nothing. Routes through a destabilizing
 * condition archetype (faction_challenge for a splinter/disband — a restive faction
 * maneuvering; war_exhaustion for a failed liberation/relief — the home is left weaker
 * still). Severity scales INVERSELY with the returning strength (the more gutted, the
 * worse the instability). A condition outcome flows through applyWorldPulseOutcomes
 * unchanged.
 *
 * @param {{ kind:'rebellion'|'relief'|'splinter'|'disband', homeId:string, homeName:string, sourceId:string, ratio:number, pSuccess:number, roll:number, tick:number, headline:string, summary:string }} args
 * @returns {any}
 */
function failedReturnOutcome({ kind, homeId, homeName, sourceId, ratio, pSuccess, roll, tick, headline, summary }) {
  // A failed liberation/relief leaves the home weaker (war_exhaustion — economic
  // wound); a splinter/disband is an internal-instability seed (faction_challenge —
  // legitimacy + faction power + social trust). Severity ∝ how gutted the host is.
  const archetype = (kind === 'splinter' || kind === 'disband') ? 'faction_challenge' : 'war_exhaustion';
  const severity = clamp(0.25, 0.7, 0.6 - ratio * 0.4);
  return {
    id: `world_outcome.return_${kind}.${stablePart(homeId)}.${tick}`,
    type: 'condition',
    candidateType: archetype,
    ruleId: `deployment_return_${kind}`,
    ruleFamily: 'stressor',
    applyMode: 'auto',
    probability: 1,
    targetSaveId: homeId,
    severity,
    headline,
    summary,
    reasons: [`A returning army at ${(ratio * 100).toFixed(0)}% of its muster strength could not prevail (${kind}). Success ${pSuccess.toFixed(2)}, roll ${roll.toFixed(2)}.`],
    condition: {
      archetype,
      severity,
      triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN_FAILED', sourceEventTargetId: sourceId },
      causes: [{ source: homeId, effect: archetype, reason: `${homeName}'s depleted army's return (${kind}) destabilized the home order.` }],
    },
  };
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

    // ── The returning army's REMAINING-STRENGTH RATIO + one id-forked roll. Every
    // resolution below thresholds on this: a strong host succeeds, a depleted one fails
    // / negotiates / splinters. The roll is forked on the home id (order-independent).
    const ratio = strengthRatioOf(record.deployment, record.outcome);
    const recordRng = baseRng.fork(homeId);

    if (isOccupied(item)) {
      // STRENGTH-SCALED: a strong returning army breaks the foreign occupation; a
      // depleted one mounts a FAILED rebellion (it cannot retake its own home).
      const pSuccess = returnSuccessProbability(ratio);
      const roll = recordRng.fork('liberation').random();
      if (roll < pSuccess) {
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
          reasons: [`A returning army (strength ${(ratio * 100).toFixed(0)}% of muster) broke the occupation. Success ${pSuccess.toFixed(2)}, roll ${roll.toFixed(2)}.`],
          condition: {
            archetype: 'occupation_lifted',
            severity: 0.3,
            triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
            causes: [{ source: homeId, effect: 'occupation_lifted', reason: `${homeName}'s returning army broke the occupation.` }],
          },
        });
      } else {
        outcomes.push(failedReturnOutcome({
          kind: 'rebellion', homeId, homeName, sourceId, ratio, pSuccess, roll, tick,
          headline: `${homeName}'s liberation falters`,
          summary: `${homeName}'s army came home too spent to break the occupation; the failed rising leaves the settlement weaker still.`,
        }));
      }
      continue;
    }

    if (isBesieged(graph, homeId)) {
      // STRENGTH-SCALED: a strong returning army relieves the home siege; a depleted
      // one is brushed aside (a FAILED relief that deepens the home's plight).
      const pSuccess = returnSuccessProbability(ratio);
      const roll = recordRng.fork('relief').random();
      if (roll < pSuccess) {
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
          reasons: [`A returning army (strength ${(ratio * 100).toFixed(0)}% of muster) relieved the siege. Success ${pSuccess.toFixed(2)}, roll ${roll.toFixed(2)}.`],
          condition: {
            archetype: 'siege_lifted',
            severity: 0.3,
            triggeredAt: { tick, sourceEventType: 'DEPLOYMENT_RETURN', sourceEventTargetId: sourceId },
            causes: [{ source: homeId, effect: 'siege_lifted', reason: `${homeName}'s returning army relieved the siege.` }],
          },
        });
      } else {
        outcomes.push(failedReturnOutcome({
          kind: 'relief', homeId, homeName, sourceId, ratio, pSuccess, roll, tick,
          headline: `${homeName}'s relief column is broken`,
          summary: `${homeName}'s depleted army could not break through to its besieged home; the failed relief leaves the defenders more desperate.`,
        }));
      }
      continue;
    }

    if (isVassal(snapshot, homeId)) {
      // A vassal whose army comes home is a coup risk: legitimacy decides whether the
      // returning host CAN topple the seat — but it is gated on STRENGTH FIRST. A
      // depleted host that marches home is in no shape to coup (it DISBANDS, and a
      // gutted one may splinter); only a host with strength to spare even rolls the
      // legitimacy verdict, and its strength tilts that verdict.
      if (ratio < SPLINTER_RATIO) {
        // Too spent to coup — the host disbands. A truly gutted one splinters.
        if (ratio < SPLINTER_RATIO * 0.6) {
          outcomes.push(failedReturnOutcome({
            kind: 'disband', homeId, homeName, sourceId, ratio, pSuccess: 0, roll: 0, tick,
            headline: `${homeName}'s host comes home broken`,
            summary: `${homeName}'s army returned too gutted to challenge the overlord's seat; remnants desert and the order tightens its grip.`,
          }));
        }
        continue;
      }
      // Strength to spare → the legitimacy coup verdict, tilted by the army's strength
      // (a stronger returning host topples a weak seat more readily). The strength tilt
      // feeds the verdict severity so a near-full host coups decisively.
      const verdict = resolveCoupVerdict({
        settlement: item.settlement,
        rng: recordRng.fork('coup'),
        severity: clamp(0.45, 0.85, 0.4 + ratio * 0.5),
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
        reasons: [verdict.reason, `Returning strength ${(ratio * 100).toFixed(0)}% of muster. Hold chance ${verdict.pHold}, roll ${verdict.roll}.`],
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

    // ── Generic clear. A HEALTHY army stands down with no residual. But
    // a BADLY-DAMAGED army returning to an untroubled home is itself DESTABILIZING — it
    // SPLINTERS: deserters, would-be rebels, a restive loyalist remnant. A low-strength
    // return is a postwar-instability seed (splinters: rebels/deserters). ────────────
    if (ratio < SPLINTER_RATIO) {
      outcomes.push(failedReturnOutcome({
        kind: 'splinter', homeId, homeName, sourceId, ratio, pSuccess: 0, roll: 0, tick,
        headline: `${homeName}'s broken host comes home`,
        summary: `${homeName}'s army returned a shadow of the force that marched out — deserters scatter and the survivors are restive, a wound on the home order.`,
      }));
    }
  }

  return outcomes;
}
