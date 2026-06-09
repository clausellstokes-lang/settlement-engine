/**
 * tests/domain/capacityModel.test.js — Tier 4.4 supply/demand contract.
 *
 * Pins:
 *   - CAPACITY_NAMES catalog stability (9 canonical capacities).
 *   - capacityBand boundaries via supply/demand ratio.
 *   - Per-capacity derivations respond to the right inputs:
 *     * Plague raises healing DEMAND (not just lowers supply); plague
 *       also takes a chunk out of labor supply.
 *     * Refugee influx raises food DEMAND.
 *     * Trade route boosts transport SUPPLY.
 *     * Hostile monsters raise defense DEMAND.
 *     * Religious institutions boost healing + religious_welfare SUPPLY.
 *     * Civic institutions boost administrative SUPPLY.
 *   - deriveAllCapacities returns the canonical envelope (capacities,
 *     bands, ratios, summary).
 *   - No mutation of input settlement.
 *   - Phase 19 wiring: explainCapacity returns canonical envelope;
 *     EXPLAINABLE_TYPES includes 'capacity'; entityCatalog enumerates
 *     all 9 capacities; dispatcher routes capacity.* and bare names.
 *   - Real-settlement integration: city-tier settlement produces all
 *     9 capacities with valid bands.
 */

import { describe, it, expect } from 'vitest';
import {
  CAPACITY_NAMES,
  CAPACITY_BANDS,
  capacityBand,
  deriveCapacityProfile,
  deriveAllCapacities,
  capacityBreakdown,
  summarizeCapacities,
  strainedCapacities,
  supportedCapacities,
} from '../../src/domain/capacityModel.js';
import {
  EXPLAINABLE_TYPES,
  explainEntity,
  explainCapacity,
  entityCatalog,
} from '../../src/domain/explanation.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// ── Catalog ────────────────────────────────────────────────────────────

describe('CAPACITY_NAMES', () => {
  it('exposes the canonical 9 capacities', () => {
    expect(CAPACITY_NAMES).toEqual([
      'labor', 'healing', 'defense', 'administrative',
      'food_production', 'transport', 'religious_welfare',
      'craft', 'magical',
    ]);
  });

  it('is frozen', () => {
    expect(Object.isFrozen(CAPACITY_NAMES)).toBe(true);
  });
});

describe('CAPACITY_BANDS', () => {
  it('shares the 5-band vocabulary with Phase 17 substrate', () => {
    expect(CAPACITY_BANDS).toEqual(['surplus', 'adequate', 'strained', 'critical', 'collapsed']);
  });
});

// ── Ratio → band ───────────────────────────────────────────────────────

describe('capacityBand()', () => {
  it('respects the canonical ratio boundaries', () => {
    expect(capacityBand(2.0)).toBe('surplus');
    expect(capacityBand(1.2)).toBe('surplus');
    expect(capacityBand(1.19)).toBe('adequate');
    expect(capacityBand(1.0)).toBe('adequate');
    expect(capacityBand(0.95)).toBe('adequate');
    expect(capacityBand(0.94)).toBe('strained');
    expect(capacityBand(0.7)).toBe('strained');
    expect(capacityBand(0.69)).toBe('critical');
    expect(capacityBand(0.35)).toBe('critical');
    expect(capacityBand(0.34)).toBe('collapsed');
    expect(capacityBand(0)).toBe('collapsed');
  });

  it('treats non-numeric input as adequate', () => {
    expect(capacityBand(null)).toBe('adequate');
    expect(capacityBand(undefined)).toBe('adequate');
    expect(capacityBand('high')).toBe('adequate');
  });
});

// ── Single capacity derivation ─────────────────────────────────────────

