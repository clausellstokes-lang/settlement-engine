/**
 * i16-decline-visibility.mjs — REG-D · **DOES THE DECLINE DRESS REACH A READER'S EYE?**
 *
 * ⭐⭐⭐ WHY IT EXISTS, AND IT IS THE ONE THING THIS CAR WAS TOLD NOT TO GET WRONG. ODQ §714.6
 * measured DRESS-2's scenario register passing its census **4/4 green** while supplying
 * **0.05–0.14 % of a page**, with seven of 153 plate pairs differing on **under 0.2 % of pixels**.
 * The ruling: *"NO FLOOR OVER A REGISTER THAT SMALL CAN BUY LEGIBILITY."* REG-D inherits the
 * scenario-legibility charter explicitly NOT as a raised floor, and inherits with it the duty to
 * measure the VISIBLE SHARE of its own ink rather than its existence. Three marks in this arc have
 * now been drawn, counted, and unseeable (buried under chrome §713.7 · ink-on-ink §709.7 ·
 * sub-perceptual share §714.6). This instrument exists so there is not a fourth.
 *
 * ⛔ IT CANNOT BE A VECTOR CENSUS, AND i15 ALREADY WROTE THE REASON DOWN: `PxMask.fillPolys`
 * paints ~nothing for an open polyline, and every mark REG-D draws is a STROKE — outlines, hatch
 * rules, dashes. A vector-area census would report this whole family as costing zero and gaining
 * zero, which is the exact false green the row is here to prevent. So the reading is taken off a
 * REAL RASTER of the two plates, base against tip, at one px on both sides.
 *
 * ═══ THE ROWS ═══
 *   R1 · `changedShare`   share of page pixels whose luminance moved at all between the plates.
 *                         **§714.6's own quantity**, so REG-D's number and the scenario
 *                         register's number are directly comparable rather than merely similar.
 *   R2 · `changedShare8`  the same, thresholded at |Δlum| ≥ 8/255 — anti-aliasing at a stroke
 *                         edge moves a pixel by 1–2 units and a reader cannot see it. The pair
 *                         R1/R2 is the honest form: the loose count and the perceptible one.
 *   R3 · `meanDelta`      mean |Δlum| over the WHOLE page, 0..255. Ink load added per unit plate.
 *   R4 · `regionShare`    share of page pixels inside the ruin faces' own rings (vector), so no
 *                         changed-share is quoted without the area that was available to change.
 *   R5 · `inRegionRate`   R2's pixels as a share of R4's region. **THE LOAD-BEARING ROW**: it is
 *                         the density of the new ink WHERE THE NEW INK IS ALLOWED TO BE, and it
 *                         separates "a small register drawn well" from "a large register drawn
 *                         invisibly" — a distinction R1 alone cannot make.
 *
 * ⚠ EVERY FIGURE BELONGS TO A NAMED PLATE (§714's law). There is no corpus scalar in this file.
 *
 * ⛔ THE CONTROL. `--controls` re-shoots ONE plate against ITSELF. A dead instrument — a wrong
 * path, a stale PNG, a decoder returning constants — returns a near-zero changed share, which is
 * exactly what a leaf with no decline also returns. So the self-diff MUST read 0.000000 and a
 * planted diff MUST read non-zero, or no number below is a verdict. §713.2's lesson, applied
 * before publishing: `out/` held zero corpus leaves and `diff -rq` compared nothing to nothing.
 *
 * Usage: node i16-decline-visibility.mjs --base=<dir> --tip=<dir> [--leaves=a,b] [--px=1400]
 *        node i16-decline-visibility.mjs --base=<dir> --tip=<dir> --controls
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readPNG, lumAt } from './lib/png.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOOT = join(HERE, 'shoot-bounded.sh');

/** the groups this car mints — addressed BY ID, so `classify`'s ROLE lag cannot reach this file */
export const DECLINE_GROUPS = Object.freeze([
  'dress-ruin-standing', 'dress-ruin-unroofed', 'dress-ruin-footings', 'dress-ruin-clearing',
  'dress-soilmark',
]);

/** the perceptibility threshold, in 0..255 luminance units. */
export const DELTA_FLOOR = 8;

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };

export function shoot(svgPath, pngPath, px) {
  mkdirSync(dirname(pngPath), { recursive: true });
  try {
    execFileSync('/bin/zsh', [SHOOT, svgPath, pngPath, String(px), '80000', '90'],
      { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch { /* the file is the verdict, never the exit status — J-REG4-11 */ }
  if (!existsSync(pngPath)) throw new Error(`SHOOT_FAIL ${svgPath}`);
  return pngPath;
}

/** the ruin faces' own rings, straight out of the tip SVG's decline groups, as a coarse mask */
export function regionMask(svgTip, n = 800) {
  const src = readFileSync(svgTip, 'utf8');
  const vb = /viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/.exec(src);
  if (!vb) throw new Error('NO_VIEWBOX');
  const [, X, Y, W, H] = vb.map(Number);
  const mask = new Uint8Array(n * n);
  for (const gid of DECLINE_GROUPS) {
    const g = new RegExp(`<g id="${gid}">([\\s\\S]*?)</g>`).exec(src);
    if (!g) continue;
    for (const dm of g[1].matchAll(/ d="([^"]+)"/g)) {
      for (const sp of dm[1].split('M').slice(1)) {
        const nums = sp.replace(/Z/g, '').trim().split(/[ L]+/).map(Number).filter(Number.isFinite);
        const poly = [];
        for (let i = 0; i + 1 < nums.length; i += 2) poly.push([nums[i], nums[i + 1]]);
        if (poly.length < 3) continue;
        // scanline fill of the ring in mask space
        let y0 = Infinity; let y1 = -Infinity;
        const pts = poly.map((p) => [((p[0] - X) / W) * n, ((p[1] - Y) / H) * n]);
        for (const p of pts) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
        for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(n - 1, Math.ceil(y1)); y++) {
          const yc = y + 0.5; const xs = [];
          for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const a = pts[i]; const b = pts[j];
            if ((a[1] > yc) !== (b[1] > yc)) xs.push(a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
          }
          xs.sort((p, q) => p - q);
          for (let k = 0; k + 1 < xs.length; k += 2) {
            for (let x = Math.max(0, Math.ceil(xs[k] - 0.5)); x <= Math.min(n - 1, Math.floor(xs[k + 1] - 0.5)); x++) mask[y * n + x] = 1;
          }
        }
      }
    }
  }
  let px = 0; for (let i = 0; i < mask.length; i++) px += mask[i];
  return { mask, n, px, share: px / (n * n) };
}

/** ⭐ ONE PLATE PAIR, MEASURED. Both sides are shot at the same px in the same run. */
export function measurePair(baseSvg, tipSvg, pngDir, key, px) {
  const bp = shoot(baseSvg, join(pngDir, `${key}-base.png`), px);
  const tp = shoot(tipSvg, join(pngDir, `${key}-tip.png`), px);
  const A = readPNG(bp); const B = readPNG(tp);
  if (A.w !== B.w || A.h !== B.h) throw new Error(`SIZE_MISMATCH ${key} ${A.w}x${A.h} vs ${B.w}x${B.h}`);
  const R = regionMask(tipSvg);
  const pagePx = A.w * A.h;
  let changed = 0; let changed8 = 0; let sum = 0; let maxD = 0;
  let inRegion8 = 0; let regionPx = 0;
  for (let y = 0; y < A.h; y++) {
    const my = Math.min(R.n - 1, Math.floor(((y + 0.5) / A.h) * R.n));
    for (let x = 0; x < A.w; x++) {
      const i = y * A.w + x;
      const d = Math.abs(lumAt(A, i) - lumAt(B, i));
      if (d > 0) changed++;
      sum += d;
      if (d > maxD) maxD = d;
      const mx = Math.min(R.n - 1, Math.floor(((x + 0.5) / A.w) * R.n));
      const inR = R.mask[my * R.n + mx] === 1;
      if (inR) regionPx++;
      if (d >= DELTA_FLOOR) { changed8++; if (inR) inRegion8++; }
    }
  }
  return {
    key, px, pagePx,
    changedShare: changed / pagePx,
    changedShare8: changed8 / pagePx,
    meanDelta: sum / pagePx,
    maxDelta: maxD,
    regionShare: regionPx / pagePx,
    inRegionRate: regionPx ? inRegion8 / regionPx : null,
    regionVectorShare: R.share,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const baseDir = arg('base', '');
  const tipDir = arg('tip', '');
  const px = Number(arg('px', '1400'));
  const pngDir = arg('png', join(HERE, 'out', 'i16'));
  if (!baseDir || !tipDir) { console.error('need --base= and --tip='); process.exit(2); }
  const files = readdirSync(tipDir).filter((f) => f.endsWith('.svg')).sort();
  const want = arg('leaves', '') ? arg('leaves', '').split(',') : null;
  const rows = [];
  if (process.argv.includes('--controls')) {
    // ⛔ THE TWO CONTROLS, AND NEITHER IS OPTIONAL.
    //   (a) a plate against ITSELF must read EXACTLY zero — proves the instrument is not returning
    //       a constant and that both paths resolve to what they name;
    //   (b) a plate against a DIFFERENT leaf must read large — proves it can see a difference.
    const f = files[0];
    const k = f.replace(/\.svg$/, '');
    const self = measurePair(join(tipDir, f), join(tipDir, f), pngDir, `CTRL-self-${k}`, px);
    const other = measurePair(join(tipDir, f), join(tipDir, files[files.length - 1]), pngDir, `CTRL-other-${k}`, px);
    console.log(`CTRL self  ${k}: changed=${self.changedShare.toFixed(8)} mean=${self.meanDelta.toFixed(6)}`);
    console.log(`CTRL other ${k} vs ${files[files.length - 1]}: changed=${other.changedShare.toFixed(6)} mean=${other.meanDelta.toFixed(4)}`);
    const ok = self.changedShare === 0 && other.changedShare > 0.01;
    console.log(`CONTROL_BENCH ${ok ? 'PASS' : 'FAIL'} — self must be 0 and other must exceed 1 %`);
    process.exit(ok ? 0 : 1);
  }
  for (const f of files) {
    const k = f.replace(/\.svg$/, '');
    const leaf = k.split('-').slice(0, -2).join('-');
    if (want && !want.includes(leaf)) continue;
    if (!existsSync(join(baseDir, f))) { console.log(`${leaf}: NO BASE PLATE — skipped`); continue; }
    const r = measurePair(join(baseDir, f), join(tipDir, f), pngDir, leaf, px);
    r.leaf = leaf;
    rows.push(r);
    console.log(`${leaf.padEnd(12)} changed ${(100 * r.changedShare).toFixed(4)} %`
      + `  perceptible(Δ≥${DELTA_FLOOR}) ${(100 * r.changedShare8).toFixed(4)} %`
      + `  meanΔ ${r.meanDelta.toFixed(4)}  maxΔ ${r.maxDelta}`
      + `  ruin region ${(100 * r.regionShare).toFixed(3)} %`
      + `  ink-in-region ${r.inRegionRate === null ? 'n/a' : (100 * r.inRegionRate).toFixed(2) + ' %'}`);
  }
  const j = arg('json', '');
  if (j) writeFileSync(j, JSON.stringify(rows, null, 1));
}
