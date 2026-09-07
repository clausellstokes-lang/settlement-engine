/**
 * tests/domain/tradeCoercion.test.js — Phase B4 §6 dependency → coercion + embargo.
 *
 *   - a critical-supplier dependency lets the SUPPLIER coerce (a coercion candidate);
 *   - a critical tie + a military/religious tension spike COLLAPSES to an embargo;
 *   - a hostile (battlefield) primary cannot carry a normal trade secondary through
 *     the pulse — only a covert smuggling status (B0 enforced end-to-end);
 *   - the coercion/embargo rules are GATED (warLayerEnabled) ⇒ byte-neutral OFF.
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
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 30, ...(patch.config || {}) },
    institutions: [],
    economicState: {
      prosperity: 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: patch.imports || [],
      ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 45, label: 'Contested' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function tradeChannel(from, to, strength, goodId = 'grain', goodLabel = 'Grain') {
  return { type: 'trade_dependency', from, to, status: 'confirmed', strength, goods: [{ id: goodId, label: goodLabel }] };
}

// A depends critically on B for grain (A food-insecure, B sole supplier). The
// primary relationship + tension are tuned per-test.
function campaignFixture({ warLayerEnabled = true, primary = 'trade_partner', relState = {}, aConditions = [] } = {}) {
  return {
    id: 'coercion-pin',
    name: 'Coercion Pin',
    settlementIds: ['a', 'b'],
    worldState: {
      rngSeed: 'coercion-seed',
      tick: 4,
      simulationRules: { warLayerEnabled },
      relationshipStates: { 'edge.a.b': { relationshipType: primary, ...relState } },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: primary }],
      channels: [tradeChannel('b', 'a', 0.85)],
    }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

const saves = (aConditions = []) => [
  save('a', 'Ashford', { imports: ['Grain'], foodSecurity: { resilienceScore: 8, storageMonths: 0 }, activeConditions: aConditions }),
  save('b', 'Briarwatch', { exports: ['Grain'], tier: 'city', population: 40000 }),
];

const run = (opts, aConditions = []) => previewCampaignWorldPulse({
  campaign: campaignFixture(opts), saves: saves(aConditions), interval: 'one_month', now: NOW,
});

const candidatesOn = (result, key = 'edge.a.b') => (result.candidates || []).filter(c => c?.relationshipKey === key);

describe('§6 dependency → coercion', () => {
  test('a critical-supplier dependency (low tension) yields a supplier-coercion candidate', () => {
    const result = run({ warLayerEnabled: true, primary: 'trade_partner', relState: { resentment: 0.1, fear: 0.05 } });
    const coercion = candidatesOn(result).filter(c => c.candidateType === 'trade_dependency_coercion');
    expect(coercion.length).toBeGreaterThan(0);
    // The supplier (B) is the actor extracting leverage.
    expect(coercion[0].targetSaveId).toBe('b');
    expect(coercion[0].metadata?.secondaryStatus).toBe('critical_supplier');
  });

  test('a critical tie + a tension spike COLLAPSES into an embargo', () => {
    const result = run(
      { warLayerEnabled: true, primary: 'rival', relState: { resentment: 0.75, fear: 0.6 } },
      [{ archetype: 'regional_conflict_pressure', severity: 0.8 }],
    );
    const embargo = candidatesOn(result).filter(c => c.candidateType === 'trade_embargo_collapse');
    expect(embargo.length).toBeGreaterThan(0);
    // The dependent (A) takes the embargo condition; the status is embargo.
    expect(embargo[0].targetSaveId).toBe('a');
    expect(embargo[0].metadata?.secondaryStatus).toBe('embargo');
  });

  test('GATED — OFF (warLayerEnabled:false) emits no coercion/embargo candidate', () => {
    const off = run({ warLayerEnabled: false, primary: 'trade_partner', relState: { resentment: 0.1 } });
    const leverage = candidatesOn(off).filter(c =>
      ['trade_dependency_coercion', 'trade_embargo_collapse'].includes(c.candidateType));
    expect(leverage).toEqual([]);
  });
});

describe('§5 compatibility enforced through the pulse', () => {
  test('a hostile (battlefield) primary cannot carry a normal trade secondary — only covert smuggling', () => {
    const result = run({ warLayerEnabled: true, primary: 'hostile', relState: { resentment: 0.85, fear: 0.8 } });
    const state = result.worldState.relationshipStates['edge.a.b'];
    expect(state.relationshipType).toBe('hostile');
    if (state.secondaryStatuses) {
      // ANY status present must be the covert smuggling exception — never normal commerce.
      expect(state.secondaryStatuses.every(s => s.status === 'smuggling' && s.covert === true)).toBe(true);
      expect(state.secondaryStatuses.map(s => s.status)).not.toContain('trade_partner');
      expect(state.secondaryStatuses.map(s => s.status)).not.toContain('critical_supplier');
    }
  });

  test('a rival primary DOES carry a normal (non-covert) supplier secondary', () => {
    const result = run({ warLayerEnabled: true, primary: 'rival', relState: { resentment: 0.4 } });
    const state = result.worldState.relationshipStates['edge.a.b'];
    expect(state.relationshipType).toBe('rival');
    expect(Array.isArray(state.secondaryStatuses)).toBe(true);
    expect(state.secondaryStatuses.length).toBeGreaterThan(0);
    expect(state.secondaryStatuses.every(s => !s.covert)).toBe(true);
  });
});

describe('determinism — order-independence', () => {
  test('reversed saves yield identical coercion candidates + secondary overlay', () => {
    const opts = { warLayerEnabled: true, primary: 'trade_partner', relState: { resentment: 0.1 } };
    const fwd = previewCampaignWorldPulse({ campaign: campaignFixture(opts), saves: saves(), interval: 'one_month', now: NOW });
    const rev = previewCampaignWorldPulse({ campaign: campaignFixture(opts), saves: [...saves()].reverse(), interval: 'one_month', now: NOW });

    const leverageIds = r => (r.candidates || [])
      .filter(c => ['trade_dependency_coercion', 'trade_embargo_collapse'].includes(c?.candidateType))
      .map(c => `${c.candidateType}@${c.targetSaveId}:${c.severity.toFixed(6)}`)
      .sort();
    expect(rev.candidates && leverageIds(rev)).toEqual(leverageIds(fwd));
    // The overlay is byte-identical under reversal.
    expect(rev.worldState.relationshipStates['edge.a.b'].secondaryStatuses)
      .toEqual(fwd.worldState.relationshipStates['edge.a.b'].secondaryStatuses);
    // Anti-vacuity: the coercion candidate actually fired.
    expect(leverageIds(fwd).length).toBeGreaterThan(0);
  });
});
