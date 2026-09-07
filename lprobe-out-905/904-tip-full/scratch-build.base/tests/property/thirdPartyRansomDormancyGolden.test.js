/**
 * thirdPartyRansomDormancyGolden.test.js — DEEP COUPLINGS D-5 DORMANCY (DESIGN_DEEP_COUPLINGS
 * §1 law 2 / §13). The virtual flag `thirdPartyRansomEnabled` is ABSENT from
 * DEFAULT_SIMULATION_RULES, so a ROADS-LIT world with a ransom in flight behaves EXACTLY as
 * folded-roads does: the half-term checkpoint never fires, no payer fields are stamped, and the
 * two deposit ledgers (roadsRansomSettlements / roadsBondEvents) never appear.
 *
 * Three blocks (the traditions-dormancy idiom): (a) the DORMANCY CONTRACT — no third-party ledger
 * key, no third-party record field; (b) BYTE-IDENTICAL determinism — two dark runs hash-equal;
 * (c) LIT ANTI-VACUITY — the SAME fixture with the flag lit DOES produce a third-party artifact
 * (so the dark proof is not vacuous).
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';

const IDS = ['h', 'c', 'p'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 6, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'e.h.p', from: 'h', to: 'p', relationshipType: 'ally' }, { id: 'e.h.c', from: 'h', to: 'c', relationshipType: 'neutral' }], channels: [] });

function build(rules) {
  const captive = { id: 'cap', name: 'The Captive', importance: 'pillar', personality: { dominant: 'pragmatic' }, whereabouts: { state: 'hostage', placeId: 'c', purposeKind: 'trade', sinceTick: 90, expectedReturnTick: null, missionId: 'road.h.h:cap.90' } };
  const ransom = { id: 'ransom.road.h.h:cap.90', npcKey: 'h:cap', npcName: 'The Captive', homeId: 'h', captorId: 'c', threatClass: 'T3', purposeKind: 'trade', missionId: 'road.h.h:cap.90', startedTick: 90, startedWeek: 90, termWeeks: 20, remainingWeeks: 20, hostileAtCapture: false, conversionRolled: true, willConvert: false };
  const mk = (id, name, factions = []) => ({ id, name, settlement: { name, npcs: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions } } });
  const h = mk('h', 'Home'); h.settlement.npcs = [captive];
  const c = mk('c', 'Captorhold');
  const p = mk('p', 'Payerton');
  const saves = [h, c, p];
  const settlements = saves.map((s) => ({ id: s.id, name: s.name, settlement: s.settlement }));
  const worldState = { rngSeed: 's', tick: 100, simulationRules: rules, calendar: { elapsedWeeks: 100, year: 2 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { ransoms: { [ransom.id]: ransom } } } };
  return { worldState, settlements, saves };
}
function run(rules) {
  const fx = build(rules);
  return advanceRoads({ snapshot: { settlements: fx.settlements }, worldState: fx.worldState, settlementUpdates: fx.settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), saves: fx.saves, graph, tick: 100, now: null });
}
const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

const DARK = { roadsEnabled: true, infoMode: 'full' }; // thirdPartyRansomEnabled ABSENT
const LIT = { roadsEnabled: true, thirdPartyRansomEnabled: true, infoMode: 'full' };

describe('D-5 thirdPartyRansomDormancy', () => {
  it('(a) CONTRACT: dark ⇒ no third-party ledger key, no payer field on the carried ransom', () => {
    const r = run(DARK);
    const led = r.worldState?.spatialLedgers || {};
    expect(led.roadsRansomSettlements).toBeUndefined();
    expect(led.roadsBondEvents).toBeUndefined();
    const rec = Object.values(led.roads?.ransoms || {})[0];
    expect(rec, 'the ransom still stands (half-term, dark)').toBeTruthy();
    expect(rec.thirdPartyResolved).toBeUndefined();
    expect(rec.payerId).toBeUndefined();
    expect(rec.payerMotive).toBeUndefined();
    expect(rec.remainingWeeks).toBe(10); // it simply ticked down — roads-only behavior
  });

  it('(b) BYTE-IDENTICAL: two dark runs hash-equal (deterministic dormancy)', () => {
    expect(sha(run(DARK).worldState.spatialLedgers)).toBe(sha(run(DARK).worldState.spatialLedgers));
  });

  it('(c) ANTI-VACUITY: the SAME fixture LIT produces a third-party artifact (dark is not vacuous)', () => {
    const r = run(LIT);
    const led = r.worldState?.spatialLedgers || {};
    const settled = led.roadsRansomSettlements && Object.keys(led.roadsRansomSettlements).length;
    const stamped = Object.values(led.roads?.ransoms || {}).some((x) => x.thirdPartyResolved === true);
    expect(settled || stamped, 'lit ⇒ either a settlement deposit or a thirdPartyResolved stamp appears').toBeTruthy();
    // and the lit ledger set DIFFERS from the dark one (the coupling is observable).
    expect(sha(led)).not.toBe(sha(run(DARK).worldState.spatialLedgers));
  });
});
