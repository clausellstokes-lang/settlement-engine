/**
 * seaRoadsLit.test.js — DEEP COUPLINGS D-6 THE LIT WALKTHROUGH (DESIGN_DEEP_COUPLINGS §10/§13).
 * Drives the roads mover (advanceRoads) with a legModes-bearing mission on a SEA hop and proves
 * the PASS-3 sea-hazard dispatch executes end-to-end: an S1 BLOCKADE capture (a hostage → the
 * EXISTING ransom machinery, captor = the blockading power), an S3 PIRACY capture (embattled port),
 * and an S2 STORM delay (never a capture — the arrival slips, no fate resolved). The roster is
 * conserved in every cell (NO-DEATH), and navalEnabled-dark leaves S2/S3 live but S1 unreachable.
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placePortSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';

// A seaLanes-bearing digest supplies the stormSeasonCost LAW (stormMultOf) for S2; the mission's
// own legModes are authoritative for overSea, so the mission's h/p/e ids need not sit in the digest.
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  return buildSpatialDigest({ pack, placements: placePortSettlements(pack, { nCoastal: 3, nRiver: 2, nInland: 3 }), seaLanes: true });
})();

/** A traveller mid-sea-hop from h to p (legModes sea), outbound, position ~0.2 into the leg. */
function seaMission() {
  return {
    id: 'road.h.h:env.90', npcKey: 'h:env', npcName: 'The Envoy', homeId: 'h', destId: 'p',
    purpose: { kind: 'diplomacy', ref: 'h~p' }, phase: 'outbound', path: ['h', 'p'], legModes: ['sea'],
    departTick: 98, legArrivalTick: 110, stayWeeks: 1, escort01: 1, riskTolerance01: 0.65,
    knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 2,
  };
}
function build(rules, extraLedgers = {}) {
  const envoy = { id: 'env', name: 'The Envoy', importance: 'notable', personality: {}, whereabouts: { state: 'traveling', placeId: 'p', purposeKind: 'diplomacy', sinceTick: 98, expectedReturnTick: 120, missionId: 'road.h.h:env.90' } };
  const mk = (id, name) => ({ id, name, settlement: { name, npcs: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } } });
  const h = mk('h', 'Home'); h.settlement.npcs = [envoy];
  const p = mk('p', 'Portcall'); const e = mk('e', 'Enemyhold');
  const saves = [h, p, e];
  const settlements = saves.map((s) => ({ id: s.id, name: s.name, settlement: s.settlement }));
  const m = seaMission();
  const worldState = { rngSeed: 's', tick: 100, simulationRules: rules, calendar: { elapsedWeeks: 100, year: 2 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { missions: { [m.id]: m } }, ...extraLedgers } };
  return { worldState, settlements, saves };
}
function run(rules, extraLedgers, seed, season) {
  const fx = build(rules, extraLedgers);
  const ws = { ...fx.worldState, rngSeed: seed || 's' };
  if (season) ws.calendar = { ...ws.calendar, season };
  return advanceRoads({ snapshot: { settlements: fx.settlements }, worldState: ws, settlementUpdates: fx.settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), saves: fx.saves, graph, tick: 100, now: null });
}
const graph = ensureRegionalGraph({ edges: [{ id: 'e.h.e', from: 'h', to: 'e', relationshipType: 'hostile' }], channels: [] });
const BLOCKADE = { navalTransit: { b1: { armyId: 'B', role: 'blockade', ownerId: 'e', targetId: 'p' } } };
const EMBATTLED_P = { embattlement: { p: { level: 0.9 } } };
const LIT = { roadsEnabled: true, seaRoadsEnabled: true, infoMode: 'full' };
const LIT_NAVAL = { ...LIT, navalEnabled: true };

const ransomsOf = (r) => Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {});
const rosterHas = (r, sid, id) => ((r.settlementUpdates || []).find((u) => u.saveId === sid)?.settlement?.npcs || []).some((n) => n.id === id);
const seedUntil = (predicate) => { for (let i = 0; i < 120; i += 1) { const out = predicate(`z${i}`); if (out) return out; } throw new Error('no seed satisfied the predicate'); };

describe('D-6 §10 lit walkthrough — the sea gauntlet', () => {
  it('S1 BLOCKADE: a hostile blockade of the destination port takes the envoy hostage → a ransom (captor = the blockader)', () => {
    const r = seedUntil((seed) => {
      const out = run(LIT_NAVAL, BLOCKADE, seed);
      const ransom = ransomsOf(out)[0];
      return ransom && ransom.captorId === 'e' ? out : null;
    });
    const ransom = ransomsOf(r)[0];
    expect(ransom.threatClass).toBe('S1');
    expect(ransom.npcKey).toBe('h:env');
    expect(rosterHas(r, 'h', 'env')).toBe(true); // NO-DEATH: the captive still exists (off-stage, not gone)
  });

  it('S3 PIRACY: an embattled port node takes the envoy → a ransom (the T3 twin at sea)', () => {
    const r = seedUntil((seed) => {
      const out = run(LIT, EMBATTLED_P, seed);
      const ransom = ransomsOf(out)[0];
      return ransom && ransom.threatClass === 'S3' ? out : null;
    });
    expect(ransomsOf(r)[0].captorId).toBe('p'); // the embattled port's seat
    expect(rosterHas(r, 'h', 'env')).toBe(true);
  });

  it('S2 STORM: a winter crossing slips the arrival (never a capture)', () => {
    const r = seedUntil((seed) => {
      const out = run(LIT, {}, seed, 'winter');
      const m = out.worldState?.spatialLedgers?.roads?.missions?.['road.h.h:env.90'];
      return m && m.legArrivalTick > 110 ? out : null; // the storm pushed the arrival back
    });
    // a storm takes no hostage and resolves no fate.
    expect(ransomsOf(r).length).toBe(0);
    const news = (r.newsEntries || []).filter((n) => Array.isArray(n.tags) && n.tags.includes('delayed'));
    expect(news.some((n) => n.tags.includes('sea'))).toBe(true);
    expect(rosterHas(r, 'h', 'env')).toBe(true);
  });

  it('NAVAL DARK: the blockade is unreachable (S1 needs the navy) — the envoy sails through', () => {
    // navalEnabled absent ⇒ S1 never fires; no embattlement/storm ⇒ no capture across many seeds.
    for (let i = 0; i < 40; i += 1) {
      const out = run({ ...LIT }, BLOCKADE, `n${i}`);
      expect(ransomsOf(out).length).toBe(0);
    }
  });
});
