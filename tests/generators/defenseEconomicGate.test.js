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
import { deriveDefenseReadiness } from '../../src/domain/display/defenseDisplay.js';

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
      foodSecurity: { storageMonths: 6.25, deficitPct: 0, surplusPct: 5, importDependency: 0.2, resilienceScore: 70 },
    },
  };
}

// A funded defense apparatus — walls, garrison, charter hall, court — so the
// upkeep gates have a paid stack to bite into.
const FUNDED_DEFENSES = [
  { name: 'Town walls' },
  { name: 'Garrison' },
  { name: "Adventurers' charter hall" },
  { name: 'Courthouse' },
  { name: 'Town Watch' },
  { name: 'Granary' },
  { name: 'Market Square' },
];

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

describe('garrison wages, watch pay, and patrol provisioning respect the economy', () => {
  test('a struggling economy fields weaker military / internal / monster coverage than a healthy one', () => {
    const poor = generateDefenseProfile(town({ priorityEconomy: 10, institutions: FUNDED_DEFENSES }));
    const rich = generateDefenseProfile(town({ priorityEconomy: 80, institutions: FUNDED_DEFENSES }));
    expect(poor.scores.military).toBeLessThan(rich.scores.military);
    expect(poor.scores.internal).toBeLessThan(rich.scores.internal);
    expect(poor.scores.monster).toBeLessThan(rich.scores.monster);
  });

  test('every dimension scales monotonically with economy priority', () => {
    const profiles = [10, 30, 50, 80].map(priorityEconomy =>
      generateDefenseProfile(town({ priorityEconomy, institutions: FUNDED_DEFENSES })));
    for (const dim of ['military', 'internal', 'monster']) {
      for (let i = 1; i < profiles.length; i++) {
        expect(profiles[i].scores[dim]).toBeGreaterThanOrEqual(profiles[i - 1].scores[dim]);
      }
    }
  });

  test('the upkeep gates report their multipliers for attribution', () => {
    const poor = generateDefenseProfile(town({ priorityEconomy: 10, institutions: FUNDED_DEFENSES }));
    const rich = generateDefenseProfile(town({ priorityEconomy: 80, institutions: FUNDED_DEFENSES }));
    expect(poor.economicGates.military).toBeLessThan(1);
    expect(poor.economicGates.internal).toBeLessThan(1);
    expect(poor.economicGates.monster).toBeLessThan(1);
    expect(rich.economicGates.military).toBe(1);
    expect(rich.economicGates.internal).toBe(1);
    expect(rich.economicGates.monster).toBe(1);
  });

  test('gates floor, never zero: a destitute walled town keeps most of its defenses', () => {
    const destitute = generateDefenseProfile(town({ priorityEconomy: 0, institutions: FUNDED_DEFENSES }));
    const funded = generateDefenseProfile(town({ priorityEconomy: 80, institutions: FUNDED_DEFENSES }));
    // Floors are 0.6 (military) / 0.65 (internal) / 0.7 (monster); built walls
    // keep standing — scores degrade, they do not collapse.
    expect(destitute.scores.military).toBeGreaterThan(funded.scores.military * 0.4);
    expect(destitute.scores.monster).toBeGreaterThan(funded.scores.monster * 0.5);
  });

  test("a destitute thorp's unpaid community defense is not gated away", () => {
    const thorp = generateDefenseProfile({
      name: 'Mudfoot', tier: 'thorp', population: 40,
      config: {
        tradeRouteAccess: 'isolated', monsterThreat: 'frontier', magicExists: false,
        priorityEconomy: 5, priorityMilitary: 20, priorityCriminal: 5,
        priorityReligion: 20, priorityMagic: 0, stressTypes: [],
      },
      institutions: [{ name: 'Wayside shrine' }],
      economicState: { foodSecurity: { storageMonths: 1.5, deficitPct: 0, surplusPct: 0, importDependency: 0 } },
    });
    // Community self-policing and armed households are unpaid: the economy
    // gate must not strip a subsistence thorp of its baseline order.
    expect(thorp.scores.internal).toBeGreaterThanOrEqual(15);
  });

  test('gates are recorded only when they actually apply: no paid stack, no gate', () => {
    // A destitute hamlet with no paid defenses and no law infrastructure must
    // not report economicGates.military/internal — those gates never bit, so
    // attributing "garrison pay at 60%" to it would be a lie.
    const hamlet = generateDefenseProfile({
      name: 'Dripwell', tier: 'hamlet', population: 180,
      config: {
        tradeRouteAccess: 'isolated', monsterThreat: 'frontier', magicExists: false,
        priorityEconomy: 5, priorityMilitary: 20, priorityCriminal: 5,
        priorityReligion: 20, priorityMagic: 0, stressTypes: [],
      },
      institutions: [{ name: 'Wayside shrine' }],
      economicState: { foodSecurity: { storageMonths: 1.5, deficitPct: 0, surplusPct: 0, importDependency: 0 } },
    });
    expect(hamlet.economicGates.military).toBeUndefined();
    expect(hamlet.economicGates.internal).toBeUndefined();
    // monster/economic apply to every settlement and stay recorded.
    expect(hamlet.economicGates.monster).toBeLessThan(1);
    expect(hamlet.economicGates.economic).toBeLessThan(1);
  });

  test('the monster gate exempts the unpaid communal baseline and volunteer traditions', () => {
    const mk = (priorityEconomy, institutions) => generateDefenseProfile({
      name: 'Thornhollow', tier: 'village', population: 600,
      config: {
        tradeRouteAccess: 'road', monsterThreat: 'frontier', magicExists: true,
        priorityEconomy, priorityMilitary: 20, priorityCriminal: 5,
        priorityReligion: 20, priorityMagic: 30, stressTypes: [],
      },
      institutions,
      economicState: { foodSecurity: { storageMonths: 2, deficitPct: 0, surplusPct: 0, importDependency: 0 } },
    });
    // Frontier baseline (+4) and druidic wardens (+12) are unpaid — a poor
    // village with no paid monster coverage keeps exactly what a rich one
    // has, the same exemption rule the military/internal gates apply.
    expect(mk(5, [{ name: 'Druid circle' }]).scores.monster)
      .toBe(mk(80, [{ name: 'Druid circle' }]).scores.monster);
    // With a paid charter hall on retainer, the gate bites the paid share.
    expect(mk(5, [{ name: 'Druid circle' }, { name: "Adventurers' charter hall" }]).scores.monster)
      .toBeLessThan(mk(80, [{ name: 'Druid circle' }, { name: "Adventurers' charter hall" }]).scores.monster);
  });
});

