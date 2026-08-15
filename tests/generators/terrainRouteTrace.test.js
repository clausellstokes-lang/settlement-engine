/**
 * terrainRouteTrace.test.js — [generators-pipeline-7].
 *
 * Terrain left on 'auto' with an EXPLICIT trade route is derived deterministically
 * from that route (getTerrainType's route→terrain map) rather than rolled. That is
 * disclosed, intended design — the verdict is to keep it, not to start rolling —
 * but the decision previously left NO receipt, so the lock was invisible in the
 * trace rail. The fix emits a 'derived' terrain trace on that path. Trace-only:
 * generation output (and same-seed goldens) is unchanged.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const terrainDerivedTrace = (s) =>
  (s.simulationTrace || []).find((t) => t.step === 'resolveConfig' && t.result === 'derived' && String(t.targetId).startsWith('terrain.'));

describe('[generators-pipeline-7] explicit route + auto terrain leaves a receipt', () => {
  test('road route + auto terrain emits a "derived from route" terrain trace', () => {
    const s = gen({ settType: 'town', culture: 'germanic', tradeRouteAccess: 'road' }, 'p7-road');
    const rec = terrainDerivedTrace(s);
    expect(rec, 'the route-derived terrain must leave a receipt').toBeTruthy();
    expect((rec.causes || []).map((c) => c.source)).toContain('config.tradeRouteAccess=road');
  });

  test('a PINNED terrain override does not emit the route-derived trace', () => {
    const s = gen({ settType: 'town', culture: 'germanic', terrainOverride: 'hills', tradeRouteAccess: 'road' }, 'p7-hills');
    expect(terrainDerivedTrace(s)).toBeUndefined();
  });

  test('random_trade (weighted roll) emits a "rolled" trace, not a "derived" one', () => {
    const s = gen({ settType: 'town', culture: 'germanic', terrainOverride: 'auto', tradeRouteAccess: 'random_trade' }, 'p7-roll');
    expect(terrainDerivedTrace(s)).toBeUndefined();
    const rolled = (s.simulationTrace || []).some((t) => t.step === 'resolveConfig' && t.result === 'rolled' && String(t.targetId).startsWith('terrain.'));
    expect(rolled).toBe(true);
  });
});
