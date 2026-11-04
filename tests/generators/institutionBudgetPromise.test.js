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
const BEFORE = Object.freeze([
  'e6ac9242fde826c5', // 0
  '4cc933d2394ecca7', // 1
  'a44f27db016758c7', // 2
  '5a8ad024e30e2c53', // 3
  '906d7f344923302e', // 4
  '60b4a45904c8a2bd', // 5
  '1136b8cdccb81ff0', // 6
  '6d736feb0d3fe768', // 7
  '3a6f3754c0c975fa', // 8
  'ef17d8af3b9053a4', // 9
  '77b3e0d288a81151', // 10
  '5d94262ff4cf8f0f', // 11
  'ffc8548a3980a603', // 12
  '0a971fec05bd117e', // 13
  '578292f9048be8f5', // 14
  'cbb20093292f4f8a', // 15
  '7698b0cce83cb5f0', // 16
  'ea54c033047a340d', // 17
  'a7b71385dd8f0eab', // 18
  'bf3fca3dd85eca7e', // 19
  'faa1fa04f3c8b86f', // 20
  '50ff6118d772e53f', // 21
  'cff811402b96b2d0', // 22
  '7266162ca8d9b3e3', // 23
  '2717027b5f766c00', // 24
  '83fda962420a9e5b', // 25
  'e9fbb104f62a6f23', // 26
  '8e193e736ca3a18a', // 27
  '22869ae4b83c0659', // 28
  '3e63fb405fa0443f', // 29
  '11c3995c9afbc451', // 30
  '4d6390abb38f412d', // 31
  '95663c72cc86ef42', // 32
  '54655b4e4dbed139', // 33
  '96677a1b5af97691', // 34
  '6bf30b109fdb2b7d', // 35
  'cd66315865af5c77', // 36
  'b29b49529d5f37f4', // 37
  '989f06f13fc5f4eb', // 38
  '66ea47b5fff75da5', // 39
  '978515b6d1645e37', // 40
  'e0d9531de272b546', // 41
  'ebafb5147efb69a6', // 42
  '81c13d55708e5489', // 43
  '3e36e4745caf5098', // 44
  '3dde1b6eb32ca848', // 45
  '282057523eef7d20', // 46
  '8c25d21e046b011d', // 47
  '2c65f91c9c2053b7', // 48
  'f6bb99cf38e7e2ab', // 49
  'e66d6dae5dac47c2', // 50
  'f58cc8c699197f05', // 51
  'ba7ece8c98554eb4', // 52
  'e3d69adfdb03196c', // 53
  'ae74723f029d3600', // 54
  'b17a87a1ca19d331', // 55
  '83a757e8240291f7', // 56
  '9d8c2d45ee5c9e20', // 57
  'ca58fc1fb2c3708c', // 58
  '287863703f30da17', // 59
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
