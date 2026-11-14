/**
 * SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1(b); the SURFACES audit's P73 and §2·D contradiction #11):
 * Lundey (soak1k-1, a slave revolt) printed "· Crisis Cutting the Food Supply" in the same chapter as
 * "Viable: it feeds itself…", with a surplus of 17: the stress label read no surplus. The cure: the
 * label and its note read the surplus beside the cut.
 */
import { describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('SW-B1 · P73: a crisis label on the food supply agrees with the surplus beside it', () => {
  it('soak1k-1 (Lundey): a surplus, so the crisis thins the harvest and does not cut the supply', async () => {
    await ensureLaws();
    const v = birth(1).settlement.economicViability;
    const fb = v.metrics.foodBalance;
    const cut = (v.issues || []).filter((/** @type {any} */ i) => i?.type === 'stress_consequence' && i?.category === 'Food Supply');
    expect(cut.length, 'the stress note is on the record').toBeGreaterThan(0);
    expect(fb.deficit || 0, 'soak1k-1 (Lundey): foodBalance.deficit is 0').toBe(0);
    for (const i of cut) expect(i.title).not.toBe('Crisis Cutting the Food Supply');
  }, 60_000);
});
