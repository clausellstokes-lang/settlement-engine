/**
 * progressChase.test.js — THE SCRUB CHASE LAW, proven on the pure core and by a
 * decode-free scrub simulation against the REAL owner-supplied master duration
 * (15.042 s, parsed from mvhd at socket landing, 2026-07-22).
 *
 * The unit cases pin the branch machine (hold-until-ready / snap / play / never-
 * backward / clamp); the simulation integrates currentTime by the returned
 * playbackRate to prove the emergent properties the owner cares about: the film
 * MOVES ONLY WITH the load, never rewinds, catches up from a late-ready mount, and
 * pauses on a stall — all without ever decoding a frame.
 */
import { describe, it, expect } from 'vitest';
import { computeChaseStep, CHASE } from '../../src/components/loadingJourney/progressChase.js';

const REAL_DURATION = 15.042;

describe('computeChaseStep — the branch machine', () => {
  it('HOLDS while duration is unknown (metadata still loading / 20 MB arriving)', () => {
    for (const d of [0, NaN, -1, undefined]) {
      const s = computeChaseStep({ progress: 0.5, duration: d, currentTime: 0 });
      expect(s.play).toBe(false);
      expect(s.seekTo).toBeNull();
    }
  });

  it('clamps the target off the exact end (duration − EPS)', () => {
    const s = computeChaseStep({ progress: 1, duration: 10, currentTime: 0 });
    expect(s.target).toBeCloseTo(10 - CHASE.EPS, 6);
  });

  it('SNAPS forward on a large gap (a late / fresh mount catching up to progress)', () => {
    const s = computeChaseStep({ progress: 0.4, duration: REAL_DURATION, currentTime: 0 });
    expect(s.seekTo).not.toBeNull();
    expect(s.seekTo).toBeCloseTo(0.4 * REAL_DURATION, 3);
    expect(s.seekTo).toBeGreaterThan(0);
  });

  it('PLAYS forward at a clamped rate on a moderate gap', () => {
    const s = computeChaseStep({ progress: 0.5, duration: REAL_DURATION, currentTime: 0.5 * REAL_DURATION - 1 });
    expect(s.play).toBe(true);
    expect(s.seekTo).toBeNull();
    expect(s.playbackRate).toBeGreaterThanOrEqual(CHASE.MIN_RATE);
    expect(s.playbackRate).toBeLessThanOrEqual(CHASE.MAX_RATE);
  });

  it('HOLDS (pauses) when caught up — the stall case', () => {
    const target = 0.5 * REAL_DURATION;
    const s = computeChaseStep({ progress: 0.5, duration: REAL_DURATION, currentTime: target });
    expect(s.play).toBe(false);
    expect(s.seekTo).toBeNull();
  });

  it('NEVER seeks backward nor plays on a backward request (the monotone guard)', () => {
    const s = computeChaseStep({ progress: 0.2, duration: REAL_DURATION, currentTime: 0.8 * REAL_DURATION });
    expect(s.seekTo).toBeNull();
    expect(s.play).toBe(false);
  });

  it('feedforward raises the rate for a fast-advancing target, still clamped to MAX', () => {
    const s = computeChaseStep({
      progress: 0.5, duration: REAL_DURATION, currentTime: 0.5 * REAL_DURATION - 0.1, targetVel: 100,
    });
    expect(s.playbackRate).toBe(CHASE.MAX_RATE);
  });
});

describe('scrub SIMULATION against the real 15.042 s master (no decode)', () => {
  function simulate(progressAt, { duration = REAL_DURATION, frames = 500, dtMs = 16 } = {}) {
    let cur = 0;
    let prevTarget = null;
    const trail = [];
    for (let i = 0; i < frames; i++) {
      const tSec = (i * dtMs) / 1000;
      const p = progressAt(tSec);
      const target = Math.max(0, Math.min(p * duration, duration - CHASE.EPS));
      const vel = prevTarget == null ? 0 : (target - prevTarget) / (dtMs / 1000);
      prevTarget = target;
      const step = computeChaseStep({ progress: p, duration, currentTime: cur, targetVel: vel });
      if (step.seekTo != null) cur = step.seekTo;
      if (step.play) cur += step.playbackRate * (dtMs / 1000);
      trail.push(cur);
    }
    return trail;
  }

  const monotone = (trail) => {
    for (let i = 1; i < trail.length; i++) {
      expect(trail[i]).toBeGreaterThanOrEqual(trail[i - 1] - 1e-9);
    }
  };

  it('a slow linear load: currentTime tracks progress, never rewinds, lands near the end', () => {
    const trail = simulate((t) => Math.min(1, t / 6), { frames: 500, dtMs: 16 });
    monotone(trail);
    expect(trail[trail.length - 1]).toBeGreaterThan(REAL_DURATION - 0.5);
    expect(trail[trail.length - 1]).toBeLessThanOrEqual(REAL_DURATION);
  });

  it('a late-ready video (progress already 0.4): one forward snap, then tracks', () => {
    const trail = simulate((t) => Math.min(1, 0.4 + t / 6), { frames: 500, dtMs: 16 });
    expect(trail[0]).toBeCloseTo(0.4 * REAL_DURATION, 2);
    monotone(trail);
    expect(trail[trail.length - 1]).toBeGreaterThan(REAL_DURATION - 0.5);
  });

  it('a stalled load: the scrub pauses (currentTime plateaus) then resumes forward', () => {
    const trail = simulate((t) => {
      if (t < 3) return Math.min(0.5, t / 6);
      if (t < 8) return 0.5;                     // stall
      return Math.min(1, 0.5 + (t - 8) / 6);
    }, { frames: 900, dtMs: 16 });
    const atStallStart = trail[Math.floor((3.2 * 1000) / 16)];
    const atStallEnd = trail[Math.floor((7.8 * 1000) / 16)];
    expect(Math.abs(atStallEnd - atStallStart)).toBeLessThan(0.2);
    monotone(trail);
    expect(trail[trail.length - 1]).toBeGreaterThan(REAL_DURATION - 0.6);
  });
});
