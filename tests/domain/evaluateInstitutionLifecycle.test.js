import { describe, expect, test } from 'vitest';

import {
  INSTITUTION_LIFECYCLE_TUNING,
  evaluateInstitutionLifecycle,
} from '../../src/domain/worldPulse/institutionLifecycle.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { applyTierOutcomeToSettlement } from '../../src/domain/worldPulse/tierResourceDynamics.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const GOOD_SCORES = { trade_connectivity: 72, labor_capacity: 70, infrastructure_condition: 68, food_security: 72 }; // health 0.705
const BAD_SCORES = { trade_connectivity: 32, labor_capacity: 35, infrastructure_condition: 30, food_security: 30 }; // health ~0.318
const NEUTRAL_SCORES = { trade_connectivity: 50, labor_capacity: 50, infrastructure_condition: 50, food_security: 50 };

function settlement(overrides = {}) {
  return {
    name: 'Forgeham',
    tier: 'town',
    population: 2600,
    config: { nearbyResources: ['iron_deposits'], tradeRouteAccess: 'road' },
    institutions: [
      { name: 'Blacksmiths (3-10)', category: 'Crafts' },
      { name: 'Market square', category: 'Commerce' },
      // Bathhouse: matches no supply chain (contribution 0) AND impaired —
      // unambiguously the most vulnerable. Gambling den participates in an
      // active entertainment chain, so it carries real chain contribution.
      { name: 'Bathhouse', category: 'Services', impairments: [{ type: 'capacity', severity: 0.6, causeEventId: 'seed' }] },
      { name: 'Gambling den', category: 'Entertainment' },
    ],
    economicState: { primaryExports: ['Quality tools and weapons'], primaryImports: [] },
    ...overrides,
  };
}

function snapshotWith(scores, settlementOverrides = {}) {
  return {
    settlements: [{ id: 's1', name: 'Forgeham', settlement: settlement(settlementOverrides), causal: { scores: { ...scores } } }],
  };
}

function runTicks(scoresByTick, settlementOverrides = {}) {
  let worldState = { tick: 0, settlementTickStates: {} };
  const perTick = [];
  scoresByTick.forEach((scores, index) => {
    const tick = index + 1;
    const result = evaluateInstitutionLifecycle(worldState, snapshotWith(scores, settlementOverrides), null, { tick });
    worldState = result.worldState;
    perTick.push({ tick, candidates: result.candidates, drift: worldState.settlementTickStates.s1?.economyDrift || null });
  });
  return { worldState, perTick };
}

