/**
 * roadsEmbassy.test.js — §11b R-8 THE EMBASSY EXTENSION (R8-a): the peace embassy purpose, the
 * two venues (road parley · court suit), the insult/humility amplifier, the embassy record
 * deposit, the third-party rule, and the interception race. Direct-mover forced fixtures (the
 * roadsGauntlet seed-search idiom). DESIGN_THE_ROADS.md §11b.
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  ROADS_TUNING, roadsImportanceWeight, factionPowerStanding01, embassyEnvoyWeight01,
  embassyAmplifier, embassyReceivedP, embassyDetainShare, embassySuitIntensity01,
} from '../../src/domain/roads/state.js';
import { embassySuitPeaceMult, embassyPairKey, EMBASSY_LEDGER_KEY } from '../../src/domain/roads/embassyLedger.js';
import { rumorEventKey } from '../../src/domain/spatial/rumorNetwork.js';
import { ENVOY_REQUIRED_RULES } from '../../src/domain/worldPulse/envoyErrand.js';

// Four settlements: h (home, the suer), t (the war target), x (a road waystation), p (a third power).
const SIDS = ['h', 't', 'x', 'p'];
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 6, rows: 5 });
  const placed = placeSettlements(pack, SIDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((pp, i) => ({ id: SIDS[i], cellId: pp.cellId })) });
})();
const TICK = 60;
const MID = 'road.h.h:env.40';
const WR7A_RULES = Object.freeze(Object.fromEntries(
  ENVOY_REQUIRED_RULES.map((rule) => [rule, true]),
));

const envoy = (over = {}) => ({ id: 'env', name: 'The Envoy', importance: 'notable', category: 'government', personality: { dominant: 'bold' }, faction: 'Crown', ...over });
function town(name, npcs = [], over = {}) {
  return {
    name, tier: 'town', npcs,
    economicState: { prosperity: 'Comfortable' },
    powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ faction: 'Crown', isGoverning: true, power: 60 }] },
    ...over,
  };
}
function settlementsFor(homeNpcs) {
  return { h: town('Home', homeNpcs), t: town('Target'), x: town('Waystation'), p: town('Thirdpower') };
}
// A hostile relationship rung h↔t = "open war" (§4) — the embassy trigger, no war-front fixturing needed.
function graphWith(extra = {}) {
  return ensureRegionalGraph({
    edges: [
      { id: 'edge.h.t', from: 'h', to: 't', relationshipType: extra.htRel || 'hostile' },
      { id: 'edge.h.p', from: 'h', to: 'p', relationshipType: extra.hpRel || 'trade_partner' },
      { id: 'edge.t.p', from: 't', to: 'p', relationshipType: extra.tpRel || 'trade_partner' },
    ],
    channels: [
      { from: 'h', to: 'x', type: 'trade_route', status: 'confirmed', strength: 0.5 },
      { from: 'x', to: 't', type: 'trade_route', status: 'confirmed', strength: 0.5 },
      ...(extra.channels || []),
    ],
  });
}
function embassyMission(over = {}) {
  return {
    id: MID, npcKey: 'h:env', npcName: 'The Envoy', homeId: 'h', destId: 't',
    purpose: { kind: 'embassy', ref: 'h~t' }, phase: 'visiting', path: ['h', 'x', 't'],
    departTick: 40, legArrivalTick: 80, stayWeeks: 2, escort01: 0.6, riskTolerance01: 0.9,
    knownDangerAtDispatch: 0, trappedBySiege: false, startedYear: 1, ...over,
  };
}
function worldFor({ seed, mission = null, extraLedgers = {}, relationshipStates = {}, rules = {}, calendarWeeks = TICK }) {
  const roads = mission ? { missions: { [MID]: mission } } : {};
  return {
    rngSeed: seed, tick: TICK, simulationRules: { roadsEnabled: true, warLayerEnabled: true, ...rules },
    calendar: { elapsedWeeks: calendarWeeks, year: 1 }, spatialCanonVersion: 1, spatialDigest: DIGEST,
    relationshipStates,
    spatialLedgers: { ...(mission ? { roads } : {}), ...extraLedgers },
  };
}
function argsFor(worldState, graph, homeNpcs) {
  const s = settlementsFor(homeNpcs);
  const settlements = SIDS.map((id) => ({ id, name: s[id].name, settlement: s[id] }));
  return {
    snapshot: { settlements }, worldState,
    settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })),
    saves: settlements.map((it) => ({ id: it.id, settlement: it.settlement })),
    graph, tick: TICK, now: null,
  };
}
/** The envoy metrics the mover computes, so a test can search a disposition seed. */
function metricsFor(npcOver = {}) {
  const npc = envoy(npcOver);
  const home = town('Home', [npc]);
  const w = roadsImportanceWeight(npc);
  const envoyWeight01 = embassyEnvoyWeight01({ importanceWeight01: w, factionPower01: factionPowerStanding01(home, npc) });
  return { w, envoyWeight01, amplifier: embassyAmplifier(envoyWeight01) };
}
const firstHazardRoll = (seed) => createPRNG(`${seed}::roads-hazard:${MID}:${TICK}`).random();

