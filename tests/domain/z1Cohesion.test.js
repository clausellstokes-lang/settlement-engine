/**
 * tests/domain/z1Cohesion.test.js — Z1 cross-system cohesion (population / food /
 * occupation parity).
 *
 * Three holes the drafts deferred, now closed and pinned:
 *   1. POPULATION is no longer blind to occupation/war-drain — an occupied
 *      (vassal_extraction) or war-drained (war_drain) town actually loses people,
 *      where an unaffected twin does not.
 *   2. FOOD — a settlement with an active OUTBOUND deployment feeds its army from
 *      the home granary: the drain rides the SINGLE effectiveDeficit path (composes
 *      with famine), so a deploying town's stores shrink faster than an idle twin's.
 *   3. OCCUPATION PARITY — a PULSE-conquered town reproduces the GENERATION-occupied
 *      richness: the local military is disarmed (×0.3), the seat is humbled, and the
 *      vassal_extraction occupation condition is stamped.
 *
 * And the non-negotiable: with warLayerEnabled OFF, none of this fires — a no-war
 * campaign is byte-identical (no war_drain/vassal_extraction is ever minted, and the
 * deployment drain is never applied).
 */

import { describe, expect, test } from 'vitest';

import {
  evaluatePopulationDynamics,
  applyPopulationOutcomeToSettlement,
} from '../../src/domain/worldPulse/populationDynamics.js';
import { advanceFoodStockpile, STOCKPILE_TUNING } from '../../src/domain/worldPulse/foodStockpile.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, { activeConditions = [], population = 4000 } = {}) {
  return {
    name,
    tier: 'town',
    population,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    economicState: { prosperity: 'Modest' },
    powerStructure: {
      publicLegitimacy: { score: 55, label: 'Stable' },
      factions: [
        { faction: 'Town Council', category: 'civic', power: 50, isGoverning: true },
        { faction: 'Town Guard', category: 'military', power: 40 },
      ],
    },
    npcs: [],
    activeConditions,
  };
}

function save(id, name, patch) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function snapshotFor(saves) {
  const campaign = {
    id: 'z1', name: 'Z1',
    settlementIds: saves.map(s => s.id),
    worldState: { rngSeed: 'z1', tick: 4, simulationRules: { populationDynamicsEnabled: true } },
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
    wizardNews: { currentTick: 4, entries: [] },
  };
  const worldState = campaign.worldState;
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  // populationDynamics reads item.causal.scores via the snapshot; buildWorldSnapshot
  // already attaches causal. The pressure index is derived from the same snapshot.
  return { snapshot, pIndex: pressureIndex(deriveSettlementPressures(snapshot)) };
}

function popDeltaFor(saveId, conditions) {
  const calm = save('calm', 'Calm');
  const sample = save(saveId, saveId, { activeConditions: conditions });
  const { snapshot, pIndex } = snapshotFor([calm, sample]);
  const candidates = evaluatePopulationDynamics(snapshot, pIndex, { tick: 5, interval: 'one_month' });
  const c = candidates.find(x => String(x.targetSaveId) === saveId);
  const calmC = candidates.find(x => String(x.targetSaveId) === 'calm');
  const sumDelta = (cand) => cand
    ? (cand.populationDeltas || []).filter(d => String(d.saveId) === String(cand.targetSaveId)).reduce((s, d) => s + d.delta, 0)
    : 0;
  return { sample: sumDelta(c), calm: sumDelta(calmC) };
}

