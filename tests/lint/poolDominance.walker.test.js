/**
 * poolDominance.walker.test.js — THE DOMINANCE ARM'S DOOR (COHERENCE-QUARREL, 2026-11-11; the
 * chair's charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3; the noise rule and
 * the six-tier corpus POOL-GUARD, 2026-11-12, `docs/DESIGN_POOL_CENSUS.md` §6).
 *
 * A pool that looks large in the source can print a handful of lines. The arm
 * (`scripts/census/pool-dominance.mjs`) measures, for every drawn pool over a fixed corpus of 2,050
 * settlements (six tiers, three forced stresses; about 137 seconds alone), the share its most-printed line takes and the
 * share its five most-printed lines take. Its register (`scripts/census/pool-dominance.register.json`)
 * holds one ceiling of each per pool, and the ceilings only tighten.
 *
 * WHAT IT CATCHES: a pool whose share rises above its ceiling by more than three standard errors of
 * a share at the ceiling (the error taken over settlements, never below the binomial); a pool read
 * over 30 draws or more whose commonest line crosses 0.75 from below, whatever the noise; a pool
 * banked with two or more distinct lines that prints one, where chance (top1 ^ towns) is under
 * 1/1000 -- 10 towns at the least; any rise at all on a cured pool's target; a drawn pool with no
 * row, a row whose pool is gone (a pool cut to one undeclared line leaves the ledger and reds
 * here); a ceiling loose above its measure beyond the slack and the noise (tighten it with
 * `node scripts/census/pool-dominance.mjs --tighten`, which never raises a ceiling); a register
 * banked on another corpus. A rise by the noise arm or the dominated line is read again on the
 * fixed second prefix `confirm` and reds only if it repeats there (one alone is a note with both
 * readings); a loose ceiling likewise, and under a foreign prefix it is a note; a target, a
 * collapse and the row-set checks are exact on the one reading.
 * WHAT IT DOES NOT: a rise inside the pool's noise (on a pool of twenty draws that is a wide band;
 * the corpus is the only cure); a pool the corpus never draws; a loss of variety among lines the
 * pool's own line id merges (a line keyed by its index in a sub-list counts every sub-list's line
 * at that index as one: npcData:NPC_FACTION_LOYALTY). The register's `census` is read, never judged.
 * Its proofs (false alarms on four re-seeds: 1 / 1 / 1 / 0 rows; power on five plants) are in
 * `docs/DESIGN_POOL_CENSUS.md` §6.5 and §6.7. A run costs about 137 seconds alone with no row to
 * confirm, about twice that with one (2026-11-12).
 *
 * @enforced-by tests/lint/poolDominance.walker.test.js
 */
import { describe, expect, test } from 'vitest';

import { COLLAPSE_CHANCE, DOMINATED, NOISE_SE, confirmRises, corpusIdentity, judge, judgeCorpus, readRegister, shareError } from '../../scripts/census/pool-dominance.mjs';

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

  test('a pool banked with two or more lines that prints one reds where chance does not explain it', () => {
    const banked = { pools: { p: { top1: 0.9, top5: 1, lines: 3, reason: 'a test row' } } };
    const single = (towns) => ({ ...evenPool(1, towns), lines: 1 });
    const enough = Math.ceil(Math.log(COLLAPSE_CHANCE) / Math.log(0.9));
    expect(judge(new Map([['p', single(enough)]]), banked).over).toHaveLength(1);
    expect(judge(new Map([['p', single(enough - 1)]]), banked).over).toEqual([]);
  });

  test('a rise must repeat: over on both readings it reds, over on one alone it is a note with both readings', () => {
    const rise = 0.4 + allowance * 1.1;
    const first = judge(new Map([['p', evenPool(rise, 400)]]), register);
    const again = new Map([['p', evenPool(rise, 400)]]);
    const calm = new Map([['p', evenPool(0.4, 400)]]);
    expect(confirmRises(first, judge(again, register, { exact: false }), 'confirm', again).over).toHaveLength(1);
    const once = confirmRises(first, judge(calm, register, { exact: false }), 'confirm', calm);
    expect(once.over).toEqual([]);
    expect(once.notes).toEqual([expect.stringMatching(/does not repeat on confirm \(top1 0\.4000 over 400 draws\)/)]);
  });

  test('a loose ceiling must repeat too: loose on both readings it reds, on one alone it is a note', () => {
    const first = judge(new Map([['p', evenPool(0.3, 400)]]), register);
    expect(first.loose).toHaveLength(1);
    const again = new Map([['p', evenPool(0.3, 400)]]);
    const calm = new Map([['p', evenPool(0.4, 400)]]);
    expect(confirmRises(first, judge(again, register), 'confirm', again).loose).toHaveLength(1);
    const once = confirmRises(first, judge(calm, register), 'confirm', calm);
    expect(once.loose).toEqual([]);
    expect(once.notes).toEqual([expect.stringMatching(/not loose on confirm \(top1 0\.4000 over 400 draws\)/)]);
    expect(judge(new Map([['p', evenPool(0.3, 400)]]), register, { exact: false }).loose).toEqual([]);
  });

  test('a target and a collapse are never confirmed: they red on the one reading', () => {
    const target = { pools: { p: { ...row, top1: 0.1, targets: ['top1'] } } };
    const first = judge(new Map([['p', evenPool(0.1025, 400)]]), target);
    const calm = new Map([['p', evenPool(0.05, 400)]]);
    expect(confirmRises(first, judge(calm, target, { exact: false }), 'confirm', calm).over).toHaveLength(1);
  });

  test('under a foreign seed prefix the row-set checks are notes, not findings', () => {
    const findings = judge(new Map([['q', evenPool(0.4, 10)]]), register, { exact: false });
    expect([findings.unregistered, findings.stale]).toEqual([[], []]);
    expect(findings.notes).toHaveLength(2);
  });
});

describe('no drawn pool prints more of one line than its register allows', () => {
  const register = readRegister();
  const { table, findings } = judgeCorpus({ register });

  test('the register was banked on this corpus: a change of corpus is re-based through --rebase, never compared across', () => {
    expect(register.corpus).toBe(corpusIdentity());
  });

  test('the corpus draws pools, and the record pools are among them', () => {
    expect(table.size).toBeGreaterThan(100);
    for (const pool of ['record:conflicts.issue', 'record:conflicts.plotHooks', 'record:safetyProfile.plotHooks']) {
      expect(table.get(pool)?.draws ?? 0, pool).toBeGreaterThan(100);
    }
  });

  test('no pool rises above its ceiling beyond its own noise, or crosses into dominance, on both readings; none collapses', () => {
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
