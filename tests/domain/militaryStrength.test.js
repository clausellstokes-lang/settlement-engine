/**
 * tests/domain/militaryStrength.test.js — Phase B0 military-strength model.
 *
 * Pins:
 *   - deriveMilitaryCapacity returns the structured decomposition (facets +
 *     contributors + hooks).
 *   - The core proposal finding: a well-found CITY scores far above a bare
 *     THORPE ("a thorpe army ≠ a city army").
 *   - war_exhaustion lowers currentCapacity below theoreticalCapacity, while a
 *     no-war settlement has current === theoretical.
 *   - Per-facet sanity (manpower/institutions/materiel/logistics/economy/will).
 *   - Determinism (same input → identical output) + no input mutation.
 *   - MOUNTED NOWHERE: no pulse path imports the module (grep-proven).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import {
  deriveMilitaryCapacity,
  militaryCapacityScalar,
} from '../../src/domain/worldPulse/militaryStrength.js';

const FACET_KEYS = ['manpower', 'institutions', 'materiel', 'logistics', 'economy', 'will'];

// A well-found city: high tier + population, military institutions + walls,
// weapons exports, deep food reserves, a martial government.
const city = {
  settlement: {
    name: 'Ironhold', tier: 'city', population: 18000,
    powerStructure: { government: 'Military autocracy', publicLegitimacy: { score: 65 }, factions: [] },
    institutions: [
      { name: 'Royal Garrison' },
      { name: 'City Watch' },
      { name: 'Grand Armory' },
      { name: 'War College' },
      { name: 'Master Weaponsmiths Guild' },
    ],
    economicState: {
      prosperity: 'prosperous',
      primaryExports: [{ name: 'forged weapons' }, { name: 'plate armor' }, { name: 'siege engines' }],
      foodSecurity: { resilienceScore: 78, storageMonths: 8 },
    },
    defenseProfile: { scores: { military: 80, monster: 60, internal: 70, economic: 65, magical: 50 } },
    activeConditions: [],
  },
};

// A bare thorpe: lowest tier, tiny population, no military institutions, no
// materiel, thin food, a pacific commune government.
const thorpe = {
  settlement: {
    name: 'Mudfen', tier: 'thorp', population: 60,
    powerStructure: { government: 'Peasant commune', publicLegitimacy: { score: 50 }, factions: [] },
    institutions: [{ name: 'Common Granary' }, { name: 'Shrine' }],
    economicState: {
      prosperity: 'subsistence',
      primaryExports: [{ name: 'turnips' }],
      foodSecurity: { resilienceScore: 35, storageMonths: 1 },
    },
    defenseProfile: { scores: { military: 18, monster: 25, internal: 30, economic: 25, magical: 20 } },
    activeConditions: [],
  },
};

describe('deriveMilitaryCapacity — structured decomposition', () => {
  it('returns theoreticalCapacity, currentCapacity, facets, hooks, contributors', () => {
    const cap = deriveMilitaryCapacity(city);
    expect(typeof cap.theoreticalCapacity).toBe('number');
    expect(typeof cap.currentCapacity).toBe('number');
    expect(cap.facets).toBeTruthy();
    for (const k of FACET_KEYS) {
      expect(typeof cap.facets[k], `facet ${k}`).toBe('number');
      expect(cap.facets[k]).toBeGreaterThanOrEqual(0);
      expect(cap.facets[k]).toBeLessThanOrEqual(100);
    }
    expect(cap.hooks).toHaveProperty('warExhaustion');
    expect(cap.hooks).toHaveProperty('warDrain');
    expect(cap.hooks).toHaveProperty('armyDeployed');
    expect(Array.isArray(cap.contributors)).toBe(true);
    expect(cap.contributors.length).toBeGreaterThan(0);
    for (const c of cap.contributors) {
      expect(FACET_KEYS).toContain(c.facet);
      expect(typeof c.source).toBe('string');
      expect(typeof c.delta).toBe('number');
    }
  });

  it('a well-found city scores FAR above a bare thorpe (a thorpe army != a city army)', () => {
    const cityCap = deriveMilitaryCapacity(city).theoreticalCapacity;
    const thorpeCap = deriveMilitaryCapacity(thorpe).theoreticalCapacity;
    expect(cityCap).toBeGreaterThan(thorpeCap);
    // "far above": the gap should be wide, not marginal.
    expect(cityCap - thorpeCap).toBeGreaterThan(30);
    // Every contributing facet should favor the city or tie.
    const cf = deriveMilitaryCapacity(city).facets;
    const tf = deriveMilitaryCapacity(thorpe).facets;
    expect(cf.manpower).toBeGreaterThan(tf.manpower);
    expect(cf.institutions).toBeGreaterThan(tf.institutions);
    expect(cf.materiel).toBeGreaterThan(tf.materiel);
  });

  it('militaryCapacityScalar is theoreticalCapacity normalized to 0..1', () => {
    const cap = deriveMilitaryCapacity(city);
    expect(militaryCapacityScalar(city)).toBeCloseTo(cap.theoreticalCapacity / 100, 6);
  });
});

describe('war erosion — current vs theoretical', () => {
  it('a no-war settlement has currentCapacity === theoreticalCapacity', () => {
    const cap = deriveMilitaryCapacity(city);
    expect(cap.currentCapacity).toBe(cap.theoreticalCapacity);
  });

  it('war_exhaustion lowers currentCapacity below theoreticalCapacity', () => {
    const atWar = {
      settlement: {
        ...city.settlement,
        activeConditions: [
          { archetype: 'war_exhaustion', severity: 0.8 },
          { archetype: 'war_drain', severity: 0.6 },
        ],
      },
    };
    const cap = deriveMilitaryCapacity(atWar);
    expect(cap.currentCapacity).toBeLessThan(cap.theoreticalCapacity);
    expect(cap.hooks.warExhaustion).toBeCloseTo(0.8, 6);
    expect(cap.hooks.warDrain).toBeCloseTo(0.6, 6);
    // theoreticalCapacity is the LATENT base — it bends only via economic_capacity
    // (which war_drain legitimately erodes). Holding the economy facet constant
    // via ctx isolates the latent base, which is identical war vs no-war: the
    // erosion lives in currentCapacity, not the theoretical floor.
    const pinned = { economicCapacityScore: 70 };
    expect(deriveMilitaryCapacity(atWar, pinned).theoreticalCapacity)
      .toBe(deriveMilitaryCapacity(city, pinned).theoreticalCapacity);
  });

  it('army_deployed is exposed as a hook (B1/B2 split deployed vs home), not subtracted from theoretical', () => {
    const deployed = {
      settlement: { ...city.settlement, activeConditions: [{ archetype: 'army_deployed', severity: 0.5 }] },
    };
    const cap = deriveMilitaryCapacity(deployed);
    expect(cap.hooks.armyDeployed).toBeCloseTo(0.5, 6);
    expect(cap.theoreticalCapacity).toBe(deriveMilitaryCapacity(city).theoreticalCapacity);
  });
});

describe('robustness + purity', () => {
  it('accepts a bare settlement as well as an item wrapper', () => {
    const fromItem = deriveMilitaryCapacity(city).theoreticalCapacity;
    const fromBare = deriveMilitaryCapacity(city.settlement).theoreticalCapacity;
    expect(fromBare).toBe(fromItem);
  });

  it('returns a neutral floor envelope for a missing settlement', () => {
    const cap = deriveMilitaryCapacity(null);
    expect(cap.theoreticalCapacity).toBe(0);
    expect(cap.currentCapacity).toBe(0);
  });

  it('is deterministic and does not mutate its input', () => {
    const before = JSON.stringify(city);
    const a = deriveMilitaryCapacity(city);
    const b = deriveMilitaryCapacity(city);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(city)).toBe(before);
  });

  it('uses ctx.economicCapacityScore when provided (hot-path seam)', () => {
    const high = deriveMilitaryCapacity(city, { economicCapacityScore: 100 });
    const low = deriveMilitaryCapacity(city, { economicCapacityScore: 0 });
    expect(high.facets.economy).toBe(100);
    expect(low.facets.economy).toBe(0);
    expect(high.theoreticalCapacity).toBeGreaterThan(low.theoreticalCapacity);
  });
});

describe('mounted-everywhere-it-should-be guarantee', () => {
  // B0 shipped militaryStrength MOUNTED NOWHERE (the model could not change any
  // behaviour). B1/B2/B4 then wired it INTO the live pulse (the deployment-strength
  // envelope, occupation usefulness, trade salience), and F1 surfaces it through a
  // player-safe display read-model (army strength). So the importer set is now a
  // KNOWN ALLOWLIST — the model + its test + those deliberate consumers — and any
  // OTHER importer (an accidental hot-path coupling) is the failure.
  it('only the known B1/B2/B4 engine consumers + the F1 display read-model import the model', () => {
    // Match the IMPORT path (…/militaryStrength.js), not the bare word — the
    // generators carry an unrelated local `militaryStrength` variable.
    const hits = execSync(
      "grep -rln \"/militaryStrength.js\" src tests || true",
      { cwd: process.cwd(), encoding: 'utf8' },
    ).trim().split('\n').filter(Boolean).map(p => p.replace(/\/{2,}/g, '/'));
    const ALLOWED = new Set([
      'src/domain/worldPulse/militaryStrength.js',       // the model
      'tests/domain/militaryStrength.test.js',           // its own test
      'src/domain/worldPulse/warDeployment.js',          // B1/B2 — deployment strength envelope
      'src/domain/worldPulse/occupation.js',             // B3 — occupied-settlement usefulness
      'src/domain/worldPulse/tradeSalience.js',          // B4 — materiel-gap salience
      'src/domain/worldPulse/religiousContest.js',       // religion rework — occupation→conversion force-scaling (occupying-force size)
      'src/domain/display/armyStrength.js',              // F1 — player-safe army-strength read-model
      'src/domain/display/warResolve.js',                // P5 — War & Resolve display read-model (needs the raw facets for the exact will/hope the siege uses)
    ]);
    const offenders = hits.filter(p => !ALLOWED.has(p));
    expect(offenders, `unexpected importers: ${offenders.join(', ')}`).toEqual([]);
  });

  it('the model itself imports no React/Zustand/store', () => {
    const src = readFileSync('src/domain/worldPulse/militaryStrength.js', 'utf8');
    expect(/from ['"]react['"]/.test(src)).toBe(false);
    expect(/zustand|\/store\//.test(src)).toBe(false);
  });
});
