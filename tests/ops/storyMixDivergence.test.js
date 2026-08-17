import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildStoryMixDivergenceEvidence,
  compareStoryMixDistributions,
  isPassingStoryMixDivergenceEvidence,
  MIN_EXECUTABLE_SAMPLE_EVENTS,
  STORY_MIX_DIVERGENCE_THRESHOLDS,
} from '../../scripts/audit/story-mix-divergence.mjs';

const year = (eventTypeCounts) => ({ eventTypeCounts });
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('story-mix divergence instrument', () => {
  it('earns divergence only when at least a tenth of the mix and two event-equivalents move', () => {
    const result = compareStoryMixDistributions(
      [year({ siege: 5, treaty: 5 })],
      [year({ siege: 3, treaty: 7 })],
    );

    expect(result.passed).toBe(true);
    expect(result.totalVariationDistance).toBeCloseTo(0.2, 12);
    expect(result.shiftedEventEquivalents).toBeCloseTo(2, 12);
    expect(result.typeShifts.map(({ type }) => type)).toEqual(['siege', 'treaty']);
    expect(result.thresholds).toBe(STORY_MIX_DIVERGENCE_THRESHOLDS);
  });

  it('does not let one changed draw earn the seed-divergent claim', () => {
    const result = compareStoryMixDistributions(
      [year({ raid: 5, relief: 5 })],
      [year({ raid: 4, relief: 6 })],
    );

    expect(result.totalVariationDistance).toBeCloseTo(0.1, 12);
    expect(result.shiftedEventEquivalents).toBeCloseTo(1, 12);
    expect(result.passed).toBe(false);
  });

  it('keeps tempo separate from mix by normalizing both distributions', () => {
    const result = compareStoryMixDistributions(
      [year({ migration: 4, succession: 6 })],
      [year({ migration: 8, succession: 12 })],
    );

    expect(result.baseline.totalEvents).toBe(10);
    expect(result.comparison.totalEvents).toBe(20);
    expect(result.totalVariationDistance).toBe(0);
    expect(result.shiftedEventEquivalents).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('aggregates the complete equal-year window instead of cherry-picking one year', () => {
    const result = compareStoryMixDistributions(
      [year({ raid: 3 }), year({ treaty: 2 })],
      [year({ raid: 1 }), year({ treaty: 4 })],
    );

    expect(result.equalWindows).toBe(true);
    expect(result.baseline.counts).toEqual({ raid: 3, treaty: 2 });
    expect(result.comparison.counts).toEqual({ raid: 1, treaty: 4 });
    expect(result.totalVariationDistance).toBeCloseTo(0.4, 12);
    expect(result.shiftedEventEquivalents).toBeCloseTo(2, 12);
    expect(result.passed).toBe(true);
  });

  it('fails closed on empty, mismatched, or malformed evidence windows', () => {
    const empty = compareStoryMixDistributions([], []);
    const mismatched = compareStoryMixDistributions(
      [year({ peace: 2 }), year({ siege: 2 })],
      [year({ peace: 2 })],
    );
    const malformed = compareStoryMixDistributions(
      [year({ peace: 2 })],
      [year({ siege: Number.NaN })],
    );

    expect(empty).toMatchObject({ passed: false, equalWindows: false, nonEmpty: false });
    expect(mismatched).toMatchObject({ passed: false, equalWindows: false });
    expect(malformed.passed).toBe(false);
    expect(malformed.invalidEntries).toEqual([
      'comparison.yearly[0].eventTypeCounts.siege',
    ]);

    // ── §206.2b — NOT-EXECUTABLE IS A THIRD ANSWER, NOT A SOFTER FAILURE ──────
    // ⛔ THE DEFECT: the all-off world authors ZERO events, so this instrument compared two
    // empty samples and called it FAIL — on all three dark-control cells of every rolling
    // run (RS-1 F2, RS-2 F2, three ledgered KNOWN re-fires). That is a finding about the
    // instrument-under-this-configuration wearing a finding about the world.
    expect(MIN_EXECUTABLE_SAMPLE_EVENTS)
      .toBe(STORY_MIX_DIVERGENCE_THRESHOLDS.minShiftedEventEquivalents);
    expect(empty.executable).toBe(false);
    expect(empty.smallestSample).toBe(0);
    expect(empty.notExecutableReason).toContain('would be arithmetic rather than evidence');

    // ⭐ THE FLOOR IS DERIVED, AND THIS IS THE DERIVATION EXECUTED. Total-variation distance
    // between two distributions is bounded above by 1, so shiftedEventEquivalents ≤ min(n).
    // At min(n) = 1 the MAXIMALLY divergent pair — disjoint supports, TVD exactly 1 — still
    // cannot reach the threshold of 2. That is why a FAIL below the floor carries no
    // information about seeds: no world could have produced any other answer.
    const maximallyDivergentButTiny = compareStoryMixDistributions(
      [year({ siege: 1 })],
      [year({ treaty: 1 })],
    );
    expect(maximallyDivergentButTiny.totalVariationDistance).toBe(1);
    expect(maximallyDivergentButTiny.passed).toBe(false);
    expect(maximallyDivergentButTiny.executable).toBe(false);
    // …and ONE more event on each side puts a pass back within reach, so the floor is the
    // exact boundary rather than a margin somebody chose.
    const atTheFloor = compareStoryMixDistributions(
      [year({ siege: 2 })],
      [year({ treaty: 2 })],
    );
    expect(atTheFloor.smallestSample).toBe(2);
    expect(atTheFloor.executable).toBe(true);
    expect(atTheFloor.passed).toBe(true);

    // ⛔ NO VERDICT MOVED. The floor sits exactly where `passed` was already unreachable, so
    // adding it changes the pass/fail answer for NO input — it only separates "measured and
    // failed" from "could not be measured". A measured failure is still a failure.
    const measuredFailure = compareStoryMixDistributions(
      [year({ raid: 5, relief: 5 })],
      [year({ raid: 4, relief: 6 })],
    );
    expect(measuredFailure.executable).toBe(true);
    expect(measuredFailure.passed).toBe(false);

    // THE EVIDENCE CARRIES THE THIRD VERDICT, and the admission wall still refuses it:
    // nothing can be certified on an instrument that did not execute.
    const notExecutableEvidence = buildStoryMixDivergenceEvidence({
      comparison: empty,
      windowYears: 5,
      baselineSeed: 'baseline',
      comparisonSeed: 'divergent',
      hashDiverged: true,
    });
    expect(notExecutableEvidence.verdict).toBe('NOT-EXECUTABLE');
    expect(notExecutableEvidence.instrumentExecutable).toBe(false);
    expect(notExecutableEvidence.minSampleEvents).toBe(MIN_EXECUTABLE_SAMPLE_EVENTS);
    expect(isPassingStoryMixDivergenceEvidence(notExecutableEvidence)).toBe(false);
  });

  it('builds a total v5 admission receipt and rejects edited evidence', () => {
    const comparison = compareStoryMixDistributions(
      [year({ siege: 5, treaty: 5 })],
      [year({ siege: 3, treaty: 7 })],
    );
    const evidence = buildStoryMixDivergenceEvidence({
      comparison,
      windowYears: 5,
      baselineSeed: 'baseline',
      comparisonSeed: 'divergent',
      hashDiverged: false,
    });

    expect(isPassingStoryMixDivergenceEvidence(evidence)).toBe(true);
    expect(isPassingStoryMixDivergenceEvidence({
      ...evidence,
      shiftedEventEquivalents: 1,
    })).toBe(false);
    expect(isPassingStoryMixDivergenceEvidence({
      ...evidence,
      invalidEntries: ['comparison.yearly[0]'],
    })).toBe(false);
    expect(isPassingStoryMixDivergenceEvidence({
      ...evidence,
      hashDiverged: true,
      verdict: 'FAIL',
    })).toBe(false);
  });

  it('wires the mix verdict, while retaining the composite hash as diagnostics only', () => {
    const source = readFileSync(join(ROOT, 'scripts/audit/whole-world-soak.mjs'), 'utf8');

    expect(source).toContain('buildStoryMixDivergenceEvidence,');
    expect(source).toContain('compareStoryMixDistributions,');
    // WR-9d replaced the empty-observation import with the real collector. Both
    // halves are pinned — the per-year observer AND the fold — because a soak that
    // imported only one of them would still parse and would silently ship a
    // receipt whose war section never saw a war.
    expect(source).toContain('observeWarConvergenceYear,');
    expect(source).toContain('buildWarConvergenceObservation,');
    expect(source).toMatch(/check\(\s*storyMixDivergence\.passed,\s*'different seeds produce a divergent event-type mix'/);
    expect(source).toMatch(/const hashDiverged = [^;]+;/);
    expect(source).toContain("composite hash ${hashDiverged ? 'also differed' : 'did not differ'}");
    // ⚠ DE-ROTTED BY sk-a/SK-0, NOT DELETED. This arm used to read
    // `/const seedDivergence = buildStoryMixDivergenceEvidence\(\{/`, which froze the
    // STATEMENT FORM of a line the harness must lawfully change: `--skip-divergence`
    // makes run C conditional, so the binding cannot be a single `const` any more. The
    // pin's INTENT — the receipt's seedDivergence is BUILT by the evidence builder and
    // never invented — is still exactly right, so it is re-anchored rather than dropped,
    // and the cure's own law is folded in beside it so the arm ends up STRONGER.
    expect(source).toMatch(/seedDivergence = \{\s*executed: true,\s*\.\.\.buildStoryMixDivergenceEvidence\(\{/);
    expect(source).toContain('comparison: storyMixDivergence,');
    expect(source).toContain('seedDivergence,');
    // ⛔ THE UNEARNED-PROPERTY LAW, pinned at its source. `properties` must be COMPUTED
    // from what executed — a literal array always containing `seed_divergent` would let a
    // skipped run publish the customer-facing clause certificationSchema.js reads as
    // "told a different tale on a different seed".
    expect(source).toContain('properties: soakProperties({');
    // ⚠ RE-ANCHORED BY §206.2b, NOT LOOSENED. The pin used to freeze the whole expression
    // `seedDivergenceExecuted: seedDivergence.executed === true,`. That expression had to
    // lawfully grow a second term: RUNNING the divergence pass and MEASURING anything are
    // different facts, and the all-dark world proved it by authoring zero events and
    // FAILING an instrument no world could have passed. Both terms are pinned separately,
    // so the arm is now stronger than the frozen literal it replaces — dropping either one
    // reds, where before only a re-wording did.
    expect(source).toContain('seedDivergenceExecuted: seedDivergence.executed === true');
    expect(source).toContain('&& seedDivergence.instrumentExecutable === true,');
    // …and the third status exists at the assertion site, so a non-executable instrument
    // is REPORTED rather than banked as a failure on every rolling run.
    expect(source).toMatch(/if \(!storyMixDivergence\.executable\) \{\s*\n\s*notExecutable\(/);
    expect(source).toContain('notExecutable: notExecutables,');
    // …and the skipped branch states its absence POSITIVELY rather than leaving a gap a
    // reader has to infer from a missing key.
    expect(source).toMatch(/executed: false,\s*reason: 'harness --skip-divergence'/);
    // The receipt now carries the MEASURED observation, and the collector is
    // actually driven per year rather than merely imported.
    expect(source).toContain('warConvergence: warConvergenceCollected.observation,');
    expect(source).toContain('yearlyWarConvergence.push(observeWarConvergenceYear({');
    // The ten positive toContain pins above prove `source` is the real soak file,
    // so this negative cannot go vacuous on an empty read.
    // anchored: the soak must never regress to the empty-observation write WR-9d retired
    expect(source).not.toContain('createEmptyWarConvergenceObservation()');
  });
});
