/**
 * tests/generators/harvestHookFamineHere.test.js — R2-CODE-A-2, the cold list REVIEW-W2A-3 MEDIUM #152: "A poor
 * harvest somewhere else has spiked the price of grain. The settlement must decide what it can still afford to
 * import…" printed under a famine whose harvest failed HERE, and (the same line's second presumption) in towns
 * where nothing comes in from outside (a siege, an isolated place with no channel). The import-dependent hook
 * (`foodBalance.js :: deriveFoodBalanceAnalysis`) now reads the famine and the import channel the balance itself
 * reads: no channel carrying food in, the food already here told; a famine, the failure here told (its source from
 * the food record, as the famine's own note names it); else, as before. A T branch: no draw.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const ELSEWHERE = /A poor harvest somewhere else/;
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** a seed of the census's corpus (its own dials) or of the reviewer's twenty (the app's shape) @param {string} seed */
function born(seed) {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const c = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const w = seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : c ? { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [c[1]], selectedStressesRandom: false, settType: c[2] }
      : { ...DEFAULT_CONFIG, settType: w?.[1], selectedStressesRandom: false, selectedStresses: !w || w[2] === 'calm' ? [] : w[2].split('+'), _randomizePriorities: true };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
}
/** @param {any} s */
const hooks = (s) => (s.economicViability?.plotHooks || []).map((/** @type {any} */ h) => String(h.hook));
/** @param {any} s */
const stresses = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((/** @type {any} */ x) => x.type);

describe('the import-dependent hook reads the famine and the channel, born as the corpus births them', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('a famine with food still coming in tells the failure here, and the import (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([['rw3-city-famine-1'], ['r2s-famine-town-0'], ['r2r-hamlet-16']], ([seed]) => {
      const s = born(seed);
      expect(stresses(s), `${seed}: a famine`).toContain('famine');
      expect(s.economicState.foodSecurity.importCoverage || 0, `${seed}: food still coming in`).toBeGreaterThan(0);
      const h = hooks(s);
      expect(h.join('\n'), `${seed}: no elsewhere line`).not.toMatch(ELSEWHERE);
      expect(h.some((t) => /failed here this year/.test(t) && /afford to import/.test(t)), `${seed}: tells the failure here, and the import`).toBe(true);
    }), 'a famine with food still coming in tells the failure here, and the import');
  });
  it('nothing coming in, so the food already here is told, and no import (every row)', () => {
    expectNoSeedFailures(collectSeedFailures([['r2s-under_siege-hamlet-2'], ['r2r-thorp-54'], ['r2s-wartime-thorp-3']], ([seed]) => {
      const s = born(seed);
      expect(s.economicState.foodSecurity.importCoverage || 0, `${seed}: nothing coming in`).toBe(0);
      const h = hooks(s);
      expect(h.join('\n'), `${seed}: no elsewhere line`).not.toMatch(ELSEWHERE);
      expect(h.join('\n'), `${seed}: no import`).not.toMatch(/afford to import/);
      expect(h.some((t) => /^No food can be bought in from outside now/.test(t)), `${seed}: the food already here is told`).toBe(true);
    }), 'nothing coming in, so the food already here is told, and no import');
  });
  it('r2r-village-50: an import-dependent town with food coming in and no famine keeps the line', () => {
    const s = born('r2r-village-50');
    expect(stresses(s)).not.toContain('famine');
    expect(hooks(s).join('\n')).toMatch(ELSEWHERE);
  });
});
