/**
 * envoyChanceMeetingLedger.test.js — ENC-2's pin set.
 *
 * Four things are proved here, in the order they were built:
 *   1. THE LEDGER LEAF — the two deposit ledgers, their drop passes and their readers.
 *   2. THE LADDER ADAPTER — a deposit becoming a cross-border mark, including the ORPHAN
 *      MINT that is the only road by which a chance meeting reaches a non-rung-holder.
 *   3. THE WEB'S WILLED SEAM — the tempo bypass, the flaw bypass, the `conspiracy` marker,
 *      and the two typed ends a willed leash gets in exchange for FENCE 1.
 *   4. ⛔ THE THREE FENCES, each with its UNWILLED CONTROL. The controls are the point:
 *      a fence test that never shows the world doing the thing it forbids proves nothing,
 *      so every fence here is asserted twice — the willed man is spared, and a byte-identical
 *      twin whose ONLY difference is the conspiracy word is ousted, sentenced or attributed.
 *
 * This file is also the LIT-ELIGIBLE importer that credits the `envoyChanceMeetingLedger`
 * mechanism in mechanismLitCoverage (a `*DormancyFence.test.js` name would match NON_LIT_RE
 * and credit nothing, whatever it imported).
 *
 * @enforced-by tests/property/mechanismLitCoverage.test.js
 */
