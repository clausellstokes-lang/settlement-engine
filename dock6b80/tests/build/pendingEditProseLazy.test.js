/**
 * tests/build/pendingEditProseLazy.test.js — R-2 edit-prose lazy-leaf contract
 * (docs/CAPABILITY_REMEDIATION_PLAN.md, Wave R-2 MUST-FIX 4).
 *
 * The pending-edit prose admission/validation (domain/pendingEditIntents.js)
 * and the queue coordinator with the wired-path registry and commit bodies
 * (store/settlementPendingEdits.js) must stay OUT of the entry's first-paint
 * static closure. The designed EAGER residual is only the thin contract in
 * domain/pendingEdits.js — the COMMITTABLE_EDIT_KINDS member plus the
 * 'edit-prose' kind string (+13 B measured with isolated esbuild --minify) —
 * reached through the async facade store/settlementPendingEditActions.js,
 * whose dynamic import is the one seam that loads the coordinator chunk.
 *
 * Measured at pin time (vite production build): pendingEditIntents rides the
 * dossier-surface shared chunk (OutputContainer / PendingChangesBar /
 * SettlementWorkbench / DmScreen / tableClerk); settlementPendingEdits rides
 * its own chunk fetched at the queue/commit seam. If an eager module ever
 * statically imports either, this reds. Mirrors townMapLazy.test.js.
 *
 * Runs only when dist/ exists (post-build); the VERIFY_DIST=1 post-build
 * re-run enforces it against the fresh dist.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);

// Unique typed-refusal reason literals, each minted in exactly one source
// module. String literals survive minification, so each is a stable
// fingerprint of its module's presence in a chunk.
const FINGERPRINTS = [
  // store/settlementPendingEdits.js — QUEUE_WIRED_PROSE_PATHS + commit bodies.
  { module: 'store/settlementPendingEdits.js', literal: 'prose_path_deferred' },
  // domain/pendingEditIntents.js — the edit-prose payload admission.
  { module: 'domain/pendingEditIntents.js', literal: 'prose_entity_kind_invalid' },
];

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

describe.runIf(distExists)('R-2 — edit-prose admission/commit bodies stay off first paint', () => {
  for (const { module, literal } of FINGERPRINTS) {
    it(`${module} fingerprint is ABSENT from the entry transitive static closure`, () => {
      const { files } = entryStaticClosure();
      const leaked = files.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(literal));
      expect(
        leaked,
        `${module} reached first paint via the static graph (chunks: ${leaked.join(', ')}). `
        + 'The pending-edit spine loads it through the settlementPendingEditActions.js '
        + `dynamic-import seam; restore that seam. Closure:\n  ${files.join('\n  ')}`,
      ).toHaveLength(0);
    });

    it.skipIf(!process.env.VERIFY_DIST)(`anti-vacuity — the ${module} fingerprint DOES exist in a lazy chunk`, () => {
      // VERIFY_DIST-gated (merge-integration lesson, 2026-07-15): under plain
      // `npm run test` the dist on disk may PREDATE the current tree. The
      // absence half stays ungated (a stale dist can only under-report
      // absence); the PRESENCE half needs the fresh build verify:dist makes.
      const all = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
      const present = all.some((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(literal));
      expect(
        present,
        `${module} fingerprint "${literal}" not found in ANY dist chunk — did the refusal reason move or the build skip it?`,
      ).toBe(true);
    });
  }
});
