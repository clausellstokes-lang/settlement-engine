/**
 * tests/domain/pipelineRail.test.js — Tier 5.5 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  expandPipelineStep,
  pipelineStepSummary,
  totalTraceCount,
} from '../../src/domain/pipelineRail.js';

function fixture() {
  return {
    name: 'Greycairn',
    institutions: [{ id: 'institution.granary', name: 'Granary' }],
    powerStructure: { factions: [], publicLegitimacy: { score: 60, label: 'Approved' } },
    simulationTrace: [
      {
        step: 'assembleInstitutions',
        targetType: 'institution',
        targetId: 'institution.granary',
        result: 'selected',
        causes: [{ source: 'food_need', effect: 'requires', reason: 'Settlement needs grain.' }],
        downstreamEffects: [{ target: 'chain.food_security', effect: 'enables' }],
      },
      {
        step: 'assembleInstitutions',
        targetType: 'institution',
        targetId: 'institution.unknown',
        result: 'selected',
        causes: [],
        downstreamEffects: [],
      },
      {
        step: 'assemblePower',
        targetType: 'faction',
        targetId: 'faction.council',
        result: 'promoted',
        causes: [{ source: 'governing_role', effect: 'controls', reason: 'Council governs.' }],
      },
    ],
  };
}

describe('expandPipelineStep()', () => {
  it('returns step + decisions + summary for a known step', () => {
    const p = expandPipelineStep(fixture(), 'assembleInstitutions');
    expect(p.step).toBe('assembleInstitutions');
    expect(p.decisions).toHaveLength(2);
    expect(p.summary.length).toBeGreaterThan(0);
  });

  it('every decision carries why + downstreamEffects + envelope', () => {
    const p = expandPipelineStep(fixture(), 'assembleInstitutions');
    const granaryDecision = p.decisions.find(d => d.targetId === 'institution.granary');
    expect(granaryDecision.why.length).toBeGreaterThan(0);
    expect(granaryDecision.downstreamEffects.length).toBeGreaterThan(0);
    expect(granaryDecision.envelope).toBeTruthy();
    expect(granaryDecision.envelope.entityType).toBe('institution');
  });

  it('returns empty decisions for unknown step', () => {
    const p = expandPipelineStep(fixture(), 'not_a_step');
    expect(p.decisions).toEqual([]);
    expect(p.summary[0]).toMatch(/no structured decisions/i);
  });

  it('handles nullish input', () => {
    expect(expandPipelineStep(null, 'step').decisions).toEqual([]);
    expect(expandPipelineStep({}, null).decisions).toEqual([]);
  });
});

describe('pipelineStepSummary()', () => {
  it('groups traces by step with counts', () => {
    const summary = pipelineStepSummary(fixture());
    const byStep = Object.fromEntries(summary.map(s => [s.step, s.decisionCount]));
    expect(byStep.assembleInstitutions).toBe(2);
    expect(byStep.assemblePower).toBe(1);
  });

  it('returns [] for nullish settlement', () => {
    expect(pipelineStepSummary(null)).toEqual([]);
  });
});

describe('totalTraceCount()', () => {
  it('counts traces', () => {
    expect(totalTraceCount(fixture())).toBe(3);
  });

  it('returns 0 for nullish', () => {
    expect(totalTraceCount(null)).toBe(0);
    expect(totalTraceCount({})).toBe(0);
  });
});

describe('purity', () => {
  it('does not mutate settlement', () => {
    const s = fixture();
    const before = JSON.stringify(s);
    expandPipelineStep(s, 'assembleInstitutions');
    pipelineStepSummary(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});
