/**
 * @vitest-environment node
 *
 * tests/design/textureBudget.test.js — THE COVERAGE RATCHET (counsel R6, ribbon V4.1).
 *
 * ⚠️⚠️ WHY A RATCHET AND NOT A REVIEW. Ribbon spec part 2 §4 splits every mark on this
 * bar into two classes — TONE-STRUCTURE AT 1x and RETINA-ONLY — and gives the second an
 * explicit budget: "≤0.6px, each <2% effective ink so 1x integrates as tone — the
 * corrugated-metal law inverted". A design document cannot enforce that. This file is
 * what makes it a law, and theme.js's TEXTURE-COMPLETE LAW is where the law is written
 * down; the two are one thing in two places.
 *
 * ⚠️⚠️ THE DEFECT THE CLASS EXISTS FOR, quoted from the PB verifier's eye verdict on the
 * V3 band: "The comb is stripes, not texture: barbGap 4.1 viewBox units = 3.6 CSS px
 * with strokes at 0.7/1.0/1.25px non-scaling → up to ~35% areal coverage; the
 * docstring's 'hairline at a ~8% tonal drop' describes the TONE, not the resulting
 * coverage." Every claim about that comb was true and the band still read as corrugated
 * metal, because TONE ALONE IS NOT WHAT THE EYE INTEGRATES — tone × area is. A budget
 * expressed in opacity is a budget that cannot see its own failure.
 *
 * ⚠️ SO EVERY CUE IS MEASURED IN EFFECTIVE INK: the share of the surface it covers,
 * multiplied by how strongly it covers it. For a stroked comb that is width/gap ×
 * opacity; for a rasterised turbulence tile it is the tile's own mean alpha; for a
 * gradient band it is the band's share of its period × its own contrast share. Each
 * form is computed from the SAME authored constants the component draws from, so a
 * retune moves the measurement rather than outdating it.
 *
 * ⚠️⚠️ AND IT IS A TOTALITY CHECK. A budget that only measures the cues someone
 * remembered to list is a budget with a hole exactly the shape of the next cue. The
 * roster below is asserted COMPLETE against the drawn band: every stroked path in the
 * rendered SVG whose width is at or under the retina threshold must be accounted for by
 * a roster row, so a new whisper reds here until it is declared and measured.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { describe, expect, test } from 'vitest';

import {
  GROWTH_AMP, PORE_AMP, SHAFT_GROWTH_TEXTURE, SHAFT_PORE_TEXTURE, WRAP_TURN,
} from '../../src/components/theme.js';
import {
  BAND_PX_PER_UNIT, BARB, LOWER_CUT_INK, combCoverage,
} from '../../src/components/nav/FletchBand.jsx';

const require_ = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const sharpMod = require_(join(HERE, '../../node_modules/sharp/dist/index.cjs'));
const sharp = sharpMod.default || sharpMod;

/** The spec's own two numbers, and they are the only two this file allows. */
const RETINA_MAX_PX = 0.6;
const RETINA_MAX_INK = 0.02;

/** The mean alpha of a rasterised wood tile — its effective ink, by definition. */
async function tileInk(uri) {
  const svg = decodeURIComponent(
    uri.replace(/^url\("data:image\/svg\+xml,/, '').replace(/"\)$/, ''),
  );
  const { data, info } = await sharp(Buffer.from(svg))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (let i = 0; i < info.width * info.height; i += 1) sum += data[i * info.channels + 3] / 255;
  return sum / (info.width * info.height);
}

/**
 * The FRAY's effective ink. It is a stroked comb like the barbs, so it is measured the
 * same way — width over spacing, weighted by opacity — from FletchBand's own authored
 * values, read out of the source so a retune cannot outdate them.
 */
function frayInk() {
  const src = readFileSync(join(HERE, '../../src/components/nav/FletchBand.jsx'), 'utf8');
  const block = src.slice(src.indexOf('data-testid={`nav-fletch-fray-'));
  const width = Number(block.match(/strokeWidth="([\d.]+)"/)[1]);
  const opacity = Number(block.match(/strokeOpacity="([\d.]+)"/)[1]);
  // The hairs run a little over one comb gap apart (`frayHairs`: 1.1–2.0 gaps), so the
  // widest spacing is the LEAST dense case and the narrowest the worst: 1.1 gaps.
  const spacingPx = 6.6 * 1.1 * BAND_PX_PER_UNIT;
  return { width, ink: (width / spacingPx) * opacity };
}

