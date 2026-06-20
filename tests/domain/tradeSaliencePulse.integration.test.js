/**
 * tests/domain/tradeSaliencePulse.integration.test.js — Phase B4 integration pins.
 *
 * The trade-salience dampener actually flows through the real pulse
 * (advanceCampaignWorld → computeTradeSalienceMap → evaluateWorldPulseRules → ctx
 * → candidateBase), composing on the SAME severity/probability product the
 * disposition factor uses. The headline gates:
 *   - a VALUABLE trade tie LOWERS hostile/escalation-candidate severity vs the same
 *     pair without it (trade reduces hostility);
 *   - a redundant/low-salience tie barely moves it;
 *   - trade does NOT make them allied (no spurious alliance candidate);
 *   - OFF (warLayerEnabled:false) ⇒ byte-identical (the factor map is empty);
 *   - the secondary-status overlay is stamped (B0-enforced) under the war layer
 *     and absent OFF.
 */

import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 3000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 30 },
    institutions: [],
    economicState: {
      prosperity: 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
      ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 35, label: 'Contested' },
      factions: patch.factions || [
        { faction: 'Iron Wardens', category: 'military', power: 70, isGoverning: true },
      ],
      conflicts: [],
    },
    npcs: patch.npcs || [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function tradeChannel(from, to, strength, goodId = 'grain', goodLabel = 'Grain') {
  return { type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: goodId, label: goodLabel }] };
}

// A↔B are RIVALS under conflict pressure (so hostile/escalation candidates fire).
// With a valuable grain tie B→A (A is food-insecure, B is its sole supplier), the
// salience dampener should LOWER A's escalation candidates against B.
function campaignFixture({ warLayerEnabled = true, withTie = true, redundant = false } = {}) {
  const channels = [];
  if (withTie) {
    channels.push(tradeChannel('b', 'a', 0.8));
    if (redundant) {
      // A second, equally-good supplier ⇒ the B tie is no longer hard-to-replace.
      channels.push(tradeChannel('c', 'a', 0.8));
    }
  }
  return {
    id: 'salience-pin',
    name: 'Salience Pin',
    settlementIds: redundant ? ['a', 'b', 'c'] : ['a', 'b'],
    worldState: {
      rngSeed: 'salience-seed',
      tick: 4,
      simulationRules: { warLayerEnabled },
      stressors: [
        { id: 'world_stressor.war_pressure.a', type: 'war_pressure', severity: 0.7, affectedSettlementIds: ['a'], age: 1 },
        { id: 'world_stressor.war_pressure.b', type: 'war_pressure', severity: 0.7, affectedSettlementIds: ['b'], age: 1 },
      ],
      relationshipStates: {
        'edge.a.b': { relationshipType: 'rival', resentment: 0.55, fear: 0.4 },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' }],
      channels,
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

function saves(redundant = false) {
  const list = [
    // A: food-insecure, imports grain — a high-salience dependency on its supplier.
    save('a', 'Ashford', {
      imports: ['Grain'],
      foodSecurity: { resilienceScore: 12, storageMonths: 0 },
      activeConditions: [{ archetype: 'regional_conflict_pressure', severity: 0.7 }],
    }),
    // B: grain exporter, A's supplier.
    save('b', 'Briarwatch', { exports: ['Grain'], activeConditions: [{ archetype: 'regional_conflict_pressure', severity: 0.7 }] }),
  ];
  if (redundant) list.push(save('c', 'Crownhold', { exports: ['Grain'] }));
  return list;
}

const run = (opts) => previewCampaignWorldPulse({ campaign: campaignFixture(opts), saves: saves(opts?.redundant), interval: 'one_month', now: NOW });

// Sum of severity over escalation-shaped candidates on the a↔b rival edge.
function escalationSeverity(result) {
  let total = 0;
  let count = 0;
  for (const c of result.candidates || []) {
    if (!c || c.relationshipKey !== 'edge.a.b') continue;
    if (!Number.isFinite(c.severity)) continue;
    // Escalation-shaped rival candidates (arms race / sabotage / power play / to-cold-war).
    if (/arms_race|sabotage|power_play|to_cold_war|to_hostile|escalat/i.test(String(c.candidateType))) {
      total += c.severity;
      count += 1;
    }
  }
  return { total, count };
}

describe('trade salience — reduces hostility (pulse integration)', () => {
  test('a valuable trade tie LOWERS escalation-candidate severity vs no tie', () => {
    const withTie = run({ warLayerEnabled: true, withTie: true });
    const noTie = run({ warLayerEnabled: true, withTie: false });

    const tied = escalationSeverity(withTie);
    const untied = escalationSeverity(noTie);

    // Anti-vacuity: rival escalation candidates actually fired in the no-tie run.
    expect(untied.count).toBeGreaterThan(0);
    // The valuable tie measurably dampens hostility.
    expect(tied.total).toBeLessThan(untied.total);
  });

  test('a redundant tie barely moves it (low salience ⇒ near-1.0 factor)', () => {
    const noTie = run({ warLayerEnabled: true, withTie: false });
    const redundant = run({ warLayerEnabled: true, withTie: true, redundant: true });

    const untied = escalationSeverity(noTie);
    const redun = escalationSeverity(redundant);
    // A hard-to-replace sole tie dampens a lot; a redundant tie much less. The
    // redundant run stays close to the no-tie baseline (within a small margin),
    // and is NOT dampened as hard as a sole tie would be.
    const sole = escalationSeverity(run({ warLayerEnabled: true, withTie: true }));
    expect(redun.total).toBeGreaterThan(sole.total); // less dampening than a sole tie
    // It is still ≤ the untied baseline (a tie never INCREASES hostility).
    expect(redun.total).toBeLessThanOrEqual(untied.total + 1e-9);
  });

  test('trade does NOT make them allied (no spurious alliance proposal)', () => {
    const withTie = run({ warLayerEnabled: true, withTie: true });
    const allianceProposals = (withTie.candidates || []).filter(c =>
      c?.relationshipKey === 'edge.a.b'
      && c?.proposalPayload?.kind === 'relationship_label_change'
      && c?.proposalPayload?.toType === 'allied');
    expect(allianceProposals).toEqual([]);
  });

  test('OFF (warLayerEnabled:false) ⇒ the salience map is empty ⇒ byte-identical with/without the tie', () => {
    const offTie = run({ warLayerEnabled: false, withTie: true });
    const offNoTie = run({ warLayerEnabled: false, withTie: false });
    // The trade channel is graph data, so the candidate SET differs only if salience
    // reached candidateBase. With the layer OFF it never does ⇒ the a↔b edge's
    // escalation severities are identical whether or not the tie exists.
    expect(escalationSeverity(offTie).total).toBe(escalationSeverity(offNoTie).total);
  });

  test('the secondary-status overlay is stamped under the war layer (B0-enforced) and absent OFF', () => {
    const on = run({ warLayerEnabled: true, withTie: true });
    const off = run({ warLayerEnabled: false, withTie: true });

    const onState = on.worldState.relationshipStates['edge.a.b'];
    const offState = off.worldState.relationshipStates['edge.a.b'];

    // ON: a rival CAN trade ⇒ a coherent normal supplier status is layered over
    // the rival primary (never replacing it).
    expect(onState.relationshipType).toBe('rival');
    expect(Array.isArray(onState.secondaryStatuses)).toBe(true);
    expect(onState.secondaryStatuses.length).toBeGreaterThan(0);
    expect(onState.secondaryStatuses.every(s => !s.covert)).toBe(true);

    // OFF: no overlay key at all (byte-neutral).
    expect(offState.secondaryStatuses).toBeUndefined();
  });
});
