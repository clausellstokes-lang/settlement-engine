/**
 * roadsRecall.test.js — THE RECALL RIDER (DESIGN_VISION_WAVE V-24a). The pure op body
 * (applyRoadsRecall / isRoadsTraveler) + the mover's consumption of the whereabouts.recall
 * marker: a DM recall engages a traveller's return leg EARLY — a sanctioned early return, never
 * a teleport (a proper 'returning' leg with a future arrival) and never a new mover (the
 * existing mission IS the traveller). Dormancy: a recall marker in a dark-roads world is inert
 * (byte-identical), exactly as the party-hand marker is.
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { applyRoadsRecall, isRoadsTraveler, RECALLABLE_STATES } from '../../src/domain/roads/ops.js';

const IDS = ['h', 'e'];
const MID = 'road.h.h:m.90';
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'edge.h.e', from: 'h', to: 'e', relationshipType: 'trade_partner' }], channels: [{ from: 'h', to: 'e', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });

// whereabouts.state for a given mission phase (outbound mirrors as 'traveling').
const WA_STATE = { outbound: 'traveling', visiting: 'visiting', returning: 'returning' };

const traveler = (waState, extra = {}) => ({
  id: 'm', name: 'The Envoy', importance: 'key', category: 'economy', personality: { dominant: 'bold' },
  whereabouts: { state: waState, placeId: 'e', purposeKind: 'diplomacy', sinceTick: 90, expectedReturnTick: 120, missionId: MID, ...extra },
});
const settlement = (name, npcs, prosperity = 'Comfortable', legit = 55) => ({ name, tier: 'town', npcs, economicState: { prosperity }, powerStructure: { publicLegitimacy: { score: legit, label: 'Accepted' }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] } });
const missionRec = (phase, over = {}) => ({
  id: MID, npcKey: 'h:m', npcName: 'The Envoy', homeId: 'h', destId: 'e',
  purpose: { kind: 'diplomacy', ref: '' }, phase, path: ['h', 'e'],
  departTick: 90, legArrivalTick: phase === 'returning' ? 130 : 110, stayWeeks: 2,
  escort01: 1, riskTolerance01: 0.65, knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 1, ...over,
});

// A direct-mover call at week 100 (before the mission's natural transition) — so the ONLY force
// that can turn the traveller homeward is the recall marker on the npc's whereabouts.
function directRecall(phase, { recall = true, roadsEnabled = true } = {}) {
  const h = settlement('Home', [traveler(WA_STATE[phase], recall ? { recall: true } : {})]);
  const e = settlement('Waypoint', []);
  const saves = [{ id: 'h', settlement: h }, { id: 'e', settlement: e }];
  const settlementUpdates = [{ saveId: 'h', settlement: h }, { saveId: 'e', settlement: e }];
  const snapshot = { settlements: [{ id: 'h', name: 'Home', settlement: h }, { id: 'e', name: 'Waypoint', settlement: e }] };
  const worldState = {
    rngSeed: 's', tick: 100, simulationRules: roadsEnabled ? { roadsEnabled: true } : {}, calendar: { elapsedWeeks: 100, year: 2 },
    spatialCanonVersion: 1, spatialDigest: DIGEST,
    spatialLedgers: { roads: { missions: { [MID]: missionRec(phase) } } },
  };
  return { worldState, out: advanceRoads({ snapshot, worldState, settlementUpdates, saves, graph, tick: 100, now: null }) };
}
const roadsOf = (r) => r.worldState?.spatialLedgers?.roads || {};
const missionOf = (r) => Object.values(roadsOf(r).missions || {})[0] || {};
const upd = (r, id) => r.settlementUpdates.find((u) => u.saveId === id).settlement;

// ── THE PURE OP BODY ────────────────────────────────────────────────────────────
describe('roads recall op — pure body (V-24a)', () => {
  const travelerS = (waState) => ({ npcs: [traveler(waState)] });
  it('applyRoadsRecall stamps whereabouts.recall on an outbound or visiting traveller', () => {
    const r = applyRoadsRecall(travelerS('traveling'), 0);
    expect(r.ok).toBe(true);
    expect(r.settlement.npcs[0].whereabouts.recall).toBe(true);
    const r2 = applyRoadsRecall(travelerS('visiting'), 0);
    expect(r2.ok).toBe(true);
    expect(r2.settlement.npcs[0].whereabouts.recall).toBe(true);
  });
  it('refuses a returning traveller, a hostage, a non-traveller, and a bad index (no mutation)', () => {
    expect(applyRoadsRecall(travelerS('returning'), 0).ok).toBe(false);
    expect(applyRoadsRecall({ npcs: [{ id: 'x', name: 'Homebody' }] }, 0).ok).toBe(false);
    expect(applyRoadsRecall({ npcs: [{ id: 'c', whereabouts: { state: 'hostage' } }] }, 0).ok).toBe(false);
    expect(applyRoadsRecall(travelerS('traveling'), 9).ok).toBe(false);
    // input never mutated (a NEW settlement is returned on success only)
    const before = travelerS('returning'); applyRoadsRecall(before, 0);
    expect(before.npcs[0].whereabouts.recall).toBeUndefined();
  });
  it('isRoadsTraveler / RECALLABLE_STATES', () => {
    expect(isRoadsTraveler(traveler('traveling'))).toBe(true);
    expect(isRoadsTraveler(traveler('visiting'))).toBe(true);
    expect(isRoadsTraveler(traveler('returning'))).toBe(false);
    expect(isRoadsTraveler({ whereabouts: { state: 'hostage' } })).toBe(false);
    expect(isRoadsTraveler({ id: 'x' })).toBe(false);
    expect(RECALLABLE_STATES).toEqual(['traveling', 'visiting']);
  });
});

// ── THE MOVER CONSUMPTION ─────────────────────────────────────────────────────────
describe('roads recall op — the mover engages the return leg early (V-24a)', () => {
  it('outbound + recall ⇒ a returning leg is born, never a teleport (arrival in the future), marked recalled', () => {
    const { out } = directRecall('outbound');
    const m = missionOf({ worldState: out.worldState });
    expect(m.phase, 'the traveller turns homeward').toBe('returning');
    expect(m.recalled, 'the sanctioned early-return flag').toBe(true);
    expect(m.legArrivalTick, 'never teleports — a real future arrival').toBeGreaterThan(100);
  });

  it('visiting + recall ⇒ leaves the destination for home early (returning), marked recalled', () => {
    const { out } = directRecall('visiting');
    const m = missionOf({ worldState: out.worldState });
    expect(m.phase).toBe('returning');
    expect(m.recalled).toBe(true);
    expect(m.legArrivalTick).toBeGreaterThan(100);
  });

  it('a recalled traveller shows whereabouts=returning in the mirror update, the marker self-cleared', () => {
    const { out } = directRecall('outbound');
    const npc = upd({ settlementUpdates: out.settlementUpdates }, 'h').npcs.find((n) => n.id === 'm');
    expect(npc.whereabouts.state, 'now returning').toBe('returning');
    expect(npc.whereabouts.recall, 'the marker is cleared by the mirror pass').toBeUndefined();
  });

  it('returning + recall ⇒ no-op: already homeward, the marker changes nothing (no recalled flag)', () => {
    const { out } = directRecall('returning');
    const m = missionOf({ worldState: out.worldState });
    expect(m.phase).toBe('returning');
    expect(m.recalled).toBeUndefined();
  });

  it('outbound + NO recall ⇒ the mission stays outbound (the marker is the only early-return cause)', () => {
    const { out } = directRecall('outbound', { recall: false });
    const m = missionOf({ worldState: out.worldState });
    expect(m.phase).toBe('outbound');
    expect(m.recalled).toBeUndefined();
  });
});

// ── DORMANCY: a recall marker in a dark-roads world is inert (byte-identical) ──────
describe('roads recall op — dormancy (V-24a)', () => {
  it('roads dark ⇒ the mover is a total no-op even with a recall marker present', () => {
    const { worldState, out } = directRecall('outbound', { roadsEnabled: false });
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(worldState); // same reference — nothing recorded
  });
});
