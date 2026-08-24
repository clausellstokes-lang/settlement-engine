/**
 * lib/classify.mjs — REG-I0 · the ten-role classifier and the role MASKS every pixel
 * instrument probes through.
 *
 * ⭐ THE CLASSIFIER IS REG-0's, LIFTED (postPass.mjs §2). It keys on the sealed lens's exact
 * role colours (`folioLenses.js` at ee0db96d3), which is what makes it safe: the harness emits
 * role colours verbatim, so the classifier reads the drawing's own vocabulary rather than
 * guessing at pixels.
 *
 * ⭐⭐ AND THE MASKS ALWAYS COME FROM THE **BASE** RENDER, WHATEVER RASTER IS UNDER TEST.
 * That is the controlled design REG-0's own frontage metric uses in its own words — "the same
 * instrument, the same samples, the same probes… only the mask differs". A specimen repaints
 * the page, so classifying the specimen with the base's colour table would move the PROBES as
 * well as the picture, and a before/after delta measured through two different probe sets is
 * not a delta at all.
 */
import { readFileSync } from 'node:fs';
import { tokenize, subpaths, pointsOf, isHex } from './svg.mjs';
import { lumHex, hex2rgb, inPoly } from './geom.mjs';

/** the sealed ten-role tables, copied from folioLenses.js at ee0db96d3 */
export const LENSES = {
  parchment: { paper: '#E9DEC3', ink: '#2B2118', roofs: '#8A5F3A', water: '#7E8E97', greens: '#9FA47A', roads: '#F3EBD6', walls: '#241B12', trees: '#61704A', labels: '#3E2C18', elements: '#EFE5CC' },
  darkFantasy: { paper: '#1E2430', ink: '#05070B', roofs: '#2E2A33', water: '#16202E', greens: '#26302B', roads: '#6E7486', walls: '#04060A', trees: '#1D2A22', labels: '#C9C2AE', elements: '#2A313E' },
  watercolor: { paper: '#F1E8D2', ink: '#3A2C20', roofs: '#A9714A', water: '#8FA3AE', greens: '#AEB489', roads: '#FAF3E2', walls: '#33261A', trees: '#6E7F52', labels: '#4A3520', elements: '#F6EDD9' },
};

export const ROLE_NAMES = ['text', 'paper', 'ground', 'detail', 'field', 'street', 'water', 'chrome', 'square', 'yard', 'building', 'blockfront', 'landmark', 'wall'];

/**
 * Classify every drawing element of an SVG into REG-0's roles.
 * @returns {{els:Array, census:Object, ROLE:Object}}
 */
export function classify(svgPath, lensId = 'parchment') {
  const src = readFileSync(svgPath, 'utf8');
  const ROLE = LENSES[lensId] || LENSES.parchment;
  const toks = tokenize(src);
  const stack = [];
  const els = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.kind === 'text') continue;
    if (t.kind === 'close') { stack.pop(); continue; }
    const groups = stack.slice();
    if (t.kind === 'open') stack.push(t.attrs.id || `<${t.tag}>`);
    if (t.tag === 'svg') continue;
    els.push({ i, t, groups, tag: t.tag });
  }
  const inG = (rec, id) => rec.groups.includes(id);

  const chromeZones = [];
  for (const r of els) {
    const a = r.t.attrs;
    if (r.tag === 'rect' && a.x != null && Number(a.width) < 900) {
      chromeZones.push([Number(a.x) - 6, Number(a.y) - 6, Number(a.x) + Number(a.width) + 6, Number(a.y) + Number(a.height) + 6]);
    }
    if (r.tag === 'circle' && Number(a.r) < 60) {
      chromeZones.push([Number(a.cx) - Number(a.r) - 22, Number(a.cy) - Number(a.r) - 22, Number(a.cx) + Number(a.r) + 22, Number(a.cy) + Number(a.r) + 22]);
    }
  }
  chromeZones.push([18, 20, 320, 110]);
  const inChrome = (x, y) => chromeZones.some((z) => x >= z[0] && x <= z[2] && y >= z[1] && y <= z[3]);

  const paperLum = lumHex(ROLE.paper);
  for (const r of els) {
    const a = r.t.attrs;
    const fill = a.fill, stroke = a.stroke, d = a.d;
    if (r.tag === 'text' || r.tag === 'tspan' || r.tag === 'title') { r.role = 'text'; continue; }
    if (inG(r, 'legend') || inG(r, 'lettering') || inG(r, 'wardlabels') || inG(r, 'marginalia') || inG(r, 'eventcaptions')) { r.role = 'chrome'; continue; }
    if (r.tag === 'rect' && Number(a.width) >= 900) { r.role = 'paper'; continue; }
    if (r.tag === 'rect' || r.tag === 'circle') { r.role = 'chrome'; continue; }
    const pts = d ? pointsOf(d) : [];
    if (pts.length && pts.every((p) => inChrome(p[0], p[1]))) { r.role = 'chrome'; continue; }
    if (inG(r, 'fields')) { r.role = 'field'; continue; }
    if (inG(r, 'fabric')) { r.role = 'building'; continue; }
    if (inG(r, 'landmarks')) { r.role = 'landmark'; continue; }
    if (inG(r, 'yards')) { r.role = 'yard'; continue; }
    if (inG(r, 'squares')) { r.role = 'square'; continue; }
    if (isHex(stroke) && stroke.toUpperCase() === ROLE.walls.toUpperCase()) { r.role = 'wall'; continue; }
    if (a['stroke-linecap'] === 'square' && isHex(stroke) && fill === 'none' && stroke.toUpperCase() === ROLE.ink.toUpperCase()) { r.role = 'blockfront'; continue; }
    if (a['stroke-linecap'] === 'square' && isHex(stroke) && lumHex(stroke) < paperLum * 0.55) { r.role = 'wall'; continue; }
    const bluish = (h) => { if (!isHex(h)) return false; const c = hex2rgb(h); return c[2] > c[0] + 3; };
    if (bluish(fill) || (fill === 'none' && bluish(stroke) && Number(a['stroke-width']) < 1.2)) { r.role = 'water'; continue; }
    if (fill === 'none' && isHex(stroke) && lumHex(stroke) >= paperLum - 2 && Number(a['stroke-width']) >= 1) { r.role = 'street'; continue; }
    if (fill === 'none' && isHex(stroke) && Math.abs(lumHex(stroke) - paperLum) < 16 && Number(a['stroke-width']) >= 1.5) { r.role = 'street'; continue; }
    if (isHex(fill) && (stroke === 'none' || stroke === undefined)) { r.role = 'ground'; continue; }
    if (isHex(fill) && isHex(stroke)) { r.role = 'ground'; continue; }
    r.role = 'detail';
  }
  const census = {};
  for (const r of els) census[r.role] = (census[r.role] || 0) + 1;
  return { els, census, ROLE, src };
}

