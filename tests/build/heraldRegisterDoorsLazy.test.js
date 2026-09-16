/**
 * tests/build/heraldRegisterDoorsLazy.test.js — the lazy-leaf contract for the
 * Herald's two REGISTER doors (owner directive 5 / J-D5, wave W-C).
 *
 * WHAT MUST STAY OFF THE OPEN PATH. `HeraldGazetteer.jsx` and
 * `HeraldRemembrance.jsx` are whole Herald pages most sessions never turn to.
 * HeraldBody mounts each through `lazy(() => import(...))`, so their bodies and
 * the `heraldRegister` read model behind them stay out of the inspector chunk
 * until the GM asks for that page.
 *
 * THE SECOND ASSERTION (the VersionsTab lesson, 2026-07-27). The PARENT surface
 * here is itself lazy: RealmInspector is a lazy route surface, so an entry-
 * closure check alone would pass even if these doors were plain STATIC imports
 * of HeraldBody — the parent is already off the entry graph, and a static child
 * would simply ride its chunk invisibly. So this file also asserts each door
 * rides a DIFFERENT chunk from the Herald body, which is exactly the property a
 * static import destroys.
 *
 * THREE LAYERS, because a dist read alone is not enough:
 *   1. SOURCE CONTRACT (no build needed, runs every gate) — HeraldBody mounts
 *      both doors through lazy() and holds no static edge to either. This is the
 *      layer that reds the moment someone "simplifies" the mount, months before
 *      anyone next reads a dist.
 *   2. DIST ABSENCE (ungated) — neither door's fingerprint is in the entry's
 *      transitive static closure. Per the stale-dist policy (see
 *      tests/build/vendorPdfLazy.test.js) an absence check can only UNDER-report
 *      against an old dist, so it never false-reds.
 *   3. DIST PRESENCE + SEPARATION (VERIFY_DIST=1 only) — the fingerprints exist,
 *      and each door's chunk set is disjoint from the Herald body's. These read
 *      the FRESH build's bytes, so they run only in the post-build re-run.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = process.cwd();
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

const HERALD_BODY_SRC = resolve(ROOT, 'src/components/map/HeraldBody.jsx');

// A unique reader-facing string minted in exactly one source module each. String
// literals survive minification, so each is a stable fingerprint of its module.
// Picking a sentence the OTHER modules cannot legitimately contain is the whole
// skill of this test shape.
const GAZETTEER_DOOR = 'Place one on the map and it enters the register.';
const REMEMBRANCE_DOOR = 'This realm is young, and every settlement it has raised still stands.';
// The Herald body's own fingerprint (PeacetimeNote) — minted only in HeraldBody.jsx.
const HERALD_BODY = 'The realm is at peace. No sieges, deployments, or trade wars are live.';

const DOORS = Object.freeze([
  { module: './HeraldGazetteer.jsx', fingerprint: GAZETTEER_DOOR },
  { module: './HeraldRemembrance.jsx', fingerprint: REMEMBRANCE_DOOR },
]);

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

describe('W-C — the Herald register doors are lazy leaves (source contract)', () => {
  const body = readFileSync(HERALD_BODY_SRC, 'utf-8');
  const specs = sourceStaticSpecifiers(body);

  it('the scan is non-vacuous — HeraldBody does hold static sibling edges', () => {
    // If this file ever stops finding HeraldBody's ordinary static imports, the
    // exclusion assertions below would be measuring nothing.
    expect(specs.length).toBeGreaterThan(5);
    expect(specs).toContain('./HeraldSection.jsx');
  });

  for (const { module, fingerprint } of DOORS) {
    it(`${module} is mounted through lazy(), not a static import`, () => {
      const escaped = module.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const lazyMount = new RegExp(`lazy\\(\\s*\\(\\)\\s*=>\\s*import\\(['"]${escaped}['"]\\)\\s*\\)`);
      expect(
        lazyMount.test(body),
        `HeraldBody must mount ${module} as lazy(() => import('${module}')). `
        + 'A static import folds the whole door into the inspector chunk, which every '
        + 'Herald session pays for whether or not the GM turns to that page.',
      ).toBe(true);
      // The negative is anchored by a live sibling that travels the SAME import
      // list and would vanish under the same drift.
      expectAbsentWithAnchor(specs, module, './HeraldSection.jsx', `HeraldBody static imports (${module})`);
    });

    it(`${module}'s fingerprint is minted in exactly one source module`, () => {
      // Anti-vacuity for the dist halves: a fingerprint that drifted out of the
      // source, or leaked into a second module, would make them meaningless.
      const hits = readdirSync(resolve(ROOT, 'src/components/map'))
        .filter(f => readFileSync(resolve(ROOT, 'src/components/map', f), 'utf-8').includes(fingerprint));
      expect(hits, `the fingerprint "${fingerprint}" must live in exactly one module`).toHaveLength(1);
    });
  }
});

describe.runIf(distExists)('W-C — the Herald register doors are lazy leaves (dist)', () => {
  for (const { module, fingerprint } of DOORS) {
    it(`${module} is ABSENT from the entry transitive static closure`, () => {
      const leaked = entryStaticClosure()
        .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(fingerprint));
      expect(
        leaked,
        `${module} reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
        + 'It must stay behind the lazy() seam in HeraldBody.jsx.',
      ).toHaveLength(0);
    });

    it.skipIf(!process.env.VERIFY_DIST)(`anti-vacuity — ${module} DOES exist in a lazy chunk`, () => {
      expect(
        chunksContaining(fingerprint).length,
        `the door fingerprint "${fingerprint}" is in NO dist chunk — did the copy change or the build skip it?`,
      ).toBeGreaterThan(0);
    });

    it.skipIf(!process.env.VERIFY_DIST)(`${module} rides its OWN chunk, not the Herald body`, () => {
      // THE SECOND ASSERTION. The parent Herald surface is itself lazy, so the
      // entry-closure check above cannot tell a lazy child from a static one.
      // Chunk separation can.
      const doorChunks = new Set(chunksContaining(fingerprint));
      const bodyChunks = new Set(chunksContaining(HERALD_BODY));
      expect(doorChunks.size, `${module} fingerprint missing from dist`).toBeGreaterThan(0);
      expect(bodyChunks.size, 'Herald body fingerprint missing from dist').toBeGreaterThan(0);
      const shared = [...doorChunks].filter(f => bodyChunks.has(f));
      expect(
        shared,
        `${module} was folded into the Herald body chunk (${shared.join(', ')}) — `
        + 'the lazy() seam in HeraldBody.jsx was replaced by a static import.',
      ).toHaveLength(0);
    });
  }
});
