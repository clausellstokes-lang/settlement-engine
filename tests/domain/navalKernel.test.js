/**
 * navalKernel.test.js — W-NAVY (DESIGN_NAVY.md) the kernel-adapter behaviour suite.
 *
 * Stage 3 — SEA BATTLE: dormancy byte-safety; the shared-sea-edge collision; resolveFieldBattle
 * VERBATIM (land parity); the SHARED FATE (heaviest band + debark, never annihilation); the
 * retreat-to-home-port reuse; hostility = graph labels (NOT the mutual-homeland test).
 */
import { describe, expect, it } from 'vitest';

import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { advanceNaval, navalActive, orderConvoyVerbFactory } from '../../src/domain/worldPulse/navalKernel.js';
import { makeIslandPack } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-07-15T00:00:00.000Z';

function digest() {
  const { pack, placements } = makeIslandPack();
  return buildSpatialDigest({ pack, placements, seaLanes: true });
}

const snapshot = { byId: { get: (id) => ({ id, name: String(id), settlement: { name: String(id) } }) } };

/** A convoy record on a sea path. */
function convoy(owner, dest, { strength, cargo, path }) {
  return {
    armyId: owner, role: 'convoy', ownerId: owner, cargoId: owner, originId: owner,
    destId: dest, targetId: dest, path, departTick: 0, arrivalTick: 10, position01: 0,
    strength, cargoStrength: cargo, readiness: 0.6, supplyQuality: 1, funding: 0.5, lastTick: 0,
  };
}

/** A lit world with two convoys sharing the main|isle sea edge, main hostile to isle. */
function collidingWorld(rel = 'hostile') {
  const d = digest();
  return {
    worldState: {
      spatialCanonVersion: 1, spatialDigest: d,
      simulationRules: { navalEnabled: true },
      deployments: {
        main: { targetId: 'isle', currentEffectiveStrength: 50, readiness: 0.6 },
        isle: { targetId: 'main', currentEffectiveStrength: 40, readiness: 0.5 },
      },
      spatialLedgers: {
        navalTransit: {
          main: convoy('main', 'isle', { strength: 70, cargo: 50, path: ['main', 'isle'] }),
          isle: convoy('isle', 'main', { strength: 30, cargo: 40, path: ['isle', 'main'] }),
        },
      },
    },
    graph: { edges: [{ from: 'main', to: 'isle', relationshipType: rel }] },
  };
}

describe('W-NAVY Stage 3 — dormancy (byte-safety when dark)', () => {
  it('navalActive requires BOTH the spatial marker AND the virtual navalEnabled flag', () => {
    expect(navalActive({ spatialCanonVersion: 1, simulationRules: { navalEnabled: true } })).toBe(true);
    expect(navalActive({ spatialCanonVersion: 1, simulationRules: {} })).toBe(false);          // no flag
    expect(navalActive({ simulationRules: { navalEnabled: true } })).toBe(false);               // no marker (aspatial)
    expect(navalActive({ spatialCanonVersion: 1 })).toBe(false);
    expect(navalActive(null)).toBe(false);
  });

  it('gate absent ⇒ a complete no-op (no navalTransit ledger, changed:false)', () => {
    const d = digest();
    const worldState = { spatialCanonVersion: 1, spatialDigest: d, simulationRules: {}, deployments: { main: { targetId: 'isle', currentEffectiveStrength: 50 } } };
    const out = advanceNaval({ snapshot, worldState, digest: d, graph: { edges: [] }, rng: createPRNG('x').fork('naval'), tick: 3, now: NOW });
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(worldState); // same reference
    expect(out.worldState.spatialLedgers).toBeUndefined();
  });
});

