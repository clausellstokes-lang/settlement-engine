import { describe, expect, test } from 'vitest';

import { evaluateWarLayer, SIEGE_MAX_AGE } from '../../src/domain/worldPulse/warDeployment.js';
import { verdictAllowsHarassment } from '../../src/domain/worldPulse/feasibilityGate.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Siege termination — two LOW-severity correctness gates in the war layer.
//
//  1. HARD SIEGE-DURATION CEILING. A `plausible` siege whose roll never lands a
//     fall and whose attacker exhaustion has saturated (so nothing else pushes it
//     out of the plausible band) used to grind INDEFINITELY: withdrawal only fired
//     when the verdict forbade a siege roll, the offensive cap ceilinged, and the
//     scar saturated — with no hard turn limit. The fix adds a deterministic
//     duration ceiling (SIEGE_MAX_AGE) after which the siege auto-resolves (lift or
//     fall) as a PURE function of the contested capacities (no rng).
//
//  2. SOLO require_coalition ↔ harassment consistency. The documented behavior
//     (verdictAllowsHarassment) is that a SOLO require_coalition verdict surfaces as
//     harassment pressure (the attacker shows up but cannot commit to a full siege).
//     The code disagreed — it only harassed on the `harassment` verdict — so a solo
//     require_coalition besieger emitted nothing. The fix aligns code to the doc.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
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

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function evaluate({ saves, edges, channels = [], deployments = {}, warExhaustion = {}, tick }) {
  const relationshipStates = Object.fromEntries(
    edges.map(e => [e.id, { relationshipType: e.relationshipType }]),
  );
  const worldState = {
    rngSeed: 'war-seed',
    tick,
    relationshipStates,
    deployments,
    warExhaustion,
    simulationRules: { warLayerEnabled: true },
  };
  const campaign = {
    id: 'siege-fixture',
    name: 'Siege Fixture',
    settlementIds: saves.map(s => s.id),
    worldState,
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: tick, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return evaluateWarLayer({
    snapshot,
    worldState: snapshot.worldState,
    rng: createPRNG('war-seed'),
    tick,
    now: NOW,
    rules: { warLayerEnabled: true },
  });
}

// A STATEFUL siege record pinned to a chosen effective strength + age. Seeding the
// strength + warExhaustion directly is what reproduces the unbounded corner: the
// scar ledger is saturated (cannot ratchet further) while the army's effective
// strength stays inside the plausible band, so the natural exhaustion/withdrawal arc
// never fires — only the hard ceiling can end it.
function siegeRecord(targetId, { age, strength }) {
  return {
    targetId,
    sinceTick: 0,
    role: 'siege',
    maxStartStrength: strength,
    currentEffectiveStrength: strength,
    accumulatedAttrition: 0,
    reinforcementFlow: 0,
    deploymentAge: age,
    manpower: 0.6,
    supplyIntegrity: 0.6,
    morale: 0.6,
    equipmentCondition: 0.6,
    magicSupport: 0.6,
    commandQuality: 0.6,
    foodReserve: 0.6,
    logisticsBurden: 0.2,
    objective: 'conquest',
    returnCondition: 'pending',
  };
}

const HOSTILE_EDGE = { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' };

function resolution(war) {
  return {
    conquest: !!war.outcomes.find(o => o.candidateType === 'conquest'),
    withdrawal: war.resolvedDeployments.some(r => r.outcome === 'withdrawal'),
    stillDeployed: !!war.deployments.atlas,
  };
}

describe('war layer — hard siege-duration ceiling (a saturated stalemate terminates)', () => {
  // A near-even single siege: the attacker sits at the BOTTOM of the plausible band
  // (pFall ≈ 0, so the roll never lands a fall), and we seed the war-exhaustion scar
  // saturated at 1.0. Pre-fix this grinds forever; post-fix it auto-resolves once the
  // deploymentAge crosses SIEGE_MAX_AGE.
  const STALEMATE = {
    saves: [save('atlas', 'Atlas', { tier: 'city', population: 22000 }),
            save('borin', 'Borin', { tier: 'city', population: 22000, legitimacy: 70 })],
    edges: [HOSTILE_EDGE],
    channels: [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }],
    warExhaustion: { atlas: 1.0 },
  };
  // Bottom-of-band attacker strength: plausible (no withdrawal) but pFall ≈ 0 (no fall).
  const STALEMATE_STRENGTH = 50.9;

  test('one tick BELOW the ceiling, the saturated plausible siege HOLDS (grinds, does not resolve)', () => {
    // deploymentAge is incremented once at step 0, so seeding (SIEGE_MAX_AGE - 2)
    // leaves the verdict reading (SIEGE_MAX_AGE - 1) — still under the ceiling.
    const war = evaluate({
      ...STALEMATE,
      tick: 500,
      deployments: { atlas: siegeRecord('borin', { age: SIEGE_MAX_AGE - 2, strength: STALEMATE_STRENGTH }) },
    });
    // The unbounded behavior: no fall, no feasibility-withdrawal — the army keeps grinding.
    expect(resolution(war)).toEqual({ conquest: false, withdrawal: false, stillDeployed: true });
  });

  test('AT the ceiling the siege auto-resolves deterministically rather than running unbounded', () => {
    // Seeding (SIEGE_MAX_AGE - 1) → step 0 ages it to SIEGE_MAX_AGE → the ceiling fires.
    const war = evaluate({
      ...STALEMATE,
      tick: 500,
      deployments: { atlas: siegeRecord('borin', { age: SIEGE_MAX_AGE - 1, strength: STALEMATE_STRENGTH }) },
    });
    const res = resolution(war);
    // The siege MUST terminate this tick (no longer grinding).
    expect(res.stillDeployed).toBe(false);
    // The attacker did NOT out-class the defender (50.9 < the home-ground-favoured
    // defender), so the ceiling resolves it as a LIFT (withdrawal), not a storm.
    expect(res).toEqual({ conquest: false, withdrawal: true, stillDeployed: false });
    // The withdrawal explicitly attributes the resolution to the hard ceiling.
    const abandoned = war.outcomes.find(o => /siege_abandoned/.test(o.id));
    expect(abandoned).toBeTruthy();
    expect(abandoned.reasons.some(r => /hard \d+-tick ceiling/.test(r))).toBe(true);
  });

  test('a NUMERIC-targetId record still withdraws at the ceiling (the String-coercion contract)', () => {
    // A deployment record's targetId is any-typed; every other targetId compare in the
    // siege loop String-coerces. A strict === in the withdrawal filter left a numeric-id
    // record unable to ever withdraw — a stuck phantom army on a lifted siege.
    const war = evaluate({
      saves: [save('atlas', 'Atlas', { tier: 'city', population: 22000 }),
              save('77', 'Borin', { tier: 'city', population: 22000, legitimacy: 70 })],
      edges: [{ id: 'edge.atlas.77', from: 'atlas', to: '77', relationshipType: 'hostile' }],
      channels: [{ type: 'war_front', from: 'atlas', to: '77', status: 'confirmed' }],
      warExhaustion: { atlas: 1.0 },
      tick: 500,
      deployments: { atlas: siegeRecord(77, { age: SIEGE_MAX_AGE - 1, strength: STALEMATE_STRENGTH }) },
    });
    expect(resolution(war)).toEqual({ conquest: false, withdrawal: true, stillDeployed: false });
  });

  // A strong attacker (city) pinned ABOVE a weaker, home-defended defender (town): at
  // the ceiling the direction is a pure function of capacities → it FALLS (conquest).
  // The seed strength is above the home ceiling, so it caps to the attacker's live
  // offensive capacity — still comfortably above the defender's home-defense.
  const DOMINANT = {
    saves: [save('atlas', 'Atlas', { tier: 'city', population: 30000 }),
            save('borin', 'Borin', { tier: 'town', population: 9000, legitimacy: 65 })],
    edges: [HOSTILE_EDGE],
    channels: [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }],
    warExhaustion: { atlas: 1.0 },
  };
  const DOMINANT_STRENGTH = 60;

  test('AT the ceiling a still-dominant besieger STORMS the walls (a deterministic fall, not a lift)', () => {
    const war = evaluate({
      ...DOMINANT,
      tick: 700,
      deployments: { atlas: siegeRecord('borin', { age: SIEGE_MAX_AGE - 1, strength: DOMINANT_STRENGTH }) },
    });
    const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    expect(conquest.targetSaveId).toBe('borin');
    expect(conquest.powerTransfer.toPowerName).toBe('Atlas occupation authority');
    expect(war.deployments.atlas).toBeUndefined();
  });

  test('the ceiling resolution is DETERMINISTIC under save-order reversal', () => {
    const args = {
      ...DOMINANT,
      tick: 700,
      deployments: { atlas: siegeRecord('borin', { age: SIEGE_MAX_AGE - 1, strength: DOMINANT_STRENGTH }) },
    };
    const forward = evaluate({ ...args, saves: DOMINANT.saves });
    const reversed = evaluate({ ...args, saves: [...DOMINANT.saves].reverse() });
    const summary = war => ({
      conquest: war.outcomes.find(o => o.candidateType === 'conquest')?.powerTransfer?.toPowerName || null,
      target: war.outcomes.find(o => o.candidateType === 'conquest')?.targetSaveId || null,
      deployments: war.deployments,
    });
    expect(summary(reversed)).toEqual(summary(forward));
  });
});

