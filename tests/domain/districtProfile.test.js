/**
 * tests/domain/districtProfile.test.js — Tier 4.9 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  DISTRICT_CATEGORIES,
  deriveDistrictProfile,
  deriveAllDistricts,
  districtBands,
  supportedDistrictCategories,
  summarizeDistricts,
} from '../../src/domain/districtProfile.js';
import {
  EXPLAINABLE_TYPES,
  explainEntity,
  explainDistrict,
  entityCatalog,
} from '../../src/domain/explanation.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

function fixture() {
  return {
    name: 'Greycairn',
    tier: 'city',
    population: 8000,
    economicState: { prosperity: { tier: 'Modest' } },
    config: { tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Town Granary' },
      { id: 'institution.temple',  name: 'Temple of Light' },
      { id: 'institution.watch',   name: 'Town Watch' },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.council',   faction: 'Council',   name: 'Council',   power: 35 },
        { id: 'faction.merchants', faction: 'Merchant Guilds', name: 'Merchant Guilds', power: 50 },
        { id: 'faction.religious', faction: 'Religious Authorities', name: 'Religious Authorities', power: 30 },
      ],
    },
    spatialLayout: {
      quarters: [
        { name: 'Religious Quarter', location: 'Eastern district', desc: 'Churches and quiet streets',
          landmarks: ['Temple of Light'] },
        { name: 'Merchant Quarter',  location: 'Central',           desc: 'Market stalls and warehouses',
          landmarks: ['Market square'] },
        { name: 'Slums',             location: 'Southern',          desc: 'Crowded tenements; thieves know it',
          landmarks: [] },
      ],
    },
    activeConditions: [],
  };
}

describe('catalog', () => {
  it('exposes 12 canonical categories', () => {
    expect(DISTRICT_CATEGORIES).toEqual([
      'religious', 'merchant', 'military', 'craft',
      'residential', 'noble', 'civic', 'arcane',
      'criminal', 'foreign', 'industrial', 'other',
    ]);
    expect(supportedDistrictCategories()).toEqual([...DISTRICT_CATEGORIES]);
  });

  it('exposes wealth + safety bands', () => {
    const b = districtBands();
    expect(b.wealth.length).toBeGreaterThan(0);
    expect(b.safety.length).toBeGreaterThan(0);
  });
});

describe('deriveDistrictProfile()', () => {
  it('religious quarter classifies as religious + dominant religious faction', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d.category).toBe('religious');
    expect(d.dominantFaction?.archetype).toBe('religious');
  });

  it('merchant quarter classifies as merchant + dominant merchant faction', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[1], s);
    expect(d.category).toBe('merchant');
    expect(d.dominantFaction?.archetype).toBe('merchant');
  });

  it('slums classify as criminal with degraded safety', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[2], s);
    expect(d.category).toBe('criminal');
    expect(['lawless', 'unsafe']).toContain(d.safety);
  });

  it('produces the canonical shape', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d).toHaveProperty('id');
    expect(d).toHaveProperty('name');
    expect(d).toHaveProperty('category');
    expect(d).toHaveProperty('wealth');
    expect(d).toHaveProperty('safety');
    expect(d).toHaveProperty('dominantFaction');
    expect(d).toHaveProperty('institutions');
    expect(d).toHaveProperty('services');
    expect(d).toHaveProperty('sensoryIdentity');
    expect(d).toHaveProperty('currentTension');
    expect(d).toHaveProperty('hook');
    expect(Array.isArray(d.connectedDistricts)).toBe(true);
    expect(Array.isArray(d.contributors)).toBe(true);
  });

  it('returns null for nullish input', () => {
    expect(deriveDistrictProfile(null, {})).toBeNull();
    expect(deriveDistrictProfile({ name: 'X' }, null)).toBeNull();
  });

  it('plague active condition surfaces as religious tension', () => {
    const s = { ...fixture(), activeConditions: [{ archetype: 'plague', severity: 0.7 }] };
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d.currentTension.toLowerCase()).toMatch(/plague|relief|temple/);
  });

  it('connectedDistricts lists other quarters', () => {
    const s = fixture();
    const d = deriveDistrictProfile(s.spatialLayout.quarters[0], s);
    expect(d.connectedDistricts).toContain('Merchant Quarter');
    expect(d.connectedDistricts).toContain('Slums');
    expect(d.connectedDistricts).not.toContain('Religious Quarter');
  });
});

describe('deriveAllDistricts()', () => {
  it('returns one district per quarter', () => {
    const s = fixture();
    const all = deriveAllDistricts(s);
    expect(all).toHaveLength(s.spatialLayout.quarters.length);
  });

  it('returns [] for settlement without quarters', () => {
    expect(deriveAllDistricts({})).toEqual([]);
  });
});

describe('Phase 19 wiring', () => {
  it('EXPLAINABLE_TYPES includes district', () => {
    expect(EXPLAINABLE_TYPES).toContain('district');
  });

  it('entityCatalog enumerates districts', () => {
    const cat = entityCatalog(fixture());
    expect(cat.some(e => e.type === 'district')).toBe(true);
  });

  it('explainDistrict returns canonical envelope', () => {
    const s = fixture();
    const id = `district.${'Religious Quarter'.toLowerCase().replace(/\s+/g, '_')}`;
    const env = explainDistrict(s, id);
    expect(env.entityType).toBe('district');
    expect(env.profile.category).toBe('religious');
    expect(env.causes.length).toBeGreaterThan(0);
  });

  it('dispatcher routes district.* ids', () => {
    const s = fixture();
    const env = explainEntity(s, 'district.religious_quarter');
    expect(env.entityType).toBe('district');
  });
});

describe('purity + smoke', () => {
  it('does not mutate input settlement', () => {
    const s = fixture();
    const before = JSON.stringify(s);
    deriveAllDistricts(s);
    summarizeDistricts(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'district-real-city', customContent: {} },
    );
    const all = deriveAllDistricts(settlement);
    expect(Array.isArray(all)).toBe(true);
    for (const d of all) {
      expect(DISTRICT_CATEGORIES).toContain(d.category);
    }
  });
});
