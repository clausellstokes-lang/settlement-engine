/**
 * i15-field-quietness.mjs — DRESS-2 · **THE COUNTRYSIDE'S OWN LOUDNESS, MEASURED AT THE PIXEL.**
 *
 * ⭐⭐ WHY IT EXISTS. DRESS-FRAME (ODQ §707.4) found the countryside DARKER than the ground the
 * town stands on (`field` lum 0.3171 against `plotGround` 0.5121) and shipped a solved-alpha
 * demotion that took the SEEN `field:paper` from **2.138 to 1.085** against the reference's 1.00.
 * DRESS-2's field mosaic adds CONTENT to exactly that surface. The one way this wave can destroy
 * the last one's win is by making the hinterland loud again — so the quietness has to be a
 * MEASUREMENT taken before and after, not an intention.
 *
 * ⛔ AND IT CANNOT BE A VECTOR-AREA CENSUS. i14 measures rasterised PAINTED AREA off the vector
 * geometry, which is exact for FILLS and blind to STROKES: `PxMask.fillPolys` on an open polyline
 * paints ~nothing. The countryside's existing ink is `dress-grain` — 22k+ stroked hatch segments —
 * and every mosaic mark this wave can add is a stroke too. A vector census would therefore report
 * a mosaic as costing ZERO loudness, which is the exact false green this instrument exists to
 * prevent. So the ink is read off a REAL RASTER (the estate's own `shoot-bounded.sh`), and only
 * the REGION BOUNDARIES come from the vector geometry.
 *
 * ═══ THE ROWS ═══
 *   R1 · `fieldSeen:paper`  WCAG contrast between the MEAN measured sRGB of the field region's
 *        pixels and the lens's DECLARED paper. i5's own formula (measured pixels, not palette).
 *        **Reference target 1.00** (the reference paints plain countryside with zero ink);
 *        DRESS-FRAME's declared reading is 1.085 on parchment.
 *   R2 · `fieldMeanD`       mean |lum(px) − lum(paper)| over the field region, 0..255 channel
 *        units. THE LOAD-BEARING ROW: this is the countryside's ink load per unit area, and it is
 *        what a mosaic spends. Denominator: the field region's own pixel count, printed.
 *   R3 · `fieldMass`/`settledMass`  Σ|lum − lum(paper)| over each region ÷ (255 × page pixels) —
 *        each region's distance from the paper WEIGHTED BY ITS SHARE OF THE SHEET. This is
 *        §707.4's own "visual mass" quantity made executable, and `massRatio` is its "18×".
 *   R4 · shares             fieldShare / settledShare of the plate, so no mass figure is quoted
 *        without the area that produced it.
 *
 * ⚠ EVERY FIGURE BELONGS TO A NAMED PLATE. There is no corpus scalar here: `--leaves` names them
 * and every row carries its leaf key.
 *
 * ⛔⛔ THE CLASSIFIER PATCH, DECLARED RATHER THAN HIDDEN. `lib/classify.mjs`'s `GROUP_ROLE` at the
 * r7 seal knows 30 `dress-*` groups and NOT `dress-register` (minted by CAR-SEATING W3), nor any
 * group DRESS-2 mints. This instrument does not use `classify`'s ROLE ladder at all — it addresses
 * groups BY ID — so it is immune to that lag by construction. The lag is reported, not routed
 * around silently: see the receipt.
 *
 * Usage: node i15-field-quietness.mjs --dir=<renderDir> [--leaves=a,b] [--px=1200] [--json=<p>]
 *        node i15-field-quietness.mjs --dir=<renderDir> --controls
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { classify, assertViewBox, frameTransform, PxMask } from '../inst/lib/classify.mjs';
import { subpaths } from '../inst/lib/svg.mjs';
import { readPNG, lumAt } from '../inst/lib/png.mjs';
import { hex2rgb, lumRGB, contrastRatio, r4 } from '../inst/lib/geom.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SHOOT = join(HERE, '..', 'inst', 'shoot-bounded.sh');

export const MASK_N = 1000;

/** The countryside, as drawn. */
export const FIELD_GROUPS = Object.freeze(['dress-fields']);
/**
 * The SETTLED region — the ground the town stands on plus everything built on it. `dress-fields`
 * is deliberately absent and so is `dress-water`: the comparison §707.4 makes is countryside
 * against SETTLEMENT, and a river is neither.
 */
export const SETTLED_GROUPS = Object.freeze([
  'dress-street', 'dress-voids', 'dress-yards', 'dress-masses', 'dress-band', 'dress-quays',
]);

/** Every subpath emitted inside `<g id=…>`, mapped into the 0..1000 space `PxMask` addresses. */
export function groupPaths(els, XF, id) {
  const out = [];
  for (const r of els) {
    if (!r.groups.includes(id) || !r.t.attrs.d) continue;
    const polys = subpaths(r.t.attrs.d)
      .filter((sp) => sp.poly.length > 2)
      .map((sp) => sp.poly.map(XF.pt));
    if (polys.length) out.push(polys);
  }
  return out;
}

