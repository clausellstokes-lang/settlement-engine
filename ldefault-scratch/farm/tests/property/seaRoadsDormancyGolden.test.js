/**
 * seaRoadsDormancyGolden.test.js — DEEP COUPLINGS D-6 DORMANCY (DESIGN_DEEP_COUPLINGS §1 law 2 /
 * §10 / §13). The virtual flag `seaRoadsEnabled` is ABSENT from DEFAULT_SIMULATION_RULES, so a
 * folded-roads world behaves EXACTLY as before: no leg is classified, no sea hazard is dispatched,
 * and a blockade/storm over a water hop is INVISIBLE to the roads mover (the existing sea-aware
 * ROUTING is unchanged — only the new machinery gates).
 *
 * Three blocks: (a) CONTRACT — dark + a hostile blockade of the destination port ⇒ no capture, no
 * delay; (b) BYTE-IDENTICAL — the dark roads ledger with the blockade EQUALS the dark ledger
 * WITHOUT it (the blockade never touches roads state); (c) ANTI-VACUITY — the same fixture LIT can
 * capture (so the dark proof is not vacuous).
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';

const IDS = ['h', 'p', 'e'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 6, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((pl, i) => ({ id: IDS[i], cellId: pl.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'e.h.e', from: 'h', to: 'e', relationshipType: 'hostile' }], channels: [] });
const BLOCKADE = { navalTransit: { b1: { armyId: 'B', role: 'blockade', ownerId: 'e', targetId: 'p' } } };

function run(rules, extraLedgers, seed) {
  const envoy = { id: 'env', name: 'The Envoy', importance: 'notable', personality: {}, whereabouts: { state: 'traveling', placeId: 'p', purposeKind: 'diplomacy', sinceTick: 98, expectedReturnTick: 120, missionId: 'road.h.h:env.90' } };
  const mk = (id, name) => ({ id, name, settlement: { name, npcs: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } } });
  const h = mk('h', 'Home'); h.settlement.npcs = [envoy];
  const saves = [h, mk('p', 'Portcall'), mk('e', 'Enemyhold')];
  const settlements = saves.map((s) => ({ id: s.id, name: s.name, settlement: s.settlement }));
  const m = { id: 'road.h.h:env.90', npcKey: 'h:env', npcName: 'The Envoy', homeId: 'h', destId: 'p', purpose: { kind: 'diplomacy', ref: 'h~p' }, phase: 'outbound', path: ['h', 'p'], legModes: ['sea'], departTick: 98, legArrivalTick: 110, stayWeeks: 1, escort01: 1, riskTolerance01: 0.65, knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 2 };
  const worldState = { rngSeed: seed || 's', tick: 100, simulationRules: rules, calendar: { elapsedWeeks: 100, year: 2 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { missions: { [m.id]: m } }, ...extraLedgers } };
  return advanceRoads({ snapshot: { settlements }, worldState, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), saves, graph, tick: 100, now: null });
}
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ransomsOf = (r) => Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {});

const DARK = { roadsEnabled: true, navalEnabled: true, infoMode: 'full' }; // seaRoadsEnabled ABSENT
const LIT = { ...DARK, seaRoadsEnabled: true };

describe('D-6 seaRoadsDormancy', () => {
  it('(a) CONTRACT: dark + a hostile blockade ⇒ no capture, the arrival is unchanged', () => {
    const r = run(DARK, BLOCKADE);
    expect(ransomsOf(r).length).toBe(0);
    const m = r.worldState?.spatialLedgers?.roads?.missions?.['road.h.h:env.90'];
    expect(m.legArrivalTick).toBe(110); // no storm/blockade delay under a dark flag
  });

  it('(b) BYTE-IDENTICAL: the dark roads ledger is the SAME with or without the blockade', () => {
    expect(sha(run(DARK, BLOCKADE).worldState.spatialLedgers.roads)).toBe(sha(run(DARK, {}).worldState.spatialLedgers.roads));
  });

  it('(c) ANTI-VACUITY: the SAME fixture LIT can take the envoy (dark is not vacuous)', () => {
    let captured = false;
    for (let i = 0; i < 120 && !captured; i += 1) captured = ransomsOf(run(LIT, BLOCKADE, `z${i}`)).length > 0;
    expect(captured, 'lit ⇒ the blockade eventually captures').toBe(true);
  });
});
