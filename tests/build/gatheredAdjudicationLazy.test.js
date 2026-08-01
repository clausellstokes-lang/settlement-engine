/**
 * tests/build/gatheredAdjudicationLazy.test.js — the lazy-leaf contract for THE
 * GATHERED ADJUDICATION SCREEN (realm directive 7 / J-D7, wave F).
 *
 * WHAT MUST STAY OFF THE OPEN PATH. `GatheredAdjudication.jsx` is a whole modal
 * surface — outcome cards, the address-chain machinery, the proposal read model —
 * that a realm running full auto-resolve NEVER opens, and that a manual realm
 * opens only on the advances that actually withhold a decision. WorldMapOverlays
 * mounts it through `lazy(() => import(...))`, so none of those bytes ride the map
 * surface's chunk until the first matter is actually withheld.
 *
 * THE SECOND ASSERTION (the VersionsTab lesson, 2026-07-27). The PARENT surface is
 * itself lazy: WorldMap is a lazy route (AppViews.jsx), and WorldMapOverlays is a
 * static part of its chunk. So an entry-closure check ALONE would pass even if the
 * screen were a plain STATIC import — the parent is already off the entry graph and
 * a static child would ride its chunk invisibly. This file therefore also asserts
 * the screen rides a DIFFERENT chunk from WorldMapOverlays, which is exactly the
 * property a static import destroys.
 *
 * THREE LAYERS, because a dist read alone is not enough:
 *   1. SOURCE CONTRACT (no build needed, runs every gate) — WorldMapOverlays mounts
 *      the screen through lazy() and holds no static edge to it. This is the layer
 *      that reds the moment someone "simplifies" the mount.
 *   2. DIST ABSENCE (ungated) — the screen's fingerprint is not in the entry's
 *      transitive static closure. Per the stale-dist policy an absence check can
 *      only UNDER-report against an old dist, so it never false-reds.
 *   3. DIST PRESENCE + SEPARATION (VERIFY_DIST=1 only) — the fingerprint exists and
 *      its chunk set is disjoint from the overlays'. These read the FRESH build's
 *      bytes, so they run only in the post-build re-run.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = process.cwd();
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

const OVERLAYS_SRC = resolve(ROOT, 'src/components/map/WorldMapOverlays.jsx');
const SCREEN_MODULE = './GatheredAdjudication.jsx';

// Reader-facing strings minted in exactly one source module each. String literals
// survive minification, so each is a stable fingerprint of its module. Picking a
// sentence the OTHER module cannot legitimately contain is the whole skill here.
const SCREEN_FINGERPRINT = 'The realm awaits your judgment';
const OVERLAYS_FINGERPRINT = 'Import this image as the map?';

/** Every `from './x.js'` / `from './x.jsx'` STATIC specifier in a source file. */
function sourceStaticSpecifiers(code) {
  const specs = new Set();
  for (const m of code.matchAll(/\bfrom\s*['"](\.\/[^'"]+)['"]/g)) specs.add(m[1]);
  return [...specs];
}

function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}

function entryStaticClosure() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  const seen = new Set([m[1]]);
  const queue = [m[1]];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return [...seen];
}

const chunksContaining = (literal) => readdirSync(assetsDir)
  .filter(f => f.endsWith('.js'))
  .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(literal));

describe('J-D7 — the gathered adjudication screen is a lazy leaf (source contract)', () => {
  const overlays = readFileSync(OVERLAYS_SRC, 'utf-8');
  const specs = sourceStaticSpecifiers(overlays);

  it('the scan is non-vacuous — WorldMapOverlays does hold static sibling edges', () => {
    // If this file ever stops finding the overlays' ordinary static imports, the
    // exclusion assertion below would be measuring nothing.
    expect(specs.length).toBeGreaterThan(1);
    expect(specs).toContain('./WorldMapTour.jsx');
    expect(specs).toContain('./WorldMapTourSteps.js');
  });

  it('the screen is mounted through lazy(), not a static import', () => {
    const escaped = SCREEN_MODULE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lazyMount = new RegExp(`lazy\\(\\s*\\(\\)\\s*=>\\s*import\\(['"]${escaped}['"]\\)\\s*\\)`);
    expect(
      lazyMount.test(overlays),
      `WorldMapOverlays must mount ${SCREEN_MODULE} as lazy(() => import('${SCREEN_MODULE}')). `
      + 'A static import folds the whole docket surface into the map chunk, which every '
      + 'realm session pays for whether or not it ever withholds a decision.',
    ).toBe(true);
    // The negative is anchored by a live sibling that travels the SAME import list
    // and would vanish under the same drift.
    expectAbsentWithAnchor(specs, SCREEN_MODULE, './WorldMapTour.jsx', 'WorldMapOverlays static imports');
  });

  it('the screen is mounted ONLY while open (no eager <GatheredAdjudication /> node)', () => {
    // A lazy() import that is rendered unconditionally still fetches its chunk on
    // every map mount. The open guard is what makes the seam pay.
    expect(overlays).toMatch(/gatheredDocket\?\.open\s*&&/);
  });

  it('each fingerprint is minted in exactly one source module', () => {
    // Anti-vacuity for the dist halves: a fingerprint that drifted out of the
    // source, or leaked into a second module, would make them meaningless.
    for (const fingerprint of [SCREEN_FINGERPRINT, OVERLAYS_FINGERPRINT]) {
      const hits = readdirSync(resolve(ROOT, 'src/components/map'))
        .filter(f => f.endsWith('.jsx') || f.endsWith('.js'))
        .filter(f => readFileSync(resolve(ROOT, 'src/components/map', f), 'utf-8').includes(fingerprint));
      expect(hits, `the fingerprint "${fingerprint}" must live in exactly one module`).toHaveLength(1);
    }
  });
});

describe.runIf(distExists)('J-D7 — the gathered adjudication screen is a lazy leaf (dist)', () => {
  it('the screen is ABSENT from the entry transitive static closure', () => {
    const leaked = entryStaticClosure()
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(SCREEN_FINGERPRINT));
    expect(
      leaked,
      `the gathered adjudication screen reached first paint via the static graph `
      + `(chunks: ${leaked.join(', ')}). It must stay behind the lazy() seam in WorldMapOverlays.jsx.`,
    ).toHaveLength(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)('anti-vacuity — the screen DOES exist in a lazy chunk', () => {
    expect(
      chunksContaining(SCREEN_FINGERPRINT).length,
      `the screen fingerprint "${SCREEN_FINGERPRINT}" is in NO dist chunk — did the copy change or the build skip it?`,
    ).toBeGreaterThan(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)('the screen rides its OWN chunk, not the map overlays', () => {
    // THE SECOND ASSERTION. The parent map surface is itself lazy, so the
    // entry-closure check above cannot tell a lazy child from a static one.
    // Chunk separation can.
    const screenChunks = new Set(chunksContaining(SCREEN_FINGERPRINT));
    const overlayChunks = new Set(chunksContaining(OVERLAYS_FINGERPRINT));
    expect(screenChunks.size, 'screen fingerprint missing from dist').toBeGreaterThan(0);
    expect(overlayChunks.size, 'overlays fingerprint missing from dist').toBeGreaterThan(0);
    const shared = [...screenChunks].filter(f => overlayChunks.has(f));
    expect(
      shared,
      `the gathered screen was folded into the map overlays chunk (${shared.join(', ')}) — `
      + 'the lazy() seam in WorldMapOverlays.jsx was replaced by a static import.',
    ).toHaveLength(0);
  });
});
