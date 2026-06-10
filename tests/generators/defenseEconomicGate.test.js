/**
 * tests/generators/defenseEconomicGate.test.js — defense scores respect the
 * actual economy.
 *
 * The user-reported bug: "even in struggling economies, the economic survival
 * for defense was still high." The economic dimension was an additive stack of
 * wealth-independent bonuses (storage months + market/hospital/route flats)
 * with econOutput weighted at only ×0.2 — a destitute crossroads town with a
 * granary+mill+market scored ~70 ("Strong economic base"). Pins:
 *   • a struggling economy gates economic survival DOWN (multiplicative);
 *   • a healthy economy (econOutput >= 50) is left alone by the gate;
 *   • famine now also degrades MONSTER defense (starving militias patrol less);
 *   • magical defense respects the crime/economy-degraded magic influence
 *     (the previously dead magInfluence parameter).
 */

import { describe, expect, test } from 'vitest';
import { generateDefenseProfile, buildThreatAssessment } from '../../src/generators/defenseGenerator.js';

function town({ priorityEconomy = 50, priorityCriminal = 20, priorityMagic = 0, stressTypes = [], magicExists = false, institutions } = {}) {
  return {
    name: 'Gatewatch',
    tier: 'town',
    population: 2400,
    config: {
      tradeRouteAccess: 'crossroads',
      monsterThreat: 'frontier',
      magicExists,
      priorityEconomy,
      priorityMilitary: 40,
      priorityCriminal,
      priorityReligion: 30,
      priorityMagic,
      stressTypes,
    },
    institutions: institutions || [
      { name: 'Granary' },
      { name: 'Grist Mill' },
      { name: 'Market Square' },
      { name: 'Town Watch' },
    ],
    economicState: {
      foodSecurity: { storageMonths: 6.25, deficitPct: 0, surplusPct: 5, importDependency: 0.2 },
    },
  };
}

describe('economic survival respects the actual economy', () => {
  test('a struggling economy no longer scores "Strong economic base" off its buildings', () => {
    const poor = generateDefenseProfile(town({ priorityEconomy: 15 }));
    expect(poor.scores.economic).toBeLessThanOrEqual(55);
    const assessment = buildThreatAssessment(poor);
    const economicLine = JSON.stringify(assessment);
    expect(economicLine).not.toMatch(/Strong economic base/);
  });

  test('a healthy economy with identical buildings scores meaningfully higher', () => {
    const poor = generateDefenseProfile(town({ priorityEconomy: 15 }));
    const rich = generateDefenseProfile(town({ priorityEconomy: 80 }));
    expect(rich.scores.economic).toBeGreaterThan(poor.scores.economic + 15);
    expect(rich.scores.economic).toBeGreaterThanOrEqual(60);
  });

  test('the gate scales monotonically with economy priority', () => {
    const scores = [10, 30, 50, 80].map(priorityEconomy =>
      generateDefenseProfile(town({ priorityEconomy })).scores.economic);
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
    }
  });
});

describe('famine degrades monster defense', () => {
  test('a starving town patrols its bandit roads less', () => {
    const fed = generateDefenseProfile(town({}));
    const starving = generateDefenseProfile(town({ stressTypes: ['famine'] }));
    expect(starving.scores.monster).toBeLessThan(fed.scores.monster);
  });
});

describe('magical defense respects degraded magic influence', () => {
  const arcaneInstitutions = [
    { name: 'Granary' },
    { name: 'Market Square' },
    { name: "Mages' Guild" },
    { name: 'Arcane Academy' },
  ];

  test('a crime-ridden destitute city fields weaker arcane defenses than a healthy one', () => {
    const healthy = generateDefenseProfile(town({
      magicExists: true, priorityMagic: 70, priorityEconomy: 70, priorityCriminal: 10,
      institutions: arcaneInstitutions,
    }));
    const rotten = generateDefenseProfile(town({
      magicExists: true, priorityMagic: 70, priorityEconomy: 10, priorityCriminal: 85,
      institutions: arcaneInstitutions,
    }));
    expect(healthy.scores.magical).toBeGreaterThan(0);
    expect(rotten.scores.magical).toBeLessThan(healthy.scores.magical);
  });
});
