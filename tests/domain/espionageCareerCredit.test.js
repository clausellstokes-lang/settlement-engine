/**
 * espionageCareerCredit.test.js — ES-5d: the mission credit's leaf pins and its FULL
 * deposit lifecycle.
 *
 * Acceptance cases A1, A3, A4 and A6. A2/A5/A7/A8 live in
 * tests/property/espionageCareerCreditDormancy.test.js.
 *
 * ── ⚠ NO BARE NEGATIVES ANYWHERE IN THIS FILE, BY CONSTRUCTION ───────────────────────
 * This file is NEW, so `negativeAssertionAnchor.walker` gives it a hard un-anchored ceiling
 * of ZERO. Rather than annotate sites one at a time, every absence claim below is written as
 * an EQUALITY over a collection the test itself produced — `Object.keys(...)` compared with
 * `toEqual([])`, a stock compared with a control run's stock — so none of the three scanned
 * matchers (`not.toContain` / `not.toMatch` / `not.toHaveProperty`) appears at all. That is
 * ES-5c's precedent in its sibling file, and it is strictly stronger than an annotation: an
 * equality over a live collection cannot go vacuous when the collection empties, because the
 * emptiness IS what it measures against a positive control taken on the same fixture.
 *
 * ── ⭐ EVERY "NOTHING HAPPENED" CLAIM CARRIES A LIVE POSITIVE CONTROL ────────────────
 * The recorded way a pin like this ships vacuous is that the producer was never reachable on
 * the fixture at all, so "no credit" reads green for the wrong reason. Every refusal below is
 * measured against a run on the SAME fixture that DOES deposit and DOES move stock, so the
 * refusal is the guard's doing rather than the fixture's.
 */
import { describe, expect, it } from 'vitest';

import {
  CAREER_CREDIT_TUNING,
  depositMissionCredits,
  readMissionCreditEvents,
} from '../../src/domain/worldPulse/espionage/espionageCareerCredit.js';
import { MISSION_GRADES } from '../../src/domain/worldPulse/espionage/espionageMath.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { LADDER_TUNING, ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';

const TICK = 260;
const SID = 'a';
const OPERATIVE_ID = 'n_master';
const NID = `${SID}:${OPERATIVE_ID}`;
const ERRAND = 'errand.1';

const guild = { name: "Merchants' Guild", isGoverning: true, power: 60 };
const FKEY = ladderFactionKey(guild);

/** A roster entry the ladder will seat, shaped exactly as the ladder's own battery shapes it. */
function person(id, name, importance = 'pillar', dots = 3, rank = 'dominant') {
  return {
    id,
    name,
    role: name,
    importance,
    dots,
    structuralRank: rank,
    factionAffiliation: guild.name,
    personality: { dominant: 'shrewd', flaw: 'proud', modifier: 'bold' },
  };
}

const OPERATIVE = person(OPERATIVE_ID, 'Guildmaster Aldric');
const BENCH = person('n_factor', 'Factor Maera', 'key', 2, 'subordinate');

function court(roster) {
  return {
    name: 'Ashford',
    tier: 'city',
    population: 9000,
    powerStructure: { factions: [guild], publicLegitimacy: { score: 55 } },
    npcs: roster,
    institutions: [],
    activeConditions: [],
  };
}

/**
 * A lit world. `espionageEnabled` needs `errandSpineEnabled` under it (the gate's door 2) and
 * beliefs live, so the lit set is spelled once here and never re-typed per test.
 * @param {{ ladder?: boolean, espionage?: boolean, credits?: Record<string, unknown>|null,
 *   ladderLedger?: Record<string, unknown>|null }} [options]
 */
function world({ ladder = true, espionage = true, credits = null, ladderLedger = null } = {}) {
  const ledgers = {
    ...(ladderLedger ? { npcLadder: ladderLedger } : {}),
    ...(credits ? { missionCreditEvents: credits } : {}),
  };
  return {
    tick: TICK,
    spatialCanonVersion: 1,
    calendar: { elapsedWeeks: TICK },
    simulationRules: {
      infoMode: 'full',
      ...(ladder ? { npcLadderEnabled: true } : {}),
      ...(espionage ? { errandSpineEnabled: true, espionageEnabled: true } : {}),
    },
    ...(Object.keys(ledgers).length ? { spatialLedgers: ledgers } : {}),
  };
}

