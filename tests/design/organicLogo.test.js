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

describe('NO eager module inlines the device any more — and the census can still fire', () => {
  // ⚠️ THIS BLOCK CHANGED SHAPE, AND THE CHANGE IS THE POINT.
  //
  // It began as a one-FILE pin on HouseDevice.jsx, went blind the moment a second
  // eager module (MakerPlate) inlined the same silhouette, and was rebuilt as a
  // declared SET plus a directory census that could see a third copy arrive. The set
  // held two members, then one, then two again (SealImpression), then one.
  //
  // ⚠️⚠️ IT IS NOW EMPTY, AND THAT IS A RETIREMENT, NOT A LAPSE. The owner's
  // 2026-09-19 order (ODQ §934.17) took the drawn device off every shipped surface:
  // HouseDevice.jsx renders the PAINTED seal (an <img> of public/brand/seal.png) and
  // no eager module carries the geometry at all. So the invariant FLIPS — the census
  // must find NOTHING, and the old ">= 1 member" assertion would now be asserting the
  // opposite of the truth.
  //
  // An empty census is exactly the shape that goes vacuous by accident, so the guard
  // is inverted rather than deleted: the matcher is proved to FIRE on a planted copy
  // of the canonical geometry, and the directory is proved to have been read, before
  // the emptiness is believed. The one live drawer of the device, the dossier's
  // pdf/primitives/HouseDeviceSeal.jsx, IMPORTS the paths and inlines none of them —
  // which is what the estate wants of any future drawer too.
  const BRAND_DIR = resolve(process.cwd(), 'src', 'components', 'brand');
  const inlines = (source) => source.includes(DEVICE_PATHS.ring);

  it('the brand directory was really read (modules exist and carry code)', () => {
    const modules = readdirSync(BRAND_DIR).filter((f) => f.endsWith('.jsx'));
    expect(modules.length, 'the brand directory is empty — the census reads nothing').toBeGreaterThan(0);
    for (const file of modules) {
      expect(readFileSync(resolve(BRAND_DIR, file), 'utf-8').length, `${file} is empty`).toBeGreaterThan(200);
    }
  });

  it('CONTROL: the matcher convicts a planted inline copy, and clears an importer', () => {
    // Without this, "no module inlines the device" would pass on a broken matcher.
    const planted = `const d = "${DEVICE_PATHS.ring}";`;
    expect(inlines(planted), 'the matcher cannot see an inlined copy, so its silence proves nothing').toBe(true);
    // The dossier's drawer takes the paths by import and carries none of them.
    const drawer = readFileSync(resolve(process.cwd(), 'src', 'pdf', 'primitives', 'HouseDeviceSeal.jsx'), 'utf-8');
    expect(drawer.includes('DEVICE_PATHS'), 'presence control: the drawer still draws the device').toBe(true);
    expect(inlines(drawer), 'the dossier drawer forked the geometry instead of importing it').toBe(false);
  });

  it('no eager brand module carries the canonical geometry', () => {
    const found = readdirSync(BRAND_DIR)
      .filter((f) => f.endsWith('.jsx'))
      .filter((f) => inlines(readFileSync(resolve(BRAND_DIR, f), 'utf-8')));
    expect(
      found,
      'a brand module inlined the retired device geometry. The shipped mark is the painted'
      + ' seal (public/brand/seal.png, cut by scripts/derive-brand-marks.mjs); if the drawn'
      + ' device is genuinely needed again, import it from design/organic/logo.js rather than'
      + ` forking its paths:\n  ${found.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the eager mark is the painted seal, and it names the file that ships it', () => {
    const src = readFileSync(resolve(BRAND_DIR, 'HouseDevice.jsx'), 'utf-8');
    expect(src.includes("'/brand/seal.png'"), 'the eager mark stopped pointing at the painted seal').toBe(true);
    expect(existsSync(resolve(process.cwd(), 'public', 'brand', 'seal.png')), 'the seal it points at is not on disk').toBe(true);
  });
});
