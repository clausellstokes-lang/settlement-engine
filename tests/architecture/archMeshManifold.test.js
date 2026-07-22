/**
 * archMeshManifold.test.js -- K-1 SPINE (meshManifold): watertightness + non-degeneracy.
 *
 * Every K-1 terminal is emitted from an individually CLOSED mesh primitive (box / spire / n-gon
 * prism / profile-sweep / extruded-convex), so any assembly of them has ZERO boundary (odd-
 * multiplicity) edges by construction -- the watertight-ish gate the K-0b cathedral holds. This pins
 * it for the grammar cathedral at all three LOD tiers + the byte-parity buttress: boundary-edge
 * parity = 0, zero NaN in positions/normals/AO, and no degenerate index triangles.
 */
import { describe, it, expect } from 'vitest';
import { emitMesh, buildArchMesh } from '../../src/domain/townMap/arch/emitter.js';
import { interpret } from '../../src/domain/townMap/arch/interpreter.js';
import { cathedralRuleset } from '../../src/domain/townMap/arch/rulesets/cathedral.js';
import { buttressRuleset } from '../../src/domain/townMap/arch/rulesets/buttressFragment.js';
import { roseWindowRuleset } from '../../src/domain/townMap/arch/rulesets/roseWindow.js';
import { vaultBayRuleset } from '../../src/domain/townMap/arch/rulesets/vaultBay.js';
import { traceryFamiliesRuleset } from '../../src/domain/townMap/arch/rulesets/traceryFamilies.js';
import { evilChapelRuleset } from '../../src/domain/townMap/arch/rulesets/evilChapel.js';

/** odd-multiplicity (boundary) edge count over quantized positions. */
function boundaryOdd(geo) {
  const key = (i) => `${geo.positions[i * 3].toFixed(3)},${geo.positions[i * 3 + 1].toFixed(3)},${geo.positions[i * 3 + 2].toFixed(3)}`;
  const edges = new Map();
  for (let t = 0; t < geo.indices.length; t += 3) {
    const v = [geo.indices[t], geo.indices[t + 1], geo.indices[t + 2]].map(key);
    for (let e = 0; e < 3; e++) { const p = [v[e], v[(e + 1) % 3]].sort(); const k = `${p[0]}|${p[1]}`; edges.set(k, (edges.get(k) || 0) + 1); }
  }
  let odd = 0; for (const c of edges.values()) if (c % 2) odd++;
  return { odd, total: edges.size };
}
function anyNaN(arr) { for (let i = 0; i < arr.length; i++) if (Number.isNaN(arr[i])) return true; return false; }
function degenerate(geo) { let d = 0; for (let t = 0; t < geo.indices.length; t += 3) { const a = geo.indices[t], b = geo.indices[t + 1], c = geo.indices[t + 2]; if (a === b || b === c || a === c) d++; } return d; }

describe('the grammar cathedral is a watertight, non-degenerate solid at every tier', () => {
  const rs = cathedralRuleset();
  for (const tier of [0, 1, 2]) {
    const g = buildArchMesh(rs, { seedId: 'k1', tier });
    it(`tier ${tier}: zero boundary edges (watertight)`, () => {
      const { odd, total } = boundaryOdd(g);
      expect(total).toBeGreaterThan(50);
      expect(odd).toBe(0);
    });
    it(`tier ${tier}: no NaN in positions / normals / AO`, () => {
      expect(anyNaN(g.positions) || anyNaN(g.normals) || anyNaN(g.ao)).toBe(false);
    });
    it(`tier ${tier}: no degenerate index triangles`, () => expect(degenerate(g)).toBe(0));
    it(`tier ${tier}: every normal is unit-length within tolerance`, () => {
      let maxErr = 0;
      for (let i = 0; i < g.normals.length; i += 3) { const m = Math.sqrt(g.normals[i] * g.normals[i] + g.normals[i + 1] * g.normals[i + 1] + g.normals[i + 2] * g.normals[i + 2]); const e = Math.abs(m - 1); if (e > maxErr) maxErr = e; }
      expect(maxErr).toBeLessThan(1e-3);
    });
  }
});

describe('the byte-parity buttress is watertight', () => {
  const g = emitMesh(interpret(buttressRuleset(20, 49, 1), { tier: 2 }).terminals);
  it('zero boundary edges', () => expect(boundaryOdd(g).odd).toBe(0));
  it('AO is bounded in [0,1]', () => { let ok = true; for (const v of g.ao) if (v < 0 || v > 1) ok = false; expect(ok).toBe(true); });
});

// ── K-3 ORNAMENT rulesets: every element is a closed primitive (sweep / extrudeConvex / box / spire /
// prism), so each assembly is watertight at every tier -- the instanced statuary + swept tracery + rib
// tubes never open a boundary edge. ─────────────────────────────────────────────────────────────────
const K3_RULESETS = [
  { name: 'rose-window', rs: roseWindowRuleset() },
  { name: 'vault-bay', rs: vaultBayRuleset() },
  { name: 'tracery-families', rs: traceryFamiliesRuleset() },
  { name: 'evil-chapel', rs: evilChapelRuleset() },
];
describe('the K-3 ornament rulesets are watertight, non-degenerate solids at every tier', () => {
  for (const { name, rs } of K3_RULESETS) {
    for (const tier of [0, 1, 2]) {
      const g = buildArchMesh(rs, { seedId: 'k3', tier });
      it(`${name} tier ${tier}: zero boundary edges (watertight)`, () => {
        const { odd, total } = boundaryOdd(g);
        expect(total).toBeGreaterThan(10);
        expect(odd).toBe(0);
      });
      it(`${name} tier ${tier}: no NaN, no degenerate triangles, AO bounded`, () => {
        expect(anyNaN(g.positions) || anyNaN(g.normals) || anyNaN(g.ao)).toBe(false);
        expect(degenerate(g)).toBe(0);
        let ok = true; for (const v of g.ao) if (v < 0 || v > 1) ok = false; expect(ok).toBe(true);
      });
    }
  }
});
