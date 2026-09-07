/**
 * domain/townMap/arch/materials/materials.js -- K-3 SKIN: the ILLUSTRATED MATERIAL LIBRARY.
 *
 * THE SKIN LIBRARY (kernel doc "THE GENRE LIBRARY" amendment): a finite registry of MATERIAL
 * treatments DECOUPLED from shape, so any skin dresses any shape (skins.js maps the 12 K-1 material
 * ROLES onto these materials). Each material is a deterministic RECIPE -- a pinned linear-RGB palette
 * plus a hash-procedural TEXTURE generalizing the K-1 raster.js stoneMod -- CPU-BAKED into a
 * byte-deterministic TILING texture. The GPU never invents texture: the baked bytes are the truth
 * (THE PROMISE binds them), and the live viewer only samples them. Eleven materials x six weathering
 * classes -> a finite, exemplar-golden-pinned reserve (never the full 66-cell cross product).
 *
 * ONE NW LIGHT: the only directional term any bake uses is the shared NW key (rationalTables.LIGHT) --
 * a micro-relief shade from a height field's finite-difference normal dotted with that ONE light. No
 * material defines its own light. METALLIC is a whitelisted property (only the man-made metals carry
 * it); the recipe never fakes metal on stone.
 *
 * PURITY: {+,-,*,/} + Math.sqrt/floor/min/max/abs + integer hashing; 0 transcendental sites (the
 * arch/ view-wall scan + the transcendental ratchet bind this file at 0). Deterministic: same
 * (materialId, weathering, size) -> byte-identical texture cross-engine.
 *
 * @typedef {readonly [number, number, number]} RGB  linear rgb, each channel in [0, 1]
 * @typedef {{ id: string, patternId: string, palette: { base: RGB, seam: RGB, shade: RGB, accent: RGB }, metallic: number, relief: number }} Material
 * @typedef {{ id: string, darken: number, tint: RGB, grainAmp: number, streak: number }} Weathering
 */

import { LIGHT, tone } from '../rationalTables.js';
import { hash2 } from '../geom.js';

/** the ONE NW key light every material bake shares (re-exported for the ONE-LIGHT gate). @type {readonly [number, number, number]} */
export const MATERIAL_LIGHT = LIGHT;

/**
 * MATERIALS -- the frozen 11-entry material registry. `patternId` selects the procedural texture;
 * `metallic` is a whitelisted [0,1] (see METALLIC_MATERIALS); `relief` scales the baked micro-relief.
 * Palette channels are pinned linear-RGB in [0, 1]. @type {Readonly<Record<string, Material>>}
 */
export const MATERIALS = /** @type {Readonly<Record<string, Material>>} */ (Object.freeze({
  stoneAshlar:          mat('stoneAshlar', 'ashlar', [0.82, 0.77, 0.67], [0.50, 0.47, 0.42], [0.66, 0.62, 0.54], [0.88, 0.84, 0.75], 0, 1.0),
  timberFrame:          mat('timberFrame', 'timber', [0.34, 0.22, 0.12], [0.20, 0.13, 0.07], [0.86, 0.82, 0.72], [0.46, 0.32, 0.18], 0, 1.15),
  brick:                mat('brick', 'brick', [0.55, 0.24, 0.18], [0.78, 0.74, 0.68], [0.42, 0.18, 0.14], [0.64, 0.32, 0.24], 0, 0.9),
  marble:               mat('marble', 'veined', [0.90, 0.88, 0.85], [0.55, 0.55, 0.60], [0.78, 0.77, 0.78], [0.96, 0.95, 0.94], 0, 0.5),
  adobe:                mat('adobe', 'smooth', [0.72, 0.52, 0.36], [0.60, 0.42, 0.30], [0.58, 0.40, 0.27], [0.80, 0.60, 0.44], 0, 0.7),
  steelGlassCurtain:    mat('steelGlassCurtain', 'panel', [0.35, 0.40, 0.48], [0.18, 0.22, 0.30], [0.24, 0.30, 0.40], [0.62, 0.72, 0.82], 0.85, 0.6),
  concreteBrutalist:    mat('concreteBrutalist', 'smooth', [0.62, 0.61, 0.58], [0.50, 0.49, 0.47], [0.50, 0.49, 0.46], [0.70, 0.69, 0.66], 0, 0.8),
  corrugatedIndustrial: mat('corrugatedIndustrial', 'corrugated', [0.45, 0.47, 0.50], [0.30, 0.31, 0.33], [0.30, 0.31, 0.33], [0.66, 0.68, 0.72], 0.55, 1.3),
  neonCyber:            mat('neonCyber', 'circuit', [0.08, 0.09, 0.14], [0.10, 0.90, 0.80], [0.05, 0.05, 0.09], [0.90, 0.20, 0.70], 0.70, 0.9),
  chitinOrganic:        mat('chitinOrganic', 'scale', [0.18, 0.12, 0.14], [0.32, 0.20, 0.24], [0.10, 0.07, 0.09], [0.40, 0.26, 0.30], 0.25, 1.1),
  crystalline:          mat('crystalline', 'facet', [0.60, 0.75, 0.85], [0.42, 0.56, 0.68], [0.44, 0.58, 0.70], [0.88, 0.95, 1.00], 0.30, 1.2),
}));

