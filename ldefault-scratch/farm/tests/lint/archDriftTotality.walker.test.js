/**
 * archDriftTotality.walker.test.js -- K-4 SPINE (driftTotality.walker): the drift-binding totality + the
 * single-writer / covert-security source law.
 *
 * The kernel doc's K-4 "E-K drift-totality walker": the single writer of drift into geometry must handle
 * EVERY functional archetype and never leak the dossier. Four totalities:
 *   1. HOST TOTALITY -- every SHAPE_FAMILY has a massing host that builds at all three LOD tiers
 *      (watertight, within the hard ceiling). A new archetype with no host REDS (deposit-and-consume).
 *   2. DRIFT TOTALITY -- the writer drifts every archetype at every tier across a battery of condition
 *      portraits without throwing; the result is watertight and PRESERVES the base AABB (drift changes
 *      detail, never the silhouette -- glyph and signature share a footprint).
 *   3. DORMANCY TOTALITY -- for every archetype, an absent conditionVector is byte-identical to the base.
 *   4. SINGLE-WRITER + COVERT-SECURITY (source law) -- conditionParams.js is the ONLY arch module that
 *      both consumes a drift-selection layer AND emits geometry (a second geometry-writing drift module
 *      REDS), and NO drift module reads corruptionCovert (the map's structure never leaks what the dossier
 *      hides -- the covert negative control, proven structurally).
 *
 * E-A: its removing power is proven by scripts/mutation-sweep.sh (label "kernel/drift covert leak" -- a
 * planted read of cv.corruptionCovert in conditionParams.js must red the covert source scan below).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { buildArchMesh } from '../../src/domain/townMap/arch/emitter.js';
import { writeDriftedMesh } from '../../src/domain/townMap/arch/conditionParams.js';
import { archetypeMassingRuleset, MASSING_ARCHETYPES } from '../../src/domain/townMap/arch/archetypeMassing.js';
import { LOD_TIERS, HARD_TIER_CEILINGS } from '../../src/domain/townMap/arch/grammarIR.js';
import { SHAPE_FAMILIES, makeConditionVector } from '../../src/domain/townMap/arch/params.js';

const ARCH_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/townMap/arch');
const SEED = 'k4-walk', ANCHOR = 'w';
const PORTRAITS = [
  { prosperity: 0.9, patronAlignGood: 0.9, moral: 0.9, legitimacy: 0.85 },       // prosperous, good
  { warScar: 0.95, historyMark: 7, patronEmblem: 12, legitimacy: 0.3 },          // war-scarred, remembered
  { patronAlignGood: 0.05, moral: 0.1, patronEmblem: 33, historyMark: 4 },       // evil-drift
  { corruptionRevealed: 0.9, prosperity: 0.2, moral: 0.35 },                     // corrupt-decayed (albedo)
];

/** boundary-edge count over float positions (0 => closed manifold). @param {ReturnType<typeof buildArchMesh>} g @returns {number} */
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
const host = (a) => archetypeMassingRuleset({ archetype: a, footprint: [140, 110], heightClass: 'tall' });

describe('K-4 HOST TOTALITY -- every SHAPE_FAMILY has a massing host at all three LOD tiers', () => {
  it('MASSING_ARCHETYPES is exactly the 8 SHAPE_FAMILIES (deposit-and-consume)', () => {
    expect([...MASSING_ARCHETYPES].sort()).toEqual([...SHAPE_FAMILIES].sort());
    expect(MASSING_ARCHETYPES.length).toBe(8);
  });
  for (const a of MASSING_ARCHETYPES) {
    it(`${a}: builds non-empty + watertight + within the ceiling at every tier`, () => {
      for (const tier of LOD_TIERS) {
        const g = buildArchMesh(host(a), { seedId: SEED, tier });
        expect(g.triangleCount, `${a} t${tier} non-empty`).toBeGreaterThan(0);
        expect(boundaryOdd(g), `${a} t${tier} watertight`).toBe(0);
        expect(g.triangleCount).toBeLessThanOrEqual(HARD_TIER_CEILINGS[tier].triangles);
      }
    });
  }
});

describe('K-4 DRIFT TOTALITY -- the writer drifts every archetype x tier x portrait, silhouette-preserving', () => {
  let watertight = 0, drifted = 0;
  for (const a of MASSING_ARCHETYPES) {
    it(`${a}: drifts under every portrait at every tier (watertight, AABB-preserving, within ceiling)`, () => {
      for (const raw of PORTRAITS) {
        const cv = makeConditionVector(raw);
        for (const tier of LOD_TIERS) {
          const base = buildArchMesh(host(a), { seedId: SEED, tier });
          const g = writeDriftedMesh(host(a), { seedId: SEED, anchorKey: ANCHOR, archetype: a, conditionVector: cv, tier });
          expect(boundaryOdd(g), `${a} t${tier} watertight`).toBe(0); watertight++;
          expect(g.triangleCount).toBeLessThanOrEqual(HARD_TIER_CEILINGS[tier].triangles);
          for (let k = 0; k < 3; k++) {
            expect(Math.abs(g.min[k] - base.min[k]), `${a} t${tier} min[${k}] silhouette`).toBeLessThan(1e-3);
            expect(Math.abs(g.max[k] - base.max[k]), `${a} t${tier} max[${k}] silhouette`).toBeLessThan(1e-3);
          }
          if (g.triangleCount > base.triangleCount) drifted++;
        }
      }
    });
  }
  it('guard-the-guard: the grid ran and SOME archetype x condition actually drifted (anti-vacuity)', () => {
    expect(watertight).toBeGreaterThanOrEqual(8 * PORTRAITS.length * 3 - 1);
    expect(drifted).toBeGreaterThan(0); // the martial keep's war strut lands within budget
  });
});

describe('K-4 DORMANCY TOTALITY -- absent vector == base for every archetype', () => {
  for (const a of MASSING_ARCHETYPES) {
    it(`${a}: absent conditionVector is byte-identical to buildArchMesh`, () => {
      const base = buildArchMesh(host(a), { seedId: SEED, tier: 2 });
      const g = writeDriftedMesh(host(a), { seedId: SEED, anchorKey: ANCHOR, archetype: a, tier: 2 });
      const eq = base.positions.length === g.positions.length
        && Array.prototype.every.call(base.positions, (v, i) => v === g.positions[i])
        && Array.prototype.every.call(base.indices, (v, i) => v === g.indices[i]);
      expect(eq).toBe(true);
    });
  }
});

describe('K-4 SINGLE-WRITER + COVERT-SECURITY (the source law)', () => {
  const files = readdirSync(ARCH_DIR).filter((f) => f.endsWith('.js'));
  const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const codeOf = (f) => strip(readFileSync(join(ARCH_DIR, f), 'utf8'));

  it('conditionParams.js is the ONLY arch module that both selects drift AND emits geometry', () => {
    const selects = (c) => /from '\.\/(settlementDress|conditionGrammar)\.js'/.test(c);
    const emits = (c) => /from '\.\/(emitter|kit)\.js'/.test(c);
    const writers = files.filter((f) => { const c = codeOf(f); return selects(c) && emits(c); });
    expect(writers, `exactly one drift geometry writer expected; got: ${writers.join(', ')}`).toEqual(['conditionParams.js']);
  });

  it('NO drift module reads corruptionCovert (the covert negative control, structural)', () => {
    for (const f of ['conditionParams.js', 'archetypeMassing.js']) {
      expect(codeOf(f).includes('corruptionCovert'), `${f} must never read corruptionCovert in code`).toBe(false);
    }
  });
});
