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
// RE-KEYED BY IDENTITY 2026-11-07 (WIRING-W0 cause 1, THE MIGRATION DIRECTION DECLARED ONCE, the chair's R-W7 (e); record
// docs/shift-records/2026-11-07-w0-01-migration-direction.json): 1 of 60 moved, 57 (c71c3f22a9a9ff75 → a9588a373c64d70f), a
// mass_migration place (its record gains stress[].direction and the config projection, the stability label names the one
// direction, the arrivals vignette and secret pool); not the budget. Measured by this file's own loop at 343bd4eec against
// its parent 76febf9b0 (0 moved there); re-captured with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY again at the lane tip (WIRING-W0 records 02-05: the import share, the food-source count and the
// legacy annotations dated at birth reach every record; not the budget): 60 of 60 moved. Re-captured by this file's own
// loop at 1dd31a377 with the factor forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-07 (LANDING-R2, the pool census composed on rung 1's final 1bff51c6d, §934.105): 60 of 60
// moved, none by the budget (densityFactor is still forced to 1). The cause is the census's generator changes on the d = 1
// path — the same 33 lane commits the generator golden's record names (docs/shift-records/2026-11-06-rung2-01-census-
// composed-generator-master.json, the chair's ruled exception: per-cause stages are unbuildable on this landing). MEASURED,
// this file's own loop: rung 1's final 1bff51c6d 0 moved (the file green there); the census side f5dc50c6b red; and the
// all-row mover on its own lineage, 73fa1a1e7 (reader-tonight-wants R11 unit 3, the 76 registry goals rewritten in the
// house register) against its parent 7f0632463, moves 60 of 60 by itself. Re-captured at the tip dd2aab21d with the factor
// forced to 1.0, twice and equal.
// RE-KEYED BY IDENTITY 2026-11-08, MERGE-CAR (the integration landing: records A and B, the rung-2 landing's merge and the
// people car's merge over the integration branch; docs/shift-records/2026-11-08-merge-car-a-rung2-composition.json and
// docs/shift-records/2026-11-08-merge-car-b-people-car-composition.json): 60 of 60 moved, none by the budget (densityFactor
// is still forced to 1). MEASURED, this file's own loop on git-archive trees, by stage: the car's side carried W0's sixty
// (c30a69cf2; the W0 lane tip eb4c508e1 reads them byte for byte), and the W0 lane's merge into the integration branch
// fc834a6bd (composed over review-intake's generator changes) already moves 60 of 60, as does the merge base 262e8b255, so
// the car's tip 373a2947b read red (base -> car moves 60 more). The rung-2 side carried LANDING-R2's sixty (captured at
// dd2aab21d, on the rung-2 lane), which the integration tip 7b3ffb6ee also reads red (base -> integration moves 60). The
// people car's merge 8dff691f3 moves 60 against either side; the merged tip 2c7437030 equals the merge (its post-merge src
// fixes move none). Re-captured at 2c7437030 with the factor forced to 1.0, twice and equal.
// THEN 3 of 60 moved by the car's seam cure b19740ab3 (MERGE-CAR: the car's birth seams carry `_government` into the
// goal draw, and crisisCast refuses a seat-house member as instigator), seeds 21 (dccc50cde44307e5 -> 463e8f7a3e88d12f),
// 27 (ee38718de1b929c9 -> 9057c386767a53ef) and 43 (a57cae4ca1a8eaf8 -> 20d12b33835a0846): measured by this file's own
// loop, 4c39885fc reads the sixty as captured at 2c7437030 and the tip 3f95e3484 moves exactly these three; between them only b19740ab3 touches generation (9fd906c23 is display-only,
// record C 3f95e3484 is fence-only). Re-captured at 3f95e3484 with the factor forced to 1.0, twice and equal.
const BEFORE = Object.freeze([
  'a218c33e0b07fdbf', // 0
  'e54bcb6a762cd333', // 1
  '3c1040b8606c57a5', // 2
  '8ec0881d50b4ced1', // 3
  '612ab7970edcea30', // 4
  '05dff2518f76c0ea', // 5
  '2416408d696a144a', // 6
  'c85d6c3fb548276f', // 7
  '20a4d9e836903d88', // 8
  '81ac6cd106e8bd44', // 9
  '05a98c1fbc272d66', // 10
  '9b6f9b9f0584580f', // 11
  '12affc0a0fcd136a', // 12
  '59ed1a5564aca2c4', // 13
  'e69dccaa1d7a6cb2', // 14
  '346f5628f55d761a', // 15
  '01ec7ed5f56b5c9a', // 16
  '056d359c2e6e8544', // 17
  '51db271e4ef6e8b0', // 18
  '7157dfc6f8a8da56', // 19
  'ae6b07d20ab1f304', // 20
  '463e8f7a3e88d12f', // 21
  'c7162439da1debef', // 22
  '314029460c5b6b15', // 23
  'a87a741e59a35fbe', // 24
  '2e8b03858f465561', // 25
  '5a5d83c4d318d68f', // 26
  '9057c386767a53ef', // 27
  'e8bfebc77f27f23f', // 28
  'b934701f5e9a2021', // 29
  '78e56e6b81505156', // 30
  'fe4b466ac7c79ed4', // 31
  'b16cba79d26e9918', // 32
  'c4e552994de08e8a', // 33
  '79fe65f6003eefa7', // 34
  '0801f635bca220ad', // 35
  '5b434f746a4628bd', // 36
  '284523bee3281a86', // 37
  '6ae4fb2965cebb14', // 38
  '2c77009c8b2eb986', // 39
  '5e7ebade242e392a', // 40
  'dd364453155de218', // 41
  '4b44cdd1845ac7a2', // 42
  '20d12b33835a0846', // 43
  'e8713ee6471a6254', // 44
  '0b925ad0ec0b04ec', // 45
  '18232e2beeb3393c', // 46
  '24e494c6b58e84bc', // 47
  'eb8018f81482688c', // 48
  '5c529604051af62a', // 49
  '27eb2c526291d1a8', // 50
  'a520a9b640464baa', // 51
  'a697e52552f7fa30', // 52
  '5fc78ebcfde32be7', // 53
  'ff9d6533e474a67a', // 54
  '0f587f30e28a0c69', // 55
  '20b1d41950121bec', // 56
  'b821cb47cbc4e625', // 57
  'd95cd1565227f122', // 58
  '97d1424a0a11724d', // 59
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
