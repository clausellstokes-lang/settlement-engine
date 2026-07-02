/**
 * tests/generators/economicUpgradeChainAndStage5.test.js — two golden-shifting
 * economy fixes:
 *
 *  1. getUpgradeChain selects import pools by tier-CONNECTIVITY (isFromHigher:
 *     the settlement is connected to a higher-tier trading partner), not by
 *     comparing the trade ROUTE against tier names. The old
 *     `route === 'city' || route === 'metropolis'` guard could never match a
 *     route value (road/river/crossroads/port/isolated), so the
 *     fromCityOrMetropolis/fromMetropolis pools were unreachable and
 *     fromHinterland always shadowed them for town/city.
 *
 *  2. Stage 5's military-services and slave-trade exports (and the paired
 *     enslaved-labour import) survive the Stage 7 chain override, which
 *     rebuilds the re/q trade lists from the chain pipeline and used to
 *     unconditionally discard them (re.length = 0 / q.length = 0).
 */
import { afterEach, describe, expect, it } from 'vitest';
import { generateEconomicState, getUpgradeChain } from '../../src/generators/economicGenerator.js';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';

afterEach(() => clearActiveRng());

describe('getUpgradeChain — tier-connectivity pool selection', () => {
  it('a town connected to a higher-tier partner draws the fromCityOrMetropolis pool', () => {
    const imports = getUpgradeChain('town', 'crossroads', true);
    expect(imports).toContain('Luxury textiles');
    expect(imports).toContain('Spices and exotic dyes');
    expect(imports).toContain('Rare materials');
    // Services are never physical imports
    expect(imports).not.toContain('Banking services');
    // The hinterland pool no longer shadows the higher-tier one
    expect(imports).not.toContain('Food surplus');
  });

  it('a town without a higher-tier connection keeps the hinterland pool', () => {
    const imports = getUpgradeChain('town', 'road', false);
    expect(imports).toEqual(['Food surplus', 'Raw wool and hides', 'Timber']);
  });

  it('a city connected to a metropolis draws the fromMetropolis pool', () => {
    const imports = getUpgradeChain('city', 'port', true);
    // International banking / political legitimacy are services and filtered
    expect(imports).toEqual(['Highest luxury goods']);
  });

  it('a city without a higher-tier connection keeps the hinterland pool', () => {
    const imports = getUpgradeChain('city', 'river', false);
    expect(imports).toEqual(['Bulk food', 'Raw materials', 'Basic goods for resale']);
  });

  it('a connected village draws fromHigher; an unconnected one keeps basic', () => {
    expect(getUpgradeChain('village', 'crossroads', true)).toEqual(['Manufactured goods']);
    expect(getUpgradeChain('village', 'road', false)).toEqual([
      'Metal goods',
      'Quality cloth and clothing',
      'Salt for preservation',
      'Specialized tools',
    ]);
  });

  it('a metropolis has no higher-tier pool — basic either way', () => {
    expect(getUpgradeChain('metropolis', 'crossroads', true)).toEqual(
      getUpgradeChain('metropolis', 'road', false)
    );
  });

  it('isolated settlements import nothing', () => {
    expect(getUpgradeChain('town', 'isolated', true)).toEqual([]);
  });
});

describe('call-site connectivity — a crossroads town surfaces higher-tier transit goods', () => {
  it('entrepôt transit list carries the fromCityOrMetropolis goods, not hinterland bulk', () => {
    setActiveRng({ random: () => 0.99 });
    const state = generateEconomicState(
      'town',
      [{ name: 'District market' }],
      'crossroads',
      {},
      { tradeRouteAccess: 'crossroads', priorityEconomy: 60 }
    );
    expect(state.isEntrepot).toBe(true);
    expect(state.transit).toContain('Luxury textiles');
    expect(state.transit).not.toContain('Food surplus');
  });
});

describe('Stage 5 exports survive the Stage 7 chain override', () => {
  const SLAVE_EXPORT = /^(slave trade|slave labour|captive trade)/i;
  const MILITARY_EXPORT = /^(military services|mercenary services):/i;
  const CITY_INSTS = [
    { name: 'City garrison' },
    { name: 'Mercenary company' },
    { name: 'Grand market' },
  ];
  const CITY_CONFIG = {
    tradeRouteAccess: 'road',
    priorityMilitary: 90,
    priorityEconomy: 90,
    priorityCriminal: 70,
  };

  it('the slave-trade export and paired enslaved-labour import are preserved when the draw fires', () => {
    setActiveRng({ random: () => 0 }); // forces the chance-gated slave-trade draw
    const state = generateEconomicState('city', CITY_INSTS, 'road', {}, CITY_CONFIG);
    expect(state.primaryExports.some((e) => SLAVE_EXPORT.test(e))).toBe(true);
    expect(
      state.primaryImports.some((i) => i.toLowerCase().startsWith('enslaved labour'))
    ).toBe(true);
  });

  it('the military-services export is preserved when no chain/service entry covers it', () => {
    setActiveRng({ random: () => 0 });
    const state = generateEconomicState('city', CITY_INSTS, 'road', {}, CITY_CONFIG);
    // Stage 5 pushes it only when nothing military-flavoured is already in the
    // list, and the re-seat applies the same guard — so exactly one
    // military/mercenary entry must survive to the final export list.
    const militaryEntries = state.primaryExports.filter((e) =>
      /military|mercenary/i.test(e)
    );
    expect(militaryEntries.length).toBe(1);
  });

  it('preservation does not invent entries when the draw does not fire', () => {
    setActiveRng({ random: () => 0.99 }); // draw fails: 0.99 >= capped 0.55 odds
    const state = generateEconomicState('city', CITY_INSTS, 'road', {}, CITY_CONFIG);
    expect(state.primaryExports.some((e) => SLAVE_EXPORT.test(e))).toBe(false);
    expect(state.primaryImports.some((i) => i.toLowerCase().includes('enslaved'))).toBe(false);
  });

  it('military-services export also survives without the slave-trade path (metropolis mercenaries)', () => {
    setActiveRng({ random: () => 0.99 }); // slave draw fails; military push is not chance-gated
    const state = generateEconomicState('city', CITY_INSTS, 'road', {}, CITY_CONFIG);
    expect(state.primaryExports.some((e) => MILITARY_EXPORT.test(e))).toBe(true);
  });
});
