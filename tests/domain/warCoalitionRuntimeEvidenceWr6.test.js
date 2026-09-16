import { describe, expect, test } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { addRegionalChannels } from '../../src/domain/region/graph.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import {
  applyWorldPulseOutcomes,
  applyWorldPulseProposal,
} from '../../src/domain/worldPulse/applyWorldPulse.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateSettlementStrategyRules } from '../../src/domain/worldPulse/settlementStrategy.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { readCoalitionJoinDecisions } from '../../src/domain/worldPulse/warCoalitionDecision.js';
import {
  coalitionStandingTransitionEvidence,
  readCoalitionStandingFronts,
} from '../../src/domain/worldPulse/warCoalitionPulse.js';
import {
  coalitionLedgerActive,
  readCoalitionExpenditure,
} from '../../src/domain/worldPulse/warCoalitionExpenditure.js';
import { warCoalitionActive } from '../../src/domain/worldPulse/warCoalitionLedger.js';
import { canonicalRelationshipSeed } from '../../src/domain/worldPulse/relationshipEdgeSeed.js';

const NOW = '2026-08-02T00:00:00.000Z';
const LIT = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  coalitionLedgerEnabled: true,
});
const HIGH_ROLL = Object.freeze({
  random: () => 0.999999,
  fork() { return this; },
});

const HOSTILE = Object.freeze({
  id: 'edge.attacker.defender',
  from: 'attacker',
  to: 'defender',
  relationshipType: 'hostile',
});
const DEFENDER_ALLY = Object.freeze({
  id: 'edge.defender.ally',
  from: 'defender',
  to: 'ally',
  relationshipType: 'allied',
});

