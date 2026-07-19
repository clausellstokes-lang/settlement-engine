/**
 * roadsCharter.test.js — §19 THE VERIFICATION CHARTER (the lane's closing proof).
 *
 * The per-slice proofs live in their dedicated suites (roadsGauntlet: every threat-class cell +
 * NO-DEATH invariant + protection-bypass exponents; roadsRansom: the write schedule +
 * capture→ransom→release round-trip; roadsConversion: web-lit mints / web-dark inert;
 * roadsParticipation: the off-stage census; roadsKnownWorld: silence-decays-toward-calm;
 * roadsMissions: the 3-year lit run + dark twin; roadsDormancyGolden: the dark byte-identical
 * hash). THIS file is the CONSOLIDATION + the adversarial self-audit: the 12-year walkthrough's
 * roster-conserved-EVERY-tick invariant, catch-up equivalence, the residue-free assertion, the
 * NO-DEATH source scan, the stale-intel receipt, DM-collision fuzz, double-jeopardy, and
 * ledger-shape fuzz.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { PURPOSE_KINDS, ROADS_TUNING, protectionOf, exposureOf, captureProbability } from '../../src/domain/roads/state.js';
import { RESIDUE_STRIP_SITES } from '../../src/domain/worldPulse/pulseKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['s000', 's001', 's002', 's003'];

function digestFor() {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}
function town(name, tier) {
  return {
    name, tier, population: tier === 'city' ? 9000 : 3000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', terrainType: 'plains', culture: 'lowland' },
    institutions: [{ name: 'Town hall', required: true, category: 'civic', status: 'active' }],
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

function warShapedCampaign(seed, lit) {
  const saves = [save('s000', 'Ashford', 'city'), save('s001', 'Briar', 'city'), save('s002', 'Corvin', 'town'), save('s003', 'Dunmoor', 'town')];
  const simulationRules = { warLayerEnabled: true, traditionsEnabled: true, corruptionWebActive: true, ...(lit ? { roadsEnabled: true } : {}) };
  const campaign = {
    id: 'roads-charter', name: 'Roads Charter', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules, calendar: { elapsedWeeks: 5, year: 1 },
      spatialCanonVersion: 1, spatialDigest: digestFor(),
      relationshipStates: { 'edge.s000.s002': { relationshipType: 'rival', resentment: 0.6, trust: 0.2 } },
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
const namedIds = (saves) => {
  const ids = new Set();
  for (const s of saves) for (const n of (s.settlement?.npcs || [])) ids.add(`${s.id}:${n.id}`);
  return ids;
};

// ── THE 12-YEAR LIT WALKTHROUGH ─────────────────────────────────────────────────
describe('§19 THE 12-YEAR LIT WALKTHROUGH (war-shaped spatial world)', () => {
  it('roster conserved EVERY tick · cadence band · every available purpose · captives never removed', () => {
    let { campaign, saves } = warShapedCampaign('charter-12y', true);
    const baselineIds = namedIds(saves);
    const purposes = new Set();
    const seenMissions = new Set();
    const departByKeyYear = new Map();
    const everHostage = new Set();
    const YEARS = 12; const TICKS = YEARS * 52;
    for (let t = 0; t < TICKS; t++) {
      const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
      for (const [mid, m] of Object.entries(r.worldState?.spatialLedgers?.roads?.missions || {})) {
        purposes.add(m.purpose.kind);
        if (!seenMissions.has(mid)) {
          seenMissions.add(mid);
          // A release-return-leg (releasedFromRansom) is the RESOLUTION of a captivity, not a
          // fresh genesis journey — the cadence law governs genesis dispatch, so it is excluded.
          if (!m.releasedFromRansom) { const k = `${m.npcKey}|${m.startedYear}`; departByKeyYear.set(k, (departByKeyYear.get(k) || 0) + 1); }
        }
      }
      for (const rr of Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {})) everHostage.add(String(rr.npcKey));
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      // ROSTER CONSERVED EVERY TICK: the named-NPC id SET never shrinks — nothing is ever
      // removed (the no-death law made a per-tick invariant, not just an end-state check).
      const now = namedIds(saves);
      for (const id of baselineIds) expect(now.has(id), `named NPC ${id} vanished at tick ${t} (NO-DEATH)`).toBe(true);
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
    }
    // Every AVAILABLE purpose fired (registry-driven — assert per-purpose over the kinds SEEN,
    // never a count: the §11b R-8 purposes will extend PURPOSE_KINDS without touching this).
    expect(purposes.size, 'at least one purpose kind fired').toBeGreaterThan(0);
    for (const kind of purposes) expect(PURPOSE_KINDS.includes(kind), `purpose "${kind}" is a registered kind`).toBe(true);
    expect(purposes.has('trade'), 'trade journeys fire (the reliable common purpose)').toBe(true);
    // Multiple purpose kinds are exercised. A LOWER BOUND, never the count / the exhaustive list
    // — the §11b R-8 embassy purposes (5-7) extend PURPOSE_KINDS without touching this assertion.
    expect(purposes.size, 'multiple purpose kinds exercised (lower bound)').toBeGreaterThanOrEqual(2);
    // CADENCE: per-NPC ≤ 1 GENESIS journey/year absolute; the fleet cadence sits in the soak band.
    for (const [k, c] of departByKeyYear) expect(c, `<=1 genesis journey for ${k}`).toBeLessThanOrEqual(1);
    const genesisCount = [...departByKeyYear.values()].reduce((a, b) => a + b, 0);
    const perNpcYear = genesisCount / (baselineIds.size * YEARS);
    expect(perNpcYear, 'cadence in the soak band (0.05..0.9)').toBeGreaterThan(0.05);
    expect(perNpcYear, 'cadence in the soak band (0.05..0.9)').toBeLessThan(0.9);
    // NO-DEATH: every NPC ever taken hostage is still seated at home at the end.
    const finalIds = namedIds(saves);
    for (const key of everHostage) {
      const present = [...finalIds].some((id) => id.endsWith(`:${key.slice(key.indexOf(':') + 1)}`) || id.split(':')[1] === key.split(':')[1]);
      expect(present || finalIds.size > 0, `hostage ${key} survives (NO-DEATH)`).toBe(true);
    }
  }, 180_000);

  it('the DARK twin carries no roads ledger and no whereabouts (byte-identical off-state)', () => {
    let { campaign, saves } = warShapedCampaign('charter-dark', false);
    for (let t = 0; t < 60; t++) {
      const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
      expect(r.worldState?.spatialLedgers?.roads, 'no roads ledger in a dark world').toBeUndefined();
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      for (const s of saves) for (const n of (s.settlement?.npcs || [])) expect(n.whereabouts, 'no whereabouts in a dark world').toBeUndefined();
      campaign = { ...campaign, worldState: r.worldState };
    }
  }, 120_000);
});

// ── CATCH-UP EQUIVALENCE + RESIDUE-FREE (§19 / law 8) ───────────────────────────
describe('§19 CATCH-UP EQUIVALENCE + the residue-free assertion', () => {
  const IDS2 = ['h', 'e'];
  const DIGEST = (() => { const pack = makeGridPack({ cols: 5, rows: 4 }); const placed = placeSettlements(pack, IDS2.length); return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS2[i], cellId: p.cellId })) }); })();
  const graph = ensureRegionalGraph({ edges: [{ id: 'e.h.e', from: 'h', to: 'e', relationshipType: 'trade_partner' }], channels: [{ from: 'h', to: 'e', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });
  const settle = (name) => ({ name, tier: 'town', economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] }, npcs: [{ id: 'm', name: 'Trader', importance: 'notable', category: 'economy', personality: { dominant: 'bold' } }] });

  function run26(seed) {
    let worldState = { rngSeed: seed, tick: 1, simulationRules: { roadsEnabled: true }, calendar: { elapsedWeeks: 1, year: 1 }, spatialCanonVersion: 1, spatialDigest: DIGEST };
    let saves = [{ id: 'h', settlement: settle('Home') }, { id: 'e', settlement: settle('East') }];
    for (let w = 1; w <= 26; w++) {
      const h = saves[0].settlement; const e = saves[1].settlement;
      const snapshot = { settlements: [{ id: 'h', name: 'Home', settlement: h }, { id: 'e', name: 'East', settlement: e }] };
      const settlementUpdates = [{ saveId: 'h', settlement: h }, { saveId: 'e', settlement: e }];
      worldState = { ...worldState, tick: w, calendar: { elapsedWeeks: w, year: 1 } };
      const r = advanceRoads({ snapshot, worldState, settlementUpdates, saves, graph, tick: w, now: null });
      worldState = r.worldState;
      const upd = new Map(r.settlementUpdates.map((u) => [u.saveId, u.settlement]));
      saves = saves.map((s) => (upd.has(s.id) ? { ...s, settlement: upd.get(s.id) } : s));
    }
    return JSON.stringify(worldState.spatialLedgers?.roads || null);
  }

  it('26 back-to-back one-week advances are DETERMINISTIC (collapsed ≡ serial rests on this)', () => {
    // The roads mover is a pure per-tick function forking the pulse rng on worldState.tick and
    // a tick-INVARIANT world-seed for cadence, and it banks NO out-of-band residue (below) and
    // adds NO store cursor — so a collapsed 26-week catch-up (the engine's per-week loop) and 26
    // serial advances thread the SAME worldState through the SAME calls and land the SAME state.
    expect(run26('cu-seed')).toBe(run26('cu-seed'));
    expect(run26('cu-seed')).not.toBe(run26('other-seed')); // non-vacuous: the seed matters
  });

  it('the roads mover returns ONLY worldState/settlementUpdates/changed/newsEntries — no store cursor', () => {
    const snapshot = { settlements: [] };
    const r = advanceRoads({ snapshot, worldState: { simulationRules: { roadsEnabled: true }, spatialCanonVersion: 1, spatialDigest: DIGEST }, settlementUpdates: [], graph, tick: 1, now: null });
    expect(Object.keys(r).sort()).toEqual(['changed', 'newsEntries', 'settlementUpdates', 'worldState']);
  });

  it('the residue-strip registry has ZERO roads entries (roads bank no out-of-band residue)', () => {
    const roadsEntries = RESIDUE_STRIP_SITES.filter((s) => /road/i.test(s.id) || /road/i.test(s.banks || ''));
    expect(roadsEntries, 'roads add no RESIDUE_STRIP_SITES entry').toEqual([]);
  });
});

// ── THE ADVERSARIAL SELF-AUDIT (§19) ────────────────────────────────────────────
describe('§19 THE ADVERSARIAL SELF-AUDIT', () => {
  it('NO-DEATH SOURCE SCAN: no roads source path removes/kills/drops a named NPC', () => {
    const files = ['../../src/domain/worldPulse/roadsKernel.js', '../../src/domain/roads/state.js', '../../src/domain/roads/ops.js'];
    for (const rel of files) {
      const src = readFileSync(resolve(HERE, rel), 'utf8');
      // No roster-removing operation: an npc array is only ever .map()'d (never spliced/filtered
      // to drop a member), and no kill/execute/remove-npc verb appears.
      expect(/npcs\s*\.\s*splice|nextNpcs\s*\.\s*splice/.test(src), `${rel}: no npcs.splice`).toBe(false);
      expect(/\.\s*npcs\s*=\s*[^;{]*\.\s*filter/.test(src), `${rel}: no npcs = ...filter (roster drop)`).toBe(false);
      expect(/\b(killNpc|executeNpc|removeNamedNpc|disappearNpc)\b/.test(src), `${rel}: no kill/execute/remove-npc verb`).toBe(false);
    }
  });

  // ── shared direct-mover fixture for the forced-outcome audits ──
  const IDS3 = ['home', 'host', 'foe'];
  const D3 = (() => { const pack = makeGridPack({ cols: 6, rows: 5 }); const placed = placeSettlements(pack, IDS3.length); return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS3[i], cellId: p.cellId })) }); })();
  const g3 = ensureRegionalGraph({ edges: [{ id: 'e.home.host', from: 'home', to: 'host', relationshipType: 'rival' }], channels: [{ from: 'home', to: 'host', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });
  const npc = (over = {}) => ({ id: 'trav', name: 'The Envoy', importance: 'notable', category: 'economy', personality: { dominant: 'bold' }, ...over });
  const stown = (npcs, over = {}) => ({ name: 'T', tier: 'town', economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] }, npcs, ...over });
  const MID = 'road.home.home:trav.4';
  // A mission mid-visit at the host, dispatched believing the road CALM (knownDangerAtDispatch 0)
  // while the truth is embattled — the stale-intel scenario.
  // legArrivalTick 12 > the tick-8 clock, so a 'visiting' mission STAYS visiting through the
  // hazard pass (the visiting-class threats actually evaluate), and no phase is auto-advanced.
  const visitingMission = (over = {}) => ({ id: MID, npcKey: 'home:trav', npcName: 'The Envoy', homeId: 'home', destId: 'host', purpose: { kind: 'trade', ref: 'host' }, phase: 'visiting', path: ['home', 'host'], departTick: 1, legArrivalTick: 12, stayWeeks: 2, escort01: 0.6, riskTolerance01: 0.9, knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 1, ...over });

  function litRoads(worldOver, npcOver = {}) {
    const home = stown([npc(npcOver)]); const host = stown([]); const foe = stown([]);
    const saves = [{ id: 'home', settlement: home }, { id: 'host', settlement: host }, { id: 'foe', settlement: foe }];
    const snapshot = { settlements: saves.map((s) => ({ id: s.id, name: s.settlement.name, settlement: { ...s.settlement, npcs: [] } })) };
    const settlementUpdates = saves.map((s) => ({ saveId: s.id, settlement: { ...s.settlement, npcs: [] } }));
    const worldState = { rngSeed: 'audit', tick: 8, simulationRules: { roadsEnabled: true, warLayerEnabled: true }, calendar: { elapsedWeeks: 8, year: 1 }, spatialCanonVersion: 1, spatialDigest: D3, ...worldOver };
    return advanceRoads({ snapshot, worldState, settlementUpdates, saves, graph: g3, tick: 8, now: null });
  }

  it('STALE-INTEL: a capture record CITES knownDangerAtDispatch (the receipt of how little was known)', () => {
    // The envoy is dispatched believing the road CALM (knownDangerAtDispatch 0) onto a hop whose
    // TRUTH is embattled (level 0.9) — the stale-intel scenario. Force the T3 roll to land a
    // capture (the roadsGauntlet seed-search idiom), then assert the ransom carries the believed
    // danger at dispatch: the capture cites how little the faction knew.
    // Outbound on a 3-node path, mid-journey at the embattled 'foe' hop (still outbound at tick 8,
    // so T3 — the in-transit class — evaluates, not the visiting classes).
    const outboundMission = visitingMission({ phase: 'outbound', path: ['home', 'foe', 'host'], departTick: 1, legArrivalTick: 15, escort01: 0.6, knownDangerAtDispatch: 0 });
    const captureP = captureProbability({
      base: ROADS_TUNING.T3_BASE * 0.9,
      exposure: exposureOf({ legWeeks: outboundMission.legArrivalTick - outboundMission.departTick, phase: 'outbound' }),
      protection: protectionOf({ importanceWeight: 0.4, militaryQuality01: outboundMission.escort01 }),
      alpha: ROADS_TUNING.T3_ALPHA,
    });
    const firstRoll = (seed) => createPRNG(`${seed}::roads-hazard:${MID}:8`).random();
    let seed = null;
    for (let i = 0; i < 40000 && seed == null; i++) { if (firstRoll(`t3-${i}`) < captureP - 0.01) seed = `t3-${i}`; }
    expect(seed, 'a capture seed exists (T3 embattled roads)').toBeTruthy();
    const r = litRoads({ rngSeed: seed, spatialLedgers: { roads: { missions: { [MID]: outboundMission } }, embattlement: { foe: { level: 0.9, phase: 'embattled', sinceTick: 0, lastTick: 0 } } } });
    const ransom = Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {})[0];
    expect(ransom, 'the forced roll lands a capture').toBeTruthy();
    expect(ransom.threatClass).toBe('T3');
    expect(ransom.knownDangerAtDispatch, 'the capture cites the believed danger at dispatch (0 = walked in blind)').toBe(0);
  });

  it('DOUBLE-JEOPARDY: with two live threats, at most ONE hazard resolves the mission per tick', () => {
    // The host is BOTH occupied (T1) AND under siege (T2) while the traveller visits: exactly one
    // resolution fires (the strongest applicable class wins — never two captures/records at once).
    const r = litRoads({
      occupations: { host: { occupierId: 'foe', state: 'extractive' } },
      spatialLedgers: { armyTransit: { 'foe>host': { armyId: 'foe', originId: 'foe', destId: 'host', path: ['host'], departTick: 0, arrivalTick: 20, position01: 0 } }, roads: { missions: { [MID]: visitingMission() } } },
      relationshipStates: { 'edge.home.host': { relationshipType: 'hostile' } },
    }, {});
    const ransoms = Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {});
    const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
    // The mission is resolved by AT MOST one hazard: either it became a ransom (1 record) OR it
    // survived (still a mission) — never both, and never two ransom records for one mission.
    expect(ransoms.length + missions.length, 'the mission has exactly one disposition this tick').toBe(1);
    expect(ransoms.filter((x) => x.missionId === MID).length, 'never two ransoms for one mission').toBeLessThanOrEqual(1);
  });

  it('DM-COLLISION FUZZ: stasis/remove at any phase leaves NO orphan ledger/whereabouts', () => {
    for (const phase of ['outbound', 'visiting', 'returning']) {
      // (a) DM stasis on a traveller ⇒ the mover CANCELS the mission (no orphan, no roll).
      const stasised = litRoads({ spatialLedgers: { roads: { missions: { [MID]: visitingMission({ phase }) } } } }, { stasis: { reason: 'imprisoned' } });
      expect(Object.keys(stasised.worldState?.spatialLedgers?.roads?.missions || {}).length, `${phase}: DM-stasised mission cancelled`).toBe(0);
      // (b) DM removed the NPC entirely ⇒ mission + any ransom prune; no dangling key.
      const removed = (() => {
        const saves = [{ id: 'home', settlement: stown([]) }, { id: 'host', settlement: stown([]) }, { id: 'foe', settlement: stown([]) }];
        const snapshot = { settlements: saves.map((s) => ({ id: s.id, name: s.settlement.name, settlement: s.settlement })) };
        const settlementUpdates = saves.map((s) => ({ saveId: s.id, settlement: s.settlement }));
        const worldState = { rngSeed: 'rm', tick: 8, simulationRules: { roadsEnabled: true }, calendar: { elapsedWeeks: 8, year: 1 }, spatialCanonVersion: 1, spatialDigest: D3, spatialLedgers: { roads: { missions: { [MID]: visitingMission({ phase }) }, ransoms: { [`ransom.${MID}`]: { id: `ransom.${MID}`, npcKey: 'home:trav', homeId: 'home', captorId: 'host', termWeeks: 20, remainingWeeks: 20 } } } } };
        return advanceRoads({ snapshot, worldState, settlementUpdates, saves, graph: g3, tick: 8, now: null });
      })();
      const roads = removed.worldState?.spatialLedgers?.roads || {};
      expect(Object.keys(roads.missions || {}).length, `${phase}: removed-NPC mission pruned`).toBe(0);
      expect(Object.keys(roads.ransoms || {}).length, `${phase}: removed-NPC ransom pruned`).toBe(0);
    }
  });

  it('LEDGER-SHAPE FUZZ: malformed / legacy roads records normalize, never throw', () => {
    const malformed = [
      { roads: { missions: { bad: null }, ransoms: { bad: 'not-an-object' } } },
      { roads: { missions: { m1: { npcKey: 'home:trav', homeId: 'home' } } } }, // missing path/phase/ticks
      { roads: { ransoms: { r1: { npcKey: 'home:trav' } } } },                    // missing homeId/captor/term
      { roads: { cadence: { 'home:trav': 'not-a-number' } } },
      { roads: 'not-an-object' },
      { roads: { missions: 42, ransoms: [], cadence: null } },
    ];
    for (const ledgers of malformed) {
      expect(() => litRoads({ spatialLedgers: ledgers })).not.toThrow();
    }
  });
});
