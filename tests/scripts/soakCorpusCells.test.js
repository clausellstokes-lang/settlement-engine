/**
 * tests/scripts/soakCorpusCells.test.js — the soak corpus draws its inputs independently
 * (lane SOAK-2, unit 5 "SOAK-3"; the chair's ruling of 2026-11-04 on the dependence pass's
 * finding: inside a tier the old matrix locked content profile to culture, V 0.975, and
 * terrain to the stress cell, V 0.634, so a culture effect could not be told from a
 * content-profile effect).
 *
 * scripts/audit/soak-review/corpus.mjs :: cellFor draws each dimension from the kernel's PRNG
 * keyed by (corpus seed, index, dimension), stratified only by tier; the stress cell is dealt
 * in shuffled rounds per tier so every cell keeps its share.
 */
import { describe, expect, it } from 'vitest';

import { cellFor, STRESS_CELLS } from '../../scripts/audit/soak-review/corpus.mjs';
import { TIER_ORDER } from '../../src/data/constants.js';

const N = 1000;

/**
 * Cramér's V pooled WITHIN tier: chi-square summed over the tiers, its expectation under
 * independence (the summed degrees of freedom) subtracted, over the summed n·(min(r,c) − 1).
 * Per-tier V at n ≈ 167 is too noisy to hold to 0.1: independent draws reach 0.234 by chance
 * (measured on this corpus). Even pooled, the largest tables (culture × threat, ~160 df) sit
 * at V ≈ 0.1 two standard deviations out, so a fixed V line is a coin toss at the noise edge.
 * The test therefore holds the pooled excess to its null: a Wilson–Hilferty z of the summed
 * chi-square on the summed df below 3.5 (one-sided p ≈ 2e-4 a pair, ~1% over all 55 pairs).
 * The old divisor matrix scores V 0.975 / z in the hundreds; the seed was never tuned to pass.
 */
function stratifiedV(tiers, xs, ys) {
  let chi = 0; let df = 0; let denom = 0;
  for (const t of new Set(tiers)) {
    const a = []; const b = []; tiers.forEach((tt, k) => { if (tt === t) { a.push(xs[k]); b.push(ys[k]); } });
    const ta = new Map(); const tb = new Map(); const tab = new Map();
    a.forEach((x, k) => { ta.set(x, (ta.get(x) || 0) + 1); tb.set(b[k], (tb.get(b[k]) || 0) + 1); const key = `${x}\u0000${b[k]}`; tab.set(key, (tab.get(key) || 0) + 1); });
    if (ta.size < 2 || tb.size < 2) continue;
    for (const [va, na] of ta) for (const [vb, nb] of tb) { const e = (na * nb) / a.length; chi += (((tab.get(`${va}\u0000${vb}`) || 0) - e) ** 2) / e; }
    df += (ta.size - 1) * (tb.size - 1); denom += a.length * (Math.min(ta.size, tb.size) - 1);
  }
  const v = denom ? Math.sqrt(Math.max(0, chi - df) / denom) : 0;
  const z = df ? ((chi / df) ** (1 / 3) - (1 - 2 / (9 * df))) / Math.sqrt(2 / (9 * df)) : 0;
  return { v, z };
}
const cells = Array.from({ length: N }, (_, i) => cellFor(i));
const band = (v) => String(Math.min(4, Math.floor(Number(v) / 20.2))); // a 0–100 slider in five bands
const DIMS = {
  culture: (c) => c.matrix.culture,
  terrain: (c) => c.matrix.terrainOverride,
  route: (c) => c.matrix.tradeRouteAccess,
  monsterThreat: (c) => c.matrix.monsterThreat,
  contentProfile: (c) => c.matrix.contentProfile,
  magicScenario: (c) => `${c.matrix.magicExists}/${c.matrix.priorityMagic}`,
  priorityEconomy: (c) => band(c.matrix.priorityEconomy),
  priorityMilitary: (c) => band(c.matrix.priorityMilitary),
  priorityReligion: (c) => band(c.matrix.priorityReligion),
  priorityCriminal: (c) => band(c.matrix.priorityCriminal),
  stressCell: (c) => (c.stressCell.startsWith('pair:') ? 'pair' : c.stressCell),
};

describe('soak corpus cells — independent inputs, stratified by tier', () => {
  it('no two input dimensions are associated within tier (pooled chi-square z < 3.5)', () => {
    const over = [];
    const names = Object.keys(DIMS);
    const tiers = cells.map((c) => c.matrix.settType);
    for (let a = 0; a < names.length; a += 1) {
      for (let b = a + 1; b < names.length; b += 1) {
        const { v, z } = stratifiedV(tiers, cells.map(DIMS[names[a]]).map(String), cells.map(DIMS[names[b]]).map(String));
        if (z >= 3.5) over.push(`${names[a]}~${names[b]} V ${v.toFixed(3)} z ${z.toFixed(1)}`);
      }
    }
    expect(over).toEqual([]);
  });

  it('every tier gets an equal share, and every stress cell appears ≥ 48 times and in every tier', () => {
    const byTier = Object.fromEntries(TIER_ORDER.map((t) => [t, cells.filter((c) => c.matrix.settType === t).length]));
    expect(Math.max(...Object.values(byTier)) - Math.min(...Object.values(byTier))).toBeLessThanOrEqual(1);
    const kinds = [...new Set(STRESS_CELLS)];
    for (const kind of kinds) {
      const of = cells.filter((c) => (kind === 'pair' ? c.stressCell.startsWith('pair:') : c.stressCell === kind));
      const want = STRESS_CELLS.filter((k) => k === kind).length * 48;
      expect(of.length, kind).toBeGreaterThanOrEqual(want);
      for (const t of TIER_ORDER) expect(of.filter((c) => c.matrix.settType === t).length, `${kind} in ${t}`).toBeGreaterThan(0);
    }
  });

  it('a cell is a pure function of its index, and the seed name stays soak1k-<i>', () => {
    expect(cellFor(417)).toEqual(cellFor(417));
    expect(cellFor(417).seed).toBe('soak1k-417');
  });
});