/** the frozen material id list (ascending, for the walker's totality). @type {ReadonlyArray<string>} */
export const MATERIAL_IDS = Object.freeze(Object.keys(MATERIALS).sort());

/**
 * METALLIC_MATERIALS -- the whitelist: the ONLY material ids allowed a nonzero `metallic`. Stone,
 * timber, brick, marble, adobe, concrete are dielectric by construction; the recipe never fakes
 * metal on them. @type {ReadonlySet<string>}
 */
export const METALLIC_MATERIALS = Object.freeze(new Set([
  'steelGlassCurtain', 'corrugatedIndustrial', 'neonCyber', 'chitinOrganic', 'crystalline',
]));

/**
 * WEATHERING -- the frozen 6-class weathering registry, DECOUPLED from material (any class over any
 * material). Each is a tint multiplier + grain amplification + streak density + a base darken.
 * @type {Readonly<Record<string, Weathering>>}
 */
export const WEATHERING = /** @type {Readonly<Record<string, Weathering>>} */ (Object.freeze({
  pristine: weath('pristine', 0.00, [1.00, 1.00, 1.00], 1.0, 0.00),
  soot:     weath('soot', 0.28, [0.72, 0.72, 0.74], 1.3, 0.10),
  moss:     weath('moss', 0.10, [0.78, 0.92, 0.70], 1.4, 0.22),
  salt:     weath('salt', -0.12, [1.04, 1.03, 1.00], 1.5, 0.30),
  stain:    weath('stain', 0.14, [0.92, 0.78, 0.64], 1.6, 0.34),
  ruin:     weath('ruin', 0.40, [0.66, 0.63, 0.58], 2.0, 0.20),
}));

/** the frozen weathering-class list (ascending). @type {ReadonlyArray<string>} */
export const WEATHERING_CLASSES = Object.freeze(Object.keys(WEATHERING).sort());

/** material constructor. @param {string} id @param {string} patternId @param {RGB} base @param {RGB} seam @param {RGB} shade @param {RGB} accent @param {number} metallic @param {number} relief @returns {Material} */
function mat(id, patternId, base, seam, shade, accent, metallic, relief) {
  return Object.freeze({ id, patternId, palette: Object.freeze({ base: Object.freeze(base), seam: Object.freeze(seam), shade: Object.freeze(shade), accent: Object.freeze(accent) }), metallic, relief });
}
/** weathering constructor. @param {string} id @param {number} darken @param {RGB} tint @param {number} grainAmp @param {number} streak @returns {Weathering} */
function weath(id, darken, tint, grainAmp, streak) {
  return Object.freeze({ id, darken, tint: Object.freeze(tint), grainAmp, streak });
}

// ── THE PROCEDURAL TEXTURE RECIPE (generalizes raster.js stoneMod) ────────────────────────────────

/**
 * The pattern surface at texel (tx, ty): a linear-RGB albedo + a scalar HEIGHT [0,1] (for the
 * micro-relief normal). Pure integer hashing + {+,-,*,/}. Each pattern is a distinct treatment; the
 * shared vocabulary is coursing seams, per-cell tint, fine grain, and directional runs.
 * @param {Material} m @param {number} tx @param {number} ty @param {number} _size @returns {{ rgb: [number, number, number], height: number }}
 */
