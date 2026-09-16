/**
 * gratitudeBonds.test.js — DEEP COUPLINGS D-7e clause (ii) pins (mini-fold step 3):
 * THE GENEROSITY GRATITUDE deposit-and-consume lane.
 *
 * "A completed generosity act deposits a cooperation/gratitude event (consumed by the
 * ladder pass into bonds, beside the obligations ledger entry the act already mints —
 * obligation is the DEBT, the bond is the FRIENDSHIP)." Court-to-court: the receiver's
 * ruling-seat NPC bonds toward the GIVER's ruling-seat NPC (foreignSid = giver sid).
 * ONE-TICK choreography: generosity deposits, the ladder (later the same tick) consumes;
 * the ledger lives one tick and the consume filters tick === now ⇒ consume-once by
 * double construction. Dark weave ⇒ no key, byte-identity held by the dormancy goldens.
 */
import { describe, it, expect } from 'vitest';
import {
  noteGratitudeBond, applyGratitudeBondLedger, readGratitudeBondEvents,
  governingLadderFkeyOf, rulingSeatNidOf,
} from '../../src/domain/worldPulse/gratitudeBonds.js';
import { advanceGenerosity } from '../../src/domain/worldPulse/generosityKernel.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

// ── Leaf units ────────────────────────────────────────────────────────────────

describe('noteGratitudeBond — all gating lives in the leaf', () => {
  it('records a qualifying act; dark / sub-floor / self-pair record NOTHING; repeats stack bounded', () => {
    /** @type {Record<string, { sev: number, tick: number }>} */
    const w = {};
    noteGratitudeBond(w, { lit: false, receiverSid: 'b', giverSid: 'a', sev: 0.5, tick: 5, floor: 0.03 });
    expect(w, 'dark weave deposits nothing').toEqual({});
    noteGratitudeBond(w, { lit: true, receiverSid: 'b', giverSid: 'a', sev: 0.01, tick: 5, floor: 0.03 });
    expect(w, 'sub-floor mercy deposits nothing').toEqual({});
    noteGratitudeBond(w, { lit: true, receiverSid: 'b', giverSid: 'b', sev: 0.5, tick: 5, floor: 0.03 });
    expect(w, 'a settlement cannot be grateful to itself').toEqual({});
    noteGratitudeBond(w, { lit: true, receiverSid: 'b', giverSid: 'a', sev: 0.4, tick: 5, floor: 0.03 });
    expect(w['b|a']).toEqual({ sev: 0.4, tick: 5 });
    noteGratitudeBond(w, { lit: true, receiverSid: 'b', giverSid: 'a', sev: 0.8, tick: 5, floor: 0.03 });
    expect(w['b|a'].sev, 'same-tick repeats stack additively, bounded to 1').toBe(1);
  });
});

describe('applyGratitudeBondLedger — the one-tick lifetime', () => {
  it('SETS when the tick minted, DROPS a stale prior, leaves a never-lit world untouched', () => {
    const bare = { spatialLedgers: {} };
    const none = applyGratitudeBondLedger(bare, bare, {});
    expect(none.changed, 'never-lit ⇒ untouched (byte-identity)').toBe(false);
    expect(none.worldState).toBe(bare);

    const set = applyGratitudeBondLedger(bare, bare, { 'b|a': { sev: 0.4, tick: 5 } });
    expect(set.changed).toBe(true);
    expect(getSpatialLedger(set.worldState, 'gratitudeBondEvents')).toEqual({ 'b|a': { sev: 0.4, tick: 5 } });

    const stale = set.worldState;
    const dropped = applyGratitudeBondLedger(stale, stale, {});
    expect(dropped.changed, 'a stale prior with no fresh mints DROPS').toBe(true);
    expect(getSpatialLedger(dropped.worldState, 'gratitudeBondEvents')).toBeUndefined();
  });
});

describe('readGratitudeBondEvents — tick filter + receiver grouping', () => {
  it('groups by receiver, sorts givers, and IGNORES any event from another tick', () => {
    const ws = { spatialLedgers: { gratitudeBondEvents: {
      'b|c': { sev: 0.2, tick: 7 }, 'b|a': { sev: 0.4, tick: 7 }, 'x|a': { sev: 0.3, tick: 6 },
    } } };
    const m = readGratitudeBondEvents(ws, 7);
    expect([...m.keys()]).toEqual(['b']);
    expect(m.get('b'), 'givers codepoint-sorted').toEqual([{ giverSid: 'a', sev: 0.4 }, { giverSid: 'c', sev: 0.2 }]);
    expect(m.get('x'), 'the stale tick-6 event is dead (consume-once double guard)').toBeUndefined();
  });
});

