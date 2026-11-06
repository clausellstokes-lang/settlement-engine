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
const BEFORE = Object.freeze([
  'e6ac9242fde826c5', // 0
  '538078cfed56f711', // 1
  'f8ae9f1cba50484c', // 2
  'b79bd2a9bb017f26', // 3
  'c3b67c3f7c272fb1', // 4
  '86f2f518dcc098fe', // 5
  '55b6797ffcfe30d5', // 6
  '5f41e1b04e1e892e', // 7
  'f27de545335b4315', // 8
  '10c41ae0010e232e', // 9
  'ec2e5b9f17d063a4', // 10
  '9e168a54ee82e906', // 11
  'bb885fcbcb00559c', // 12
  '0a971fec05bd117e', // 13
  '4c66c8abfc117f8d', // 14
  '2ae8abf100ba8d8d', // 15
  'fb56c4dc3d4f0f96', // 16
  '372b2b821490088b', // 17
  '007acd9c21a1f153', // 18
  'bf3fca3dd85eca7e', // 19
  'ec9ca48cac4caa46', // 20
  'e35117139d68b877', // 21
  '1c1e792b0b1c4914', // 22
  '91583616f014238a', // 23
  '88febb41697df3f8', // 24
  '820c381ae698685c', // 25
  '6ccc54035f3b949e', // 26
  '5164d746227d374d', // 27
  '7c5b3719cf0d5a56', // 28
  'd0b637aa031535ec', // 29
  '760e2ae7fa5b56da', // 30
  'aa2e57f81f8df5d2', // 31
  '43871a622389f4eb', // 32
  '9b66af04feb5c874', // 33
  '35ec1d4738a2f003', // 34
  'e9bf64a5572b86ac', // 35
  '00e54c54c10569df', // 36
  'd91a9a06d4cf443d', // 37
  'f8b0c3bd26bc3e80', // 38
  '77c2bd9134764c5f', // 39
  'eb60d0e718fd20d6', // 40
  'e96e8b38f29f1585', // 41
  'ebafb5147efb69a6', // 42
  '208f82792883c676', // 43
  '65dcdc8451217756', // 44
  '0fb804809ad6b4b0', // 45
  '2b4a0db14d7ea661', // 46
  '881aceff26fdd2ce', // 47
  '990b40e3588eb665', // 48
  '23b54fae0398a3df', // 49
  'cd9fe6d601929a36', // 50
  '542c8543723e5319', // 51
  '0fd5c8b3e473c203', // 52
  '4a2f15df76208200', // 53
  '180216611784fa28', // 54
  '5ae67ffa0872db75', // 55
  '449037fc9ff9de04', // 56
  'c71c3f22a9a9ff75', // 57
  'f3f392c41a641472', // 58
  'b212c921fe91d52a', // 59
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