import { describe, it, expect } from 'vitest';
import {
  applyMeetingMarkLedger, applyMeetingLeanLedger, readMeetingMarkEvents,
  readMeetingLeanChannels, meetingLeanKey, meetingMarkKey,
  MEETING_LEAN_BANDS, MEETING_MARK_GRAINS, MEETING_SEV_WORDS,
} from '../../src/domain/worldPulse/envoyChanceMeetingLedger.js';
import { WILLED_MEETING_CONSPIRACY, isWilledLeash, resolveLeash } from '../../src/domain/corruptionLeash.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { LADDER_TUNING, ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { advanceCorruptionWeb, CORRUPTION_WEB_TUNING } from '../../src/domain/worldPulse/corruptionWeb.js';
import { compromiseSourceOf } from '../../src/domain/worldPulse/npcVerdictTable.js';
import { advanceCauseLifecycle } from '../../src/domain/worldPulse/causeLifecycle.js';
import { ensureNpcStates, advanceNpcCorruption, npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { createPRNG } from '../../src/kernel/prng.js';

const T = LADDER_TUNING;

// ── 1. THE LEDGER LEAF ─────────────────────────────────────────────────────────

const markRow = (over = {}) => ({
  mark: 'bond', otherNid: 'b:npc_0', foreignSid: 'b', kind: 'friendship', sev: 'half', depositTick: 7, ...over,
});
const leanRow = (over = {}) => ({
  patronId: 'b', targetId: 'a', npcKey: 'a:npc_1', depositTick: 7, band: 'leaning', willed: true, ...over,
});

describe('ENC-2 the ledger leaf — the one-tick MARK deposit', () => {
  it('freezes its vocabularies (the shape is settled before the words are ruled)', () => {
    expect([...MEETING_MARK_GRAINS]).toEqual(['bond', 'grudge']);
    expect([...MEETING_SEV_WORDS]).toEqual(['half']);
    expect([...MEETING_LEAN_BANDS]).toEqual(['leaning', 'won_over']);
    expect(meetingMarkKey('a', 'a:npc_0')).toBe('a|a:npc_0');
    expect(meetingLeanKey('b', 'a', 'a:npc_1')).toBe('b|a|a:npc_1');
  });

  it('a NEVER-LIT world with no writes is byte-identical — no key, no change', () => {
    const ws = { tick: 3 };
    const out = applyMeetingMarkLedger(ws, ws, {});
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(ws);
    expect(getSpatialLedger(out.worldState, 'meetingMarkEvents')).toBe(undefined);
  });

  it('SETS the key when this tick deposited, codepoint-sorted', () => {
    const ws = {};
    const out = applyMeetingMarkLedger(ws, ws, {
      'b|b:npc_9': markRow({ otherNid: 'a:npc_0', foreignSid: 'a' }),
      'a|a:npc_0': markRow(),
    });
    expect(out.changed).toBe(true);
    expect(Object.keys(getSpatialLedger(out.worldState, 'meetingMarkEvents'))).toEqual(['a|a:npc_0', 'b|b:npc_9']);
  });

  it('⛔ LIT THEN DARKENED — the stale key is DROPPED on the very next pass (P-7)', () => {
    // The whole reason applyMeetingMarkLedger is the stage's FIRST act, ahead of the flag
    // read: a drop pass behind the flag would carry the last lit tick's deposits forever
    // and the spatial namespace could never drain.
    const lit = applyMeetingMarkLedger({}, {}, { 'a|a:npc_0': markRow() }).worldState;
    expect(getSpatialLedger(lit, 'meetingMarkEvents')).toBeTruthy();
    const darkened = applyMeetingMarkLedger(lit, lit, {});
    expect(darkened.changed).toBe(true);
    expect(getSpatialLedger(darkened.worldState, 'meetingMarkEvents')).toBe(undefined);
  });

  it('the reader is STRICT on the tick — the consume-once double guard', () => {
    const ws = applyMeetingMarkLedger({}, {}, { 'a|a:npc_0': markRow({ depositTick: 7 }) }).worldState;
    expect(readMeetingMarkEvents(ws, 7).size).toBe(1);
    expect(readMeetingMarkEvents(ws, 8).size).toBe(0);   // a replayed later tick cannot double-mint
    expect(readMeetingMarkEvents(ws, 6).size).toBe(0);
  });

  it('the reader is TOTAL on garbage — a half-written row is dropped, never half-read', () => {
    const ws = applyMeetingMarkLedger({}, {}, {
      'a|ok': markRow(),
      'a|no_kind': markRow({ kind: '' }),
      'a|no_sid': markRow({ foreignSid: '' }),
      'a|bad_grain': markRow({ mark: 'nonsense' }),
      'a|bad_sev': markRow({ sev: 0.5 }),
    }).worldState;
    expect([...readMeetingMarkEvents(ws, 7).keys()]).toEqual(['a|ok']);
  });
});

describe('ENC-2 the ledger leaf — the CARRIED lean channel', () => {
  const args = { tick: 7, ttlTicks: 52 };

  it('a never-lit world with no writes mints no key', () => {
    const ws = {};
    const out = applyMeetingLeanLedger(ws, ws, { ...args });
    expect(out.changed).toBe(false);
    expect(getSpatialLedger(out.worldState, 'meetingLeanChannels')).toBe(undefined);
  });

  it('CARRIES a row across ticks, unlike the mark ledger', () => {
    const key = meetingLeanKey('b', 'a', 'a:npc_1');
    const lit = applyMeetingLeanLedger({}, {}, { ...args, writes: { [key]: leanRow() } }).worldState;
    const later = applyMeetingLeanLedger(lit, lit, { tick: 20, ttlTicks: 52 });
    expect(readMeetingLeanChannels(later.worldState).length).toBe(1);
    expect(later.changed).toBe(false); // nothing moved ⇒ no churn of the namespace
  });

  it('a fresh write REPLACES the row — this is how leaning steps to won_over', () => {
    const key = meetingLeanKey('b', 'a', 'a:npc_1');
    const lit = applyMeetingLeanLedger({}, {}, { ...args, writes: { [key]: leanRow() } }).worldState;
    const stepped = applyMeetingLeanLedger(lit, lit, {
      tick: 20, ttlTicks: 52, writes: { [key]: leanRow({ band: 'won_over', depositTick: 20 }) },
    });
    const rows = readMeetingLeanChannels(stepped.worldState);
    expect(rows.length).toBe(1);
    expect(rows[0].band).toBe('won_over');
    expect(rows[0].depositTick).toBe(20);
  });

  it('TTL, CONVERTED and VANISHED each end a row, and the last one out drops the key', () => {
    const key = meetingLeanKey('b', 'a', 'a:npc_1');
    const lit = applyMeetingLeanLedger({}, {}, { ...args, writes: { [key]: leanRow() } }).worldState;
    // TTL — a lean nobody ever acted on lapses.
    const lapsed = applyMeetingLeanLedger(lit, lit, { tick: 7 + 53, ttlTicks: 52 });
    expect(readMeetingLeanChannels(lapsed.worldState).length).toBe(0);
    expect(getSpatialLedger(lapsed.worldState, 'meetingLeanChannels')).toBe(undefined);
    // CONVERTED — the web minted a leash for that person: the lean is spent.
    const converted = applyMeetingLeanLedger(lit, lit, { ...args, converted: new Set(['a:npc_1']) });
    expect(readMeetingLeanChannels(converted.worldState).length).toBe(0);
    // VANISHED — the person is no longer addressable.
    const vanished = applyMeetingLeanLedger(lit, lit, { ...args, vanished: new Set(['a:npc_1']) });
    expect(readMeetingLeanChannels(vanished.worldState).length).toBe(0);
  });

  it('the reader is TOTAL — a row missing a field or carrying an unruled band is dropped', () => {
    const good = meetingLeanKey('b', 'a', 'a:npc_1');
    const ws = applyMeetingLeanLedger({}, {}, {
      ...args,
      writes: {
        [good]: leanRow(),
        'b|a|bad_band': leanRow({ npcKey: 'bad_band', band: 'smitten' }),
        'b|a|no_key': leanRow({ npcKey: '' }),
        'b|a|unwilled': leanRow({ npcKey: 'unwilled', willed: false }),
      },
    }).worldState;
    expect(readMeetingLeanChannels(ws).map((r) => r.npcKey)).toEqual(['a:npc_1']);
  });
});

describe('ENC-2 the willed marker', () => {
  it('reads both grains — a resolved leash and a raw npcStates row — and is total on garbage', () => {
    expect(WILLED_MEETING_CONSPIRACY).toBe('chance_meeting');
    expect(isWilledLeash({ conspiracy: 'chance_meeting' })).toBe(true);
    expect(isWilledLeash({ corruptionLeash: { conspiracy: 'chance_meeting' } })).toBe(true);
    expect(isWilledLeash({ corruptionLeash: { conspiracy: 'foreign_web' } })).toBe(false);
    expect(isWilledLeash({})).toBe(false);
    expect(isWilledLeash(null)).toBe(false);
    expect(isWilledLeash('chance_meeting')).toBe(false);
    // Through the resolver, which is how all three fences read it.
    const willed = resolveLeash({ corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'b', conspiracy: 'chance_meeting' } } });
    expect(isWilledLeash(willed)).toBe(true);
    expect(willed.foreign).toBe(true); // still a foreign leash — only its ORIGIN differs
  });
});

