/**
 * tests/generators/timberManagedFelling.test.js — UPKEEP-16, the chair's ruling (b) (#234): "Timber Trade … managed felling
 * keeps production consistent" printed where no woodcutter, lumber house, sawmill or managed forest stands: a shipbuilding
 * stand nobody works was read as managed felling (17 of the capacity reader's 972 after the income rows' cure, D). The
 * felling is managed only on a managed forest, or on a shipbuilding stand a woodcutter works; otherwise the plain twin.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { TIMBER_MANAGED_LINE, TIMBER_PLAIN_LINE } from '../../src/generators/economy/incomeLineSiblings.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed r2r-<size>-<i> or r2s-<crisis>-<size>-<i> (the capacity reader's render5.mjs shapes) */
const born = (seed) => {
  const r = /^r2r-(\w+)-\d+$/.exec(seed); const c = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const cfg = r ? { settType: r[1] } : { settType: c?.[2], selectedStresses: [c?.[1]], selectedStressesRandom: false };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, ...cfg }), null, { seed, customContent: {} }));
};
const timber = (/** @type {any} */ s) => s.economicState.incomeSources.find((/** @type {any} */ e) => e.source === 'Timber Trade');

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('(b) "managed felling" only where the felling is managed', () => {
  for (const seed of ['r2r-hamlet-27', 'r2r-town-25', 'r2r-city-38', 'r2s-wartime-city-1']) {
    it(`${seed}: a shipbuilding stand nobody works takes the plain line`, () => {
      const s = born(seed);
      const names = s.institutions.map((/** @type {any} */ i) => String(i.name).toLowerCase());
      expect(s.config.nearbyResources, `${seed}: anchored, a shipbuilding stand`).toContain('shipbuilding_timber');
      expect(s.config.nearbyResources, `${seed}: anchored, no managed forest`).not.toContain('managed_forest');
      expect(names.filter((n) => /woodcutter|lumber|sawmill/.test(n)), `${seed}: anchored, no wood house`).toEqual([]);
      expect(timber(s)?.desc, seed).toBe(TIMBER_PLAIN_LINE);
    });
  }
  it('the guard town: a managed forest keeps its managed felling (r2r-hamlet-12)', () => {
    const s = born('r2r-hamlet-12');
    expect(s.config.nearbyResources).toContain('managed_forest');
    expect(timber(s)?.desc).toBe(TIMBER_MANAGED_LINE);
  });
});
