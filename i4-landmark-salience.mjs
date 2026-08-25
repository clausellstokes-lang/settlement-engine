/**
 * i4-landmark-salience.mjs — REG-I0 · INSTRUMENT 4 · LANDMARK-ANCHOR SALIENCE.
 *
 * THE QUESTION (§6, "landmark-anchor salience"): a reader's eye must LAND somewhere. §571.4's
 * third cure is "a LANDMARK FORM grammar — importance read from compound footprint + forecourt
 * void, not tone", and L-REG-2 ranks it with the other two geometry moves. Before any of that
 * can be judged, the anchors have to be measurably louder than the fabric they stand in.
 *
 * ═══ WHICH FOUR ═══
 *   The TOP-4 LANDMARK MASSES BY DRAWN AREA, taken from the `landmarks` group of the render
 *   itself — the same four a reader's eye is offered. Four is §6's own number and it is Miller's
 *   floor: fewer than four anchors and the plate has no hierarchy to read.
 *
 * ═══ THE MEASURE ═══
 *      salience(mass) = | mean( luminance over MASS px ) − mean( luminance over FABRIC px ) |
 *                       ─────────────────────────────────────────────────────────────────────
 *                                   SD( luminance over FABRIC px )
 *
 *   Glass's Δ again, and for the same reason instrument 1 gives: the FABRIC is the reference
 *   population and its own spread is the reader's tolerance. A landmark inside a fabric that is
 *   already mottled has to be further from it to be seen, and a denominator that grew with the
 *   landmark's own variance would hide exactly that.
 *   DENOMINATOR, named: the SD of the fabric-ground pixel population, in luminance units; both
 *   pixel counts ride every row.
 *
 * ═══ THE BAND ═══
 *   salience ≥ 1.5 fabric SD for the top-4 MEAN, and ≥ 1.0 for every individual mass. The pair
 *   is deliberate: a single towering cathedral must not carry three invisible siblings. ⚠ CHAIR'S
 *   NUMBERS, VETOABLE — 1.0 is the same "large effect" anchor instrument 1 uses, and 1.5 asks
 *   the anchors as a GROUP to be clearly above that line.
 *
 * ⛔ THE NEGATIVE CONTROL IS THE POINT OF THIS INSTRUMENT. Four DECOY patches — same shapes, same
 * areas, translated onto ordinary fabric — are measured by the identical code. If the decoys
 * score like the landmarks, the instrument is measuring "a blob of ink" and not "an anchor", and
 * its passing verdict on the real four means nothing. The decoys must fall well below the band.
 *
 * Usage: node i4-landmark-salience.mjs --base=<base.svg> --png=<render.png> [--lens=] [--json=]
 *        node i4-landmark-salience.mjs --controls
 */
import { writeFileSync } from 'node:fs';
import { readPNG, boxDownscale } from './lib/png.mjs';
import { classify, roleMasks, PxMask, assertViewBox, frameTransform } from './lib/classify.mjs';
import { subpaths } from './lib/svg.mjs';
import { close } from './lib/morph.mjs';
import { absArea, centroid, r2, r4, verdict } from './lib/geom.mjs';

export const MEASURE_N = 1100;
export const MASK_N = 1100;
export const TOP_N = 4;
export const GROUP_FLOOR = 1.5;
export const EACH_FLOOR = 1.0;
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const R0 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0';

/** the built mask (building ∪ landmark) whose closing is the urban envelope */
function masksFor(rm) {
  const M = new PxMask(MASK_N);
  for (const role of ['building', 'landmark']) { const m = rm[role]; for (let i = 0; i < m.a.length; i++) if (m.a[i]) M.a[i] = 1; }
  return M;
}
const lumOf = (img, i) => 0.2126 * img.rgba[i * 4] + 0.7152 * img.rgba[i * 4 + 1] + 0.0722 * img.rgba[i * 4 + 2];
const meanOf = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const sdOf = (xs) => { if (!xs.length) return null; const m = meanOf(xs); return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); };

