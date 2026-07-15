/**
 * resourceDynamicsKernel.test.js — W-DISCOVERY STAGE 1: the organic mover.
 *
 * Pins the mover geometry: the DORMANCY theorem (flag absent ⇒ zero candidates,
 * zero state, worldState unchanged), the terrain-legal latent pool (a minted key
 * is ALWAYS one generation could have rolled — the impossible-draw pin, property
 * tested over every terrain), the discovery integrator cadence (years-scale, no
 * golden-window firing), NONRENEWABLE-ONLY removal, and the integer-tick dwell
 * that survives the M10b catch-up collapse. Application (membership + reconcile +
 * condition + durability) is STAGE 2.
 */
import { describe, it, expect } from 'vitest';

import {
  evaluateResourceDynamics,
  latentResourcePool,
  isOrganicallyRemovable,
  stepDiscovery,
  RESOURCE_DYNAMICS_TUNING as T,
} from '../../src/domain/worldPulse/resourceDynamicsKernel.js';
import { getCompatibleResources } from '../../src/generators/terrainHelpers.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';

const TERRAINS = ['coastal', 'riverside', 'mountain', 'forest', 'plains', 'hills', 'desert'];

const snapshotWith = (settlement, id = 's1', name = 'Ashford') => ({ settlements: [{ id, name, settlement }] });

/** A pressureIndex stub: { get(id, kind) → { score } }. */
const pIndexWith = (pressures = {}) => ({
  get: (id, kind) => ({ score: (pressures[id] && pressures[id][kind]) || 0 }),
});

/** A deterministic fork-rng stub (picks the first pool member). */
const rngStub = { fork: () => ({ random: () => 0 }) };

const town = (over = {}) => ({
  name: 'Ashford', tier: 'town', population: 1500,
  tradeRoute: 'road',
  config: { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: [], ...(over.config || {}) },
  institutions: over.institutions || [],
  activeConditions: over.activeConditions || [],
  ...over,
});

// ── 1. DORMANCY (byte-identical) ───────────────────────────────────────────────
describe('dormancy theorem — flag absent ⇒ complete no-op', () => {
  it('no resourceDynamicsEnabled ⇒ zero candidates, worldState unchanged (same ref)', () => {
    const ws = { tick: 100, simulationRules: {}, settlementTickStates: {} };
    const out = evaluateResourceDynamics(ws, snapshotWith(town()), pIndexWith(), { tick: 100, rng: rngStub });
    expect(out.candidates).toEqual([]);
    expect(out.worldState).toBe(ws);                      // same reference — nothing threaded
  });

  it('flag explicitly false ⇒ still dormant', () => {
    const ws = { tick: 100, simulationRules: { resourceDynamicsEnabled: false }, settlementTickStates: {} };
    const settlement = { config: { terrainType: 'mountain', tradeRouteAccess: 'road', nearbyResources: ['iron_deposits'], nearbyResourcesDepleted: ['iron_deposits'] } };
    const out = evaluateResourceDynamics(ws, snapshotWith(settlement), pIndexWith({ s1: { food: 1, trade: 1 } }), { tick: 100000, rng: rngStub });
    expect(out.candidates).toEqual([]);
    expect(out.worldState).toBe(ws);
  });
});

// ── 2. THE LATENT POOL — terrain legality (the impossible-draw pin) ─────────────
describe('latent pool — terrain-legal, only known keys, conserved', () => {
  it('every pooled key is a real RESOURCE_DATA key AND terrain-compatible (property over all terrains)', () => {
    for (const terrain of TERRAINS) {
      const config = { terrainType: terrain, tradeRouteAccess: 'road', nearbyResources: [] };
      const settlement = { tradeRoute: 'road', config };
      const pool = latentResourcePool(config, settlement);
      const compatible = new Set(getCompatibleResources('road', terrain).filter(r => r.compatible).map(r => r.key));
      for (const key of pool) {
        expect(RESOURCE_DATA[key], `${terrain}: ${key} is a real RESOURCE_DATA key`).toBeTruthy();
        expect(compatible.has(key), `${terrain}: ${key} is terrain/route-compatible`).toBe(true);
      }
    }
  });

  it('the current roster + custom nodes are excluded (never re-mint a held node)', () => {
    const config = { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: ['iron_deposits'], nearbyResourcesCustom: ['Moonpetal grove'] };
    const pool = latentResourcePool(config, { tradeRoute: 'road', config });
    expect(pool).not.toContain('iron_deposits');
  });

  it('previously-removed keys never re-mint (conservation — a worked-out vein does not return)', () => {
    const config = { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: [], resourceEdits: { removed: ['iron_deposits'] } };
    const pool = latentResourcePool(config, { tradeRoute: 'road', config });
    expect(pool).not.toContain('iron_deposits');
  });
});

