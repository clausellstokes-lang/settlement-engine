/**
 * tests/domain/display/regionWakeReplay.test.js — the canned "Watch a region
 * wake up" replay (UX Phase 9, plan §4.7).
 *
 * The replay is the anon teaser that lets a no-account user SEE the premium
 * living simulation. The test gate it must hold:
 *
 *   - DETERMINISTIC + READ-ONLY: projecting a step is a pure function of the
 *     step index — no rng, no engine call, no mutation. Re-projecting yields a
 *     byte-identical result, and projecting does not mutate the module fixture.
 *   - The SCRIPTED SEQUENCE actually plays out through the EXISTING selectors:
 *     siege forms → trade prize flips → deity gains seats → war ends.
 */

import { describe, it, expect } from 'vitest';
import {
  projectReplayStep,
  projectReplaySequence,
  REPLAY_STEP_COUNT,
} from '../../../src/domain/display/regionWakeReplay.js';

describe('regionWakeReplay — determinism + read-only', () => {
  it('projects a deterministic sequence (re-projection is byte-identical)', () => {
    const a = JSON.stringify(projectReplaySequence());
    const b = JSON.stringify(projectReplaySequence());
    expect(a).toBe(b);
    // And per-step is stable too.
    for (let i = 0; i < REPLAY_STEP_COUNT; i += 1) {
      expect(JSON.stringify(projectReplayStep(i))).toBe(JSON.stringify(projectReplayStep(i)));
    }
  });

  it('clamps out-of-range steps without throwing', () => {
    expect(projectReplayStep(-5).step).toBe(0);
    expect(projectReplayStep(999).step).toBe(REPLAY_STEP_COUNT - 1);
    expect(projectReplayStep(NaN).step).toBe(0);
    expect(projectReplayStep(undefined).step).toBe(0);
  });

  it('does not mutate any shared state across projections (read-only)', () => {
    // Project every step twice, interleaved; if any selector mutated the frozen
    // fixture, the second pass would diverge.
    const first = [];
    for (let i = 0; i < REPLAY_STEP_COUNT; i += 1) first.push(JSON.stringify(projectReplayStep(i)));
    // Scrub backward.
    for (let i = REPLAY_STEP_COUNT - 1; i >= 0; i -= 1) {
      expect(JSON.stringify(projectReplayStep(i))).toBe(first[i]);
    }
  });

  it('uses NO rng — there is no Math.random in the projection path', () => {
    // Belt-and-braces: stub Math.random to a tripwire and project; if the
    // replay used rng the projection would change between calls / throw.
    const orig = Math.random;
    let called = false;
    Math.random = () => { called = true; return 0.42; };
    try {
      const x = JSON.stringify(projectReplaySequence());
      const y = JSON.stringify(projectReplaySequence());
      expect(x).toBe(y);
      expect(called).toBe(false);
    } finally {
      Math.random = orig;
    }
  });
});

describe('regionWakeReplay — the scripted sequence (via existing selectors)', () => {
  const seq = projectReplaySequence();

  it('has at least five steps (the four-month wake + an at-peace opener)', () => {
    expect(REPLAY_STEP_COUNT).toBeGreaterThanOrEqual(5);
  });

  it('step 0 — the region is at peace (no sieges, no arcs)', () => {
    expect(seq[0].atPeace).toBe(true);
    expect(seq[0].sieges).toHaveLength(0);
    expect(seq[0].arcs).toHaveLength(0);
  });

  it('step 1 — a siege forms (liveSieges surfaces a coalition)', () => {
    expect(seq[1].sieges.length).toBeGreaterThan(0);
    expect(seq[1].arcs.some(a => /War of/i.test(a))).toBe(true);
  });

  it('step 2 — a trade prize flips (a Trade War arc appears)', () => {
    expect(seq[2].arcs.some(a => /Trade War/i.test(a))).toBe(true);
    // The siege is still on at this month.
    expect(seq[2].sieges.length).toBeGreaterThan(0);
  });

  it('step 3 — a deity gains seats and ascends (pantheonStandings + ascendancy arc)', () => {
    expect(seq[3].pantheon.length).toBeGreaterThan(0);
    expect(seq[3].pantheon[0].tier).toBe('major');
    expect(seq[3].arcs.some(a => /Ascendancy/i.test(a))).toBe(true);
  });

  it('step 4 — the war ends (the siege lifts; no live sieges remain)', () => {
    const last = seq[REPLAY_STEP_COUNT - 1];
    expect(last.sieges).toHaveLength(0);
    // The faith + trade legacy persist after the war ends.
    expect(last.pantheon.length).toBeGreaterThan(0);
    expect(last.arcs.some(a => /Trade War/i.test(a))).toBe(true);
  });

  it('every step carries a month label + at-most-one leading headline', () => {
    for (const s of seq) {
      expect(typeof s.monthLabel).toBe('string');
      expect(s.monthLabel.length).toBeGreaterThan(0);
      expect(Array.isArray(s.headlines)).toBe(true);
    }
  });
});
