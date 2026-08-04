/**
 * @vitest-environment node
 *
 * tests/design/compositedBarAA.test.js — THE COMPOSITED-AA PIN: what a letterform on
 * the header bar ACTUALLY lands on, measured on the real raster.
 *
 * ⚠️⚠️ WHY THIS FILE HAD TO EXIST, AND IT IS NOT A REFINEMENT OF contrast.test.js.
 * Every AA number on this bar is quoted against SHAFT_BODY, and theme.js's standing
 * claim is that SHAFT_BODY is "the darkest tone a letterform can land on". That claim
 * is TRUE of the cylinder — SHAFT_STOPS.body is a geometric guarantee that the
 * gradient never goes darker inside the label band — and FALSE of the bar, because the
 * bar is a COMPOSITE: a dark-brown grain wash painted OVER that gradient. Token-vs-
 * token arithmetic cannot see a layer. It measured 4.89:1 for the resting reference
 * tab while the shipped pixels measured 4.09:1 on some engines.
 *
 * ⚠️⚠️ AND THE ENGINES DISAGREED, WHICH IS THE SHARPER HALF. The grain's filter did
 * not declare `color-interpolation-filters`, and SVG's default for a filter chain is
 * linearRGB — which engines implement differently. The SAME authored bytes rendered at
 * about a 6% effective wash in Chrome and about 17% in librsvg. A fixed seed only buys
 * determinism of the NOISE; the colour space is what makes the noise become the same
 * PICTURE. So "deterministic texture" was, in the one dimension that mattered — how
 * much contrast it costs — not deterministic at all. Declaring sRGB made the two
 * engines agree, at the darker number, and GRAIN_AMP is what then pays for the AA
 * claim instead of one engine's leniency paying for it.
 *
 * ⚠️ HOW THE FLOOR IS COMPUTED, AND WHY IT IS DELIBERATELY OVER-STRICT. The tile is
 * rasterised and the STRONGEST alpha ANYWHERE in it is composited over SHAFT_BODY.
 * That is worse than any pixel a reader will actually see — the bar shows only a slice
 * of the 64px tile, and antialiased ink covers several pixels rather than the single
 * darkest one — and it is over-strict ON PURPOSE, in the one direction a safety pin
 * should be: the answer stays correct if the bar's height changes, if the tile's
 * alignment changes, or if a future edit tiles it differently. Measured on the live
 * Chrome bar for comparison, the real darkest tone in the label band is L 0.407
 * against this pin's L 0.392.
 *
 * ⚠️ THE DETERMINISM CLAIM IS FRAMED HONESTLY, because the research pass found the
 * limits. What is pinned is WITHIN-ENGINE determinism at a FIXED RASTER: the same
 * authored bytes, rasterised the same way, produce the same alpha field every run.
 * The noise PATTERN is spec-defined and stable across conformant engines; the exact
 * BYTES are not, and this file does not pretend otherwise. What makes the AA claim
 * cross-engine safe is not byte-equality — it is the declared colour space plus a
 * budget with margin.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { describe, expect, test } from 'vitest';

import {
  BODY, GILT, GOLD_TXT, GRAIN_AMP, HEADER_RIDERS, INK_DEEP, LABEL_BOX, PARCH,
  PARCH_100, SEAL_WAX, SHAFT, SHAFT_BODY, SHAFT_EDGE, SHAFT_GRAIN_TEXTURE, SHAFT_RIM,
  SHAFT_SAGE, SHAFT_STEEL, SHAFT_STOPS, FLETCH_VANE, cylinderToneAt, riderFloorTone,
  riderGrainShare,
} from '../../src/components/theme.js';

const require_ = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
// sharp ships its ESM entry as CJS; require it so this file needs no build step.
const sharpMod = require_(join(HERE, '../../node_modules/sharp/dist/index.cjs'));
const sharp = sharpMod.default || sharpMod;

/** WCAG relative luminance of a 0-255 triple. */
function relLuminance(r, g, b) {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const hexL = (hex) => {
  const n = parseInt(hex.slice(1, 7), 16);
  return relLuminance((n >> 16) & 255, (n >> 8) & 255, n & 255);
};
const ratioL = (a, b) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const rgbOf = (hex) => {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** The authored SVG, recovered from the data URI the app actually paints. */
function grainSvg() {
  const inner = SHAFT_GRAIN_TEXTURE.replace(/^url\("data:image\/svg\+xml,/, '').replace(/"\)$/, '');
  return decodeURIComponent(inner);
}

/**
 * Rasterise the grain tile and return its per-pixel alpha field.
 * ⚠️ If this ever throws, the pin is NOT passing — it is unable to run, which is a
 * different thing, and the message says so rather than letting a silent skip stand in
 * for a green.
 */
async function grainAlpha() {
  const svg = grainSvg();
  let raster;
  try {
    raster = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  } catch (e) {
    throw new Error(`the grain tile could not be rasterised, so the composited AA floor is UNMEASURED (not clean): ${e.message}`, { cause: e });
  }
  const { data, info } = raster;
  const alpha = [];
  for (let i = 0; i < info.width * info.height; i += 1) alpha.push(data[i * info.channels + 3] / 255);
  return { alpha, width: info.width, height: info.height };
}

/** Any barrel tone with the grain's own dark-brown laid over it at `a`. */
function compositedL(a, grainRgb, base) {
  const c = grainRgb.map((v, i) => a * v + (1 - a) * base[i]);
  return relLuminance(c[0], c[1], c[2]);
}

/** SHAFT_BODY with the grain over it — the OLD single floor, kept for the A/B below. */
function compositedFloorL(a, grainRgb) {
  return compositedL(a, grainRgb, rgbOf(SHAFT_BODY));
}

/** The grain's fill colour, PARSED from the authored matrix rather than re-typed. */
function grainRgbFromSource() {
  const m = grainSvg().match(/values='([^']+)'/);
  expect(m, 'the grain filter no longer carries a feColorMatrix').toBeTruthy();
  const n = m[1].trim().split(/\s+/).map(Number);
  expect(n.length).toBe(20);
  // Rows are R,G,B,A of five coefficients; the fifth of each colour row is the
  // constant that paints the fixed brown.
  return [n[4] * 255, n[9] * 255, n[14] * 255];
}

/**
 * ⚠️⚠️ THE RIDERS, EACH WITH ITS OWN GROUND *AND ITS OWN DIRECTION OF FAILURE* — the
 * V4 shape of the repair the verifier's F2 forced, one level deeper.
 *
 * F2, quoted: "the composited-AA pin's own base premise is falsified by the tallest
 * rider... LABEL_BOX=20 is a hand-keyed side table standing in for 'every rider's box'
 * — the exact hazard class this estate has been bitten by. Cure: derive LABEL_BOX as
 * the max over the measured riders and make the lane's own SEAT pin cover the same
 * set." That cure gave every rider its own GROUND. V4 needed the other half.
 *
 * ⚠️⚠️ ONE DIRECTION FOR ALL RIDERS WAS THE NEXT DEFECT IN THE SAME FAMILY. The old
 * table measured every rider at `ink[1]` — the DARKEST end of its extent — with the
 * grain's peak wash composited on top. That is exactly right for DARK ink on light
 * wood and exactly backwards for PALE ink on dark wood, which is the whole V4 bar:
 *
 *   · a pale label fails at its ground's LIGHTEST point, so the floor is `ink[0]`;
 *   · and the grain is a DARKENING wash, so its peak is that label's BEST case.
 *     Compositing it under a pale rider reports a comfortable pass and never measures
 *     the real worst case at all.
 *
 * A polarity-blind pin here would therefore have gone VACUOUSLY GREEN across the whole
 * repaint — every ratio comfortable, every ratio measured on the wrong pixel. So the
 * direction is stored beside the measurement (theme.js HEADER_RIDERS `polarity`), read
 * through `riderFloorTone` + `riderGrainShare`, and the non-vacuity of BOTH is asserted
 * below rather than assumed.
 *
 * ⚠️ TWO RIDERS LEFT THE BAR ENTIRELY, AND THEIR ABSENCE IS A CLAIM. The wordmark and
 * the seal are `polarity: 'bed'` in V4 — the gilded wordmark brings its own opaque
 * Armenian-bole ground and the seal sits inside a gold annulus — so the barrel is not
 * their ground and measuring them against it would answer a question nobody asked.
 * Their floors are pinned against their own beds in tests/design/contrast.test.js, and
 * `riderFloorTone` THROWS on them rather than quietly returning a barrel tone.
 * The maker's PLATE row is gone because the plate is gone (theme.js's retirement note).
 *
 * Text owes WCAG 2.2 AA's 4.5:1; a boundary owes SC 1.4.11's 3:1.
 */
const RIDERS = [
  ['PARCH_100  resting reference tab', PARCH_100, 4.5, 'tab'],
  ['PARCH      active reference tab', PARCH, 4.5, 'tab'],
  ['PARCH_100  the ghost register (Upgrade)', PARCH_100, 4.5, 'signIn'],
  ['SHAFT_SAGE signed-in account chip', SHAFT_SAGE, 4.5, 'chip'],
  ['SHAFT_STEEL developer account chip', SHAFT_STEEL, 4.5, 'chip'],
  ['PARCH_100  the WRAPPED MOBILE bar', PARCH_100, 4.5, 'mobileTab'],
  ['GILT       the active tab underline', GILT, 3, 'tabRule'],
];

describe('the COMPOSITED bar — the ground a letterform really lands on', () => {
  test('⚠️ the grain DECLARES its colour space, or the wash is engine-dependent', () => {
    // The defect this file was written around. Without it, the same bytes cost about
    // 6% of wash in one engine and 17% in another — and 17% put the resting reference
    // tab at 4.09:1.
    expect(grainSvg()).toContain("color-interpolation-filters='sRGB'");
    // …and the escaping survived it: the filter reference must still resolve.
    expect(SHAFT_GRAIN_TEXTURE).toContain('%23grain');
    expect(SHAFT_GRAIN_TEXTURE).not.toContain('%2523');
  });

  test('⚠️⚠️ EVERY RIDER CLEARS ITS OWN FLOOR — measured under its own MEASURED ink', async () => {
    const { alpha, width, height } = await grainAlpha();
    expect(width * height, 'the raster is empty — the pin would be vacuous').toBeGreaterThan(1000);
    const worst = Math.max(...alpha);
    // NON-VACUITY, BOTH WAYS. The wash must actually exist…
    expect(worst, 'the grain rasterised to nothing').toBeGreaterThan(0.005);
    const grainRgb = grainRgbFromSource();
    // …and it must actually MATTER: the composite is genuinely below the token every
    // ratio in theme.js is quoted against. If this ever stops being true the file has
    // become a restatement of contrast.test.js and should say so.
    expect(compositedFloorL(worst, grainRgb), 'the composite no longer goes below SHAFT_BODY')
      .toBeLessThan(hexL(SHAFT_BODY));
    // …and the RIDER TABLE must be a real table: every row must name a rider that
    // exists, or a typo would silently measure `undefined` and throw somewhere less
    // legible than here.
    for (const [, , , key] of RIDERS) {
      expect(HEADER_RIDERS[key], `RIDERS names a rider theme.js does not carry: ${key}`).toBeTruthy();
      expect(HEADER_RIDERS[key].polarity, `${key} has no polarity`).toBeTruthy();
      expect(HEADER_RIDERS[key].polarity, `${key} is a bed rider and cannot be measured here`)
        .not.toBe('bed');
    }

    const failures = [];
    for (const [name, ink, owed, key] of RIDERS) {
      const rider = HEADER_RIDERS[key];
      // ⚠️ THE WASH IS APPLIED AT THE RIDER'S OWN SHARE, not unconditionally: a pale
      // label's worst case is the BARE cylinder showing through a gap in the grain,
      // because a darkening wash can only raise its ratio.
      const floor = compositedL(worst * riderGrainShare(rider), grainRgb, riderFloorTone(rider));
      const got = ratioL(hexL(ink), floor);
      if (got < owed) failures.push(`${name} [${key}]: ${got.toFixed(2)} < ${owed} (floor L=${floor.toFixed(4)})`);
    }
    expect(failures, `grain alpha ${worst.toFixed(4)}`).toEqual([]);
  });

  test('⚠️⚠️ THE POLARITY IS NON-VACUOUS — the pin that would have gone green anyway', async () => {
    // THE SKEPTIC'S PIN. Everything above passes comfortably; the question is whether
    // it would ALSO have passed with the polarity ignored, which is what "vacuously
    // green" means. So the old, direction-blind model is reconstructed here and
    // required to disagree — to be MORE LENIENT — on every pale rider.
    const { alpha } = await grainAlpha();
    const grainRgb = grainRgbFromSource();
    const worst = Math.max(...alpha);
    const blind = (key) => compositedL(  // the pre-V4 model: deepest ink, peak wash
      worst, grainRgb, cylinderToneAt(HEADER_RIDERS[key].ink[1] / HEADER_RIDERS[key].bar),
    );
    const aware = (key) => compositedL(
      worst * riderGrainShare(HEADER_RIDERS[key]), grainRgb, riderFloorTone(HEADER_RIDERS[key]),
    );
    for (const [, ink, , key] of RIDERS) {
      // The blind floor is DARKER, so for a PALE ink it reports a HIGHER ratio: the
      // old model would have flattered every one of these riders.
      expect(blind(key), `${key}: the two models agree, so the polarity buys nothing`)
        .toBeLessThan(aware(key));
      expect(ratioL(hexL(ink), blind(key)), `${key}: the blind model is not more lenient`)
        .toBeGreaterThan(ratioL(hexL(ink), aware(key)));
    }
    // …and the gap is material rather than a rounding artefact: at least a tenth of a
    // contrast point on the tightest row.
    expect(ratioL(hexL(SHAFT_SAGE), blind('chip')) - ratioL(hexL(SHAFT_SAGE), aware('chip')))
      .toBeGreaterThan(0.1);
  });

  test('⚠️ THE FLETCH BAND’S EDGE, and its residual quoted rather than buried', async () => {
    // FLETCH_VANE is not in HEADER_RIDERS and cannot be: it is not a letterform, it is
    // a boundary that runs the WHOLE bar and then hangs below it. So its extent is a
    // scoping decision and it is made here, in the open.
    //
    // ⚠️⚠️ THE CLAIM ITSELF MOVED IN V4, AND THAT IS THE HONEST THING TO RECORD.
    // On the honey barrel the vane cleared 1.4.11 at 4.16:1 over the top 95% of the bar
    // and faded to 2.32:1 in the last 1.9px, and that residual was the whole scope. The
    // owner's V4 correction puts a DARK INK feather on a DARK CEDAR shaft, so the
    // boundary is BELOW 3:1 AT EVERY DEPTH — 1.7:1 at the body tone. No retune recovers
    // it (lifting the vane walks it into the label register, lifting the wood walks it
    // into theme.js's dead band), so the identification claim is RE-SCOPED rather than
    // quietly kept: the label, the gold indicator and the hang carry it, and each of
    // those is asserted in tests/design/contrast.test.js's identification block.
    //
    // WHAT SURVIVES HERE is the part this file can actually measure — that the residual
    // is UNIFORM rather than a cliff somewhere. A boundary that is quietly weak
    // everywhere is a scoping decision; one that collapses at one depth is a bug, and
    // the two are indistinguishable without measuring the whole range.
    const { alpha } = await grainAlpha();
    const grainRgb = grainRgbFromSource();
    const at = (f) => ratioL(hexL(FLETCH_VANE), compositedL(Math.max(...alpha), grainRgb, cylinderToneAt(f)));
    expect(at(SHAFT_STOPS.body), 'the fletch edge is no longer under-3:1').toBeLessThan(3);
    expect(at(SHAFT_STOPS.body).toFixed(2)).toBe('1.65');
    // 1 — NO CLIFF. Across the whole bar the boundary FADES; it does not collapse at
    //     one depth while reading fine at the next.
    const samples = [...Array(41)].map((_, i) => at(i / 40));
    expect(Math.max(...samples) - Math.min(...samples), 'the residual is a cliff, not a fade')
      .toBeLessThan(1.5);
    expect(Math.max(...samples).toFixed(2)).toBe('2.33');   // at the lit sheen, the best case
    // 2 — THE VANE IS DARKER THAN THE WOOD DOWN TO THE BODY STOP, which is what keeps
    //     the silhouette a silhouette across the whole label band.
    for (let f = 0; f <= SHAFT_STOPS.body + 1e-9; f += 0.05) {
      expect(relLuminance(...cylinderToneAt(f)), `the wood is darker than the vane at ${f.toFixed(2)}`)
        .toBeGreaterThan(hexL(FLETCH_VANE));
    }
    // 3 — AND BELOW IT THE BOUNDARY INVERTS, which is recorded rather than hidden: the
    //     barrel's own silhouette darkens PAST the vane in its last stretch, so the
    //     edge briefly reads as the wood being darker than the feather. The budget is
    //     that the crossing lives inside the bar's last tenth, where nothing is read.
    let crossing = 1;
    for (let f = SHAFT_STOPS.body; f <= 1; f += 0.001) {
      if (relLuminance(...cylinderToneAt(f)) <= hexL(FLETCH_VANE)) { crossing = f; break; }
    }
    expect(crossing, 'the vane/wood inversion has climbed into the label band')
      .toBeGreaterThan(0.9);
    expect(crossing.toFixed(3)).toBe('0.996');
  });

  test('the measured floors and the margins they leave, quoted PER RIDER', async () => {
    const { alpha } = await grainAlpha();
    const grainRgb = grainRgbFromSource();
    const floorOf = (key) => compositedL(
      Math.max(...alpha) * riderGrainShare(HEADER_RIDERS[key]),
      grainRgb,
      riderFloorTone(HEADER_RIDERS[key]),
    );
    const at = (ink, key) => ratioL(hexL(ink), floorOf(key)).toFixed(2);
    // Today's values, in their own assertion so a future retune edits an obvious
    // record and never the invariant above.
    // ⚠️ THESE RUN ~0.02 HIGHER THAN THE SAME ROWS IN tests/design/contrast.test.js,
    // and the difference is real rather than a discrepancy: this file interpolates the
    // gradient in FLOAT, as a browser's compositor does, while the sibling quantises
    // each ground to an 8-bit hex, as a screenshot does. Both are true of the same bar;
    // the quantised one is very slightly stricter, which is the safe direction for it.
    expect(at(PARCH_100, 'tab')).toBe('5.75');          // the tightest desktop text row
    expect(at(PARCH, 'tab')).toBe('6.33');
    expect(at(PARCH_100, 'signIn')).toBe('5.28');
    expect(at(SHAFT_SAGE, 'chip')).toBe('4.63');
    expect(at(SHAFT_STEEL, 'chip')).toBe('4.64');
    expect(at(PARCH_100, 'mobileTab')).toBe('6.34');
    expect(at(GILT, 'tabRule')).toBe('3.75');
    // ⚠️ THE NUMBERS ABOVE ARE THE GRAIN-FREE ONES, AND THAT IS THE POLARITY. Every
    // rider on the V4 bar is pale, so `floorOf` composites the wash at share ZERO and
    // the floors are the bare cylinder — which is what a pale label's worst case is.
    for (const [, , , key] of RIDERS) expect(riderGrainShare(HEADER_RIDERS[key])).toBe(0);
    // …so the old single-floor number is kept ONLY as the A/B that shows the wash still
    // exists and still darkens, which is the direction proof GRAIN_AMP now rests on.
    expect(compositedFloorL(Math.max(...alpha), grainRgb)).toBeLessThan(hexL(SHAFT_BODY));
    expect(compositedFloorL(Math.max(...alpha), grainRgb).toFixed(4)).toBe('0.0760');
    // And the token-only numbers the estate quotes for the V3 riders, kept as the
    // NEGATIVE CONTROLS that record why they left the bar.
    expect(ratioL(hexL(BODY), hexL(SHAFT_BODY)).toFixed(2)).toBe('1.36');
    expect(ratioL(hexL(INK_DEEP), hexL(SHAFT_BODY)).toFixed(2)).toBe('1.97');
    expect(ratioL(hexL(GOLD_TXT), hexL(SHAFT_BODY)).toFixed(2)).toBe('1.06');
    expect(ratioL(hexL(SEAL_WAX), hexL(SHAFT_BODY)).toFixed(2)).toBe('1.41');
  });

  test('⚠️ cylinderToneAt IS THE SINGLE WRITER, and it really tracks the painted ramp', () => {
    // NON-VACUITY for every floor above. A tone function that ignored its argument, or
    // that interpolated in the wrong direction, would make each rider's "own" floor a
    // constant again — the exact defect being repaired, wearing a derivation's clothes.
    const l = (f) => relLuminance(...cylinderToneAt(f));
    // It darkens monotonically downward…
    for (let f = 0; f < 1; f += 0.05) {
      expect(l(f + 0.05), `the barrel lightens between ${f.toFixed(2)} and ${(f + 0.05).toFixed(2)}`)
        .toBeLessThanOrEqual(l(f) + 1e-9);
    }
    // …it lands EXACTLY on the authored stops, so it is evaluating the real ladder…
    expect(cylinderToneAt(SHAFT_STOPS.body)).toEqual(rgbOf(SHAFT_BODY));
    expect(cylinderToneAt(1)).toEqual(rgbOf(SHAFT_RIM));
    // …and it really varies across the riders' range: the deepest rider's ground is
    // materially darker than the shallowest's. ⚠️ THE MARGIN IS A FIFTH OF WHAT IT WAS,
    // and deliberately: the whole cedar ladder lives inside L 0.02–0.15 where the honey
    // one spanned 0.26–0.83, so an absolute-difference pin tuned to the old range would
    // silently become unsatisfiable rather than strict.
    expect(l(HEADER_RIDERS.wordmark.ink[1] / HEADER_RIDERS.wordmark.bar))
      .toBeLessThan(l(HEADER_RIDERS.signIn.ink[1] / HEADER_RIDERS.signIn.bar) - 0.01);
    // …and it lands on the grain's own tone at the edge stop, which is what makes
    // GRAIN_TONE = SHAFT_EDGE a derivation rather than a coincidence.
    expect(cylinderToneAt(SHAFT_STOPS.edge)).toEqual(rgbOf(SHAFT_EDGE));
    // The derived label box really is the tallest rider's, not a hand-keyed 20.
    expect(LABEL_BOX).toBe(34.84);
    expect(LABEL_BOX).toBe(HEADER_RIDERS.wordmark.box);
  });

  test('⚠️ GRAIN_AMP IS THE ONLY STRENGTH KNOB, and the filter derives from it', () => {
    // The structural half: if the matrix could be edited directly, a future retune
    // would move the contrast floor without touching the constant this pin reads, and
    // the pin would keep measuring the same authored number while the bar got darker.
    const src = readFileSync(join(HERE, '../../src/components/theme.js'), 'utf8');
    expect(src).toContain('0.20 * GRAIN_AMP');
    expect(src).toContain('-0.22 * GRAIN_AMP');
    // The rendered URI really carries the scaled numbers, not the unscaled ones.
    expect(grainSvg()).toContain(String(0.2 * GRAIN_AMP));
    expect(grainSvg()).not.toMatch(/\s0\.2\s0\.2\s0\.2\s/);
    expect(GRAIN_AMP).toBeGreaterThan(0);
    expect(GRAIN_AMP).toBeLessThanOrEqual(1);
  });

  test('WITHIN-ENGINE DETERMINISM at a fixed raster — framed for what it is', async () => {
    // Not a cross-engine byte claim: the noise PATTERN is spec-defined and stable
    // between conformant engines, the exact bytes are not, and this file does not
    // pretend otherwise. What IS pinned is that the same authored bytes rasterised the
    // same way give the same field every time — which is what makes the number above a
    // measurement rather than a sample.
    const a = await grainAlpha();
    const b = await grainAlpha();
    expect(a.alpha.length).toBe(b.alpha.length);
    expect(Math.max(...a.alpha)).toBe(Math.max(...b.alpha));
    let same = 0;
    for (let i = 0; i < a.alpha.length; i += 1) if (a.alpha[i] === b.alpha[i]) same += 1;
    expect(same).toBe(a.alpha.length);
  });

  test('the base colour under the grain is the one the header actually paints', () => {
    // Non-vacuity for the whole file: the floor is computed over SHAFT_BODY, and that
    // is only the right base while the header paints this barrel under this grain.
    const app = readFileSync(join(HERE, '../../src/App.jsx'), 'utf8');
    expect(app).toContain('SHAFT_GRAIN_LAYERS');
    expect(app).toContain('backgroundColor: SHAFT');
    expect(SHAFT).toBeTruthy();
    // …and SHAFT_BODY, not SHAFT, is the base, because SHAFT_STOPS.body is what
    // guarantees the cylinder reaches no darker inside the label band.
    expect(hexL(SHAFT_BODY)).toBeLessThan(hexL(SHAFT));
  });
});
