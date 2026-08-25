/**
 * i7-ftg-colour.mjs — REG-I0 · INSTRUMENT 7 · THE FTG CATEGORY-HUE ARM.
 *
 * §574's triangulation law says every visual element traces to Watabou, FTG or the corpus. The
 * FTG leg's most legible contribution is the plainest one: **CATEGORY IS CARRIED BY HUE.** Water
 * is blue, vegetation is green, the town is warm. A reader knows what a patch IS before reading
 * a single label. That is a testable property of a rendered plate, and it is one the pipeline
 * has ALREADY BROKEN ONCE: REG-0's own header records that MF-A1's W1 warm remap contains an
 * explicit `water → grey-green` rule which "fails BOTH the FTG leg of §574 and the corpus leg",
 * forcing REG-0 to re-state the water tone AFTER paint(). An instrument that can see that
 * regression is worth having.
 *
 * ═══ THE MEASURE ═══
 *   For each category role, over the rendered pixels the role's own vector geometry covers:
 *
 *      conformance = saturated role px whose hue is INSIDE the category band
 *                    ───────────────────────────────────────────────────────   ← THE VERDICT
 *                              saturated role px          ← DENOMINATOR, NAMED
 *
 *      dominantHue = the count-weighted modal 10° hue bin                       ← the DESCRIPTOR
 *
 *   Pixels below SAT_FLOOR are excluded from BOTH sides and reported as `greyShare`: **a role
 *   that has gone grey has not moved hue, it has LOST hue**, and those are different failures
 *   that must not average together. A role above GREY_MAX is verdicted ACHROMATIC by name.
 *
 * ⛔⛔ THE DESCRIPTOR IS A MODE, NOT A MEAN, AND BOTH ALTERNATIVES WERE TRIED AND WERE WRONG.
 *   A saturation-weighted CIRCULAR MEAN returned 79° for the specimen's water — a yellow-green
 *   the plate contains nowhere, sitting between a 67% blue mode at ~195° and a 30% warm mode of
 *   paint stains. A SATURATION-WEIGHTED MODE then returned 45°, because saturation already gates
 *   entry and weighting the bin by it again lets a vivid minority outvote a pale majority. One
 *   vote per saturated pixel is the version that describes the plate.
 *
 * ═══ THE BANDS ═══
 *      water   185° … 265°   slate-blue through indigo. The corpus's own range: hf103 paints the
 *                            Fluvius pale cornflower, hf131 the Skarvik harbour deep slate-blue.
 *                            The cyan-greens below 185° are the failure mode this arm exists for.
 *      field    35° …  70°   ochre through olive — CULTIVATED GROUND, which is warm on a real
 *                            plate and on the corpus's own. ⚠ Deliberately NOT a "vegetation"
 *                            green band: ripe strip-furrow IS ochre, and a green band would
 *                            convict correct cartography. The canopy arm that WOULD want green
 *                            is deferred below with its cure.
 *      town      0° …  60°   warm: red-brown roofs through ochre paper. The 0/360 wrap is handled
 *                            by the band test, not by hoping.
 *   ⚠ CHAIR'S NUMBERS, VETOABLE. Stated as bands rather than points because a lens is allowed a
 *   palette; what it is not allowed is to leave the category.
 *   SAT_FLOOR 0.06 · GREY_MAX 0.50 · conformance floor 0.60. ⚠ ALL CHAIR'S, VETOABLE.
 *
 * CONTROLS (--controls): `CTRL-grey-water` moves the water body to the GREENS role hue. The
 * water row MUST leave its band; every other row must stay put. This is the control instrument 5
 * could not catch — by construction, since the two roles were chosen to have similar luminance.
 *
 * Usage: node i7-ftg-colour.mjs --base=<base.svg> --png=<render.png> [--lens=] [--json=]
 *        node i7-ftg-colour.mjs --controls
 */
import { writeFileSync } from 'node:fs';
import { readPNG, boxDownscale } from './lib/png.mjs';
import { classify, roleMasks, assertViewBox } from './lib/classify.mjs';
import { rgb2hsl, r2, r4, verdict } from './lib/geom.mjs';

export const MEASURE_N = 1100;
export const SAT_FLOOR = 0.06;
export const CONFORMANCE_FLOOR = 0.60;
export const GREY_MAX = 0.50;
/** category → [loDeg, hiDeg] and the render roles that carry it */
export const BANDS = {
  water: { band: [185, 265], roles: ['water'] },
  field: { band: [35, 70], roles: ['field'] },
  town: { band: [0, 60], roles: ['building', 'landmark'] },
};

/**
 * ⛔ ONE ARM IS DEFERRED, WRITTEN DOWN RATHER THAN DROPPED.
 * A TREE-CANOPY hue arm belongs here — FTG's greens are carried by canopy, not by ploughland —
 * but the REG-0 classifier this instrument borrows has no CANOPY role: section 4's batched tree
 * path falls into `detail`/`ground` and cannot be isolated by role colour. Measuring it would
 * mean minting an eleventh role, which is a change to the classifier and not this lane's to make.
 * ⚠ DELIBERATELY DEFERRED — documented, not a bug to re-find. The cure is one added branch in
 * `lib/classify.mjs` keyed on the sealed `trees` role colour, and it belongs to whichever wave
 * first needs the canopy measured (REG-5, the drawn world).
 */
