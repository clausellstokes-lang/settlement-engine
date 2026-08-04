/**
 * @vitest-environment jsdom
 *
 * tests/design/brandLockup.test.jsx — THE GILDED WORDMARK + THE GILDED SEAL (ribbon
 * V4). This file replaces tests/design/makerPlate.test.jsx, which pinned the retired
 * maker's plate; every claim in it that outlived the plate is carried forward here,
 * named, so nothing is lost by the rename.
 *
 * The lockup is now ONE object: the product's name, gilded, on a branded-in bole bed,
 * with the `o` of "Forge" a gold annulus holding a bowl of sealing wax. Almost
 * everything that can go wrong with it is invisible to the eye in review and
 * catastrophic in the wild, so this file pins the claims rather than the pictures:
 *
 *   1. THE FILL CARRIES 100% OF THE CONTRAST AND THE RELIEF CARRIES 0%. Inherited
 *      verbatim from the plate's rule of tincture, which is the one law that survived
 *      it: the leaf's gradient must clear its floor at EVERY stop with the keyline and
 *      the glint switched off. A future edit that made the relief do the work would
 *      look better in a screenshot and vanish in forced colours, on a bad raster, or
 *      under a reduced-transparency preference.
 *
 *   2. THE BED'S CONTAINMENT IS THE AA CLAIM'S GEOMETRY. Gold only clears on the bole;
 *      so if any glyph edge could land on bare cedar the claim is void at that pixel.
 *      The bed's OPAQUE CORE is required to contain the wordmark's MEASURED ink extents
 *      plus BOLE_PAD — the same move SHAFT_STOPS makes for the barrel, pinned the same
 *      way, and derived from HEADER_RIDERS rather than from the laid-out box (whose
 *      bottom the ink overflows by 0.66px).
 *
 *   3. ⚠️ THE CLIP MUST FAIL SAFE. `background-clip: text` with a transparent fill is
 *      the one idiom here that can make a wordmark VANISH rather than degrade. The
 *      colour declared underneath it must be a GILT-ladder member, so an engine that
 *      honours neither -webkit property renders a solid gold wordmark.
 *
 *   4. ⚠️⚠️ THE CONTAINING-BLOCK TRAP, carried forward from the plate's file because
 *      the hazard is the header's, not the plate's. A non-`none` CSS `filter` on an
 *      element makes it the containing block for every `position: fixed` DESCENDANT, so
 *      a filter on the header — or on the lockup's wrapper — would silently re-parent
 *      every fixed overlay in the app (modals, the mobile nudge, the FAB) into a 38px
 *      bar. The research pass reproduced it. This file walks the chain.
 *
 *   5. ⚠️ DEGENERATE feTURBULENCE SEEDS, likewise carried forward: SVG specifies the
 *      filter's PRNG, and that PRNG has seeds whose initial lattice contains a zero
 *      gradient vector. Engines then disagree, which turns "deterministic texture" into
 *      a cross-engine golden hazard. The bole's own seed is checked against the spec's
 *      OWN construction re-run, not against a blocklist that rots.
 *
 *   6. THE GRAYSCALE TEST. Every separation inside the seal is a LUMINANCE step, never
 *      a hue one, so the letter still reads as an `o` in monochrome and to a reader
 *      with any colour vision deficiency.
 *
 *   7. AND THE ONE THAT ALREADY BIT: THE WORD MUST STILL SAY THE NAME. The first cut
 *      of the seal rendered it BESIDE the glyph instead of in its place and the bar
 *      shipped "SettlementFoOrge". Every structural pin was green. A screenshot caught
 *      it. Now a pin does — and it matters more in V4, because the gilding wraps the
 *      run in two more layers that could each have eaten a letter.
 */
import React from 'react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import Lockup from '../../src/components/brand/Lockup.jsx';
import GildedWordmark, {
  BH, BURN_FREQ, BW, LEAF, SCORCH_OUT, SINGE_OUT, boleReach, isDegenerateSeed,
} from '../../src/components/brand/GildedWordmark.jsx';
import WaxSeal, { BLOB, COUNTER, INNER_COUNTER, RING } from '../../src/components/brand/WaxSeal.jsx';
import {
  BOLE, BOLE_DEEP, BOLE_PAD, GILD, GILT, GILT_LIGHT, HEADER_RIDERS, PLATE_KEYLINE,
  SEAL_GLINT, SEAL_RIM, SEAL_WAX, SHAFT_BODY, SHAFT_GRAIN_TEXTURE, WRAP, cylinderToneAt,
} from '../../src/components/theme.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = (rel) => readFileSync(join(HERE, '../../src', rel), 'utf8');

