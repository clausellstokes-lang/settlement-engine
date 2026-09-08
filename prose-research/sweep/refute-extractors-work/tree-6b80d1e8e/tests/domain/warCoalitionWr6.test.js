import { describe, expect, test } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import {
  applyWorldPulseOutcomes,
  applyWorldPulseProposal,
} from '../../src/domain/worldPulse/applyWorldPulse.js';
import {
  computeAllyRelief,
  computeLevySources,
  evaluateWarLayer,
} from '../../src/domain/worldPulse/warDeployment.js';
import {
  allianceObligationReason,
  allianceCallWasDecided,
  coalitionCallIdFor,
  joinAnchorOf,
  normalizeJoinAnchor,
  obligationDischargedReason,
} from '../../src/domain/worldPulse/warCoalitionLedger.js';
import { advancePeaceReasons, peaceReasonsFor } from '../../src/domain/worldPulse/peaceReasons.js';
import { normalizeAllianceCalls } from '../../src/domain/worldPulse/relationshipState.js';
import { applyRelationshipPatch } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { readStandingCoalitionDecision } from '../../src/domain/worldPulse/warPeaceDecision.js';
import { readWarTerminations } from '../../src/domain/worldPulse/warTermination.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';

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
const LOW_ROLL = Object.freeze({
  random: () => 0,
  fork() { return this; },
});

function save(id, name, { tier = 'town', population = 5000 } = {}) {
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
        factions: [{ id: `seat-${id}`, faction: `${name} Council`, category: 'military', power: 70, isGoverning: true }],
        conflicts: [],
      },
      npcs: [],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function rootDeployment(targetId) {
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
      type: 'grievance', score: 0.8, receipt: 'The opening wrong still stands.', atTick: 2,
    }],
  };
}

function dispositionEntry({ martial, diplomatic, insular }) {
  return {
    wins: 0,
    losses: 0,
    score: 0,
    channels: {
      martial: { stock01: martial },
      mercantile: { stock01: 0.5 },
      diplomatic: { stock01: diplomatic },
      insular: { stock01: insular },
    },
    updatedTick: 5,
  };
}

const HOSTILE = { id: 'edge.attacker.defender', from: 'attacker', to: 'defender', relationshipType: 'hostile' };
const DEF_ALLY = { id: 'edge.defender.ally', from: 'defender', to: 'ally', relationshipType: 'allied' };

