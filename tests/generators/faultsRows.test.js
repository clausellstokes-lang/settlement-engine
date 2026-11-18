// THE GUARD OF FAULTS-ROWS (the sixth chair's BRIEF-FAULTS, rulings FR3 and FR4, 2026-11-18): THE CARDS SAY WHAT THE TOWN'S OWN
// NEED LIST SAYS. The Annual fair's two lines, "Regional merchants. Luxury goods available." and "Merchants from across the
// region, and luxuries to be had.", printed in towns whose Economics tab says "Needed, and not brought in: luxury goods." (the
// control C32296, bar0-town-calm-rand-45). THE CURE (`src/data/institutionDescVariants.js :: DESC_LATE_SIBLINGS`, read by the late
// re-read `steps/assembleSettlement.js :: readHouseDescsLate`, no draw): each line declares `need not brought in: luxury` off
// (`domain/facts/needNotBroughtIn.js`, FAULTS-NEED's atom) and its twin, in its siege twin's form, says the fair is held and
// names no luxury as to be had. A town whose need list names no luxury keeps its line; a town under siege at the draw keeps the
// siege twin (the draw's declaration comes first). The fact asserted beside each anchor is the PAGE'S OWN need list
// (`tradeListDisplay.js :: importsAsPrinted().needed`), not the cure's atom. The counts over the thirty, the 150 and the 720 are
// in docs/chair/2026-11-18/faults/FAULTS-ROWS-HANDBACK.md; every seed loop collects.
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { importsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { LUXURY_LABELS_COPY } from '../../src/domain/facts/needNotBroughtIn.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';

const FAIR = 'Annual fair';
const LINE_A = 'Regional merchants. Luxury goods available.';
const LINE_B = 'Merchants from across the region, and luxuries to be had.';
const TWIN_A = 'A yearly fair for regional merchants. The luxuries the town wants do not reach it.';
const TWIN_B = "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them.";
const SIEGE_A = 'A yearly fair for regional merchants. None can reach it while the roads are held.';

/** THE LUXURY UNMET: the fair's line drawn, the need list names a luxury not brought in. [seed, the line drawn, its twin] */
const UNMET = Object.freeze([
  ['bar0-town-calm-rand-45', LINE_A, TWIN_A], ['r2r-town-56', LINE_A, TWIN_A], ['r2r-town-57', LINE_A, TWIN_A],
  ['r2s-recently_betrayed-town-0', LINE_A, TWIN_A], ['r2r-town-10', LINE_B, TWIN_B], ['r2s-monster_pressure-town-3', LINE_B, TWIN_B],
  ['r2s-wartime-town-2', LINE_B, TWIN_B],
]);
/** THE NEGATIVES: the fair's line drawn and the need list names no luxury (salt, gold/silver ore, livestock, stone, nothing). */
const MET = Object.freeze([
  ['r2r-town-31', LINE_A], ['r2r-town-49', LINE_A], ['r2r-town-54', LINE_A], ['r2r-town-23', LINE_B], ['bar0-town-calm-rand-28', LINE_B],
]);
/** UNDER SIEGE AT THE DRAW, a luxury unmet: the siege twin stands (the draw's declaration first). */
const SIEGED = Object.freeze([['r2s-under_siege-town-2', SIEGE_A]]);

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs's census and bar arms, in shape (as `bar8FishRows.test.js` reads them). @param {string} seed */
function configOf(seed) {
  const c = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (c) return { ...DIALS, settType: c[1] };
  const f = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (f) return { ...DIALS, selectedStresses: [f[1]], selectedStressesRandom: false, settType: f[2] };
  const m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (!m) throw new Error(`a guard seed is a census or a read seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
}

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const [seed] of [...UNMET, ...MET, ...SIEGED]) {
    BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
  }
}, 600_000);

const LUXURY = new Set(LUXURY_LABELS_COPY.map((l) => l.toLowerCase()));
/** The page's own need list names a luxury ("Needed, and not brought in: luxury goods."). @param {any} town */
const luxuryUnmet = (town) => importsAsPrinted(town).needed.some((n) => LUXURY.has(String(n).trim().toLowerCase()) || /\b(luxury|exotic)\b/i.test(String(n)));
/** @param {any} town */
const fairDescs = (town) => (town?.institutions || []).filter((/** @type {any} */ i) => i?.name === FAIR).map((/** @type {any} */ i) => String(i.desc));

describe('FAULTS-ROWS item 1: the Annual fair offers no luxury the need list says is not brought in (FR3)', () => {
  it('UNMET: the twin prints in the line\'s place, beside the page\'s own "Needed, and not brought in" luxury', () => {
    const failures = collectSeedFailures(UNMET, ([seed, line, twin]) => {
      const town = BORN.get(seed);
      expect(luxuryUnmet(town), `${seed}: the page's need list names a luxury`).toBe(true);
      expectAbsentWithAnchor(fairDescs(town), line, twin, seed);
    });
    expectNoSeedFailures(failures, 'every fair beside an unmet luxury prints its twin');
  });

  it('MET: a fair whose town\'s need list names no luxury keeps its line', () => {
    const failures = collectSeedFailures(MET, ([seed, line]) => {
      const town = BORN.get(seed);
      expect(luxuryUnmet(town), `${seed}: the page's need list names no luxury`).toBe(false);
      expect(fairDescs(town), `${seed}: the line kept`).toEqual([line]);
    });
    expectNoSeedFailures(failures, 'every fair with no unmet luxury keeps its line');
  });

  it('THE ORDER: under a siege at the draw the siege twin stands, a luxury unmet or not', () => {
    const failures = collectSeedFailures(SIEGED, ([seed, siege]) => {
      const town = BORN.get(seed);
      expect(luxuryUnmet(town), `${seed}: the page's need list names a luxury`).toBe(true);
      expect(fairDescs(town), `${seed}: the siege twin`).toEqual([siege]);
    });
    expectNoSeedFailures(failures, 'the siege twin keeps its precedence');
  });

  it('THE SHARED PAGE prints the fair\'s card as the owner\'s page does (N4)', () => {
    const failures = collectSeedFailures([...UNMET, ...MET], ([seed]) => {
      const town = BORN.get(seed);
      expect(fairDescs(toPublicSafe(town)), `${seed}: the shared page`).toEqual(fairDescs(town));
    });
    expectNoSeedFailures(failures, 'the shared page prints the owner\'s card');
  });

  it('THE TABLE: each line is a late key whose twin names no luxury as to be had, and both declare the siege off', () => {
    for (const [line, twin] of [[LINE_A, TWIN_A], [LINE_B, TWIN_B]]) {
      const set = /** @type {any} */ (DESC_LATE_SIBLINGS)[line];
      expect(set, line).toBeDefined();
      expect(set.map((/** @type {any} */ l) => l.text)).toEqual([line, twin]);
      expect([...set[0].excludes]).toEqual(['crisis: under_siege', 'need not brought in: luxury']);
      expect([...set[1].needs]).toEqual(['need not brought in: luxury']);
      expect([...set[1].excludes]).toEqual(['crisis: under_siege']);
      expect(twin).not.toMatch(/luxur(?:y|ies) (?:goods )?(?:available|to be had)|on offer/i);
    }
  });
});