function save(id, name, {
  tier = 'town',
  population = 5000,
  activeConditions = [],
} = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: {
      name,
      tier,
      population,
      config: { priorityEconomy: 25, priorityMilitary: 35, tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{
          id: `seat-${id}`,
          faction: `${name} Council`,
          category: 'military',
          power: 70,
          isGoverning: true,
        }],
        conflicts: [],
      },
      npcs: [],
      activeConditions,
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function rootDeployment(targetId = 'defender') {
  return {
    targetId,
    sinceTick: 2,
    role: 'siege',
    maxStartStrength: 55,
    currentEffectiveStrength: 55,
    accumulatedAttrition: 0,
    reinforcementFlow: 0,
    deploymentAge: 2,
    manpower: 0.7,
    supplyIntegrity: 0.7,
    morale: 0.7,
    equipmentCondition: 0.7,
    magicSupport: 0.5,
    commandQuality: 0.7,
    foodReserve: 0.7,
    logisticsBurden: 0.1,
    objective: 'conquest',
    returnCondition: 'pending',
    casusReasons: [{
      type: 'grievance',
      score: 0.8,
      receipt: 'The opening wrong still stands.',
      atTick: 2,
    }],
  };
}

function fixture({
  rules = LIT,
  allyPatch = {},
  attackerPatch = {},
  alliedState = {},
} = {}) {
  const saves = [
    save('attacker', 'Ironhold', { tier: 'city', population: 40000, ...attackerPatch }),
    save('defender', 'Thornmere', { tier: 'village', population: 800 }),
    save('ally', 'Brookhaven', { tier: 'town', population: 7000, ...allyPatch }),
  ];
  const worldState = {
    tick: 5,
    rngSeed: 'wr6-runtime-evidence',
    simulationRules: { ...rules },
    deployments: { attacker: rootDeployment() },
    relationshipStates: {
      [HOSTILE.id]: { relationshipType: 'hostile' },
      [DEFENDER_ALLY.id]: { relationshipType: 'allied', ...alliedState },
    },
    spatialLedgers: {
      warReasons: {
        'attacker>defender': {
          reasons: {
            grievance: {
              type: 'grievance',
              score: 0.8,
              sinceTick: 2,
              tick: 5,
              receipt: 'The opening wrong still stands.',
            },
          },
          updatedTick: 5,
        },
      },
    },
  };
  const campaign = {
    id: 'wr6-runtime-evidence-fixture',
    name: 'WR-6 runtime evidence fixture',
    settlementIds: saves.map((row) => row.id),
    worldState,
    regionalGraph: ensureRegionalGraph({
      edges: [HOSTILE, DEFENDER_ALLY],
      channels: [{
        type: 'war_front',
        from: 'attacker',
        to: 'defender',
        status: 'confirmed',
        source: 'war_layer_deploy',
        relationshipKey: 'war_front.attacker.defender',
      }],
    }),
    wizardNews: { currentTick: 5, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return { campaign, saves, snapshot, worldState };
}

function rebuild(built, worldState, regionalGraph = built.campaign.regionalGraph, saves = built.saves) {
  const campaign = { ...built.campaign, worldState, regionalGraph };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return { ...built, campaign, saves, snapshot, worldState, regionalGraph };
}

function evaluate(built, rules = built.worldState.simulationRules) {
  return evaluateWarLayer({
    snapshot: built.snapshot,
    worldState: built.worldState,
    rng: HIGH_ROLL,
    tick: built.worldState.tick,
    now: NOW,
    rules,
  });
}

function settlementMapFor(saves) {
  return new Map(saves.map((row) => [row.id, {
    saveId: row.id,
    save: row,
    settlement: row.settlement,
  }]));
}

function joinedOutcome(war) {
  return war.outcomes.find((row) => row.metadata?.incidentType === 'coalition_joined');
}

function applyAutoJoin(options = {}) {
  const built = fixture(options);
  const war = evaluate(built);
  const outcome = joinedOutcome(war);
  expect(outcome, 'fixture must produce an accepted automatic coalition join').toBeTruthy();
  const worldState = { ...built.worldState, deployments: war.deployments };
  const regionalGraph = addRegionalChannels(
    built.campaign.regionalGraph,
    war.graphChannels,
    { now: NOW },
  );
  const current = rebuild(built, worldState, regionalGraph);
  const applied = applyWorldPulseOutcomes({
    snapshot: current.snapshot,
    worldState,
    regionalGraph,
    wizardNews: built.campaign.wizardNews,
    settlementMap: settlementMapFor(built.saves),
    outcomes: [outcome],
    tick: 5,
    now: NOW,
    simulationRules: options.rules || LIT,
  });
  return {
    ...current,
    war,
    outcome,
    applied,
    worldState: applied.worldState,
    regionalGraph: applied.regionalGraph,
  };
}

function queueCoalitionJoin() {
  const rules = { ...LIT, politicalAutonomy: 'dm_only' };
  const built = fixture({ rules });
  const war = evaluate(built, rules);
  const outcome = joinedOutcome(war);
  expect(outcome, 'fixture must produce a held coalition join').toMatchObject({ applyMode: 'proposal' });
  const worldState = { ...built.worldState, deployments: war.deployments };
  const current = rebuild(built, worldState);
  const queued = applyWorldPulseOutcomes({
    snapshot: current.snapshot,
    worldState,
    regionalGraph: current.campaign.regionalGraph,
    wizardNews: built.campaign.wizardNews,
    settlementMap: settlementMapFor(built.saves),
    outcomes: [outcome],
    tick: 5,
    now: NOW,
    simulationRules: rules,
  });
  const pending = queued.worldState.proposals.find((row) => row.status === 'pending');
  expect(pending).toBeTruthy();
  return { ...current, rules, war, outcome, queued, pending };
}

function applyQueuedJoin(queuedFixture, { worldState = null, saves = null } = {}) {
  const nextSaves = saves || queuedFixture.saves;
  const nextState = worldState || { ...queuedFixture.queued.worldState, tick: 7 };
  return applyWorldPulseProposal({
    campaign: {
      ...queuedFixture.campaign,
      settlementIds: nextSaves.map((row) => row.id),
      worldState: nextState,
      regionalGraph: queuedFixture.queued.regionalGraph,
      wizardNews: queuedFixture.queued.wizardNews,
    },
    saves: nextSaves,
    proposalId: queuedFixture.pending.id,
    now: NOW,
  });
}

function withNonAggression(worldState, aId = 'ally', bId = 'attacker') {
  return {
    ...worldState,
    spatialLedgers: {
      ...(worldState.spatialLedgers || {}),
      treaties: {
        ...(worldState.spatialLedgers?.treaties || {}),
        [`nap.${aId}.${bId}`]: {
          parties: [aId, bId],
          victorId: aId,
          loserId: bId,
          complianceState: 'honored',
          terms: [{ type: 'non_aggression', expiresTick: 100 }],
        },
      },
    },
  };
}

function exactPairEdges(graph, aId, bId) {
  return (graph.edges || []).filter((edge) => {
    const pair = [String(edge.from || ''), String(edge.to || '')].sort();
    return pair[0] === [aId, bId].sort()[0] && pair[1] === [aId, bId].sort()[1];
  });
}

describe('WR-6 exact runtime gate', () => {
  test('every false or missing constituent is a mutation-free dark read', () => {
    const root = fixture();
    const rootDecisions = readCoalitionJoinDecisions({
      snapshot: root.snapshot,
      worldState: root.worldState,
      tick: 5,
      strengthFor: () => 0.5,
    });
    expect(rootDecisions.length).toBeGreaterThan(0);

    const joined = applyAutoJoin();
    const joinedState = { ...joined.worldState, tick: 6, simulationRules: { ...LIT } };
    const joinedSnapshot = rebuild(joined, joinedState, joined.regionalGraph).snapshot;
    expect(readCoalitionStandingFronts({
      worldState: joinedState,
      snapshot: joinedSnapshot,
      tick: 6,
    }).decisions).toHaveLength(1);

    for (const flag of Object.keys(LIT)) {
      for (const mode of ['false', 'missing']) {
        const rules = { ...LIT };
        if (mode === 'false') rules[flag] = false;
        else delete rules[flag];

        const rootState = { ...root.worldState, simulationRules: rules };
        const rootSnapshot = rebuild(root, rootState).snapshot;
        const rootBytes = JSON.stringify(rootState);
        expect(warCoalitionActive(rootState), `${flag} ${mode}`).toBe(false);
        expect(coalitionLedgerActive(rootState), `${flag} ${mode}`).toBe(false);
        expect(readCoalitionJoinDecisions({
          snapshot: rootSnapshot,
          worldState: rootState,
          tick: 5,
          strengthFor: () => 0.5,
        }), `${flag} ${mode}`).toEqual([]);
        expect(JSON.stringify(rootState), `${flag} ${mode}`).toBe(rootBytes);

        const darkJoinedState = { ...joinedState, simulationRules: rules };
        const darkJoinedSnapshot = rebuild(joined, darkJoinedState, joined.regionalGraph).snapshot;
        const joinedBytes = JSON.stringify(darkJoinedState);
        expect(readCoalitionStandingFronts({
          worldState: darkJoinedState,
          snapshot: darkJoinedSnapshot,
          tick: 6,
        }), `${flag} ${mode}`).toEqual({ decisions: [], byParty: new Map(), evidence: [] });
        expect(JSON.stringify(darkJoinedState), `${flag} ${mode}`).toBe(joinedBytes);
      }
    }
  });

  test('the four WR-6 flags can drive a standing choice while the generic strategy gate is dark', () => {
    const joined = applyAutoJoin();
    const worldState = {
      ...joined.worldState,
      tick: 6,
      simulationRules: { ...LIT, settlementStrategyEnabled: false },
    };
    const snapshot = rebuild(joined, worldState, joined.regionalGraph).snapshot;
    const pIndex = pressureIndex(deriveSettlementPressures(snapshot));
    const coalitionDecisionByParty = new Map([['ally', {
      partyId: 'ally',
      callerId: 'defender',
      targetId: 'attacker',
      decision: 'stay',
    }]]);
    const warTerminationByAttacker = new Map([['ally', {
      targetId: 'attacker',
      suePressure01: 0,
      dissolvedCauseTypes: [],
      receipt: {},
    }]]);

    const candidates = evaluateSettlementStrategyRules(snapshot, pIndex, {
      tick: 6,
      simulationRules: worldState.simulationRules,
      coalitionDecisionByParty,
      warTerminationByAttacker,
      rng: HIGH_ROLL,
    });

    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({
      candidateType: 'strategy_hold',
      targetSaveId: 'ally',
      metadata: {
        coalitionStandingDecision: {
          partyId: 'ally',
          callerId: 'defender',
          targetId: 'attacker',
          decision: 'stay',
        },
      },
    });
  });
});

describe('WR-6 join address and legality parity', () => {
  test('an accepted automatic join persists exactly one hostile party-enemy relationship', () => {
    const joined = applyAutoJoin();
    const identity = canonicalRelationshipSeed('ally', 'attacker');
    expect(identity).toBeTruthy();
    expect(joined.worldState.relationshipStates[identity.relationshipKey])
      .toMatchObject({ relationshipType: 'hostile' });
    const addressed = exactPairEdges(joined.regionalGraph, 'ally', 'attacker')
      .filter((edge) => edge.id === identity.relationshipKey);
    expect(addressed).toEqual([
      expect.objectContaining({ id: identity.relationshipKey, relationshipType: 'hostile' }),
    ]);
    expect(Object.keys(joined.worldState.relationshipStates)
      .filter((key) => key === identity.relationshipKey)).toHaveLength(1);
  });

  test('an approved held join persists the same exact hostile party-enemy relationship', () => {
    const queued = queueCoalitionJoin();
    const approved = applyQueuedJoin(queued);
    const identity = canonicalRelationshipSeed('ally', 'attacker');
    expect(approved.proposalDisposition).toBeUndefined();
    expect(approved.worldState.proposals.find((row) => row.id === queued.pending.id))
      .toMatchObject({ status: 'applied' });
    expect(approved.worldState.relationshipStates[identity.relationshipKey])
      .toMatchObject({ relationshipType: 'hostile' });
    expect(exactPairEdges(approved.regionalGraph, 'ally', 'attacker')
      .filter((edge) => edge.id === identity.relationshipKey)).toEqual([
      expect.objectContaining({ id: identity.relationshipKey, relationshipType: 'hostile' }),
    ]);
  });

  test('a live non-aggression pact excludes an automatic alliance call', () => {
    const built = fixture();
    const worldState = withNonAggression(built.worldState);
    const current = rebuild(built, worldState);
    const war = evaluate(current, LIT);

    expect(war.deployments.ally).toBeUndefined();
    expect(war.outcomes.filter((row) => (
      row.metadata?.allianceCall?.partyId === 'ally'
      || row.metadata?.coalitionEnemyRelationship?.partyId === 'ally'
    ))).toEqual([]);
  });

  test('a treaty signed while a join is held supersedes the stale proposal', () => {
    const queued = queueCoalitionJoin();
    const worldState = withNonAggression({ ...queued.queued.worldState, tick: 7 });
    const result = applyQueuedJoin(queued, { worldState });

    expect(result.proposalDisposition).toBe('superseded');
    expect(result.worldState.deployments?.ally).toBeUndefined();
    expect(exactPairEdges(result.regionalGraph, 'ally', 'attacker')).toEqual([]);
  });

  test('an independently hopeless ally refuses instead of opening an automatic front', () => {
    const built = fixture({
      allyPatch: {
        tier: 'village',
        population: 50,
        activeConditions: [
          { id: 'ally-exhausted', archetype: 'war_exhaustion', severity: 1 },
          { id: 'ally-drained', archetype: 'war_drain', severity: 1 },
        ],
      },
      attackerPatch: { tier: 'city', population: 80000 },
      alliedState: { trust: 1, pactStrength: 1, dependency: 1 },
    });
    const war = evaluate(built, LIT);
    const refusal = war.outcomes.find((row) => row.metadata?.allianceCall?.partyId === 'ally');

    expect(war.deployments.ally).toBeUndefined();
    expect(refusal).toMatchObject({ candidateType: 'coalition_refused' });
    expect(refusal.reasons.join(' ')).toMatch(/cannot field a force capable/i);
    expect(refusal.metadata.coalitionEvidence.find((row) => row.kind === 'coalition_refused'))
      .toMatchObject({ refusalCause: 'front_infeasible' });

    const worldState = { ...built.worldState, deployments: war.deployments };
    const current = rebuild(built, worldState);
    const applied = applyWorldPulseOutcomes({
      snapshot: current.snapshot,
      worldState,
      regionalGraph: current.campaign.regionalGraph,
      wizardNews: built.campaign.wizardNews,
      settlementMap: settlementMapFor(built.saves),
      outcomes: [refusal],
      tick: 5,
      now: NOW,
      simulationRules: LIT,
    });
    const publicRefusal = applied.wizardNews.entries.find(
      (row) => row.kind === 'coalition_refused',
    );
    expect(publicRefusal).toBeTruthy();
    expect(publicRefusal.reasons.join(' ')).toMatch(/could not field a force capable/i);
    expect(publicRefusal.reasons.join(' ')).not.toMatch(/alliance web and its own books/i);
  });

  test('lost physical feasibility while a join is held supersedes the stale proposal', () => {
    const queued = queueCoalitionJoin();
    const weakSaves = queued.saves.map((row) => (
      row.id === 'ally'
        ? save('ally', 'Brookhaven', {
            tier: 'village',
            population: 50,
            activeConditions: [
              { id: 'ally-exhausted', archetype: 'war_exhaustion', severity: 1 },
              { id: 'ally-drained', archetype: 'war_drain', severity: 1 },
            ],
          })
        : row.id === 'attacker'
          ? save('attacker', 'Ironhold', { tier: 'city', population: 80000 })
          : row
    ));
    const result = applyQueuedJoin(queued, {
      worldState: { ...queued.queued.worldState, tick: 7 },
      saves: weakSaves,
    });

    expect(result.proposalDisposition).toBe('superseded');
    expect(result.worldState.deployments?.ally).toBeUndefined();
    expect(exactPairEdges(result.regionalGraph, 'ally', 'attacker')).toEqual([]);
  });

  test('a durable refusal supersedes an imported stale proposal for the same call', () => {
    const queued = queueCoalitionJoin();
    const autoRules = { ...LIT, politicalAutonomy: 'full' };
    const weakSaves = queued.saves.map((row) => (
      row.id === 'ally'
        ? save('ally', 'Brookhaven', {
            tier: 'village',
            population: 50,
            activeConditions: [
              { id: 'ally-exhausted', archetype: 'war_exhaustion', severity: 1 },
              { id: 'ally-drained', archetype: 'war_drain', severity: 1 },
            ],
          })
        : row.id === 'attacker'
          ? save('attacker', 'Ironhold', { tier: 'city', population: 80000 })
          : row
    ));

    // Changing proposal authority must not let a pending call answer itself a
    // second time. This prevents the organic proposal→auto→refusal race.
    const pendingState = {
      ...queued.queued.worldState,
      tick: 6,
      simulationRules: autoRules,
    };
    const pendingBuilt = rebuild(
      queued,
      pendingState,
      queued.queued.regionalGraph,
      weakSaves,
    );
    const suppressed = evaluate(pendingBuilt, autoRules);
    expect(suppressed.outcomes.filter((row) => (
      row.metadata?.allianceCall?.callId === queued.outcome.metadata.allianceCall.callId
    ))).toEqual([]);

    // Imported queues can already contain that historical race. Reproduce its
    // durable refusal with the old question temporarily absent, then restore
    // the pending row and clear the physical impediment before approval.
    const unheldState = {
      ...pendingState,
      proposals: (pendingState.proposals || []).map((row) => (
        row.id === queued.pending.id ? { ...row, status: 'dismissed' } : row
      )),
    };
    const unheldBuilt = rebuild(
      queued,
      unheldState,
      queued.queued.regionalGraph,
      weakSaves,
    );
    const refusalWar = evaluate(unheldBuilt, autoRules);
    const refusal = refusalWar.outcomes.find((row) => (
      row.metadata?.incidentType === 'coalition_refused'
      && row.metadata?.allianceCall?.callId === queued.outcome.metadata.allianceCall.callId
    ));
    expect(refusal).toBeTruthy();
    const refusalState = { ...unheldState, deployments: refusalWar.deployments };
    const refusalBuilt = rebuild(
      queued,
      refusalState,
      queued.queued.regionalGraph,
      weakSaves,
    );
    const refused = applyWorldPulseOutcomes({
      snapshot: refusalBuilt.snapshot,
      worldState: refusalState,
      regionalGraph: queued.queued.regionalGraph,
      wizardNews: queued.queued.wizardNews,
      settlementMap: settlementMapFor(weakSaves),
      outcomes: [refusal],
      tick: 6,
      now: NOW,
      simulationRules: autoRules,
    });
    expect(refused.worldState.relationshipStates[DEFENDER_ALLY.id].allianceCalls)
      .toEqual([expect.objectContaining({
        callId: queued.outcome.metadata.allianceCall.callId,
        decision: 'refused',
      })]);

    const importedStaleState = {
      ...refused.worldState,
      tick: 7,
      simulationRules: queued.rules,
      proposals: (refused.worldState.proposals || []).map((row) => (
        row.id === queued.pending.id ? queued.pending : row
      )),
    };
    const result = applyQueuedJoin(queued, { worldState: importedStaleState });

    expect(result.proposalDisposition).toBe('superseded');
    expect(result.worldState.proposals.find((row) => row.id === queued.pending.id))
      .toMatchObject({ status: 'superseded', supersessionReason: 'coalition_join_lapsed' });
    expect(result.worldState.deployments?.ally).toBeUndefined();
    expect(result.worldState.relationshipStates[DEFENDER_ALLY.id].allianceCalls)
      .toEqual([expect.objectContaining({ decision: 'refused' })]);
    expect(exactPairEdges(result.regionalGraph, 'ally', 'attacker')).toEqual([]);
  });
});

describe('WR-6 standing evidence retention', () => {
  test('an emergency recall suppresses coalition_stayed without erasing the live expenditure read', () => {
    const joined = applyAutoJoin();
    const worldState = { ...joined.worldState, tick: 6, simulationRules: { ...LIT } };
    const regionalGraph = addRegionalChannels(joined.regionalGraph, [{
      type: 'war_front',
      from: 'defender',
      to: 'ally',
      status: 'confirmed',
      source: 'war_layer_deploy',
      relationshipKey: 'war_front.defender.ally',
    }], { now: NOW });
    const snapshot = rebuild(joined, worldState, regionalGraph).snapshot;
    const beforeDeployment = JSON.stringify(worldState.deployments.ally);
    const expenditure = readCoalitionExpenditure({
      worldState,
      snapshot,
      partyId: 'ally',
      targetId: 'attacker',
      deployment: worldState.deployments.ally,
      tick: 6,
    });
    const standing = readCoalitionStandingFronts({ worldState, snapshot, tick: 6 });

    expect(expenditure).toBeTruthy();
    expect(standing.decisions).toEqual([]);
    expect(standing.evidence).toEqual([
      expect.objectContaining({
        ...expenditure.receipt,
        thirdPartyId: 'attacker',
      }),
    ]);
    expect(standing.evidence.some((row) => row.kind === 'coalition_stayed')).toBe(false);
    expect(JSON.stringify(worldState.deployments.ally)).toBe(beforeDeployment);
  });

  test('twenty-five joined episodes retain every once-only stay witness and none re-publish', () => {
    const stayedAt = (tick) => Array.from({ length: 25 }, (_, index) => ({
      id: `coalition_stayed.member-${String(index).padStart(2, '0')}.enemy.${tick}`,
      kind: 'coalition_stayed',
      tick,
      settlementId: `member-${String(index).padStart(2, '0')}`,
      counterpartId: 'caller',
      thirdPartyId: 'enemy',
      targetId: 'enemy',
      joinedTick: 4,
    }));
    const first = coalitionStandingTransitionEvidence({}, stayedAt(6));
    expect(first).toHaveLength(25);
    expect(new Set(first.map((row) => row.settlementId))).toHaveLength(25);

    const replay = coalitionStandingTransitionEvidence({
      pulseHistory: [{ tick: 6, warCoalitionEvidence: first }],
    }, stayedAt(7));
    expect(replay).toEqual([]);
  });
});
