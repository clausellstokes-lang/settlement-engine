/**
 * lib/geom.mjs — REG-I0 · polygon predicates, colour space, and the report frame.
 * Pure. No Date, no Math.random — every instrument must be re-runnable to the same digits.
 */

/* ───────────────────────────── polygons ───────────────────────────── */

/** even-odd point-in-polygon (the same predicate REG-0's svgLib uses, kept identical) */
export function inPoly(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function absArea(poly) {
  let s = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    s += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
  }
  return Math.abs(s) / 2;
}

export function centroid(poly) {
  let x = 0, y = 0;
  for (const p of poly) { x += p[0]; y += p[1]; }
  return [x / poly.length, y / poly.length];
}

export function bbox(poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of poly) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  return [x0, y0, x1, y1];
}

/** distance from p to segment ab */
export function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const L2 = dx * dx + dy * dy;
  const t = L2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L2)) : 0;
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

/** shortest distance from p to a closed polyline */
export function distToRing(poly, x, y) {
  let d = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    d = Math.min(d, segDist(x, y, poly[j][0], poly[j][1], poly[i][0], poly[i][1]));
  }
  return d;
}

/**
 * ⭐ AREA SHARE OF `poly` LYING OUTSIDE `ring`, by a deterministic lattice sample.
 * The straddle census's own worst-case figure ("26.8% of a government quarter outside its own
 * circuit") is an AREA SHARE, so the instrument must measure area, not vertices: a region can
 * put ten vertices over a wall and almost no ground, and a vertex count would convict it.
 * Denominator = sampled lattice points inside `poly`. Sampling is a fixed grid, so the same
 * geometry returns the same digits forever.
 */
export function areaShareOutside(poly, ring, step) {
  const [x0, y0, x1, y1] = bbox(poly);
  let inside = 0, outside = 0;
  for (let y = y0 + step / 2; y <= y1; y += step) {
    for (let x = x0 + step / 2; x <= x1; x += step) {
      if (!inPoly(poly, x, y)) continue;
      inside++;
      if (!inPoly(ring, x, y)) outside++;
    }
  }
  return { samples: inside, outside, share: inside ? outside / inside : null };
}

/* ───────────────────────────── colour ───────────────────────────── */

export const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const lumRGB = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
export const lumHex = (h) => { const c = hex2rgb(h); return lumRGB(c[0], c[1], c[2]); };

/** sRGB → linear, per WCAG. */
const lin = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
/** WCAG relative luminance, 0..1. */
export const relLum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
/** WCAG contrast ratio between two rgb triples, 1..21. This is `lensContrast()`'s own measure. */
export function contrastRatio(a, b) {
  const la = relLum(a[0], a[1], a[2]), lb = relLum(b[0], b[1], b[2]);
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** HSL hue in DEGREES (0..360), plus saturation and lightness, 0..1. */
export function rgb2hsl(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === R) h = ((G - B) / d) % 6;
    else if (mx === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  const l = (mx + mn) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s, l };
}

/* ───────────────────────────── reporting ───────────────────────────── */

export const r2 = (n) => (n == null || !Number.isFinite(n) ? null : Math.round(n * 100) / 100);
export const r4 = (n) => (n == null || !Number.isFinite(n) ? null : Math.round(n * 10000) / 10000);

/**
 * ⭐⭐ THE VERDICT SHAPE. Every instrument returns rows of this, and every row NAMES ITS
 * DENOMINATOR — the lane's own standing rule: a figure without its denominator is not a
 * measurement. `band` is the stated acceptance band; `pass` is the arithmetic, never a claim.
 */
export function verdict(name, value, denom, band, pass, extra = {}) {
  return { instrument: name, value, denominator: denom, band, pass, ...extra };
}

/** stats over a numeric array — the run-statistics shape REG-0 minted */
export function stats(xs) {
  if (!xs.length) return { n: 0, mean: null, p50: null, p90: null, max: null, total: null };
  const s = [...xs].sort((a, b) => a - b);
  const total = xs.reduce((a, b) => a + b, 0);
  const at = (q) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  return { n: xs.length, mean: r2(total / xs.length), p50: r2(at(0.5)), p90: r2(at(0.9)), max: r2(s[s.length - 1]), total: r2(total) };
}
