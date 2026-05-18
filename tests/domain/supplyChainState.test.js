/**
 * tests/domain/supplyChainState.test.js — Stateful supply-chain contract.
 *
 * Pins the Tier 4.3 derivation surface: status remap, id minting,
 * dependency/beneficiary/victim inference, controller heuristic,
 * idempotence, lossless legacy-field carry-through.
 */

import { describe, it, expect } from 'vitest';
import {
  canonicalSupplyChainStatus,
  deriveSupplyChainState,
  deriveAllSupplyChainStates,
  supplyChainStatusBreakdown,
  hasDisruptedChains,
} from '../../src/domain/supplyChainState.js';

function flourChain(over = {}) {
  return {
    needKey: 'food_security',
    needLabel: 'Food security',
    needIcon: '🌾',
    chainId: 'grain',
    label: 'Grain → flour',
    upstreamChains: [],
    processingInstitutions: ['Watermill'],
    outputs: ['flour'],
    services: [],
    resource: 'grain_fields',
    exportable: true,
    entrepot: false,
    activatedByResource: true,
    substituteActive: false,
    resourceDepleted: false,
    status: 'operational',
    ...over,
  };
}

// ── canonicalSupplyChainStatus ──────────────────────────────────────────

describe('canonicalSupplyChainStatus()', () => {
  it.each([
    ['operational', 'stable'],
    ['running',     'stable'],
    ['entrepot',    'stable'],
    ['vulnerable',  'strained'],
    ['impaired',    'scarce'],
  ])('legacy "%s" → canonical "%s"', (legacy, canonical) => {
    expect(canonicalSupplyChainStatus(legacy)).toBe(canonical);
  });

  it('already-canonical values pass through', () => {
    for (const s of ['stable', 'strained', 'scarce', 'blocked',
                     'captured', 'substituted', 'collapsing']) {
      expect(canonicalSupplyChainStatus(s)).toBe(s);
    }
  });

  it('unknown values default to stable', () => {
    expect(canonicalSupplyChainStatus('mystery')).toBe('stable');
  });

  it('non-string inputs default to stable', () => {
    expect(canonicalSupplyChainStatus(null)).toBe('stable');
    expect(canonicalSupplyChainStatus(undefined)).toBe('stable');
    expect(canonicalSupplyChainStatus(42)).toBe('stable');
  });
});

// ── deriveSupplyChainState ──────────────────────────────────────────────

