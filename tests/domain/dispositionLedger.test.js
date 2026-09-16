import { describe, expect, test } from 'vitest';

import {
  createLedgerEntry,
  readDispositionMultiplier,
  ratchetDisposition,
  applyDispositionDeltas,
  dispositionFactorMap,
  migrateDispositionStats,
  readDispositionChannel,
  DISPOSITION_TUNING,
} from '../../src/domain/worldPulse/dispositionLedger.js';
import {
  candidateDirection,
  signedDispositionFactor,
} from '../../src/domain/worldPulse/relationshipEvolution.js';

// F4 pin: the ONE disposition ledger + the signed candidateBase multiplier. The
// load-bearing guarantee is byte-identity: an absent/net-zero entry reads EXACTLY
// 1.0, and a factor of 1.0 is a no-op in every direction branch — so a legacy
// campaign (empty ledger) is unchanged. The signed factor BOOSTS escalation and
// DAMPS de-escalation for an aggressive actor (and the reverse for a pacifist).

describe('dispositionLedger — read/multiplier', () => {
  test('absent or net-zero entry reads EXACTLY 1.0 (byte-identity anchor)', () => {
    expect(readDispositionMultiplier({}, 'a')).toBe(1.0);
    expect(readDispositionMultiplier(null, 'a')).toBe(1.0);
    expect(readDispositionMultiplier({ a: createLedgerEntry() }, 'a')).toBe(1.0);
    expect(readDispositionMultiplier({ a: { wins: 3, losses: 3, score: 0 } }, 'a')).toBe(1.0);
  });

  test('positive score ⇒ > 1.0, negative ⇒ < 1.0, both saturate within ±span', () => {
    const aggressive = readDispositionMultiplier({ a: { score: 4 } }, 'a');
    const pacifist = readDispositionMultiplier({ a: { score: -4 } }, 'a');
    expect(aggressive).toBeGreaterThan(1.0);
    expect(pacifist).toBeLessThan(1.0);
    // symmetric about 1.0
    expect(aggressive - 1).toBeCloseTo(1 - pacifist, 9);
    // saturates: a huge score never exceeds 1 + SPAN
    const maxed = readDispositionMultiplier({ a: { score: 999 } }, 'a');
    expect(maxed).toBeCloseTo(1 + DISPOSITION_TUNING.MULTIPLIER_SPAN, 9);
  });
});

describe('dispositionLedger — ratchet/accumulate', () => {
  test('ratchet accumulates immutably and bounds the score (no runaway)', () => {
    const base = {};
    const afterWin = ratchetDisposition(base, 'a', { outcome: 'win' });
    expect(base).toEqual({}); // immutable: input untouched
    expect(afterWin.a).toMatchObject({ wins: 1, losses: 0 });
    expect(afterWin.a.score).toBeGreaterThan(0);

    // a long win streak saturates at SCORE_MAX, never explodes
    let led = {};
    for (let i = 0; i < 50; i += 1) led = ratchetDisposition(led, 'a', { outcome: 'win', magnitude: 1 });
    expect(led.a.score).toBe(DISPOSITION_TUNING.SCORE_MAX);
    expect(led.a.wins).toBe(50); // counts still tally
  });

  test('wins and losses pull the score in opposite directions', () => {
    let led = ratchetDisposition({}, 'a', { outcome: 'win', magnitude: 3 });
    const afterWin = led.a.score;
    led = ratchetDisposition(led, 'a', { outcome: 'loss', magnitude: 3 });
    expect(led.a.score).toBeLessThan(afterWin);
    expect(led.a).toMatchObject({ wins: 1, losses: 1 });
  });

  test('applyDispositionDeltas is order-independent and empty ⇒ unchanged (the F4 no-op seam)', () => {
    const deltas = [
      { id: 'a', outcome: 'win', magnitude: 2 },
      { id: 'b', outcome: 'loss', magnitude: 1 },
      { id: 'a', outcome: 'win', magnitude: 1 },
    ];
    const fwd = applyDispositionDeltas({}, deltas);
    const rev = applyDispositionDeltas({}, [...deltas].reverse());
    expect(fwd).toEqual(rev); // commutative accumulation
    expect(fwd.a.score).toBeGreaterThan(0);
    expect(fwd.b.score).toBeLessThan(0);

    const ledger = { a: { score: 5, wins: 5, losses: 0 } };
    expect(applyDispositionDeltas(ledger, [])).toBe(ledger); // empty ⇒ same reference (byte-neutral)
  });

  test('same-id deltas straddling the ±SCORE_MAX clamp fold order-independently', () => {
    // Regression: clamp(clamp(x+a)+b) ≠ clamp(clamp(x+b)+a) when an intermediate
    // saturates, so an id-only sort left two same-id deltas order-dependent.
    // start=10, SCORE_MAX=12: win+5 then loss-8 = clamp(15)→12, 12-8 = 4;
    // loss-8 then win+5 = 2, +5 = 7. The signed-magnitude secondary key folds
    // the most-negative first deterministically ⇒ 7 for BOTH input orders.
    const start = { a: { score: 10, wins: 10, losses: 0 } };
    const deltas = [
      { id: 'a', outcome: 'win', magnitude: 5 },
      { id: 'a', outcome: 'loss', magnitude: 8 },
    ];
    const fwd = applyDispositionDeltas(start, deltas);
    const rev = applyDispositionDeltas(start, [...deltas].reverse());
    expect(fwd).toEqual(rev);
    expect(fwd.a.score).toBe(7);
    expect(fwd.a.wins).toBe(11);
    expect(fwd.a.losses).toBe(1);
  });
});

