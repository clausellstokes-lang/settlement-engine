/**
 * R3-TABS-4, the chair's ruling (c) of 2026-11-14 on the fresh reader's F2 (MEDIUM) and F7 (LOW), L0's note on the
 * watch WITHDRAWN: A WATCH IS NOT THE TOWNSPEOPLE IN ARMS and not a force that holds a perimeter. In a town whose only
 * force is its watch, the Invasion row prints no citizen-militia line ("Every household at … would send someone to
 * the walls") and no no-force line, and the beasts row no held-perimeter line ("there is a wall to hold and there
 * are people to hold it") and no no-force line; no pool the row's key can select is true there, so the Invasion
 * sentence (and the supply clause beside it) is silent. A town with a militia keeps its pool.
 *
 * RED-FIRST at fe7eaaf09 on the reader's 1,536 births: the citizen-militia pool in 139 towns with no militia, a
 * held-perimeter line in 135 watch-only towns; the four towns below printed them (Cerrocastra, r2s-occupied-town-0,
 * military 1, under occupation: "Every household at Cerrocastra would send someone to the walls").
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { defenseThreatProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The reader's births.mjs cfgFor, verbatim in its three shapes. */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-(\d+)$/);
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
};
const WATCH_ONLY = ['r2s-occupied-town-0', 'rr3-town-famine-rand-1', 'r2r-town-11', 'rr3-town-under_siege-rand-3'];
// R3-TABS-5, the chair's ruling (h): RE-KEYED BY IDENTITY. Makropyrgos (rr3-thorp-occupied-rand-1) reads Critical on its
// Invasion & War bar, where the citizen-militia pool's "would see off a raid" is now not drawn; the keeper is a walled
// militia thorp whose bar does not read Critical (Weak), so the arm still asserts a real militia keeps its pool.
const MILITIA = 'rr3-thorp-famine-rand-0';
const TOWNS = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...WATCH_ONLY, MILITIA]) TOWNS[seed] = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
}, 300000);

const poolOf = (row) => row?.provenance?.poolKey ?? null;
const LEVY_OR_NO_FORCE = /citizen militia|militia only|NO force|neither walls nor force/;
const HELD_OR_NO_FORCE = /perimeter AND organized force|credible deterrence|NO force|nothing organized/;

describe('a watch is not the townspeople in arms (F2, F7)', () => {
  test('in a watch-only town no row names a levy, a held perimeter or no force', () => {
    const failures = collectSeedFailures(WATCH_ONLY, (seed) => {
      const f = standingDefenseForces(TOWNS[seed]);
      if (!f.watch.present || f.garrison.present || f.militia.present || f.mercenary.present) throw new Error('premise: not watch-only');
      const desk = defenseThreatProse(TOWNS[seed], { seed });
      if (LEVY_OR_NO_FORCE.test(poolOf(desk.invasion) || '')) throw new Error(`invasion ${poolOf(desk.invasion)}: ${desk.invasion.sentence}`);
      if (HELD_OR_NO_FORCE.test(poolOf(desk.beasts) || '')) throw new Error(`beasts ${poolOf(desk.beasts)}: ${desk.beasts.sentence}`);
    });
    expectNoSeedFailures(failures, 'the watch read as a watch');
  });
  test('a town with a militia keeps the citizen-militia pool', () => {
    expect(standingDefenseForces(TOWNS[MILITIA]).militia.present).toBe(true);
    expect(poolOf(defenseThreatProse(TOWNS[MILITIA], { seed: MILITIA }).invasion)).toBe('Invasion & War: walls with citizen militia');
  });
});
