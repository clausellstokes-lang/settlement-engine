/**
 * harness/laneREG4/crops.mjs — the CORPUS LEG's judging artifacts.
 *
 * ⭐ THE CROP BOXES ARE CHOSEN BY A STATED RULE, WRITTEN HERE BEFORE ANYTHING WAS LOOKED AT
 * (REG-3's `pickCrops.mjs` precedent, and the reason is that a crop chosen after looking is a
 * crop chosen to flatter):
 *   MARKET     the leaf's PRINCIPAL void, framed at 2.4 × its own reach.
 *   FAUBOURG   the extramural district with the most members, framed at 2.0 × its ground's reach.
 *   QUARTER    the densest intramural ground: the 90 × 90 window holding the most drawn bodies.
 *   FUSED      the L-REG-30 host that ABSORBED the most sub-minimum neighbours, framed at 14 ×
 *              the leaf's own frontage — the "fused row" the charter asks to see.
 * Every crop is rendered in BOTH arms from the SAME box, so a reader compares a picture with a
 * picture rather than a picture with a memory.
 *
 * Usage: node harness/laneREG4/crops.mjs --leaf=town [--out=<dir>] [--px=1400]
 */
import { writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
/**
 * ⚠⚠ HEADLESS CHROME WRITES THE SCREENSHOT AND THEN DOES NOT EXIT. Measured in this lane: the
 * first crop's PNG landed at 708 KB and the process was still alive 5 min 40 s later, with
 * `execFileSync` waiting on it forever and four more Chromes queued behind it. Every shot is
 * therefore bounded, and the PNG's existence — never the exit status — is the verdict.
 */
const SHOT_MS = 45000;
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS, buildOne } = await import(join(ROOT, 'harness/exemplars.mjs'));
const { renderFolio } = await import(join(ROOT, 'harness/renderFolio.mjs'));
const { centroid, absArea } = await import(join(ROOT, 'src/domain/townMap/fabric/fabricGeometry.js'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const leafKey = arg('leaf', 'town');
const OUT = arg('out', join(ROOT, 'out'));
const PX = Number(arg('px', '1400'));
const SHOOT = join(ROOT, '..', 'reg0', 'shoot.sh');
mkdirSync(OUT, { recursive: true });
const spec = CORPUS.find((c) => c.key === leafKey);
const ARMED = { marketRegister: true, minFootprint: true };
const armed = buildOne(spec, ARMED).fabric;
const base = buildOne(spec, {}).fabric;
const frontage = armed.meta.plotFrontage;

/* ── the boxes, by the rule above ─────────────────────────────────────────── */
const boxes = {};
{
  const v = armed.marketRegister.voids[0];
  const r = v.radius * 2.4;
  boxes.MARKET = { x: v.center[0] - r, y: v.center[1] - r, w: r * 2, h: r * 2, why: `principal void '${v.key}' (${v.shape}) at 2.4 × reach` };
}
{
  const ds = armed.marketRegister.origins.districts.filter((d) => d.members.length);
  if (ds.length) {
    const d = ds.slice().sort((a, b) => b.members.length - a.members.length)[0];
    const c = d.center || centroid(d.ground);
    let rr = 0;
    for (const p of d.ground) rr = Math.max(rr, Math.sqrt((p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2));
    const r = Math.max(rr * 2.0, frontage * 10);
    boxes.FAUBOURG = { x: c[0] - r, y: c[1] - r, w: r * 2, h: r * 2, why: `district '${d.key}' origin=${d.origin}, ${d.members.length} members, aspect ${d.aspect.toFixed(2)}` };
  }
}
{
  const pts = [];
  for (const p of armed.parcels) if (p.polygon && p.polygon.length >= 3) pts.push(centroid(p.polygon));
  const W = 90;
  let best = null;
  for (let gx = 0; gx < 1000; gx += 30) {
    for (let gy = 0; gy < 1000; gy += 30) {
      let n = 0;
      for (const p of pts) if (p[0] >= gx && p[0] < gx + W && p[1] >= gy && p[1] < gy + W) n++;
      if (!best || n > best.n) best = { n, gx, gy };
    }
  }
  boxes.QUARTER = { x: best.gx, y: best.gy, w: W, h: W, why: `densest 90×90 window — ${best.n} drawn bodies` };
}
{
  const ab = armed.minFootprint.absorbed;
  const keys = Object.keys(ab).sort((a, b) => ab[b].length - ab[a].length);
  if (keys.length) {
    const k = keys[0];
    const poly = armed.minFootprint.replace[k];
    const c = centroid(poly);
    const r = frontage * 7;
    boxes.FUSED = { x: c[0] - r, y: c[1] - r, w: r * 2, h: r * 2, why: `host '${k}' absorbed ${ab[k].length} sub-minimum neighbour(s)` };
  }
}

/* ── emit ─────────────────────────────────────────────────────────────────── */
function crop(svg, b) {
  return svg.replace(/viewBox="[^"]*"/, `viewBox="${b.x.toFixed(2)} ${b.y.toFixed(2)} ${b.w.toFixed(2)} ${b.h.toFixed(2)}"`);
}
const svgA = renderFolio(armed, { lens: 'parchment' }).svg;
const svgB = renderFolio(base, { lens: 'parchment' }).svg;
const picks = {};
for (const [name, b] of Object.entries(boxes)) {
  picks[name] = b;
  for (const [tag, svg] of [['AFTER', svgA], ['BEFORE', svgB]]) {
    const f = join(OUT, `CROP4-${leafKey}-${name}-${tag}.svg`);
    writeFileSync(f, crop(svg, b));
    try {
      execFileSync('zsh', [SHOOT, f, f.replace(/\.svg$/, '.png'), String(PX), '20000'], { timeout: SHOT_MS, killSignal: 'SIGKILL' });
    } catch { /* the PNG's existence is the verdict, not the exit status */ }
    const png = f.replace(/\.svg$/, '.png');
    process.stdout.write(`  ${name.padEnd(9)} ${tag.padEnd(6)} ${existsSync(png) ? `${statSync(png).size} bytes` : 'NO PNG'}\n`);
  }
}
// whole pages + the 200 px squint (L-REG-1's own test)
for (const [tag, svg] of [['AFTER', svgA], ['BEFORE', svgB]]) {
  const f = join(OUT, `PAGE4-${leafKey}-${tag}.svg`);
  writeFileSync(f, svg);
  for (const [suffix, px] of [['', 2000], ['-SQUINT200', 200]]) {
    try {
      execFileSync('zsh', [SHOOT, f, join(OUT, `PAGE4-${leafKey}-${tag}${suffix}.png`), String(px), suffix ? '2000' : '400000'], { timeout: SHOT_MS, killSignal: 'SIGKILL' });
    } catch { /* bounded above */ }
    const png = join(OUT, `PAGE4-${leafKey}-${tag}${suffix}.png`);
    process.stdout.write(`  PAGE${(suffix || '-full').padEnd(12)} ${tag.padEnd(6)} ${existsSync(png) ? `${statSync(png).size} bytes` : 'NO PNG'}\n`);
  }
}
writeFileSync(join(OUT, `CROPS4-${leafKey}-picks.json`), JSON.stringify({
  leaf: leafKey, frontage, boxes: picks,
  voids: armed.marketRegister.voids.map((v) => ({ key: v.key, shape: v.shape, mouths: v.mouths.length, fixtures: v.fixtures.map((f) => f.kind), band: v.band, reason: v.reason })),
  fossils: armed.marketRegister.fossils.map((f) => ({ key: f.key, cite: f.cite })),
  districts: armed.marketRegister.origins.districts.map((d) => ({ key: d.key, origin: d.origin, members: d.members.length, aspect: Math.round(d.aspect * 100) / 100, region: !!d.region })),
  minFootprint: armed.minFootprint.counts,
}, null, 2));
process.stdout.write(`\n-> ${OUT}\n`);
