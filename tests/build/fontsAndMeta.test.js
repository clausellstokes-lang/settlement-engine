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
 *      dropped TTF would 404 the font and silently fall back to a system face
 *      (or nothing, mid-swap). The gate resolves every url('/fonts/…') in
 *      index.css against public/fonts and fails if the file is missing.
 *
 *   3. The landing carries a complete Open Graph / Twitter unfurl set, and the
 *      og:image is a fully-qualified URL (scrapers reject root-relative image
 *      paths — an unfurl with a broken image is worse than one gap).
 *
 * Source of truth is the real files (index.html + src/index.css), so the gate
 * tracks the app automatically.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = process.cwd();
const html = readFileSync(resolve(ROOT, 'index.html'), 'utf-8');
const css = readFileSync(resolve(ROOT, 'src', 'index.css'), 'utf-8');

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

  it('preloads the two critical faces (body regular + serif bold) and both exist', () => {
    expect(preloadFontUrls).toContain('/fonts/Nunito-Regular.ttf');
    expect(preloadFontUrls).toContain('/fonts/Lora-Bold.ttf');
    for (const url of preloadFontUrls) {
      const disk = resolve(ROOT, 'public', url.replace(/^\//, ''));
      expect(existsSync(disk), `preloaded font missing: ${url}`).toBe(true);
      // A preloaded-but-never-used font warns in the console + wastes bandwidth.
      expect(css.includes(url), `${url} is preloaded but not referenced by any @font-face`).toBe(true);
    }
  });

  // ── 3. Open Graph / Twitter unfurl set ────────────────────────────────────
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
