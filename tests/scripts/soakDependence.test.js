/**
 * tests/scripts/soakDependence.test.js — the soak's dependence scan, second pass (lane SOAK-2,
 * unit 2; docs/SOAK_1000_2026-11-03.md §3 "This is where I stopped").
 *
 * scripts/audit/soak-review/dependence.mjs :: secondPass reads every pair WITHIN tier and pools,
 * drops copies (raw |v| ≥ 0.98 or the same leaf key) to their own list, and re-reads the
 * engine's chains on the residual. Hand-built columns, so each verdict is known in advance.
 */
import { describe, expect, it } from 'vitest';

import { secondPass, residualDependence, isCopy, leafOf } from '../../scripts/audit/soak-review/dependence.mjs';
import { dependence } from '../../scripts/audit/soak-review/dependence-measures.mjs';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PER = 60;
const N = TIERS.length * PER;
const tierOf = Array.from({ length: N }, (_, k) => TIERS[Math.floor(k / PER)]);
const seeds = Array.from({ length: N }, (_, k) => `s-${k}`);
// A deterministic jitter in [0, 1): no rng, so the case is the same every run.
const jitter = (k, salt) => { const x = Math.sin((k + 1) * 12.9898 + salt * 78.233) * 43758.5453; return x - Math.floor(x); };
const tierIdx = (k) => Math.floor(k / PER);

// Two tier steps that know nothing of each other inside a tier.
const stepA = Array.from({ length: N }, (_, k) => tierIdx(k) * 100 + jitter(k, 1) * 10);
const stepB = Array.from({ length: N }, (_, k) => tierIdx(k) * 50 + jitter(k, 2) * 10);
// A real within-tier relation, on top of the tier step.
// Its raw value is ≥ 0.98 (the step dominates), so only a within-tier copy threshold keeps it.
const linked = Array.from({ length: N }, (_, k) => stepA[k] + jitter(k, 3) * 6);
// A copy of stepA under another name.
const copyOfA = stepA.slice();

describe('soak dependence, second pass', () => {
  it('two tier steps score high on the raw scan and near zero within tier', () => {
    expect(Math.abs(dependence(stepA, stepB).value)).toBeGreaterThan(0.9);
    const res = residualDependence(stepA, stepB, tierOf);
    expect(Math.abs(res.pooled)).toBeLessThan(0.3);
    expect(Object.keys(res.byTier)).toEqual(TIERS);
  });

  it('a relation that holds inside every tier survives the residual pass', () => {
    expect(Math.abs(dependence(stepA, linked).value)).toBeGreaterThan(0.98);
    const pooled = residualDependence(stepA, linked, tierOf).pooled;
    expect(pooled).toBeGreaterThan(0.6);
    expect(pooled).toBeLessThan(0.98);
  });

  it('a tier where a column is constant contributes nothing to the pool', () => {
    const flatInThorps = stepA.map((v, k) => (tierOf[k] === 'thorp' ? 7 : v));
    expect(Object.keys(residualDependence(flatInThorps, linked, tierOf).byTier).length).toBeGreaterThan(0);
    expect(Object.keys(residualDependence(flatInThorps, linked, tierOf).byTier)).not.toContain('thorp'); // anchored: the line above proves the other tiers still contribute
  });

  it('copies are named by the raw threshold or the same leaf', () => {
    expect(leafOf('economicState.prosperity')).toBe('prosperity');
    expect(leafOf('npcs[].age:mean')).toBe('age');
    expect(isCopy('economicState.prosperity', 'chain.prosperity', 0.3).copy).toBe(true);
    expect(isCopy('a.x', 'b.y', 0.985).copy, 'a within-tier value at the threshold').toBe(true);
    expect(isCopy('a.x', 'b.y', 0.9).copy).toBe(false);
  });

  it('secondPass lists the copy apart, keeps the real relation as a surprise, drops the tier steps, and reads a chain on the residual', () => {
    const cols = { 'fam1.stepA': stepA, 'fam2.stepB': stepB, 'fam3.linked': linked, 'fam4.copyOfA': copyOfA, 'chain.tier': tierOf };
    const chains = [
      { id: 'T1', from: 'fam1.stepA', to: 'fam2.stepB', expect: 'strong', rule: 'hand :: steps' },
      { id: 'T2', from: 'chain.tier', to: 'fam1.stepA', expect: 'strong', rule: 'hand :: tier' },
    ];
    const out = secondPass({ cand: Object.keys(cols).filter((p) => p !== 'chain.tier'), col: (p) => cols[p], tierOf, seeds, chains });
    const names = (rows) => rows.map((r) => `${r.a}~${r.b}`);
    expect(names(out.copies)).toContain('fam1.stepA~fam4.copyOfA');
    expect(names(out.surprisesA)).toContain('fam1.stepA~fam3.linked');
    expect(names(out.surprisesA)).not.toContain('fam1.stepA~fam2.stepB'); // anchored: the line above pins fam3.linked in this same surprise list
    expect(names(out.surprisesA)).not.toContain('fam1.stepA~fam4.copyOfA'); // anchored: two lines up pins fam3.linked in this same surprise list
    const linkedRow = out.surprisesA.find((r) => r.a === 'fam1.stepA' && r.b === 'fam3.linked');
    expect(linkedRow.witness.seeds).toHaveLength(3);
    // The chain the hand-built engine "promises" is absent once tier is held still: kind (b).
    expect(out.surprisesB.map((c) => c.id)).toEqual(['T1']);
    expect(out.chainsResidual.find((c) => c.id === 'T2').verdict).toBe('no residual (tier is the cause)');
  });

  it('a surprise whose two sides both follow one generation input is marked with that input', () => {
    const dial = Array.from({ length: N }, (_, k) => Math.round(jitter(k, 9) * 100));
    const first = dial.map((v, k) => v + jitter(k, 10) * 45);
    const second = dial.map((v, k) => v * 2 + jitter(k, 11) * 90);
    const cols = { 'config.priorityEconomy': dial, 'fam5.first': first, 'fam6.second': second };
    const out = secondPass({ cand: ['fam5.first', 'fam6.second'], col: (p) => cols[p], tierOf, seeds, chains: [] });
    const row = out.surprisesA.find((r) => r.a === 'fam5.first' && r.b === 'fam6.second');
    expect(row.commonInput?.input).toBe('config.priorityEconomy');
    expect(out.surprisesA.find((r) => r.a === 'fam1.stepA')).toBeUndefined();
  });
});
