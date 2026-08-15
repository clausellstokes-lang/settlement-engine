import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { authorityTransferEpochFor } from '../../src/domain/rulingPower.js';
import {
  applyWorldPulseOutcomes,
  applyWorldPulseProposal,
} from '../../src/domain/worldPulse/applyWorldPulse.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import {
  inheritedWarDemandFor,
  readWarPeaceDecision,
} from '../../src/domain/worldPulse/warPeaceDecision.js';
import { advanceTreaties } from '../../src/domain/worldPulse/peaceTerms.js';

const NOW = '2026-08-02T00:00:00.000Z';
const EDGE = { id: 'edge.offerer.target', from: 'offerer', to: 'target', relationshipType: 'hostile' };
const KEY = relationshipKeyFromEdge(EDGE);
const RULES = { warLayerEnabled: true, warTerminationEnabled: true };

function save(id, name, population, legitimacy = 60) {
  return {
    id,
    name,
    settlement: {
      name,
      tier: 'town',
      population,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: legitimacy, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
      },
      npcs: [],
      activeConditions: [],
    },
  };
}

function outcome(patch = {}) {
  const proposalPayload = {
    kind: 'relationship_label_change',
    relationshipKey: KEY,
    fromType: 'hostile',
    toType: 'cold_war',
    peaceOffer: true,
    offererId: 'offerer',
    targetId: 'target',
    peaceFrontOwnerId: 'offerer',
    peaceFrontSinceTick: 3,
    reason: 'Ember offered peace.',
  };
  return {
    id: 'candidate.strategy.sue_for_peace.offerer.12',
    generatedAtTick: 12,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: 'offerer',
    severity: 0.72,
    probability: 1,
    applyMode: 'auto',
    headline: 'Ember sues for peace',
    summary: 'Ember offers terms.',
    reasons: [],
    relationshipKey: KEY,
    relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
    ...patch,
    proposalPayload: { ...proposalPayload, ...(patch.proposalPayload || {}) },
  };
}

function fixture({
  targetPopulation = 12000,
  targetExhaustion = 1,
  targetRulerId = null,
  extraSaves = [],
  extraEdges = [],
  extraDeployments = {},
} = {}) {
  const target = save('target', 'Vale', targetPopulation, 60);
  if (targetRulerId) {
    target.settlement.npcs = [{
      id: targetRulerId,
      name: `Ruler ${targetRulerId}`,
      importance: 'pillar',
      factionAffiliation: 'Vale Seat',
      personality: { dominant: 'cautious', flaw: 'proud', modifier: 'measured' },
    }];
  }
  const saves = [
    save('offerer', 'Ember', 1000),
    target,
    ...extraSaves,
  ];
  const graph = ensureRegionalGraph({ edges: [EDGE, ...extraEdges], channels: [] }, { now: NOW });
  const worldState = {
    tick: 12,
    simulationRules: RULES,
    relationshipStates: {
      [KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 },
    },
    deployments: {
      offerer: {
        targetId: 'target', sinceTick: 3, role: 'siege',
        maxStartStrength: 100, currentEffectiveStrength: 100,
        casusReasons: [],
      },
      ...extraDeployments,
    },
    warExhaustion: { target: targetExhaustion },
    spatialLedgers: { warReasons: {} },
  };
  const settlements = saves.map((row) => ({ id: row.id, name: row.name, settlement: row.settlement }));
  const snapshot = {
    settlements,
    byId: new Map(settlements.map((row) => [row.id, row])),
    regionalGraph: graph,
    campaign: {},
  };
  return { saves, graph, worldState, snapshot };
}

function withTargetDemand(base, desiredAction, { rulerId = 'new', tick = 11 } = {}) {
  const canonicalRulerId = `target:${rulerId}`;
  const target = base.snapshot.byId.get('target').settlement;
  return {
    ...base.worldState,
    spatialLedgers: {
      ...base.worldState.spatialLedgers,
      npcLadder: {
        target: {
          factions: { 'target.seat': { rungs: [canonicalRulerId] } },
          seatTransitions: [{
            id: 'seat.install',
            fromRulerId: 'target:old',
            toRulerId: canonicalRulerId,
            cause: 'government_change',
            tick,
            authorityEpoch: authorityTransferEpochFor(target),
            governingFactionId: 'target.seat',
            warDemand: {
              actorId: 'target', targetId: 'offerer', decisionId: 'decision.install', desiredAction,
            },
          }],
        },
      },
    },
  };
}

