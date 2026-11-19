/**
 * @vitest-environment jsdom
 *
 * upkeepVocation.test.jsx — COHERENCE-UPKEEP-5, the review's F2: A HOUSE'S OWN SERVICE IS NEVER
 * SCALED. A burial ground buries, a market square holds its market, a temple keeps its rites; only
 * what a house offers beyond its vocation is kept as far as the place can pay
 * (`serviceRollMaterialization.js`, the upkeep roll).
 *
 * A house's own service: every row its catalogue GUARANTEES (`p >= 1`: offered at every tier, by
 * the catalogue's own word) and every rite (`serviceDomainOf` 'religion': the priest's vocation,
 * the proposal's §c.6 "never scaled: … a vocation").
 *
 * The review (REVIEW-UPKEEP-419de26cb §5, F2) found, on the 660, 18 towns losing every Burial row
 * while their burial ground stood, 3 market squares losing their Weekly market, and 114 rite rows
 * gone. Its named births are the red seeds.
 *
 * TWO ARMS. (1) The roll: read as Struggling, every own-service row the same roster offers when
 * read as Wealthy is still offered. (2) The rendered page: on the Services tab of each born
 * record, every house on the roster shows each own service it offers at all.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { resolveServiceCatalogKey } from '../../src/generators/services/institutionServices.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { serviceDomainOf } from '../../src/generators/services/serviceAvailability.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { institutionDisplayName, institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';
import { importsHold, usedGroundOf } from '../../src/domain/facts/supplyStory.js';
import { resourceShortageImport } from '../../src/domain/resourceSemantics.js';

afterEach(cleanup);

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The review's named births (F2), and two forced famines it names. */
const RED = ['agree-city-38', 'agree-city-29', 'agree-city-72', 'agree-town-87', 'agree-town-0'];
const FORCED = ['agree-force-famine-town-0', 'agree-force-famine-town-7'];

/** @param {string} seed */
const born = (seed) => {
  const forced = /^agree-force-(\w+)-(\w+)-\d+$/.exec(seed);
  const cfg = forced
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false })
    : birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
  return generateSettlementPipeline(cfg, null, { seed });
};
/** @param {any} s @param {string} prosperity @param {string} seed */
const rollAs = (s, prosperity, seed) => {
  const prev = setActiveRng(createPRNG(`${seed}:services`));
  try {
    return generateAvailableServices(s.tier, s.institutions, s.config?.servicesToggles || {}, s.config, null, { prosperity, seed });
  } finally { clearActiveRng(prev); }
};
/** A house's catalogue rows, read from the table (no roll). @param {any} institution @returns {Array<[string, any]>} */
const catalogueOf = (institution) => {
  const key = resolveServiceCatalogKey(String(institution.name || ''));
  return key ? Object.entries(/** @type {any} */ (INSTITUTION_SERVICES)[key] || {}) : [];
};
/** A house's own services, by its catalogue. @param {any} institution @param {string} _tier */
const ownServicesOf = (institution, _tier) => new Set(catalogueOf(institution)
  .filter(([name, def]) => Number(def.p) >= 1 || serviceDomainOf(name, String(institution.name || '')) === 'religion')
  .map(([name]) => name));
/**
 * 2026-11-18, BAR8-FISH-ROWS (ruling BR24; R8, RE-KEYED BY IDENTITY): a house's own service, AS THE PAGE NAMES IT. Where the
 * fish is bought in (the town's fish grounds used up and the spent ground's own word on the stored imports, "Salted fish
 * (local … exhausted)"), a catch row's own service is its pool's own alternative (the catalogue's `inlandAlternative`: the
 * Fish market's "Fresh fish retail" is its "Preserved fish"), written by the birth in its place; elsewhere it is the row
 * itself. The claim is unchanged: upkeep never takes a house's own service (agree-town-87 buys its fish in).
 * @param {any} s @param {string} house @param {string} name
 */
