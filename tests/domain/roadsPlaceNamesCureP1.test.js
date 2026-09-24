/**
 * roadsPlaceNamesCureP1.test.js — CURE LANE FP-P1, unit U1 (FPQ-21; FP EXPERIENCE READ 1,
 * worst sentence 1 and fault P1):
 *
 *   'An envoy of Langenmark, Tobias Lehmann, is abroad toward soak-a on ladder business.'
 *
 * The roads composer (roadsKernel.js :: advanceLitRoads) filled the {dest} and {captor}
 * tokens with settlement IDS, while the header of data/roadsProse.js promises that those
 * tokens ARE the world's names. Every settlement token the roads voice speaks now resolves
 * through the roster the composer already holds (`placeName`), and a settlement with no name
 * reads as the estate's stand-in phrase (wizardNews.js, finding-11's law), never as its id.
 *
 * The fixture's ids and names DIFFER on purpose (soak-a is Steinheim, soak-b Langenmark), so
 * one leaked id is visible in any sentence. The departure arm runs the REAL pulse, which is
 * the path that printed the read's sentence; the other arms are deterministic direct calls.
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['soak-a', 'soak-b', 'soak-c', 'soak-d'];
const NAMES = Object.freeze({ 'soak-a': 'Steinheim', 'soak-b': 'Langenmark', 'soak-c': 'Glenwick', 'soak-d': 'Invershaw' });
const ANY_ID = /soak-[a-z]/;
const STAND_IN = 'a far settlement';

const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();

/** The roads beats a result minted, as `{ tags, headline, summary }`. */
const roadsBeatsOf = (entries) => (entries || [])
  .filter((e) => e && e.impactKind === 'roads')
  .map((e) => ({ tags: e.tags || [], headline: String(e.headline), summary: String(e.summary), sourceEventId: String(e.sourceEventId || '') }));

// ── the deterministic direct-mover fixture (the roadsRansom.test.js idiom) ─────────────────
const DIRECT_GRAPH = ensureRegionalGraph({
  edges: [{ id: 'edge.soak-a.soak-b', from: 'soak-a', to: 'soak-b', relationshipType: 'trade_partner' }],
  channels: [{ from: 'soak-a', to: 'soak-b', type: 'trade_route', status: 'confirmed', strength: 0.5 }],
});
const TRAVELLER = Object.freeze({ id: 'tobias', name: 'Tobias Lehmann', importance: 'key', category: 'economy', personality: { dominant: 'bold' } });
const place = (name, npcs) => ({
  name, tier: 'town', npcs,
  economicState: { prosperity: 'Comfortable' },
  powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [{ faction: 'Council', isGoverning: true, power: 55 }] },
});
const MISSION_ID = 'road.soak-b.soak-b:tobias.90';

/** One direct roads call at week 100 over the four named settlements and a planted ledger. */
function directRoads(ledger) {
  const saves = IDS.map((id) => ({ id, settlement: place(NAMES[id], id === 'soak-b' ? [{ ...TRAVELLER }] : []) }));
  const settlements = saves.map((s) => ({ id: s.id, name: NAMES[s.id], settlement: s.settlement }));
  const worldState = {
    rngSeed: 'cure-p1-u1', tick: 100, simulationRules: { roadsEnabled: true }, calendar: { elapsedWeeks: 100, year: 2 },
    spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: ledger },
  };
  return advanceRoads({
    snapshot: { settlements }, worldState, saves, graph: DIRECT_GRAPH, tick: 100, now: null,
    settlementUpdates: settlements.map((s) => ({ saveId: s.id, settlement: s.settlement })),
  });
}
const returning = (destId) => ({
  [MISSION_ID]: {
    id: MISSION_ID, npcKey: 'soak-b:tobias', npcName: 'Tobias Lehmann', homeId: 'soak-b', destId,
    purpose: { kind: 'ladder', ref: 'expand trade house' }, phase: 'returning', path: ['soak-b', destId],
    departTick: 90, legArrivalTick: 99, stayWeeks: 1, escort01: 1, riskTolerance01: 0.65,
    knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 2,
  },
});
const ransomed = (captorId) => ({
  [`ransom.${MISSION_ID}`]: {
    id: `ransom.${MISSION_ID}`, npcKey: 'soak-b:tobias', npcName: 'Tobias Lehmann', homeId: 'soak-b', captorId,
    threatClass: 'T4', purposeKind: 'ladder', missionId: MISSION_ID, startedTick: 90, startedWeek: 90,
    termWeeks: 5, remainingWeeks: 5, hostileAtCapture: false, conversionRolled: true, willConvert: false,
  },
});

