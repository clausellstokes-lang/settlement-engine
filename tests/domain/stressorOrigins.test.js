/**
 * tests/domain/stressorOrigins.test.js — Phase 4 pins: context-conditioned
 * spawn variants, echoes (recent memory), and the war/relationship handshake.
 *
 * Pins:
 *   • betrayal born while hostile -> foreign_sponsored with the sponsor id;
 *     while at peace with a FRESH hostile->cold_war memory -> abandoned_agent;
 *     with no context at all -> internal_conspiracy.
 *   • siege attacker identity is nullable: stamped only for live hostile
 *     neighbors, otherwise null until the DM names the warband.
 *   • resolution leaves an echo (status residual) that decays by half-life,
 *     participates in re-ignition (warm echo -> hotter rebirth), never blocks
 *     rebirth, and graduates out below the floor.
 *   • hostile->cold_war truce winds down the stressors that hostility
 *     sponsored (severity collapse below the structural gate).
 *   • a betrayal birth seeds exactly one corrupted traitor NPC, gated on a
 *     corruptible flaw, with corruptTies.foreignPatron set per variant.
 */

import { describe, expect, test } from 'vitest';
import {
  interpretStressorOrigin,
  windDownSponsoredStressors,
  recordWarResolutionIncidents,
} from '../../src/domain/worldPulse/stressorDynamics.js';
import {
  ageRoamingStressors,
  evaluateStressorRules,
  resolveStressorById,
  setStressorAttacker,
} from '../../src/domain/worldPulse/stressors.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';

const NOW = '2026-01-01T00:00:00.000Z';

function snapshotWith({ edges = [], relationshipStates = {}, stressors = [], byId = new Map() } = {}) {
  return {
    byId,
    regionalGraph: { edges, channels: [] },
    worldState: { relationshipStates, stressors, tick: 10 },
    settlements: [],
  };
}

describe('interpretStressorOrigin()', () => {
  test('betrayal + live hostile neighbor -> foreign_sponsored', () => {
    const snapshot = snapshotWith({
      edges: [{ id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'hostile' }],
    });
    const ctx = interpretStressorOrigin('betrayal', 'a', snapshot, 10);
    expect(ctx.variant).toBe('foreign_sponsored');
    expect(ctx.sponsorSettlementId).toBe('b');
  });

  test('betrayal + fizzled hostility in recent memory -> abandoned_agent', () => {
    const snapshot = snapshotWith({
      edges: [{ id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'cold_war' }],
      relationshipStates: {
        'rel.b.a': {
          history: [{ tick: 7, type: 'label_proposal_applied', fromType: 'hostile', toType: 'cold_war' }],
        },
      },
    });
    const ctx = interpretStressorOrigin('betrayal', 'a', snapshot, 10);
    // cold_war is still hostile-ish -> foreign_sponsored ranks first; drop the
    // live edge to neutral to isolate the memory path.
    expect(ctx.variant).toBe('foreign_sponsored');

    const peaceful = snapshotWith({
      edges: [{ id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'neutral' }],
      relationshipStates: {
        'rel.b.a': {
          history: [{ tick: 7, type: 'label_proposal_applied', fromType: 'hostile', toType: 'cold_war' }],
        },
      },
    });
    const memoryCtx = interpretStressorOrigin('betrayal', 'a', peaceful, 10);
    expect(memoryCtx.variant).toBe('abandoned_agent');
    expect(memoryCtx.formerSponsorSettlementId).toBe('b');
  });

  test('betrayal with no hostile context -> internal_conspiracy', () => {
    const ctx = interpretStressorOrigin('betrayal', 'a', snapshotWith({}), 10);
    expect(ctx.variant).toBe('internal_conspiracy');
    expect(ctx.sponsorSettlementId).toBeNull();
  });

  test('memory older than the lookback no longer reads as abandoned_agent', () => {
    const stale = snapshotWith({
      edges: [{ id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'neutral' }],
      relationshipStates: {
        'rel.b.a': {
          history: [{ tick: 10 - 20, type: 'label_proposal_applied', fromType: 'hostile', toType: 'neutral' }],
        },
      },
    });
    expect(interpretStressorOrigin('betrayal', 'a', stale, 10).variant).toBe('internal_conspiracy');
  });

  test('siege attacker: stamped for a live hostile neighbor, NULL otherwise (DM names the warband)', () => {
    const hostile = snapshotWith({
      edges: [{ id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'hostile' }],
    });
    expect(interpretStressorOrigin('siege', 'a', hostile, 10).attackerSettlementId).toBe('b');
    const lonely = interpretStressorOrigin('siege', 'a', snapshotWith({}), 10);
    expect(lonely.variant).toBe('unattributed');
    expect(lonely.attackerSettlementId).toBeNull();
    expect(lonely.attackerLabel).toBeNull();
  });

  test('setStressorAttacker lets the DM name a non-settlement force', () => {
    const { stressors, changed } = setStressorAttacker(
      [{ id: 'world_stressor.siege.a', type: 'siege', severity: 0.8, affectedSettlementIds: ['a'] }],
      'world_stressor.siege.a',
      { attackerLabel: 'The Red Fang goblin warband' },
      { now: NOW },
    );
    expect(changed.originContext.attackerLabel).toBe('The Red Fang goblin warband');
    expect(changed.originContext.attackerSettlementId).toBeNull();
    expect(stressors[0].originContext.attackerLabel).toBe('The Red Fang goblin warband');
  });
});