// ── 2. THE LADDER ADAPTER ──────────────────────────────────────────────────────

const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };
const fkey = ladderFactionKey(guild);
function member(id, name, importance, dots, rank) {
  return { id, name, role: name, importance, dots, structuralRank: rank, factionAffiliation: "Merchants' Guild", personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' } };
}
function court(npcs) {
  return {
    name: 'Ashford', tier: 'city', population: 9000,
    powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } },
    npcs, institutions: [], activeConditions: [],
  };
}
/** One lit ladder advance with the memory weave up and an optional mark deposit. */
function ladderAdvance(settlement, { weeks = 260, tick = 260, priorLedger = null, deposits = null } = {}) {
  const spatialLedgers = {};
  if (priorLedger) spatialLedgers.npcLadder = priorLedger;
  if (deposits) spatialLedgers.meetingMarkEvents = deposits;
  const worldState = {
    simulationRules: { npcLadderEnabled: true, memoryWeaveEnabled: true },
    calendar: { elapsedWeeks: weeks },
    ...(Object.keys(spatialLedgers).length ? { spatialLedgers } : {}),
  };
  const item = { id: 'a', name: 'Ashford', settlement };
  const r = advanceNpcLadder({
    snapshot: { settlements: [item] }, worldState,
    settlementUpdates: [{ saveId: 'a', settlement }], tick, now: null,
  });
  return r.worldState?.spatialLedgers?.npcLadder?.a || null;
}