describe('deriveCapacityProfile()', () => {
  it('returns null for unknown capacity', () => {
    expect(deriveCapacityProfile('not_a_thing', {})).toBeNull();
  });

  it('returns neutral 50/50 for nullish settlement', () => {
    const p = deriveCapacityProfile('labor', null);
    expect(p.supply).toBe(50);
    expect(p.demand).toBe(50);
    expect(p.band).toBe('adequate');
    expect(p.supplyContributors).toEqual([]);
    expect(p.demandContributors).toEqual([]);
  });

  it('produces the canonical CapacityProfile shape', () => {
    const p = deriveCapacityProfile('labor', { population: 2000 });
    expect(p).toHaveProperty('capacity', 'labor');
    expect(p).toHaveProperty('label', 'Labor');
    expect(typeof p.supply).toBe('number');
    expect(typeof p.demand).toBe('number');
    expect(typeof p.ratio).toBe('number');
    expect(CAPACITY_BANDS).toContain(p.band);
    expect(Array.isArray(p.supplyContributors)).toBe(true);
    expect(Array.isArray(p.demandContributors)).toBe(true);
    expect(p).toHaveProperty('trajectory');
  });

  it('clamps supply and demand to 0..100', () => {
    const massivePlague = {
      population: 5000,
      institutions: Array.from({ length: 20 }).map((_, i) => ({ id: `i${i}`, name: `Thing ${i}` })),
      activeConditions: [
        { archetype: 'plague', severity: 1.0 },
      ],
    };
    const p = deriveCapacityProfile('labor', massivePlague);
    expect(p.supply).toBeGreaterThanOrEqual(0);
    expect(p.supply).toBeLessThanOrEqual(100);
    expect(p.demand).toBeGreaterThanOrEqual(0);
    expect(p.demand).toBeLessThanOrEqual(100);
  });
});

// ── Per-capacity behavior ──────────────────────────────────────────────

describe('healing capacity behavior', () => {
  it('rises with more healing institutions', () => {
    const lean = deriveCapacityProfile('healing', {
      institutions: [],
    });
    const rich = deriveCapacityProfile('healing', {
      institutions: [
        { id: 'i1', name: 'Temple of Light' },
        { id: 'i2', name: 'Apothecary' },
        { id: 'i3', name: 'Healer\'s Lodge' },
      ],
    });
    expect(rich.supply).toBeGreaterThan(lean.supply);
  });

  it('plague raises DEMAND (not just lowers supply)', () => {
    const baseline = deriveCapacityProfile('healing', {
      institutions: [{ id: 'i1', name: 'Temple of Light' }],
      population: 2000,
    });
    const plagued = deriveCapacityProfile('healing', {
      institutions: [{ id: 'i1', name: 'Temple of Light' }],
      population: 2000,
      activeConditions: [{ archetype: 'plague', severity: 0.7 }],
    });
    expect(plagued.demand).toBeGreaterThan(baseline.demand);
    // Supply is unchanged — same institutions, same magic, same factions
    expect(plagued.supply).toBe(baseline.supply);
    // Plague-tagged demand contributor should appear
    expect(plagued.demandContributors.some(c => /plague/i.test(c.reason))).toBe(true);
  });
});

describe('labor capacity behavior', () => {
  it('plague both raises demand AND lowers supply', () => {
    const baseline = deriveCapacityProfile('labor', { population: 2000 });
    const plagued = deriveCapacityProfile('labor', {
      population: 2000,
      activeConditions: [{ archetype: 'plague', severity: 0.7 }],
    });
    expect(plagued.demand).toBeGreaterThan(baseline.demand);
    expect(plagued.supply).toBeLessThan(baseline.supply);
  });

  it('larger population raises supply (sub-linearly)', () => {
    const small  = deriveCapacityProfile('labor', { population: 200 });
    const medium = deriveCapacityProfile('labor', { population: 2000 });
    const big    = deriveCapacityProfile('labor', { population: 8000 });
    expect(medium.supply).toBeGreaterThan(small.supply);
    expect(big.supply).toBeGreaterThan(medium.supply);
  });
});

