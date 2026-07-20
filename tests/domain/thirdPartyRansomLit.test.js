/**
 * thirdPartyRansomLit.test.js — DEEP COUPLINGS D-5 THE LIT WALKTHROUGH (DESIGN_DEEP_COUPLINGS
 * §9/§13). Drives the roads mover (advanceRoads) through the half-term third-party checkpoint on
 * real ransom fixtures and proves the three terminal outcomes execute end-to-end:
 *   • a FRIEND ransoms a captive → DEBT + a gratitude bond deposit (never compromise);
 *   • a predatory RIVAL ransoms a corruptible captive → a COMPROMISED channel keyed to the PAYER
 *     (the corruption web then mints the leash FOR the payer — driven here);
 *   • a PROUD captive REFUSES an enemy's coin → the term runs on (no release, no fate resolved).
 * The redirected write schedule (home skips the legit hit; the payer bleeds a band-step) is pinned,
 * and the roster is conserved (NO-DEATH — a released/refused captive is never removed).
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { rawChannelQuality, CORRUPTION_WEB_TUNING } from '../../src/domain/worldPulse/corruptionWeb.js';
import { resolveThirdPartyRansom, consumeRansomSettlements, readRoadsBondEvents } from '../../src/domain/roads/thirdPartyRansom.js';
import { CORRUPTIBLE_FLAWS } from '../../src/domain/corruption.js';

const IDS = ['h', 'c', 'p']; // home · captor · payer
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 6, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();

const TERM = 20;
const START_WEEK = 90; // remainingWeeks at week 100 = 20 - 10 = 10 = TERM/2 ⇒ half-term reached
const WEEK = 100;

/** Build the shared fixture. `payerRel` is the h↔p relationship; `archetype` the payer's governing seat. */
function fixture({ payerRel, archetype = 'merchant', personality = {}, willConvert = false, ladder = null, rules }) {
  const captive = { id: 'cap', name: 'The Captive', importance: 'pillar', personality, whereabouts: { state: 'hostage', placeId: 'c', purposeKind: 'trade', sinceTick: START_WEEK, expectedReturnTick: null, missionId: 'road.h.h:cap.90' } };
  const ransomId = 'ransom.road.h.h:cap.90';
  const ransom = {
    id: ransomId, npcKey: 'h:cap', npcName: 'The Captive', homeId: 'h', captorId: 'c',
    threatClass: 'T3', purposeKind: 'trade', missionId: 'road.h.h:cap.90',
    startedTick: START_WEEK, startedWeek: START_WEEK, termWeeks: TERM, remainingWeeks: TERM,
    hostileAtCapture: false, conversionRolled: true, willConvert,
  };
  const mk = (id, name, extra = {}) => ({ id, name, settlement: { name, npcs: [], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] }, ...extra } });
  const h = mk('h', 'Home'); h.settlement.npcs = [captive];
  const c = mk('c', 'Captorhold');
  const p = mk('p', 'Payerton', { powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ isGoverning: true, archetype }] } });
  const saves = [h, c, p];
  const settlements = saves.map((s) => ({ id: s.id, name: s.name, settlement: s.settlement }));
  const spatialLedgers = { roads: { ransoms: { [ransomId]: ransom } }, ...(ladder ? { npcLadder: ladder } : {}) };
  const worldState = { rngSeed: 's', tick: WEEK, simulationRules: rules, calendar: { elapsedWeeks: WEEK, year: 2 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers };
  const edges = [{ id: 'edge.h.p', from: 'h', to: 'p', relationshipType: payerRel }, { id: 'edge.h.c', from: 'h', to: 'c', relationshipType: 'neutral' }];
  const graph = ensureRegionalGraph({ edges, channels: [] });
  return { worldState, graph, settlements, saves, ransomId, captive };
}

function run(fx, seedOverride) {
  const ws = seedOverride ? { ...fx.worldState, rngSeed: seedOverride } : fx.worldState;
  return advanceRoads({
    snapshot: { settlements: fx.settlements }, worldState: ws,
    settlementUpdates: fx.settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })),
    saves: fx.saves, graph: fx.graph, tick: WEEK, now: null,
  });
}