// ── 3. THE DISCOVERY INTEGRATOR (years-scale cadence) ──────────────────────────
describe('discovery integrator — cap-held, floor-gated, golden-safe', () => {
  it('steady-state at max drive reaches the floor; a moderate drive plateaus below it', () => {
    let hi = 0;
    for (let i = 0; i < 200; i++) hi = stepDiscovery(hi, 1);   // max drive
    expect(hi).toBeGreaterThanOrEqual(T.DISCOVERY_FLOOR);
    expect(hi).toBeLessThanOrEqual(T.DISCOVERY_CAP + 1e-9);
    let mid = 0;
    for (let i = 0; i < 200; i++) mid = stepDiscovery(mid, 0.5); // moderate drive
    expect(mid).toBeLessThan(T.DISCOVERY_FLOOR);                 // real pressure required
  });

  it('a few-tick window never arms discovery (golden-safe even when lit)', () => {
    const config = { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: [] };
    const settlement = town({ config, institutions: [{ name: 'Iron mine' }] });   // extraction present
    let ws = { tick: 0, simulationRules: { resourceDynamicsEnabled: true }, settlementTickStates: {} };
    const pIdx = pIndexWith({ s1: { food: 1, trade: 1 } });                        // max pressure
    let fired = false;
    for (let t = 0; t < 8; t++) {                                                  // a golden-length window
      const out = evaluateResourceDynamics({ ...ws, tick: t }, snapshotWith(settlement), pIdx, { tick: t, rng: rngStub });
      if (out.candidates.some(c => c.candidateType === 'resource_discovery')) fired = true;
      ws = out.worldState;
    }
    expect(fired).toBe(false);
  });

  it('sustained high prospecting pressure eventually strikes a terrain-legal node', () => {
    const config = { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: [] };
    const settlement = town({ config, institutions: [{ name: 'Iron mine' }] });
    const pool = new Set(latentResourcePool(config, settlement));
    let ws = { tick: 0, simulationRules: { resourceDynamicsEnabled: true }, settlementTickStates: {} };
    const pIdx = pIndexWith({ s1: { food: 1, trade: 1 } });
    let discovery = null;
    for (let t = 0; t < 40 && !discovery; t++) {
      const out = evaluateResourceDynamics({ ...ws, tick: t }, snapshotWith(settlement), pIdx, { tick: t, rng: rngStub });
      discovery = out.candidates.find(c => c.candidateType === 'resource_discovery') || null;
      ws = out.worldState;
    }
    expect(discovery, 'a discovery armed under sustained max drive').toBeTruthy();
    expect(discovery.resourceMembership.op).toBe('add');
    expect(pool.has(discovery.resourceMembership.resource), 'the struck node is in the latent pool').toBe(true);
  });
});

