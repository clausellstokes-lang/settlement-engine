/**
 * roadsEmbassyExtensions.test.js — §11b R-8 (R8-b): the ESCORT REFINEMENT (settlementWeight01),
 * PURPOSE 6 DOMINION INSPECTION, PURPOSE 7 RUMOR VERIFICATION (plan + the return-side rumour
 * write, LAW 6 write g), and THE PEACE AMNESTY (bilateral release, pinned both directions).
 * DESIGN_THE_ROADS.md §11b.
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { ROADS_TUNING, settlementWeight01, militaryQuality01 } from '../../src/domain/roads/state.js';
import { readinessOf, experienceOf } from '../../src/domain/worldPulse/martialReadiness.js';
import { militaryCapacityScalar } from '../../src/domain/worldPulse/militaryStrength.js';
import { findVerifyPlan, boostHomeRumorFidelity } from '../../src/domain/roads/verification.js';

const SIDS = ['h', 't', 'x', 'p'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 6, rows: 5 });
  const placed = placeSettlements(pack, SIDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((pp, i) => ({ id: SIDS[i], cellId: pp.cellId })) });
})();
const TICK = 60;

const envoy = (over = {}) => ({ id: 'env', name: 'The Envoy', importance: 'notable', category: 'government', personality: { dominant: 'bold' }, faction: 'Crown', ...over });
function town(name, npcs = [], over = {}) {
  return {
    name, tier: 'town', npcs,
    economicState: { prosperity: 'Comfortable' },
    powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ faction: 'Crown', isGoverning: true, power: 60 }] },
    ...over,
  };
}
const graph = ensureRegionalGraph({
  edges: [
    { id: 'edge.h.x', from: 'h', to: 'x', relationshipType: 'trade_partner' },
    { id: 'edge.h.t', from: 'h', to: 't', relationshipType: 'trade_partner' },
  ],
  channels: [
    { from: 'h', to: 'x', type: 'trade_route', status: 'confirmed', strength: 0.5 },
    { from: 'h', to: 't', type: 'trade_route', status: 'confirmed', strength: 0.5 },
  ],
});
function argsFor(worldState, homeNpcs) {
  const s = { h: town('Home', homeNpcs), t: town('Target'), x: town('Waystation'), p: town('Farplace') };
  const settlements = SIDS.map((id) => ({ id, name: s[id].name, settlement: s[id] }));
  return {
    snapshot: { settlements }, worldState,
    settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })),
    saves: settlements.map((it) => ({ id: it.id, settlement: it.settlement })),
    graph, tick: TICK, now: null,
  };
}
function worldFor({ seed, rules = {}, occupations = {}, extraLedgers = {}, relationshipStates = {} }) {
  return {
    rngSeed: seed, tick: TICK, simulationRules: { roadsEnabled: true, warLayerEnabled: true, ...rules },
    calendar: { elapsedWeeks: 51, year: 1 }, spatialCanonVersion: 1, spatialDigest: DIGEST,
    occupations, relationshipStates, spatialLedgers: { ...extraLedgers },
  };
}
function seedThatFires(npcKey) {
  for (let i = 0; i < 20000; i++) {
    const s = `x-${i}`;
    const f = createPRNG(`${s}::roads:cadence:${npcKey}:1`);
    const r1 = f.random(); const r2 = f.random();
    if (r1 < ROADS_TUNING.JOURNEY_CHANCE && 1 + Math.floor(r2 * 51) <= 51) return s;
  }
  throw new Error('no firing seed');
}

// ── THE ESCORT REFINEMENT (settlementWeight01) ──────────────────────────────────
describe('§11b THE ESCORT REFINEMENT', () => {
  it('settlementWeight01 scales on power + influence, clamped [0.8, 1.3]', () => {
    const strong = town('S', [], { powerStructure: { factions: [{ faction: 'C', isGoverning: true, power: 100 }], publicLegitimacy: { score: 100 } } });
    const weak = town('W', [], { powerStructure: { factions: [{ faction: 'C', isGoverning: true, power: 0 }], publicLegitimacy: { score: 0 } } });
    expect(settlementWeight01(strong)).toBeCloseTo(ROADS_TUNING.SETTLEMENT_WEIGHT_BASE + 0.2 + 0.15, 5);
    expect(settlementWeight01(weak)).toBe(ROADS_TUNING.SETTLEMENT_WEIGHT_MIN);
    expect(settlementWeight01(strong)).toBeGreaterThan(settlementWeight01(weak));
    // an unreadable seat ⇒ neutral 0.5/0.5 halves.
    expect(settlementWeight01({})).toBeCloseTo(ROADS_TUNING.SETTLEMENT_WEIGHT_BASE + 0.2 * 0.5 + 0.15 * 0.5, 5);
  });
  it('a dispatched mission FREEZES escort01 = militaryQuality01(home) × settlementWeight01(home)', () => {
    // A hostile h↔t drives a reliable embassy dispatch; the escort fold is purpose-agnostic.
    const g = ensureRegionalGraph({
      edges: [{ id: 'edge.h.t', from: 'h', to: 't', relationshipType: 'hostile' }],
      channels: [{ from: 'h', to: 'x', type: 'trade_route', status: 'confirmed', strength: 0.5 }, { from: 'x', to: 't', type: 'trade_route', status: 'confirmed', strength: 0.5 }],
    });
    const home = town('Home', [envoy()]);
    const world = { rngSeed: seedThatFires('h:env'), tick: TICK, simulationRules: { roadsEnabled: true, warLayerEnabled: true }, calendar: { elapsedWeeks: 51, year: 1 }, spatialCanonVersion: 1, spatialDigest: DIGEST, relationshipStates: {} };
    const settlements = SIDS.map((id) => ({ id, name: id, settlement: id === 'h' ? home : town(id) }));
    const r = advanceRoads({ snapshot: { settlements }, worldState: world, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), saves: settlements.map((it) => ({ id: it.id, settlement: it.settlement })), graph: g, tick: TICK, now: null });
    const mission = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {})[0];
    expect(mission, 'a mission dispatched').toBeTruthy();
    const expected = militaryQuality01({ readiness01: readinessOf(home), experience01: experienceOf(home), capacityBand01: militaryCapacityScalar(home) }) * settlementWeight01(home);
    expect(mission.escort01).toBeCloseTo(expected, 6);
  });
});

// ── PURPOSE 6 DOMINION INSPECTION ────────────────────────────────────────────────
describe('§11b PURPOSE 6 DOMINION INSPECTION', () => {
  it('an occupying court sends an envoy to view a held holding (dest = the occupied settlement)', () => {
    // h occupies t (occupations[t].occupierId = h), a neutral relationship (not at war ⇒ no embassy).
    const world = worldFor({ seed: seedThatFires('h:env'), occupations: { t: { occupierId: 'h', state: 'extractive' } } });
    const r = advanceRoads(argsFor(world, [envoy()]));
    const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
    const dominion = missions.find((m) => m.purpose.kind === 'dominion');
    expect(dominion, 'a dominion inspection was dispatched').toBeTruthy();
    expect(dominion.destId, 'the inspection goes to the occupied holding').toBe('t');
  });
});

// ── PURPOSE 7 RUMOR VERIFICATION (plan + the return-side write) ───────────────────
describe('§11b PURPOSE 7 RUMOR VERIFICATION', () => {
  const lowFiRumor = { arrivalTick: TICK - 5, completeness01: 0.3, accuracy01: 0.3, content: { what: 'war', whereId: 'p', partyIds: ['p'] } };
  it('findVerifyPlan: beliefs live + a low-fidelity home rumour + a trusted source ⇒ a plan; omniscient ⇒ null', () => {
    const ws = { tick: TICK, spatialCanonVersion: 1, simulationRules: { infoMode: 'perfect_delayed' }, spatialLedgers: { rumorLedgers: { h: { 'trade:e1': lowFiRumor } } } };
    const plan = findVerifyPlan(ws, graph, 'h', [{ dest: 'x', hopWeeksOut: 1 }, { dest: 't', hopWeeksOut: 1 }], TICK);
    expect(plan, 'a verification plan was found').toBeTruthy();
    expect(plan.subject, 'the low-fidelity rumour subject').toBe('p');
    expect(['x', 't'], 'a trusted trade source').toContain(plan.dest);
    // Omniscient ⇒ beliefs dormant ⇒ no plan (byte-identical).
    expect(findVerifyPlan({ ...ws, simulationRules: {} }, graph, 'h', [{ dest: 'x', hopWeeksOut: 1 }], TICK)).toBeNull();
  });
  it('boostHomeRumorFidelity: the return raises fidelity + refreshes arrival for the subject only', () => {
    const ledgers = { h: { 'trade:e1': lowFiRumor, 'trade:e2': { arrivalTick: TICK - 2, completeness01: 0.2, content: { whereId: 'x' } } } };
    const next = boostHomeRumorFidelity(ledgers, 'h', 'p', TICK);
    expect(next, 'the ledger changed').toBeTruthy();
    expect(next.h['trade:e1'].completeness01).toBe(ROADS_TUNING.VERIFY_BOOST01);
    expect(next.h['trade:e1'].accuracy01).toBe(ROADS_TUNING.VERIFY_BOOST01);
    expect(next.h['trade:e1'].arrivalTick).toBe(TICK);
    // an unrelated subject's rumour is untouched.
    expect(next.h['trade:e2'].completeness01).toBe(0.2);
    // already-confirmed / no-subject ⇒ no change (null).
    expect(boostHomeRumorFidelity({ h: { 'trade:e1': { ...lowFiRumor, completeness01: 1, accuracy01: 1, arrivalTick: TICK } } }, 'h', 'p', TICK)).toBeNull();
  });
  it('a returning verification traveller WRITES the boost into the home rumour ledger (write g)', () => {
    const MID = 'road.h.h:env.40';
    const mission = {
      id: MID, npcKey: 'h:env', npcName: 'The Envoy', homeId: 'h', destId: 'x',
      purpose: { kind: 'verification', ref: 'p' }, phase: 'returning', path: ['h', 'x'],
      departTick: 40, legArrivalTick: 50, stayWeeks: 1, escort01: 1, riskTolerance01: 0.9,
      knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 1,
    };
    const world = worldFor({
      seed: 'verify-return', rules: { infoMode: 'perfect_delayed' },
      extraLedgers: { roads: { missions: { [MID]: mission } }, rumorLedgers: { h: { 'trade:e1': lowFiRumor } } },
    });
    const r = advanceRoads(argsFor(world, [envoy()]));
    const boosted = r.worldState?.spatialLedgers?.rumorLedgers?.h?.['trade:e1'];
    expect(boosted.completeness01, 'the home rumour was confirmed on return').toBe(ROADS_TUNING.VERIFY_BOOST01);
    expect(boosted.arrivalTick).toBe(TICK);
  });
});

// ── THE PEACE AMNESTY (bilateral, pinned both directions) ─────────────────────────
describe('§11b THE PEACE AMNESTY', () => {
  it('when peace settles, hostages EITHER side holds release the SAME tick (both directions)', () => {
    // A and B were at war; A held B's envoy, B held A's envoy. The relationship is now at peace
    // (trade_partner, no war front) ⇒ both ransoms early-release this tick.
    const ransomAB = { id: 'ransom.ab', npcKey: 'a:e', npcName: 'Ea', homeId: 'a', captorId: 'b', threatClass: 'T1', purposeKind: 'embassy', missionId: 'ab', startedTick: 1, startedWeek: 1, termWeeks: 30, remainingWeeks: 20, hostileAtCapture: true, conversionRolled: true, willConvert: false };
    const ransomBA = { id: 'ransom.ba', npcKey: 'b:e', npcName: 'Eb', homeId: 'b', captorId: 'a', threatClass: 'T1', purposeKind: 'embassy', missionId: 'ba', startedTick: 1, startedWeek: 1, termWeeks: 30, remainingWeeks: 20, hostileAtCapture: true, conversionRolled: true, willConvert: false };
    const AB = ['a', 'b', 'c', 'd'];
    const dg = (() => { const pk = makeGridPack({ cols: 6, rows: 5 }); const pl = placeSettlements(pk, AB.length); return buildSpatialDigest({ pack: pk, placements: pl.map((pp, i) => ({ id: AB[i], cellId: pp.cellId })) }); })();
    const g = ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }], channels: [{ from: 'a', to: 'b', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });
    const hostage = (id) => ({ id: 'e', name: `Envoy ${id}`, importance: 'notable', category: 'government', whereabouts: { state: 'hostage', placeId: id === 'a' ? 'b' : 'a', purposeKind: 'embassy', sinceTick: 1, expectedReturnTick: null, missionId: id === 'a' ? 'ab' : 'ba' } });
    const settle = (id) => ({ name: id, tier: 'town', economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] }, npcs: id === 'a' ? [hostage('a')] : id === 'b' ? [hostage('b')] : [] });
    const settlements = AB.map((id) => ({ id, name: id, settlement: settle(id) }));
    const world = { rngSeed: 'amnesty', tick: TICK, simulationRules: { roadsEnabled: true, warLayerEnabled: true }, calendar: { elapsedWeeks: TICK, year: 2 }, spatialCanonVersion: 1, spatialDigest: dg, relationshipStates: {}, spatialLedgers: { roads: { missions: {}, ransoms: { 'ransom.ab': ransomAB, 'ransom.ba': ransomBA } } } };
    const r = advanceRoads({ snapshot: { settlements }, worldState: world, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), saves: settlements.map((it) => ({ id: it.id, settlement: it.settlement })), graph: g, tick: TICK, now: null });
    const ransoms = r.worldState?.spatialLedgers?.roads?.ransoms || {};
    expect(Object.keys(ransoms).length, 'BOTH hostages released under the amnesty (no ransom stands)').toBe(0);
    // both are now returning home.
    const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
    const returning = missions.filter((m) => m.phase === 'returning' && m.releasedFromRansom);
    expect(returning.length, 'both released captives turn for home the same tick').toBe(2);
  });
});
