/**
 * archMaterialLibrary.test.js -- K-3 SPINE: the illustrated MATERIAL + SKIN library.
 *
 * Pins the CPU-baked material system (materials/materials.js + skins.js):
 *   - PALETTE BOUNDS -- every material's linear-RGB palette channel is in [0, 1] (a physical albedo).
 *   - ONE NW LIGHT -- every bake's directional term is the SINGLE shared NW key (rationalTables.LIGHT);
 *     no material defines its own light. MATERIAL_LIGHT === LIGHT, unit, pointing NW-and-out.
 *   - METALLIC WHITELIST -- metallic > 0 IFF the id is in METALLIC_MATERIALS (the recipe never fakes
 *     metal on stone/timber/brick/marble/adobe/concrete).
 *   - DETERMINISM -- same (material, weathering, size) -> byte-identical texture (double bake), pinned
 *     by SHA-256 EXEMPLAR SAMPLES (never the 11x6 cross product -- the doc's exemplar-sampling law).
 *   - SKINS -- every skin covers all 12 K-1 roles, resolves to in-gamut albedos, and is deterministic.
 */
import { createHash } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import {
  MATERIALS, MATERIAL_IDS, METALLIC_MATERIALS, WEATHERING, WEATHERING_CLASSES, MATERIAL_LIGHT, bakeMaterialTexture, materialMeanAlbedo,
} from '../../src/domain/townMap/arch/materials/materials.js';
import { SKINS, SKIN_IDS, skinRoleAlbedo, assertSkin, skinRoleAssignment } from '../../src/domain/townMap/arch/materials/skins.js';
import { LIGHT } from '../../src/domain/townMap/arch/rationalTables.js';
import { MATERIAL_ROLES } from '../../src/domain/townMap/arch/grammarIR.js';

const sha = (b) => createHash('sha256').update(Buffer.from(b.buffer, b.byteOffset, b.byteLength)).digest('hex');
const eqB = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

// ── PINNED EXEMPLAR TEXTURE GOLDENS (64x64, 2026-07-21) -- a SAMPLE, never the 11x6 cross product. ──
const TEXTURE_GOLDEN = {
  'stoneAshlar/pristine': 'd228f4ab0bf1693961f4a406016870bb50c16e986626b2c78a6395d6920cf20e',
  'brick/soot': 'bc388b50885f42d5e769fcbfa9bc5682182c029bebc3ee9a4b344aa99d900c44',
  'marble/pristine': '79e1cc4f14c4a30006e7a67b40fd71ff90cb7ef108430b731ea4fd2de40006c4',
  'corrugatedIndustrial/stain': 'de3471e43ebd8bca8f5f92d6d8346d434a1f3741f653727df4fc74e6eaac1e60',
  'neonCyber/pristine': '783d58f6c18a8c85c116d55fe477424b00b54b6d64664f63eff99c60f30c2f6e',
};

describe('material palette bounds -- every channel is a physical linear albedo in [0,1]', () => {
  it('guard-the-guard: 11 materials, 6 weathering classes', () => {
    expect(MATERIAL_IDS.length).toBe(11);
    expect(WEATHERING_CLASSES.length).toBe(6);
  });
  for (const id of Object.keys(MATERIALS)) {
    it(`${id}: palette channels in [0,1]`, () => {
      const p = MATERIALS[id].palette;
      for (const key of ['base', 'seam', 'shade', 'accent']) for (const c of p[key]) expect(c >= 0 && c <= 1).toBe(true);
    });
  }
  it('mean baked albedo stays in gamut for a sample of material x weathering', () => {
    for (const id of ['stoneAshlar', 'brick', 'marble', 'neonCyber']) {
      for (const w of ['pristine', 'soot', 'ruin']) {
        const a = materialMeanAlbedo(id, w);
        for (const c of a) expect(c >= 0 && c <= 1).toBe(true);
      }
    }
  });
});

describe('ONE NW light -- every bake uses the single shared key', () => {
  it('MATERIAL_LIGHT is exactly rationalTables.LIGHT', () => expect(MATERIAL_LIGHT).toEqual(LIGHT));
  it('the light is unit-length and points up-left-and-out (NW)', () => {
    const m = Math.sqrt(MATERIAL_LIGHT[0] ** 2 + MATERIAL_LIGHT[1] ** 2 + MATERIAL_LIGHT[2] ** 2);
    expect(Math.abs(m - 1)).toBeLessThan(1e-9);
    expect(MATERIAL_LIGHT[0] < 0 && MATERIAL_LIGHT[1] < 0 && MATERIAL_LIGHT[2] > 0).toBe(true);
  });
});

describe('metallic whitelist -- metallic > 0 IFF the id is whitelisted', () => {
  it('the whitelist is a subset of the material ids', () => {
    for (const id of METALLIC_MATERIALS) expect(MATERIAL_IDS).toContain(id);
  });
  for (const id of Object.keys(MATERIALS)) {
    it(`${id}: metallic ${MATERIALS[id].metallic > 0 ? '> 0' : '== 0'} matches the whitelist`, () => {
      expect(MATERIALS[id].metallic > 0).toBe(METALLIC_MATERIALS.has(id));
    });
  }
});

describe('baked textures are deterministic + pinned (exemplar sample, never the cross product)', () => {
  for (const key of Object.keys(TEXTURE_GOLDEN)) {
    const [id, w] = key.split('/');
    it(`${key}: double-bake byte-identical + pinned SHA`, () => {
      const a = bakeMaterialTexture(id, w, 64), b = bakeMaterialTexture(id, w, 64);
      expect(a.size).toBe(64);
      expect(eqB(a.rgb, b.rgb)).toBe(true);
      expect(sha(a.rgb)).toBe(TEXTURE_GOLDEN[key]);
    });
  }
  it('an unknown material or weathering fails closed', () => {
    expect(() => bakeMaterialTexture('mithril', 'pristine')).toThrow(/not registered/);
    expect(() => bakeMaterialTexture('stoneAshlar', 'blessed')).toThrow(/not registered/);
  });
});

describe('skins -- every skin dresses all 12 roles, in gamut, deterministically', () => {
  it('guard-the-guard: at least four skins spanning genres', () => expect(SKIN_IDS.length).toBeGreaterThanOrEqual(4));
  for (const id of Object.keys(SKINS)) {
    it(`${id}: covers all 12 roles with in-gamut albedos, deterministic`, () => {
      const a = skinRoleAlbedo(id), b = skinRoleAlbedo(id);
      for (const role of MATERIAL_ROLES) {
        expect(a[role]).toBeDefined();
        for (const c of a[role]) expect(c >= 0 && c <= 1).toBe(true);
        expect(eqB(a[role], b[role])).toBe(true);
        // the assignment resolves to a registered material + weathering (glassLead is the fixed tint)
        if (role !== 'glassLead') { const asg = skinRoleAssignment(id, role); expect(MATERIALS[asg.material]).toBeDefined(); expect(WEATHERING[asg.weathering]).toBeDefined(); }
      }
    });
  }
  it('an unknown skin fails closed', () => expect(() => assertSkin('holographic')).toThrow(/not registered/));
});
