import { describe, expect, test } from 'vitest';

import {
  latentStrength,
  attritionPhrase,
  deployedArmyStatus,
  deployedArmyStandings,
  hasDeployedArmy,
} from '../../../src/domain/display/armyStrength.js';
import {
  pairTradePressure,
  settlementTradePressure,
  hasTradePressure,
} from '../../../src/domain/display/tradePressure.js';
import { runVisibilityAudit } from '../../../src/domain/display/visibilityAudit.js';
import { ensureRegionalGraph } from '../../../src/domain/region/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// W4h — the three ported domain-display read-models (armyStrength / tradePressure
// / visibilityAudit). Each must return the correct OFF-STATE (empty / dormant)
// for a settlement with no army / no trade / no live world, and a REAL value when
// present. Heuristic DM language only — NO internals (no capacity number, no
// attrition fraction, no salience float) may leak. PLAYER-SAFE by default.
// ─────────────────────────────────────────────────────────────────────────────

describe('armyStrength — off-state + real value', () => {
  test('no deployments ⇒ empty / dormant off-state', () => {
    expect(deployedArmyStandings({ worldState: {} })).toEqual([]);
    expect(hasDeployedArmy({ worldState: {} })).toBe(false);
    expect(deployedArmyStatus({ settlementId: 'a', worldState: {} })).toBeNull();
    // latentStrength is total (a settlement always has some levy) — always a word
    // phrase, never a capacity number.
    expect(latentStrength({ tier: 'thorpe', population: 80, institutions: [] }).phrase).not.toMatch(/\d/);
  });

  test('a live deployment ⇒ a worn-army reading in words', () => {
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
    expect(hasDeployedArmy({ worldState })).toBe(true);
    expect(deployedArmyStandings({ worldState }).map(s => s.homeId)).toEqual(['a']);
    // Attrition fractions bucket into words, never a number.
    expect(attritionPhrase(1)).toMatch(/full strength/i);
    expect(attritionPhrase(1)).not.toMatch(/\d/);
    // A settlement with no deployment of its own still surfaces nothing.
    expect(deployedArmyStatus({ settlementId: 'z', worldState })).toBeNull();
  });
});

describe('tradePressure — off-state + real value (player-safe)', () => {
  const save = (id, name, patch = {}) => ({
    id,
    settlement: {
      id, name, tier: 'town', population: 4000,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: {
        prosperity: 'Prosperous',
        primaryExports: patch.exports || [],
        primaryImports: patch.imports || [],
        ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      },
      activeConditions: [],
    },
  });
  const tradeChannel = (from, to, strength = 0.8, goodId = 'grain', goodLabel = 'Grain') =>
    ({ type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: goodId, label: goodLabel }] });

  test('no graph / no tie ⇒ empty off-state', () => {
    expect(settlementTradePressure({ settlementId: 'x', regionalGraph: null, settlements: [], worldState: {} })).toEqual([]);
    expect(hasTradePressure({ settlementId: 'x', regionalGraph: null, settlements: [], worldState: {} })).toBe(false);
    expect(pairTradePressure({ aId: null, bId: null })).toBeNull();
  });

  test('a valuable grain tie ⇒ a real pressure reading in words', () => {
    const settlements = [
      save('hungry', 'Hungerton', { imports: ['Grain'], foodSecurity: { resilienceScore: 8, storageMonths: 0 } }),
      save('farm', 'Farmstead', { exports: ['Grain'] }),
    ];
    const regionalGraph = ensureRegionalGraph({
      edges: [{ id: 'e1', from: 'farm', to: 'hungry', relationshipType: 'trade_partner' }],
      channels: [tradeChannel('farm', 'hungry')],
    });
    const worldState = { tick: 5 };
    const pressure = pairTradePressure({
      aId: 'hungry', bId: 'farm', regionalGraph, settlements, worldState, tick: 5, nameFor: (id) => id,
    });
    expect(pressure).not.toBeNull();
    expect(pressure.restrains).toBe(true);
    expect(pressure.phrase).not.toMatch(/\d/);
    const ties = settlementTradePressure({
      settlementId: 'hungry', regionalGraph, settlements, worldState, tick: 5, nameFor: (id) => id,
    });
    expect(ties.length).toBeGreaterThan(0);
    expect(ties.every(t => t.covert !== true)).toBe(true);
    expect(hasTradePressure({ settlementId: 'hungry', regionalGraph, settlements, worldState, tick: 5 })).toBe(true);
  });

  test('a covert smuggling tie between battlefield enemies is hidden from a player view', () => {
    const settlements = [
      save('warhawk', 'Warhawk', { imports: ['Iron'] }),
      save('forge', 'Forgeholt', { exports: ['Iron'] }),
    ];
    const regionalGraph = ensureRegionalGraph({
      edges: [{ id: 'eh', from: 'forge', to: 'warhawk', relationshipType: 'hostile' }],
      channels: [tradeChannel('forge', 'warhawk', 0.8, 'iron', 'Iron')],
    });
    const worldState = { tick: 5, relationshipStates: { eh: { relationshipType: 'hostile' } } };
    const playerTies = settlementTradePressure({
      settlementId: 'warhawk', regionalGraph, settlements, worldState, tick: 5, includeCovert: false, nameFor: (id) => id,
    });
    expect(playerTies.every(t => t.covert !== true)).toBe(true);
    expect(playerTies.some(t => /smuggl/i.test(t.phrase))).toBe(false);
  });
});

describe('visibilityAudit — player-safe property holds', () => {
  test('runVisibilityAudit passes: no covert / GM state leaks to a player view', () => {
    const result = runVisibilityAudit();
    expect(result.ok).toBe(true);
    expect(result.checks.length).toBeGreaterThan(0);
    expect(result.checks.every(c => c.pass)).toBe(true);
  });
});