/** One landing receipt, in exactly the shape `landOne` hands back. */
function landing({ grade, errandId = ERRAND, observerId = SID }) {
  return { errandId, observerId, grade, product: 'confirm', world: 'magic', reason: 'landed' };
}

/** Drive the deposit writer over one landing set. */
function deposit({ grade = 'met', operatives = new Map([[ERRAND, OPERATIVE]]), rows = null, ...rest } = {}) {
  return depositMissionCredits({
    worldState: world(rest),
    tick: TICK,
    landings: rows ?? [landing({ grade })],
    operatives,
  });
}

/** The credit ledger a world carries, as a plain record (`{}` when the key is absent). */
const creditsOf = (worldState) => worldState?.spatialLedgers?.missionCreditEvents ?? {};

/**
 * ONE REAL LADDER ADVANCE. Drives `advanceNpcLadder` itself — never a hand-stamped standing —
 * so the fold under test is the one a running world executes.
 * @param {{ credits?: Record<string, unknown>|null, ladderLedger?: Record<string, unknown>|null,
 *   ladder?: boolean, tick?: number, roster?: Array<Record<string, unknown>> }} [options]
 */
function ladderAdvance({ credits = null, ladderLedger = null, ladder = true, tick = TICK, roster = [OPERATIVE, BENCH] } = {}) {
  const settlement = court(roster);
  const item = { id: SID, name: 'Ashford', settlement };
  const result = advanceNpcLadder({
    snapshot: { settlements: [item], byId: new Map([[SID, item]]) },
    worldState: world({ ladder, credits, ladderLedger }),
    settlementUpdates: [{ saveId: SID, settlement }],
    tick,
    now: null,
  });
  return { result, rec: result.worldState?.spatialLedgers?.npcLadder?.[SID] ?? null };
}

const stockOf = (rec, nid = NID) => rec?.npcs?.[nid]?.stock;

describe('ES-5d A1 — a graded mission deposits under the operative nid, and the ladder folds it', () => {
  it('deposits exactly one record, keyed by the ladder nid, stamped with THIS tick', () => {
    const out = deposit({ grade: 'met' });
    expect(out.changed, 'a credited landing on a lit world must write').toBe(true);
    expect(Object.keys(creditsOf(out.worldState))).toEqual([NID]);
    expect(creditsOf(out.worldState)[NID]).toEqual({
      credit: 0.15, depositTick: TICK, grade: 'met',
    });
  });

  it('⭐ THE REACH IS THE CLAIM: the ladder\'s own writer raises that standing by exactly the credit', () => {
    // The CONTROL and the TREATMENT differ in exactly one thing: whether the deposit is there.
    const bare = ladderAdvance();
    const credited = ladderAdvance({ credits: creditsOf(deposit({ grade: 'met' }).worldState) });
    const before = stockOf(bare.rec);
    const after = stockOf(credited.rec);
    expect(typeof before, 'the fixture seats no standing at all — every claim here would be vacuous')
      .toBe('number');
    // Exactly the credit, and round4-clean: a drift here is the clamp/rounding contract moving.
    expect(after - before).toBeCloseTo(0.15, 10);
    expect(after).toBe(Number(after.toFixed(4)));
    // …and the man who flew no mission is untouched on the very same advance, which is what
    // makes the rise the CREDIT's doing rather than the two runs differing for any reason.
    expect(stockOf(credited.rec, `${SID}:n_factor`)).toBe(stockOf(bare.rec, `${SID}:n_factor`));
  });

  it('an `exceeded` mission pays exactly twice a `met` one, and both stay inside the stock ceiling', () => {
    const met = creditsOf(deposit({ grade: 'met' }).worldState)[NID].credit;
    const exceeded = creditsOf(deposit({ grade: 'exceeded' }).worldState)[NID].credit;
    expect(exceeded).toBeCloseTo(met * 2, 10);
    expect(exceeded).toBeLessThan(LADDER_TUNING.STAND_MAX);
  });
});

