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
    ['operational',         'stable'],
    ['running',             'stable'],
    ['entrepot',            'stable'],
    ['vulnerable',          'strained'],
    ['impaired',            'scarce'],
    // Wave 5 #1: these two used to fall through to 'stable' — a druid-
    // propped depleted chain scored fully healthy, and the isolated-
    // subsistence trade shutdown read as a running chain.
    ['magically_sustained', 'substituted'],
    ['unexploited',         'blocked'],
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

  it('the re-aligned need groups get real vocabulary, not the generic fallback', () => {
    // NEED_HEURISTICS used to key 'trade'/'arcane'/'energy' — no such
    // need groups exist, so trade_entrepot, arcane_magical, and the other
    // six real groups all fell through to ['settlement residents'].
    for (const needKey of [
      'trade_entrepot', 'defense_security', 'healing_medicine',
      'knowledge_information', 'arcane_magical', 'religion_civic',
      'entertainment_culture', 'criminal_economy',
    ]) {
      const out = deriveSupplyChainState(flourChain({ needKey }));
      expect(out.beneficiaries, needKey).not.toEqual(['settlement residents']);
      expect(out.victims, needKey).not.toEqual(['settlement residents']);
    }
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

  it('uses regional active conditions as supply-chain pressure', () => {
    const settlement = {
      activeConditions: [{
        id: 'condition.regional_import_shortage.grain',
        archetype: 'regional_import_shortage',
        label: 'Regional import shortage: grain',
        description: 'A regional supplier can no longer meet grain needs.',
        severity: 0.7,
        status: 'worsening',
        affectedSystems: ['food_security', 'trade_connectivity'],
      }],
    };
    const out = deriveSupplyChainState(flourChain(), settlement);
    expect(out.status).toBe('scarce');
    expect(out.regionalPressures).toHaveLength(1);
    expect(out.failureConsequences).toMatch(/Regional pressure/);
  });
});

// ── Magic-as-supplement seam (Wave 5 #1) ────────────────────────────────
// chainMagicSubstitution.js writes status 'magically_sustained' + magicNote;
// economicGenerator writes 'unexploited' on shut-off trade chains;
// computeActiveChains writes upstreamNote on stressed downstreams. The
// derivation must surface all three — not flatten them into 'stable'.

describe('magic-as-supplement / blocked-chain seam', () => {
  it('a magically_sustained chain canonicalizes to "substituted" carrying its magicNote', () => {
    const out = deriveSupplyChainState(flourChain({
      status: 'magically_sustained',
      resourceDepleted: true,
      magicNote: 'Druidic cultivation supplements depleted farmland',
    }));
    expect(out.status).toBe('substituted');
    expect(out.magicNote).toBe('Druidic cultivation supplements depleted farmland');
  });

  it('carries magicRecovery alongside magicNote (Wave 8 — the W1 deferred magnitude)', () => {
    // chainMagicSubstitution writes the recovery FRACTION with its note; the
    // derivation used to drop it, leaving a 25% prop and a 70% rescue
    // indistinguishable on the canonical envelope.
    const out = deriveSupplyChainState(flourChain({
      status: 'magically_sustained',
      magicNote: 'Druidic cultivation supplements depleted farmland',
      magicRecovery: 0.65,
    }));
    expect(out.magicRecovery).toBe(0.65);
    // Idempotent: re-deriving the derived shape keeps the magnitude.
    expect(deriveSupplyChainState(out).magicRecovery).toBe(0.65);
    // Chains without a substitution carry no phantom magnitude.
    expect(deriveSupplyChainState(flourChain()).magicRecovery).toBeUndefined();
  });

  it('an unexploited chain canonicalizes to "blocked"', () => {
    const out = deriveSupplyChainState(flourChain({
      needKey: 'trade_entrepot',
      chainId: 'crossroads_trade',
      status: 'unexploited',
      entrepot: true,
    }));
    expect(out.status).toBe('blocked');
  });

  it('carries upstreamNote through for stressed downstream chains', () => {
    const out = deriveSupplyChainState(flourChain({
      status: 'vulnerable',
      upstreamNote: 'Upstream supply chain impaired — grain disrupted',
    }));
    expect(out.status).toBe('strained');
    expect(out.upstreamNote).toBe('Upstream supply chain impaired — grain disrupted');
  });

  it('legacyStatus keeps the RAW strings for the legacy-shape UI/PDF readers', () => {
    // EconomicsTab / SupplyChainsPanel / SupplyChainFlow filter on the raw
    // 'magically_sustained' / 'unexploited' strings; the canonical remap
    // must not strand them.
    expect(deriveSupplyChainState(flourChain({ status: 'magically_sustained' })).legacyStatus)
      .toBe('magically_sustained');
    expect(deriveSupplyChainState(flourChain({ status: 'unexploited' })).legacyStatus)
      .toBe('unexploited');
  });

  it('re-deriving a substituted chain is idempotent (status and note survive)', () => {
    const once = deriveSupplyChainState(flourChain({
      status: 'magically_sustained',
      magicNote: 'Temple granaries blessed; divine provision fills the gap',
    }));
    const twice = deriveSupplyChainState(once);
    expect(twice.status).toBe('substituted');
    expect(twice.legacyStatus).toBe('magically_sustained');
    expect(twice.magicNote).toBe(once.magicNote);
  });

  it('severe regional pressure degrades a substituted chain to scarce', () => {
    // The pre-existing 'substituted' regional handling finally has a
    // producer; pin the consumer side of the seam too.
    const settlement = {
      activeConditions: [{
        id: 'condition.regional_import_shortage.grain',
        archetype: 'regional_import_shortage',
        label: 'Regional import shortage: grain',
        description: 'A regional supplier can no longer meet grain needs.',
        severity: 0.8,
        status: 'worsening',
        affectedSystems: ['food_security'],
      }],
    };
    const out = deriveSupplyChainState(
      flourChain({ status: 'magically_sustained', magicNote: 'Druidic cultivation supplements depleted farmland' }),
      settlement,
    );
    expect(out.status).toBe('scarce');
    expect(out.magicNote).toBeTruthy(); // the receipt survives the degradation
  });

  it('counts substituted and blocked chains in the status breakdown', () => {
    const settlement = {
      economicState: {
        activeChains: [
          flourChain({ status: 'magically_sustained', chainId: 'a' }),
          flourChain({ status: 'unexploited',         chainId: 'b' }),
          flourChain({ status: 'operational',         chainId: 'c' }),
        ],
      },
    };
    const breakdown = supplyChainStatusBreakdown(settlement);
    expect(breakdown.substituted).toBe(1);
    expect(breakdown.blocked).toBe(1);
    expect(breakdown.stable).toBe(1);
  });

  it('a druid-propped chain now reads as disrupted, not fully healthy', () => {
    const settlement = {
      economicState: {
        activeChains: [flourChain({ status: 'magically_sustained', resourceDepleted: true })],
      },
    };
    expect(hasDisruptedChains(settlement)).toBe(true);
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
