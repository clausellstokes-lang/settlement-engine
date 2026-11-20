/**
 * tests/domain/facts/rulingBody.test.js — TAIL-TIES, THE CHAIR'S RULING (T5) of 2026-11-14: the word `ruling body`
 * granted, ONE atom (the town is ruled by a body of more than one: `src/domain/facts/rulingBody.js`), through the
 * vocabulary's own door (`factVocabulary.js`, `factsOf.js`, `factLayers.js`), its rule MOVED from
 * `coherence/hookTruth.js` (re-exported there, so the hook gate and the atom are one reading).
 *
 * @enforced-by npx vitest run tests/domain/facts/rulingBody.test.js
 */
import { describe, expect, it } from 'vitest';
import { rulingBodyOf, ruledByBodyOfLabel, RULED_BY_A_BODY } from '../../../src/domain/facts/rulingBody.js';
import * as HT from '../../../src/domain/coherence/hookTruth.js';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { factsOf, birthFactsOf } from '../../../src/domain/facts/factsOf.js';
import { LEAVES } from '../../../src/domain/facts/factLayers.js';

/** Every government label the 720 census towns carry (f663a2699), with its answer. */
const LABELS = Object.freeze({
  'Elder Council': true, 'Free Elder Council': true, 'Household Council': true, "Headman's Authority": false,
  'Priestly Guidance': false, 'Church Council': true, 'Ecclesiastical Council': true, 'High Theocratic Council': true,
  'Elected Reeve': false, 'Town Mayor': false,
  'Feudal Stewardship': false, 'Feudal Appointee': false, 'Noble Governorship': false, 'Ducal Governorship': false, 'Royal Authority': false,
  'Corrupt Council': true, 'Arcane Council': true, 'Merchant Council': true, 'Guild Council': true, 'Merchant oligarchy': true,
  'Military Council': true, 'Town Council': true, 'Merchant City Council': true, 'Military City Council': true,
  'City-State Council': true, 'City Council': true, 'Merchant Guild Council': true, 'Corrupt City Council': true,
  'Democratic assembly': true, 'Shadow Senate': true, 'Grand Guild Consortium': true, 'Grand Council': true,
  'Grand Merchant Oligarchy': true, 'Grand Military Council': true, 'Grand Merchant Senate': true, 'Arcane Senate': true,
});
const rec = (government) => ({ tier: 'village', powerStructure: { government } });

describe('the home: a body of more than one, read off the form of government', () => {
  it('every census label answers as a body or as one ruler', () => {
    for (const [label, body] of Object.entries(LABELS)) expect([label, rulingBodyOf(rec(label))]).toEqual([label, body]);
  });
  it('an absent government answers nothing (an unknown seat licenses nothing)', () => {
    expect(rulingBodyOf({})).toBeUndefined();
    expect(rulingBodyOf(rec(''))).toBeUndefined();
    expect(rulingBodyOf(null)).toBeUndefined();
  });
  it('hookTruth.js re-exports the SAME rule (moved, not copied), and its gate reads it', () => {
    expect(HT.ruledByBodyOfLabel).toBe(ruledByBodyOfLabel);
    expect(HT.RULED_BY_A_BODY).toBe(RULED_BY_A_BODY);
    for (const [label, body] of Object.entries(LABELS)) expect([label, HT.settlementHookFacts(rec(label)).ruledByCouncil]).toEqual([label, body]);
  });
});

describe('the atom, through the vocabulary\'s door', () => {
  it('is declarable, homed on factsOf, and layered', () => {
    expect(V.assertDeclarable('ruling body').dimension).toBe('ruling body');
    expect(V.FACT_DIMENSIONS['ruling body'].home).toBe('rulingBody');
    expect(LEAVES.rulingBody).toBeTruthy();
    expect(factsOf(rec('Elder Council')).rulingBody).toBe(true);
  });
  it('holds, refuses, and is unanswered without a government; a birth in progress reads the government it is handed', () => {
    expect(V.atomHolds('ruling body', factsOf(rec('Household Council')))).toBe(true);
    expect(V.atomHolds('ruling body', factsOf(rec("Headman's Authority")))).toBe(false);
    expect(V.atomHolds('ruling body', factsOf({ tier: 'thorp' }))).toBeUndefined();
    expect(V.atomHolds('ruling body', birthFactsOf({ tier: 'hamlet', powerStructure: { government: "Headman's Authority" } }))).toBe(false);
    const need = V.declarationOf({ line: 'x', needs: ['ruling body'] });
    expect(V.declarationAdmits(need, factsOf(rec('Grand Council'))).admitted).toBe(true);
    expect(V.declarationAdmits(need, factsOf(rec("Headman's Authority"))).admitted).toBe(false);
    expect(V.declarationAdmits(need, factsOf({})).admitted).toBe(false); // fail-closed, R-N
  });
});
