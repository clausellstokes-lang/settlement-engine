/**
 * journeyConductor.test.js — THE UNIFYING LAW, proven on the pure core (Slice C2L).
 *
 * computeJourneyFrame is the deterministic heart of the conductor (no timers, no
 * side effects). The three branches ARE the mode machine; these tests pin them:
 *   • THEATER (arrived, no final-leg start): the scripted clock drives progress
 *     0→1 and the film lands FINISHED exactly at the window's end;
 *   • REALITY (not arrived): the film crawls to the hold boundary and FREEZES —
 *     it can never finish, no matter how much wall-clock passes (THE UNIFYING LAW);
 *   • FINAL (a held film unlocked by arrival — the hook stamps finalStart): the
 *     last leg eases boundary→1 over finalLegMs, then finishes on the ordered tier.
 *   • the leg / legT / floorStill projection matches the microsite stop model.
 */
import { describe, it, expect } from 'vitest';
import {
  computeJourneyFrame, defaultHoldBoundary, boundaryFor, scriptedProgressAt, JOURNEY_PHASE,
} from '../../src/components/loadingJourney/useJourneyConductor.js';

const base = {
  startedAt: 1000,
  scriptWindowMs: 1000,
  legsToPlay: 3,
  finalLegMs: 900,
  finalStart: null,
};

describe('boundary helpers — the mouth of the final leg', () => {
  it('a single-leg film holds furled at the start', () => {
    expect(defaultHoldBoundary(1)).toBe(0);
  });
  it('six legs hold at 5/6 (the mouth of leg 6)', () => {
    expect(defaultHoldBoundary(6)).toBeCloseTo(5 / 6, 10);
  });
  it('boundaryFor honours an explicit override, clamped to [0,1]', () => {
    expect(boundaryFor(6, 0.9)).toBe(0.9);
    expect(boundaryFor(6, 5)).toBe(1);
  });
  it('scriptedProgressAt is the pre-gate clock fraction', () => {
    expect(scriptedProgressAt(1500, 1000, 1000)).toBeCloseTo(0.5, 10);
    expect(scriptedProgressAt(9999, 1000, 0)).toBe(1); // zero window → instantly complete
  });
});

describe('THEATER mode (arrived) — the scripted clock drives the film', () => {
  it('progress 0 at the window start, on the desk still (stop 0)', () => {
    const f = computeJourneyFrame({ ...base, now: 1000, arrived: true });
    expect(f.progress).toBe(0);
    expect(f.phase).toBe(JOURNEY_PHASE.traveling);
    expect(f.currentLeg).toBe(0);
    expect(f.floorStill).toBe(0);
  });
  it('mid-window scrubs into a middle leg', () => {
    const f = computeJourneyFrame({ ...base, now: 1500, arrived: true }); // 50% of 3 legs = leg index 1
    expect(f.progress).toBeCloseTo(0.5, 10);
    expect(f.currentLeg).toBe(1);
    expect(f.phase).toBe(JOURNEY_PHASE.traveling);
  });
  it('lands FINISHED on the ordered-tier still exactly at the window end', () => {
    const f = computeJourneyFrame({ ...base, now: 2000, arrived: true });
    expect(f.progress).toBe(1);
    expect(f.phase).toBe(JOURNEY_PHASE.finished);
    expect(f.finished).toBe(true);
    expect(f.currentLeg).toBe(2);      // legs-1
    expect(f.legT).toBe(1);
    expect(f.floorStill).toBe(3);      // legsToPlay — the ordered tier's still
  });
});

describe('REALITY mode (not arrived) — THE UNIFYING LAW', () => {
  it('crawls, then FREEZES at the hold boundary (mouth of the final leg)', () => {
    const f = computeJourneyFrame({ ...base, now: 2000, arrived: false }); // scripted would be 1.0
    expect(f.phase).toBe(JOURNEY_PHASE.holding);
    expect(f.holding).toBe(true);
    expect(f.progress).toBeCloseTo(2 / 3, 10); // (legsToPlay-1)/legsToPlay
    expect(f.currentLeg).toBe(2);              // frozen at the start of the final leg
    expect(f.floorStill).toBe(2);              // the penultimate stop still
  });
  it('CANNOT finish no matter how much wall-clock passes — arrival is the only end', () => {
    const f = computeJourneyFrame({ ...base, now: 1_000_000_000, arrived: false });
    expect(f.finished).toBe(false);
    expect(f.phase).toBe(JOURNEY_PHASE.holding);
    expect(f.progress).toBeLessThan(1);
  });
  it('before the boundary it is still merely traveling (not yet holding)', () => {
    const f = computeJourneyFrame({ ...base, now: 1200, arrived: false }); // scripted 0.2 < 2/3
    expect(f.phase).toBe(JOURNEY_PHASE.traveling);
    expect(f.holding).toBe(false);
  });
});

describe('FINAL leg (a held film unlocked by arrival — the hook stamps finalStart)', () => {
  // The hook detects the held→arrived edge and stamps finalStart = the arrival
  // moment; computeJourneyFrame then eases boundary→1 over finalLegMs.
  const unlockAt = 5000; // arrival came long after the boundary was reached
  it('midway through the final leg it is easing, past the boundary but not done', () => {
    const f = computeJourneyFrame({ ...base, now: unlockAt + 450, arrived: true, finalStart: unlockAt });
    expect(f.phase).toBe(JOURNEY_PHASE.final);
    expect(f.progress).toBeGreaterThan(2 / 3);
    expect(f.progress).toBeLessThan(1);
  });
  it('at finalStart + finalLegMs it FINISHES on the ordered-tier still', () => {
    const f = computeJourneyFrame({ ...base, now: unlockAt + base.finalLegMs, arrived: true, finalStart: unlockAt });
    expect(f.phase).toBe(JOURNEY_PHASE.finished);
    expect(f.finished).toBe(true);
    expect(f.floorStill).toBe(3);
  });
});
