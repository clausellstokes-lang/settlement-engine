import { describe, expect, test } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import {
  hasRumorLedgers,
  settlementRumors,
} from '../../src/domain/display/settlementRumors.js';
import { buildRealmItemReadModel } from '../../src/domain/realm/realmItemReadModel.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { advanceRumorLedgers } from '../../src/domain/spatial/rumorNetwork.js';
import {
  applyWorldPulseOutcomes,
  applyWorldPulseProposal,
} from '../../src/domain/worldPulse/applyWorldPulse.js';
import { collapseIntervalHistory } from '../../src/domain/worldPulse/advanceInterval.js';
import {
  evaluateWorldPulseRules,
  resolveCandidateConflicts,
  rollCandidates,
  suppressEquivalentPendingProposalCandidates,
  supersedeLegacyRecordModeProposals,
} from '../../src/domain/worldPulse/candidateEvents.js';
import { pactCooldownPairs } from '../../src/domain/worldPulse/deityStanceLane.js';
import { pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { mechanicalPulseRecordFields } from '../../src/domain/worldPulse/pulseOutcomePartition.js';
import {
  compactOutcomeForHistory,
  isPublicOutcome,
  outcomesForMechanicalHistory,
  RECORD_MODE_PROPOSAL_VERSION,
} from '../../src/domain/worldPulse/pulseHelpers.js';
import { chronicleMomentum } from '../../src/domain/worldPulse/religionLegitimacy.js';
import { buildRelationshipPostures } from '../../src/domain/worldPulse/relationshipMemory.js';
import {
  newsEntryForOutcome,
  stateOnlyRumorSeedsFromHistory,
} from '../../src/domain/worldPulse/worldPulseFeedCuration.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-08T00:00:00.000Z';

function town() {
  return {
    name: 'Ashford',
    tier: 'town',
    population: 1_500,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Moderate', primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [],
    activeConditions: [],
  };
}

function populationOutcome(recordMode) {
  return {
    id: 'candidate.population.growth.ashford.1',
    type: 'population',
    candidateType: 'population_growth',
    ruleId: 'population_growth',
    ruleFamily: 'population',
    targetSaveId: 'ashford',
    severity: 0.2,
    probability: 1,
    applyMode: 'auto',
    ...(recordMode ? { recordMode } : {}),
    headline: 'Ashford population may grow',
    summary: 'Ashford gains twelve people.',
    reasons: ['Food and trade are stable.'],
    populationDeltas: [{ saveId: 'ashford', delta: 12, reason: 'Organic growth.' }],
    generatedAtTick: 1,
  };
}

function warExhaustionOutcome(recordMode) {
  return {
    id: 'world_outcome.war_exhaustion.ashford.1',
    type: 'condition',
    candidateType: 'war_exhaustion',
    ruleId: 'war_exhaustion',
    ruleFamily: 'war',
    targetSaveId: 'ashford',
    severity: 0.9,
    probability: 1,
    applyMode: 'auto',
    ...(recordMode ? { recordMode } : {}),
    headline: 'Ashford is exhausted by war',
    summary: 'The long campaign has drained the town.',
    reasons: ['The army has remained deployed too long.'],
    condition: {
      archetype: 'war_exhaustion',
      severity: 0.9,
      triggeredAt: {
        tick: 1,
        sourceEventType: 'WAR_LAYER',
        sourceEventTargetId: 'ashford',
      },
    },
  };
}

function applyOne(outcome) {
  const graph = ensureRegionalGraph(
    { nodes: [{ id: 'ashford', name: 'Ashford' }] },
    { now: NOW },
  );
  return applyWorldPulseOutcomes({
    snapshot: {
      campaign: {},
      regionalGraph: graph,
      settlements: [{ id: 'ashford', name: 'Ashford', settlement: town() }],
    },
    worldState: { stressors: [], npcStates: {}, proposals: [] },
    regionalGraph: graph,
    wizardNews: { currentTick: 0, entries: [] },
    settlementMap: new Map([[
      'ashford',
      { saveId: 'ashford', save: { name: 'Ashford' }, settlement: town() },
    ]]),
    outcomes: [outcome],
    tick: 1,
    now: NOW,
    simulationRules: { propagationMode: 'off' },
  });
}

describe('world-pulse record modes — central lanes', () => {
  test('state-only applies identical settlement/world mechanics and suppresses only its direct headline', () => {
    const ordinaryOutcome = populationOutcome();
    const mechanicalOutcome = populationOutcome('state_only');
    const ordinary = applyOne(ordinaryOutcome);
    const mechanical = applyOne(mechanicalOutcome);

    expect(mechanical.settlementUpdates).toEqual(ordinary.settlementUpdates);
    expect(mechanical.worldState).toEqual(ordinary.worldState);
    expect(mechanical.regionalGraph).toEqual(ordinary.regionalGraph);
    expect(mechanical.autoApplied).toHaveLength(1);
    expect(mechanical.autoApplied[0]).toMatchObject({
      id: mechanicalOutcome.id,
      applyMode: 'auto',
      recordMode: 'state_only',
    });
    expect(mechanical.proposals).toEqual([]);
    expect(ordinary.newsEntries.some(entry => entry.sourceEventId === ordinaryOutcome.id)).toBe(true);
    expect(mechanical.newsEntries.some(entry => entry.sourceEventId === mechanicalOutcome.id)).toBe(false);

    const publicOrdinary = [ordinaryOutcome].filter(isPublicOutcome);
    const publicMechanical = [mechanicalOutcome].filter(isPublicOutcome);
    expect(publicOrdinary).toHaveLength(1);
    expect(publicMechanical).toHaveLength(0);
  });

  test('a hidden direct headline remains an internal rumor seed across later ticks', () => {
    const ordinary = applyOne(warExhaustionOutcome());
    const mechanical = applyOne(warExhaustionOutcome('state_only'));
    const ordinarySeed = ordinary.newsEntries.find(entry => (
      entry.sourceEventId === 'world_outcome.war_exhaustion.ashford.1'
    ));
    const mechanicalSeed = mechanical.rumorSeedEntries?.[0];

    expect(ordinarySeed).toBeTruthy();
    expect(mechanical.newsEntries.some(entry => entry.sourceEventId === ordinarySeed.sourceEventId))
      .toBe(false);
    const { recordMode: _recordMode, ...mechanicalSeedLegacyShape } = mechanicalSeed;
    expect(mechanicalSeedLegacyShape).toEqual(ordinarySeed);

    const pack = makeGridPack({ cols: 12, rows: 10 });
    const [placement] = placeSettlements(pack, 1);
    const digest = buildSpatialDigest({
      pack,
      placements: [{ id: 'ashford', cellId: placement.cellId }],
    });
    const drive = entries => {
      let ledgers = null;
      for (let tick = 1; tick <= 2; tick += 1) {
        const result = advanceRumorLedgers({
          worldState: {
            simulationRules: { infoMode: 'perfect_delayed' },
            spatialCanonVersion: 1,
            spatialDigest: digest,
            ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
          },
          feedEntries: entries,
          graph: { channels: [] },
          tick,
          rng: createPRNG(`record-mode-rumor:${tick}`),
        });
        if (result.changed) ledgers = result.next;
      }
      return ledgers;
    };
    const ordinaryRumors = drive([ordinarySeed]);
    const mechanicalRumors = drive([mechanicalSeed]);
    expect(mechanicalRumors?.ashford).toBeTruthy();
    const visibleMarker = Object.values(mechanicalRumors.ashford)
      .map(record => record.content?.visibility);
    expect(visibleMarker).toEqual(['mechanical']);

    const stripVisibility = ledgers => Object.fromEntries(
      Object.entries(ledgers).map(([settlementId, ledger]) => [
        settlementId,
        Object.fromEntries(Object.entries(ledger).map(([key, record]) => {
          const { visibility: _visibility, ...content } = record.content;
          return [key, { ...record, content }];
        })),
      ]),
    );
    expect(stripVisibility(mechanicalRumors)).toEqual(ordinaryRumors);

    const mechanicalWorld = {
      tick: 2,
      spatialLedgers: { rumorLedgers: mechanicalRumors },
    };
    expect(settlementRumors({
      worldState: mechanicalWorld,
      settlementId: 'ashford',
      includeGroundTruth: true,
    })).toEqual([]);
    expect(hasRumorLedgers(mechanicalWorld)).toBe(false);
    expect(settlementRumors({
      worldState: { tick: 2, spatialLedgers: { rumorLedgers: ordinaryRumors } },
      settlementId: 'ashford',
    })).toHaveLength(1);
  });

  test('recent hidden seeds survive delayed info-mode activation and retain metronome curation', () => {
    const visibleWar = applyOne(warExhaustionOutcome()).newsEntries[0];
    const hiddenWar = compactOutcomeForHistory(warExhaustionOutcome('state_only'));
    const reconstructed = stateOnlyRumorSeedsFromHistory([{
      tick: 1,
      selectedOutcomes: [],
      mechanicalOutcomes: [hiddenWar],
      consequenceOutcomes: [hiddenWar],
    }], []);
    expect(reconstructed).toEqual([{ ...visibleWar, recordMode: 'state_only' }]);

    const driftAt = tick => compactOutcomeForHistory({
      ...populationOutcome('state_only'),
      id: `candidate.population.growth.ashford.${tick}`,
      generatedAtTick: tick,
    });
    const driftSeeds = stateOnlyRumorSeedsFromHistory([1, 2, 7].map(tick => ({
      tick,
      selectedOutcomes: [],
      mechanicalOutcomes: [driftAt(tick)],
      consequenceOutcomes: [driftAt(tick)],
    })), []);
    expect(driftSeeds.map(entry => entry.tick)).toEqual([1, 7]);
  });

  test('the audit cap cannot crowd a later rumor seed out of the private replay horizon', () => {
    const outcomes = Array.from({ length: 61 }, (_, index) => ({
      ...populationOutcome('state_only'),
      id: `mechanical.population.town-${index}.1`,
      targetSaveId: `town-${index}`,
    }));
    const seeds = outcomes.map((outcome, index) => ({
      id: `wizard_news.1.world_pulse.applied.${outcome.id}`,
      tick: 1,
      kind: 'applied',
      impactKind: index === 60 ? 'war_exhaustion' : 'population_growth',
      headline: index === 60 ? 'The last town is exhausted by war' : `Town ${index} grows`,
      sourceEventId: outcome.id,
      settlementIds: [outcome.targetSaveId],
      reasons: [],
      score: index === 60 ? 90 : 10,
      recordMode: 'state_only',
    }));
    const fields = mechanicalPulseRecordFields({
      applied: { autoApplied: outcomes, rumorSeedEntries: seeds },
      selectedForApply: outcomes,
    });
    expect(fields.mechanicalOutcomes).toHaveLength(8);
    expect(fields.consequenceOutcomes).toHaveLength(24);
    expect(fields.mechanicalRumorSeeds).toHaveLength(48);
    expect(fields.mechanicalRumorSeeds.map(entry => entry.sourceEventId))
      .toContain(outcomes[60].id);
    expect(stateOnlyRumorSeedsFromHistory([{ tick: 1, ...fields }], [])
      .map(entry => entry.sourceEventId)).toContain(outcomes[60].id);
  });

  test('authoritative seed replay never resurrects receipts evicted by its 48-row bound', () => {
    const outcomes = Array.from({ length: 60 }, (_, index) => ({
      ...populationOutcome('state_only'),
      id: `mechanical.population.bounded-${index}.1`,
      targetSaveId: `bounded-${index}`,
    }));
    const seeds = outcomes.map(outcome => ({
      ...newsEntryForOutcome(outcome, 1, 'applied'),
      recordMode: 'state_only',
    }));
    const fields = mechanicalPulseRecordFields({
      applied: { autoApplied: outcomes, rumorSeedEntries: seeds },
      selectedForApply: outcomes,
    });
    const replayedIds = stateOnlyRumorSeedsFromHistory(
      [{ tick: 1, ...fields }],
      [],
    ).map(entry => entry.sourceEventId);
    const storedIds = fields.mechanicalRumorSeeds.map(entry => entry.sourceEventId);

    expect(storedIds).toHaveLength(48);
    expect(replayedIds).toEqual(storedIds);
    expect(replayedIds).not.toEqual(expect.arrayContaining(
      outcomes.slice(48).map(outcome => outcome.id),
    ));
  });

  test('an explicit empty authoritative seed field suppresses receipt reconstruction', () => {
    const hidden = compactOutcomeForHistory(populationOutcome('state_only'));
    const fields = mechanicalPulseRecordFields({
      applied: { autoApplied: [hidden] },
      selectedForApply: [hidden],
    });
    expect(fields.mechanicalRumorSeeds).toEqual([]);
    const history = [{
      tick: 1,
      ...fields,
    }, {
      tick: 2,
    }];
    expect(stateOnlyRumorSeedsFromHistory(history, [])).toEqual([]);

    const collapsed = collapseIntervalHistory({ pulseHistory: history }, 2, { entries: [] });
    expect(collapsed.pulseHistory[0].mechanicalRumorSeeds).toEqual([]);
    expect(stateOnlyRumorSeedsFromHistory(collapsed.pulseHistory, [])).toEqual([]);
  });

  test('low-score replay memory still suppresses the same louder metronome beat after collapse', () => {
    const lowOutcomes = Array.from({ length: 30 }, (_, index) => ({
      ...populationOutcome('state_only'),
      id: `candidate.population.growth.town-${index}.1`,
      targetSaveId: `town-${index}`,
      populationDeltas: [{
        saveId: `town-${index}`,
        delta: 12,
        reason: 'Organic growth.',
      }],
    }));
    const lowSeeds = lowOutcomes.map(outcome => ({
      ...newsEntryForOutcome(outcome, 1, 'applied'),
      recordMode: 'state_only',
    }));
    const fields = mechanicalPulseRecordFields({
      applied: { autoApplied: lowOutcomes, rumorSeedEntries: lowSeeds },
      selectedForApply: lowOutcomes,
    });
    const target = lowOutcomes[29];
    const louder = compactOutcomeForHistory({
      ...target,
      id: 'candidate.population.growth.town-29.2',
      severity: 0.9,
      generatedAtTick: 2,
    });
    expect(fields.consequenceOutcomes).toHaveLength(24);
    expect(fields.mechanicalRumorSeeds).toHaveLength(30);
    expect(fields.mechanicalRumorSeeds[29].score).toBeLessThan(60);
    const collapsed = collapseIntervalHistory({
      pulseHistory: [{
        tick: 1,
        ...fields,
      }, {
        tick: 2,
        consequenceOutcomes: [louder],
      }],
    }, 2, { entries: [] });
    const sourceIds = collapsed.pulseHistory[0].mechanicalRumorSeeds
      .map(entry => entry.sourceEventId);
    expect(sourceIds).toContain(target.id);
    expect(sourceIds).not.toContain(louder.id);
  });

  test('interval collapse carries the bounded hidden lookback into later info-mode activation', () => {
    const pulseHistory = [1, 2, 3, 4].map(tick => {
      const outcome = compactOutcomeForHistory({
        ...warExhaustionOutcome('state_only'),
        id: `world_outcome.war_exhaustion.ashford.${tick}`,
      });
      return {
        tick,
        selectedOutcomes: [],
        mechanicalOutcomes: [outcome],
        consequenceOutcomes: [outcome],
      };
    });
    const collapsed = collapseIntervalHistory(
      { pulseHistory },
      4,
      { entries: [] },
    );
    expect(collapsed.pulseHistory).toHaveLength(1);
    expect(collapsed.pulseHistory[0].mechanicalRumorSeeds.map(entry => entry.tick))
      .toEqual([1, 2, 3, 4]);

    const reconstructed = stateOnlyRumorSeedsFromHistory(
      collapsed.pulseHistory,
      [],
    );
    const pack = makeGridPack({ cols: 12, rows: 10 });
    const [placement] = placeSettlements(pack, 1);
    const digest = buildSpatialDigest({
      pack,
      placements: [{ id: 'ashford', cellId: placement.cellId }],
    });
    const enabled = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode: 'perfect_delayed' },
        spatialCanonVersion: 1,
        spatialDigest: digest,
      },
      feedEntries: reconstructed,
      graph: { channels: [] },
      tick: 4,
      rng: createPRNG('delayed-enable-after-collapse'),
    });
    expect(enabled.next?.ashford).toBeTruthy();
    expect(Object.values(enabled.next.ashford)[0].content.visibility)
      .toBe('mechanical');
  });

  test('interval collapse carries interior envoy evidence once in chronological producer-id order', () => {
    const departed = { id: 'envoy.evidence.departed', kind: 'envoy_departed', tick: 1 };
    const silence = { id: 'envoy.evidence.silence', kind: 'envoy_silence_inference', tick: 2 };
    const home = { id: 'envoy.evidence.home', kind: 'envoy_home', tick: 3 };
    const collapsed = collapseIntervalHistory({
      pulseHistory: [
        { tick: 1, envoyEvidence: [departed] },
        { tick: 2, envoyEvidence: [silence, departed] },
        { tick: 3, envoyEvidence: [home, silence] },
        { tick: 4 },
      ],
    }, 4, { entries: [] });
    expect(collapsed.pulseHistory).toHaveLength(1);
    expect(collapsed.pulseHistory[0].envoyEvidence).toEqual([departed, silence, home]);

    const empty = collapseIntervalHistory({ pulseHistory: [{ tick: 1 }, { tick: 2 }] }, 2, { entries: [] });
    expect(empty.pulseHistory[0]).not.toHaveProperty('envoyEvidence');
  });

  test('interval collapse cannot let low-score reconstructed rows crowd out a significant seed', () => {
    const lowOutcomes = Array.from({ length: 72 }, (_, index) =>
      compactOutcomeForHistory({
        ...populationOutcome('state_only'),
        id: `mechanical.population.low-${index}.1`,
        targetSaveId: `low-${index}`,
      }));
    const high = {
      id: 'wizard_news.1.world_pulse.applied.mechanical.war.high',
      tick: 1,
      kind: 'applied',
      significance: 'major',
      score: 90,
      impactKind: 'war_exhaustion',
      headline: 'A war-weary realm crosses a threshold',
      sourceEventId: 'mechanical.war.high',
      settlementIds: ['ashford'],
      reasons: [],
      recordMode: 'state_only',
    };
    const history = [1, 2, 3].map((tick, index) => ({
      tick,
      selectedOutcomes: [],
      consequenceOutcomes: lowOutcomes.slice(index * 24, index * 24 + 24),
      ...(index === 0 ? { mechanicalRumorSeeds: [high] } : {}),
    }));
    const collapsed = collapseIntervalHistory(
      { pulseHistory: history },
      3,
      { entries: [] },
    );
    expect(collapsed.pulseHistory[0].mechanicalRumorSeeds).toHaveLength(48);
    expect(collapsed.pulseHistory[0].mechanicalRumorSeeds.map(entry => entry.sourceEventId))
      .toContain(high.sourceEventId);
  });

  test('interval carry slots cannot be consumed by seeds already durable in survivors', () => {
    const seedsAt = (prefix, tick) => Array.from({ length: 48 }, (_, index) => ({
      id: `wizard_news.${tick}.world_pulse.applied.${prefix}.${index}`,
      tick,
      kind: 'applied',
      significance: 'major',
      score: 90,
      impactKind: 'war_exhaustion',
      headline: `${prefix} ${index}`,
      sourceEventId: `${prefix}.${index}`,
      settlementIds: ['ashford'],
      reasons: [],
      recordMode: 'state_only',
    }));
    const survivorSeeds = seedsAt('survivor', 1);
    const interiorSeeds = seedsAt('interior', 2);
    const collapsed = collapseIntervalHistory({
      pulseHistory: [
        { tick: 1, mechanicalRumorSeeds: survivorSeeds },
        { tick: 2, mechanicalRumorSeeds: interiorSeeds },
        { tick: 3 },
      ],
    }, 2, { entries: [] });
    expect(collapsed.pulseHistory.map(record => record.tick)).toEqual([1, 3]);
    const carried = collapsed.pulseHistory[1].mechanicalRumorSeeds
      .map(entry => entry.sourceEventId);
    expect(carried).toHaveLength(48);
    expect(carried).toEqual(interiorSeeds.map(entry => entry.sourceEventId));
    expect(carried.some(id => id.startsWith('survivor.'))).toBe(false);
  });

  test('interval collapse retains survivor curation context without inventing a suppressed repeat', () => {
    const firstBeat = populationOutcome('state_only');
    const survivorSeed = {
      ...newsEntryForOutcome(firstBeat, 1, 'applied'),
      recordMode: 'state_only',
    };
    const louderRepeat = compactOutcomeForHistory({
      ...firstBeat,
      id: 'candidate.population.growth.ashford.2',
      severity: 0.9,
      generatedAtTick: 2,
    });
    const collapsed = collapseIntervalHistory({
      pulseHistory: [
        { tick: 1, mechanicalRumorSeeds: [survivorSeed] },
        { tick: 2, consequenceOutcomes: [louderRepeat] },
        { tick: 3 },
      ],
    }, 2, { entries: [] });

    expect(collapsed.pulseHistory.map(record => record.tick)).toEqual([1, 3]);
    expect(collapsed.pulseHistory[1].mechanicalRumorSeeds).toBeUndefined();
    expect(stateOnlyRumorSeedsFromHistory(collapsed.pulseHistory, [])
      .map(entry => entry.sourceEventId)).toEqual([firstBeat.id]);
  });

  test('suppression-only wins normal conflict arbitration, then takes no roll or apply slot', () => {
    const suppression = {
      id: 'strategy.hold.ashford.1',
      candidateType: 'strategy_hold',
      applyMode: 'auto',
      probability: 1,
      severity: 0.9,
      recordMode: 'suppression_only',
      targetSaveId: 'ashford',
      conflictTags: ['strategy:ashford'],
    };
    const raid = {
      id: 'raid.ashford.1',
      candidateType: 'relationship_raid',
      applyMode: 'auto',
      probability: 1,
      severity: 0.4,
      targetSaveId: 'ashford',
      conflictTags: ['strategy:ashford'],
    };
    const resolved = resolveCandidateConflicts([raid, suppression]);
    expect(resolved.map(candidate => candidate.id)).toEqual([suppression.id]);

    const rng = { random: () => { throw new Error('suppression-only must not roll'); } };
    expect(rollCandidates(resolved, rng, { maxAuto: 0, maxProposals: 0 }))
      .toEqual({ selected: [], rollExplanations: [], deferred: [] });
    expect(applyOne(suppression).autoApplied).toEqual([]);
  });

  test('pre-v4 pending proposal copies cannot dedupe v4 state/suppression lanes', () => {
    const base = {
      candidateType: 'strategy_hold',
      targetSaveId: 'ashford',
      applyMode: 'auto',
      probability: 1,
      severity: 0.5,
      metadata: { settlementId: 'ashford', strategyMove: 'hold' },
      conflictTags: ['strategy:ashford'],
    };
    const stateOnly = {
      ...base,
      id: 'mechanical.context.5',
      candidateType: 'npc_goal_rebranch',
      recordMode: 'state_only',
      npcId: 'ashford:clerk',
      npcPatch: {
        shortGoal: 'survive_crisis',
        longGoal: 'restore_order',
        goalProgress: { short: 0, long: 0 },
        contextSignature: 'town|local|war_pressure',
        contextTier: 'town',
        momentum: 0.08,
        lastActedTick: 5,
        lastAction: 'goal_rebranch',
      },
      metadata: {
        previousContext: 'town|local|famine',
        nextContext: 'town|local|war_pressure',
      },
      conflictTags: [
        'npc:ashford:clerk',
        'settlement:ashford:npc_goal_rebranch',
      ],
    };
    const suppressionOnly = {
      ...base,
      id: 'strategy.hold.ashford.5',
      recordMode: 'suppression_only',
    };
    const publicCopy = {
      ...base,
      id: 'public.strategy.deploy.5',
      candidateType: 'strategy_deploy',
      metadata: { settlementId: 'ashford', strategyMove: 'deploy' },
    };
    const goalChangingCopy = {
      ...stateOnly,
      id: 'pre-v4.goal-changing',
      recordMode: undefined,
      applyMode: 'proposal',
      npcPatch: {
        ...stateOnly.npcPatch,
        shortGoal: 'rally_defenders',
        longGoal: 'win_the_war',
      },
    };
    const largePopulationCopy = {
      ...populationOutcome(),
      id: 'pre-v4.population-major',
      applyMode: 'proposal',
      populationDeltas: [{ saveId: 'ashford', delta: 200, reason: 'A major migration.' }],
    };
    const { recordMode: _stateMode, ...legacyStateOnly } = stateOnly;
    const { recordMode: _suppressionMode, ...legacySuppressionOnly } = suppressionOnly;
    const worldState = {
      proposals: [
        { id: 'proposal.state', status: 'pending', outcome: { ...legacyStateOnly, id: 'pre-v4.state', applyMode: 'proposal' } },
        { id: 'proposal.suppression', status: 'pending', outcome: { ...legacySuppressionOnly, id: 'pre-v4.suppression', applyMode: 'proposal' } },
        { id: 'proposal.public', status: 'pending', outcome: { ...publicCopy, id: 'pre-v4.public' } },
        { id: 'proposal.goal-changing', status: 'pending', outcome: goalChangingCopy },
        { id: 'proposal.population-major', status: 'pending', outcome: largePopulationCopy },
      ],
    };
    const kept = suppressEquivalentPendingProposalCandidates(
      [stateOnly, suppressionOnly, publicCopy],
      worldState,
    );
    expect(kept).toEqual([stateOnly, suppressionOnly]);

    const reconciled = supersedeLegacyRecordModeProposals(
      worldState,
      { tick: 5, now: NOW },
    );
    expect(reconciled.proposals.slice(0, 2)).toEqual([
      expect.objectContaining({
        id: 'proposal.state',
        status: 'superseded',
        supersededAt: NOW,
        supersededAtTick: 5,
        supersessionReason: 'record_mode_upgrade',
      }),
      expect.objectContaining({
        id: 'proposal.suppression',
        status: 'superseded',
        supersededAt: NOW,
        supersededAtTick: 5,
        supersessionReason: 'record_mode_upgrade',
      }),
    ]);
    expect(reconciled.proposals.slice(2).map(proposal => proposal.status))
      .toEqual(['pending', 'superseded', 'pending']);

    // Unsafe legacy families retire even when their current transition no
    // longer emits; otherwise the old row could remain clickable indefinitely.
    const noCurrentCandidate = supersedeLegacyRecordModeProposals(
      worldState,
      { tick: 5, now: NOW },
    );
    expect(noCurrentCandidate.proposals.map(proposal => proposal.status))
      .toEqual(['superseded', 'superseded', 'pending', 'superseded', 'pending']);
  });

  test('direct Apply fail-closes ambiguous pre-v4 rows before any advance, while v4 public rows remain approvable', () => {
    const legacyOutcome = {
      id: 'pre-v4.strategy.hold',
      candidateType: 'strategy_hold',
      targetSaveId: 'ashford',
      applyMode: 'proposal',
      metadata: { settlementId: 'ashford', strategyMove: 'hold' },
      conflictTags: ['strategy:ashford'],
      headline: 'Ashford holds',
      summary: 'No strategic change.',
    };
    const campaign = {
      worldState: {
        tick: 5,
        proposals: [{ id: 'legacy', status: 'pending', tick: 4, outcome: legacyOutcome }],
        wizardNews: {
          currentTick: 5,
          entries: [{
            id: `wizard_news.4.world_pulse.proposal.${legacyOutcome.id}`,
            kind: 'queued',
            sourceEventId: legacyOutcome.id,
            tags: ['world_pulse', 'strategy_hold', 'proposal'],
          }],
        },
      },
      regionalGraph: ensureRegionalGraph({}, { now: NOW }),
      wizardNews: {
        currentTick: 5,
        entries: [{
          id: `wizard_news.4.world_pulse.proposal.${legacyOutcome.id}`,
          kind: 'queued',
          sourceEventId: legacyOutcome.id,
          tags: ['world_pulse', 'strategy_hold', 'proposal'],
        }, {
          id: 'wizard_news.4.applied.unrelated',
          kind: 'applied',
          sourceEventId: 'unrelated',
          tags: ['world_pulse', 'applied'],
        }],
      },
    };
    const refused = applyWorldPulseProposal({
      campaign,
      saves: [{ id: 'ashford', settlement: town() }],
      proposalId: 'legacy',
      now: NOW,
    });
    expect(refused).toMatchObject({
      proposalDisposition: 'superseded',
      settlementUpdates: [],
      autoApplied: [],
      newsEntries: [],
    });
    expect(refused.worldState.proposals[0]).toMatchObject({
      status: 'superseded',
      supersessionReason: 'record_mode_upgrade_apply_guard',
      supersededAt: NOW,
    });
    expect(refused.wizardNews.entries.map(entry => entry.sourceEventId)).toEqual(['unrelated']);
    expect(refused.worldState.wizardNews.entries).toEqual([]);

    const staleNpcCampaign = {
      ...campaign,
      worldState: {
        ...campaign.worldState,
        proposals: [{
          id: 'legacy-npc',
          status: 'pending',
          tick: 4,
          outcome: {
            id: 'pre-v4.npc.rebranch',
            candidateType: 'npc_goal_rebranch',
            targetSaveId: 'ashford',
            npcId: 'ashford:clerk',
            applyMode: 'proposal',
            npcPatch: { shortGoal: 'survive_crisis', longGoal: 'restore_order' },
          },
        }],
      },
    };
    expect(applyWorldPulseProposal({
      campaign: staleNpcCampaign,
      saves: [{ id: 'ashford', settlement: town() }],
      proposalId: 'legacy-npc',
      now: NOW,
    })).toMatchObject({
      proposalDisposition: 'superseded',
      worldState: {
        proposals: [expect.objectContaining({ id: 'legacy-npc', status: 'superseded' })],
      },
    });

    const proposalOutcome = {
      ...populationOutcome(),
      id: 'candidate.population.major.ashford.5',
      applyMode: 'proposal',
      recordMode: undefined,
      populationDeltas: [{ saveId: 'ashford', delta: 200, reason: 'A major migration.' }],
    };
    const minted = applyOne(proposalOutcome);
    expect(minted.proposals[0]).toMatchObject({
      status: 'pending',
      recordModeVersion: RECORD_MODE_PROPOSAL_VERSION,
    });
    const currentCampaign = {
      worldState: minted.worldState,
      regionalGraph: minted.regionalGraph,
      wizardNews: minted.wizardNews,
    };
    const approved = applyWorldPulseProposal({
      campaign: currentCampaign,
      saves: [{ id: 'ashford', settlement: town() }],
      proposalId: minted.proposals[0].id,
      now: NOW,
    });
    expect(approved.proposalDisposition).toBeUndefined();
    expect(approved.worldState.proposals[0].status).toBe('applied');
    expect(approved.settlementUpdates[0].settlement.population).toBe(1_700);
  });

  test('a real kernel tick retires both sides of an obsolete proposal/news projection', () => {
    const outcome = {
      id: 'candidate.strategy.hold.a.1',
      candidateType: 'strategy_hold',
      targetSaveId: 'a',
      applyMode: 'proposal',
      headline: 'Hold the line',
    };
    const entry = {
      id: `wizard_news.1.world_pulse.proposal.${outcome.id}`,
      tick: 1,
      scope: 'settlement',
      significance: 'notable',
      score: 50,
      headline: 'Hold the line',
      summary: '',
      kind: 'queued',
      impactKind: 'strategy_hold',
      channelType: null,
      severity: 0.5,
      settlementIds: ['a'],
      impactIds: [],
      channelIds: [],
      sourceEventId: outcome.id,
      tags: ['world_pulse', 'strategy_hold', 'proposal'],
      reasons: [],
    };
    const campaign = {
      id: 'record-mode-upgrade',
      settlementIds: [],
      worldState: {
        rngSeed: 'record-mode-upgrade',
        tick: 1,
        proposals: [{ id: 'legacy-hold', status: 'pending', tick: 1, outcome }],
      },
      wizardNews: {
        schemaVersion: 1,
        currentTick: 1,
        entries: [entry],
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    };
    const result = simulateCampaignWorldPulse({
      campaign,
      saves: [],
      interval: 'one_week',
      now: NOW,
    });
    expect(result.worldState.proposals[0]).toMatchObject({
      id: 'legacy-hold',
      status: 'superseded',
      supersessionReason: 'record_mode_upgrade',
    });
    expect(result.wizardNews.entries.some(news =>
      news.kind === 'queued' && news.sourceEventId === outcome.id)).toBe(false);

    const realm = buildRealmItemReadModel({
      ...campaign,
      worldState: result.worldState,
      wizardNews: result.wizardNews,
    }, { saves: [] });
    expect(realm.items.find(item => item.source.classes.includes('proposal'))?.resolution.state)
      .toBe('superseded');
    expect(realm.items.some(item =>
      item.source.classes.includes('wizard_news')
      && item.resolution.state === 'unresolved'
      && item.source.records.some(record => record.record.sourceEventId === outcome.id)))
      .toBe(false);
  });

  test('a real population tick audits mechanical work without public counts or rolls', () => {
    const settlement = {
      ...town(),
      tier: 'city',
      economicState: {
        prosperity: 'Prosperous',
        primaryExports: [],
        primaryImports: [],
      },
      powerStructure: {
        publicLegitimacy: { score: 70, label: 'Approved' },
        factions: [],
        conflicts: [],
      },
    };
    const campaign = {
      id: 'population-record-mode',
      settlementIds: ['ashford'],
      worldState: {
        rngSeed: 'population-record-mode',
        tick: 0,
        simulationRules: {
          presetId: 'custom',
          intensity: 'normal',
          populationDynamicsEnabled: true,
        },
      },
      regionalGraph: ensureRegionalGraph({
        nodes: [{ id: 'ashford', name: 'Ashford' }],
      }, { now: NOW }),
      wizardNews: { currentTick: 0, entries: [] },
    };
    const result = simulateCampaignWorldPulse({
      campaign,
      saves: [{
        id: 'ashford',
        name: 'Ashford',
        phase: 'canon',
        settlement,
        campaignState: { phase: 'canon', eventLog: [], locks: {} },
      }],
      interval: 'one_week',
      now: NOW,
    });
    const growth = result.autoApplied.find(outcome =>
      outcome.candidateType === 'population_growth');
    expect(growth).toMatchObject({ recordMode: 'state_only', applyMode: 'auto' });
    expect(result.selected).not.toContainEqual(expect.objectContaining({ id: growth.id }));
    expect(result.pulseRecord).toMatchObject({
      selectedCount: 0,
      autoAppliedCount: 0,
      selectedOutcomes: [],
      mechanicalOutcomeCount: 1,
      mechanicalOutcomes: [expect.objectContaining({ id: growth.id })],
      consequenceOutcomes: [expect.objectContaining({ id: growth.id })],
    });
    expect(result.pulseRecord.candidateCount)
      .toBe(result.candidates.filter(isPublicOutcome).length);
    expect(result.rollExplanations.some(explanation =>
      explanation.candidateType === 'population_growth')).toBe(false);
    expect(result.wizardNews.entries.some(entry =>
      entry.sourceEventId === growth.id)).toBe(false);
  });

  test('state-only bypasses authority proposal routing, proposal/auto budgets, and tempo deferral but still rolls', () => {
    const npc = {
      npcId: 'ashford:clerk',
      settlementId: 'ashford',
      name: 'Tam Ledgerwell',
      roleArchetype: 'civic',
      factionId: 'council',
      factionSeat: 'agent_protege',
      dotRank: 1,
      influenceBasis: ['bureaucracy'],
      contextSignature: 'town|local|famine',
      contextTier: 'town',
      shortGoal: 'survive_crisis',
      longGoal: 'restore_order',
      ideal: 'order',
      flaw: 'pride',
      ambition: 0.2,
      loyalty: 0.5,
      momentum: 0,
      corruption: false,
      goalProgress: { short: 0.7, long: 0.4 },
      rivalryTargets: [],
    };
    const activeConditions = [{ archetype: 'war_pressure', label: 'Wartime pressure' }];
    for (const politicalAutonomy of ['dm_only', 'recommendations']) {
      const simulationRules = {
        presetId: 'static_campaign',
        npcAgencyEnabled: true,
        politicalAutonomy,
      };
      const snapshot = {
        worldState: {
          tick: 4,
          npcStates: { [npc.npcId]: npc },
          relationshipStates: {},
          simulationRules,
        },
        regionalGraph: { edges: [] },
        settlements: [{
          id: 'ashford',
          name: 'Ashford',
          settlement: { ...town(), npcs: [], activeConditions },
          activeConditions,
        }],
      };
      const candidates = evaluateWorldPulseRules(snapshot, {
        tick: 5,
        pressureIndex: pressureIndex([]),
        simulationRules,
      });
      const rebranch = candidates.find(candidate => candidate.candidateType === 'npc_goal_rebranch');
      expect(rebranch).toMatchObject({ recordMode: 'state_only', applyMode: 'auto' });

      let rolls = 0;
      const result = rollCandidates(candidates, {
        random: () => {
          rolls += 1;
          return 0;
        },
      }, {
        maxAuto: 0,
        maxProposals: 0,
        tempo: { active: true },
      });
      expect(result.selected).toContainEqual(expect.objectContaining({
        id: rebranch.id,
        recordMode: 'state_only',
        applyMode: 'auto',
      }));
      expect(result.deferred).toEqual([]);
      expect(rolls).toBe(1);
    }

    // Future non-guaranteed mechanics retain their identity roll, but neither
    // consume nor respect public auto throughput.
    const stateOnly = {
      id: 'mechanical.probe',
      candidateType: 'mechanical_probe',
      recordMode: 'state_only',
      applyMode: 'proposal',
      probability: 0.5,
      severity: 0.2,
    };
    const publicEvent = {
      id: 'public.probe',
      candidateType: 'public_probe',
      applyMode: 'auto',
      probability: 0.5,
      severity: 0.2,
    };
    const result = rollCandidates([stateOnly, publicEvent], { random: () => 0 }, {
      maxAuto: 1,
      maxProposals: 0,
    });
    expect(result.selected.map(candidate => [candidate.id, candidate.applyMode]))
      .toEqual([['mechanical.probe', 'auto'], ['public.probe', 'auto']]);
  });
});