describe('ES-5d A3 — the credited set is DERIVED from the frozen grade export, and the refusal is anchored', () => {
  it('the multiplier map\'s key set IS `MISSION_GRADES` — never re-typed, so a fifth grade cannot escape', () => {
    expect(Object.keys(CAREER_CREDIT_TUNING.GRADE_MULTIPLE).sort())
      .toEqual([...MISSION_GRADES].sort());
  });

  it('every grade is driven: `exceeded`/`met` credit, `partial`/`empty` deposit NOTHING', () => {
    /** @type {Record<string, string[]>} */
    const keysByGrade = {};
    for (const grade of MISSION_GRADES) {
      keysByGrade[grade] = Object.keys(creditsOf(deposit({ grade }).worldState));
    }
    // THE LIVE POSITIVE CONTROLS sit in the same object as the refusals, on the same fixture
    // and the same operative, so an empty list below is the guard refusing rather than the
    // producer being unreachable.
    expect(keysByGrade).toEqual({
      empty: [], exceeded: [NID], met: [NID], partial: [],
    });
  });

  it('a refused grade leaves the operative\'s stock BYTE-IDENTICAL to the no-mission control', () => {
    const bare = ladderAdvance();
    const refused = ladderAdvance({ credits: creditsOf(deposit({ grade: 'partial' }).worldState) });
    const credited = ladderAdvance({ credits: creditsOf(deposit({ grade: 'met' }).worldState) });
    expect(JSON.stringify(refused.rec)).toBe(JSON.stringify(bare.rec));
    // …and the SAME comparison on a credited grade really does move, so the identity above is
    // a measurement and not a reading of a feature that never fires.
    expect(JSON.stringify(credited.rec) === JSON.stringify(bare.rec)).toBe(false);
  });

  it('NOTHING DEBITS: no grade in the frozen export can produce a negative credit', () => {
    const credits = MISSION_GRADES.map((grade) => {
      const row = creditsOf(deposit({ grade }).worldState)[NID];
      return row ? row.credit : 0;
    });
    expect(credits.every((c) => Number.isFinite(c) && c >= 0)).toBe(true);
    expect(credits.some((c) => c > 0), 'no grade credits at all — the map is dead').toBe(true);
  });
});

describe('ES-5d A4 — sparse and malformed inputs credit ZERO, and never wrongly', () => {
  it('no landings at all ⇒ no key, no change, and the world comes back BY REFERENCE', () => {
    const base = world();
    const out = depositMissionCredits({ worldState: base, tick: TICK, landings: [], operatives: new Map() });
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(base);
  });

  it('an unresolvable operative, an ID-LESS operative, and an unnamed home each credit NOTHING', () => {
    const idless = { name: 'A Nameless Reeve', role: 'reeve' };
    const arms = {
      // the closure found nobody — the man is not in the roster the errand was cast from
      unresolved: deposit({ operatives: new Map() }),
      // ⛔ CR-ES5D O8: no resolvable ladder identity ⇒ NO CREDIT, silently. Keying him under
      // a name-derived nid would credit THE WRONG MAN.
      idless: deposit({ operatives: new Map([[ERRAND, idless]]) }),
      // a landing whose observerId names no settlement id at all
      homeless: deposit({ rows: [landing({ grade: 'met', observerId: '' })] }),
      // an errandId the operatives map has never heard of
      mismatched: deposit({ operatives: new Map([['errand.other', OPERATIVE]]) }),
    };
    expect(Object.fromEntries(
      Object.entries(arms).map(([name, out]) => [name, Object.keys(creditsOf(out.worldState))]),
    )).toEqual({ unresolved: [], idless: [], homeless: [], mismatched: [] });
    // THE ANCHOR: the same call shape with a resolvable, id-bearing operative DOES deposit.
    expect(Object.keys(creditsOf(deposit({ grade: 'met' }).worldState))).toEqual([NID]);
  });

  it('an id-less operative NEVER throws and NEVER falls back to a default identity', () => {
    // Both halves of O8 in one claim: the call completes, and the ledger gained no key under
    // any spelling — not a name-derived one, not an empty one.
    const out = deposit({ operatives: new Map([[ERRAND, { name: 'Nobody' }]]) });
    expect(Object.keys(creditsOf(out.worldState))).toEqual([]);
    expect(out.changed).toBe(false);
  });

  it('an operative who holds NO rung deposits normally and the ladder simply never spends it', () => {
    // The deposit writer knows nothing about rungs — that asymmetry is deliberate, and this
    // pins that an unspendable credit is inert rather than an error or a stray key.
    const credits = creditsOf(deposit({ grade: 'met' }).worldState);
    const bench = ladderAdvance({ credits, roster: [BENCH] });
    const control = ladderAdvance({ credits: null, roster: [BENCH] });
    expect(JSON.stringify(bench.rec)).toBe(JSON.stringify(control.rec));
  });

  it('NEVER NaN: a malformed tick and a malformed credit row are both refused, not propagated', () => {
    expect(depositMissionCredits({
      worldState: world(), tick: Number.NaN, landings: [landing({ grade: 'met' })],
      operatives: new Map([[ERRAND, OPERATIVE]]),
    }).changed).toBe(false);
    // A forged row carrying a poisoned credit is dropped by the READ rather than folded.
    const forged = ladderAdvance({ credits: { [NID]: { credit: 'lots', depositTick: TICK, grade: 'met' } } });
    const control = ladderAdvance();
    expect(stockOf(forged.rec)).toBe(stockOf(control.rec));
    expect(Number.isFinite(stockOf(forged.rec))).toBe(true);
  });
});

