// BAR5-FOOD's GUARD (BRIEF-BAR5, Amendment L, L4): LAW 3's food rules of the audit's detector
// (`tests/helpers/pageLaws/law3.mjs`: `L3.failedFood`, `L3.foodLineStopped`, `L3.foodModel`) kept as a guard over the
// lines the cured leaves print, each with (a) THE ZERO and (b) A POSITIVE CONTROL, and (c) the one fact of the catch.
//
//   (a) THE ZERO: the read towns in which a rule fired at the base (600b7683a; the hand-back's table "THE RULES"), born as
//       the census bears them; the detector over the page the leaves print for each town (the Resources tab's failed card
//       and its commodity list, `display/commoditiesShown.js`; the foodways line, `foodways.js :: foodwaysLineOf`; the
//       fish trade's income row as the mark leaf marks it; the farmland houses' cards and their service chips) finds none.
//       The census's after run over the sixty, the 720 and the fresh 300 is the whole measure; these towns are where it bit.
//   (b) THE POSITIVE CONTROL: the same towns with the line the base printed (the commodity list read raw; the food
//       record's own stored line, before the print-time readings): the detector MUST fire, so it cannot go blind.
//   (c) THE ONE FACT OF THE CATCH: the food line's reading of a siege's stop of the catch (`facts/catchStopped.js`) is the
//       mark leaf's own verdict on the fish trade (`display/crisisStoppedRow.js :: rowStoppedBy` on each house of the
//       trade: the siege's mark, stopped or curtailed, on every one), in every guard town: the two cannot drift.
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law3 } from '../helpers/pageLaws/law3.mjs';
import { readTown } from '../helpers/pageLaws/pageB.mjs';
import { foodwaysLineOf } from '../../src/domain/foodways.js';
import { commoditiesShown, FAILED_MARK } from '../../src/domain/display/commoditiesShown.js';
import { famineFailedResourceOf } from '../../src/domain/display/validationOnPage.js';
import { rowStoppedBy, stoppedRowMark } from '../../src/domain/display/crisisStoppedRow.js';
import { catchStoppedBySiege, FISH_TRADE_STOPPED_BY_SIEGE } from '../../src/domain/facts/catchStopped.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { serviceRowsOf } from '../../src/domain/dossier/entityLinks.js';

/** The read towns in which each rule fired at the base (the sixty: `bar0-<shape>-rand-21..26`). */
const AT_BASE = Object.freeze({
  'L3.failedFood': Object.freeze(['bar0-city-under_siege+famine-rand-23', 'bar0-village-famine-rand-22', 'bar0-village-famine-rand-23', 'bar0-village-famine-rand-24', 'bar0-village-famine-rand-25']),
  'L3.foodLineStopped': Object.freeze(['bar0-hamlet-under_siege-rand-24']),
  'L3.foodModel': Object.freeze(['bar0-village-calm-rand-21', 'bar0-village-calm-rand-22', 'bar0-village-calm-rand-24', 'bar0-village-calm-rand-25']),
});
/** Besieged towns for the catch's one fact: a fishing hamlet the siege stops, and the besieged read towns beside it. */
const SIEGE_TOWNS = Object.freeze(['bar0-hamlet-under_siege-rand-21', 'bar0-hamlet-under_siege-rand-22', 'bar0-hamlet-under_siege-rand-24', 'bar0-hamlet-under_siege-rand-25', 'bar0-city-under_siege+famine-rand-22', 'bar0-city-under_siege+famine-rand-24']);
const SEEDS = [...new Set([...Object.values(AT_BASE).flat(), ...SIEGE_TOWNS])];
const FISH_SHARE = Object.freeze({ source: 'Fish & Maritime Produce' });

