/**
 * tests/generators/pipelineRngRestore.test.js — runPipeline RNG save/restore.
 *
 * runPipeline sets the active seeded RNG before each step and clears it in a
 * finally. It used to clear to NULL unconditionally (`clearActiveRng()` with no
 * arg), assuming generation is never nested. A pipeline run nested inside an
 * outer seeded run would therefore wipe the outer RNG — under our fail-closed
 * kernel the outer run's next draw would THROW (their tree degraded to
 * Math.random(); ours crashes loudly, but either way the outer context is
 * lost). The fix: capture the prior RNG (setActiveRng returns it) and restore
 * it. These tests reproduce the re-entrant case — an outer RNG must survive a
 * nested runPipeline — and pin the non-nested null-clear path.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { runPipeline, registerStep, clearSteps } from '../../src/generators/pipeline.js';
import {
  setActiveRng,
  clearActiveRng,
  getActiveRng,
  random,
} from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

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

  it('the outer RNG keeps advancing — a nested run does not lose the outer context', () => {
    registerStep('draw', { provides: ['value'] }, () => ({ value: random() }));

    // Reference sequence: three outer draws with no nested run between them.
    const ref = createPRNG('seq');
    setActiveRng(ref);
    const refSeq = [random(), random(), random()];
    clearActiveRng();

    // Same outer seed, but a nested pipeline runs between draws 1 and 2. If the
    // nested run clears the active RNG to null, draw 2 has no context — under
    // the fail-closed kernel it would throw and the sequence could never match.
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
