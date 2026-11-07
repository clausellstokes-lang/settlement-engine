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
const BEFORE = Object.freeze([
  'e2afc1ee014331fc', // 0
  'abf48f9e09131c8e', // 1
  'e2a320a9a306a281', // 2
  'a430b0dba889de05', // 3
  'aeab1f77a06c674c', // 4
  'e3f5a58bf1d01835', // 5
  '39169be432d3ef98', // 6
  'be9e39e64457f42f', // 7
  'd0f6085d7d01e4bf', // 8
  '5613e914ab1868b6', // 9
  'fd1095c275954872', // 10
  'f17560fc83f7d881', // 11
  'd143e98483c63466', // 12
  '9946861bfc60da31', // 13
  'c09e6c0d71a40cc6', // 14
  'ee1e5995001897a5', // 15
  '07cc3e4a07598c78', // 16
  'd60a1bb30d5d2a62', // 17
  'e78c82d4be58c0e0', // 18
  '30f6f77df6d5ed5c', // 19
  '7aeeb716fb58cb20', // 20
  '45827939d2c77474', // 21
  '2693f193ee916866', // 22
  'e7f5a787b64f6d70', // 23
  'd4de32b9a359c4f3', // 24
  'f63650389955bc21', // 25
  '149321ea27037c1c', // 26
  '05cfcb1053d40723', // 27
  'df5707e12b759405', // 28
  '4307ae5fb1f2f0fb', // 29
  '059ed3878f81dda6', // 30
  '251cb9da9fda4513', // 31
  'a6c5c48bae17f973', // 32
  'eca9a46483bc199a', // 33
  '8025744ca5778dd5', // 34
  'dc4e7e242805a23b', // 35
  '6557e0cee17b4675', // 36
  '62c325457587ab0d', // 37
  'bfd337952132d0f5', // 38
  '568dfa92c9da6409', // 39
  'a83a73efb90bc2b7', // 40
  'bd986b271826baee', // 41
  '07aa9fc2135f3739', // 42
  '5ffd52fb85a4af57', // 43
  '0285441f2d1f1c91', // 44
  '64a801cecacc5899', // 45
  'bf4a6051cabf54e2', // 46
  '5725466f7b2c27f8', // 47
  '76ce3243224f3335', // 48
  'ab9f44bf40df5bf0', // 49
  '8bdf13c342d0a400', // 50
  '9c2132b65eff9ec2', // 51
  '63ce2b4f40bdd66c', // 52
  '7395e0394234c596', // 53
  'f39f294d43058b6f', // 54
  '0b0a1a1219bb8020', // 55
  '177bcfde72f48f54', // 56
  '7960398b7015e9dc', // 57
  '644ca6b055458360', // 58
  'cd6c7bceffae6e69', // 59
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