describe('dispositionLedger — factor map (the candidate-build read)', () => {
  test('empty / net-zero ledger ⇒ {} (legacy byte-identity)', () => {
    expect(dispositionFactorMap({})).toEqual({});
    expect(dispositionFactorMap(null)).toEqual({});
    expect(dispositionFactorMap({ a: { score: 0, wins: 2, losses: 2 } })).toEqual({});
  });

  test('only non-1.0 entries are emitted', () => {
    const map = dispositionFactorMap({ a: { score: 4 }, b: { score: 0 }, c: { score: -4 } });
    expect(Object.keys(map).sort()).toEqual(['a', 'c']);
    expect(map.a).toBeGreaterThan(1);
    expect(map.c).toBeLessThan(1);
  });
});

describe('signed candidateBase multiplier', () => {
  test('factor 1.0 (legacy) is a no-op in EVERY direction branch', () => {
    for (const dir of ['escalation', 'de_escalation', 'neutral']) {
      expect(signedDispositionFactor(1.0, dir)).toBe(1.0);
      expect(signedDispositionFactor(undefined, dir)).toBe(1.0);
    }
  });

  test('an aggressive actor BOOSTS escalation and DAMPS de-escalation (signed by intent)', () => {
    const aggressive = 1.4;
    expect(signedDispositionFactor(aggressive, 'escalation')).toBeGreaterThan(1); // boosts a raid
    expect(signedDispositionFactor(aggressive, 'de_escalation')).toBeLessThan(1); // damps a truce
    // symmetric reflection about 1.0
    expect(signedDispositionFactor(aggressive, 'escalation') + signedDispositionFactor(aggressive, 'de_escalation'))
      .toBeCloseTo(2, 9);
    // a pacifist does the reverse
    expect(signedDispositionFactor(0.6, 'escalation')).toBeLessThan(1);
    expect(signedDispositionFactor(0.6, 'de_escalation')).toBeGreaterThan(1);
  });

  test('candidateDirection classifies label changes by hostility and drifts by keyword', () => {
    // toType more hostile than current ⇒ escalation
    expect(candidateDirection('neutral_to_rival', { relationshipType: 'neutral' }, { toType: 'rival' })).toBe('escalation');
    // toType less hostile ⇒ de-escalation
    expect(candidateDirection('rival_thaw', { relationshipType: 'rival' }, { toType: 'trade_partner' })).toBe('de_escalation');
    // internal drift keyword
    expect(candidateDirection('rival_arms_race', { relationshipType: 'rival' }, {})).toBe('escalation');
    expect(candidateDirection('allied_shared_recovery', { relationshipType: 'allied' }, {})).toBe('de_escalation');
    // unknown ⇒ neutral (cannot churn legacy)
    expect(candidateDirection('some_unmapped_drift', { relationshipType: 'neutral' }, {})).toBe('neutral');
    // the trade-leverage pair classifies by documented intent (neither matched any
    // hint before, so the signed salience adjustment silently never fired):
    // an embargo weaponizes the tie; coercion is the supplier's ALTERNATIVE to war.
    expect(candidateDirection('trade_embargo_collapse', { relationshipType: 'trade_partner' }, {})).toBe('escalation');
    expect(candidateDirection('trade_dependency_coercion', { relationshipType: 'trade_partner' }, {})).toBe('de_escalation');
  });
});

