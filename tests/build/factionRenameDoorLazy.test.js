/**
 * tests/build/factionRenameDoorLazy.test.js — the faction-rename door's
 * lazy-leaf contract (owner queue #14).
 *
 * WHAT MUST STAY OFF FIRST PAINT. `WorkbenchFactionRename.jsx` is the rename
 * control inside the Workbench Entity Inspector. It is mounted through a
 * `lazy(() => import(...))` sibling of `WorkbenchProseEditor`, so it must never
 * appear in the entry's transitive STATIC closure.
 *
 * THE SECOND ASSERTION (VersionsTab lesson, 2026-07-27): when the PARENT surface
 * is itself lazy, an entry-closure check alone passes even if the child were a
 * plain static import of the parent, because the parent is already off the entry
 * graph. So this file also asserts the child rides a DIFFERENT chunk from the
 * Workbench body — the property a static import would destroy.
 *
 * THE CASCADE IS NO LONGER EAGER (2026-07-28 — this header used to say the
 * opposite, and that claim is retired, not merely reworded). `src/domain/
 * factionRename.js` did ride the first-paint closure, on the reasoning that
 * `settlementSlice` → `settlementRenameHelpers` → the cascade is a store-eager
 * chain and the store is eager by construction. Measurement overruled the
 * reasoning: the "dependency-light pure leaf" was 8,574 B minified, and the
 * first-paint ratchet went over budget. `renameFactionImpl` now fetches the
 * cascade at its own call seam (the settlementSlice loadEngine / setPrimaryDeity
 * idiom) and `settlementRenameHelpers` carries no static edge to it, so the
 * cascade rides the lazy side with the DOOR this file measures. The remaining
 * static importers are all lazy-chunk residents and may keep their static edges
 * (settlementPendingEdits, itself dynamic-imported; components/settlements/
 * helpers, reached only from lazy library surfaces).
 *
 * The byte guard for all of that is the first-paint closure ratchet in
 * tests/build/vendorPdfLazy.test.js; this file still measures only the DOOR.
 *
 * Runs only when dist/ exists (post-build); the VERIFY_DIST=1 post-build re-run
 * enforces the presence half against the fresh dist.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

// A unique reader-facing string minted in exactly one source module each. String
// literals survive minification, so each is a stable fingerprint of its module.
const DOOR = 'Rename this faction';
// The Workbench body's own fingerprint. NOT 'Change Dock': the door's success
// note says "Commit it from the Change Dock.", so that literal is in BOTH
// modules and the separation assertion below would red on its own copy. Picking
// a fingerprint the other module cannot legitimately contain is the whole skill
// of this test shape.
const WORKBENCH_BODY = 'Undo last batch';

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

describe.runIf(distExists)('owner queue #14 — the faction-rename door is a lazy leaf', () => {
  it('the door is ABSENT from the entry transitive static closure', () => {
    const files = entryStaticClosure();
    const leaked = files.filter(f => readFileSync(join(assetsDir, f), 'utf-8').includes(DOOR));
    expect(
      leaked,
      `WorkbenchFactionRename reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
      + 'It must stay behind the lazy() seam in SettlementWorkbench.jsx.',
    ).toHaveLength(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)('anti-vacuity — the door DOES exist in a lazy chunk', () => {
    // VERIFY_DIST-gated: under plain `npm run test` the dist on disk may predate
    // the tree, and a stale dist can only under-report the absence half above.
    expect(
      chunksContaining(DOOR).length,
      `the door fingerprint "${DOOR}" is in NO dist chunk — did the copy change or the build skip it?`,
    ).toBeGreaterThan(0);
  });

  it.skipIf(!process.env.VERIFY_DIST)('the door rides its OWN chunk, not the Workbench body', () => {
    // The parent Workbench is itself lazy, so the entry-closure check above
    // cannot tell a lazy child from a static one. Chunk separation can.
    const doorChunks = new Set(chunksContaining(DOOR));
    const bodyChunks = new Set(chunksContaining(WORKBENCH_BODY));
    expect(doorChunks.size, 'door fingerprint missing from dist').toBeGreaterThan(0);
    expect(bodyChunks.size, 'Workbench body fingerprint missing from dist').toBeGreaterThan(0);
    const shared = [...doorChunks].filter(f => bodyChunks.has(f));
    expect(
      shared,
      `the rename control was folded into the Workbench body chunk (${shared.join(', ')}) — `
      + 'the lazy() seam in SettlementWorkbench.jsx was replaced by a static import.',
    ).toHaveLength(0);
  });
});