// ── THE AMPLIFIER (pure math — the insult/humility curve) ────────────────────────
describe('§11b THE AMPLIFIER — envoy weight + the insult/humility curve', () => {
  it('factionPowerStanding01 reads faction.power by the .faction key (never .name), 0.5 fallback', () => {
    const home = town('H', [], { powerStructure: { factions: [{ faction: 'Crown', power: 80 }, { faction: 'Guild', power: 30 }] } });
    expect(factionPowerStanding01(home, { faction: 'Crown' })).toBeCloseTo(0.8, 5);
    expect(factionPowerStanding01(home, { faction: 'Guild' })).toBeCloseTo(0.3, 5);
    // An unreadable faction ⇒ the DEFAULT_FACTION_POWER fallback.
    expect(factionPowerStanding01(home, { faction: 'Nobody' })).toBeCloseTo(ROADS_TUNING.DEFAULT_FACTION_POWER / 100, 5);
  });
  it('lowest-of-the-lowest reads as INSULT (amplifier → -1); highest as HUMILITY (→ +1)', () => {
    expect(embassyEnvoyWeight01({ importanceWeight01: 0, factionPower01: 0 })).toBe(0);
    expect(embassyEnvoyWeight01({ importanceWeight01: 1, factionPower01: 1 })).toBe(1);
    expect(embassyAmplifier(0)).toBe(-1); // INSULT
    expect(embassyAmplifier(1)).toBe(1); // HUMILITY
    expect(embassyAmplifier(0.5)).toBe(0);
  });
  it('humility RAISES receivedP + LOWERS the detain share; insult does the reverse', () => {
    expect(embassyReceivedP(1)).toBeGreaterThan(embassyReceivedP(-1));
    expect(embassyDetainShare(1)).toBeLessThan(embassyDetainShare(-1));
    // clamped into [MIN, MAX] — an insult can still (rarely) be heard, humility never certain.
    expect(embassyReceivedP(1)).toBeLessThanOrEqual(ROADS_TUNING.EMBASSY_RECEIVED_MAX);
    expect(embassyReceivedP(-1)).toBeGreaterThanOrEqual(ROADS_TUNING.EMBASSY_RECEIVED_MIN);
    // a greater envoy walks a stronger suit in.
    expect(embassySuitIntensity01(1)).toBeGreaterThan(embassySuitIntensity01(0));
  });
});

