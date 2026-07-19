/**
 * roadsConversion.test.js — THE RETURNED-CAPTIVE CONVERSION CHANNEL (R-4c; DESIGN_THE_ROADS.md
 * §10). At release the roads mover deposits a returned-captive channel (web LIT only); the
 * EXISTING corruption web consumes it through its OWN gates, PINNED to the returned captive,
 * COVERT (no news). Web dark ⇒ no channel ⇒ no conversion.
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { advanceCorruptionWeb, rawChannelQuality, CORRUPTION_WEB_TUNING } from '../../src/domain/worldPulse/corruptionWeb.js';
import { createPRNG } from '../../src/kernel/prng.js';

const IDS = ['h', 'c'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'edge.h.c', from: 'h', to: 'c', relationshipType: 'trade_partner' }], channels: [{ from: 'h', to: 'c', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });
const WEB_LIT = { roadsEnabled: true, infoMode: 'full', corruptionWebEnabled: true };
const WEB_DARK = { roadsEnabled: true, infoMode: 'full' }; // corruptionWebEnabled absent ⇒ web dormant

describe('§10 rawChannelQuality — a returned-captive pair boosts the channel', () => {
  it('no channel ⇒ 0; a returned-captive pair ⇒ CHANNEL_RETURNED_CAPTIVE', () => {
    const snap = { regionalGraph: { edges: [], channels: [] } };
    expect(rawChannelQuality(snap, new Set(), 'c', 'h')).toBe(0);
    expect(rawChannelQuality(snap, new Set(), 'c', 'h', new Set(['c|h']))).toBeCloseTo(CORRUPTION_WEB_TUNING.CHANNEL_RETURNED_CAPTIVE, 6);
  });
});

describe('§10 the roads deposit — gated on the web being LIT', () => {
  // A released captive ('h:cap', willConvert) arriving home this tick.
  const captive = () => ({ id: 'cap', name: 'The Captive', importance: 'notable', personality: { flaw: 'greedy' }, whereabouts: { state: 'returning', placeId: 'c', purposeKind: 'trade', sinceTick: 98, expectedReturnTick: 100, missionId: 'road.h.h:cap.90' } });
  const mission = { id: 'road.h.h:cap.90', npcKey: 'h:cap', npcName: 'The Captive', homeId: 'h', destId: 'c', purpose: { kind: 'trade', ref: '' }, phase: 'returning', path: ['c', 'h'], departTick: 98, legArrivalTick: 100, stayWeeks: 0, escort01: 1, riskTolerance01: 0.65, knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 2, releasedFromRansom: true, willConvert: true, captorId: 'c' };
  function run(rules) {
    const h = { id: 'h', settlement: { name: 'Home', npcs: [captive()], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } } };
    const c = { id: 'c', settlement: { name: 'Captorhold', npcs: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } } };
    const worldState = { rngSeed: 's', tick: 100, simulationRules: rules, calendar: { elapsedWeeks: 100, year: 2 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { missions: { [mission.id]: mission } } } };
    const settlements = [{ id: 'h', name: 'Home', settlement: h.settlement }, { id: 'c', name: 'Captorhold', settlement: c.settlement }];
    return advanceRoads({ snapshot: { settlements }, worldState, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), saves: [h, c], graph, tick: 100, now: null });
  }
  it('web LIT ⇒ the returned-captive channel is deposited (captor→home, npcKey pinned)', () => {
    const r = run(WEB_LIT);
    const chans = r.worldState?.spatialLedgers?.roadsReturnedCaptives || {};
    const rec = Object.values(chans)[0];
    expect(rec, 'a returned-captive channel was deposited').toBeTruthy();
    expect(rec.captorId).toBe('c');
    expect(rec.homeId).toBe('h');
    expect(rec.npcKey).toBe('h:cap');
    // COVERT: the conversion itself emits NO news.
    expect((r.newsEntries || []).some((e) => Array.isArray(e.tags) && e.tags.includes('conversion')), 'conversion is covert (no news)').toBe(false);
  });
  it('web DARK ⇒ NO channel deposited (the release resolves clean, §10 gating)', () => {
    const r = run(WEB_DARK);
    expect(r.worldState?.spatialLedgers?.roadsReturnedCaptives, 'no channel when the web is dark').toBeUndefined();
  });
});

describe('§10 the web consumes the channel — PINNED to the returned captive, COVERT', () => {
  it('the web mints the returned captive (a notable) over a higher-importance pillar, no news', () => {
    // Home 'h' has TWO corruptible NPCs: the returned captive 'cap' (notable) and 'other' (pillar,
    // normally the higher-importance default pick). The §10 pin must override importance.
    const capNpc = { id: 'cap', name: 'Cap', importance: 'notable', personality: { flaw: 'greedy' } };
    const otherNpc = { id: 'other', name: 'Other', importance: 'pillar', personality: { flaw: 'greedy' } };
    const h = { id: 'h', settlement: { id: 'h', name: 'Home', npcs: [capNpc, otherNpc], institutions: [], powerStructure: { factions: [] } } };
    const c = { id: 'c', settlement: { id: 'c', name: 'Captor', npcs: [], institutions: [], powerStructure: { factions: [] } } };
    const settlements = [h, c];
    const byId = new Map(settlements.map((s) => [s.id, s]));
    const snapshot = { settlements, byId, regionalGraph: { edges: [], channels: [] } };
    let worldState = {
      spatialCanonVersion: 1, simulationRules: { infoMode: 'full', corruptionWebEnabled: true },
      npcStates: { 'h:cap': { corruption: false }, 'h:other': { corruption: false } },
      spatialLedgers: { roadsReturnedCaptives: { 'c|h|h:cap': { captorId: 'c', homeId: 'h', npcKey: 'h:cap', tick: 100 } } },
    };
    let minted = null; let anyNews = false;
    for (let t = 0; t < 400 && !minted; t++) {
      const r = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG(`conv-${t}`), tick: 100 + t, nameFor: (id) => String(id) });
      if (Array.isArray(r.newsEntries) && r.newsEntries.length) anyNews = true;
      if (r.changed) { worldState = r.worldState; minted = worldState.npcStates; }
    }
    expect(minted, 'the web minted an asset from the channel').toBeTruthy();
    // THE PIN: the returned captive 'h:cap' is the asset — NOT the higher-importance 'h:other'.
    expect(minted['h:cap'].corruption, 'the returned captive was turned').toBe(true);
    expect(minted['h:cap'].corruptionLeash.settlementId, 'the captor is the patron').toBe('c');
    expect(minted['h:other'].corruption, 'the pillar was NOT picked (the pin overrode importance)').toBe(false);
    // COVERT: no news at any point.
    expect(anyNews, 'the conversion mints covertly (no news)').toBe(false);
  });

  it('web DARK ⇒ the channel is inert (no mint)', () => {
    const capNpc = { id: 'cap', name: 'Cap', importance: 'notable', personality: { flaw: 'greedy' } };
    const h = { id: 'h', settlement: { id: 'h', name: 'Home', npcs: [capNpc], institutions: [], powerStructure: { factions: [] } } };
    const c = { id: 'c', settlement: { id: 'c', name: 'Captor', npcs: [], institutions: [], powerStructure: { factions: [] } } };
    const settlements = [h, c];
    const snapshot = { settlements, byId: new Map(settlements.map((s) => [s.id, s])), regionalGraph: { edges: [], channels: [] } };
    const worldState = {
      spatialCanonVersion: 1, simulationRules: { infoMode: 'full' }, // corruptionWebEnabled absent
      npcStates: { 'h:cap': { corruption: false } },
      spatialLedgers: { roadsReturnedCaptives: { 'c|h|h:cap': { captorId: 'c', homeId: 'h', npcKey: 'h:cap', tick: 100 } } },
    };
    const r = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('x'), tick: 100, nameFor: (id) => String(id) });
    expect(r.changed, 'web dark ⇒ no mint').toBe(false);
  });
});
