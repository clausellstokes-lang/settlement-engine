/**
 * harness/laneREG4/probeOps4.mjs — the §217 table for REG-4, four arms per leaf, plus DOM nodes
 * and render time. The ceilings are the §628-SIGNED values (REG-3's five raises, signed).
 * ⛔ THE LANE MEASURES; IT DOES NOT MOVE THE PIN.
 * Usage: node harness/laneREG4/probeOps4.mjs
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/exemplars.mjs'));
const { renderFolio } = await import(join(ROOT, 'harness/renderFolio.mjs'));

/** ODQ §628, signed. ⚠ NOT read from `OP_CEILING_BY_TIER`, which the lane must not touch. */
const SIGNED = { thorp: 1000, hamlet: 1400, village: 2000, town: 9300, city: 10000, metropolis: 14200 };
const ARMS = [
  ['BASE', {}],
  ['MKT', { marketRegister: true }],
  ['FOOT', { minFootprint: true }],
  ['BOTH', { marketRegister: true, minFootprint: true }],
  // ⭐ THE ARM THE CEILING ACTUALLY HAS TO SURVIVE: every landed wave armed together. REG-1's
  //   fusion, REG-2's rampart and REG-3's shape code are all dormant at the seal, so a REG-4
  //   figure measured alone is a figure measured on a drawing nobody will ship.
  ['ALL-WAVES', { frontageFusion: true, rampart: true, shapeCode: true, marketRegister: true, minFootprint: true }],
];

const rows = [];
for (const spec of CORPUS) {
  const row = { leaf: spec.key };
  for (const [name, opt] of ARMS) {
    const t0 = Date.now();
    const { fabric } = buildOne(spec, opt);
    const r = renderFolio(fabric, { lens: 'parchment' });
    row[name] = r.primitiveCount;
    row[`${name}_nodes`] = r.elementCount;
    if (name === 'ALL-WAVES') { row.tier = fabric.meta.tier; row.ms = Date.now() - t0; }
  }
  row.ceiling = SIGNED[row.tier];
  row.over = Math.max(0, row['ALL-WAVES'] - row.ceiling);
  rows.push(row);
}
const cols = ['leaf', 'tier', 'ceiling', 'BASE', 'MKT', 'FOOT', 'BOTH', 'ALL-WAVES', 'over', 'BASE_nodes', 'ALL-WAVES_nodes', 'ms'];
const w = {}; for (const c of cols) w[c] = Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length));
const line = (v) => cols.map((c, i) => String(v[i] ?? '').padEnd(w[c])).join(' | ');
process.stdout.write(`${line(cols)}\n${cols.map((c) => '-'.repeat(w[c])).join('-+-')}\n`);
for (const r of rows) process.stdout.write(`${line(cols.map((c) => r[c]))}\n`);

const byTier = {};
for (const r of rows) {
  if (!byTier[r.tier]) byTier[r.tier] = { ceiling: r.ceiling, max: 0, leaf: '' };
  if (r['ALL-WAVES'] > byTier[r.tier].max) { byTier[r.tier].max = r['ALL-WAVES']; byTier[r.tier].leaf = r.leaf; }
}
process.stdout.write('\n── PER TIER, EVERY WAVE ARMED ──\n');
for (const t of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const v = byTier[t]; if (!v) continue;
  const head = v.ceiling - v.max;
  process.stdout.write(`  ${t.padEnd(11)} ceiling ${String(v.ceiling).padStart(6)}  max ${String(v.max).padStart(6)} (${v.leaf})  `
    + `${head >= 0 ? `headroom ${head}` : `⛔ OVER BY ${-head} — REPORTED, NOT RAISED`}\n`);
}
