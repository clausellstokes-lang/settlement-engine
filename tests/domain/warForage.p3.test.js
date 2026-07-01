import { describe, expect, test } from 'vitest';

import { evaluateWarLayer, computeSackTransfer, SIEGE_MAX_AGE } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

/**
 * Sack & forage P3 (flag-gated, default OFF): a CONQUEST carries off a fraction of the
 * conquered population as a CONSERVED transfer with a war-dead sink — some reach the
 * victor's home (spoils), the rest are killed/scattered. The deltas ride the conquest
 * outcome so a dismissed/deferred conquest withholds them atomically. Proves: (1) the pure
 * transfer never mints (captured ≤ sacked) and honours the skeleton floor; (2) flag-OFF, a
 * conquest carries NO populationDeltas (byte-identical); (3) flag-ON, a conquest carries a
 * conserved two-delta transfer (target loses, victor gains less, net loss = the war dead).
 */
const NOW = '2026-01-01T00:00:00.000Z';

describe('computeSackTransfer — the pure conserved core', () => {
  test('never mints: captured ≤ sacked, so the net movement is a loss (the war dead)', () => {
    const t = computeSackTransfer(1000);
    expect(t).toEqual({ sacked: 80, captured: 40 }); // 8% carried off, half reach the victor
    expect(t.captured).toBeLessThanOrEqual(t.sacked);
    expect(t.sacked - t.captured).toBe(40);           // the sink = war dead
  });

  test('honours the skeleton floor — a town at/under it is not sacked', () => {
    expect(computeSackTransfer(150)).toBeNull();
    expect(computeSackTransfer(100)).toBeNull();
    expect(computeSackTransfer(0)).toBeNull();
    expect(computeSackTransfer(undefined)).toBeNull();
  });

  test('clamps the take to the room above the floor (never below skeleton)', () => {
    // pop 160: 8% ≈ 13, but only 10 room above the 150 floor ⇒ take 10.
    expect(computeSackTransfer(160)).toEqual({ sacked: 10, captured: 5 });
    // pop 200: 8% = 16, room 50 ⇒ full 16.
    expect(computeSackTransfer(200)).toEqual({ sacked: 16, captured: 8 });
  });
});

// ── A dominant besieger AT the hard siege-duration ceiling ⇒ the fall is a PURE function
// of capacities (no rng to lose), so the conquest fires deterministically. This mirrors the
// proven DOMINANT fixture in siegeTermination.test.js. Borin (pop 9000) is the conquered. ──
const BORIN_POP = 9000;
function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [], economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [{ faction: 'Military Council', category: 'military', power: 78, isGoverning: true }, { faction: 'Merchant League', category: 'economy', power: 52 }],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }], activeConditions: [],
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
const HOSTILE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };

function conquer(warForage) {
  const saves = [save('atlas', 'Atlas', { tier: 'city', population: 30000 }), save('borin', 'Borin', { tier: 'town', population: BORIN_POP, legitimacy: 65 })];
  const rules = { warLayerEnabled: true, warForageEnabled: warForage };
  const worldState = {
    rngSeed: 'war-seed', tick: 700,
    relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' } },
    deployments: { atlas: siegeRecord('borin', { age: SIEGE_MAX_AGE - 1, strength: 60 }) },
    warExhaustion: { atlas: 1.0 }, simulationRules: rules,
  };
  const campaign = {
    id: 'sack-fixture', name: 'S', settlementIds: ['atlas', 'borin'], worldState,
    regionalGraph: ensureRegionalGraph({ edges: [HOSTILE], channels: [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }] }),
    wizardNews: { currentTick: 700, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  const war = evaluateWarLayer({ snapshot, worldState: snapshot.worldState, rng: createPRNG('war-seed'), tick: 700, now: NOW, rules });
  return war.outcomes.find(o => o.candidateType === 'conquest');
}

describe('sack rides the conquest outcome', () => {
  test('the fixture actually conquers (a dominant besieger storms at the ceiling)', () => {
    expect(conquer(false)).toBeTruthy();
  });

  test('flag OFF: the conquest carries NO populationDeltas (byte-identical)', () => {
    expect(conquer(false).populationDeltas).toBeUndefined();
  });

  test('flag ON: the conquest carries a CONSERVED two-delta sack (victor gains less than the town loses)', () => {
    const expected = computeSackTransfer(BORIN_POP); // ties the e2e to the pure helper, no magic numbers
    const conquest = conquer(true);
    const deltas = conquest.populationDeltas;
    expect(Array.isArray(deltas)).toBe(true);
    const lost = deltas.find(d => d.saveId === 'borin').delta;   // the conquered
    const gained = deltas.find(d => d.saveId === 'atlas').delta;  // the victor's home
    expect(lost).toBe(-expected.sacked);
    expect(gained).toBe(expected.captured);
    expect(gained).toBeLessThan(-lost);                          // never mints
    expect(-lost - gained).toBe(expected.sacked - expected.captured); // the shortfall = war dead
  });
});
