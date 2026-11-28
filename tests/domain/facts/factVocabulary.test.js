/**
 * tests/domain/facts/factVocabulary.test.js — CENSUS-1b wave 1, item 1: THE CLOSED ATOM
 * VOCABULARY (`src/domain/facts/factVocabulary.js`; `docs/DESIGN_POOL_CENSUS.md` §1, §3.2).
 *
 * Holds (1) the spelled ladders equal to their data homes (the module is import-free so the
 * kernel can re-export its mark half); (2) every homed dimension names a `factsOf` getter, and an
 * unhomed one cannot be declared; (3) the three polarities, written once; (4) the kernel's
 * `STATE_MARK_DIMENSIONS` IS the vocabulary's mark half.
 *
 * @enforced-by npx vitest run tests/domain/facts/factVocabulary.test.js
 */
import { describe, expect, it } from 'vitest';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { STATE_MARK_DIMENSIONS as KERNEL_MARKS } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { STRESS_TYPE_MAP } from '../../../src/data/stressTypes.js';
import { TIER_ORDER } from '../../../src/data/constants.js';
import { FOOD_SECURITY_BANDS } from '../../../src/data/bandLadders.js';
import { POPULATION_BANDS } from '../../../src/domain/facts/populationBand.js';
import { RULER_KINDS } from '../../../src/domain/facts/rulerKind.js';
import { WAR_STATES } from '../../../src/domain/facts/warState.js';
import { INSTITUTION_KINDS } from '../../../src/domain/facts/institutions.js';
import { CRISIS_FAMILIES } from '../../../src/domain/facts/crisisKind.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

describe('the spelled ladders equal their homes', () => {
  it('crisis kinds, tiers, bands, ruler kinds, war states, institution kinds, crisis groups', () => {
    expect(V.CRISIS_KIND_WORDS).toEqual(Object.keys(STRESS_TYPE_MAP));
    expect(V.TIER_WORDS).toEqual(TIER_ORDER);
    expect([...V.FOOD_BAND_WORDS].sort()).toEqual(Object.keys(FOOD_SECURITY_BANDS).sort());
    expect(V.POPULATION_WORDS).toEqual(POPULATION_BANDS);
    expect(V.RULER_WORDS).toEqual(RULER_KINDS);
    expect(V.WAR_WORDS).toEqual(WAR_STATES);
    expect(V.INSTITUTION_WORDS).toEqual(INSTITUTION_KINDS);
    // F12's families as groups (ruling 2): its five, the fifth ('crisis', any active) spelled `any`'s side
    expect([...V.CRISIS_GROUP_WORDS, 'crisis']).toEqual(Object.keys(CRISIS_FAMILIES));
    for (const g of V.CRISIS_GROUP_WORDS) expect(V.CRISIS_FAMILY_KINDS[g], g).toEqual(CRISIS_FAMILIES[g].types);
  });

  it("the kernel's mark dimensions ARE the vocabulary's mark half (a re-export, not a copy)", () => {
    expect(KERNEL_MARKS).toBe(V.STATE_MARK_DIMENSIONS);
    expect(Object.values(V.STATE_MARK_DIMENSIONS).flat()).toHaveLength(19);
  });
});

