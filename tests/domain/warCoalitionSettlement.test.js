import { describe, expect, it } from 'vitest';

import { normalizeWarCoalitionEvidence } from '../../src/domain/worldPulse/warCoalitionEvidence.js';
import {
  applyCoalitionReimbursement,
  applyCoalitionSettlement,
  forgiveCoalitionReimbursement,
  planCoalitionSettlement,
  validateCoalitionSettlementClosures,
} from '../../src/domain/worldPulse/warCoalitionSettlement.js';
import { obligationKey } from '../../src/domain/spatial/generosityReactions.js';
import {
  advanceTreaties,
  coalitionBetrayalCharacterRead,
  coalitionPeaceContext,
  treatyPairKey,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { advanceTreatiesWithDisposition } from '../../src/domain/worldPulse/dispositionChannels.js';
import { coalitionSettlementDispositionDeltas } from '../../src/domain/worldPulse/treatyDisposition.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { coalitionClosureWitness } from '../../src/domain/worldPulse/warCoalitionLedger.js';

const RULES = {
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  coalitionLedgerEnabled: true,
};

function closure(winnerId, loserId, patch = {}) {
  return {
    coalitionSettlementId: 'settlement.war.12',
    closureId: `closure.${winnerId}.${loserId}`,
    relationshipKey: `edge.${winnerId}.${loserId}`,
    winnerId,
    loserId,
    capacity01: loserId === 'l1' ? 0.8 : 0.4,
    culpability01: loserId === 'l1' ? 0.9 : 0.2,
    fieldLoss01: loserId === 'l1' ? 0.7 : 0.3,
    callerId: 'l1',
    bled01: winnerId === 'w1' ? 0.9 : 0.4,
    led01: winnerId === 'w1' ? 1 : 0.1,
    late01: winnerId === 'w1' ? 0 : 0.8,
    goodId: 'grain',
    goodName: 'Grain',
    ...patch,
  };
}

const CLOSURES = [
  closure('w1', 'l1'),
  closure('w2', 'l1'),
  closure('w1', 'l2'),
  closure('w2', 'l2'),
];

function anchor(partyId, callerId = 'root', enemyId = 'enemy', joinedTick = 5) {
  return {
    callId: `coalition_call.${callerId}.${partyId}.${enemyId}.1`,
    partyId,
    callerId,
    enemyId,
    joinedTick,
    callerDeploymentSinceTick: 1,
    originAttackerId: callerId,
    originSinceTick: 1,
    allianceRelationshipKey: `edge.${callerId}.${partyId}`,
    sourceCauseTypes: ['grievance'],
    cause: 'alliance_obligation',
  };
}

function item(id, population) {
  return {
    id,
    name: id[0].toUpperCase() + id.slice(1),
    settlement: {
      name: id,
      tier: population > 10000 ? 'city' : 'village',
      population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 50 },
      economicState: {
        prosperity: 'Stable',
        primaryExports: [{ id: 'grain', name: 'Grain' }],
        primaryImports: [],
        foodSecurity: { storageMonths: 6, stockpile: { capacityMonths: 8 } },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: `${id} seat`, category: 'military', power: 60, isGoverning: true }],
        conflicts: [],
      },
      institutions: [],
      npcs: [],
      activeConditions: [],
    },
  };
}