describe('ENC-2 the ladder adapter — a deposit becomes a cross-border mark', () => {
  const npcs = [
    member('n_master', 'Guildmaster Aldric', 'pillar', 3, 'dominant'),
    member('n_factor', 'Factor Maera', 'key', 2, 'subordinate'),
  ];

  it('a deposit on a RUNG-HOLDER mints a friendship carrying the counterpart court', () => {
    const rec = ladderAdvance(court(npcs), {
      deposits: { 'a|a:n_master': { mark: 'bond', otherNid: 'b:n_envoy', foreignSid: 'b', kind: 'friendship', sev: 'half', depositTick: 260 } },
    });
    const bond = rec.npcs['a:n_master'].bonds['b:n_envoy'];
    expect(bond.kind).toBe('friendship');
    expect(bond.sev).toBe(T.BOND_MINT_SEV);
    expect(bond.foreignSid).toBe('b');           // the D-7f cross-border convention
  });

  it('a deposit from ANOTHER TICK is invisible to the advance (the strict-tick guard)', () => {
    const rec = ladderAdvance(court(npcs), {
      deposits: { 'a|a:n_master': { mark: 'bond', otherNid: 'b:n_envoy', foreignSid: 'b', kind: 'friendship', sev: 'half', depositTick: 259 } },
    });
    expect(rec.npcs['a:n_master'].bonds).toBe(undefined);
  });

  it('a WEAVE-DARK world applies nothing (three doors on every mark)', () => {
    const item = { id: 'a', name: 'Ashford', settlement: court(npcs) };
    const r = advanceNpcLadder({
      snapshot: { settlements: [item] },
      worldState: {
        simulationRules: { npcLadderEnabled: true },
        calendar: { elapsedWeeks: 260 },
        spatialLedgers: { meetingMarkEvents: { 'a|a:n_master': { mark: 'bond', otherNid: 'b:n_envoy', foreignSid: 'b', kind: 'friendship', sev: 'half', depositTick: 260 } } },
      },
      settlementUpdates: [{ saveId: 'a', settlement: court(npcs) }], tick: 260, now: null,
    });
    expect(r.worldState.spatialLedgers.npcLadder.a.npcs['a:n_master'].bonds).toBe(undefined);
  });

  it('⛔ THE ORPHAN MINT — a deposit naming a NON-RUNG-HOLDER mints a standing record for him', () => {
    // Owner row 4. Standings are minted per rung-holder, and covert casting's importance-
    // INVERSE law means nearly every operative holds no rung — so without this the owner's
    // own clause would reach almost none of the people he named.
    const rec = ladderAdvance(court(npcs), {
      deposits: { 'a|a:n_spy': { mark: 'bond', otherNid: 'b:n_envoy', foreignSid: 'b', kind: 'friendship', sev: 'half', depositTick: 260 } },
    });
    expect(rec.factions[fkey].rungs).toEqual(['a:n_master', 'a:n_factor']); // he is on NO rung
    const orphan = rec.npcs['a:n_spy'];
    expect(orphan.stock).toBe(T.STAND_BASELINE);   // born at baseline — it holds nothing but the tie
    expect(orphan.goal).toBeFalsy();               // no rung ⇒ nothing to pursue
    expect(orphan.stigma).toBeFalsy();
    expect(orphan.bonds['b:n_envoy'].foreignSid).toBe('b');
  });

  it('⛔ THE ORPHAN SURVIVES THE NEXT ADVANCE ON A BOND ALONE (plant P5 guards this)', () => {
    // Before the `meaningful` bonds clause the orphan pass kept a record for a stigma or a
    // grudge but NOT for a friendship, so every tie minted for a non-rung-holder died one
    // tick after it was earned. Revert that clause and this assertion reds.
    const first = ladderAdvance(court(npcs), {
      deposits: { 'a|a:n_spy': { mark: 'bond', otherNid: 'b:n_envoy', foreignSid: 'b', kind: 'friendship', sev: 'half', depositTick: 260 } },
    });
    const second = ladderAdvance(court(npcs), { weeks: 261, tick: 261, priorLedger: { a: first } });
    expect(second.npcs['a:n_spy']).toBeTruthy();
    expect(second.npcs['a:n_spy'].bonds['b:n_envoy']).toBeTruthy();
  });

  it('and PRUNES once the tie has faded — drop-when-empty by the existing rule, not a new one', () => {
    const first = ladderAdvance(court(npcs), {
      deposits: { 'a|a:n_spy': { mark: 'bond', otherNid: 'b:n_envoy', foreignSid: 'b', kind: 'friendship', sev: 'half', depositTick: 260 } },
    });
    const manyHalfLives = 260 + T.BOND_HALF_LIFE_WEEKS * 20;
    const later = ladderAdvance(court(npcs), { weeks: manyHalfLives, tick: manyHalfLives, priorLedger: { a: first } });
    expect(later.npcs['a:n_spy']).toBe(undefined);
  });
});