describe('evaluateInstitutionLifecycle — streak-gated lifecycle candidates', () => {
  test('a prosperity streak must reach the gate before any build candidate appears', () => {
    const gate = INSTITUTION_LIFECYCLE_TUNING.build.requiredStreak;
    const { perTick } = runTicks(Array.from({ length: gate + 1 }, () => GOOD_SCORES));
    for (const step of perTick) {
      if (step.tick < gate) expect(step.candidates).toHaveLength(0);
    }
    const atGate = perTick[gate - 1];
    expect(atGate.drift).toMatchObject({ direction: 'prosperous', streak: gate });
    expect(atGate.candidates).toHaveLength(1);
    const candidate = atGate.candidates[0];
    expect(candidate.candidateType).toBe('institution_build');
    expect(candidate.probability).toBeGreaterThan(0);
    expect(candidate.probability).toBeLessThanOrEqual(INSTITUTION_LIFECYCLE_TUNING.build.max);
    expect(candidate.institutionPatch).toMatchObject({ action: 'build', saveId: 's1' });
    // The smithy-with-ore-but-no-mine fixture: the gap filled is the mine.
    expect(candidate.institutionPatch.name.toLowerCase()).toContain('mine');
    expect(candidate.conflictTags.some(t => /:institution:/.test(t))).toBe(true);
  });

  test('a neutral tick decays the streak instead of erasing it; a flip resets it', () => {
    const gate = INSTITUTION_LIFECYCLE_TUNING.build.requiredStreak;
    const decay = runTicks([GOOD_SCORES, GOOD_SCORES, NEUTRAL_SCORES]);
    expect(decay.perTick[2].drift).toMatchObject({ direction: 'prosperous', streak: 1 });

    const flip = runTicks([GOOD_SCORES, GOOD_SCORES, BAD_SCORES]);
    expect(flip.perTick[2].drift).toMatchObject({ direction: 'declining', streak: 1 });
    expect(gate).toBeGreaterThan(1); // a single flip tick can never trigger anything
  });

  test('a decline streak emits a closure candidate aimed at the most vulnerable institution', () => {
    const gate = INSTITUTION_LIFECYCLE_TUNING.close.requiredStreak;
    const { perTick } = runTicks(Array.from({ length: gate }, () => BAD_SCORES));
    const last = perTick[gate - 1];
    expect(last.candidates).toHaveLength(1);
    const candidate = last.candidates[0];
    expect(candidate.candidateType).toBe('institution_closure');
    // Impaired + zero-contribution closes first; the export-anchor smithy is shielded.
    expect(candidate.institutionPatch.name).toBe('Bathhouse');
    expect(candidate.probability).toBeLessThanOrEqual(INSTITUTION_LIFECYCLE_TUNING.close.max);
    expect(candidate.severity).toBeLessThan(0.78); // low-necessity closures stay auto
  });

  test('the export-anchor processor is never the closure target while fillers remain', () => {
    const gate = INSTITUTION_LIFECYCLE_TUNING.close.requiredStreak;
    const cooldown = INSTITUTION_LIFECYCLE_TUNING.close.cooldownTicks;
    const { perTick } = runTicks(Array.from({ length: gate + cooldown * 3 }, () => BAD_SCORES));
    const targets = perTick.flatMap(s => s.candidates).map(c => c.institutionPatch.name);
    expect(targets.length).toBeGreaterThan(0);
    expect(targets).not.toContain('Blacksmiths (3-10)');
  });

  test('after emitting a candidate the settlement honors the cooldown', () => {
    const gate = INSTITUTION_LIFECYCLE_TUNING.build.requiredStreak;
    const cooldown = INSTITUTION_LIFECYCLE_TUNING.build.cooldownTicks;
    const { perTick } = runTicks(Array.from({ length: gate + cooldown }, () => GOOD_SCORES));
    const emittedAt = perTick.filter(s => s.candidates.length).map(s => s.tick);
    expect(emittedAt[0]).toBe(gate);
    for (let i = 1; i < emittedAt.length; i++) {
      expect(emittedAt[i] - emittedAt[i - 1]).toBeGreaterThanOrEqual(cooldown);
    }
  });

  test('no gaps → no build candidate even under a long prosperous streak', () => {
    const gate = INSTITUTION_LIFECYCLE_TUNING.build.requiredStreak;
    const { perTick } = runTicks(
      Array.from({ length: gate + 2 }, () => GOOD_SCORES),
      { config: { nearbyResources: [], tradeRouteAccess: 'road' }, institutions: [{ name: 'Market square', category: 'Commerce' }] },
    );
    expect(perTick.flatMap(s => s.candidates)).toHaveLength(0);
  });

  test('the simulationRules kill switch gates the whole phase', () => {
    const worldState = { tick: 0, settlementTickStates: {} };
    const result = evaluateInstitutionLifecycle(worldState, snapshotWith(GOOD_SCORES), null, {
      tick: 1,
      simulationRules: { institutionLifecycleEnabled: false },
    });
    expect(result.candidates).toHaveLength(0);
    expect(result.worldState).toBe(worldState); // untouched, not even streak bookkeeping
  });

  test('deterministic: identical inputs produce identical candidates and drift', () => {
    const run = () => runTicks(Array.from({ length: 6 }, () => GOOD_SCORES));
    const a = run();
    const b = run();
    expect(a.perTick.flatMap(s => s.candidates)).toEqual(b.perTick.flatMap(s => s.candidates));
    expect(a.worldState.settlementTickStates).toEqual(b.worldState.settlementTickStates);
  });

  test('streaks cap at the tuned bound so the dead-band drain window stays finite', () => {
    const cap = INSTITUTION_LIFECYCLE_TUNING.streakCap;
    const { perTick } = runTicks(Array.from({ length: cap + 5 }, () => GOOD_SCORES));
    for (const step of perTick) {
      expect(step.drift.streak).toBeLessThanOrEqual(cap);
    }
    expect(perTick.at(-1).drift.streak).toBe(cap);
  });
});