describe('WR-6 aggregate coalition settlement', () => {
  it('treats exact got-versus-spent equality as an honored-claim disposition win', () => {
    expect(coalitionSettlementDispositionDeltas({
      enabled: true,
      id: 'winner',
      got01: 0.2,
      spent01: 0.2,
      sourceEventId: 'settlement.exact.coalition_outcome.winner',
    })).toEqual([
      {
        id: 'winner', channel: 'mercantile', outcome: 'win', magnitude: 0.2,
        sourceKind: 'coalition_settlement_honored',
        sourceEventId: 'settlement.exact.coalition_outcome.winner',
      },
      {
        id: 'winner', channel: 'diplomatic', outcome: 'win', magnitude: 0.2,
        sourceKind: 'coalition_settlement_honored',
        sourceEventId: 'settlement.exact.coalition_outcome.winner',
      },
    ]);
  });

  it('requires one explicit id on every complete bilateral closure census', () => {
    expect(validateCoalitionSettlementClosures(CLOSURES, 'settlement.war.12')).toHaveLength(4);
    expect(planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12',
      closures: CLOSURES.map((row, index) => index ? row : { ...row, coalitionSettlementId: '' }),
      aggregateClaim01: 0.8,
      tick: 12,
    })).toBeNull();
    expect(planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12',
      closures: CLOSURES.slice(0, 3),
      aggregateClaim01: 0.8,
      tick: 12,
    })).toBeNull();
    for (const malformed of [
      { ...CLOSURES[0], closureId: '', id: 'fallback.forbidden' },
      { ...CLOSURES[0], callerId: '' },
      { ...CLOSURES[0], capacity01: 1.1 },
      { ...CLOSURES[0], goodName: '' },
    ]) {
      expect(validateCoalitionSettlementClosures([
        malformed,
        ...CLOSURES.slice(1),
      ], 'settlement.war.12')).toBeNull();
    }
  });

  it('allocates the exact aggregate by capacity/culpability/loss/caller and bled/led/late', () => {
    const plan = planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12',
      closures: [...CLOSURES].reverse(),
      aggregateClaim01: 0.8,
      tick: 12,
    });
    expect(plan).toBeTruthy();
    expect(plan.transfers.reduce((sum, row) => sum + row.units, 0)).toBe(plan.totalUnits);
    expect(plan.apportionment.reduce((sum, row) => sum + row.amount01, 0)).toBeCloseTo(0.8, 4);
    expect(plan.spoils.reduce((sum, row) => sum + row.amount01, 0)).toBeCloseTo(0.8, 4);
    expect(plan.apportionment.find((row) => row.loserId === 'l1').share01)
      .toBeGreaterThan(plan.apportionment.find((row) => row.loserId === 'l2').share01);
    expect(plan.spoils.find((row) => row.winnerId === 'w1').share01)
      .toBeGreaterThan(plan.spoils.find((row) => row.winnerId === 'w2').share01);
    expect(plan.coalitionEvidence.every((row) => normalizeWarCoalitionEvidence(row))).toBe(true);
    expect(plan.coalitionEvidence.every((row) => row.goodId === 'grain' && row.goodName === 'Grain')).toBe(true);
  });

  it('fails closed when one party reports different metrics across bilateral closures', () => {
    const mixedLoser = CLOSURES.map((row) => (
      row.winnerId === 'w2' && row.loserId === 'l1'
        ? { ...row, capacity01: 0.1 }
        : row
    ));
    const mixedWinner = CLOSURES.map((row) => (
      row.winnerId === 'w1' && row.loserId === 'l2'
        ? { ...row, late01: 0.95 }
        : row
    ));
    expect(validateCoalitionSettlementClosures(mixedLoser, 'settlement.war.12')).toBeNull();
    expect(validateCoalitionSettlementClosures(mixedWinner, 'settlement.war.12')).toBeNull();
    expect(planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12',
      closures: mixedLoser,
      aggregateClaim01: 0.8,
      tick: 12,
    })).toBeNull();
  });

  it('keeps zero-unit shares in the plan census but never mints transfer actions for them', () => {
    const wide = ['w1', 'w2', 'w3'].map((winnerId) => closure(winnerId, 'l1'));
    const plan = planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12',
      closures: wide,
      aggregateClaim01: 0.0001,
      tick: 12,
    });
    expect(plan.totalUnits).toBe(1);
    expect(plan.spoils).toHaveLength(3);
    expect(plan.spoils.filter((row) => row.amount01 === 0)).toHaveLength(2);
    expect(plan.transfers).toHaveLength(1);
    expect(plan.transfers.every((row) => row.units > 0)).toBe(true);

    const ids = ['w1', 'w2', 'w3', 'l1'];
    const items = ids.map((id) => item(id, 1000));
    const edges = wide.map((row) => ({
      id: row.relationshipKey,
      from: row.winnerId,
      to: row.loserId,
      relationshipType: 'cold_war',
    }));
    const worldState = {
      tick: 12,
      simulationRules: RULES,
      relationshipStates: Object.fromEntries(edges.map((row) => [row.id, { relationshipType: 'cold_war' }])),
    };
    const applied = applyCoalitionSettlement({
      worldState,
      snapshot: { byId: new Map(items.map((row) => [row.id, row])), regionalGraph: { edges } },
      settlementUpdates: items.map((row) => ({
        saveId: row.id, settlement: structuredClone(row.settlement),
      })),
      plan,
      closures: wide,
    });
    expect(applied.settlementActions).toHaveLength(1);
    expect(applied.settlementActions[0].closureId).toBe(plan.transfers[0].closureId);
  });

  it('does not claim a spoils division when there is only one winner', () => {
    const plan = planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12',
      closures: [closure('w1', 'l1'), closure('w1', 'l2')],
      aggregateClaim01: 0.5,
      tick: 12,
    });
    expect(plan.coalitionEvidence.some((row) => row.kind === 'coalition_spoils_divided')).toBe(false);
  });

  it('recomputes the canonical plan and rejects a forged transfer amount', () => {
    const plan = planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12', closures: CLOSURES, aggregateClaim01: 0.8, tick: 12,
    });
    const forged = {
      ...plan,
      transfers: plan.transfers.map((row, index) => index ? row : { ...row, amount01: 1 }),
    };
    const applied = applyCoalitionSettlement({
      worldState: { simulationRules: RULES },
      snapshot: { byId: new Map() },
      plan: forged,
      closures: CLOSURES,
    });
    expect(applied.changed).toBe(false);
    expect(applied.coalitionEvidence).toEqual([]);
  });

  it('moves grain pairwise, archives every closure first, and is exact-once on replay', () => {
    const ids = ['w1', 'w2', 'l1', 'l2'];
    const items = ids.map((id) => item(id, 1000));
    const edges = CLOSURES.map((row) => ({
      id: row.relationshipKey,
      from: row.winnerId,
      to: row.loserId,
      relationshipType: 'cold_war',
    }));
    const snapshot = { byId: new Map(items.map((row) => [row.id, row])), regionalGraph: { edges } };
    const settlementUpdates = items.map((row) => ({ saveId: row.id, settlement: structuredClone(row.settlement) }));
    const worldState = {
      tick: 12,
      simulationRules: RULES,
      relationshipStates: Object.fromEntries(edges.map((row) => [row.id, { relationshipType: 'cold_war' }])),
    };
    const plan = planCoalitionSettlement({
      coalitionSettlementId: 'settlement.war.12', closures: CLOSURES, aggregateClaim01: 0.8, tick: 12,
    });
    const first = applyCoalitionSettlement({ worldState, snapshot, settlementUpdates, plan, closures: CLOSURES });
    expect(first.changed).toBe(true);
    expect(first.settlementActions).toHaveLength(plan.transfers.length);
    expect(first.settlementActions.every((row) => row.action === 'settlement_transfer')).toBe(true);
    for (const action of first.settlementActions) {
      expect(first.worldState.relationshipStates[action.relationshipKey].coalitionSettlements)
        .toContainEqual(action);
    }
    const beforeStored = settlementUpdates.reduce((sum, row) => (
      sum + row.settlement.population * row.settlement.economicState.foodSecurity.storageMonths
    ), 0);
    const afterStored = first.settlementUpdates.reduce((sum, row) => (
      sum + row.settlement.population * row.settlement.economicState.foodSecurity.storageMonths
    ), 0);
    expect(afterStored).toBeLessThanOrEqual(beforeStored);

    const replay = applyCoalitionSettlement({
      worldState: first.worldState,
      snapshot,
      settlementUpdates: first.settlementUpdates,
      plan,
      closures: CLOSURES,
    });
    expect(replay.changed).toBe(false);
    expect(replay.settlementUpdates).toBe(first.settlementUpdates);
  });

  it('executes an explicit complete congress only through the live treaty closure path', () => {
    const ids = ['w1', 'w2', 'l1', 'l2'];
    const items = ids.map((id) => item(id, id.startsWith('w') ? 60000 : 1000));
    const componentClosureIds = CLOSURES.map((row) => row.closureId).sort();
    const edges = CLOSURES.map((row) => ({
      id: row.relationshipKey,
      from: row.winnerId,
      to: row.loserId,
      relationshipType: 'cold_war',
    }));
    const relationshipStates = Object.fromEntries(CLOSURES.map((row) => [
      row.relationshipKey,
      {
        relationshipType: 'cold_war',
        recentIncidents: [{
          tick: 12,
          type: 'strategy_sue_for_peace',
          outcomeId: `candidate.strategy.sue_for_peace.${row.closureId}`,
          coalitionSettlementClosure: {
            ...row,
            aggregateClaim01: 0.2,
            componentClosureIds,
          },
        }],
      },
    ]));
    const snapshot = {
      settlements: items,
      byId: new Map(items.map((row) => [row.id, row])),
      regionalGraph: { edges },
    };
    const settlementUpdates = items.map((row) => ({
      saveId: row.id, settlement: structuredClone(row.settlement),
    }));
    const worldState = {
      tick: 12,
      simulationRules: RULES,
      relationshipStates,
      deployments: {},
      spatialLedgers: {},
    };
    const beforeStored = settlementUpdates.reduce((sum, row) => (
      sum + row.settlement.population * row.settlement.economicState.foodSecurity.storageMonths
    ), 0);
    const complete = advanceTreaties({
      snapshot,
      worldState,
      settlementUpdates,
      graph: { edges },
      tick: 12,
    });
    expect(complete.coalitionEvidence.some((row) => row.kind === 'coalition_apportionment')).toBe(true);
    expect(complete.coalitionEvidence.some((row) => row.kind === 'coalition_spoils_divided')).toBe(true);
    for (const closureRow of CLOSURES) {
      expect(complete.worldState.relationshipStates[closureRow.relationshipKey].coalitionSettlements)
        .toContainEqual(expect.objectContaining({
          coalitionSettlementId: 'settlement.war.12',
          closureId: closureRow.closureId,
          action: 'settlement_transfer',
        }));
    }
    const afterStored = complete.settlementUpdates.reduce((sum, row) => (
      sum + row.settlement.population * row.settlement.economicState.foodSecurity.storageMonths
    ), 0);
    expect(afterStored).toBeLessThanOrEqual(beforeStored);

    const incompleteEdges = edges.slice(0, 3);
    const incompleteState = {
      ...worldState,
      relationshipStates: Object.fromEntries(
        Object.entries(relationshipStates).slice(0, 3),
      ),
    };
    const incomplete = advanceTreaties({
      snapshot: { ...snapshot, regionalGraph: { edges: incompleteEdges } },
      worldState: incompleteState,
      settlementUpdates,
      graph: { edges: incompleteEdges },
      tick: 12,
    });
    expect(Object.values(incomplete.worldState.relationshipStates).some((row) => (
      Array.isArray(row.coalitionSettlements) && row.coalitionSettlements.length > 0
    ))).toBe(false);
  });

  it('teaches every explicit winner from actual return versus live-or-validated spend, once', () => {
    const run = ({ loserStorage, highMemberSpend }) => {
      const adjustedClosures = CLOSURES.map((row) => ({
        ...row,
        bled01: 0.001,
        led01: row.winnerId === 'w1' ? 0.8 : 0.2,
        late01: row.winnerId === 'w1' ? 0.1 : 0.4,
      }));
      const componentClosureIds = adjustedClosures.map((row) => row.closureId).sort();
      const ids = ['w1', 'w2', 'l1', 'l2'];
      const items = ids.map((id) => item(id, 1000));
      for (const row of items.filter((entry) => entry.id.startsWith('w'))) {
        row.settlement.tier = 'city';
        row.settlement.economicState.foodSecurity = {
          storageMonths: 0,
          stockpile: { capacityMonths: 1002 },
        };
      }
      for (const row of items.filter((entry) => entry.id.startsWith('l'))) {
        row.settlement.economicState.foodSecurity = {
          storageMonths: loserStorage,
          stockpile: { capacityMonths: Math.max(8, loserStorage + 2) },
        };
      }
      const closureEdges = adjustedClosures.map((row) => ({
        id: row.relationshipKey,
        from: row.winnerId,
        to: row.loserId,
        relationshipType: 'cold_war',
      }));
      const allianceEdge = {
        id: 'edge.w1.w2', from: 'w1', to: 'w2', relationshipType: 'allied',
      };
      const edges = [...closureEdges, allianceEdge];
      const relationshipStates = Object.fromEntries(adjustedClosures.map((row) => [
        row.relationshipKey,
        {
          relationshipType: 'cold_war',
          recentIncidents: [{
            tick: 12,
            type: 'strategy_sue_for_peace',
            outcomeId: `candidate.strategy.sue_for_peace.${row.closureId}`,
            coalitionSettlementClosure: {
              ...row,
              aggregateClaim01: 0.8,
              componentClosureIds,
            },
          }],
        },
      ]));
      relationshipStates[allianceEdge.id] = { relationshipType: 'allied' };
      const snapshot = {
        settlements: items,
        byId: new Map(items.map((row) => [row.id, row])),
        regionalGraph: { edges },
      };
      const memberAnchor = anchor('w2', 'w1', 'l1');
      const worldState = {
        tick: 12,
        simulationRules: { ...RULES, dispositionChannelsEnabled: true },
        relationshipStates,
        deployments: {
          w2: {
            targetId: 'l1',
            sinceTick: 5,
            deployedPopulation: highMemberSpend ? 900 : 0,
            maxStartStrength: 100,
            currentEffectiveStrength: highMemberSpend ? 0 : 100,
            accumulatedAttrition: highMemberSpend ? 1 : 0,
            joinLedger: [memberAnchor],
          },
        },
        spatialLedgers: {},
      };
      const settlementUpdates = items.map((row) => ({
        saveId: row.id, settlement: structuredClone(row.settlement),
      }));
      const args = {
        snapshot,
        worldState,
        settlementUpdates,
        graph: { edges },
        tick: 12,
        dispositionEnabled: true,
      };
      return { args, result: advanceTreatiesWithDisposition(args) };
    };

    const profit = run({ loserStorage: 1000, highMemberSpend: false });
    for (const winnerId of ['w1', 'w2']) {
      expect(profit.result.dispositionDeltas).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: winnerId,
          channel: 'mercantile',
          outcome: 'win',
          sourceKind: 'coalition_settlement_profit',
          sourceEventId: `settlement.war.12.coalition_outcome.${winnerId}`,
        }),
        expect.objectContaining({
          id: winnerId,
          channel: 'diplomatic',
          outcome: 'win',
          sourceKind: 'coalition_settlement_profit',
        }),
      ]));
      expect(profit.result.worldState.dispositionStats[winnerId].channels.mercantile.stock01)
        .toBeGreaterThan(0.5);
    }
    const replay = advanceTreatiesWithDisposition({
      ...profit.args,
      worldState: profit.result.worldState,
      settlementUpdates: profit.result.settlementUpdates,
    });
    expect(replay.dispositionDeltas).toEqual([]);

    const shortfall = run({ loserStorage: 1.5, highMemberSpend: true }).result;
    for (const winnerId of ['w1', 'w2']) {
      expect(shortfall.dispositionDeltas).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: winnerId,
          channel: 'mercantile',
          outcome: 'loss',
          sourceKind: 'coalition_settlement_shortfall',
          sourceEventId: `settlement.war.12.coalition_outcome.${winnerId}`,
        }),
        expect.objectContaining({
          id: winnerId,
          channel: 'diplomatic',
          outcome: 'loss',
          sourceKind: 'coalition_settlement_shortfall',
        }),
      ]));
      expect(shortfall.worldState.dispositionStats[winnerId].channels.mercantile.stock01)
        .toBeLessThan(0.5);
    }
  });
});