const ownServiceOnPage = (s, house, name) => {
  const ground = usedGroundOf(s, 'fish');
  if (!ground || !importsHold(s, String(resourceShortageImport(ground) || ''))) return name;
  const key = resolveServiceCatalogKey(house);
  const alt = key ? /** @type {any} */ (INSTITUTION_SERVICES)[key]?.[name]?.inlandAlternative : undefined;
  return typeof alt === 'string' ? alt : name;
};
/** Every (house, own service) pair a services map holds. @param {any} svc @param {any} s */
const ownRows = (svc, s) => {
  const own = new Map(s.institutions.map((i) => [String(i.name), ownServicesOf(i, s.tier)]));
  return new Set(Object.values(svc).flat().filter((r) => own.get(String(r.institution))?.has(r.name)).map((r) => `${r.institution} | ${r.name}`));
};

describe('a house keeps its own service, whatever the place can pay', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('RED-FIRST, the roll: read as Struggling, every own-service row the roster offers read as Wealthy is still offered (the review\'s births)', () => {
    let anchored = 0;
    const lost = [];
    for (const seed of [...RED, ...FORCED]) {
      const s = born(seed);
      const rich = ownRows(rollAs(s, 'Wealthy', seed), s);
      const poor = ownRows(rollAs(s, 'Struggling', seed), s);
      anchored += rich.size;
      for (const key of rich) if (!poor.has(key)) lost.push(`${seed}: ${key}`);
    }
    expect(anchored, 'anchored: the corpus offers own services').toBeGreaterThan(40);
    expect(lost).toEqual([]);
  });

  test('RED-FIRST, the page: on the Services tab, every house shows each own service the roster offers when the place can pay in full', () => {
    let checked = 0;
    const missing = [];
    const failures = collectSeedFailures([...RED, ...FORCED], (seed) => {
      const s = born(seed);
      // The catalogue's guaranteed rows (p >= 1) only: a rite at p < 1 rides the seeded catalogue roll,
      // whose stream this test does not share with the birth (the roll arm above holds those).
      const guaranteed = new Map(s.institutions.map((i) => [String(i.name), new Set(catalogueOf(i).filter(([, d]) => Number(d.p) >= 1).map(([n]) => n))]));
      const offered = [...ownRows(rollAs(s, 'Wealthy', seed), s)].filter((key) => { const [h, n] = key.split(' | '); return guaranteed.get(h)?.has(n); });
      const { container } = render(<ServicesTab services={s.availableServices} settlement={s} narrativeNote={null} />);
      const shown = [...container.querySelectorAll('[data-testid="service-row"]')].map((row) => ({
        name: row.querySelector('span')?.textContent || '',
        house: row.textContent || '', // the row carries its house's attribution line
      }));
      expect(shown.length, `anchored: ${seed}'s tab renders its rows`).toBeGreaterThan(0);
      for (const key of offered) {
        const [house, rolled] = key.split(' | ');
        const name = ownServiceOnPage(s, house, rolled); // 2026-11-18 BAR8-FISH-ROWS (R8): the own service as the page names it
        checked += 1;
        // A native service is one row per name (`availableServiceIdentityKey`): where an earlier house
        // on the roster offers the same name, the row stands under that house (agree-city-29: the
        // potter's Fired brick, before the brickmaker's). Under its own house, or under the one that
        // offers it first, the service is on the page.
        // 2026-11-15 (TAIL-CLOSE-PROSE-1, the chair's ruling UV1): the house is looked for by the page's
        // own reader. Since R2-CODE-B round 3, ruling (a) (d425c31c1, 2026-11-13: "the Services providers
        // and the Power tab's house lists name each house by its label"), the row's provider line is
        // printed by `InstitutionLink` through `institutionHouseLabel`, not `institutionDisplayName`:
        // "Taverns (5-20)" reads "Taverns", "Inn (multiple)" "Inns", "Parish churches (2-5)" "Houses of
        // worship". The 41 rows the arm read missing all stood on the tab under their house's label.
        // The service's own name is still read by `institutionDisplayName`.
        const rows = shown.filter((r) => r.name === institutionDisplayName(name));
        if (!rows.some((r) => r.house.includes(institutionHouseLabel(house))) && !(rows.length && (s.availableServices && Object.values(s.availableServices).flat().some((r) => r.name === name && r.institution !== house)))) missing.push(`${seed}: ${house} | ${name}`);
      }
      cleanup();
    });
    expectNoSeedFailures(failures, "every born record's Services tab renders its rows");
    expect(checked, 'anchored: own services were looked for on the page').toBeGreaterThan(40);
    expect(missing).toEqual([]);
  });
});