/** WCAG relative luminance of an authored #rrggbb. */
function relLuminance(hex) {
  const n = parseInt(hex.slice(1, 7), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG contrast ratio between two authored hexes. */
function ratio(a, b) {
  const [hi, lo] = [relLuminance(a), relLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

afterEach(cleanup);

describe('1 — ⚠️⚠️ THE FILL CARRIES THE CONTRAST, THE RELIEF CARRIES NONE', () => {
  // The lockup's palette, split the way the retired plate's rule of tincture split it.
  // This is not a naming convention: it is the claim, and every assertion reads it.
  const METAL = { GILT, GILT_LIGHT };
  const BED = { BOLE, BOLE_DEEP };
  const RELIEF = { PLATE_KEYLINE, SEAL_RIM, SEAL_GLINT };

  test('EVERY leaf stop clears the spec floor on EVERY bed tone, by fill alone', () => {
    for (const [mName, metal] of Object.entries(METAL)) {
      for (const [bName, bed] of Object.entries(BED)) {
        expect(ratio(metal, bed), `${mName} on ${bName}`).toBeGreaterThanOrEqual(4.8);
      }
    }
    // Quoted, so a reader knows the margin without running it. The LIGHTEST bed tone
    // governs — it is the one a pale mark has the least room against.
    expect(ratio(GILT, BOLE).toFixed(2)).toBe('7.50');
  });

  test('⚠️ NO GILT STOP MAY FALL BELOW L 0.44 — the whole point of a two-stop leaf', () => {
    // A gradient fill is only as legible as its DARKEST stop, and a "modelling" stop
    // below the floor is invisible to any token-vs-token pin: the average would still
    // look fine. So the floor is asserted per stop, and the module is required to carry
    // exactly two of them.
    for (const [name, tone] of Object.entries(METAL)) {
      expect(relLuminance(tone), `${name} is below the leaf's fill floor`)
        .toBeGreaterThanOrEqual(0.44);
    }
    const stops = LEAF.backgroundImage.match(/#[0-9A-Fa-f]{6}/g) || [];
    expect(stops.length, 'the leaf no longer has exactly two stops').toBe(2);
    for (const stop of stops) {
      expect(relLuminance(stop), `${stop} is a sub-floor "modelling" stop`)
        .toBeGreaterThanOrEqual(0.44);
    }
  });

  test('the RELIEF is character only — it carries no part of the claim', () => {
    // If any relief tone were doing contrast work, dropping it (forced colours, a
    // reduced-transparency preference, an engine without paint-order) would take
    // legibility with it. Each one is required to be NEARLY TONAL to what it sits on.
    expect(ratio(PLATE_KEYLINE, BOLE), 'the keyline is doing contrast work').toBeLessThan(2);
    expect(ratio(SEAL_GLINT, SEAL_WAX), 'the glint is doing contrast work').toBeLessThan(2);
    expect(ratio(SEAL_RIM, SEAL_WAX), 'the dimple is doing contrast work').toBeLessThan(2);
    expect(Object.keys(RELIEF).length).toBe(3); // the census is the three above
  });

  test('⚠️⚠️ THE CLIP FAILS SAFE — the fallback colour is a GILT-ladder member', () => {
    // THE ONE IDIOM THAT CAN MAKE A WORDMARK VANISH RATHER THAN DEGRADE. `color` is
    // declared UNDER the clip, so an engine that honours neither -webkit property
    // renders solid gold at 7.50:1 on the bed instead of transparent-on-anything.
    expect([GILT, GILT_LIGHT], 'the leaf falls back to a non-GILT tone').toContain(LEAF.color);
    expect(LEAF.WebkitTextFillColor).toBe('transparent');
    expect(LEAF.WebkitBackgroundClip).toBe('text');
    // …and the fallback really is legible on the bed it falls back onto.
    expect(ratio(LEAF.color, BOLE)).toBeGreaterThanOrEqual(4.8);
  });
});

describe('2 — ⚠️⚠️ THE BED CONTAINS THE INK, AND THE CONTAINMENT IS DERIVED', () => {
  test('the opaque core reaches BOLE_PAD past the wordmark’s MEASURED ink', () => {
    // ⚠️ FROM INK, NOT FROM THE BOX, AND THAT IS THE WHOLE PIN. The wordmark's laid-out
    // box spans 1.58..36.42 of a 38px bar while its INK runs 7.58..37.08 — the `g` of
    // "Forge" overflows its own box by 0.66px. A bed inset from the BOX by 3px would
    // fall short at exactly the one place a descender needs it and every screenshot
    // would look correct. So the reach is re-derived here, independently, and compared.
    const r = HEADER_RIDERS.wordmark;
    const reach = boleReach();
    const boxTop = (r.bar - r.box) / 2;
    const bedTop = boxTop - reach.top;
    const bedBottom = boxTop + r.box + reach.bottom;
    expect(bedTop, 'the bed starts below ink − pad').toBeLessThanOrEqual(r.ink[0] - BOLE_PAD);
    expect(bedBottom, 'the bed ends above ink + pad').toBeGreaterThanOrEqual(r.ink[1] + BOLE_PAD);
    // NON-VACUITY: the bottom reach is a REAL number, not zero dressed as a derivation,
    // and it is bigger than the pad alone because of the 0.66px of ink overflow.
    expect(reach.bottom).toBeGreaterThan(BOLE_PAD);
    expect(reach.bottom.toFixed(2)).toBe('3.66');
    expect(reach.left).toBe(BOLE_PAD);
    expect(reach.right).toBe(BOLE_PAD);
    // ⚠️⚠️ AND THE BED CLAIMS NO TERRITORY IT DOES NOT NEED, which is the other half of
    // the containment and the half a clamped-at-zero reach silently gave away. The first
    // cut clamped `top` at 0, so the bed ran the wordmark's whole box — six px above its
    // own ink — and read at 250% as a hard-edged black PLAQUE: the exact object V4
    // retires, with a gilded name sitting on it. The reach is SIGNED now, so the bed
    // hugs `ink ± pad` and stops. Asserted as a TIGHTNESS bound, because containment
    // alone cannot see this defect: a bed the size of the whole bar would pass it.
    expect(reach.top, 'the bed reaches above ink − pad again').toBeLessThan(0);
    expect(bedTop.toFixed(2)).toBe((r.ink[0] - BOLE_PAD).toFixed(2));
    expect(bedBottom.toFixed(2)).toBe((r.ink[1] + BOLE_PAD).toFixed(2));
    // …and the whole bed is meaningfully SHORTER than the bar it is branded into.
    expect(bedBottom - bedTop).toBeLessThan(r.bar);
  });

  test('EVERY core pixel is at or below L 0.06 — the ground every gilt ratio uses', () => {
    // If the bed drifted lighter, every ratio in block 1 would fall together and
    // nothing else in the suite would notice. The scorch is deeper than the core, so
    // the CORE is the worst case and asserting it covers the bed.
    expect(relLuminance(BOLE)).toBeLessThanOrEqual(0.06);
    expect(relLuminance(BOLE_DEEP)).toBeLessThanOrEqual(0.06);
    expect(relLuminance(BOLE_DEEP)).toBeLessThan(relLuminance(BOLE));
    // …and the bed really is darker than the wood it is branded into, or it would not
    // read as a scorch at all.
    expect(relLuminance(BOLE)).toBeLessThan(relLuminance(SHAFT_BODY));
  });

  test('⚠️ THE SCORCH LIVES OUTSIDE THE CORE — an INEQUALITY, at any amplitude', () => {
    // A filter that displaced the WHOLE shape would put bare cedar under a letter at
    // some seed, and no screenshot would tell you which one. So the bed is two rects:
    // an opaque UNDISPLACED core that is exactly the bed, and a displaced field that
    // starts far enough outside it that no displacement can reach in.
    //
    // ⚠️ THE FIRST CUT INSET THE CORE BY THE AMPLITUDE INSTEAD. Also sound, and it
    // coupled the two backwards: every unit of raggedness came out of the opaque core,
    // so the amplitude was capped by BOLE_PAD and the edge could only ever be a wobble
    // around a rectangle's own outline. The bed screenshotted as a slab. This pin is
    // therefore on the INEQUALITY rather than on an equality, which is both the safer
    // claim and the one that leaves the amplitude free.
    const { container } = render(<GildedWordmark id="t">x</GildedWordmark>);
    const core = container.querySelector('[data-testid="bole-core"]');
    const scorch = container.querySelector('[data-testid="bole-scorch"]');
    const singe = container.querySelector('[data-testid="bole-singe"]');
    expect(core.getAttribute('filter'), 'the opaque core is displaced').toBeNull();
    expect(scorch.getAttribute('filter')).toMatch(/scorch/);
    expect(singe.getAttribute('filter')).toMatch(/singe/);
    expect(core.getAttribute('fill')).toBe(BOLE);
    // 1 — the core IS the bed: exactly ink ± pad, undisplaced, carrying the AA claim.
    expect(Number(core.getAttribute('x'))).toBe(0);
    expect(Number(core.getAttribute('y'))).toBe(0);
    expect(Number(core.getAttribute('width'))).toBe(BW);
    expect(Number(core.getAttribute('height'))).toBe(BH);
    // 2 — the scorch starts strictly further out than the displacement can pull it in.
    const displace = container.querySelector('feDisplacementMap');
    const amp = Number(displace.getAttribute('scale'));
    expect(amp).toBe(GILD.edgeAmp);
    expect(SCORCH_OUT, 'the scorch can be displaced INTO the core').toBeGreaterThan(amp);
    expect(Number(scorch.getAttribute('x'))).toBe(-SCORCH_OUT);
    expect(Number(scorch.getAttribute('y'))).toBe(-SCORCH_OUT);
    expect(Number(scorch.getAttribute('width'))).toBe(BW + SCORCH_OUT * 2);
    expect(Number(scorch.getAttribute('height'))).toBe(BH + SCORCH_OUT * 2);
    // …and the halo starts strictly outside the scorch, for the same reason again.
    expect(SINGE_OUT).toBeGreaterThan(SCORCH_OUT + amp);
    expect(Number(singe.getAttribute('x'))).toBe(-SINGE_OUT);
    expect(Number(singe.getAttribute('width'))).toBe(BW + SINGE_OUT * 2);
    // 3 — NON-VACUITY: the raggedness is a real amplitude, not a decorative zero, and
    //     it is a visible fraction of the bed rather than a sub-pixel wobble.
    expect(amp).toBeGreaterThan(0);
    expect(amp / BH).toBeGreaterThan(0.05);
  });

  test('⚠️⚠️ R1 — THE BURN HAS NO INTERNAL EDGE, which is what made it a plaque', () => {
    // ⚠️⚠️ THE DEFECT, PROBED RATHER THAN GUESSED. After the reach repair made the bed
    // hug `ink ± 3px`, the 100% screenshot STILL read as a dark rectangular plaque with
    // gold type on it. Scanned at device-pixel resolution down a column of the real
    // Chrome bar at x=120, the cause was visible in eleven numbers:
    //
    //   y 0.0 .. 4.5  #2A1008  (BOLE_DEEP — the scorch, already bleeding past the bar)
    //   y 5.0 .. 20.0 #3A1A10  (BOLE — the core)
    //
    // A DEAD-STRAIGHT horizontal step from L 0.0088 to L 0.0168, drawn by the core's own
    // undisplaced rectangle INSIDE a burn whose outer edge was already ragged. The
    // rectangle a reader was seeing was never the bed's silhouette — it was the boundary
    // between two tones that had no business differing.
    //
    // THE CURE IS TONAL, NOT GEOMETRIC: the scorch takes the core's own tone, so the two
    // are one continuous field with a single ragged outline, and the deep tone moves
    // OUTWARD to the singe halo where a brand actually chars.
    const { container } = render(<GildedWordmark id="t">x</GildedWordmark>);
    const core = container.querySelector('[data-testid="bole-core"]');
    const scorch = container.querySelector('[data-testid="bole-scorch"]');
    const singe = container.querySelector('[data-testid="bole-singe"]');
    expect(scorch.getAttribute('fill'), 'the burn carries an internal tonal edge again')
      .toBe(core.getAttribute('fill'));
    // …and the deep tone is spent OUTSIDE, on the halo, which is the layer that fades.
    expect(singe.getAttribute('fill')).toBe(BOLE_DEEP);
    expect(relLuminance(BOLE_DEEP)).toBeLessThan(relLuminance(BOLE));
    // THE HALO REALLY FADES: a hard-edged halo is a second rectangle one ring out.
    const blur = container.querySelector(`#t-singe feGaussianBlur`);
    expect(blur, 'the singe halo has no blur — it is a slab, not a singe').toBeTruthy();
    const [bx, by] = blur.getAttribute('stdDeviation').split(/\s+/).map(Number);
    expect(bx).toBeGreaterThan(0);
    // ⚠️ ANISOTROPIC, because heat travels along the fibre. A round blur is a drop
    // shadow, and a drop shadow under a wordmark is the plaque read returning by a
    // different door.
    expect(bx, 'the singe blur is round — that is a shadow, not a burn').toBeGreaterThan(by);
    // ⚠️⚠️ AND THE DISPLACEMENT RUNS ALONG THE GRAIN, the same direction the wood's own
    // texture has run since V3. The first cut ran `0.035 0.09` — fast ACROSS the shaft
    // and slow along it, a cross-grain wobble on a longitudinally-grained barrel.
    const [fx, fy] = BURN_FREQ.split(/\s+/).map(Number);
    expect(fy, 'the burn wobbles across the grain instead of along it').toBeGreaterThan(fx);
    const [gx, gy] = SHAFT_GRAIN_TEXTURE.match(/baseFrequency='([\d.]+) ([\d.]+)'/).slice(1).map(Number);
    expect(gy).toBeGreaterThan(gx);   // the grain's own direction, for the comparison
    for (const t of container.querySelectorAll('feTurbulence')) {
      expect(t.getAttribute('baseFrequency')).toBe(BURN_FREQ);
      expect(Number(t.getAttribute('seed'))).toBe(GILD.seed);
    }
    // ⚠️ THE BURN BLEEDS OFF THE BAR, so it has no horizontal boundary a reader can see.
    // The bed's own box already runs from `ink[0] − pad` to `ink[1] + pad`; the scorch
    // starts SCORCH_OUT bed-units outside that, which in px is more than the clearance
    // at either end. Derived here rather than eyeballed off the screenshot.
    const r = HEADER_RIDERS.wordmark;
    const pxPerUnit = ((r.ink[1] + BOLE_PAD) - (r.ink[0] - BOLE_PAD)) / BH;
    expect(SCORCH_OUT * pxPerUnit, 'the burn stops inside the bar at the top')
      .toBeGreaterThan(r.ink[0] - BOLE_PAD);
    expect((r.ink[1] + BOLE_PAD) + SCORCH_OUT * pxPerUnit, 'the burn stops inside the bar at the foot')
      .toBeGreaterThan(r.bar);
  });

  test('⚠️ THE BED IS PAINT, NEVER LAYOUT — it spends no height', () => {
    // theme.js derives ANCHOR_OFFSET from CHROME.headerDesktop and every in-page anchor
    // in the estate lands on that number, so a bed that reached below the wordmark by
    // growing a box would move every anchor in the product. It reaches by being
    // absolutely positioned with overflow visible, which costs nothing.
    const { container } = render(<GildedWordmark id="t">x</GildedWordmark>);
    const bed = container.querySelector('[data-testid="bole-bed"]');
    expect(bed.style.position).toBe('absolute');
    expect(bed.style.overflow).toBe('visible');
    expect(bed.getAttribute('aria-hidden')).toBe('true');
    expect(bed.style.pointerEvents).toBe('none');
    // …and the reach really is spent on INSETS rather than on a height.
    expect(bed.style.bottom.startsWith('-')).toBe(true);
    expect(bed.style.marginBottom).toBeFalsy();
  });

  test('⚠️ THE BOLE’S SEED IS NON-DEGENERATE, checked against the spec’s own lattice', () => {
    // Carried forward from the plate's file. SVG specifies feTurbulence's PRNG, and a
    // seed whose initial lattice yields a zero gradient vector leaves a dead spot the
    // engines handle differently. The exclusion is the construction re-run, so ANY seed
    // a future edit picks is really checked rather than matched against a stale list.
    expect(isDegenerateSeed(GILD.seed), `seed ${GILD.seed} is degenerate`).toBe(false);
    // NON-VACUITY, BOTH WAYS: the function must actually find some.
    const bad = [...Array(2000)].map((_, i) => i).filter(isDegenerateSeed);
    expect(bad.length, 'isDegenerateSeed never fires — the guard is vacuous').toBeGreaterThan(0);
    expect(bad).not.toContain(GILD.seed);
  });
});

describe('3 — ⚠️⚠️ THE GILDED SEAL: three tones, three luminance steps', () => {
  test('the ring is the `o`’s stroke and carries the letterform’s contrast', () => {
    const { container } = render(<WaxSeal />);
    const ring = container.querySelector('[data-testid="wax-seal-ring"]');
    expect(ring.getAttribute('fill')).toBe(GILT);
    expect(ring.getAttribute('fill-rule')).toBe('evenodd');
    // ONE path carrying BOTH subpaths. A second path in the barrel's colour would be a
    // lie that breaks the instant the seal is used on the PDF's cream page or on the
    // favicon's transparent square.
    expect(ring.getAttribute('d')).toContain(BLOB);
    expect(ring.getAttribute('d')).toContain(COUNTER);
  });

  test('the counter is a REAL hole in BOTH layers, and they land on each other', () => {
    // The wax is drawn inside a scale transform, so its copy of the counter must be
    // PRE-DIVIDED by that transform or the two holes miss each other by a pixel and the
    // `o` grows a red crescent nobody can attribute. Asserted as the inverse
    // relationship rather than as two matching strings.
    const { container } = render(<WaxSeal />);
    const wax = container.querySelector('[data-testid="wax-seal-body"]');
    expect(wax.getAttribute('fill')).toBe(SEAL_WAX);
    expect(wax.getAttribute('fill-rule')).toBe('evenodd');
    expect(wax.getAttribute('d')).toContain(INNER_COUNTER);
    // Re-derive: applying the group's transform to INNER_COUNTER must reproduce COUNTER.
    const k = 1 - RING;
    const t = (100 / 2) * RING;
    const norm = (d) => d.replace(/-?\d+(?:\.\d+)?/g, (n) => Number(n).toFixed(1));
    const back = norm(INNER_COUNTER.replace(/-?\d+(?:\.\d+)?/g, (n) => String(Number(n) * k + t)));
    expect(back, 'the wax’s counter does not land on the ring’s').toBe(norm(COUNTER));
    // …and the transform on the group really is the one the derivation assumed.
    const g = [...container.querySelectorAll('g')].find((el) => el.getAttribute('transform'));
    expect(g.getAttribute('transform')).toContain(`scale(${k})`);
  });

  test('⚠️ THE GRAYSCALE TEST: every separation is LUMINANCE, never hue', () => {
    // What shows through the counter is the BED. The three steps that make the letter
    // read as an `o` in monochrome, in forced colours, and to a reader with any colour
    // vision deficiency:
    expect(ratio(SEAL_WAX, GILT), 'wax vs the ring').toBeGreaterThanOrEqual(3);
    expect(ratio(SEAL_WAX, GILT).toFixed(2)).toBe('5.34');
    expect(ratio(BOLE, GILT), 'the counter vs the ring').toBeGreaterThanOrEqual(3);
    expect(ratio(BOLE, GILT).toFixed(2)).toBe('7.50');
    // The rejected designs, kept as negative controls so nobody re-proposes them.
    expect(ratio('#8C2F2A', '#6E1F1B'), 'a darker-red counter').toBeLessThan(2);
    expect(ratio(SEAL_WAX, SHAFT_BODY), 'bare wax on cedar').toBeLessThan(2);
    expect(ratio(SEAL_WAX, SHAFT_BODY).toFixed(2)).toBe('1.41');
  });

  test('the dimple, the glint and the rim-light carry NO contrast claim', () => {
    const { container } = render(<WaxSeal />);
    const glint = container.querySelector('[data-testid="wax-seal-glint"]');
    // An ARC at low opacity, never a specular dot: a near-white pixel inside a
    // letterform reads as plastic and eats the counter's contrast at small sizes.
    expect(glint.getAttribute('stroke')).toBe(SEAL_GLINT);
    expect(Number(glint.getAttribute('stroke-opacity'))).toBeLessThan(1);
    expect(glint.getAttribute('fill')).toBe('none');
    const rim = container.querySelector('[data-testid="wax-seal-rim-light"]');
    expect(Number(rim.getAttribute('stroke-opacity'))).toBeLessThan(1);
    expect(rim.getAttribute('stroke')).toBe(GILT_LIGHT);
    // ⚠️ THE GLINT RIDES THE WAX, NOT THE RING. A bright arc laid on gold is a second
    // metal, and the lockup spends exactly one.
    expect(glint.getAttribute('stroke')).not.toBe(GILT_LIGHT);
  });

  test('⚠️ CHROMA IS RATIONED: red appears in the lockup exactly once, and means "sealed"', () => {
    // The bar already spends red on the silk WRAPs that bind the fletching. The seal is
    // deliberately the same family a step deeper, so the two read as one object's two
    // red moments. Nothing else in the lockup may take a saturated colour.
    // ⚠️ SATURATION ALONE IS NOT CHROMA, AND THIS PIN LEARNED IT THE HARD WAY. By ratio
    // alone a near-black keyline is 0.67 "saturated" and got flagged as an unrationed
    // hue — but a colour that dark is a shadow, not a spend. Chroma is saturation AT A
    // BRIGHTNESS a viewer can actually read as colour.
    const sat = (hex) => {
      const n = parseInt(hex.slice(1, 7), 16);
      const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      const peak = Math.max(r, g, b);
      if (peak < 90) return 0;
      return (peak - Math.min(r, g, b)) / peak;
    };
    const { container } = render(<Lockup />);
    const fills = [...container.querySelectorAll('[fill], [stroke]')]
      .flatMap((el) => [el.getAttribute('fill'), el.getAttribute('stroke')])
      .filter((v) => typeof v === 'string' && v.startsWith('#'));
    expect(fills.length).toBeGreaterThan(4); // not a vacuous census
    // ⚠️⚠️ AND V4 TAUGHT IT THE SECOND HALF: METAL IS NOT CHROMA EITHER. The gilding
    // put #D4AF45 on the bar and this pin flagged it, correctly by its own rule and
    // wrongly by the directive's — "saturation is the seal's alone; GOLD IS METAL". A
    // metal is a MATERIAL: one family, one purpose, re-lit per ground, and it says
    // nothing about state or meaning the way a signal colour does. So the ration is now
    // asserted as "AT MOST TWO NAMED FAMILIES, and no third", which is a strictly
    // stronger claim than the old membership test — a new saturated hue still reds,
    // and so would a third family, but the metal is not miscounted as a spend.
    const reds = [...new Set(fills)].filter((h) => sat(h) > 0.55);
    const SEAL_FAMILY = [SEAL_WAX, SEAL_RIM, SEAL_GLINT];
    const METAL_FAMILY = [GILT, GILT_LIGHT];
    for (const h of reds) {
      expect([...SEAL_FAMILY, ...METAL_FAMILY], `${h} is an unrationed saturated hue`).toContain(h);
    }
    // …and the ration really is spent — the seal's own reds are in the census.
    expect(reds).toContain(SEAL_WAX);
    // …and there really are exactly TWO families, not three wearing two names: every
    // saturated tone falls into one of them and both are non-empty.
    expect(reds.filter((h) => SEAL_FAMILY.includes(h)).length).toBeGreaterThan(0);
    expect(reds.filter((h) => METAL_FAMILY.includes(h)).length).toBeGreaterThan(0);
    // The family claim: the seal is a deeper step of the wrap's own red, not a new hue.
    const hue = (hex) => {
      const n = parseInt(hex.slice(1, 7), 16);
      const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      return Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
    };
    expect(Math.abs(hue(SEAL_WAX) - hue(WRAP))).toBeLessThan(0.35);
    // ⚠️ THE ORDER FLIPPED IN V4 AND THAT IS DELIBERATE: the wraps deepened to oxblood
    // past the wax, so the SEAL is now the lighter of the two reds. What the pin
    // defends is that they stay ONE FAMILY, not which of them is deeper.
    expect(relLuminance(SEAL_WAX)).toBeGreaterThan(relLuminance(WRAP));
  });
});

describe('4 — ⚠️⚠️ THE WORD STILL SAYS THE NAME (the defect that shipped)', () => {
  test('the wordmark reads "SettlementForge" — the seal REPLACED the glyph', () => {
    // THE PIN THIS LANE DID NOT HAVE AND NEEDED. The first cut rendered the seal BESIDE
    // the `o` and the live bar read "SettlementFoOrge". Every structural pin was green;
    // a screenshot caught it. jsdom cannot see the seal, but it CAN read the text run —
    // and the replaced letter is deliberately still in it (invisibly), so the product's
    // own name survives being selected and copied. ⚠️ IT MATTERS MORE IN V4, because
    // the gilding wraps that run in two further layers, either of which could have
    // eaten a letter without moving one visual pin.
    for (const compact of [false, true]) {
      cleanup();
      const { container } = render(<Lockup compact={compact} />);
      const mark = container.querySelector('[data-testid="brand-wordmark"]');
      expect(mark.textContent, `the ${compact ? 'mobile' : 'desktop'} wordmark`)
        .toBe('SettlementForge');
    }
  });

  test('the replaced letter is present but paints NOTHING and takes NO space', () => {
    const { container } = render(<Lockup />);
    const hidden = [...container.querySelectorAll('span')]
      .find((s) => s.textContent === 'o' && s.style.position === 'absolute');
    expect(hidden, 'the copy-only letter is missing').toBeTruthy();
    expect(hidden.style.clipPath).toBe('inset(50%)');
    expect(hidden.style.overflow).toBe('hidden');
    // …and exactly ONE glyph became a graphic.
    expect(container.querySelectorAll('[data-testid="wax-seal"]').length).toBe(1);
  });

  test('the whole lockup is aria-hidden — the mark never spells the name for AT', () => {
    const { container } = render(<Lockup />);
    const mark = container.querySelector('[data-testid="brand-wordmark"]');
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('[data-testid="bole-bed"]').getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('[data-testid="wax-seal"]').getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('[data-testid="wax-seal"]').getAttribute('focusable')).toBe('false');
  });

  test('the desktop draw is an h1 and the compact draw is NOT — one heading, not two', () => {
    const desk = render(<Lockup />);
    expect(desk.container.querySelector('h1')).toBeTruthy();
    cleanup();
    const mob = render(<Lockup compact />);
    expect(mob.container.querySelector('h1')).toBeNull();
  });

  test('⚠️⚠️ THE PLATE IS GONE — asserted as an ABSENCE, with a presence control', () => {
    // The owner's V4 correction retires the maker's plate from the header entirely. An
    // absence pin is worthless without a presence control beside it, so the same render
    // is required to carry the thing that REPLACED it.
    const { container } = render(<Lockup />);
    expect(container.querySelector('[data-testid="maker-plate"]')).toBeNull();
    expect(container.querySelector('[data-testid="maker-plate-device"]')).toBeNull();
    expect(container.querySelector('[data-testid="bole-bed"]'), 'nothing replaced it').toBeTruthy();
    // …and the module itself is gone from the tree, not merely unrendered — a dead
    // component that still compiles is how a retirement quietly becomes a fork.
    expect(() => SRC('components/brand/MakerPlate.jsx')).toThrow();
    // THE DEVICE SURVIVES, and that is the half of the retirement that is easy to lose:
    // it is still the favicon, the PDF seal, the footer and the error boundary.
    expect(SRC('components/brand/HouseDevice.jsx').length).toBeGreaterThan(200);
  });
});

describe('5 — the brand modules are DETERMINISTIC and carry no baked light', () => {
  test('no random source and no transcendental in any brand module', () => {
    for (const file of ['GildedWordmark.jsx', 'WaxSeal.jsx', 'Lockup.jsx']) {
      const code = SRC(`components/brand/${file}`)
        .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code.length, `${file} was stripped to nothing`).toBeGreaterThan(200);
      expect(code, file).not.toMatch(/Math\.random|crypto\.getRandomValues|Date\.now/);
      expect(code, file).not.toMatch(/Math\.(sin|cos|tan|exp|log|pow)\b/);
    }
  });

  test('⚠️ THE ONE LIGHT IS COMPUTED FROM, NOT REMEMBERED — F3’s cure, carried forward', () => {
    // The verifier's F3 was that PLATE_LIGHT_DEG was a DEAD TOKEN referenced only in a
    // comment. The plate is gone; the hazard is not. Both surviving brand modules that
    // draw relief must still compute from the azimuth rather than hand-key an offset.
    const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    for (const [file, want] of Object.entries({
      'GildedWordmark.jsx': /lightOffset\(/,
      'WaxSeal.jsx': /lightArc\(/,
    })) {
      const code = strip(SRC(`components/brand/${file}`));
      expect(code, `${file} no longer computes from the one light`).toMatch(want);
      // NEGATIVE CONTROL: no hand-keyed shadow offsets left in the file.
      expect(code, `${file} hand-keys a shadow offset`).not.toMatch(/drop-shadow\(\s*-?[\d.]+px/);
    }
  });

  test('⚠️⚠️ NO ANCESTOR OF THE LOCKUP CARRIES A CSS FILTER — the containing-block trap', () => {
    // A non-`none` filter makes an element the containing block for every
    // `position: fixed` DESCENDANT, so a filter on the lockup's wrapper would re-parent
    // every modal, nudge and FAB in the app into a 38px bar. Carried forward from the
    // plate's own file, because the hazard belongs to the header rather than to the
    // mark that used to sit in it.
    const { container } = render(<Lockup />);
    const seal = container.querySelector('[data-testid="wax-seal"]');
    expect(seal).toBeTruthy();
    let walked = 0;
    for (let el = seal.parentElement; el && el !== container; el = el.parentElement) {
      walked += 1;
      expect(el.style?.filter, `<${el.tagName}> filters an ancestor of the lockup`).toBeFalsy();
    }
    expect(walked, 'the walk was vacuous').toBeGreaterThan(0);
  });
});