describe('CURE-P1 U1 — the roads voice names a settlement, never its id (FPQ-21)', () => {
  it('the return beat names the destination it came back from (read 1: "The road from soak-a is behind Tobias Lehmann")', () => {
    const beats = roadsBeatsOf(directRoads({ missions: returning('soak-a') }).newsEntries);
    const back = beats.find((b) => b.tags.includes('return'));
    expect(back, 'the planted returning mission mints its return beat').toBeTruthy();
    expect(back.summary, 'the destination is voiced by its NAME').toContain('Steinheim');
    expect(back.summary + back.headline, 'and the home by its name').toContain('Langenmark');
    // anchored: the two toContain arms above prove this summary is the live, interpolated return line.
    expect(back.summary, 'no settlement id reaches the sentence').not.toMatch(ANY_ID);
  });

  it('the release beat names the CAPTOR (the second id-bearing token of the same composer)', () => {
    const beats = roadsBeatsOf(directRoads({ missions: {}, ransoms: ransomed('soak-a') }).newsEntries);
    const freed = beats.find((b) => b.tags.includes('ransom'));
    expect(freed, 'the term-end release mints the ransom-paid beat').toBeTruthy();
    expect(freed.headline, 'every ransom headline names the captor, by name').toContain('Steinheim');
    expect(freed.summary, 'every ransom summary names the captor, by name').toContain('Steinheim');
    // anchored: the captor's name was found in both lines immediately above.
    expect(`${freed.headline} ${freed.summary}`).not.toMatch(ANY_ID);
  });

  it('a destination that is no longer on the roster reads as the stand-in phrase, never as its id', () => {
    const beats = roadsBeatsOf(directRoads({ missions: returning('soak-z') }).newsEntries);
    const back = beats.find((b) => b.tags.includes('return'));
    expect(back, 'the traveller still comes home from a vanished destination').toBeTruthy();
    expect(back.summary, 'the missing name falls back to a phrase').toContain(STAND_IN);
    // anchored: the stand-in phrase was found in this very summary on the line above.
    expect(back.summary, 'the vanished id never leaks').not.toContain('soak-z');
  });

  it('a razed captor reads as the stand-in phrase, and every roads line opens with a capital', () => {
    const beats = roadsBeatsOf(directRoads({ missions: {}, ransoms: ransomed('soak-z') }).newsEntries);
    const freed = beats.find((b) => b.tags.includes('ransom_captor_gone'));
    expect(freed, 'a captor gone from the roster releases the captive early').toBeTruthy();
    const both = `${freed.headline} ${freed.summary}`;
    expect(both.toLowerCase(), 'the captor is voiced as the stand-in phrase').toContain(STAND_IN);
    // anchored: the stand-in phrase was found in these very lines on the line above.
    expect(both, 'the razed captor id never leaks').not.toContain('soak-z');
    for (const line of [freed.headline, freed.summary]) {
      expect(line.charAt(0), `a sentence opens with a capital: "${line}"`).toBe(line.charAt(0).toUpperCase());
    }
  });
});