// ── 4. NONRENEWABLE-ONLY REMOVAL + the dwell wall ──────────────────────────────
describe('removal — nonrenewable-only, dwell-gated, catch-up-robust', () => {
  it('isOrganicallyRemovable: nonrenewables yes, renewables/managed no', () => {
    expect(isOrganicallyRemovable('iron_deposits')).toBe(true);
    expect(isOrganicallyRemovable('stone_quarry')).toBe(true);
    expect(isOrganicallyRemovable('managed_forest')).toBe(false);
    expect(isOrganicallyRemovable('grazing_land')).toBe(false);
  });

  const depletedTown = (resource) => ({
    config: {
      terrainType: 'mountain', tradeRouteAccess: 'road',
      nearbyResources: [resource], nearbyResourcesDepleted: [resource],
    },
  });

  it('a nonrenewable depleted ≥ REMOVAL_DWELL ticks mints a removal (integer-tick, collapse-robust)', () => {
    // Prior tick-state stamps the depletion start at tick 0; evaluate at the dwell
    // wall in ONE jump (the M10b one-interval catch-up collapse) — dwell = tick − since.
    const since = 0;
    const now = T.REMOVAL_DWELL;
    const ws = {
      tick: now, simulationRules: { resourceDynamicsEnabled: true },
      settlementTickStates: { s1: { resourceDynamics: { depletedSince: { iron_deposits: since } } } },
    };
    const out = evaluateResourceDynamics(ws, snapshotWith(depletedTown('iron_deposits')), pIndexWith(), { tick: now, rng: rngStub });
    const removal = out.candidates.find(c => c.candidateType === 'resource_removal');
    expect(removal, 'the vein gives out at the dwell wall').toBeTruthy();
    expect(removal.resourceMembership).toEqual({ saveId: 's1', resource: 'iron_deposits', op: 'remove' });
    expect(removal.metadata.dwell).toBe(T.REMOVAL_DWELL);
  });

  it('a RENEWABLE at max dwell NEVER mints removal', () => {
    const since = 0;
    const now = T.REMOVAL_DWELL * 10;
    const ws = {
      tick: now, simulationRules: { resourceDynamicsEnabled: true },
      settlementTickStates: { s1: { resourceDynamics: { depletedSince: { managed_forest: since } } } },
    };
    const out = evaluateResourceDynamics(ws, snapshotWith(depletedTown('managed_forest')), pIndexWith(), { tick: now, rng: rngStub });
    expect(out.candidates.some(c => c.candidateType === 'resource_removal')).toBe(false);
  });

  it('a nonrenewable BELOW REMOVAL_DWELL does not mint (and stamps its depletion tick)', () => {
    const ws = {
      tick: 10, simulationRules: { resourceDynamicsEnabled: true },
      settlementTickStates: {},
    };
    const out = evaluateResourceDynamics(ws, snapshotWith(depletedTown('iron_deposits')), pIndexWith(), { tick: 10, rng: rngStub });
    expect(out.candidates.some(c => c.candidateType === 'resource_removal')).toBe(false);
    // The depletion tick is stamped so the dwell counts from here.
    expect(out.worldState.settlementTickStates.s1.resourceDynamics.depletedSince.iron_deposits).toBe(10);
  });

  it('the depletion stamp is SET ONCE and carried forward (dwell counts from first depletion, not last run)', () => {
    // Tick A: first sight of depletion → stamp A. Tick B > A: stamp unchanged.
    let ws = { tick: 5, simulationRules: { resourceDynamicsEnabled: true }, settlementTickStates: {} };
    let out = evaluateResourceDynamics(ws, snapshotWith(depletedTown('iron_deposits')), pIndexWith(), { tick: 5, rng: rngStub });
    expect(out.worldState.settlementTickStates.s1.resourceDynamics.depletedSince.iron_deposits).toBe(5);
    ws = out.worldState;
    out = evaluateResourceDynamics({ ...ws, tick: 30 }, snapshotWith(depletedTown('iron_deposits')), pIndexWith(), { tick: 30, rng: rngStub });
    expect(out.worldState.settlementTickStates.s1.resourceDynamics.depletedSince.iron_deposits).toBe(5); // unchanged
  });
});

// ── 5. BYTE-NEUTRAL materialization ────────────────────────────────────────────
describe('byte-neutral tick-state (the moral-founding precedent)', () => {
  it('a lit settlement with an empty pool + no depletion writes NO resourceDynamics key', () => {
    // Empty pool (roster already holds everything compatible) + renewable-free roster.
    const compatible = getCompatibleResources('road', 'plains').filter(r => r.compatible).map(r => r.key);
    const config = { terrainType: 'plains', tradeRouteAccess: 'road', nearbyResources: compatible };
    const ws = { tick: 3, simulationRules: { resourceDynamicsEnabled: true }, settlementTickStates: {} };
    const out = evaluateResourceDynamics(ws, snapshotWith({ tradeRoute: 'road', config, institutions: [] }), pIndexWith(), { tick: 3, rng: rngStub });
    expect(out.worldState.settlementTickStates.s1?.resourceDynamics).toBeUndefined();
  });
});