describe('WR-6 caller reimbursement', () => {
  function reimbursementFixture({ callerStorage = 6, memberStorage = 1 } = {}) {
    const root = item('root', 1000);
    const member = item('member', 1000);
    const enemy = item('enemy', 1000);
    root.settlement.tier = 'city';
    member.settlement.tier = 'city';
    root.settlement.economicState.foodSecurity.storageMonths = callerStorage;
    member.settlement.economicState.foodSecurity.storageMonths = memberStorage;
    const edges = [{ id: 'edge.root.member', from: 'root', to: 'member', relationshipType: 'allied' }];
    const snapshot = {
      byId: new Map([root, member, enemy].map((row) => [row.id, row])),
      regionalGraph: { edges },
    };
    const worldState = {
      tick: 12,
      simulationRules: RULES,
      deployments: {
        root: { targetId: 'enemy', sinceTick: 1 },
        member: { targetId: 'enemy', sinceTick: 5, joinLedger: [anchor('member')] },
      },
      relationshipStates: { 'edge.root.member': { relationshipType: 'allied' } },
    };
    const settlementUpdates = [root, member, enemy]
      .map((row) => ({ saveId: row.id, settlement: structuredClone(row.settlement) }));
    return { snapshot, worldState, settlementUpdates };
  }

  it('records a real conserved reimbursement as paid and cannot charge it twice', () => {
    const f = reimbursementFixture();
    const first = applyCoalitionReimbursement({
      ...f,
      coalitionSettlementId: 'settlement.war.12',
      callerId: 'root', memberId: 'member', targetId: 'enemy', claim01: 0.1, tick: 12,
    });
    expect(first.changed).toBe(true);
    expect(first.coalitionEvidence[0].kind).toBe('coalition_debt_paid');
    expect(first.settlementAction).toMatchObject({ action: 'reimbursement', status: 'paid' });
    expect(getSpatialLedger(first.worldState, 'obligations')).toBeFalsy();

    const replay = applyCoalitionReimbursement({
      worldState: first.worldState,
      snapshot: f.snapshot,
      settlementUpdates: first.settlementUpdates,
      coalitionSettlementId: 'settlement.war.12',
      callerId: 'root', memberId: 'member', targetId: 'enemy', claim01: 0.1, tick: 12,
    });
    expect(replay.changed).toBe(false);
    expect(replay.settlementUpdates).toBe(first.settlementUpdates);
  });

  it('folds a measured unpaid remainder into obligations, and forgiveness is not payment', () => {
    const f = reimbursementFixture({ callerStorage: 1.5 });
    const unpaid = applyCoalitionReimbursement({
      ...f,
      coalitionSettlementId: 'settlement.war.12',
      callerId: 'root', memberId: 'member', targetId: 'enemy', claim01: 0.5, tick: 12,
    });
    expect(unpaid.coalitionEvidence[0]).toMatchObject({
      kind: 'coalition_debt_unpaid', paidByTransfer: false,
    });
    expect(getSpatialLedger(unpaid.worldState, 'obligations')[
      obligationKey('root', 'member', 'coalition_reimbursement')
    ].magnitude).toBe(0.5);

    const forgiven = forgiveCoalitionReimbursement({
      worldState: unpaid.worldState,
      snapshot: f.snapshot,
      coalitionSettlementId: 'settlement.war.12',
      closureId: anchor('member').callId,
      relationshipKey: 'edge.root.member',
      callerId: 'root', memberId: 'member', amount01: 1, tick: 13,
    });
    expect(forgiven.changed).toBe(true);
    expect(forgiven.coalitionEvidence[0]).toMatchObject({
      kind: 'coalition_reimbursement_forgiven', paidByTransfer: false,
    });
    expect(forgiven.settlementAction).toMatchObject({ action: 'forgiveness', status: 'forgiven' });
    expect(getSpatialLedger(forgiven.worldState, 'obligations')).toBeFalsy();
  });

  it('forgiveness is full-only and cannot be archived on an unrelated edge', () => {
    const f = reimbursementFixture({ callerStorage: 1.5 });
    const unpaid = applyCoalitionReimbursement({
      ...f,
      coalitionSettlementId: 'settlement.war.12',
      callerId: 'root', memberId: 'member', targetId: 'enemy', claim01: 0.5, tick: 12,
    });
    const request = {
      worldState: unpaid.worldState,
      snapshot: f.snapshot,
      coalitionSettlementId: 'settlement.war.12',
      closureId: anchor('member').callId,
      relationshipKey: 'edge.root.member',
      callerId: 'root',
      memberId: 'member',
      tick: 13,
    };
    const partial = forgiveCoalitionReimbursement({ ...request, amount01: 0.1 });
    expect(partial.changed).toBe(false);
    expect(getSpatialLedger(partial.worldState, 'obligations')[
      obligationKey('root', 'member', 'coalition_reimbursement')
    ].magnitude).toBe(0.5);

    const wrongEdge = { id: 'edge.root.enemy', from: 'root', to: 'enemy', relationshipType: 'allied' };
    const wrong = forgiveCoalitionReimbursement({
      ...request,
      worldState: {
        ...unpaid.worldState,
        relationshipStates: {
          ...unpaid.worldState.relationshipStates,
          [wrongEdge.id]: { relationshipType: 'allied' },
        },
      },
      snapshot: {
        ...f.snapshot,
        regionalGraph: { edges: [...f.snapshot.regionalGraph.edges, wrongEdge] },
      },
      relationshipKey: wrongEdge.id,
      amount01: 1,
    });
    expect(wrong.changed).toBe(false);
    expect(getSpatialLedger(wrong.worldState, 'obligations')[
      obligationKey('root', 'member', 'coalition_reimbursement')
    ].magnitude).toBe(0.5);
  });

  it('teaches paid and unpaid reimbursement once through the treaty disposition writer', () => {
    const run = (callerStorage, dispositionEnabled = true) => {
      const f = reimbursementFixture({ callerStorage });
      const closingEdge = {
        id: 'edge.member.enemy', from: 'member', to: 'enemy', relationshipType: 'cold_war',
      };
      const joinAnchor = anchor('member');
      const args = {
        snapshot: {
          ...f.snapshot,
          settlements: [...f.snapshot.byId.values()],
          regionalGraph: { edges: [...f.snapshot.regionalGraph.edges, closingEdge] },
        },
        worldState: {
          ...f.worldState,
          simulationRules: { ...RULES, dispositionChannelsEnabled: dispositionEnabled },
          deployments: { root: f.worldState.deployments.root },
          relationshipStates: {
            ...f.worldState.relationshipStates,
            [closingEdge.id]: {
              relationshipType: 'cold_war',
              recentIncidents: [{
                tick: 12,
                type: 'strategy_sue_for_peace',
                outcomeId: 'peace.reimbursement.12',
                coalitionPeaceClosure: {
                  departingId: 'member', enemyId: 'enemy', callerId: 'root',
                  abandoned: ['root'], members: ['member', 'root'], joinAnchor,
                  reimbursementClaims: [{ memberId: 'member', pressure01: 0.1, joinAnchor }],
                },
              }],
            },
          },
          spatialLedgers: {},
        },
        settlementUpdates: f.settlementUpdates,
        graph: { edges: [...f.snapshot.regionalGraph.edges, closingEdge] },
        tick: 12,
        dispositionEnabled,
      };
      return { args, result: advanceTreatiesWithDisposition(args) };
    };

    const paid = run(6);
    expect(paid.result.dispositionDeltas).toEqual([
      expect.objectContaining({
        id: 'member', channel: 'mercantile', outcome: 'win',
        sourceKind: 'coalition_reimbursement_paid',
        sourceEventId: 'peace.reimbursement.12.coalition_call.root.member.enemy.1.reimbursement',
      }),
      expect.objectContaining({
        id: 'member', channel: 'diplomatic', outcome: 'win',
        sourceKind: 'coalition_reimbursement_paid',
        sourceEventId: 'peace.reimbursement.12.coalition_call.root.member.enemy.1.reimbursement',
      }),
    ]);
    expect(paid.result.worldState.dispositionStats.member.channels.mercantile.stock01).toBeGreaterThan(0.5);
    expect(paid.result.worldState.dispositionStats.member.channels.diplomatic.stock01).toBeGreaterThan(0.5);
    const replay = advanceTreatiesWithDisposition({
      ...paid.args,
      worldState: paid.result.worldState,
      settlementUpdates: paid.result.settlementUpdates,
    });
    expect(replay.dispositionDeltas).toEqual([]);
    expect(replay.worldState.dispositionStats.member.channels.mercantile.stock01)
      .toBe(paid.result.worldState.dispositionStats.member.channels.mercantile.stock01);

    const unpaid = run(1.5).result;
    expect(unpaid.dispositionDeltas).toEqual([
      expect.objectContaining({
        id: 'member', channel: 'mercantile', outcome: 'loss',
        sourceKind: 'coalition_reimbursement_unpaid',
      }),
      expect.objectContaining({
        id: 'member', channel: 'diplomatic', outcome: 'loss',
        sourceKind: 'coalition_reimbursement_unpaid',
      }),
    ]);
    expect(unpaid.worldState.dispositionStats.member.channels.mercantile.stock01).toBeLessThan(0.5);
    expect(unpaid.worldState.dispositionStats.member.channels.diplomatic.stock01).toBeLessThan(0.5);

    const dark = run(6, false).result;
    expect(Object.hasOwn(dark, 'dispositionDeltas')).toBe(false);
    expect(dark.worldState.dispositionStats).toBeUndefined();
  });
});

