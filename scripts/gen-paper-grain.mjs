#!/usr/bin/env node
/**
 * scripts/gen-paper-grain.mjs — pre-bake THE MATERIAL LAYER's paper-grain tiles
 * (Deep Craft annex, Foundation addition 1; Organic Craft law §6/§8).
 *
 * Two seamless 256×256 alpha-overlay tiles land in public/textures/:
 *   paper-grain-light.png — warm-dark tooth flecks for the cream grounds
 *   paper-grain-dim.png   — cream fiber lift for the FIELD dim grounds
 *
 * WHY PRE-BAKED: runtime feTurbulence is BANNED (law §8) — the filter evaluates
 * at render and costs paint time on every frame of every scrolling register. A
 * static tile costs one decode, ever. The texture is an ALPHA OVERLAY, never a
 * ground: it layers over the existing ground colors at ≤4.5% peak opacity, so
 * the worst pixel behind any glyph stays inside the contrast budget the ink
 * tokens already reserve headroom for (law §6 — reference 02-material-macro's
 * TAKE: paper tooth scale; NEVER TAKE: macro drama on working surfaces).
 *
 * DETERMINISM (asymmetry with provenance — seeded, never jitter): FNV-1a-driven
 * periodic value noise, three octaves, plus a per-pixel tooth speckle. No
 * Math.random, no wall clock — re-running this script is byte-stable, so the
 * committed tiles are reproducible artifacts, not snowflakes. Alpha is
 * quantized to 8 levels so the palette PNG stays small.
 *
 * Run: node scripts/gen-paper-grain.mjs  (idempotent; overwrites the two tiles)
 * Guarded by tests/design/organicMaterial.test.js (existence + byte ceilings).
 */

import sharp from 'sharp';
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'textures');

const SIZE = 256; // tile edge; periodic noise wraps at this size (seamless)
const SEED = 'settlementforge-material-1'; // the one fixed provenance seed

// ── FNV-1a (the house seed-hash idiom — dependency-free, same as ornament/fnv.js) ──
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
/** deterministic 0..1 for a slot string */
const frac = (slot) => fnv1a32(`${SEED}::${slot}`) / 0x100000000;

// ── Periodic value noise (wraps at `period` lattice cells → seamless tile) ──
function latticeValue(cx, cy, period, octave) {
  // Wrap lattice coords so the tile edge is seamless.
  const x = ((cx % period) + period) % period;
  const y = ((cy % period) + period) % period;
  return frac(`o${octave}:${x}:${y}`);
}
const smooth = (t) => t * t * (3 - 2 * t);
function valueNoise(px, py, cell, octave) {
  const period = SIZE / cell;
  const gx = px / cell, gy = py / cell;
  const x0 = Math.floor(gx), y0 = Math.floor(gy);
  const tx = smooth(gx - x0), ty = smooth(gy - y0);
  const v00 = latticeValue(x0, y0, period, octave);
  const v10 = latticeValue(x0 + 1, y0, period, octave);
  const v01 = latticeValue(x0, y0 + 1, period, octave);
  const v11 = latticeValue(x0 + 1, y0 + 1, period, octave);
  const a = v00 + (v10 - v00) * tx;
  const b = v01 + (v11 - v01) * tx;
  return a + (b - a) * ty;
}

/**
 * Build one tile as raw RGBA. The overlay ink is constant; only alpha varies.
 * @param {{ r:number,g:number,b:number }} ink  overlay color
 * @param {number} peakAlpha  maximum alpha (0-255) the grain may reach
 * @param {number} toothAlpha extra alpha for the sparse per-pixel tooth speckle
 * @param {string} tag        decorrelates the two tiles' speckle fields
 */
function buildTile({ ink, peakAlpha, toothAlpha, tag }) {
  const buf = Buffer.alloc(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      // Three octaves of periodic fiber noise (coarse wash → fine tooth).
      const n =
        valueNoise(x, y, 64, 1) * 0.5 +
        valueNoise(x, y, 32, 2) * 0.3 +
        valueNoise(x, y, 16, 3) * 0.2;
      // Center and clip: only the upper half of the field deposits ink, so the
      // grain reads as sparse flecks, not a uniform gray veil.
      let a = Math.max(0, (n - 0.52) / 0.48) * peakAlpha;
      // Sparse per-pixel tooth: ~4% of pixels get a one-pixel fleck.
      if (frac(`${tag}:tooth:${x}:${y}`) > 0.96) a += toothAlpha;
      // Quantize alpha to 8 levels — palette-PNG friendly, visually identical
      // at these opacities.
      a = Math.min(255, Math.round(a / 4) * 4);
      const i = (y * SIZE + x) * 4;
      buf[i] = ink.r; buf[i + 1] = ink.g; buf[i + 2] = ink.b; buf[i + 3] = a;
    }
  }
  return buf;
}

async function emit(name, tile) {
  const png = await sharp(tile, { raw: { width: SIZE, height: SIZE, channels: 4 } })
    .png({ palette: true, compressionLevel: 9, effort: 10 })
    .toBuffer();
  const out = join(OUT_DIR, `${name}.png`);
  writeFileSync(out, png);
  return statSync(out).size;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  // light: warm-dark tooth on the cream grounds (ink family, never gray).
  const light = buildTile({ ink: { r: 43, g: 34, b: 20 }, peakAlpha: 11, toothAlpha: 7, tag: 'light' });
  // dim: cream fiber lift on the FIELD warm-dark grounds.
  const dim = buildTile({ ink: { r: 236, g: 224, b: 198 }, peakAlpha: 9, toothAlpha: 6, tag: 'dim' });
  const lb = await emit('paper-grain-light', light);
  const db = await emit('paper-grain-dim', dim);
  console.log(`[gen-paper-grain] paper-grain-light.png ${lb} B · paper-grain-dim.png ${db} B`);
}

main().catch((err) => {
  console.error('[gen-paper-grain] failed:', err);
  process.exit(1);
});
