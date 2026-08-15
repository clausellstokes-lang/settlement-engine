/**
 * WR-4 integration pins at the real war-termination and pulse seams.
 *
 * The leaf tests prove each calculation in isolation. These tests prove the
 * existing four WR-1 terms consume those reads in the intended direction,
 * receipts remain qualitative, and the pulse persists/speaks the same read.
 */
import { describe, expect, it } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { WAR_TERMINATION_DECIDING_TERM_KEYS } from '../../src/domain/certification/warConvergenceContract.js';
import { pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { readWarTerminations } from '../../src/domain/worldPulse/warTermination.js';

const NOW = '2026-08-02T12:00:00.000Z';
const LIT_RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  infoMode: 'perfect_delayed',
});
const TERM_BAND_RANK = Object.freeze({ quiet: 0, present: 1, pressing: 2, decisive: 3 });

function belief(strengthBand) {
  return {
    readiness: 0.3,
    strengthBand,
    allianceLabel: 'hostile',
    faithLabel: null,
    confidence01: 1,
    lastUpdateTick: 8,
  };
}

function item(id, name, {
  tier = 'village',
  population = 100,
  settlementPatch = {},
} = {}) {
  return {
    id,
    name,
    settlement: {
      name,
      tier,
      population,
      config: {},
      institutions: [],
      economicState: {
        primaryImports: [],
        primaryExports: [],
        foodSecurity: { storageMonths: 8 },
      },
      activeConditions: [],
      powerStructure: {
        publicLegitimacy: { score: 65, label: 'Stable' },
        factions: [],
      },
      ...settlementPatch,
    },
  };
}

function readFixture({
  priorBelievedBand,
  priorTruthBand = 'matched',
  currentFoeBeliefBand = 2,
  targetTier = 'village',
  targetPopulation = 100,
  deploymentAge = 0,
  deploymentSinceTick = 1,
  deployedPopulation = 0,
  exhaustion = 0,
  currentEffectiveStrength = 1,
  pIndex = null,
} = {}) {
  const attacker = item('attacker', 'Aster');
  const target = item('target', 'Briar', {
    tier: targetTier,
    population: targetPopulation,
  });
  const snapshot = {
    settlements: [attacker, target],
    byId: new Map([['attacker', attacker], ['target', target]]),
    regionalGraph: { edges: [], channels: [] },
  };
  const priorReceipt = priorBelievedBand == null ? null : {
    kind: 'war_termination_read',
    tick: 8,
    attackerId: 'attacker',
    targetId: 'target',
    believedBalanceBand: priorBelievedBand,
    truthBalanceBand: priorTruthBand,
  };
  const worldState = {
    tick: 9,
    spatialCanonVersion: 1,
    simulationRules: { ...LIT_RULES },
    deployments: {
      attacker: {
        targetId: 'target',
        sinceTick: deploymentSinceTick,
        deploymentAge,
        maxStartStrength: 1,
        currentEffectiveStrength,
        deployedPopulation,
        casusReasons: [],
      },
    },
    warExhaustion: { attacker: exhaustion },
    relationshipStates: {},
    spatialLedgers: {
      beliefMaps: {
        attacker: { seat: { target: belief(currentFoeBeliefBand) } },
        // The target consistently overestimates Aster. Changing Briar's true
        // tier therefore cannot change Aster's believed victory/term budget.
        target: { seat: { attacker: belief(4) } },
      },
    },
    ...(priorReceipt
      ? { pulseHistory: [{ id: 'pulse.prior', tick: 8, warTerminationReads: [priorReceipt] }] }
      : {}),
  };
  const result = readWarTerminations({
    worldState,
    snapshot,
    pIndex,
    tick: 9,
    sunkCostPressureFor: () => 0,
  });
  return result.byAttacker.get('attacker');
}

function decisionProjection(read) {
  return {
    trajectory: read.trajectory,
    trajectoryMarginBand: read.trajectoryMarginBand,
    suePressure01: read.suePressure01,
    decidingTerm: read.decidingTerm,
    bands: read.bands,
  };
}