describe('defense capacity behavior', () => {
  it('plagued monsters raise demand', () => {
    const safe = deriveCapacityProfile('defense', {
      config: { monsterThreat: 'safe' },
    });
    const plagued = deriveCapacityProfile('defense', {
      config: { monsterThreat: 'plagued' },
    });
    expect(plagued.demand).toBeGreaterThan(safe.demand);
  });

  it('walls / garrison institutions raise supply', () => {
    const unfortified = deriveCapacityProfile('defense', { institutions: [] });
    const fortified = deriveCapacityProfile('defense', {
      institutions: [
        { id: 'i1', name: 'Town Watch' },
        { id: 'i2', name: 'Garrison Barracks' },
      ],
    });
    expect(fortified.supply).toBeGreaterThan(unfortified.supply);
  });
});

describe('food_production capacity behavior', () => {
  it('refugee influx raises demand', () => {
    const baseline = deriveCapacityProfile('food_production', { population: 2000 });
    const influx = deriveCapacityProfile('food_production', {
      population: 2000,
      stressors: [{ name: 'Refugee influx from the burning fields' }],
    });
    expect(influx.demand).toBeGreaterThan(baseline.demand);
  });

  it('food institutions raise supply', () => {
    const lean = deriveCapacityProfile('food_production', { institutions: [] });
    const rich = deriveCapacityProfile('food_production', {
      institutions: [
        { id: 'i1', name: 'Town Granary' },
        { id: 'i2', name: 'River Mill' },
        { id: 'i3', name: 'Fisheries' },
      ],
    });
    expect(rich.supply).toBeGreaterThan(lean.supply);
  });
});

describe('transport capacity behavior', () => {
  it('major trade route gives more supply than isolation', () => {
    const isolated = deriveCapacityProfile('transport', { config: { tradeRouteAccess: 'none' } });
    const major = deriveCapacityProfile('transport', { config: { tradeRouteAccess: 'major' } });
    expect(major.supply).toBeGreaterThan(isolated.supply);
  });
});

describe('religious_welfare capacity behavior', () => {
  it('religious institutions raise supply', () => {
    const empty = deriveCapacityProfile('religious_welfare', { institutions: [] });
    const rich = deriveCapacityProfile('religious_welfare', {
      institutions: [
        { id: 'i1', name: 'Cathedral of Light' },
        { id: 'i2', name: 'Wayside Shrine' },
      ],
    });
    expect(rich.supply).toBeGreaterThan(empty.supply);
  });

  it('plague raises demand', () => {
    const baseline = deriveCapacityProfile('religious_welfare', { population: 1000 });
    const plagued = deriveCapacityProfile('religious_welfare', {
      population: 1000,
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    });
    expect(plagued.demand).toBeGreaterThan(baseline.demand);
  });
});

// ── deriveAllCapacities ────────────────────────────────────────────────

describe('deriveAllCapacities()', () => {
  it('returns the canonical envelope (capacities/bands/ratios/summary)', () => {
    const state = deriveAllCapacities({ population: 2000 });
    expect(state).toHaveProperty('capacities');
    expect(state).toHaveProperty('bands');
    expect(state).toHaveProperty('ratios');
    expect(state).toHaveProperty('summary');
  });

  it('covers every CAPACITY_NAMES entry', () => {
    const state = deriveAllCapacities({ population: 2000 });
    for (const name of CAPACITY_NAMES) {
      expect(state.capacities[name], `missing capacity: ${name}`).toBeTruthy();
      expect(CAPACITY_BANDS).toContain(state.bands[name]);
      expect(typeof state.ratios[name]).toBe('number');
    }
  });

  it('summary groups every capacity into exactly one band bucket', () => {
    const state = deriveAllCapacities({ population: 2000 });
    const flat = [
      ...state.summary.surplus,
      ...state.summary.adequate,
      ...state.summary.strained,
      ...state.summary.critical,
      ...state.summary.collapsed,
    ];
    expect(new Set(flat).size).toBe(9);
  });

  it('nullish settlement returns 9 adequate capacities', () => {
    const state = deriveAllCapacities(null);
    for (const name of CAPACITY_NAMES) {
      expect(state.bands[name]).toBe('adequate');
    }
  });

  it('does not mutate the input settlement', () => {
    const s = {
      population: 2000,
      institutions: [{ id: 'i1', name: 'Granary' }],
      activeConditions: [{ archetype: 'plague', severity: 0.6 }],
    };
    const before = JSON.stringify(s);
    deriveAllCapacities(s);
    expect(JSON.stringify(s)).toBe(before);
  });
});

