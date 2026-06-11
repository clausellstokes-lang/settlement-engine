import { describe, expect, test } from 'vitest';

import { deriveFlowCandidates } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

describe('inter-settlement flows', () => {
  test('a severe displacement stressor sends refugees down a confirmed channel', () => {
    const snapshot = {
      worldState: { tick: 5, stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.8, affectedSettlementIds: ['a'] }] },
      regionalGraph: ensureRegionalGraph({ channels: [{ type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' }] }),
      byId: new Map([
        ['a', { id: 'a', name: 'Ashford', settlement: { population: 2000 }, activeConditions: [] }],
        ['b', { id: 'b', name: 'Briar', settlement: { population: 1500 }, activeConditions: [] }],
      ]),
      settlements: [
        { id: 'a', name: 'Ashford', activeConditions: [], causal: { scores: {} } },
        { id: 'b', name: 'Briar', activeConditions: [], causal: { scores: {} } },
      ],
    };
    const flows = deriveFlowCandidates(snapshot, { tick: 5 });
    const mig = flows.find(f => f.candidateType === 'flow_migration');
    expect(mig).toBeTruthy();
    expect(mig.targetSaveId).toBe('b');
    expect(mig.condition.archetype).toBe('regional_migration_pressure');
    expect(mig.metadata.populationDelta).toBeGreaterThan(0);
    expect(mig.metadata.from).toBe('a');
  });

  test('a trade-dependency supplier in crisis transmits import shortage', () => {
    const snapshot = {
      worldState: { tick: 5, stressors: [] },
      regionalGraph: ensureRegionalGraph({ channels: [{ type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed', strength: 0.7 }] }),
      byId: new Map([['a', { id: 'a', name: 'Ashford' }], ['b', { id: 'b', name: 'Briar' }]]),
      settlements: [
        { id: 'a', name: 'Ashford', activeConditions: [{ archetype: 'trade_route_cut', severity: 0.6 }], causal: { scores: { trade_connectivity: 30 } } },
        { id: 'b', name: 'Briar', activeConditions: [], causal: { scores: {} } },
      ],
    };
    const flows = deriveFlowCandidates(snapshot, { tick: 5 });
    const trade = flows.find(f => f.candidateType === 'flow_trade_scarcity');
    expect(trade).toBeTruthy();
    expect(trade.targetSaveId).toBe('b');
    expect(trade.condition.archetype).toBe('regional_import_shortage');
  });

  // H8 follow-through (R3): migration reads each source's EFFECTIVE severity
  // (severityBySettlement) — a spread target displaces fewer refugees than
  // the origin, and one attenuated below the displacement band displaces none.
  test('a spread-target source displaces fewer refugees than the origin', () => {
    const spreadSnapshot = (spreadEntry) => ({
      worldState: {
        tick: 5,
        stressors: [{
          id: 'world_stressor.famine.a',
          type: 'famine',
          severity: 0.9,
          affectedSettlementIds: ['a', 's'],
          severityBySettlement: { s: spreadEntry },
        }],
      },
      regionalGraph: ensureRegionalGraph({ channels: [
        { type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'migration_pressure', from: 's', to: 'b', status: 'confirmed' },
      ] }),
      byId: new Map([
        ['a', { id: 'a', name: 'Ashford', settlement: { population: 2000 }, activeConditions: [] }],
        ['s', { id: 's', name: 'Spreadton', settlement: { population: 2000 }, activeConditions: [] }],
        ['b', { id: 'b', name: 'Briar', settlement: { population: 1500 }, activeConditions: [] }],
      ]),
      settlements: [
        { id: 'a', name: 'Ashford', activeConditions: [], causal: { scores: {} } },
        { id: 's', name: 'Spreadton', activeConditions: [], causal: { scores: {} } },
        { id: 'b', name: 'Briar', activeConditions: [], causal: { scores: {} } },
      ],
    });

    // Spread target experiences 0.65 against the origin's 0.9 — same
    // population, fewer refugees, lower condition severity.
    const flows = deriveFlowCandidates(spreadSnapshot(0.65), { tick: 5 });
    const fromOrigin = flows.find(f => f.candidateType === 'flow_migration' && f.metadata.from === 'a');
    const fromSpread = flows.find(f => f.candidateType === 'flow_migration' && f.metadata.from === 's');
    expect(fromOrigin).toBeTruthy();
    expect(fromSpread).toBeTruthy();
    expect(fromSpread.metadata.populationDelta).toBeLessThan(fromOrigin.metadata.populationDelta);
    expect(fromSpread.severity).toBeLessThan(fromOrigin.severity);

    // Attenuated below the 0.6 displacement band: the spread target
    // displaces nobody while the origin still does.
    const below = deriveFlowCandidates(spreadSnapshot(0.45), { tick: 5 })
      .filter(f => f.candidateType === 'flow_migration');
    expect(below.some(f => f.metadata.from === 'a')).toBe(true);
    expect(below.some(f => f.metadata.from === 's')).toBe(false);
  });

  test('no flows without confirmed channels', () => {
    const snapshot = {
      worldState: { tick: 5, stressors: [{ id: 's', type: 'famine', severity: 0.8, affectedSettlementIds: ['a'] }] },
      regionalGraph: ensureRegionalGraph({}),
      byId: new Map(),
      settlements: [],
    };
    expect(deriveFlowCandidates(snapshot, { tick: 5 })).toEqual([]);
  });

  // R4 pin: the proposal gate is REAL — reachable by the formulas and wired to
  // simulationRules.majorChangesRequireProposal (the old severity>=0.72 gate
  // was unreachable: migration severity caps at 0.6, trade at 0.7).
  describe('flow proposal gate (majorChangesRequireProposal)', () => {
    const migrationSnapshot = (severity) => ({
      worldState: { tick: 5, stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity, affectedSettlementIds: ['a'] }] },
      regionalGraph: ensureRegionalGraph({ channels: [{ type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' }] }),
      byId: new Map([
        ['a', { id: 'a', name: 'Ashford', settlement: { population: 2000 }, activeConditions: [] }],
        ['b', { id: 'b', name: 'Briar', settlement: { population: 1500 }, activeConditions: [] }],
      ]),
      settlements: [
        { id: 'a', name: 'Ashford', activeConditions: [], causal: { scores: {} } },
        { id: 'b', name: 'Briar', activeConditions: [], causal: { scores: {} } },
      ],
    });

    test('a large refugee transfer (>=8% of source population) routes to proposal when the rule is on', () => {
      // severity 0.9 -> fraction = min(0.12, 0.04 + 0.3*0.2) = 0.1 — major.
      const flows = deriveFlowCandidates(migrationSnapshot(0.9), { tick: 5 }); // default rules: gate on
      const mig = flows.find(f => f.candidateType === 'flow_migration');
      expect(mig.metadata.populationDelta / 2000).toBeGreaterThanOrEqual(0.08);
      expect(mig.applyMode).toBe('proposal');
    });

    test('a small transfer stays auto even with the rule on', () => {
      // severity 0.65 -> fraction = 0.04 + 0.05*0.2 = 0.05 — minor.
      const flows = deriveFlowCandidates(migrationSnapshot(0.65), { tick: 5 });
      const mig = flows.find(f => f.candidateType === 'flow_migration');
      expect(mig.metadata.populationDelta / 2000).toBeLessThan(0.08);
      expect(mig.applyMode).toBe('auto');
    });

    test('rules-off keeps legacy auto behavior for even the largest transfer', () => {
      const flows = deriveFlowCandidates(migrationSnapshot(1), {
        tick: 5,
        simulationRules: { majorChangesRequireProposal: false },
      });
      const mig = flows.find(f => f.candidateType === 'flow_migration');
      expect(mig.applyMode).toBe('auto');
    });

    test('a hard trade dependency failing routes to proposal when on, auto when off', () => {
      const tradeSnapshot = (strength) => ({
        worldState: { tick: 5, stressors: [] },
        regionalGraph: ensureRegionalGraph({ channels: [{ type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed', strength }] }),
        byId: new Map([['a', { id: 'a', name: 'Ashford' }], ['b', { id: 'b', name: 'Briar' }]]),
        settlements: [
          { id: 'a', name: 'Ashford', activeConditions: [{ archetype: 'trade_route_cut', severity: 0.6 }], causal: { scores: { trade_connectivity: 30 } } },
          { id: 'b', name: 'Briar', activeConditions: [], causal: { scores: {} } },
        ],
      });
      // strength 0.8 -> severity 0.64 >= 0.62 — major.
      const hard = deriveFlowCandidates(tradeSnapshot(0.8), { tick: 5 })
        .find(f => f.candidateType === 'flow_trade_scarcity');
      expect(hard.applyMode).toBe('proposal');
      // strength 0.5 -> severity 0.55 — minor, stays auto.
      const soft = deriveFlowCandidates(tradeSnapshot(0.5), { tick: 5 })
        .find(f => f.candidateType === 'flow_trade_scarcity');
      expect(soft.applyMode).toBe('auto');
      // rules-off: legacy always-auto.
      const off = deriveFlowCandidates(tradeSnapshot(0.8), { tick: 5, simulationRules: { majorChangesRequireProposal: false } })
        .find(f => f.candidateType === 'flow_trade_scarcity');
      expect(off.applyMode).toBe('auto');
    });
  });
});
