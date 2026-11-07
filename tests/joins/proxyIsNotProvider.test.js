/**
 * tests/joins/proxyIsNotProvider.test.js — A PROXY IS NOT A PROVIDER, IN THE RECORD
 * (lane REVIEW-INTAKE unit 2, 2026-11-06).
 *
 * Until this lane twelve infrastructure rows (Dwellings, Housing, Water source, Sewage
 * system, Farmland, Common grazing land, Access to external mill, Massive prison) had no
 * menu of their own and borrowed an inn's, a courthouse's or a mill's through
 * `servicesData.js :: PROXY_SERVICE_HOSTS`. RS-19 hid the false attribution on every
 * display, but the RECORD still wrote `institution: 'Sewage system'` beside "Food and drink"
 * and the JSON export printed it (measured on the 1,000 soak settlements: 4,195 rows in 974).
 * Each former proxy now has its own entry; a row naming one of them offers only what that
 * house can give.
 */
import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const FORMER_PROXY_HOSTS = Object.freeze([
  ['Dwellings (1-8)', 'Infrastructure'], ['Dwellings (5-25)', 'Infrastructure'],
  ['Dwellings (15-100)', 'Infrastructure'], ['Housing (75-650 households)', 'Infrastructure'],
  ['Housing (500-4000 households)', 'Infrastructure'], ['Water source', 'Infrastructure'],
  ['Multiple water sources', 'Infrastructure'], ['Sewage system', 'Infrastructure'],
  ['Farmland', 'Economy'], ['Common grazing land', 'Economy'],
  ['Access to external mill', 'Economy'], ['Massive prison', 'Defense'],
]);
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CASES = TIERS.flatMap((tier) => Array.from({ length: 20 }, (_, i) => ({ tier, seed: `proxy-${tier}-${i}` })));

describe('a former proxy host offers only its own menu', () => {
  it('the corpus is 120 seeds, 20 per tier, every former host present', () => {
    expect(CASES).toHaveLength(120);
    expect(FORMER_PROXY_HOSTS).toHaveLength(12);
  });

  it('no service row names a former proxy host for a service its house cannot give', () => {
    const institutions = FORMER_PROXY_HOSTS.map(([name, category]) => ({ name, category }));
    let hostRows = 0;
    const failures = collectSeedFailures(CASES.map((c) => `${c.tier}|${c.seed}`), (key) => {
      const [tier, seed] = key.split('|');
      setActiveRng(createPRNG(seed));
      let buckets;
      try {
        buckets = generateAvailableServices(tier, institutions, {}, { settType: tier, tier, priorityCriminal: 8, priorityMilitary: 70 });
      } finally {
        clearActiveRng();
      }
      for (const row of Object.values(buckets).flat()) {
        const host = FORMER_PROXY_HOSTS.find(([name]) => name === row.institution)?.[0];
        if (!host) continue;
        hostRows += 1;
        const own = INSTITUTION_SERVICES[host] || {};
        expect(Object.hasOwn(own, row.name), `${host} credited with "${row.name}" (${key})`).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'a former proxy host offers only its own menu');
    // Liveness: the hosts that DO have a menu surface it, so the loop above judged rows.
    expect(hostRows).toBeGreaterThan(120);
  });

  // R1 (chair ruling, 2026-11-06): a house whose menu is ONE row offers it at p 1.0. A lower p
  // is a fake roll (the generator's fallback grants the first `on` row anyway) that spends a
  // draw. Red at the parent: Hospitality 0.5, Lodging (rooms to let) / Grain at harvest /
  // Pasturage 0.6.
  it('a former host whose menu is one row offers it at p 1.0', () => {
    const oneRow = FORMER_PROXY_HOSTS.map(([name]) => name).concat('Housing (3500+ households)')
      .filter((name) => Object.keys(INSTITUTION_SERVICES[name] || {}).length === 1);
    expect(oneRow).toHaveLength(9);
    for (const name of oneRow) {
      const [[svc, row]] = Object.entries(INSTITUTION_SERVICES[name]);
      expect({ name, svc, on: row.on, p: row.p }).toEqual({ name, svc, on: true, p: 1.0 });
    }
  });

  it('the houses with no menu (water, sewage) are tolerated: they surface nothing and crash nothing', () => {
    for (const name of ['Water source', 'Multiple water sources', 'Sewage system']) {
      expect(INSTITUTION_SERVICES[name], `${name} owns an (empty) entry, so no fuzzy match borrows a menu`).toEqual({});
      setActiveRng(createPRNG(`empty-${name}`));
      try {
        const buckets = generateAvailableServices('town', [{ name, category: 'Infrastructure' }], {}, { settType: 'village', tier: 'village', priorityCriminal: 8, priorityMilitary: 70 });
        expect(Object.values(buckets).flat().filter((r) => r.institution === name)).toEqual([]);
      } finally {
        clearActiveRng();
      }
    }
  });
});
