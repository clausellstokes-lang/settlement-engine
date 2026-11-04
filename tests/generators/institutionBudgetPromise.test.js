/**
 * X-46 car 3 — THE PROMISE (docs/DESIGN_X46_SCALE_TRAIN.md §2, §4 "The mechanism").
 *
 * The institution budget scales CHANCES only: the density factor is computed once from the
 * population before the first draw, and the catalogue's draw order and the number of draws are
 * the catalogue's own. So with the factor forced to 1.0 every seed must be byte-identical to the
 * tip the budget was built on (8cc245db0, X-46 car 1 U4). The sixty record hashes below were read
 * at that tip, by this file, before a line of the budget existed.
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

const BEFORE = Object.freeze([
  '6f192392089aec0e', // 0
  'ec0adb0b3b9f1868', // 1
  '8911c1d2da8a1168', // 2
  'b1e2a2721f523bef', // 3
  '39c7eae64b5d4103', // 4
  '0c6a10fe48aee19a', // 5
  'b180ff17486ab7db', // 6
  '90549983c9f68f04', // 7
  '1c7eaa6c788c78eb', // 8
  '440b9b3d4f9ae48d', // 9
  '92bb497b1a9bf851', // 10
  '7a3f4b5f8f0f8c03', // 11
  '9fc9827a3a3b0a65', // 12
  'd2f714afead526ea', // 13
  '9e845b05817549b9', // 14
  '6968fad403c0c85f', // 15
  '2645bb3a3787cf53', // 16
  '07a2605c2a48380f', // 17
  '7361d8b0632ec571', // 18
  'b0975fc6fca6dd75', // 19
  'b69d81c92484ceca', // 20
  '27576a6605af8915', // 21
  '4b8dc75d06c3fa6d', // 22
  'f40b76d1f53cbbdb', // 23
  '2910f75379fb3e93', // 24
  'eb5d00a0a45a9e69', // 25
  'e625a8d6840298d9', // 26
  '4464f69e08a8f94a', // 27
  '0c3bf07c408d3329', // 28
  '37d61c63415db081', // 29
  'f43cc9c9e613a38f', // 30
  '84af4bca507f0e19', // 31
  '02e8f2d68f719bc7', // 32
  '35cce954315e1549', // 33
  '331fe5b5c2ac0b58', // 34
  'fa75e3416afe10ef', // 35
  'b9859585d52de2ff', // 36
  '5142da9d8b3f99eb', // 37
  '2dc339f0c004fde6', // 38
  'f42f643e881047a9', // 39
  'acb52449708521ce', // 40
  '4a64af79d46def28', // 41
  '8cdd4ff31d37d348', // 42
  '991c8bcc909ddbb2', // 43
  '6a33c325d3aed672', // 44
  '58953aac52fcd57c', // 45
  '79352da8fe687a7b', // 46
  '1f61c412dab82433', // 47
  '92230207fdd53b22', // 48
  '1553a433071a96b6', // 49
  '36eeeccf00d5ab1f', // 50
  '11e5435fe5dda3e0', // 51
  'f3dccde776c10903', // 52
  'ba8fac6a37f5ce0d', // 53
  'ec515052cd6a1458', // 54
  '85478a45c528a1c6', // 55
  '90cfc95db479470a', // 56
  '2c351dbd0bd72c7f', // 57
  'c97552938250b04e', // 58
  '60888736ead271e3', // 59
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