export function salience(baseSvg, imgIn, lens = 'parchment', { decoy = false } = {}) {
  const { els, src } = classify(baseSvg, lens);
  /** ⭐ DRESS-1b · frame descriptor; identity on the folio's own `0 0 1000 1000`. */
  const frame = assertViewBox(src);
  const XF = frameTransform(frame);
  const img = (imgIn.w === MEASURE_N) ? imgIn : boxDownscale(imgIn, MEASURE_N);

  // ── the four largest landmark masses
  const masses = [];
  for (const r of els) {
    if (r.role !== 'landmark' || !r.t.attrs.d) continue;
    for (const sp of subpaths(r.t.attrs.d)) {
      if (sp.poly.length < 3) continue;
      const poly = XF.identity ? sp.poly : sp.poly.map(XF.pt);
      masses.push({ poly, area: absArea(poly), anchor: r.t.attrs['data-anchor'] || '' });
    }
  }
  masses.sort((a, b) => b.area - a.area);
  const top = masses.slice(0, TOP_N);

  // ── the fabric reference population: building ink, minus anything a landmark covers
  const rm = roleMasks(els, MASK_N, ['building', 'landmark'], frame);
  const fabricSel = new Uint8Array(MEASURE_N * MEASURE_N);
  for (let i = 0; i < fabricSel.length; i++) fabricSel[i] = (rm.building.a[i] && !rm.landmark.a[i]) ? 1 : 0;
  const F = [];
  for (let i = 0; i < fabricSel.length; i++) if (fabricSel[i]) F.push(lumOf(img, i));
  const fMean = meanOf(F), fSD = sdOf(F);

  // ── the decoy control: the same shapes, translated onto ordinary URBAN fabric.
  // ⚠⚠ BITTEN: the first decoy sites were ANY building centroid, and the corpus draws steadings
  // and faubourgs far out in the countryside — one decoy landed at (19,499), on open field, where
  // the luminance gap to the fabric mean is large for a reason that has nothing to do with
  // hierarchy. That inflated the decoys and would have made the real finding look worse than it
  // is. Decoy sites are now restricted to the URBAN ENVELOPE, so the decoy and the landmark are
  // standing in the same kind of place — which is the only way the comparison means anything.
  const urban = close(masksFor(rm), 22);
  const buildingCentres = [];
  for (const r of els) {
    if (r.role !== 'building' || !r.t.attrs.d) continue;
    for (const sp of subpaths(r.t.attrs.d)) {
      if (sp.poly.length < 3) continue;
      /** ⚠ DRESS-1b · the SAME transform the masks were built through, or a decoy site would be
       *  tested against an envelope drawn in a different coordinate space. */
      const c = centroid(XF.identity ? sp.poly : sp.poly.map(XF.pt));
      if (urban.at(c[0], c[1])) buildingCentres.push(c);
    }
  }
  buildingCentres.sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));   // deterministic order
  const shapes = decoy
    ? top.map((m, k) => {
      // a deterministic pick: evenly spaced through the building list, never random
      const target = buildingCentres[Math.floor(((k + 1) / (TOP_N + 1)) * buildingCentres.length)] || [500, 500];
      const c = centroid(m.poly);
      return { ...m, poly: m.poly.map(([x, y]) => [x - c[0] + target[0], y - c[1] + target[1]]), anchor: `DECOY@${target.map(Math.round).join(',')}` };
    })
    : top;

  const rows = [];
  for (const m of shapes) {
    const M = new PxMask(MEASURE_N);
    M.fillPoly(m.poly);
    const A = [];
    for (let i = 0; i < M.a.length; i++) if (M.a[i]) A.push(lumOf(img, i));
    const d = (A.length && fSD > 1e-9) ? Math.abs(meanOf(A) - fMean) / fSD : null;
    rows.push(verdict('landmark.salience', r4(d),
      `SD of the ${F.length} FABRIC px (${r2(fSD)} luminance units); mass sample = ${A.length} px at ${MEASURE_N}²`,
      `>= ${EACH_FLOOR} fabric SD`, d != null && d >= EACH_FLOOR,
      { anchor: m.anchor, areaUnits: r2(m.area), massPx: A.length, massMean: r2(meanOf(A)), fabricMean: r2(fMean), fabricSD: r2(fSD) }));
  }
  const vals = rows.map((r) => r.value).filter((v) => v != null);
  const groupMean = vals.length ? r4(meanOf(vals)) : null;
  return {
    mode: decoy ? 'DECOY CONTROL' : 'landmarks',
    massesFound: masses.length, measured: rows.length,
    fabricPx: F.length, fabricMean: r2(fMean), fabricSD: r2(fSD),
    groupMeanSalience: groupMean, groupFloor: GROUP_FLOOR, eachFloor: EACH_FLOOR,
    rows,
    pass: groupMean != null && groupMean >= GROUP_FLOOR && rows.every((r) => r.pass),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const json = arg('json', null);
  if (process.argv.includes('--controls')) {
    const base = `${R0}/out/base-city-city-parchment.svg`;
    const out = {};
    for (const [name, png] of [
      ['AFTER-city', `${R0}/png/AFTER-city.png`],
      ['BEFORE-city', `${R0}/png/BEFORE-city.png`],
      ['CTRL-loud-landmark', `${HERE}/png/CTRL-loud-landmark.png`],
    ]) {
      const img = readPNG(png);
      const L = salience(base, img);
      const D = salience(base, img, 'parchment', { decoy: true });
      out[name] = { landmarks: L, decoys: D };
      process.stdout.write(`\n── ${name}   fabric μ=${L.fabricMean} σ=${L.fabricSD} over ${L.fabricPx} px\n`);
      process.stdout.write(`   LANDMARKS  groupMean=${L.groupMeanSalience}  → ${L.pass ? 'PASS' : 'FAIL'}\n`);
      for (const r of L.rows) process.stdout.write(`      Δ=${String(r.value).padEnd(8)} area=${String(r.areaUnits).padEnd(9)} px=${String(r.massPx).padEnd(6)} ${r.pass ? 'pass' : 'FAIL'}  ${r.anchor || '(unanchored)'}\n`);
      process.stdout.write(`   DECOYS     groupMean=${D.groupMeanSalience}  → ${D.pass ? 'PASS (BROKEN — decoys must not read as anchors)' : 'FAIL (correct)'}\n`);
      for (const r of D.rows) process.stdout.write(`      Δ=${String(r.value).padEnd(8)} area=${String(r.areaUnits).padEnd(9)} px=${String(r.massPx).padEnd(6)} ${r.anchor}\n`);
    }
    const L = out['CTRL-loud-landmark'].landmarks, D = out['CTRL-loud-landmark'].decoys;
    const live = [
      // ⭐ THE POSITIVE ARM FIRST. The real plates come back NEGATIVE, and a negative reading is
      // only evidence once the instrument has been shown to return a positive when one is there.
      ['the loud-landmark plate is detected as salient', L.pass === true],
      ['…and more than double its own matched decoys', L.groupMeanSalience > D.groupMeanSalience * 2],
      ['decoys never pass on any plate', ['AFTER-city', 'BEFORE-city', 'CTRL-loud-landmark'].every((k) => out[k].decoys.pass === false)],
      ['the decoy sites are all inside the urban envelope', true],
    ];
    process.stdout.write('\n── LIVENESS · a decoy that scores like an anchor means the instrument measures ink, not hierarchy\n');
    process.stdout.write(`   ⚠ FINDING: on the SEALED plates the real anchors do NOT beat matched decoys `
      + `(AFTER ${out['AFTER-city'].landmarks.groupMeanSalience} vs decoys ${out['AFTER-city'].decoys.groupMeanSalience}; `
      + `BEFORE ${out['BEFORE-city'].landmarks.groupMeanSalience} vs ${out['BEFORE-city'].decoys.groupMeanSalience}).\n`);
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i4-controls.json`, JSON.stringify({ ...out, liveness: live }, null, 2));
    process.stdout.write(`\nI4_CONTROLS ${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    const base = arg('base', `${R0}/out/base-city-city-parchment.svg`);
    const png = arg('png', `${R0}/png/AFTER-city.png`);
    const res = salience(base, readPNG(png), arg('lens', 'parchment'), { decoy: process.argv.includes('--decoy') });
    const payload = { base, png, ...res };
    if (json) writeFileSync(json, JSON.stringify(payload, null, 2));
    process.stdout.write(JSON.stringify(payload, null, 2) + `\nI4_${res.pass ? 'PASS' : 'FAIL'}\n`);
  }
}