// ── 3. THE WEB'S WILLED SEAM ───────────────────────────────────────────────────

const MAGISTRATE = { id: 'mag', name: 'Magistrate Oren', importance: 'key', dots: 3 }; // NO personality.flaw ⇒ flawless
const CROOK = { id: 'crook', name: 'Factor Deyl', importance: 'pillar', dots: 3, personality: { flaw: 'greedy' } };

/** A two-court world: patron `b` with a hostile edge to target `a`, whose roster holds the
 *  flawless magistrate and (optionally) a flawed alternative the default pick would prefer. */
function webWorld({ npcs, lean = null, prosperity = 'Wealthy' }) {
  const settlementA = {
    tier: 'city', institutions: [{ name: 'The Shrouded Hand', category: 'criminal' }],
    economicState: { prosperity, safetyProfile: { safetyRatio: 1, compound: { criminalEffective: 30 } } },
    powerStructure: { factions: [{ name: 'City Watch', faction: 'City Watch', power: 60 }] },
    npcs,
  };
  const settlementB = { tier: 'city', institutions: [], economicState: { prosperity: 'Wealthy' }, npcs: [] };
  const itemA = { id: 'a', settlement: settlementA };
  const itemB = { id: 'b', settlement: settlementB };
  const snapshot = {
    settlements: [itemA, itemB],
    byId: new Map([['a', itemA], ['b', itemB]]),
    regionalGraph: { edges: [{ from: 'b', to: 'a', relationshipType: 'hostile' }], channels: [] },
  };
  /** @type {Record<string, unknown>} */
  const npcStates = {};
  npcs.forEach((n, i) => { npcStates[npcId('a', n, i)] = { corruption: false, dotRank: 3, name: n.name }; });
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', corruptionWebEnabled: true },
    npcStates,
    ...(lean ? { spatialLedgers: { meetingLeanChannels: lean } } : {}),
  };
  return { worldState, snapshot };
}

const leanFor = (npcKey, depositTick = 0) => ({
  [meetingLeanKey('b', 'a', npcKey)]: { patronId: 'b', targetId: 'a', npcKey, depositTick, band: 'won_over', willed: true },
});

