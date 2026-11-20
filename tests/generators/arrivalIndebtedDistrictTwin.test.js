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
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { STRESS_DESCS } from '../../src/data/narrativeData.js';

/**
 * THE HOOK'S DRAWS, READ OFF THE BIRTH (L2's D1 re-key at full strength, 2026-11-20). The claim "a twin keeps the slot and
 * spends no redraw" (`arrivalScene.js :: drawAdmitted`): where the hook's draw lands on the district (refused, its twin
 * admitted), the slot resolves to the twin and NO further draw is made from the hook's pool; a redraw would be another
 * `pickRandom` over the pool's clean lines after it, and every later beat would draw one step on. (A first draw that lands on
 * a refused line with no twin, e.g. the bank's "finest building", redraws by the redraw-once rule whether or not the district
 * is admitted, so the count of the hook's draws is not the claim; what follows the district's pick is.) Every `pickRandom`
 * the birth makes passes through unchanged (the same function, the same stream, the same result); the log only records the
 * array and the pick, so nothing the birth draws moves.
 */
const drawLog = vi.hoisted(() => ({ calls: /** @type {null | Array<{ arr: unknown[], pick: unknown }>} */ (null) }));
vi.mock('../../src/generators/helpers.js', async (importOriginal) => {
  const mod = /** @type {any} */ (await importOriginal());
  return { ...mod, pickRandom: (/** @type {unknown[]} */ arr) => { const pick = mod.pickRandom(arr); drawLog.calls?.push({ arr, pick }); return pick; } };
});
/** The district row of the indebted hook's pool (the line the twin answers). */
const districtRow = () => /** @type {any[]} */ (/** @type {any} */ (STRESS_DESCS).indebted).find((l) => String((typeof l === 'function' ? l : l.text)('S')).startsWith(DISTRICT));
/**
 * The birth's draws from the indebted hook's pool (an array made only of that pool's rows: the whole, the vignettes, a clean
 * set), in order, and how many of them follow the draw that picked the district.
 * @param {string} seed
 */
const hookDrawsOf = (seed) => {
  drawLog.calls = [];
  try {
    const town = born(seed);
    const pool = new Set(/** @type {any} */ (STRESS_DESCS).indebted);
    const draws = /** @type {Array<{ arr: unknown[], pick: unknown }>} */ (drawLog.calls).filter(({ arr }) => Array.isArray(arr) && arr.length > 0 && arr.every((l) => pool.has(l)));
    const at = draws.findIndex(({ pick }) => pick === districtRow());
    return { town, pickedDistrict: at >= 0, after: at >= 0 ? draws.length - at - 1 : -1 };
  } finally { drawLog.calls = null; }
};

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
  // RE-KEYED BY ITS TEXT 2026-11-20 (L2, the chair's word of 15:35): the arrival pools APPENDED moved the later beats' draws (the
  // sense and the people line); the claim (the twin keeps the slot and spends no redraw) is unchanged, its beats read at the cure
  'rr3-village-indebted-port-0': 'Barrels of salt fish stand stacked by the water, and the gulls have opinions about every one. People gather at the well, and the news of the whole place passes through it.',
  // re-keyed by its text (BAR3-PLACES, 2026-11-15: the cloth line claims the yards, not every yard)
  // RE-KEYED BY ITS TEXT 2026-11-20 (L2): the people line's draw moved to an appended line; the cloth line stands
  'rr3x-village-indebted-mountain_pass-2': 'Bolts of cloth hang drying in long bright strips across the yards. The scrape of a grinding stone comes from a doorway, where someone is making the day\'s maize dough.',
  // TAIL-HISTORY-3 (the chair's Y14; re-keyed by identity): r2r-village-47 is isolated, so its herb sacks no longer fill carts (the line's reword, same slot)
  // RE-KEYED BY IDENTITY (DEBT-1, 2026-11-17): BAR6-SCENES (LAW 6 rule 6b) made the herb sacks declare `trade at work: spice`;
  // r2r-village-47 holds none (no spice made, sold or brought in), so the same slot takes the line's declared twin (its Apothecary)
  'r2r-village-47': 'A doorway here and there sells remedies, and the bitter smell of them reaches the lane. People draw water in an order nobody needs to explain.',
};

describe('the indebted merchant district needs a market; its slot takes a twin (s2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('D1: the collected towns print the twin, no district, and the rest of the scene unmoved', () => {
    const failures = collectSeedFailures(['rr3-village-indebted-port-0', 'rr3x-village-indebted-river-2', 'rr3x-village-indebted-road-2', 'rr3x-village-indebted-mountain_pass-2', 'r2r-village-47'], (seed) => {
      const { town, pickedDistrict, after } = hookDrawsOf(seed);
      const scene = String(town.arrivalScene);
      expect(scene.includes(DISTRICT), seed).toBe(false);
      expect(TWIN.test(scene), `${seed}: ${scene.slice(0, 80)}`).toBe(true);
      // RE-KEYED AT FULL STRENGTH 2026-11-20 (L2): "the rest unmoved" was proved by REST, the base's later beats recorded before
      // the cure; L2's appended pools moved those beats' own draws, so a re-recorded REST alone would prove nothing. The claim is
      // now read off the birth itself: the hook's draw picked the district, and NO draw from the hook's pool follows it, so every
      // later beat drew from the stream exactly where it would have had the district been admitted. REST stays as the text.
      expect(pickedDistrict, `${seed}: the hook's draw picked the district (its twin prints on that slot)`).toBe(true);
      expect(after, `${seed}: no draw from the hook's pool follows the district's pick (the twin spends no redraw)`).toBe(0);
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
