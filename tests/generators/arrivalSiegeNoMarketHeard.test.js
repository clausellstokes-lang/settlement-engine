/**
 * tests/generators/arrivalSiegeNoMarketHeard.test.js — R2-CODE-A-12, the reader's L46 (REVIEW-R2-CODE-A, MEDIUM (c),
 * the stage's own): `narrativeData.js :: STRESS_DESCS.under_siege[2]` printed "From outside, Rathwell still seems
 * itself: smoke from cookfires, the noise of a market. It is the gate that gives it away…" in 18 of the reader's
 * 3,048 births, every one a siege in force whose record says "Field work and trade have stopped".
 * THE RULING (the chair, 2026-11-14, (1)): UNDER A SIEGE NO LINE HEARS A MARKET TRADING: the market clause goes. The
 * row keeps its slot and its declaration (`gate`, `market`, `guardPresence`); the clause is now "a murmur from the
 * square", a word of the same market family, so the vignette filter (`arrivalScene.js :: unheldClaims`) admits the row
 * in exactly the towns it admitted before and no draw moves (measured: 18 towns change, each by that clause alone).
 * The pool prints only under a siege, so every line of it is read under one.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { STRESS_DESCS } from '../../src/data/narrativeData.js';
import { textOf } from '../../src/domain/facts/textOf.js';

/** A market heard trading: its noise, its bustle, its cries, its trade. */
const MARKET_TRADING = /\b(?:noise|bustle|din|cries|clamou?r) of (?:a |the )?market\b|\bmarket (?:is |was )?(?:busy|trading|open)\b|\btrading\b|\bhaggl/i;

/** The reader's births: the app's shape (rr3, rr3x) and the census's (r2s), as the reader's `births.mjs :: cfgFor`. */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
const born = (seed) => {
  let m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} }));
  m = /** @type {RegExpMatchArray} */ (seed.match(/^rr3x?-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} }));
};
/** @param {any} s */
const stressTypes = (s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).map((/** @type {any} */ x) => x?.type);

describe('under a siege in force the arrival hears no market trading', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('no line of the siege pool hears a market trading', () => {
    const lines = STRESS_DESCS.under_siege.map((l) => textOf(l)('Q'));
    expect(lines.some((t) => /\bsmoke from cookfires, a murmur from the square\b/.test(t)), 'the reworded row is in the pool').toBe(true);
    expect(lines.filter((t) => MARKET_TRADING.test(t)), 'the siege pool').toEqual([]);
  });

  // The reader's town, the smallest (a town of 667, with a famine) and the largest (a metropolis of 39,844, with a
  // famine) of the 18 that drew the row, and a city.
  it("the towns that drew the row open on the cookfires and the shut gate, and hear no market", () => {
    expectNoSeedFailures(collectSeedFailures([
      'r2s-under_siege-town-3', 'rr3-town-under_siege+famine-rand-1', 'rr3x-metropolis-under_siege+famine-isolated-0', 'r2s-under_siege-city-3',
    ], (seed) => {
      const s = born(seed);
      expect(stressTypes(s), `${seed}: a siege in force`).toContain('under_siege');
      const scene = String(s.arrivalScene);
      expect(scene, `${seed}: the row, reworded`).toContain(`From outside, ${s.name} still seems itself: smoke from cookfires, a murmur from the square. It is the gate that gives it away: shut fast`);
      expect(scene, `${seed}: no market heard`).not.toMatch(MARKET_TRADING); // anchored: the line above asserts this scene is the reworded row; red at the base text (4 of 4)
    }), 'the towns that drew the row hear no market');
  });

  it('the guard towns keep their own lines: a siege town with no market square keeps the row it drew', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['r2s-under_siege-village-3', /^\S+ has drawn in on itself\./],
      ['rr3-hamlet-under_siege+famine-port-1', /^The approach to \S+ is quieter than it should be/],
    ], ([seed, kept]) => {
      expect(String(born(/** @type {string} */ (seed)).arrivalScene), `${seed}: its own line`).toMatch(/** @type {RegExp} */ (kept));
    }), 'the guard towns keep their own lines');
  });
});