describe('ENC-2 the web willed seam — the meeting priced the decision, so the dice do not', () => {
  it('WITHOUT a lean, the flawless magistrate is never recruited and the tempo die defers', () => {
    // The control the willed arms are measured against: a court holding only a flawless man
    // yields no asset at all, however many ticks the web is given.
    const { worldState, snapshot } = webWorld({ npcs: [MAGISTRATE] });
    let ws = worldState;
    for (let t = 0; t < 40; t++) {
      ws = advanceCorruptionWeb({ snapshot, worldState: ws, rng: createPRNG(`ctl:${t}`), tick: t, nameFor: String }).worldState;
    }
    const key = npcId('a', MAGISTRATE, 0);
    expect(ws.npcStates[key].corruption).toBe(false);
  });

  it('⛔ A WILLED LEAN skips the tempo die, admits a FLAWLESS target, and marks the leash', () => {
    // All three willed arms of owner row 5 in one drive, on the FIRST tick — which is itself
    // the tempo-bypass proof, since the control above never mints at all.
    const key = npcId('a', MAGISTRATE, 0);
    const { worldState, snapshot } = webWorld({ npcs: [MAGISTRATE], lean: leanFor(key) });
    const out = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('willed'), tick: 1, nameFor: String });
    const st = out.worldState.npcStates[key];
    expect(out.changed).toBe(true);
    expect(st.corruption).toBe(true);
    expect(st.corruptionLeash.settlementId).toBe('b');
    expect(st.corruptionLeash.conspiracy).toBe(WILLED_MEETING_CONSPIRACY); // THE line the fences read
    expect(isWilledLeash(st)).toBe(true);
  });

  it('the lean PINS the pick — the person who was won over, not the highest-ranked one', () => {
    // CROOK is a flawed pillar and would win the default importance-ranked pick outright.
    const magKey = npcId('a', MAGISTRATE, 1);
    const { worldState, snapshot } = webWorld({ npcs: [CROOK, MAGISTRATE], lean: leanFor(magKey) });
    const out = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('pin'), tick: 1, nameFor: String });
    expect(out.worldState.npcStates[magKey].corruption).toBe(true);
    expect(out.worldState.npcStates[npcId('a', CROOK, 0)].corruption).toBe(false);
  });

  it('an UNWILLED mint still writes foreign_web — the marker is not smeared across the estate', () => {
    const crookKey = npcId('a', CROOK, 0);
    const { worldState, snapshot } = webWorld({ npcs: [CROOK] });
    let ws = worldState;
    for (let t = 0; t < 200 && ws.npcStates[crookKey].corruption !== true; t++) {
      ws = advanceCorruptionWeb({ snapshot, worldState: ws, rng: createPRNG(`unwilled:${t}`), tick: t, nameFor: String }).worldState;
    }
    expect(ws.npcStates[crookKey].corruption).toBe(true);       // anti-vacuity: the web did mint
    expect(ws.npcStates[crookKey].corruptionLeash.conspiracy).toBe('foreign_web');
    expect(isWilledLeash(ws.npcStates[crookKey])).toBe(false);
  });

  it('UPKEEP still refuses a willed pair — a poor court does not get an asset for free', () => {
    // The cap, the pair rule and upkeep are NOT bypassed: a patron that cannot afford another
    // asset does not get one because a magistrate liked its envoy. Only the TEMPO die and the
    // FLAW gate are, and only for the pinned key.
    const key = npcId('a', MAGISTRATE, 0);
    const poor = webWorld({ npcs: [MAGISTRATE], lean: leanFor(key) });
    poor.snapshot.byId.get('b').settlement.economicState = { prosperity: 'Subsistence' };
    const out = advanceCorruptionWeb({ snapshot: poor.snapshot, worldState: poor.worldState, rng: createPRNG('poor'), tick: 1, nameFor: String });
    expect(out.worldState.npcStates[key].corruption).toBe(false);
    expect(out.deferrals.some((d) => d.reason === 'upkeep_unaffordable')).toBe(true);
  });

  it('CLEAN is never relaxed — a willed pin on an ALREADY-CORRUPT person is refused', () => {
    // The flaw bypass answers "is there a hook in this man?"; it does NOT make a man who is
    // already someone else's asset available. One person, one leash.
    const key = npcId('a', MAGISTRATE, 0);
    const { worldState, snapshot } = webWorld({ npcs: [MAGISTRATE], lean: leanFor(key) });
    worldState.npcStates[key] = { corruption: true, dotRank: 3, name: MAGISTRATE.name };
    const out = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('taken'), tick: 1, nameFor: String });
    expect(out.worldState.npcStates[key].corruptionLeash).toBe(undefined);
    expect(out.deferrals.some((d) => d.reason === 'no_eligible_npc')).toBe(true);
  });
});

