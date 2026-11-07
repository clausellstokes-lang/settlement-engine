/**
 * CENSUS-1h unit 6 — Appendix B row 95: the quick guide's declared clauses (QUICK_GUIDE_SIBLINGS,
 * CENSUS-2d/2e) are resolved against the record they describe, and a refused clause with no
 * admitted twin DROPS (R-AU, kind A) rather than printing a false scope.
 *
 * And `resolveSibling`'s `dropRefused`: refused with no twin → null; admitted → the line;
 * unanswered (no facts) → the original kept (no birth moves on a record-less call).
 */
import { describe, expect, it } from 'vitest';
import { cultureScopeLine } from '../../../src/domain/summary/settlementQuickGuide.js';
import { resolveSibling } from '../../../src/domain/facts/drawDeclared.js';

const meso = (institutions) => ({
  name: 'Ixtal', tier: 'town', population: 900,
  culturalIdentity: { key: 'mesoamerican', label: 'Mesoamerican' },
  institutions,
});

describe('row 95: the scope clause is read against the record', () => {
  it('a mesoamerican place WITH a market prints its market-and-waterworks scope', () => {
    expect(cultureScopeLine(meso([{ name: 'Market square', category: 'Economy' }]))).toMatch(/market-and-waterworks/);
  });
  // CENSUS-2g unit 7 (the chair's ruling of 09:29): the slot takes a twin that presumes nothing —
  // re-keyed by cause; the false market is still never printed.
  it('a mesoamerican place with NO market prints the twin, never the market', () => {
    expect(cultureScopeLine(meso([]))).toMatch(/on tribute and the ritual calendar/);
    expect(cultureScopeLine(meso([]))).not.toMatch(/market/); // anchored: the same call is proven to print its twin on the line above
  });
  it('an undeclared scope prints as before', () => {
    expect(cultureScopeLine({ ...meso([]), culturalIdentity: { key: 'germanic', label: 'Germanic' } }))
      .toMatch(/guild and estate/);
  });
});

describe('resolveSibling: dropRefused (R-AU)', () => {
  const SETS = Object.freeze({ 'a market line': Object.freeze([{ text: 'a market line', needs: ['market'] }]) });
  it('refused with no admitted twin answers null; admitted answers the line; unanswered keeps', () => {
    expect(resolveSibling('a market line', SETS, { facts: { market: false }, dropRefused: true })).toBeNull();
    expect(resolveSibling('a market line', SETS, { facts: { market: true }, dropRefused: true })).toBe('a market line');
    expect(resolveSibling('a market line', SETS, { facts: null, dropRefused: true })).toBe('a market line');
    expect(resolveSibling('a market line', SETS, { facts: { market: false } })).toBe('a market line');
  });
});