function apply(f, state = f.worldState, saves = f.saves, graph = f.graph, appliedOutcome = outcome()) {
  const settlementMap = new Map(saves.map((row) => [row.id, {
    saveId: row.id,
    save: { name: row.name },
    settlement: row.settlement,
  }]));
  return applyWorldPulseOutcomes({
    snapshot: {
      settlements: saves.map((row) => ({ id: row.id, name: row.name, settlement: row.settlement })),
      regionalGraph: graph,
      campaign: {},
    },
    worldState: state,
    regionalGraph: graph,
    wizardNews: { currentTick: 12, entries: [] },
    settlementMap,
    outcomes: [appliedOutcome],
    tick: 12,
    now: NOW,
    advanceNewsTick: false,
    advanceRegionalImpacts: false,
    simulationRules: RULES,
  });
}

describe('WR-5 bilateral peace', () => {
  it('reuses the four-term read for a defender with no outbound deployment', () => {
    const f = fixture();
    const decision = readWarPeaceDecision({
      worldState: f.worldState,
      snapshot: f.snapshot,
      outcome: outcome(),
      tick: 12,
    });
    expect(decision).toBeTruthy();
    expect(decision.targetId).toBe('target');
    expect(decision.termination.receipt.attackerId).toBe('target');
    expect(Object.keys(decision.termination.bands).sort()).toEqual([
      'cause', 'cost_to_continue', 'cost_to_stop', 'momentum',
    ]);
  });

  it('rejects absent front and offer clocks instead of treating them as tick zero', () => {
    const f = fixture();
    const zeroState = {
      ...f.worldState,
      deployments: {
        ...f.worldState.deployments,
        offerer: { ...f.worldState.deployments.offerer, sinceTick: 0 },
      },
    };
    const zeroOffer = outcome({
      generatedAtTick: 0,
      proposalPayload: { peaceFrontSinceTick: 0 },
    });
    expect(readWarPeaceDecision({
      worldState: zeroState, snapshot: f.snapshot, outcome: zeroOffer, tick: 12,
    })).toBeTruthy();

    for (const badTick of [null, '', '   ']) {
      const badFrontState = {
        ...zeroState,
        deployments: {
          ...zeroState.deployments,
          offerer: { ...zeroState.deployments.offerer, sinceTick: badTick },
        },
      };
      expect(readWarPeaceDecision({
        worldState: badFrontState, snapshot: f.snapshot, outcome: zeroOffer, tick: 12,
      })).toBeNull();
      expect(readWarPeaceDecision({
        worldState: zeroState,
        snapshot: f.snapshot,
        outcome: outcome({
          generatedAtTick: badTick,
          tick: badTick,
          proposalPayload: { peaceFrontSinceTick: 0 },
        }),
        tick: 12,
      })).toBeNull();
      expect(readWarPeaceDecision({
        worldState: zeroState,
        snapshot: f.snapshot,
        outcome: outcome({
          generatedAtTick: 0,
          proposalPayload: { peaceFrontSinceTick: badTick },
        }),
        tick: 12,
      })).toBeNull();
    }
  });

  it.each([
    ['a newer peace decision', (state) => ({
      ...state,
      relationshipStates: {
        ...state.relationshipStates,
        [KEY]: {
          ...state.relationshipStates[KEY],
          peaceDecisionOutcomeId: 'candidate.strategy.sue_for_peace.offerer.13',
          peaceDecisionTick: 13,
        },
      },
    })],
    ['a replacement deployment episode', (state) => ({
      ...state,
      deployments: {
        ...state.deployments,
        offerer: { ...state.deployments.offerer, sinceTick: 8 },
      },
    })],
  ])('tombstones an offer superseded by %s without changing live world state', (_label, supersede) => {
    const f = fixture();
    const storedOutcome = outcome({ applyMode: 'proposal' });
    const proposalId = 'world_proposal.peace.offerer.12';
    const proposal = {
      id: proposalId,
      status: 'pending',
      recordModeVersion: 4,
      tick: 12,
      outcome: storedOutcome,
      headline: storedOutcome.headline,
      summary: storedOutcome.summary,
      reasons: storedOutcome.reasons,
    };
    const rawBefore = supersede({ ...f.worldState, proposals: [proposal] });
    const before = ensureWorldState(rawBefore, { id: 'campaign.peace' });
    const unrelatedNews = {
      id: 'wizard_news.11.unrelated',
      kind: 'applied',
      sourceEventId: 'unrelated',
      tags: ['world_pulse'],
    };
    const queuedNews = {
      id: 'wizard_news.12.world_pulse.proposal.peace',
      kind: 'queued',
      sourceEventId: storedOutcome.id,
      tags: ['world_pulse', 'proposal'],
    };
    const result = applyWorldPulseProposal({
      campaign: {
        id: 'campaign.peace',
        settlementIds: f.saves.map((row) => row.id),
        worldState: before,
        regionalGraph: f.graph,
        wizardNews: { currentTick: 12, entries: [unrelatedNews, queuedNews] },
      },
      saves: f.saves,
      proposalId,
      now: NOW,
    });

    const { proposals: beforeProposals, ...beforeWorld } = before;
    const { proposals: afterProposals, ...afterWorld } = result.worldState;
    expect(beforeProposals).toHaveLength(1);
    expect(afterWorld).toEqual(beforeWorld);
    expect(afterProposals).toEqual([expect.objectContaining({
      id: proposalId,
      status: 'superseded',
      supersessionReason: 'bilateral_peace_lapsed',
    })]);
    expect(afterProposals[0].appliedAt).toBeUndefined();
    expect(result).toMatchObject({
      proposalDisposition: 'superseded',
      regionalGraph: f.graph,
      settlementUpdates: [],
      autoApplied: [],
      proposals: [],
      newsEntries: [],
    });
    expect(result.wizardNews.entries).toEqual([unrelatedNews]);
  });

  it('two yeses use the one existing de-escalation and recall path', () => {
    const f = fixture({ targetPopulation: 12000, targetExhaustion: 1 });
    const result = apply(f);
    expect(result.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType).toBe('cold_war');
    expect(result.worldState.deployments.offerer.recalled).toMatchObject({ cause: 'sue_for_peace', tick: 12 });
    expect(result.autoApplied[0].metadata.peaceDecision.decision).toBe('accept');
  });

  it('one no leaves hostility and deployments live, then prices grievance and legitimacy exactly once', () => {
    const f = fixture({ targetPopulation: 120, targetExhaustion: 0 });
    const first = apply(f);
    const firstTarget = first.settlementUpdates.find((row) => row.saveId === 'target').settlement;
    expect(first.regionalGraph.edges.find((edge) => edge.id === EDGE.id).relationshipType).toBe('hostile');
    expect(first.worldState.deployments.offerer.recalled).toBeUndefined();
    expect(first.worldState.relationshipStates[KEY]).toMatchObject({ trust: 0.42, resentment: 0.32 });
    expect(firstTarget.powerStructure.publicLegitimacy.score).toBe(56);
    expect(first.newsEntries.some((entry) => entry.impactKind === 'peace_refused')).toBe(true);

    const secondSaves = f.saves.map((row) => row.id === 'target' ? { ...row, settlement: firstTarget } : row);
    const second = apply(f, first.worldState, secondSaves, first.regionalGraph);
    const secondTarget = second.settlementUpdates.find((row) => row.saveId === 'target').settlement;
    expect(second.worldState.relationshipStates[KEY].trust).toBe(0.42);
    expect(second.worldState.relationshipStates[KEY].resentment).toBe(0.32);
    expect(secondTarget.powerStructure.publicLegitimacy.score).toBe(56);
    expect(second.newsEntries).toEqual([]);
  });

  it('charges patience only to an allied court actually co-besieging the offerer', () => {
    const ally = save('ally', 'Harbor', 2200);
    const bystander = save('bystander', 'Mere', 2200);
    const allyEdge = { id: 'edge.target.ally', from: 'target', to: 'ally', relationshipType: 'allied' };
    const bystanderEdge = { id: 'edge.target.bystander', from: 'target', to: 'bystander', relationshipType: 'allied' };
    const allyKey = relationshipKeyFromEdge(allyEdge);
    const bystanderKey = relationshipKeyFromEdge(bystanderEdge);
    const f = fixture({
      targetPopulation: 120,
      targetExhaustion: 0,
      extraSaves: [ally, bystander],
      extraEdges: [allyEdge, bystanderEdge],
      extraDeployments: { ally: { targetId: 'offerer', sinceTick: 4, role: 'siege' } },
    });
    f.worldState.relationshipStates[allyKey] = { relationshipType: 'allied', trust: 0.7, resentment: 0.1 };
    f.worldState.relationshipStates[bystanderKey] = { relationshipType: 'allied', trust: 0.7, resentment: 0.1 };
    const result = apply(f);
    expect(result.worldState.relationshipStates[allyKey]).toMatchObject({ trust: 0.65, resentment: 0.16 });
    expect(result.worldState.relationshipStates[bystanderKey]).toMatchObject({ trust: 0.7, resentment: 0.1 });
    expect(result.newsEntries.filter((entry) => entry.impactKind === 'refusal_cost_ally_patience')).toHaveLength(1);
  });

  it('an exact current-seat demand can compel either acceptance or continued war', () => {
    const base = fixture({ targetPopulation: 120, targetExhaustion: 0, targetRulerId: 'new' });
    expect(readWarPeaceDecision({
      worldState: withTargetDemand(base, 'peace'), snapshot: base.snapshot, outcome: outcome(), tick: 12,
    }).decision).toBe('accept');

    const acceptingBase = fixture({ targetPopulation: 12000, targetExhaustion: 1, targetRulerId: 'new' });
    expect(readWarPeaceDecision({
      worldState: withTargetDemand(acceptingBase, 'continue'),
      snapshot: acceptingBase.snapshot,
      outcome: outcome(),
      tick: 12,
    }).decision).toBe('refuse');
  });

  it('rejects an otherwise current inherited demand dated after the world tick', () => {
    const base = fixture({ targetPopulation: 120, targetExhaustion: 0, targetRulerId: 'new' });
    expect(inheritedWarDemandFor(
      withTargetDemand(base, 'peace', { tick: 12 }), 'target', 'offerer', base.snapshot,
    )).toMatchObject({ decisionId: 'decision.install', desiredAction: 'peace' });
    expect(inheritedWarDemandFor(
      withTargetDemand(base, 'peace', { tick: 13 }), 'target', 'offerer', base.snapshot,
    )).toBeNull();
  });

  it('a later succession retires an older installing faction demand', () => {
    const base = fixture({ targetPopulation: 120, targetExhaustion: 0, targetRulerId: 'heir' });
    const authorityEpoch = authorityTransferEpochFor(base.snapshot.byId.get('target').settlement);
    const state = {
      ...base.worldState,
      spatialLedgers: {
        ...base.worldState.spatialLedgers,
        npcLadder: {
          target: {
            factions: { 'target.seat': { rungs: ['target:heir'] } },
            // Imported order is deliberately newest-first. Chronology, not raw
            // insertion order, must retire the older installer's demand.
            seatTransitions: [
              {
                id: 'seat.succession', fromRulerId: 'target:installed', toRulerId: 'target:heir',
                cause: 'succession', tick: 11,
                authorityEpoch,
              },
              {
                id: 'seat.install', fromRulerId: 'target:old', toRulerId: 'target:installed',
                cause: 'government_change', tick: 10,
                authorityEpoch,
                warDemand: {
                  actorId: 'target', targetId: 'offerer', decisionId: 'decision.install', desiredAction: 'peace',
                },
              },
            ],
          },
        },
      },
    };
    expect(readWarPeaceDecision({ worldState: state, snapshot: base.snapshot, outcome: outcome(), tick: 12 }).decision)
      .toBe('refuse');
  });

  it('fails closed when the newest demand no longer belongs to a live top rung', () => {
    const base = fixture({ targetPopulation: 120, targetExhaustion: 0, targetRulerId: 'actual-ruler' });
    const state = {
      ...base.worldState,
      spatialLedgers: {
        ...base.worldState.spatialLedgers,
        npcLadder: {
          target: {
            factions: { 'target.seat': { rungs: ['target:actual-ruler'] } },
            seatTransitions: [{
              id: 'seat.stale', fromRulerId: 'target:old', toRulerId: 'target:installed',
              cause: 'government_change', tick: 11,
              authorityEpoch: authorityTransferEpochFor(base.snapshot.byId.get('target').settlement),
              warDemand: {
                actorId: 'target', targetId: 'offerer', decisionId: 'decision.stale', desiredAction: 'peace',
              },
            }],
          },
        },
      },
    };
    expect(readWarPeaceDecision({ worldState: state, snapshot: base.snapshot, outcome: outcome(), tick: 12 }).decision)
      .toBe('refuse');
  });
});