describe('every dimension is answered by one home, or cannot be declared', () => {
  const facts = factsOf({ tier: 'town', institutions: [], config: { terrainType: 'hills', tradeRouteAccess: 'port' } });
  it('a homed dimension names a factsOf getter', () => {
    for (const [name, dim] of Object.entries(V.FACT_DIMENSIONS)) {
      if (dim.reader === null) { expect(dim.home, name).toBe(''); continue; }
      expect(dim.home in facts, `${name} → factsOf(record).${dim.home}`).toBe(true);
    }
  });
  it('an unknown word is no atom; an unhomed atom cannot be declared', () => {
    expect(V.parseAtom('moat')).toBeNull();
    expect(V.parseAtom('institution: guild')).toBeNull();
    expect(V.parseAtom('tier: ≥ village-ish')).toBeNull();
    expect(V.parseAtom('crisis: drought')).toBeNull();
    expect(() => V.assertDeclarable('moat')).toThrow(/not an atom/);
    // the merge of CENSUS-3b (foodSources, crime, …) and CENSUS-1c (soldiers, commander, priest)
    // empties the "named but refused" list: every named atom has its one reader now.
    expect(Object.entries(V.FACT_DIMENSIONS).filter(([, d]) => d.reader === null).map(([n]) => n)).toEqual([]);
    expect(V.assertDeclarable('grain').dimension).toBe('grain');
    expect(V.assertDeclarable('soldiers').dimension).toBe('soldiers');
    expect(V.assertDeclarable('organised crime').dimension).toBe('organised crime');
    expect(V.assertDeclarable('guild').dimension).toBe('guild'); // CENSUS-4b's composite
    expect(V.assertDeclarable('walls').dimension).toBe('walls');
    expect(V.assertDeclarable('institution: mill').key).toBe('mill');
    expect(V.assertDeclarable('tier: >= town')).toMatchObject({ op: '≥', value: 'town' });
    expect(V.assertDeclarable('stores: < 3 months')).toMatchObject({ op: '<', value: 3 });
    expect(V.assertDeclarable('crisis: under_siege, threat').values).toEqual(['under_siege', 'threat']);
  });
});

