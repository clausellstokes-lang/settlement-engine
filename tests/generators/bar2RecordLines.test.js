/**
 * bar2RecordLines.test.js — BAR2-LABELS batch 3 (REVIEW-BAR-2's DEFECON rows; the chair's rulings LB3, LB5 and LB6 of
 * 2026-11-15, vetoable by the owner), births of the census's own seeds (CENSUS-3 seedcfg.mjs: the r2r- and bar0- arms):
 *   · LB5 (C14738 C15234): under a siege, "Those holding the place keep order" only where a force holds it; where no
 *     garrison, militia, watch or hired force stands the clause is its twin (`safetyLineTruth.js :: SIEGE_NO_FORCE_ORDER`);
 *   · LB6 (C16557): "managed felling and sawmilling" only where the managed woodland stands; a sawmill without it takes
 *     `incomeLineSiblings.js :: TIMBER_SAWN_LINE`;
 *   · LB3 (C4306): "Diversified — broad institutional economic base" not where one source is half the income or more
 *     (`prosperity.js :: INCOME_HALF_FROM`): the city reads Concentrated.
 * A DECLARED MOVE of the record (the families in the commit). Each NOT pair is red at the batch's base (f8042b61a);
 * each KEEP pair is green before and after.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SIEGE_NO_FORCE_ORDER } from '../../src/generators/safetyLineTruth.js';
import { TIMBER_LINE, TIMBER_SAWN_LINE } from '../../src/generators/economy/incomeLineSiblings.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own birth (seedcfg.mjs, its r2r- and bar0- arms). @param {string} seed */
const birth = (seed) => {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const bar = seed.match(/^bar0-(\w+)-([a-z_+]+)-rand-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, settType: /** @type {RegExpMatchArray} */ (bar)[1], selectedStressesRandom: false,
      selectedStresses: /** @type {RegExpMatchArray} */ (bar)[2] === 'calm' ? [] : /** @type {RegExpMatchArray} */ (bar)[2].split('+'), _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
const text = (/** @type {any} */ t) => JSON.stringify(t.economicState);
const HOLDERS = 'Those holding the place keep order, and more harshly as the food runs down.';

describe('BAR2-LABELS batch 3: the record\'s lines read the record (LB3, LB5, LB6)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('LB5 NOT: the holders keep order under a siege where no force stands (the twin prints); KEEP: a force holds it', () => {
    const failures = collectSeedFailures(['r2r-thorp-58', 'r2r-hamlet-0', 'bar0-hamlet-under_siege-rand-4'], (seed) => {
      const t = text(birth(seed));
      expect(t.includes(HOLDERS), `${seed}: no holders`).toBe(false);
      expect(t.includes(SIEGE_NO_FORCE_ORDER), `${seed}: the twin`).toBe(true);
    });
    expectNoSeedFailures(failures, 'the siege order clause reads the forces');
    expect(text(birth('r2r-thorp-45')).includes(HOLDERS), 'r2r-thorp-45 (a force stands) keeps the line').toBe(true);
  }, 240_000);

  test('LB6 NOT: managed felling where no managed woodland stands (the sawn twin prints); KEEP: the woodland keeps it', () => {
    const failures = collectSeedFailures(['r2r-village-11', 'r2r-village-17', 'bar0-metropolis-calm-rand-3'], (seed) => {
      const t = text(birth(seed));
      expect(t.includes(TIMBER_LINE), `${seed}: no managed felling`).toBe(false);
      expect(t.includes(TIMBER_SAWN_LINE), `${seed}: the sawn twin`).toBe(true);
    });
    expectNoSeedFailures(failures, 'the timber line reads the woodland');
    expect(text(birth('r2r-village-16')).includes(TIMBER_LINE), 'r2r-village-16 keeps the line').toBe(true);
  }, 240_000);

  test('LB3 NOT: "Diversified" where one source is half the income (Concentrated prints); KEEP: a spread city keeps it', () => {
    const t = birth('bar0-city-under_siege+famine-rand-5').economicState;
    expect(t.incomeSources.some((/** @type {any} */ r) => r.percentage >= 50), 'the read town: one source at half or more').toBe(true);
    expect(t.economicComplexity).toBe('Concentrated — fewer revenue streams than scale suggests');
    expect(birth('bar0-city-wartime-rand-3').economicState.economicComplexity).toMatch(/^Diversified|^Highly diversified/);
  }, 240_000);
});
