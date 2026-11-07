/**
 * tests/generators/arrivalRedrawDeclared.test.js — CENSUS-1f unit 2: the arrival scene's ⚠
 * redraw-once enforces the beats' declarations (CENSUS-2b/2d/2e's rows in `arrivalProse.js`,
 * `narrativeData.js`, the culture profiles). The pilgrims' queue declares `no crisis: threat,
 * unrest` (the chair's R-F(3)); on the merged base it printed under a siege, an insurgency, a
 * slave revolt, a war and an occupation (soak1k-255, -317, -353, -416, -639, -741, -785, -815, -992).
 * A birth whose first draws are all admitted draws exactly what it drew (the redraw happens only on
 * a refusal, on the scene's own substream).
 *
 * @enforced-by npx vitest run tests/generators/arrivalRedrawDeclared.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const PILGRIMS = /queue patiently for their turn at the holy places/;
const SEEDS = [255, 317, 353, 416, 639, 741, 785, 815, 992];

describe('the arrival scene redraws a refused line once (CENSUS-1f unit 2)', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('the pilgrims queue never prints under a threat or unrest crisis', () => {
    const failures = collectSeedFailures(SEEDS, (i) => {
      const s = birth(i).settlement;
      const crisis = factsOf(s).crisis;
      expect(crisis.has('threat') || crisis.has('unrest'), `soak1k-${i} carries threat or unrest`).toBe(true);
      expect(PILGRIMS.test(s.arrivalScene || ''), `soak1k-${i}`).toBe(false);
    });
    expectNoSeedFailures(failures, 'no threat or unrest birth prints the pilgrims queue');
  }, 60_000);

  it('the pilgrims queue still prints where nothing refuses it (soak1k-95, indebted)', () => {
    expect(PILGRIMS.test(birth(95).settlement.arrivalScene || '')).toBe(true);
  }, 30_000);
});
