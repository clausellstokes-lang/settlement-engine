/**
 * CENSUS-4b, the chair's ruling of 2026-11-05 (item 2, found by CENSUS-3b): a parenthetical
 * condition inside a printed row is not prose. "(if water mill)" and "(if saw mill)" leave the Mill
 * services' text and become declarations where the atom exists — `institution: mill` + `river`
 * for the water mill, `institution: mill` for the saw mill. The service roll's site is
 * CENSUS-1d's to wire; the row's consumer reads `desc` and ignores the column.
 *
 * @enforced-by npx vitest run tests/generators/serviceAuthorNotes.test.js
 */
import { describe, expect, it } from 'vitest';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { assertDeclarable } from '../../src/domain/facts/factVocabulary.js';

describe('the Mill services carry their conditions as declarations (item 2)', () => {
  const mill = INSTITUTION_SERVICES.Mill;
  it('no printed desc holds an "(if …)" condition', () => {
    const leaked = Object.entries(INSTITUTION_SERVICES).flatMap(([k, rows]) => Object.entries(rows)
      .filter(([, r]) => /\(if\b/i.test(String(r?.desc ?? ''))).map(([n]) => `${k} :: ${n}`));
    expect(leaked).toEqual([]);
  });
  it('the water mill and the saw mill declare what the parentheticals said', () => {
    expect(mill['Fulling cloth']).toMatchObject({ desc: 'Textile processing', needs: ['institution: mill', 'river'] });
    expect(mill['Sawing timber']).toMatchObject({ desc: 'Lumber production', needs: ['institution: mill'] });
    for (const a of [...mill['Fulling cloth'].needs, ...mill['Sawing timber'].needs]) expect(assertDeclarable(a)).toBeTruthy();
  });
});
