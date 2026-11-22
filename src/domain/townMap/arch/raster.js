/**
 * domain/townMap/arch/raster.js -- K-0 SPIKE: the MAX-FIDELITY deterministic CPU rasterizer.
 *
 * THE CEILING PLATE (kernel doc CORRECTION 3 / K-0 gate d). This is the experiment: a pure-CPU
 * scanline renderer that resolves, per pixel, the fidelity features flat SVG cannot -- per-pixel
 * Lambert from the ONE fixed NW light, rounded-relief (tube-normal) shading of carved tracery,
 * ambient occlusion in the recesses, a SOFT-SHADOW penumbra cast by the flyer, and a procedural
 * STONE material (ashlar coursing + integer-hash grain + weathering). It renders into a linear
 * Float framebuffer at a supersample factor, box-downsamples for anti-aliasing, and tone-maps
 * through the pinned TONE_LUT to display bytes.
 *
 * DETERMINISM: {+, -, *, /} + Math.sqrt/round/min/max/abs/floor + integer hashing ONLY -- zero
 * transcendentals (the ratchet holds it at 0 sites), so the byte output is engine-stable and a
 * double run is cmp-identical. It consumes a flat COMMAND list (plain data assembled by spike.js)
 * so this module holds all shading math and none of the scene knowledge.
 *
 * @typedef {readonly [number, number]} P2
 * @typedef {[number, number, number]} RGB  linear rgb, each channel ~[0, 1]
 * @typedef {{ op: 'background', top: RGB, bottom: RGB }} CmdBg
 * @typedef {{ op: 'face', ring: ReadonlyArray<P2>, lambert: number, albedo: RGB, groundY: number, material: string }} CmdFace
 * @typedef {{ op: 'glass', ring: ReadonlyArray<P2>, albedo: RGB }} CmdGlass
 * @typedef {{ op: 'shadow', line: ReadonlyArray<P2>, halfWidth: number, strength: number, penumbra: number }} CmdShadow
 * @typedef {{ op: 'bar', line: ReadonlyArray<P2>, halfWidth: number, albedo: RGB }} CmdBar
 * @typedef {CmdBg | CmdFace | CmdGlass | CmdShadow | CmdBar} Cmd
 */

import { LIGHT } from './rationalTables.js';
import { tone } from './rationalTables.js';
import { pointInRing, distToSeg2, ringBounds, hash2 } from './geom.js';

const AMBIENT = 0.42;   // fill light so shadowed faces keep material read
const DIFFUSE = 0.62;

/**
 * Procedural stone albedo modulation at texture coords (tx, ty) in full-res pixels: ashlar
 * running-bond coursing (mortar valleys), per-block tint, fine grain, and vertical weathering
 * streaks. Returns a multiplier applied to the base stone albedo. Pure integer hashing.
 * @param {number} tx @param {number} ty @param {number} salt
 * @returns {number}
 */
function stoneMod(tx, ty, salt) {
  const CH = 24;                 // course height
  const BW = 52;                 // block width
  const row = Math.floor(ty / CH);
  const shift = (row & 1) * (BW / 2); // running bond
  const bx = Math.floor((tx + shift) / BW);
  const inRowY = ty - row * CH;
  const inBlkX = (tx + shift) - bx * BW;
  let m = 1;
  // mortar valleys (recessed joints read darker)
  if (inRowY < 2 || inBlkX < 2) m *= 0.62;
  else if (inRowY < 3.5 || inBlkX < 3.5) m *= 0.82;
  // per-block tint variation
  m *= 0.9 + hash2(bx, row, salt) * 0.2;
  // fine grain
  m *= 0.94 + hash2(tx | 0, ty | 0, salt + 7) * 0.12;
  // vertical weathering streaks keyed to the block column (occasional darker runs)
  if (hash2(bx, salt + 13, 3) > 0.78) m *= 0.86 + hash2(tx | 0, salt + 5, 9) * 0.1;
  return m;
}

/**
 * The CPU rasterizer. Renders a command list to an 8-bit RGB PNG-ready buffer.
 * @param {ReadonlyArray<Cmd>} commands
 * @param {{ width: number, height: number, ss?: number, groundLineY: number }} opts
 * @returns {{ width: number, height: number, rgb: Uint8Array }}
 */
