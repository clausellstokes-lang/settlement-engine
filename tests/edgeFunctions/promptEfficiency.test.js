/**
 * tests/edgeFunctions/promptEfficiency.test.js — the TOKEN-EFFICIENCY edge primitives
 * (OWNER COMMISSION: AI TOKEN EFFICIENCY, 2026-07-17).
 *
 *   PIN A (COMPACT CANONICAL): canonicalJson sorts keys + drops nulls + no whitespace, and is
 *     byte-stable (same value ⇒ same bytes) — the substance is lossless, only nulls/punctuation go.
 *   PIN B (SLICE BUDGET): compactSlices caps slices to the task budget with a visible omission
 *     marker, and truncates an over-long slice visibly — never a silent grounding cut.
 *   PIN C (ANOMALY FLAG): overTokenBudget flags only past a positive budget.
 */
import { describe, it, expect } from 'vitest';
import { canonicalJson, compactSlices, overTokenBudget } from '../../supabase/functions/_shared/promptEfficiency.ts';

describe('promptEfficiency — canonical compact encoding (PIN A)', () => {
  it('sorts keys, drops null/undefined, no insignificant whitespace', () => {
    const a = canonicalJson({ b: 1, a: 2, z: null, nested: { y: null, x: 3 } });
    expect(a).toBe('{"a":2,"b":1,"nested":{"x":3}}');
  });

  it('is byte-stable regardless of key insertion order (cache-friendly)', () => {
    const one = canonicalJson({ name: 'Mira', role: 'smith', age: null });
    const two = canonicalJson({ age: null, role: 'smith', name: 'Mira' });
    expect(one).toBe(two);
    expect(one).toBe('{"name":"Mira","role":"smith"}');
  });

  it('keeps real substance — values are never dropped, only nulls/whitespace', () => {
    const out = canonicalJson({ id: 'n1', name: 'Mira', tags: ['smith', 'elder'] });
    expect(out).toContain('"id":"n1"');
    expect(out).toContain('"name":"Mira"');
    expect(out).toContain('"tags":["smith","elder"]');
  });
});

describe('promptEfficiency — slice budget (PIN B)', () => {
  const bundle = { slices: [
    { id: 's1', source: 'read:a', data: [{ id: 'x', v: 1 }] },
    { id: 's2', source: 'read:b', data: [{ id: 'y', v: 2 }] },
    { id: 's3', source: 'read:c', data: [{ id: 'z', v: 3 }] },
  ] };

  it('caps to maxSlices with a visible omission marker (never a silent cut)', () => {
    const { text, sliceCount, truncated } = compactSlices(bundle, { maxSlices: 2, maxChars: 1000 });
    expect(sliceCount).toBe(2);
    expect(truncated).toBe(true);
    expect(text).toContain('s1');
    expect(text).toContain('s2');
    expect(text).not.toContain('"id":"z"');
    expect(text).toContain('1 more slice(s) omitted');
  });

  it('truncates an over-long slice visibly, keeping the head of the grounding', () => {
    const big = { slices: [{ id: 's1', source: 'read:a', data: { blob: 'x'.repeat(5000) } }] };
    const { text, truncated } = compactSlices(big, { maxSlices: 4, maxChars: 100 });
    expect(truncated).toBe(true);
    expect(text).toContain('…(truncated)');
  });

  it('within budget: all slices, none truncated', () => {
    const { sliceCount, truncated } = compactSlices(bundle, { maxSlices: 6, maxChars: 2000 });
    expect(sliceCount).toBe(3);
    expect(truncated).toBe(false);
  });
});

describe('promptEfficiency — anomaly flag (PIN C)', () => {
  it('flags only a positive-budget overrun', () => {
    expect(overTokenBudget(15000, 12000)).toBe(true);
    expect(overTokenBudget(9000, 12000)).toBe(false);
    expect(overTokenBudget(9999, 0)).toBe(false);
    expect(overTokenBudget(null, 12000)).toBe(false);
  });
});
