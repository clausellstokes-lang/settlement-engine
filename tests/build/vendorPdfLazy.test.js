/**
 * tests/build/vendorPdfLazy.test.js — Tier 9.7 vendor-pdf lazy verification.
 *
 * The @react-pdf/renderer + jsPDF stack weighs ~1.86 MB (~619 kB gz).
 * It must NOT load on first paint — only when a user clicks "Export
 * PDF". Three contracts make that real:
 *
 *   1. The vite.config.js manualChunks function isolates the PDF
 *      stack into a chunk named "vendor-pdf-*".
 *   2. The modulePreload filter excludes that chunk from <link rel=
 *      "modulepreload"> emission so the browser doesn't pre-fetch it.
 *   3. The components that actually export PDFs use dynamic `import()`
 *      instead of static `import` so the lazy chain stays intact.
 *
 * This test verifies all three by reading the built dist/ output and
 * grepping the bundle graph.
 *
 * VACUITY HAZARD (review #1): the dist/ suite below is `runIf(distExists)`.
 * In the normal gate `npm run test` runs BEFORE `npm run build`, so dist/ is
 * absent and those three chunk-isolation assertions silently NO-OP — the
 * contract counts green having verified nothing. The fix is twofold:
 *   1. CI runs this file again AFTER the build with VERIFY_DIST=1 set (see the
 *      "Verify vendor-pdf lazy chunk (post-build)" step in ci.yml).
 *   2. When VERIFY_DIST=1, a missing dist/ is a HARD FAILURE here (the guard
 *      `describe` below), so a post-build run can never be vacuously skipped.
 * Without the flag (the pre-build unit pass) the dist/ suite skips quietly as
 * before — the source-level contract still runs and carries the floor.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
// Set by the CI post-build step. When true, dist/ MUST exist — a skipped dist/
// suite in the post-build context is a green-on-nothing bug, not a no-op.
const requireDist = process.env.VERIFY_DIST === '1';

describe.runIf(requireDist)('Tier 9.7 — vendor-pdf dist verification is not vacuously skipped', () => {
  it('dist/ + dist/assets exist when VERIFY_DIST=1 (post-build run must verify, not skip)', () => {
    expect(distExists, 'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first; a skipped post-build chunk contract is green-on-nothing').toBe(true);
  });
});

describe.runIf(distExists)('Tier 9.7 — vendor-pdf lazy load contract', () => {
  // ── Chunk isolation ─────────────────────────────────────────────────────
  it('vendor-pdf is its own chunk in dist/assets/', () => {
    const files = readdirSync(assetsDir);
    const vendorPdfFiles = files.filter(f => /^vendor-pdf-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(vendorPdfFiles.length).toBeGreaterThan(0);
  });

  it('vendor-pdf chunk is large (would dominate initial bundle if eagerly loaded)', () => {
    const files = readdirSync(assetsDir);
    const vendorPdf = files.find(f => /^vendor-pdf-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(vendorPdf).toBeDefined();
    const size = statSync(join(assetsDir, vendorPdf)).size;
    // Asserts the chunk is meaningfully large (>500 KB) — if it shrinks
    // dramatically, something is wrong (e.g. PDF code merged into a
    // hot chunk). Asserts the upper bound (<3 MB) too — runaway growth
    // means a new dep snuck in.
    expect(size).toBeGreaterThan(500_000);
    expect(size).toBeLessThan(3_000_000);
  });

  // ── modulePreload filter ────────────────────────────────────────────────
  it('index.html does NOT preload vendor-pdf', () => {
    const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
    // We allow vendor-pdf to be REFERENCED via <link rel="modulepreload">
    // for the entry chunk if it had to be there, but the filter should
    // prevent that. Direct check: vendor-pdf must not appear in a
    // modulepreload link.
    const preloadRe = /<link\s+rel="modulepreload"[^>]*href="[^"]*vendor-pdf[^"]*"/g;
    const matches = html.match(preloadRe) || [];
    expect(matches).toHaveLength(0);
  });

  // Vite's mapDeps system registers EVERY lazy-import target's chunk
  // filename in the entry chunk so the runtime knows what to fetch
  // when an import() resolves. The reference is metadata, not an
  // eager load — that's what makes lazy splitting work. So we do NOT
  // check that vendor-pdf is absent from the entry chunk string;
  // the meaningful check is the modulepreload filter (above).
});

// ── Source-level lazy-import contract ───────────────────────────────────────
// Runs without dist/. Asserts that the components that trigger a PDF
// export use dynamic import() rather than a top-level static import,
// so the lazy chain stays intact through source-level refactors.

describe('Tier 9.7 — source uses dynamic import for PDF generation', () => {
  const lazyConsumers = [
    'src/components/SettlementDetail.jsx',
    'src/components/SingleDossierSuccessPage.jsx',
  ];

  for (const file of lazyConsumers) {
    it(`${file} uses dynamic import('.../generateSettlementPDF.js')`, () => {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8');
      // Must contain a dynamic import targeting the PDF generator.
      expect(source).toMatch(/import\(['"][^'"]*generateSettlementPDF[^'"]*['"]\)/);
      // Must NOT have a top-level static import of @react-pdf/renderer
      // (that would force the chunk into the consumer's chunk graph).
      expect(source).not.toMatch(/^import\s.*from\s+['"]@react-pdf\/renderer['"]/m);
    });
  }
});
