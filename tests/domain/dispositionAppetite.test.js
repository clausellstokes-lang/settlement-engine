/**
 * dispositionAppetite.test.js — SP-C's writer half: the appetite facet on the disposition
 * ledger (docs/DESIGN_FP_ARCH_SP.md §4, §SP-C).
 *
 * WHAT COULD GO QUIETLY VACUOUS HERE, and where each shape is guarded:
 *
 *  • THE DEAD-ARM CLASS. A learn-rate table with an unreachable family is a number the
 *    owner signs at the soak redo and no world can ever produce. Every family below is
 *    driven through the REAL writer and its rate is measured off the resulting stock,
 *    and the lesson map is asserted to be a PARTITION of the ledger's own closed source
 *    vocabulary in both directions — so a fourteenth source kind cannot land
 *    unclassified and quietly teach nothing.
 *
 *  • THE RATCHET. A stock that only ever rises makes every court in a long campaign
 *    fearless. THE REVERSAL PIN drives wins and then losses through the real writer and
 *    watches the stock cross neutral in BOTH directions; the decay half is proven to be
 *    `bandedStock.decayTowardNeutral` by comparing against that function itself rather
 *    than against a transcribed expectation.
 *
 *  • THE TWO DOORS. The gate is a conjunction and a test that only drops the second door
 *    proves nothing about the first — the recorded defense-in-depth defect. Each door is
 *    dropped ALONE below, with the other lit.
 *
 *  • THE ERASURE. The legacy (dark-channels) writer REBUILDS an entry rather than
 *    spreading it. A campaign lit, then darkened while ordinary outcomes continue, would
 *    lose the learned appetite. Pinned directly against that writer.
 */
import { describe, expect, it } from 'vitest';

import {
  APPETITE_BAND_LADDER,
  APPETITE_STOCK_KIND,
  APPETITE_TUNING,
  DISPOSITION_SOURCE_KINDS,
  advanceDispositionChannels,
  appetiteCrossingOf,
  dispositionBandOf,
  ratchetDisposition,
  readDispositionAppetite,
} from '../../src/domain/worldPulse/dispositionLedger.js';
import { HALF_LIFE_BANDS, decayTowardNeutral } from '../../src/domain/worldPulse/bandedStock.js';

const LIT = Object.freeze({ enabled: true, appetiteEnabled: true, tick: 0 });
const NEUTRAL = APPETITE_TUNING.NEUTRAL_STOCK01;

/** One outcome delta. Channel defaults to martial exactly as the writer's own law says. */
const delta = (id, outcome, sourceKind, magnitude = 1) => ({ id, outcome, sourceKind, magnitude });

/** Run the real writer once and hand back the entry for `id`. */
const advance = (ledger, deltas, options) =>
  advanceDispositionChannels(ledger, deltas, options).ledger;

/** An entry carrying a planted facet, as a persisted save would. */
const withAppetite = (stock01, updatedTick = 0) => ({
  wins: 0,
  losses: 0,
  score: 0,
  updatedTick,
  appetite: { stock01, band: dispositionBandOf(stock01), updatedTick },
});

