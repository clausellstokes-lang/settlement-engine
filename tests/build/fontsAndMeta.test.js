/**
 * tests/build/fontsAndMeta.test.js — the self-hosted-fonts + social-unfurl gate.
 *
 * Two regressions this pins, both invisible until a user (or a link scraper)
 * hits production:
 *
 *   1. NO third-party font origin. The landing used to render-block on a
 *      fonts.googleapis.com <link rel="stylesheet"> (+ a gstatic round-trip).
 *      That was replaced by self-hosted @font-face (src/index.css) serving the
 *      TTFs in public/fonts. If anyone re-adds a Google Fonts link, the page
 *      goes back to blocking on a third-party origin — caught here.
 *
 *   2. Every @font-face points at a file that actually SHIPS. A renamed or
 *      dropped font file would 404 and silently fall back to a system face
 *      (or nothing, mid-swap). The gate resolves every url('/fonts/…') in
 *      index.css against public/fonts and fails if the file is missing.
 *
 *   3. The BROWSER is served WOFF2 only (~65% smaller than the source TTFs);
 *      the TTFs still ship because @react-pdf's fontkit can't consume WOFF2 —
 *      src/pdf/theme.js registers the .ttf URLs for the export path. Both
 *      halves are pinned: every @font-face/preload src must be .woff2, every
 *      Font.register src in theme.js must be a .ttf that exists on disk, and
 *      the WOFF2 payload is under a byte RATCHET (shrink-only — re-measure
 *      and lower it when fonts get subset/lighter; never raise it to make a
 *      red build pass).
 *
 *   4. The landing carries a complete Open Graph / Twitter unfurl set, and the
 *      og:image is a fully-qualified URL (scrapers reject root-relative image
 *      paths — an unfurl with a broken image is worse than one gap).
 *
 * Source of truth is the real files (index.html + src/index.css +
 * src/pdf/theme.js + public/fonts), so the gate tracks the app automatically.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const html = readFileSync(resolve(ROOT, 'index.html'), 'utf-8');
const css = readFileSync(resolve(ROOT, 'src', 'index.css'), 'utf-8');
const pdfTheme = readFileSync(resolve(ROOT, 'src', 'pdf', 'theme.js'), 'utf-8');

describe('self-hosted fonts + social meta (build gate)', () => {
  // ── 1. no third-party font origin ─────────────────────────────────────────
  it('index.html references NO Google Fonts origin (no render-blocking third party)', () => {
    expect(html).not.toMatch(/fonts\.googleapis\.com/i);
    expect(html).not.toMatch(/fonts\.gstatic\.com/i);
  });

  it('src/index.css references NO Google Fonts origin', () => {
    expect(css).not.toMatch(/fonts\.googleapis\.com/i);
    expect(css).not.toMatch(/fonts\.gstatic\.com/i);
  });

  // ── 2. every declared / preloaded font file exists on disk ────────────────
  const cssFontUrls = [...css.matchAll(/url\(\s*['"]?(\/fonts\/[^'")?]+)/g)].map(m => m[1]);
  const preloadFontUrls = [...html.matchAll(/rel="preload"[^>]*href="(\/fonts\/[^"?]+)"/g)].map(m => m[1]);

  it('declares at least the self-hosted families (Nunito sans + Lora/Crimson serif)', () => {
    expect(css).toMatch(/@font-face/);
    expect(css).toMatch(/font-family:\s*'Nunito'/);
    expect(css).toMatch(/font-family:\s*'Lora'/);
    // The design token asks for 'Crimson Text'; it must resolve to a real face
    // (aliased to Lora) rather than the Georgia system fallback.
    expect(css).toMatch(/font-family:\s*'Crimson Text'/);
    // font-display: swap on EVERY face — no invisible-text (FOIT) frame. Each
    // real face has exactly one src url + one swap declaration, so the swap
    // count must equal the number of self-hosted font URLs (this ignores any
    // "@font-face" the header comment happens to mention).
    const swapCount = (css.match(/font-display:\s*swap/g) || []).length;
    expect(cssFontUrls.length).toBeGreaterThanOrEqual(4);
    expect(swapCount).toBe(cssFontUrls.length);
  });

  it('every @font-face src file in index.css exists in public/fonts', () => {
    for (const url of cssFontUrls) {
      const disk = resolve(ROOT, 'public', url.replace(/^\//, ''));
      expect(existsSync(disk), `missing font asset for ${url}`).toBe(true);
    }
  });

  // ── 3a. browser gets WOFF2, never TTF ─────────────────────────────────────
  // WOFF2 is ~65% smaller (Lora/Nunito: ~125–135 KB TTF → ~42–49 KB). Every
  // supported browser reads it, so a TTF (or a TTF fallback line) in the
  // browser-facing CSS is pure regression — the heavy bytes belong to the
  // PDF path only.
  it('every @font-face src in index.css is WOFF2 (browser never fetches a TTF)', () => {
    expect(cssFontUrls.length).toBeGreaterThanOrEqual(4);
    for (const url of cssFontUrls) {
      expect(url, `@font-face serves non-woff2 asset ${url}`).toMatch(/\.woff2$/);
    }
    expect(css).not.toMatch(/format\(\s*['"]truetype['"]\s*\)/);
  });

  it('preloads the two critical faces (body regular + serif bold) as WOFF2 and both exist', () => {
    expect(preloadFontUrls).toContain('/fonts/Nunito-Regular.woff2');
    expect(preloadFontUrls).toContain('/fonts/Lora-Bold.woff2');
    for (const url of preloadFontUrls) {
      expect(url, `preload fetches non-woff2 font ${url}`).toMatch(/\.woff2$/);
      const disk = resolve(ROOT, 'public', url.replace(/^\//, ''));
      expect(existsSync(disk), `preloaded font missing: ${url}`).toBe(true);
      // A preloaded-but-never-used font warns in the console + wastes bandwidth.
      // (Format must ALSO match the @font-face src — a .ttf preload next to a
      // .woff2 face is a discarded preload plus a second fetch.)
      expect(css.includes(url), `${url} is preloaded but not referenced by any @font-face`).toBe(true);
    }
  });

  // ── 3b. the PDF path keeps its TTFs ───────────────────────────────────────
  // @react-pdf registers fonts through fontkit, which opens TTF — not WOFF2
  // (brotli-compressed tables). theme.js must keep registering .ttf sources,
  // and every one of them must ship. If someone "cleans up" the TTFs after
  // seeing the browser use WOFF2, PDF export breaks silently in prod.
  const pdfFontUrls = [...pdfTheme.matchAll(/src:\s*['"](\/fonts\/[^'"?]+)/g)].map(m => m[1]);

  it('src/pdf/theme.js registers TTF sources (fontkit cannot consume WOFF2) and all exist', () => {
    expect(pdfFontUrls.length).toBeGreaterThanOrEqual(8); // Lora ×4 + Nunito ×4
    for (const url of pdfFontUrls) {
      expect(url, `PDF Font.register src ${url} must stay .ttf`).toMatch(/\.ttf$/);
      const disk = resolve(ROOT, 'public', url.replace(/^\//, ''));
      expect(existsSync(disk), `PDF font missing on disk: ${url}`).toBe(true);
    }
  });

  // ── 3c. WOFF2 byte ratchets (shrink-only) ─────────────────────────────────
  // Measured 2026-07-09 (fontTools 4.60 + brotli 1.2 conversion of the
  // ligature-stripped v2 TTFs):
  //   preload pair (Nunito-Regular + Lora-Bold):  88,160 bytes
  //   all 8 woff2 faces:                          361,736 bytes  (TTFs: 1,033,344)
  // Ceilings are measured + ~5%. Like the first-paint closure budget, these
  // only ever move DOWN (e.g. after glyph subsetting) — a failure here means
  // a font was re-cut heavier or a non-woff2 payload crept into the set.
  const PRELOAD_BUDGET_BYTES = 92_000;
  const ALL_WOFF2_BUDGET_BYTES = 380_000;

  it(`critical preloaded font bytes stay under ${PRELOAD_BUDGET_BYTES}`, () => {
    const total = preloadFontUrls
      .map(url => statSync(resolve(ROOT, 'public', url.replace(/^\//, ''))).size)
      .reduce((a, b) => a + b, 0);
    expect(total, `preloaded fonts = ${total} bytes`).toBeLessThanOrEqual(PRELOAD_BUDGET_BYTES);
  });

  it(`total WOFF2 payload stays under ${ALL_WOFF2_BUDGET_BYTES} and each face beats its TTF`, () => {
    const unique = [...new Set(cssFontUrls)];
    let total = 0;
    for (const url of unique) {
      const woff2Path = resolve(ROOT, 'public', url.replace(/^\//, ''));
      const size = statSync(woff2Path).size;
      total += size;
      // Each woff2 must be meaningfully smaller than its TTF sibling — a
      // "woff2" that isn't is a mislabeled or uncompressed re-cut.
      const ttfPath = woff2Path.replace(/\.woff2$/, '.ttf');
      if (existsSync(ttfPath)) {
        expect(size, `${url} is not smaller than its TTF`).toBeLessThan(statSync(ttfPath).size);
      }
    }
    expect(total, `woff2 total = ${total} bytes`).toBeLessThanOrEqual(ALL_WOFF2_BUDGET_BYTES);
  });

  // ── 4. Open Graph / Twitter unfurl set ────────────────────────────────────
  const ogTag = (prop) =>
    new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]+)"`, 'i').exec(html)?.[1];
  const twTag = (name) =>
    new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]+)"`, 'i').exec(html)?.[1];

  it('carries the required Open Graph tags', () => {
    for (const prop of ['og:title', 'og:description', 'og:type', 'og:image', 'og:url']) {
      expect(ogTag(prop), `missing ${prop}`).toBeTruthy();
    }
    expect(ogTag('og:type')).toBe('website');
  });

  it('og:image is a fully-qualified URL to a painting that ships', () => {
    const img = ogTag('og:image');
    expect(img).toMatch(/^https?:\/\//);
    const path = img.replace(/^https?:\/\/[^/]+/, ''); // strip origin → /backgrounds/create.jpg
    expect(existsSync(resolve(ROOT, 'public', path.replace(/^\//, ''))), `og:image asset ${path} not on disk`).toBe(true);
  });

  it('carries the Twitter summary-large-image card', () => {
    expect(twTag('twitter:card')).toBe('summary_large_image');
    expect(twTag('twitter:image')).toMatch(/^https?:\/\//);
  });
});
