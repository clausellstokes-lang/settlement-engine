/**
 * compromiseRoundWr7c.test.js — WR-7c's compromise round and law L's terminator.
 *
 * K2.4 sends BOTH sides out again on a close vote, with the war running the
 * whole time. Amendment L forbids a round limit and names the widening plus the
 * home-front drain as the convergence guarantee instead.
 *
 * The pins that matter here are the structural ones: no round is ever compared
 * with a maximum, no ceasefire exists in any shape this file can produce, and
 * the widening is monotone and symmetric rather than a number somebody hoped
 * was rising. Convergence is a PROJECTION, and the honest answer — "widening
 * alone will not close this one" — is a first-class result, not a failure.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  COMPROMISE_DRAIN_BANDS,
  COMPROMISE_ROUND_TUNING,
  COMPROMISE_WIDENING_BANDS,
  compromiseConvergence,
  compromiseRoundIndex,
  openCompromiseRound,
  widenAcceptance,
  wideningBandOf,
} from '../../src/domain/worldPulse/compromiseRound.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const SOURCE = readFileSync(join(ROOT, 'src/domain/worldPulse/compromiseRound.js'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

const widen = (roundIndex, drainBand) => widenAcceptance({ roundIndex, drainBand }).widening01;

describe('WR-7c — the round index is derived, never stored', () => {
  it('counts the distinct parlays that came home without a peace', () => {
    expect(compromiseRoundIndex({})).toBe(0);
    expect(compromiseRoundIndex({ failedParlayIds: [] })).toBe(0);
    expect(compromiseRoundIndex({ failedParlayIds: ['p.1', 'p.2'] })).toBe(2);
    // A parlay counted twice would inflate the widening and hand the courts a
    // concession nobody paid for.
    expect(compromiseRoundIndex({ failedParlayIds: ['p.1', 'p.1', '', null] })).toBe(1);
  });
});

describe('WR-7c — the widening', () => {
  it('concedes nothing before the first refusal, then rises with every one', () => {
    expect(widen(0, 'quiet')).toBe(0);
    let previous = 0;
    for (let round = 1; round <= 40; round += 1) {
      const value = widen(round, 'present');
      expect(value, `round ${round}`).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
    // Strictly rising while the ceiling is still above it — a "monotone" band
    // that never actually moves would satisfy the inequality and prove nothing.
    expect(widen(3, 'present')).toBeGreaterThan(widen(2, 'present'));
    expect(widen(2, 'present')).toBeGreaterThan(widen(1, 'present'));
  });

  it('makes the bleeding realm concede faster at the same round', () => {
    // Amendment L's fourth force: the home front ACCELERATES the widening, so
    // two courts refused equally often do not arrive equally stubborn.
    const round = 4;
    const values = COMPROMISE_DRAIN_BANDS.map((band) => widen(round, band));
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(values[values.length - 1]).toBeGreaterThan(values[0]);
    // A quiet home front contributes nothing rather than a hidden floor.
    expect(widen(round, 'quiet')).toBe(COMPROMISE_ROUND_TUNING.WIDENING_STEP_01 * round);
  });

  it('bands the widening into the closed public postures', () => {
    expect(wideningBandOf(0)).toBe('held');
    expect(wideningBandOf(1)).toBe('desperate');
    expect(COMPROMISE_WIDENING_BANDS.map((band) => band)).toHaveLength(4);
    const bands = [0, 0.2, 0.4, 0.7].map(wideningBandOf);
    expect(bands).toEqual(COMPROMISE_WIDENING_BANDS);
    // Two refusals still read as a court holding its line; three is the first
    // posture an onlooker would call yielding.
    expect(widenAcceptance({ roundIndex: 2, drainBand: 'quiet' }).band).toBe('held');
    expect(widenAcceptance({ roundIndex: 3, drainBand: 'quiet' }).band).toBe('yielding');
  });

  it('stops at a band ceiling without ever capping the number of rounds', () => {
    const cap = COMPROMISE_ROUND_TUNING.WIDENING_CAP_01;
    expect(widen(500, 'decisive')).toBe(cap);
    expect(widen(50000, 'decisive')).toBe(cap);
    // Amendment L: no war-length cap, no forced peace, no round limit. A ceiling
    // on how far a band widens is not a ceiling on how long a war may run — and
    // no round count in this module is ever compared with anything.
    expect(SOURCE.length).toBeGreaterThan(1000);
    for (const token of ['MAX_ROUND', 'ROUND_LIMIT', 'roundCap', 'MAX_ROUNDS', 'forcePeace']) {
      expect(SOURCE, `compromiseRound must not name ${token}`).not.toContain(token); // anchored: see above
    }
  });

  it('refuses an unreadable input instead of widening on a guess', () => {
    expect(widenAcceptance({ roundIndex: -1, drainBand: 'quiet' }).reason).toBe('invalid_input');
    expect(widenAcceptance({ roundIndex: 1.5, drainBand: 'quiet' }).reason).toBe('invalid_input');
    expect(widenAcceptance({ roundIndex: 2, drainBand: 'grim' }).reason).toBe('invalid_input');
    expect(widenAcceptance({ roundIndex: 2, drainBand: 'grim' }).widening01).toBe(0);
  });
});

describe('WR-7c — opening the round', () => {
  const sides = () => ([
    { partyId: 'reed', drainBand: 'pressing' },
    { partyId: 'iron', drainBand: 'quiet' },
  ]);

  it('sends BOTH sides out at once, each widened by its own home front', () => {
    const round = openCompromiseRound({
      verdict: 'close', episodeKey: 'war.iron.reed.4', sides: sides(), priorRoundIndex: 1,
    });
    expect(round.opened).toBe(true);
    expect(round.roundIndex).toBe(2);
    // Two mandates, minted together: the shape itself forbids sending one court
    // out and holding the other back.
    expect(round.mandates).toHaveLength(2);
    expect(round.mandates.map((row) => [row.partyId, row.counterpartId]))
      .toEqual([['iron', 'reed'], ['reed', 'iron']]);
    expect(round.mandates.every((row) => row.roundIndex === 2)).toBe(true);
    const byParty = new Map(round.mandates.map((row) => [row.partyId, row.widening01]));
    expect(byParty.get('reed')).toBeGreaterThan(byParty.get('iron'));
  });

  it('states on the record that the war never stopped', () => {
    const round = openCompromiseRound({
      verdict: 'close', episodeKey: 'war.iron.reed.4', sides: sides(), priorRoundIndex: 0,
    });
    expect(round.warContinues).toBe(true);
    // There is no ceasefire in this model, anywhere — and no shape in this file
    // could hold one. The source is proven non-empty in the ceiling pin above.
    for (const token of ['ceasefire', 'truce', 'armistice', 'standDown']) {
      expect(SOURCE, `compromiseRound must not name ${token}`).not.toContain(token); // anchored: see above
    }
  });

  it('opens on a close verdict only — a decided coalition does not bargain with itself', () => {
    for (const verdict of ['ratified', 'refused', '', null]) {
      const round = openCompromiseRound({
        verdict, episodeKey: 'war.iron.reed.4', sides: sides(), priorRoundIndex: 1,
      });
      expect(round.opened, String(verdict)).toBe(false);
      expect(round.reason).toBe('verdict_is_decided');
      expect(round.mandates).toEqual([]);
    }
  });

  it('refuses a malformed round rather than inventing the other side', () => {
    const base = { verdict: 'close', episodeKey: 'war.iron.reed.4', priorRoundIndex: 0 };
    expect(openCompromiseRound({ ...base, sides: [sides()[0]] }).reason).toBe('not_two_sides');
    expect(openCompromiseRound({ ...base, sides: [sides()[0], sides()[0]] }).reason).toBe('same_party');
    expect(openCompromiseRound({
      ...base, sides: [sides()[0], { partyId: 'iron', drainBand: 'grim' }],
    }).reason).toBe('invalid_side');
    expect(openCompromiseRound({ ...base, episodeKey: '', sides: sides() }).reason).toBe('invalid_context');
  });
});

describe('WR-7c — convergence is projected, never promised', () => {
  const sides = (a, b) => ([
    { partyId: 'reed', drainBand: a },
    { partyId: 'iron', drainBand: b },
  ]);

  it('names the round at which two widening bands first cover the distance', () => {
    const near = compromiseConvergence({ gap01: 0.12, sides: sides('quiet', 'quiet') });
    expect(near.reason).toBe('projected');
    expect(near.closesAtRound).toBe(1);
    const far = compromiseConvergence({ gap01: 0.6, sides: sides('quiet', 'quiet') });
    expect(far.closesAtRound).toBe(5);
    // Executed, not asserted: the projected round really does cover the gap and
    // the one before it really does not.
    const reach = (round) => widen(round, 'quiet') * 2;
    expect(reach(far.closesAtRound)).toBeGreaterThanOrEqual(0.6);
    expect(reach(far.closesAtRound - 1)).toBeLessThan(0.6);
  });

  it('closes sooner when the home front is bleeding — the same gap, a shorter war', () => {
    const quiet = compromiseConvergence({ gap01: 0.6, sides: sides('quiet', 'quiet') });
    const bleeding = compromiseConvergence({ gap01: 0.6, sides: sides('decisive', 'decisive') });
    expect(bleeding.closesAtRound).toBeLessThan(quiet.closesAtRound);
  });

  it('says plainly when the widening alone will never close it', () => {
    // THE HONEST NULL. Two ceilings cannot cover this distance, so no number of
    // rounds will end this war by compromise: the home front, a ruler change or
    // the field must. Rounding that down to a comforting integer would be the
    // convergence guarantee lying about itself, which is precisely what WR-9's
    // envelope exists to catch.
    const hopeless = compromiseConvergence({ gap01: 1.9, sides: sides('decisive', 'decisive') });
    expect(hopeless.closesAtRound).toBeNull();
    expect(hopeless.reason).toBe('widening_cannot_close_it');
    expect(hopeless.ceilingReach01).toBe(2 * COMPROMISE_ROUND_TUNING.WIDENING_CAP_01);
    expect(hopeless.gap01).toBe(1.9);
  });

  it('closes at round zero only when there was nothing to close', () => {
    expect(compromiseConvergence({ gap01: 0, sides: sides('quiet', 'quiet') }).closesAtRound).toBe(0);
  });

  it('refuses an unreadable projection instead of returning a number', () => {
    expect(compromiseConvergence({ gap01: -1, sides: sides('quiet', 'quiet') }).reason).toBe('invalid_gap');
    expect(compromiseConvergence({ gap01: 0.2, sides: [] }).reason).toBe('not_two_sides');
    expect(compromiseConvergence({
      gap01: 0.2, sides: [{ partyId: 'reed', drainBand: 'grim' }, { partyId: 'iron', drainBand: 'quiet' }],
    }).reason).toBe('invalid_side');
  });

  it('uses no transcendental arithmetic anywhere', () => {
    // The engine's seeded-purity law: multiplication is correctly rounded and
    // pow/exp/log are not. The source is proven non-empty in the ceiling pin.
    for (const token of ['Math.pow', 'Math.exp', 'Math.log', '**']) {
      expect(SOURCE, `compromiseRound must not use ${token}`).not.toContain(token); // anchored: see above
    }
  });
});