describe('SP-C — the lesson map is a partition of the ledger\'s own source vocabulary', () => {
  it('every source kind is classified exactly once: three families or the silent set', () => {
    const families = APPETITE_TUNING.LESSON_FAMILIES;
    const taught = Object.values(families).flatMap((kinds) => [...kinds]);
    const silent = [...APPETITE_TUNING.SILENT_SOURCE_KINDS];
    // FORWARD: nothing is classified that the ledger does not speak.
    for (const kind of [...taught, ...silent]) {
      expect(DISPOSITION_SOURCE_KINDS, `${kind} is classified but is not a source kind`).toContain(kind);
    }
    // REVERSE: nothing the ledger speaks is left unclassified — this is the direction
    // that reds when a fourteenth kind lands and nobody decides what it teaches.
    expect([...taught, ...silent].sort()).toEqual([...DISPOSITION_SOURCE_KINDS].sort());
    // AND EXACTLY ONCE: a kind in two families would be taught at two rates.
    expect(new Set([...taught, ...silent]).size).toBe(DISPOSITION_SOURCE_KINDS.length);
    // anchored: the vocabulary is asserted non-trivial here, so an emptied source list
    // could not make the three equalities above pass vacuously.
    expect(DISPOSITION_SOURCE_KINDS.length).toBeGreaterThanOrEqual(13);
  });

  it('every family has a rate, and every rate has a family', () => {
    expect(Object.keys(APPETITE_TUNING.LEARN_RATES).sort())
      .toEqual(Object.keys(APPETITE_TUNING.LESSON_FAMILIES).sort());
    for (const rate of Object.values(APPETITE_TUNING.LEARN_RATES)) {
      expect(rate).toBeGreaterThan(0);
      expect(rate).toBeLessThan(1);
    }
  });

  it('the half-life is CHOSEN from the shared ladder — this wave authors no decay law', () => {
    expect(HALF_LIFE_BANDS).toContain(APPETITE_TUNING.HALF_LIFE_BAND);
    expect(APPETITE_BAND_LADDER).toEqual(APPETITE_TUNING.BAND_LADDER);
    // THE LADDER IS BORROWED, NOT MINTED, and this proves it against the borrowed
    // authority rather than against a transcription: reading dispositionBandOf at the
    // midpoint of each rung must reproduce the ladder in order.
    expect(APPETITE_BAND_LADDER.length).toBe(5);
    expect(APPETITE_BAND_LADDER.map((_word, i) => dispositionBandOf(i * 0.2 + 0.1)))
      .toEqual([...APPETITE_BAND_LADDER]);
  });
});

describe('SP-C — every learn rate is REACHABLE through the real writer', () => {
  for (const [family, kinds] of Object.entries(APPETITE_TUNING.LESSON_FAMILIES)) {
    it(`the ${family} family teaches at its authored rate, from a real delta`, () => {
      const rate = /** @type {Record<string, number>} */ (APPETITE_TUNING.LEARN_RATES)[family];
      for (const kind of kinds) {
        const next = advance({}, [delta('a', 'win', kind)], LIT);
        const read = readDispositionAppetite(next.a);
        expect(read.present, `${kind} wrote no facet`).toBe(true);
        expect(read.stock01, `${kind} did not teach at the ${family} rate`).toBeCloseTo(NEUTRAL + rate, 10);
      }
    });
  }

  it('the SILENT kind teaches nothing at all, while still moving the channels', () => {
    for (const kind of APPETITE_TUNING.SILENT_SOURCE_KINDS) {
      const next = advance({}, [delta('a', 'win', kind)], LIT);
      expect(readDispositionAppetite(next.a).present, `${kind} taught an appetite`).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(next.a, 'appetite')).toBe(false);
      // anchored: the same delta IS a real outcome — it moved the martial channel — so
      // the absence above is a classification fact and not an inert fixture.
      expect(next.a.channels.martial.stock01).toBeGreaterThan(NEUTRAL);
    }
  });

  it('a court with no teaching outcome grows NO key (silence writes nothing)', () => {
    const next = advance({}, [], { ...LIT, tick: 5 });
    expect(next).toEqual({});
    const seeded = advance({ a: { wins: 0, losses: 0, score: 0 } }, [], { ...LIT, tick: 5 });
    expect(Object.prototype.hasOwnProperty.call(seeded.a, 'appetite')).toBe(false);
  });
});

