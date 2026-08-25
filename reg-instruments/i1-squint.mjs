/**
 * i1-squint.mjs — REG-I0 · INSTRUMENT 1 · THE 200px SQUINT TEST.
 *
 * THE QUESTION (§6's legibility leg; REG-1's exit clause "squint test passes at 200px"): with
 * the plate shrunk to a thumbnail, can the eye still separate the three STRUCTURAL roles —
 * STREET, WALL, WATER — from the fabric ground they sit on? A plate that passes reads at a
 * glance; a plate that fails is a grey rectangle with detail in it.
 *
 * ═══ THE FORMULA ═══
 *
 *      SEP(role) = | mean( C over ROLE px ) − mean( C over GROUND px ) |
 *                  ──────────────────────────────────────────────────── ,   i.e. GLASS'S Δ
 *                                  SD( C over GROUND px )
 *
 *   NUMERATOR   the gap between the role's mean and the ground's mean, in raw channel units.
 *   DENOMINATOR the GROUND population's own standard deviation — named, and the whole design.
 *               The ground is the reference population, and its spread is precisely the
 *               reader's tolerance: a fabric whose interior is speckled with paper-pale gaps
 *               has a WIDE ground, so a pale street inside it must be paler still to be seen.
 *   UNITS       ground standard deviations, dimensionless. Sample sizes on every row.
 *
 *   C is the role's own decision CHANNEL, because the three are not read the same way:
 *     · street → LUMINANCE. `folioLenses.js`'s binding sub-law is a VALUE law in its own words
 *       ("ROADS ARE THE PALEST ROLE ON THE PAGE… the street reads as street by VALUE CONTRAST,
 *       not outline"), so the street's squint test must be a value test.
 *     · wall   → LUMINANCE. §9.1's hierarchy puts the wall at the top as the heaviest ink.
 *     · water  → BLUE-MINUS-RED. Water is read by HUE, not value — the same predicate the
 *       REG-0 classifier itself uses. On luminance a correct pale-blue harbour scores like a
 *       grey one, which is the failure the FTG colour arm (i7) exists to name.
 *
 * ⛔⛔ TWO EARLIER FORMULATIONS WERE TRIED AND BOTH FAILED THEIR OWN CONTROLS. Recorded because
 * the next lane will otherwise reach for them:
 *   · COHEN'S d (pooled SD) — could not see a deliberately-flattened role at all on some arms,
 *     because the pooled denominator grows with the role's own variance: a wash that spreads
 *     hides itself in its own denominator.
 *   · 1 − OVL (histogram overlap) — reported 0.84 separability for a water body repainted the
 *     GREENS colour, because a near-uniform wash is a spike, and a spike sitting on a broad
 *     ground still overlaps almost none of it. Degenerate role distributions defeat overlap.
 *   Glass's Δ takes its denominator from the GROUND ALONE, so neither failure is available to it:
 *   the flat-street plate falls to Δ 0.06, flat-wall to 0.03, grey-water to 0.64.
 *
 * ⭐ THE BAND: Δ ≥ 1.0 — the role's mean stands a full ground standard deviation clear of the
 *   ground. That is Cohen's own "large effect" line, taken as an EXTERNAL anchor rather than
 *   fitted to this lane's plates. 1 − OVL and AUC ride along on every row as cross-checks;
 *   a primary and a cross-check disagreeing is itself a finding.
 *
 * ⭐⭐ THE PROBES ARE ALWAYS THE BASE RENDER'S GEOMETRY, whatever raster is under test — REG-0's
 * own rule, "the same instrument, the same samples, the same probes… only the mask differs".
 *
 * ⚠⚠ FINDING (see the control battery): the charter expected the BEFORE (sealed base) plate to
 * FAIL this test and the AFTER (REG-0 specimen) plate to pass. MEASURED, the base PASSES all
 * three arms. The base render already separates its structural roles at thumbnail size; what it
 * fails is a different question — whether the fabric aggregates into blocks — which instrument 6
 * measures and this one cannot. The charter's expected polarity is REFUTED, not reproduced.
 *
 * CONTROLS (--controls): three plates broken on purpose by mk-controls.mjs (each must collapse
 * ITS OWN arm and leave the others standing), plus a flat page that must score exactly 0.
 *
 * Usage: node i1-squint.mjs --base=<base.svg> --png=<render.png> [--lens=] [--json=]
 *        node i1-squint.mjs --controls
 */
