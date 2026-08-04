/**
 * @vitest-environment jsdom
 *
 * tests/design/makerPlate.test.jsx — THE MAKER'S PLATE + THE WAX SEAL (owner task
 * #78, built to the research-locked spec).
 *
 * The lockup is a bronze escutcheon carrying the house device, and a wordmark whose
 * `o` in "Forge" is a blob of sealing wax with the letter's counter struck through it.
 * Almost everything that can go wrong with it is invisible to the eye in review and
 * catastrophic in the wild, so this file pins the claims rather than the pictures:
 *
 *   1. THE RULE OF TINCTURE AS A CODE CONSTRAINT. Heraldry's legibility law — never
 *      metal on metal, never colour on colour — is the entire AA structure of the
 *      plate. The device's FILL carries 100% of the contrast and the RELIEF carries
 *      0%. A future edit that made the emboss do the work would look better in a
 *      screenshot and vanish in forced colours, on a bad raster, or under a
 *      reduced-transparency preference.
 *
 *   2. THE BEVEL'S CONFINEMENT IS THE AA CLAIM'S GEOMETRY. PLATE_BEVEL_LIGHT is
 *      LIGHTER than the face; a device sitting on it measures 4.28:1 and fails. It
 *      never does, because the two occupy disjoint fractions of the plate — the same
 *      move SHAFT_STOPS.body makes for the barrel, and pinned the same way.
 *
 *   3. ⚠️⚠️ THE CONTAINING-BLOCK TRAP. A non-`none` CSS `filter` on an element makes
 *      it the containing block for every `position: fixed` DESCENDANT. A filter on
 *      the header — or on the lockup's wrapper — would silently re-parent every fixed
 *      overlay in the app (modals, the mobile nudge, the FAB) into a 38px bar. The
 *      research pass reproduced it. So the filter lives on the plate's own SVG, which
 *      is a leaf, and this file walks the ancestor chain to prove nothing above it
 *      carries one.
 *
 *   4. ⚠️ DEGENERATE feTURBULENCE SEEDS. SVG specifies the filter's PRNG, and that
 *      PRNG has seeds whose initial lattice contains a zero gradient vector. Engines
 *      then disagree, which turns "deterministic texture" into a cross-engine golden
 *      hazard. The exclusion is pinned as the spec's OWN construction re-run, not as a
 *      blocklist that rots — so any seed a future edit picks is really checked.
 *
 *   5. THE GRAYSCALE TEST. The seal's counter is separated from the wax by LUMINANCE,
 *      never by hue, so the letter still reads as an `o` in monochrome and to a reader
 *      with any colour vision deficiency.
 *
 *   6. AND THE ONE THAT ALREADY BIT: THE WORD MUST STILL SAY THE NAME. The first cut
 *      rendered the seal BESIDE the glyph instead of in its place and the bar shipped
 *      "SettlementFoOrge". Every structural pin was green. A screenshot caught it.
 *      Now a pin does.
 */
