/**
 * W2-FIX-DATA-6 (2026-11-13): the census's writers in the data lane's files (CENSUS-2, lane/census-2-2026-11-13 at
 * 2686272b1, `CENSUS-2.json` key `hits`), each read against its town's record at this lane's tip and reproduced false in a
 * census town (`r2r-<size>-<i>` every dial random; `r2s-<crisis>-<size>-<i>` the crisis forced, Random off), one arm per
 * cause.
 *
 * THIS FILE REDS WHEN a town prints one of those lines again where its record makes it false, or when the town it is true
 * in loses it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** A census town, as its births script makes it. */
const bornCensus = (/** @type {string} */ seed) => {
  const forced = /^r2s-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const calm = /^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  const tier = forced ? forced[2] : /** @type {RegExpExecArray} */ (calm)[1];
  const cfg = forced ? { ...DEFAULT_CONFIG, ...dials, settType: tier, selectedStressesRandom: false, selectedStresses: [forced[1]] } : { ...DEFAULT_CONFIG, ...dials, settType: tier };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @param {any} town @param {string} house */
const servicesOf = (town, house) => Object.values(town.availableServices || {}).flat().filter((/** @type {any} */ v) => v.institution === house);

describe('W2-FIX-DATA-6: the census writers in the data lane\'s files', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('CENSUS-2 b: under a siege the coaching inn takes no traveller off the road and sends no relay out (r2s-under_siege-city-2); a calm town keeps both lines (r2r-town-2)', () => {
    const besieged = servicesOf(bornCensus('r2s-under_siege-city-2'), 'Coaching inn').map((v) => String(v.desc));
    expect(besieged.filter((t) => /for travelers on the road|Reduces travel time/.test(t))).toEqual([]);
    expect(besieged).toContain('Beds, meals, and stabling, though with the roads held the rooms stand mostly empty.');
    expect(besieged).toContain('Relay horses kept for coaches and dispatch riders; while the siege holds the roads, none go out.');
    const calm = servicesOf(bornCensus('r2r-town-2'), 'Coaching inn').map((v) => String(v.desc));
    expect(calm).toContain('Beds, meals, and stabling for travelers on the road. Priced by quality.');
  }, 120_000);

  test('#919: the mages\' guild\'s ley-line shortage names no licensing the guild does not offer (r2r-city-1, r2s-under_siege-city-0)', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-city-1', 'r2s-under_siege-city-0'], (seed) => {
      const deps = bornCensus(seed).economicState.tradeDependencies.filter((/** @type {any} */ d) => d.institution === "Mages' guild");
      expect(deps.map((/** @type {any} */ d) => d.affectedServices.join(', ')), seed).toEqual(['spellcasting, arcane training']);
    }), 'every guild town names only what the guild offers');
  }, 120_000);
});

/** @param {any} town @param {string} type */
const crisisOf = (town, type) => (Array.isArray(town.stress) ? town.stress : [town.stress]).find((/** @type {any} */ e) => e && e.type === type);

describe('W2-FIX-DATA-7: the census writers in the data lane\'s files (the seventh seat)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('CENSUS-2 a (stressTypes.js through rerenderStressSummary): the famine\'s grain merchant only where a mill gives the slot a holder, the plague\'s healer only where one stands, market and fair only where a market does', async () => {
    const { crisisHookFor } = await import('../../src/domain/crisis/crisisHooks.js');
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-17', 'r2s-famine-hamlet-0', 'r2s-plague_onset-thorp-0', 'r2s-plague_onset-village-2', 'r2s-religious_conversion-thorp-0', 'r2r-village-5'], (seed) => {
      const town = bornCensus(seed);
      for (const type of ['famine', 'plague_onset', 'religious_conversion']) {
        const e = crisisOf(town, type); if (!e) continue;
        const hook = crisisHookFor(town, e);
        expect(hook, `${seed} ${type}`).not.toMatch(/\bA grain merchant\b|\bThe healer who identified\b/);
        expect(String(e.viabilityNote ?? ''), `${seed} ${type}`).not.toMatch(/\bmarket\b|\bfairs\b/);
      }
    }), 'no mill, no healer, no market: none is named');
    // what prints in their place, and the guard towns that keep the original (a mill's miller named; a healer; a market)
    expect(crisisOf(bornCensus('r2r-thorp-17'), 'famine').crisisHook).toMatch(/^Someone here still has food put by, enough to matter\./);
    expect(crisisOf(bornCensus('r2s-plague_onset-thorp-0'), 'plague_onset').viabilityNote).toBe('Travel is discouraged, and some goods stop arriving.');
    expect(crisisOf(bornCensus('r2r-village-5'), 'religious_conversion').viabilityNote).toBe("The tithe is split, and the old house's property has no clear owner.");
    expect('viabilityNote' in crisisOf(bornCensus('r2s-religious_conversion-thorp-0'), 'religious_conversion'), 'no house of the faith, no market: no note').toBe(false);
    const miller = bornCensus('r2r-village-24'); const famine = crisisOf(miller, 'famine');
    const lever = famine.cast.roles.find((/** @type {any} */ r) => r.role === 'lever');
    expect(crisisHookFor(miller, famine)).toMatch(new RegExp(`^${lever.name} has food, enough to matter\\.`));
    expect(crisisHookFor(bornCensus('r2r-city-19'), crisisOf(bornCensus('r2r-city-19'), 'plague_onset'))).toMatch(/, the healer who identified the outbreak first, has gone quiet\./);
    expect(crisisOf(bornCensus('r2s-religious_conversion-town-0'), 'religious_conversion').viabilityNote).toMatch(/feast days and fairs are held twice over/);
  }, 240_000);
});