/** The split lit-hairlines', read the same way. */
function splitLipInk() {
  const src = readFileSync(join(HERE, '../../src/components/nav/FletchBand.jsx'), 'utf8');
  const block = src.slice(src.indexOf('data-testid={`nav-fletch-split-lips-'));
  const width = Number(block.match(/strokeWidth="([\d.]+)"/)[1]);
  const opacity = Number(block.match(/strokeOpacity="([\d.]+)"/)[1]);
  // THREE lips per cell over a cell whose visible width is one lane. Their own length
  // is a fraction of the vane's depth, so this over-counts by treating each as if it
  // ran the full depth — over-strict in the safe direction, and said so rather than
  // quietly tuned.
  const lipsPerCell = 3;
  const cellPx = 100 * BAND_PX_PER_UNIT;
  return { width, ink: ((width * lipsPerCell) / cellPx) * opacity };
}

/** The lower cut's whisper rachis — one hairline over the vane's whole depth. */
function lowerCutInk() {
  const src = readFileSync(join(HERE, '../../src/components/nav/FletchBand.jsx'), 'utf8');
  const block = src.slice(src.indexOf('data-testid={`nav-fletch-lower-cut-'));
  const width = Number(block.match(/strokeWidth="([\d.]+)"/)[1]);
  // Its share of the VANE is its width over the vane's painted depth in px (76 band
  // units at the measured scale is the horizontal run; vertically one unit is one px).
  return { width, ink: (width / 76) * LOWER_CUT_INK };
}

/**
 * The inter-turn shadow's — the one cue that is a GRADIENT rather than a stroke. Its
 * "width" is the shadow band and its "spacing" the turn period, and it is fully opaque,
 * so its effective ink is simply its share of the period.
 */
function interTurnInk() {
  return { width: WRAP_TURN.shadow, ink: WRAP_TURN.shadow / WRAP_TURN.period };
}

