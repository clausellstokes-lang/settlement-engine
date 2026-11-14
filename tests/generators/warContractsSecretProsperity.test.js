/**
 * tests/generators/warContractsSecretProsperity.test.js — R2-CODE-A-2, the cold list REVIEW-W2A-3 MEDIUM #723:
 * "Secret: Took a private share of the war contracts that made the settlement rich…" on a person in a city whose
 * record reads Poor ("The place earns less than it spends."). The wartime secret presumes the war made the place
 * rich: it declares the prosperity band it needs (`prosperity: ≥ comfortable`, the vocabulary's band, read from the
 * record's own prosperity), and the secret draw (`npcGenerator.js :: generateCrimeLevel`, through `drawDeclared`)
 * resolves a refused pick draw-free to an admitted row.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const RICH = /war contracts that made the settlement rich/;
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
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
const holders = (s) => (s.npcs || []).filter((/** @type {any} */ n) => RICH.test(n.secret?.what || ''));

describe('the war-contracts secret needs a town the war made rich', () => {
  it('declares the prosperity band it presumes', () => {
    const row = /** @type {any} */ (STRESS_INSTITUTION_EFFECTS.wartime.find((e) => RICH.test(e.secret)));
    expect(row?.needs).toContain('prosperity: ≥ comfortable');
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each([['rw3-city-wartime-1'], ['r2s-wartime-town-0'], ['r2s-wartime-village-1'], ['r2s-wartime-city-1']])('%s: a town below comfortable carries no such secret', (seed) => {
    const s = born(seed);
    expect(['Comfortable', 'Prosperous', 'Wealthy']).not.toContain(s.economicState.prosperity);
    expect(holders(s)).toEqual([]);
  });
  it('r2s-wartime-city-0: a comfortable town keeps it', () => {
    const s = born('r2s-wartime-city-0');
    expect(s.economicState.prosperity).toBe('Comfortable');
    expect(holders(s).length).toBe(1);
  });
});
