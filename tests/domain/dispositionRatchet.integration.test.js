import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { computeAggressiveness } from '../../src/domain/worldPulse/disposition.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Feature C (C1) — the RATCHET write side, cross-tick + order-independent.
//
// READ-LAST/WRITE-NEXT (the F4 timing discipline): a contest that RESOLVES on
// tick N is written into dispositionStats post-apply on tick N, so it FIRST
// colours the disposition factor at candidate-build on tick N+1 — never N. A
// MULTI-settlement fixture is required to exercise this (a single-settlement one
// can't show the cross-tick lag). The fold is commutative (applyDispositionDeltas
// sorts by id) + the attribution is H16/codepoint-stable at the resolver, so
// reversing the saves order yields byte-identical dispositionStats.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: [],
    economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

// A strong besieger A (army deployed, war_front into B) vs a weak target B, plus
// a bystander D. The siege resolves to a conquest on the first pulse: A banks a
// WIN, B a LOSS — the canonical multi-settlement contest.
function siegeSaves() {
  return [
    save('a', 'Ashford', { tier: 'city', population: 90000, legitimacy: 85, factions: [{ faction: 'Garrison Command', category: 'military', power: 90, isGoverning: true }] }),
    save('b', 'Briar', { tier: 'village', population: 200, legitimacy: 25 }),
    save('d', 'Dale'),
  ];
}

function siegeCampaign() {
  return {
    id: 'siege-ratchet',
    settlementIds: ['a', 'b', 'd'],
    worldState: {
      rngSeed: 'warseed',
      tick: 4,
      dispositionStats: {},
      deployments: { a: { targetId: 'b', sinceTick: 2, role: 'siege' } },
      simulationRules: { warLayerEnabled: true },
      stressors: [],
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }],
      channels: [{ type: 'war_front', from: 'a', to: 'b', status: 'confirmed', strength: 0.8 }],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

// The disposition factor a settlement WOULD read at candidate-build given a
// start-of-tick world state (mirrors computeDispositionFactorMap's per-settlement
// read — what advanceCampaignWorld threads into candidateBase).
function factorFor(worldState, id) {
  return computeAggressiveness({ id, settlement: settlement(id, {}) }, worldState);
}

describe('disposition ratchet — read-last / write-next (cross-tick, multi-settlement)', () => {
  test('a conquest on tick N appears in dispositionStats at the END of N, not at its candidate-build', () => {
    const campaign = siegeCampaign();
    const saves = siegeSaves();

    // At the START of tick N the ledger is empty → the factor reads no history.
    expect(campaign.worldState.dispositionStats).toEqual({});

    const tickN = advanceCampaignWorld({ campaign, saves, interval: 'one_month', now: NOW });

    // The siege resolved this tick (a conquest outcome fired)…
    expect(tickN.candidates.some(c => c.candidateType === 'conquest')).toBe(true);
    // …and the WRITE landed post-apply: A banked a win, B a loss. This is the
    // NEXT-tick ledger — it was NOT present when this tick's factors were read.
    expect(tickN.worldState.dispositionStats.a).toMatchObject({ wins: 1, score: 1 });
    expect(tickN.worldState.dispositionStats.b).toMatchObject({ losses: 1, score: -1 });
  });

  test('the WRITE only colours the factor at tick N+1 (the cross-tick lag)', () => {
    const saves = siegeSaves();
    const tickN = advanceCampaignWorld({ campaign: siegeCampaign(), saves, interval: 'one_month', now: NOW });

    // The history-only factor A reads from the START-of-tick-N ledger (empty) was
    // neutral; the same read against the END-of-tick-N ledger is now boosted.
    const startOfN = factorFor({ dispositionStats: {} }, 'a');
    const startOfNplus1 = factorFor({ dispositionStats: tickN.worldState.dispositionStats }, 'a');
    expect(startOfN).toBe(1.0);                          // tick N read: no win yet
    expect(startOfNplus1).toBeGreaterThan(1.0);          // tick N+1 read: the win lands

    // And the loser B reads a damped factor only from N+1.
    expect(factorFor({ dispositionStats: {} }, 'b')).toBe(1.0);
    expect(factorFor({ dispositionStats: tickN.worldState.dispositionStats }, 'b')).toBeLessThan(1.0);
  });

  test('a SECOND pulse carries the ratcheted memory forward (the ledger accumulates)', () => {
    const tickN = advanceCampaignWorld({ campaign: siegeCampaign(), saves: siegeSaves(), interval: 'one_month', now: NOW });
    // Feed tick N's world state into tick N+1.
    const campaignNplus1 = { ...siegeCampaign(), worldState: tickN.worldState };
    const tickNplus1 = advanceCampaignWorld({ campaign: campaignNplus1, saves: siegeSaves(), interval: 'one_month', now: NOW });
    // The win/loss memory persists across the tick (ratcheted, never relaxed away).
    expect(tickNplus1.worldState.dispositionStats.a.score).toBeGreaterThanOrEqual(1);
    expect(tickNplus1.worldState.dispositionStats.b.score).toBeLessThanOrEqual(-1);
  });
});

describe('disposition ratchet — order-independence (commutative fold + H16 attribution)', () => {
  test('reversing the saves order yields byte-identical dispositionStats', () => {
    const forward = advanceCampaignWorld({ campaign: siegeCampaign(), saves: siegeSaves(), interval: 'one_month', now: NOW });
    const reversed = advanceCampaignWorld({ campaign: siegeCampaign(), saves: [...siegeSaves()].reverse(), interval: 'one_month', now: NOW });
    expect(reversed.worldState.dispositionStats).toEqual(forward.worldState.dispositionStats);
    // The winner is attributed to the same settlement id regardless of array order.
    expect(forward.worldState.dispositionStats.a.score).toBe(1);
    expect(reversed.worldState.dispositionStats.a.score).toBe(1);
  });
});
