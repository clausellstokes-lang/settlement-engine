/**
 * seaRoads.test.js — DEEP COUPLINGS D-6 THE SEA ROADS (DESIGN_DEEP_COUPLINGS §10). Unit-proves
 * the pure sea leaf: the flag gates, per-hop modality classification (legModes), the sea-aware
 * current-leg read, and the PASS-3 sea-hazard dispatch (S1 blockade · S2 storm · S3 piracy).
 */
import { describe, it, expect } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placePortSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  seaRoadsActive, navalLit, classifyLegModes, currentSeaHop, resolveSeaHazard, SEA_ROADS_TUNING,
} from '../../src/domain/roads/seaRoads.js';

// A digest with the seaLanes slot LIT (coastal ports + water edges derived from geometry).
const SEA_DIGEST = (() => {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  return buildSpatialDigest({ pack, placements: placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 }), seaLanes: true });
})();
const SEA_EDGE = SEA_DIGEST.reserved.seaLanes.edges[0].between.map(String); // a real [portA, portB] water hop

describe('D-6 flag gates', () => {
  it('seaRoadsActive / navalLit read === true defensively', () => {
    expect(seaRoadsActive({ simulationRules: { seaRoadsEnabled: true } })).toBe(true);
    expect(seaRoadsActive({ simulationRules: {} })).toBe(false);
    expect(seaRoadsActive(null)).toBe(false);
    expect(navalLit({ simulationRules: { navalEnabled: true } })).toBe(true);
    expect(navalLit({ simulationRules: {} })).toBe(false);
  });
});

describe('D-6 §10(1) classifyLegModes', () => {
  it('a real water hop classifies sea; a short path ⇒ []', () => {
    expect(classifyLegModes(SEA_DIGEST, SEA_EDGE)).toEqual(['sea']);
    expect(classifyLegModes(SEA_DIGEST, ['x'])).toEqual([]);
    expect(classifyLegModes(SEA_DIGEST, null)).toEqual([]);
  });
  it('a non-adjacent land pair classifies land', () => {
    // two ids that are not a sea edge (reuse a port with a bogus neighbour ⇒ not in the sea set).
    expect(classifyLegModes(SEA_DIGEST, [SEA_EDGE[0], 'not_a_neighbour'])).toEqual(['land']);
  });
});

describe('D-6 §10(2) currentSeaHop (legModes authoritative)', () => {
  const mission = (legModes) => ({ id: 'm1', path: ['a', 'b'], legModes, phase: 'outbound', departTick: 0, legArrivalTick: 4, destId: 'b', homeId: 'a' });
  it('an outbound sea hop reads overSea from legModes', () => {
    const r = currentSeaHop(mission(['sea']), 1, SEA_DIGEST, 'summer');
    expect(r).toEqual({ overSea: true, a: 'a', b: 'b' });
  });
  it('a land hop reads overSea false', () => {
    expect(currentSeaHop(mission(['land']), 1, SEA_DIGEST, 'summer').overSea).toBe(false);
  });
  it('visiting ⇒ no in-transit hop', () => {
    expect(currentSeaHop({ ...mission(['sea']), phase: 'visiting' }, 1, SEA_DIGEST, 'summer').overSea).toBe(false);
  });
});

const SEED = 'sea';
const seaMission = () => ({ id: 'm.sea', path: ['a', 'b'], legModes: ['sea'], phase: 'outbound', departTick: 0, legArrivalTick: 4, destId: 'b', homeId: 'a' });
const baseArgs = (worldState, season = 'summer') => ({
  m: seaMission(), weekClock: 1, digest: SEA_DIGEST, season, worldState,
  graph: { edges: [], channels: [] }, homeId: 'a', destId: 'b', exposure: 0.6, protection: 1,
  fork: createPRNG(`${SEED}::roads-hazard:m.sea:1`), rngSeed: SEED, now2: 1, idSet: new Set(['a', 'b']),
});