function patternSurface(m, tx, ty, _size) {
  const p = m.palette, salt = idSalt(m.id);
  let r = p.base[0], g = p.base[1], b = p.base[2], height;
  const lerp = (/** @type {RGB} */ a, /** @type {RGB} */ c, /** @type {number} */ t) => { r = a[0] + (c[0] - a[0]) * t; g = a[1] + (c[1] - a[1]) * t; b = a[2] + (c[2] - a[2]) * t; };

  if (m.patternId === 'ashlar' || m.patternId === 'brick') {
    const CH = m.patternId === 'brick' ? 12 : 22, BW = m.patternId === 'brick' ? 30 : 54;
    const row = Math.floor(ty / CH), shift = (row & 1) * (BW / 2);
    const bx = Math.floor((tx + shift) / BW);
    const inY = ty - row * CH, inX = (tx + shift) - bx * BW;
    const tint = 0.88 + hash2(bx, row, salt) * 0.24;
    lerp(p.base, p.base, 0); r = p.base[0] * tint; g = p.base[1] * tint; b = p.base[2] * tint;
    if (inY < 2 || inX < 2) { r = p.seam[0]; g = p.seam[1]; b = p.seam[2]; height = 0.25; }       // mortar valley
    else if (inY < 3.5 || inX < 3.5) { lerp(p.seam, [r, g, b], 0.5); height = 0.45; }
    else height = 0.62 + hash2(tx | 0, ty | 0, salt + 3) * 0.12;
  } else if (m.patternId === 'timber') {
    const PW = 26, col = Math.floor(tx / PW), inX = tx - col * PW;
    const beam = (col & 3) === 0 || inX < 4;                          // vertical studs + infill
    if (beam) { r = p.base[0]; g = p.base[1]; b = p.base[2]; height = 0.75; const gr = (ty | 0) % 6 < 1 ? 0.85 : 1; r *= gr; g *= gr; b *= gr; }
    else { r = p.shade[0]; g = p.shade[1]; b = p.shade[2]; height = 0.4; const t = 0.94 + hash2(tx | 0, ty | 0, salt) * 0.1; r *= t; g *= t; b *= t; }
  } else if (m.patternId === 'veined') {
    const v = veinField(tx, ty, salt);
    lerp(p.base, p.seam, v * v); height = 0.55 + (0.5 - v) * 0.2;
  } else if (m.patternId === 'smooth') {
    const n = 0.92 + hash2((tx / 3) | 0, (ty / 3) | 0, salt) * 0.16;
    r = p.base[0] * n; g = p.base[1] * n; b = p.base[2] * n; height = 0.55 + (n - 1) * 0.6;
  } else if (m.patternId === 'panel') {
    const GX = 34, GY = 46, inX = tx % GX, inY = ty % GY, mull = inX < 3 || inY < 3;
    if (mull) { r = p.shade[0]; g = p.shade[1]; b = p.shade[2]; height = 0.8; }
    else { const gl = 0.9 + hash2(Math.floor(tx / GX), Math.floor(ty / GY), salt) * 0.2; r = p.base[0] * gl; g = p.base[1] * gl; b = p.base[2] * gl; height = 0.5; }
  } else if (m.patternId === 'corrugated') {
    const RW = 10, phase = (tx % RW) / RW, ridge = phase < 0.5 ? phase * 2 : (1 - phase) * 2;   // triangle wave
    const s = 0.7 + 0.5 * ridge; r = p.base[0] * s; g = p.base[1] * s; b = p.base[2] * s; height = ridge;
    if (hash2(Math.floor(tx / RW), salt, 5) > 0.85) { lerp([r, g, b], p.shade, 0.35); }           // rust run
  } else if (m.patternId === 'circuit') {
    const G = 16, inX = tx % G, inY = ty % G, trace = inX < 2 || inY < 2;
    if (trace && hash2(Math.floor(tx / G), Math.floor(ty / G), salt) > 0.55) { r = p.seam[0]; g = p.seam[1]; b = p.seam[2]; height = 0.9; }
    else if (trace && hash2(Math.floor(tx / G) + 7, Math.floor(ty / G), salt) > 0.7) { r = p.accent[0]; g = p.accent[1]; b = p.accent[2]; height = 0.85; }
    else { r = p.base[0]; g = p.base[1]; b = p.base[2]; height = 0.4; }
  } else if (m.patternId === 'scale') {
    const SW = 14, SH = 10, row = Math.floor(ty / SH), shift = (row & 1) * (SW / 2);
    const col = Math.floor((tx + shift) / SW), inX = (tx + shift) - col * SW, inY = ty - row * SH;
    const cu = (inX - SW / 2), cv = (inY - SH / 2), rr = Math.sqrt(cu * cu + cv * cv) / (SW / 2);
    const t = rr > 1 ? 1 : rr; lerp(p.accent, p.base, t); height = 0.9 - t * 0.5;
  } else { // 'facet'
    const FW = 20, gx = Math.floor(tx / FW), gy = Math.floor(ty / FW), f = hash2(gx, gy, salt);
    lerp(p.shade, p.accent, f); height = 0.3 + f * 0.6;
  }
  return { rgb: [r, g, b], height };
}

