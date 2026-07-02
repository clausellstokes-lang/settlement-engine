/**
 * deploymentReturnOccupied.test.js — the OCCUPIED-home branch of the contextual
 * deployment return reads the AUTHORITATIVE occupations ledger, not conditions.
 *
 * Regression pins for the low-severity finding: `isOccupied` used to classify the
 * home as occupied from ANY active war_pressure condition (harassment, assault
 * aftermath, a nearby war), minting a false "throws off its occupiers" chronicle
 * event plus an unearned occupation_lifted recovery (legitimacy/defense lift) on a
 * home that was never occupied. Occupation truth lives in `worldState.occupations`
 * (occupation.js — keyed by the occupied id); the ledger delete on liberation is
 * already guarded there, so the condition-based false positive was pure noise.
 *
 * Also pins the P1 homecoming summary locale: it persists into wizardNews /
 * chronicle records, so its number formatting is pinned to 'en-US' (a bare
 * toLocaleString() drifts by runner locale — the class populationDynamics fixed).
 */
import { describe, expect, test } from 'vitest';

import { deploymentReturnOutcomes } from '../../src/domain/worldPulse/deploymentReturn.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: {
      name,
      tier: 'town',
      population: patch.population ?? 4000,
      config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 40 },
      institutions: [],
      economicState: { primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 55, label: 'Stable' },
        factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
        conflicts: [],
      },
      npcs: [],
      activeConditions: patch.activeConditions || [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function snapshotWith({ saves, extraState = {} }) {
  const campaign = {
    id: 'ret-occ',
    name: 'ret-occ',
    settlementIds: saves.map((s) => s.id),
    worldState: { rngSeed: 'ret-occ', tick: 5, simulationRules: {}, ...extraState },
    regionalGraph: ensureRegionalGraph({ edges: [] }),
    wizardNews: { currentTick: 5, entries: [] },
  };
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

// Seed 'c' rolls 0.215 on the id-forked liberation draw — comfortably inside the
// full-strength success band (pSuccess ceiling 0.96), so the strong-army pins are
// about the BRANCH, not roll luck.
function returnHome({ saves, extraState, deployment, seed = 'c' }) {
  const snap = snapshotWith({ saves, extraState });
  return deploymentReturnOutcomes({
    resolvedDeployments: [{ attackerId: 'home', deployment, targetId: 'foe', outcome: 'conquest' }],
    snapshot: snap,
    graph: snap.regionalGraph,
    rng: createPRNG(seed),
    tick: 5,
  });
}

const STRONG_DEP = { maxStartStrength: 60, currentEffectiveStrength: 60, targetId: 'foe', sinceTick: 1, role: 'siege' };

describe('deployment return — occupied means the occupations LEDGER, not ambient conditions', () => {
  test('an ambient war_pressure condition WITHOUT a ledger entry does NOT mint a liberation', () => {
    const saves = [
      save('home', 'Home', { activeConditions: [{ archetype: 'war_pressure', severity: 0.6 }] }),
      save('other', 'Other'),
    ];
    const out = returnHome({ saves, deployment: STRONG_DEP });
    // No occupation ⇒ no liberation AND no failed-rebellion residual; the strong
    // army stands down generically (no outcomes at full strength, §5).
    expect(out.map((o) => o.candidateType)).not.toContain('occupation_lifted');
    expect(out.map((o) => o.metadata?.warEconomy).filter(Boolean)).toEqual([]);
    expect(out).toEqual([]);
  });

  test('a ledger-occupied home DOES route to the liberation branch (strong army breaks it)', () => {
    const saves = [save('home', 'Home'), save('occupier', 'Occupier')];
    const extraState = {
      occupations: {
        home: { occupierId: 'occupier', state: 'contested', sinceTick: 2, stateHeld: 1, resistance: 0.5, benefitYield: 0, lastTick: 4 },
      },
    };
    const out = returnHome({ saves, extraState, deployment: STRONG_DEP });
    expect(out.map((o) => o.candidateType)).toContain('occupation_lifted');
  });

  test('a ledger-occupied home with a DEPLETED army mounts a failed rebellion (war_exhaustion residual)', () => {
    const saves = [save('home', 'Home'), save('occupier', 'Occupier')];
    const extraState = {
      occupations: {
        home: { occupierId: 'occupier', state: 'contested', sinceTick: 2, stateHeld: 1, resistance: 0.5, benefitYield: 0, lastTick: 4 },
      },
    };
    const out = returnHome({
      saves,
      extraState,
      deployment: { ...STRONG_DEP, currentEffectiveStrength: 5 },
    });
    expect(out.map((o) => o.candidateType)).not.toContain('occupation_lifted');
    expect(out.map((o) => o.candidateType)).toContain('war_exhaustion');
  });
});

describe('deployment return — homecoming summary locale pin', () => {
  test('survivor/fell counts format with en-US grouping regardless of runner locale', () => {
    const saves = [save('home', 'Home'), save('other', 'Other')];
    const out = returnHome({
      saves,
      deployment: { ...STRONG_DEP, currentEffectiveStrength: 30, deployedPopulation: 2400 },
    });
    const homecoming = out.find((o) => o.candidateType === 'army_homecoming');
    expect(homecoming).toBeTruthy();
    // ratio 0.5 ⇒ 1,200 survivors / 1,200 fell — comma-grouped, never '1 200'/'1.200'.
    expect(homecoming.summary).toContain('1,200');
    expect(homecoming.summary).not.toMatch(/1\s200|1\.200/);
  });
});