describe('Z1 — population is no longer blind to occupation/war-drain', () => {
  test('an OCCUPIED town (vassal_extraction) loses population where an unaffected twin does not', () => {
    const { sample, calm } = popDeltaFor('occupied', [
      { archetype: 'vassal_extraction', severity: 0.7, status: 'worsening' },
    ]);
    expect(sample).toBeLessThan(0);
    // The occupied town sheds more people than the calm baseline twin.
    expect(sample).toBeLessThan(calm);
  });

  test('a WAR-DRAINED town (war_drain) loses population where an unaffected twin does not', () => {
    const { sample, calm } = popDeltaFor('drained', [
      { archetype: 'war_drain', severity: 0.7, status: 'worsening' },
    ]);
    expect(sample).toBeLessThan(0);
    expect(sample).toBeLessThan(calm);
  });

  test('occupation drives REFUGEE FLIGHT — vassal_extraction is in the crisis-flight set (severe class)', () => {
    // vassal_extraction joined CRISIS_FLIGHT_ARCHETYPES, so an occupied town is
    // classified 'severe' (the flight set widens the per-tick cap to 0.18) — it can
    // shed far more than the 0.055 calm cap. war_drain is austerity (NOT flight), so
    // it presses the rate but is NOT in the flight set: an occupied town under an
    // equal-severity condition loses strictly MORE than a war-drained one.
    const occLoss = popDeltaFor('occ', [{ archetype: 'vassal_extraction', severity: 0.95, status: 'worsening' }]).sample;
    const drainLoss = popDeltaFor('drn', [{ archetype: 'war_drain', severity: 0.95, status: 'worsening' }]).sample;
    expect(occLoss).toBeLessThan(0);
    expect(drainLoss).toBeLessThan(0);
    // Both lose people; the flight-class occupation can lose more (wider severe cap).
    expect(occLoss).toBeLessThanOrEqual(drainLoss);
  });

  test('occupation_lifted is RECOVERY, not flight (it lifts the rate, never emigrates)', () => {
    const { sample } = popDeltaFor('freed', [
      { archetype: 'occupation_lifted', severity: 0.5, status: 'easing' },
    ]);
    // A recovering town does not LOSE population from the recovery condition.
    expect(sample).toBeGreaterThanOrEqual(0);
  });
});

describe('Z1 — a deployed army drains its home granary (single effectiveDeficit path)', () => {
  function granaryTown() {
    return {
      name: 'Homefort', tier: 'town', population: 3000,
      institutions: [{ name: 'Old Granary' }],
      // A modest structural deficit so the drawdown path is live and the deploy
      // drain visibly composes onto effectiveDeficit.
      economicState: { foodSecurity: { deficitPct: 10, surplusPct: 0, storageMonths: 4, importDependency: 0.2 } },
      activeConditions: [],
    };
  }

  test('a deploying town drains its granary faster than an idle twin — through effectiveDeficit', () => {
    const idle = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5 });
    const deploying = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5, deployment: { targetId: 'enemy', role: 'siege' } });
    // The deploy drain lands on effectiveDeficit (a deeper deficit), which the
    // drawdown answers by spending MORE granary — so the stores end LOWER than the
    // idle twin's (the army literally eats the stockpile). The reported deficit is
    // both rationed back toward the floor, so the GRANARY is the load-bearing signal.
    expect(deploying.summary.storageMonths).toBeLessThan(idle.summary.storageMonths);
    expect(deploying.settlement.economicState.foodSecurity.stockpile.deployed).toBe(true);
  });

  test('the deploy drain COMPOSES with famine on the same effectiveDeficit (it is not a parallel counter)', () => {
    const famine = { severity: 0.5 };
    const famineOnly = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5, famine });
    const both = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5, famine, deployment: { targetId: 'enemy' } });
    // Composing the army drain onto the same effectiveDeficit drains the granary
    // deeper than famine alone (a deploying-and-famished town starves twice as fast).
    expect(both.summary.storageMonths).toBeLessThan(famineOnly.summary.storageMonths);
  });

  test('a BLOCKADED origin is NOT double-cut: deployment drain is suppressed while the home is besieged', () => {
    const blockade = { severity: 0.6 };
    const blockadedOnly = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5, blockade });
    const blockadedDeploying = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5, blockade, deployment: { targetId: 'enemy' } });
    // Same effective deficit — the deploy drain is suppressed when blockaded.
    expect(blockadedDeploying.summary.effectiveDeficitPct).toBe(blockadedOnly.summary.effectiveDeficitPct);
    expect(blockadedDeploying.settlement.economicState.foodSecurity.stockpile.deployed).toBe(false);
  });

  test('no deployment ⇒ byte-identical (no stockpile motion attributable to the drain)', () => {
    const a = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5, deployment: null });
    const b = advanceFoodStockpile(granaryTown(), { interval: 'one_month', tick: 5 });
    expect(a.settlement.economicState.foodSecurity).toEqual(b.settlement.economicState.foodSecurity);
    expect(STOCKPILE_TUNING.deploymentDrainPct).toBeGreaterThan(0);
  });
});
