/**
 * tests/domain/threatDedupAndCapacityFixes.test.js — B04 review fixes.
 *
 * Pins the cross-surface threat pressure-collapse + the capacity-demand /
 * supply corrections that depend on it. The pressure-collapse lives in
 * capacityModel's demand math (dedupeThreatsByPressure), NOT at the shared
 * enumeration entry — deriveAllThreatProfiles stays honest so explanation /
 * contradictions / map / AI-grounding see every distinct threat:
 *
 *   1. capacity demand counts the same pressure expressed on more than one
 *      surface (config.monsterThreat + a matching stressor) once, while
 *      deriveAllThreatProfiles still enumerates both surfaces.
 *   2. deriveDefense no longer double-charges monster pressure (config charge
 *      AND the config-derived monster_pressure threat charge).
 *   3. deriveHealing grants magical-healing supply for BOTH 'high' and
 *      'medium' magic via the magicLedger (the old stale `config.magicLevel`
 *      read missed 'medium' and matched a never-emitted 'pervasive').
 *   7. deriveFoodProduction surfaces the originating regional condition as a
 *      contributor so the trajectory join reports 'worsening'.
 */

import { describe, it, expect } from 'vitest';
import { deriveAllThreatProfiles } from '../../src/domain/threatProfile.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';

// ── Finding 1: cross-surface threat pressure-collapse ──────────────────────

describe('threat enumeration vs capacity-demand pressure-collapse (Finding 1)', () => {
  it('enumerates a cross-surface pressure on every surface (no enumeration collapse)', () => {
    // config.monsterThreat 'frontier' (sev 0.45) AND a monster-tagged stressor
    // (sev default 0.4) each materialize a distinct monster_pressure threat.
    // Enumeration is honest — both survive so downstream consumers can address
    // each surface's threat (different ids, descriptions, provenance).
    const settlement = {
      config: { monsterThreat: 'frontier' },
      stressors: [{ name: 'Monster raids in the outlying hills' }],
    };
    const threats = deriveAllThreatProfiles(settlement);
    const monster = threats.filter(t => t.type === 'monster_pressure' && t.target === 'settlement');
    expect(monster.length).toBeGreaterThanOrEqual(2);
    // ...and they are genuinely distinct (different ids), not accidental clones.
    expect(new Set(monster.map(t => t.id)).size).toBe(monster.length);
  });

  it('charges defense demand for the cross-surface pressure exactly once', () => {
    // Two surfaces, one underlying monster pressure: demand must reflect a
    // SINGLE charge (the max-severity instance), not one per surface.
    const oneSurface = deriveCapacityProfile('defense', {
      config: { monsterThreat: 'frontier' }, // 0.45
    });
    const twoSurfaces = deriveCapacityProfile('defense', {
      config: { monsterThreat: 'frontier' },                  // 0.45
      stressors: [{ name: 'Monster raids', severity: 0.45 }], // same kind, same sev
    });
    // Same single pressure charge → identical demand despite the extra surface.
    expect(twoSurfaces.demand).toBe(oneSurface.demand);
    const monsterRows = twoSurfaces.demandContributors.filter(c => /monster/i.test(c.effect));
    expect(monsterRows).toHaveLength(1);
  });

  it('does not collapse distinct threat types in enumeration', () => {
    const settlement = {
      config: { monsterThreat: 'frontier' },
      stressors: [{ name: 'Plague in the slums' }],
    };
    const threats = deriveAllThreatProfiles(settlement);
    const types = new Set(threats.map(t => t.type));
    expect(types.has('monster_pressure')).toBe(true);
    expect(types.has('plague')).toBe(true);
  });
});

// ── Finding 1 (cont.): deriveDefense no longer double-charges ──────────────

describe('deriveDefense — single source of truth for monster demand (Finding 1)', () => {
  it('counts plagued monster pressure exactly once in defense demand', () => {
    const plagued = deriveCapacityProfile('defense', {
      config: { monsterThreat: 'plagued' },
    });
    // Only the threat-derived monster_pressure row should drive demand — the
    // old direct config.monsterThreat row must be gone.
    const monsterRows = plagued.demandContributors.filter(
      c => /monster/i.test(c.effect) || c.source === 'config.monsterThreat'
    );
    expect(monsterRows).toHaveLength(1);
    expect(monsterRows[0].source).not.toBe('config.monsterThreat');
  });

  it('still raises defense demand under monster pressure', () => {
    const safe = deriveCapacityProfile('defense', { config: { monsterThreat: 'safe' } });
    const plagued = deriveCapacityProfile('defense', { config: { monsterThreat: 'plagued' } });
    expect(plagued.demand).toBeGreaterThan(safe.demand);
  });
});

// ── Finding 2: deriveHealing magic-level supply via magicLedger ────────────

describe('deriveHealing — magical healing supply via magicLedger (Finding 2)', () => {
  const base = { institutions: [{ id: 'i1', name: 'Town Square' }], population: 1000 };

  it('grants magical-healing supply for MEDIUM magic (was silently missed)', () => {
    const low = deriveCapacityProfile('healing', {
      ...base, config: { priorityMagic: 10 }, // low band
    });
    const medium = deriveCapacityProfile('healing', {
      ...base, config: { priorityMagic: 45 }, // medium band (widest tier)
    });
    expect(medium.supply).toBeGreaterThan(low.supply);
    expect(medium.supplyContributors.some(c => /magic/i.test(c.source) && c.effect === 'medium')).toBe(true);
  });

  it('grants magical-healing supply for HIGH magic', () => {
    const low = deriveCapacityProfile('healing', {
      ...base, config: { priorityMagic: 10 },
    });
    const high = deriveCapacityProfile('healing', {
      ...base, config: { priorityMagic: 90 }, // high band
    });
    expect(high.supply).toBeGreaterThan(low.supply);
  });

  it('grants nothing extra in a dead-magic world', () => {
    const dead = deriveCapacityProfile('healing', {
      ...base, config: { magicExists: false, priorityMagic: 90 },
    });
    expect(dead.supplyContributors.some(c => /magicLevel/i.test(c.source))).toBe(false);
  });
});

// ── Finding 7: food_production trajectory sees worsening regional condition ─

describe('deriveFoodProduction — regional-pressure trajectory (Finding 7)', () => {
  it('reports worsening when a regional condition degrades a food chain', () => {
    // A worsening regional import shortage that matches a food chain should
    // both degrade the chain status AND surface as a trajectory contributor.
    const settlement = {
      population: 2000,
      supplyChains: [
        { chainId: 'grain', needKey: 'food_security', needLabel: 'Food', status: 'stable', label: 'Grain imports' },
      ],
      activeConditions: [
        {
          archetype: 'regional_import_shortage',
          severity: 0.7,
          status: 'worsening',
          label: 'Regional grain shortage',
          description: 'A regional supplier can no longer meet the food import need.',
        },
      ],
    };
    const food = deriveCapacityProfile('food_production', settlement);
    // The originating condition id must appear as a contributor source so the
    // trajectory join can see it.
    const condContrib = food.supplyContributors.some(c => c.effect === 'regional_pressure');
    expect(condContrib).toBe(true);
    expect(food.trajectory).toBe('worsening');
  });
});
