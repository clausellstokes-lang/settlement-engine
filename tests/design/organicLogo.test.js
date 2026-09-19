/**
 * tests/design/organicLogo.test.js — THE HOUSE DEVICE contract (the 2026-07-18 mark,
 * still the dossier's vector charter mark after the 2026-09-19 brand re-cut).
 *
 * Pins: the canonical geometry (ring broken at the roofline chord, the station
 * triangle, the seal-point at the triangle's centroid); the mark NEVER carries
 * text; the heavy weight is a REDRAW (heavier strokes), never a scale; the one-ink
 * variant still reads; the seal-point is the rubric oxblood, never the destructive
 * red; and the golden SVG set is byte-stable. Every eager module that inlines the
 * silhouette is pinned byte-equal to the canonical paths so the sources cannot drift.
 *
 * NOT here any more: the shipped icons and share cards. They are cuts of the owner's
 * arrow painting as of ODQ §934.17 and are pinned by
 * tests/build/brandDerivatives.test.js — see the note above the inliner block.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  DEVICE_PATHS, DEVICE_DOT, DEVICE_WEIGHTS, houseDevice, devicePalette, HOUSE_MOTTO,
} from '../../src/design/organic/logo.js';
import { RUBRIC } from '../../src/design/organic/rubrication.js';
import { color } from '../../src/design/tokens.js';
import { logoSamples, LOGO_DIR } from '../../scripts/gen-organic-logo.mjs';

describe('the device — canonical geometry', () => {
  it('ring + skyline + triangle follow the approved geometry (hand-inked within tolerance)', () => {
    // The hand-inked paths must START/END on the canonical anchor points: the ring
    // is broken exactly at (7,44)/(57,44) where the skyline runs.
    expect(DEVICE_PATHS.ring).toMatch(/^M 7 44 A 27(\.\d+)? 26(\.\d+)? 0 1 1 57 44$/);
    expect(DEVICE_PATHS.skyline.startsWith('M 7 44')).toBe(true);
    expect(DEVICE_PATHS.skyline.trim().endsWith('57 44')).toBe(true);
    // The seal-point sits at the station triangle's centroid (32, 25.7±0.1).
    expect(DEVICE_DOT.cx).toBe(32);
    expect(Math.abs(DEVICE_DOT.cy - 25.7)).toBeLessThanOrEqual(0.1);
  });

  it('the heavy weight is a REDRAW — heavier strokes + a larger point, same paths', () => {
    expect(DEVICE_WEIGHTS.heavy.ring).toBeGreaterThan(DEVICE_WEIGHTS.standard.ring * 1.5);
    expect(DEVICE_DOT.rHeavy).toBeGreaterThan(DEVICE_DOT.r * 1.4);
    // Same authored paths in both weights — the wobble survives the redraw.
    expect(houseDevice({ weight: 'heavy' })).toContain(DEVICE_PATHS.skyline);
    expect(houseDevice({ weight: 'standard' })).toContain(DEVICE_PATHS.skyline);
  });

  it('the mark NEVER carries text (no text/tspan in any device variant)', () => {
    const variants = Object.values(logoSamples());
    expect(variants.length, 'no variants rendered, so the scan proves nothing').toBeGreaterThan(0);
    for (const svg of variants) {
      expect(/<text|<tspan/i.test(svg)).toBe(false);
    }
  });

  it('the seal-point is the rubric oxblood — never the destructive red', () => {
    expect(devicePalette('light').rubric).toBe(RUBRIC.rubric);
    expect(devicePalette('light').rubric).not.toBe(color['red-600']);
    // One-ink variant: the dot renders in the ink and the device still reads.
    const oneInk = houseDevice({ oneInk: true });
    expect(oneInk).not.toContain(RUBRIC.rubric);
    expect(oneInk).toContain(`fill="${devicePalette('light').ink}"`);
  });

  it('the motto lives in TYPE beside the mark, never inside it', () => {
    expect(HOUSE_MOTTO).toBe('State, never fate');
    for (const svg of Object.values(logoSamples())) expect(svg).not.toContain(HOUSE_MOTTO);
  });
});

describe('the golden SVG set (byte-stable drift guard)', () => {
  it('the committed goldens byte-match a fresh render', () => {
    for (const [name, svg] of Object.entries(logoSamples())) {
      const file = resolve(LOGO_DIR, name);
      expect(existsSync(file), `${name} missing — run: node scripts/gen-organic-logo.mjs`).toBe(true);
      expect(readFileSync(file, 'utf-8'), `${name} stale — run: node scripts/gen-organic-logo.mjs`).toBe(`${svg}\n`);
    }
  });
});

/*
 * ⚠ THE SHIPPED-ASSET ARMS MOVED, THEY DID NOT LAPSE. This file used to pin
 * public/favicon.svg, favicon.ico, favicon-dark.png, apple-touch-icon.png and
 * og-craft.png as renders of this device. The owner's 2026-09-19 order (ODQ §934.17)
 * cut every one of them out of the arrow painting instead, so they are no longer this
 * device's output and pinning them here would be reading the wrong source. Their
 * contracts — existence, format, declared size, determinism from the master — live in
 * tests/build/brandDerivatives.test.js. favicon.svg, favicon-dark.png and
 * og-default.svg are gone from the tree entirely; the ICO's 16 px layer is the painted
 * seal too, so the device draws no shipped icon at any size.
 *
 * What this file still owns is the DRAWN DEVICE: its geometry, its golden SVG set, and
 * the eager modules that inline it.
 */

