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

  test('no flows without confirmed channels', () => {
    const snapshot = {
      worldState: { tick: 5, stressors: [{ id: 's', type: 'famine', severity: 0.8, affectedSettlementIds: ['a'] }] },
      regionalGraph: ensureRegionalGraph({}),
      byId: new Map(),
      settlements: [],
    };
    expect(deriveFlowCandidates(snapshot, { tick: 5 })).toEqual([]);
  });
});
