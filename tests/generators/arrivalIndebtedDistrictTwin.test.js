/**
 * tests/generators/arrivalIndebtedDistrictTwin.test.js — R2-CODE-A-14, THE CHAIR'S RULING (s2) of 2026-11-14 on the
 * reader's L05 (HIGH, carried): "The merchant district of {S} looks prosperous…" (`STRESS_DESCS.indebted[3]`) printed
 * in middling villages with no market. It takes `market` (as its famine twin's merchant quarter does), and A DRAW IS
 * NOT MOVED: the slot is kept and takes a TWIN true without a market (`STRESS_DESCS.indebted[6]`, "The best-kept street
 * of {S}…": no district, no quarter, no market), reached by resolution only (`arrivalScene.js :: drawAdmitted`).
 *   D1 the collected towns (the district printed with no market at the base; the reader's r2r-village-47 among them):
 *      the twin prints, no district, and the rest of the scene is the base's, beat for beat;
 *   D2 the guard towns (a market stands): the district still prints.
 *
 * @enforced-by npx vitest run tests/generators/arrivalIndebtedDistrictTwin.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const m = /** @type {RegExpExecArray} */ (/^rr3x?-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
const DISTRICT = 'The merchant district of';
const TWIN = /^The best-kept street of (\S+) looks prosperous\. The rest of the settlement, visible further in, looks like it has been waiting for that street's prosperity to reach it for some years\. /;
/** The base's scenes after the hook (560d1687c → 21032205a: the lane before this cure), beat for beat. */
const REST = {
  // BAR2-PLACES (PL1, 2026-11-15; re-keyed by identity): the slavic oven line's reword, same slot
  'rr3-village-indebted-port-0': 'Half of Vysokoka seems to be gutting, salting or selling fish. Smoke rises from a household oven, and a neighbour stops in to share its warmth.',
  'rr3x-village-indebted-mountain_pass-2': 'Bolts of cloth hang drying in long bright strips across every yard. The neighbours turn out together to sweep and mend their own street.',
  // TAIL-HISTORY-3 (the chair's Y14; re-keyed by identity): r2r-village-47 is isolated, so its herb sacks no longer fill carts (the line's reword, same slot)
  'r2r-village-47': 'Sacks of herbs and spices stand open in the doorways, and the smell of them clings to your clothes. People draw water in an order nobody needs to explain.',
};

describe('the indebted merchant district needs a market; its slot takes a twin (s2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('D1: the collected towns print the twin, no district, and the rest of the scene unmoved', () => {
    const failures = collectSeedFailures(['rr3-village-indebted-port-0', 'rr3x-village-indebted-river-2', 'rr3x-village-indebted-road-2', 'rr3x-village-indebted-mountain_pass-2', 'r2r-village-47'], (seed) => {
      const scene = String(born(seed).arrivalScene);
      expect(scene.includes(DISTRICT), seed).toBe(false);
      expect(TWIN.test(scene), `${seed}: ${scene.slice(0, 80)}`).toBe(true);
      if (REST[seed]) expect(scene.replace(TWIN, ''), seed).toBe(REST[seed]);
    });
    expectNoSeedFailures(failures, 'the collected towns print the twin, no district, and the rest unmoved');
  }, 120000);

  it('D2 (keep): a town with a market still prints the district', () => {
    const failures = collectSeedFailures(['rr3-town-indebted-rand-0', 'rr3x-village-indebted-mountain_pass-1'], (seed) => {
      expect(String(born(seed).arrivalScene).startsWith(DISTRICT), seed).toBe(true);
    });
    expectNoSeedFailures(failures, 'a town with a market still prints the district');
  }, 120000);
});
