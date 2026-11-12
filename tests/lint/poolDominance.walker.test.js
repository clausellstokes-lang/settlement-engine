/**
 * poolDominance.walker.test.js — THE DOMINANCE ARM'S DOOR (COHERENCE-QUARREL, 2026-11-11; the
 * chair's charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3; the noise rule
 * POOL-GUARD, 2026-11-12, `docs/DESIGN_POOL_CENSUS.md` §6).
 *
 * A pool that looks large in the source can print a handful of lines. The arm
 * (`scripts/census/pool-dominance.mjs`) measures, for every drawn pool over a fixed corpus of 360
 * settlements, the share its most-printed line takes and the
 * share its five most-printed lines take. Its register (`scripts/census/pool-dominance.register.json`)
 * holds one ceiling of each per pool, and the ceilings only tighten.
 *
 * WHAT IT CATCHES: a pool whose share rises above its ceiling by more than three standard errors of
 * a share at the ceiling (the error taken over settlements, never below the binomial); a pool read
 * over 30 draws or more whose top line crosses 0.75 from below, whatever the noise; any rise at all
 * on a cured pool's target; a drawn pool with no row, a row whose pool is gone, and a ceiling
 * loose above its measure beyond the slack and the noise (tighten it with
 * `node scripts/census/pool-dominance.mjs --tighten`, which never raises a ceiling).
 * WHAT IT DOES NOT: a rise inside the pool's noise (on a pool of twenty draws that is a wide band);
 * a pool the corpus never draws; a loss of variety among lines the pool's own line id merges (a
 * line keyed by its index in a sub-list counts every sub-list's line at that index as one).
 *
 * @enforced-by tests/lint/poolDominance.walker.test.js
 */
import { describe, expect, test } from 'vitest';

import { DOMINATED, NOISE_SE, judge, measureDominance, readRegister, shareError } from '../../scripts/census/pool-dominance.mjs';

/**
 * A pool of `towns` settlements with `perTown` draws each, its top line taking `share` in every
 * one of them (spread evenly, so its error over towns is no wider than the binomial's).
 * @param {number} share @param {number} towns @param {number} [perTown]
 */
function evenPool(share, towns, perTown = 1) {
  const x = share * perTown, n = perTown;
  const all = { xx: towns * n * n, xn: towns * n * n, nn: towns * n * n };
  return { draws: towns * n, towns, top1: share, top5: 1, spread: { top1: { xx: towns * x * x, xn: towns * x * n, nn: towns * n * n }, top5: all } };
}

describe('the rule: a rise reds beyond the pool\'s own noise, or across the dominated line', () => {
  const row = { top1: 0.4, top5: 1, reason: 'a test row' };
  const register = { pools: { p: row } };
  const allowance = NOISE_SE * shareError(evenPool(0.4, 400), 'top1', 0.4);

  test('a rise inside three standard errors at the ceiling is chance, and passes', () => {
    expect(judge(new Map([['p', evenPool(0.4 + allowance * 0.9, 400)]]), register).over).toEqual([]);
  });

  test('a rise beyond three standard errors at the ceiling reds', () => {
    expect(judge(new Map([['p', evenPool(0.4 + allowance * 1.1, 400)]]), register).over).toHaveLength(1);
  });

  test('the error is taken over towns: the same rise, its draws bunched in a few towns, is chance', () => {
    // 400 draws, 0.48 of them the top line: spread evenly over 400 towns it reds; bunched in twenty
    // towns of twenty draws (ten printing it 16 times, ten 3.2 times) it is inside the noise.
    expect(judge(new Map([['p', evenPool(0.48, 400)]]), register).over).toHaveLength(1);
    const bunched = { ...evenPool(0.48, 20, 20), spread: { ...evenPool(0.48, 20, 20).spread, top1: { xx: 10 * 16 ** 2 + 10 * 3.2 ** 2, xn: 20 * (16 * 10 + 3.2 * 10), nn: 20 * 400 } } };
    expect(judge(new Map([['p', bunched]]), register).over).toEqual([]);
  });

  test(`a pool read over ${DOMINATED.minDraws}+ draws that crosses ${DOMINATED.top1} reds whatever the noise`, () => {
    const low = { pools: { p: { ...row, top1: 0.6 } } };
    expect(judge(new Map([['p', evenPool(DOMINATED.top1, DOMINATED.minDraws)]]), low).over).toHaveLength(1);
    expect(judge(new Map([['p', evenPool(DOMINATED.top1, DOMINATED.minDraws - 1)]]), low).over).toEqual([]);
  });

  test('a cured pool\'s target is a law: any rise above it reds', () => {
    const target = { pools: { p: { ...row, top1: 0.1, targets: ['top1'] } } };
    expect(judge(new Map([['p', evenPool(0.1025, 400)]]), target).over).toHaveLength(1);
  });
});

describe('no drawn pool prints more of one line than its register allows', () => {
  const table = measureDominance();
  const findings = judge(table, readRegister());

  test('the corpus draws pools, and the record pools are among them', () => {
    expect(table.size).toBeGreaterThan(100);
    for (const pool of ['record:conflicts.issue', 'record:conflicts.plotHooks', 'record:safetyProfile.plotHooks']) {
      expect(table.get(pool)?.draws ?? 0, pool).toBeGreaterThan(100);
    }
  });

  test('no pool rises above its ceiling beyond its own noise, and none crosses into dominance', () => {
    expect(findings.over).toEqual([]);
  });

  test('every drawn pool has a row, and every row is a drawn pool', () => {
    expect(findings.unregistered).toEqual([]);
    expect(findings.stale).toEqual([]);
  });

  test('no ceiling sits loose above its measure', () => {
    expect(findings.loose).toEqual([]);
  });
}, 600_000);
