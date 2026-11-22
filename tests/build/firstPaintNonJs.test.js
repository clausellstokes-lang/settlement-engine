/**
 * firstPaintNonJs.test.js — the NON-JS first-paint budget (C5 bar-5: "budgets are
 * laws in bytes" must cover every render-blocking term, not just the JS closure).
 *
 * vendorPdfLazy.test.js budgets the entry's transitive static JS closure — but the
 * browser also blocks first paint on the stylesheet and races it with the preloaded
 * fonts, and none of those bytes were budgeted: a CSS or font regression could grow
 * the real first-paint payload while the JS-only ratchet stayed green (vite's
 * chunkSizeWarningLimit is a warning, not a gate). This file gives the non-JS terms
 * the same monotone ratchet discipline.
 *
 * MEASURED at landing (2026-07-21, `npm run build` on this lineage):
 *   index.html                       8,016 B   (budget 8,600)
 *   render-blocking CSS             19,341 B   (one sheet; budget 19,800)
 *   preloaded fonts                 88,160 B   (Nunito-Regular 42,124 +
 *                                              Lora-Bold 46,036; budget 90,000)
 * Budgets = measured + a small working margin (hash-name/meta jitter); monotone
 * ratchet: DOWN only, never up without a deliberate, documented owner-approved
 * reason. Loading-journey video/media are lazy by design and asserted NEVER
 * render-blocking below (absence checks), not byte-budgeted.
 *
 * STALE-DIST POLICY (mirrors vendorPdfLazy.test.js): byte reads (SIZE/BUDGET) are
 * VERIFY_DIST-gated so they only measure the fresh post-build dist; ABSENCE checks
 * stay runIf(distExists)-ungated (a stale dist can only under-report absence).
 * The unconditional VERIFY_DIST anti-vacuity guard in vendorPdfLazy.test.js covers
 * this file's gated halves too (same tests/build/ post-build re-run).
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const distExists = existsSync(distDir) && existsSync(join(distDir, 'assets'));
const requireDistRead = process.env.VERIFY_DIST === '1';

const HTML_BUDGET_BYTES = 8_600;
const CSS_BUDGET_BYTES = 19_800;
const FONT_PRELOAD_BUDGET_BYTES = 90_000;

// The two faces the first paint actually needs (index.html's own contract). A
// THIRD preload is a deliberate act: it grows every cold load — extend this pin
// and the budget consciously or load the face lazily via @font-face discovery.
const PINNED_FONT_PRELOADS = Object.freeze(['Nunito-Regular.woff2', 'Lora-Bold.woff2']);

const readHtml = () => readFileSync(join(distDir, 'index.html'), 'utf-8');

/** Every render-blocking stylesheet href in the built entry document. */
function stylesheetHrefs(html) {
  return [...html.matchAll(/<link\s[^>]*rel="stylesheet"[^>]*>/g)]
    .map(([tag]) => tag.match(/href="([^"]+)"/)?.[1])
    .filter(Boolean);
}

/** Every preloaded font href in the built entry document. */
function fontPreloadHrefs(html) {
  return [...html.matchAll(/<link\s[^>]*rel="preload"[^>]*>/g)]
    .filter(([tag]) => /as="font"/.test(tag))
    .map(([tag]) => tag.match(/href="([^"]+)"/)?.[1])
    .filter(Boolean);
}

describe.runIf(distExists)('first-paint non-JS budget (bar-5, the render-blocking terms)', () => {
  // ── Byte budgets (VERIFY_DIST-gated: fresh-build reads only) ───────────────
  it.skipIf(!requireDistRead)(`index.html stays under ${HTML_BUDGET_BYTES} B`, () => {
    const size = statSync(join(distDir, 'index.html')).size;
    expect(size, `dist/index.html = ${size} B (budget ${HTML_BUDGET_BYTES})`).toBeLessThanOrEqual(HTML_BUDGET_BYTES);
  });

  it.skipIf(!requireDistRead)(`render-blocking CSS stays under ${CSS_BUDGET_BYTES} B total`, () => {
    const hrefs = stylesheetHrefs(readHtml());
    expect(hrefs.length, 'entry document lost its stylesheet — the budget would be vacuous').toBeGreaterThan(0);
    let total = 0;
    const lines = [];
    for (const href of hrefs) {
      const size = statSync(join(distDir, href.replace(/^\//, ''))).size;
      total += size;
      lines.push(`  ${String(size).padStart(8)}  ${href}`);
    }
    expect(
      total,
      `render-blocking CSS = ${total} B (budget ${CSS_BUDGET_BYTES}):\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(CSS_BUDGET_BYTES);
  });

  it.skipIf(!requireDistRead)(`preloaded font bytes stay under ${FONT_PRELOAD_BUDGET_BYTES} B total`, () => {
    const hrefs = fontPreloadHrefs(readHtml());
    let total = 0;
    const lines = [];
    for (const href of hrefs) {
      const size = statSync(join(distDir, href.replace(/^\//, ''))).size;
      total += size;
      lines.push(`  ${String(size).padStart(8)}  ${href}`);
    }
    expect(
      total,
      `preloaded font payload = ${total} B (budget ${FONT_PRELOAD_BUDGET_BYTES}):\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(FONT_PRELOAD_BUDGET_BYTES);
  });

  // ── Structural pins (ungated absence/shape checks) ─────────────────────────
  it('exactly ONE render-blocking stylesheet (a second sheet is a deliberate, budgeted act)', () => {
    expect(stylesheetHrefs(readHtml())).toHaveLength(1);
  });

  it('font preloads are exactly the pinned first-paint faces', () => {
    const names = fontPreloadHrefs(readHtml()).map((h) => h.split('/').pop()).sort();
    expect(names).toEqual([...PINNED_FONT_PRELOADS].sort());
  });

  it('no off-origin render-blocking stylesheet (the Google-Fonts-CDN regression stays dead)', () => {
    for (const href of stylesheetHrefs(readHtml())) {
      expect(href.startsWith('http'), `off-origin blocking stylesheet: ${href}`).toBe(false);
    }
  });

  it('the built CSS contains no @import (a hidden second render-blocking fetch)', () => {
    for (const href of stylesheetHrefs(readHtml())) {
      const css = readFileSync(join(distDir, href.replace(/^\//, '')), 'utf-8');
      expect(css.includes('@import'), `${href} carries an @import chain`).toBe(false);
    }
  });

  it('no media file is preloaded by the entry document (loading journeys stay lazy)', () => {
    const html = readHtml();
    expect(html).not.toMatch(/<link\s[^>]*rel="preload"[^>]*as="(?:video|audio|image)"/);
    expect(html).not.toMatch(/<link\s[^>]*rel="preload"[^>]*href="[^"]*\.(?:mp4|webm|ogg)"/);
  });
});
