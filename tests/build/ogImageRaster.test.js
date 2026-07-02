/**
 * tests/build/ogImageRaster.test.js — the social-unfurl image must be a raster.
 *
 * index.html's og:image / twitter:image are what Facebook, X/Twitter, LinkedIn,
 * Slack, Discord et al. fetch to build the link-preview card. Those crawlers do
 * NOT rasterize SVG — an SVG og:image ships every site-wide unfurl with a blank
 * card. The images must point at a PNG/JPG that actually exists in public/ at the
 * declared 1200×630, and the type hint (when present) must agree.
 *
 * A regression that swaps the raster back to og-default.svg (or points at a
 * missing/oddly-sized file) turns this RED.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');

/** Pull the content="…" of the first matching meta tag by property/name. */
function metaContent(attr, key) {
  const re = new RegExp(
    `<meta\\s+${attr}=["']${key}["']\\s+content=["']([^"']+)["']`,
    'i',
  );
  return html.match(re)?.[1] ?? null;
}

/** The 8-byte PNG signature: \x89 P N G \r \n \x1a \n. */
function isPng(buf) {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return sig.every((b, i) => buf[i] === b);
}

const RASTER = /\.(png|jpe?g|webp)$/i;

describe('social-unfurl image is a raster crawlers can render', () => {
  it('og:image points at a raster, not an SVG', () => {
    const src = metaContent('property', 'og:image');
    expect(src, 'og:image meta tag present').toBeTruthy();
    expect(src, `og:image must be a raster, got ${src}`).toMatch(RASTER);
    expect(src, 'og:image must not be an SVG').not.toMatch(/\.svg(\?|#|$)/i);
  });

  it('twitter:image points at a raster, not an SVG', () => {
    const src = metaContent('name', 'twitter:image');
    expect(src, 'twitter:image meta tag present').toBeTruthy();
    expect(src, `twitter:image must be a raster, got ${src}`).toMatch(RASTER);
    expect(src).not.toMatch(/\.svg(\?|#|$)/i);
  });

  it('the referenced og:image file exists in public/ and is a real PNG', () => {
    const src = metaContent('property', 'og:image');
    const basename = src.split('/').pop();
    const buf = readFileSync(join(ROOT, 'public', basename));
    expect(isPng(buf), `${basename} must be a real PNG (magic bytes)`).toBe(true);
  });

  it('declared og:image dimensions are the 1200×630 large-card size', () => {
    expect(metaContent('property', 'og:image:width')).toBe('1200');
    expect(metaContent('property', 'og:image:height')).toBe('630');
  });

  it('og:image:type, when declared, agrees with the PNG extension', () => {
    const type = metaContent('property', 'og:image:type');
    if (type !== null) {
      const src = metaContent('property', 'og:image');
      expect(type).toBe('image/png');
      expect(src).toMatch(/\.png$/i);
    }
  });
});
