/**
 * RUNG-2 LANDING, phase B unit 2 — THE TWO INLAND SCOPE PHRASES (the chair's ruling of
 * 2026-11-05 10:0x, confirmed 2026-11-06). The Norse and Slavic culture scopes are waterside
 * (`scopePhrase` gates them on the record's water), and inland they printed NOTHING — mute in 38 of
 * 98 Norse and 30 of 82 Slavic births on the 1,000 — because `INLAND_SCOPE_PHRASE` held only the
 * Greek form. Each takes ONE inland phrase that presumes no water: declared `excludes: navigable`
 * (the water home's `navigable` is exactly `waterAccessKind(...) !== 'none'`, the branch's own read,
 * R-AY), resolved through the census's sibling channel, so the draw admits it where the sea line is
 * withheld and refuses it on water.
 *
 * Fixtures hand-trimmed from the births: soak1k-1 (a Norse hamlet, plains, road, no seat building)
 * and soak1k-52 (a Slavic city, mountain, road, a City hall); soak1k-41 (a Norse metropolis,
 * forest, crossroads, a Palace) for the seat.
 */
import { describe, expect, it } from 'vitest';
import { composeSettlementQuickGuide, cultureScopeLine, QUICK_GUIDE_SIBLINGS } from '../../../src/domain/summary/settlementQuickGuide.js';

const NORSE = { key: 'norse', label: 'Norse-inspired' };
const SLAVIC = { key: 'slavic', label: 'Slavic-inspired' };
const SEA_WORDS = /water|river|sea|harbou?r|shore|coast|boat|fish/i;

const soak1k1 = { name: 'Holm', tier: 'hamlet', population: 40, culturalIdentity: NORSE, config: { terrainType: 'plains', tradeRouteAccess: 'road' }, institutions: [] };
const soak1k52 = { name: 'Gradek', tier: 'city', population: 9000, culturalIdentity: SLAVIC, config: { terrainType: 'mountain', tradeRouteAccess: 'road' }, institutions: [{ name: 'City hall' }] };
const soak1k41 = { name: 'Storby', tier: 'metropolis', population: 30000, culturalIdentity: NORSE, config: { terrainType: 'forest', tradeRouteAccess: 'crossroads' }, institutions: [{ name: 'City hall' }, { name: 'Palace/government complex' }] };

describe('an inland Norse or Slavic birth prints a scope phrase (was mute)', () => {
  it('soak1k-1, a Norse hamlet inland: the inland phrase, no water', () => {
    const line = cultureScopeLine(soak1k1);
    expect(line).toBe('Norse-inspired, built around the hall, on kin, oath and the assembly.');
    expect(line).not.toMatch(SEA_WORDS); // anchored: the exact line is pinned on the line above
  });
  it('soak1k-52, a Slavic city inland: the inland phrase, no river', () => {
    const line = cultureScopeLine(soak1k52);
    expect(line).toBe('Slavic-inspired, built in timber compounds on land held in common, kin by kin.');
    expect(line).not.toMatch(SEA_WORDS); // anchored: the exact line is pinned on the line above
  });
  it('the identity sentence carries it too, and the seat takes its real name', () => {
    expect(composeSettlementQuickGuide(soak1k1).identitySentence)
      .toBe('Holm is a Norse-inspired hamlet of 40 people, built around the hall, on kin, oath and the assembly.');
    expect(cultureScopeLine(soak1k41)).toBe('Norse-inspired, built around the Palace/government complex, on kin, oath and the assembly.');
  });
});

describe('the waterside forms are untouched', () => {
  it('on water the sea lines print as before', () => {
    expect(cultureScopeLine({ ...soak1k1, config: { terrainType: 'coastal', tradeRouteAccess: 'road' } }))
      // STYLE-2 A·O2: the season has no record field, so the water line keeps its kin and oath
      .toBe('Norse-inspired, built around the hall and the water, on kin, oath and the assembly.');
    // STYLE-2 A·O2: a riverside city with no forest is "by the river"; the forest prints only on forest ground
    expect(cultureScopeLine({ ...soak1k52, institutions: [], config: { terrainType: 'riverside', tradeRouteAccess: 'road' } }))
      .toBe('Slavic-inspired, built in timber compounds on common land, by the river.');
    expect(cultureScopeLine({ ...soak1k52, institutions: [], config: { terrainType: 'forest', tradeRouteAccess: 'river' } }))
      .toBe('Slavic-inspired, built in timber compounds on common land, between river and forest.');
  });
  it('a record with no config reads as it always did', () => {
    expect(cultureScopeLine({ culturalIdentity: NORSE })).toMatch(/the hall and the water/);
    expect(cultureScopeLine({ culturalIdentity: SLAVIC })).toMatch(/between river and forest/);
  });
});

describe('the declaration (the census channel)', () => {
  // RUNG-2 LANDING phase C unit 4: the Greek inland form (the first, 2026-11-04) is aligned with the
  // two phase B wrote — it declared nothing; it now declares `excludes: navigable` (0 of the 41
  // inland Greek births on the 1,000 carry water, so no page moves).
  it('each inland phrase declares `excludes: navigable` and nothing else', () => {
    for (const text of ['built around the agora, on hillside ground and civic association', 'built around the hall, on kin, oath and the assembly', 'built in timber compounds on land held in common, kin by kin']) {
      expect(QUICK_GUIDE_SIBLINGS[text]).toEqual([{ text, excludes: ['navigable'] }]);
    }
  });
});
