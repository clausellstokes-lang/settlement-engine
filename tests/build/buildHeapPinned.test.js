/**
 * buildHeapPinned.test.js — THE PRODUCTION BUILD CARRIES ITS OWN HEAP (CI-FIT, 2026-11-10).
 *
 * WHAT IS BEING GUARDED. At lane/integration-2026-11-07 5c4abaa95 the build no longer fits Node's
 * default heap. On a 16 GB machine Node 22.23.4's default `heap_size_limit` is 2,096 MB, as a hosted
 * runner's is. Measured there:
 *   - A bare `npx vite build` exits 134 ("FATAL ERROR: Reached heap limit Allocation failed - JavaScript
 *     heap out of memory"), twice in two runs, after ~32 s.
 *   - A GC-traced run peaked at 1,954 MB after a full mark-compact, against that 2,096 MB limit.
 *   - The build is therefore at the edge, not over it by a margin: one `npm run build` passed. The
 *     chair measured the same exit 134 after ~49 s. Master's smaller build still fit, in 37 s in CI.
 *
 * WHERE THE HEAP LIVES. ONE home: the `build` script itself, which runs Vite's own bin through
 * `node --max-old-space-size=4096`. Every caller inherits it from there:
 *   - ci.yml's "Gate / build and dist" `npm run build`.
 *   - the performance job's `npm run build -- --mode e2e` (npm appends the args to the node command,
 *     so the mode still reaches Vite).
 *   - `test:e2e:performance`.
 *   - the `build` step of `npm run check`, which the pre-push hook runs.
 * The flag form, rather than `NODE_OPTIONS=… vite build`, is chosen because it does not depend on the
 * shell: an inline environment assignment is POSIX-shell syntax, while npm runs scripts through cmd.exe
 * on Windows. vercel.json's buildCommand and the dist gate's own flagged build
 * (scripts/check-test-ratchet.mjs) already set 4096 and are left as they are. The dist the flag form
 * emits was measured byte-identical (1,484 files, sha256) to a build with
 * NODE_OPTIONS=--max-old-space-size=4096 set by hand.
 *
 * WHAT WOULD RED IT. The script losing the flag, a heap below 4096, or the build no longer going
 * through `node` (a bare `vite build` runs on the default heap again).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const scripts = JSON.parse(readFileSync(`${ROOT}package.json`, 'utf8')).scripts;

describe('the production build carries an explicit heap', () => {
  it('`npm run build` runs Vite through node with --max-old-space-size of at least 4096', () => {
    const build = String(scripts.build ?? '');
    expect(build).toMatch(/^node --max-old-space-size=\d+ node_modules\/vite\/bin\/vite\.js build$/);
    const heap = Number(build.match(/--max-old-space-size=(\d+)/)?.[1]);
    expect(heap).toBeGreaterThanOrEqual(4096);
  });

  it('the performance build still reaches Vite through the same script', () => {
    expect(scripts['test:e2e:performance']).toMatch(/^npm run build -- --mode e2e && /);
  });
});
