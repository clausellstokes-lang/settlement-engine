/**
 * tests/domain/mapProfile.test.js — Tier 4.14 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveMapProfile,
  roadImportanceBands,
  defensiveTerrainBands,
  summarizeMap,
} from '../../src/domain/mapProfile.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('catalog', () => {
  it('exposes canonical band lists', () => {
    expect(roadImportanceBands()).toEqual(['low', 'moderate', 'major', 'critical']);
    expect(defensiveTerrainBands()).toEqual(['exposed', 'open', 'mixed', 'sheltered', 'fortified']);
  });
});

describe('deriveMapProfile()', () => {
  it('returns canonical shape with inputs + outputs', () => {
    const m = deriveMapProfile({ config: { terrain: 'forest', tradeRouteAccess: 'road' } });
    expect(m).toHaveProperty('inputs');
    expect(m).toHaveProperty('outputs');
    expect(m.outputs).toHaveProperty('roadImportance');
    expect(m.outputs).toHaveProperty('defensiveTerrain');
    expect(m.outputs).toHaveProperty('regionalAuthority');
    expect(m.outputs).toHaveProperty('hazardMarkers');
    expect(m.outputs).toHaveProperty('suggestedFeatures');
  });

  it('returns the empty shape for nullish settlement', () => {
    const m = deriveMapProfile(null);
    expect(m.outputs.roadImportance).toBe('low');
    expect(m.outputs.defensiveTerrain).toBe('open');
    expect(m.outputs.hazardMarkers).toEqual([]);
  });

  it('inputs mirror config fields', () => {
    const m = deriveMapProfile({
      config: { terrain: 'mountain', biome: 'taiga', tradeRouteAccess: 'major' },
    });
    expect(m.inputs.terrain).toBe('mountain');
    expect(m.inputs.biome).toBe('taiga');
    expect(m.inputs.tradeRouteAccess).toBe('major');
  });
});

describe('roadImportance direction', () => {
  it('major trade route → critical or major', () => {
    const m = deriveMapProfile({ config: { tradeRouteAccess: 'major' } });
    expect(['major', 'critical']).toContain(m.outputs.roadImportance);
  });

  it('no trade access → low or moderate', () => {
    const m = deriveMapProfile({ config: { tradeRouteAccess: 'none' } });
    expect(['low', 'moderate']).toContain(m.outputs.roadImportance);
  });
});

describe('defensiveTerrain direction', () => {
  it('mountain terrain → sheltered or fortified', () => {
    const m = deriveMapProfile({ config: { terrain: 'mountain' } });
    expect(['sheltered', 'fortified', 'mixed']).toContain(m.outputs.defensiveTerrain);
  });

  it('plain terrain → exposed', () => {
    const m = deriveMapProfile({ config: { terrain: 'plain' } });
    expect(m.outputs.defensiveTerrain).toBe('exposed');
  });

  it('walls present elevate to sheltered+', () => {
    const m = deriveMapProfile({
      config: { terrain: 'plain' },
      institutions: [{ name: 'City Wall' }],
    });
    const bands = defensiveTerrainBands();
    expect(bands.indexOf(m.outputs.defensiveTerrain)).toBeGreaterThanOrEqual(bands.indexOf('sheltered'));
  });
});

describe('regionalAuthority detection', () => {
  it('tax_authority neighbour appears as authority', () => {
    const m = deriveMapProfile({
      neighbours: [{ name: 'The Crown', relationshipType: 'vassal' }],
    });
    expect(m.outputs.regionalAuthority.some(a => a.relationshipType === 'tax_authority')).toBe(true);
  });

  it('protector neighbour appears as authority', () => {
    const m = deriveMapProfile({
      neighbours: [{ name: 'Northern Garrison', relationshipType: 'ally' }],
    });
    expect(m.outputs.regionalAuthority.some(a => a.relationshipType === 'protector')).toBe(true);
  });

  it('rival neighbour does NOT appear as authority', () => {
    const m = deriveMapProfile({
      neighbours: [{ name: 'Rival', relationshipType: 'hostile' }],
    });
    expect(m.outputs.regionalAuthority.length).toBe(0);
  });
});

describe('hazardMarkers', () => {
  it('plagued monster threat produces a hazard marker', () => {
    const m = deriveMapProfile({ config: { monsterThreat: 'plagued' } });
    expect(m.outputs.hazardMarkers.length).toBeGreaterThan(0);
    expect(m.outputs.hazardMarkers[0]).toHaveProperty('kind');
    expect(m.outputs.hazardMarkers[0]).toHaveProperty('severityBand');
  });

  it('safe settlement produces no hazard markers', () => {
    const m = deriveMapProfile({ config: { monsterThreat: 'safe' } });
    expect(m.outputs.hazardMarkers).toEqual([]);
  });
});

describe('suggestedFeatures', () => {
  it('high trade connectivity suggests major_road', () => {
    const m = deriveMapProfile({
      config: { tradeRouteAccess: 'major' },
    });
    // road_importance critical implies a major road feature too.
    const features = m.outputs.suggestedFeatures.map(f => f.feature);
    expect(features.includes('major_road') || m.outputs.roadImportance === 'critical').toBe(true);
  });
});

describe('summarizeMap()', () => {
  it('emits 6 lines for any settlement', () => {
    const lines = summarizeMap({ config: { terrain: 'forest' } });
    expect(lines).toHaveLength(6);
  });
});

describe('purity + smoke', () => {
  it('does not mutate input settlement', () => {
    const s = {
      config: { terrain: 'mountain', tradeRouteAccess: 'major', monsterThreat: 'frontier' },
      neighbours: [{ name: 'Crown', relationshipType: 'vassal' }],
    };
    const before = JSON.stringify(s);
    deriveMapProfile(s);
    summarizeMap(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'map-real-city', customContent: {} },
    );
    const m = deriveMapProfile(settlement);
    expect(m).toBeTruthy();
    expect(roadImportanceBands()).toContain(m.outputs.roadImportance);
    expect(defensiveTerrainBands()).toContain(m.outputs.defensiveTerrain);
  });
});
