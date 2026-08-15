/**
 * customFoundingTraditions.test.js — WB-j genesis consumption. The view-consumer
 * wrapper that merges a DM's authored custom traditions into the founding set,
 * WITHOUT touching the golden-pinned pure leaf deriveFoundingTraditions.
 *
 * The load-bearing invariant: with no custom traditions the wrapper returns the
 * base set UNCHANGED (byte-identical), so traditionsDormancyGolden can never drift
 * from this lane. Also pins the adapter shape (campaign-time fields null; a seeded,
 * stable window in place of the absent authored date) and the lane wiring.
 */
import { describe, it, expect } from 'vitest';
import { adaptCustomTradition, mergeCustomFoundingTraditions } from '../../src/domain/traditions/customFounding.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { CATEGORY_BY_KEY } from '../../src/components/compendium/customCategoryDefs.js';
import { AUTHORING_LANES } from '../../src/components/compendium/customCategories.js';

const SETTLEMENT = { name: 'Saltmarch', _seed: 'wbj-merge-1', tier: 'town', config: {} };

describe('mergeCustomFoundingTraditions — golden-safety (empty ⇒ unchanged)', () => {
  it('returns the SAME base array when there are no custom traditions', () => {
    const base = deriveFoundingTraditions(SETTLEMENT);
    expect(mergeCustomFoundingTraditions(base, [])).toBe(base);
    expect(mergeCustomFoundingTraditions(base, undefined)).toBe(base);
    expect(mergeCustomFoundingTraditions(base, null)).toBe(base);
  });

  it('never mutates the base set', () => {
    const base = deriveFoundingTraditions(SETTLEMENT);
    const snapshot = JSON.stringify(base);
    mergeCustomFoundingTraditions(base, [{ id: 't1', name: 'The Salt Vigil' }]);
    expect(JSON.stringify(base)).toBe(snapshot);
  });

  it('appends adapted custom records after the derived founding set', () => {
    const base = deriveFoundingTraditions(SETTLEMENT);
    const merged = mergeCustomFoundingTraditions(base, [
      { id: 't1', name: 'The Salt Vigil', motifElement: 'tide', motifAct: 'vigil', epithet: 'kept since the first tide turned' },
    ]);
    expect(merged.length).toBe(base.length + 1);
    expect(merged.slice(0, base.length)).toEqual(base); // the founding set is untouched, in order
    expect(merged[merged.length - 1].name).toBe('The Salt Vigil');
  });
});

describe('adaptCustomTradition — the founding-record adapter', () => {
  it('maps the authored fields and nulls every campaign-time field', () => {
    const rec = adaptCustomTradition({ id: 'abc', name: 'The Salt Vigil', motifElement: 'tide', motifAct: 'vigil', epithet: 'flavour' });
    expect(rec.id).toBe('custom:abc');
    expect(rec.coreMotif).toEqual({ element: 'tide', act: 'vigil' });
    expect(rec.name).toBe('The Salt Vigil');
    expect(rec.expression.epithet).toBe('flavour');
    // ownership + outcomes exist only where time exists → null/empty in a preview
    expect(rec.ownerKey).toBeNull();
    expect(rec.ownerLabel).toBeNull();
    expect(rec.lastOutcome).toBeNull();
    expect(rec.lastHeldYear).toBeNull();
    expect(rec.mutationLog).toEqual([]);
    expect(rec.custom).toBe(true);
  });

  it('gives each tradition a stable, in-range seeded window (no authored date)', () => {
    const a = adaptCustomTradition({ id: 'abc', name: 'X' });
    const b = adaptCustomTradition({ id: 'abc', name: 'X' });
    expect(a.window).toEqual(b.window); // deterministic per id
    expect(a.window.startWeekOfYear).toBeGreaterThanOrEqual(1);
    expect(a.window.startWeekOfYear).toBeLessThanOrEqual(52);
    // a different tradition seeds a (generally) different week
    const c = adaptCustomTradition({ id: 'xyz', name: 'Y' });
    expect(typeof c.window.startWeekOfYear).toBe('number');
  });

  it('tolerates a bare-name tradition (motif optional)', () => {
    const rec = adaptCustomTradition({ id: 'bare', name: 'The Long Watch' });
    expect(rec.coreMotif).toEqual({ element: null, act: null });
    expect(rec.expression.epithet).toBe('');
  });
});

describe('WB-j lane wiring', () => {
  it('the traditions bucket is an authored category with the motif+epithet fields', () => {
    const cat = CATEGORY_BY_KEY.traditions;
    expect(cat).toBeTruthy();
    expect(cat.singular).toBe('Tradition');
    expect(cat.fields).toEqual(['name', 'motifElement', 'motifAct', 'epithet']);
  });

  it('the living authoring lane surfaces traditions', () => {
    const living = AUTHORING_LANES.find(l => l.key === 'living');
    expect(living.buckets).toContain('traditions');
  });
});