// ── the REAL pulse: the departure beat, the read's own sentence shape ───────────────────────
function town(name, tier) {
  return {
    name, tier, population: tier === 'city' ? 9000 : 3000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', terrainType: 'plains', culture: 'lowland' },
    institutions: [{ name: 'Town hall', required: true, category: 'civic', status: 'active' }, { name: 'Market', category: 'trade' }],
    economicState: { prosperity: 'Comfortable', primaryExports: [], incomeSources: ['Trade tariffs'] },
    powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [{ faction: 'Council', category: 'civic', power: 55, isGoverning: true }], conflicts: [] },
    calamityHistory: [], activeConditions: [],
    npcs: [
      { id: `${name}_seat`, name: `Lord ${name}`, importance: 'pillar', category: 'government', personality: { dominant: 'cautious', flaw: 'prideful' } },
      { id: `${name}_env`, name: `Envoy ${name}`, importance: 'notable', category: 'government', personality: { dominant: 'bold' } },
      { id: `${name}_mer`, name: `Factor ${name}`, importance: 'key', category: 'economy', personality: { dominant: 'calculating', flaw: 'greedy' } },
    ],
  };
}
const save = (id, tier) => ({ id, name: NAMES[id], phase: 'canon', settlement: town(NAMES[id], tier), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function namedCampaign() {
  const saves = [save('soak-a', 'city'), save('soak-b', 'city'), save('soak-c', 'town'), save('soak-d', 'town')];
  const campaign = {
    id: 'cure-p1-u1', name: 'Cure P1 U1', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'cure-p1-u1', tick: 1, simulationRules: { warLayerEnabled: true, traditionsEnabled: true, roadsEnabled: true },
      calendar: { elapsedWeeks: 5, year: 1 }, spatialCanonVersion: 1, spatialDigest: DIGEST,
      relationshipStates: { 'edge.soak-a.soak-c': { relationshipType: 'rival', resentment: 0.55, trust: 0.24 } }, stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.soak-a.soak-b', from: 'soak-a', to: 'soak-b', relationshipType: 'trade_partner' },
        { id: 'edge.soak-a.soak-c', from: 'soak-a', to: 'soak-c', relationshipType: 'rival' },
        { id: 'edge.soak-b.soak-d', from: 'soak-b', to: 'soak-d', relationshipType: 'trade_partner' },
        { id: 'edge.soak-c.soak-d', from: 'soak-c', to: 'soak-d', relationshipType: 'trade_partner' },
      ],
      channels: [
        { from: 'soak-a', to: 'soak-b', type: 'trade_route', status: 'confirmed', strength: 0.6 },
        { from: 'soak-a', to: 'soak-c', type: 'trade_route', status: 'confirmed', strength: 0.5 },
        { from: 'soak-b', to: 'soak-d', type: 'trade_route', status: 'confirmed', strength: 0.5 },
        { from: 'soak-c', to: 'soak-d', type: 'trade_route', status: 'confirmed', strength: 0.5 },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

describe('CURE-P1 U1 — the departure beat through the real pulse (the read\'s sentence)', () => {
  it('a journey sets out toward a destination named in words, and no roads line carries an id', () => {
    let { campaign, saves } = namedCampaign();
    /** @type {Array<{ tags: string[], headline: string, summary: string, sourceEventId: string }>} */
    const seen = [];
    let departure = null;
    let destName = '';
    for (let t = 0; t < 104 && !departure; t += 1) {
      const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
      const beats = roadsBeatsOf(r.wizardNews?.entries).filter((b) => !seen.some((s) => s.sourceEventId === b.sourceEventId));
      seen.push(...beats);
      const missions = r.worldState?.spatialLedgers?.roads?.missions || {};
      for (const b of beats) {
        const mid = b.sourceEventId.replace(/^(?:embassy-)?depart\./, '');
        if (b.tags.some((tag) => tag === 'departure' || tag === 'embassy_departure') && missions[mid]) {
          departure = b;
          destName = NAMES[missions[mid].destId];
          break;
        }
      }
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews || campaign.wizardNews };
    }
    expect(departure, 'a journey departed within two years of the lit run').toBeTruthy();
    expect(destName, 'the departed mission names a roster destination').toBeTruthy();
    expect(departure.headline, 'the departure headline names the destination').toContain(destName);
    expect(departure.summary, 'the departure summary names the destination').toContain(destName);
    const leaked = seen.filter((b) => ANY_ID.test(`${b.headline} ${b.summary}`)).map((b) => `${b.headline} | ${b.summary}`);
    expect(seen.length, 'the run minted roads beats to inspect').toBeGreaterThan(0);
    // anchored: seen.length > 0 on the line above, so this is a selection over live roads lines.
    expect(leaked, 'no roads line of the whole run voices a settlement id').toEqual([]);
  });
});