/** a hash-noise vein field in [0,1] (marble). @param {number} tx @param {number} ty @param {number} salt @returns {number} */
function veinField(tx, ty, salt) {
  const a = hash2((tx / 9) | 0, (ty / 31) | 0, salt);
  const c = hash2((tx / 5 + ty / 40) | 0, 0, salt + 11);
  let v = Math.abs(a - c) + Math.abs(hash2((tx / 17) | 0, (ty / 13) | 0, salt + 5) - 0.5) * 0.6;
  return v > 1 ? 1 : v;
}

/** a small per-material salt so two materials with the same pattern do not share a grain field. @param {string} id @returns {number} */
function idSalt(id) { let h = 2166136261; for (let i = 0; i < id.length; i++) h = (Math.imul(h, 16777619) ^ id.charCodeAt(i)) >>> 0; return h & 0xffff; }

/**
 * Bake a material x weathering into a TILING RGB texture of `size` x `size` display bytes. The albedo
 * is the weathered pattern surface; a micro-relief shade from the ONE NW light (finite-difference
 * normal of the height field, dotted with MATERIAL_LIGHT) adds carved depth; the result is tone-mapped
 * through the pinned TONE_LUT to bytes. TILING: the height/albedo sampling wraps (modular hashing), so
 * the texture repeats seamlessly. @param {string} materialId @param {string} weatheringId @param {number} [size]
 * @returns {{ size: number, rgb: Uint8Array }}
 */
export function bakeMaterialTexture(materialId, weatheringId, size) {
  const m = MATERIALS[materialId];
  if (!m) throw new Error(`arch/materials: material "${materialId}" is not registered`);
  const w = WEATHERING[weatheringId];
  if (!w) throw new Error(`arch/materials: weathering "${weatheringId}" is not registered`);
  const S = size && size > 0 ? size | 0 : 64;
  const salt = idSalt(m.id);
  /** sample the weathered LINEAR albedo + height, wrapping for tiling. @param {number} x @param {number} y @returns {{ rgb:[number,number,number], height:number }} */
  const sample = (x, y) => {
    const s = patternSurface(m, ((x % S) + S) % S, ((y % S) + S) % S, S);
    let r = s.rgb[0] * w.tint[0], g = s.rgb[1] * w.tint[1], b = s.rgb[2] * w.tint[2];
    const dk = 1 - w.darken;
    r *= dk; g *= dk; b *= dk;
    // weathering grain + directional streaks
    const grain = 1 + (hash2(x, y, salt + 17) - 0.5) * 0.10 * w.grainAmp;
    r *= grain; g *= grain; b *= grain;
    if (w.streak > 0 && hash2((x / 4) | 0, salt + 23, 9) < w.streak) {
      const run = 0.80 + hash2(x, (y / 6) | 0, salt + 29) * 0.18;
      r *= run; g *= run; b *= run;
    }
    return { rgb: [r, g, b], height: s.height };
  };
  const rgb = new Uint8Array(S * S * 3);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const c = sample(x, y);
      // micro-relief: finite-difference normal of the wrapped height field -> Lambert from ONE light
      const hL = sample(x - 1, y).height, hR = sample(x + 1, y).height;
      const hD = sample(x, y - 1).height, hU = sample(x, y + 1).height;
      const nx = (hL - hR) * m.relief, ny = (hD - hU) * m.relief, nz = 1;
      const nmag = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      let ndl = (nx / nmag) * MATERIAL_LIGHT[0] + (ny / nmag) * MATERIAL_LIGHT[1] + (nz / nmag) * MATERIAL_LIGHT[2];
      if (ndl < 0) ndl = 0;
      const shade = 0.62 + 0.5 * ndl;   // ambient floor + one-light key
      const o = (y * S + x) * 3;
      rgb[o] = tone(c.rgb[0] * shade);
      rgb[o + 1] = tone(c.rgb[1] * shade);
      rgb[o + 2] = tone(c.rgb[2] * shade);
    }
  }
  return { size: S, rgb };
}

/** the mean linear-albedo of a baked material x weathering (a compact plate/viewer tint sample). @param {string} materialId @param {string} weatheringId @returns {[number, number, number]} */
export function materialMeanAlbedo(materialId, weatheringId) {
  const { size, rgb } = bakeMaterialTexture(materialId, weatheringId, 32);
  let r = 0, g = 0, b = 0; const n = size * size;
  for (let i = 0; i < rgb.length; i += 3) { r += rgb[i]; g += rgb[i + 1]; b += rgb[i + 2]; }
  return [r / n / 255, g / n / 255, b / n / 255];
}
