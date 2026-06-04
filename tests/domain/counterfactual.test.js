/**
 * tests/domain/counterfactual.test.js - Tier 4.17 counterfactual.
 *
 * Core invariants only:
 *   - Action vocabulary stable.
 *   - Each supported (type, action) pair produces a non-null
 *     nextSettlement and at least one delta.
 *   - Envelope shape is canonical.
 *   - Pure: settlement never mutated.
 *   - counterfactualCandidates enumerates settlement entities.
 *   - Real-settlement smoke test.
 */

import { describe, it, expect } from 'vitest';
import {
  COUNTERFACTUAL_ACTIONS,
  counterfactual,
  counterfactualCandidates,
  supportedCounterfactualActions,
  summarizeCounterfactual,
} from '../../src/domain/counterfactual.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

function fixture() {
  return {
    name: 'Greycairn',
    tier: 'town',
    population: 2000,
    config: { tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
      { id: 'institution.market',  name: 'Market',  category: 'economy', status: 'active' },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.council',   faction: 'Council',   name: 'Council',   power: 35 },
        { id: 'faction.merchants', faction: 'Merchants', name: 'Merchants', power: 30 },
      ],
    },
    economicState: {
      activeChains: [{
        needKey: 'food_security',
        chainId: 'grain_to_bread',
        label: 'Grain to bread',
        processingInstitutions: ['Granary'],
        status: 'operational',
      }],
    },
    npcs: [{ id: 'npc.captain_rusk', name: 'Captain Rusk', category: 'enforcement', rank: 'dominant' }],
    activeConditions: [],
  };
}

// ── Action vocabulary ──────────────────────────────────────────────────

describe('COUNTERFACTUAL_ACTIONS', () => {
  it('exposes the canonical 4 actions', () => {
    expect(COUNTERFACTUAL_ACTIONS).toEqual(['remove', 'weaken', 'strengthen', 'replace']);
  });

  it('supportedCounterfactualActions returns a copy', () => {
    expect(supportedCounterfactualActions()).toEqual([...COUNTERFACTUAL_ACTIONS]);
  });
});

// ── Envelope shape ─────────────────────────────────────────────────────

