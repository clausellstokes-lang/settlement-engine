/**
 * i5-role-contrast.mjs — REG-I0 · INSTRUMENT 5 · THE ROLE-PAIR CONTRAST FLOORS.
 *
 * §6's legibility leg says this instrument "extends `lensContrast()`". It does, in one specific
 * way that is the whole value of it:
 *
 * ⭐⭐ `lensContrast()` MEASURES THE PALETTE; THIS MEASURES THE PICTURE. The sealed function takes
 * a lens ID, reads two hexes out of the role table and returns their WCAG ratio. That proves the
 * TABLE obeys §9.7's binding sub-law. It cannot see what happens after the table: the ward tone
 * jitter, the material wash, the character tint, the district washes, the aged-ground patches,
 * and — at REG-0 — a whole paint pass with a warm remap in it. A palette can be lawful and the
 * plate still fail, which is exactly what happened to the water (MF-A1's W1 rule remapped it to
 * grey-green and REG-0 had to re-state the tone afterwards). So the same law is re-asked of the
 * RENDERED PIXELS, at full resolution.
 *
 * ═══ THE MEASURE ═══
 *   For each pair (A, B):
 *      contrast(A,B) = ( L*(A) + 0.05 ) / ( L*(B) + 0.05 )     ordered so the result is ≥ 1
 *   where L* is the WCAG relative luminance of the MEAN sRGB colour of that role's pixels —
 *   the identical formula `folioLenses.luminance()` uses, applied to a measured mean instead of
 *   a declared hex, so the two are directly comparable and a divergence is meaningful.
 *   DENOMINATOR: L*(B) + 0.05, i.e. the darker role's own adjusted luminance; the PIXEL COUNTS
 *   of both populations are reported on every row and are what make the ratio trustworthy.
 *
 * ═══ THE THREE PAIRS AND THEIR FLOORS ═══
 *   street ↔ ground   ≥ 2.10   §9.7's own arithmetic: "roofs sit at least THREE VALUE STEPS
 *                              below roads", and `lensContrast` defines a step as ≈1.28×, so
 *                              three steps ≈ 2.10×. Taken from the sealed comment, not invented.
 *   wall   ↔ all      ≥ 3.00   §9.1 puts the wall at the top of the ink hierarchy — the loudest
 *                              stroke on the page. Measured against the mean of the WHOLE
 *                              drawing rather than one role, because "loudest" is a claim about
 *                              the page. ⚠ CHAIR'S NUMBER, VETOABLE.
 *   water  ↔ ground   ≥ 1.35   Water is read by HUE, not value — a lawful pale harbour sits
 *                              close to the paper in luminance and that is CORRECT. The value
 *                              floor is therefore deliberately low and the real water test is
 *                              instrument 7's hue band. Naming a low floor and saying why beats
 *                              a high floor that convicts good drawings. ⚠ CHAIR'S, VETOABLE.
 *
 * ⭐ AND THE DECLARED-VS-MEASURED DELTA IS REPORTED. Every row carries the ratio `lensContrast`
 * would have predicted from the palette alone beside the one measured off the plate. The GAP is
 * the number this instrument exists to produce: it is how much the pass moved the law.
 *
 * CONTROLS (--controls): the three broken plates from mk-controls.mjs. Each must drive ITS OWN
 * pair below floor and leave the other two above it.
 *
 * Usage: node i5-role-contrast.mjs --base=<base.svg> --png=<render.png> [--lens=] [--json=]
 *        node i5-role-contrast.mjs --controls
 */
import { writeFileSync } from 'node:fs';
import { readPNG, boxDownscale } from './lib/png.mjs';
import { rolePopulations, sample, CHAN, meanOf } from './lib/pixels.mjs';
import { LENSES } from './lib/classify.mjs';
import { relLum, hex2rgb, r2, r4, verdict } from './lib/geom.mjs';

export const MEASURE_N = 1100;          // decision grid; masks at 2200 → 2 subsamples per axis
export const MASK_N = 2200;
export const FLOORS = { 'street:ground': 2.10, 'wall:all': 3.00, 'water:ground': 1.35 };
const ROLES = ['street', 'wall', 'water'];
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const R0 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0';

const POP = new Map();
function popFor(baseSvg, lens) {
  const key = `${baseSvg}|${lens}`;
  if (!POP.has(key)) POP.set(key, rolePopulations(baseSvg, MEASURE_N, ROLES, { lens, maskN: MASK_N, coverMin: 0.5 }));
  return POP.get(key);
}