describe('rulingSeatNidOf — the court resolves or the consume no-ops', () => {
  const gov = { faction: 'Gentry', isGoverning: true, power: 60 };
  const settlement = { powerStructure: { factions: [gov] } };
  const fkey = ladderFactionKey(gov);
  it('resolves the TOP RUNG (index 0) of the governing faction from the raw prior record', () => {
    const rec = { factions: { [fkey]: { rungs: ['a:seat', 'a:floor'] } }, npcs: {} };
    expect(governingLadderFkeyOf(settlement)).toBe(fkey);
    expect(rulingSeatNidOf(rec, settlement)).toBe('a:seat');
  });
  it('is null-safe at every hop (vacant court / no ladder / no rungs ⇒ null, never a throw)', () => {
    expect(rulingSeatNidOf(null, settlement)).toBe(null);
    expect(rulingSeatNidOf({ factions: {} }, settlement)).toBe(null);
    expect(rulingSeatNidOf({ factions: { [fkey]: { rungs: [] } } }, settlement)).toBe(null);
    expect(rulingSeatNidOf({ factions: { [fkey]: { rungs: ['a:seat'] } } }, { powerStructure: { factions: [] } })).toBe(null);
    expect(rulingSeatNidOf({ factions: { [fkey]: { rungs: ['a:seat'] } } }, null)).toBe(null);
  });
});

// ── Integration: the gift fixture (the two-claimant war-front lever, proven reliable) ──

const GOV_A = { faction: 'Gentry', isGoverning: true, power: 60, category: 'noble' };
const GOV_B = { faction: 'Harbor Court', isGoverning: true, power: 55, category: 'noble' };

function npc(id, name, importance, dots, rank, affiliation) {
  return { id, name, role: name, importance, dots, structuralRank: rank, factionAffiliation: affiliation, personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } };
}

/** An agrarian town with a governed court (both kernels read it). */
function courtTown({ storageMonths, gov, npcs }) {
  return {
    tier: 'town', population: 1600,
    config: { economicBase: 'agrarian' },
    institutions: [], activeConditions: [],
    economicState: {
      economicBase: 'agrarian', prosperity: 'Moderate',
      foodSecurity: { storageMonths, deficitPct: storageMonths < 1 ? 60 : 0, surplusPct: 0 },
    },
    powerStructure: { publicLegitimacy: { score: 50, label: 'Stable' }, factions: [gov] },
    npcs,
  };
}

function makeFixture({ weaveLit }) {
  const giver = courtTown({ storageMonths: 6, gov: GOV_A, npcs: [
    npc('an_seat', 'Lord Ashford', 'pillar', 3, 'dominant', 'Gentry'),
    npc('an_floor', 'Factor Maera', 'key', 2, 'subordinate', 'Gentry'),
  ] });
  const receiver = courtTown({ storageMonths: 0.3, gov: GOV_B, npcs: [
    npc('bn_seat', 'Harbormaster Brant', 'pillar', 3, 'dominant', 'Harbor Court'),
    npc('bn_floor', 'Clerk Odo', 'key', 2, 'subordinate', 'Harbor Court'),
  ] });
  const items = [
    { id: 'a', name: 'Ashford', settlement: giver },
    { id: 'b', name: 'Briarwatch', settlement: receiver },
  ];
  const snapshot = { settlements: items, byId: new Map(items.map((it) => [it.id, it])) };
  const settlementUpdates = [{ saveId: 'a', settlement: giver }, { saveId: 'b', settlement: receiver }];
  const worldState = {
    simulationRules: {
      constructiveFlowsEnabled: true, warLayerEnabled: false, npcLadderEnabled: true,
      ...(weaveLit ? { memoryWeaveEnabled: true } : {}),
    },
    calendar: { elapsedWeeks: 30 },
    relationshipStates: { 'edge.a.b': { trust: 0.8, pactStrength: 0.7, recentIncidents: [] } },
    stressors: [{ id: 'world_stressor.famine.b', type: 'famine', severity: 0.9, affectedSettlementIds: ['b'], age: 3 }],
  };
  const pIndex = { get: (id) => ({ score: id === 'b' ? 0.9 : 0 }) };
  const graph = {
    edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' }],
    channels: [
      { type: 'war_front', status: 'confirmed', from: 'raiders', to: 'a' },
      { type: 'war_front', status: 'confirmed', from: 'raiders', to: 'b' },
    ],
  };
  return { snapshot, settlementUpdates, worldState, pIndex, graph };
}