function numericPaths(value, path = '', out = []) {
  if (typeof value === 'number') {
    out.push([path, value]);
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  for (const [key, child] of Object.entries(value)) {
    numericPaths(child, path ? `${path}.${key}` : key, out);
  }
  return out;
}

describe('WR-4 through readWarTerminations', () => {
  it('treats a first observation as EVEN and stores no invented trajectory margin', () => {
    const first = readFixture({ currentFoeBeliefBand: 2 });

    expect(first.trajectory).toBe('even');
    expect(first.trajectoryMarginBand).toBeNull();
    expect(first.receipt.trajectory).toBe('even');
    expect(Object.hasOwn(first.receipt, 'trajectoryMarginBand')).toBe(false);
  });

  it('treats a new war between the same pair as a first observation', () => {
    const freshWar = readFixture({
      priorBelievedBand: 'behind',
      currentFoeBeliefBand: 2,
      deploymentSinceTick: 9,
    });
    expect(freshWar.trajectory).toBe('even');
    expect(freshWar.trajectoryMarginBand).toBeNull();
    expect(freshWar.receipt.trajectory).toBe('even');
  });

  it('puts winning and losing pressure into the existing stop and continue terms', () => {
    const heldAhead = readFixture({
      priorBelievedBand: 'ahead',
      currentFoeBeliefBand: 2,
    });
    const improving = readFixture({
      priorBelievedBand: 'behind',
      currentFoeBeliefBand: 2,
    });
    expect(improving).toMatchObject({
      trajectory: 'winning',
      trajectoryMarginBand: 'clear',
      decidingTerm: 'cost_to_stop',
    });
    expect(improving.bands.cost_to_continue).toBe(heldAhead.bands.cost_to_continue);
    expect(TERM_BAND_RANK[improving.bands.cost_to_stop])
      .toBeGreaterThan(TERM_BAND_RANK[heldAhead.bands.cost_to_stop]);
    expect(improving.suePressure01).toBeLessThan(heldAhead.suePressure01);

    const heldMatched = readFixture({
      priorBelievedBand: 'matched',
      currentFoeBeliefBand: 3,
    });
    const worsening = readFixture({
      priorBelievedBand: 'far_ahead',
      currentFoeBeliefBand: 3,
    });
    expect(worsening).toMatchObject({
      trajectory: 'losing',
      trajectoryMarginBand: 'clear',
      decidingTerm: 'cost_to_continue',
    });
    expect(worsening.bands.cost_to_stop).toBe(heldMatched.bands.cost_to_stop);
    expect(TERM_BAND_RANK[worsening.bands.cost_to_continue])
      .toBeGreaterThan(TERM_BAND_RANK[heldMatched.bands.cost_to_continue]);
    expect(worsening.suePressure01).toBeGreaterThan(heldMatched.suePressure01);
  });

  it('does not mistake an unchanged overwhelming advantage for temporal momentum', () => {
    const held = readFixture({
      priorBelievedBand: 'far_ahead',
      currentFoeBeliefBand: 0,
    });
    expect(held.trajectory).toBe('even');
    expect(held.trajectoryMarginBand).toBeNull();
    expect(Object.hasOwn(held.receipt, 'trajectoryMarginBand')).toBe(false);
  });

  it('keeps truth diagnostic-only and never accuses an EVEN court of a misread', () => {
    const believedWinningWeakTruth = readFixture({
      priorBelievedBand: 'behind',
      priorTruthBand: 'matched',
      currentFoeBeliefBand: 2,
      targetTier: 'thorp',
      targetPopulation: 100,
    });
    const believedWinningStrongTruth = readFixture({
      priorBelievedBand: 'behind',
      priorTruthBand: 'matched',
      currentFoeBeliefBand: 2,
      targetTier: 'metropolis',
      targetPopulation: 10000,
    });

    expect(decisionProjection(believedWinningStrongTruth))
      .toEqual(decisionProjection(believedWinningWeakTruth));
    expect(believedWinningWeakTruth.trajectoryMisread).toBe(false);
    expect(believedWinningStrongTruth.trajectoryMisread).toBe(true);

    const evenCourt = readFixture({
      priorBelievedBand: 'ahead',
      priorTruthBand: 'matched',
      currentFoeBeliefBand: 2,
      targetTier: 'metropolis',
      targetPopulation: 10000,
    });
    expect(evenCourt.trajectory).toBe('even');
    expect(evenCourt.receipt.truthTrajectory).toBe('losing');
    expect(evenCourt.trajectoryMisread).toBe(false);
    expect(evenCourt.receipt.trajectoryMisread).toBe(false);
  });

  it('requires real home-front evidence before duration can raise continuation cost', () => {
    const opening = readFixture({
      priorBelievedBand: 'far_ahead',
      currentFoeBeliefBand: 0,
      deploymentAge: 0,
      exhaustion: 0.4,
    });
    const oldButQuiet = readFixture({
      priorBelievedBand: 'far_ahead',
      currentFoeBeliefBand: 0,
      deploymentAge: 100,
      exhaustion: 0.4,
    });
    // Duration remains silent as well as behaviorally inert when there is no
    // degradation for it to scale.
    expect(oldButQuiet.receipt.homeFrontDurationBand).toBe('opening');
    expect(oldButQuiet.receipt.homeFrontBand).toBe('quiet');
    expect(oldButQuiet.bands.cost_to_continue).toBe(opening.bands.cost_to_continue);
    expect(oldButQuiet.suePressure01).toBe(opening.suePressure01);

    const burdened = readFixture({
      priorBelievedBand: 'far_ahead',
      currentFoeBeliefBand: 0,
      deploymentAge: 100,
      deployedPopulation: 1000,
      exhaustion: 0.4,
    });
    expect(burdened.receipt.homeFrontComponents.hands).toMatchObject({
      band: 'decisive',
      stateRead: 'deployment.deployedPopulation|leviedPopulationBySource',
    });
    expect(burdened.receipt.homeFrontBand).toBe('pressing');
    expect(TERM_BAND_RANK[burdened.bands.cost_to_continue])
      .toBeGreaterThan(TERM_BAND_RANK[oldButQuiet.bands.cost_to_continue]);
    expect(burdened.suePressure01).toBeGreaterThan(oldButQuiet.suePressure01);
  });

  it('does not claim WR-4 added pressure when the existing term was already saturated', () => {
    const saturated = readFixture({
      priorBelievedBand: 'far_ahead',
      currentFoeBeliefBand: 3,
      deployedPopulation: 1000,
      deploymentAge: 100,
      exhaustion: 1,
      currentEffectiveStrength: 0,
      pIndex: pressureIndex([{ settlementId: 'attacker', kind: 'economy', score: 1 }]),
    });
    expect(saturated.decidingTerm).toBe('cost_to_continue');
    expect(saturated.receipt.costToContinueBand).toBe('decisive');
    expect(saturated.receipt.reason).not.toMatch(/later peace|strain behind/i);
  });

  it('persists only qualitative WR-4 evidence and leaves the four-term schema unchanged', () => {
    const read = readFixture({
      priorBelievedBand: 'behind',
      currentFoeBeliefBand: 2,
      deploymentAge: 100,
      deployedPopulation: 1000,
      exhaustion: 0.4,
    });
    expect(WAR_TERMINATION_DECIDING_TERM_KEYS).toEqual([
      'cause', 'cost_to_continue', 'cost_to_stop', 'momentum',
    ]);
    expect(Object.keys(read.bands)).toEqual(WAR_TERMINATION_DECIDING_TERM_KEYS);
    expect(numericPaths(read.receipt)).toEqual([['tick', 9]]);
    expect(JSON.stringify(read.receipt)).not.toMatch(
      /score01|suePressure01|trajectoryPressure|durationGain|multiplier/i,
    );
    expect(read.receipt).toMatchObject({
      believedBalanceBand: 'ahead',
      trajectory: 'winning',
      trajectoryMarginBand: 'clear',
      homeFrontBand: 'pressing',
      homeFrontDurationBand: 'protracted',
    });
  });
});

function kernelSettlement(name, population) {
  return {
    name,
    tier: 'city',
    population,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 35 },
    institutions: [{ name: 'City Garrison' }, { name: 'Stone Walls' }],
    economicState: {
      prosperity: 'Prosperous',
      primaryExports: [],
      primaryImports: [],
      foodSecurity: { storageMonths: 8, resilienceScore: 80 },
    },
    powerStructure: {
      publicLegitimacy: { score: 65, label: 'Stable' },
      factions: [{
        faction: `${name} Council`, category: 'military', power: 70, isGoverning: true,
      }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

const KERNEL_SAVES = Object.freeze([
  {
    id: 'atlas',
    name: 'Atlas',
    phase: 'canon',
    settlement: kernelSettlement('Atlas', 9000),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  },
  {
    id: 'borin',
    name: 'Borin',
    phase: 'canon',
    settlement: kernelSettlement('Borin', 7000),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  },
]);

const HOSTILE = Object.freeze({
  id: 'edge.atlas.borin',
  from: 'atlas',
  to: 'borin',
  relationshipType: 'hostile',
});

function kernelCampaign() {
  return {
    id: 'wr4-integration',
    name: 'WR-4 Integration',
    settlementIds: ['atlas', 'borin'],
    worldState: {
      rngSeed: 'wr4-integration-seed',
      tick: 4,
      spatialCanonVersion: 1,
      simulationRules: { ...LIT_RULES },
      relationshipStates: { [HOSTILE.id]: { relationshipType: 'hostile' } },
      deployments: {
        atlas: {
          targetId: 'borin',
          sinceTick: 3,
          role: 'siege',
          maxStartStrength: 80,
          currentEffectiveStrength: 80,
          accumulatedAttrition: 0,
          reinforcementFlow: 0,
          deploymentAge: 1,
          manpower: 0.8,
          supplyIntegrity: 0.8,
          morale: 0.8,
          equipmentCondition: 0.8,
          magicSupport: 0.5,
          commandQuality: 0.8,
          foodReserve: 0.8,
          logisticsBurden: 0.1,
          objective: 'conquest',
          returnCondition: 'pending',
          casusReasons: [{
            type: 'grievance',
            score: 0.8,
            receipt: 'An old border wrong still stands.',
            atTick: 3,
          }],
        },
      },
      warExhaustion: { atlas: 0.25 },
      spatialLedgers: {
        beliefMaps: {
          atlas: { seat: { borin: belief(3) } },
          borin: { seat: { atlas: belief(4) } },
        },
        warReasons: {
          'atlas>borin': {
            updatedTick: 4,
            reasons: {
              grievance: {
                type: 'grievance',
                score: 0.8,
                sinceTick: 1,
                tick: 4,
                receipt: 'An old border wrong still stands.',
              },
            },
          },
        },
      },
      pulseHistory: [{
        id: 'pulse.prior',
        tick: 4,
        warTerminationReads: [{
          kind: 'war_termination_read',
          tick: 4,
          attackerId: 'atlas',
          targetId: 'borin',
          believedBalanceBand: 'behind',
          truthBalanceBand: 'matched',
        }],
      }],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [HOSTILE],
      channels: [{
        type: 'war_front',
        from: 'atlas',
        to: 'borin',
        status: 'confirmed',
        source: 'war_layer_deploy',
      }],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

describe('WR-4 pulse persistence and transition news', () => {
  it('stores the current receipt in pulseHistory and appends its trajectory onset once', () => {
    const result = simulateCampaignWorldPulse({
      campaign: kernelCampaign(),
      saves: KERNEL_SAVES,
      interval: 'one_week',
      now: NOW,
    });
    const receipt = result.pulseRecord.warTerminationReads?.[0];
    const latestHistory = result.worldState.pulseHistory.at(-1);

    expect(receipt).toMatchObject({
      kind: 'war_termination_read',
      attackerId: 'atlas',
      targetId: 'borin',
      tick: 5,
      trajectory: 'winning',
    });
    expect(['narrow', 'clear']).toContain(receipt.trajectoryMarginBand);
    expect(latestHistory.warTerminationReads).toEqual([receipt]);

    const trajectoryNews = result.wizardNews.entries.filter(
      (entry) => entry.impactKind === 'war_trajectory_winning',
    );
    expect(trajectoryNews).toHaveLength(1);
    expect(trajectoryNews[0]).toMatchObject({
      tick: 5,
      settlementIds: ['atlas', 'borin'],
      settlementNames: ['Atlas', 'Borin'],
      audience: 'public',
      section: 'war',
    });
  });

  it('does not reuse an earlier war episode for trajectory or transition news', () => {
    const campaign = kernelCampaign();
    campaign.worldState.deployments.atlas.sinceTick = 4;
    campaign.worldState.pulseHistory[0].tick = 3;
    campaign.worldState.pulseHistory[0].warTerminationReads[0].tick = 3;
    const result = simulateCampaignWorldPulse({
      campaign,
      saves: KERNEL_SAVES,
      interval: 'one_week',
      now: NOW,
    });
    const receipt = result.pulseRecord.warTerminationReads?.[0];
    expect(receipt.trajectory).toBe('even');
    expect(receipt).not.toHaveProperty('trajectoryMarginBand');
    expect(result.wizardNews.entries.some((entry) => (
      entry.impactKind === 'war_trajectory_winning'
      || entry.impactKind === 'war_trajectory_losing'
    ))).toBe(false);
  });
});