/** The decision the mover WILL make, reproduced with the mover's own args (deterministic per seed). */
function decisionFor(fx, seed, memoryWeaveLit) {
  const ransom = fx.worldState.spatialLedgers.roads.ransoms[fx.ransomId];
  return resolveThirdPartyRansom({
    ransom, captiveNpc: fx.captive, w: 1.0, servedFraction: 0.5,
    graph: fx.graph, worldState: { ...fx.worldState, rngSeed: seed }, settlementOf: (id) => fx.settlements.find((s) => s.id === id)?.settlement || {},
    candidateIds: ['c', 'h', 'p'], rngSeed: seed, memoryWeaveLit, corruptibleFlaws: CORRUPTIBLE_FLAWS,
  });
}

/** Find a seed whose decision hits the target action for this fixture. */
function seedFor(fx, action, memoryWeaveLit = false) {
  for (let i = 0; i < 200; i += 1) {
    const seed = `s${i}`;
    if (decisionFor(fx, seed, memoryWeaveLit).action === action) return seed;
  }
  throw new Error(`no seed produced action=${action}`);
}

const LIT = { roadsEnabled: true, thirdPartyRansomEnabled: true, infoMode: 'full' };
const rosterHas = (r, sid, npcId) => {
  const upd = (r.settlementUpdates || []).find((u) => u.saveId === sid);
  const npcs = upd?.settlement?.npcs || [];
  return npcs.some((n) => n.id === npcId);
};
const fieldOf = (r, sid, path) => {
  const s = (r.settlementUpdates || []).find((u) => u.saveId === sid)?.settlement || {};
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), s);
};

