import { describe, expect, it } from 'vitest';
import {
  buildBehavioralObservation,
  buildDarkControl,
  buildNeighborControl,
  moverFamilyOf,
  observeBehavioralYear,
  settlementStateVector,
} from '../../scripts/audit/behavioral-observation.mjs';

function settlement({
  population = 1_000,
  prosperity = 'Moderate',
  governingName = 'Council',
  factions = [
    { faction: 'Council', power: 60, isGoverning: true },
    { faction: 'Guild', power: 40 },
  ],
} = {}) {
  return {
    population,
    economicState: { prosperity },
    powerStructure: { governingName, factions },
  };
}

describe('behavioral soak observation adapter', () => {
  it('classifies broad mover families without forcing unknown records', () => {
    expect(moverFamilyOf({ candidateType: 'population_emigration' })).toBe('population');
    expect(moverFamilyOf({ candidateType: 'coup_succeeded' })).toBe('politics');
    expect(moverFamilyOf({ candidateType: 'reconstruction_completed' })).toBe('constructive');
    expect(moverFamilyOf({ candidateType: 'rumor_reconciled' })).toBe('knowledge');
    expect(moverFamilyOf({ candidateType: 'unmapped_xyz' })).toBeNull();
  });

  it('records tempo, arcs, causality, motion, attention, and succession from the real result shape', () => {
    const beforeSaves = [
      { id: 'a', settlement: settlement() },
      { id: 'b', settlement: settlement() },
    ];
    const afterSaves = [
      {
        id: 'a',
        settlement: settlement({
          population: 1_020,
          prosperity: 'Comfortable',
          governingName: 'Guild',
          factions: [
            { faction: 'Council', power: 40 },
            { faction: 'Guild', power: 60, isGoverning: true },
          ],
        }),
      },
      { id: 'b', settlement: settlement({ population: 990 }) },
    ];
    const result = {
      selected: [
        {
          id: 'war.1',
          candidateType: 'conquest',
          severity: 0.9,
          targetSaveId: 'a',
          headline: 'The walls fell.',
        },
        {
          id: 'politics.2',
          candidateType: 'coup_succeeded',
          targetSaveId: 'a',
          causedBy: 'war.1',
          headline: 'The guild took the chair.',
        },
        {
          id: 'relief.3',
          candidateType: 'reconstruction_completed',
          targetSaveId: 'b',
          causedBy: ['war.1', 'politics.2'],
          headline: 'The bridge reopened.',
        },
      ],
    };
    const observed = observeBehavioralYear({
      year: 1,
      result,
      beforeSaves,
      afterSaves,
    });

    expect(observed.eventCount).toBe(3);
    expect(observed.majorEventCount).toBe(1);
    expect(observed.moverCounts.war).toBe(1);
    expect(observed.moverCounts.politics).toBe(1);
    expect(observed.moverCounts.constructive).toBe(1);
    expect(observed.arcCounts).toEqual({ constructive: 1, destructive: 2 });
    expect(observed.attentionCounts).toEqual({ a: 2, b: 1 });
    expect(observed.motion.populationMoved).toBe(2);
    expect(observed.motion.prosperityMoved).toBe(1);
    expect(observed.motion.powerMoved).toBe(1);
    expect(observed.succession).toMatchObject({
      attempts: 1,
      completions: 1,
      integrityFailures: 0,
    });
    expect(observed.causal.crossFamilyEdges).toBeGreaterThanOrEqual(2);
    expect(observed.causal.familyPairs).toContain('war->politics');
    expect(observed.chronicleSample[0].headline).toBe('The walls fell.');
  });

  it('measures only propagated neighbor distance, excluding the perturbed source', () => {
    const baseline = [
      {
        stateVectors: {
          a: settlementStateVector(settlement({ population: 1_000 })),
          b: settlementStateVector(settlement({ population: 1_000 })),
        },
      },
      {
        stateVectors: {
          a: settlementStateVector(settlement({ population: 1_000 })),
          b: settlementStateVector(settlement({ population: 1_000 })),
        },
      },
    ];
    const sourceOnly = structuredClone(baseline);
    sourceOnly[0].stateVectors.a.population = 1_100;
    sourceOnly[1].stateVectors.a.population = 1_100;
    const noPropagation = buildNeighborControl({
      baselineYearly: baseline,
      perturbedYearly: sourceOnly,
      sourceSettlementId: 'a',
    });
    expect(noPropagation.checkpoints.at(-1).targetDistance).toBe(0);

    sourceOnly[1].stateVectors.b.population = 1_020;
    const propagated = buildNeighborControl({
      baselineYearly: baseline,
      perturbedYearly: sourceOnly,
      sourceSettlementId: 'a',
    });
    expect(propagated.checkpoints.at(-1).targetDistance).toBeGreaterThan(0);
  });

  it('fails the dark-control observation on activity or conditional state', () => {
    expect(buildDarkControl({
      litBaselineYear: { eventCount: 4 },
      darkYearly: [{ eventCount: 0 }],
      finalWorldState: {},
    })).toMatchObject({
      executed: true,
      litBaselineActivityCount: 4,
      darkActivityCount: 0,
      conditionalStateLeaks: [],
    });
    expect(buildDarkControl({
      litBaselineYear: { eventCount: 4 },
      darkYearly: [{ eventCount: 1 }],
      finalWorldState: { spatialLedgers: { roads: {} } },
    })).toMatchObject({
      darkActivityCount: 1,
      conditionalStateLeaks: ['spatialLedgers'],
    });
  });

  it('builds a versioned observation receipt', () => {
    expect(buildBehavioralObservation({
      settlementIds: ['a'],
      yearly: [{ year: 1 }],
    })).toEqual({
      schemaVersion: 1,
      kind: 'whole_world_behavioral_observation',
      settlementIds: ['a'],
      yearly: [{ year: 1 }],
      controls: {},
    });
  });
});

