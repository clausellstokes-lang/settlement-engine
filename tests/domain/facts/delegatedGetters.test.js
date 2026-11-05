/**
 * tests/domain/facts/delegatedGetters.test.js — CENSUS-1c unit 5 (the chair's R-E; the vocabulary
 * rulings §2): the delegated getters CENSUS-1c owns — `soldiers`, `commander`, `mercenary` (the
 * defence reader) and `priest` (through `faith`, `faithReadingOf`) — are one-line delegations to
 * the canonical readers, declarable, and agree with those readers on every record.
 *
 * @enforced-by npx vitest run tests/domain/facts/delegatedGetters.test.js
 */
import { describe, expect, it } from 'vitest';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { defenseFactsOf } from '../../../src/domain/defense/defenseFacts.js';
import { faithReadingOf } from '../../../src/domain/dossier/faithReading.js';

const RECORDS = [
  { tier: 'thorp', institutions: [] },
  { tier: 'town', institutions: [{ name: 'Garrison', category: 'Defense' }] },
  { tier: 'town', institutions: [{ name: 'Mercenary company', category: 'Defense' }] },
  { tier: 'city', institutions: [{ name: 'Town watch', category: 'Defense' }, { name: 'Parish church', category: 'Religious' }],
    npcs: [{ name: 'Aldo Venn', role: 'Priest' }] },
];

describe('the delegated getters (R-E)', () => {
  it('soldiers = garrison ∨ hired company; commander = hasCommander; mercenary = hasMercenary', () => {
    for (const r of RECORDS) {
      const d = defenseFactsOf(/** @type {any} */ (r));
      const f = factsOf(r);
      expect(f.soldiers).toBe(d.hasGarrison || d.hasMercenary);
      expect(f.commander).toBe(d.hasCommander);
      expect(f.defence.mercenary).toBe(d.hasMercenary);
    }
    expect(factsOf(RECORDS[1]).soldiers).toBe(true);
    expect(factsOf(RECORDS[0]).soldiers).toBe(false);
  });
  it('faith is faithReadingOf; priest = a senior cleric stands', () => {
    for (const r of RECORDS) {
      expect(factsOf(r).faith).toEqual(faithReadingOf(/** @type {any} */ (r)));
      expect(V.atomHolds('priest', factsOf(r))).toBe(faithReadingOf(/** @type {any} */ (r)).seniorCleric != null);
    }
  });
  it('the four atoms are declarable now; the named-but-refused list shrinks by exactly them', () => {
    for (const a of ['soldiers', 'commander', 'mercenary', 'priest']) expect(V.assertDeclarable(a).dimension).toBe(a);
    const refused = Object.entries(V.FACT_DIMENSIONS).filter(([, d]) => d.reader === null).map(([n]) => n).sort();
    expect(refused).toEqual([]); // the merge of CENSUS-3b and CENSUS-1c (lane census-3, 2026-11-05) empties it
  });
  it('soldiers answers the twin table’s own `soldiers` need', () => {
    const facts = factsOf(RECORDS[2]);
    expect(V.declarationAdmits(V.declarationOf({ text: 'x', needs: ['soldiers'] }), facts).admitted).toBe(true);
    expect(V.declarationAdmits(V.declarationOf({ text: 'x', needs: ['soldiers'] }), factsOf(RECORDS[0])).admitted).toBe(false);
  });
});