/**
 * ⛔ THE FALSY-SCREEN / FINITENESS-SCREEN PIN.
 *
 * `Number(x) || 0` looks like a numeric guard and is not one: it is a FALSY screen. It
 * catches NaN, because NaN is falsy, and it MISSES ±Infinity, which is truthy. Seven
 * sites in dispositionLedger.js wore that shape, four of them on the writer side, so an
 * Infinity read as the top 'dominant' band, drove dispositionProfile's
 * `thresholdFactorOf` to its 0.8 floor — the lowest possible bar on the coalition-join
 * threshold — and then LANDED IN PERSISTED STATE, where `JSON.stringify` writes a
 * non-finite number as `null`.
 *
 * Each arm below pairs the poison with a HEALTHY anchor, because a pin that only
 * asserted "the poison reads neutral" would pass just as happily on a leaf that had
 * stopped reading wins and losses at all.
 */
describe('dispositionLedger — a non-finite win/loss count is corruption, not a record', () => {
  const HEALTHY = { wins: 3, losses: 1 };
  const POISON = [
    ['wins +Infinity', { wins: Number.POSITIVE_INFINITY, losses: 0 }],
    ['losses +Infinity', { wins: 0, losses: Number.POSITIVE_INFINITY }],
    ['wins -Infinity', { wins: Number.NEGATIVE_INFINITY, losses: 0 }],
    ['both +Infinity', { wins: Number.POSITIVE_INFINITY, losses: Number.POSITIVE_INFINITY }],
  ];

  test('a non-finite count reads NEUTRAL, while a healthy entry keeps its exact stock', () => {
    // The anchor first: the healthy read is an exact number, not a range.
    expect(readDispositionChannel(HEALTHY, 'martial').stock01).toBe(0.583333333333);
    expect(readDispositionChannel(HEALTHY, 'martial').band).toBe('settled');
    // A string count is still coerced — `finite()` replaced the falsy screen, not `Number()`.
    expect(readDispositionChannel({ wins: '3', losses: '1' }, 'martial').stock01).toBe(0.583333333333);
    for (const [label, entry] of POISON) {
      expect(readDispositionChannel(entry, 'martial').stock01, label).toBe(0.5);
      expect(readDispositionChannel(entry, 'martial').band, label).toBe('settled');
      expect(readDispositionMultiplier({ a: entry }, 'a'), label).toBe(1.0);
    }
  });

  test('no non-finite number reaches PERSISTED state, so a save round-trip is stable', () => {
    for (const [label, entry] of [...POISON, ['healthy', HEALTHY]]) {
      const out = migrateDispositionStats({ a: entry }, 0).a;
      for (const key of ['score', 'wins', 'losses']) {
        expect(Number.isFinite(out[key]), `${label}.${key}`).toBe(true);
        expect(Object.is(out[key], NaN), `${label}.${key}`).toBe(false);
      }
      // The defect's real bite: JSON writes a non-finite as `null`, so the ledger used
      // to change underneath a campaign with no event to explain it. Round-trip stable.
      expect(JSON.parse(JSON.stringify(out)), label).toEqual(out);
    }
    // Anti-vacuity: the healthy entry is not being flattened along with the poison.
    expect(migrateDispositionStats({ a: HEALTHY }, 0).a.score).toBe(2);
    expect(migrateDispositionStats({ a: HEALTHY }, 0).a.wins).toBe(3);
  });

  test('an Infinity count is not PERMANENT — one more outcome still moves it', () => {
    // `Infinity + 1` is Infinity, so before the repair a poisoned count could never be
    // corrected by any number of later outcomes. It is ordinary state again.
    for (const [label, entry] of POISON) {
      const next = ratchetDisposition({ a: entry }, 'a', { outcome: 'win' }).a;
      expect(next.wins, label).toBe(1);
      expect(next.score, label).toBe(1);
      expect(Number.isFinite(next.losses), label).toBe(true);
    }
    // The anchor: a healthy entry ratchets exactly as it always did.
    const healthyNext = ratchetDisposition({ a: HEALTHY }, 'a', { outcome: 'win' }).a;
    expect(healthyNext.wins).toBe(4);
    expect(healthyNext.score).toBe(3);
  });
});