describe('war layer — solo require_coalition surfaces as harassment (doc/code consistency)', () => {
  test('verdictAllowsHarassment treats a solo require_coalition as harassment (documented behavior)', () => {
    // The unit contract: require_coalition (only ever emitted for a solo attacker)
    // surfaces as harassment pressure, alongside the harassment verdict itself.
    expect(verdictAllowsHarassment('require_coalition')).toBe(true);
    expect(verdictAllowsHarassment('harassment')).toBe(true);
    // The siege-permitting verdicts still do NOT harass.
    expect(verdictAllowsHarassment('plausible')).toBe(false);
    expect(verdictAllowsHarassment('auto_fail')).toBe(false);
  });

  test('a solo require_coalition besieger (no committed army) emits a war_pressure harassment outcome', () => {
    // A weak raider with a lingering confirmed war_front into a strong citadel, but NO
    // committed deployment: a solo require_coalition matchup. Per the documented
    // behavior it harasses (a low-severity war_pressure on the target), instead of
    // silently emitting nothing.
    const saves = [save('raider', 'Raider', { tier: 'village', population: 1500 }),
                   save('citadel', 'Citadel', { tier: 'city', population: 20000, legitimacy: 75 })];
    const war = evaluate({
      saves,
      edges: [{ id: 'edge.raider.citadel', from: 'raider', to: 'citadel', relationshipType: 'hostile' }],
      channels: [{ type: 'war_front', from: 'raider', to: 'citadel', status: 'confirmed' }],
      tick: 5,
    });
    const harass = war.outcomes.find(o => o.candidateType === 'war_pressure' && /harassment/.test(o.id));
    expect(harass).toBeTruthy();
    expect(harass.targetSaveId).toBe('citadel');
    // It is harassment, NOT a siege fall / power transfer.
    expect(war.outcomes.some(o => o.candidateType === 'conquest')).toBe(false);
  });
});