describe('D-7e (ii) DEPOSIT — a completed gift mints friendship beside the debt', () => {
  it('lit: the gift deposits b|a with the widow\'s-mite sev AND still mints the obligation', () => {
    const f = makeFixture({ weaveLit: true });
    const r = advanceGenerosity({ ...f, rng: createPRNG('grat'), tick: 5, now: NOW });
    const ledger = getSpatialLedger(r.worldState, 'gratitudeBondEvents');
    expect(ledger, 'the gift fired and deposited').toBeTruthy();
    const ev = /** @type {{ sev: number, tick: number }} */ (ledger['b|a']);
    expect(ev, 'receiver|giver keyed').toBeTruthy();
    expect(ev.tick).toBe(5);
    expect(ev.sev).toBeGreaterThan(0);
    expect(ev.sev).toBeLessThanOrEqual(1);
    // COEXISTENCE: the obligation (the DEBT) minted beside the bond event (the FRIENDSHIP).
    const obl = getSpatialLedger(r.worldState, 'obligations') || {};
    const kinds = Object.values(obl).map((o) => o.kind);
    expect(kinds, 'the grain_relief debt still records').toContain('grain_relief');
  });
  it('dark weave: the SAME gift fires but deposits NOTHING (no ledger key)', () => {
    const f = makeFixture({ weaveLit: false });
    const r = advanceGenerosity({ ...f, rng: createPRNG('grat'), tick: 5, now: NOW });
    expect(getSpatialLedger(r.worldState, 'gratitudeBondEvents')).toBeUndefined();
    const obl = getSpatialLedger(r.worldState, 'obligations') || {};
    expect(Object.values(obl).map((o) => o.kind), 'the debt is weave-independent').toContain('grain_relief');
  });
});

describe('D-7e (ii) ONE-TICK CHOREOGRAPHY — generosity deposits, the ladder consumes, once', () => {
  it('end-to-end: the receiving court\'s seat bonds toward the giver\'s seat (foreignSid), same tick; a later tick does NOT re-mint', () => {
    const f = makeFixture({ weaveLit: true });
    // Tick 4: derive the ladders (both courts seat their pillar NPC at rung 0).
    const seeded = advanceNpcLadder({ snapshot: f.snapshot, worldState: f.worldState, settlementUpdates: f.settlementUpdates, tick: 4, now: null });
    const aF = ladderFactionKey(GOV_A);
    const bF = ladderFactionKey(GOV_B);
    expect(seeded.worldState.spatialLedgers.npcLadder.a.factions[aF].rungs[0]).toBe('a:an_seat');
    expect(seeded.worldState.spatialLedgers.npcLadder.b.factions[bF].rungs[0]).toBe('b:bn_seat');

    // Tick 5, pass 1 (generosity): the gift deposits.
    const gen = advanceGenerosity({ ...f, worldState: seeded.worldState, rng: createPRNG('grat'), tick: 5, now: NOW });
    const ev = getSpatialLedger(gen.worldState, 'gratitudeBondEvents')['b|a'];
    expect(ev.tick).toBe(5);

    // Tick 5, pass 2 (the ladder, later the same tick): the consume mints the bond.
    const lad = advanceNpcLadder({ snapshot: f.snapshot, worldState: gen.worldState, settlementUpdates: gen.settlementUpdates, tick: 5, now: null });
    const seat = lad.worldState.spatialLedgers.npcLadder.b.npcs['b:bn_seat'];
    const bond = seat.bonds && seat.bonds['a:an_seat'];
    expect(bond, 'the receiver seat bonds toward the giver seat').toBeTruthy();
    expect(bond.kind).toBe('gratitude');
    expect(bond.sev).toBeCloseTo(ev.sev, 4);
    expect(bond.foreignSid, 'cross-border mark carries the giver sid (D-7f)').toBe('a');
    // Direction: the GIVER's court gained no bond (gratitude flows receiver→giver).
    const giverSeat = lad.worldState.spatialLedgers.npcLadder.a.npcs['a:an_seat'];
    expect(giverSeat.bonds && giverSeat.bonds['b:bn_seat']).toBeFalsy();
    // The receiver's FLOOR NPC gained nothing (court-to-court = the seat only).
    const floorNpc = lad.worldState.spatialLedgers.npcLadder.b.npcs['b:bn_floor'];
    expect(floorNpc && floorNpc.bonds).toBeFalsy();

    // CONSUME-ONCE: a later ladder advance sees the tick-5 event as STALE — no re-mint
    // (sev may only DECAY from here, never re-stack).
    const later = advanceNpcLadder({ snapshot: f.snapshot, worldState: lad.worldState, settlementUpdates: lad.settlementUpdates, tick: 6, now: null });
    const seat6 = later.worldState.spatialLedgers.npcLadder.b.npcs['b:bn_seat'];
    expect(seat6.bonds['a:an_seat'].sev).toBeLessThanOrEqual(bond.sev);
  });

  it('the ladder consume is memoryWeave-gated: events present but weave dark ⇒ no bonds', () => {
    const f = makeFixture({ weaveLit: false });
    const seeded = advanceNpcLadder({ snapshot: f.snapshot, worldState: f.worldState, settlementUpdates: f.settlementUpdates, tick: 4, now: null });
    // Inject a (foreign-made) event into a dark-weave world: the gate must hold.
    const ws = { ...seeded.worldState, spatialLedgers: { ...seeded.worldState.spatialLedgers, gratitudeBondEvents: { 'b|a': { sev: 0.5, tick: 5 } } } };
    const lad = advanceNpcLadder({ snapshot: f.snapshot, worldState: ws, settlementUpdates: f.settlementUpdates, tick: 5, now: null });
    const seat = lad.worldState.spatialLedgers.npcLadder.b.npcs['b:bn_seat'];
    expect(seat.bonds).toBeFalsy();
  });
});
