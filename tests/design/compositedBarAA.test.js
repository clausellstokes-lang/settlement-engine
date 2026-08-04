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
  BODY, GOLD_TXT, GRAIN_AMP, INK_DEEP, SECOND, SEAL_WAX, SHAFT, SHAFT_BODY,
  SHAFT_GRAIN_TEXTURE, SHAFT_GREEN, SHAFT_SLATE, FLETCH_VANE, PLATE_KEYLINE,
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

/** SHAFT_BODY with the grain's own dark-brown laid over it at `a`. */
function compositedFloorL(a, grainRgb) {
  const base = rgbOf(SHAFT_BODY);
  const c = grainRgb.map((v, i) => a * v + (1 - a) * base[i]);
  return relLuminance(c[0], c[1], c[2]);
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
 * THE RIDERS, and the floor each one owes. Text owes WCAG 2.2 AA's 4.5:1; a boundary
 * owes SC 1.4.11's 3:1. ⚠️ SEAL_WAX IS IN THE TEXT GROUP because it stands in for a
 * letter of the wordmark — that is the whole reason it is authored as deep as it is.
 */
const RIDERS = [
  ['INK_DEEP    wordmark + active tab', INK_DEEP, 4.5],
  ['BODY        resting reference tab', BODY, 4.5],
  ['SECOND      ghost-button register', SECOND, 4.5],
  ['SHAFT_GREEN signed-in account chip', SHAFT_GREEN, 4.5],
  ['SHAFT_SLATE developer account chip', SHAFT_SLATE, 4.5],
  ['SEAL_WAX    the `o` of Forge', SEAL_WAX, 4.5],
  ['GOLD_TXT    the active tab underline', GOLD_TXT, 3],
  ['FLETCH_VANE the "this is a fletch" edge', FLETCH_VANE, 3],
  ['PLATE_KEYLINE the maker plate’s edge', PLATE_KEYLINE, 3],
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

  test('⚠️⚠️ EVERY RIDER CLEARS ITS FLOOR on the grain-over-cylinder WORST CASE', async () => {
    const { alpha, width, height } = await grainAlpha();
    expect(width * height, 'the raster is empty — the pin would be vacuous').toBeGreaterThan(1000);
    const worst = Math.max(...alpha);
    // NON-VACUITY, BOTH WAYS. The wash must actually exist…
    expect(worst, 'the grain rasterised to nothing').toBeGreaterThan(0.005);
    // …and it must actually MATTER: the composited floor is genuinely below the token
    // every ratio in theme.js is quoted against. If this ever stops being true the
    // file has become a restatement of contrast.test.js and should say so.
    const floor = compositedFloorL(worst, grainRgbFromSource());
    expect(floor, 'the composite no longer goes below SHAFT_BODY').toBeLessThan(hexL(SHAFT_BODY));

    const failures = [];
    for (const [name, ink, owed] of RIDERS) {
      const got = ratioL(hexL(ink), floor);
      if (got < owed) failures.push(`${name}: ${got.toFixed(2)} < ${owed}`);
    }
    expect(failures, `composited floor L=${floor.toFixed(4)} (grain alpha ${worst.toFixed(4)})`).toEqual([]);
  });

  test('the measured floor and the margin it leaves, quoted', async () => {
    const { alpha } = await grainAlpha();
    const floor = compositedFloorL(Math.max(...alpha), grainRgbFromSource());
    // Today's values, in their own assertion so a future retune edits an obvious
    // record and never the invariant above.
    expect(floor.toFixed(3)).toBe('0.392');
    expect(ratioL(hexL(BODY), floor).toFixed(2)).toBe('4.56');       // the tightest text row
    expect(ratioL(hexL(SHAFT_GREEN), floor).toFixed(2)).toBe('4.54'); // the next tightest
    expect(ratioL(hexL(INK_DEEP), floor).toFixed(2)).toBe('6.58');
    // And the token-only number the estate has always quoted, for the comparison that
    // is the whole point of this file.
    expect(ratioL(hexL(BODY), hexL(SHAFT_BODY)).toFixed(2)).toBe('4.89');
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