describe('SP-C — THE REVERSAL PIN: courage is not a ratchet', () => {
  it('wins carry the stock above neutral and losses carry it back across', () => {
    let ledger = {};
    for (let i = 0; i < 4; i += 1) {
      ledger = advance(ledger, [delta('a', 'win', 'war_resolution')], { ...LIT, tick: i });
    }
    const risen = readDispositionAppetite(ledger.a);
    expect(risen.stock01).toBeGreaterThan(NEUTRAL);

    for (let i = 4; i < 12; i += 1) {
      ledger = advance(ledger, [delta('a', 'loss', 'war_resolution')], { ...LIT, tick: i });
    }
    const fallen = readDispositionAppetite(ledger.a);
    expect(fallen.stock01, 'the stock never crossed back below neutral — a courage ratchet')
      .toBeLessThan(NEUTRAL);
    // Both directions observed on ONE court, which is what makes this a reversal rather
    // than two independent one-way runs.
    expect((risen.stock01 - NEUTRAL) * (fallen.stock01 - NEUTRAL)).toBeLessThan(0);
  });

  it('decay alone only ever approaches neutral, on the SHARED shape', () => {
    const halfLife = APPETITE_TUNING.HALF_LIFE_BAND;
    const ledger = advance({ a: withAppetite(0.9, 0) }, [], { ...LIT, tick: 156 });
    const expected = decayTowardNeutral(0.9, NEUTRAL, 156, halfLife);
    // Compared against bandedStock's OWN function, so a second decay law cannot be
    // written here and pass by matching a transcribed number.
    expect(readDispositionAppetite(ledger.a).stock01).toBeCloseTo(expected, 10);
    expect(readDispositionAppetite(ledger.a).stock01).toBeLessThan(0.9);
    expect(readDispositionAppetite(ledger.a).stock01).toBeGreaterThan(NEUTRAL);

    // ...and from below, so the anti-ratchet claim is not a one-sided reading.
    const fromBelow = advance({ a: withAppetite(0.1, 0) }, [], { ...LIT, tick: 156 });
    expect(readDispositionAppetite(fromBelow.a).stock01).toBeGreaterThan(0.1);
    expect(readDispositionAppetite(fromBelow.a).stock01).toBeLessThan(NEUTRAL);
  });

  it('decay anchors on the FACET\'s own tick, so a dark interval is really forgotten', () => {
    // The entry's own updatedTick has advanced to 200 while the facet sat at 0: a
    // campaign whose channels stayed lit while SP-C was dark. Relighting must forget the
    // whole interval rather than reading age zero off the entry.
    const entry = { ...withAppetite(0.9, 0), updatedTick: 200 };
    const ledger = advance({ a: entry }, [], { ...LIT, tick: 200 });
    expect(readDispositionAppetite(ledger.a).stock01)
      .toBeCloseTo(decayTowardNeutral(0.9, NEUTRAL, 200, APPETITE_TUNING.HALF_LIFE_BAND), 10);
    expect(ledger.a.appetite.updatedTick).toBe(200);
  });
});

describe('SP-C — the gate is a conjunction and each door is dropped ALONE', () => {
  const deltas = [delta('a', 'win', 'war_resolution')];

  it('DOOR 1 dark (channels), door 2 lit: nothing is written', () => {
    const next = advance({}, deltas, { enabled: false, appetiteEnabled: true, tick: 0 });
    // The very next assertion proves this ledger is NON-EMPTY and recorded the outcome.
    // anchored: the score pin below makes this a live subject, not an empty one.
    expect(JSON.stringify(next)).not.toContain('appetite');
    // anchored: the legacy arm still recorded the outcome, so the absence is the door's
    // doing and not an inert delta.
    expect(next.a.score).toBe(1);
  });

  it('DOOR 2 dark (the flag), door 1 lit: nothing is written', () => {
    const next = advance({}, deltas, { enabled: true, appetiteEnabled: false, tick: 0 });
    // anchored: the channel assertion below proves the writer really ran on this ledger.
    expect(JSON.stringify(next)).not.toContain('appetite');
    expect(next.a.channels.martial.stock01).toBeGreaterThan(NEUTRAL);
  });

  it('DOOR 2 ABSENT reads exactly as door 2 FALSE (dark-never-permissive)', () => {
    const withFalse = advance({}, deltas, { enabled: true, appetiteEnabled: false, tick: 0 });
    const withAbsent = advance({}, deltas, { enabled: true, tick: 0 });
    expect(JSON.stringify(withAbsent)).toBe(JSON.stringify(withFalse));
  });

  it('both doors lit: the facet is written — the lit control for the three above', () => {
    const next = advance({}, deltas, LIT);
    expect(readDispositionAppetite(next.a).present).toBe(true);
  });

  it('a planted facet is FROZEN, never decayed, while door 2 is dark', () => {
    const before = withAppetite(0.9, 0);
    const next = advance({ a: before }, [], { enabled: true, appetiteEnabled: false, tick: 520 });
    expect(next.a.appetite).toEqual(before.appetite);
  });
});