describe('world-pulse record modes — exact next-tick consequence parity', () => {
  const consequence = {
    id: 'mechanical.relationship.10',
    type: 'relationship',
    candidateType: 'relationship_raid',
    ruleId: 'religious_pact_formation',
    relationshipKey: 'edge.ashford.briar',
    targetSaveId: 'ashford',
    severity: 0.6,
    applyMode: 'auto',
    recordMode: 'state_only',
    tick: 10,
    headline: 'A background state refresh',
    summary: 'The same mechanics land without a public beat.',
    metadata: { incidentType: 'raid', pairKey: 'ashford::briar' },
  };
  const compact = compactOutcomeForHistory(consequence);
  const ordinaryHistory = [{
    tick: 10,
    selectedOutcomes: [compact],
    corruptionEvents: [],
    factionCaptureEvents: [],
  }];
  const splitHistory = [{
    tick: 10,
    selectedOutcomes: [],
    mechanicalOutcomeCount: 1,
    mechanicalOutcomes: [compact],
    consequenceOutcomes: [compact],
    corruptionEvents: [],
    factionCaptureEvents: [],
  }];

  test('the internal consequence window preserves the exact legacy first-24 order and bound', () => {
    const legacy = Array.from({ length: 30 }, (_, index) => ({
      ...compact,
      id: `outcome.${String(index).padStart(2, '0')}`,
      ...(index % 3 === 0 ? { recordMode: 'state_only' } : {}),
    }));
    const splitRecord = {
      selectedOutcomes: legacy.filter(isPublicOutcome).slice(0, 24),
      mechanicalOutcomes: legacy.filter(item => item.recordMode === 'state_only').slice(0, 8),
      consequenceOutcomes: legacy.slice(0, 24),
    };
    expect(outcomesForMechanicalHistory(splitRecord).map(item => item.id))
      .toEqual(legacy.slice(0, 24).map(item => item.id));
    expect(outcomesForMechanicalHistory({ selectedOutcomes: legacy.slice(0, 24) }))
      .toBeDefined();
  });

  test('two-tick history readers produce the same relationship, faith, and cooldown mechanics', () => {
    const graph = {
      edges: [{
        id: consequence.relationshipKey,
        from: 'ashford',
        to: 'briar',
        relationshipType: 'rival',
      }],
    };
    const posture = pulseHistory => buildRelationshipPostures({
      worldState: { tick: 11, pulseHistory, relationshipStates: {} },
      regionalGraph: graph,
      currentTick: 11,
    })[0];
    const ordinaryPosture = posture(ordinaryHistory);
    const splitPosture = posture(splitHistory);
    expect(splitPosture.memoryScore).toBeGreaterThan(0);
    expect(splitPosture).toEqual(ordinaryPosture);

    const deity = {
      name: 'Vark',
      alignmentAxis: 'evil',
      temperamentAxis: 'warlike',
      lawAxis: 'lawful',
    };
    const lens = { temper: 0.7, align: 0.15 };
    const ordinaryMomentum = chronicleMomentum(
      { pulseHistory: ordinaryHistory },
      'ashford',
      deity,
      lens,
    );
    const splitMomentum = chronicleMomentum(
      { pulseHistory: splitHistory },
      'ashford',
      deity,
      lens,
    );
    expect(splitMomentum).toBe(ordinaryMomentum);
    expect(splitMomentum).not.toBe(0);

    expect(pactCooldownPairs({ pulseHistory: splitHistory }, 11))
      .toEqual(pactCooldownPairs({ pulseHistory: ordinaryHistory }, 11));
    expect(pactCooldownPairs({ pulseHistory: splitHistory }, 11))
      .toEqual(new Set(['ashford::briar']));
  });
});
