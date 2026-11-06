/**
 * tests/generators/smallPlaceMarket.test.js — A MARKET IS A MARKET, AND THE CITY CUTS READ THE
 * TIER (SIZE lane, coherence program, 2026-11-03, root-cause failure 8, ruling 3).
 *
 * THE DEFECT, MEASURED BEFORE THE CURE. The roster lets a thorp, hamlet or village seat
 * Merchant Guilds only "if it has a market", and the check it uses accepts ANY Economy-shelf
 * institution. Every thorp and hamlet must have "Subsistence farming", which the catalogue
 * files on the Economy shelf, so every one of them passes. Over 60 fresh small places, 39 of
 * the 40 thorps and hamlets seated Merchant Guilds, all 39 carry "Subsistence farming", and 8
 * of them have any market at all.
 *
 * THE CURE THAT LIVES HERE: `hasMarketInstitution` — the catalogue's own tags decide (a
 * 'market' row, or a 'guild' + 'trade' house), never the shelf. The call site that seats the
 * guild (`generators/power/rulingStructure.js :: generatePowerStructure`) is engine-side and
 * not this lane's; switching it to this predicate is a REQUEST. And `isCityScale`: the two
 * fixed `population > 5000` cuts in `generatePowerDynamics` now read the TIER, so the scale
 * program's bands move them with everything else.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { POPULATION_RANGES, TIER_ORDER, TIER_STAMP_CUTS } from '../../src/data/constants.js';
import { nativeSemanticName } from '../../src/domain/content/customContentSemanticAuthority.js';
import { hasMarketInstitution, isCityScale } from '../../src/generators/economy/viability.js';

/** The roster's check as it stands today, read off rulingStructure.js for the measurement. */
const anyEconomyShelf = (insts) => insts.some((inst) =>
  nativeSemanticName(inst).toLowerCase().includes('market') || inst.category === 'Economy');

const FRESH = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const tier of ['thorp', 'hamlet']) {
    for (let i = 0; i < 6; i += 1) {
      FRESH.push(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null,
        { seed: `size-market-${tier}-${i}`, customContent: {} }));
    }
  }
}, 300_000);

describe('hasMarketInstitution — the catalogue decides, never the shelf', () => {
  it('"Subsistence farming" is not a market, nor are grazing, a cellar or a pack trader', () => {
    for (const name of ['Subsistence farming', 'Common grazing land', 'Communal root cellar', 'Pack animal trader']) {
      expect(hasMarketInstitution([{ name, category: 'Economy' }]), name).toBe(false);
    }
  });

  it('a real market or trading house is', () => {
    for (const name of ['Periodic market', 'Weekly market', 'Fish market', 'Market square', 'Merchant guilds (3-8)']) {
      expect(hasMarketInstitution([{ name: 'Subsistence farming', category: 'Economy' }, { name, category: 'Economy' }]), name)
        .toBe(true);
    }
  });

  it('an institution carrying its own tags (authored content) is read by them', () => {
    expect(hasMarketInstitution([{ name: 'The Saltmeet', category: 'Economy', tags: ['market', 'trade'] }])).toBe(true);
    expect(hasMarketInstitution([{ name: 'The Saltmeet', category: 'Economy', tags: ['agriculture'] }])).toBe(false);
  });

  it('12 of 12 fresh thorps and hamlets pass the shelf check; none passes the market check through farming alone', () => {
    expect(FRESH).toHaveLength(12);
    const throughFarming = FRESH.filter((s) => anyEconomyShelf(s.institutions || []));
    expect(throughFarming, 'the measurement: the shelf check passes every one').toHaveLength(12);
    for (const s of FRESH) {
      const names = (s.institutions || []).map((inst) => nativeSemanticName(inst));
      const marketRows = names.filter((n) => /market|guild/i.test(n));
      expect(hasMarketInstitution(s.institutions || []), `${s.tier} ${s.name}: ${marketRows.join(', ') || 'no market row'}`)
        .toBe(marketRows.some((n) => hasMarketInstitution([{ name: n }])));
      if (marketRows.length === 0) expect(hasMarketInstitution(s.institutions || [])).toBe(false);
    }
    expect(FRESH.filter((s) => !hasMarketInstitution(s.institutions || [])).length,
      'most fresh thorps and hamlets have no market at all').toBeGreaterThan(6);
  });

  it('SIZE-3: a thorp or hamlet seats its merchant guild only over a real market, never through farming', () => {
    // rulingStructure.js :: generatePowerStructure asks hasMarketInstitution, the catalogue's question, where it used
    // to ask the shelf (a name holding 'market' or any Economy row, which "Subsistence farming" always passed).
    const marketless = FRESH.filter((s) => !hasMarketInstitution(s.institutions || []));
    expect(marketless.length, 'anti-vacuity: market-less small places exist to be read').toBeGreaterThan(6);
    const seated = marketless
      .filter((s) => (s.powerStructure?.factions || [])
        .some((f) => !f.isGoverning && String(f.faction || '').startsWith('Merchant Guilds')))
      .map((s) => `${s.tier} ${s.name}`);
    expect(seated, 'market-less thorps and hamlets that seat a merchant guild').toEqual([]);
  });
});

describe('isCityScale — the city cuts read the tier', () => {
  // RE-STATED (LANDING-7 lane E): the premise was the old disjoint bands, where the tier and the old
  // `population > 5000` cut agreed at every band edge. X-46 car 1 (433289899) made the roll bands
  // overlap and put the one population -> tier law in the stamp (TIER_STAMP_CUTS.city 2,250), so the
  // edges no longer agree with any fixed cut: the town band's max 2,500 stamps city. The two arms are
  // now pinned to their own laws: with a tier, the tier decides; with none, the stamp's city cut.
  it('reads the tier at every band edge, and the stamp\'s city cut when no tier is known', () => {
    for (const tier of TIER_ORDER) {
      for (const population of [POPULATION_RANGES[tier].min, POPULATION_RANGES[tier].max]) {
        expect(isCityScale(tier, population), `${tier} ${population}`)
          .toBe(TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf('city'));
        expect(isCityScale(undefined, population), `no tier, ${population}`)
          .toBe(population >= TIER_STAMP_CUTS.city);
      }
    }
    // Anchored: the overlap edge really splits the arms (a town at its band max is city-scale only untiered).
    expect(isCityScale('town', POPULATION_RANGES.town.max)).toBe(false);
    expect(isCityScale(undefined, POPULATION_RANGES.town.max)).toBe(true);
  });

  it('reads the tier over the population, so a band move carries the cut with it', () => {
    expect(isCityScale('city', 4000)).toBe(true);
    expect(isCityScale('town', 6000)).toBe(false);
    expect(isCityScale(undefined, undefined)).toBe(false);
  });
});
