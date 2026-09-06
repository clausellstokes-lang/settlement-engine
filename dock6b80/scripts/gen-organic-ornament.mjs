#!/usr/bin/env node
/**
 * scripts/gen-organic-ornament.mjs — THE SEEDED-ORNAMENT GOLDEN FAMILY (law §5/§8).
 *
 * Renders the vetted ornament library to byte-stable SVGs so the owner can
 * taste-veto the marks in a single glance AND so a DELIBERATE library change is
 * caught as a declared golden shift. The builders are pure functions of
 * (seed, palette), so a fresh render must byte-match the committed files. This IS
 * the new golden family the wave mints: a library change reds
 * tests/design/organicOrnament.test.js and is re-minted here WITH a stated cause.
 *
 * Regenerate:  node scripts/gen-organic-ornament.mjs   (or: npm run gen:organic-ornament)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { EMBLEMS, CORNER_PIECES, CARTOUCHE_FRAMES } from '../src/design/organic/ornament/pools.js';
import { emblemForKind, cartouche, compassRose } from '../src/design/organic/ornament/compose.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const ORNAMENT_DIR = resolve(ROOT, 'docs', 'samples', 'organic-craft', 'ornament');

// Representative settlement seeds — distinct names ⇒ distinct seeded composition,
// proving per-settlement uniqueness with provenance.
export const CARTOUCHE_SEEDS = Object.freeze(['Thornwall', 'Redwater Ford', 'Kingsbarrow', 'Ashen Reach']);

/** filename → SVG string for the whole byte-stable ornament set. */
export function ornamentSamples() {
  /** @type {Record<string,string>} */
  const out = {};
  // The emblem pool — one mark per kind (the world-biased selection).
  for (const e of EMBLEMS) out[`emblem-${e.kind}.svg`] = emblemForKind(e.kind, { size: 48 });
  // Seeded cartouches — per-settlement uniqueness (light) + one dim-mode proof.
  for (const seed of CARTOUCHE_SEEDS) out[`cartouche-${slug(seed)}.svg`] = cartouche(seed, { width: 320, height: 96 });
  out['cartouche-thornwall-field.svg'] = cartouche('Thornwall', { mode: 'field', width: 320, height: 96 });
  out['emblem-mine-field.svg'] = emblemForKind('mine', { mode: 'field', size: 48 });
  // The house compass rose — the one canonical signature (light + field).
  out['compass-rose.svg'] = compassRose({ size: 64 });
  out['compass-rose-field.svg'] = compassRose({ mode: 'field', size: 64 });
  return out;
}

function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

/** The library sizes, exported so the test can pin the pool counts. */
export const POOL_SIZES = Object.freeze({
  emblems: EMBLEMS.length,
  corners: CORNER_PIECES.length,
  frames: CARTOUCHE_FRAMES.length,
});

function main() {
  mkdirSync(ORNAMENT_DIR, { recursive: true });
  const samples = ornamentSamples();
  for (const [name, svg] of Object.entries(samples)) writeFileSync(resolve(ORNAMENT_DIR, name), `${svg}\n`);
  console.log(`[gen-organic-ornament] wrote ${Object.keys(samples).length} ornament samples to ${ORNAMENT_DIR}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
