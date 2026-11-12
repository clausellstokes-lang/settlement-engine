/**
 * poolDominance.walker.test.js — THE DOMINANCE ARM'S DOOR (COHERENCE-QUARREL, 2026-11-11; the
 * chair's charter `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §3).
 *
 * A pool that looks large in the source can print a handful of lines. The arm
 * (`scripts/census/pool-dominance.mjs`) measures, for every drawn pool over a fixed corpus of 360
 * settlements, the share its most-printed line takes and the share its five most-printed lines
 * take. Its register (`scripts/census/pool-dominance.register.json`) holds one ceiling of each
 * per pool, and the ceilings only tighten:
 *   - no pool rises above its ceiling;
 *   - every drawn pool has a row, and every row's pool is still drawn;
 *   - no ceiling sits looser than its measure by more than the slack (tighten it with
 *     `node scripts/census/pool-dominance.mjs --tighten`, which never raises a ceiling).
 *
 * @enforced-by tests/lint/poolDominance.walker.test.js
 */
import { describe, expect, test } from 'vitest';

import { judge, measureDominance, readRegister } from '../../scripts/census/pool-dominance.mjs';

describe('no drawn pool prints more of one line than its register allows', () => {
  const table = measureDominance();
  const findings = judge(table, readRegister());

  test('the corpus draws pools, and the record pools are among them', () => {
    expect(table.size).toBeGreaterThan(100);
    for (const pool of ['record:conflicts.issue', 'record:conflicts.plotHooks', 'record:safetyProfile.plotHooks']) {
      expect(table.get(pool)?.draws ?? 0, pool).toBeGreaterThan(100);
    }
  });

  test('no pool rises above its ceiling', () => {
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