describe('WR-6 pairwise peace', () => {
  it('finds only the anchored coalition and excludes the same-target rogue', () => {
    const worldState = {
      simulationRules: RULES,
      deployments: {
        root: { targetId: 'enemy', sinceTick: 1 },
        member: { targetId: 'enemy', sinceTick: 5, joinLedger: [anchor('member')] },
        sibling: { targetId: 'enemy', sinceTick: 6, joinLedger: [anchor('sibling', 'root', 'enemy', 6)] },
        rogue: { targetId: 'enemy', sinceTick: 2 },
      },
    };
    expect(coalitionPeaceContext(worldState, 'member', 'enemy', 12)).toMatchObject({
      departingId: 'member', enemyId: 'enemy', callerId: 'root', abandoned: ['root', 'sibling'],
    });
    expect(coalitionPeaceContext(worldState, 'root', 'enemy', 12)).toMatchObject({
      departingId: 'root', abandoned: ['member', 'sibling'],
    });
    expect(coalitionPeaceContext(worldState, 'rogue', 'enemy', 12)).toBeNull();
  });

  it('derives defensive roots and resolves opposing coalitions by the named departing court', () => {
    const defensiveAnchor = {
      ...anchor('shield', 'defender', 'attacker'),
      originAttackerId: 'attacker',
    };
    const defensive = {
      simulationRules: RULES,
      deployments: {
        attacker: { targetId: 'defender', sinceTick: 1 },
        shield: { targetId: 'attacker', sinceTick: 5, joinLedger: [defensiveAnchor] },
        rogue: { targetId: 'attacker', sinceTick: 2 },
      },
    };
    expect(coalitionClosureWitness(defensive, 'attacker', 'defender', 12, 'defender'))
      .toMatchObject({
        departingId: 'defender',
        enemyId: 'attacker',
        callerId: 'defender',
        abandoned: ['shield'],
      });

    const opposing = {
      simulationRules: RULES,
      deployments: {
        attacker: { targetId: 'defender', sinceTick: 1 },
        spear: { targetId: 'defender', sinceTick: 5, joinLedger: [anchor('spear', 'attacker', 'defender')] },
        shield: { targetId: 'attacker', sinceTick: 5, joinLedger: [defensiveAnchor] },
      },
    };
    expect(coalitionClosureWitness(opposing, 'attacker', 'defender', 12)).toBeNull();
    expect(coalitionClosureWitness(opposing, 'attacker', 'defender', 12, 'attacker'))
      .toMatchObject({ departingId: 'attacker', abandoned: ['spear'] });
    expect(coalitionClosureWitness(opposing, 'attacker', 'defender', 12, 'defender'))
      .toMatchObject({ departingId: 'defender', abandoned: ['shield'] });
  });

  it('mints a separate bilateral treaty and typed exit while the caller front survives', () => {
    const member = item('member', 60000);
    const enemy = item('enemy', 300);
    const root = item('root', 12000);
    const items = [member, enemy, root];
    const edges = [
      { id: 'edge.member.enemy', from: 'member', to: 'enemy', relationshipType: 'hostile' },
      { id: 'edge.root.enemy', from: 'root', to: 'enemy', relationshipType: 'hostile' },
      { id: 'edge.root.member', from: 'root', to: 'member', relationshipType: 'allied' },
    ];
    const worldState = {
      tick: 12,
      simulationRules: RULES,
      deployments: {
        root: { targetId: 'enemy', sinceTick: 1 },
        member: { targetId: 'enemy', sinceTick: 5, recalled: { cause: 'sue_for_peace' }, joinLedger: [anchor('member')] },
      },
      relationshipStates: {
        'edge.member.enemy': {
          relationshipType: 'cold_war',
          lastTransitionTick: 12,
          recentIncidents: [{ tick: 12, type: 'strategy_sue_for_peace', outcomeId: 'peace.member.12' }],
        },
        'edge.root.enemy': { relationshipType: 'hostile' },
        'edge.root.member': { relationshipType: 'allied', trust: 0.8 },
      },
      spatialLedgers: {},
      warExhaustion: { member: 0.1 },
    };
    const snapshot = { byId: new Map(items.map((row) => [row.id, row])), regionalGraph: { edges } };
    const result = advanceTreaties({ snapshot, worldState, graph: { edges }, tick: 12 });
    const ledger = getSpatialLedger(result.worldState, 'treaties');
    const treaty = ledger[treatyPairKey('member', 'enemy')];
    expect(treaty.separateExit).toBe(true);
    expect(treaty.coalitionScope).toBeUndefined();
    expect(treaty.fracture).toMatchObject({ deserter: 'member', abandoned: ['root'] });
    expect(result.coalitionEvidence).toHaveLength(1);
    expect(result.coalitionEvidence[0]).toMatchObject({
      kind: 'coalition_separate_peace', settlementId: 'member', counterpartId: 'root', thirdPartyId: 'enemy',
    });
  });

  it('prices a persisted white-peace exit exactly once after the joined deployment is gone', () => {
    const member = item('member', 1000);
    const enemy = item('enemy', 1000);
    const root = item('root', 1000);
    const edges = [
      { id: 'edge.member.enemy', from: 'member', to: 'enemy', relationshipType: 'cold_war' },
      { id: 'edge.root.member', from: 'root', to: 'member', relationshipType: 'allied' },
    ];
    const joinAnchor = anchor('member');
    const worldState = {
      tick: 12,
      simulationRules: RULES,
      deployments: { root: { targetId: 'enemy', sinceTick: 1 } },
      relationshipStates: {
        'edge.member.enemy': {
          relationshipType: 'cold_war',
          recentIncidents: [{
            tick: 12,
            type: 'strategy_sue_for_peace',
            outcomeId: 'candidate.strategy.sue_for_peace.member.12',
            coalitionPeaceClosure: {
              departingId: 'member',
              enemyId: 'enemy',
              callerId: 'root',
              abandoned: ['alpha', 'root'],
              members: ['alpha', 'member', 'root'],
              joinAnchor,
            },
          }],
        },
        'edge.root.member': { relationshipType: 'allied', trust: 0.8, resentment: 0.1 },
      },
      spatialLedgers: {},
    };
    const items = [member, enemy, root];
    const snapshot = {
      settlements: items,
      byId: new Map(items.map((row) => [row.id, row])),
      regionalGraph: { edges },
    };
    const first = advanceTreaties({ snapshot, worldState, graph: { edges }, tick: 12 });
    expect(first.worldState.relationshipStates['edge.root.member'].trust).toBeCloseTo(0.56);
    expect(first.worldState.relationshipStates['edge.root.member'].resentment).toBeCloseTo(0.45);
    expect(first.coalitionEvidence).toContainEqual(expect.objectContaining({
      kind: 'coalition_separate_peace',
      tick: 12,
      settlementId: 'member',
      counterpartId: 'root',
    }));
    expect(first.worldState.relationshipStates['edge.member.enemy'].coalitionSettlements)
      .toContainEqual(expect.objectContaining({
        action: 'separate_peace',
        status: 'recorded',
        fromId: 'member',
        toId: 'enemy',
      }));
    expect(getSpatialLedger(first.worldState, 'treaties')).toBeFalsy();

    const closingPeaceIncident = first.worldState.relationshipStates['edge.member.enemy'].recentIncidents
      .find((row) => String(row.outcomeId || '').includes('sue_for_peace'));
    const second = advanceTreaties({
      snapshot,
      worldState: {
        ...first.worldState,
        tick: 13,
        relationshipStates: {
          ...first.worldState.relationshipStates,
          // Evict both rolling WR-6 incidents. The bounded action archive, not
          // recentIncidents, must still prevent a second betrayal or public fact.
          'edge.member.enemy': {
            ...first.worldState.relationshipStates['edge.member.enemy'],
            recentIncidents: [closingPeaceIncident, ...Array.from({ length: 9 }, (_, index) => ({
              tick: 12,
              type: `noise_${index}`,
              outcomeId: `noise.${index}`,
            }))],
          },
          'edge.root.member': {
            ...first.worldState.relationshipStates['edge.root.member'],
            recentIncidents: [],
          },
        },
      },
      graph: { edges },
      tick: 13,
    });
    expect(second.worldState.relationshipStates['edge.root.member'].trust).toBeCloseTo(0.56);
    expect(second.worldState.relationshipStates['edge.root.member'].resentment).toBeCloseTo(0.45);
    expect(second.worldState.relationshipStates['edge.root.member'].recentIncidents).toEqual([]);
    expect(second.coalitionEvidence).toEqual([]);
  });

  it('lets each abandoned court read the same betrayal through its own authored and learned character', () => {
    const court = (id, personality) => {
      const row = item(id, 1000);
      row.settlement.powerStructure.factions = [{
        id: `${id}.seat`, faction: `${id} Seat`, power: 60, isGoverning: true,
      }];
      row.settlement.npcs = [{
        id: 'ruler', name: `${id} ruler`, factionAffiliation: `${id} Seat`, personality,
      }];
      return row;
    };
    const grieved = court('grieved', {
      dominant: 'ruthless', flaw: 'vengeful', modifier: 'wrathful',
    });
    const prudent = court('prudent', {
      dominant: 'merciful', flaw: 'compassionate', modifier: 'diplomatic',
    });
    const member = item('member', 1000);
    const enemy = item('enemy', 1000);
    const items = [grieved, prudent, member, enemy];
    const channelEntry = (martial, diplomatic, insular) => ({
      wins: 0,
      losses: 0,
      score: 0,
      channels: {
        martial: { stock01: martial, band: 'settled' },
        mercantile: { stock01: 0.5, band: 'settled' },
        diplomatic: { stock01: diplomatic, band: 'settled' },
        insular: { stock01: insular, band: 'settled' },
      },
      updatedTick: 12,
    });
    const worldState = {
      tick: 12,
      simulationRules: { ...RULES, dispositionChannelsEnabled: true },
      dispositionStats: {
        grieved: channelEntry(1, 0, 0),
        prudent: channelEntry(0, 1, 1),
      },
      spatialLedgers: {
        npcLadder: {
          grieved: { factions: { 'grieved.seat': { rungs: ['grieved:ruler'] } } },
          prudent: { factions: { 'prudent.seat': { rungs: ['prudent:ruler'] } } },
        },
      },
    };
    const snapshot = { byId: new Map(items.map((row) => [row.id, row])) };
    const grievance = coalitionBetrayalCharacterRead({
      worldState, snapshot, allyId: 'grieved', deserterId: 'member',
    });
    const prudence = coalitionBetrayalCharacterRead({
      worldState, snapshot, allyId: 'prudent', deserterId: 'member',
    });
    expect(grievance).toMatchObject({ interpretation: 'grievance' });
    expect(prudence).toMatchObject({ interpretation: 'prudence' });
    expect(grievance.multiplier).toBeGreaterThan(prudence.multiplier);
    expect(grievance.multiplier).toBeLessThanOrEqual(1.2);
    expect(prudence.multiplier).toBeGreaterThanOrEqual(0.8);
    const authoredOnlyState = {
      ...worldState,
      simulationRules: { ...RULES, dispositionChannelsEnabled: false },
    };
    expect(coalitionBetrayalCharacterRead({
      worldState: authoredOnlyState,
      snapshot,
      allyId: 'grieved',
      deserterId: 'member',
    }).interpretation).toBe('grievance');
    expect(coalitionBetrayalCharacterRead({
      worldState: authoredOnlyState,
      snapshot,
      allyId: 'prudent',
      deserterId: 'member',
    }).interpretation).toBe('prudence');
    expect(coalitionBetrayalCharacterRead({
      worldState: {
        ...authoredOnlyState,
        simulationRules: { ...RULES, coalitionLedgerEnabled: false },
      },
      snapshot,
      allyId: 'grieved',
      deserterId: 'member',
    })).toEqual({ multiplier: 1, interpretation: 'balanced' });

    const joinAnchor = anchor('member');
    const edges = [
      { id: 'edge.member.enemy', from: 'member', to: 'enemy', relationshipType: 'cold_war' },
      { id: 'edge.grieved.member', from: 'grieved', to: 'member', relationshipType: 'allied' },
      { id: 'edge.prudent.member', from: 'prudent', to: 'member', relationshipType: 'allied' },
    ];
    const applied = advanceTreaties({
      snapshot: { ...snapshot, settlements: items, regionalGraph: { edges } },
      worldState: {
        ...worldState,
        deployments: { root: { targetId: 'enemy', sinceTick: 1 } },
        relationshipStates: {
          'edge.member.enemy': {
            relationshipType: 'cold_war',
            recentIncidents: [{
              tick: 12,
              type: 'strategy_sue_for_peace',
              outcomeId: 'peace.character.12',
              coalitionPeaceClosure: {
                departingId: 'member', enemyId: 'enemy', callerId: 'root',
                abandoned: ['grieved', 'prudent'], members: ['grieved', 'member', 'prudent'],
                joinAnchor,
              },
            }],
          },
          'edge.grieved.member': { relationshipType: 'allied', trust: 0.8, resentment: 0.1 },
          'edge.prudent.member': { relationshipType: 'allied', trust: 0.8, resentment: 0.1 },
        },
      },
      graph: { edges },
      tick: 12,
    });
    expect(applied.worldState.relationshipStates['edge.grieved.member'].resentment)
      .toBeGreaterThan(applied.worldState.relationshipStates['edge.prudent.member'].resentment);
    expect(applied.worldState.relationshipStates['edge.grieved.member'].trust)
      .toBeLessThan(applied.worldState.relationshipStates['edge.prudent.member'].trust);
  });
});
