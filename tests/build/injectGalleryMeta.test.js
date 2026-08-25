/**
 * injectGalleryMeta.test.js — the per-slug gallery prerender injector (Wave 4h).
 *
 * Pins the PURE half of the /gallery/:slug unfurl (api/_galleryMeta.js): the meta
 * builder and the HTML injector. The I/O shell (api/gallery-meta.js — Supabase +
 * index.html fetch) is intentionally out of scope here; this proves the transforms
 * a scraper actually consumes.
 */
import { describe, test, expect } from 'vitest';
import {
  buildGalleryMeta,
  injectGalleryMeta,
  galleryCardImage,
  ORIGIN,
  SITE_NAME,
} from '../../api/_galleryMeta.js';

const SUPA = 'https://proj.supabase.co';

// A representative slice of index.html — property-before-content order, the real one.
const SAMPLE_HTML = `<!doctype html>
<html>
  <head>
    <title>SettlementForge</title>
    <meta name="description" content="Default description." />
    <meta property="og:site_name" content="SettlementForge" />
    <meta property="og:title" content="SettlementForge — default" />
    <meta property="og:description" content="Default og description." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://settlementforge.com/" />
    <meta property="og:image" content="https://settlementforge.com/og-default.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="SettlementForge — default" />
    <meta name="twitter:description" content="Default og description." />
    <meta name="twitter:image" content="https://settlementforge.com/og-default.png" />
  </head>
  <body><div id="root"></div></body>
</html>`;

describe('buildGalleryMeta', () => {
  test('upgrades to the real name + coarse facts when a dossier row is present', () => {
    const meta = buildGalleryMeta(
      'oakmere',
      { name: 'Oakmere', tier: 'town', settlement: { population: 8200, config: { terrain: 'river_valley' } } },
      { origin: ORIGIN, supabaseUrl: SUPA },
    );
    expect(meta.title).toBe(`Oakmere · ${SITE_NAME}`);
    expect(meta.description).toContain('Oakmere');
    expect(meta.description).toContain('a town');
    expect(meta.description).toContain('river valley');
    // en-US grouped, device-stable.
    expect(meta.description).toContain('8,200');
    expect(meta.url).toBe(`${ORIGIN}/gallery/oakmere`);
    expect(meta.image).toBe(`${SUPA}/functions/v1/og-image?slug=oakmere`);
    expect(meta.type).toBe('article');
  });

  test('degrades to a generic-but-still-per-slug card when the row is missing', () => {
    const meta = buildGalleryMeta('mystery-slug', null, { origin: ORIGIN, supabaseUrl: SUPA });
    expect(meta.title).toBe(`Shared settlement · ${SITE_NAME}`);
    expect(meta.description).toMatch(/living settlement/i);
    // URL + image stay per-slug even without a DB row.
    expect(meta.url).toBe(`${ORIGIN}/gallery/mystery-slug`);
    expect(meta.image).toBe(`${SUPA}/functions/v1/og-image?slug=mystery-slug`);
  });

  test('card image falls back to the static default without a supabase origin', () => {
    expect(galleryCardImage('slug', '')).toBe(`${ORIGIN}/og-default.png`);
    expect(galleryCardImage('', SUPA)).toBe(`${ORIGIN}/og-default.png`);
  });

  test('slug is URL-encoded in the canonical', () => {
    const meta = buildGalleryMeta('a b/c', null, { origin: ORIGIN });
    expect(meta.url).toBe(`${ORIGIN}/gallery/a%20b%2Fc`);
  });
});

describe('injectGalleryMeta', () => {
  const meta = {
    title: 'Oakmere · SettlementForge',
    description: 'Oakmere, a town. Living settlement.',
    image: `${SUPA}/functions/v1/og-image?slug=oakmere`,
    url: `${ORIGIN}/gallery/oakmere`,
    type: 'article',
  };

  test('rewrites the document title', () => {
    expect(injectGalleryMeta(SAMPLE_HTML, meta)).toContain('<title>Oakmere · SettlementForge</title>');
  });

  test('rewrites og: + twitter: title/description/image and og:url/og:type', () => {
    const out = injectGalleryMeta(SAMPLE_HTML, meta);
    expect(out).toContain('<meta property="og:title" content="Oakmere · SettlementForge" />');
    expect(out).toContain('<meta name="twitter:title" content="Oakmere · SettlementForge" />');
    expect(out).toContain('<meta property="og:description" content="Oakmere, a town. Living settlement." />');
    expect(out).toContain('<meta name="twitter:description" content="Oakmere, a town. Living settlement." />');
    expect(out).toContain(`<meta property="og:image" content="${SUPA}/functions/v1/og-image?slug=oakmere" />`);
    expect(out).toContain(`<meta name="twitter:image" content="${SUPA}/functions/v1/og-image?slug=oakmere" />`);
    expect(out).toContain(`<meta property="og:url" content="${ORIGIN}/gallery/oakmere" />`);
    expect(out).toContain('<meta property="og:type" content="article" />');
    // The plain description meta upgrades too.
    expect(out).toContain('<meta name="description" content="Oakmere, a town. Living settlement." />');
  });

  test('leaves the default og:image untouched once overwritten (no stale default remains)', () => {
    const out = injectGalleryMeta(SAMPLE_HTML, meta);
    expect(out).not.toContain('<meta property="og:image" content="https://settlementforge.com/og-default.png" />');
    // og:site_name (not targeted) is preserved.
    expect(out).toContain('<meta property="og:site_name" content="SettlementForge" />');
  });

  test('escapes HTML-significant characters in injected values', () => {
    const out = injectGalleryMeta(SAMPLE_HTML, {
      title: 'A & B <script>',
      description: 'has "quotes" & <tags>',
    });
    expect(out).toContain('<title>A &amp; B &lt;script&gt;</title>');
    expect(out).toContain('content="A &amp; B &lt;script&gt;"'); // og:title attr
    expect(out).toContain('content="has &quot;quotes&quot; &amp; &lt;tags&gt;"');
    // no raw injection escaped through
    expect(out).not.toContain('<script>');
  });

  test('inserts a missing tag before </head> rather than dropping it', () => {
    const noOgUrl = SAMPLE_HTML.replace(/\s*<meta property="og:url"[^>]*>/, '');
    const out = injectGalleryMeta(noOgUrl, { url: `${ORIGIN}/gallery/x` });
    expect(out).toContain(`<meta property="og:url" content="${ORIGIN}/gallery/x" />`);
    expect(out.indexOf('og:url')).toBeLessThan(out.indexOf('</head>'));
  });

  test('is a no-op for empty meta / non-string html', () => {
    expect(injectGalleryMeta(SAMPLE_HTML, null)).toBe(SAMPLE_HTML);
    expect(injectGalleryMeta(SAMPLE_HTML, {})).toBe(SAMPLE_HTML);
    expect(injectGalleryMeta(undefined, meta)).toBe(undefined);
  });
});
