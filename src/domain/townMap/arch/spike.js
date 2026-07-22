/**
 * domain/townMap/arch/spike.js -- K-0 SPIKE: the scene assembly + the two render outputs.
 *
 * Assembles the fragment (ONE flying-buttress bay bracing a wall that carries ONE traceried
 * gothic window), projects it through the axonometric bezier projector with a fit-to-canvas
 * transform, computes per-face Lambert from the ONE fixed NW light, and emits:
 *   (a) the ENGRAVING VECTOR SVG -- structural line-art (cubic paths, never arc `A`); the
 *       print/plotter comparison, NOT a fidelity candidate (kernel doc No-Compromise ruling);
 *   (b) the CEILING PLATE -- the max-fidelity deterministic CPU raster (raster.js), delivered
 *       raw as PNG and also embedded as a data: URI in an SVG with the linework overlaid (the
 *       doc's canonical plate form).
 * Plus METRICS (draw-ops + bytes) for the LOD extrapolation (K-0 gate c).
 *
 * PURITY: {+, -, *, /} + Math.sqrt/round/min/max (0 transcendental sites); pure function of
 * `opts` -- same opts -> byte-identical outputs (the determinism proof).
 *
 * @typedef {import('./geom.js').P3} P3
 * @typedef {[number, number]} P2
 */

import { buildFlyingButtress } from './flyingButtress.js';
import { buildGothicWindow } from './gothicWindow.js';
import { makeArchProjector, projectSubpath, subpathToPathD, sortRenderables } from './project.js';
import { flattenSubpath } from './geom.js';
import { LIGHT_MODEL } from './rationalTables.js';
import { renderPlate } from './raster.js';
import { encodePng } from './png.js';

const FLATTEN_STEPS = 10;

/** dot a model normal with the fixed NW model light. @param {readonly [number,number,number]} n @returns {number} */
function lambertOf(n) {
  return n[0] * LIGHT_MODEL[0] + n[1] * LIGHT_MODEL[1] + n[2] * LIGHT_MODEL[2];
}

/** average model-y (depth) of a set of points. @param {ReadonlyArray<P3>} pts @returns {number} */
function avgDepth(pts) {
  let s = 0;
  for (const p of pts) s += p[1];
  return pts.length ? s / pts.length : 0;
}

/**
 * Build the whole spike scene: geometry -> projection -> fit -> commands + engraving.
 * @param {{ width?: number, height?: number, margin?: number, ss?: number }} [opts]
 */