describe('ENC-2 the willed leash TWO TYPED ENDS (owner row 5b) — fencing is not amnesty', () => {
  /** A world holding one already-minted willed leash of the given age. */
  function leashed({ conspiracy = WILLED_MEETING_CONSPIRACY, mintedAt = 0 }) {
    const key = npcId('a', MAGISTRATE, 0);
    const { worldState, snapshot } = webWorld({ npcs: [MAGISTRATE] });
    worldState.npcStates[key] = {
      corruption: true, dotRank: 3, name: MAGISTRATE.name,
      corruptionProfile: { corrupted: true, vector: 'forbidden_patron' }, corruptionHeat: 0.3,
      corruptionLeash: { kind: 'foreign_settlement', settlementId: 'b', factionName: null, viaLocalOrg: null, conspiracy, covert: true },
      corruptionLeashTick: mintedAt,
    };
    return { worldState, snapshot, key };
  }

  it('LAPSE — a willed leash older than its window simply ends, and nothing else happens', () => {
    const { worldState, snapshot, key } = leashed({ mintedAt: 0 });
    const now = CORRUPTION_WEB_TUNING.WILLED_LAPSE_TICKS + 1;
    const out = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('lapse'), tick: now, nameFor: String });
    const st = out.worldState.npcStates[key];
    expect(st.corruption).toBe(false);
    expect(st.corruptionLeash).toBe(undefined);
    expect(st.corruptionLeashTick).toBe(undefined);
    expect(st.dotRank).toBe(3);          // a lapse costs him nothing — nobody ever found out
    expect(st.ousted).toBe(undefined);
  });

  it('an UNWILLED leash of the same age does NOT lapse (the arm is the willed one\'s alone)', () => {
    const { worldState, snapshot, key } = leashed({ conspiracy: 'foreign_web', mintedAt: 0 });
    const now = CORRUPTION_WEB_TUNING.WILLED_LAPSE_TICKS + 1;
    const out = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('lapse'), tick: now, nameFor: String });
    expect(out.worldState.npcStates[key].corruption).toBe(true);
  });

  it('DISCOVERY — severs the leash and demotes ONE rank; never ousts, never replaces', () => {
    // Drive until the keyed discovery draw lands. The point of the assertions is what does
    // NOT happen: no `ousted`, so no successor replacement and no verdict.
    const { snapshot } = leashed({});
    let found = null;
    for (let t = 1; t < 400 && !found; t++) {
      const fresh = leashed({ mintedAt: t }); // young enough that LAPSE cannot fire
      const out = advanceCorruptionWeb({ snapshot, worldState: fresh.worldState, rng: createPRNG('disc'), tick: t, nameFor: String });
      const st = out.worldState.npcStates[fresh.key];
      if (st.corruption === false) found = st;
    }
    expect(found).toBeTruthy();                 // anti-vacuity: discovery does fire
    expect(found.corruptionLeash).toBe(undefined);
    expect(found.dotRank).toBe(2);              // exactly one rank
    expect(found.factionSeat).toBe('lieutenant_operator');
    expect(found.timesExposed).toBe(1);
    expect(found.ousted).toBe(undefined);       // ⛔ never ousted — the whole of row 5b
  });

  it('a world with NO willed leash is untouched by the ends pass (byte-neutral)', () => {
    const { worldState, snapshot } = webWorld({ npcs: [MAGISTRATE] });
    const before = JSON.stringify(worldState.npcStates);
    const out = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('neutral'), tick: 5, nameFor: String });
    expect(JSON.stringify(out.worldState.npcStates)).toBe(before);
  });
});

// ── 4. ⛔ THE THREE FENCES, EACH WITH ITS UNWILLED CONTROL (plant P6) ───────────

/** A city where exposure runs hot, holding ONE corrupt NPC at the BOTTOM rank so the
 *  organic lane can reach its ousting branch. `conspiracy` is the only variable. */
function exposureWorld(conspiracy, activeConditions = []) {
  const npc = {
    id: 'mag', name: 'Magistrate Oren', importance: 'notable', dots: 1,
    personality: { flaw: 'proud' }, factionAffiliation: 'Watch', institutionId: 'inst_watch',
    corrupt: true, corruptionVector: 'forbidden_patron',
    corruptTies: { criminalInstitution: null, thievesGuild: null, leash: { kind: 'foreign_settlement', settlementId: 'b', conspiracy, covert: true } },
  };
  const settlement = {
    tier: 'city', institutions: [{ name: 'Thieves Guild' }, { name: 'City Watch' }],
    economicState: { prosperity: 'Wealthy', safetyProfile: { safetyRatio: 3, blackMarketCapture: 5, compound: { criminalEffective: 15 } } },
    npcs: [npc],
  };
  const item = { id: 'a', activeConditions, settlement };
  return { snapshot: { settlements: [item], byId: new Map([['a', item]]) }, npc, settlement };
}

/** Sixty ticks of the organic exposure lane; returns every exposure it emitted. */
function driveExposure(snapshot, seed) {
  let ws = ensureNpcStates({ npcStates: {} }, snapshot, createPRNG(`${seed}:init`).fork('init'));
  for (const id of Object.keys(ws.npcStates)) {
    ws.npcStates[id] = { ...ws.npcStates[id], corruption: true, corruptionProfile: { corrupted: true, vector: 'forbidden_patron' }, dotRank: 1 };
  }
  const base = createPRNG(`${seed}:expose`).fork('corruption');
  const exposures = [];
  for (let t = 0; t < 60; t++) {
    const r = advanceNpcCorruption(ws, snapshot, base, { tick: t });
    ws = r.worldState;
    for (const e of r.exposures) exposures.push(e);
  }
  return { ws, exposures };
}

