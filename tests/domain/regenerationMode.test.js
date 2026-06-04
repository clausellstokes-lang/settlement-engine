/**
 * tests/domain/regenerationMode.test.js - Tier 5.2 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  REGENERATION_MODES,
  MODE_DESCRIPTIONS,
  buildRegenerationPlan,
  supportedRegenerationModes,
  hardAnchorFields,
} from '../../src/domain/regenerationMode.js';

function fixture() {
  return {
    name: 'Greycairn',
    tier: 'town',
    population: 2000,
    institutions: [
      { id: 'institution.granary', name: 'Granary' },
      { id: 'institution.user_hall', name: 'User Hall', _authored: true },
      { id: 'institution.locked_shop', name: 'Locked Shop', locked: true },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.council', faction: 'Council', name: 'Council', power: 35 },
      ],
    },
    npcs: [{ id: 'npc.rusk', name: 'Captain Rusk' }],
    economicState: { activeChains: [] },
    activeConditions: [],
  };
}

describe('catalog', () => {
  it('exposes 3 canonical modes', () => {
    expect(REGENERATION_MODES).toEqual(['nudge', 'rebalance', 'reforge']);
    expect(supportedRegenerationModes()).toEqual([...REGENERATION_MODES]);
  });

  it('every mode has a description', () => {
    for (const m of REGENERATION_MODES) {
      expect(MODE_DESCRIPTIONS[m]).toBeTruthy();
    }
  });

  it('exposes hard anchor fields', () => {
    const fields = hardAnchorFields();
    expect(fields).toContain('_seed');
    expect(fields).toContain('id');
    expect(fields).toContain('tier');
  });
});

describe('buildRegenerationPlan()', () => {
  it('returns canonical envelope', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'rebalance' });
    expect(p).toHaveProperty('mode');
    expect(p).toHaveProperty('preserveEntities');
    expect(p).toHaveProperty('rerollEntities');
    expect(p).toHaveProperty('preserveFields');
    expect(p).toHaveProperty('rerollSubsystems');
    expect(Array.isArray(p.contributors)).toBe(true);
  });

  it('falls back to rebalance for unknown mode', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'pizza' });
    expect(p.mode).toBe('rebalance');
    expect(p.contributors.some(c => c.effect === 'fallback')).toBe(true);
  });

  it('handles nullish settlement', () => {
    const p = buildRegenerationPlan(null, { mode: 'nudge' });
    expect(p.mode).toBe('nudge');
    expect(p.preserveEntities).toEqual([]);
    expect(p.rerollEntities).toEqual([]);
  });
});

// ── Mode behaviour ────────────────────────────────────────────────────

describe('nudge mode', () => {
  it('preserves all institutions', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'nudge' });
    const instPreserved = p.preserveEntities.filter(e => e.type === 'institution');
    const instRerolled = p.rerollEntities.filter(e => e.type === 'institution');
    expect(instPreserved.length).toBeGreaterThan(0);
    expect(instRerolled.length).toBe(0);
  });

  it('reroll subsystems list is minimal (narrative only)', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'nudge' });
    expect(p.rerollSubsystems).toEqual(['narrative']);
  });
});

describe('rebalance mode', () => {
  it('preserves user-authored institutions', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'rebalance' });
    expect(p.preserveEntities.some(e => e.id === 'institution.user_hall')).toBe(true);
  });

  it('preserves locked institutions', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'rebalance' });
    expect(p.preserveEntities.some(e => e.id === 'institution.locked_shop')).toBe(true);
  });

  it('rerolls draft institutions', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'rebalance' });
    expect(p.rerollEntities.some(e => e.id === 'institution.granary')).toBe(true);
  });

  it('rerolls many subsystems', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'rebalance' });
    expect(p.rerollSubsystems.length).toBeGreaterThan(3);
  });
});

describe('reforge mode', () => {
  it('rerolls draft institutions', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'reforge' });
    expect(p.rerollEntities.some(e => e.id === 'institution.granary')).toBe(true);
  });

  it('still preserves locked institutions', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'reforge' });
    expect(p.preserveEntities.some(e => e.id === 'institution.locked_shop')).toBe(true);
  });

  it('rerolls more aggressively than rebalance', () => {
    const reforge = buildRegenerationPlan(fixture(), { mode: 'reforge' });
    const rebalance = buildRegenerationPlan(fixture(), { mode: 'rebalance' });
    expect(reforge.rerollEntities.length).toBeGreaterThanOrEqual(rebalance.rerollEntities.length);
  });
});

describe('preserve / reroll partition', () => {
  it('every catalog entity goes to exactly one of preserve/reroll', () => {
    const p = buildRegenerationPlan(fixture(), { mode: 'rebalance' });
    const ids = new Set();
    for (const e of p.preserveEntities) ids.add(e.id);
    for (const e of p.rerollEntities)   ids.add(e.id);
    expect(ids.size).toBe(p.preserveEntities.length + p.rerollEntities.length);
  });
});

describe('purity', () => {
  it('does not mutate input settlement', () => {
    const s = fixture();
    const before = JSON.stringify(s);
    buildRegenerationPlan(s, { mode: 'reforge' });
    expect(JSON.stringify(s)).toBe(before);
  });
});

describe('change attribution', () => {
  it('records the driving change as a contributor', () => {
    const p = buildRegenerationPlan(fixture(), {
      mode: 'rebalance',
      change: { type: 'institution_added', id: 'institution.new_temple' },
    });
    expect(p.contributors.some(c => c.source === 'options.change')).toBe(true);
  });
});