describe('W2-FIX-DATA-8: the census writers in the data lane\'s files (the eighth seat)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

  test('HANDBACK-6 row 3 (ww-1415): the village brewer names alehouses only where one stands; where none does, it supplies the households (r2r-village-16, r2s-monster_pressure-village-1, r2s-insurgency-village-0, r2s-wartime-village-1); a village with an alehouse at the draw keeps the line (r2r-village-15)', async () => {
    const { hasInstitution } = await import('../../src/domain/facts/institutions.js');
    expectNoSeedFailures(collectSeedFailures(['r2r-village-16', 'r2s-monster_pressure-village-1', 'r2s-insurgency-village-0', 'r2s-wartime-village-1'], (seed) => {
      const town = bornCensus(seed);
      expect(hasInstitution(town, 'tavern'), seed).toBe(false);
      const brewer = (town.institutions || []).find((/** @type {any} */ i) => i.name === 'Brewer');
      expect(String(brewer.desc), seed).not.toMatch(/alehouse/i);
      expect(String(brewer.desc), seed).toMatch(/households|homes/);
    }), 'no tavern, inn or alehouse: the brewer supplies none');
    const kept = bornCensus('r2r-village-15');
    expect(hasInstitution(kept, 'tavern')).toBe(true);
    expect((kept.institutions || []).find((/** @type {any} */ i) => i.name === 'Brewer').desc).toBe('Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies alehouses and households.');
    // the order, measured: the cascade adds r2r-village-24's Ale house after the draw, so it prints the twin, which is true there too
    const late = bornCensus('r2r-village-24');
    expect((late.institutions || []).find((/** @type {any} */ i) => i.name === 'Ale house').cascadeAdded).toBe(true);
    expect((late.institutions || []).find((/** @type {any} */ i) => i.name === 'Brewer').desc).toBe('Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. The households are stocked from here.');
  }, 240_000);

  test('HANDBACK-6 row 3 (ww-1416): the brewer sells barrels to alehouses only where one stands; where none does, to the households (r2s-monster_pressure-village-1); a village with an alehouse keeps the line (r2r-village-15)', () => {
    expectNoSeedFailures(collectSeedFailures(['r2s-monster_pressure-village-1'], (seed) => {
      const barrel = servicesOf(bornCensus(seed), 'Brewer').filter((/** @type {any} */ v) => v.name === 'Ale (barrel)').map((/** @type {any} */ v) => String(v.desc));
      expect(barrel, seed).toEqual(['Ale by the barrel, for households laying in a stock. Priced by barrel.']);
    }), 'no tavern, inn or alehouse: no barrels go to one');
    expect(servicesOf(bornCensus('r2r-village-15'), 'Brewer').find((/** @type {any} */ v) => v.name === 'Ale (barrel)').desc).toBe('Bulk supply to alehouses. Priced by barrel.');
  }, 240_000);

  test('HANDBACK-6 row 4 (CENSUS-2 a/alchemist): the village apothecary names no alchemist, for no village holds one (r2r-village-0, r2r-village-2, r2r-village-37, r2s-indebted-village-0)', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-village-0', 'r2r-village-2', 'r2r-village-37', 'r2s-indebted-village-0'], (seed) => {
      const town = bornCensus(seed);
      expect((town.institutions || []).some((/** @type {any} */ i) => /alchem/i.test(i.name)), seed).toBe(false);
      const desc = String((town.institutions || []).find((/** @type {any} */ i) => i.name === 'Apothecary').desc);
      expect(desc, seed).not.toMatch(/alchemist/i);
      expect(desc, seed).toMatch(/fever/);
    }), 'no alchemist: none is named');
  }, 240_000);

  test('the chair\'s added row for row 4 (23:48; ww-924): a house of work says its trade is the whole of the living only where nothing else is; in r2r-thorp-0, r2r-thorp-30, r2r-thorp-50, r2r-hamlet-4 and r2r-village-8 the rents carry most of the income, and no description says otherwise', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-thorp-0', 'r2r-thorp-30', 'r2r-thorp-50', 'r2r-hamlet-4', 'r2r-village-8'], (seed) => {
      const town = bornCensus(seed);
      const top = [...(town.economicState.incomeSources || [])].sort((/** @type {any} */ a, /** @type {any} */ b) => b.percentage - a.percentage)[0];
      expect(top.source, seed).toBe('Agricultural Rents');
      const said = (town.institutions || []).map((/** @type {any} */ i) => String(i.desc)).filter((/** @type {string} */ d) => /inseparable from the water|lives by the water|whole of the economy|lives on timber|what the hamlet lives on/.test(d));
      expect(said, seed).toEqual([]);
    }), 'another line carries the income: no trade is the whole of it');
  }, 240_000);
});
