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
