/**
 * secondWaveStressFoodProsperity.test.js — [generators-domain-1] (Track-G2).
 *
 * The five second-wave stress types (insurgency, mass_migration, wartime,
 * religious_conversion, slave_revolt) were registered and wired into the NPC /
 * history / vignette tables, but their NUMERIC economic couplings were partial:
 * food production ignored all five, and slave_revolt had no prosperity-index row.
 * (Defense is NOT touched here — it already couples to all five via the
 * priorityHelpers effective-score multipliers; an inline penalty would double-count.)
 *
 * These are BEHAVIORAL pins: they prove the added couplings actually move the
 * numbers, not merely that the source strings are present (the source-scan
 * companion lives in tests/data/stressTypeRegistration.test.js). Golden-shifting.
 */
import { describe, it, expect } from 'vitest';
import { generateFoodSecurity } from '../../src/generators/foodGenerator.js';
import { deriveProsperityLabel } from '../../src/generators/economy/prosperity.js';

describe('[generators-domain-1] second-wave stress types couple to food production + prosperity', () => {
  const institutions = [{ name: 'Subsistence farming' }, { name: 'Town granary' }];
  const cfg = (stress) => ({
    tier: 'town', terrainType: 'plains', tradeRouteAccess: 'road',
    nearbyResources: ['grain_fields'], _population: 3000,
    ...(stress ? { stressTypes: [stress] } : {}),
  });
  const food = (stress) => generateFoodSecurity('town', institutions, cfg(stress));

  it('wartime cuts food production (conscription thins the agricultural workforce)', () => {
    expect(food('wartime').dailyProduction).toBeLessThan(food(null).dailyProduction);
  });

  it('slave_revolt cuts food production (labour-dependent production disrupted)', () => {
    expect(food('slave_revolt').dailyProduction).toBeLessThan(food(null).dailyProduction);
  });

  it('mass_migration raises food NEED (an influx of newcomers stresses the balance)', () => {
    expect(food('mass_migration').dailyNeed).toBeGreaterThan(food(null).dailyNeed);
  });

  const LABELS = ['Struggling', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
  it('slave_revolt lowers the prosperity label vs an identical stress-free settlement', () => {
    const base   = deriveProsperityLabel('Wealthy', { tier: 'town', tradeRouteAccess: 'road' });
    const revolt = deriveProsperityLabel('Wealthy', { tier: 'town', tradeRouteAccess: 'road', stressTypes: ['slave_revolt'] });
    expect(LABELS.indexOf(revolt)).toBeLessThan(LABELS.indexOf(base));
  });
});