/* ───────────────────── role masks, in RASTER pixel space ───────────────────── */

/**
 * A binary mask over an image of side `n` pixels, addressed in SVG VIEW UNITS (0..1000).
 * The folio viewBox is `0 0 1000 1000` and shoot.sh strips width/height before screenshotting
 * at a square window, so unit → pixel is a single uniform scale with no offset. That is
 * asserted here rather than assumed: `assertViewBox()` refuses any other frame.
 */
export class PxMask {
  constructor(n, extent = 1000) { this.n = n; this.extent = extent; this.s = extent / n; this.a = new Uint8Array(n * n); }
  count() { let c = 0; for (let i = 0; i < this.a.length; i++) if (this.a[i]) c++; return c; }
  at(x, y) {
    const cx = Math.floor(x / this.s), cy = Math.floor(y / this.s);
    return (cx < 0 || cy < 0 || cx >= this.n || cy >= this.n) ? 0 : this.a[cy * this.n + cx];
  }
  fillPoly(poly) { this.fillPolys([poly]); }

  /**
   * ⛔⛔ EVEN-ODD ACROSS **ALL** SUBPATHS OF ONE PATH, AND THE UNION VERSION WAS A REAL DEFECT.
   *
   * SVG fills a multi-subpath `<path>` by a single winding rule over every subpath at once, so an
   * outer shape plus an inner subpath is a shape WITH A HOLE. Filling each subpath separately
   * and OR-ing the results turns every hole solid. MEASURED on the sealed city: the water role
   * came back covering 327,001 of 1,210,000 decision pixels — 27% of the plate, swallowing the
   * town — and 210,506 of those "water" pixels were unsaturated because they were not water at
   * all, they were the fabric showing through a hole the mask had filled in. Downstream that
   * read as "the water hue is 42°, warm", which is a false conviction of a correct drawing.
   *
   * ⭐ THE CLASS: a mask built subpath-by-subpath cannot express a hole, and a role that has
   * holes will report the things inside them as itself.
   */
  fillPolys(polys) {
    const { n, s } = this;
    let y0 = Infinity, y1 = -Infinity;
    for (const poly of polys) for (const p of poly) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    if (!Number.isFinite(y0)) return;
    const cy0 = Math.max(0, Math.floor(y0 / s)), cy1 = Math.min(n - 1, Math.ceil(y1 / s));
    const xs = [];
    for (let cy = cy0; cy <= cy1; cy++) {
      const y = (cy + 0.5) * s;
      xs.length = 0;
      for (const poly of polys) {
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
          const [xi, yi] = poly[i], [xj, yj] = poly[j];
          if ((yi > y) !== (yj > y)) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi);
        }
      }
      if (xs.length < 2) continue;
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const cx0 = Math.max(0, Math.floor(xs[k] / s)), cx1 = Math.min(n - 1, Math.floor(xs[k + 1] / s));
        for (let cx = cx0; cx <= cx1; cx++) this.a[cy * n + cx] = 1;
      }
    }
  }
  /**
   * Stamp a stroked segment of half-width `hw` UNITS.
   *
   * ⚠⚠ BITTEN 2026-08-24, AND THE FIX IS THE INSTRUMENT. REG-0's own `stampSeg` marks an
   * INTEGER-CELL disc (`r = ceil(hw/s)`), which is right for a fusion mask and wrong for a
   * measurement: a 1.87-unit alley has hw 0.94, `ceil` rounds its radius up to a whole cell,
   * and the alley is stamped THREE units wide. At 200px that inflated alley then covers 60% of
   * a 5-unit squint pixel and SURVIVES a test it should fail — the street population fills with
   * ink the eye never sees, and the squint verdict is measured on a street web that is not
   * there. The test below is the true distance from the CELL CENTRE to the segment, so a stroke
   * marks the cells it actually covers and a sub-cell stroke marks about one cell per unit run.
   */
  /**
   * ⚠ `legacy` REPRODUCES REG-0's ORIGINAL INTEGER-CELL DISC, and it exists for exactly one
   * reason: REG-0's published figures were measured through it, and a compatibility mode that
   * quietly used the corrected stamp would report "reproduced" while differing in the fourth
   * decimal. It is never the default and never used for a new baseline.
   */
  stampSegLegacy(x0, y0, x1, y1, hw) {
    const L = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(L / (this.s * 0.7)));
    const r = Math.ceil(hw / this.s);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      const ccx = Math.floor(x / this.s), ccy = Math.floor(y / this.s);
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        const cx = ccx + dx, cy = ccy + dy;
        if (cx < 0 || cy < 0 || cx >= this.n || cy >= this.n) continue;
        this.a[cy * this.n + cx] = 1;
      }
    }
  }

  stampSeg(x0, y0, x1, y1, hw) {
    const s = this.s, n = this.n;
    const rc = Math.ceil(hw / s) + 1;
    const L = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(L / (s * 0.7)));
    const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, x = x0 + dx * t, y = y0 + dy * t;
      const ccx = Math.floor(x / s), ccy = Math.floor(y / s);
      for (let jy = -rc; jy <= rc; jy++) {
        for (let jx = -rc; jx <= rc; jx++) {
          const cx = ccx + jx, cy = ccy + jy;
          if (cx < 0 || cy < 0 || cx >= n || cy >= n) continue;
          const k = cy * n + cx;
          if (this.a[k]) continue;
          const px = (cx + 0.5) * s, py = (cy + 0.5) * s;
          const u = L2 ? Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / L2)) : 0;
          if (Math.hypot(px - (x0 + dx * u), py - (y0 + dy * u)) <= hw) this.a[k] = 1;
        }
      }
    }
  }
}

