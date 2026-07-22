/**
 * archMeshBudget.test.js -- K-1 SPINE (meshBudget): per-kind x tier triangle/vertex/draw ceilings.
 *
 * Extends the E-F / townMapOpBudget idiom to the 3D kernel: a self-scoring ceiling that catches an
 * explosion CLASS, in COUNTS not milliseconds (the M1's real limits -- draw calls bind first). The
 * per-tier ceilings below are pinned at ~1.4-1.5x the MEASURED grammar cathedral + the byte-parity
 * buttress (the budget sheet the owner signs as versioned tuning). The interpreter's HARD_TIER_
 * CEILINGS are the fail-closed machine envelope on top of these; the M1 draw-call budget (<=200) is
 * the binding-first ceiling every tier must clear.
 */
import { describe, it, expect } from 'vitest';
import { buildArchMesh } from '../../src/domain/townMap/arch/emitter.js';
import { interpret } from '../../src/domain/townMap/arch/interpreter.js';
import { emitMesh } from '../../src/domain/townMap/arch/emitter.js';
import { cathedralRuleset } from '../../src/domain/townMap/arch/rulesets/cathedral.js';
import { buttressRuleset } from '../../src/domain/townMap/arch/rulesets/buttressFragment.js';
import { HARD_TIER_CEILINGS } from '../../src/domain/townMap/arch/grammarIR.js';

// Pinned at ~1.5x MEASURED (2026-07-21): cathedral t0=108/190/8, t1=396/1038/14, t2=2172/5206/42;
// buttress=192/520/7. Owner-signed versioned tuning -- raise only with a re-measure + a note.
const CATHEDRAL_CEILINGS = {
  0: { tris: 200, verts: 340, draws: 16 },
  1: { tris: 640, verts: 1650, draws: 24 },
  2: { tris: 3300, verts: 8000, draws: 64 },
};
const DRAW_CALL_BUDGET = 200; // the M1's first-binding limit

describe('K-1 mesh budget -- the grammar cathedral does not explode (counts, not ms)', () => {
  const rs = cathedralRuleset();
  for (const tier of [0, 1, 2]) {
    const g = buildArchMesh(rs, { seedId: 'k1', tier });
    const cap = CATHEDRAL_CEILINGS[tier];
    it(`tier ${tier}: triangles ${g.triangleCount} <= ${cap.tris}`, () => expect(g.triangleCount).toBeLessThanOrEqual(cap.tris));
    it(`tier ${tier}: vertices ${g.vertexCount} <= ${cap.verts}`, () => expect(g.vertexCount).toBeLessThanOrEqual(cap.verts));
    it(`tier ${tier}: draws ${g.roleRanges.length} <= ${cap.draws} (and under the ${DRAW_CALL_BUDGET} M1 draw budget)`, () => {
      expect(g.roleRanges.length).toBeLessThanOrEqual(cap.draws);
      expect(g.roleRanges.length).toBeLessThanOrEqual(DRAW_CALL_BUDGET);
    });
    it(`tier ${tier}: under the HARD fail-closed envelope`, () => {
      expect(g.triangleCount).toBeLessThanOrEqual(HARD_TIER_CEILINGS[tier].triangles);
      expect(g.vertexCount).toBeLessThanOrEqual(HARD_TIER_CEILINGS[tier].vertices);
    });
  }
  it('anti-vacuity: the signature tier actually carries ornament (not empty)', () => {
    const g = buildArchMesh(rs, { seedId: 'k1', tier: 2 });
    expect(g.triangleCount).toBeGreaterThan(1000);
  });
});

describe('K-1 mesh budget -- the byte-parity buttress fragment', () => {
  const g = emitMesh(interpret(buttressRuleset(20, 49, 1), { tier: 2 }).terminals);
  it(`triangles ${g.triangleCount} <= 300`, () => expect(g.triangleCount).toBeLessThanOrEqual(300));
  it(`draws ${g.roleRanges.length} <= 12`, () => expect(g.roleRanges.length).toBeLessThanOrEqual(12));
});