// ── GENESIS — the wartime peace suit dispatches (and bypasses the damper) ─────────
describe('§11b GENESIS — the peace embassy', () => {
  function seedThatFires(npcKey) {
    for (let i = 0; i < 20000; i++) {
      const seed = `em-${i}`;
      const f = createPRNG(`${seed}::roads:cadence:${npcKey}:1`);
      const r1 = f.random(); const r2 = f.random();
      if (r1 < ROADS_TUNING.JOURNEY_CHANCE && 1 + Math.floor(r2 * 51) <= 51) return seed;
    }
    throw new Error('no firing seed');
  }
  it('a court at OPEN WAR (hostile rung) sends a government envoy to sue the enemy for peace', () => {
    const seed = seedThatFires('h:env');
    const world = worldFor({ seed, calendarWeeks: 51 });
    const r = advanceRoads(argsFor(world, graphWith(), [envoy()]));
    const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
    const embassy = missions.find((m) => m.purpose.kind === 'embassy');
    expect(embassy, 'an embassy mission was dispatched').toBeTruthy();
    expect(embassy.destId, 'the suit is addressed to the war target').toBe('t');
    // The quiet-but-travelling departure beat carries the interception-race rumor key.
    const beat = (r.newsEntries || []).find((e) => Array.isArray(e.tags) && e.tags.includes('embassy_departure'));
    expect(beat, 'an embassy-departure beat was minted').toBeTruthy();
    expect(beat.score, 'lifted to the rumor seed floor so the lattice carries it').toBeGreaterThanOrEqual(60);
    expect(String(beat.sourceEventId), 'the beat seeds the interception-race event key').toContain('embassy-depart.');
  });
  it('the embassy BYPASSES the war damper — a besieged court can still sue for peace', () => {
    const seed = seedThatFires('h:env');
    // A bare war_front INTO h (t besieges h) ⇒ warDamped(h) true ⇒ routine dispatch suppressed.
    const graph = graphWith({ htRel: 'hostile', channels: [{ from: 't', to: 'h', type: 'war_front', status: 'confirmed' }] });
    const r = advanceRoads(argsFor(worldFor({ seed, calendarWeeks: 51 }), graph, [envoy()]));
    const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
    expect(missions.length, 'the besieged court still dispatched (only the embassy)').toBe(1);
    expect(missions[0].purpose.kind).toBe('embassy');
  });

  it('WR-7a exact-lit suppresses NEW legacy Roads embassies', () => {
    const seed = seedThatFires('h:env');
    const world = worldFor({
      seed,
      calendarWeeks: 51,
      rules: WR7A_RULES,
    });
    const r = advanceRoads(argsFor(world, graphWith(), [envoy()]));
    const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
    expect(missions.some((m) => m.purpose?.kind === 'embassy')).toBe(false);
    expect((r.newsEntries || []).some((e) => e.tags?.includes('embassy_departure'))).toBe(false);
  });

  it('every partial WR-7a configuration preserves legacy Roads embassy genesis', () => {
    const seed = seedThatFires('h:env');
    for (const missingRule of ENVOY_REQUIRED_RULES) {
      const world = worldFor({
        seed,
        calendarWeeks: 51,
        rules: { ...WR7A_RULES, [missingRule]: false },
      });
      const r = advanceRoads(argsFor(world, graphWith(), [envoy()]));
      const missions = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {});
      expect(
        missions.some((m) => m.purpose?.kind === 'embassy'),
        `legacy embassy was suppressed while ${missingRule} was not exact true`,
      ).toBe(true);
      expect(
        (r.newsEntries || []).some((e) => e.tags?.includes('embassy_departure')),
        `legacy embassy departure went silent while ${missingRule} was not exact true`,
      ).toBe(true);
    }
  });

  it('WR-7a exact-lit lets a legacy embassy already on the road finish its lifecycle', () => {
    const existing = embassyMission({ phase: 'returning', legArrivalTick: TICK + 20 });
    const world = worldFor({
      seed: 'existing-embassy',
      mission: existing,
      rules: WR7A_RULES,
    });
    const r = advanceRoads(argsFor(world, graphWith(), [envoy()]));
    const mission = r.worldState?.spatialLedgers?.roads?.missions?.[MID];
    expect(mission, 'the pre-existing mission is carried forward').toBeTruthy();
    expect(mission.purpose.kind).toBe('embassy');
    expect(mission.phase).toBe('returning');
  });
});

// ── THE COURT SUIT (visiting the target gate) — received / hostage / turned-home ──
describe('§11b THE COURT SUIT (venue at the target gate)', () => {
  const { amplifier, envoyWeight01 } = metricsFor();
  const receivedP = embassyReceivedP(amplifier);
  const detainCut = receivedP + (1 - receivedP) * embassyDetainShare(amplifier);
  function seedForBand(lo, hi) {
    for (let i = 0; i < 40000; i++) { const s = `cs-${i}`; const r = firstHazardRoll(s); if (r >= lo && r < hi) return s; }
    throw new Error(`no seed in [${lo},${hi})`);
  }
  it('RECEIVED: the suit is heard ⇒ a roadsEmbassies deposit + the envoy turns home', () => {
    const seed = seedForBand(0, receivedP - 0.02);
    const r = advanceRoads(argsFor(worldFor({ seed, mission: embassyMission() }), graphWith(), [envoy()]));
    const emb = r.worldState?.spatialLedgers?.[EMBASSY_LEDGER_KEY]?.[embassyPairKey('h', 't')];
    expect(emb, 'a heard suit was deposited for (h>t)').toBeTruthy();
    expect(emb.venue).toBe('court_suit');
    expect(emb.intensity01, 'the deposit carries the suit intensity').toBeCloseTo(embassySuitIntensity01(envoyWeight01), 5);
    expect(emb.expiresTick, 'the suit stands for a bounded window').toBeGreaterThan(TICK);
    const mission = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {})[0];
    expect(mission?.phase, 'the envoy is escorted home').toBe('returning');
    expect((r.newsEntries || []).some((e) => e.tags?.includes('embassy_received'))).toBe(true);
    // No hostage — success is never a ransom.
    expect(Object.keys(r.worldState?.spatialLedgers?.roads?.ransoms || {}).length).toBe(0);
  });
  it('HOSTAGE (failure): the target detains the envoy ⇒ a standard ransom, captor = the target', () => {
    const seed = seedForBand(receivedP + 0.01, detainCut - 0.01);
    const r = advanceRoads(argsFor(worldFor({ seed, mission: embassyMission() }), graphWith(), [envoy()]));
    const ransom = Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {})[0];
    expect(ransom, 'a detained embassy becomes a hostage (never worse — the no-death law)').toBeTruthy();
    expect(ransom.captorId).toBe('t');
    expect(r.worldState?.spatialLedgers?.[EMBASSY_LEDGER_KEY], 'a failed suit deposits nothing').toBeUndefined();
  });
  it('TURNED HOME (failure): the suit is refused a hearing ⇒ expulsion-shape return, no ransom', () => {
    const seed = seedForBand(detainCut + 0.01, 0.999);
    const r = advanceRoads(argsFor(worldFor({ seed, mission: embassyMission() }), graphWith(), [envoy()]));
    const mission = Object.values(r.worldState?.spatialLedgers?.roads?.missions || {})[0];
    expect(mission?.phase, 'the rebuffed envoy rides home').toBe('returning');
    expect(Object.keys(r.worldState?.spatialLedgers?.roads?.ransoms || {}).length, 'turned home is not a ransom').toBe(0);
    expect((r.newsEntries || []).some((e) => e.tags?.includes('embassy_rebuffed'))).toBe(true);
  });
});

