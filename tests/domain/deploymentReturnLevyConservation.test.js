/**
 * deploymentReturnLevyConservation.test.js — PER-SETTLEMENT population conservation
 * on the war-levy homecoming path.
 *
 * Regression pin for the high-severity finding: the levy (F2) banked each vassal's
 * conscripted headcount on the OVERLORD's deployment.deployedPopulation, and the
 * homecoming credited ALL survivors back to the overlord — conserved in world total
 * but a silent one-way population pump from vassals to the overlord over a long war.
 * The banked `leviedPopulationBySource` seam existed but was never read.
 *
 * The fix apportions the returning survivors back to each contributor (the overlord's
 * own conscript share to the overlord, each vassal's levied share to that vassal) via
 * largest-remainder rounding, so BOTH world-total AND per-settlement population conserve.
 * A conscription-only army (no levy bank) must stay byte-identical: one credit to home.
 */
import { describe, expect, test } from 'vitest';

import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

function save(id, name, population = 4000) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: {
      name,
      tier: 'town',
      population,
      config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 40 },
      institutions: [],
      economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 55, label: 'Stable' },
        factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function returnHome({ saves, deployment, seed = 'c' }) {
  const campaign = {
    id: 'ret-levy',
    name: 'ret-levy',
    settlementIds: saves.map((s) => s.id),
    worldState: { rngSeed: 'ret-levy', tick: 5, simulationRules: {} },
    regionalGraph: ensureRegionalGraph({ edges: [] }),
    wizardNews: { currentTick: 5, entries: [] },
  };
  const snap = buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
  return deploymentReturnOutcomes({
    resolvedDeployments: [{ attackerId: 'overlord', deployment, targetId: 'foe', outcome: 'conquest' }],
    snapshot: snap,
    graph: snap.regionalGraph,
    rng: createPRNG(seed),
    tick: 5,
  });
}

const FULL = { maxStartStrength: 60, currentEffectiveStrength: 60, targetId: 'foe', sinceTick: 1, role: 'siege' };

describe('war-levy homecoming — per-settlement conservation', () => {
  test('survivors are apportioned back to each contributor, not all pumped to the overlord', () => {
    const saves = [save('overlord', 'Overlord'), save('vassalA', 'Vassal A'), save('vassalB', 'Vassal B')];
    // deployedPopulation 2000 = 500 overlord conscripts + 1000 (vassalA) + 500 (vassalB).
    const deployment = {
      ...FULL,
      currentEffectiveStrength: 30, // ratio 0.5 ⇒ 1000 survivors
      deployedPopulation: 2000,
      leviedPopulationBySource: { vassalA: 1000, vassalB: 500 },
    };
    const out = returnHome({ saves, deployment });
    const homecoming = out.find((o) => o.candidateType === 'army_homecoming');
    expect(homecoming).toBeTruthy();

    const deltas = homecoming.populationDeltas;
    const byId = Object.fromEntries(deltas.map((d) => [d.saveId, d.delta]));
    const survivors = homecoming.metadata.survivors;

    // WORLD conservation: the credits sum to exactly `survivors`.
    expect(deltas.reduce((s, d) => s + d.delta, 0)).toBe(survivors);
    // PER-SETTLEMENT conservation: each contributor gets its own men back.
    expect(byId.vassalA).toBeGreaterThan(0);
    expect(byId.vassalB).toBeGreaterThan(0);
    expect(byId.overlord).toBeGreaterThan(0);
    // The overlord no longer receives ALL survivors (the pump is closed).
    expect(byId.overlord).toBeLessThan(survivors);
    // Apportionment tracks banked share: vassalA (1000) gets ~2x vassalB (500).
    expect(byId.vassalA).toBeGreaterThan(byId.vassalB);
    // ratio 0.5 ⇒ each contributor keeps ~half: overlord 250, vassalA 500, vassalB 250.
    expect(byId.overlord).toBe(250);
    expect(byId.vassalA).toBe(500);
    expect(byId.vassalB).toBe(250);
    // Summary reflects dispersal to homes, not a single muster.
    expect(homecoming.summary).toContain('disperse to their homes');
  });

  test('a conscription-only army (no levy bank) stays byte-identical: one credit to home', () => {
    const saves = [save('overlord', 'Overlord'), save('other', 'Other')];
    const out = returnHome({
      saves,
      deployment: { ...FULL, currentEffectiveStrength: 30, deployedPopulation: 2400 },
    });
    const homecoming = out.find((o) => o.candidateType === 'army_homecoming');
    expect(homecoming).toBeTruthy();
    // ratio 0.5 ⇒ 1200 survivors, a SINGLE delta to the overlord's own muster.
    expect(homecoming.populationDeltas).toEqual([
      { saveId: 'overlord', delta: 1200, reason: "Overlord's surviving soldiers return home." },
    ]);
    expect(homecoming.summary).toContain('return to the muster');
    expect(homecoming.summary).not.toContain('disperse');
  });

  test('largest-remainder rounding keeps the credits summing to survivors under a remainder', () => {
    const saves = [save('overlord', 'Overlord'), save('vassalA', 'Vassal A'), save('vassalB', 'Vassal B')];
    const deployment = {
      ...FULL,
      currentEffectiveStrength: 30, // ratio 0.5
      deployedPopulation: 2001, // odd totals force a rounding remainder
      leviedPopulationBySource: { vassalA: 667, vassalB: 667 },
    };
    const out = returnHome({ saves, deployment });
    const homecoming = out.find((o) => o.candidateType === 'army_homecoming');
    const survivors = homecoming.metadata.survivors;
    expect(homecoming.populationDeltas.reduce((s, d) => s + d.delta, 0)).toBe(survivors);
  });
});