export function buildScene(opts) {
  const W = opts && opts.width ? opts.width : 720;
  const H = opts && opts.height ? opts.height : 720;
  const margin = opts && opts.margin ? opts.margin : 56;
  const ss = opts && opts.ss ? opts.ss : 2;

  // ── MODEL SCENE ────────────────────────────────────────────────────────────
  const bay = buildFlyingButtress({ bx: 60, wallY: 0, groundZ: 0 });
  const win = buildGothicWindow({ ox: 180, oy: bay.wallPlane.oy, oz: 120 });
  // a foreground ground apron (z = 0 plane receding toward the viewer)
  /** @type {ReadonlyArray<P3>} */
  const ground = [[-10, 0, 0], [430, 0, 0], [430, 120, 0], [-10, 120, 0]];

  // ── PROJECT + FIT ────────────────────────────────────────────────────────────
  const proj = makeArchProjector();
  /** @type {Array<[number, number]>} */
  const rawPts = [];
  const collect = (/** @type {ReadonlyArray<P3>} */ pts) => { for (const p of pts) rawPts.push(proj.projectRaw(p)); };
  collect(ground);
  collect(bay.wall.ring);
  for (const f of bay.faces) collect(f.ring);
  for (const b of bay.bars) collect(flattenSubpath(b.sub, FLATTEN_STEPS));
  for (const r of win.regions) collect(flattenSubpath(r.sub, FLATTEN_STEPS));

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const q of rawPts) {
    if (q[0] < minX) minX = q[0]; if (q[0] > maxX) maxX = q[0];
    if (q[1] < minY) minY = q[1]; if (q[1] > maxY) maxY = q[1];
  }
  const spanX = maxX - minX || 1, spanY = maxY - minY || 1;
  const scale = Math.min((W - 2 * margin) / spanX, (H - 2 * margin) / spanY);
  const tx = margin - minX * scale + ((W - 2 * margin) - spanX * scale) / 2;
  const ty = margin - minY * scale + ((H - 2 * margin) - spanY * scale) / 2;
  /** project a model point to fitted, rounded screen space. @param {P3} p @returns {[number,number]} */
  const project = (p) => { const q = proj.projectRaw(p); return [Math.round(q[0] * scale + tx), Math.round(q[1] * scale + ty)]; };
  /** ground-contact screen line for AO (the wall base). */
  const groundLineY = project([200, 0, 0])[1];

  // ── SHADING PALETTE (linear rgb) ──────────────────────────────────────────────
  /** @type {[number,number,number]} */ const STONE = [0.82, 0.77, 0.67];
  /** @type {[number,number,number]} */ const STONE_WARM = [0.80, 0.74, 0.63];
  /** @type {[number,number,number]} */ const GLASS = [0.10, 0.13, 0.19];
  /** @type {[number,number,number]} */ const GROUND = [0.50, 0.47, 0.42];

  /** @type {import('./raster.js').Cmd[]} */
  const commands = [];
  commands.push({ op: 'background', top: [0.70, 0.77, 0.86], bottom: [0.86, 0.83, 0.77] });

  // ground apron (front-facing +z, lit)
  commands.push({ op: 'face', ring: ground.map(project), lambert: lambertOf([0, 0, 1]), albedo: GROUND, groundY: groundLineY, material: 'ground' });
  // the braced wall (front +y -> ambient, textured)
  commands.push({ op: 'face', ring: bay.wall.ring.map(project), lambert: lambertOf(bay.wall.normal), albedo: STONE, groundY: groundLineY, material: 'stone' });

  // ── WINDOW (on the wall): stone plate, glass, then rounded tracery bars ─────────
  let opCount = 2;
  for (const r of win.regions) {
    if (r.role === 'glass') {
      commands.push({ op: 'glass', ring: flattenSubpath(r.sub, FLATTEN_STEPS).map(project), albedo: GLASS });
    } else if (r.role === 'stone') {
      commands.push({ op: 'face', ring: flattenSubpath(r.sub, FLATTEN_STEPS).map(project), lambert: lambertOf(bay.wall.normal), albedo: STONE_WARM, groundY: groundLineY, material: 'stone' });
    } else {
      commands.push({ op: 'bar', line: flattenSubpath(r.sub, FLATTEN_STEPS).map(project), halfWidth: Math.max(1, r.width * scale * 0.5), albedo: STONE });
    }
    opCount++;
  }

  // ── SOFT CAST SHADOW of the flyer onto the wall ────────────────────────────────
  // project the flyer centerline along the light onto the wall plane (y = wallY), soft edge.
  const flyerPts = flattenSubpath(bay.bars[0].sub, FLATTEN_STEPS);
  /** shadow of a model point onto the wall plane (y = oy) along the light ray. @param {P3} p @returns {[number,number]} */
  const shadowOnWall = (p) => {
    const u = (p[1] - bay.wallPlane.oy) / (LIGHT_MODEL[1] || 1); // travel to the wall plane
    return project([p[0] - u * LIGHT_MODEL[0], bay.wallPlane.oy, p[2] - u * LIGHT_MODEL[2]]);
  };
  commands.push({ op: 'shadow', line: flyerPts.map(shadowOnWall), halfWidth: 10 * scale * 0.5, strength: 0.42, penumbra: 14 * scale * 0.5 });

  // ── BUTTRESS (depth-sorted, in front of the wall): culled faces + bars ─────────
  /** @type {Array<{ depth:number, id:string, cmd: import('./raster.js').Cmd }>} */
  const front = [];
  for (const f of bay.faces) {
    // back-face cull for this fragment: keep front (+y), top (+z), west (-x); drop east/back.
    const visible = f.normal[1] > 0 || f.normal[2] > 0 || f.normal[0] < 0;
    if (!visible) continue;
    front.push({ depth: avgDepth(f.ring), id: `face:${f.id}`, cmd: {
      op: 'face', ring: f.ring.map(project), lambert: lambertOf(f.normal), albedo: STONE, groundY: groundLineY, material: 'stone',
    } });
    opCount++;
  }
  for (const b of bay.bars) {
    const pts = flattenSubpath(b.sub, FLATTEN_STEPS);
    front.push({ depth: avgDepth(pts), id: `bar:${b.id}`, cmd: {
      op: 'bar', line: pts.map(project), halfWidth: Math.max(1, b.width * scale * 0.5), albedo: STONE,
    } });
    opCount++;
  }
  for (const item of sortRenderables(front)) commands.push(item.cmd);

  return {
    commands, project, width: W, height: H, ss, groundLineY,
    bay, win, ground, opCount,
    faces: bay.faces.length, bars: bay.bars.length + countBars(win),
    glass: win.regions.filter((r) => r.role === 'glass').length,
  };
}

