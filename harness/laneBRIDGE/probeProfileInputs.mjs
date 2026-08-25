/**
 * harness/laneBRIDGE/probeProfileInputs.mjs — WHAT THE GROUND ACTUALLY OFFERS A WIDTH PROFILE.
 *
 * The taper must be a READING of ground that exists (waterMode's own doctrine for `waterBearing`),
 * not a minted decoration. Before any constant is proposed this probe measures, per river leaf and
 * along the DRAWN channel, the four candidate signals and their usable RANGE:
 *   run        normalized arc length, headwater → mouth (drainageTrace's own reading order)
 *   flow       sub.flow at the station (0..1 normalized upstream accumulation)
 *   confine    the height rise on both banks at ±1.5 nominal widths — the valley's pinch
 *   curv       local curvature over a ~1.5-width arc window — the meander's own bend
 * A signal with no range cannot carry a taper; a signal that is monotone carries the downstream one.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/instruments/leaf.mjs'));
const { sampleAt } = await import(join(ROOT, 'src/domain/townMap/fabric/substrate.js'));

const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]; };

for (const spec of CORPUS) {
  const built = buildOne(spec, {});
  const f = built.fabric;
  const rel = f.water;
  if (!rel || rel.kind !== 'river' || !rel.line || rel.line.length < 8) continue;
  const sub = f.substrate || null;
  const line = rel.line, W = rel.width;
  // arclength
  const s = [0];
  for (let i = 1; i < line.length; i++) {
    s.push(s[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  }
  const total = s[s.length - 1];
  const flows = [], confs = [], curvs = [], runs = [];
  const winLen = W * 1.5;
  for (let i = 0; i < line.length; i++) {
    runs.push(s[i] / total);
    if (sub) flows.push(sampleAt(sub, sub.flow, line[i][0], line[i][1]));
    // tangent over a ~1.5w arc window, both sides
    let a = i, b = i;
    while (a > 0 && s[i] - s[a] < winLen) a--;
    while (b < line.length - 1 && s[b] - s[i] < winLen) b++;
    let tx = line[b][0] - line[a][0], ty = line[b][1] - line[a][1];
    const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
    const nx = -ty, ny = tx;
    if (sub) {
      const h0 = sampleAt(sub, sub.height, line[i][0], line[i][1]);
      const hA = sampleAt(sub, sub.height, line[i][0] + nx * W * 1.5, line[i][1] + ny * W * 1.5);
      const hB = sampleAt(sub, sub.height, line[i][0] - nx * W * 1.5, line[i][1] - ny * W * 1.5);
      confs.push(((hA - h0) + (hB - h0)) / 2);
    }
    // curvature: turn of the tangent across the window, per unit length
    let ux = line[i][0] - line[a][0], uy = line[i][1] - line[a][1];
    let vx = line[b][0] - line[i][0], vy = line[b][1] - line[i][1];
    const ul = Math.hypot(ux, uy) || 1, vl = Math.hypot(vx, vy) || 1;
    ux /= ul; uy /= ul; vx /= vl; vy /= vl;
    const dot = Math.max(-1, Math.min(1, ux * vx + uy * vy));
    curvs.push(1 - dot);                        // 0 straight, up to 2 for a reversal
  }
  const rep = (name, arr) => arr.length
    ? `${name} min ${q(arr, 0).toFixed(4)} p10 ${q(arr, 0.10).toFixed(4)} med ${q(arr, 0.5).toFixed(4)} p90 ${q(arr, 0.90).toFixed(4)} max ${q(arr, 1).toFixed(4)}`
    : `${name} — no substrate`;
  // is flow monotone head→mouth? measure rank correlation with run, cheaply (sign agreement)
  let agree = 0, n = 0;
  if (flows.length) {
    for (let i = 8; i < flows.length; i += 8) { n++; if (flows[i] >= flows[i - 8]) agree++; }
  }
  process.stdout.write(`\n${spec.key.padEnd(12)} W=${W.toFixed(2)} verts=${line.length} arc=${total.toFixed(0)} subOnFabric=${sub ? 'yes' : 'NO'}\n`);
  process.stdout.write(`   ${rep('flow   ', flows)}\n`);
  process.stdout.write(`   ${rep('confine', confs)}\n`);
  process.stdout.write(`   ${rep('curv   ', curvs)}\n`);
  if (n) process.stdout.write(`   flow rises head→mouth on ${agree}/${n} sampled steps (${(100 * agree / n).toFixed(0)}%)\n`);
}
