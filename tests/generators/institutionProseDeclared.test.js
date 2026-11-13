/**
 * tests/generators/institutionProseDeclared.test.js — CENSUS-4c unit 5: the institution
 * descriptions (`institutionDescVariants.js`, H: `assembleInstitutions.js` pickVariant) and the
 * services (`institutionServices.js`, R: the per-definition roll, printed whole) carry the phase-A
 * ledgers' declarations; their draw and print sites are CENSUS-1d's to wire (R-C).
 *
 * - The descriptions: a TEXT-KEYED column, `DESC_VARIANT_DECLARATIONS` (the shape R-P(3) accepted
 *   for 1c's sibling sets: six string consumers read the pairs, the resolver reads by text). Every
 *   key is a live variant (no drift), and the column is exactly the ledger's declaring rows less
 *   the three R-Q rows (a town gate is added by the cascade AFTER the description draw:
 *   soak1k-291/-453/…, 4 of 1,525 births), which wait on order.
 * - The services: in place on the definition objects (already objects; consumers read `desc`).
 *
 * @enforced-by npx vitest run tests/generators/institutionProseDeclared.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as D from '../../src/data/institutionDescVariants.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import * as V from '../../src/domain/facts/factVocabulary.js';

const ledger = (/** @type {string} */ name) => JSON.parse(readFileSync(new URL(`../../docs/census/declarations/${name}.json`, import.meta.url), 'utf8'));
const declares = (/** @type {any} */ r) => r.needs.length > 0 || r.excludes.length > 0 || r.crisis.length > 0;
const shape = (/** @type {any} */ d) => ({ needs: [...d.needs], excludes: [...d.excludes], crisis: [...d.crisis] });

/** R-Q: the town gate is settled after the description draw (the cascade adds it). */
const WAITING_ON_ORDER = ['town|Religious|Parish burial grounds#0', 'town|Defense|Town watch#0', 'town|Defense|Town watch#1'];

describe('the institution descriptions declare by text (CENSUS-4c unit 5)', () => {
  const rows = ledger('institutionDescVariants.INSTITUTION_DESC_VARIANTS').rows.filter(declares);
  it('the column is the ledger\'s declaring rows less the three waiting on order', () => {
    // COHERENCE-PRESUME (2026-11-11): the town bowyers' line #0 reworded to presume no militia, so it declares nothing (65 → 64, 62 → 61)
    // W2-FIX-DATA (2026-11-13, the REVIEW-W2B cold list): eleven variant texts read false now declare what makes them false (alehouse, port, bank, famine, metropolis, navigable water) and carry a twin in DESC_VARIANT_SIBLINGS (64 → 75, 61 → 72)
    // W2-FIX-DATA-3 (2026-11-13, REVIEW-W2-FIX-DATA F4): the Elder Grove Council's two variants no longer say "the city"; they speak the corpus's "town", which the draw speaks in the place's own noun, so their `tier: ≥ city` declaration went with the word (75 → 73, 72 → 70)
    expect(rows).toHaveLength(73);
    const cols = /** @type {Record<string, any>} */ (D.DESC_VARIANT_DECLARATIONS);
    const want = rows.filter((/** @type {any} */ r) => !WAITING_ON_ORDER.includes(r.id));
    expect(Object.keys(cols)).toHaveLength(70);
    for (const r of want) {
      expect({ id: r.id, ...shape(V.declarationOf(cols[r.text])) }).toEqual({ id: r.id, needs: r.needs, excludes: r.excludes, crisis: r.crisis });
    }
    for (const id of WAITING_ON_ORDER) expect(cols[rows.find((/** @type {any} */ r) => r.id === id).text]).toBeUndefined();
  });
  it('every key is a live variant of the table (a reworded line cannot keep a stale declaration)', () => {
    const live = new Set(Object.values(D.INSTITUTION_DESC_VARIANTS).flat());
    for (const text of Object.keys(D.DESC_VARIANT_DECLARATIONS)) expect(live.has(text)).toBe(true);
    for (const variants of Object.values(D.INSTITUTION_DESC_VARIANTS)) for (const v of variants) expect(typeof v).toBe('string');
  });
});

describe('the services declare in place (CENSUS-4c unit 5)', () => {
  const rows = ledger('institutionServices.INSTITUTION_SERVICES').rows;
  it('each definition carries exactly the ledger\'s declaration (4b\'s two Mill rows included)', () => {
    // W2-FIX-DATA (2026-11-13, the REVIEW-W2B cold list): the mill run, the morning produce and the carriers' haulage exclude a siege, each with its twin; the mill run has no ledger row (49 → 51)
    // W2-FIX-DATA-3 (2026-11-13, REVIEW-W2-FIX-DATA F3): the open-cast menu's raw extraction excludes town size and above, where every Mine works a shaft, with its twin (51 → 52)
    // W2-FIX-DATA-4 (2026-11-13, REVIEW-W2A-3 #507 #508): the river boatyard's and the river ferry's four services that name the river need it, each with its twin, where a coastal port with no river holds the houses (52 → 56)
    // W2-FIX-DATA-5 (2026-11-13, ROUND-3-CUT-INCREMENT ww-494): the Annual fair's seasonal trading excludes a siege that cuts every road, with its twin (56 → 57)
    // W2-FIX-DATA-6 (2026-11-13, CENSUS-2 kind b): the coaching inn's lodging and horse change exclude a siege that holds the roads, each with its twin (57 → 59)
    expect(rows.filter(declares)).toHaveLength(59);
    for (const r of rows) {
      const [inst, svc] = r.id.split('|');
      const def = /** @type {any} */ (INSTITUTION_SERVICES)[inst][svc];
      // 4b unit 3c (R-M): the Mill's "(if water mill)" / "(if saw mill)" left the text for a declaration
      if (inst === 'Mill' && (svc === 'Fulling cloth' || svc === 'Sawing timber')) continue;
      expect(def.desc).toBe(r.text);
      expect({ id: r.id, ...shape(V.declarationOf(def)) }).toEqual({ id: r.id, needs: r.needs, excludes: r.excludes, crisis: r.crisis });
    }
  });
});

describe('one declaration per printed text (the services and 1c\'s sibling sets agree)', () => {
  it('a canonical service desc that 1c twinned declares, on its definition, every atom its sibling row declares', async () => {
    const { SERVICE_DESC_SIBLINGS } = await import('../../src/data/institutionServices.js');
    const defs = Object.values(INSTITUTION_SERVICES).flatMap((s) => Object.values(/** @type {any} */ (s)));
    for (const [text, siblings] of Object.entries(SERVICE_DESC_SIBLINGS)) {
      const canonical = /** @type {any[]} */ (siblings).find((l) => l.text === text);
      for (const def of defs.filter((d) => /** @type {any} */ (d).desc === text)) {
        const d = V.declarationOf(def);
        for (const atom of canonical.needs || []) expect(d.needs).toContain(atom);
        for (const atom of canonical.excludes || []) expect(d.excludes).toContain(atom);
      }
    }
  });
});
