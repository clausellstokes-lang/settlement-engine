/**
 * roadsMissions.test.js — THE ROADS genesis + routing + journey (R-2). The §18 R-2 done-when:
 * a 3-year lit spatial run showing journeys of every available purpose, a known-danger
 * refusal, and clean return-home; roster conservation (the NO-DEATH law); cadence ≤ 1 GENESIS
 * journey/NPC-year; dark byte-identical. DESIGN_THE_ROADS.md §4/§5/§6/§9.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { readEnvelope } from '../helpers/distributionEnvelope.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { ROADS_TUNING } from '../../src/domain/roads/state.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['s000', 's001', 's002', 's003'];

/** The one canonical home for this file's derived distribution bounds. */
const ENVELOPES = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../fixtures/distribution-envelopes.manifest.json'),
  'utf8',
));

function digestFor() {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}
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
const save = (id, name, tier) => ({ id, name, phase: 'canon', settlement: town(name, tier), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function makeCampaign(seed, lit) {
  const saves = [save('s000', 'Ashford', 'city'), save('s001', 'Briar', 'city'), save('s002', 'Corvin', 'town'), save('s003', 'Dunmoor', 'town')];
  const simulationRules = { warLayerEnabled: true, traditionsEnabled: true, ...(lit ? { roadsEnabled: true } : {}) };
  const campaign = {
    id: 'roads-missions', name: 'Roads Missions', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules, calendar: { elapsedWeeks: 5, year: 1 },
      spatialCanonVersion: 1, spatialDigest: digestFor(),
      relationshipStates: { 'edge.s000.s002': { relationshipType: 'rival', resentment: 0.55, trust: 0.24 } },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.s000.s001', from: 's000', to: 's001', relationshipType: 'trade_partner' },
        { id: 'edge.s000.s002', from: 's000', to: 's002', relationshipType: 'rival' },
        { id: 'edge.s001.s003', from: 's001', to: 's003', relationshipType: 'trade_partner' },
        { id: 'edge.s002.s003', from: 's002', to: 's003', relationshipType: 'trade_partner' },
      ],
      channels: [
        { from: 's000', to: 's001', type: 'trade_route', status: 'confirmed', strength: 0.6 },
        { from: 's000', to: 's002', type: 'trade_route', status: 'confirmed', strength: 0.5 },
        { from: 's001', to: 's003', type: 'trade_route', status: 'confirmed', strength: 0.5 },
        { from: 's002', to: 's003', type: 'trade_route', status: 'confirmed', strength: 0.5 },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

function rosterSize(saves) {
  let n = 0; const ids = new Set();
  for (const s of saves) for (const npc of (s.settlement?.npcs || [])) { n += 1; ids.add(`${s.id}:${npc.id}`); }
  return { count: n, ids };
}

describe('roads genesis — the 3-year lit run (§18 R-2 done-when)', () => {
  it('shows trade/diplomacy/observance journeys, a whereabouts mirror, clean returns, NO-DEATH for hostages, cadence <= 1 GENESIS journey/NPC-year', () => {
    let { campaign, saves } = makeCampaign('roads-3y', true);
    const initial = rosterSize(saves);
    const purposes = new Set();
    const seenMissions = new Set();
    const genesisByKeyYear = new Map(); // npcKey|year → GENESIS departures (cadence proof)
    const capturedKeys = new Set(); // every NPC roads ever took hostage (NO-DEATH tracking)
    let whereaboutsSeen = 0;
    let returnBeats = 0;
    for (let t = 0; t < 156; t++) { // 3 years @ one_week
      const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
      const missions = r.worldState?.spatialLedgers?.roads?.missions || {};
      for (const [mid, m] of Object.entries(missions)) {
        purposes.add(m.purpose.kind);
        if (!seenMissions.has(mid)) {
          seenMissions.add(mid);
          // A release-return-leg (releasedFromRansom) is the RESOLUTION of a captivity, not a
          // fresh genesis journey — the cadence law governs genesis dispatch, so it is excluded.
          // PRIOR ART: tests/property/roadsCharter.test.js's 12-year walkthrough encoded this
          // rule first (§9 is the charter's law; roadsKernel.js stamps the cadence ONLY on the
          // genesis paths). This instrument counted every mission id and therefore counted one
          // INTERRUPTED journey twice: the release path mints a NEW mission id whose startedYear
          // is the RELEASE year, so a capture that spans no year boundary reads as two departures.
          if (!m.releasedFromRansom) {
            const key = `${m.npcKey}|${m.startedYear}`;
            genesisByKeyYear.set(key, (genesisByKeyYear.get(key) || 0) + 1);
          }
        }
      }
      for (const rr of Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {})) capturedKeys.add(String(rr.npcKey));
      for (const e of (r.wizardNews?.entries || [])) {
        if (e?.impactKind === 'roads' && Array.isArray(e.tags) && e.tags.includes('return')) returnBeats += 1;
      }
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      for (const s of saves) for (const n of (s.settlement?.npcs || [])) if (n.whereabouts) whereaboutsSeen += 1;
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
    }
    // Every AVAILABLE purpose (trade, diplomacy, observance) was exercised.
    expect(purposes.has('trade'), 'trade journeys fired').toBe(true);
    expect(purposes.has('diplomacy'), 'diplomacy (rival-repair) journeys fired').toBe(true);
    expect(purposes.has('observance'), 'observance (neighbour festival) journeys fired').toBe(true);
    // The whereabouts mirror landed on travelling NPCs.
    expect(whereaboutsSeen, 'travellers carried a whereabouts mirror').toBeGreaterThan(0);
    // Journeys returned home cleanly (return beats + the mirror cleared by run-end recovery).
    expect(returnBeats, 'journeys completed with a return beat').toBeGreaterThan(0);
    // NO-DEATH: every NPC roads ever took HOSTAGE is still present in its home roster at the
    // end (roads has no removal branch — it releases/expels/converts, never kills). (The lit
    // lifecycle legitimately DIVERGES from a dark twin once a hostage is off-stage — the court
    // fills the seat, §8 — so a lit==dark roster comparison would be wrong; the deterministic
    // NO-DEATH proofs live in roadsGauntlet + roadsRansom.)
    const finalIds = rosterSize(saves).ids;
    for (const key of capturedKeys) {
      const sid = key.slice(0, key.indexOf(':'));
      const id = key.slice(key.indexOf(':') + 1);
      const present = (saves.find((s) => s.id === sid)?.settlement?.npcs || []).some((n) => String(n.id) === id);
      expect(present, `captured NPC ${key} is still in the roster (NO-DEATH)`).toBe(true);
    }
    expect(finalIds.size, 'the roster is non-empty (sanity)').toBeGreaterThan(0);
    // Cadence: no NPC made two GENESIS departures in the same year.
    for (const [key, count] of genesisByKeyYear) expect(count, `<=1 genesis journey for ${key}`).toBeLessThanOrEqual(1);
    // Infrequent by construction. The trial unit is the NPC-YEAR: the cadence assertion
    // immediately above allows at most one GENESIS departure per NPC per year, so this
    // fixture offers exactly (roster × 3) Bernoulli trials and the denominator is fixed by
    // the fixture rather than by an outcome. Pin it, so a roster change reds here instead of
    // silently re-scaling what the bounds mean.
    const floor = readEnvelope(ENVELOPES, 'roadsMissions.journeyCadence.floor');
    const ceiling = readEnvelope(ENVELOPES, 'roadsMissions.journeyCadence.ceiling');
    const npcYears = initial.count * 3;
    expect(npcYears, 'the cadence envelope is registered for this exact trial count').toBe(floor.n);
    expect(ceiling.n, 'both arms of the band share one trial count').toBe(floor.n);
    // Both bounds DERIVED from a measured 201/576 GENESIS-departure rate, not hand-picked
    // (the base rate excludes release-return legs for the same reason this count does). The
    // authored band was perNpcYear > 0.05 and < 0.9 — i.e. >= 2 and <= 32 departures of a
    // possible 36, sitting 3.7 and 6.6 sigma from the mean of 12.56. The live pair is 4 and
    // 23; this run lands on 16 (its own seed mints no release leg, so realigning the counting
    // left this fixture's number unchanged). The FLOOR is loosenPending: its own derivation is
    // the looser 3, and the program never loosens a live bound silently.
    const genesisCount = [...genesisByKeyYear.values()].reduce((a, b) => a + b, 0);
    const perNpcYear = genesisCount / npcYears;
    expect(genesisCount, `genesis-journey count below the derived cadence floor (perNpcYear ${perNpcYear})`)
      .toBeGreaterThanOrEqual(floor.bound);
    expect(genesisCount, `genesis-journey count above the derived cadence ceiling (perNpcYear ${perNpcYear})`)
      .toBeLessThanOrEqual(ceiling.bound);
  }, 120_000);

  it('dark twin: the SAME fixture with roads dark carries no roads ledger and no whereabouts', () => {
    let { campaign, saves } = makeCampaign('roads-3y', false);
    for (let t = 0; t < 60; t++) {
      const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
    }
    expect(campaign.worldState?.spatialLedgers?.roads, 'no roads ledger dark').toBeUndefined();
    let wb = 0; for (const s of saves) for (const n of (s.settlement?.npcs || [])) if (n.whereabouts) wb += 1;
    expect(wb, 'no whereabouts dark').toBe(0);
  }, 60_000);
});

// ── THE KNOWN-DANGER REFUSAL (§5) — a deterministic direct-mover proof ──
describe('roads genesis — dispatch refusal (§5): a cautious court believing the road unsafe stays home', () => {
  // A 2-settlement world: home 'h' (a merchant), destination 'd' truly embattled (level 0.9).
  // Omniscient ⇒ believed == truth ⇒ the route danger (0.9) exceeds a TIMID tolerance's
  // ceiling (0.35 × 2.0 = 0.7) ⇒ refuse; a BOLD tolerance (0.9 × 2.0 = 1.8) dispatches.
  function twoTownDigest() {
    const pack = makeGridPack({ cols: 4, rows: 3 });
    const placed = placeSettlements(pack, 2);
    return buildSpatialDigest({ pack, placements: [{ id: 'h', cellId: placed[0].cellId }, { id: 'd', cellId: placed[1].cellId }] });
  }
  const graph = ensureRegionalGraph({
    edges: [{ id: 'edge.h.d', from: 'h', to: 'd', relationshipType: 'trade_partner' }],
    channels: [{ from: 'h', to: 'd', type: 'trade_route', status: 'confirmed', strength: 0.6 }],
  });
  function worldFor(seed) {
    return {
      rngSeed: seed, tick: 1, simulationRules: { roadsEnabled: true }, // omniscient (default)
      calendar: { elapsedWeeks: 50, year: 1 }, // weekOfYear ~51 ⇒ any departWeekTarget passes
      spatialCanonVersion: 1, spatialDigest: twoTownDigest(),
      spatialLedgers: { embattlement: { d: { level: 0.9, phase: 'embattled', sinceTick: 0, lastTick: 0 } } },
    };
  }
  function argsFor(worldState, homeNpc) {
    const h = { name: 'Home', tier: 'town', npcs: [homeNpc], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } };
    const d = { name: 'Dest', tier: 'town', npcs: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] } };
    const settlements = [{ id: 'h', name: 'Home', settlement: h }, { id: 'd', name: 'Dest', settlement: d }];
    return { snapshot: { settlements }, worldState, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })), graph, tick: 1, now: null };
  }
  // Find a seed whose cadence draw fires for npcKey 'h:m' in year 1 (deterministic search).
  function seedThatFires(npcKey) {
    for (let i = 0; i < 5000; i++) {
      const seed = `refuse-${i}`;
      if (createPRNG(`${seed}::roads:cadence:${npcKey}:1`).random() < ROADS_TUNING.JOURNEY_CHANCE) return seed;
    }
    throw new Error('no firing seed found');
  }

  it('a TIMID merchant refuses the dangerous-only route (no mission; the year is spent)', () => {
    const seed = seedThatFires('h:m');
    const npc = { id: 'm', name: 'Cautious Factor', importance: 'notable', category: 'economy', personality: { flaw: 'cowardly' } };
    const r = advanceRoads(argsFor(worldFor(seed), npc));
    const roads = r.worldState?.spatialLedgers?.roads;
    expect(roads?.missions || {}, 'no mission dispatched into the believed-dangerous road').toEqual({});
    expect(roads?.cadence?.['h:m'], 'the year is spent (refusal receipt)').toBe(1);
  });

  it('a BOLD merchant dispatches onto the SAME road (proving it is the tolerance, not the geometry)', () => {
    const seed = seedThatFires('h:m');
    const npc = { id: 'm', name: 'Bold Factor', importance: 'notable', category: 'economy', personality: { dominant: 'bold' } };
    const r = advanceRoads(argsFor(worldFor(seed), npc));
    const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
    expect(missions.length, 'the bold merchant took the road').toBe(1);
    expect(missions[0].destId).toBe('d');
    expect(missions[0].knownDangerAtDispatch, 'the believed danger was recorded on the receipt').toBeGreaterThan(0.7);
  });
});