describe('D-5 §9 lit walkthrough — the three terminal outcomes execute', () => {
  it('DEBT: an ally-creditor accepts → roadsRansomSettlements deposit; home skips the legit hit', () => {
    const fx = fixture({ payerRel: 'ally', personality: { dominant: 'pragmatic' }, rules: LIT });
    const seed = seedFor(fx, 'debt');
    const r = run(fx, seed);
    const settle = r.worldState?.spatialLedgers?.roadsRansomSettlements || {};
    const rec = Object.values(settle)[0];
    expect(rec, 'a ransom-relief settlement was deposited').toBeTruthy();
    expect(rec.homeId).toBe('h'); expect(rec.payerId).toBe('p');
    // the record is released (gone from ransoms) and the captive still exists (no-death).
    expect(r.worldState?.spatialLedgers?.roads?.ransoms).toBeUndefined();
    expect(rosterHas(r, 'h', 'cap')).toBe(true);
    // NO compromised channel on the debt path.
    expect(r.worldState?.spatialLedgers?.roadsReturnedCaptives).toBeUndefined();
    // the consumer turns the deposit into a ransom_relief obligation home→payer.
    const mints = consumeRansomSettlements(r.worldState, WEEK + 1);
    expect(mints).toContainEqual(expect.objectContaining({ from: 'h', to: 'p', kind: 'ransom_relief' }));
    // REDIRECTED SCHEDULE: home keeps its legitimacy (the payer's coin covered the shame — a normal
    // term-end release would bleed it -1); the payer bleeds a prosperity band for the pillar captive.
    expect(fieldOf(r, 'h', 'powerStructure.publicLegitimacy.score')).toBe(55);
    expect(fieldOf(r, 'p', 'economicState.prosperity')).not.toBe('Comfortable');
  });

  it('COMPROMISED: a predatory rival ransoms a corruptible captive → a payer-beneficiary channel the web mints for the PAYER', () => {
    const rules = { ...LIT, corruptionWebEnabled: true };
    const fx = fixture({ payerRel: 'rival', archetype: 'militarist_expansionist', personality: { flaw: 'greedy' }, rules });
    const seed = seedFor(fx, 'compromised');
    const r = run(fx, seed);
    const chans = r.worldState?.spatialLedgers?.roadsReturnedCaptives || {};
    const rec = Object.values(chans)[0];
    expect(rec, 'a returned-captive channel was deposited').toBeTruthy();
    expect(rec.beneficiaryId).toBe('p'); // the PAYER is the patron, not the captor
    expect(rec.homeId).toBe('h');
    // the web reads the channel as a PAYER↔HOME conduit (p is the recruiting patron).
    const snap = { regionalGraph: { edges: [], channels: [] } };
    expect(rawChannelQuality(snap, new Set(), 'p', 'h', new Set(['h|p']))).toBeCloseTo(CORRUPTION_WEB_TUNING.CHANNEL_RETURNED_CAPTIVE, 6);
    expect(rosterHas(r, 'h', 'cap')).toBe(true); // no-death
  });

  it('REFUSED: a proud captive refuses an enemy (leverage) coin → the term runs on, no release', () => {
    const fx = fixture({ payerRel: 'rival', archetype: 'warlord', personality: { dominant: 'proud', flaw: 'principled' }, rules: LIT });
    const seed = seedFor(fx, 'refused');
    const r = run(fx, seed);
    const ransoms = r.worldState?.spatialLedgers?.roads?.ransoms || {};
    const rec = Object.values(ransoms)[0];
    expect(rec, 'the ransom record still stands (refused)').toBeTruthy();
    expect(rec.thirdPartyResolved).toBe(true);
    expect(rec.payerMotive).toBe('leverage');
    // no release, no deposits, no fate resolved.
    expect(r.worldState?.spatialLedgers?.roadsRansomSettlements).toBeUndefined();
    expect(r.worldState?.spatialLedgers?.roadsReturnedCaptives).toBeUndefined();
    expect(rosterHas(r, 'h', 'cap')).toBe(true);
  });

  it('FRIEND (memoryWeave): a friend ransoms → DEBT + a gratitude bond deposit toward the friend', () => {
    const ladder = { p: { npcs: { 'p:friend': { bonds: { 'h:cap': { sev: 0.6, week: 1, kind: 'friendship' } } } } } };
    const rules = { ...LIT, memoryWeaveEnabled: true };
    const fx = fixture({ payerRel: 'neutral', personality: { dominant: 'pragmatic' }, ladder, rules });
    const seed = seedFor(fx, 'debt', true);
    const dec = decisionFor(fx, seed, true);
    expect(dec.payerMotive).toBe('friendship'); // a friend moves first
    const r = run(fx, seed);
    const bonds = r.worldState?.spatialLedgers?.roadsBondEvents || {};
    const bev = Object.values(bonds)[0];
    expect(bev, 'a gratitude bond event was deposited').toBeTruthy();
    expect(bev.captiveNpcKey).toBe('h:cap');
    expect(bev.targetNpcKey).toBe('p:friend');
    expect(bev.targetSid).toBe('p');
    // the ladder's read helper surfaces it for the mintBond consume.
    const evs = readRoadsBondEvents(r.worldState);
    expect(evs.get('h|h:cap')).toEqual({ targetNpcKey: 'p:friend', targetSid: 'p', sev: bev.sev });
  });

  it('CAPTOR PRECEDENCE: a latched captor leash forces DEBT even for a predatory rival (no payer leash)', () => {
    const rules = { ...LIT, corruptionWebEnabled: true };
    const fx = fixture({ payerRel: 'rival', archetype: 'warlord', personality: { flaw: 'greedy' }, willConvert: true, rules });
    // willConvert forces debt in the leaf regardless of the outcome roll; find a seed that accepts.
    const seed = seedFor(fx, 'debt');
    const r = run(fx, seed);
    // the payer gets a DEBT (not a leash); the captor keeps its channel via the returning mission.
    expect(r.worldState?.spatialLedgers?.roadsRansomSettlements, 'payer debt deposited').toBeTruthy();
    // no PAYER-beneficiary channel (the captor's willConvert leash wins; that channel forms at arrival).
    const chans = r.worldState?.spatialLedgers?.roadsReturnedCaptives || {};
    expect(Object.values(chans).some((c) => c.beneficiaryId === 'p')).toBe(false);
  });
});