import { writeFileSync } from 'node:fs';
import { readPNG, boxDownscale } from './lib/png.mjs';
import { rolePopulations, CHAN, sample, separability, auc, meanOf } from './lib/pixels.mjs';
import { r2, r4, verdict } from './lib/geom.mjs';

export const SQUINT_PX = 200;
export const MASK_N = 1000;
export const COVER_MIN = 0.5;
export const DELTA_FLOOR = 1.0;
export const MEASURED = ['street', 'wall', 'water'];
export const ROLE_CHANNEL = { street: 'lum', wall: 'lum', water: 'blueRed' };

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const sdOf = (xs) => { if (!xs.length) return null; const m = meanOf(xs); return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); };

const POP = new Map();
export function popFor(baseSvg, lens = 'parchment') {
  const key = `${baseSvg}|${lens}`;
  if (!POP.has(key)) POP.set(key, rolePopulations(baseSvg, SQUINT_PX, MEASURED, { lens, maskN: MASK_N, coverMin: COVER_MIN }));
  return POP.get(key);
}

export function squint(baseSvg, img, lens = 'parchment') {
  const { sel, ground } = popFor(baseSvg, lens);
  const small = boxDownscale(img, SQUINT_PX);
  const rows = [];
  for (const role of MEASURED) {
    const chName = ROLE_CHANNEL[role];
    const ch = CHAN[chName];
    const A = sample(small, sel[role], ch);
    const G = sample(small, ground, ch);
    const sg = sdOf(G);
    const delta = (A.length && G.length && sg > 1e-9) ? Math.abs(meanOf(A) - meanOf(G)) / sg : (A.length && G.length ? 0 : null);
    const { sep } = separability(A, G);
    // ⛔⛔ A ROLE WITH NO SUBJECT IS **NOT APPLICABLE**, NEVER A FAILURE. `districtPartition.js`
    // states the law for its own census — "a census that did not run may never read as a clean
    // one" — and the inverse bites just as hard: an unwalled village has no wall to separate and
    // a dry leaf has no water, so scoring them 0 and failing the plate convicts correct geometry
    // for the crime of being a village. `applicable` rides every row and only applicable rows
    // decide the plate.
    const applicable = A.length > 0 && G.length > 0;
    rows.push({
      ...verdict(`squint.${role}`, applicable ? r4(delta) : null,
        `SD of the ${G.length} GROUND px (${r2(sg)} ${chName} units); role sample = ${A.length} px at ${small.w}×${small.h}`,
        `>= ${DELTA_FLOOR} ground SD`, applicable ? (delta != null && delta >= DELTA_FLOOR) : null,
        { rolePx: A.length, groundPx: G.length, channel: chName, roleMean: r2(meanOf(A)), groundMean: r2(meanOf(G)), groundSD: r2(sg), sep1mOVL: r4(sep), auc: r4(auc(A, G)) }),
      applicable,
      status: applicable ? 'MEASURED' : `NOT APPLICABLE — this leaf draws no ${role}; there is nothing to separate`,
    });
  }
  const live = rows.filter((r) => r.applicable);
  return {
    size: `${small.w}x${small.h}`, coverMin: COVER_MIN, maskN: MASK_N, deltaFloor: DELTA_FLOOR, rows,
    applicableArms: live.length, notApplicable: rows.filter((r) => !r.applicable).map((r) => r.instrument),
    pass: live.length > 0 && live.every((r) => r.pass),
  };
}

/** flat-page control: every pixel becomes the plate's own mean colour */
export function flatten(img) {
  let r = 0, g = 0, b = 0; const n = img.w * img.h;
  for (let i = 0; i < n; i++) { r += img.rgba[i * 4]; g += img.rgba[i * 4 + 1]; b += img.rgba[i * 4 + 2]; }
  const out = new Uint8Array(n * 4);
  const R = Math.round(r / n), G = Math.round(g / n), B = Math.round(b / n);
  for (let i = 0; i < n; i++) { out[i * 4] = R; out[i * 4 + 1] = G; out[i * 4 + 2] = B; out[i * 4 + 3] = 255; }
  return { w: img.w, h: img.h, rgba: out };
}

