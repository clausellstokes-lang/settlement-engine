/**
 * CENSUS-2g unit 7 — the chair's message of 09:29 (R-A): (1) R-AY, a declaration on a self-gated
 * line is aligned to what its closure reads — `scopePhrase` reads the record's water
 * (`waterAccessKind(...) !== 'none'`), so the Greek harbour declares `navigable` (not `coast`) and
 * the Slavic line drops `river` (the closure does not verify a river); (2) row 95's dropped scope
 * slots take one twin each that presumes nothing (recorded as the chair's ruling with its share).
 */
import { describe, expect, it } from 'vitest';
import { cultureScopeLine, QUICK_GUIDE_SIBLINGS } from '../../../src/domain/summary/settlementQuickGuide.js';

const set = (re) => Object.entries(QUICK_GUIDE_SIBLINGS).find(([k]) => re.test(k))?.[1] ?? [];
const place = (key, institutions) => ({
  name: 'Ixtal', tier: 'town', population: 900, culturalIdentity: { key, label: key }, institutions,
});

describe('R-AY — the waterside scopes declare only what scopePhrase verifies', () => {
  it('greek and norse declare navigable; slavic declares nothing', () => {
    expect(set(/agora and the harbour/).map((l) => l.needs)).toEqual([['navigable']]);
    expect(set(/hall and the water/).map((l) => l.needs)).toEqual([['navigable']]);
    expect(set(/between river and forest/)).toEqual([]); // declares nothing, so it keeps no set
  });
});

describe('row 95 — the dropped scope slots take a twin that presumes nothing', () => {
  it('each declared scope carries one twin with no declaration', () => {
    for (const re of [/market-and-waterworks/, /tank and the bazaar/]) {
      const twins = set(re).filter((l) => typeof l.twinOf === 'string');
      expect(twins).toHaveLength(1);
      expect(twins[0].needs ?? []).toEqual([]);
      expect(twins[0].twinOf).toBe(set(re)[0].text);
    }
  });
  it('a mesoamerican place with no market prints the twin; with a market, the original', () => {
    expect(cultureScopeLine(place('mesoamerican', []))).toMatch(/on tribute and the ritual calendar/);
    expect(cultureScopeLine(place('mesoamerican', [{ name: 'Market square', category: 'Economy' }]))).toMatch(/market-and-waterworks/);
  });
  it('a south-asian place with no market or temple prints the twin', () => {
    expect(cultureScopeLine(place('south_asian', []))).toMatch(/built around the tank, in quarters by trade and kin/);
  });
});
