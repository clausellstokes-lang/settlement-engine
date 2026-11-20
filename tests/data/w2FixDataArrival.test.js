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
const town = (/** @type {{ tier?: string, houses?: string[], stress?: string[], imports?: string[] }} */ t) => factsOf({ tier: t.tier || 'town', institutions: (t.houses || []).map((name) => ({ name })), config: { stressTypes: t.stress || [] }, stress: (t.stress || []).map((type) => ({ type })), economicState: { foodSecurity: { foodRecord: { foodSources: ['fish', 'grain'] } }, ...(t.imports ? { primaryImports: t.imports } : {}) } });
const admits = (/** @type {any} */ l, /** @type {any} */ f) => declarationAdmits(declarationOf(l), f).admitted;

describe('W2-FIX-DATA: an arrival beat prints only where it is true', () => {
  it('the ironwork waits for no carts under siege (c22)', () => {
    // W2-FIX-DATA-12 item 3: the line also needs a smith now; both sides stand one, so the siege alone decides.
    // DEBT-1 (2026-11-17): SEAM-SCENES (item 3) made the line declare `trade at work: ironwork`, a smith WITH its iron
    // (`tradeAtWork.js :: GOOD_TRADES.ironwork`; the house "Short of iron." takes the twin); both sides now bring iron in,
    // so the siege alone still decides
    expect(admits(line('Racks of new ironwork'), town({ houses: ['Blacksmiths (3-10)'], stress: ['under_siege'], imports: ['Iron'] }))).toBe(false);
    expect(admits(line('Racks of new ironwork'), town({ houses: ['Blacksmiths (3-10)'], imports: ['Iron'] }))).toBe(true);
  });
  it('no fishmonger shouts a price where no market stands (c05)', () => {
    expect(admits(line('A fishmonger shouts'), town({ tier: 'thorp' }))).toBe(false);
    expect(admits(line('A fishmonger shouts'), town({ houses: ['Fish market'] }))).toBe(true);
  });
  it('a patron\'s crowd and a notary\'s clerk only in a town or larger (c09 at 33, c03 at 9)', () => {
    for (const start of ['A patron moves', "A notary's clerk"]) {
      expect(admits(line(start), town({ tier: 'hamlet', houses: ['Courthouse'] }))).toBe(false);
      expect(admits(line(start), town({ tier: 'town', houses: ['Courthouse'] }))).toBe(true);
    }
    // BAR5-THINGS (2026-11-16, LAW 4 "the notary"): the clerk also needs a house of written law (`legal house`); the patron does not
    expect(admits(line("A notary's clerk"), town({ tier: 'town', houses: ['Town hall'] }))).toBe(false);
    expect(admits(line('A patron moves'), town({ tier: 'town', houses: ['Town hall'] }))).toBe(true);
  });
  it('no traveller is offered water at the gate of a besieged town (c12)', () => {
    expect(admits(line('Travellers are offered water'), town({ stress: ['under_siege'] }))).toBe(false);
    expect(admits(line('Travellers are offered water'), town({}))).toBe(true);
  });
  it('the felt tents stand beside no timber houses the town may not have (c04, mud brick)', () => {
    expect(String(textOf(line('Felt tents'))('N'))).toMatch(/^Felt tents stand beside the houses/);
    // anchored: the line is found and asserted present on the line above
    expect(String(textOf(line('Felt tents'))('N'))).not.toMatch(/timber/);
  });
});