/** ⛔ refuse any folio whose frame is not the 1000×1000 viewBox the unit→pixel map assumes. */
export function assertViewBox(src) {
  const m = src.match(/viewBox="([^"]*)"/);
  if (!m) throw new Error('NO_VIEWBOX — the unit→pixel map cannot be established');
  const v = m[1].trim().split(/[\s,]+/).map(Number);
  if (v[0] !== 0 || v[1] !== 0 || v[2] !== 1000 || v[3] !== 1000) {
    throw new Error(`VIEWBOX_${m[1]} — the instruments assume "0 0 1000 1000"; refusing rather than mis-mapping`);
  }
  return true;
}

/**
 * Build one mask per role at raster resolution `n`.
 * Filled roles are scan-filled; stroked roles (street, wall, water rules) are stamped along
 * their polyline at their own declared half-width — the ink's real footprint, not its spine.
 */
export function roleMasks(els, n, roles) {
  /** @type {Record<string, PxMask>} */ const out = {};
  for (const role of roles) out[role] = new PxMask(n);
  for (const r of els) {
    if (!roles.includes(r.role)) continue;
    const a = r.t.attrs;
    if (!a.d) continue;
    const M = out[r.role];
    const stroked = a.fill === 'none' || !isHex(a.fill);
    const hw = Math.max(0.5, Number(a['stroke-width'] || 1) / 2);
    const sps = subpaths(a.d);
    if (!stroked) {
      // one winding rule over EVERY subpath of this path — see fillPolys' header
      M.fillPolys(sps.filter((sp) => sp.poly.length > 2).map((sp) => sp.poly));
      continue;
    }
    for (const sp of sps) {
      for (let k = 0; k + 1 < sp.poly.length; k++) {
        const [x0, y0] = sp.poly[k], [x1, y1] = sp.poly[k + 1];
        if (Math.hypot(x1 - x0, y1 - y0) > 200) continue;   // a stray closing chord
        M.stampSeg(x0, y0, x1, y1, hw);
      }
    }
  }
  return out;
}

/** collect the raw subpath polygons of a role (unit space) */
export function rolePolys(els, role) {
  const out = [];
  for (const r of els) {
    if (r.role !== role || !r.t.attrs.d) continue;
    for (const sp of subpaths(r.t.attrs.d)) if (sp.poly.length > 2) out.push({ poly: sp.poly, attrs: r.t.attrs });
  }
  return out;
}

export { inPoly };
