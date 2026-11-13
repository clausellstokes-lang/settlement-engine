/**
 * W2-FIX-DATA (2026-11-13) — the service lines the REVIEW-W2B cold list read false
 * (`docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json`, rows in `src/data/institutionServices.js`), resolved
 * through the real site (`services/serviceRollMaterialization.js :: resolveServiceRow`) with the facts a birth
 * hands it: under a siege no line says the roads are open, and calm towns keep the line as written.
 */
import { describe, expect, it } from 'vitest';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { resolveServiceRow } from '../../src/generators/services/serviceRollMaterialization.js';
import { birthFactsOf } from '../../src/domain/facts/factsOf.js';

const facts = (/** @type {string[]} */ stress) => () => birthFactsOf({ institutions: [], config: { stressTypes: stress }, tier: 'town' }, { portKind: 'none' });
const row = (/** @type {string} */ inst, /** @type {string} */ svc) => ({ ...(/** @type {any} */ (INSTITUTION_SERVICES)[inst][svc]), name: svc, institution: inst, svcKey: inst });

describe('W2-FIX-DATA: a service line prints only where it is true', () => {
  for (const [inst, svc, falseUnderSiege] of [
    ['Access to external mill', 'Grain milling (a day away)', /carted to a mill outside/i],
    ['Daily markets', 'Fresh produce', /available every morning/i],
    ["Carriers' guild", 'Freight haulage', /^Organised road transport for goods between towns\. Reliable/],
  ]) {
    it(`${inst} / ${svc}: under siege it says the roads are cut, and calm it is as written (c02, c22, c17)`, () => {
      const besieged = resolveServiceRow(row(inst, svc), facts(['under_siege']));
      expect(besieged).not.toBeNull();
      expect(String(besieged?.desc)).not.toMatch(falseUnderSiege);
      expect(String(resolveServiceRow(row(inst, svc), facts([]))?.desc)).toMatch(falseUnderSiege);
    });
  }
});
