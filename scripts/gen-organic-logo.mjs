#!/usr/bin/env node
/**
 * scripts/gen-organic-logo.mjs — THE HOUSE DEVICE asset pipeline (owner-approved
 * mark, 2026-07-18). Renders the canonical device (src/design/organic/logo.js)
 * into every shipped brand asset:
 *
 *   GOLDEN SVGs (byte-stable; tests/design/organicLogo.test.js drift-guards):
 *     docs/samples/organic-craft/logo/device-{light,dark,one-ink}.svg
 *     docs/samples/organic-craft/logo/device-heavy-{light,dark}.svg
 *
 *   PUBLIC ASSETS (outside the app bundle — zero eager bytes):
 *     public/favicon.svg        — heavy redraw + embedded prefers-color-scheme
 *     public/favicon.ico        — ICO container embedding 16+32 PNGs (light mode)
 *     public/favicon-dark.png   — 32px PNG dark fallback (Safari ignores SVG media queries)
 *     public/apple-touch-icon.png — 180px, full-bleed parchment, device in the central-80% safe zone
 *     public/og-craft.png       — 1200×630 social unfurl (device + wordmark TYPE beside it)
 *
 * PNGs are rasterised via sharp at gen time and committed; they are NOT byte-goldens
 * (rasterisation varies by host), so the test pins existence + signature + dimensions
 * instead (the ogImageRaster idiom). Regenerate: node scripts/gen-organic-logo.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { houseDevice, faviconSvg, appleTouchIconSvg, ogImageSvg } from '../src/design/organic/logo.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const LOGO_DIR = resolve(ROOT, 'docs', 'samples', 'organic-craft', 'logo');
const PUBLIC = resolve(ROOT, 'public');

/** filename → SVG string, the byte-stable golden set. */
export function logoSamples() {
  return {
    'device-light.svg': houseDevice({ mode: 'light', size: 64 }),
    'device-dark.svg': houseDevice({ mode: 'dark', size: 64 }),
    'device-one-ink.svg': houseDevice({ mode: 'light', oneInk: true, size: 64 }),
    'device-heavy-light.svg': houseDevice({ mode: 'light', weight: 'heavy', size: 64 }),
    'device-heavy-dark.svg': houseDevice({ mode: 'dark', weight: 'heavy', size: 64 }),
  };
}

/**
 * A minimal ICO container embedding PNG images (the modern-browser-accepted
 * PNG-in-ICO form). ICONDIR (6B) + one ICONDIRENTRY (16B) per image + PNG blobs.
 * @param {{size:number, png:Buffer}[]} images
 */
export function packIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);            // reserved
  header.writeUInt16LE(1, 2);            // type: icon
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  const blobs = [];
  let offset = 6 + 16 * images.length;
  for (const { size, png } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);  // width (0 = 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1);  // height
    e.writeUInt8(0, 2);                        // palette
    e.writeUInt8(0, 3);                        // reserved
    e.writeUInt16LE(1, 4);                     // planes
    e.writeUInt16LE(32, 6);                    // bpp
    e.writeUInt32LE(png.length, 8);            // bytes
    e.writeUInt32LE(offset, 12);               // offset
    entries.push(e);
    blobs.push(png);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...blobs]);
}

async function main() {
  const { default: sharp } = await import('sharp');
  mkdirSync(LOGO_DIR, { recursive: true });

  // 1. The golden SVG set.
  for (const [name, svg] of Object.entries(logoSamples())) {
    writeFileSync(resolve(LOGO_DIR, name), `${svg}\n`);
  }

  // 2. favicon.svg — heavy + embedded color-scheme.
  writeFileSync(resolve(PUBLIC, 'favicon.svg'), `${faviconSvg()}\n`);

  // 3. favicon.ico — 16 + 32 PNGs (light mode, heavy redraw) in an ICO container.
  const heavyLight = Buffer.from(houseDevice({ mode: 'light', weight: 'heavy', size: 64 }));
  const png16 = await sharp(heavyLight, { density: 96 }).resize(16, 16).png().toBuffer();
  const png32 = await sharp(heavyLight, { density: 192 }).resize(32, 32).png().toBuffer();
  writeFileSync(resolve(PUBLIC, 'favicon.ico'), packIco([{ size: 16, png: png16 }, { size: 32, png: png32 }]));

  // 4. favicon-dark.png — the 32px dark fallback (pale ink for dark tab bars).
  const heavyDark = Buffer.from(houseDevice({ mode: 'dark', weight: 'heavy', size: 64 }));
  writeFileSync(resolve(PUBLIC, 'favicon-dark.png'), await sharp(heavyDark, { density: 192 }).resize(32, 32).png().toBuffer());

  // 5. apple-touch-icon.png — 180, full-bleed parchment, central-80% safe zone.
  writeFileSync(resolve(PUBLIC, 'apple-touch-icon.png'), await sharp(Buffer.from(appleTouchIconSvg()), { density: 192 }).resize(180, 180).png().toBuffer());

  // 6. og-craft.png — 1200×630 social unfurl (rendered at 2x density for crisp
  // type, then resized to the exact declared og:image dimensions).
  writeFileSync(resolve(PUBLIC, 'og-craft.png'), await sharp(Buffer.from(ogImageSvg()), { density: 144 }).resize(1200, 630).png().toBuffer());

  console.log(`[gen-organic-logo] wrote ${Object.keys(logoSamples()).length} golden SVGs + favicon.svg/.ico, favicon-dark.png, apple-touch-icon.png, og-craft.png`);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });
