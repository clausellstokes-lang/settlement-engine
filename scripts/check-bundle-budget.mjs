/**
 * check-bundle-budget.mjs — a hard first-paint bundle ceiling (review R6).
 *
 * The gate had no performance-regression budget: a stray heavy import (or a
 * dynamic-import that accidentally becomes static) could re-bloat the initial
 * JS payload silently, and Vite's chunkSizeWarningLimit only WARNS. This runs
 * after `vite build` (wired into the `build` npm script) and FAILS the build if
 * the first-paint JS exceeds its ceiling.
 *
 * "First-paint" = exactly the JS `dist/index.html` loads up front (the entry +
 * its modulepreloaded vendor/data chunks) — NOT the lazy chunks (engine, PDF,
 * feature panels) that load on demand. Ceilings sit ~13-15% above the measured
 * size: tight enough to catch a real regression, loose enough not to flake on
 * normal churn. Bump them CONSCIOUSLY (in the diff) when a payload grows for a
 * real reason.
 */

import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '../dist');

// Ceilings in KiB. Measured 2026-07 (entry 835, initial total 1675).
const ENTRY_MAX_KB = 960;
const INITIAL_TOTAL_MAX_KB = 1900;

// Chunks that vite.config.js deliberately gates behind user action and strips from
// modulepreload (vendor-pdf ~614 KB gz, engine ~213 KB gz). The total ceiling would
// eventually catch a leak, but only as an opaque "total too big". This names the
// specific regression: a stray STATIC import pulling a deliberately-lazy chunk into
// the first-paint graph. Keeping this list in lockstep with the manualChunks names in
// vite.config.js is the point — if you intentionally make one of these eager, delete
// it here in the same diff.
const MUST_STAY_LAZY = /^(vendor-pdf|engine)-[A-Za-z0-9_-]+\.js$/;

/**
 * First-paint refs that are one of the deliberately-lazy chunks (a regression: the
 * chunk leaked into index.html's up-front <script>/modulepreload set). Pure + exported
 * so a unit test can prove the guard is non-vacuous. @param {string[]} refs
 */
export function lazyChunkLeaks(refs) {
  return refs.filter((r) => MUST_STAY_LAZY.test(r));
}

function kib(bytes) { return Math.round(bytes / 1024); }

function main() {
  let html;
  try {
    html = readFileSync(join(DIST, 'index.html'), 'utf8');
  } catch {
    console.error('[bundle-budget] dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  // Every JS asset index.html references up front (entry <script> + modulepreload).
  const refs = [...new Set([...html.matchAll(/assets\/([^"']+\.js)/g)].map((m) => m[1]))];
  if (refs.length === 0) {
    console.error('[bundle-budget] no JS assets referenced in index.html — parse or build error.');
    process.exit(1);
  }

  let total = 0;
  let entryBytes = 0;
  for (const r of refs) {
    const bytes = statSync(join(DIST, 'assets', r)).size;
    total += bytes;
    if (/^index-/.test(r)) entryBytes = bytes;
  }

  const failures = [];
  if (kib(entryBytes) > ENTRY_MAX_KB) {
    failures.push(`entry chunk ${kib(entryBytes)}KB > ${ENTRY_MAX_KB}KB ceiling`);
  }
  if (kib(total) > INITIAL_TOTAL_MAX_KB) {
    failures.push(`first-paint JS total ${kib(total)}KB > ${INITIAL_TOTAL_MAX_KB}KB ceiling`);
  }
  const leaks = lazyChunkLeaks(refs);
  if (leaks.length) {
    failures.push(
      `deliberately-lazy chunk(s) leaked into first paint: ${leaks.join(', ')} — a static ` +
      `import reached a chunk vite.config.js gates behind user action (the PDF/engine payload)`,
    );
  }

  if (failures.length) {
    console.error(
      `[bundle-budget] FAIL — first-paint bundle over budget:\n  - ${failures.join('\n  - ')}\n` +
      `  A stray static import likely bloated first paint. Code-split it (dynamic import),\n` +
      `  or bump the ceiling in scripts/check-bundle-budget.mjs if the growth is intended.`,
    );
    process.exit(1);
  }
  console.log(`[bundle-budget] OK — entry ${kib(entryBytes)}KB / ${ENTRY_MAX_KB}KB, first-paint total ${kib(total)}KB / ${INITIAL_TOTAL_MAX_KB}KB, no lazy-chunk leak.`);
}

// Run only when invoked as a script; the exported helper stays side-effect-free on import.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