// ── THE ROAD PARLEY + THE THIRD-PARTY RULE + THE INTERCEPTION RACE (in transit) ───
describe('§11b THE ROAD ENCOUNTERS (outbound)', () => {
  const outbound = (over = {}) => embassyMission({ phase: 'outbound', legArrivalTick: 80, departTick: 40, ...over });
  // Mid-outbound the traveller occupies the 'x' waystation hop (path h→x→t, f≈0.5 ⇒ node x).
  const armyAt = (armyId, region = 'x') => ({ [`${armyId}>x`]: { armyId, originId: armyId, destId: region, path: [region], departTick: 0, arrivalTick: 200, position01: 0 } });

  it('ROAD PARLEY: the TARGET\'s own column converts the encounter into a negotiation (deposit)', () => {
    const { amplifier } = metricsFor();
    const receivedP = embassyReceivedP(amplifier);
    let seed = null;
    for (let i = 0; i < 40000 && seed == null; i++) { if (firstHazardRoll(`rp-${i}`) < receivedP - 0.02) seed = `rp-${i}`; }
    const world = worldFor({ seed, mission: outbound(), extraLedgers: { armyTransit: armyAt('t') } });
    const r = advanceRoads(argsFor(world, graphWith(), [envoy()]));
    const emb = r.worldState?.spatialLedgers?.[EMBASSY_LEDGER_KEY]?.[embassyPairKey('h', 't')];
    expect(emb, 'the road parley heard the suit and deposited it').toBeTruthy();
    expect(emb.venue).toBe('road_parley');
  });

  it('THIRD-PARTY RULE: a home-enemy column intercepts ⇒ capture (no negotiation, suit dies)', () => {
    // 'p' is hostile to home h; p ≠ target t. Standard T1 capture applies.
    let seed = null;
    const p = ROADS_TUNING.T1_BASE; // any seed lands a capture roll < a healthy T1 P; search one
    for (let i = 0; i < 40000 && seed == null; i++) { if (firstHazardRoll(`tp-${i}`) < p * 0.5) seed = `tp-${i}`; }
    const world = worldFor({ seed, mission: outbound(), extraLedgers: { armyTransit: armyAt('p') }, relationshipStates: { 'edge.h.p': { relationshipType: 'hostile' } } });
    const r = advanceRoads(argsFor(world, graphWith({ hpRel: 'hostile' }), [envoy()]));
    const ransom = Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {})[0];
    expect(ransom, 'a third-party enemy simply takes the envoy hostage').toBeTruthy();
    expect(ransom.captorId).toBe('p');
    expect(r.worldState?.spatialLedgers?.[EMBASSY_LEDGER_KEY], 'the suit died unheard — no deposit').toBeUndefined();
  });

  it('THE INTERCEPTION RACE: an OMNISCIENT third-party at war with the target hunts from tick 0', () => {
    // p is at war with t (not hostile to h) and NOT informed via any rumor — but omniscient ⇒
    // known ≡ true ⇒ p hunts. Force a capture and assert p took the envoy (the hunt amplifier lifts
    // the roll; here we assert the interception fired at all).
    let seed = null;
    for (let i = 0; i < 40000 && seed == null; i++) { if (firstHazardRoll(`hr-${i}`) < ROADS_TUNING.T1_BASE * 0.5) seed = `hr-${i}`; }
    const world = worldFor({ seed, mission: outbound(), extraLedgers: { armyTransit: armyAt('p') }, relationshipStates: { 'edge.t.p': { relationshipType: 'hostile' } } });
    const r = advanceRoads(argsFor(world, graphWith({ tpRel: 'hostile' }), [envoy()]));
    const ransom = Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {})[0];
    expect(ransom, 'an omniscient hunter intercepted the peace mission').toBeTruthy();
    expect(ransom.captorId).toBe('p');
  });

  it('THE RACE, UNINFORMED: a NON-omniscient third-party that never received the news does NOT act', () => {
    // infoMode perfect_delayed ⇒ beliefsActive ⇒ p must have RECEIVED the embassy news to hunt.
    // p is at war with t but NOT hostile to h and NOT informed ⇒ its column ignores the envoy.
    const world = worldFor({
      seed: 'uninformed', mission: outbound(), rules: { infoMode: 'perfect_delayed' },
      extraLedgers: { armyTransit: armyAt('p') }, relationshipStates: { 'edge.t.p': { relationshipType: 'hostile' } },
    });
    const r = advanceRoads(argsFor(world, graphWith({ tpRel: 'hostile' }), [envoy()]));
    expect(Object.keys(r.worldState?.spatialLedgers?.roads?.ransoms || {}).length, 'an uninformed hunter never learned').toBe(0);
    // The mission survives (no interception this tick).
    expect(Object.keys(r.worldState?.spatialLedgers?.roads?.missions || {}).length).toBe(1);
  });

  it('THE RACE, INFORMED: the SAME non-omniscient third-party, once its rumor ledger RECEIVES the news, hunts', () => {
    // Pre-seed p's rumor ledger with the embassy-departure event that has ARRIVED (arrivalTick ≤ now).
    const eventKey = rumorEventKey(`embassy-depart.${MID}`);
    let seed = null;
    for (let i = 0; i < 40000 && seed == null; i++) { if (firstHazardRoll(`in-${i}`) < ROADS_TUNING.T1_BASE * 0.5) seed = `in-${i}`; }
    const world = worldFor({
      seed, mission: outbound(), rules: { infoMode: 'perfect_delayed' },
      extraLedgers: {
        armyTransit: armyAt('p'),
        rumorLedgers: { p: { [eventKey]: { arrivalTick: TICK - 1, content: { what: 'embassy', whereId: 'h', partyIds: ['h', 't'] } } } },
      },
      relationshipStates: { 'edge.t.p': { relationshipType: 'hostile' } },
    });
    const r = advanceRoads(argsFor(world, graphWith({ tpRel: 'hostile' }), [envoy()]));
    const ransom = Object.values(r.worldState?.spatialLedgers?.roads?.ransoms || {})[0];
    expect(ransom, 'the informed hunter intercepted the suit').toBeTruthy();
    expect(ransom.captorId).toBe('p');
  });
});