/** count bar regions in a window build. @param {ReturnType<typeof buildGothicWindow>} win @returns {number} */
function countBars(win) {
  let n = 0;
  for (const r of win.regions) if (r.role === 'bar') n++;
  return n;
}

/** standard base64 (RFC 4648) of a byte array -- pure, no Buffer/btoa. @param {Uint8Array} bytes @returns {string} */
function base64(bytes) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  let i = 0;
  for (; i + 3 <= bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + A[(n >> 6) & 63] + A[n & 63];
  }
  const rem = bytes.length - i;
  if (rem === 1) {
    const n = bytes[i] << 16;
    out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + '==';
  } else if (rem === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    out += A[(n >> 18) & 63] + A[(n >> 12) & 63] + A[(n >> 6) & 63] + '=';
  }
  return out;
}

/**
 * The ENGRAVING VECTOR SVG: structural line-art of the projected fragment (cubic paths, never
 * arc `A`). Not a fidelity candidate -- the print/plotter comparison plate.
 * @param {ReturnType<typeof buildScene>} scene
 * @returns {string}
 */
export function toEngravingSvg(scene) {
  const { project, width, height } = scene;
  const INK = '#2b2622', PAPER = '#efe7d6';
  /** @type {string[]} */
  const body = [];
  body.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="${PAPER}"/>`);
  // buttress faces (polygons)
  for (const f of scene.bay.faces) {
    const visible = f.normal[1] > 0 || f.normal[2] > 0 || f.normal[0] < 0;
    if (!visible) continue;
    const pts = f.ring.map(project).map((p) => `${p[0]},${p[1]}`).join(' ');
    body.push(`<polygon points="${pts}" fill="none" stroke="${INK}" stroke-width="1.4"/>`);
  }
  // window regions (cubic paths)
  for (const r of scene.win.regions) {
    const d = subpathToPathD(projectSubpath(project, r.sub));
    const w = r.role === 'bar' ? Math.max(0.8, r.width * 0.4) : 1.2;
    body.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`);
  }
  // buttress bars (cubic paths)
  for (const b of scene.bay.bars) {
    const d = subpathToPathD(projectSubpath(project, b.sub));
    body.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body.join('')}</svg>`;
}

/**
 * Render the full spike: the engraving SVG, the raster PNG bytes, and a plate SVG embedding the
 * PNG with the linework overlaid. Deterministic in `opts`.
 * @param {{ width?: number, height?: number, ss?: number }} [opts]
 * @returns {{ engravingSvg: string, pngBytes: Uint8Array, plateSvg: string, metrics: object }}
 */
export function renderSpike(opts) {
  const scene = buildScene(opts);
  const plate = renderPlate(scene.commands, { width: scene.width, height: scene.height, ss: scene.ss, groundLineY: scene.groundLineY });
  const pngBytes = encodePng(plate.width, plate.height, plate.rgb);
  const engravingSvg = toEngravingSvg(scene);
  const b64 = base64(pngBytes);
  // linework overlay: reuse the engraving body but transparent bg over the raster.
  const overlay = engravingSvg.replace(/<rect[^>]*fill="#efe7d6"[^>]*\/>/, '');
  const inner = overlay.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const plateSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}">`
    + `<image x="0" y="0" width="${scene.width}" height="${scene.height}" href="data:image/png;base64,${b64}"/>`
    + `<g opacity="0.16">${inner}</g></svg>`;

  const metrics = {
    width: scene.width, height: scene.height, ss: scene.ss,
    opCount: scene.opCount,
    faces: scene.faces, bars: scene.bars, glass: scene.glass,
    commandCount: scene.commands.length,
    engravingBytes: engravingSvg.length,
    pngBytes: pngBytes.length,
    plateSvgBytes: plateSvg.length,
  };
  return { engravingSvg, pngBytes, plateSvg, metrics };
}