describe('counterfactual() envelope shape', () => {
  it('returns the canonical envelope', () => {
    const r = counterfactual(fixture(), { type: 'institution', id: 'institution.granary', action: 'remove' });
    expect(r).toHaveProperty('target');
    expect(r).toHaveProperty('action', 'remove');
    expect(r).toHaveProperty('nextSettlement');
    expect(r).toHaveProperty('beforeExplanation');
    expect(r).toHaveProperty('afterExplanation');
    expect(r).toHaveProperty('deltas');
    expect(r.deltas).toHaveProperty('systemState');
    expect(r.deltas).toHaveProperty('causalState');
    expect(r.deltas).toHaveProperty('capacities');
    expect(r.deltas).toHaveProperty('factionRelationships');
    expect(r.deltas).toHaveProperty('dailyLife');
    expect(Array.isArray(r.summary)).toBe(true);
    expect(Array.isArray(r.warnings)).toBe(true);
  });

  it('returns warnings + null nextSettlement on missing ref', () => {
    const r = counterfactual(fixture(), null);
    expect(r.nextSettlement).toBeNull();
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it('returns warnings on unknown action', () => {
    const r = counterfactual(fixture(), { type: 'institution', id: 'institution.granary', action: 'banish' });
    expect(r.warnings.some(w => /Unknown action/.test(w.message))).toBe(true);
  });
});

// ── Event-pipeline paths ───────────────────────────────────────────────

describe('counterfactual() - event-pipeline actions', () => {
  it('institution:remove produces causal state deltas + summary lines', () => {
    const r = counterfactual(fixture(), { type: 'institution', id: 'institution.granary', action: 'remove' });
    expect(r.nextSettlement).not.toBeNull();
    expect(r.summary.length).toBeGreaterThan(0);
    expect(r.deltas.systemState.length + r.deltas.causalState.length).toBeGreaterThan(0);
  });

  it('institution:weaken applies damage at severity 0.8', () => {
    const r = counterfactual(fixture(), { type: 'institution', id: 'institution.granary', action: 'weaken' });
    expect(r.nextSettlement).not.toBeNull();
    // Damage should produce at least a system-state delta.
    expect(r.deltas.systemState.length).toBeGreaterThan(0);
  });

  it('npc:remove produces a projection', () => {
    const r = counterfactual(fixture(), { type: 'npc', id: 'npc.captain_rusk', action: 'remove' });
    expect(r.nextSettlement).not.toBeNull();
  });
});

// ── Manual-path actions ────────────────────────────────────────────────

describe('counterfactual() - manual-path actions', () => {
  it('faction:weaken drops faction power on the cloned settlement', () => {
    const r = counterfactual(fixture(), { type: 'faction', id: 'faction.council', action: 'weaken' });
    const before = fixture().powerStructure.factions.find(f => f.id === 'faction.council').power;
    const after  = r.nextSettlement.powerStructure.factions.find(f => f.id === 'faction.council').power;
    expect(after).toBeLessThan(before);
  });

  it('faction:remove sets faction power to 0', () => {
    const r = counterfactual(fixture(), { type: 'faction', id: 'faction.merchants', action: 'remove' });
    const after = r.nextSettlement.powerStructure.factions.find(f => f.id === 'faction.merchants').power;
    expect(after).toBe(0);
  });

  it('chain:remove flips the matching chain to collapsing', () => {
    const r = counterfactual(fixture(), {
      type: 'chain',
      id: 'chain.food_security.grain_to_bread',
      action: 'remove',
    });
    const chain = r.nextSettlement.economicState.activeChains[0];
    expect(chain.status).toBe('collapsing');
  });
});

// ── No-mutation contract ───────────────────────────────────────────────

describe('counterfactual() does not mutate input', () => {
  it('keeps the input settlement bit-identical across multiple actions', () => {
    const s = fixture();
    const before = JSON.stringify(s);
    counterfactual(s, { type: 'institution', id: 'institution.granary', action: 'remove' });
    counterfactual(s, { type: 'faction', id: 'faction.council', action: 'weaken' });
    counterfactual(s, { type: 'chain', id: 'chain.food_security.grain_to_bread', action: 'remove' });
    expect(JSON.stringify(s)).toBe(before);
  });
});

// ── Candidates + summary helper ────────────────────────────────────────

describe('counterfactualCandidates()', () => {
  it('enumerates institutions, factions, chains, and npcs', () => {
    const cands = counterfactualCandidates(fixture());
    const types = new Set(cands.map(c => c.type));
    expect(types.has('institution')).toBe(true);
    expect(types.has('faction')).toBe(true);
    expect(types.has('chain')).toBe(true);
    expect(types.has('npc')).toBe(true);
  });

  it('returns [] for nullish settlement', () => {
    expect(counterfactualCandidates(null)).toEqual([]);
  });
});

describe('summarizeCounterfactual()', () => {
  it('returns a copy of result.summary', () => {
    const r = counterfactual(fixture(), { type: 'institution', id: 'institution.granary', action: 'remove' });
    expect(summarizeCounterfactual(r)).toEqual([...r.summary]);
  });
});

// ── Real-settlement smoke ──────────────────────────────────────────────

describe('counterfactual() - real generated settlement', () => {
  it('runs over a city without throwing and produces a non-empty result', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'counterfactual-real-city', customContent: {} },
    );
    const cands = counterfactualCandidates(settlement);
    // Pick the first institution candidate
    const inst = cands.find(c => c.type === 'institution');
    expect(inst).toBeTruthy();
    const r = counterfactual(settlement, { type: 'institution', id: inst.id, action: 'remove' });
    expect(r.nextSettlement).not.toBeNull();
    expect(r.summary.length).toBeGreaterThan(0);
  });
});