// ── THE WAR-SIDE CONSUMPTION (deposit-and-consume) ───────────────────────────────
describe('§11b THE PEACE-SUIT MULTIPLIER (the war system consumes the deposit)', () => {
  const worldWithSuit = (rec) => ({ tick: TICK, calendar: { elapsedWeeks: TICK }, spatialLedgers: { [EMBASSY_LEDGER_KEY]: { [embassyPairKey('h', 't')]: rec } } });
  it('a live suit lifts sue_for_peace ×(1 + EMBASSY_PEACE_W×intensity); absent ⇒ ×1 (byte-identical)', () => {
    const world = worldWithSuit({ intensity01: 1, expiresTick: TICK + 10 });
    expect(embassySuitPeaceMult(world, 'h', ['t'])).toBeCloseTo(1 + ROADS_TUNING.EMBASSY_PEACE_W, 5);
    expect(embassySuitPeaceMult({}, 'h', ['t']), 'no ledger ⇒ ×1').toBe(1);
    expect(embassySuitPeaceMult(world, 'h', ['x']), 'no suit for this pair ⇒ ×1').toBe(1);
  });
  it('a LAPSED suit no longer counts (×1)', () => {
    expect(embassySuitPeaceMult(worldWithSuit({ intensity01: 1, expiresTick: TICK - 1 }), 'h', ['t'])).toBe(1);
  });
});
