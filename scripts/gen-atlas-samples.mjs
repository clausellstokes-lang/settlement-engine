#!/usr/bin/env node
/**
 * scripts/gen-atlas-samples.mjs — SM-5 (4) THE ATLAS IDENTITY craft samples.
 *
 * Renders ONE representative v2 settlement under EVERY town-map lens, so the owner can
 * taste-veto the unified "one atlas" lens treatment in a single glance — and see the
 * new SM-5 ACCESSIBILITY lens beside the four base lenses. Deterministic (buildTownMapSvg
 * is a pure function of (model, style)); `docs/samples/atlas/` is byte-stable and
 * drift-guarded by tests/design/atlasSamples.test.js.
 *
 * Regenerate:  node scripts/gen-atlas-samples.mjs      (or: npm run gen:atlas-samples)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildTownMapModel } from '../src/domain/townMap/index.js';
import { buildTownMapSvg } from '../src/domain/townMap/townMapDraw.js';
import { TOWN_MAP_STYLE_IDS } from '../src/design/townMapStyles.js';
import { makeTownFixture } from '../tests/fixtures/townMapFixtures.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const ATLAS_DIR = resolve(ROOT, 'docs', 'samples', 'atlas');

/** The representative settlement (a rich coastal walled city ⇒ every layer is exercised). */
export function atlasSettlement() {
  return makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'atlas-city' });
}

/** filename → SVG string for every lens (the byte-stable atlas set). */
export function atlasSamples() {
  const model = buildTownMapModel(atlasSettlement(), { layoutLawVersion: 2 });
  /** @type {Record<string, string>} */
  const out = {};
  for (const lens of TOWN_MAP_STYLE_IDS) {
    out[`atlas-${lens}.svg`] = buildTownMapSvg(model, { style: lens, width: 512, height: 512 });
  }
  return out;
}

function main() {
  mkdirSync(ATLAS_DIR, { recursive: true });
  const samples = atlasSamples();
  for (const [name, svg] of Object.entries(samples)) {
    writeFileSync(resolve(ATLAS_DIR, name), `${svg}\n`);
  }
  console.log(`[gen-atlas-samples] wrote ${Object.keys(samples).length} lens samples to ${ATLAS_DIR}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