describe('every eager module that INLINES the device pins to the canonical paths', () => {
  // ⚠️ A SET, NOT A FILE. This pin used to name HouseDevice.jsx alone, and the moment
  // a second eager module inlined the same silhouette (MakerPlate, which struck it
  // into the bronze plate and therefore needed the raw geometry three times over) the
  // pin was guarding one of two copies while reading perfectly correct. A one-file
  // containment pin also goes VACUOUS on a pure relocation: the file moves, the read
  // throws or the constant stops appearing, and nobody notices which. So: a declared
  // set, a non-empty assertion over it, and a negative control.
  //
  // ⚠️⚠️ THE SET IS BACK TO ONE MEMBER IN RIBBON V4, AND THAT IS A RETIREMENT RATHER
  // THAN A REGRESSION. The maker's plate left the header entirely (the wordmark itself
  // is the gilded artifact now — components/brand/GildedWordmark.jsx), so its module is
  // deleted and with it the second inlined copy. The SET SHAPE IS KEPT DELIBERATELY:
  // the lesson was that a one-FILE pin cannot see a second copy arriving, and that is
  // true whether the set currently holds one member or two. The membership assertion is
  // therefore ">= 1" plus a live census that no OTHER brand module has quietly grown a
  // copy — which is the guard the old ">1" could never be.
  // ⚠️⚠️ AND IT IS BACK TO TWO IN V4.1, WHICH IS THE SET SHAPE EARNING ITS KEEP. The
  // owner's seal clarification (2026-08-04) puts the house device INSIDE the wax as an
  // impression above 28px, so a second eager module carries the silhouette again —
  // SealImpression.jsx. The census below CAUGHT its arrival on the first run rather
  // than being told about it, which is precisely the guard a one-file pin could not be.
  //
  // ⚠️ AND IT IS BACK TO ONE MEMBER AGAIN (owner orders 2026-09-16): the header became the
  // owner's arrow painting, so the gilded wordmark, the wax seal and its impression left
  // the product with the ribbon, and SealImpression.jsx took the second inlined copy with
  // it. The SET SHAPE and the directory census stay, for the reason above. The negative
  // control moved with it: WaxSeal is gone, so the sibling proving the containment check
  // can fail is now the footer's LegalRibbonRow, which IMPORTS the device and must not
  // INLINE its geometry.
  const INLINERS = ['HouseDevice.jsx'];

  it('the inliner set is non-empty and every member really exists', () => {
    expect(INLINERS.length).toBeGreaterThanOrEqual(1);
    for (const f of INLINERS) {
      expect(existsSync(resolve(process.cwd(), 'src', 'components', 'brand', f)), `${f} is listed but missing`).toBe(true);
    }
  });

  it.each(INLINERS)('%s carries byte-equal path data', (file) => {
    const src = readFileSync(resolve(process.cwd(), 'src', 'components', 'brand', file), 'utf-8');
    for (const d of Object.values(DEVICE_PATHS)) {
      expect(src, `${file} has drifted from the canonical geometry`).toContain(d);
    }
    expect(src).toContain(String(DEVICE_DOT.rHeavy));
  });

  it('NEGATIVE CONTROL — a module that does NOT inline the device is not in the set', () => {
    // Non-vacuity for the whole block: the containment check must be capable of
    // failing. LegalRibbonRow imports the device and draws it, and carries none of its
    // geometry, so it is the proof that `toContain` is doing real work.
    const row = readFileSync(resolve(process.cwd(), 'src', 'components', 'footer', 'LegalRibbonRow.jsx'), 'utf-8');
    expect(row, 'presence control: the row still mounts the device it must not inline').toContain('HouseDevice');
    expect(row.includes(DEVICE_PATHS.ring), 'LegalRibbonRow inlines the device geometry').toBe(false);
    expect(INLINERS.includes('LegalRibbonRow.jsx')).toBe(false);
  });

  it('⚠️ THE SET IS TOTAL — no brand module inlines the device without being listed', () => {
    // THE GUARD THE MEMBERSHIP COUNT WAS STANDING IN FOR. Listing two files proved
    // nothing about a third; this censuses the whole directory and requires every
    // module carrying the canonical ring path to be a declared member. It is what makes
    // the set shrinking to one member safe.
    const dir = resolve(process.cwd(), 'src', 'components', 'brand');
    const found = readdirSync(dir)
      .filter((f) => f.endsWith('.jsx'))
      .filter((f) => readFileSync(resolve(dir, f), 'utf-8').includes(DEVICE_PATHS.ring));
    expect(found.length, 'the census found nothing — it is vacuous').toBeGreaterThan(0);
    expect([...found].sort()).toEqual([...INLINERS].sort());
  });
});
