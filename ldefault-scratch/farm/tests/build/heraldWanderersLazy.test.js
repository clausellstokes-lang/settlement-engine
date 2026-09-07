/**
 * tests/build/heraldWanderersLazy.test.js — the lazy-leaf contract for the Herald's
 * WANDERERS register (design DESIGN_NPC_CONSEQUENCES.md §8, wave W-H4).
 *
 * WHAT MUST STAY OFF THE OPEN PATH. `HeraldWanderers.jsx` is a whole Herald page most
 * sessions never turn to, and it is the heaviest of the three registers: behind it sit
 * the wanderer read model, the audience projection, the world NPC ledger and its facet
 * bank, plus the DM verb controls. HeraldBody mounts it through
 * `lazy(() => import(...))`, so none of that reaches the inspector chunk until the GM
 * asks for that page.
 *
 * THE SECOND ASSERTION (the VersionsTab lesson, 2026-07-27; the same shape
 * heraldRegisterDoorsLazy.test.js carries). The PARENT surface here is ITSELF lazy:
 * RealmInspector is a lazy route surface, so an entry-closure check alone would pass
 * even if this door were a plain STATIC import of HeraldBody — the parent is already off
 * the entry graph, and a static child would simply ride its chunk invisibly. So this
 * file also asserts the door rides a DIFFERENT chunk from the Herald body, which is
 * exactly the property a static import destroys.
 *
 * THE GATE READER IS DELIBERATELY NOT THE READ MODEL. RealmInspector needs to know
 * whether to offer the tab at all, and it asks `npcConsequencesActive` (the ledger's own
 * canonical accessor) rather than `wanderersDoorOpen` from the read model. A static edge
 * from the chrome to heraldWanderers.js would fold the whole register into the inspector
 * chunk and quietly undo this pin, so layer 1 asserts that edge does not exist.
 *
 * THREE LAYERS, because a dist read alone is not enough:
 *   1. SOURCE CONTRACT (no build needed, runs every gate) — HeraldBody mounts the door
 *      through lazy() and holds no static edge to it, and RealmInspector holds no static
 *      edge to the read model. This is the layer that reds the moment someone
 *      "simplifies" the mount, months before anyone next reads a dist.
 *   2. DIST ABSENCE (ungated) — the door's fingerprint is not in the entry's transitive
 *      static closure. Per the stale-dist policy (see tests/build/vendorPdfLazy.test.js)
 *      an absence check can only UNDER-report against an old dist, so it never
 *      false-reds.
 *   3. DIST PRESENCE + SEPARATION (VERIFY_DIST=1 only) — the fingerprint exists, and the
 *      door's chunk set is disjoint from the Herald body's. These read the FRESH build's
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

const HERALD_BODY_SRC = resolve(ROOT, 'src/components/map/HeraldBody.jsx');
const REALM_INSPECTOR_SRC = resolve(ROOT, 'src/components/map/RealmInspector.jsx');

// A unique reader-facing string minted in exactly one source module. String literals
// survive minification, so it is a stable fingerprint of its module. Picking a sentence
// the OTHER modules cannot legitimately contain is the whole skill of this test shape.
const WANDERERS_DOOR = 'Nobody wanders this realm. Every name it knows still has a roof and a place to stand.';
// The Herald body's own fingerprint (PeacetimeNote) — minted only in HeraldBody.jsx.
const HERALD_BODY = 'The realm is at peace. No sieges, deployments, or trade wars are live.';

const MODULE = './HeraldWanderers.jsx';

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

describe('W-H4 — the Wanderers door is a lazy leaf (source contract)', () => {
  const body = readFileSync(HERALD_BODY_SRC, 'utf-8');
  const specs = sourceStaticSpecifiers(body);

  it('the scan is non-vacuous — HeraldBody does hold static sibling edges', () => {
    // If this file ever stops finding HeraldBody's ordinary static imports, the
    // exclusion assertions below would be measuring nothing.
    expect(specs.length).toBeGreaterThan(5);
    expect(specs).toContain('./HeraldSection.jsx');
  });

  it(`${MODULE} is mounted through lazy(), not a static import`, () => {
    const escaped = MODULE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const lazyMount = new RegExp(`lazy\\(\\s*\\(\\)\\s*=>\\s*import\\(['"]${escaped}['"]\\)\\s*\\)`);
    expect(
      lazyMount.test(body),
      `HeraldBody must mount ${MODULE} as lazy(() => import('${MODULE}')). A static import `
      + 'folds the register, the audience projection, the world NPC ledger and the DM verb '
      + 'controls into the inspector chunk, which every Herald session pays for whether or '
      + 'not the GM turns to that page.',
    ).toBe(true);
    // The negative is anchored by a live sibling that travels the SAME import list and
    // would vanish under the same drift.
    expectAbsentWithAnchor(specs, MODULE, './HeraldSection.jsx', 'HeraldBody static imports');
  });

  it('the chrome reads the ENGINE gate, never the read model (the tab-gate seam)', () => {
    const chrome = readFileSync(REALM_INSPECTOR_SRC, 'utf-8');
    const chromeSpecs = sourceStaticSpecifiers(chrome);
    expect(
      chrome.includes("from '../../domain/worldPulse/npcLedger.js'"),
      'RealmInspector must read npcConsequencesActive from the ledger\'s own module, so the '
      + 'tab gate cannot drift from the engine.',
    ).toBe(true);
    // A static edge from the chrome to the read model would drag the whole register into
    // the inspector chunk and silently defeat the lazy seam above. Anchored by a sibling
    // register module the chrome legitimately DOES import.
    expectAbsentWithAnchor(chromeSpecs, './heraldWanderers.js', './heraldFeed.js', 'RealmInspector static imports');
    expectAbsentWithAnchor(chromeSpecs, './HeraldWanderers.jsx', './heraldFeed.js', 'RealmInspector static imports');
  });

  it(`${MODULE}'s fingerprint is minted in exactly one source module`, () => {
    // Anti-vacuity for the dist halves: a fingerprint that drifted out of the source, or
    // leaked into a second module, would make them meaningless.
    const hits = readdirSync(resolve(ROOT, 'src/components/map'))
      .filter(f => readFileSync(resolve(ROOT, 'src/components/map', f), 'utf-8').includes(WANDERERS_DOOR));
    expect(hits, `the fingerprint "${WANDERERS_DOOR}" must live in exactly one module`).toHaveLength(1);
  });
});

describe.runIf(distExists)('W-H4 — the Wanderers door is a lazy leaf (dist)', () => {
  it(`${MODULE} is ABSENT from the entry transitive static closure`, () => {
    const leaked = entryStaticClosure()
      .filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(WANDERERS_DOOR));
    expect(
      leaked,
      `${MODULE} reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
      + 'It must stay behind the lazy() seam in HeraldBody.jsx.',
    ).toHaveLength(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)(`anti-vacuity — ${MODULE} DOES exist in a lazy chunk`, () => {
    expect(
      chunksContaining(WANDERERS_DOOR).length,
      `the door fingerprint "${WANDERERS_DOOR}" is in NO dist chunk — did the copy change or the build skip it?`,
    ).toBeGreaterThan(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)(`${MODULE} rides its OWN chunk, not the Herald body`, () => {
    // THE SECOND ASSERTION. The parent Herald surface is itself lazy, so the
    // entry-closure check above cannot tell a lazy child from a static one. Chunk
    // separation can.
    const doorChunks = new Set(chunksContaining(WANDERERS_DOOR));
    const bodyChunks = new Set(chunksContaining(HERALD_BODY));
    expect(doorChunks.size, `${MODULE} fingerprint missing from dist`).toBeGreaterThan(0);
    expect(bodyChunks.size, 'Herald body fingerprint missing from dist').toBeGreaterThan(0);
    const shared = [...doorChunks].filter(f => bodyChunks.has(f));
    expect(
      shared,
      `${MODULE} was folded into the Herald body chunk (${shared.join(', ')}) — the lazy() `
      + 'seam in HeraldBody.jsx was replaced by a static import.',
    ).toHaveLength(0);
  });
});