describe('W-NAVY Stage 3 — the sea battle (land parity, shared fate, retreat)', () => {
  it('two hostile navies sharing a sea edge fight; the loser retreats; a sea_battle news mints', () => {
    const { worldState, graph } = collidingWorld();
    const out = advanceNaval({ snapshot, worldState, digest: worldState.spatialDigest, graph, rng: createPRNG('sea').fork('naval'), tick: 5, now: NOW });
    expect(out.changed).toBe(true);
    const ledger = out.worldState.spatialLedgers.navalTransit;
    // Exactly ONE fleet survives afield (the loser's record was dropped — it sailed home).
    expect(Object.keys(ledger).length).toBe(1);
    // A sea-battle receipt was emitted (AGGREGATE, no npc named).
    const news = out.newsEntries.find((n) => n.impactKind === 'sea_battle');
    expect(news).toBeTruthy();
    expect(news.tags).toContain('sea_battle');
    // The stronger fleet (main, 70 vs 30) holds the water.
    expect(ledger.main).toBeTruthy();
    expect(ledger.isle).toBeUndefined();
  });

  it('SHARED FATE: the lost convoy mauls its embarked army (heaviest band) + debark-recalls it — NEVER annihilation', () => {
    const { worldState, graph } = collidingWorld();
    const before = worldState.deployments.isle.currentEffectiveStrength; // 40 (the loser's cargo)
    const out = advanceNaval({ snapshot, worldState, digest: worldState.spatialDigest, graph, rng: createPRNG('sea').fork('naval'), tick: 5, now: NOW });
    const isleDep = out.worldState.deployments.isle;
    // The embarked army bled the heaviest band, but a survivor floor reached shore.
    expect(isleDep.currentEffectiveStrength).toBeLessThan(before);
    expect(isleDep.currentEffectiveStrength).toBeGreaterThan(0); // never annihilated
    // It is recalled for the overland homecoming (the retreat reuse).
    expect(isleDep.recalled).toEqual({ cause: 'convoy_lost_debark', tick: 5 });
  });

  it('is DETERMINISTIC given the seed (land parity — the same clamped resolver)', () => {
    const a = advanceNaval({ ...seaArgs('sea') });
    const b = advanceNaval({ ...seaArgs('sea') });
    expect(JSON.stringify(a.worldState.spatialLedgers)).toBe(JSON.stringify(b.worldState.spatialLedgers));
    expect(JSON.stringify(a.worldState.deployments)).toBe(JSON.stringify(b.worldState.deployments));
  });

  it('hostility is GRAPH LABELS, not the mutual-homeland test: ALLIED navies do NOT fight', () => {
    const { worldState, graph } = collidingWorld('ally');
    const out = advanceNaval({ snapshot, worldState, digest: worldState.spatialDigest, graph, rng: createPRNG('sea').fork('naval'), tick: 5, now: NOW });
    // Both fleets still afield — no battle (allies escort past each other).
    const ledger = out.worldState.spatialLedgers.navalTransit;
    expect(Object.keys(ledger).sort()).toEqual(['isle', 'main']);
    expect(out.newsEntries.find((n) => n.impactKind === 'sea_battle')).toBeUndefined();
  });

  it('no SHARED sea edge ⇒ no collision (a shared node alone does not join battle)', () => {
    const d = digest();
    // Two convoys that do NOT share a sea edge (isle's path is a single node — no sea leg).
    const worldState = {
      spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true },
      deployments: {},
      spatialLedgers: { navalTransit: {
        main: convoy('main', 'isle', { strength: 70, cargo: 50, path: ['main', 'isle'] }),
        isle: { ...convoy('isle', 'isle', { strength: 30, cargo: 40, path: ['isle'] }), position01: 0 },
      } },
    };
    const out = advanceNaval({ snapshot, worldState, digest: d, graph: { edges: [{ from: 'main', to: 'isle', relationshipType: 'hostile' }] }, rng: createPRNG('sea').fork('naval'), tick: 5, now: NOW });
    expect(out.newsEntries.find((n) => n.impactKind === 'sea_battle')).toBeUndefined();
  });
});

describe('W-NAVY Stage 3 — the ORDER_CONVOY verb (registrable shape, not registered)', () => {
  it('ships realm scope + candidateType, registered:false', () => {
    const v = orderConvoyVerbFactory();
    expect(v.verb).toBe('ORDER_CONVOY');
    expect(v.scope).toBe('realm');
    expect(typeof v.candidateType).toBe('string');
    expect(v.registered).toBe(false);
  });
});

/** Shared args for the determinism pin (fresh world each call, same seed). */
function seaArgs(seed) {
  const { worldState, graph } = collidingWorld();
  return { snapshot, worldState, digest: worldState.spatialDigest, graph, rng: createPRNG(seed).fork('naval'), tick: 5, now: NOW };
}