describe('echoes: resolution leaves recent memory', () => {
  const EMPTY_SNAPSHOT = { byId: new Map() };

  test('an organically resolved stressor becomes a residual echo', () => {
    const result = ageRoamingStressors(
      [{ id: 'world_stressor.market_shock.a', type: 'market_shock', severity: 0.5, age: 3, affectedSettlementIds: ['a'] }],
      EMPTY_SNAPSHOT, { random: () => 0 }, { tick: 4, now: NOW },
    );
    expect(result.resolved).toHaveLength(1);
    const echo = result.stressors.find(s => s.status === 'residual');
    expect(echo).toBeTruthy();
    expect(echo.lifecycleStage).toBe('residual');
    expect(echo.memoryStrength).toBeGreaterThan(0);
  });

  test('echoes decay by half-life and graduate below the floor', () => {
    let stressors = [{
      id: 'world_stressor.betrayal.a', type: 'betrayal', status: 'residual',
      lifecycleStage: 'residual', severity: 0.1, age: 2,
      memoryStrength: 0.5, affectedSettlementIds: ['a'],
    }];
    let graduatedAt = null;
    for (let tick = 1; tick <= 30; tick++) {
      const result = ageRoamingStressors(stressors, EMPTY_SNAPSHOT, { random: () => 0.99 }, { tick, now: NOW });
      if (result.graduated.length) { graduatedAt = tick; break; }
      const echo = result.stressors.find(s => s.status === 'residual');
      expect(echo.memoryStrength).toBeLessThan(0.5);
      stressors = result.stressors;
    }
    // 0.5 -> <0.1 at a 6-tick half-life is ~14 ticks.
    expect(graduatedAt).toBeGreaterThan(10);
    expect(graduatedAt).toBeLessThan(20);
  });

  test('party resolution also leaves an echo', () => {
    const { stressors, resolved } = resolveStressorById(
      [{ id: 'world_stressor.siege.a', type: 'siege', severity: 0.7, age: 4, affectedSettlementIds: ['a'] }],
      'world_stressor.siege.a',
      { tick: 5, now: NOW, reason: 'The party broke the siege' },
    );
    expect(resolved).toHaveLength(1);
    const echo = stressors.find(s => s.status === 'residual');
    expect(echo).toBeTruthy();
    expect(echo.memoryStrength).toBeGreaterThanOrEqual(0.35);
  });

  test('party-resolving an ECHO dismisses the memory — no echo-of-an-echo, no residuals', () => {
    const { stressors, resolved, residualOutcomes } = resolveStressorById(
      [{
        id: 'world_stressor.siege.a', type: 'siege', status: 'residual',
        lifecycleStage: 'residual', severity: 0.7, memoryStrength: 0.4,
        age: 6, affectedSettlementIds: ['a'],
      }],
      'world_stressor.siege.a',
      { tick: 9, now: NOW, reason: 'The DM dismissed the memory' },
    );
    expect(resolved).toHaveLength(1);
    expect(resolved[0].status).toBe('dormant');
    expect(stressors).toHaveLength(0);
    expect(residualOutcomes).toHaveLength(0);
  });

  test('echoes do not generate refugee flows (a broken siege displaces no one)', async () => {
    const { deriveFlowCandidates } = await import('../../src/domain/worldPulse/flows.js');
    const graph = {
      edges: [],
      channels: [{ id: 'ch1', type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' }],
    };
    const byId = new Map([
      ['a', { id: 'a', name: 'Ashford', settlement: { population: 2000 } }],
      ['b', { id: 'b', name: 'Briar', settlement: { population: 1000 } }],
    ]);
    const stressorBase = {
      id: 'world_stressor.siege.a', type: 'siege', severity: 0.8,
      affectedSettlementIds: ['a'],
    };
    const snapshotFor = stressor => ({
      regionalGraph: graph, byId, settlements: [], worldState: { stressors: [stressor] },
    });
    const live = deriveFlowCandidates(snapshotFor({ ...stressorBase, lifecycleStage: 'active' }), { tick: 3 });
    expect(live.some(c => c.candidateType === 'flow_migration')).toBe(true);
    const echoed = deriveFlowCandidates(
      snapshotFor({ ...stressorBase, status: 'residual', lifecycleStage: 'residual', memoryStrength: 0.5 }),
      { tick: 3 },
    );
    expect(echoed.some(c => c.candidateType === 'flow_migration')).toBe(false);
  });

  test('a warm echo does not block rebirth and re-ignites hotter', () => {
    const echo = {
      id: 'world_stressor.famine.a', type: 'famine', status: 'residual',
      lifecycleStage: 'residual', severity: 0.1, age: 3,
      memoryStrength: 0.6, affectedSettlementIds: ['a'], originSettlementId: 'a',
    };
    const snapshot = snapshotWith({ stressors: [echo] });
    const pressure = {
      kind: 'food', score: 0.7, settlementId: 'a', settlementName: 'Ashford',
      label: 'Food pressure', reasons: [],
    };
    const candidates = evaluateStressorRules(snapshot, { get: () => null }, { tick: 11, pressures: [pressure] });
    const birth = candidates.find(c => c.candidateType === 'stressor_birth_famine');
    expect(birth).toBeTruthy();
    expect(birth.severity).toBeGreaterThan(0.7); // pressure + echo warmth
    expect(birth.stressor.id).toBe(echo.id);     // same stable id: rebirth overwrites the echo
  });
});

describe('war/relationship handshake', () => {
  const sponsoredSiege = {
    id: 'world_stressor.siege.a', type: 'siege', severity: 0.8, age: 2,
    durationPolicy: 'structural', originSettlementId: 'a',
    affectedSettlementIds: ['a'],
    originContext: { variant: 'declared_war', attackerSettlementId: 'b', sponsorSettlementId: 'b' },
  };

  test('hostile -> cold_war truce collapses the sponsored siege', () => {
    const worldState = { stressors: [sponsoredSiege] };
    const edge = { id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'hostile' };
    const { worldState: next, woundDown } = windDownSponsoredStressors(worldState, edge, { tick: 12, now: NOW, toType: 'cold_war' });
    expect(woundDown).toHaveLength(1);
    const siege = next.stressors[0];
    // Must land BELOW the structural resolution gate (0.25) so the next
    // aging tick can actually end the war.
    expect(siege.severity).toBeLessThan(0.25);
    expect(siege.severity).toBeCloseTo(0.2, 5);
    expect(siege.originContext.windDown.toType).toBe('cold_war');
  });

  test('an unrelated stressor is untouched by the truce', () => {
    const unrelated = { ...sponsoredSiege, id: 'world_stressor.siege.c', originSettlementId: 'c', affectedSettlementIds: ['c'], originContext: { variant: 'unattributed', attackerSettlementId: null, sponsorSettlementId: null } };
    const edge = { id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'hostile' };
    const { woundDown } = windDownSponsoredStressors({ stressors: [unrelated] }, edge, { tick: 12, now: NOW, toType: 'cold_war' });
    expect(woundDown).toHaveLength(0);
  });

  test('a sponsored stressor resolving writes an incident onto the edge', () => {
    const worldState = {
      relationshipStates: { 'rel.b.a': { recentIncidents: [] } },
    };
    const graph = { edges: [{ id: 'rel.b.a', from: 'b', to: 'a', relationshipType: 'hostile' }] };
    const next = recordWarResolutionIncidents(worldState, graph, [
      { ...sponsoredSiege, status: 'resolved', peakSeverity: 0.9 },
    ], 14);
    const incidents = next.relationshipStates['rel.b.a'].recentIncidents;
    expect(incidents).toHaveLength(1);
    expect(incidents[0].type).toBe('stressor_resolved:siege');
    expect(incidents[0].tick).toBe(14);
  });
});

describe('betrayal births seed the traitor', () => {
  function applyBetrayalBirth({ npcs, originContext }) {
    const settlement = { name: 'Ashford', npcs, institutions: [], activeConditions: [] };
    const settlementMap = new Map([['a', { saveId: 'a', save: { name: 'Ashford' }, settlement }]]);
    const outcome = {
      id: 'o1', type: 'stressor', candidateType: 'stressor_birth_betrayal', applyMode: 'auto',
      targetSaveId: 'a', severity: 0.7,
      stressor: {
        id: 'world_stressor.betrayal.a', type: 'betrayal', severity: 0.7,
        affectedSettlementIds: ['a'], originContext,
      },
    };
    return applyWorldPulseOutcomes({
      snapshot: { regionalGraph: { edges: [], channels: [] }, settlements: [{ id: 'a', settlement }], campaign: {} },
      worldState: { stressors: [], npcStates: {}, proposals: [] },
      regionalGraph: { edges: [], channels: [] },
      settlementMap,
      outcomes: [outcome],
      tick: 10,
      now: NOW,
      advanceNewsTick: false,
      advanceRegionalImpacts: false,
    });
  }

  test('foreign_sponsored: most notable corruptible NPC turns, patron recorded', () => {
    const result = applyBetrayalBirth({
      npcs: [
        { name: 'Aldous', importance: 'notable', flaw: 'greedy' },
        { name: 'Berthe', importance: 'pillar', flaw: 'ambitious' },
        { name: 'Cedric', importance: 'pillar', flaw: 'kindly' }, // not corruptible
      ],
      originContext: { variant: 'foreign_sponsored', sponsorSettlementId: 'b' },
    });
    const npcs = result.settlementUpdates[0].settlement.npcs;
    const traitors = npcs.filter(n => n.corrupt === true);
    expect(traitors).toHaveLength(1);
    expect(traitors[0].name).toBe('Berthe'); // pillar outranks notable
    expect(traitors[0].corruptionVector).toBe('forbidden_patron');
    expect(traitors[0].corruptTies.foreignPatron).toBe('b');
    expect(traitors[0].corruptTies.conspiracy).toBe('foreign_sponsored');
  });

  test('internal_conspiracy: vector follows the flaw, no foreign patron', () => {
    const result = applyBetrayalBirth({
      npcs: [{ name: 'Aldous', importance: 'notable', flaw: 'greedy' }],
      originContext: { variant: 'internal_conspiracy', sponsorSettlementId: null },
    });
    const traitor = result.settlementUpdates[0].settlement.npcs.find(n => n.corrupt);
    expect(traitor.corruptionVector).toBe('greed');
    expect(traitor.corruptTies.foreignPatron).toBeNull();
  });

  test('no corruptible flaw anywhere -> no traitor (dependent on existing factors)', () => {
    const result = applyBetrayalBirth({
      npcs: [{ name: 'Cedric', importance: 'pillar', flaw: 'kindly' }],
      originContext: { variant: 'internal_conspiracy' },
    });
    expect(result.settlementUpdates[0].settlement.npcs.some(n => n.corrupt)).toBe(false);
  });
});