describe('WR-6 live peace closure parity', () => {
  function coalitionFixture() {
    const root = save('root', 'High Court', 1000);
    const rootEdge = {
      id: 'edge.root.offerer', from: 'root', to: 'offerer', relationshipType: 'allied',
    };
    const base = fixture({
      targetPopulation: 12000,
      targetExhaustion: 1,
      targetRulerId: 'new',
      extraSaves: [root],
      extraEdges: [rootEdge],
      extraDeployments: {
        root: { targetId: 'target', sinceTick: 1 },
      },
    });
    const fullRules = {
      ...RULES,
      peaceEngineEnabled: true,
      coalitionLedgerEnabled: true,
    };
    const anchor = {
      callId: 'coalition_call.root.offerer.target.1',
      partyId: 'offerer',
      callerId: 'root',
      enemyId: 'target',
      joinedTick: 3,
      callerDeploymentSinceTick: 1,
      originAttackerId: 'root',
      originSinceTick: 1,
      allianceRelationshipKey: rootEdge.id,
      sourceCauseTypes: ['grievance'],
      cause: 'alliance_obligation',
    };
    let worldState = {
      ...base.worldState,
      simulationRules: fullRules,
      deployments: {
        ...base.worldState.deployments,
        offerer: {
          ...base.worldState.deployments.offerer,
          maxStartStrength: 100,
          currentEffectiveStrength: 45,
          accumulatedAttrition: 0.55,
          deployedPopulation: 200,
          joinLedger: [anchor],
        },
        root: { targetId: 'target', sinceTick: 1 },
      },
      relationshipStates: {
        ...base.worldState.relationshipStates,
        [rootEdge.id]: { relationshipType: 'allied', trust: 0.8, resentment: 0.1 },
      },
    };
    worldState = withTargetDemand({ ...base, worldState }, 'peace');
    for (const row of base.saves) {
      row.settlement.economicState.foodSecurity = {
        storageMonths: row.id === 'root' ? 6 : row.id === 'offerer' ? 1 : 3,
        stockpile: { capacityMonths: 8 },
      };
    }
    const congressClosure = {
      coalitionSettlementId: 'congress.explicit.12',
      closureId: 'closure.target.offerer',
      relationshipKey: KEY,
      winnerId: 'target',
      loserId: 'offerer',
      capacity01: 0.5,
      culpability01: 0.4,
      fieldLoss01: 0.3,
      callerId: 'target',
      bled01: 0.5,
      led01: 0.5,
      late01: 0.5,
      aggregateClaim01: 0.2,
      componentClosureIds: ['closure.target.offerer', 'closure.target.root'],
    };
    return { ...base, worldState, fullRules, rootEdge, congressClosure };
  }

  function manualApply(f) {
    const storedOutcome = outcome({
      applyMode: 'proposal',
      proposalPayload: { coalitionSettlementClosure: f.congressClosure },
    });
    const proposalId = 'world_proposal.peace.offerer.12';
    const proposal = {
      id: proposalId,
      status: 'pending',
      recordModeVersion: 4,
      tick: 12,
      outcome: storedOutcome,
      headline: storedOutcome.headline,
      summary: storedOutcome.summary,
      reasons: storedOutcome.reasons,
    };
    const state = ensureWorldState({ ...f.worldState, proposals: [proposal] }, { id: 'campaign.coalition.peace' });
    return applyWorldPulseProposal({
      campaign: {
        id: 'campaign.coalition.peace',
        settlementIds: f.saves.map((row) => row.id),
        worldState: state,
        regionalGraph: f.graph,
        wizardNews: { currentTick: 12, entries: [] },
      },
      saves: f.saves,
      proposalId,
      now: NOW,
    });
  }

  it.each([
    ['automatic same-pulse closure', false],
    ['manually approved between-pulse closure', true],
  ])('preserves coalition context and reaches exact reimbursement for %s', (_label, manual) => {
    const f = coalitionFixture();
    const applied = manual
      ? manualApply(f)
      : apply(
          f,
          f.worldState,
          f.saves,
          f.graph,
          outcome({ proposalPayload: { coalitionSettlementClosure: f.congressClosure } }),
        );
    expect(applied).toBeTruthy();
    const peaceState = applied.worldState.relationshipStates[KEY];
    const peaceIncident = peaceState.recentIncidents.find((row) => (
      String(row.outcomeId || '').includes('sue_for_peace')
    ));
    expect(peaceIncident.coalitionPeaceClosure).toMatchObject({
      departingId: 'offerer',
      enemyId: 'target',
      callerId: 'root',
      abandoned: ['root'],
      expenditurePressure01: expect.any(Number),
      joinAnchor: { callId: 'coalition_call.root.offerer.target.1' },
    });
    expect(peaceIncident.coalitionSettlementClosure).toEqual(f.congressClosure);

    const settlementUpdates = applied.settlementUpdates;
    const nextDeployments = manual
      ? Object.fromEntries(Object.entries(applied.worldState.deployments || {})
        .filter(([id]) => id !== 'offerer'))
      : applied.worldState.deployments;
    const settled = advanceTreaties({
      snapshot: {
        settlements: f.saves,
        byId: new Map(f.saves.map((row) => [row.id, row])),
        regionalGraph: applied.regionalGraph,
      },
      worldState: {
        ...applied.worldState,
        tick: manual ? 13 : 12,
        deployments: nextDeployments,
      },
      settlementUpdates,
      graph: applied.regionalGraph,
      tick: manual ? 13 : 12,
      now: NOW,
    });
    const reimbursement = settled.worldState.relationshipStates[f.rootEdge.id]
      .coalitionSettlements.find((row) => row.action === 'reimbursement');
    expect(reimbursement).toMatchObject({
      fromId: 'root', toId: 'offerer', closureId: 'coalition_call.root.offerer.target.1',
    });
    expect(settled.coalitionEvidence.some((row) => (
      row.kind === 'coalition_debt_paid' || row.kind === 'coalition_debt_unpaid'
    ))).toBe(true);
    expect(settled.coalitionEvidence).toContainEqual(expect.objectContaining({
      kind: 'coalition_separate_peace',
      settlementId: 'offerer',
      counterpartId: 'root',
      thirdPartyId: 'target',
    }));
  });

  it('persists and reimburses every anchored member when the root caller closes its front', () => {
    const memberA = save('member-a', 'Ash', 800);
    const memberB = save('member-b', 'Birch', 900);
    const memberAEdge = {
      id: 'edge.offerer.member-a', from: 'offerer', to: 'member-a', relationshipType: 'allied',
    };
    const memberBEdge = {
      id: 'edge.offerer.member-b', from: 'offerer', to: 'member-b', relationshipType: 'allied',
    };
    const f = fixture({
      targetPopulation: 12000,
      targetExhaustion: 1,
      targetRulerId: 'new',
      extraSaves: [memberA, memberB],
      extraEdges: [memberAEdge, memberBEdge],
    });
    const fullRules = {
      ...RULES,
      peaceEngineEnabled: true,
      coalitionLedgerEnabled: true,
    };
    const joined = (memberId, joinedTick, relationshipKey) => ({
      callId: `coalition_call.offerer.${memberId}.target.3`,
      partyId: memberId,
      callerId: 'offerer',
      enemyId: 'target',
      joinedTick,
      callerDeploymentSinceTick: 3,
      originAttackerId: 'offerer',
      originSinceTick: 3,
      allianceRelationshipKey: relationshipKey,
      sourceCauseTypes: ['grievance'],
      cause: 'alliance_obligation',
    });
    let worldState = {
      ...f.worldState,
      simulationRules: fullRules,
      deployments: {
        ...f.worldState.deployments,
        'member-a': {
          targetId: 'target', sinceTick: 5, maxStartStrength: 100,
          currentEffectiveStrength: 50, accumulatedAttrition: 0.5,
          deployedPopulation: 120, joinLedger: [joined('member-a', 5, memberAEdge.id)],
        },
        'member-b': {
          targetId: 'target', sinceTick: 6, maxStartStrength: 100,
          currentEffectiveStrength: 40, accumulatedAttrition: 0.6,
          deployedPopulation: 140, joinLedger: [joined('member-b', 6, memberBEdge.id)],
        },
      },
      relationshipStates: {
        ...f.worldState.relationshipStates,
        [memberAEdge.id]: { relationshipType: 'allied', trust: 0.8, resentment: 0.1 },
        [memberBEdge.id]: { relationshipType: 'allied', trust: 0.8, resentment: 0.1 },
      },
    };
    worldState = withTargetDemand({ ...f, worldState }, 'peace');
    for (const row of f.saves) {
      row.settlement.economicState.foodSecurity = {
        storageMonths: row.id === 'offerer' ? 6 : row.id.startsWith('member-') ? 1 : 3,
        stockpile: { capacityMonths: 8 },
      };
    }

    const applied = apply(f, worldState, f.saves, f.graph, outcome());
    const peaceIncident = applied.worldState.relationshipStates[KEY].recentIncidents.find((row) => (
      String(row.outcomeId || '').includes('sue_for_peace')
    ));
    expect(peaceIncident.coalitionPeaceClosure).toMatchObject({
      departingId: 'offerer',
      callerId: 'offerer',
      enemyId: 'target',
      abandoned: ['member-a', 'member-b'],
    });
    expect(peaceIncident.coalitionPeaceClosure.reimbursementClaims.map((row) => row.memberId))
      .toEqual(['member-a', 'member-b']);

    const deployments = Object.fromEntries(Object.entries(applied.worldState.deployments || {})
      .filter(([id]) => !id.startsWith('member-')));
    const settled = advanceTreaties({
      snapshot: {
        settlements: f.saves,
        byId: new Map(f.saves.map((row) => [row.id, row])),
        regionalGraph: applied.regionalGraph,
      },
      worldState: { ...applied.worldState, deployments },
      settlementUpdates: applied.settlementUpdates,
      graph: applied.regionalGraph,
      tick: 12,
      now: NOW,
    });
    const reimbursements = [memberAEdge.id, memberBEdge.id].map((edgeId) => (
      settled.worldState.relationshipStates[edgeId].coalitionSettlements
        .find((row) => row.action === 'reimbursement')
    ));
    expect(reimbursements).toEqual([
      expect.objectContaining({ fromId: 'offerer', toId: 'member-a' }),
      expect.objectContaining({ fromId: 'offerer', toId: 'member-b' }),
    ]);
    expect(settled.coalitionEvidence.filter((row) => (
      row.kind === 'coalition_debt_paid' || row.kind === 'coalition_debt_unpaid'
    ))).toHaveLength(2);
  });
});