describe('THE TEXTURE-COMPLETE LAW — every retina cue under 2% effective ink', () => {
  test('⚠️⚠️ THE ROSTER: each of spec part 2 §4’s retina cues, measured', async () => {
    const comb = combCoverage();
    const fray = frayInk();
    const lip = splitLipInk();
    const cut = lowerCutInk();
    const turn = interTurnInk();
    const pore = await tileInk(SHAFT_PORE_TEXTURE);

    const ROSTER = [
      ['the comb', Math.max(...BARB.widths), comb.ink],
      ['the fray', fray.width, fray.ink],
      ['the split lit-hairlines', lip.width, lip.ink],
      ['the pore flecks', RETINA_MAX_PX, pore],
      ['the lower cut’s whisper rachis', cut.width, cut.ink],
    ];
    const failures = [];
    for (const [name, width, ink] of ROSTER) {
      if (width > RETINA_MAX_PX) failures.push(`${name}: ${width}px is over the ${RETINA_MAX_PX}px retina ceiling`);
      if (ink >= RETINA_MAX_INK) failures.push(`${name}: ${(ink * 100).toFixed(2)}% effective ink is over 2%`);
      if (!(ink > 0)) failures.push(`${name}: measures ZERO ink — the cue is not drawn, or the measurement is vacuous`);
    }
    expect(failures).toEqual([]);
    // TODAY'S NUMBERS, in their own assertion so a retune edits an obvious record and
    // never the invariant above. ⚠️ THE COMB IS THE TIGHT ROW and always has been — it
    // is the cue whose failure named this whole class.
    expect((comb.ink * 100).toFixed(2)).toBe('1.44');
    expect((fray.ink * 100).toFixed(3)).toBe('1.874');
    expect((pore * 100).toFixed(3)).toBe('0.111');
    expect((cut.ink * 100).toFixed(3)).toBe('0.268');

    // ⚠️ THE INTER-TURN SHADOW IS THE ONE DECLARED EXCEPTION, and it is declared rather
    // than quietly omitted. It is a GRADIENT BAND, not a stroke: at 0.4px of a 2.6px
    // period it is 15% of the whipping's own area, which is what a turn of thread looks
    // like and is nothing like a hairline veiling a vane. What holds it is the other
    // budget — it lies inside a 10px band that carries no label and no state, so a 1x
    // reader integrates the WHOLE WRAP as one oxblood mark. Its own ratchet is the
    // ladder pin in navFletching, not this one.
    expect(turn.width).toBeLessThanOrEqual(RETINA_MAX_PX);
    expect(turn.ink).toBeGreaterThan(RETINA_MAX_INK);
    expect((turn.ink * 100).toFixed(1)).toBe('15.4');
  });

  test('⚠️⚠️ THE ROSTER IS TOTAL — a new whisper cannot arrive undeclared', async () => {
    // THE GUARD THE PER-CUE NUMBERS ARE STANDING IN FOR. Measuring five cues proves
    // nothing about a sixth, and the sixth is exactly what a future texture edit adds.
    // So the DRAWN band is censused: every stroked path at or under the retina width is
    // matched against a roster row by its own testid, and an unrecognised one reds.
    const src = readFileSync(join(HERE, '../../src/components/nav/FletchBand.jsx'), 'utf8');
    const DECLARED = [
      'nav-fletch-barbs-',        // the comb
      'nav-fletch-fray-',         // the free barb tips
      'nav-fletch-split-lips-',   // the split lit-hairlines
      'nav-fletch-lower-cut-',    // R4's whisper rachis
    ];
    // Every `strokeWidth="…"` in the module, with the testid nearest above it.
    const hits = [...src.matchAll(/strokeWidth="([\d.]+)"/g)].map((m) => {
      const before = src.slice(0, m.index);
      const id = [...before.matchAll(/data-testid=\{?`?([a-z-]+)/g)].pop();
      return { width: Number(m[1]), id: id ? id[1] : '(none)' };
    });
    expect(hits.length, 'the census found no strokes — it is vacuous').toBeGreaterThan(3);
    const undeclared = hits
      .filter((h) => h.width <= RETINA_MAX_PX)
      .filter((h) => !DECLARED.some((d) => h.id.startsWith(d)));
    expect(undeclared, 'an undeclared retina cue is drawn on the band').toEqual([]);
    // …and every declared row really is present in the module, so the roster cannot
    // rot into a list of names for marks that no longer exist.
    for (const d of DECLARED) expect(src, `${d} is declared but not drawn`).toContain(d);
    // NON-VACUITY of the width filter: the band also carries marks ABOVE the retina
    // ceiling (the two edge-light rims at 1px), so the filter is really selecting.
    expect(hits.some((h) => h.width > RETINA_MAX_PX)).toBe(true);
  });

  test('⚠️ THE WOOD LAYERS OBEY THEIR OWN CEILINGS, which are the spec’s', async () => {
    // The two turbulence layers added in V4C are budgeted by PEAK alpha rather than by
    // effective ink — the spec states them that way ("RIM-tone wash <=9% alpha",
    // "~4% coverage at 6% alpha") because a threshold field's mean says little about
    // what a reader sees. Both are asserted at their source constants here so the
    // ceilings live beside the retina ones rather than only inside compositedBarAA.
    expect(GROWTH_AMP, 'the growth lines exceed the spec’s 9% ceiling').toBeLessThanOrEqual(0.09);
    expect(PORE_AMP, 'the pore flecks exceed the spec’s 6% ceiling').toBeLessThanOrEqual(0.06);
    // …and the pore layer is ALSO a retina cue, so it owes the 2% effective-ink rule
    // too — the one layer that has to clear both budgets.
    expect(await tileInk(SHAFT_PORE_TEXTURE)).toBeLessThan(RETINA_MAX_INK);
    // The growth lines are TONE-STRUCTURE, not a retina cue, so they do NOT owe it —
    // recorded as an exemption with its reason rather than left to inference.
    expect(await tileInk(SHAFT_GROWTH_TEXTURE)).toBeGreaterThan(0);
  });
});
