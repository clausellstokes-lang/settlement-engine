/**
 * habitLedger.test.js — HB-2's ledger battery.
 *
 * ⚠ THE FIXTURE CALLS THE WRITER DIRECTLY, AND THAT IS THE HONEST SHAPE RATHER THAN A
 * SHORTCUT. This wave wires NO caller, so no engine advance can reach `writeHabits` at all —
 * a "full advance" fixture would prove only that the engine does not call a function nobody
 * called. The call-path spy in `habitNeutralIdentity.test.js` pins that stronger fact
 * separately; this battery pins what the writer does once something finally calls it.
 */
import { describe, expect, test } from 'vitest';

import { HABIT_TUNING } from '../../src/domain/worldPulse/habit/habitCurve.js';
import { HABIT_LEDGER_KEY, writeHabits } from '../../src/domain/worldPulse/habit/habitLedger.js';
import { CIRCUMSTANCE_CLASSES } from '../../src/domain/worldPulse/habit/habitVocabulary.js';
import { STRATEGY_MOVES } from '../../src/domain/worldPulse/strategyMoves.js';

const LIT = Object.freeze({ habitConditioningEnabled: true });
const CLASS_A = CIRCUMSTANCE_CLASSES[0];
const CLASS_B = CIRCUMSTANCE_CLASSES[1];
const MOVE_A = STRATEGY_MOVES[0];
const MOVE_B = STRATEGY_MOVES[1];

/**
 * ⚠ PRESENCE-CHECKED RATHER THAN DEFAULTED, deliberately. A destructuring default fires on an
 * EXPLICIT `undefined` too, so `{ rules: undefined }` would have silently produced a LIT world
 * and graded the darkness cases against a fixture that was never dark.
 * @param {{rules?:unknown, weeks?:unknown, ledger?:unknown}} [spec]
 */
function worldOf(spec = {}) {
  /** @type {Record<string, unknown>} */
  const world = {
    calendar: { elapsedWeeks: 'weeks' in spec ? spec.weeks : 10 },
    simulationRules: 'rules' in spec ? spec.rules : LIT,
  };
  if ('ledger' in spec) world.spatialLedgers = { habits: spec.ledger };
  return world;
}

const credit = (actorId, className, action, stock) => ({
  actorId, circumstanceClass: className, action, stock,
});
const ledgerOf = (world) => /** @type {any} */ (world).spatialLedgers?.[HABIT_LEDGER_KEY];