describe('the three polarities, stated once', () => {
  const walled = factsOf({ tier: 'city', institutions: [{ name: 'Town walls', category: 'Defense' }], economicState: { foodSecurity: { storageMonths: 2, foodRecord: { storageMonths: 2, band: 'secure' } } } });
  const bare = factsOf({ tier: 'thorp', institutions: [] });
  it('presence: needs / excludes; silence neutral; unanswered refuses', () => {
    const needWalls = V.declarationOf({ text: 'x', needs: ['walls'] });
    const noWalls = V.declarationOf({ text: 'x', excludes: ['walls'] });
    expect(V.declarationAdmits(needWalls, walled).admitted).toBe(true);
    expect(V.declarationAdmits(needWalls, bare)).toEqual({ admitted: false, refused: ['walls'] });
    expect(V.declarationAdmits(noWalls, bare).admitted).toBe(true);
    expect(V.declarationAdmits(noWalls, walled)).toEqual({ admitted: false, refused: ['no walls'] });
    expect(V.declarationAdmits(V.declarationOf('a bare string'), bare).admitted).toBe(true);
    expect(V.declarationAdmits(needWalls, null).admitted).toBe(false); // fail-closed
  });
  it('band: one comparator per dimension', () => {
    const d = (a) => V.declarationOf({ needs: [a] });
    expect(V.declarationAdmits(d('tier: ≥ town'), walled).admitted).toBe(true);
    expect(V.declarationAdmits(d('tier: ≥ town'), bare).admitted).toBe(false);
    expect(V.declarationAdmits(d('stores: < 3'), walled).admitted).toBe(true);
    expect(V.declarationAdmits(d('stores: ≥ 3'), walled).admitted).toBe(false);
    expect(V.declarationAdmits(d('stores: ≥ 3'), bare).admitted).toBe(false); // unanswered months
  });
  it('crisis: the inverse default only in a crisis-scoped pool', () => {
    const sieged = factsOf({ tier: 'town', stress: [{ type: 'under_siege' }], institutions: [] });
    const calm = V.declarationOf({});
    const siegeLine = V.declarationOf({ crisis: ['under_siege'] });
    const threatLine = V.declarationOf({ crisis: 'threat' });
    const anyLine = V.declarationOf({ crisis: ['any'] });
    expect(V.declarationAdmits(calm, sieged).admitted).toBe(true); // silence, unscoped: neutral
    expect(V.declarationAdmits(calm, sieged, { crisisScoped: true })).toEqual({ admitted: false, refused: ['crisis: calm'] });
    expect(V.declarationAdmits(calm, bare, { crisisScoped: true }).admitted).toBe(true);
    expect(V.declarationAdmits(siegeLine, sieged).admitted).toBe(true);
    expect(V.declarationAdmits(threatLine, sieged).admitted).toBe(true); // the group expands by the home
    expect(V.declarationAdmits(siegeLine, bare).admitted).toBe(false);
    expect(V.declarationAdmits(anyLine, bare).admitted).toBe(true);
    expect(V.declarationAdmits(anyLine, sieged, { crisisScoped: true }).admitted).toBe(true);
  });
  it('the vocabulary rulings §1: needs crisis, excludes crisis[: family], the disjunction (R-H), the aliases', () => {
    const two = factsOf({ tier: 'town', stress: [{ type: 'under_siege' }, { type: 'insurgency' }], institutions: [] });
    const sieged = factsOf({ tier: 'town', stress: [{ type: 'under_siege' }], institutions: [] });
    const d = (o) => V.declarationOf(o);
    expect(V.declarationAdmits(d({ needs: ['crisis'] }), sieged).admitted).toBe(true);
    expect(V.declarationAdmits(d({ needs: ['crisis'] }), bare).admitted).toBe(false);
    expect(V.declarationAdmits(d({ excludes: ['crisis'] }), bare).admitted).toBe(true);
    expect(V.declarationAdmits(d({ excludes: ['crisis'] }), sieged).admitted).toBe(false);
    expect(V.declarationAdmits(d({ excludes: ['crisis: hunger'] }), sieged).admitted).toBe(false);
    expect(V.declarationAdmits(d({ excludes: ['crisis: succession'] }), sieged).admitted).toBe(true);
    // the disjunction (R-H, 2026-11-05; the conjunction is retired): ONE declared value active
    expect(V.declarationAdmits(d({ crisis: 'siege' }), two).admitted).toBe(true);
    expect(V.declarationAdmits(d({ crisis: 'famine' }), two).admitted).toBe(false);
    expect(V.declarationAdmits(d({ crisis: 'threat, unrest' }), two).admitted).toBe(true);
    expect(V.declarationAdmits(d({ crisis: ['siege'] }), sieged).admitted).toBe(true);
  });
  it('the rulings §3–4: guardPresence is one composite; port is the route reader; lake is dropped', () => {
    expect(V.atomHolds('guardPresence', factsOf({ institutions: [{ name: 'Citizen militia', category: 'Defense' }] }))).toBe(true);
    expect(V.atomHolds('guardPresence', bare)).toBe(false);
    expect(V.atomHolds('port', factsOf({ config: { tradeRouteAccess: 'port' } }))).toBe(true);
    expect(V.parseAtom('lake')).toBeNull();
  });
  it('the tag slot: X needs, no X excludes, non-atoms skipped; the kernel marks declare walls and the five crisis families (CENSUS-1i unit 8)', () => {
    expect(V.declarationOfTags(['visitor', 'walls', 'no market', 'crisis: threat', 'dm-only']))
      .toEqual({ needs: ['walls'], excludes: ['market'], crisis: ['threat'] });
    // re-keyed by CENSUS-1i unit 8 (R-O): `no threat` now declares its family's exclusion (wave 1: walls only)
    expect(V.declarationOfMarks(['no walls', 'no threat'])).toEqual({ needs: [], excludes: ['walls', 'crisis: threat'], crisis: [] });
    expect(V.declarationOfMarks(['succession settled', 'unrest'])).toEqual({ needs: [], excludes: ['crisis: succession'], crisis: ['unrest'] });
    expect(V.declarationOfMarks(['crisis'])).toEqual({ needs: ['crisis'], excludes: [], crisis: [] });
    expect(V.declarationOfMarks(['no crisis', 'major', 'deficit', 'anchored'])).toEqual({ needs: [], excludes: ['crisis'], crisis: [] });
    expect(V.atomsOf(V.declarationOfTags(['walls', 'no market', 'crisis: threat']))).toEqual(['walls', 'no market', 'crisis: threat']);
  });
});
