/**
 * tests/domain/facts/crisisDisjunction.test.js — R-H (the chair, 2026-11-05 01:5x): THE CRISIS
 * RULE IS THE DISJUNCTION (`src/domain/facts/factVocabulary.js :: crisisAdmits`;
 * `docs/census/VOCABULARY_RULINGS_2026-11-04.md` §1, corrected).
 *
 * `crisis: [values]` admits a line when AT LEAST ONE declared kind or family is active (`hunger`
 * also on by a food-record deficit); `excludes: crisis[: F]` refuses it when ANY active crisis is
 * in F; `any` admits everywhere; `calm`, or silence in a `{crisis-scoped}` pool, admits only with
 * no crisis active. The conjunction (every active kind must be declared) refused a famine line
 * under famine + siege and muted a siege-keyed heading because a famine was on.
 *
 * Red-first at d6f8456be: arms (a), (b) and (c) red under the conjunction; (d) green on both
 * sides (hunger by deficit is kept).
 *
 * @enforced-by npx vitest run tests/domain/facts/crisisDisjunction.test.js
 */
import { describe, expect, it } from 'vitest';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { eligibleVariants } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { drawDeclared } from '../../../src/domain/facts/drawDeclared.js';

const famineSiege = factsOf({ tier: 'town', stress: [{ type: 'famine' }, { type: 'under_siege' }], institutions: [] });
const famineInsurgency = factsOf({ tier: 'town', stress: [{ type: 'famine' }, { type: 'insurgency' }], institutions: [] });
const calmPlace = factsOf({ tier: 'town', stress: [], institutions: [] });
const d = (/** @type {object} */ o) => V.declarationOf(o);

describe('R-H: the crisis dimension is a disjunction over the active crises', () => {
  it('(a) famine + siege: a famine line is admitted; famine + "no threat" is refused', () => {
    expect(V.declarationAdmits(d({ crisis: 'famine' }), famineSiege)).toEqual({ admitted: true, refused: [] });
    expect(V.declarationAdmits(d({ crisis: 'famine', excludes: ['crisis: threat'] }), famineSiege).admitted).toBe(false);
    // the same line under a famine alone is admitted (the siege is what the exclusion names)
    expect(V.declarationAdmits(d({ crisis: 'famine', excludes: ['crisis: threat'] }), famineInsurgency).admitted).toBe(true);
  });

  it('(b) a siege-keyed heading `crisis: under_siege` speaks under famine + siege', () => {
    const pool = [{ vid: 1, text: 'The gates have been shut for a month.', marks: [] }];
    const out = eligibleVariants(pool, { facts: famineSiege, poolDeclares: ['crisis: under_siege'] });
    expect(out.map((v) => v.vid)).toEqual([1]);
    const r = drawDeclared(['x'], { draw: (p) => p[0], facts: famineSiege, poolDeclares: ['crisis: under_siege'] });
    expect(r.resolvedBy).toBe('drawn');
  });

  it('(c) families and kinds mix; `excludes` checks every active crisis; calm and any', () => {
    expect(V.declarationAdmits(d({ crisis: 'threat' }), famineSiege).admitted).toBe(true);
    expect(V.declarationAdmits(d({ crisis: 'unrest' }), famineSiege).admitted).toBe(false); // none of it is on
    expect(V.declarationAdmits(d({ crisis: 'insurgency, siege' }), famineInsurgency).admitted).toBe(true);
    expect(V.declarationAdmits(d({ excludes: ['crisis: unrest'] }), famineInsurgency).admitted).toBe(false);
    expect(V.declarationAdmits(d({ excludes: ['crisis: unrest'] }), famineSiege).admitted).toBe(true);
    // `crisis: K` is a presence requirement in every pool (R-I): refused with no crisis on
    expect(V.declarationAdmits(d({ crisis: 'famine' }), calmPlace).admitted).toBe(false);
    expect(V.declarationAdmits(d({ crisis: 'famine, calm' }), calmPlace).admitted).toBe(true);
    expect(V.declarationAdmits(d({ crisis: 'calm' }), famineSiege).admitted).toBe(false);
    expect(V.declarationAdmits(d({}), famineSiege, { crisisScoped: true }).admitted).toBe(false);
    expect(V.declarationAdmits(d({ crisis: 'any' }), famineSiege, { crisisScoped: true }).admitted).toBe(true);
    expect(V.declarationAdmits(d({ crisis: 'any' }), calmPlace).admitted).toBe(true);
  });

  it('(d) hunger by a food-record deficit: on under any crisis while the record reads a deficit', () => {
    const deficitWar = factsOf({ tier: 'town', stress: [{ type: 'wartime' }], institutions: [],
      economicState: { foodSecurity: { foodRecord: { band: 'deficit' } } } });
    expect(V.declarationAdmits(d({ crisis: 'hunger' }), deficitWar).admitted).toBe(true);
    expect(V.declarationAdmits(d({ excludes: ['crisis: hunger'] }), deficitWar).admitted).toBe(false);
    const securedWar = factsOf({ tier: 'town', stress: [{ type: 'wartime' }], institutions: [],
      economicState: { foodSecurity: { foodRecord: { band: 'secure' } } } });
    expect(V.declarationAdmits(d({ crisis: 'hunger' }), securedWar).admitted).toBe(false);
  });
});