describe('HB-2 — the habit sub-ledger, its one writer, and the four laws it enforces', () => {
  test('a DARK world gets the INPUT REFERENCE back — not a copy, not an equal object', () => {
    // The gate returns FIRST, before any allocation, which is what makes setSpatialLedger —
    // the call that CREATES the namespace — unreachable rather than merely unused.
    for (const rules of [undefined, {}, { habitConditioningEnabled: false }, { habitConditioningEnabled: 1 }]) {
      const world = worldOf({ rules: /** @type {any} */ (rules) });
      const next = writeHabits(world, { credits: [credit('a', CLASS_A, MOVE_A, 7000)] });
      expect(Object.is(next, world), 'a dark write must return the input reference itself').toBe(true);
      expect('spatialLedgers' in next).toBe(false);
    }
  });

  test('THE CLOCK LAW: an unresolvable clock writes NOTHING, and a resolved one stamps the real week', () => {
    for (const weeks of [undefined, null, 'twelve', Number.NaN, Number.POSITIVE_INFINITY]) {
      const world = worldOf({ weeks });
      const next = writeHabits(world, { credits: [credit('a', CLASS_A, MOVE_A, 7000)] });
      expect(
        Object.is(next, world),
        'a write that cannot resolve calendar.elapsedWeeks must write NOTHING — never a 0'
        + ' stamp, which would read as the dawn of the world and age past every sweep at once',
      ).toBe(true);
    }
    const stamped = writeHabits(worldOf({ weeks: 137 }), { credits: [credit('a', CLASS_A, MOVE_A, 7000)] });
    expect(ledgerOf(stamped).rows.a[CLASS_A][MOVE_A]).toEqual([7000, 137]);
  });

  test('TOTAL ON GARBAGE: an unusable stock resolves to ABSENT, never to a partial healing', () => {
    for (const stock of [undefined, null, 'high', Number.NaN, {}, []]) {
      const next = writeHabits(worldOf(), { credits: [credit('a', CLASS_A, MOVE_A, stock)] });
      expect(next.spatialLedgers, `a ${String(stock)} stock must leave NO row at all`).toBeUndefined();
    }
    // an unknown class is absence too — the class is validated by the vocabulary's own
    // predicate, never by comparing against a spelled name
    const unknown = writeHabits(worldOf(), { credits: [credit('a', 'not_a_class', MOVE_A, 7000)] });
    expect(unknown.spatialLedgers).toBeUndefined();
  });

  test('DROP-WHEN-NEUTRAL at FOUR levels, ending with the namespace itself', () => {
    // level 1 the neutral row · 2 the emptied class · 3 the emptied actor · 4 the sub-ledger,
    // which takes the whole spatialLedgers namespace with it when it was the last one.
    const neutral = writeHabits(worldOf(), {
      credits: [credit('a', CLASS_A, MOVE_A, HABIT_TUNING.NEUTRAL_I)],
    });
    expect(neutral.spatialLedgers).toBeUndefined();
    // the drop pass runs over the WHOLE tree, not only over rows this call touched: a world
    // that ARRIVES holding neutrals is normalized on the way out
    const arriving = worldOf({
      ledger: { rows: { a: { [CLASS_A]: { [MOVE_A]: [HABIT_TUNING.NEUTRAL_I, 1] } } }, open: {} },
    });
    const swept = writeHabits(arriving, {});
    expect(swept.spatialLedgers).toBeUndefined();
    // and a sibling sub-ledger survives, so level 4 drops the KEY and not the neighbourhood
    const withSibling = { ...worldOf(), spatialLedgers: { treaties: { t1: 1 }, habits: { rows: {}, open: {} } } };
    const kept = writeHabits(withSibling, {});
    expect(Object.keys(/** @type {any} */ (kept).spatialLedgers)).toEqual(['treaties']);
  });

  test('THE DROP-WHEN-EMPTY IDENTITY PIN, on the SUB-LEDGER and never on the worldState reference', () => {
    // ⚠⚠ A pin asserting worldState-reference identity on a no-op REDS a correct build — a lit
    // tick always allocates a world spread. The EP volume's F2 defect class, named rather than
    // re-discovered. What must be identical is the SUB-LEDGER's absence and the serialized bytes.
    const dormant = worldOf();
    const emptied = writeHabits(
      worldOf({ ledger: { rows: { a: { [CLASS_A]: { [MOVE_A]: [HABIT_TUNING.NEUTRAL_I, 1] } } }, open: {} } }),
      {},
    );
    expect(ledgerOf(emptied)).toBeUndefined();
    expect(JSON.stringify(emptied)).toBe(JSON.stringify(dormant));
  });

  test('THE JSON ROUND-TRIP THROUGH REAL SERIALIZATION — every value is a JSON scalar', () => {
    // ⚠ An in-memory probe cannot tell a shared reference from a copy. This crosses the same
    // boundary the persist-local, persist-cloud and worker-transport paths all cross.
    const world = writeHabits(worldOf(), {
      credits: [credit('a', CLASS_A, MOVE_A, 7000), credit('b', CLASS_B, MOVE_B, 3000)],
      opens: [{ pledgeId: 'p1', actorId: 'a', circumstanceClass: CLASS_A, action: MOVE_A }],
    });
    const revived = JSON.parse(JSON.stringify(world));
    expect(revived.spatialLedgers[HABIT_LEDGER_KEY]).toEqual(ledgerOf(world));
    const scalars = [];
    const walk = (value) => {
      if (Array.isArray(value)) { value.forEach(walk); return; }
      if (value && typeof value === 'object') { Object.values(value).forEach(walk); return; }
      scalars.push(typeof value);
    };
    walk(ledgerOf(world));
    expect([...new Set(scalars)].sort()).toEqual(['number', 'string']);
  });

  test('ROW EVICTION is deterministic, NEAREST-NEUTRAL, and codepoint-tiebroken', () => {
    const credits = [];
    for (let index = 0; index < 30; index += 1) {
      const className = CIRCUMSTANCE_CLASSES[index % CIRCUMSTANCE_CLASSES.length];
      const action = STRATEGY_MOVES[index % STRATEGY_MOVES.length];
      credits.push(credit('a', className, action, HABIT_TUNING.NEUTRAL_I + 100 + index * 10));
    }
    const world = writeHabits(worldOf(), { credits });
    const rows = ledgerOf(world).rows.a;
    const kept = Object.values(rows).flatMap((byAction) => Object.values(byAction));
    expect(kept.length).toBeLessThanOrEqual(HABIT_TUNING.HABIT_ROWS_PER_ACTOR_CAP);
    // the rows that SURVIVED are the ones furthest from neutral — the least learning goes first
    const survivors = kept.map(([stock]) => stock).sort((a, b) => a - b);
    const written = credits.map((row) => row.stock).sort((a, b) => a - b);
    expect(survivors).toEqual(written.slice(written.length - survivors.length));
    // and it is REPLAYABLE: the same credits in a different insertion order evict identically,
    // because insertion order is never consulted
    const shuffled = writeHabits(worldOf(), { credits: [...credits].reverse() });
    expect(JSON.stringify(ledgerOf(shuffled))).toBe(JSON.stringify(ledgerOf(world)));
  });

  test('THE PLEDGE BOOK IS FIRST-WINS, and the age sweep drops what can no longer teach', () => {
    const opened = writeHabits(worldOf({ weeks: 5 }), {
      opens: [
        { pledgeId: 'p1', actorId: 'a', circumstanceClass: CLASS_A, action: MOVE_A },
        { pledgeId: 'p1', actorId: 'b', circumstanceClass: CLASS_B, action: MOVE_B },
      ],
    });
    expect(ledgerOf(opened).open.p1[0], 'a second open on a live id must be REFUSED, never'
      + ' overwrite — a duplicated emission cannot silently re-date a running episode').toBe('a');
    // past its max age the pledge cannot pay back the decay accrued while its episode ran
    const aged = writeHabits(
      worldOf({ weeks: 5 + HABIT_TUNING.PLEDGE_MAX_AGE_WEEKS + 1, ledger: ledgerOf(opened) }),
      {},
    );
    expect(aged.spatialLedgers).toBeUndefined();
    const young = writeHabits(
      worldOf({ weeks: 5 + HABIT_TUNING.PLEDGE_MAX_AGE_WEEKS, ledger: ledgerOf(opened) }),
      {},
    );
    expect(Object.keys(ledgerOf(young).open)).toEqual(['p1']);
    // and a close removes it without waiting for the sweep
    const closed = writeHabits(worldOf({ weeks: 6, ledger: ledgerOf(opened) }), { closes: ['p1'] });
    expect(closed.spatialLedgers).toBeUndefined();
  });

  test('BOOK EVICTION is OLDEST-FIRST at the cap — the ledger\'s one silent loss, kept out of ordinary play', () => {
    const open = {};
    for (let index = 0; index < HABIT_TUNING.PLEDGE_BOOK_CAP + 5; index += 1) {
      open[`p${String(index).padStart(4, '0')}`] = ['a', CLASS_A, MOVE_A, index];
    }
    const world = writeHabits(worldOf({ weeks: 1, ledger: { rows: {}, open } }), {});
    const survivors = Object.keys(ledgerOf(world).open);
    expect(survivors.length).toBe(HABIT_TUNING.PLEDGE_BOOK_CAP);
    // the five OLDEST stamps are the five that went
    // anchored: the exact-length assertion on the line above proves the book is populated and capped, so this membership check runs against a real collection rather than an emptied one.
    expect(survivors).not.toContain('p0000');
    expect(survivors[0]).toBe('p0005');
  });

  test('AN INTERVAL COLLAPSE PRESERVES THE SUB-KEY, and the row/history mismatch is DECLARED lawful', () => {
    // `collapseIntervalHistory` composes by SPREAD and setSpatialLedger preserves every sibling
    // sub-key and its insertion order, so a collapse cannot drop this namespace.
    const world = writeHabits(worldOf({ weeks: 40 }), {
      credits: [credit('a', CLASS_A, MOVE_A, 7000), credit('a', CLASS_B, MOVE_B, 3000)],
    });
    const collapsed = { ...world, pulseHistory: [{ tick: 40 }] };
    expect(ledgerOf(collapsed)).toEqual(ledgerOf(world));
    // ⚠ THE DECLARED NON-INVARIANT, asserted as ALLOWED rather than left to inference: a
    // 52-tick advance can credit many closes behind ONE surviving history record, so ledger
    // rows need not equal pulse-history length. ⛔ A future "tidy-up" that taught collapse to
    // prune this ledger would be a STOP-and-report, not a bug fix.
    const rowCount = Object.values(ledgerOf(collapsed).rows.a)
      .reduce((sum, byAction) => sum + Object.keys(byAction).length, 0);
    expect(rowCount).toBeGreaterThan(collapsed.pulseHistory.length);
  });
});
