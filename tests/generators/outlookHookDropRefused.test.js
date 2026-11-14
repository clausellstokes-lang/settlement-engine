/**
 * CENSUS-1h — THE CHAIR'S R-AU at the outlook-hook site (`foodBalance.js`, OUTLOOK_HOOK_SIBLINGS):
 * a refused hook with no admitted twin DROPS at the site (kind A), never keeps-and-notes a line that
 * `withoutFalseHooks` removes later. The kept line was counted: the viability summary said "1 plot
 * hooks available" over a list that ended empty (soak1k-9, -21, -33, -45, -51, -52 of the 60).
 */
import { describe, expect, it } from 'vitest';

describe('R-AU: the outlook site drops a refused hook', () => {
  it('the viability summary counts exactly the hooks the record holds', async () => {
    const corpus = await import('../../scripts/audit/soak-review/corpus.mjs');
    await corpus.ensureLaws();
    for (const i of [9, 21]) {
      const v = corpus.birth(i).settlement.economicViability || {};
      const stated = Number((String(v.summary || '').match(/(\d+) plot hooks? available/) || [])[1]);
      expect(stated, `soak1k-${i}`).toBe((v.plotHooks || []).length);
    }
  }, 60000);
});

// R3-CODE-C-2 (CENSUS-2 kind a, outlookHookSiblings.js :: STARVING_HOOK and MODERATE_GAP_TWIN): "a merchant has
// offered" food where no merchant can come. Three of the census's 720 births (REVIEW-R2-STAGES births.mjs: every
// dial random): r2r-thorp-17 (isolated, in famine), r2r-town-9 (isolated, a moderate gap), and THE GUARD the other
// way, r2r-village-24 (a road town in famine that imports a quarter of its food: its merchant stays).
describe('a merchant offers food only where one can come', () => {
  it('isolated: the famine reads without a merchant, the moderate gap has no merchant hook; by road the merchant stays', async () => {
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    await loadGenerationLawPayloads();
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const hooksOf = (seed, settType) => (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType }), null, { seed, customContent: {} })
      .economicViability?.plotHooks || []).map((h) => (typeof h === 'string' ? h : h.hook));
    const merchant = (hooks) => hooks.filter((h) => /a merchant has offered/.test(h));
    const thorp = hooksOf('r2r-thorp-17', 'thorp');
    expect(thorp).toContain('The settlement is starving, and its hungriest are turning to banditry.');
    expect(merchant(thorp)).toEqual([]);
    expect(merchant(hooksOf('r2r-town-9', 'town'))).toEqual([]);
    expect(merchant(hooksOf('r2r-village-24', 'village'))).toEqual(['The settlement is starving. Its hungriest are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.']);
  }, 60000);
});
