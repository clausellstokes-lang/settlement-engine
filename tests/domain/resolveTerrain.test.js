/**
 * tests/domain/resolveTerrain.test.js — the ONE terrain read.
 *
 * Regression guard for the dead-path class: the engine persists resolved
 * terrain as `config.terrainType` (resolveConfig), but the simulation layer
 * read the never-written `config.terrain` — so the shelter and fortification
 * heuristics no-oped for every wizard-generated settlement. These tests pin
 * the resolution chain AND the two simulation readers end-to-end (the golden
 * corpora cannot see this: generation never calls mapProfile/attrition, and
 * the pulse fixture deploys no armies).
 */

import { describe, it, expect } from 'vitest';
import { resolveTerrain, resolveSettlementTerrain, terrainOrNull } from '../../src/domain/resolveTerrain.js';
import { deriveMapProfile } from '../../src/domain/mapProfile.js';
import { fortificationStrength } from '../../src/domain/worldPulse/attrition.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('resolveTerrain() chain', () => {
  it('terrainType wins over override and legacy terrain', () => {
    expect(resolveTerrain({ terrainType: 'mountain', terrainOverride: 'desert', terrain: 'swamp' }))
      .toBe('mountain');
  });

  it('falls back to terrainOverride when terrainType is absent', () => {
    expect(resolveTerrain({ terrainOverride: 'desert' })).toBe('desert');
  });

  it("ignores the 'auto' UI sentinel — it is not a terrain", () => {
    expect(resolveTerrain({ terrainOverride: 'auto' })).toBe(null);
    expect(resolveTerrain({ terrainOverride: 'auto', terrain: 'forest' })).toBe('forest');
  });

  it("never returns 'auto' regardless of which leg carries it (imported/hand-built data)", () => {
    expect(resolveTerrain({ terrainType: 'auto' })).toBe(null);
    expect(resolveTerrain({ terrain: 'auto' })).toBe(null);
    expect(resolveSettlementTerrain({ terrain: 'auto' })).toBe(null);
    expect(resolveSettlementTerrain({ geography: { terrain: 'auto' } })).toBe(null);
  });

  it('reads legacy config.terrain as the last resort', () => {
    expect(resolveTerrain({ terrain: 'swamp' })).toBe('swamp');
  });

  it('returns null for empty / missing configs', () => {
    expect(resolveTerrain({})).toBe(null);
    expect(resolveTerrain(null)).toBe(null);
    expect(resolveTerrain(undefined)).toBe(null);
  });
});

describe('terrainOrNull() — single-value sentinel guard', () => {
  it('passes a real terrain through', () => {
    expect(terrainOrNull('mountain')).toBe('mountain');
  });

  it("nulls the 'auto' sentinel (a stored gallery facet column can carry it)", () => {
    expect(terrainOrNull('auto')).toBe(null);
  });

  it('nulls empty / missing values', () => {
    expect(terrainOrNull('')).toBe(null);
    expect(terrainOrNull(null)).toBe(null);
    expect(terrainOrNull(undefined)).toBe(null);
  });
});

describe('resolveSettlementTerrain()', () => {
  it('unwraps a snapshot item ({ settlement })', () => {
    expect(resolveSettlementTerrain({ settlement: { config: { terrainType: 'coastal' } } }))
      .toBe('coastal');
  });

  it('accepts a bare settlement', () => {
    expect(resolveSettlementTerrain({ config: { terrainType: 'riverside' } })).toBe('riverside');
  });

  it('falls back to legacy top-level terrain, then geography.terrain', () => {
    expect(resolveSettlementTerrain({ terrain: 'hills' })).toBe('hills');
    expect(resolveSettlementTerrain({ geography: { terrain: 'desert' } })).toBe('desert');
  });

  it('returns null for nullish input', () => {
    expect(resolveSettlementTerrain(null)).toBe(null);
    expect(resolveSettlementTerrain({})).toBe(null);
  });
});

describe('mapProfile shelter reads the persisted terrain', () => {
  it('wizard-shaped settlement (terrainType only) gets terrain shelter', () => {
    const m = deriveMapProfile({ config: { terrainType: 'mountain' } });
    expect(['sheltered', 'fortified']).toContain(m.outputs.defensiveTerrain);
    expect(m.inputs.terrain).toBe('mountain');
  });

  it("terrainOverride 'auto' alone stays at the open baseline", () => {
    const m = deriveMapProfile({ config: { terrainOverride: 'auto' } });
    expect(m.outputs.defensiveTerrain).toBe('open');
    expect(m.inputs.terrain).toBe(null);
  });

  it('covers the full persisted vocabulary — every terrainType lands a band', () => {
    const expected = {
      plains:    'exposed',
      desert:    'exposed',
      hills:     'mixed',
      forest:    'mixed',
      riverside: 'mixed',
      coastal:   'mixed',
      mountain:  'sheltered',
    };
    for (const [terrainType, band] of Object.entries(expected)) {
      const m = deriveMapProfile({ config: { terrainType } });
      expect(m.outputs.defensiveTerrain, terrainType).toBe(band);
    }
  });

  it("the 'auto' sentinel persists on non-random_trade routes and never wins the read", () => {
    // The literal regression surface: resolveConfig persists terrainOverride
    // VERBATIM when the route is not random_trade, so the default wizard config
    // ('auto' + road) carries BOTH terrainType:'plains' AND terrainOverride:'auto'.
    // If this shape ever stops holding, the sentinel-leak class comes back.
    const s = generateSettlementPipeline(
      { settType: 'village', culture: 'germanic', terrainOverride: 'auto', tradeRouteAccess: 'road' },
      null,
      { seed: 'resolve-terrain-auto', customContent: {} },
    );
    expect(s.config.terrainOverride).toBe('auto');
    expect(s.config.terrainType).toBe('plains');
    expect(resolveTerrain(s.config)).toBe('plains');
    expect(deriveMapProfile(s).inputs.terrain).toBe('plains');
  });

  it('a real pipeline settlement produces a terrain contributor (was structurally impossible)', () => {
    const s = generateSettlementPipeline(
      { settType: 'village', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' },
      null,
      { seed: 'resolve-terrain-real', customContent: {} },
    );
    expect(s.config.terrainType).toBe('mountain');
    const m = deriveMapProfile(s);
    expect(m.contributors.some((c) => c.source === 'config.terrainType')).toBe(true);
    expect(m.inputs.terrain).toBe('mountain');
  });
});

describe('attrition fortification reads the persisted terrain', () => {
  const facets = { institutions: 50 };

  it('a mountain terrainType deepens the defensive advantage', () => {
    const mountain = fortificationStrength(facets, { settlement: { config: { terrainType: 'mountain' } } });
    const plains   = fortificationStrength(facets, { settlement: { config: { terrainType: 'plains' } } });
    expect(mountain).toBeGreaterThan(plains);
    expect(plains).toBe(fortificationStrength(facets, null));
  });

  it("terrainOverride 'auto' grants no terrain bonus", () => {
    const auto = fortificationStrength(facets, { settlement: { config: { terrainOverride: 'auto' } } });
    expect(auto).toBe(fortificationStrength(facets, null));
  });

  it('legacy config.terrain still resolves (hand-built fixtures)', () => {
    const marsh = fortificationStrength(facets, { settlement: { config: { terrain: 'marsh' } } });
    expect(marsh).toBeGreaterThan(fortificationStrength(facets, null));
  });
});
