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

const rec = (prosperity, foodSources) => ({ tier: 'city', economicState: { prosperity, foodSecurity: { foodRecord: { foodSources, band: 'famine' } } } });

describe('the famine and wartime summaries read the record', () => {
  test('a poor town at war is not doing well out of it; a prosperous one may be', () => {
    expect(renderStressSummary('wartime', 'Lundsund', { profit: true }, undefined, factsOf(rec('Poor', ['grain'])))).toMatch(/^Lundsund is in a kingdom fighting a war it may not win\./);
    expect(renderStressSummary('wartime', 'Lundsund', { profit: true }, undefined, factsOf(rec('Prosperous', ['grain'])))).toMatch(/doing well out of it/);
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