describe('SP-C — a dark flag never ERASES a learned appetite', () => {
  it('the legacy (dark-channels) writer preserves the facet verbatim', () => {
    // ratchetDisposition rebuilds the entry rather than spreading it, so an unnamed key
    // is erased. This is the pin that keeps the flip-back honest.
    const before = withAppetite(0.73, 12);
    const next = ratchetDisposition({ a: before }, 'a', { outcome: 'loss' });
    expect(next.a.appetite).toEqual(before.appetite);
    expect(next.a.losses).toBe(1);
  });

  it('a lit -> dark -> lit campaign keeps its stock and resumes from it', () => {
    const lit = advance({}, [delta('a', 'win', 'war_resolution')], LIT);
    const darkened = ratchetDisposition(lit, 'a', { outcome: 'win' });
    const relit = advance(darkened, [delta('a', 'win', 'war_resolution')], { ...LIT, tick: 1 });
    expect(readDispositionAppetite(relit.a).stock01)
      .toBeGreaterThan(readDispositionAppetite(lit.a).stock01);
  });
});

describe('SP-C — the crossing receipt is SP-5b\'s grammar, and it carries no float', () => {
  it('returns null when no band was crossed', () => {
    expect(appetiteCrossingOf(withAppetite(0.62), withAppetite(0.64), 'war_resolution', 3)).toBeNull();
    expect(appetiteCrossingOf(null, {}, 'war_resolution', 3)).toBeNull();
  });

  it('names the stock, both band WORDS, the direction, the cause and the tick', () => {
    const crossing = appetiteCrossingOf(withAppetite(0.55), withAppetite(0.85), 'war_resolution', 7);
    expect(crossing).toEqual({
      stockKind: APPETITE_STOCK_KIND,
      from: 'settled',
      to: 'dominant',
      direction: 'rose',
      cause: 'war_resolution',
      tick: 7,
    });
    // L5, structurally: no field of the receipt is a number except the tick.
    for (const [key, value] of Object.entries(/** @type {Record<string, unknown>} */ (crossing))) {
      if (key === 'tick') continue;
      expect(typeof value, `${key} is not a word`).toBe('string');
      // The typeof pin above proves the field is a live string.
      // anchored: so the digit scan reads a real word, never an absent field.
      expect(String(value)).not.toMatch(/\d/);
    }
  });

  it('falls as readily as it rises, and REFUSES a cause that is not a token', () => {
    expect(appetiteCrossingOf(withAppetite(0.85), withAppetite(0.15), 'decay', 9).direction).toBe('fell');
    expect(() => appetiteCrossingOf(withAppetite(0.85), withAppetite(0.15), 'War Resolution', 9)).toThrow();
    expect(() => appetiteCrossingOf(withAppetite(0.85), withAppetite(0.15), 'decay', 1.5)).toThrow();
  });
});

describe('SP-C — the tolerant read says ABSENT rather than guessing', () => {
  it('an entry with no facet reads absent and neutral', () => {
    const read = readDispositionAppetite({ wins: 3, losses: 0, score: 3 });
    expect(read).toEqual({ present: false, stock01: NEUTRAL, band: dispositionBandOf(NEUTRAL) });
    expect(readDispositionAppetite(null).present).toBe(false);
    expect(readDispositionAppetite({ appetite: [] }).present).toBe(false);
  });
});
