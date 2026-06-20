import { describe, expect, test } from 'vitest';

import {
  createLedgerEntry,
  readDispositionMultiplier,
  ratchetDisposition,
  applyDispositionDeltas,
  dispositionFactorMap,
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
  });
});
