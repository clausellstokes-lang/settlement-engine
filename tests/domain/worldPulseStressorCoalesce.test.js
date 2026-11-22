/**
 * tests/domain/worldPulseStressorCoalesce.test.js — B02-worldpulse-core pins.
 *
 * Findings 1, 2, 9: multiple outcomes touching the SAME stressor id within one
 * apply pass used to collide as order-dependent last-write-wins —
 *   • a multi-target spread silently dropped all but the last target;
 *   • an escalate applied after a spread reverted the spread's footprint /
 *     attenuation (and vice-versa);
 *   • a war stressor wound down THIS tick could be re-raised by a same-tick
 *     escalate, defeating the wind-down.
 * The apply pass now field-MERGES every same-id collision commutatively (union
 * affectedSettlementIds, max severity, max severityBySettlement) and honours a
 * this-tick wind-down severity ceiling.
 */

import { describe, expect, test } from 'vitest';

import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-10T00:00:00.000Z';
const PREV = '2026-06-01T00:00:00.000Z';
const STRESSOR_ID = 'world_stressor.famine.a';

function spreadOutcome(targetSaveId, recordSeverity, spreadSeverity, existingAffected) {
  return {
    id: `candidate.stressor.spread.${STRESSOR_ID}.${targetSaveId}.7`,
    type: 'stressor',
    candidateType: 'stressor_spread_famine',
    ruleId: 'stressor_spread_famine',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    targetSaveId,
    severity: spreadSeverity,
    headline: 'Famine pressure may spread',
    stressor: {
      id: STRESSOR_ID,
      type: 'famine',
      severity: recordSeverity,
      originSettlementId: 'a',
      createdAt: PREV,
      affectedSettlementIds: [...new Set([...existingAffected, targetSaveId])],
      severityBySettlement: { [targetSaveId]: spreadSeverity },
    },
  };
}

function escalateOutcome(severity) {
  return {
    id: `candidate.stressor.escalate.${STRESSOR_ID}.7`,
    type: 'stressor',
    candidateType: 'stressor_escalate_famine',
    ruleId: 'stressor_escalate_famine',
    ruleFamily: 'stressor',
    applyMode: 'auto',
    targetSaveId: 'a',
    severity,
    headline: 'Famine pressure may intensify',
    stressor: {
      id: STRESSOR_ID,
      type: 'famine',
      severity,
      originSettlementId: 'a',
      createdAt: PREV,
      affectedSettlementIds: ['a'],
    },
  };
}

function pulse(worldState, outcomes, { tick = 7, now = NOW } = {}) {
  const graph = ensureRegionalGraph({}, { now });
  return applyWorldPulseOutcomes({
    snapshot: { regionalGraph: graph, settlements: [], campaign: {} },
    worldState,
    regionalGraph: graph,
    wizardNews: { currentTick: tick, entries: [] },
    settlementMap: new Map(),
    outcomes,
    tick,
    now,
  });
}

function recordOf(state) {
  return state.stressors.find(s => s.id === STRESSOR_ID);
}

describe('B02 — same-tick stressor outcome coalescing', () => {
  test('two spread outcomes for one stressor union their targets (no last-write-wins drop)', () => {
    // A pre-tick famine at origin 'a'. Two confirmed spreads this tick: to b, to c.
    const start = {
      stressors: [{
        id: STRESSOR_ID, type: 'famine', severity: 0.6,
        originSettlementId: 'a', affectedSettlementIds: ['a'], createdAt: PREV, updatedAt: PREV,
      }],
      npcStates: {}, proposals: [],
    };
    const outcomes = [
      spreadOutcome('b', 0.6, 0.43, ['a']),
      spreadOutcome('c', 0.6, 0.43, ['a']),
    ];

    const forward = recordOf(pulse(start, outcomes).worldState);
    const reversed = recordOf(pulse(start, [...outcomes].reverse()).worldState);

    // Both targets survive — neither spread clobbered the other.
    expect(forward.affectedSettlementIds.sort()).toEqual(['a', 'b', 'c']);
    expect(forward.severityBySettlement.b).toBeCloseTo(0.43, 5);
    expect(forward.severityBySettlement.c).toBeCloseTo(0.43, 5);
    // Order-independent: reversing the outcome list yields a byte-identical record.
    expect(reversed).toEqual(forward);
  });

  test('escalate after spread keeps the raised severity AND the spread target', () => {
    const start = {
      stressors: [{
        id: STRESSOR_ID, type: 'famine', severity: 0.6,
        originSettlementId: 'a', affectedSettlementIds: ['a'], createdAt: PREV, updatedAt: PREV,
      }],
      npcStates: {}, proposals: [],
    };
    // Spread to b at 0.43, escalate origin severity to 0.85 — both this tick.
    const outcomes = [spreadOutcome('b', 0.6, 0.43, ['a']), escalateOutcome(0.85)];

    const forward = recordOf(pulse(start, outcomes).worldState);
    const reversed = recordOf(pulse(start, [...outcomes].reverse()).worldState);

    // The escalate's raise survives the spread (was reverted by last-write-wins).
    expect(forward.severity).toBeCloseTo(0.85, 5);
    // The spread target survives the escalate's narrow ['a'] footprint.
    expect(forward.affectedSettlementIds.sort()).toEqual(['a', 'b']);
    expect(forward.severityBySettlement.b).toBeCloseTo(0.43, 5);
    // Commutative: order of the two outcomes does not matter.
    expect(reversed).toEqual(forward);
  });
});