// Tier promotion adds the target tier's required institutions — if one of them
// already exists as a lifecycle-closed remnant ('Weekly market' is closable at
// village but required at town), promotion must REACTIVATE it, not append a
// same-name duplicate that every name-keyed lookup would then shadow.
describe('applyTierOutcomeToSettlement — promotion over lifecycle remnants', () => {
  test('a closed remnant of a tier-required institution is reactivated, not duplicated', () => {
    const settlement = {
      name: 'Riseford',
      tier: 'village',
      population: 2200,
      config: {},
      institutions: [
        { name: 'Weekly market', category: 'Commerce', status: 'remnant', _worldPulseInactive: true, _worldPulseEconomyClosed: true, worldPulseFate: 'shuttered' },
      ],
    };
    const outcome = { id: 'outcome.tier.test', tierChange: { saveId: 's1', fromTier: 'village', toTier: 'town', direction: 'promotion' } };
    const next = applyTierOutcomeToSettlement(settlement, outcome);
    const markets = next.institutions.filter(i => i.name === 'Weekly market');
    expect(markets).toHaveLength(1);
    expect(markets[0]).toMatchObject({ status: 'active', _worldPulseInactive: false, required: true, requiredForTier: 'town' });
    expect(next.institutionHistory.some(e => e.name === 'Weekly market' && e.fate === 'reactivated')).toBe(true);
  });
});

// The economyDrift streak lives in worldState.settlementTickStates — the store
// advanceTime used to CLOBBER every pulse (it returned only { clockStages } and
// the orchestrator assigned it wholesale), which silently reset every drift
// streak to 1 and made streak-gated candidates unreachable through the real
// pulse. This regression test runs the FULL advanceCampaignWorld twice and
// proves cross-tick survival end to end.
describe('advanceCampaignWorld — settlementTickStates survives across pulses', () => {
  function prosperousSave(id) {
    return {
      id,
      name: `Town-${id}`,
      phase: 'canon',
      settlement: {
        name: `Town-${id}`,
        tier: 'town',
        population: 4000,
        config: { nearbyResources: ['iron_deposits'], tradeRouteAccess: 'crossroads', priorityEconomy: 60, priorityMilitary: 30 },
        institutions: [
          'Market square', 'Weekly market', 'Blacksmiths (3-10)', 'Town granary', 'Craft guilds (5-15)',
          'Town watch', 'Town hall', 'Mill', 'Farmland', 'Parish church', 'Carpenters (5-15)', 'Bakehouse',
          'Tavern', 'Inn', 'Stables', 'Warehouse district',
        ].map(name => ({ name, category: 'Civic' })),
        economicState: {
          prosperity: 'Prosperous',
          primaryExports: ['Quality tools and weapons', 'Grain surplus'],
          primaryImports: [],
          foodSecurity: { dailyNeed: 4200, dailyProduction: 6800, foodRatio: 1.62, deficitPct: 0, surplusPct: 45, storageMonths: 6, importDependency: 0.05, magicSupplement: 0, resilienceScore: 82 },
          activeChains: [
            { needKey: 'food_security', chainId: 'grain', label: 'Grain & Bread', status: 'running', processingInstitutions: ['Mill'], outputs: ['Baked goods', 'Grain surplus'], exportable: true, upstreamChains: [] },
            { needKey: 'food_security', chainId: 'livestock', label: 'Livestock', status: 'operational', processingInstitutions: ['Farmland'], outputs: ['Meat'], exportable: true, upstreamChains: [] },
          ],
        },
        powerStructure: { publicLegitimacy: { score: 74, label: 'Approved' }, factions: [], conflicts: [] },
        npcs: [{ id: `reeve_${id}`, name: `Reeve ${id}`, importance: 'key' }],
        activeConditions: [],
      },
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    };
  }

  test('economyDrift streak accumulates through the real pulse instead of resetting', () => {
    let saves = [prosperousSave('a')];
    let campaign = {
      id: 'tickstate-regression',
      name: 'Regression Region',
      settlementIds: ['a'],
      worldState: { rngSeed: 'tickstate-regression-seed', tick: 0, stressors: [], simulationRules: { stressorsEnabled: false, emergentEventsEnabled: false } },
      regionalGraph: ensureRegionalGraph({ channels: [] }),
      wizardNews: { currentTick: 0, entries: [] },
    };

    for (let i = 0; i < 2; i++) {
      const result = advanceCampaignWorld({ campaign, saves, interval: 'one_month', now: `2026-04-01T00:00:0${i}.000Z` });
      campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
      saves = saves.map(s => {
        const update = result.settlementUpdates.find(u => String(u.saveId) === String(s.id));
        return update ? { ...s, settlement: update.settlement } : s;
      });
    }

    const drift = campaign.worldState.settlementTickStates.a?.economyDrift;
    expect(drift).toBeTruthy();
    expect(drift.direction).toBe('prosperous');
    expect(drift.streak).toBeGreaterThanOrEqual(2); // pre-fix this was clobbered back to 1 every pulse
    // And the clock stages advanceTime owns are still there alongside the drift.
    expect(campaign.worldState.settlementTickStates.a.clockStages).toBeDefined();
  });
});
