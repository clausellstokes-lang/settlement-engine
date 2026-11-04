/**
 * tests/domain/facts/market.test.js — CENSUS-1 wave 0, fact 5: THE MARKET HOME.
 *
 * RED-FIRST. The market had five readers: the SIZE lane's catalogue-tag rule (raw roster), the
 * arrival scene's name regex (kept: chair ruling T1-12 pins it to DS-GEN-13's), and three substring flags (foodGenerator, stressGenerator,
 * priorityHelpers) under which "Black market" and "Caravan masters' exchange" were markets. The
 * arms below were red at the window tip through the public names alone.
 *
 * @enforced-by npx vitest run tests/domain/facts/market.test.js
 */
import { describe, expect, it } from 'vitest';
import { getInstFlags } from '../../../src/generators/helpers.js';
import { hasMarketInstitution } from '../../../src/generators/economy/viability.js';

const roster = (...names) => names.map((name) => ({ name, category: 'Economy' }));

describe('the market home (CENSUS-1 fact 5)', () => {
  it('RED-FIRST: a black market and a caravan exchange are not markets', () => {
    expect(getInstFlags({}, roster('Black market', "Caravan masters' exchange")).inst.hasMarket).toBe(false);
  });

  it('RED-FIRST: a ruined market holds no market', () => {
    const ruined = [{ name: 'Periodic market', category: 'Economy', status: 'ruined' }];
    expect(hasMarketInstitution(ruined)).toBe(false);
    expect(hasMarketInstitution(roster('Periodic market'))).toBe(true);
  });

  it('every reader answers the same, through the one rule', async () => {
    const { marketOf } = await import('../../../src/domain/facts/market.js');
    for (const names of [['Weekly market'], ['Market square'], ['Merchant guild'], ['Black market'], ['Subsistence farming'], []]) {
      const r = roster(...names);
      const home = marketOf({ institutions: r });
      expect([hasMarketInstitution(r), getInstFlags({}, r).inst.hasMarket]).toEqual([home, home]);
    }
  });
});