describe('ENC-2 FENCE 1 — the organic exposure lane skips a willed leash', () => {
  it('THE CONTROL: an UNWILLED foreign leash is exposed and OUSTED by the organic lane', () => {
    // Anti-vacuity, and the whole reason the fence exists: this is the fate §881.11 closed.
    const { snapshot } = exposureWorld('foreign_web');
    const { exposures } = driveExposure(snapshot, 'unwilled');
    expect(exposures.length).toBeGreaterThan(0);
    expect(exposures.some((e) => e.kind === 'ousted')).toBe(true);
    expect(exposures.every((e) => e.foreign === true)).toBe(true);
  });

  it('⛔ THE FENCE: a WILLED leash is never exposed, never demoted, never ousted', () => {
    const { snapshot } = exposureWorld(WILLED_MEETING_CONSPIRACY);
    const { ws, exposures } = driveExposure(snapshot, 'unwilled'); // the SAME seed as the control
    expect(exposures).toEqual([]);
    const key = Object.keys(ws.npcStates)[0];
    expect(ws.npcStates[key].ousted).toBe(undefined);
    expect(ws.npcStates[key].dotRank).toBe(1);
    expect(ws.npcStates[key].corruption).toBe(true); // still leashed — fenced, not absolved
  });
});

describe('ENC-2 FENCE 2 — compromiseSourceOf never answers rival_power for a willed leash', () => {
  const npcWith = (conspiracy) => ({ corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'b', conspiracy, covert: true } } });

  it('THE CONTROL: an unwilled foreign leash reads rival_power, making turncoat ELIGIBLE', () => {
    expect(compromiseSourceOf({ npc: npcWith('foreign_web') })).toBe('rival_power');
    expect(compromiseSourceOf({ exposure: { kind: 'ousted', foreign: true } })).toBe('rival_power');
  });

  it('⛔ THE FENCE: a willed leash reads none, on BOTH the record arm and the NPC arm', () => {
    // The NPC-fallback arm is the DM verb / replayed-fixture path — it never runs the
    // exposure lane, so FENCE 1 cannot reach it and this is the only guard it has.
    expect(compromiseSourceOf({ npc: npcWith(WILLED_MEETING_CONSPIRACY) })).toBe('none');
    expect(compromiseSourceOf({
      npc: npcWith(WILLED_MEETING_CONSPIRACY),
      exposure: { kind: 'ousted', foreign: true },
    })).toBe('none');
  });
});

describe('ENC-2 FENCE 3 — the cause pass never attributes a willed compromise', () => {
  /** The cause pass over one corrupt NPC. `seeded` carries a PRIOR ledger so the pass is
   *  entered through `causeLifecycle !== undefined` — the OR arm the design's own fence at
   *  pulseKernel's gate could never close. */
  function causeRun(conspiracy) {
    // A live FAMINE makes the `depleted` cause class PRESENT, so the pass has something real
    // to attribute. Without a present cause it attributes nothing to ANYONE and the control
    // would be vacuous — a fence proved against a world that never does the thing.
    const { snapshot } = exposureWorld(conspiracy, [{ archetype: 'famine' }]);
    const key = npcId('a', snapshot.settlements[0].settlement.npcs[0], 0);
    return advanceCauseLifecycle({
      snapshot,
      worldState: {
        npcStates: { [key]: { corruption: true, roleArchetype: 'civic' } },
        causeLifecycle: { other: {} },
        simulationRules: {},
      },
      priorLedger: null,
      rng: createPRNG('cause'),
      tick: 12,
    });
  }

  it('THE CONTROL: an unwilled compromise IS attributed a settlement cause', () => {
    const out = causeRun('foreign_web');
    expect(Object.keys(out.causeLifecycleByCid || {}).length).toBeGreaterThan(0);
  });

  it('⛔ THE FENCE: a willed compromise is attributed nothing, even on the OR arm', () => {
    const out = causeRun(WILLED_MEETING_CONSPIRACY);
    expect(Object.keys(out.causeLifecycleByCid || {})).toEqual([]);
    expect(out.events).toEqual([]);
  });
});
