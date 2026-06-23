/**
 * domain/worldPulse/coup.js — the coup verdict.
 *
 * A resolved coup_detat stressor is not an ordinary resolution: resolution
 * IS the verdict moment. This module turns each coup that resolved during a
 * pulse into its consequence outcome:
 *
 *   - ruler HOLDS  → a 'coup_suppressed' condition (purges, loyalty tests)
 *   - ruler FALLS  → a 'power_transfer' outcome carrying the winner +
 *                    a 'government_overthrown' condition. The transfer
 *                    itself is applied by applyWorldPulse via
 *                    transferRulingPower (rulingPower.js) — the same code
 *                    path the CHANGE_RULING_POWER canon event uses.
 *
 * The contest (rulingPower.resolveCoupVerdict) recomputes the field from
 * LIVE settlement state — not the birth-time snapshot — so everything the
 * party did during the brewing window (legitimacy repair, bolstering or
 * undermining factions) genuinely moves the verdict.
 *
 * User agency:
 *   - a locked governing faction (campaignState.locks.factions) downgrades
 *     a fall verdict to a PROPOSAL — the seat cannot change hands without
 *     explicit approval;
 *   - a party-directed resolution (resolveStressorById stamps
 *     resolutionReason) is the table ENDING the coup, not the coup reaching
 *     its verdict — no contest runs, the ruler simply survives.
 *
 * Deterministic: rng is threaded in; no Date, no Math.random.
 */

import { stablePart } from './worldState.js';
import { resolveCoupVerdict } from '../rulingPower.js';

export const COUP_STRESSOR_TYPE = 'coup_detat';

/**
 * The generic stressor_residual outcome for a resolved coup is replaced by
 * the verdict's own condition — without this filter every verdict would
 * double-stamp the settlement (residual scars + regime shock).
 */
export function isCoupResidualOutcome(outcome) {
  return outcome?.ruleId === `stressor_${COUP_STRESSOR_TYPE}_residual`;
}

function lockedGoverningFaction(entry, governingName) {
  const locked = entry?.save?.campaignState?.locks?.factions;
  if (!Array.isArray(locked) || !locked.length || !governingName) return false;
  const target = stablePart(governingName);
  return locked.some(id => {
    const key = stablePart(String(id).replace(/^faction\./, ''));
    return key === target;
  });
}

function clamp(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Build verdict outcomes for every coup that resolved this tick.
 *
 * @param {Object} args
 * @param {any[]} [args.resolved]   ageRoamingStressors' resolved list
 * @param {any} args.snapshot       world snapshot (byId entries carry settlement + causal + save)
 * @param {{ random: () => number }} args.rng
 * @param {number} [args.tick]
 * @returns {any[]} outcomes for applyWorldPulseOutcomes (deterministic, probability 1)
 */
export function coupVerdictOutcomes({ resolved = [], snapshot, rng, tick = 0 }) {
  const outcomes = [];
  for (const stressor of resolved) {
    if (stressor?.type !== COUP_STRESSOR_TYPE) continue;
    // Directed resolutions (party action) end the coup without a verdict.
    if (stressor.resolutionReason) continue;
    const saveId = String(
      stressor.originSettlementId || (stressor.affectedSettlementIds || [])[0] || '',
    );
    const entry = snapshot?.byId?.get?.(saveId);
    if (!entry?.settlement) continue;

    const severity = Math.max(stressor.peakSeverity ?? 0, stressor.severity ?? 0, 0.3);
    const verdict = resolveCoupVerdict({
      settlement: entry.settlement,
      rng,
      severity,
      rulingAuthorityScore: entry.causal?.scores?.ruling_authority ?? null,
    });
    const settlementName = entry.name || entry.settlement?.name || saveId;
    const incumbentName = verdict.incumbent?.name || 'the ruling power';
    const base = {
      id: `world_outcome.coup_verdict.${stablePart(stressor.id)}.${tick}`,
      ruleFamily: 'stressor',
      probability: 1,
      targetSaveId: saveId,
      metadata: {
        verdict: {
          holds: verdict.holds,
          pHold: verdict.pHold,
          roll: verdict.roll,
          winner: verdict.winner?.name || null,
          incumbent: verdict.incumbent,
          challengers: verdict.challengers,
          variant: stressor.originContext?.variant || null,
        },
      },
    };

    if (verdict.holds) {
      outcomes.push({
        ...base,
        type: 'condition',
        candidateType: 'coup_suppressed',
        ruleId: 'coup_verdict_hold',
        applyMode: 'auto',
        severity: clamp(0.3, 0.7, severity * 0.7),
        headline: `${incumbentName} crushes the coup in ${settlementName}`,
        summary: `The conspiracy broke against the seat. Purges and loyalty tests follow; the plotters' names are currency now.`,
        reasons: [
          verdict.reason,
          `Hold chance ${verdict.pHold}, roll ${verdict.roll}.`,
        ],
        condition: {
          archetype: 'coup_suppressed',
          severity: clamp(0.3, 0.7, severity * 0.7),
          triggeredAt: { tick, sourceEventType: 'COUP_VERDICT', sourceEventTargetId: stressor.id },
          causes: [{ source: stressor.id, effect: 'coup_suppressed', reason: verdict.reason }],
        },
      });
      continue;
    }

    const locked = lockedGoverningFaction(entry, verdict.incumbent?.name);
    const losers = verdict.challengers
      .filter(c => c.name !== verdict.winner.name)
      .map(c => c.name);
    outcomes.push({
      ...base,
      type: 'power_transfer',
      candidateType: 'coup_succeeded',
      ruleId: 'coup_verdict_fall',
      applyMode: locked ? 'proposal' : 'auto',
      severity: clamp(0.45, 1, severity),
      headline: `${verdict.winner.name} seizes power in ${settlementName}`,
      summary: `The ${String(incumbentName).toLowerCase()} fell. ${verdict.winner.name} now commands the government, and the settlement holds its breath.`,
      reasons: [
        verdict.reason,
        `Hold chance ${verdict.pHold}, roll ${verdict.roll}.`,
        ...(locked
          ? ['The governing faction is locked. The seat cannot change hands without your approval.']
          : []),
      ],
      powerTransfer: {
        toPowerName: verdict.winner.name,
        cause: 'coup',
        tick,
        losers,
        sourceStressorId: stressor.id,
      },
      condition: {
        archetype: 'government_overthrown',
        severity: clamp(0.45, 0.8, severity * 0.85),
        triggeredAt: { tick, sourceEventType: 'COUP_VERDICT', sourceEventTargetId: stressor.id },
        causes: [{
          source: stressor.id,
          effect: 'government_overthrown',
          reason: `${verdict.winner.name} overthrew ${incumbentName}.`,
        }],
      },
    });
  }
  return outcomes;
}
