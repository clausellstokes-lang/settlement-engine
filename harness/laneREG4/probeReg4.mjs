/**
 * harness/laneREG4/probeReg4.mjs — REG-4's orientation probe.
 * MEASURES, over the whole 18-leaf corpus, exactly what the fabric already publishes for the
 * five REG-4 deliverables. Nothing is guessed; every column is a field read off the fabric.
 *   node harness/laneREG4/probeReg4.mjs [--json=<file>]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/exemplars.mjs'));

const num = (v, d = 2) => (Number.isFinite(v) ? Math.round(v * 10 ** d) / 10 ** d : null);
function bbox(poly) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poly) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
function area(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p[0] * q[1] - q[0] * p[1]; }
  return Math.abs(a) / 2;
}
/** Minimum-width caliper over the convex hull directions — the true SHORT AXIS of a body. */
function shortAxis(poly) {
  if (!poly || poly.length < 3) return 0;
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const L = Math.sqrt(dx * dx + dy * dy);
    if (L < 1e-9) continue;
    const nx = -dy / L, ny = dx / L;
    let lo = Infinity, hi = -Infinity;
    for (const r of poly) { const d = r[0] * nx + r[1] * ny; if (d < lo) lo = d; if (d > hi) hi = d; }
    const w = hi - lo;
    if (w < best) best = w;
  }
  return Number.isFinite(best) ? best : 0;
}

const rows = [];
const detail = {};
for (const spec of CORPUS) {
  const { fabric } = buildOne(spec, {});
  const m = fabric.meta;
  const squares = fabric.web.squares || [];
  const fb = fabric.faubourgs || {};
  const fbB = fb.buildings || [];
  const kinds = {};
  for (const b of fbB) kinds[b.kind || '(none)'] = (kinds[b.kind || '(none)'] || 0) + 1;
  const gateIds = {};
  for (const b of fbB) { const g = b.gateId || b.gate || '(none)'; gateIds[g] = (gateIds[g] || 0) + 1; }
  const sqInfo = squares.map((sq) => {
    const bb = bbox(sq.polygon);
    return {
      key: sq.key, kind: sq.kind, organismKey: sq.organismKey, verts: sq.polygon.length,
      radius: num(sq.radius), w: num(bb.w), h: num(bb.h), area: num(area(sq.polygon)),
      aspect: num(Math.max(bb.w, bb.h) / Math.max(1e-6, Math.min(bb.w, bb.h))),
      shortAxis: num(shortAxis(sq.polygon)),
    };
  });
  // drawn ordinary bodies: parcels
  const parcels = fabric.parcels || [];
  const sa = parcels.map((p) => shortAxis(p.polygon)).filter((v) => v > 0).sort((a, b) => a - b);
  const ar = parcels.map((p) => area(p.polygon)).filter((v) => v > 0).sort((a, b) => a - b);
  const q = (arr, f) => (arr.length ? num(arr[Math.min(arr.length - 1, Math.floor(f * arr.length))], 3) : null);
  detail[spec.key] = {
    squares: sqInfo,
    faubourgKinds: kinds, faubourgGates: gateIds,
    faubourgSample: fbB.slice(0, 3).map((b) => Object.keys(b).sort().join(',')),
    stateMarkKeys: Object.keys(fabric.stateMarks || {}).sort(),
    rowSample: ((fabric.stateMarks || {}).rows || []).slice(0, 2),
    metaGrowthKeys: Object.keys(m).filter((k) => /grow|infill|densif|sprawl|extra|ring|epoch|found/i.test(k)).sort(),
  };
  rows.push({
    key: spec.key, tier: m.tier, pop: m.population, year: spec.year ?? null,
    walls: fabric.walls.length, gates: fabric.walls.reduce((n, w) => n + w.gates.length, 0),
    squares: squares.length, squareKinds: [...new Set(squares.map((s) => s.kind))].join('/'),
    commons: fabric.commons.length, greens: fabric.umbrella.greens.length,
    faubourgB: fbB.length, faubourgLeanTos: (fb.leanTos || []).length,
    faubourgKinds: Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(' · '),
    faubourgGates: fb.gates ?? null, faubourgInns: m.faubourgInns ?? null,
    marketColonized: m.marketColonized, colonizeReason: (m.marketColonizationReason || '').slice(0, 90),
    parcels: parcels.length,
    shortAxis_p01: q(sa, 0.01), shortAxis_p05: q(sa, 0.05), shortAxis_p10: q(sa, 0.10),
    shortAxis_p50: q(sa, 0.50), shortAxis_min: q(sa, 0),
    area_p01: q(ar, 0.01), area_p05: q(ar, 0.05), area_p10: q(ar, 0.10), area_p50: q(ar, 0.50), area_min: q(ar, 0),
    frontage: num(m.plotFrontage),
  });
}

const cols = Object.keys(rows[0]);
const w = {};
for (const c of cols) w[c] = Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length));
const line = (vals) => cols.map((c, i) => String(vals[i] ?? '').padEnd(w[c])).join(' | ');
process.stdout.write(`${line(cols)}\n${cols.map((c) => '-'.repeat(w[c])).join('-+-')}\n`);
for (const r of rows) process.stdout.write(`${line(cols.map((c) => r[c]))}\n`);

const jsonArg = process.argv.find((a) => a.startsWith('--json='));
if (jsonArg) {
  const f = jsonArg.slice(7);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify({ rows, detail }, null, 2));
  process.stdout.write(`\n-> ${f}\n`);
}
