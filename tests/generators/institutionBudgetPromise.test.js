/**
 * X-46 car 3 — THE PROMISE (docs/DESIGN_X46_SCALE_TRAIN.md §2, §4 "The mechanism").
 *
 * The institution budget scales CHANCES only: the density factor is computed once from the
 * population before the first draw, and the catalogue's draw order and the number of draws are
 * the catalogue's own. So with the factor forced to 1.0 every seed must be byte-identical to the
 * tip the budget was built on (8cc245db0, X-46 car 1 U4; on the composed window, 79c4423). The sixty
 * record hashes below were read at that tip, by this file, before a line of the budget existed.
 *
 * The cells are the certification matrix's first sixty (`configForIndex`: ten per tier, every
 * culture, terrain, route, threat, content profile and magic scenario it cycles), born the app's
 * way (`birthConfig` after `loadGenerationLawPayloads`), seed `x46-promise-<i>`.
 */
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/data/institutionBudget.js', async (importOriginal) => {
  const actual = /** @type {Record<string, unknown>} */ (await importOriginal());
  return { ...actual, densityFactor: () => 1 };
});

import { configForIndex } from '../../scripts/audit/generation-certification-soak.mjs';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// Re-keyed by identity 2026-11-04 (rung-1 pins, unit 1): the sixty were read at the budget's own
// base 8cc245db0; composed onto the window branch, "the tip before the budget" is 79c4423 (the
// window with x46-1b composed, x46-3 not yet), whose generation the sibling lanes moved (x46-2's
// renames, the dragon licence, the tailed metropolis roll). Re-read at 79c4423 by this file's own
// loop with no budget module present; the composed tip at d ≡ 1 matches all sixty.
// RE-KEYED again 2026-11-04 (window branch, the chair's I7 (2)): RUNG1-TRUTH's generator changes (the derived
// hooks, the crisis tier noun, the criminal structure, the named stress factions) moved the sixty, which no longer
// have a pre-budget tip to read on the window branch; re-captured by this file's own loop at the composed tip
// (6ca454d2) with the factor forced to 1.0, twice and equal. The arm now guards the d = 1 path against drift.
// RE-KEYED BY IDENTITY 2026-11-06 (LANDING-7 lane E, the chair's ruling R-E12, §934.105): 56 of 60 moved (0, 13, 19 and
// 42 held), and the promise STANDS UNDER F6'S LAW. F6 (record 22, docs/RUNG1B_F6_BUDGET_FLOOR_2026-11-04.md) changed only
// how d is computed (the target gives way: anchor − R − X over the scalable rows); its new code reaches the draw only through
// `densityFactor`, which this file forces to 1, and X is an expectation read without a draw. MEASURED, this file's own loop
// per first-parent stage from 6ca454d2b (0 moved): F5 INSTRUMENTS 7e28a6331 0 → 5, F6 BUDGET-FLOOR 6d84aa834 5 → 5 (moves
// NONE), F1 DEFENCE-WORDS 5e9ffb220 5 → 28, F3 FOOD-WORDS db8ce5da8 28 → 38, F4 CRIME-SIGNAL ba9fde402 38 → 56, and no later
// stage to this branch's tip. The movers are the rung-1B word and instrument lanes' generator changes on the d = 1 path, not
// the budget. Re-captured by this file's own loop at 6fb0de59f with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-06 (LANDING-9, the rung-1 landing at 3c62e8ef5): 13 of 60 moved, by four signed records,
// none of them the budget. MEASURED, this file's own loop per first-parent stage from 3d8a74e4b (0 moved), each step's
// mover isolated by reverse-applying its other commits' src/ diffs: lane D b37bbf395 moves 24 (bfd70d809, the food floor
// that record 34 supersedes); lane F1 3da1104da moves 8, 20, 44 (59237b232, the Village watch's texts, record 32); lane G
// 64ad4fe47 moves 51, 53 (5d3f7b5cb, the vacant seat from its fact, record 33); lane H 18fd6b442 moves 6, 13, 24, 30, 31,
// 36, 49 (66b1407bd, the food per cent from the pounds, record 34) and 8, 14, 20, 44 (8e92c0440, the Village watch
// presumes no governor, record 35); 5f6d243b2 and every other step move none. Re-captured at 3c62e8ef5 with the factor
// forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-07 (LANDING-R2, the pool census composed on rung 1's final 1bff51c6d, §934.105): 60 of 60
// moved, none by the budget (densityFactor is still forced to 1). The cause is the census's generator changes on the d = 1
// path — the same 33 lane commits the generator golden's record names (docs/shift-records/2026-11-06-rung2-01-census-
// composed-generator-master.json, the chair's ruled exception: per-cause stages are unbuildable on this landing). MEASURED,
// this file's own loop: rung 1's final 1bff51c6d 0 moved (the file green there); the census side f5dc50c6b red; and the
// all-row mover on its own lineage, 73fa1a1e7 (reader-tonight-wants R11 unit 3, the 76 registry goals rewritten in the
// house register) against its parent 7f0632463, moves 60 of 60 by itself. Re-captured at the tip dd2aab21d with the factor
// forced to 1.0, twice and equal.
const BEFORE = Object.freeze([
  'd3907bbcf4a47a3e', // 0
  '1b1be5b33abaa994', // 1
  '98a545ca5410795d', // 2
  '3efbbe65e505e370', // 3
  'a93910b620b5e8a0', // 4
  '2cd628dfc5f9ad5c', // 5
  '02a140a6c31d79a4', // 6
  'd6cfa9236c28e148', // 7
  'a6957733fc9637ac', // 8
  '2e6e79205f5bc4e8', // 9
  '68680158b811cc0c', // 10
  'c2e607a6d3b2aab0', // 11
  '4ecdf7dd0ef5df48', // 12
  '4cb56c27c8089413', // 13
  '5e9f28dcfb01930b', // 14
  'b41b5befbb667036', // 15
  'fc97d9fa3531f623', // 16
  '98e9f02a5f82bf8d', // 17
  'dd620ec0f3813f37', // 18
  '5572403f817dc4fc', // 19
  'f3e847f64d556d7e', // 20
  'd5cd6c379b96f2da', // 21
  '2b0dd71f02c29498', // 22
  'e6b22bd962be039c', // 23
  '7cbdaf58c6f3f294', // 24
  '41e40ae02e5236ed', // 25
  '4314cbfc8a2219d8', // 26
  '71720481c9cb6b5c', // 27
  '444ccdd021a13938', // 28
  'd6443b3c0dfa3764', // 29
  'aa33f54e600076b8', // 30
  '38594deea820d18f', // 31
  '3678534195830eec', // 32
  'c0fa0cc0fa336909', // 33
  'e0549f7fedcf38f4', // 34
  '820691a64e512879', // 35
  'c0ca90d43ce2a48e', // 36
  'd52ccf2109512092', // 37
  '44489cede99fb32d', // 38
  '5177841cf995b34f', // 39
  '902a9cd54c1e34a1', // 40
  'ec246c1b8e3d2ced', // 41
  'b4687a4f25d6a0fe', // 42
  '96e5a94299e04f25', // 43
  '29b5c593b26c9887', // 44
  '19d9eac6f4c2f90d', // 45
  '537e78c8a50cbf10', // 46
  'c29a3d7b8b268b9d', // 47
  'edd82e5cfaf2fc2e', // 48
  '8dc39ae2ecfa821c', // 49
  'c769f5ed5024b428', // 50
  'c84b6d952d5686ec', // 51
  'ea4d78a814f5d624', // 52
  'd9f17d8bf42a5152', // 53
  '6788271d980c17dc', // 54
  'cebc0aaa3ef37fd9', // 55
  'f76de55f1128abb5', // 56
  '3a987b742c698b4c', // 57
  'ab43a6c2028b032c', // 58
  '9c73b6483bdec76e', // 59
]);

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);

describe('X-46 car 3 — the promise: the factor at 1.0 is the tip before the budget', () => {
  /** @type {string[]} */
  const hashes = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (let i = 0; i < 60; i += 1) {
      const config = birthConfig({ ...DEFAULT_CONFIG, ...configForIndex(i) });
      hashes.push(hashOf(generateSettlementPipeline(config, null, { seed: `x46-promise-${i}` })));
    }
  }, 240_000);

  it('every one of sixty seeds is byte-identical with the density factor forced to 1.0', () => {
    expect(hashes).toHaveLength(60);
    expect(BEFORE).toHaveLength(60);
    const moved = hashes.map((h, i) => (h === BEFORE[i] ? null : i)).filter((i) => i !== null);
    expect(moved).toEqual([]);
  });
});