export const DEFERRED_ARMS = [{
  arm: 'hue.canopy',
  blockedOn: 'the ten-role classifier has no CANOPY role; section 4 trees classify as detail/ground',
  cure: "one branch in lib/classify.mjs keyed on the sealed lens's `trees` colour",
  owner: 'REG-5 (the drawn world) — the first wave that needs canopy measured',
}];
const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const R0 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0';

/** band membership with wrap handled explicitly */
const inBand = (h, [lo, hi]) => (lo <= hi ? (h >= lo && h <= hi) : (h >= lo || h <= hi));

export function categoryHue(baseSvg, imgIn, lens = 'parchment') {
  const { els, src } = classify(baseSvg, lens);
  assertViewBox(src);
  const img = (imgIn.w === MEASURE_N) ? imgIn : boxDownscale(imgIn, MEASURE_N);
  const need = [...new Set(Object.values(BANDS).flatMap((b) => b.roles))];
  const masks = roleMasks(els, MEASURE_N, need);

  const rows = [];
  for (const [cat, { band, roles }] of Object.entries(BANDS)) {
    const sel = new Uint8Array(MEASURE_N * MEASURE_N);
    for (const role of roles) { const M = masks[role]; for (let i = 0; i < sel.length; i++) if (M.a[i]) sel[i] = 1; }
    // ⛔⛔ THE SUMMARY IS THE **MODE**, NOT THE CIRCULAR MEAN, AND THE MEAN WAS TRIED FIRST.
    // A role's hue population is routinely BIMODAL — REG-0's specimen water is 67% blue at
    // ~195° and 30% warm at ~30°, because the paint pass lays stains and a vignette over the
    // body. The saturation-weighted circular mean of that lands at 79°: a yellow-green the
    // plate does not contain anywhere, sitting neatly between two real modes and describing
    // neither. The same failure as averaging 350° and 10° into cyan, one step less obvious.
    // ⭐ SO: CONFORMANCE is the verdict (what SHARE of the role is in its category's band) and
    // the DOMINANT HUE — the saturation-weighted modal 10° bin — is the descriptor beside it.
    const BIN = 10, NB = 360 / BIN;
    const bins = new Float64Array(NB);
    let sat = 0, satPx = 0, greyPx = 0, inPx = 0, tot = 0;
    for (let i = 0; i < sel.length; i++) {
      if (!sel[i]) continue;
      tot++;
      const { h, s } = rgb2hsl(img.rgba[i * 4], img.rgba[i * 4 + 1], img.rgba[i * 4 + 2]);
      if (s < SAT_FLOOR) { greyPx++; continue; }
      satPx++; sat += s;
      // ⚠⚠ ONE VOTE PER SATURATED PIXEL — **NOT** weighted by saturation, and the weighted
      // version was tried and was wrong. Saturation already GATES entry at SAT_FLOOR; weighting
      // the bin by it again lets a small, vivid minority outvote a large, pale majority. On the
      // REG-0 specimen that put the dominant water hue at 45° — the paint pass's warm stains —
      // while 67% of the water body was the pale blue at ~195° that the stains sit on top of.
      bins[Math.min(NB - 1, Math.floor(h / BIN))] += 1;
      if (inBand(h, band)) inPx++;
    }
    let mode = null;
    if (satPx) { let bi = 0; for (let i = 1; i < NB; i++) if (bins[i] > bins[bi]) bi = i; mode = bi * BIN + BIN / 2; }
    const conf = satPx ? inPx / satPx : null;
    const greyShare = tot ? greyPx / tot : null;
    const achromatic = greyShare != null && greyShare > GREY_MAX;
    const hueInBand = mode != null && inBand(mode, band);
    // ⛔ NOT APPLICABLE ≠ FAIL — see i1's note. A dry leaf has no water to hue-check.
    const applicable = tot > 0;
    const pass = applicable && !achromatic && conf != null && conf >= CONFORMANCE_FLOOR && hueInBand;
    if (!applicable) {
      rows.push({ instrument: `hue.${cat}`, value: null, denominator: `0 ${roles.join('+')} px`, band: `${band[0]}°..${band[1]}°`,
        pass: null, applicable: false, roles, band, dominantHueDeg: null, status: `NOT APPLICABLE — this leaf draws no ${cat}` });
      continue;
    }
    rows.push(verdict(`hue.${cat}`, r4(conf),
      `${satPx} SATURATED px of ${tot} ${roles.join('+')} px (${greyPx} below sat ${SAT_FLOOR}) at ${MEASURE_N}²`,
      `conformance >= ${CONFORMANCE_FLOOR}, dominant hue in ${band[0]}°..${band[1]}°, grey share <= ${GREY_MAX}`,
      pass,
      { roles, band, applicable: true, status: 'MEASURED', conformance: r4(conf), dominantHueDeg: mode, hueInBand,
        greyShare: r4(greyShare), achromatic,
        failReason: pass ? null : (achromatic ? `ACHROMATIC — ${Math.round(greyShare * 100)}% of the role is below saturation ${SAT_FLOOR}; it has not moved hue, it has LOST hue`
          : (!hueInBand ? `OUT OF BAND — dominant hue ${mode}°` : `LOW CONFORMANCE — only ${Math.round(conf * 100)}% of saturated px are in band`)),
        meanSaturation: satPx ? r4(sat / satPx) : null, rolePx: tot, saturatedPx: satPx, greyPx }));
  }
  const live = rows.filter((r) => r.applicable !== false);
  return { grid: `${MEASURE_N}x${MEASURE_N}`, satFloor: SAT_FLOOR, conformanceFloor: CONFORMANCE_FLOOR, rows,
    applicableArms: live.length, notApplicable: rows.filter((r) => r.applicable === false).map((r) => r.instrument),
    pass: live.length > 0 && live.every((r) => r.pass) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const json = arg('json', null);
  if (process.argv.includes('--controls')) {
    const base = `${R0}/out/base-city-city-parchment.svg`;
    const plates = [
      ['AFTER-city', `${R0}/png/AFTER-city.png`],
      ['BEFORE-city', `${R0}/png/BEFORE-city.png`],
      ['CTRL-grey-water', `${HERE}/png/CTRL-grey-water.png`],
      ['CTRL-flat-wall', `${HERE}/png/CTRL-flat-wall.png`],
    ];
    const out = [];
    for (const [name, png] of plates) {
      const res = categoryHue(base, readPNG(png));
      out.push({ name, png, ...res });
      process.stdout.write(`\n── ${name}\n`);
      for (const r of res.rows) {
        process.stdout.write(`   ${r.instrument.padEnd(12)} conf=${String(r.conformance).padEnd(7)} domHue=${String(r.dominantHueDeg).padEnd(6)}° band=${JSON.stringify(r.band).padEnd(11)} grey=${String(r.greyShare).padEnd(7)} `
          + `${r.pass ? 'PASS' : 'FAIL'}  ${r.failReason || ''}\n`);
      }
      process.stdout.write(`   PLATE: ${res.pass ? 'PASS' : 'FAIL'}\n`);
    }
    const by = (n) => out.find((o) => o.name === n);
    const row = (o, c) => o.rows.find((r) => r.instrument === `hue.${c}`);
    const HUE_TOL = 11;   // one 10° bin plus its own half-width — a mode either moved or it did not
    const live = [
      ['grey-water drives the WATER role out of its band', row(by('CTRL-grey-water'), 'water').hueInBand === false],
      // ⚠ compared against AFTER, not BEFORE: the sealed base's water is ACHROMATIC (64% of it is
      //   below the saturation floor), so its dominant hue is a minority artefact and is not a
      //   sound reference for "how far did the control move it".
      ['and it is a big move, not a wobble', Math.abs(row(by('CTRL-grey-water'), 'water').dominantHueDeg - row(by('AFTER-city'), 'water').dominantHueDeg) > 60],
      ['grey-water leaves the TOWN hue where it was', Math.abs(row(by('CTRL-grey-water'), 'town').dominantHueDeg - row(by('BEFORE-city'), 'town').dominantHueDeg) < HUE_TOL],
      ['grey-water leaves the FIELD hue where it was', Math.abs(row(by('CTRL-grey-water'), 'field').dominantHueDeg - row(by('BEFORE-city'), 'field').dominantHueDeg) < HUE_TOL],
      ['the wall control does not touch any hue row', ['water', 'field', 'town'].every((c) => Math.abs(row(by('CTRL-flat-wall'), c).dominantHueDeg - row(by('BEFORE-city'), c).dominantHueDeg) < HUE_TOL)],
      ['the sealed base\'s water is reported ACHROMATIC, not mis-hued', row(by('BEFORE-city'), 'water').achromatic === true],
      ['the specimen\'s water is NOT achromatic (REG-0\'s re-statement worked)', row(by('AFTER-city'), 'water').achromatic === false],
    ];
    process.stdout.write('\n── LIVENESS · this is the arm instrument 5 provably cannot cover\n');
    for (const [n, ok] of live) process.stdout.write(`   ${ok ? 'ok    ' : 'BROKEN'} ${n}\n`);
    writeFileSync(`${HERE}/out/i7-controls.json`, JSON.stringify({ plates: out, liveness: live }, null, 2));
    process.stdout.write(`\nI7_CONTROLS ${live.every((l) => l[1]) ? 'LIVE' : 'BROKEN'}\n`);
  } else {
    const base = arg('base', `${R0}/out/base-city-city-parchment.svg`);
    const png = arg('png', `${R0}/png/AFTER-city.png`);
    const res = categoryHue(base, readPNG(png), arg('lens', 'parchment'));
    const payload = { base, png, ...res };
    if (json) writeFileSync(json, JSON.stringify(payload, null, 2));
    process.stdout.write(JSON.stringify(payload, null, 2) + `\nI7_${res.pass ? 'PASS' : 'FAIL'}\n`);
  }
}
