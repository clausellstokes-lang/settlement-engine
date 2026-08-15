import { describe, expect, it } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { BEHAVIORAL_OBSERVATION_VERSION } from '../../src/domain/certification/behavioralContract.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/index.js';
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

function productionFixture() {
  const ids = ['a', 'b', 'c'];
  const saves = ids.map((id, index) => {
    const name = ['Ashford', 'Briarwatch', 'Caldmere'][index];
    return {
      id,
      name,
      phase: 'canon',
      settlement: {
        ...settlement(),
        name,
        tier: 'town',
        config: {
          tradeRouteAccess: 'road',
          priorityEconomy: 25,
          priorityMilitary: 30,
        },
        institutions: [],
        economicState: {
          prosperity: 'Moderate',
          primaryExports: [],
          primaryImports: ['Bulk grain and foodstuffs'],
        },
        powerStructure: {
          publicLegitimacy: { score: 40, label: 'Contested' },
          factions: [
            { faction: 'Merchant League', category: 'economy', power: 60 },
            { faction: 'Temple Wardens', category: 'religious', power: 48 },
          ],
          conflicts: [],
        },
        npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
        activeConditions: id === 'a'
          ? [{ archetype: 'regional_import_shortage', severity: 0.5 }]
          : [],
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    };
  });
  return {
    saves,
    campaign: {
      id: 'camp-observer-shape',
      name: 'Observer Shape Realm',
      settlementIds: ids,
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        ],
      }),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: 'observer-production-shape',
        tick: 0,
        canonizedAt: '2026-06-01T00:00:00.000Z',
        stressors: [{
          id: 'world_stressor.famine.realm',
          type: 'famine',
          severity: 0.6,
          affectedSettlementIds: ids,
        }],
      },
    },
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

  it('records selected throughput plus authoritative majors, provenance, and post-apply reachability', () => {
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
    const attempt = {
      id: 'pressure.0',
      candidateType: 'stressor_birth_coup_detat',
      targetSaveId: 'a',
      headline: 'A faction begins plotting.',
    };
    const war = {
      id: 'war.1',
      candidateType: 'conquest',
      severity: 0.9,
      targetSaveId: 'a',
      headline: 'The walls fell.',
    };
    const coup = {
      id: 'politics.2',
      candidateType: 'coup_succeeded',
      targetSaveId: 'a',
      headline: 'The guild took the chair.',
    };
    const reconstruction = {
      id: 'relief.3',
      candidateType: 'reconstruction_completed',
      targetSaveId: 'b',
      headline: 'The bridge reopened.',
    };
    const result = {
      tick: 52,
      selected: [attempt, war, coup, reconstruction],
      majors: [war, coup],
      autoApplied: [attempt, coup],
      worldState: {
        tick: 52,
        simulationRules: { provenanceLedgerEnabled: true },
        spatialLedgers: {
          provenance: {
            'politics.2': {
              parents: ['war.1'],
              type: 'coup_succeeded',
              tick: 52,
            },
            'relief.3': {
              parents: ['politics.2', 'war.1'],
              type: 'reconstruction_completed',
              tick: 52,
            },
          },
        },
      },
      wizardNews: {
        entries: [
          {
            id: 'wizard_news.52.world_pulse.applied.war.1',
            tick: 52,
            impactKind: 'conquest',
            sourceEventId: 'war.1',
          },
          {
            id: 'news.belief',
            tick: 52,
            impactKind: 'belief_misjudgment',
            sourceEventId: 'belief_misjudgment.a.b.52',
            settlementIds: ['a', 'b'],
            tags: ['world_pulse', 'belief', 'misjudgment'],
          },
          {
            id: 'news.reconstruction',
            tick: 52,
            impactKind: 'reconstruction',
            sourceEventId: 'reconstruction.a.52',
            settlementIds: ['a'],
            tags: ['world_pulse', 'upswing', 'reconstruction'],
          },
          {
            id: 'news.rise',
            tick: 52,
            impactKind: 'npc_ladder',
            sourceEventId: 'npc_ladder.a.rise.52',
            settlementIds: ['a'],
            tags: ['world_pulse', 'npc_ladder', 'rise'],
          },
        ],
      },
    };
    const observed = observeBehavioralYear({
      year: 1,
      result,
      beforeSaves,
      afterSaves,
    });

    expect(observed.eventCount).toBe(4);
    expect(observed.majorEventCount).toBe(2);
    expect(observed.moverCounts.pressure).toBe(1);
    expect(observed.moverCounts.war).toBe(1);
    expect(observed.moverCounts.politics).toBe(1);
    expect(observed.moverCounts.constructive).toBe(2);
    expect(observed.moverCounts.knowledge).toBe(1);
    expect(observed.moverCounts.people).toBe(1);
    expect(observed.selectedMoverCounts.knowledge).toBe(0);
    expect(observed.postApplyMoverCounts).toMatchObject({
      constructive: 1,
      knowledge: 1,
      people: 1,
    });
    expect(observed.postApplyReceiptCount).toBe(3);
    expect(observed.arcCounts).toEqual({ constructive: 2, destructive: 2 });
    expect(observed.postApplyArcCounts).toEqual({ constructive: 1, destructive: 0 });
    expect(Object.values(observed.eventTypeCounts)
      .reduce((total, count) => total + count, 0)).toBe(4);
    expect(observed.attentionCounts).toEqual({ a: 3, b: 1 });
    expect(observed.motion.populationMoved).toBe(2);
    expect(observed.motion.prosperityMoved).toBe(1);
    expect(observed.motion.powerMoved).toBe(1);
    expect(observed.succession).toMatchObject({
      pendingProposals: 0,
      attempts: 2,
      completions: 2,
      integrityFailures: 0,
    });
    expect(observed.causal.crossFamilyEdges).toBe(3);
    expect(observed.causal.multiParentEvents).toBe(1);
    expect(observed.causal.familyPairs).toContain('war->politics');
    expect(observed.chronicleSample[0].headline).toBe('The walls fell.');
  });

  it('keeps state-only mechanics out of every public tempo lane and counts them separately', () => {
    const mechanical = {
      id: 'population.background',
      candidateType: 'population_growth',
      targetSaveId: 'a',
      recordMode: 'state_only',
      headline: 'Population grows in the background.',
    };
    const publicEvent = {
      id: 'war.public',
      candidateType: 'conquest',
      targetSaveId: 'a',
      headline: 'The walls fall.',
      causedBy: 'population.background',
    };
    const observed = observeBehavioralYear({
      year: 1,
      result: {
        tick: 52,
        // Deliberately feed the adapter an over-broad upstream shape: v4 must
        // fail safe even if a caller regresses the public partition.
        selected: [mechanical, publicEvent],
        majors: [mechanical, publicEvent],
        autoApplied: [mechanical],
        worldState: {
          tick: 52,
          simulationRules: { provenanceLedgerEnabled: true },
          spatialLedgers: {
            provenance: {
              'population.background': {
                parents: [],
                type: 'population_growth',
                tick: 52,
                receiptClass: 'mechanical',
              },
              'war.public': {
                parents: ['population.background'],
                type: 'conquest',
                tick: 52,
              },
            },
          },
        },
        wizardNews: {
          entries: [{
            id: 'wizard_news.52.world_pulse.applied.population.background',
            tick: 52,
            impactKind: 'population_growth',
            sourceEventId: 'population.background',
            recordMode: 'state_only',
          }],
        },
      },
      beforeSaves: [],
      afterSaves: [],
    });

    expect(observed.eventCount).toBe(1);
    expect(observed.majorEventCount).toBe(1);
    expect(observed.mechanicalOutcomeCount).toBe(1);
    expect(observed.moverCounts.population).toBe(0);
    expect(observed.moverCounts.war).toBe(1);
    expect(observed.postApplyReceiptCount).toBe(0);
    expect(observed.causal.crossFamilyEdges).toBe(0);
    expect(observed.chronicleSample.map(entry => entry.id)).toEqual(['war.public']);

    const fallback = observeBehavioralYear({
      year: 1,
      result: {
        tick: 52,
        selected: [mechanical, publicEvent],
        majors: [publicEvent],
        autoApplied: [mechanical],
        worldState: { tick: 52, simulationRules: {} },
      },
      beforeSaves: [],
      afterSaves: [],
    });
    expect(fallback.causal.crossFamilyEdges).toBe(0);

    const priorPulseFallback = observeBehavioralYear({
      year: 2,
      result: {
        tick: 53,
        selected: [publicEvent],
        majors: [publicEvent],
        autoApplied: [],
        worldState: {
          tick: 53,
          simulationRules: {},
          pulseHistory: [{
            tick: 52,
            selectedOutcomes: [],
            consequenceOutcomes: [mechanical],
            mechanicalOutcomes: [mechanical],
          }],
        },
      },
      beforeSaves: [],
      afterSaves: [],
    });
    expect(priorPulseFallback.mechanicalOutcomeCount).toBe(0);
    expect(priorPulseFallback.causal.crossFamilyEdges).toBe(0);
  });

  it('dedupes uncapped receipts, excludes only exact selected twins, and ignores structural news prefixes', () => {
    const selected = {
      id: 'war.1',
      candidateType: 'conquest',
      targetSaveId: 'a',
    };
    const derivedReceipt = {
      id: 'wizard_news.52.reconstruction.aftershock',
      tick: 52,
      impactKind: 'reconstruction',
      sourceEventId: 'war.1',
      settlementIds: ['a'],
      tags: ['world_pulse', 'reconstruction'],
    };
    const observed = observeBehavioralYear({
      year: 1,
      result: {
        tick: 52,
        selected: [selected],
        majors: [],
        wizardNews: { entries: [{ ...derivedReceipt, summary: 'terminal copy' }] },
        worldState: {
          tick: 52,
          simulationRules: { provenanceLedgerEnabled: true },
          spatialLedgers: {
            provenance: {
              'war.1': { type: 'conquest', tick: 52, parents: [] },
              'wizard_news.52.unmapped_receipt': {
                type: 'unmapped_xyz',
                tick: 52,
                parents: ['war.1'],
              },
            },
          },
        },
      },
      beforeSaves: [],
      afterSaves: [],
      rawWizardNewsEntries: [
        {
          id: 'wizard_news.52.world_pulse.applied.war.1',
          tick: 52,
          impactKind: 'conquest',
          sourceEventId: 'war.1',
        },
        {
          id: 'wizard_news.52.world_pulse.proposal.war.1',
          tick: 52,
          impactKind: 'conquest',
          sourceEventId: 'war.1',
        },
        { ...derivedReceipt, summary: 'raw copy' },
        { ...derivedReceipt, summary: 'duplicate raw copy' },
        {
          id: 'table.52',
          tick: 52,
          impactKind: 'reconstruction',
          source: 'table',
        },
      ],
    });

    expect(observed.eventCount).toBe(1);
    expect(observed.postApplyReceiptCount).toBe(1);
    expect(observed.postApplyMoverCounts.constructive).toBe(1);
    expect(observed.postApplyArcCounts.constructive).toBe(1);
    expect(observed.causal.crossFamilyEdges).toBe(0);
    expect(observed.causal.familyPairs).not.toContain('war->knowledge');
  });

  it('takes major count and Chronicle priority from result.majors', () => {
    const severeMinor = {
      id: 'pressure.severe',
      candidateType: 'regional_import_shortage',
      severity: 0.99,
      applyMode: 'proposal',
      headline: 'A severe shortage.',
    };
    const quietMajor = {
      id: 'war.quiet',
      candidateType: 'war_mobilization',
      severity: 0.1,
      applyMode: 'auto',
      headline: 'The levy is called.',
    };
    const observed = observeBehavioralYear({
      year: 1,
      result: {
        selected: [severeMinor, quietMajor],
        majors: [quietMajor],
      },
      beforeSaves: [],
      afterSaves: [],
    });

    expect(observed.majorEventCount).toBe(1);
    expect(observed.chronicleSample[0].id).toBe('war.quiet');
  });

  it('separates pending succession proposals from applied and ladder outcomes', () => {
    const appliedAttempt = {
      id: 'attempt.coup',
      candidateType: 'stressor_birth_coup_detat',
    };
    const coup = {
      id: 'politics.coup',
      candidateType: 'coup_succeeded',
      type: 'power_transfer',
      powerTransfer: { cause: 'coup' },
    };
    const observed = observeBehavioralYear({
      year: 1,
      result: {
        tick: 52,
        selected: [
          appliedAttempt,
          { id: 'attempt.government', candidateType: 'faction_government_challenge' },
          { id: 'false.rival', candidateType: 'faction_rival_power_contest' },
          { id: 'false.faith', candidateType: 'religious_contest' },
          { id: 'false.capture', candidateType: 'faction_capture' },
          { id: 'false.vassal', candidateType: 'occupation_vassalized' },
          coup,
        ],
        majors: [],
        autoApplied: [appliedAttempt, coup],
        proposals: [
          {
            id: 'proposal.government',
            status: 'pending',
            outcome: { candidateType: 'faction_government_challenge' },
          },
          {
            id: 'proposal.coup-birth',
            status: 'pending',
            outcome: { candidateType: 'stressor_birth_coup_detat' },
          },
          {
            id: 'proposal.resolved',
            status: 'applied',
            outcome: { candidateType: 'faction_government_challenge' },
          },
          {
            id: 'proposal.not-succession',
            status: 'pending',
            outcome: { candidateType: 'faction_rival_power_contest' },
          },
        ],
        wizardNews: {
          entries: [
            {
              id: 'news.rise',
              tick: 52,
              impactKind: 'npc_ladder',
              sourceEventId: 'npc_ladder.a.rise.52',
              tags: ['world_pulse', 'npc_ladder', 'rise'],
            },
            {
              id: 'news.failed',
              tick: 52,
              impactKind: 'npc_ladder',
              sourceEventId: 'npc_ladder.a.failed.52',
              tags: ['world_pulse', 'npc_ladder', 'failed'],
            },
            {
              id: 'news.investiture',
              tick: 52,
              impactKind: 'npc_ladder',
              sourceEventId: 'npc_ladder.a.investiture.52',
              tags: ['world_pulse', 'npc_ladder', 'investiture', 'coup'],
            },
          ],
        },
      },
      beforeSaves: [],
      afterSaves: [],
    });

    expect(observed.succession).toMatchObject({
      pendingProposals: 2,
      attempts: 3,
      completions: 2,
    });
  });

  it('adapts a production interval result without changing selected throughput semantics', async () => {
    const { campaign, saves } = productionFixture();
    const result = await simulateCampaignWorldInterval({
      campaign,
      saves,
      interval: 'one_week',
      commit: true,
      now: '2026-06-01T00:00:00.000Z',
    });
    const updates = new Map(
      (result.settlementUpdates || []).map((update) => [String(update.saveId), update]),
    );
    const afterSaves = saves.map((save) => {
      const update = updates.get(String(save.id));
      return update ? { ...save, settlement: update.settlement } : save;
    });
    const observed = observeBehavioralYear({
      year: 1,
      result,
      beforeSaves: saves,
      afterSaves,
    });

    expect(result.status).toBe('complete');
    expect(observed.eventCount).toBe(result.selected.length);
    expect(observed.majorEventCount).toBe(result.majors.length);
    expect(observed.eventTypeCounts).toEqual(expect.any(Object));
    expect(observed.causal).toEqual(expect.objectContaining({
      crossFamilyEdges: expect.any(Number),
      familyPairs: expect.any(Array),
    }));
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
      schemaVersion: BEHAVIORAL_OBSERVATION_VERSION,
      kind: 'whole_world_behavioral_observation',
      settlementIds: ['a'],
      yearly: [{ year: 1 }],
      controls: {},
    });
  });
});
