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
const BEFORE = Object.freeze([
  'e6ac9242fde826c5', // 0
  'd57c30a0385ee1ff', // 1
  'a7411978c4fe7e44', // 2
  'ba2b42371aa50a62', // 3
  'fc879223e88b0d8f', // 4
  '241ef10b46b8d545', // 5
  'fd2e0353f8616995', // 6
  '27a1d22ea2af15ac', // 7
  'a2114b170b45fa5a', // 8
  '4f1a2ee9a805e61e', // 9
  '8364bef6f9f0adba', // 10
  'a58802dc2a26d4d3', // 11
  '76ea343961c6cf73', // 12
  '1b58933eabb3d698', // 13
  'd4e55d3d1159ab83', // 14
  'ada0412f8d624c60', // 15
  '812ef446dbd88864', // 16
  'c02f0a5e73eb3e63', // 17
  '58f1faeeecc66eab', // 18
  'bf3fca3dd85eca7e', // 19
  '7fdd297290f11021', // 20
  '33fc6a2099647f33', // 21
  'cff811402b96b2d0', // 22
  '667fbdee2fba123d', // 23
  '01a09a91303fea82', // 24
  '0a9fd5fa6ba01d3b', // 25
  '586aaa34a586dcae', // 26
  '39352e37eac7e550', // 27
  '1da4fb926165b25c', // 28
  '89e03d1a1de61c07', // 29
  'db017088c2d114e7', // 30
  '4d6390abb38f412d', // 31
  '83d6fa86a665ed2a', // 32
  'aeeb2b7a8b95302e', // 33
  '68a285cc29628922', // 34
  '3c559247a89eea52', // 35
  '43cd75d9fde0aced', // 36
  '884fc212491b7c7a', // 37
  'bbdfac55a4ab265c', // 38
  '572174ee260bdd21', // 39
  '6be2d2de1315eeb0', // 40
  '202e4d5a12c196d5', // 41
  '1a181e51a5e6bde6', // 42
  '958cb056f7b3bc72', // 43
  '8d028ed452a894b1', // 44
  '568414947c925d12', // 45
  '2fae796b112017b3', // 46
  '6304afeffbcf507c', // 47
  '67f9f1481e45bd53', // 48
  'f6bb99cf38e7e2ab', // 49
  '83684aafce9b2921', // 50
  '868527fb74f63668', // 51
  'fd6c3ee6c24d3c8a', // 52
  'f6338676f90a900c', // 53
  '81817035c2c632de', // 54
  'ce6776f5579d5223', // 55
  '135dd9a9b4373ef2', // 56
  'cda061cf9f1bea92', // 57
  '34437d92b079f680', // 58
  '3c8718026e709b5b', // 59
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