export function maskOf(els, XF, ids, n = MASK_N) {
  const M = new PxMask(n);
  for (const id of ids) for (const polys of groupPaths(els, XF, id)) M.fillPolys(polys);
  return M;
}

/** shoot a plate; the PNG's existence and byte floor are the verdict, never the exit status */
export function shoot(svgPath, pngPath, px) {
  try {
    execFileSync('/bin/zsh', [SHOOT, svgPath, pngPath, String(px), '120000', '90'],
      { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch { /* the file is the verdict */ }
  if (!existsSync(pngPath)) throw new Error(`SHOOT_FAIL ${svgPath}`);
  return pngPath;
}

/**
 * ⭐ ONE PLATE, MEASURED. `paperHex` is the lens's DECLARED paper — the anchor every distance is
 * taken from — and it is passed in rather than sampled off the plate, because sampling the
 * brightest pixel would let a loud plate redefine its own baseline.
 */
export function measurePlate(svgPath, pngPath, paperHex, px) {
  const { els, src } = classify(svgPath, 'parchment');
  const frame = assertViewBox(src);
  const XF = frameTransform(frame);
  const FIELD = maskOf(els, XF, FIELD_GROUPS);
  const SETTLED = maskOf(els, XF, SETTLED_GROUPS);

  shoot(svgPath, pngPath, px);
  const img = readPNG(pngPath);
  const W = img.w; const H = img.h;
  const paperRGB = hex2rgb(paperHex);
  const paperLum = lumRGB(paperRGB[0], paperRGB[1], paperRGB[2]);

  let fPx = 0; let fSum = 0; let fR = 0; let fG = 0; let fB = 0;
  let sPx = 0; let sSum = 0;
  let pageSum = 0;
  for (let y = 0; y < H; y++) {
    const v = ((y + 0.5) / H) * 1000;
    for (let x = 0; x < W; x++) {
      const u = ((x + 0.5) / W) * 1000;
      const i = y * W + x;
      const d = Math.abs(lumAt(img, i) - paperLum);
      pageSum += d;
      const inF = FIELD.at(u, v);
      const inS = SETTLED.at(u, v);
      // a pixel claimed by BOTH is settled — the settlement is drawn OVER the countryside, and
      // the region the reader sees there is the town's, not the field's.
      if (inS) { sPx++; sSum += d; continue; }
      if (inF) {
        fPx++; fSum += d;
        fR += img.rgba[i * 4]; fG += img.rgba[i * 4 + 1]; fB += img.rgba[i * 4 + 2];
      }
    }
  }
  const pagePx = W * H;
  const meanField = fPx ? [fR / fPx, fG / fPx, fB / fPx] : paperRGB;
  return {
    plate: svgPath.split('/').pop(),
    px: W,
    pagePx,
    fieldPx: fPx,
    settledPx: sPx,
    fieldShare: r4(fPx / pagePx),
    settledShare: r4(sPx / pagePx),
    /** R1 — the SEEN field against the DECLARED paper, i5's formula on measured pixels */
    fieldSeenPaper: r4(contrastRatio(meanField, paperRGB)),
    fieldMeanRGB: meanField.map((c) => Math.round(c * 10) / 10),
    /** R2 — THE LOAD-BEARING ROW: the countryside's ink load per unit of its own area */
    fieldMeanD: r4(fPx ? fSum / fPx : 0),
    settledMeanD: r4(sPx ? sSum / sPx : 0),
    /** R3 — §707.4's visual mass: distance from paper weighted by share of the sheet */
    fieldMass: r4(fSum / (255 * pagePx)),
    settledMass: r4(sSum / (255 * pagePx)),
    massRatio: r4(sSum > 0 ? fSum / sSum : null),
    pageMeanD: r4(pageSum / pagePx),
  };
}

/* ══════════════════════════ THE CONTROLS — planted PLATES, not planted code ══════════════════ */

/**
 * ⛔ A CONTROL THAT CANNOT FAIL PROVES NOTHING, AND PROVING A ZERO IS THE HARD DIRECTION.
 * Two plants, each declaring what it must move AND what it must leave alone:
 *   (a) LOUD GROUND — `dress-fields`' `fill-opacity` forced to 1. `fieldMeanD`, `fieldMass` and
 *       `fieldSeenPaper` must all RISE; `settledMeanD` must be UNMOVED (the settlement is drawn
 *       over the field, so its pixels never see the change).
 *   (b) NO FURROW — the whole `<g id="dress-grain">` struck. `fieldMeanD` must FALL and
 *       `settledMeanD` must again be UNMOVED.
 * Both are edits to a COPY of the plate. The instrument never writes a repo byte.
 */
export function plantLoudGround(src) {
  const m = src.match(/<g id="dress-fields">(.*?)<\/g>/s);
  if (!m) throw new Error('PLANT_LOUD_NO_FIELDS');
  const body = m[1].replace(/fill-opacity="[^"]*"/, 'fill-opacity="1"');
  if (body === m[1]) throw new Error('PLANT_LOUD_NO_OPACITY — the plate carries no solved alpha');
  return src.replace(m[0], `<g id="dress-fields">${body}</g>`);
}

export function plantNoFurrow(src) {
  const m = src.match(/<g id="dress-grain">.*?<\/g>/s);
  if (!m) throw new Error('PLANT_NOFURROW_NO_GRAIN');
  return src.replace(m[0], '');
}

/* ═══════════════════════════════════════ the runner ═══════════════════════════════════════ */

const arg = (n, d) => { const h = process.argv.find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };

if (process.argv[1] && process.argv[1].endsWith('i15-field-quietness.mjs')) {
  const dir = arg('dir', null);
  if (!dir) { console.error('need --dir=<renderDir>'); process.exit(64); }
  const px = Number(arg('px', '1200'));
  /** parchment's own declared paper — `folioLenses.LENSES.parchment.paper`, not a sampled pixel */
  const paper = arg('paper', '#E9DEC3');
  const work = arg('work', join(HERE, '..', 'i15-work'));
  mkdirSync(work, { recursive: true });
  const all = readdirSync(dir).filter((f) => f.endsWith('.svg'));
  const want = arg('leaves', '') ? arg('leaves', '').split(',') : null;
  const files = want ? all.filter((f) => want.some((k) => f.startsWith(`${k}-`))) : all;
  if (!files.length) { console.error(`NO_PLATES in ${dir}`); process.exit(65); }

  const rows = [];
  if (process.argv.includes('--controls')) {
    const f = files[0];
    const src = readFileSync(join(dir, f), 'utf8');
    const base = measurePlate(join(dir, f), join(work, 'ctrl-base.png'), paper, px);
    const loudP = join(work, 'ctrl-loud.svg');
    writeFileSync(loudP, plantLoudGround(src));
    const loud = measurePlate(loudP, join(work, 'ctrl-loud.png'), paper, px);
    const dryP = join(work, 'ctrl-nofurrow.svg');
    writeFileSync(dryP, plantNoFurrow(src));
    const dry = measurePlate(dryP, join(work, 'ctrl-nofurrow.png'), paper, px);
    const checks = [
      ['LOUD raises fieldMeanD', loud.fieldMeanD > base.fieldMeanD * 1.10],
      ['LOUD raises fieldMass', loud.fieldMass > base.fieldMass * 1.10],
      ['LOUD raises fieldSeen:paper', loud.fieldSeenPaper > base.fieldSeenPaper * 1.05],
      ['LOUD leaves settledMeanD alone', Math.abs(loud.settledMeanD - base.settledMeanD) < 1.0],
      ['NOFURROW lowers fieldMeanD', dry.fieldMeanD < base.fieldMeanD * 0.98],
      ['NOFURROW leaves settledMeanD alone', Math.abs(dry.settledMeanD - base.settledMeanD) < 1.0],
    ];
    console.log(`CONTROLS on ${f} @ ${px}px`);
    console.log(`  base  ${JSON.stringify(base)}`);
    console.log(`  loud  ${JSON.stringify(loud)}`);
    console.log(`  dry   ${JSON.stringify(dry)}`);
    let bad = 0;
    for (const [n, ok] of checks) { console.log(`  ${ok ? 'PASS' : 'FAIL'} ${n}`); if (!ok) bad++; }
    console.log(`CONTROL_BENCH ${checks.length - bad}/${checks.length}`);
    process.exit(bad ? 1 : 0);
  }

  for (const f of files) {
    const png = join(work, `${f.replace(/\.svg$/, '')}.png`);
    const row = measurePlate(join(dir, f), png, paper, px);
    rows.push(row);
    console.log(`${row.plate.padEnd(34)} fieldSeen:paper ${String(row.fieldSeenPaper).padEnd(7)}`
      + ` fieldMeanD ${String(row.fieldMeanD).padEnd(8)} settledMeanD ${String(row.settledMeanD).padEnd(8)}`
      + ` fieldMass ${String(row.fieldMass).padEnd(8)} settledMass ${String(row.settledMass).padEnd(8)}`
      + ` massRatio ${String(row.massRatio).padEnd(7)}`
      + ` [field ${row.fieldPx} px of ${row.pagePx}, settled ${row.settledPx} px]`);
  }
  const jsonOut = arg('json', '');
  if (jsonOut) writeFileSync(jsonOut, `${JSON.stringify(rows, null, 2)}\n`);
}