function fixture({
  rules = LIT,
  alliedState = {},
  dispositionStats = {},
  extraEdges = [],
  extraSaves = [],
} = {}) {
  const saves = [
    save('attacker', 'Ironhold', { tier: 'city', population: 40000 }),
    save('defender', 'Thornmere', { tier: 'village', population: 800 }),
    save('ally', 'Brookhaven', { tier: 'town', population: 7000 }),
    ...extraSaves,
  ];
  const edges = [HOSTILE, DEF_ALLY, ...extraEdges];
  const worldState = {
    tick: 5,
    rngSeed: 'wr6',
    simulationRules: { ...rules },
    dispositionStats,
    deployments: { attacker: rootDeployment('defender') },
    relationshipStates: {
      [HOSTILE.id]: { relationshipType: 'hostile' },
      [DEF_ALLY.id]: { relationshipType: 'allied', ...alliedState },
    },
    spatialLedgers: {
      warReasons: {
        'attacker>defender': {
          reasons: {
            grievance: { type: 'grievance', score: 0.8, sinceTick: 2, tick: 5, receipt: 'The opening wrong still stands.' },
          },
          updatedTick: 5,
        },
      },
    },
  };
  const campaign = {
    id: 'wr6-fixture',
    name: 'WR-6 fixture',
    settlementIds: saves.map((row) => row.id),
    worldState,
    regionalGraph: ensureRegionalGraph({
      edges,
      channels: [{
        type: 'war_front', from: 'attacker', to: 'defender', status: 'confirmed',
        source: 'war_layer_deploy', relationshipKey: 'war_front.attacker.defender',
      }],
    }),
    wizardNews: { currentTick: 5, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return { saves, campaign, snapshot, worldState };
}

function run(options = {}) {
  const built = fixture(options);
  const rules = options.rules || LIT;
  return {
    ...built,
    war: evaluateWarLayer({
      snapshot: built.snapshot,
      worldState: built.worldState,
      rng: HIGH_ROLL,
      tick: 5,
      now: NOW,
      rules,
    }),
  };
}

describe('WR-6 bilateral join decisions', () => {
  test('a defender calls an ally into its own next-state war after the root siege read', () => {
    const lit = run();
    const dark = run({ rules: { ...LIT, coalitionLedgerEnabled: false } });

    expect(lit.war.deployments.ally).toMatchObject({ targetId: 'attacker', sinceTick: 5, role: 'siege' });
    expect(lit.war.deployments.ally.deploymentAge).toBe(0);
    expect(lit.war.graphChannels).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'war_front', from: 'ally', to: 'attacker' }),
    ]));

    const anchor = lit.war.deployments.ally.joinLedger?.[0];
    expect(anchor).toMatchObject({
      partyId: 'ally',
      callerId: 'defender',
      enemyId: 'attacker',
      originAttackerId: 'attacker',
      originSinceTick: 2,
      sourceCauseTypes: ['grievance'],
      cause: 'alliance_obligation',
    });
    // The source is read in the physical root's attacker->originalTarget
    // direction, not the defender caller's reverse direction.
    expect(lit.worldState.spatialLedgers.warReasons['defender>attacker']).toBeUndefined();

    // Read-last/write-next: the root engagement was evaluated before the ally
    // existed.  Its aged/attrited record is identical to the coalition-dark
    // control; only afterward is the fresh age-zero counter-siege installed.
    expect(lit.war.deployments.attacker.currentEffectiveStrength)
      .toBe(dark.war.deployments.attacker.currentEffectiveStrength);
    expect(lit.war.deployments.attacker.deploymentAge).toBeGreaterThan(2);

    const joined = lit.war.outcomes.find((row) => row.candidateType === 'strategy_deploy' && row.targetSaveId === 'ally');
    expect(joined).toMatchObject({
      applyMode: 'auto',
      relationshipKey: DEF_ALLY.id,
      metadata: { incidentType: 'coalition_joined' },
    });
    expect(joined.metadata.coalitionEvidence.map((row) => row.kind)).toEqual([
      'coalition_entry_priced', 'coalition_joined', 'casus_alliance_obligation',
    ]);
    expect(joined.metadata.coalitionEvidence[0].band)
      .toMatch(/^(quiet|present|pressing|decisive)$/);
    expect(joined.metadata.coalitionEvidence.every((row) => row.counterpartId === 'defender' && row.thirdPartyId === 'attacker')).toBe(true);

    const readerCopy = JSON.stringify({ headline: joined.headline, summary: joined.summary, reasons: joined.reasons });
    expect(readerCopy).not.toMatch(/[0-9%×]/);
    expect(readerCopy).not.toContain(anchor.callId);
  });

  test('the same material call joins or refuses when only the called court\'s WR-2 temperament changes', () => {
    const rules = { ...LIT, dispositionChannelsEnabled: true };
    const open = run({
      rules,
      dispositionStats: {
        ally: dispositionEntry({ martial: 1, diplomatic: 0.5, insular: 0 }),
      },
    }).war;
    const guarded = run({
      rules,
      dispositionStats: {
        ally: dispositionEntry({ martial: 0, diplomatic: 0.5, insular: 1 }),
      },
    }).war;

    const joined = open.outcomes.find((row) => row.metadata?.incidentType === 'coalition_joined'
      && row.targetSaveId === 'ally');
    const refused = guarded.outcomes.find((row) => row.metadata?.incidentType === 'coalition_refused'
      && row.targetSaveId === 'ally');
    expect(open.deployments.ally).toMatchObject({ targetId: 'attacker', sinceTick: 5 });
    expect(guarded.deployments.ally).toBeUndefined();
    expect(joined.metadata.allianceCall.callId).toBe(refused.metadata.allianceCall.callId);
    expect(joined.metadata.coalitionEvidence.find((row) => row.kind === 'coalition_joined'))
      .toMatchObject({ temperamentDirection: 'open', decision: 'joined' });
    expect(refused.metadata.coalitionEvidence.find((row) => row.kind === 'coalition_refused'))
      .toMatchObject({ temperamentDirection: 'guarded', decision: 'refused' });
    expect(joined.metadata.coalitionEvidence.find((row) => row.kind === 'coalition_joined')?.booksDirection)
      .toBe(refused.metadata.coalitionEvidence.find((row) => row.kind === 'coalition_refused')?.booksDirection);
  });

  test('persisted WR-2 temperament cannot move the join bar while its flag is dark', () => {
    const open = run({
      dispositionStats: {
        ally: dispositionEntry({ martial: 1, diplomatic: 0.5, insular: 0 }),
      },
    }).war;
    const guarded = run({
      dispositionStats: {
        ally: dispositionEntry({ martial: 0, diplomatic: 0.5, insular: 1 }),
      },
    }).war;

    expect(open.deployments.ally).toEqual(guarded.deployments.ally);
    const openDecision = open.outcomes.find((row) => row.metadata?.incidentType === 'coalition_joined'
      || row.metadata?.incidentType === 'coalition_refused');
    const guardedDecision = guarded.outcomes.find((row) => row.metadata?.incidentType === 'coalition_joined'
      || row.metadata?.incidentType === 'coalition_refused');
    expect(openDecision).toEqual(guardedDecision);
    expect(openDecision.metadata.coalitionEvidence.find(
      (row) => row.kind === 'coalition_joined' || row.kind === 'coalition_refused',
    )).toMatchObject({ temperamentDirection: 'balanced' });
  });

  test('DM-driven authority withholds the joined army/front but retains evidence inside the held outcome', () => {
    const rules = { ...LIT, politicalAutonomy: 'dm_only' };
    const { war } = run({ rules });
    const held = war.outcomes.find((row) => row.candidateType === 'strategy_deploy' && row.targetSaveId === 'ally');
    expect(held.applyMode).toBe('proposal');
    expect(war.deployments.ally).toBeUndefined();
    expect(war.graphChannels.some((row) => row.from === 'ally' && row.to === 'attacker')).toBe(false);
    expect(held.proposalPayload).toMatchObject({
      kind: 'siege_initiation',
      besieger: 'ally',
      besieged: 'attacker',
      coalition: { callerId: 'defender', originAttackerId: 'attacker' },
    });
    expect(held.proposalPayload.deployment.joinLedger).toHaveLength(1);
    expect(held.metadata.coalitionEvidence.map((row) => row.kind)).toEqual([
      'coalition_entry_priced', 'coalition_joined', 'casus_alliance_obligation',
    ]);
    expect(held.headline).toBe("Brookhaven proposes to answer Thornmere's call");
    expect(held.summary).toMatch(/would commit its own army/);
    expect(held.summary).not.toMatch(/\bcommits\b/);
  });

  test('a newly joined ally cannot reconsider the call until a later tick', () => {
    const { war, worldState, snapshot } = run();
    const joinedWorld = { ...worldState, deployments: war.deployments };
    const joinedSnapshot = { ...snapshot, worldState: joinedWorld };
    expect(readStandingCoalitionDecision({
      worldState: joinedWorld,
      snapshot: joinedSnapshot,
      partyId: 'ally',
      targetId: 'attacker',
      tick: 5,
    })).toBeNull();
    expect(readStandingCoalitionDecision({
      worldState: joinedWorld,
      snapshot: joinedSnapshot,
      partyId: 'ally',
      targetId: 'attacker',
      tick: 6,
    })).toMatchObject({ partyId: 'ally', targetId: 'attacker' });
  });

  test('the same joined episode, expenditure, and cause stays or exits when only the ally temperament changes', () => {
    const rules = { ...LIT, dispositionChannelsEnabled: true };
    const built = run({
      rules,
      dispositionStats: {
        ally: dispositionEntry({ martial: 1, diplomatic: 0.5, insular: 0 }),
      },
    });
    expect(built.war.deployments.ally).toBeTruthy();
    const joinedWorld = {
      ...built.worldState,
      simulationRules: rules,
      deployments: built.war.deployments,
    };
    const decideWith = (entry) => {
      const worldState = {
        ...joinedWorld,
        dispositionStats: { ...joinedWorld.dispositionStats, ally: entry },
      };
      return readStandingCoalitionDecision({
        worldState,
        snapshot: { ...built.snapshot, worldState },
        partyId: 'ally',
        targetId: 'attacker',
        tick: 6,
      });
    };
    const staying = decideWith(dispositionEntry({
      martial: 1, diplomatic: 0, insular: 0,
    }));
    const exiting = decideWith(dispositionEntry({
      martial: 0, diplomatic: 1, insular: 1,
    }));

    expect(staying.decision).toBe('stay');
    expect(exiting.decision).toBe('exit');
    expect(staying.expenditure).toEqual(exiting.expenditure);
    expect(staying.termination.bands).toEqual(exiting.termination.bands);
    expect(staying.termination.books).toEqual(exiting.termination.books);
    expect(staying.termination.decidingTerm).toBe(exiting.termination.decidingTerm);
    expect(staying.termination.receipt.causeState).toBe(exiting.termination.receipt.causeState);
    expect(staying.termination.suePressure01).toBeLessThan(exiting.termination.suePressure01);
    expect(staying.coalitionEvidence.some((row) => row.kind === 'coalition_stayed')).toBe(true);
    expect(exiting.coalitionEvidence.some((row) => row.kind === 'coalition_stayed')).toBe(false);
  });

  test('a delayed coalition approval joins at approval time and a dead call supersedes cleanly', () => {
    const rules = { ...LIT, politicalAutonomy: 'dm_only' };
    const built = run({ rules });
    const held = built.war.outcomes.find((row) => row.candidateType === 'strategy_deploy'
      && row.targetSaveId === 'ally');
    const currentState = { ...built.worldState, deployments: built.war.deployments };
    const settlementMap = new Map(built.saves.map((row) => [row.id, {
      saveId: row.id,
      save: row,
      settlement: row.settlement,
    }]));
    const queued = applyWorldPulseOutcomes({
      snapshot: { ...built.snapshot, worldState: currentState },
      worldState: currentState,
      regionalGraph: built.snapshot.regionalGraph,
      wizardNews: built.campaign.wizardNews,
      settlementMap,
      outcomes: [held],
      tick: 5,
      now: NOW,
      simulationRules: rules,
    });
    const pending = queued.worldState.proposals.find((row) => row.status === 'pending');
    const laterState = { ...queued.worldState, tick: 7 };
    const approved = applyWorldPulseProposal({
      campaign: {
        ...built.campaign,
        worldState: laterState,
        regionalGraph: queued.regionalGraph,
        wizardNews: queued.wizardNews,
      },
      saves: built.saves,
      proposalId: pending.id,
      now: NOW,
    });
    expect(approved.worldState.deployments.ally).toMatchObject({
      targetId: 'attacker',
      sinceTick: 7,
      deploymentAge: 0,
    });
    expect(approved.worldState.deployments.ally.joinLedger[0].joinedTick).toBe(7);
    expect(approved.worldState.relationshipStates[DEF_ALLY.id].allianceCalls[0])
      .toMatchObject({ callId: held.metadata.allianceCall.callId, tick: 7, decision: 'joined' });
    expect(approved.autoApplied[0].metadata.coalitionEvidence
      .every((row) => row.tick === 7)).toBe(true);

    const deadCallState = {
      ...laterState,
      deployments: {},
    };
    const lapsed = applyWorldPulseProposal({
      campaign: {
        ...built.campaign,
        worldState: deadCallState,
        regionalGraph: queued.regionalGraph,
        wizardNews: queued.wizardNews,
      },
      saves: built.saves,
      proposalId: pending.id,
      now: NOW,
    });
    expect(lapsed.proposalDisposition).toBe('superseded');
    expect(lapsed.worldState.proposals.find((row) => row.id === pending.id))
      .toMatchObject({ status: 'superseded', supersessionReason: 'coalition_join_lapsed' });
    expect(lapsed.worldState.deployments?.ally).toBeUndefined();
    expect(lapsed.autoApplied).toEqual([]);
  });

  test('the root attacker can independently call an offensive ally into its own bilateral front', () => {
    const attackerAlly = { id: 'edge.attacker.spear', from: 'attacker', to: 'spear', relationshipType: 'allied' };
    const { war } = run({
      extraEdges: [attackerAlly],
      extraSaves: [save('spear', 'Spearford')],
    });
    expect(war.deployments.spear).toMatchObject({ targetId: 'defender', sinceTick: 5 });
    expect(war.deployments.spear.joinLedger?.[0]).toMatchObject({
      partyId: 'spear', callerId: 'attacker', enemyId: 'defender',
      originAttackerId: 'attacker', originSinceTick: 2,
      allianceRelationshipKey: attackerAlly.id,
      sourceCauseTypes: ['grievance'],
    });
    expect(war.graphChannels).toEqual(expect.arrayContaining([
      expect.objectContaining({ from: 'spear', to: 'defender', type: 'war_front' }),
    ]));
  });

  test('a same-tick conquest lapses the priced call instead of resurrecting the ended root war', () => {
    const built = fixture();
    const war = evaluateWarLayer({
      snapshot: built.snapshot,
      worldState: built.worldState,
      rng: LOW_ROLL,
      tick: 5,
      now: NOW,
      rules: LIT,
    });

    expect(war.resolvedDeployments).toEqual(expect.arrayContaining([
      expect.objectContaining({ attackerId: 'attacker', targetId: 'defender', outcome: 'conquest' }),
    ]));
    expect(war.deployments.attacker).toBeUndefined();
    expect(war.deployments.ally).toBeUndefined();
    expect(war.graphChannels.some((row) => row.from === 'ally' && row.to === 'attacker')).toBe(false);
    expect(war.outcomes.some((row) => row.metadata?.incidentType === 'coalition_joined'
      || row.metadata?.incidentType === 'coalition_refused')).toBe(false);
  });

  test('a same-tick infeasible withdrawal lapses the priced call instead of opening a replacement front', () => {
    const built = fixture();
    const saves = [
      save('attacker', 'Ironhold', { tier: 'village', population: 300 }),
      save('defender', 'Thornmere', { tier: 'city', population: 40000 }),
      save('ally', 'Brookhaven', { tier: 'town', population: 7000 }),
    ];
    const campaign = { ...built.campaign, settlementIds: saves.map((row) => row.id) };
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState: built.worldState });
    const war = evaluateWarLayer({
      snapshot,
      worldState: built.worldState,
      rng: HIGH_ROLL,
      tick: 5,
      now: NOW,
      rules: LIT,
    });

    expect(war.resolvedDeployments).toEqual(expect.arrayContaining([
      expect.objectContaining({ attackerId: 'attacker', targetId: 'defender', outcome: 'withdrawal' }),
    ]));
    expect(war.deployments.attacker).toBeUndefined();
    expect(war.deployments.ally).toBeUndefined();
    expect(war.outcomes.some((row) => row.metadata?.incidentType === 'coalition_joined'
      || row.metadata?.incidentType === 'coalition_refused')).toBe(false);
  });

  test('a vanished root target is pruned as a withdrawal and cannot leave a callable ghost', () => {
    const built = fixture();
    const settlements = built.snapshot.settlements.filter((row) => row.id !== 'defender');
    const snapshot = {
      ...built.snapshot,
      settlements,
      byId: new Map(settlements.map((row) => [String(row.id), row])),
    };
    const war = evaluateWarLayer({
      snapshot,
      worldState: built.worldState,
      rng: HIGH_ROLL,
      tick: 5,
      now: NOW,
      rules: LIT,
    });

    expect(war.resolvedDeployments).toEqual(expect.arrayContaining([
      expect.objectContaining({ attackerId: 'attacker', targetId: 'defender', outcome: 'withdrawal' }),
    ]));
    expect(war.deployments.attacker).toBeUndefined();
    expect(war.deployments.ally).toBeUndefined();
    expect(war.outcomes.some((row) => row.metadata?.incidentType === 'coalition_joined'
      || row.metadata?.incidentType === 'coalition_refused')).toBe(false);
  });

  test('a weak compact can be refused once through the relationship writer', () => {
    const { war, worldState } = run({ alliedState: { trust: 0, pactStrength: 0, dependency: 0 } });
    expect(war.deployments.ally).toBeUndefined();
    const refusal = war.outcomes.find((row) => row.candidateType === 'coalition_refused');
    expect(refusal).toBeTruthy();
    expect(refusal.applyMode).toBe('auto');
    expect(refusal.metadata.coalitionEvidence.map((row) => row.kind))
      .toEqual(['coalition_entry_priced', 'coalition_refused']);
    expect(JSON.stringify({ headline: refusal.headline, summary: refusal.summary, reasons: refusal.reasons }))
      .not.toMatch(/[0-9%×]/);

    const once = applyRelationshipPatch(worldState, refusal, NOW);
    expect(once.relationshipStates[DEF_ALLY.id].allianceCalls).toHaveLength(1);
    const twice = applyRelationshipPatch(once, refusal, NOW);
    expect(twice).toBe(once);
  });

  test('the caller\'s WR-2 character colours refusal cost without selecting or erasing the fact', () => {
    const rules = { ...LIT, dispositionChannelsEnabled: true };
    const alliedState = {
      trust: 0.6,
      resentment: 0.2,
      obligationFatigue: 0.1,
      pactStrength: 0,
      dependency: 0,
    };
    const refusalFrom = (war) => war.outcomes.find(
      (row) => row.candidateType === 'coalition_refused',
    );
    const hardReading = refusalFrom(run({
      rules,
      alliedState,
      dispositionStats: {
        defender: dispositionEntry({ martial: 1, diplomatic: 0, insular: 0 }),
      },
    }).war);
    const prudentReading = refusalFrom(run({
      rules,
      alliedState,
      dispositionStats: {
        defender: dispositionEntry({ martial: 0, diplomatic: 1, insular: 1 }),
      },
    }).war);

    expect(hardReading).toBeTruthy();
    expect(prudentReading).toBeTruthy();
    expect(hardReading.relationshipKey).toBe(prudentReading.relationshipKey);
    expect(hardReading.metadata.allianceCall.callId)
      .toBe(prudentReading.metadata.allianceCall.callId);
    expect(hardReading.relationshipPatch).toEqual({
      trust: 0.512,
      resentment: 0.332,
      obligationFatigue: 0.21,
    });
    expect(prudentReading.relationshipPatch).toEqual({
      trust: 0.528,
      resentment: 0.308,
      obligationFatigue: 0.19,
    });
    expect(hardReading.metadata.refusalCostBand).toBe('pressing');
    expect(prudentReading.metadata.refusalCostBand).toBe('quiet');
    expect(hardReading.reasons[1]).toContain('books and history');
    expect(prudentReading.reasons[1]).toContain('books and history');
    expect(hardReading.metadata.coalitionEvidence.find(
      (row) => row.kind === 'coalition_refused',
    )).toMatchObject({ costBand: 'pressing', counterpartId: 'defender' });
    expect(prudentReading.metadata.coalitionEvidence.find(
      (row) => row.kind === 'coalition_refused',
    )).toMatchObject({ costBand: 'quiet', counterpartId: 'defender' });

    // A persisted WR-2 shape cannot govern while its own flag is dark.  WR-6's
    // four exact flags still produce the same baseline refusal and ordinary cost.
    const wr2Dark = refusalFrom(run({
      rules: LIT,
      alliedState,
      dispositionStats: {
        defender: dispositionEntry({ martial: 1, diplomatic: 0, insular: 0 }),
      },
    }).war);
    expect(wr2Dark.relationshipPatch).toEqual({
      trust: 0.52,
      resentment: 0.32,
      obligationFatigue: 0.2,
    });
    expect(wr2Dark.metadata.refusalCostBand).toBe('present');
  });

  test('the caller\'s authored books still colour refusal under the exact four WR-6 flags', () => {
    const alliedState = {
      trust: 0.6,
      resentment: 0.2,
      obligationFatigue: 0.1,
      pactStrength: 0,
      dependency: 0,
    };
    const refusalFor = ({ personality, facets, learned }) => {
      const built = fixture({
        rules: LIT,
        alliedState,
        dispositionStats: { defender: learned },
      });
      const defender = built.saves.find((row) => row.id === 'defender');
      defender.settlement.npcs = [{
        id: 'ruler',
        name: 'The Thornmere Regent',
        importance: 'pillar',
        factionAffiliation: 'Thornmere Council',
        personality,
        facets,
      }];
      built.worldState.spatialLedgers.npcLadder = {
        defender: {
          factions: { 'seat-defender': { rungs: ['defender:ruler'] } },
          npcs: { 'defender:ruler': { stock: 7 } },
        },
      };
      const snapshot = buildWorldSnapshot({
        campaign: built.campaign,
        saves: built.saves,
        worldState: built.worldState,
      });
      return evaluateWarLayer({
        snapshot,
        worldState: built.worldState,
        rng: HIGH_ROLL,
        tick: 5,
        now: NOW,
        rules: LIT,
      }).outcomes.find((row) => row.candidateType === 'coalition_refused');
    };

    const hardLearned = dispositionEntry({ martial: 1, diplomatic: 0, insular: 0 });
    const prudentLearned = dispositionEntry({ martial: 0, diplomatic: 1, insular: 1 });
    const warmonger = {
      personality: { dominant: 'ruthless', flaw: 'vengeful', modifier: 'proud' },
      facets: { alignment: 'chaotic_evil', goal: 'punish_rivals' },
    };
    const peacemaker = {
      personality: { dominant: 'merciful', flaw: 'patient', modifier: 'diplomatic' },
      facets: { alignment: 'lawful_good', goal: 'survive_crisis' },
    };
    const hard = refusalFor({ ...warmonger, learned: hardLearned });
    const hardWithOppositeDormantHistory = refusalFor({ ...warmonger, learned: prudentLearned });
    const prudent = refusalFor({ ...peacemaker, learned: hardLearned });

    expect(hard).toBeTruthy();
    expect(prudent).toBeTruthy();
    expect(hard.metadata.refusalCostBand).toBe('pressing');
    expect(prudent.metadata.refusalCostBand).toBe('quiet');
    expect(hard.relationshipPatch).not.toEqual(prudent.relationshipPatch);
    expect(hard.reasons[1]).toContain("court's own books make");
    expect(prudent.reasons[1]).toContain("court's own books leave");
    expect(hard.reasons[1]).not.toContain('history');
    expect(prudent.reasons[1]).not.toContain('history');
    // WR-2 history is persisted in both fixtures but its flag is absent. Only
    // the already-authored WR-5 books may colour this exact-four-flag read.
    expect(hardWithOppositeDormantHistory.relationshipPatch).toEqual(hard.relationshipPatch);
    expect(hardWithOppositeDormantHistory.metadata.refusalCostBand)
      .toBe(hard.metadata.refusalCostBand);
  });
});

