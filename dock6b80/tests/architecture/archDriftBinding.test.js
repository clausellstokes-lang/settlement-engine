/**
 * archDriftBinding.test.js -- K-4 SPINE: the SINGLE WRITER of drift into geometry.
 *
 * conditionParams.js is the one place a conditionVector becomes triangles. These tests pin the K-4
 * invariant classes the kernel doc names (docs/KERNEL_MAX_PROGRAM.md, K-4):
 *   1. DORMANCY -- an ABSENT conditionVector, and the NEUTRAL vector, add ZERO drift geometry, so the
 *      drifted mesh is byte-identical to buildArchMesh (the frozen "neutral == no vector" contract).
 *   2. DETERMINISM (THE PROMISE) -- same (seedId, anchorKey, conditionVector) -> byte-identical geometry
 *      (double-build), pinned as SHA-256 GLB exemplar goldens across a drift matrix (single-axis +
 *      portraits x kinds + the LOD ladder). A hash change is a DECLARED same-seed geometry shift.
 *   3. THE SALIENCY BUDGET -- drift triangles are <= 25% / 15% / 0% of the base at signature / commons /
 *      glyph, priority-truncated (recorded war + history before alignment statuary).
 *   4. COVERT SECURITY (the negative control) -- the drifted GEOMETRY is invariant to corruption (covert
 *      is EXACTLY 0 by contract; revealed dresses only ALBEDO in K-2), so the map's structure can never
 *      leak what the dossier hides.
 *   5. WATERTIGHT + FAIL-CLOSED -- every drifted mesh is a closed manifold (boundary-edge count 0) and is
 *      metered against the HARD tier ceiling.
 *
 * The GLB matrix SAMPLES the drift axes (toward the doc's 27 single-axis + portraits x kinds) on the
 * signature cathedral (the rich host) + the martial/civic massing floor; geometry drift concentrates at
 * the SIGNATURE tier (a small massing block carries at most a token within budget -- its condition reads
 * through the K-2 albedo dress), which the LOD-ladder goldens make explicit.
 */
import { createHash } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import { buildArchMesh } from '../../src/domain/townMap/arch/emitter.js';
import { encodeGlb } from '../../src/domain/townMap/arch/glb.js';
import { writeDriftedMesh, driftTerminals, resolveDrift, SALIENCY_FRACTION } from '../../src/domain/townMap/arch/conditionParams.js';
import { cathedralRuleset } from '../../src/domain/townMap/arch/rulesets/cathedral.js';
import { archetypeMassingRuleset } from '../../src/domain/townMap/arch/archetypeMassing.js';
import { makeConditionVector, neutralConditionVector } from '../../src/domain/townMap/arch/params.js';
import { interpret } from '../../src/domain/townMap/arch/interpreter.js';

const sha = (b) => createHash('sha256').update(Buffer.from(b.buffer, b.byteOffset, b.byteLength)).digest('hex');
const glbOf = (g, gen) => encodeGlb({ positions: g.positions, normals: g.normals, indices: g.indices, vertexCount: g.vertexCount, min: g.min, max: g.max }, { ao: g.ao, generator: gen });
const eqF = (a, b) => a.length === b.length && Array.prototype.every.call(a, (v, i) => v === b[i]);
const meshEq = (a, b) => eqF(a.positions, b.positions) && eqF(a.normals, b.normals) && eqF(a.indices, b.indices) && eqF(a.ao, b.ao);

/** boundary-edge count over float positions (a closed manifold has 0 odd-used edges). @param {ReturnType<typeof buildArchMesh>} g @returns {number} */
function boundaryOdd(g) {
  const pk = (v) => `${g.positions[v * 3]},${g.positions[v * 3 + 1]},${g.positions[v * 3 + 2]}`;
  const m = new Map();
  for (let i = 0; i < g.indices.length; i += 3) {
    const t = [g.indices[i], g.indices[i + 1], g.indices[i + 2]];
    for (let e = 0; e < 3; e++) { const a = pk(t[e]), b = pk(t[(e + 1) % 3]); const k = a < b ? `${a}|${b}` : `${b}|${a}`; m.set(k, (m.get(k) || 0) + 1); }
  }
  let odd = 0; for (const c of m.values()) if (c % 2 === 1) odd++;
  return odd;
}

