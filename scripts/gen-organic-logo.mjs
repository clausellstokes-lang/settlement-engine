#!/usr/bin/env node
/**
 * scripts/gen-organic-logo.mjs — THE HOUSE DEVICE's GOLDEN SVG SET.
 *
 * THE DEVICE NO LONGER DRESSES THE PRODUCT (owner order 2026-09-19, ODQ §934.17).
 * Every shipped icon and share card is now a cut of the owner's arrow painting, made
 * by scripts/derive-brand-marks.mjs — one object seen at several sizes rather than a
 * geometric redraw beside a painting. This script used to rasterise the device into
 * public/favicon.svg, favicon.ico, favicon-dark.png, apple-touch-icon.png and
 * og-craft.png; those five writes are gone, the first three files with them, and the
 * last two are the derive script's now. Nothing here touches public/ any more, which
 * is what keeps ONE generator per shipped asset.
 *
 * What survives is the documentation set — the device as the 2026-07-18 mark, drawn
 * from src/design/organic/logo.js, byte-stable, drift-guarded by
 * tests/design/organicLogo.test.js:
 *
 *   docs/samples/organic-craft/logo/device-{light,dark,one-ink}.svg
 *   docs/samples/organic-craft/logo/device-heavy-{light,dark}.svg
 *
 * The device is still LIVE in the dossier: src/pdf/primitives/HouseDeviceSeal.jsx and
 * HouseCountersealSeal.jsx strike it as the charter's vector mark, and this file is
 * where its drawn form is proved not to have drifted.
 *
 * Regenerate: node scripts/gen-organic-logo.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { houseDevice } from '../src/design/organic/logo.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const LOGO_DIR = resolve(ROOT, 'docs', 'samples', 'organic-craft', 'logo');

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

function main() {
  mkdirSync(LOGO_DIR, { recursive: true });
  for (const [name, svg] of Object.entries(logoSamples())) {
    writeFileSync(resolve(LOGO_DIR, name), `${svg}\n`);
  }
  console.log(`[gen-organic-logo] wrote ${Object.keys(logoSamples()).length} golden SVGs`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
