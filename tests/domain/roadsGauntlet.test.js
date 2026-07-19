/**
 * roadsGauntlet.test.js — THE GAUNTLET matrix fixture suite (R-3). EVERY §7 matrix cell is
 * exercised via a forced fixture (a seeded threat + a seed search that lands the roll on the
 * intended side of captureP). Roster conservation (the NO-DEATH law §1 law 1) is asserted on
 * every fixture; the protection-bypass exponents are pinned. DESIGN_THE_ROADS.md §7.
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { ROADS_TUNING, protectionOf, exposureOf, captureProbability } from '../../src/domain/roads/state.js';

// Three real settlements h, x, d (x = a waystation hop on the h→d road); 'e' is a phantom
// enemy id (army home / besieger / occupier).
const SIDS = ['h', 'x', 'd'];
function digestFor() {
  const pack = makeGridPack({ cols: 6, rows: 5 });
  const placed = placeSettlements(pack, SIDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: SIDS[i], cellId: p.cellId })) });
}
const DIGEST = digestFor();
const TICK = 100;
const MID = 'road.h.h:m.90';

const traveler = (importance) => ({ id: 'm', name: 'The Envoy', importance, category: 'government', personality: { dominant: 'bold' } });
function settlementsFor(importance) {
  const mk = (name) => ({ name, tier: 'town', npcs: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } });
  const h = mk('Home'); h.npcs = [traveler(importance)];
  return { h, x: mk('Waystation'), d: mk('Dest') };
}
function missionFor({ phase, escort01, stayWeeks }) {
  return {
    id: MID, npcKey: 'h:m', npcName: 'The Envoy', homeId: 'h', destId: 'd',
    purpose: { kind: 'trade', ref: 'd' }, phase, path: ['h', 'x', 'd'],
    departTick: 90, legArrivalTick: 110, stayWeeks, escort01, riskTolerance01: 0.9,
    knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 2,
  };
}
function worldFor({ seed, mission, extraLedgers = {}, relationshipStates = {}, occupations = {} }) {
  return {
    rngSeed: seed, tick: TICK, simulationRules: { roadsEnabled: true, warLayerEnabled: true },
    calendar: { elapsedWeeks: TICK, year: 2 }, spatialCanonVersion: 1, spatialDigest: DIGEST,
    occupations, relationshipStates,
    spatialLedgers: { roads: { missions: { [MID]: mission } }, ...extraLedgers },
  };
}
function argsFor(worldState, importance, graph) {
  const s = settlementsFor(importance);
  const settlements = SIDS.map((id) => ({ id, name: s[id].name, settlement: s[id] }));
  return { snapshot: { settlements }, worldState, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), graph, tick: TICK, now: null };
}
function graphWith(extra = {}) {
  return ensureRegionalGraph({
    edges: [
      { id: 'edge.h.d', from: 'h', to: 'd', relationshipType: extra.hdRel || 'trade_partner' },
      { id: 'edge.h.e', from: 'h', to: 'e', relationshipType: extra.heRel || 'trade_partner' },
    ],
    channels: [{ from: 'h', to: 'd', type: 'trade_route', status: 'confirmed', strength: 0.5 }, ...(extra.channels || [])],
  });
}
const firstDraw = (seed) => createPRNG(`${seed}::roads-hazard:${MID}:${TICK}`).random();
function findSeed(pred) {
  for (let i = 0; i < 40000; i++) { const s = `g-${i}`; if (pred(firstDraw(s))) return s; }
  throw new Error('no seed found for predicate');
}
function capturePFor({ base, alpha, importanceWeight, escort01, phase, legWeeks }) {
  const protection = protectionOf({ importanceWeight, militaryQuality01: escort01 });
  return captureProbability({ base, exposure: exposureOf({ legWeeks, phase }), protection, alpha });
}
const IW = { notable: 0.4, key: 0.7, pillar: 1.0 };
const WEAK = { importance: 'notable', escort01: 0.6, iw: IW.notable };
const STRONG = { importance: 'pillar', escort01: 1.6, iw: IW.pillar };

const homeNpc = (res) => ((res.settlementUpdates || []).find((u) => u.saveId === 'h')?.settlement?.npcs || []).find((n) => n.id === 'm');
const ransoms = (res) => res.worldState?.spatialLedgers?.roads?.ransoms || {};
const missions = (res) => res.worldState?.spatialLedgers?.roads?.missions || {};

describe('gauntlet — T1 ARMY ON THE ROUTE (in-transit)', () => {
  const graph = graphWith({ heRel: 'hostile' }); // h↔e hostile ⇒ the army is a threat
  const army = { armyTransit: { 'army.e': { armyId: 'e', originId: 'e', destId: 'h', path: ['e', 'x'], position01: 1, role: 'march' } } }; // currentRegion → 'x'
  const cP = (esc, iw) => capturePFor({ base: ROADS_TUNING.T1_BASE, alpha: ROADS_TUNING.T1_ALPHA, importanceWeight: iw, escort01: esc, phase: 'outbound', legWeeks: 20 });

  it('T1 → HOSTAGE (roll < captureP): mission becomes a ransom, captor = the army home', () => {
    const seed = findSeed((r) => r < cP(WEAK.escort01, WEAK.iw) - 0.02);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'outbound', escort01: WEAK.escort01, stayWeeks: 1 }), extraLedgers: army }), WEAK.importance, graph));
    expect(Object.keys(missions(res)), 'the mission is removed').toEqual([]);
    const rec = Object.values(ransoms(res))[0];
    expect(rec?.threatClass).toBe('T1');
    expect(rec.captorId).toBe('e');
    expect(homeNpc(res).whereabouts.state).toBe('hostage');
  });
  it('T1 → DELAYED (roll >= captureP): legArrivalTick +1, journey continues', () => {
    const seed = findSeed((r) => r > cP(STRONG.escort01, STRONG.iw) + 0.05 && r < 0.99);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'outbound', escort01: STRONG.escort01, stayWeeks: 1 }), extraLedgers: army }), STRONG.importance, graph));
    expect(Object.keys(ransoms(res))).toEqual([]);
    expect(missions(res)[MID].legArrivalTick).toBe(111);
  });
});

describe('gauntlet — T2 SIEGE DURING STAY (visiting)', () => {
  const graph = graphWith({ channels: [{ id: 'wf.e.d', from: 'e', to: 'd', type: 'war_front', status: 'confirmed', evidence: [{ source: 'war_layer' }] }] });
  const cP = (esc, iw) => capturePFor({ base: ROADS_TUNING.T2_BASE, alpha: ROADS_TUNING.T2_ALPHA, importanceWeight: iw, escort01: esc, phase: 'visiting', legWeeks: 8 });

  it('T2 → HOSTAGE (captor = the besieger)', () => {
    const seed = findSeed((r) => r < cP(WEAK.escort01, WEAK.iw) - 0.02);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'visiting', escort01: WEAK.escort01, stayWeeks: 8 }) }), WEAK.importance, graph));
    const rec = Object.values(ransoms(res))[0];
    expect(rec?.threatClass).toBe('T2');
    expect(rec.captorId).toBe('e');
  });
  it('T2 → TRAPPED (trappedBySiege set, held abroad)', () => {
    const seed = findSeed((r) => r > cP(STRONG.escort01, STRONG.iw) + 0.05 && r < 0.99);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'visiting', escort01: STRONG.escort01, stayWeeks: 8 }) }), STRONG.importance, graph));
    expect(Object.keys(ransoms(res))).toEqual([]);
    expect(missions(res)[MID].trappedBySiege).toBe(true);
  });
});

describe('gauntlet — T3 EMBATTLED ROADS (in-transit)', () => {
  const graph = graphWith();
  const embattled = { embattlement: { x: { level: 0.9, phase: 'embattled', sinceTick: 0, lastTick: 0 } } };
  const cP = (esc, iw) => capturePFor({ base: ROADS_TUNING.T3_BASE * 0.9, alpha: ROADS_TUNING.T3_ALPHA, importanceWeight: iw, escort01: esc, phase: 'outbound', legWeeks: 20 });

  it('T3 → HOSTAGE (captor = the embattled hop seat)', () => {
    const seed = findSeed((r) => r < cP(WEAK.escort01, WEAK.iw) - 0.01);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'outbound', escort01: WEAK.escort01, stayWeeks: 1 }), extraLedgers: embattled }), WEAK.importance, graph));
    const rec = Object.values(ransoms(res))[0];
    expect(rec?.threatClass).toBe('T3');
    expect(rec.captorId).toBe('x');
  });
  it('T3 → ROBBED (texture; journey continues)', () => {
    const seed = findSeed((r) => r > cP(STRONG.escort01, STRONG.iw) + 0.05 && r < 0.99);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'outbound', escort01: STRONG.escort01, stayWeeks: 1 }), extraLedgers: embattled }), STRONG.importance, graph));
    expect(Object.keys(ransoms(res))).toEqual([]);
    expect(missions(res)[MID]).toBeTruthy();
  });
});

describe('gauntlet — T1 OCCUPATION DURING STAY (visiting)', () => {
  const graph = graphWith();
  const occ = { d: { occupierId: 'e', state: 'extractive', sinceTick: 0, stateHeld: 1, resistance: 0.3, benefitYield: 0, lastTick: 0 } };
  it('T1 → HOSTAGE (captor = the occupier)', () => {
    const cP = capturePFor({ base: ROADS_TUNING.T1_BASE, alpha: ROADS_TUNING.T1_ALPHA, importanceWeight: WEAK.iw, escort01: WEAK.escort01, phase: 'visiting', legWeeks: 8 });
    const seed = findSeed((r) => r < cP - 0.02);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'visiting', escort01: WEAK.escort01, stayWeeks: 8 }), occupations: occ }), WEAK.importance, graph));
    const rec = Object.values(ransoms(res))[0];
    expect(rec?.threatClass).toBe('T1');
    expect(rec.captorId).toBe('e');
  });
});

describe('gauntlet — T4 HOSTILE RECEPTION (the host also rolls)', () => {
  const graph = graphWith({ hdRel: 'rival' }); // rival host, NOT at open war
  const protection = protectionOf({ importanceWeight: WEAK.iw, militaryQuality01: WEAK.escort01 });
  const exposure = exposureOf({ legWeeks: 8, phase: 'visiting' });
  const detentionP = ROADS_TUNING.T4_DETENTION_PER_RUNG * 1 * exposure / protection * ROADS_TUNING.LEGITIMACY_RESTRAINT;
  const hostLegit = (res) => res.settlementUpdates.find((u) => u.saveId === 'd').settlement.powerStructure.publicLegitimacy.score;
  const rel = { 'edge.h.d': { relationshipType: 'rival' } };
  const mk = () => missionFor({ phase: 'visiting', escort01: WEAK.escort01, stayWeeks: 8 });

  it('T4 → HOSTAGE (r < detentionP): captor = host, AND the non-war detainer seat bleeds −2', () => {
    const seed = findSeed((r) => r < detentionP - 0.005);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: mk(), relationshipStates: rel }), WEAK.importance, graph));
    const rec = Object.values(ransoms(res))[0];
    expect(rec?.threatClass).toBe('T4');
    expect(rec.captorId).toBe('d');
    expect(hostLegit(res), 'the detainer host bleeds legitimacy (restraint cost)').toBe(53); // 55 − 2
  });
  it('T4 → EXPELLED (detentionP <= r < 2×detentionP): turned back, mission returning', () => {
    const seed = findSeed((r) => r >= detentionP + 0.002 && r < detentionP * 2 - 0.002);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: mk(), relationshipStates: rel }), WEAK.importance, graph));
    expect(Object.keys(ransoms(res))).toEqual([]);
    expect(missions(res)[MID].phase).toBe('returning');
    expect(missions(res)[MID].expelled).toBe(true);
  });
  it('T4 → RECEIVED (r >= 2×detentionP): visit proceeds, no capture, no expulsion', () => {
    const seed = findSeed((r) => r > detentionP * 2 + 0.02 && r < 0.99);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: mk(), relationshipStates: rel }), WEAK.importance, graph));
    expect(Object.keys(ransoms(res))).toEqual([]);
    expect(missions(res)[MID].phase).toBe('visiting');
    expect(missions(res)[MID].expelled).toBeUndefined();
  });
});

describe('gauntlet — invariants (NO-DEATH + protection-bypass exponents pinned)', () => {
  it('roster conservation: a captured traveller is STILL present (hostage), never removed', () => {
    const graph = graphWith({ hdRel: 'rival' });
    const protection = protectionOf({ importanceWeight: WEAK.iw, militaryQuality01: WEAK.escort01 });
    const detentionP = ROADS_TUNING.T4_DETENTION_PER_RUNG * exposureOf({ legWeeks: 8, phase: 'visiting' }) / protection * ROADS_TUNING.LEGITIMACY_RESTRAINT;
    const seed = findSeed((r) => r < detentionP - 0.005);
    const res = advanceRoads(argsFor(worldFor({ seed, mission: missionFor({ phase: 'visiting', escort01: WEAK.escort01, stayWeeks: 8 }), relationshipStates: { 'edge.h.d': { relationshipType: 'rival' } } }), WEAK.importance, graph));
    const npc = homeNpc(res);
    expect(npc, 'the captured NPC is STILL in the roster (no execution branch)').toBeTruthy();
    expect(npc.whereabouts.state).toBe('hostage');
  });
  it('the protection-bypass exponents are frozen (α: T1 0.25 < T2 0.5 < T3 1.0)', () => {
    expect(ROADS_TUNING.T1_ALPHA).toBe(0.25);
    expect(ROADS_TUNING.T2_ALPHA).toBe(0.5);
    expect(ROADS_TUNING.T3_ALPHA).toBe(1.0);
    const prot = protectionOf({ importanceWeight: 1.0, militaryQuality01: 1.6 });
    const t1 = captureProbability({ base: ROADS_TUNING.T1_BASE, exposure: 1, protection: prot, alpha: ROADS_TUNING.T1_ALPHA });
    const t3 = captureProbability({ base: ROADS_TUNING.T3_BASE, exposure: 1, protection: prot, alpha: ROADS_TUNING.T3_ALPHA });
    expect(t1).toBeGreaterThan(t3);
  });
});