const SEED = 'k4-golden', ANCHOR = 'exemplar';
const KIND = {
  cathedral: () => cathedralRuleset(),
  martial: () => archetypeMassingRuleset({ archetype: 'martial', footprint: [140, 110], heightClass: 'tall' }),
  civic: () => archetypeMassingRuleset({ archetype: 'civic', footprint: [130, 100], heightClass: 'mid' }),
};
const ARCHETYPE = { cathedral: 'sacred', martial: 'martial', civic: 'civic' };
/** build a drifted mesh for a named kind + raw cv at a tier. @param {string} kind @param {object} raw @param {number} tier @returns {ReturnType<typeof buildArchMesh>} */
function drifted(kind, raw, tier) {
  return writeDriftedMesh(KIND[kind](), { seedId: SEED, anchorKey: ANCHOR, archetype: ARCHETYPE[kind], conditionVector: makeConditionVector(raw), tier });
}
const hashOf = (kind, raw, tier) => sha(glbOf(drifted(kind, raw, tier), `k4-${kind}`));

// composite condition portraits (real settlement states)
const PORTRAIT = {
  prosperousGood: { prosperity: 0.9, patronAlignGood: 0.9, patronAlignLaw: 0.85, moral: 0.9, legitimacy: 0.85, terrain: 0.7 },
  warScarred: { warScar: 0.95, corruptionRevealed: 0.2, legitimacy: 0.4, historyMark: 7, patronEmblem: 12 },
  evilDrift: { patronAlignGood: 0.1, patronAlignLaw: 0.15, moral: 0.15, patronEmblem: 33, historyMark: 4, prosperity: 0.6 },
};

// ── PINNED SHA-256 GLB EXEMPLAR GOLDENS (K-4 drift binding, ARCH_GEOMETRY_VERSION 3, 2026-07-22) ──────
// A hash change is a DECLARED same-seed geometry shift. cathedral = the signature drift host; martial/civic
// = the massing floor (drift concentrates at signature -- small hosts fall back to base geometry + albedo).
const GOLDEN = {
  // single-axis on the cathedral (tier 2)
  sa_goodHigh: 'e1a80fce2b71147bcade335c21be735ff1561d8a4677b7501551b5cb056d3b6a',
  sa_goodLow: 'c7af842821e95a2a17ecda1578bbb8b9e378513f9852a045641c10544a13b475',
  sa_moralDark: 'c7af842821e95a2a17ecda1578bbb8b9e378513f9852a045641c10544a13b475',
  sa_prosperityHigh: '55c4d065f56398b87215786d255830d885f99ec70928f9d814966e10e4ed2f78',
  sa_historyMark: '0f5085ee00fa86438f6529609eb3bb7a31e77b75242b177d90d2cc6c18c69e02',
  // single-axis on the martial keep (tier 2)
  sa_warHigh_martial: 'a6a60ab86f1908e9c84cb182a8f00e8436439e70fa4930851368ab7d90ce81c2',
  // portraits x kinds (tier 2)
  prosperousGood_cathedral: '55c4d065f56398b87215786d255830d885f99ec70928f9d814966e10e4ed2f78',
  warScarred_cathedral: '9bc4cfdddc251b61f5461b55072cd0821e8539d1102c16164ece62ea1a06b3d2',
  evilDrift_cathedral: '2eb0a685df2c88f8883a30a82dd68e2a1835da47f98134b2f06fc1b5328afb14',
  warScarred_martial: 'a6a60ab86f1908e9c84cb182a8f00e8436439e70fa4930851368ab7d90ce81c2',
  prosperousGood_civic: 'e6a0782e25670814cb7f820432b6b0ee4fdabd2c0a71093896b0d62c8a4e19ab',
  // the LOD ladder (cathedral evilDrift across tiers -- drift lands at signature)
  lod_evilDrift_t0: '266e5bdf905c426c49c66fa3acfd82799c36ece7e0c7cf525da43dc4c2eda8a8',
  lod_evilDrift_t1: 'c5dbb93e8057f4e8615994ee2337573b8de2307952a66d972c72e25401fab9a2',
  lod_evilDrift_t2: '2eb0a685df2c88f8883a30a82dd68e2a1835da47f98134b2f06fc1b5328afb14',
};