import React from 'react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import Lockup from '../../src/components/brand/Lockup.jsx';
import MakerPlate, { FIELD, M, W, isDegenerateSeed } from '../../src/components/brand/MakerPlate.jsx';
import WaxSeal, { BLOB, COUNTER } from '../../src/components/brand/WaxSeal.jsx';
import {
  PLATE, PLATE_BEVEL_LIGHT, PLATE_BEVEL_SHADE, PLATE_DEEP, PLATE_DEVICE, PLATE_FACE,
  PLATE_KEYLINE, PLATE_LIT, PLATE_RIVET, SEAL_GLINT, SEAL_RIM, SEAL_WAX, SHAFT_BODY,
  WRAP,
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

/**
 * THE COMPOSITED FLOOR — the darkest tone the LIVE bar reaches inside the label band,
 * measured on the rendered page rather than derived from a token (grain over cylinder
 * over base colour; lane PB, Chrome, 1440x900). Recorded as a luminance so a
 * token-only test can still ask the honest question.
 */
const COMPOSITE_FLOOR_L = 0.3995;
const ratioOnBar = (hex) => {
  const [hi, lo] = [relLuminance(hex), COMPOSITE_FLOOR_L].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

afterEach(cleanup);

describe('1 — ⚠️⚠️ THE RULE OF TINCTURE: the FILL carries the contrast, the RELIEF carries none', () => {
  // The plate's palette, split the way heraldry splits it. This is not a naming
  // convention: it is the claim, and every assertion below reads these two sets.
  const METAL = { PLATE_DEVICE };
  const COLOUR = { PLATE_LIT, PLATE_FACE, PLATE_DEEP };
  const RELIEF = { PLATE_BEVEL_LIGHT, PLATE_BEVEL_SHADE, PLATE_KEYLINE, PLATE_RIVET };

  test('the METAL clears AA on EVERY tone of the COLOUR face, by fill alone', () => {
    for (const [mName, metal] of Object.entries(METAL)) {
      for (const [cName, colour] of Object.entries(COLOUR)) {
        expect(ratio(metal, colour), `${mName} on ${cName}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    // Quoted, so a reader knows the margin without running it. The LIGHTEST face tone
    // governs — it is the one a pale mark has the least room against.
    expect(ratio(PLATE_DEVICE, PLATE_LIT).toFixed(2)).toBe('5.05');
  });

  test('⚠️ THE FACE IS MID-TONE, because engraving needs headroom in BOTH directions', () => {
    // On a near-black face there is no room BELOW it: the shadow half of every bevel
    // disappears and the relief flattens into a dark shape with a scratch on it. The
    // face must therefore be dark enough to carry a pale device and light enough that
    // PLATE_BEVEL_SHADE still reads as a shadow.
    expect(relLuminance(PLATE_LIT)).toBeGreaterThan(0.05);   // not near-black
    expect(relLuminance(PLATE_LIT)).toBeLessThan(0.25);      // still a dark bronze
    expect(relLuminance(PLATE_BEVEL_SHADE)).toBeLessThan(relLuminance(PLATE_DEEP));
    expect(relLuminance(PLATE_BEVEL_LIGHT)).toBeGreaterThan(relLuminance(PLATE_LIT));
  });

  test('⚠️ NO RELIEF TONE CARRIES LEGIBILITY — each is near-tonal to the face', () => {
    // The decisive one. If any relief tone were far enough from the face to be doing
    // contrast work, switching it off would change what the plate says. Each is held
    // inside a narrow ratio of the face it sits on, so the emboss reads as depth and
    // could be dropped entirely without costing a single AA claim.
    for (const [name, tone] of Object.entries(RELIEF)) {
      expect(ratio(tone, PLATE_FACE), `${name} is doing contrast work`).toBeLessThan(2);
    }
    // ⚠️ THE KEYLINE IS IN THAT LIST TOO, AND THAT SURPRISED THIS LANE. It is a hard
    // near-black hairline and it FEELS like the loudest thing on the plate, but
    // against the face it measures 1.95:1 — it is not separating the mark from its
    // ground, it is separating the PLATE from whatever is behind it. That is its real
    // job and this is where it is owed a floor: a boundary against the bar, at
    // SC 1.4.11's 3:1, measured on the composited barrel rather than a token.
    expect(ratioOnBar(PLATE_KEYLINE)).toBeGreaterThanOrEqual(3);
  });

  test('⚠️ THE BEVEL IS CONFINED, AND THE DEVICE IS FORBIDDEN THERE — geometrically', () => {
    // PLATE_BEVEL_LIGHT is lighter than the face; a device on it would measure this…
    expect(ratio(PLATE_DEVICE, PLATE_BEVEL_LIGHT)).toBeLessThan(4.5);
    expect(ratio(PLATE_DEVICE, PLATE_BEVEL_LIGHT).toFixed(2)).toBe('4.28');
    // …so the claim is bought with geometry, exactly like SHAFT_STOPS.body: the bevel
    // owns the outer PLATE.margin of the plate and the device's field starts there.
    expect(FIELD.x).toBe(M);
    expect(FIELD.y).toBe(M);
    expect(M).toBe(W * PLATE.margin);
    // The bevel's stroke, at its authored width and offset, stays inside that margin.
    const bevelReach = W * PLATE.bevel * (0.5 + 0.4);
    expect(bevelReach, 'the bevel spills into the device field').toBeLessThan(M);
    // …and it is a FRACTION, so the confinement survives every size, including the
    // 32px favicon redraw.
    expect(PLATE.margin).toBeGreaterThan(0);
    expect(PLATE.margin).toBeLessThan(0.5);
  });
});

describe('2 — ⚠️⚠️ the containing-block trap, and the mounting stack', () => {
  test('NO ancestor of the plate carries a CSS filter — the trap, walked', () => {
    const { container } = render(<Lockup />);
    const plate = container.querySelector('[data-testid="maker-plate"]');
    expect(plate).toBeTruthy();
    // The plate itself MAY have one: it is a leaf and contains nothing fixed.
    expect(plate.style.filter, 'the mounting stack is missing').toBeTruthy();
    let walked = 0;
    for (let el = plate.parentElement; el; el = el.parentElement) {
      walked += 1;
      expect(el.style?.filter, `<${el.tagName}> filters an ancestor of the plate`).toBeFalsy();
      expect(el.style?.backdropFilter, `<${el.tagName}> backdrop-filters an ancestor`).toBeFalsy();
    }
    expect(walked, 'the walk found no ancestors — the pin would be vacuous').toBeGreaterThan(0);
  });

  test('the mounting is a THREE-shadow stack: umbra, penumbra, ambient', () => {
    // One shadow makes a sticker. Three make a thing bolted to a surface: a tight
    // near-black contact, a soft mid one for the standoff, an wide faint one for the
    // bounced light. Pinned as a count AND as a monotonic blur ladder, because three
    // identical shadows would satisfy a count alone.
    const { container } = render(<MakerPlate />);
    const plate = container.querySelector('[data-testid="maker-plate"]');
    expect((plate.style.filter.match(/drop-shadow/g) || []).length).toBe(3);
    // ⚠️ EVERY OFFSET CARRIES AN EXPLICIT UNIT, INCLUDING THE ZEROS. A bare `0` is
    // valid CSS and unreadable to a parser like this one, which is how the first cut
    // of this pin measured two shadows out of three and passed anyway.
    const radii = [...plate.style.filter.matchAll(/drop-shadow\([-\d.]+px\s+[-\d.]+px\s+([\d.]+)px/g)]
      .map((m) => Number(m[1]));
    expect(radii.length, 'a shadow offset is missing its unit').toBe(3);
    for (let i = 1; i < radii.length; i += 1) {
      expect(radii[i], 'the three shadows are not a ladder').toBeGreaterThan(radii[i - 1]);
    }
  });

  test('the emboss is LAYERED ZERO-BLUR offsets, never a blur filter', () => {
    // Measured crisper than an SVG filter at the 14-20px sizes this is drawn at, and
    // it needs no filter region, no colour-space declaration and no second raster.
    const { container } = render(<MakerPlate />);
    const device = container.querySelector('[data-testid="maker-plate-device"]');
    expect(device).toBeTruthy();
    // Two OFFSET copies (shadow + light) plus the metal fill drawn in place with no
    // transform at all — so the offset copies are exactly the transformed children.
    const copies = [...device.children].filter((g) => g.tagName === 'g' && g.hasAttribute('transform'));
    const inPlace = [...device.children].filter((g) => g.tagName === 'g' && !g.hasAttribute('transform'));
    expect(copies.length).toBe(2);
    expect(inPlace.length).toBe(1);
    for (const g of [...copies, ...inPlace]) {
      expect(g.getAttribute('filter'), 'the emboss reached for a blur filter').toBeNull();
    }
    for (const g of copies) expect(g.getAttribute('transform')).toMatch(/^translate\(/);
    // ⚠️ THE STRIKE IS INVERTED RELATIVE TO THE PLATE'S OWN BEVEL. The plate stands
    // proud; the device is sunk INTO it, so its shadow falls on the side the plate's
    // highlight is on. Backwards, an engraving reads as a sticker of an engraving.
    const tints = copies.map((g) => g.querySelector('g')?.getAttribute('stroke'));
    expect(tints).toContain(PLATE_BEVEL_LIGHT);
    expect(tints).toContain(PLATE_BEVEL_SHADE);
  });
});

describe('3 — ⚠️ THE GRIT: a vetted seed, a capped amplitude, a declared colour space', () => {
  test('the seed is NOT degenerate, checked by re-running the spec’s own construction', () => {
    expect(isDegenerateSeed(PLATE.seed), `seed ${PLATE.seed} is degenerate`).toBe(false);
  });

  test('NEGATIVE CONTROL — the checker really can say yes', () => {
    // Without this the pin above passes on a checker that returns false for
    // everything, which is precisely how a seed allowlist goes quietly vacuous.
    // These are genuinely degenerate under the SVG filter spec's PRNG.
    for (const seed of [346, 514, 1155, 1519, 1690]) {
      expect(isDegenerateSeed(seed), `${seed} should be degenerate`).toBe(true);
    }
    // …and it is not simply saying yes to everything either.
    const flagged = [...Array(200).keys()].filter(isDegenerateSeed);
    expect(flagged.length).toBeGreaterThanOrEqual(0);
    expect(flagged.length).toBeLessThan(20);
  });

  test('GRIT, NOT GLOSS: the amplitude is capped and the cap is spent in the filter', () => {
    // A specular highlight would put a near-white pixel on the face and the device's
    // contrast floor would move with it. At 8/255 the wash is visible as age and
    // cannot shift any ratio by a hundredth.
    expect(PLATE.gritAmp).toBeLessThanOrEqual(8);
    expect(PLATE.gritAmp).toBeGreaterThan(0);
    const src = SRC('components/brand/MakerPlate.jsx');
    // The matrix's alpha coefficients are DERIVED from the cap, never re-typed.
    expect(src).toContain('PLATE.gritAmp / 255');
    expect(src).toContain('PLATE.gritAmp / 510');
    // No specular anywhere: no white, no lighten/screen blend.
    expect(src).not.toMatch(/#[Ff]{3,6}\b|mix-blend|feSpecular/);
  });

  test('⚠️ the filter DECLARES sRGB — the default is linearRGB and engines differ', () => {
    const { container } = render(<MakerPlate />);
    const filter = container.querySelector('filter');
    expect(filter, 'the grit filter did not render').toBeTruthy();
    expect(filter.getAttribute('color-interpolation-filters')).toBe('sRGB');
    expect(container.querySelector('feTurbulence').getAttribute('seed')).toBe(String(PLATE.seed));
  });

  test('REDRAW FOR SIZE: below the detail floor the grit and rivets are NOT drawn', () => {
    // Never scaled down into dirt. The favicon variant is a simpler drawing, and so is
    // the small plate: sub-pixel grit and sub-pixel rivets are noise, not texture.
    const big = render(<MakerPlate size={26} />);
    expect(big.container.querySelectorAll('[data-testid="maker-plate-rivet"]').length).toBe(2);
    expect(big.container.querySelector('feTurbulence')).toBeTruthy();
    cleanup();
    const small = render(<MakerPlate size={14} />);
    expect(small.container.querySelectorAll('[data-testid="maker-plate-rivet"]').length).toBe(0);
    expect(small.container.querySelector('feTurbulence')).toBeNull();
    // …but the DEVICE — the only thing carrying meaning — survives the redraw.
    expect(small.container.querySelector('[data-testid="maker-plate-device"]')).toBeTruthy();
  });

  test('ORNAMENT: two rivets, symmetric, and nothing else', () => {
    // Rivets are mounting hardware — they say the plate is fixed to something, which
    // is the whole story. Wreaths and borders say the plate is important, which is a
    // claim it is not entitled to make about itself.
    const { container } = render(<MakerPlate />);
    const rivets = [...container.querySelectorAll('[data-testid="maker-plate-rivet"]')];
    expect(rivets.length).toBe(2);
    const xs = rivets.map((r) => Number(r.getAttribute('cx')));
    expect(xs[0] + xs[1]).toBeCloseTo(W, 6);      // symmetric about the plate's spine
    expect(rivets[0].getAttribute('cy')).toBe(rivets[1].getAttribute('cy'));
  });
});

describe('4 — ⚠️⚠️ THE SEAL: the impression is the counter, and the counter is a hole', () => {
  test('the counter is a REAL hole — one even-odd path, not a disc painted on top', () => {
    const { container } = render(<WaxSeal />);
    const body = container.querySelector('[data-testid="wax-seal-body"]');
    expect(body.getAttribute('fill-rule')).toBe('evenodd');
    // ONE path carrying BOTH subpaths. A second path in the barrel's colour would be a
    // lie that breaks the instant the seal is used on the PDF's cream page or on the
    // favicon's transparent square.
    expect(body.getAttribute('d')).toContain(BLOB);
    expect(body.getAttribute('d')).toContain(COUNTER);
    expect(body.getAttribute('fill')).toBe(SEAL_WAX);
  });

  test('⚠️ THE GRAYSCALE TEST: the counter is separated by LUMINANCE, never by hue', () => {
    // What shows through the counter is the bar. The step between the wax and the bar
    // is what makes the letter read as an `o` in monochrome, in forced colours, and to
    // a reader with any colour vision deficiency. A darker-RED counter measured 1.39:1
    // against the wax and merged into a blob by about 20px; this is the alternative
    // that was taken.
    expect(ratioOnBar(SEAL_WAX)).toBeGreaterThanOrEqual(3);
    expect(ratioOnBar(SEAL_WAX).toFixed(2)).toBe('4.80');
    // The rejected design, kept as the negative control so nobody re-proposes it.
    expect(ratio('#8C2F2A', '#6E1F1B')).toBeLessThan(2);
  });

  test('⚠️⚠️ THE WAX OWES TEXT CONTRAST, because it IS a letter', () => {
    // It stands in for a glyph inside the wordmark, so 4.5:1 — not the 3:1 a
    // decorative graphic would owe — against the bar it rides, measured on the
    // COMPOSITED barrel and not against a token that the grain undercuts.
    expect(ratioOnBar(SEAL_WAX)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(SEAL_WAX, SHAFT_BODY)).toBeGreaterThanOrEqual(4.5);
    // A mid sealing-wax red is what the eye wants and it fails; recorded so the
    // temptation is answered in place.
    expect(ratioOnBar('#8C2F2A')).toBeLessThan(4.5);
    expect(ratioOnBar('#8C2F2A').toFixed(2)).toBe('3.52');
  });

  test('the dimple and the glint carry NO contrast claim — matte wax, not gloss', () => {
    const { container } = render(<WaxSeal />);
    const glint = container.querySelector('[data-testid="wax-seal-glint"]');
    // An ARC at low opacity, never a specular dot: a near-white pixel inside a
    // letterform reads as plastic and eats the counter's contrast at small sizes.
    expect(glint.getAttribute('stroke')).toBe(SEAL_GLINT);
    expect(Number(glint.getAttribute('stroke-opacity'))).toBeLessThan(1);
    expect(glint.getAttribute('fill')).toBe('none');
    expect(ratio(SEAL_GLINT, SEAL_WAX), 'the glint is doing contrast work').toBeLessThan(2);
    expect(ratio(SEAL_RIM, SEAL_WAX), 'the dimple is doing contrast work').toBeLessThan(2);
  });

  test('⚠️ CHROMA IS RATIONED: red appears in the lockup exactly once, and it means "sealed"', () => {
    // The bar already spends red on the silk WRAPs that bind the fletching. The seal
    // is deliberately the same family a step deeper, so the two read as one object's
    // two red moments. Nothing else in the lockup may take a saturated colour.
    // ⚠️ SATURATION ALONE IS NOT CHROMA, AND THIS PIN LEARNED IT THE HARD WAY. By
    // ratio alone the plate's near-black KEYLINE (#241B0C) is 0.67 "saturated" and got
    // flagged as an unrationed hue — but a colour that dark is a shadow, not a spend.
    // Chroma is saturation AT A BRIGHTNESS a viewer can actually read as colour.
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
    const reds = [...new Set(fills)].filter((h) => sat(h) > 0.55);
    for (const h of reds) {
      expect([SEAL_WAX, SEAL_RIM, SEAL_GLINT], `${h} is an unrationed saturated hue`).toContain(h);
    }
    // …and the ration really is spent — the seal's own reds are in the census.
    expect(reds).toContain(SEAL_WAX);
    // The family claim: the seal is a deeper step of the wrap's own red, not a new hue.
    const hue = (hex) => {
      const n = parseInt(hex.slice(1, 7), 16);
      const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      return Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
    };
    expect(Math.abs(hue(SEAL_WAX) - hue(WRAP))).toBeLessThan(0.35);
    expect(relLuminance(SEAL_WAX)).toBeLessThan(relLuminance(WRAP));
  });
});

describe('5 — ⚠️⚠️ THE WORD STILL SAYS THE NAME (the defect that shipped)', () => {
  test('the wordmark reads "SettlementForge" — the seal REPLACED the glyph', () => {
    // THE PIN THIS LANE DID NOT HAVE AND NEEDED. The first cut rendered the seal
    // BESIDE the `o` and the live bar read "SettlementFoOrge". Every structural pin
    // was green; a screenshot caught it. jsdom cannot see the seal, but it CAN read
    // the text run — and the replaced letter is deliberately still in it (invisibly),
    // so the product's own name survives being selected and copied.
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
    expect(container.querySelector('[data-testid="maker-plate"]').getAttribute('aria-hidden')).toBe('true');
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
});

describe('6 — the brand modules are DETERMINISTIC and carry no baked light', () => {
  test('no random source and no transcendental in any brand module', () => {
    for (const file of ['MakerPlate.jsx', 'WaxSeal.jsx', 'Lockup.jsx']) {
      const code = SRC(`components/brand/${file}`)
        .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(code.length, `${file} was stripped to nothing`).toBeGreaterThan(200);
      expect(code, file).not.toMatch(/Math\.random|crypto\.getRandomValues|Date\.now/);
      expect(code, file).not.toMatch(/Math\.(sin|cos|tan|exp|log|pow)\b/);
    }
  });

  test('the device silhouette is FLAT and tinted by its caller — no baked colour', () => {
    // One asset serves the plate's emboss (three tints of it), the favicon (one tint,
    // no plate) and the PDF seal. A silhouette with its highlight painted in is a
    // picture of a mark, not a mark, and it cannot be re-lit for a new ground.
    const src = SRC('components/brand/MakerPlate.jsx');
    const device = src.slice(src.indexOf('function Device('));
    expect(device.length).toBeGreaterThan(200);
    expect(device, 'the device has a baked colour').not.toMatch(/#[0-9A-Fa-f]{6}/);
    expect(device).toContain('stroke={fill}');
  });
});
