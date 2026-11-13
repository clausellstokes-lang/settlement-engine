/**
 * W2-FIX-DATA (2026-11-13) — the arrival beats the REVIEW-W2B cold list read false
 * (`docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json`, rows in `src/data/arrivalProse.js`). The arrival site
 * (`narrative/arrivalScene.js :: drawAdmitted`) redraws a refused beat from the admitted lines, so a line is
 * cured when the facts of the town that made it false refuse it, and the town where it is true admits it.
 */
import { describe, expect, it } from 'vitest';
import { ARRIVAL_SENSES, ARRIVAL_PEOPLE } from '../../src/data/arrivalProse.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { textOf } from '../../src/domain/facts/textOf.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

/** every line of a pool table, however deep it nests */
const lines = (/** @type {unknown} */ v) => (Array.isArray(v) ? v : v && typeof v === 'object' && !('text' in v) ? Object.values(v) : [v]).flatMap((x) => (Array.isArray(x) || (x && typeof x === 'object' && !('text' in x)) ? lines(x) : [x]));
const all = [...lines(ARRIVAL_SENSES), ...lines(ARRIVAL_PEOPLE)];
const line = (/** @type {string} */ start) => {
  const hit = all.filter((l) => typeof l === 'function' || (l && typeof l === 'object' && 'text' in l)).find((l) => String(textOf(l)('N')).startsWith(start));
  if (!hit) throw new Error(`no line ${start}`);
  return hit;
};
const town = (/** @type {{ tier?: string, houses?: string[], stress?: string[] }} */ t) => factsOf({ tier: t.tier || 'town', institutions: (t.houses || []).map((name) => ({ name })), config: { stressTypes: t.stress || [] }, stress: (t.stress || []).map((type) => ({ type })), economicState: { foodSecurity: { foodRecord: { foodSources: ['fish', 'grain'] } } } });
const admits = (/** @type {any} */ l, /** @type {any} */ f) => declarationAdmits(declarationOf(l), f).admitted;

describe('W2-FIX-DATA: an arrival beat prints only where it is true', () => {
  it('the ironwork waits for no carts under siege (c22)', () => {
    expect(admits(line('Racks of new ironwork'), town({ stress: ['under_siege'] }))).toBe(false);
    expect(admits(line('Racks of new ironwork'), town({}))).toBe(true);
  });
  it('no fishmonger shouts a price where no market stands (c05)', () => {
    expect(admits(line('A fishmonger shouts'), town({ tier: 'thorp' }))).toBe(false);
    expect(admits(line('A fishmonger shouts'), town({ houses: ['Fish market'] }))).toBe(true);
  });
  it('a patron\'s crowd and a notary\'s clerk only in a town or larger (c09 at 33, c03 at 9)', () => {
    for (const start of ['A patron moves', "A notary's clerk"]) {
      expect(admits(line(start), town({ tier: 'hamlet' }))).toBe(false);
      expect(admits(line(start), town({ tier: 'town' }))).toBe(true);
    }
  });
  it('no traveller is offered water at the gate of a besieged town (c12)', () => {
    expect(admits(line('Travellers are offered water'), town({ stress: ['under_siege'] }))).toBe(false);
    expect(admits(line('Travellers are offered water'), town({}))).toBe(true);
  });
  it('the felt tents stand beside no timber houses the town may not have (c04, mud brick)', () => {
    expect(String(textOf(line('Felt tents'))('N'))).not.toMatch(/timber/);
  });
});
