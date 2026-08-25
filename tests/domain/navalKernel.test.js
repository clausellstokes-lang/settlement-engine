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
import { advanceNaval, navalActive, orderConvoyVerbFactory, declareBlockadeVerbFactory } from '../../src/domain/worldPulse/navalKernel.js';
import { activeBlockadeTargets } from '../../src/domain/spatial/navalLayer.js';
import { makeIslandPack } from '../fixtures/spatialPackFixtures.js';

const SHIPYARD = { name: 'Shipyard', tags: ['transport', 'shipbuilding', 'port'] };
/** A snapshot where every seat is a prosperous city with a shipyard (a real war navy). */
const navySnapshot = { byId: { get: (id) => ({ id, name: String(id), settlement: { name: String(id), tier: 'city', institutions: [SHIPYARD], economicState: { prosperity: 'Prosperous' } } }) } };

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

describe('W-NAVY Stage 3 — the ORDER_CONVOY verb (REGISTERED — the W-COMPOSER-2 lift)', () => {
  it('ships realm scope + candidateType, registered:true, with its realm-manifest entry', async () => {
    const v = orderConvoyVerbFactory();
    expect(v.verb).toBe('ORDER_CONVOY');
    expect(v.scope).toBe('realm');
    expect(typeof v.candidateType).toBe('string');
    expect(v.registered).toBe(true);
    const { realmVerbFor } = await import('../../src/domain/events/realmManifest.js');
    expect(realmVerbFor('ORDER_CONVOY')?.candidateType).toBe(v.candidateType);
  });
});

describe('W-NAVY Stage 4 — the blockade (mint, authority-routing, lift)', () => {
  const hostileGraph = { edges: [{ from: 'main', to: 'isle', relationshipType: 'hostile' }] };

  it('a navy at war with a hostile port BLOCKADES it (loaded dice, authority auto)', () => {
    const d = digest();
    let ws = { spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true }, deployments: {} };
    let minted = false;
    let blockadeNews = false;
    for (let t = 0; t < 80 && !minted; t++) {
      const out = advanceNaval({ snapshot: navySnapshot, worldState: ws, digest: d, graph: hostileGraph, rng: createPRNG('blk').fork('naval'), tick: t, now: NOW });
      ws = out.worldState;
      const led = ws.spatialLedgers?.navalTransit || {};
      if (Object.values(led).some((r) => r.role === 'blockade')) minted = true;
      if (out.newsEntries.some((n) => n.impactKind === 'blockade_declared')) blockadeNews = true;
    }
    expect(minted).toBe(true);       // the loaded dice fires within the window (liveness)
    expect(blockadeNews).toBe(true); // a blockade_declared receipt was stamped
  });

  it('under dm_only authority the blockade DEFERS (no mint, deferral-visible)', () => {
    const d = digest();
    const ws = { spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true, politicalAutonomy: 'dm_only' }, deployments: {} };
    let anyMint = false;
    let anyDefer = false;
    let state = ws;
    for (let t = 0; t < 40; t++) {
      const out = advanceNaval({ snapshot: navySnapshot, worldState: state, digest: d, graph: hostileGraph, rng: createPRNG('blk').fork('naval'), tick: t, now: NOW });
      state = out.worldState;
      const led = state.spatialLedgers?.navalTransit || {};
      if (Object.values(led).some((r) => r.role === 'blockade')) anyMint = true;
      if (out.deferrals.some((x) => x.reason === 'dm_approval')) anyDefer = true;
    }
    expect(anyMint).toBe(false); // never mints under DM authority
    expect(anyDefer).toBe(true); // the deferral is visible (not a silent drop)
  });

  it('LIFT-THE-BLOCKADE: a relief fleet that beats the blockading fleet drops the blockade record', () => {
    const d = digest();
    const ws = {
      spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true }, deployments: {},
      spatialLedgers: {
        navalTransit: {
          // A WEAK blockade of isle, still afield (sailing to station).
          main: { armyId: 'main', role: 'blockade', ownerId: 'main', cargoId: null, originId: 'main', destId: 'isle', targetId: 'isle', path: ['main', 'isle'], departTick: 0, arrivalTick: 10, position01: 0.5, strength: 20, cargoStrength: 0, readiness: 0.5, supplyQuality: 1, funding: 0.5, lastTick: 0 },
          // A STRONG relief fleet from isle, meeting the blockade on the shared edge.
          isle: { armyId: 'isle', role: 'convoy', ownerId: 'isle', cargoId: 'isle', originId: 'isle', destId: 'main', targetId: 'main', path: ['isle', 'main'], departTick: 0, arrivalTick: 10, position01: 0.5, strength: 95, cargoStrength: 10, readiness: 0.7, supplyQuality: 1, funding: 0.6, lastTick: 0 },
        },
      },
    };
    const out = advanceNaval({ snapshot: navySnapshot, worldState: ws, digest: d, graph: hostileGraph, rng: createPRNG('lift').fork('naval'), tick: 5, now: NOW });
    const led = out.worldState.spatialLedgers.navalTransit;
    expect(led.main).toBeUndefined(); // the blockade was broken (lifted) — record dropped
    expect(led.isle).toBeTruthy();    // the relief fleet holds the water
    expect(out.newsEntries.some((n) => n.impactKind === 'sea_battle')).toBe(true);
  });

  it('the DECLARE_BLOCKADE verb is REGISTERED (realm scope — the W-COMPOSER-2 lift)', async () => {
    const v = declareBlockadeVerbFactory();
    expect(v.verb).toBe('DECLARE_BLOCKADE');
    expect(v.scope).toBe('realm');
    expect(v.candidateType).toBe('blockade_declared');
    expect(v.registered).toBe(true);
    const { realmVerbFor } = await import('../../src/domain/events/realmManifest.js');
    expect(realmVerbFor('DECLARE_BLOCKADE')?.candidateType).toBe('blockade_declared');
  });
});