describe('ES-5d A6 — the FULL deposit lifecycle: write → persist → read → fold → PRUNE', () => {
  it('the record survives a REAL serialization round trip and reads back identically', () => {
    const written = deposit({ grade: 'met' }).worldState;
    // LIFECYCLE — persist: through real JSON, never an in-memory probe (an in-memory compare
    // cannot tell a shared reference from a copy).
    const reloaded = JSON.parse(JSON.stringify(written));
    expect(JSON.stringify(creditsOf(reloaded))).toBe(JSON.stringify(creditsOf(written)));
    const live = readMissionCreditEvents(written, TICK);
    const round = readMissionCreditEvents(reloaded, TICK);
    expect([...round.entries()]).toEqual([...live.entries()]);
    expect([...live.keys()]).toEqual([NID]);
    expect(live.get(NID)).toEqual({ grade: 'met', credit: 0.15 });
  });

  it('⛔ THE PRUNE: a second pass with no new mission DROPS the key entirely (and the namespace with it)', () => {
    const written = deposit({ grade: 'met' }).worldState;
    expect(Object.keys(creditsOf(written))).toEqual([NID]);
    // The next pulse's deposit pass, with nothing to credit. Prior records are ALWAYS
    // replaced — this is the arm that fails SILENTLY if the prune is ever forgotten, because
    // the strict-tick window would keep the fold looking correct while the ledger grew.
    const pruned = depositMissionCredits({
      worldState: written, tick: TICK + 1, landings: [], operatives: new Map(),
    });
    expect(pruned.changed).toBe(true);
    expect(Object.keys(creditsOf(pruned.worldState))).toEqual([]);
    // drop-when-empty reaches the NAMESPACE too: the world is byte-identical to one that
    // never carried a credit at all.
    expect(JSON.stringify(pruned.worldState)).toBe(JSON.stringify(world()));
  });

  it('IDEMPOTENT: the credit moves stock ONCE — a second advance over the pruned world does not move it again', () => {
    const written = deposit({ grade: 'met' }).worldState;
    const first = ladderAdvance({ credits: creditsOf(written) });
    const banked = stockOf(first.rec);
    // Tick T+1 with the ledger PRUNED: the standing carries the banked credit forward through
    // its ordinary decay and gains nothing further — it may only fall, never rise again.
    const second = ladderAdvance({ credits: null, ladderLedger: { [SID]: first.rec }, tick: TICK + 1 });
    expect(stockOf(second.rec)).toBeLessThanOrEqual(banked);
    // THE ANCHOR, and it is what stops the line above being a reading of a dead reader: the SAME
    // T+1 advance handed a FRESH T+1 deposit really does rise above the banked value, so "did
    // not move again" measures the prune rather than a fold that never fires at T+1.
    const refreshed = ladderAdvance({
      credits: { [NID]: { credit: 0.15, depositTick: TICK + 1, grade: 'met' } },
      ladderLedger: { [SID]: first.rec },
      tick: TICK + 1,
    });
    expect(stockOf(refreshed.rec)).toBeGreaterThan(stockOf(second.rec));
  });

  it('⛔ A STALE deposit is NEVER consumed — the strict tick window is the consume-once guarantee', () => {
    const stale = { [NID]: { credit: 0.15, depositTick: TICK - 1, grade: 'met' } };
    const future = { [NID]: { credit: 0.15, depositTick: TICK + 1, grade: 'met' } };
    const fresh = { [NID]: { credit: 0.15, depositTick: TICK, grade: 'met' } };
    const control = ladderAdvance();
    expect(stockOf(ladderAdvance({ credits: stale }).rec)).toBe(stockOf(control.rec));
    expect(stockOf(ladderAdvance({ credits: future }).rec)).toBe(stockOf(control.rec));
    // THE ANCHOR: the SAME record at THIS tick really is consumed, so the two refusals above
    // measure the window rather than a reader that never fires.
    expect(stockOf(ladderAdvance({ credits: fresh }).rec)).toBeGreaterThan(stockOf(control.rec));
    // …and the pure read agrees, arm by arm.
    expect([...readMissionCreditEvents({ spatialLedgers: { missionCreditEvents: stale } }, TICK).keys()]).toEqual([]);
    expect([...readMissionCreditEvents({ spatialLedgers: { missionCreditEvents: fresh } }, TICK).keys()]).toEqual([NID]);
  });

  it('MIGRATE: a legacy world carrying no key at all reads as an empty Map, never a throw', () => {
    expect([...readMissionCreditEvents({}, TICK).keys()]).toEqual([]);
    expect([...readMissionCreditEvents(null, TICK).keys()]).toEqual([]);
    expect([...readMissionCreditEvents(world(), TICK).keys()]).toEqual([]);
    // …and a world whose ledger namespace exists but holds other keys is equally inert.
    expect([...readMissionCreditEvents({ spatialLedgers: { beliefMaps: {} } }, TICK).keys()]).toEqual([]);
  });

  it('the ledger is CODEPOINT-SORTED on both sides, so two operatives land byte-stably', () => {
    const second = person('n_factor', 'Factor Maera', 'key', 2, 'subordinate');
    const out = depositMissionCredits({
      worldState: world(),
      tick: TICK,
      // fed in DESCENDING key order on purpose: the write must not preserve arrival order
      landings: [landing({ grade: 'met', errandId: 'e2' }), landing({ grade: 'exceeded', errandId: 'e1' })],
      operatives: new Map([['e2', second], ['e1', OPERATIVE]]),
    });
    expect(Object.keys(creditsOf(out.worldState))).toEqual([`${SID}:n_factor`, NID]);
  });

  it('AT MOST ONE CREDIT PER OPERATIVE PER TICK, and the larger grade wins regardless of order', () => {
    const both = (order) => depositMissionCredits({
      worldState: world(),
      tick: TICK,
      landings: order,
      operatives: new Map([['e1', OPERATIVE], ['e2', OPERATIVE]]),
    });
    const ascending = both([landing({ grade: 'met', errandId: 'e1' }), landing({ grade: 'exceeded', errandId: 'e2' })]);
    const descending = both([landing({ grade: 'exceeded', errandId: 'e2' }), landing({ grade: 'met', errandId: 'e1' })]);
    expect(Object.keys(creditsOf(ascending.worldState))).toEqual([NID]);
    expect(creditsOf(ascending.worldState)[NID].credit).toBeCloseTo(0.3, 10);
    // ORDER-FREE: the same two landings fed the other way round produce the same bytes.
    expect(JSON.stringify(creditsOf(descending.worldState)))
      .toBe(JSON.stringify(creditsOf(ascending.worldState)));
  });
});
