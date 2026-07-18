/**
 * tests/design/organicLogo.test.js — THE HOUSE DEVICE contract (owner-approved
 * final mark, 2026-07-18).
 *
 * Pins: the canonical geometry (ring broken at the roofline chord, the station
 * triangle, the seal-point at the triangle's centroid); the mark NEVER carries
 * text; the heavy favicon weight is a REDRAW (heavier strokes), never a scale;
 * the one-ink variant still reads; the seal-point is the rubric oxblood, never
 * the destructive red; the golden SVG set is byte-stable; and the shipped public
 * assets exist in their correct formats (the ogImageRaster idiom for rasters).
 * The eager header component (components/brand/HouseDevice.jsx) is pinned
 * byte-equal to the canonical paths so the two sources can never drift.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  DEVICE_PATHS, DEVICE_DOT, DEVICE_WEIGHTS, houseDevice, faviconSvg,
  appleTouchIconSvg, ogImageSvg, devicePalette, HOUSE_MOTTO,
} from '../../src/design/organic/logo.js';
import { RUBRIC } from '../../src/design/organic/rubrication.js';
import { color } from '../../src/design/tokens.js';
import { logoSamples, LOGO_DIR } from '../../scripts/gen-organic-logo.mjs';

const PUB = resolve(process.cwd(), 'public');

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
    for (const svg of Object.values(logoSamples())) {
      expect(/<text|<tspan/i.test(svg)).toBe(false);
    }
    expect(/<text/i.test(faviconSvg())).toBe(false);
    expect(/<text/i.test(appleTouchIconSvg())).toBe(false);
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

describe('the shipped public assets (format contracts, not byte-goldens)', () => {
  const isPng = (buf) => buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const pngDims = (buf) => ({ w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) });

  it('favicon.svg is the heavy redraw with the embedded color-scheme swap', () => {
    const svg = readFileSync(resolve(PUB, 'favicon.svg'), 'utf-8');
    expect(svg).toContain('prefers-color-scheme: dark');
    expect(svg).toContain(`stroke-width="${DEVICE_WEIGHTS.heavy.ring}"`);
    expect(svg).toContain(devicePalette('light').ink);
    expect(svg).toContain(devicePalette('dark').ink);
  });

  it('favicon.ico is a 2-image ICO container', () => {
    const ico = readFileSync(resolve(PUB, 'favicon.ico'));
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);   // type icon
    expect(ico.readUInt16LE(4)).toBe(2);   // 16 + 32
  });

  it('favicon-dark.png (the Safari fallback) is a 32px PNG', () => {
    const buf = readFileSync(resolve(PUB, 'favicon-dark.png'));
    expect(isPng(buf)).toBe(true);
    expect(pngDims(buf)).toEqual({ w: 32, h: 32 });
  });

  it('apple-touch-icon.png is 180px full-bleed', () => {
    const buf = readFileSync(resolve(PUB, 'apple-touch-icon.png'));
    expect(isPng(buf)).toBe(true);
    expect(pngDims(buf)).toEqual({ w: 180, h: 180 });
    // The SVG source keeps the device inside the central-80% maskable safe zone.
    expect(appleTouchIconSvg()).toContain('translate(18,18) scale(2.25)');
  });

  it('og-craft.png is the declared 1200×630 social raster', () => {
    const buf = readFileSync(resolve(PUB, 'og-craft.png'));
    expect(isPng(buf)).toBe(true);
    expect(pngDims(buf)).toEqual({ w: 1200, h: 630 });
    // The og SOURCE carries the wordmark as adjacent TYPE (allowed — it is beside
    // the mark, not inside the device group).
    expect(ogImageSvg()).toContain('SettlementForge');
  });
});

describe('the eager header component pins to the canonical paths', () => {
  it('components/brand/HouseDevice.jsx carries byte-equal path data', () => {
    const src = readFileSync(resolve(process.cwd(), 'src', 'components', 'brand', 'HouseDevice.jsx'), 'utf-8');
    for (const d of Object.values(DEVICE_PATHS)) expect(src).toContain(d);
    expect(src).toContain(String(DEVICE_DOT.r));
  });
});
