/**
 * tests/build/townMapLazy.test.js — SM-2 first-paint lazy contract.
 *
 * The town-map VIEWER (SettlementMapPane) and the MODEL it renders
 * (buildTownMapModel + src/domain/townMap/**) must stay OUT of the entry's
 * first-paint static closure. They are reached only through the lazy detail
 * surface — the map chunk (or the settlements chunk carrying it) is fetched when
 * the user picks the Map segment, never up front. This mirrors the vendor-pdf /
 * engine lazy contracts in vendorPdfLazy.test.js.
 *
 * The load-bearing assertion is OPTION-AGNOSTIC: the town-map model stamps a
 * unique STRING LITERAL fork key (`::town-map:v1`) that survives minification, so
 * a BFS of the entry's transitive static closure must never contain it — whether
 * the pane rides its own lazy chunk (design Option A) or the already-lazy
 * settlements chunk (Option B). If an eager module ever statically imports the
 * pane or the model, this reds.
 *
 * Runs only when dist/ exists (post-build), like the sibling contracts; the
 * VERIFY_DIST=1 post-build re-run enforces it against the fresh dist.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

// The unique fork-key literal minted in src/domain/townMap/townMapModel.js. A
// string literal is never mangled by the minifier, so it is a stable fingerprint
// of the town-map model's presence in a chunk.
const TOWN_MAP_FINGERPRINT = '::town-map:v1';

function staticImportSpecifiers(code) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(code)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}

function findEntryChunk() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  return m[1];
}

function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticImportSpecifiers(code)) {
      if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
    }
  }
  return { entry, files: [...seen] };
}

describe.runIf(distExists)('SM-2 — town-map viewer stays off first paint', () => {
  it('the town-map model fingerprint is ABSENT from the entry transitive static closure', () => {
    const { files } = entryStaticClosure();
    const leaked = files.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(TOWN_MAP_FINGERPRINT));
    expect(
      leaked,
      `the town-map model reached first paint via the static graph (chunks: ${leaked.join(', ')}). Closure:\n  ${files.join('\n  ')}`,
    ).toHaveLength(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)('anti-vacuity — the fingerprint DOES exist somewhere in dist (a lazy chunk)', () => {
    // VERIFY_DIST-gated (merge-integration lesson, 2026-07-15): under plain `npm run test`
    // the dist on disk may PREDATE the current tree (the triple-merge gate asserted this
    // test against a dist built before SM-2 merged — false red). The absence half stays
    // ungated (a stale dist can only under-report absence); the PRESENCE half needs a
    // fresh build, which verify:dist guarantees.
    const all = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
    const present = all.some((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(TOWN_MAP_FINGERPRINT));
    expect(present, 'town-map model fingerprint not found in ANY dist chunk — did the model change or the build skip it?').toBe(true);
  });

  it('if the pane rides its own chunk (Option A), that chunk is absent from the entry closure', () => {
    const paneChunks = readdirSync(assetsDir).filter((f) => /^SettlementMapPane-[A-Za-z0-9_-]+\.js$/.test(f));
    // Option B mints no distinct pane chunk — nothing to assert then (the
    // fingerprint test above already covers it). Option A: assert absence.
    if (paneChunks.length === 0) {
      expect(paneChunks).toHaveLength(0); // trivially green — documents Option B
      return;
    }
    const { files } = entryStaticClosure();
    const leaked = paneChunks.filter((c) => files.includes(c));
    expect(
      leaked,
      `a town-map pane chunk reached first paint via the static graph: ${leaked.join(', ')}`,
    ).toHaveLength(0);
  });
});
