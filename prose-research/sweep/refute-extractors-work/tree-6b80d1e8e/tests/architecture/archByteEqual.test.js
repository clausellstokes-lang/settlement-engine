/**
 * archByteEqual.test.js -- K-1 GRAMMAR: THE WAVE'S OWN ADVERSARIAL CHECK (byte-parity).
 *
 * The load-bearing K-1 gate: the grammar INTERPRETER + MESH EMITTER reproduce a gothic fragment
 * BYTE-EQUAL to a DIRECT arch build. The flying buttress is built two ways -- hand-called mesh
 * primitives (buildButtressDirect) and the frozen grammar ruleset run through interpret -> emitMesh
 * -- and their finalized positions/normals/indices must match bit-for-bit. If they diverge, the
 * interpreter or emitter introduced drift over the mesh algebra (a wrong emission order, a mangled
 * arg, an extra/missing terminal, a bad frame). AO/crease/role are parallel attributes that do NOT
 * enter the intern key, so they are proven not to disturb the golden geometry.
 */
import { describe, it, expect } from 'vitest';
import { interpret } from '../../src/domain/townMap/arch/interpreter.js';
import { emitMesh } from '../../src/domain/townMap/arch/emitter.js';
import { buildButtressDirect, buttressRuleset } from '../../src/domain/townMap/arch/rulesets/buttressFragment.js';

const eqF = (a, b) => a.length === b.length && Array.prototype.every.call(a, (v, i) => v === b[i]);

describe('the grammar reproduces the K-0 gothic fragment byte-equal to a direct arch build', () => {
  const grammar = emitMesh(interpret(buttressRuleset(20, 49, 1), { seedId: 'k1', tier: 2 }).terminals);
  const direct = buildButtressDirect(20, 49, 1);

  it('positions are byte-identical', () => expect(eqF(grammar.positions, direct.positions)).toBe(true));
  it('normals are byte-identical', () => expect(eqF(grammar.normals, direct.normals)).toBe(true));
  it('indices are byte-identical', () => expect(eqF(grammar.indices, direct.indices)).toBe(true));

  it('the fragment is non-trivial (a real buttress, not an empty match)', () => {
    expect(direct.triangleCount).toBeGreaterThan(150);
    expect(grammar.triangleCount).toBe(direct.triangleCount);
  });

  it('parity holds for the mirrored (reflected) buttress too', () => {
    const g = emitMesh(interpret(buttressRuleset(240, 211, -1), { seedId: 'k1', tier: 2 }).terminals);
    const d = buildButtressDirect(240, 211, -1);
    expect(eqF(g.positions, d.positions) && eqF(g.normals, d.normals) && eqF(g.indices, d.indices)).toBe(true);
  });

  it('the K-1 attributes (AO / crease / role) do NOT perturb the golden geometry', () => {
    // AO + crease exist and are consistent, but positions/normals/indices already matched above.
    expect(grammar.ao.length).toBe(grammar.vertexCount);
    expect(grammar.creaseEdges.length % 2).toBe(0);
    expect(grammar.roleRanges.length).toBeGreaterThan(0);
  });
});
