/**
 * tests/generators/pipelineRngRestore.test.js — runPipeline RNG save/restore.
 *
 * runPipeline set the active seeded RNG before each step and cleared it in a
 * finally. It used to clear to NULL unconditionally (`clearActiveRng()` with no
 * arg), assuming generation is never nested. A pipeline run nested inside an
 * outer seeded run would therefore wipe the outer RNG, silently dropping the
 * rest of that run's draws to the Math.random() fallback. This mirrors the fix
 * already in the regen pipelines: capture the prior RNG (setActiveRng returns
 * it) and restore it. These tests reproduce the re-entrant case — an outer RNG
 * must survive a nested runPipeline — and pin the non-nested null-clear path.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { runPipeline, registerStep, clearSteps } from '../../src/generators/pipeline.js';
import {
  setActiveRng,
  clearActiveRng,
  getActiveRng,
  random,
} from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';

afterEach(() => clearSteps());

describe('runPipeline restores the prior active RNG (re-entrancy)', () => {
  it('restores an outer RNG instead of clearing to null', () => {
    // A trivial one-step pipeline that draws from the active RNG.
    registerStep('draw', { provides: ['value'] }, () => ({ value: random() }));

    const outer = createPRNG('outer-run');
    setActiveRng(outer);
    try {
      runPipeline({}, createPRNG('nested'));
      // Old behaviour: clearActiveRng() → getActiveRng() === null here.
      expect(getActiveRng()).toBe(outer);
    } finally {
      clearActiveRng();
    }
  });

  it('the outer RNG keeps advancing — a nested run does not drop draws to Math.random', () => {
    registerStep('draw', { provides: ['value'] }, () => ({ value: random() }));

    // Reference sequence: three outer draws with no nested run between them.
    const ref = createPRNG('seq');
    setActiveRng(ref);
    const refSeq = [random(), random(), random()];
    clearActiveRng();

    // Same outer seed, but a nested pipeline runs between draws 1 and 2. If the
    // nested run clears the active RNG to null, draw 2 falls through to
    // Math.random() and the sequence diverges (and is non-reproducible).
    const outer = createPRNG('seq');
    setActiveRng(outer);
    const live = [];
    live.push(random());
    runPipeline({}, createPRNG('nested'));
    live.push(random());
    live.push(random());
    clearActiveRng();

    expect(live).toEqual(refSeq);
  });

  it('still clears to null when there was no outer RNG (non-nested path)', () => {
    registerStep('draw', { provides: ['value'] }, () => ({ value: random() }));

    clearActiveRng();
    runPipeline({}, createPRNG('standalone'));
    expect(getActiveRng()).toBeNull();
  });
});
