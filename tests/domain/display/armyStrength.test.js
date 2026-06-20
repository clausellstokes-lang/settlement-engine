import { describe, expect, test } from 'vitest';

import {
  latentStrength,
  attritionPhrase,
  deployedArmyStatus,
  deployedArmyStandings,
  hasDeployedArmy,
} from '../../../src/domain/display/armyStrength.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B0/B2 — army strength + attrition, in DM heuristic language. NO internals
// (no capacity number, no attrition fraction, no facet score). Self-gating: a
// settlement with no live deployment surfaces nothing.
// ─────────────────────────────────────────────────────────────────────────────

const city = {
  config: { tier: 'city' },
  tier: 'city',
  population: 18000,
  institutions: [{ name: 'Garrison' }, { name: 'Armory' }],
};

describe('armyStrength — latent strength (heuristic, no numbers)', () => {
  test('a city fields a stronger host phrase than a thorpe', () => {
    const thorpe = { config: { tier: 'thorpe' }, tier: 'thorpe', population: 80, institutions: [] };
    const cityPhrase = latentStrength(city).phrase;
    const thorpePhrase = latentStrength(thorpe).phrase;
    expect(cityPhrase).not.toEqual(thorpePhrase);
    // No capacity number leaks into the phrase.
    expect(cityPhrase).not.toMatch(/\d/);
    expect(thorpePhrase).not.toMatch(/\d/);
  });
});

describe('armyStrength — deployed army attrition (heuristic)', () => {
  test('attritionPhrase buckets remaining fraction into words, no fraction', () => {
    expect(attritionPhrase(1)).toMatch(/full strength/i);
    expect(attritionPhrase(0.3)).toMatch(/gutted|fraction/i);
    expect(attritionPhrase(0.05)).toMatch(/broken|remnant/i);
    expect(attritionPhrase(0.3)).not.toMatch(/\d/);
  });

  test('deployedArmyStatus surfaces a worn army in words, self-gates when absent', () => {
    const worldState = {
      deployments: {
        a: { targetId: 'b', maxStartStrength: 100, currentEffectiveStrength: 42, supplyIntegrity: 0.3, morale: 0.4, foodReserve: 0.3 },
      },
    };
    const status = deployedArmyStatus({ settlementId: 'a', worldState, nameFor: (id) => `Town-${id}` });
    expect(status).not.toBeNull();
    expect(status.targetName).toBe('Town-b');
    expect(status.weakened).toBe(true);
    expect(status.remainingPhrase).not.toMatch(/\d/);
    expect(status.conditionPhrase).not.toMatch(/\d/);
    // A settlement with no deployment surfaces nothing.
    expect(deployedArmyStatus({ settlementId: 'z', worldState })).toBeNull();
  });

  test('a light (pre-B2) record with no strength fields reads as full strength, never throws', () => {
    const worldState = { deployments: { a: { targetId: 'b', sinceTick: 0, role: 'siege' } } };
    const status = deployedArmyStatus({ settlementId: 'a', worldState });
    expect(status).not.toBeNull();
    expect(status.weakened).toBe(false);
    expect(status.remainingPhrase).toMatch(/full strength/i);
  });

  test('standings are codepoint-sorted; inert when absent', () => {
    const worldState = {
      deployments: {
        z: { targetId: 'x', maxStartStrength: 50, currentEffectiveStrength: 50 },
        a: { targetId: 'y', maxStartStrength: 50, currentEffectiveStrength: 10 },
      },
    };
    expect(deployedArmyStandings({ worldState }).map(s => s.homeId)).toEqual(['a', 'z']);
    expect(hasDeployedArmy({ worldState })).toBe(true);
    expect(deployedArmyStandings({ worldState: {} })).toEqual([]);
    expect(hasDeployedArmy({ worldState: {} })).toBe(false);
  });
});
