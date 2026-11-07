/**
 * tests/domain/facts/registryResolution.test.js — CENSUS-1g unit 3 (R-AJ): ONE RESOLVER, NOT
 * PER-SITE FORKS. CENSUS-3e's `freshAdmittedTwin` (a refused row resolves to an UNUSED admitted
 * template, honouring the settlement's no-repeat registries, with no roll) lives in `drawDeclared`
 * as the `registry` option; the loyalty site's copy is retired.
 *
 * @enforced-by npx vitest run tests/domain/facts/registryResolution.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { drawDeclared } from '../../../src/domain/facts/drawDeclared.js';
import * as hookVariety from '../../../src/generators/hookVariety.js';

const POOL = Object.freeze([
  Object.freeze({ text: 'Guard the gate', needs: ['gate'] }),
  'Carry a letter', 'Mind the ledger', 'Watch the road',
]);
const noGate = { defence: { gate: false } };
const reg = () => ({ used: new Set(), keyFn: (x) => (typeof x === 'string' ? x : x.text), themes: new Set(), themeOfFn: () => 'untyped' });

describe('drawDeclared `registry` (R-AJ)', () => {
  it('a refused draw resolves to a fresh admitted template and registers it; two refusals never collide', () => {
    const r = reg();
    const a = drawDeclared(POOL, { draw: (p) => p[0], facts: noGate, poolId: 'p', registry: r });
    const b = drawDeclared(POOL, { draw: (p) => p[0], facts: noGate, poolId: 'p', registry: r });
    expect(a.resolvedBy).toBe('twin');
    expect(b.resolvedBy).toBe('twin');
    expect(a.text).not.toBe(b.text);
    expect(r.used.has(a.text) && r.used.has(b.text)).toBe(true);
  });
  it('without the registry the argmax keyed by the pool alone repeats', () => {
    const a = drawDeclared(POOL, { draw: (p) => p[0], facts: noGate, poolId: 'p' });
    const b = drawDeclared(POOL, { draw: (p) => p[0], facts: noGate, poolId: 'p' });
    expect(a.text).toBe(b.text);
  });
  it('nothing fresh: the argmax decides (the unavoidable repeat)', () => {
    const r = reg(); for (const l of POOL) r.used.add(r.keyFn(l));
    expect(drawDeclared(POOL, { draw: (p) => p[0], facts: noGate, poolId: 'p', registry: r }).resolvedBy).toBe('argmax');
  });
  it('an admitted draw is untouched and registers nothing new', () => {
    const r = reg();
    expect(drawDeclared(POOL, { draw: (p) => p[1], facts: noGate, poolId: 'p', registry: r })).toMatchObject({ text: 'Carry a letter', resolvedBy: 'drawn' });
    expect(r.used.size).toBe(0);
  });
});

describe('the per-site fork is retired', () => {
  it('hookVariety exports no freshAdmittedTwin; the loyalty site hands drawDeclared its registry', () => {
    expect(/** @type {any} */ (hookVariety).freshAdmittedTwin).toBeUndefined();
    const src = readFileSync(new URL('../../../src/generators/npcGenerator.js', import.meta.url), 'utf8');
    expect(src).toMatch(/const drawLoyalty = [^\n]*registry: \{ used: reg\?\.titles/);
    expect(src).not.toMatch(/freshAdmittedTwin\(/); // anchored: the loyalty site's registry hand-off is matched in this same source on the line above
  });
});