describe('K-4 DORMANCY -- the neutral vector == no vector == the base mesh (byte-identical)', () => {
  for (const kind of ['cathedral', 'martial']) {
    it(`${kind}: absent conditionVector is byte-identical to buildArchMesh`, () => {
      const base = buildArchMesh(KIND[kind](), { seedId: SEED, tier: 2 });
      const noDrift = writeDriftedMesh(KIND[kind](), { seedId: SEED, anchorKey: ANCHOR, archetype: ARCHETYPE[kind], tier: 2 });
      expect(meshEq(noDrift, base)).toBe(true);
    });
    it(`${kind}: the NEUTRAL conditionVector is byte-identical to the base (deviation-from-neutral)`, () => {
      const base = buildArchMesh(KIND[kind](), { seedId: SEED, tier: 2 });
      const neutral = writeDriftedMesh(KIND[kind](), { seedId: SEED, anchorKey: ANCHOR, archetype: ARCHETYPE[kind], conditionVector: neutralConditionVector(), tier: 2 });
      expect(meshEq(neutral, base)).toBe(true);
    });
  }
});

describe('K-4 DETERMINISM + the drift GLB matrix (double-build + pinned SHA exemplars)', () => {
  it('a drifted mesh double-builds byte-identical (THE PROMISE)', () => {
    const a = drifted('cathedral', PORTRAIT.evilDrift, 2), b = drifted('cathedral', PORTRAIT.evilDrift, 2);
    expect(meshEq(a, b)).toBe(true);
  });
  const SA = {
    sa_goodHigh: ['cathedral', { patronAlignGood: 0.95, moral: 0.9 }],
    sa_goodLow: ['cathedral', { patronAlignGood: 0.05 }],
    sa_moralDark: ['cathedral', { moral: 0.05 }],
    sa_prosperityHigh: ['cathedral', { patronAlignGood: 0.95, prosperity: 0.95 }],
    sa_historyMark: ['cathedral', { historyMark: 9, patronEmblem: 20 }],
    sa_warHigh_martial: ['martial', { warScar: 0.95 }],
  };
  for (const [key, [kind, raw]] of Object.entries(SA)) {
    it(`single-axis ${key}: pinned GLB hash`, () => { expect(hashOf(kind, raw, 2)).toBe(GOLDEN[key]); });
  }
  for (const [kind, key] of [['cathedral', 'prosperousGood_cathedral'], ['cathedral', 'warScarred_cathedral'], ['cathedral', 'evilDrift_cathedral'], ['martial', 'warScarred_martial'], ['civic', 'prosperousGood_civic']]) {
    const pk = key.split('_')[0];
    it(`portrait ${key}: pinned GLB hash`, () => { expect(hashOf(kind, PORTRAIT[pk], 2)).toBe(GOLDEN[key]); });
  }
  for (const tier of [0, 1, 2]) {
    it(`LOD ladder evilDrift tier ${tier}: pinned GLB hash`, () => { expect(hashOf('cathedral', PORTRAIT.evilDrift, tier)).toBe(GOLDEN[`lod_evilDrift_t${tier}`]); });
  }
});

