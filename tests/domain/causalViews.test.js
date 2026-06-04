/**
 * tests/domain/causalViews.test.js - Tier 5.7 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  CAUSAL_VIEWS,
  deriveCausalView,
  supportedCausalViews,
  viewTitle,
} from '../../src/domain/causalViews.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('catalog', () => {
  it('exposes 7 canonical views', () => {
    expect(CAUSAL_VIEWS).toEqual([
      'narrative', 'simulation', 'delta',
      'faction', 'supply_chain', 'timeline', 'district',
    ]);
    expect(supportedCausalViews()).toEqual([...CAUSAL_VIEWS]);
  });

  it('every view has a title', () => {
    for (const v of CAUSAL_VIEWS) {
      expect(viewTitle(v)).toBeTruthy();
    }
  });
});

describe('deriveCausalView()', () => {
  it('returns canonical envelope for any view', () => {
    for (const v of CAUSAL_VIEWS) {
      const result = deriveCausalView({ population: 2000 }, v);
      expect(result.view).toBe(v);
      expect(result.title).toBeTruthy();
      expect(result).toHaveProperty('entries');
      expect(Array.isArray(result.summary)).toBe(true);
    }
  });

  it('returns warning for unknown view', () => {
    const result = deriveCausalView({}, 'pizza');
    expect(result.summary[0]).toMatch(/unknown view/i);
    expect(result.entries).toBeNull();
  });

  it('handles nullish settlement', () => {
    const result = deriveCausalView(null, 'narrative');
    expect(result.entries).toBeNull();
    expect(result.summary[0]).toMatch(/no settlement/i);
  });
});

// ── Per-view shape ─────────────────────────────────────────────────────

describe('narrative view', () => {
  it('exposes spine + dailyLife', () => {
    const r = deriveCausalView({ population: 2000 }, 'narrative');
    expect(r.entries).toHaveProperty('spine');
    expect(r.entries).toHaveProperty('dailyLife');
  });
});

describe('simulation view', () => {
  it('exposes substrate + capacities', () => {
    const r = deriveCausalView({ population: 2000 }, 'simulation');
    expect(r.entries).toHaveProperty('substrate');
    expect(r.entries).toHaveProperty('capacities');
  });
});

describe('delta view', () => {
  it('exposes recent eventLog entries', () => {
    const r = deriveCausalView({
      eventLog: [{ event: { type: 'X' }, appliedAt: 't', narrativeSummary: 'X happened' }],
    }, 'delta');
    expect(r.entries.eventLog).toHaveLength(1);
  });

  it('falls back when no events', () => {
    const r = deriveCausalView({}, 'delta');
    expect(r.summary[0]).toMatch(/no applied events/i);
  });
});

describe('faction view', () => {
  it('exposes faction profiles', () => {
    const r = deriveCausalView({
      powerStructure: { factions: [{ faction: 'Council', power: 35 }] },
    }, 'faction');
    expect(r.entries.factions.length).toBeGreaterThan(0);
  });
});

describe('supply_chain view', () => {
  it('exposes chains', () => {
    const r = deriveCausalView({
      economicState: {
        activeChains: [{
          needKey: 'food_security',
          chainId: 'grain_to_bread',
          label: 'Grain to bread',
          status: 'operational',
        }],
      },
    }, 'supply_chain');
    expect(r.entries.chains.length).toBeGreaterThan(0);
  });
});

describe('timeline view', () => {
  it('exposes history beats + escalation clocks', () => {
    const r = deriveCausalView({ population: 2000 }, 'timeline');
    expect(r.entries).toHaveProperty('historyBeats');
    expect(r.entries).toHaveProperty('escalationClocks');
  });
});

describe('district view', () => {
  it('exposes districts', () => {
    const r = deriveCausalView({
      spatialLayout: {
        quarters: [{ name: 'Religious Quarter', desc: 'Quiet' }],
      },
    }, 'district');
    expect(r.entries.districts.length).toBeGreaterThan(0);
  });
});

// ── Purity + real smoke ────────────────────────────────────────────────

describe('purity + smoke', () => {
  it('does not mutate settlement', () => {
    const s = { population: 2000 };
    const before = JSON.stringify(s);
    for (const v of CAUSAL_VIEWS) deriveCausalView(s, v);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs every view over a real settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'causalViews-real-city', customContent: {} },
    );
    for (const v of CAUSAL_VIEWS) {
      const r = deriveCausalView(settlement, v);
      expect(r.view).toBe(v);
      expect(r.entries).toBeTruthy();
    }
  });
});