/* ────────────────────────────── CLI ────────────────────────────── */
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const R0 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0';

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--controls')) {
    const base = `${R0}/out/base-city-city-parchment.svg`;
    const battery = [
      ['AFTER-city', `${R0}/png/AFTER-city.png`, null, 'REG-0 specimen'],
      ['BEFORE-city', `${R0}/png/BEFORE-city.png`, null, 'sealed base @ ee0db96d3'],
      ['CTRL-flat-street', `${HERE}/png/CTRL-flat-street.png`, null, 'street stroke := median fabric fill #a28769'],
      ['CTRL-flat-wall', `${HERE}/png/CTRL-flat-wall.png`, null, 'wall stroke := fabric ink, 0.72w, 0.35 opacity'],
      ['CTRL-grey-water', `${HERE}/png/CTRL-grey-water.png`, null, 'water fill := greens role #9FA47A'],
      ['CTRL-flat-page', `${R0}/png/AFTER-city.png`, 'flat', 'every pixel := plate mean colour'],
    ];
    const out = [];
    for (const [name, png, mode, note] of battery) {
      let img = readPNG(png);
      if (mode === 'flat') img = flatten(img);
      const res = squint(base, img);
      out.push({ name, png, mode, note, ...res });
      process.stdout.write(`\n── ${name}  (${note})\n`);
      for (const r of res.rows) {
        process.stdout.write(`   ${r.instrument.padEnd(15)} Δ=${String(r.value).padEnd(8)} ${r.pass ? 'PASS' : 'FAIL'}`
          + `   [1−OVL=${r.sep1mOVL} AUC=${r.auc} | ${r.rolePx} role px / ${r.groundPx} ground px, ${r.channel}, σg=${r.groundSD}]\n`);
      }
      process.stdout.write(`   PLATE: ${res.pass ? 'PASS' : 'FAIL'}\n`);
    }
    const by = (k) => out.find((o) => o.name === k);
    const d = (o, role) => o.rows.find((r) => r.instrument === `squint.${role}`).value;
    const A = by('AFTER-city');
    // ⛔ LIVENESS: each broken plate must collapse ITS OWN arm and leave the other two standing.
    const collapse = (plate, role) => d(by(plate), role) < 0.5 * d(A, role);
    const intact = (plate, role) => Math.abs(d(by(plate), role) - d(by('BEFORE-city'), role)) < 0.35 * d(by('BEFORE-city'), role);
    const checks = [
      ['flat-street collapses street', collapse('CTRL-flat-street', 'street')],
      ['flat-street leaves wall standing', intact('CTRL-flat-street', 'wall')],
      ['flat-street leaves water standing', intact('CTRL-flat-street', 'water')],
      ['flat-wall   collapses wall', collapse('CTRL-flat-wall', 'wall')],
      ['flat-wall   leaves street standing', intact('CTRL-flat-wall', 'street')],
      ['grey-water  collapses water', collapse('CTRL-grey-water', 'water')],
      ['grey-water  leaves street standing', intact('CTRL-grey-water', 'street')],
      ['flat-page   scores exactly 0 on all', by('CTRL-flat-page').rows.every((r) => r.value === 0)],
    ];
    process.stdout.write('\n── LIVENESS · a control that cannot fail proves nothing\n');
    for (const [n, ok] of checks) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    const live = checks.every((c) => c[1]);
    // the charter's expected polarity, tested rather than assumed
    const polarity = { expected: 'BEFORE fails, AFTER passes', beforePass: by('BEFORE-city').pass, afterPass: A.pass };
    process.stdout.write(`\n── CHARTER POLARITY  expected "${polarity.expected}" → measured BEFORE=${polarity.beforePass ? 'PASS' : 'FAIL'} AFTER=${polarity.afterPass ? 'PASS' : 'FAIL'}`
      + `  ⇒ ${(!polarity.beforePass && polarity.afterPass) ? 'REPRODUCED' : 'REFUTED'}\n`);
    writeFileSync(`${HERE}/out/i1-controls.json`, JSON.stringify({ battery: out, liveness: checks, polarity }, null, 2));
    process.stdout.write(`\nI1_CONTROLS ${live ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    const base = arg('base', `${R0}/out/base-city-city-parchment.svg`);
    const png = arg('png', `${R0}/png/AFTER-city.png`);
    const res = squint(base, readPNG(png), arg('lens', 'parchment'));
    const json = arg('json', null);
    const payload = { base, png, ...res };
    if (json) writeFileSync(json, JSON.stringify(payload, null, 2));
    process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
    process.stdout.write(`I1_${res.pass ? 'PASS' : 'FAIL'}\n`);
  }
}
