/**
 * tests/domain/normalizeSettlement.test.js — Settlement-shape adapter contract.
 *
 * The adapter is the boundary between today's pipeline output and the
 * canonical schema. Every claim about it (idempotent, lossless on
 * round-trip, alias resolution, version stamping) is pinned here so
 * future migrations don't quietly regress the boundary.
 */

import { describe, it, expect } from 'vitest';
import { normalizeSettlement, isNormalized } from '../../src/domain/normalizeSettlement.js';
import {
  SCHEMA_VERSION,
  SIMULATION_VERSION,
  GENERATOR_VERSION,
} from '../../src/domain/settlement.schema.js';

const sampleLegacy = () => ({
  name: 'Greycairn',
  tier: 'town',
  population: 1240,
  _seed: 'seed-greycairn-001',
  institutions: [{ name: 'Town Watch' }],
  stress: 'plague',
  config: { terrain: 'plains' },
});

describe('normalizeSettlement()', () => {
  it('stamps version fields on a legacy settlement', () => {
    const out = normalizeSettlement(sampleLegacy());
    expect(out.schemaVersion).toBe(SCHEMA_VERSION);
    expect(out.simulationVersion).toBe(SIMULATION_VERSION);
    expect(out.generatorVersion).toBe(GENERATOR_VERSION);
  });

  it('does not overwrite existing version fields', () => {
    const out = normalizeSettlement({ ...sampleLegacy(), schemaVersion: 99 });
    expect(out.schemaVersion).toBe(99);
  });

  it('generates a stable id deterministically from the seed', () => {
    const a = normalizeSettlement(sampleLegacy());
    const b = normalizeSettlement(sampleLegacy());
    expect(a.id).toBe(b.id);
    expect(a.id).toMatch(/^s_[0-9a-f]{16}$/);
  });

  it('preserves an existing id over the seed-derived one', () => {
    const out = normalizeSettlement({ ...sampleLegacy(), id: 's_external' });
    expect(out.id).toBe('s_external');
  });

  it('falls back to a random id when no seed is present', () => {
    const out = normalizeSettlement({ name: 'Anonymous' });
    expect(out.id).toMatch(/^s_[0-9a-f]{16}$/);
  });

  it('resolves the stressors canonical from the legacy `stress` alias', () => {
    const out = normalizeSettlement(sampleLegacy());
    expect(out.stressors).toBe('plague');
    // Legacy alias is preserved — old readers still work.
    expect(out.stress).toBe('plague');
  });

  it('preserves the canonical key when both forms are present', () => {
    const out = normalizeSettlement({ ...sampleLegacy(), stressors: 'drought' });
    expect(out.stressors).toBe('drought');
  });

  it('defaults activeConditions / simulationTrace / aiOverlays to empty arrays', () => {
    const out = normalizeSettlement(sampleLegacy());
    expect(out.activeConditions).toEqual([]);
    expect(out.simulationTrace).toEqual([]);
    expect(out.aiOverlays).toEqual([]);
  });

  it('preserves existing values for the default containers', () => {
    const out = normalizeSettlement({
      ...sampleLegacy(),
      activeConditions: [{ id: 'condition.plague' }],
    });
    expect(out.activeConditions).toHaveLength(1);
  });

  it('defaults userCanon to {}', () => {
    const out = normalizeSettlement(sampleLegacy());
    expect(out.userCanon).toEqual({});
  });

  it('is idempotent — normalize(normalize(s)) deep-equals normalize(s)', () => {
    const once  = normalizeSettlement(sampleLegacy());
    const twice = normalizeSettlement(once);
    expect(twice).toEqual(once);
  });

  it('does not mutate the input', () => {
    const original = sampleLegacy();
    const before = JSON.stringify(original);
    normalizeSettlement(original);
    expect(JSON.stringify(original)).toBe(before);
  });

  it('passes unknown fields through untouched (forward-compat)', () => {
    const out = normalizeSettlement({
      ...sampleLegacy(),
      futureField: { someValue: 42 },
    });
    expect(out.futureField).toEqual({ someValue: 42 });
  });

  it('returns a minimal valid shape for nullish input', () => {
    const out = normalizeSettlement(null);
    expect(out.schemaVersion).toBe(SCHEMA_VERSION);
    expect(out.id).toMatch(/^s_/);
    expect(out.activeConditions).toEqual([]);
  });
});

describe('isNormalized()', () => {
  it('returns true for a normalized settlement', () => {
    expect(isNormalized(normalizeSettlement(sampleLegacy()))).toBe(true);
  });

  it('returns false for a raw legacy settlement', () => {
    expect(isNormalized(sampleLegacy())).toBe(false);
  });

  it('returns false for null / undefined / non-object', () => {
    expect(isNormalized(null)).toBe(false);
    expect(isNormalized(undefined)).toBe(false);
    expect(isNormalized('string')).toBe(false);
  });
});
