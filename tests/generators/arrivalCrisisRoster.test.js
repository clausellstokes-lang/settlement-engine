/**
 * tests/generators/arrivalCrisisRoster.test.js — R2-CODE-A-3, the round-three cut's increment (lane ra), HIGH ww-58,
 * ww-540 and ww-920 (`narrativeData.js :: STRESS_DESCS`, the arrival's crisis vignette):
 * - ww-58, rww-village-religious_conversion-1: "The mason's yard in Hochplatz is its busiest enterprise" — no mason's
 *   yard on the roster. The row names no yard (record 386 (3)) and needs a sacred house, whose symbols it speaks of.
 * - ww-540, rww-hamlet-succession_void-1: "The masons of Xitang have stopped mid-job on the great house" in a hamlet
 *   of 31. The row names no masons and no great house, and needs a town's size for stone building work.
 * - ww-920, rww-village-indebted-1: "The merchant district of Quirigek…" in a village of 222: a district is a size
 *   error below the middling band (the chair's ruling (f)); the row needs it.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe("the reader's three towns, born as the app births them", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  /** @param {string} seed */
  const born = (seed) => { const m = /** @type {RegExpMatchArray} */ (seed.match(/^rww-(\w+)-([a-z_+]+)-\d+$/)); return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} })); };
  it.each([
    ['rww-village-religious_conversion-1', /mason/i],
    ['rww-hamlet-succession_void-1', /masons|great house|scaffolding/i],
    ['rww-village-indebted-1', /merchant district/i],
  ])('%s: the arrival names nothing its roster or size lacks', (seed, false_) => {
    const s = born(seed);
    expect(String(s.arrivalScene)).not.toMatch(false_);
  });
});