describe('W-NAVY r2 — RECORD RETIREMENT (worldpulse-war-military-1: convoys/orphans; -4: blockade lift)', () => {
  const plain = { byId: { get: (id) => ({ id, name: String(id), settlement: { name: String(id) } }) } };

  it('CONVOY STAND-DOWN: an arrived convoy retires, marks its deployment delivered, and does NOT re-shuttle (navy re-operates)', () => {
    const d = digest();
    const ws = {
      spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true },
      deployments: { main: { targetId: 'isle', currentEffectiveStrength: 50, readiness: 0.6 } },
      spatialLedgers: { navalTransit: { main: convoy('main', 'isle', { strength: 70, cargo: 50, path: ['main', 'isle'] }) } },
    };
    // Advance PAST arrivalTick (10) with a real war navy (navySnapshot) so the derive loop
    // actually runs — proving the delivered-guard, not merely a zero-strength short-circuit.
    const out = advanceNaval({ snapshot: navySnapshot, worldState: ws, digest: d, graph: { edges: [] }, rng: createPRNG('c').fork('naval'), tick: 12, now: NOW });
    expect(out.worldState.spatialLedgers?.navalTransit).toBeUndefined(); // arrived convoy retired, ledger emptied
    expect(out.worldState.deployments.main.seaLiftDelivered).toBe('isle'); // deployment stamped delivered
    // Re-operate: a second tick does NOT re-mint a shuttle for the already-delivered army.
    const out2 = advanceNaval({ snapshot: navySnapshot, worldState: out.worldState, digest: d, graph: { edges: [] }, rng: createPRNG('c').fork('naval'), tick: 13, now: NOW });
    expect(out2.worldState.spatialLedgers?.navalTransit).toBeUndefined();
  });

  it('ORPHAN RETIREMENT: a convoy whose target left the snapshot retires', () => {
    const d = digest();
    const gone = { byId: { get: (id) => (id === 'isle' ? undefined : { id, name: String(id), settlement: { name: String(id) } }) } };
    const ws = {
      spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true }, deployments: {},
      spatialLedgers: { navalTransit: { main: { ...convoy('main', 'isle', { strength: 70, cargo: 50, path: ['main', 'isle'] }), position01: 0.5 } } },
    };
    const out = advanceNaval({ snapshot: gone, worldState: ws, digest: d, graph: { edges: [] }, rng: createPRNG('o').fork('naval'), tick: 3, now: NOW });
    expect(out.worldState.spatialLedgers?.navalTransit).toBeUndefined(); // orphaned convoy dropped
  });

  it('RECALL RETIREMENT: a mid-crossing convoy whose escorted deployment was recalled retires', () => {
    const d = digest();
    const ws = {
      spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true },
      deployments: { main: { targetId: 'isle', recalled: { cause: 'peace', tick: 2 } } },
      spatialLedgers: { navalTransit: { main: { ...convoy('main', 'isle', { strength: 70, cargo: 50, path: ['main', 'isle'] }), position01: 0.5 } } },
    };
    const out = advanceNaval({ snapshot: plain, worldState: ws, digest: d, graph: { edges: [] }, rng: createPRNG('e').fork('naval'), tick: 3, now: NOW });
    expect(out.worldState.spatialLedgers?.navalTransit).toBeUndefined(); // escort recalled ⇒ convoy dropped
  });

  it('a mid-crossing convoy with NO deployment slot (DM-ordered / relief fleet) is NOT dropped', () => {
    const d = digest();
    const ws = {
      spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true }, deployments: {}, // no slot
      spatialLedgers: { navalTransit: { main: { ...convoy('main', 'isle', { strength: 70, cargo: 50, path: ['main', 'isle'] }), position01: 0.5 } } },
    };
    const out = advanceNaval({ snapshot: plain, worldState: ws, digest: d, graph: { edges: [] }, rng: createPRNG('r').fork('naval'), tick: 3, now: NOW });
    expect(out.worldState.spatialLedgers.navalTransit.main).toBeTruthy(); // still afield (absence ≠ retirement)
  });

  it('BLOCKADE ORGANIC LIFT: peace (owner–target no longer hostile) drops the blockade + a lift news beat; strangulation ends', () => {
    const d = digest();
    const blockadeRec = { armyId: 'main', role: 'blockade', ownerId: 'main', cargoId: null, originId: 'main', destId: 'isle', targetId: 'isle', path: ['main', 'isle'], departTick: 0, arrivalTick: 10, position01: 1, strength: 60, cargoStrength: 0, readiness: 0.6, supplyQuality: 1, funding: 0.5, lastTick: 0 };
    const mk = (rel) => ({ spatialCanonVersion: 1, spatialDigest: d, simulationRules: { navalEnabled: true }, deployments: {}, spatialLedgers: { navalTransit: { main: { ...blockadeRec } } } });
    // PEACE: no hostile edge ⇒ the blockade lifts.
    const peace = advanceNaval({ snapshot: plain, worldState: mk('peace'), digest: d, graph: { edges: [] }, rng: createPRNG('p').fork('naval'), tick: 12, now: NOW });
    expect(peace.worldState.spatialLedgers?.navalTransit).toBeUndefined();       // blockade record gone
    expect(peace.newsEntries.some((n) => n.impactKind === 'blockade_lifted')).toBe(true);
    expect(activeBlockadeTargets(peace.worldState).size).toBe(0);                 // blockadeStrangulationOf ⇒ 0
    // CONTROL: still hostile ⇒ the blockade PERSISTS (no lift, no news).
    const war = advanceNaval({ snapshot: plain, worldState: mk('war'), digest: d, graph: { edges: [{ from: 'main', to: 'isle', relationshipType: 'hostile' }] }, rng: createPRNG('w').fork('naval'), tick: 12, now: NOW });
    expect(war.worldState.spatialLedgers.navalTransit.main).toBeTruthy();         // held under war
    expect(war.newsEntries.some((n) => n.impactKind === 'blockade_lifted')).toBe(false);
  });
});

/** Shared args for the determinism pin (fresh world each call, same seed). */
function seaArgs(seed) {
  const { worldState, graph } = collidingWorld();
  return { snapshot, worldState, digest: worldState.spatialDigest, graph, rng: createPRNG(seed).fork('naval'), tick: 5, now: NOW };
}