describe('deriveSupplyChainState()', () => {
  it('produces a full canonical shape from a legacy chain', () => {
    const out = deriveSupplyChainState(flourChain());
    expect(out.id).toBe('chain.food_security.grain');
    expect(out.name).toBe('Grain → flour');
    expect(out.status).toBe('stable');
    expect(out.legacyStatus).toBe('operational');
    expect(out.controller).toBe('Watermill');
    expect(out.dependencies).toContain('resource: grain_fields');
    expect(out.dependencies).toContain('processor: Watermill');
    expect(out.beneficiaries.length).toBeGreaterThan(0);
    expect(out.victims.length).toBeGreaterThan(0);
    expect(out.failureConsequences.length).toBeGreaterThan(0);
  });

  it('controller falls back to dependency.institution when present', () => {
    const out = deriveSupplyChainState(flourChain({
      dependency: { institution: 'Royal Mill', resource: 'grain', severity: 'high' },
    }));
    expect(out.controller).toBe('Royal Mill');
  });

  it('controller falls back to "unattributed" when neither dependency nor processors present', () => {
    const out = deriveSupplyChainState(flourChain({
      dependency: undefined,
      processingInstitutions: [],
    }));
    expect(out.controller).toBe('unattributed');
  });

  it('substitutes are non-empty when substituteActive is true', () => {
    const out = deriveSupplyChainState(flourChain({ substituteActive: true }));
    expect(out.substitutes.length).toBeGreaterThan(0);
  });

  it('substitutes are empty when substituteActive is false', () => {
    const out = deriveSupplyChainState(flourChain({ substituteActive: false }));
    expect(out.substitutes).toEqual([]);
  });

  it('beneficiaries / victims / failureConsequences come from the needKey heuristic', () => {
    const food  = deriveSupplyChainState(flourChain({ needKey: 'food_security' }));
    const craft = deriveSupplyChainState(flourChain({ needKey: 'manufacturing' }));
    expect(food.failureConsequences).toMatch(/bread|relief|legitimacy/);
    expect(craft.failureConsequences).toMatch(/craft|export|guild/);
  });

  it('falls back gracefully when needKey is unknown', () => {
    const out = deriveSupplyChainState(flourChain({ needKey: 'mystery' }));
    expect(out.beneficiaries.length).toBeGreaterThan(0);
    expect(out.victims.length).toBeGreaterThan(0);
    expect(typeof out.failureConsequences).toBe('string');
  });

  it('preserves the resource field for legacy consumers', () => {
    const out = deriveSupplyChainState(flourChain());
    expect(out.resource).toBe('grain_fields');
    expect(out.outputs).toEqual(['flour']);
  });

  it('returns null for nullish input', () => {
    expect(deriveSupplyChainState(null)).toBeNull();
    expect(deriveSupplyChainState(undefined)).toBeNull();
  });

  it('is idempotent on its own output', () => {
    const once  = deriveSupplyChainState(flourChain());
    const twice = deriveSupplyChainState(once);
    // The second pass should produce an equivalent shape with the
    // canonical status, dependencies, etc. all intact.
    expect(twice.status).toBe(once.status);
    expect(twice.id).toBe(once.id);
    expect(twice.name).toBe(once.name);
  });

  it('does not mutate the input chain', () => {
    const input = flourChain();
    const before = JSON.stringify(input);
    deriveSupplyChainState(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});

// ── deriveAllSupplyChainStates ──────────────────────────────────────────

describe('deriveAllSupplyChainStates()', () => {
  it('maps every active chain to a state', () => {
    const settlement = {
      economicState: {
        activeChains: [
          flourChain({ chainId: 'grain' }),
          flourChain({ chainId: 'beer', needKey: 'manufacturing', label: 'Grain → beer' }),
        ],
      },
    };
    const states = deriveAllSupplyChainStates(settlement);
    expect(states).toHaveLength(2);
    expect(states[0].id).toBe('chain.food_security.grain');
    expect(states[1].id).toBe('chain.manufacturing.beer');
  });

  it('returns [] for a settlement with no chains', () => {
    expect(deriveAllSupplyChainStates({})).toEqual([]);
    expect(deriveAllSupplyChainStates(null)).toEqual([]);
  });

  it('reads from the legacy top-level supplyChains field too', () => {
    const settlement = { supplyChains: [flourChain()] };
    const states = deriveAllSupplyChainStates(settlement);
    expect(states).toHaveLength(1);
  });

  it('filters out null-returning derivations', () => {
    const settlement = {
      economicState: { activeChains: [flourChain(), null, undefined, flourChain({ chainId: 'salt' })] },
    };
    const states = deriveAllSupplyChainStates(settlement);
    expect(states).toHaveLength(2);
  });
});

// ── supplyChainStatusBreakdown / hasDisruptedChains ─────────────────────

describe('supplyChainStatusBreakdown()', () => {
  it('counts chains by canonical status', () => {
    const settlement = {
      economicState: {
        activeChains: [
          flourChain({ status: 'operational', chainId: 'a' }),
          flourChain({ status: 'running',     chainId: 'b' }),
          flourChain({ status: 'vulnerable',  chainId: 'c' }),
          flourChain({ status: 'impaired',    chainId: 'd' }),
        ],
      },
    };
    const breakdown = supplyChainStatusBreakdown(settlement);
    expect(breakdown.stable).toBe(2);
    expect(breakdown.strained).toBe(1);
    expect(breakdown.scarce).toBe(1);
    expect(breakdown.blocked).toBe(0);
    expect(breakdown.captured).toBe(0);
    expect(breakdown.substituted).toBe(0);
    expect(breakdown.collapsing).toBe(0);
  });
});

describe('hasDisruptedChains()', () => {
  it('returns false when all chains are stable', () => {
    const settlement = {
      economicState: { activeChains: [flourChain({ status: 'operational' })] },
    };
    expect(hasDisruptedChains(settlement)).toBe(false);
  });

  it('returns true when at least one chain is strained or worse', () => {
    const settlement = {
      economicState: {
        activeChains: [
          flourChain({ status: 'operational', chainId: 'a' }),
          flourChain({ status: 'vulnerable',  chainId: 'b' }),
        ],
      },
    };
    expect(hasDisruptedChains(settlement)).toBe(true);
  });

  it('returns false on a settlement with no chains', () => {
    expect(hasDisruptedChains({})).toBe(false);
  });
});