/** The census's bar0- arm (PAGE-COPY `seedcfg.mjs`, verbatim in shape). @param {string} seed @param {any} DEFAULT_CONFIG */
function configOf(seed, DEFAULT_CONFIG) {
  const m = seed.match(/^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  if (!m) throw new Error(`a guard seed is a read town: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  return { ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
}

/**
 * The lines the three rules read, as the cured leaves print them (`raw`: as the base printed them).
 * @param {any} s @param {boolean} raw @returns {string}
 */
function pageOf(s, raw) {
  const failed = famineFailedResourceOf(s);
  const items = raw
    ? (s.resourceAnalysis?.availableResources || []).map((/** @type {string} */ k) => commoditiesShown({ resourceAnalysis: { availableResources: [k] } })[0]?.label ?? k)
    : commoditiesShown(s).map((c) => (c.failed ? `${c.label} (${FAILED_MARK})` : c.label));
  const food = raw ? String(s.economicState?.foodSecurity?.foodRecord?.foodwaysLine ?? '') : String(foodwaysLineOf(s) ?? '');
  const fishMark = stoppedRowMark(s, 'income', FISH_SHARE);
  const rows = serviceRowsOf(s.availableServices).map((x) => /** @type {any} */ (x.svc));
  const farms = liveInstitutions(s).filter((i) => /^(Farmland|Fields|Common fields|Farmsteads?|Croft|Arable)/i.test(String(i.name)));
  const cards = farms.flatMap((h) => {
    const chips = rows.filter((/** @type {any} */ r) => r && r.institution === h.name).map((/** @type {any} */ r) => (rowStoppedBy(s, 'service', r) ? `${r.name} (stopped)` : String(r.name)));
    return [`${h.name} · Economy`, ...(chips.length ? [`Services · ${chips.join(' · ')}`] : [])];
  });
  return [
    '== Systems/Resources ==', ...(failed ? [`✗ Failed this year · ${failed.charAt(0).toUpperCase()}${failed.slice(1)}`] : []),
    'Commodities available', items.join(' · '),
    '== Systems/Economics ==', ...(fishMark ? [`Fish & Maritime Produce ${fishMark}`] : []), food,
    '== Systems/Institutions ==', ...cards,
  ].join('\n');
}

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of SEEDS) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig(configOf(seed, DEFAULT_CONFIG)), null, { seed, customContent: {} }));
}, 240_000);

/** @param {string} seed @param {boolean} raw @param {string} rule */
const found = (seed, raw, rule) => law3(readTown(pageOf(BORN.get(seed), raw), BORN.get(seed)), seed).filter((x) => x.rule === rule);

describe('BAR5-FOOD · LAW 3 food rules over the cured leaves (the zero, and the base line as the positive control)', () => {
  for (const [rule, seeds] of Object.entries(AT_BASE)) {
    it(`${rule}: fires on the base line in every town it bit, and on none of the cured pages`, () => {
      const failures = collectSeedFailures(seeds, (seed) => {
        expect(found(seed, true, rule).length, `${seed}: the base line is found`).toBeGreaterThan(0);
        expect(found(seed, false, rule).map((x) => x.line)).toEqual([]);
      });
      expectNoSeedFailures(failures);
    });
  }

  it('what prints instead: the failed food is marked where it is listed; the food line names the fields\' grain; a stopped catch leaves the table', () => {
    const famine = BORN.get('bar0-village-famine-rand-24');
    expect(commoditiesShown(famine).filter((c) => c.failed).map((c) => c.key)).toEqual(['grain_fields', 'grain', 'flour']);
    expect(String(foodwaysLineOf(BORN.get('bar0-village-calm-rand-24'))).startsWith('Its own fields give it grain;')).toBe(true);
    const hamlet = BORN.get('bar0-hamlet-under_siege-rand-24');
    expect(catchStoppedBySiege(hamlet)).toBe(true);
    expect(foodwaysLineOf(hamlet)).toBe('Meals follow the season and what the household has put by.');
  });
});

describe('BAR5-FOOD · the catch is one fact: the food line reads the mark leaf\'s own verdict on the fish trade', () => {
  it('catchStoppedBySiege equals the leaf\'s siege mark on every house of the fish trade, in every guard town', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = BORN.get(seed);
      const houses = liveInstitutions(s).filter((i) => Object.hasOwn(FISH_TRADE_STOPPED_BY_SIEGE, String(i.catalogId || catalogIdForName(i.name) || '')));
      const leaf = s.economicState?.foodSecurity?.hasSiege === true && houses.length > 0 && houses.every((h) => /^under_siege/.test(String(rowStoppedBy(s, 'house', h))));
      expect(catchStoppedBySiege(s), seed).toBe(leaf);
    });
    expectNoSeedFailures(failures);
  });
});
