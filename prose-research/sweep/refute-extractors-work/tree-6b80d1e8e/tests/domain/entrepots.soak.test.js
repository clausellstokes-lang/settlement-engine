/**
 * entrepots.soak.test.js — Phase 5.5 mover M6b: THE MEGACITY-LOOP SOAK.
 *
 * The §V.6 systemic-brake certification: the entrepôt loop (more trade → more
 * infrastructure → lower cost → more trade) is UNDAMPED without the co-built brakes.
 * This soak runs the pure engine 30 YEARS over a realistic multi-hub map with a fixed
 * set of cross-map shipments and asserts a GINI-STYLE bound on the centrality
 * distribution — NO runaway toll-hub. The self-balancing (a greedy toll DIVERTS trade,
 * so its centrality decays and another hub's rises) + the throughput ceiling + the rent
 * cap keep concentration bounded and trade spread across several crossroads, not
 * monopolized by one megacity.
 */
import { describe, it, expect } from 'vitest';
import { advanceEntrepots, centralityGini, ENTREPOT_TUNING } from '../../src/domain/spatial/entrepots.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const YEARS = 30;
const WEEKS = YEARS * 52;

function soakDigest(n) {
  const ids = Array.from({ length: n }, (_, i) => `s${i}`);
  const pack = makeGridPack({ cols: 30, rows: 24 });
  const placed = placeSettlements(pack, n);
  const digest = buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: ids[i], cellId: p.cellId })) });
  return { ids, digest };
}

// Cross-map O-D shipment pairs (corners/edges through the middle) — the trade whose
// gate-crossings earn the interior settlements their centrality.
const PAIRS = [
  ['s0', 's8'], ['s8', 's0'], ['s2', 's6'], ['s6', 's2'],
  ['s0', 's5'], ['s3', 's8'], ['s1', 's7'], ['s7', 's1'], ['s4', 's0'], ['s4', 's8'],
];

function runSoak(n = 9) {
  const { digest } = soakDigest(n);
  const shipments = PAIRS.map(([a, b]) => ({ sourceId: a, settlementId: b }));
  let world = { spatialCanonVersion: 1, simulationRules: { commodityFlowEnabled: true } };
  let maxGini = 0;
  let maxRatio = 0;
  let maxToll = 0;
  for (let tick = 1; tick <= WEEKS; tick++) {
    const out = advanceEntrepots({ shipments, digest, worldState: world, tick });
    world = { ...world, spatialLedgers: { ...(world.spatialLedgers || {}), entrepots: out.next } };
    const g = centralityGini(out.next);
    if (g > maxGini) maxGini = g;
    if (out.next) {
      const vals = Object.values(out.next).map((r) => r.centrality);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const mx = Math.max(...vals);
      if (mean > 0) maxRatio = Math.max(maxRatio, mx / mean);
      maxToll = Math.max(maxToll, ...Object.values(out.next).map((r) => r.toll));
    }
  }
  return { world, maxGini, maxRatio, maxToll };
}

describe('M6b — the megacity-loop soak (30y, the Gini-style concentration bound)', () => {
  it('centrality concentration stays BOUNDED over 30 years — NO runaway toll-hub', () => {
    const { world, maxGini, maxRatio } = runSoak(9);
    const ledger = world.spatialLedgers.entrepots;
    // Trade is SPREAD across several crossroads, not monopolized by one megacity.
    const active = Object.keys(ledger).length;
    expect(active).toBeGreaterThan(2);
    // The Gini bound HELD every tick of the run (the systemic brake, §V.6). A runaway
    // hub would drive Gini toward 1 and the hub/mean ratio unbounded.
    expect(maxGini).toBeLessThan(0.35);
    expect(maxRatio).toBeLessThan(3.0); // comparable to M4's bounded hub (3.16× mean, no megacity)
  });

  it('the RENT CAP holds under sustained load (no toll exceeds TOLL_MAX)', () => {
    const { maxToll } = runSoak(9);
    expect(maxToll).toBeLessThanOrEqual(ENTREPOT_TUNING.TOLL_MAX);
  });

  it('the 30y soak is HARD-deterministic (two runs byte-identical)', () => {
    const a = runSoak(9);
    const b = runSoak(9);
    expect(JSON.stringify(a.world.spatialLedgers.entrepots)).toBe(JSON.stringify(b.world.spatialLedgers.entrepots));
  });
});