describe('WR-6 persistence and lifecycle', () => {
  test('allianceCalls normalize deterministically, prove the root episode, and cap to the newest rows', () => {
    const rows = Array.from({ length: 30 }, (_, since) => ({
      callId: coalitionCallIdFor({ callerId: 'caller', partyId: 'party', enemyId: 'enemy', callerDeploymentSinceTick: since }),
      partyId: 'party', callerId: 'caller', enemyId: 'enemy', relationshipKey: 'edge.caller.party',
      tick: since + 10, callerDeploymentSinceTick: since, originAttackerId: since % 2 ? 'enemy' : 'caller',
      originSinceTick: since, decision: since % 2 ? 'refused' : 'joined', cause: 'alliance_obligation',
    }));
    const duplicateLater = { ...rows[10], tick: 99, decision: rows[10].decision === 'joined' ? 'refused' : 'joined' };
    const normalized = normalizeAllianceCalls([
      ...rows.slice().reverse(),
      duplicateLater,
      { ...rows[0], callId: 'forged' },
    ]);
    expect(normalized).toHaveLength(24);
    expect(normalized.map((row) => row.callerDeploymentSinceTick))
      .toEqual(Array.from({ length: 24 }, (_, index) => index + 6));
    expect(normalized.find((row) => row.callId === rows[10].callId)?.tick).toBe(rows[10].tick);
  });

  test('a well-shaped call archived on the wrong relationship cannot decide or mutate the intended edge', () => {
    const callId = coalitionCallIdFor({
      callerId: 'defender', partyId: 'ally', enemyId: 'attacker', callerDeploymentSinceTick: 2,
    });
    const wrongEdgeRow = {
      callId,
      partyId: 'ally',
      callerId: 'defender',
      enemyId: 'attacker',
      relationshipKey: 'edge.wrong',
      tick: 5,
      callerDeploymentSinceTick: 2,
      originAttackerId: 'attacker',
      originSinceTick: 2,
      decision: 'refused',
      cause: 'alliance_obligation',
    };
    const imported = ensureWorldState({
      relationshipStates: {
        [DEF_ALLY.id]: { relationshipType: 'allied', allianceCalls: [wrongEdgeRow] },
      },
    }, { id: 'campaign' });
    expect(imported.relationshipStates[DEF_ALLY.id].allianceCalls).toHaveLength(1);
    expect(allianceCallWasDecided(
      imported.relationshipStates[DEF_ALLY.id], callId, DEF_ALLY.id,
    )).toBe(false);

    const original = fixture().worldState;
    const attempted = applyRelationshipPatch(original, {
      id: 'outcome.wrong-edge-call',
      relationshipKey: DEF_ALLY.id,
      relationshipPatch: { trust: 0 },
      metadata: { incidentType: 'coalition_refused', allianceCall: wrongEdgeRow },
    }, NOW);
    expect(attempted).toBe(original);
  });

  test('the correct edge can replace a conflicting wrong-edge import and then retries exactly once', () => {
    const callId = coalitionCallIdFor({
      callerId: 'defender', partyId: 'ally', enemyId: 'attacker', callerDeploymentSinceTick: 2,
    });
    const baseRow = {
      callId,
      partyId: 'ally',
      callerId: 'defender',
      enemyId: 'attacker',
      tick: 5,
      callerDeploymentSinceTick: 2,
      originAttackerId: 'attacker',
      originSinceTick: 2,
      decision: 'refused',
      cause: 'alliance_obligation',
    };
    const imported = {
      ...fixture().worldState,
      relationshipStates: {
        [DEF_ALLY.id]: {
          relationshipType: 'allied',
          trust: 0.8,
          allianceCalls: [{ ...baseRow, relationshipKey: 'edge.wrong' }],
        },
      },
    };
    const outcome = {
      id: 'outcome.correct-edge-call',
      relationshipKey: DEF_ALLY.id,
      relationshipPatch: { trust: 0.5 },
      metadata: {
        incidentType: 'coalition_refused',
        allianceCall: { ...baseRow, relationshipKey: DEF_ALLY.id },
      },
    };

    const once = applyRelationshipPatch(imported, outcome, NOW);
    expect(once).not.toBe(imported);
    expect(once.relationshipStates[DEF_ALLY.id].trust).toBe(0.5);
    expect(once.relationshipStates[DEF_ALLY.id].allianceCalls).toEqual([
      expect.objectContaining({ callId, relationshipKey: DEF_ALLY.id }),
    ]);
    expect(allianceCallWasDecided(
      once.relationshipStates[DEF_ALLY.id], callId, DEF_ALLY.id,
    )).toBe(true);
    expect(applyRelationshipPatch(once, outcome, NOW)).toBe(once);
  });

  test('joinLedger accepts exactly one self-consistent closed anchor and drops forged/multiple rows', () => {
    const callId = coalitionCallIdFor({ callerId: 'defender', partyId: 'ally', enemyId: 'attacker', callerDeploymentSinceTick: 2 });
    const anchor = {
      callId, partyId: 'ally', callerId: 'defender', enemyId: 'attacker', joinedTick: 5,
      callerDeploymentSinceTick: 2, originAttackerId: 'attacker', originSinceTick: 2,
      allianceRelationshipKey: DEF_ALLY.id, sourceCauseTypes: ['grievance'], cause: 'alliance_obligation',
    };
    expect(normalizeJoinAnchor(anchor, 'ally', 'attacker', 5)).toEqual(anchor);
    expect(normalizeJoinAnchor({ ...anchor, callId: 'forged' }, 'ally', 'attacker')).toBeNull();
    expect(normalizeJoinAnchor({ ...anchor, joinedTick: 1 }, 'ally', 'attacker')).toBeNull();
    expect(normalizeJoinAnchor(anchor, 'ally', 'attacker', 4)).toBeNull();
    expect(joinAnchorOf({ targetId: 'attacker', sinceTick: 4, joinLedger: [anchor] }, 'ally')).toBeNull();

    const out = ensureWorldState({
      deployments: {
        ally: { targetId: 'attacker', sinceTick: 5, joinLedger: [anchor] },
        forged: { targetId: 'attacker', sinceTick: 5, joinLedger: [{ ...anchor, partyId: 'forged' }] },
        many: { targetId: 'attacker', sinceTick: 5, joinLedger: [anchor, anchor] },
        mismatched: { targetId: 'attacker', sinceTick: 4, joinLedger: [{
          ...anchor,
          partyId: 'mismatched',
          callId: coalitionCallIdFor({
            callerId: 'defender', partyId: 'mismatched', enemyId: 'attacker', callerDeploymentSinceTick: 2,
          }),
        }] },
      },
    }, { id: 'campaign' });
    expect(out.deployments.ally.joinLedger).toEqual([anchor]);
    expect(out.deployments.forged.joinLedger).toBeUndefined();
    expect(out.deployments.many.joinLedger).toBeUndefined();
    expect(out.deployments.mismatched.joinLedger).toBeUndefined();
  });

  test('the borrowed cause dies on alliance/root-episode change while the deployment remains for temperament to decide', () => {
    const { war, snapshot } = run();
    const joined = war.deployments.ally;
    const joinedWorld = { ...snapshot.worldState, simulationRules: { ...LIT }, deployments: war.deployments };
    expect(allianceObligationReason(joinedWorld, snapshot, 'ally', 'attacker').score).toBe(1);

    const brokenSnapshot = {
      ...snapshot,
      worldState: {
        ...snapshot.worldState,
        relationshipStates: {
          ...snapshot.worldState.relationshipStates,
          [DEF_ALLY.id]: { relationshipType: 'hostile' },
        },
      },
    };
    const brokenWorld = { ...joinedWorld, relationshipStates: brokenSnapshot.worldState.relationshipStates };
    expect(allianceObligationReason(brokenWorld, brokenSnapshot, 'ally', 'attacker').score).toBe(0);
    expect(obligationDischargedReason(brokenWorld, brokenSnapshot, 'ally', 'attacker').score).toBe(0);
    expect(brokenWorld.deployments.ally).toBe(joined);
    expect(obligationDischargedReason({
      ...brokenWorld,
      simulationRules: { ...LIT, coalitionLedgerEnabled: false },
    }, brokenSnapshot, 'ally', 'attacker').score).toBe(0);

    const replacedWorld = {
      ...joinedWorld,
      deployments: {
        ...joinedWorld.deployments,
        attacker: { ...joinedWorld.deployments.attacker, sinceTick: 3 },
      },
    };
    expect(allianceObligationReason(replacedWorld, snapshot, 'ally', 'attacker').score).toBe(0);
    expect(obligationDischargedReason(replacedWorld, snapshot, 'ally', 'attacker').score).toBe(1);
  });

  test('a joined deployment with no enemy relationship edge folds and emits its discharged mirror once', () => {
    const { war, snapshot } = run();
    const worldState = {
      ...snapshot.worldState,
      simulationRules: { ...LIT },
      deployments: {
        ...war.deployments,
        attacker: { ...war.deployments.attacker, sinceTick: 3 },
      },
    };
    const currentSnapshot = { ...snapshot, worldState };
    expect(snapshot.regionalGraph.edges.some((edge) => (
      (edge.from === 'ally' && edge.to === 'attacker')
      || (edge.from === 'attacker' && edge.to === 'ally')
    ))).toBe(false);

    const advanced = advancePeaceReasons({
      snapshot: currentSnapshot,
      worldState,
      graph: snapshot.regionalGraph,
      tick: 6,
    });
    expect(peaceReasonsFor(advanced.worldState, 'ally', 'attacker')
      ?.reasons?.obligation_discharged?.score).toBeGreaterThan(0);
    expect(advanced.worldState.relationshipStates).not.toHaveProperty('edge.ally.attacker');
    expect(advanced.coalitionEvidence).toEqual([
      expect.objectContaining({
        kind: 'mirror_obligation_discharged',
        tick: 6,
        settlementId: 'ally',
        counterpartId: 'defender',
        thirdPartyId: 'attacker',
        relationshipKey: DEF_ALLY.id,
      }),
    ]);

    const replay = advancePeaceReasons({
      snapshot: { ...currentSnapshot, worldState: advanced.worldState },
      worldState: advanced.worldState,
      graph: snapshot.regionalGraph,
      tick: 7,
    });
    expect(replay.coalitionEvidence).toEqual([]);

    const brokenWorld = {
      ...worldState,
      relationshipStates: {
        ...worldState.relationshipStates,
        [DEF_ALLY.id]: { relationshipType: 'hostile' },
      },
    };
    const broken = advancePeaceReasons({
      snapshot: { ...currentSnapshot, worldState: brokenWorld },
      worldState: brokenWorld,
      graph: snapshot.regionalGraph,
      tick: 6,
    });
    expect(broken.coalitionEvidence).toEqual([]);
    expect(peaceReasonsFor(broken.worldState, 'ally', 'attacker')
      ?.reasons?.obligation_discharged).toBeUndefined();
  });

  test('termination overrides a stale alliance cause on same-tick root replacement or compact rupture', () => {
    const { war, snapshot } = run();
    const staleAllianceReason = {
      type: 'alliance_obligation',
      score: 1,
      sinceTick: 5,
      tick: 5,
      receipt: 'The prior fold still names the compact.',
    };
    const joinedWorld = {
      ...snapshot.worldState,
      simulationRules: { ...LIT },
      deployments: war.deployments,
      spatialLedgers: {
        ...snapshot.worldState.spatialLedgers,
        warReasons: {
          ...snapshot.worldState.spatialLedgers.warReasons,
          'ally>attacker': {
            reasons: { alliance_obligation: staleAllianceReason },
            updatedTick: 5,
          },
        },
      },
    };
    expect(war.deployments.ally.casusReasons).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'alliance_obligation' }),
    ]));

    const replacedWorld = {
      ...joinedWorld,
      deployments: {
        ...joinedWorld.deployments,
        attacker: { ...joinedWorld.deployments.attacker, sinceTick: 3 },
      },
    };
    const replaced = readWarTerminations({
      worldState: replacedWorld,
      snapshot: { ...snapshot, worldState: replacedWorld },
      tick: 6,
    });
    expect(replaced.byAttacker.get('ally')?.dissolvedCauseTypes)
      .toContain('alliance_obligation');

    const brokenWorld = {
      ...joinedWorld,
      relationshipStates: {
        ...joinedWorld.relationshipStates,
        [DEF_ALLY.id]: { relationshipType: 'hostile' },
      },
    };
    const broken = readWarTerminations({
      worldState: brokenWorld,
      snapshot: { ...snapshot, worldState: brokenWorld },
      tick: 6,
    });
    expect(broken.byAttacker.get('ally')?.dissolvedCauseTypes)
      .toContain('alliance_obligation');
  });
});

describe('WR-6 removes free peer force only while lit', () => {
  test('allied relief/levies disappear, while hierarchical vassal support remains', () => {
    const vassal = { id: 'edge.defender.vassal', from: 'defender', to: 'vassal', relationshipType: 'vassal' };
    const { snapshot } = fixture({
      extraEdges: [vassal],
      extraSaves: [save('vassal', 'Lowfield')],
    });
    snapshot.worldState.relationshipStates[vassal.id] = { relationshipType: 'vassal' };
    const capacityFor = () => ({ homeDefense: 10 });
    expect(computeAllyRelief(snapshot, 'defender', capacityFor, new Set(), false)).toBe(8);
    expect(computeAllyRelief(snapshot, 'defender', capacityFor, new Set(), true)).toBe(4);
    expect(computeLevySources(snapshot, 'defender', new Set(), false)).toEqual(['ally', 'vassal']);
    expect(computeLevySources(snapshot, 'defender', new Set(), true)).toEqual(['vassal']);
  });
});
