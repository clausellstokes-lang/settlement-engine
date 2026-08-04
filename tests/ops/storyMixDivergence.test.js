import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildStoryMixDivergenceEvidence,
  compareStoryMixDistributions,
  isPassingStoryMixDivergenceEvidence,
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
    expect(source).toMatch(/const seedDivergence = buildStoryMixDivergenceEvidence\(\{/);
    expect(source).toContain('comparison: storyMixDivergence,');
    expect(source).toContain('seedDivergence,');
    // The receipt now carries the MEASURED observation, and the collector is
    // actually driven per year rather than merely imported.
    expect(source).toContain('warConvergence: warConvergenceCollected.observation,');
    expect(source).toContain('yearlyWarConvergence.push(observeWarConvergenceYear({');
    expect(source).not.toContain('createEmptyWarConvergenceObservation()');
  });
});
