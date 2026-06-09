/**
 * tests/domain/canonicalAccessors.test.js — P1.3 canonical boundary.
 *
 * The substrate readers (deriveSystemState, causalState, capacityModel,
 * conditionPromotion) used to each re-derive the stressor/export/import alias
 * fallbacks — and at least one read a dead field (the capacityModel `exports`
 * bug). These accessors are the single resolution point; pin their contract.
 */

import { describe, it, expect } from 'vitest';
import { canonStressors, canonExports, canonImports } from '../../src/domain/canonicalAccessors.js';

describe('canonStressors', () => {
  it('reads the canonical `stressors` array', () => {
    const arr = [{ type: 'famine' }];
    expect(canonStressors({ stressors: arr })).toBe(arr);
  });
  it('falls back through stress then stresses', () => {
    expect(canonStressors({ stress: [{ type: 'plague' }] })).toEqual([{ type: 'plague' }]);
    expect(canonStressors({ stresses: [{ type: 'war' }] })).toEqual([{ type: 'war' }]);
  });
  it('wraps a single bare stressor object', () => {
    expect(canonStressors({ stress: { type: 'siege' } })).toEqual([{ type: 'siege' }]);
  });
  it('returns [] for missing / non-stressor shapes', () => {
    expect(canonStressors({})).toEqual([]);
    expect(canonStressors(null)).toEqual([]);
    expect(canonStressors(undefined)).toEqual([]);
  });
  it('prefers an array alias over a bare object', () => {
    expect(canonStressors({ stressors: [{ type: 'a' }], stress: { type: 'b' } }))
      .toEqual([{ type: 'a' }]);
  });
});

describe('canonExports / canonImports', () => {
  it('read the canonical primary* fields first', () => {
    expect(canonExports({ economicState: { primaryExports: ['grain'] } })).toEqual(['grain']);
    expect(canonImports({ economicState: { primaryImports: ['iron'] } })).toEqual(['iron']);
  });
  it('fall back to the legacy exports/imports aliases', () => {
    expect(canonExports({ economicState: { exports: ['wool'] } })).toEqual(['wool']);
    expect(canonImports({ economicState: { imports: ['salt'] } })).toEqual(['salt']);
  });
  it('prefer primary* when both are present', () => {
    expect(canonExports({ economicState: { primaryExports: ['a'], exports: ['b'] } })).toEqual(['a']);
    expect(canonImports({ economicState: { primaryImports: ['a'], imports: ['b'] } })).toEqual(['a']);
  });
  it('return [] when absent', () => {
    expect(canonExports({})).toEqual([]);
    expect(canonImports(null)).toEqual([]);
  });
});