export function renderPlate(commands, opts) {
  const ss = opts.ss && opts.ss > 0 ? opts.ss | 0 : 2;
  const W = opts.width * ss, H = opts.height * ss;
  const groundY = opts.groundLineY * ss;
  const buf = new Float32Array(W * H * 3);

  /** set a linear pixel. @param {number} x @param {number} y @param {number} r @param {number} g @param {number} b */
  const put = (x, y, r, g, b) => {
    const i = (y * W + x) * 3;
    buf[i] = r; buf[i + 1] = g; buf[i + 2] = b;
  };
  /** multiply a linear pixel (for shadow). @param {number} x @param {number} y @param {number} k */
  const mul = (x, y, k) => {
    const i = (y * W + x) * 3;
    buf[i] *= k; buf[i + 1] *= k; buf[i + 2] *= k;
  };

  for (const cmd of commands) {
    if (cmd.op === 'background') {
      for (let y = 0; y < H; y++) {
        const t = y / (H - 1);
        const r = cmd.top[0] + (cmd.bottom[0] - cmd.top[0]) * t;
        const g = cmd.top[1] + (cmd.bottom[1] - cmd.top[1]) * t;
        const b = cmd.top[2] + (cmd.bottom[2] - cmd.top[2]) * t;
        for (let x = 0; x < W; x++) put(x, y, r, g, b);
      }
    } else if (cmd.op === 'face') {
      const ring = cmd.ring.map((p) => /** @type {P2} */ ([p[0] * ss, p[1] * ss]));
      const bnd = ringBounds(ring);
      const x0 = Math.max(0, bnd.minX), x1 = Math.min(W - 1, bnd.maxX);
      const y0 = Math.max(0, bnd.minY), y1 = Math.min(H - 1, bnd.maxY);
      const lit = AMBIENT + DIFFUSE * (cmd.lambert < 0 ? 0 : cmd.lambert);
      const isStone = cmd.material === 'stone' || cmd.material === 'ground';
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          if (!pointInRing(x + 0.5, y + 0.5, ring)) continue;
          let m = isStone ? stoneMod(x / ss, y / ss, cmd.material === 'ground' ? 101 : 41) : 1;
          // contact AO: darken toward the ground contact line
          const gd = (groundY - y) / (46 * ss);
          if (gd >= 0 && gd < 1) m *= 0.6 + 0.4 * gd;
          const s = lit * m;
          put(x, y, cmd.albedo[0] * s, cmd.albedo[1] * s, cmd.albedo[2] * s);
        }
      }
    } else if (cmd.op === 'glass') {
      const ring = cmd.ring.map((p) => /** @type {P2} */ ([p[0] * ss, p[1] * ss]));
      const bnd = ringBounds(ring);
      const x0 = Math.max(0, bnd.minX), x1 = Math.min(W - 1, bnd.maxX);
      const y0 = Math.max(0, bnd.minY), y1 = Math.min(H - 1, bnd.maxY);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          if (!pointInRing(x + 0.5, y + 0.5, ring)) continue;
          // recess AO: darker near the top of the opening (light falls off into the reveal)
          const vt = (y - y0) / Math.max(1, y1 - y0); // 0 top .. 1 bottom
          let s = 0.5 + 0.5 * vt;
          // leaded quarry grid (thin brighter cames)
          const gx = (x / ss) % 16, gy = (y / ss) % 16;
          if (gx < 1.2 || gy < 1.2) s += 0.35;
          put(x, y, cmd.albedo[0] * s, cmd.albedo[1] * s, cmd.albedo[2] * s);
        }
      }
    } else if (cmd.op === 'shadow') {
      // soft cast band: darken receiver pixels near the projected occluder line, penumbra soft.
      const line = cmd.line.map((p) => /** @type {P2} */ ([p[0] * ss, p[1] * ss]));
      const hw = cmd.halfWidth * ss, pen = cmd.penumbra * ss;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of line) {
        if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
      }
      const pad = hw + pen;
      const x0 = Math.max(0, Math.floor(minX - pad)), x1 = Math.min(W - 1, Math.ceil(maxX + pad));
      const y0 = Math.max(0, Math.floor(minY - pad)), y1 = Math.min(H - 1, Math.ceil(maxY + pad));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          let best = Infinity;
          for (let i = 0; i < line.length - 1; i++) {
            const a = line[i], b = line[i + 1];
            const d = distToSeg2(x + 0.5, y + 0.5, a[0], a[1], b[0], b[1]).d2;
            if (d < best) best = d;
          }
          const dist = Math.sqrt(best);
          let cov = 0;
          if (dist <= hw) cov = 1;
          else if (dist < hw + pen) cov = 1 - (dist - hw) / pen;
          if (cov > 0) mul(x, y, 1 - cmd.strength * cov);
        }
      }
    } else if (cmd.op === 'bar') {
      const line = cmd.line.map((p) => /** @type {P2} */ ([p[0] * ss, p[1] * ss]));
      const hw = cmd.halfWidth * ss;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of line) {
        if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1]; if (p[1] > maxY) maxY = p[1];
      }
      const x0 = Math.max(0, Math.floor(minX - hw)), x1 = Math.min(W - 1, Math.ceil(maxX + hw));
      const y0 = Math.max(0, Math.floor(minY - hw)), y1 = Math.min(H - 1, Math.ceil(maxY + hw));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          let best = Infinity, bcx = 0, bcy = 0;
          for (let i = 0; i < line.length - 1; i++) {
            const a = line[i], b = line[i + 1];
            const r = distToSeg2(x + 0.5, y + 0.5, a[0], a[1], b[0], b[1]);
            if (r.d2 < best) { best = r.d2; bcx = r.cx; bcy = r.cy; }
          }
          const dist = Math.sqrt(best);
          if (dist > hw) continue;
          // tube cross-section normal: outward screen dir scaled by t, z = sqrt(1 - t^2)
          const t = dist / hw;
          let ox = 0, oy = 0;
          if (dist > 0.0001) { ox = (x + 0.5 - bcx) / dist; oy = (y + 0.5 - bcy) / dist; }
          const nz = Math.sqrt(Math.max(0, 1 - t * t));
          const nx = ox * t, ny = oy * t;
          let ndl = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
          if (ndl < 0) ndl = 0;
          const m = stoneMod(x / ss, y / ss, 41);
          const s = (AMBIENT + DIFFUSE * ndl) * m;
          put(x, y, cmd.albedo[0] * s, cmd.albedo[1] * s, cmd.albedo[2] * s);
        }
      }
    }
  }

  // Downsample (box) + tone map to display bytes.
  const outW = opts.width, outH = opts.height;
  const rgb = new Uint8Array(outW * outH * 3);
  const inv = 1 / (ss * ss);
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const i = ((y * ss + sy) * W + (x * ss + sx)) * 3;
          r += buf[i]; g += buf[i + 1]; b += buf[i + 2];
        }
      }
      const o = (y * outW + x) * 3;
      rgb[o] = tone(r * inv);
      rgb[o + 1] = tone(g * inv);
      rgb[o + 2] = tone(b * inv);
    }
  }
  return { width: outW, height: outH, rgb };
}
