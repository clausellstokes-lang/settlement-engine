/**
 * archLodLadder.walker.test.js -- K-1 SPINE (lodLadder.walker): the LOD-tier totality + silhouette law.
 *
 * Extends the townMapMassingSilhouette walker to the 3D kernel. Two totalities:
 *   1. LOD-LADDER: the cathedral builds at EVERY LOD tier (glyph/commons/signature); detail is
 *      monotone non-decreasing; and the FOOTPRINT + RIDGE AGREE across tiers -- pops change detail,
 *      never the shape (the institution-silhouette law, lifted to 3D). A tier that changed the
 *      footprint or vanished reds here rather than silently popping wrong on the map.
 *   2. RULESET REGISTRATION: every ruleset file in arch/rulesets/ is a KNOWN, walked ruleset. A NEW
 *      ruleset that lands with no walker coverage REDS (deposit-and-consume) rather than shipping an
 *      un-budgeted, un-LOD-checked kind.
 *
 * E-A: its removing power is proven by scripts/mutation-sweep.sh (label "kernel/unwalked arch
 * ruleset" -- a planted ruleset file with no coverage must red the registration totality below).
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { buildArchMesh } from '../../src/domain/townMap/arch/emitter.js';
import { LOD_TIERS } from '../../src/domain/townMap/arch/grammarIR.js';
import { cathedralRuleset } from '../../src/domain/townMap/arch/rulesets/cathedral.js';
import { roseWindowRuleset } from '../../src/domain/townMap/arch/rulesets/roseWindow.js';
import { vaultBayRuleset } from '../../src/domain/townMap/arch/rulesets/vaultBay.js';
import { traceryFamiliesRuleset } from '../../src/domain/townMap/arch/rulesets/traceryFamilies.js';
import { evilChapelRuleset } from '../../src/domain/townMap/arch/rulesets/evilChapel.js';

const RULESET_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/townMap/arch/rulesets');
// Every ruleset file in arch/rulesets/ must be listed here AND covered by an LOD/parity walk below.
const KNOWN_RULESETS = ['buttressFragment.js', 'cathedral.js', 'evilChapel.js', 'roseWindow.js', 'traceryFamilies.js', 'vaultBay.js'];

describe('LOD-ladder totality (the 3D institution-silhouette law)', () => {
  const rs = cathedralRuleset();
  const built = LOD_TIERS.map((tier) => ({ tier, g: buildArchMesh(rs, { seedId: 'k1', tier }) }));

  it('guard-the-guard: three LOD tiers, all non-empty', () => {
    expect(LOD_TIERS).toEqual([0, 1, 2]);
    for (const { g } of built) expect(g.triangleCount).toBeGreaterThan(0);
  });

  it('TOTALITY: detail is monotone non-decreasing from glyph -> commons -> signature', () => {
    for (let i = 1; i < built.length; i++) expect(built[i].g.triangleCount).toBeGreaterThanOrEqual(built[i - 1].g.triangleCount);
  });

  it('SILHOUETTE AGREEMENT: footprint (x,z) + ridge (max y) agree across tiers (pops change detail, not shape)', () => {
    const sig = built[built.length - 1].g;
    const foot = (g) => [g.min[0], g.min[2], g.max[0], g.max[2], g.max[1]];
    for (const { tier, g } of built) {
      const f = foot(g), s = foot(sig);
      for (let k = 0; k < 5; k++) {
        expect(Math.abs(f[k] - s[k]), `tier ${tier} silhouette component ${k} diverged from signature`).toBeLessThan(1);
      }
    }
  });
});

// ── K-3 ORNAMENT rulesets: the same LOD-ladder + silhouette law, with a swept-curve tolerance. ─────
// The K-1 cathedral holds <1 because its AABB-defining shell is box-identical across tiers. The K-3
// rulesets are AABB-defined by SWEPT CURVES (rings / rib arches); coarse-vs-fine LOD tessellation
// shifts the tube-cap FLOAT extremes by a few units on a ~200-unit element -- the footprint + ridge
// SHAPE agree, the exact extreme wobbles. A proportional tolerance is the honest expression of the law
// for swept geometry (measured 2026-07-21: rose maxΔ=1, vault maxΔ=2, tracery maxΔ<1, chapel Δ=0).
const K3_RULESETS = [
  { name: 'rose-window', rs: roseWindowRuleset() },
  { name: 'vault-bay', rs: vaultBayRuleset() },
  { name: 'tracery-families', rs: traceryFamiliesRuleset() },
  { name: 'evil-chapel', rs: evilChapelRuleset() },
];
describe('K-3 ornament LOD-ladder totality (swept-curve silhouette law)', () => {
  for (const { name, rs } of K3_RULESETS) {
    const built = LOD_TIERS.map((tier) => ({ tier, g: buildArchMesh(rs, { seedId: 'k3', tier }) }));
    it(`${name}: three LOD tiers, all non-empty`, () => { for (const { g } of built) expect(g.triangleCount).toBeGreaterThan(0); });
    it(`${name}: detail monotone non-decreasing glyph -> commons -> signature`, () => {
      for (let i = 1; i < built.length; i++) expect(built[i].g.triangleCount).toBeGreaterThanOrEqual(built[i - 1].g.triangleCount);
    });
    it(`${name}: footprint + ridge agree across tiers (swept-curve tolerance, proportional)`, () => {
      const sig = built[built.length - 1].g;
      const dim = Math.max(sig.max[0] - sig.min[0], sig.max[1] - sig.min[1], sig.max[2] - sig.min[2]);
      const tol = Math.max(3, dim * 0.02); // >= 3 units, or 2% of the element -- shape, not float
      const foot = (g) => [g.min[0], g.min[2], g.max[0], g.max[2], g.max[1]];
      for (const { tier, g } of built) {
        const f = foot(g), s = foot(sig);
        for (let k = 0; k < 5; k++) expect(Math.abs(f[k] - s[k]), `${name} tier ${tier} silhouette component ${k} diverged`).toBeLessThan(tol);
      }
    });
  }
});

describe('ruleset registration totality (deposit-and-consume)', () => {
  it('every arch/rulesets/*.js is a KNOWN, walked ruleset (a new one with no coverage REDS)', () => {
    const actual = readdirSync(RULESET_DIR).filter((f) => f.endsWith('.js')).sort();
    expect(
      actual,
      `\nRuleset file set changed. A NEW ruleset under arch/rulesets/ must be added to KNOWN_RULESETS `
      + `AND given an LOD-ladder + mesh-budget walk (never shipped un-LOD-checked):\n${actual.join('\n')}\n`,
    ).toEqual([...KNOWN_RULESETS].sort());
  });
});
