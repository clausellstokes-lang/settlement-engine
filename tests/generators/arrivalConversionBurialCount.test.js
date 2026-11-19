/**
 * tests/generators/arrivalConversionBurialCount.test.js — R2-CODE-A-12, the chair's ruling (3) on the reader's MEDIUM (a)
 * (REVIEW-R2-CODE-A, step 2 #2): `narrativeData.js :: STRESS_DESCS.religious_conversion` printed "Karakabad has two
 * burial grounds now, one old and one new…" in 77 of the reader's 3,048 births (34 at the stage's base), every one
 * with ONE burial house on its roster (r2r-village-5).
 * THE RULING: A COUNT WORD READS THE ROSTER: "two burial grounds" only where two burial houses stand; else a twin true
 * of one, or silence. The vocabulary has no burial atom (no new word is written), and no roster in the 3,048 holds two
 * burial houses, so the row's slot takes the twin: the dead "buried in two rows now, the old faith's and the new" (the
 * graves', true of one burial ground) and "whoever digs the graves" (no role the roster lacks). No draw moves.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { STRESS_DESCS } from '../../src/data/narrativeData.js';
import { textOf } from '../../src/domain/facts/textOf.js';

/** A count of burial houses, or a gravedigger the roster does not hold. */
const COUNTED_HOUSES = /\b(?:two|three|both|twin) (?:burial grounds|graveyards|cemeteries|churchyards)\b|\bgravedigger\b/i;

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`), verbatim. @param {string} seed */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} }));
  const m = /** @type {RegExpExecArray} */ (/^rr3x?-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
};

describe('under a conversion the arrival counts no burial houses the roster does not hold', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('no line of the conversion pool counts burial houses or names a gravedigger', () => {
    const lines = STRESS_DESCS.religious_conversion.map((l) => textOf(l)('Q'));
    expect(lines.some((t) => /^The dead of Q are buried in two rows now, the old faith's and the new\b/.test(t)), 'the twin is in the pool').toBe(true);
    expect(lines.filter((t) => COUNTED_HOUSES.test(t)), 'the conversion pool').toEqual([]);
  });

  // the reader's town (a village with one Graveyard), the smallest (a thorp of 6, one Burial ground) and the largest
  // (a metropolis of 29,483, one Cemetery network) of the 77 that drew the row
  it('the towns that drew the row bury their dead in two rows, and count no houses', () => {
    expectNoSeedFailures(collectSeedFailures([
      'r2r-village-5', 'rr3x-thorp-religious_conversion-port-2', 'rr3x-metropolis-religious_conversion-isolated-1',
    ], (seed) => {
      const scene = String(born(seed).arrivalScene);
      expect(scene, `${seed}: the twin`).toMatch(/^The dead of \S+ are buried in two rows now, the old faith's and the new, and the \w+'s grief/);
      expect(scene, `${seed}: no count of houses`).not.toMatch(COUNTED_HOUSES); // anchored: the line above asserts the twin prints here; red at e6b636fd7 (3 of 3)
    }), 'the towns that drew the row');
  });
});