describe('the gates have a consumer: readiness rows carry funding notes', () => {
  const withProfile = (opts) => {
    const settlement = town(opts);
    return { ...settlement, defenseProfile: generateDefenseProfile(settlement) };
  };

  test('an underfunded gate annotates its row; fully funded rows stay silent', () => {
    const poorRows = deriveDefenseReadiness(withProfile({ priorityEconomy: 10, institutions: FUNDED_DEFENSES }));
    expect(poorRows.find(r => r.label === 'Invasion & War').fundingNote).toMatch(/garrison pay at \d+%/);
    expect(poorRows.find(r => r.label === 'Internal Security').fundingNote).toMatch(/watch and court funding at \d+%/);
    const richRows = deriveDefenseReadiness(withProfile({ priorityEconomy: 80, institutions: FUNDED_DEFENSES }));
    expect(richRows.every(r => r.fundingNote === null)).toBe(true);
  });
});

describe('disaster & famine readiness is gated by economic capacity', () => {
  test('relief costs money: a poor town absorbs disasters worse than a rich one with the same granary', () => {
    const poor = generateDefenseProfile(town({ priorityEconomy: 10 }));
    const rich = generateDefenseProfile(town({ priorityEconomy: 80 }));
    expect(poor.scores.disaster).toBeLessThan(rich.scores.disaster);
    // Identity at healthy economies: the rich town's disaster score IS its
    // food-resilience score, untouched.
    expect(rich.scores.disaster).toBe(70);
    expect(poor.economicGates.disaster).toBeLessThan(1);
  });

  test('disaster score is absent when no food security exists (legacy saves)', () => {
    const noFood = generateDefenseProfile({ ...town({}), economicState: {} });
    expect(noFood.scores.disaster).toBeUndefined();
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
