/**
 * R2-CODE-B item 6 — THE CRISIS SUMMARY SAYS NOTHING THE TOWN LACKS (the cold list REVIEW-W2A-3,
 * f385d487b: MEDIUM #670 "Lundsund is in a kingdom at war and doing well out of it" where prosperity
 * is Poor; #857 "Cobapan has lost its harvest for a second season" where the food record holds
 * `foodSources` ["fish"]). Both lines declare what they presume through drawDeclared; a refused pick
 * resolves draw-free (the famine to its twin, the wartime profit to the loss text).
 */
import { describe, expect, test } from 'vitest';
import { renderStressSummary } from '../../src/generators/stressNarrative.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const rec = (prosperity, foodSources, extra = {}) => ({ tier: 'city', economicState: { prosperity, foodSecurity: { foodRecord: { foodSources, band: 'famine' } } }, ...extra });
// R2-CODE-B-5: the profit text names merchants, so a town that may do well out of the war keeps a market on its roster.
const MARKET = { institutions: [{ name: 'Weekly market' }] };

describe('the famine and wartime summaries read the record', () => {
  test('a poor town at war is not doing well out of it; a prosperous one may be', () => {
    expect(renderStressSummary('wartime', 'Lundsund', { profit: true }, undefined, factsOf(rec('Poor', ['grain'])))).toMatch(/^Lundsund is in a kingdom fighting a war it may not win\./);
    expect(renderStressSummary('wartime', 'Lundsund', { profit: true }, undefined, factsOf(rec('Prosperous', ['grain'], MARKET)))).toMatch(/doing well out of it/); // RE-KEYED BY IDENTITY (R2-CODE-B-5): the prosperous town keeps a market, the profit text's new need
  });
  test('R2-CODE-B-5: no merchants getting rich where no market or merchant house stands, and no army contracts in an isolated place', () => {
    const loss = /^Muulcoba is in a kingdom fighting a war it may not win\./;
    expect(renderStressSummary('wartime', 'Muulcoba', { profit: true }, undefined, factsOf(rec('Comfortable', ['grain'])))).toMatch(loss);
    expect(renderStressSummary('wartime', 'Muulcoba', { profit: true }, undefined, factsOf(rec('Comfortable', ['grain'], { ...MARKET, tradeRouteAccess: 'isolated' })))).toMatch(loss);
    // the guard town: a comfortable market town on a road keeps the coin's profit text
    expect(renderStressSummary('wartime', 'Muulcoba', { profit: true }, undefined, factsOf(rec('Comfortable', ['grain'], { ...MARKET, tradeRouteAccess: 'road' })))).toMatch(/^Muulcoba is in a kingdom at war and doing well out of it/);
  });
  test('a town that grows no grain has not lost a harvest; a grain town has', () => {
    expect(renderStressSummary('famine', 'Cobapan', null, undefined, factsOf(rec('Poor', ['fish'])))).toMatch(/^Cobapan has gone short of food for a second season\./);
    expect(renderStressSummary('famine', 'Cobapan', null, undefined, factsOf(rec('Poor', ['grain'])))).toMatch(/^Cobapan has lost its harvest for a second season\./);
  });
  test('generated famines and wars: no summary claims a harvest with no grain, or profit when poor', () => {
    const wrong = [];
    let famines = 0;
    for (let i = 0; i < 24; i++) {
      const kind = i % 2 ? 'famine' : 'wartime';
      const s = generateSettlementPipeline({ settType: ['hamlet', 'town', 'city'][i % 3], stressTypes: [kind] }, null, { seed: `r2b-sum-${i}`, customContent: {} });
      const entries = (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean);
      for (const e of entries) {
        const f = factsOf(s);
        if (e.type === 'famine') famines += 1;
        if (e.type === 'famine' && /lost its harvest/.test(e.summary) && !(f.foodSources || []).includes('grain')) wrong.push(`r2b-sum-${i}: ${e.summary.slice(0, 60)}`);
        if (e.type === 'wartime' && /doing well out of it/.test(e.summary) && /poor|struggling|subsistence/i.test(String(s.economicState?.prosperity))) wrong.push(`r2b-sum-${i}: ${e.summary.slice(0, 60)}`);
      }
    }
    expect(famines).toBeGreaterThan(5);
    expect(wrong).toEqual([]);
  });
});