/** mean sRGB of a pixel selection, then its WCAG relative luminance */
function meanRGB(img, pick) {
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0, N = img.w * img.h; i < N; i++) {
    if (!pick[i]) continue;
    r += img.rgba[i * 4]; g += img.rgba[i * 4 + 1]; b += img.rgba[i * 4 + 2]; n++;
  }
  return n ? { rgb: [r / n, g / n, b / n], n } : { rgb: null, n: 0 };
}
const ratio = (a, b) => { const hi = Math.max(a, b), lo = Math.min(a, b); return (hi + 0.05) / (lo + 0.05); };

/** what `lensContrast()` would predict from the palette alone — the declared half of every row */
export function declared(lensId) {
  const r = (LENSES[lensId] || LENSES.parchment);
  const L = (k) => { const c = hex2rgb(r[k]); return relLum(c[0], c[1], c[2]); };
  const all = ['paper', 'roofs', 'water', 'greens', 'roads', 'trees', 'elements'].map(L);
  const allMean = all.reduce((a, b) => a + b, 0) / all.length;
  return {
    'street:ground': ratio(L('roads'), L('roofs')),
    'wall:all': ratio(L('walls'), allMean),
    'water:ground': ratio(L('water'), L('roofs')),
  };
}

export function roleContrast(baseSvg, imgIn, lens = 'parchment') {
  const { sel, ground } = popFor(baseSvg, lens);
  // ⚠⚠ BITTEN, AND IT PRESENTED AS A LAW THAT HAD COLLAPSED RATHER THAN AS A BUG. The selectors
  // are MEASURE_N² long and the raster is 2200² — sampling one with the other's indices reads
  // the top ~quarter of every plate for every role, so all five means converged and EVERY pair
  // came back at ratio ≈ 1.01 on EVERY plate, including the untouched base. A contrast law
  // reading 1.0 everywhere looks exactly like a catastrophic finding; it was an index mismatch.
  // ⭐ THE TELL THAT CAUGHT IT: the deliberately-broken plates moved the numbers by less than
  // the noise. A control that cannot move is the signature of an instrument pointed at nothing.
  const img = (imgIn.w === MEASURE_N && imgIn.h === MEASURE_N) ? imgIn : boxDownscale(imgIn, MEASURE_N);
  if (img.w * img.h !== MEASURE_N * MEASURE_N) {
    throw new Error(`GRID_MISMATCH raster ${img.w}×${img.h} vs selectors ${MEASURE_N}² — refusing rather than mis-sampling`);
  }
  const everything = new Uint8Array(img.w * img.h).fill(1);
  const M = {
    street: meanRGB(img, sel.street), wall: meanRGB(img, sel.wall), water: meanRGB(img, sel.water),
    ground: meanRGB(img, ground), all: meanRGB(img, everything),
  };
  const L = (k) => (M[k].rgb ? relLum(M[k].rgb[0], M[k].rgb[1], M[k].rgb[2]) : null);
  const dec = declared(lens);
  const rows = [];
  for (const [pair, floor] of Object.entries(FLOORS)) {
    const [a, b] = pair.split(':');
    const la = L(a), lb = L(b);
    const v = (la != null && lb != null) ? ratio(la, lb) : null;
    // ⛔ NOT APPLICABLE ≠ FAIL — see i1's note. A dry leaf has no water pair to measure.
    const applicable = M[a].n > 0 && M[b].n > 0;
    rows.push(applicable ? verdict(`contrast.${pair}`, r4(v),
      `WCAG-adjusted luminance of the darker role (${b}); ${M[a].n} ${a} px vs ${M[b].n} ${b} px at ${MEASURE_N}×${MEASURE_N}`,
      `>= ${floor}`, v != null && v >= floor,
      {
        measuredRatio: r4(v), declaredByLensContrast: r4(dec[pair]), delta: v != null ? r4(v - dec[pair]) : null,
        [`${a}RGB`]: M[a].rgb ? M[a].rgb.map((x) => Math.round(x)) : null,
        [`${b}RGB`]: M[b].rgb ? M[b].rgb.map((x) => Math.round(x)) : null,
        [`${a}Px`]: M[a].n, [`${b}Px`]: M[b].n, applicable: true, status: 'MEASURED',
      })
      : {
        instrument: `contrast.${pair}`, value: null, denominator: `${M[a].n} ${a} px vs ${M[b].n} ${b} px`,
        band: `>= ${floor}`, pass: null, applicable: false,
        status: `NOT APPLICABLE — this leaf draws no ${M[a].n ? b : a}`,
      });
  }
  const live = rows.filter((r) => r.applicable !== false);
  return {
    grid: `${MEASURE_N}x${MEASURE_N}`, maskN: MASK_N, rows,
    applicableArms: live.length, notApplicable: rows.filter((r) => r.applicable === false).map((r) => r.instrument),
    pass: live.length > 0 && live.every((r) => r.pass),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const json = arg('json', null);
  if (process.argv.includes('--controls')) {
    const base = `${R0}/out/base-city-city-parchment.svg`;
    const plates = [
      ['AFTER-city', `${R0}/png/AFTER-city.png`],
      ['BEFORE-city', `${R0}/png/BEFORE-city.png`],
      ['CTRL-flat-street', `${HERE}/png/CTRL-flat-street.png`],
      ['CTRL-flat-wall', `${HERE}/png/CTRL-flat-wall.png`],
      ['CTRL-grey-water', `${HERE}/png/CTRL-grey-water.png`],
    ];
    const out = [];
    for (const [name, png] of plates) {
      const res = roleContrast(base, readPNG(png));
      out.push({ name, png, ...res });
      process.stdout.write(`\n── ${name}\n`);
      for (const r of res.rows) {
        process.stdout.write(`   ${r.instrument.padEnd(24)} measured=${String(r.measuredRatio).padEnd(8)} declared=${String(r.declaredByLensContrast).padEnd(8)} Δ=${String(r.delta).padEnd(9)} ${r.pass ? 'PASS' : 'FAIL'} (floor ${r.band})\n`);
      }
      process.stdout.write(`   PLATE: ${res.pass ? 'PASS' : 'FAIL'}\n`);
    }
    const by = (n) => out.find((o) => o.name === n);
    const val = (o, p) => o.rows.find((r) => r.instrument === `contrast.${p}`).value;
    const passOf = (o, p) => o.rows.find((r) => r.instrument === `contrast.${p}`).pass;
    const A = by('AFTER-city');
    const live = [
      ['flat-street drives street:ground below floor', passOf(by('CTRL-flat-street'), 'street:ground') === false],
      ['flat-street leaves wall:all above floor', passOf(by('CTRL-flat-street'), 'wall:all') === true],
      ['flat-wall drives wall:all below floor', passOf(by('CTRL-flat-wall'), 'wall:all') === false],
      ['flat-wall leaves street:ground where it was', Math.abs(val(by('CTRL-flat-wall'), 'street:ground') - val(by('BEFORE-city'), 'street:ground')) < 0.25],
      // ⚠ grey-water is a HUE break, BY CONSTRUCTION — the greens role was chosen because its
      // luminance sits near the water tone's. Demanding it move this VALUE pair would be
      // demanding the wrong instrument catch it; instrument 7's hue band is its detector, and
      // it does (water hue 197° → 68°). What this row asserts is the correct half: a hue break
      // leaves the value law where it found it.
      ['grey-water leaves the VALUE pair essentially unmoved (it is a HUE break — i7 catches it)',
        Math.abs(val(by('CTRL-grey-water'), 'water:ground') - val(by('BEFORE-city'), 'water:ground')) < 0.10],
      // and the water VALUE arm HAS a genuinely failing real plate, which is the stronger control
      ['the water value floor has a real failing plate (BEFORE-city)', passOf(by('BEFORE-city'), 'water:ground') === false],
      ['the charter\'s polarity holds here: BEFORE fails, AFTER passes', by('BEFORE-city').pass === false && A.pass === true],
      ['every row reports the declared-vs-measured gap', out.every((o) => o.rows.every((r) => r.declaredByLensContrast != null && r.delta != null))],
    ];
    process.stdout.write('\n── LIVENESS\n');
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i5-controls.json`, JSON.stringify({ plates: out, liveness: live }, null, 2));
    process.stdout.write(`\nI5_CONTROLS ${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    const base = arg('base', `${R0}/out/base-city-city-parchment.svg`);
    const png = arg('png', `${R0}/png/AFTER-city.png`);
    const res = roleContrast(base, readPNG(png), arg('lens', 'parchment'));
    const payload = { base, png, ...res };
    if (json) writeFileSync(json, JSON.stringify(payload, null, 2));
    process.stdout.write(JSON.stringify(payload, null, 2) + `\nI5_${res.pass ? 'PASS' : 'FAIL'}\n`);
  }
}