describe('D-6 §10(3) resolveSeaHazard', () => {
  it('a LAND hop ⇒ null (no sea hazard)', () => {
    const args = baseArgs({ simulationRules: {} });
    args.m = { ...seaMission(), legModes: ['land'] };
    expect(resolveSeaHazard(args)).toBeNull();
  });

  it('S3 PIRACY: an embattled port node ⇒ an S3 capture/rob (the T3 twin)', () => {
    const worldState = { simulationRules: {}, spatialLedgers: { embattlement: { a: { level: 0.6 } } } };
    const res = resolveSeaHazard(baseArgs(worldState));
    expect(res).toBeTruthy();
    expect(res.cls).toBe('S3');
    expect(['hostage', 'robbed']).toContain(res.outcome);
    expect(res.overSea).toBe(true);
  });

  it('S2 STORM: a winter sea hop can delay (never capture), scaled by the storm law', () => {
    // no blockade, no embattlement ⇒ only S2 is reachable. Try seeds until a storm lands.
    let stormed = null;
    for (let i = 0; i < 60 && !stormed; i += 1) {
      const args = baseArgs({ simulationRules: {} }, 'winter');
      args.rngSeed = `w${i}`; args.now2 = i;
      const res = resolveSeaHazard(args);
      if (res) stormed = res;
    }
    expect(stormed, 'a winter storm eventually rolls').toBeTruthy();
    expect(stormed.cls).toBe('S2');
    expect(stormed.outcome).toBe('delayed');
    expect(stormed.delayWeeks).toBeGreaterThanOrEqual(1);
    expect(stormed.delayWeeks).toBeLessThanOrEqual(2);
    expect(stormed.captorId).toBe(''); // a storm takes no captive
  });

  it('S2 never fires in summer (stormMult 1.0 ⇒ zero incidence)', () => {
    for (let i = 0; i < 30; i += 1) {
      const args = baseArgs({ simulationRules: {} }, 'summer');
      args.rngSeed = `s${i}`; args.now2 = i;
      expect(resolveSeaHazard(args)).toBeNull(); // no blockade, no embattlement, no summer storm
    }
  });

  it('S1 BLOCKADE (naval lit): a hostile blockade of an endpoint port ⇒ an S1 capture roll', () => {
    const worldState = {
      simulationRules: { navalEnabled: true },
      spatialLedgers: { navalTransit: { b1: { armyId: 'B', role: 'blockade', ownerId: 'e', targetId: 'b' } } },
    };
    const graph = { edges: [{ from: 'a', to: 'e', relationshipType: 'hostile' }], channels: [] };
    const args = { ...baseArgs(worldState), graph };
    const res = resolveSeaHazard(args);
    expect(res).toBeTruthy();
    expect(res.cls).toBe('S1');
    expect(res.captorId).toBe('e'); // the blockading power
    expect(['hostage', 'delayed']).toContain(res.outcome);
  });

  it('S1 needs navalEnabled: a blockade with the navy DARK ⇒ S1 unreachable (S2/S3 still live)', () => {
    const worldState = {
      simulationRules: {}, // navalEnabled absent
      spatialLedgers: { navalTransit: { b1: { armyId: 'B', role: 'blockade', ownerId: 'e', targetId: 'b' } } },
    };
    const graph = { edges: [{ from: 'a', to: 'e', relationshipType: 'hostile' }], channels: [] };
    expect(resolveSeaHazard({ ...baseArgs(worldState), graph })).toBeNull(); // no blockade capture, no storm (summer), no embattlement
  });

  it('a blockade by a NON-hostile power is ignored (only hostile fleets take you)', () => {
    const worldState = {
      simulationRules: { navalEnabled: true },
      spatialLedgers: { navalTransit: { b1: { armyId: 'B', role: 'blockade', ownerId: 'e', targetId: 'b' } } },
    };
    const graph = { edges: [{ from: 'a', to: 'e', relationshipType: 'ally' }], channels: [] };
    expect(resolveSeaHazard({ ...baseArgs(worldState), graph })).toBeNull();
  });
});

describe('D-6 tuning is the T1/T3 twin', () => {
  it('S1 alpha matches the army partial-bypass law; S3 base matches T3', () => {
    expect(SEA_ROADS_TUNING.S1_BLOCKADE_ALPHA).toBe(0.25);
    expect(SEA_ROADS_TUNING.S3_PIRACY_BASE).toBe(0.12);
  });
});