// ── Diagnostic helpers ─────────────────────────────────────────────────

describe('capacityBreakdown()', () => {
  it('counts capacities at each band', () => {
    const breakdown = capacityBreakdown({ population: 2000 });
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    expect(total).toBe(9);
  });
});

describe('summarizeCapacities()', () => {
  it('emits one line per capacity', () => {
    const lines = summarizeCapacities({ population: 2000 });
    expect(lines).toHaveLength(9);
    for (const line of lines) {
      expect(line).toMatch(/(surplus|adequate|strained|critical|collapsed)/);
      expect(line).toMatch(/supply \d+/);
      expect(line).toMatch(/demand \d+/);
    }
  });
});

describe('strainedCapacities()', () => {
  it('returns capacities at strained/critical/collapsed', () => {
    const s = {
      population: 8000,  // dense → drives demand on multiple capacities
      institutions: [],
      activeConditions: [{ archetype: 'plague', severity: 0.8 }],
    };
    const strained = strainedCapacities(s);
    expect(Array.isArray(strained)).toBe(true);
    // At minimum, healing should be strained under heavy plague + no institutions
    expect(strained.includes('healing')).toBe(true);
  });
});

describe('supportedCapacities()', () => {
  it('returns a copy of CAPACITY_NAMES', () => {
    expect(supportedCapacities()).toEqual([...CAPACITY_NAMES]);
  });
});

// ── Phase 19 wiring ────────────────────────────────────────────────────

describe('Phase 19 wiring — explainCapacity + EXPLAINABLE_TYPES + entityCatalog', () => {
  it('EXPLAINABLE_TYPES includes "capacity"', () => {
    expect(EXPLAINABLE_TYPES).toContain('capacity');
  });

  it('entityCatalog enumerates all 9 capacities', () => {
    const cat = entityCatalog({ population: 2000 });
    const caps = cat.filter(e => e.type === 'capacity');
    expect(caps).toHaveLength(9);
    for (const c of caps) {
      expect(c.id).toMatch(/^capacity\./);
      expect(typeof c.label).toBe('string');
    }
  });

  it('explainCapacity returns the canonical envelope', () => {
    const env = explainCapacity({ population: 2000 }, 'healing');
    expect(env.entityType).toBe('capacity');
    expect(env.entityId).toBe('capacity.healing');
    expect(env.profile.capacity).toBe('healing');
    expect(typeof env.profile.supply).toBe('number');
    expect(typeof env.profile.demand).toBe('number');
    expect(env.profile.ratio).toBeTruthy();
  });

  it('accepts capacity.<name> prefix form', () => {
    const env = explainCapacity({ population: 2000 }, 'capacity.healing');
    expect(env.profile.capacity).toBe('healing');
  });

  it('returns empty envelope for unknown capacity name', () => {
    const env = explainCapacity({ population: 2000 }, 'pizza_delivery');
    expect(env.entityType).toBe('capacity');
    expect(env.causes).toEqual([]);
  });

  it('dispatcher routes capacity.* ids', () => {
    const env = explainEntity({ population: 2000 }, 'capacity.healing');
    expect(env.entityType).toBe('capacity');
  });

  it('dispatcher routes bare capacity names', () => {
    const env = explainEntity({ population: 2000 }, 'healing');
    expect(env.entityType).toBe('capacity');
  });

  it('supply contributors get supply: prefix; demand contributors get demand: prefix', () => {
    const env = explainCapacity({
      population: 2000,
      institutions: [{ id: 'i1', name: 'Temple of Light' }],
      activeConditions: [{ archetype: 'plague', severity: 0.7 }],
    }, 'healing');
    // Plague is a demand contributor; institution is a supply contributor.
    expect(env.causes.some(c => c.effect.startsWith('supply:'))).toBe(true);
    expect(env.causes.some(c => c.effect.startsWith('demand:'))).toBe(true);
  });

  it('downstream references the system variable each capacity feeds', () => {
    const env = explainCapacity({ population: 2000 }, 'healing');
    expect(env.downstreamEffects.some(d => d.target === 'healing_capacity')).toBe(true);
  });
});