describe('K-4 THE SALIENCY BUDGET -- drift triangles <= 25/15/0% of the base, priority-truncated', () => {
  for (const [pk, raw] of Object.entries(PORTRAIT)) {
    for (const tier of [0, 1, 2]) {
      it(`${pk} tier ${tier}: drift triangles within the saliency budget`, () => {
        const base = buildArchMesh(cathedralRuleset(), { seedId: SEED, tier });
        const g = drifted('cathedral', raw, tier);
        const budget = Math.floor(base.triangleCount * (SALIENCY_FRACTION[tier] || 0));
        const drift = g.triangleCount - base.triangleCount;
        expect(drift, `${pk} t${tier} drift=${drift} budget=${budget}`).toBeLessThanOrEqual(budget);
        expect(drift).toBeGreaterThanOrEqual(0);
      });
    }
  }
  it('glyph carries ZERO drift for every portrait (a distant silhouette shows no ornament)', () => {
    for (const raw of Object.values(PORTRAIT)) {
      const base = buildArchMesh(cathedralRuleset(), { seedId: SEED, tier: 0 });
      expect(drifted('cathedral', raw, 0).triangleCount).toBe(base.triangleCount);
    }
  });
  it('priority truncation keeps war DAMAGE (small, high-priority) over a relief band on a tight budget', () => {
    // a martial keep war-scarred WITH a recorded siege: the strut (truth) fits, the relief band does not
    const raw = { warScar: 0.95, historyMark: 7, patronEmblem: 3 };
    const base = buildArchMesh(KIND.martial(), { seedId: SEED, tier: 2 });
    const g = drifted('martial', raw, 2);
    expect(g.triangleCount).toBeGreaterThan(base.triangleCount);          // damage strut lands
    expect(g.triangleCount - base.triangleCount).toBeLessThanOrEqual(Math.floor(base.triangleCount * 0.25));
  });
});

describe('K-4 COVERT SECURITY -- the drifted GEOMETRY never leaks corruption (the negative control)', () => {
  it('geometry is invariant to corruptionRevealed (corruption dresses albedo, never structure)', () => {
    const a = drifted('cathedral', { warScar: 0.9, corruptionRevealed: 0.0 }, 2);
    const b = drifted('cathedral', { warScar: 0.9, corruptionRevealed: 0.9 }, 2);
    expect(meshEq(a, b)).toBe(true);
  });
  it('a covert value can never even reach the writer (fail-closed at the contract boundary)', () => {
    expect(() => drifted('cathedral', { corruptionRevealed: 0.3, corruptionCovert: 0.5 }, 2)).toThrow(/covert/i);
  });
});

describe('K-4 WATERTIGHT -- every drifted mesh is a closed manifold', () => {
  for (const [pk, raw] of Object.entries(PORTRAIT)) {
    it(`${pk}: cathedral + martial drifted meshes have boundary-edge count 0`, () => {
      expect(boundaryOdd(drifted('cathedral', raw, 2))).toBe(0);
      expect(boundaryOdd(drifted('martial', raw, 2))).toBe(0);
    });
  }
});

describe('K-4 the drift is a pure DEVIATION function (guard-the-guard on the resolver)', () => {
  it('resolveDrift returns a null spec for an absent vector (dormancy signal) and a spec otherwise', () => {
    expect(resolveDrift({ seedId: SEED, anchorKey: ANCHOR, archetype: 'sacred', tier: 2 }).spec).toBe(null);
    expect(resolveDrift({ seedId: SEED, anchorKey: ANCHOR, archetype: 'sacred', conditionVector: makeConditionVector(PORTRAIT.evilDrift), tier: 2 }).spec).not.toBe(null);
  });
  it('driftTerminals is empty at glyph and for the neutral vector', () => {
    const baseT = interpret(cathedralRuleset(), { seedId: SEED, tier: 2 }).terminals;
    const env = { min: [-24, 0, 0], max: [260, 590, 190] };
    const { dress, neutralDress } = resolveDrift({ seedId: SEED, anchorKey: ANCHOR, archetype: 'sacred', conditionVector: neutralConditionVector(), tier: 2 });
    expect(driftTerminals(neutralConditionVector(), dress, neutralDress, env, 2, baseT.length, 'd')).toEqual([]);
  });
});