describe('B02-9 — a this-tick wind-down ceiling resists same-tick escalation', () => {
  test('a war stressor wound down this tick is not re-raised by a same-tick escalate', () => {
    // A pre-tick siege sponsored by settlement 'x' (the hostile edge x->a side).
    const siegeId = 'world_stressor.siege.a';
    const start = {
      tick: 7,
      stressors: [{
        id: siegeId, type: 'siege', severity: 0.9,
        originSettlementId: 'a', affectedSettlementIds: ['a'], createdAt: PREV, updatedAt: PREV,
        originContext: { variant: 'declared_war', sponsorSettlementId: 'x', attackerSettlementId: 'x' },
      }],
      relationshipStates: {
        'edge.x.a': { relationshipType: 'hostile', resentment: 0.7, fear: 0.6 },
      },
      npcStates: {}, proposals: [],
    };
    const graph = ensureRegionalGraph({
      edges: [{ id: 'edge.x.a', from: 'x', to: 'a', relationshipType: 'hostile' }],
      channels: [],
    }, { now: NOW });

    // The hostile edge de-escalates to neutral (winds the siege down), AND a
    // same-tick escalate tries to push the siege back to 0.85.
    const labelOutcome = {
      id: 'candidate.relationship.label.edge.x.a.7',
      type: 'relationship',
      candidateType: 'label_change',
      relationshipKey: 'edge.x.a',
      relationshipPatch: { proposedRelationshipType: 'neutral' },
      proposalPayload: {
        kind: 'relationship_label_change',
        relationshipKey: 'edge.x.a',
        fromType: 'hostile',
        toType: 'neutral',
        reason: 'The war ends.',
      },
      severity: 0.6,
    };
    const escalate = {
      id: 'candidate.stressor.escalate.world_stressor.siege.a.7',
      type: 'stressor',
      candidateType: 'stressor_escalate_siege',
      ruleId: 'stressor_escalate_siege',
      ruleFamily: 'stressor',
      applyMode: 'auto',
      targetSaveId: 'a',
      severity: 0.85,
      headline: 'Siege pressure may intensify',
      stressor: {
        id: siegeId, type: 'siege', severity: 0.85,
        originSettlementId: 'a', affectedSettlementIds: ['a'], createdAt: PREV,
      },
    };

    const result = applyWorldPulseOutcomes({
      snapshot: { regionalGraph: graph, settlements: [], campaign: {} },
      worldState: start,
      regionalGraph: graph,
      wizardNews: { currentTick: 7, entries: [] },
      settlementMap: new Map(),
      // wind-down first (the relationship outcome), then the escalate.
      outcomes: [labelOutcome, escalate],
      tick: 7,
      now: NOW,
    });

    const siege = result.worldState.stressors.find(s => s.id === siegeId);
    // The wind-down dropped severity below the structural gate (<= 0.2); the
    // same-tick escalate must NOT lift it back above that wound-down ceiling.
    expect(siege.severity).toBeLessThanOrEqual(0.2);
    expect(siege.originContext.windDown).toBeTruthy();
  });
});
