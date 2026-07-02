import { describe, expect, test } from 'vitest';

import { evaluateWarLayer, SIEGE_MAX_AGE } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * Defender-attrition SPIKE (flag-gated, DEFAULT OFF). Proves: (1) with the flag off the
 * ledger is never produced and the siege verdict is unchanged (byte-identity is also
 * covered by the whole existing war/siege suite staying green); (2) with the flag on a
 * besieged town accrues an eroding per-target defender ledger; (3) that erosion feeds
 * the verdict — a matchup that HOLDS against a fresh defender FALLS once the defender is
 * worn down; (4) the ledger retires the moment the siege ends (no leak).
 *
 * This is the spike's machine-checkable evidence. It does NOT assert balance/feel — that
 * needs a multi-seed soak with the flag on (WAR_NEVER_TERMINATED / STALL_RISK clear),
 * which is the human-judged gate before this graduates.
 */
const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [], economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}
const save = (id, name, patch = {}) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });

function siegeRecord(targetId, { age, strength }) {
  return {
    targetId, sinceTick: 0, role: 'siege', maxStartStrength: strength, currentEffectiveStrength: strength,
    accumulatedAttrition: 0, reinforcementFlow: 0, deploymentAge: age, manpower: 0.6, supplyIntegrity: 0.6,
    morale: 0.6, equipmentCondition: 0.6, magicSupport: 0.6, commandQuality: 0.6, foodReserve: 0.6,
    logisticsBurden: 0.2, objective: 'conquest', returnCondition: 'pending',
  };
}

const HOSTILE_EDGE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };

function evaluate({ saves, edges, channels = [], deployments = {}, warExhaustion = {}, defenderSiegeLedger, tick, defenderAttrition = false }) {
  const relationshipStates = Object.fromEntries(edges.map(e => [e.id, { relationshipType: e.relationshipType }]));
  const rules = { warLayerEnabled: true, defenderAttritionEnabled: defenderAttrition };
  const worldState = { rngSeed: 'war-seed', tick, relationshipStates, deployments, warExhaustion, simulationRules: rules };
  const campaign = {
    id: 'siege-fixture', name: 'Siege Fixture', settlementIds: saves.map(s => s.id),
    worldState, regionalGraph: ensureRegionalGraph({ edges, channels }), wizardNews: { currentTick: tick, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return evaluateWarLayer({
    snapshot,
    worldState: { ...snapshot.worldState, defenderSiegeLedger },
    rng: createPRNG('war-seed'), tick, now: NOW, rules,
  });
}

// A bottom-of-band single siege: plausible (no withdrawal) but does not storm a FRESH
// defender — the case that reveals whether defender erosion tips the verdict.
const SIEGE = {
  saves: [save('atlas', 'Atlas', { tier: 'city', population: 22000 }),
          save('borin', 'Borin', { tier: 'city', population: 22000, legitimacy: 70 })],
  edges: [HOSTILE_EDGE],
  channels: [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }],
  warExhaustion: { atlas: 1.0 },
};
const held = (war) => !war.outcomes.some(o => o.candidateType === 'conquest') && !!war.deployments.atlas;
const fell = (war) => war.outcomes.some(o => o.candidateType === 'conquest' && o.targetSaveId === 'borin');

describe('defender-attrition spike (flag-gated)', () => {
  test('flag OFF: no defender ledger is produced', () => {
    const war = evaluate({ ...SIEGE, tick: 100, deployments: { atlas: siegeRecord('borin', { age: 5, strength: 50.9 }) }, defenderAttrition: false });
    expect(war.defenderSiegeLedger).toBeNull();
    expect(held(war)).toBe(true); // a bottom-of-band siege holds against the fresh defender
  });

  test('flag ON: the besieged town accrues an eroding ledger entry (seeded < fresh, age 1)', () => {
    const war = evaluate({ ...SIEGE, tick: 100, deployments: { atlas: siegeRecord('borin', { age: 5, strength: 50.9 }) }, defenderAttrition: true });
    const entry = war.defenderSiegeLedger?.borin;
    expect(entry).toBeTruthy();
    expect(Number.isFinite(entry.currentEffectiveStrength)).toBe(true);
    expect(entry.currentEffectiveStrength).toBeGreaterThan(0);
    expect(entry.deploymentAge).toBe(1);
  });

  test('erosion feeds the verdict: a siege that HOLDS at full defense FALLS once the defender is worn down', () => {
    const dep = { atlas: siegeRecord('borin', { age: 5, strength: 50.9 }) };
    // Same matchup, fresh defender → holds.
    expect(held(evaluate({ ...SIEGE, tick: 100, deployments: dep, defenderAttrition: true }))).toBe(true);
    // Same matchup, but a heavily pre-eroded defender ledger → the attacker now out-classes
    // the worn walls and storms them.
    const worn = { borin: { targetId: 'borin', currentEffectiveStrength: 2, deploymentAge: 40 } };
    expect(fell(evaluate({ ...SIEGE, tick: 100, deployments: dep, defenderSiegeLedger: worn, defenderAttrition: true }))).toBe(true);
  });

  test('the ledger erodes monotonically across ticks (fed back in)', () => {
    const dep = { atlas: siegeRecord('borin', { age: 5, strength: 50.9 }) };
    const t1 = evaluate({ ...SIEGE, tick: 100, deployments: dep, defenderAttrition: true });
    const s1 = t1.defenderSiegeLedger.borin.currentEffectiveStrength;
    const t2 = evaluate({ ...SIEGE, tick: 101, deployments: dep, defenderSiegeLedger: t1.defenderSiegeLedger, defenderAttrition: true });
    const s2 = t2.defenderSiegeLedger.borin.currentEffectiveStrength;
    expect(s2).toBeLessThan(s1); // the walls keep wearing down
    expect(t2.defenderSiegeLedger.borin.deploymentAge).toBe(2);
  });

  test('the ledger RETIRES when the siege ends (a lifted/relieved town heals — no leak)', () => {
    // Seed a prior ledger for a town that is NO LONGER besieged this tick (no deployment,
    // no war_front): it must be pruned so the town heals to fresh defense.
    const stale = { ghosttown: { targetId: 'ghosttown', currentEffectiveStrength: 4, deploymentAge: 30 } };
    const war = evaluate({ ...SIEGE, tick: 100, deployments: {}, channels: [], defenderSiegeLedger: stale, defenderAttrition: true });
    expect(war.defenderSiegeLedger.ghosttown).toBeUndefined();
  });
});