// ── Real-settlement integration ────────────────────────────────────────

describe('deriveAllCapacities() — real generated settlement', () => {
  it('produces 9 capacities with valid bands against a city-tier settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'capacity-real-city', customContent: {} },
    );
    const state = deriveAllCapacities(settlement);
    for (const name of CAPACITY_NAMES) {
      const p = state.capacities[name];
      expect(p.capacity).toBe(name);
      expect(typeof p.supply).toBe('number');
      expect(p.supply).toBeGreaterThanOrEqual(0);
      expect(p.supply).toBeLessThanOrEqual(100);
      expect(typeof p.demand).toBe('number');
      expect(p.demand).toBeGreaterThanOrEqual(0);
      expect(p.demand).toBeLessThanOrEqual(100);
      expect(CAPACITY_BANDS).toContain(p.band);
    }
  });

  it('does not mutate the generated settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic' },
      null,
      { seed: 'capacity-no-mutation', customContent: {} },
    );
    const before = JSON.stringify(settlement);
    deriveAllCapacities(settlement);
    summarizeCapacities(settlement);
    explainCapacity(settlement, 'labor');
    expect(JSON.stringify(settlement)).toBe(before);
  });
});

// ── Canonical field + trade-route vocabulary (P1.1 / P1.2) ──────────────────
describe('capacity model reads the canonical primaryExports field (P1.2)', () => {
  const withExports = (field, value) => ({
    name: 'X', tier: 'town', population: 2000,
    config: { tradeRouteAccess: 'road', monsterThreat: 'safe' },
    economicState: { prosperity: 'Modest', [field]: value },
    institutions: [], powerStructure: { factions: [] }, activeConditions: [],
  });
  const FIVE = ['grain', 'wool', 'iron', 'cloth', 'ale'];

  it('transport demand rises with primaryExports (was a dead `exports` read)', () => {
    const none = deriveCapacityProfile('transport', withExports('primaryExports', [])).demand;
    const rich = deriveCapacityProfile('transport', withExports('primaryExports', FIVE)).demand;
    expect(rich).toBeGreaterThan(none);
  });

  it('still honors the legacy `exports` alias', () => {
    const none = deriveCapacityProfile('transport', withExports('exports', [])).demand;
    const rich = deriveCapacityProfile('transport', withExports('exports', FIVE)).demand;
    expect(rich).toBeGreaterThan(none);
  });
});

describe('capacity transport supply reflects canonical trade routes (P1.1)', () => {
  const route = (r) => ({
    name: 'X', tier: 'town', population: 1500,
    config: { tradeRouteAccess: r, monsterThreat: 'safe' },
    economicState: {}, institutions: [], powerStructure: { factions: [] }, activeConditions: [],
  });
  it('road/river/crossroads/port all beat isolated on transport supply', () => {
    const iso = deriveCapacityProfile('transport', route('isolated')).supply;
    for (const r of ['road', 'river', 'crossroads', 'port']) {
      expect(deriveCapacityProfile('transport', route(r)).supply, `${r} > isolated`).toBeGreaterThan(iso);
    }
  });
});
